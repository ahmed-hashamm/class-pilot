import { resend, EMAIL_FROM, ADMIN_EMAIL } from "@/lib/resend";

export interface ContactFormData {
  name: string;
  email: string;
  type: string;
  subject?: string;
  body: string;
}

export const ContactService = {
  async sendContactForm(data: ContactFormData) {
    // 1. Notification email to the ADMIN (You)
    await resend.emails.send({
      from: `Class Pilot <${EMAIL_FROM}>`,
      to: ADMIN_EMAIL,
      replyTo: data.email,
      subject: `[${data.type}] ${data.subject || "New message"} — from ${data.name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #043873;">New Contact Form Submission</h2>
          <hr style="border: 0; border-top: 1px solid #eee;" />
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Type:</strong> ${data.type}</p>
          <p><strong>Subject:</strong> ${data.subject || "No Subject"}</p>
          <p><strong>Message:</strong></p>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; line-height: 1.5;">
            ${data.body}
          </div>
          <p style="font-size: 12px; color: #666; margin-top: 20px;">
            Reply to this email directly to respond to the user.
          </p>
        </div>
      `,
    });

    // 2. Confirmation email to the USER (Sender)
    // Note: If using onboarding@resend.dev, this may not deliver to the user 
    // unless they are the account owner, but we implement it for production readiness.
    try {
      await resend.emails.send({
        from: `Class Pilot <${EMAIL_FROM}>`,
        to: data.email,
        subject: "We received your message — Class Pilot",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h2 style="color: #043873;">Hello ${data.name.split(" ")[0]},</h2>
            <p>Thanks for reaching out to Class Pilot. We've received your message regarding <strong>${data.subject || data.type}</strong> and our team will get back to you shortly.</p>
            
            <p>For your records, here is a copy of your message:</p>
            <div style="border-left: 4px solid #FFE492; padding-left: 15px; margin: 20px 0; font-style: italic; color: #555;">
              ${data.body}
            </div>
            
            <p>Best regards,<br/>The Class Pilot Team</p>
          </div>
        `,
      });
    } catch (error) {
      // Silent failure for confirmation email — primary admin notification already sent.
    }
  }
};
