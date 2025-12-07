import { NextRequest, NextResponse } from 'next/server';
import { mollieClient, PLANS, PlanType } from '@/lib/mollie';
import { createServerClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const paymentId = formData.get('id') as string;

    if (!paymentId) {
      return NextResponse.json({ error: 'No payment ID' }, { status: 400 });
    }

    const payment = await mollieClient.payments.get(paymentId);
    const supabase = createServerClient();
    const metadata = payment.metadata as { userId: string; plan: PlanType; type: string };

    // Update payment status in database
    await supabase
      .from('payments')
      .update({
        status: payment.status,
        paid_at: payment.paidAt || null,
      })
      .eq('mollie_payment_id', paymentId);

    // Handle successful first payment - create subscription
    if (payment.status === 'paid' && metadata.type === 'subscription_setup') {
      const { userId, plan } = metadata;
      const planConfig = PLANS[plan];

      // Create the actual recurring subscription in Mollie
      const subscription = await mollieClient.customerSubscriptions.create({
        customerId: payment.customerId!,
        amount: {
          currency: planConfig.currency,
          value: planConfig.amount,
        },
        interval: planConfig.interval,
        description: planConfig.description,
        webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/mollie/webhook`,
        metadata: {
          userId,
          plan,
        },
      });

      // Update subscription record
      await supabase
        .from('subscriptions')
        .update({
          mollie_subscription_id: subscription.id,
          status: 'active',
          current_period_start: new Date().toISOString(),
          current_period_end: subscription.nextPaymentDate || null,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .eq('status', 'pending');

      // Update user's subscription tier
      await supabase
        .from('profiles')
        .update({
          subscription_tier: plan,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);
    }

    // Handle recurring payment
    if (payment.status === 'paid' && payment.sequenceType === 'recurring') {
      const { userId, plan } = metadata;

      // Update subscription period
      await supabase
        .from('subscriptions')
        .update({
          current_period_start: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .eq('plan', plan)
        .eq('status', 'active');
    }

    // Handle failed payment
    if (payment.status === 'failed' || payment.status === 'canceled' || payment.status === 'expired') {
      const { userId } = metadata;

      // If it was a setup payment that failed, remove pending subscription
      if (metadata.type === 'subscription_setup') {
        await supabase
          .from('subscriptions')
          .delete()
          .eq('user_id', userId)
          .eq('status', 'pending');
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
