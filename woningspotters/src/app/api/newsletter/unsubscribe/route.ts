import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY!;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.redirect(new URL('/?error=invalid_email', request.url));
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Deactivate subscription
    await supabase
      .from('newsletter_subscribers')
      .update({ is_active: false })
      .eq('email', email);

    // Redirect to unsubscribe confirmation page
    return NextResponse.redirect(new URL('/uitschrijven/bevestigd', request.url));
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.redirect(new URL('/?error=unsubscribe_failed', request.url));
  }
}
