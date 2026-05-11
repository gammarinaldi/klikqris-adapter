import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { PaymentTransaction } from '@/models/PaymentTransaction';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
    }

    // 1. Connect to DB
    await connectDB();
    
    // 2. Find transaction in our local database
    // This status is updated automatically by the Webhook at /api/klikqris/webhook
    const transaction = await PaymentTransaction.findOne({ orderId });

    if (!transaction) {
      return NextResponse.json({
        success: false,
        message: 'Transaction not found in local database'
      }, { status: 404 });
    }

    // 3. Return the current status from our database
    return NextResponse.json({
      success: true,
      status: transaction.transactionStatus,
      orderId: transaction.orderId,
      totalAmount: transaction.amount,
      paidAt: transaction.verifiedAt,
      fromLocalDB: true
    });

  } catch (error: any) {
    console.error('❌ KlikQRIS Status API (Local) error:', error.message);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
