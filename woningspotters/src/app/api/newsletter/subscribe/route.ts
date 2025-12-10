import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY!;
const resendApiKey = process.env.RESEND_API_KEY;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://woningspotters.nl';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Ongeldig e-mailadres' },
        { status: 400 }
      );
    }

    // Create Supabase admin client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if email already exists
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id, is_active')
      .eq('email', email)
      .single();

    if (existing) {
      if (existing.is_active) {
        return NextResponse.json(
          { error: 'Dit e-mailadres is al aangemeld.' },
          { status: 409 }
        );
      } else {
        // Reactivate subscription
        await supabase
          .from('newsletter_subscribers')
          .update({ is_active: true, subscribed_at: new Date().toISOString() })
          .eq('email', email);
      }
    } else {
      // Insert new subscriber
      const { error: insertError } = await supabase
        .from('newsletter_subscribers')
        .insert({ email });

      if (insertError) {
        console.error('Supabase insert error:', insertError);
        return NextResponse.json(
          { error: 'Er ging iets mis. Probeer het opnieuw.' },
          { status: 500 }
        );
      }
    }

    // Send welcome email with Resend
    if (resendApiKey) {
      const resend = new Resend(resendApiKey);

      await resend.emails.send({
        from: 'WoningSpotters <nieuws@woningspotters.nl>',
        to: email,
        subject: 'Welkom bij de WoningSpotters nieuwsbrief!',
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #1a1a2e;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #1a1a2e; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background: #1a1a2e; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center;">
              <img src="${siteUrl}/logo.svg" alt="WoningSpotters" width="60" height="60" style="margin-bottom: 16px;">
              <h1 style="color: #ffffff; font-size: 28px; margin: 0 0 8px;">Welkom bij WoningSpotters!</h1>
              <p style="color: rgba(255,255,255,0.6); font-size: 16px; margin: 0;">Je bent succesvol aangemeld voor onze nieuwsbrief</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 20px 40px;">
              <p style="color: rgba(255,255,255,0.8); font-size: 15px; line-height: 1.6; margin: 0 0 20px;">
                Bedankt voor je aanmelding! Vanaf nu ontvang je wekelijks het laatste nieuws over de Nederlandse woningmarkt:
              </p>

              <ul style="color: rgba(255,255,255,0.7); font-size: 14px; line-height: 1.8; padding-left: 20px; margin: 0 0 24px;">
                <li>Actuele marktanalyses en prijsontwikkelingen</li>
                <li>Nieuwe regelgeving en wetgeving</li>
                <li>Tips voor kopers en huurders</li>
                <li>Nieuwbouwprojecten in jouw regio</li>
              </ul>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding: 0 40px 30px; text-align: center;">
              <a href="${siteUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #FF7A00 0%, #FF9933 100%); color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 15px;">
                Ga naar WoningSpotters
              </a>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 40px;">
              <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 0;">
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; text-align: center;">
              <p style="color: rgba(255,255,255,0.4); font-size: 12px; margin: 0 0 8px;">
                Je ontvangt deze e-mail omdat je je hebt aangemeld voor de WoningSpotters nieuwsbrief.
              </p>
              <a href="${siteUrl}/uitschrijven?email=${encodeURIComponent(email)}" style="color: #5BA3D0; font-size: 12px; text-decoration: none;">
                Uitschrijven
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    return NextResponse.json(
      { error: 'Er ging iets mis. Probeer het opnieuw.' },
      { status: 500 }
    );
  }
}
