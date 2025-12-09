import { NextRequest, NextResponse } from 'next/server';
import { sendSubscriptionWelcomeEmail } from '@/lib/subscription-emails';

// DELETE THIS FILE AFTER TESTING!
// Test endpoint: GET /api/test-email?email=your@email.com&plan=pro

export async function GET(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 });
  }

  const email = request.nextUrl.searchParams.get('email');
  const plan = (request.nextUrl.searchParams.get('plan') || 'pro') as 'pro' | 'ultra';

  if (!email) {
    return NextResponse.json({ error: 'Email required: ?email=your@email.com' }, { status: 400 });
  }

  const result = await sendSubscriptionWelcomeEmail({
    to: email,
    plan,
    customerName: 'Test User',
  });

  return NextResponse.json(result);
}
