import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('Missing RESEND_API_KEY in environment variables');
}

export const resend = new Resend(process.env.RESEND_API_KEY);

// Default sender address
// Note: You must verify 'theclasspilot.com' in your Resend Dashboard for this to work.
export const EMAIL_FROM = process.env.RESEND_FROM_EMAIL || 'updates@theclasspilot.com';
export const ADMIN_EMAIL = process.env.GMAIL_USER || 'classpilot.edu@gmail.com';

/**
 * Standardized wrapper for sending emails via Resend.
 * Handles logging and returns a consistent format.
 */
export async function sendEmail({
  to,
  subject,
  html,
  from = `Class Pilot Update <${EMAIL_FROM}>`
}: {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });
    
    if (error) {
      console.error('[Resend Error]', error);
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error: any) {
    console.error('[Resend Exception]', error);
    return { data: null, error: error.message || 'Failed to send email' };
  }
}
