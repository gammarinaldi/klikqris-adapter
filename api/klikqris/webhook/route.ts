import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { PaymentTransaction } from '@/models/PaymentTransaction';
import { activateSubscription } from '@/lib/subscription-helper';
import { klikQris } from '@/lib/klikqris/adapter';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data } = body;

    if (!data || !data.order_id) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const { order_id: orderId, status: paymentStatus, signature } = data;

    console.log('📥 KlikQRIS webhook received', { orderId, paymentStatus });

    await connectDB();

    const transaction = await PaymentTransaction.findOne({ orderId });

    if (!transaction) {
      console.warn('⚠️ Transaction not found', { orderId });
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    // Verify signature using adapter
    if (!klikQris.verifySignature(signature, transaction.qrisSignature)) {
      console.error('🚫 Invalid signature', { orderId });
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Update status
    transaction.transactionStatus = paymentStatus;
    transaction.verified = true;
    transaction.verifiedAt = new Date();
    await transaction.save();

    console.log('✅ Transaction updated', { orderId, paymentStatus });

    // Activate subscription if PAID
    if (paymentStatus === 'PAID' || paymentStatus === 'SUCCESS') {
      if (!transaction.subscriptionActivated) {
        await activateSubscription(transaction);
        console.log('✅ Subscription activated via KlikQRIS webhook', { orderId });
      }
    }

    return NextResponse.json({ message: 'OK' });

  } catch (error: any) {
    console.error('❌ KlikQRIS webhook error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
