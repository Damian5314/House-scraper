import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY!;
const resendApiKey = process.env.RESEND_API_KEY!;
const newsletterApiKey = process.env.NEWSLETTER_API_KEY; // Secret key to protect this endpoint
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://woningspotters.nl';

interface NewsArticle {
  title: string;
  excerpt: string;
  category: string;
  url: string;
  image?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Verify API key
    const authHeader = request.headers.get('authorization');
    if (!newsletterApiKey || authHeader !== `Bearer ${newsletterApiKey}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { subject, articles } = await request.json() as {
      subject: string;
      articles: NewsArticle[];
    };

    if (!subject || !articles || articles.length === 0) {
      return NextResponse.json(
        { error: 'Subject and articles are required' },
        { status: 400 }
      );
    }

    // Get all active subscribers
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { data: subscribers, error: fetchError } = await supabase
      .from('newsletter_subscribers')
      .select('email')
      .eq('is_active', true);

    if (fetchError || !subscribers) {
      console.error('Failed to fetch subscribers:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch subscribers' },
        { status: 500 }
      );
    }

    if (subscribers.length === 0) {
      return NextResponse.json({ sent: 0, message: 'No active subscribers' });
    }

    const resend = new Resend(resendApiKey);

    // Generate articles HTML
    const articlesHtml = articles.map((article) => `
      <tr>
        <td style="padding: 16px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              ${article.image ? `
              <td width="120" style="padding-right: 16px; vertical-align: top;">
                <img src="${article.image}" alt="${article.title}" width="120" height="80" style="border-radius: 8px; object-fit: cover;">
              </td>
              ` : ''}
              <td style="vertical-align: top;">
                <span style="display: inline-block; padding: 2px 8px; background: rgba(255,122,0,0.2); color: #FF7A00; font-size: 11px; border-radius: 4px; margin-bottom: 6px;">
                  ${article.category}
                </span>
                <h3 style="color: #ffffff; font-size: 16px; margin: 0 0 6px; line-height: 1.3;">
                  <a href="${article.url}" style="color: #ffffff; text-decoration: none;">
                    ${article.title}
                  </a>
                </h3>
                <p style="color: rgba(255,255,255,0.6); font-size: 13px; margin: 0; line-height: 1.5;">
                  ${article.excerpt}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `).join('');

    // Send to all subscribers (batch for efficiency)
    const batchSize = 50;
    let sentCount = 0;

    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);

      await Promise.all(
        batch.map(async (subscriber) => {
          try {
            await resend.emails.send({
              from: 'WoningSpotters <nieuws@woningspotters.nl>',
              to: subscriber.email,
              subject: subject,
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
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background: #1a1a2e; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 32px 40px 24px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1);">
              <a href="${siteUrl}" style="text-decoration: none;">
                <img src="${siteUrl}/logo.svg" alt="WoningSpotters" width="48" height="48" style="margin-bottom: 12px;">
              </a>
              <h1 style="color: #ffffff; font-size: 22px; margin: 0;">
                ${subject}
              </h1>
            </td>
          </tr>

          <!-- Articles -->
          <tr>
            <td style="padding: 8px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                ${articlesHtml}
              </table>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding: 24px 40px 32px; text-align: center;">
              <a href="${siteUrl}/nieuws" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #FF7A00 0%, #FF9933 100%); color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 15px;">
                Bekijk alle artikelen
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; text-align: center; border-top: 1px solid rgba(255,255,255,0.1);">
              <p style="color: rgba(255,255,255,0.4); font-size: 12px; margin: 0 0 8px;">
                Je ontvangt deze e-mail omdat je je hebt aangemeld voor de WoningSpotters nieuwsbrief.
              </p>
              <a href="${siteUrl}/api/newsletter/unsubscribe?email=${encodeURIComponent(subscriber.email)}" style="color: #5BA3D0; font-size: 12px; text-decoration: none;">
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
            sentCount++;
          } catch (emailError) {
            console.error(`Failed to send to ${subscriber.email}:`, emailError);
          }
        })
      );
    }

    return NextResponse.json({
      sent: sentCount,
      total: subscribers.length,
    });
  } catch (error) {
    console.error('Newsletter send error:', error);
    return NextResponse.json(
      { error: 'Er ging iets mis bij het versturen.' },
      { status: 500 }
    );
  }
}
