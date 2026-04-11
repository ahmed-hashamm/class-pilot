import { sendEmail, ADMIN_EMAIL } from "@/lib/resend";
import { EmailTemplates } from "@/lib/emails/templates";

export interface ContactFormData {
  name: string;
  email: string;
  type: string;
  subject?: string;
  body: string;
}

export const ContactService = {
  async sendContactForm(data: ContactFormData) {
    const combinedSubject = `[${data.type}] ${data.subject || "New message"}`;

    // 1. Notification email to the ADMIN
    const { error: adminError } = await sendEmail({
      to: ADMIN_EMAIL,
      subject: `${combinedSubject} — from ${data.name}`,
      html: EmailTemplates.ContactAlertAdmin({
        name: data.name,
        email: data.email,
        subject: combinedSubject,
        message: data.body
      }),
      // We can't easily pass 'replyTo' through our sendEmail wrapper yet, 
      // but the HTML template includes a mailto link button for easy replies.
    });

    if (adminError) {
      console.error('[ContactService] Failed to send admin notification', adminError);
      throw new Error("Failed to send message to support");
    }

    // 2. Confirmation email to the USER
    // We do not throw if this fails, to not fail the user's action
    await sendEmail({
      to: data.email,
      subject: "We've received your message — Class Pilot",
      html: EmailTemplates.ContactConfirmationUser(data.name.split(" ")[0]),
    });
  }
};
