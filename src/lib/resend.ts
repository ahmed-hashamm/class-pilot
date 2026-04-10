import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('Missing RESEND_API_KEY in environment variables');
}

export const resend = new Resend(process.env.RESEND_API_KEY);

// Default sender address
// Note: You must verify 'theclasspilot.com' in your Resend Dashboard for this to work.
export const EMAIL_FROM = process.env.RESEND_FROM_EMAIL || 'support@theclasspilot.com';
export const ADMIN_EMAIL = process.env.GMAIL_USER || 'classpilot.edu@gmail.com';
