/**
 * Transactional email through Resend (https://resend.com), called with plain fetch so it runs in the Worker.
 *
 * Rules this module keeps:
 *  - It never throws. Email is a courtesy: a failed or unconfigured email must never fail an order, a payment or a booking.
 *  - With no RESEND_API_KEY it does nothing (and says so), so the code is safe to deploy before the account exists.
 */
export interface MailerEnv {
  RESEND_API_KEY?: string;
  /** "Canvas India <orders@canvassindia.com>" - the domain must be verified in Resend. */
  MAIL_FROM?: string;
  MAIL_REPLY_TO?: string;
}

export interface MailMessage {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
}

export type MailResult = { sent: true; id?: string } | { sent: false; reason: 'not-configured' | 'no-recipient' | 'rejected' | 'network'; detail?: string };

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

const EMAIL = /^[^\s@<>()]+@[^\s@<>()]+\.[^\s@<>()]{2,}$/;

export function isEmail(value: unknown): value is string {
  return typeof value === 'string' && value.length <= 254 && EMAIL.test(value.trim());
}

/** "asha@gmail.com" -> "a***@gmail.com": enough to recognise in the order timeline without storing the address again. */
export function maskEmail(email: string): string {
  const [name, domain] = email.split('@');
  return `${name.slice(0, 1)}***@${domain}`;
}

export function mailConfigured(env: MailerEnv): boolean {
  return Boolean(env.RESEND_API_KEY?.trim() && env.MAIL_FROM?.trim());
}

export async function sendMail(env: MailerEnv, message: MailMessage, fetchFn: FetchLike = (i, o) => fetch(i, o)): Promise<MailResult> {
  if (!mailConfigured(env)) return { sent: false, reason: 'not-configured' };
  const recipients = (Array.isArray(message.to) ? message.to : [message.to]).map((r) => r.trim()).filter(isEmail);
  if (recipients.length === 0) return { sent: false, reason: 'no-recipient' };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetchFn('https://api.resend.com/emails', {
      method: 'POST',
      signal: controller.signal,
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY!.trim()}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: env.MAIL_FROM!.trim(),
        to: recipients,
        subject: message.subject,
        html: message.html,
        text: message.text,
        ...(env.MAIL_REPLY_TO?.trim() ? { reply_to: env.MAIL_REPLY_TO.trim() } : {}),
      }),
    });
    const data: any = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error('email rejected by Resend', res.status, data?.message ?? data?.name ?? '');
      return { sent: false, reason: 'rejected', detail: `HTTP ${res.status}${data?.message ? `: ${data.message}` : ''}` };
    }
    return { sent: true, id: data?.id };
  } catch (err: any) {
    console.error('email send failed', err?.name === 'AbortError' ? 'timeout' : err?.message);
    return { sent: false, reason: 'network', detail: err?.name === 'AbortError' ? 'timeout' : err?.message };
  } finally {
    clearTimeout(timer);
  }
}
