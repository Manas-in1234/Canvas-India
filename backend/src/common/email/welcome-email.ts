import type { PrismaClient } from '../../generated/prisma/client.js';

export interface SendWelcomeEmailParams {
  recipientEmail: string;
  recipientName: string;
  roleName: string;
  temporaryPassword: string;
  resendApiKey?: string;
  resendFromEmail?: string;
  prisma: PrismaClient;
}

export interface SendEmailResult {
  sent: boolean;
  error?: string;
  id?: string;
}

export async function sendAdminWelcomeEmail(params: SendWelcomeEmailParams): Promise<SendEmailResult> {
  const {
    recipientEmail,
    recipientName,
    roleName,
    temporaryPassword,
    prisma,
  } = params;

  // 1. Resolve API Key: Environment variable takes precedence, followed by StoreSetting DB table
  let apiKey = params.resendApiKey?.trim();
  if (!apiKey) {
    try {
      const setting = await prisma.storeSetting.findUnique({ where: { key: 'resend_api_key' } });
      if (setting?.value?.trim()) apiKey = setting.value.trim();
    } catch {}
  }

  // 2. Resolve From Email: Environment variable takes precedence, then StoreSetting, then default
  let fromEmail = params.resendFromEmail?.trim();
  if (!fromEmail) {
    try {
      const setting = await prisma.storeSetting.findUnique({ where: { key: 'resend_from_email' } });
      if (setting?.value?.trim()) fromEmail = setting.value.trim();
    } catch {}
  }
  if (!fromEmail) {
    fromEmail = 'Canvas India <admin@canvassindia.com>';
  }

  if (!apiKey) {
    const errorMsg = 'RESEND_API_KEY is not configured in worker secrets or Admin Settings.';
    console.warn(`[sendAdminWelcomeEmail] Skipped sending to ${recipientEmail}: ${errorMsg}`);
    return { sent: false, error: errorMsg };
  }

  const loginUrl = 'https://admin.canvassindia.com/login';
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Canvas India Admin Team</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="580px" cellpadding="0" cellspacing="0" style="max-width: 580px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          <!-- Header -->
          <tr>
            <td style="background-color: #0f172a; padding: 28px 32px; text-align: left;">
              <h1 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 700; letter-spacing: 0.5px;">
                CANVAS INDIA
              </h1>
              <p style="margin: 4px 0 0 0; color: #94a3b8; font-size: 13px;">Studio & Operations Management</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 32px;">
              <h2 style="margin: 0 0 16px 0; color: #0f172a; font-size: 18px; font-weight: 600;">
                Welcome to the Admin Team, ${escapeHtml(recipientName)}!
              </h2>
              <p style="margin: 0 0 20px 0; color: #475569; font-size: 14px; line-height: 1.6;">
                You have been invited as an administrator with the <strong>${escapeHtml(roleName)}</strong> role on Canvas India Studio & Operations. You can now log in to manage store operations, orders, production, and catalog.
              </p>

              <!-- Credentials Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 24px 0; background-color: #f1f5f9; border-radius: 8px; border: 1px solid #cbd5e1;">
                <tr>
                  <td style="padding: 20px;">
                    <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.8px; margin-bottom: 12px;">
                      Your Login Credentials
                    </div>
                    <table width="100%" cellpadding="4" cellspacing="0" style="font-size: 14px;">
                      <tr>
                        <td width="120" style="color: #64748b; font-weight: 500;">Admin Portal:</td>
                        <td style="color: #0f172a; font-weight: 600;">
                          <a href="${loginUrl}" style="color: #ea580c; text-decoration: none;">admin.canvassindia.com</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #64748b; font-weight: 500;">Email:</td>
                        <td style="color: #0f172a; font-weight: 600; font-family: monospace;">${escapeHtml(recipientEmail)}</td>
                      </tr>
                      <tr>
                        <td style="color: #64748b; font-weight: 500;">Temporary Password:</td>
                        <td style="color: #0f172a; font-weight: 700; font-family: monospace; background: #e2e8f0; padding: 4px 8px; border-radius: 4px; display: inline-block;">${escapeHtml(temporaryPassword)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 28px 0 16px 0;">
                <tr>
                  <td align="center">
                    <a href="${loginUrl}" style="display: inline-block; background-color: #ea580c; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; padding: 12px 28px; border-radius: 6px; box-shadow: 0 2px 4px rgba(234, 88, 12, 0.2);">
                      Log In to Admin Portal &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 24px 0 0 0; color: #64748b; font-size: 13px; line-height: 1.5; border-top: 1px solid #e2e8f0; padding-top: 16px;">
                <strong>Security Reminder:</strong> For security reasons, please change your temporary password immediately upon your first login by navigating to Settings in the admin dashboard.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 16px 32px; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                &copy; ${new Date().getFullYear()} Canvas India. All rights reserved. &bull; Automated notification
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

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [recipientEmail],
        subject: `Welcome to Canvas India Admin Team — Your Login Credentials`,
        html,
      }),
    });

    const data = await response.json().catch(() => ({})) as any;
    if (!response.ok) {
      const errorMsg = data?.message || `Resend returned HTTP ${response.status}`;
      console.error(`[sendAdminWelcomeEmail] Failed to send email to ${recipientEmail}:`, data);
      return { sent: false, error: errorMsg };
    }

    return { sent: true, id: data?.id };
  } catch (err: any) {
    const errorMsg = err?.message || 'Network error sending email';
    console.error(`[sendAdminWelcomeEmail] Error sending to ${recipientEmail}:`, err);
    return { sent: false, error: errorMsg };
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
