import { NextRequest, NextResponse } from 'next/server';
import { mollieClient, PLANS, PlanType } from '@/lib/mollie';
import { createServerClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const { plan, userId } = await request.json();

    // Validate plan
    if (!plan || !['pro', 'ultra'].includes(plan)) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    const supabase = createServerClient();
    const planConfig = PLANS[plan as PlanType];

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('email, mollie_customer_id')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    let customerId = profile.mollie_customer_id;

    // Create Mollie customer if not exists
    if (!customerId) {
      const customer = await mollieClient.customers.create({
        email: profile.email,
        metadata: { userId },
      });
      customerId = customer.id;

      // Save customer ID to profile
      await supabase
        .from('profiles')
        .update({ mollie_customer_id: customerId })
        .eq('id', userId);
    }

    // Get the base URL for redirects
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const isLocalhost = baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1');

    // Create payment
    // Note: webhookUrl is omitted for localhost since Mollie can't reach it
    // For test mode without recurring methods, we use 'oneoff' sequence type
    const isTestMode = process.env.MOLLIE_API_KEY?.startsWith('test_');

    const payment = await mollieClient.payments.create({
      amount: {
        currency: planConfig.currency,
        value: planConfig.amount,
      },
      customerId,
      // Use 'first' for live mode (enables recurring), 'oneoff' for test mode
      ...(isTestMode ? {} : { sequenceType: 'first' }),
      description: planConfig.description,
      redirectUrl: `${baseUrl}/payment/success?plan=${plan}`,
      ...(isLocalhost ? {} : { webhookUrl: `${baseUrl}/api/mollie/webhook` }),
      metadata: {
        userId,
        plan,
        type: 'subscription_setup',
      },
    });

    // Create pending subscription record
    await supabase.from('subscriptions').insert({
      user_id: userId,
      mollie_customer_id: customerId,
      plan,
      status: 'pending',
      amount: parseFloat(planConfig.amount),
      interval: planConfig.interval,
    });

    // Create payment record
    await supabase.from('payments').insert({
      user_id: userId,
      mollie_payment_id: payment.id,
      amount: parseFloat(planConfig.amount),
      status: 'open',
      description: planConfig.description,
    });

    return NextResponse.json({
      checkoutUrl: payment.getCheckoutUrl(),
      paymentId: payment.id,
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to create payment: ${errorMessage}` },
      { status: 500 }
    );
  }
}
