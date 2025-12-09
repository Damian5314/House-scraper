import { Resend } from 'resend';
import { PlanType, PLANS } from './mollie';

const resend = new Resend(process.env.RESEND_API_KEY);
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://woningspotter.com';

interface SendSubscriptionEmailParams {
  to: string;
  plan: PlanType;
  customerName?: string;
}

const PLAN_FEATURES = {
  pro: [
    { icon: '🔍', text: '10 zoekopdrachten per dag' },
    { icon: '🎯', text: 'Alle geavanceerde filters' },
    { icon: '🚫', text: 'Geen advertenties' },
    { icon: '⭐', text: 'Favorieten opslaan' },
    { icon: '📈', text: 'Prijsgeschiedenis inzien' },
    { icon: '📱', text: 'Telegram notificaties' },
  ],
  ultra: [
    { icon: '♾️', text: 'Onbeperkt zoeken - geen limieten!' },
    { icon: '🎯', text: 'Alle geavanceerde filters' },
    { icon: '🚫', text: 'Geen advertenties' },
    { icon: '⭐', text: 'Favorieten opslaan' },
    { icon: '📈', text: 'Prijsgeschiedenis inzien' },
    { icon: '📱', text: 'Telegram notificaties' },
    { icon: '🔌', text: 'API toegang voor integraties' },
    { icon: '📊', text: 'Export naar Excel & CSV' },
    { icon: '🎖️', text: 'Prioriteit support' },
  ],
};

function generateFeaturesHtml(plan: PlanType): string {
  const features = PLAN_FEATURES[plan];
  return features
    .map(
      (f) => `
        <tr>
          <td style="padding: 8px 0; color: rgba(255,255,255,0.85); font-size: 14px; line-height: 1.5;">
            <span style="margin-right: 10px;">${f.icon}</span>${f.text}
          </td>
        </tr>
      `
    )
    .join('');
}

function getWelcomeEmailHtml(plan: PlanType, customerName?: string): string {
  const planConfig = PLANS[plan];
  const greeting = customerName ? `Hoi ${customerName}` : 'Hoi';
  const planBadgeColor = plan === 'ultra' ? '#9333EA' : '#FF7A00';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0f0f1a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f0f1a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background: linear-gradient(180deg, #1a1a2e 0%, #16162a 100%); border-radius: 20px; overflow: hidden; border: 1px solid rgba(255,255,255,0.08);">

          <!-- Header with celebration -->
          <tr>
            <td style="padding: 50px 40px 30px; text-align: center; background: linear-gradient(135deg, rgba(255,122,0,0.15) 0%, rgba(147,51,234,0.15) 100%);">
              <div style="font-size: 48px; margin-bottom: 16px;">🎉</div>
              <img src="${siteUrl}/logo.svg" alt="WoningSpotter" width="50" height="50" style="margin-bottom: 20px;">
              <h1 style="color: #ffffff; font-size: 28px; font-weight: 700; margin: 0 0 12px; letter-spacing: -0.5px;">
                Welkom bij ${planConfig.name}!
              </h1>
              <div style="display: inline-block; padding: 6px 16px; background: ${planBadgeColor}; border-radius: 20px; color: #fff; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                ${planConfig.name} Plan
              </div>
            </td>
          </tr>

          <!-- Personal greeting -->
          <tr>
            <td style="padding: 30px 40px 20px;">
              <p style="color: #ffffff; font-size: 17px; line-height: 1.6; margin: 0;">
                ${greeting},
              </p>
              <p style="color: rgba(255,255,255,0.75); font-size: 15px; line-height: 1.7; margin: 16px 0 0;">
                Bedankt voor je vertrouwen in WoningSpotter! Je ${planConfig.name} abonnement is nu actief en je hebt direct toegang tot alle premium functies.
              </p>
            </td>
          </tr>

          <!-- Features box -->
          <tr>
            <td style="padding: 10px 40px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background: rgba(255,255,255,0.03); border-radius: 16px; border: 1px solid rgba(255,255,255,0.06);">
                <tr>
                  <td style="padding: 24px;">
                    <h2 style="color: #ffffff; font-size: 16px; font-weight: 600; margin: 0 0 16px; text-transform: uppercase; letter-spacing: 0.5px;">
                      ✨ Jouw ${planConfig.name} Voordelen
                    </h2>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      ${generateFeaturesHtml(plan)}
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          ${
            plan === 'ultra'
              ? `
          <!-- Special Ultra message -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, rgba(147,51,234,0.2) 0%, rgba(147,51,234,0.1) 100%); border-radius: 12px; border: 1px solid rgba(147,51,234,0.3);">
                <tr>
                  <td style="padding: 20px;">
                    <p style="color: #ffffff; font-size: 14px; line-height: 1.6; margin: 0;">
                      <strong>🚀 Ultra Tip:</strong> Met je Ultra abonnement kun je <strong>onbeperkt</strong> woningen scrapen en zoeken. Gebruik de API om je eigen integraties te bouwen of exporteer direct naar Excel voor je analyses!
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          `
              : ''
          }

          <!-- CTA Button -->
          <tr>
            <td style="padding: 10px 40px 40px; text-align: center;">
              <a href="${siteUrl}/dashboard" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #FF7A00 0%, #FF9933 100%); color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 20px rgba(255,122,0,0.3);">
                Ga naar je Dashboard →
              </a>
            </td>
          </tr>

          <!-- Subscription details -->
          <tr>
            <td style="padding: 0 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background: rgba(255,255,255,0.02); border-radius: 12px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="color: rgba(255,255,255,0.5); font-size: 13px; margin: 0 0 8px;">
                      <strong style="color: rgba(255,255,255,0.7);">Abonnement:</strong> ${planConfig.description}
                    </p>
                    <p style="color: rgba(255,255,255,0.5); font-size: 13px; margin: 0;">
                      <strong style="color: rgba(255,255,255,0.7);">Prijs:</strong> €${planConfig.amount}/maand
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 30px 40px 0;">
              <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.06); margin: 0;">
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px 30px; text-align: center;">
              <p style="color: rgba(255,255,255,0.4); font-size: 12px; margin: 0 0 12px;">
                Vragen over je abonnement? Neem contact met ons op via
                <a href="mailto:support@woningspotter.com" style="color: #5BA3D0; text-decoration: none;">support@woningspotter.com</a>
              </p>
              <p style="color: rgba(255,255,255,0.3); font-size: 11px; margin: 0;">
                © ${new Date().getFullYear()} WoningSpotter. Alle rechten voorbehouden.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export async function sendSubscriptionWelcomeEmail({
  to,
  plan,
  customerName,
}: SendSubscriptionEmailParams): Promise<{ success: boolean; error?: string }> {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set, skipping subscription email');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const planConfig = PLANS[plan];

    await resend.emails.send({
      from: 'WoningSpotter <noreply@woningspotter.com>',
      to,
      subject: `🎉 Welkom bij WoningSpotter ${planConfig.name}!`,
      html: getWelcomeEmailHtml(plan, customerName),
    });

    console.log(`Subscription welcome email sent to ${to} for plan ${plan}`);
    return { success: true };
  } catch (error) {
    console.error('Failed to send subscription welcome email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
