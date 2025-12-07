import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { mollieClient } from '@/lib/mollie';

// This endpoint manually activates a subscription after payment
// Used for localhost testing where webhooks don't work
export async function POST(request: NextRequest) {
  try {
    const { userId, plan } = await request.json();

    if (!userId || !plan) {
      return NextResponse.json(
        { error: 'Missing userId or plan' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Get the pending payment to verify it was actually paid
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('mollie_payment_id')
      .eq('user_id', userId)
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (paymentError || !payment) {
      return NextResponse.json(
        { error: 'No pending payment found' },
        { status: 404 }
      );
    }

    // Check payment status with Mollie
    const molliePayment = await mollieClient.payments.get(payment.mollie_payment_id);

    if (molliePayment.status !== 'paid') {
      // Update payment status in database
      await supabase
        .from('payments')
        .update({ status: molliePayment.status })
        .eq('mollie_payment_id', payment.mollie_payment_id);

      return NextResponse.json(
        { error: 'Payment not completed', status: molliePayment.status },
        { status: 400 }
      );
    }

    // Payment is verified as paid, update payment record
    await supabase
      .from('payments')
      .update({ status: 'paid', paid_at: new Date().toISOString() })
      .eq('mollie_payment_id', payment.mollie_payment_id);

    // Update subscription status to active
    const { error: subError } = await supabase
      .from('subscriptions')
      .update({
        status: 'active',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // +30 days
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('plan', plan)
      .eq('status', 'pending');

    if (subError) {
      console.error('Error updating subscription:', subError);
    }

    // Update user's subscription tier
    const { data: updatedProfile, error: profileError } = await supabase
      .from('profiles')
      .update({
        subscription_tier: plan,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select();

    console.log('Profile update result:', { updatedProfile, profileError, userId, plan });

    if (profileError) {
      console.error('Error updating profile:', profileError);
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }

    if (!updatedProfile || updatedProfile.length === 0) {
      console.error('No profile was updated - user may not exist');
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, subscription_tier: plan });
  } catch (error) {
    console.error('Error activating subscription:', error);
    return NextResponse.json(
      { error: 'Failed to activate subscription' },
      { status: 500 }
    );
  }
}
