import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { validatePrice, getExpectedPrice, type BillingPeriod } from '@/lib/pricing-config';
import { connectDB } from '@/lib/mongodb';
import { PaymentTransaction } from '@/models/PaymentTransaction';
import { User } from '@/models/User';
import axios from 'axios';
import { klikQris } from '@/lib/klikqris/adapter';

export async function POST(request: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { amount, planName, userEmail, billingPeriod = "monthly", isUpgrade = false } = await request.json();

    // Verify user email matches session
    if (userEmail !== session.user.email) {
      return NextResponse.json(
        { error: 'Unauthorized - email mismatch' },
        { status: 403 }
      );
    }

    // Validate required fields
    if (!amount || !planName || !userEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate plan name exists
    const expectedPrice = getExpectedPrice(planName, billingPeriod as BillingPeriod);
    if (expectedPrice === null) {
      return NextResponse.json(
        { error: 'Invalid plan name' },
        { status: 400 }
      );
    }

    // Validate amount matches expected price for the plan
    if (!validatePrice(planName, billingPeriod as BillingPeriod, amount, isUpgrade)) {
      return NextResponse.json(
        {
          error: 'Invalid payment amount',
          message: `The provided amount (${amount}) does not match the expected price (${expectedPrice}) for ${planName} plan.`
        },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Get user ID from database
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Generate unique order ID
    const userIdShort = user._id.toString().substring(0, 8);
    const orderId = `QRIS-${userIdShort}-${Date.now()}`;

    // Store transaction in database
    const paymentTransaction = new PaymentTransaction({
      orderId,
      userId: user._id.toString(),
      userEmail: session.user.email,
      planName,
      amount,
      billingPeriod: billingPeriod as BillingPeriod,
      transactionStatus: 'pending',
      paymentGateway: 'klikqris',
      verified: false,
      subscriptionActivated: false
    });

    await paymentTransaction.save();
    console.log('✅ KlikQRIS Transaction stored in database', { orderId, userEmail: session.user.email });

    // Call KlikQRIS API using the adapter
    const result = await klikQris.createTransaction({
      orderId,
      amount,
      description: `Sahamify ${planName} - ${billingPeriod}`
    });

    if (result.status) {
      const data = result.data;
      
      // Store the signature and update transaction
      paymentTransaction.qrisSignature = data.signature;
      await paymentTransaction.save();

      return NextResponse.json({
        success: true,
        orderId: data.order_id,
        amount: data.amount,
        totalAmount: data.total_amount,
        qrisUrl: data.qris_url,
        expiredAt: data.expired_at,
        directUrl: data.direct_url,
        signature: data.signature
      });
    } else {
      throw new Error(result.message || 'Failed to create KlikQRIS transaction');
    }

  } catch (error: any) {
    console.error('❌ KlikQRIS API error:', error.response?.data || error.message);
    return NextResponse.json(
      { error: 'Failed to create payment transaction', details: error.response?.data || error.message },
      { status: 500 }
    );
  }
}
