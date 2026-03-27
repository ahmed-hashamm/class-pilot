import nodemailer from "nodemailer";

export interface ContactFormData {
  name: string;
  email: string;
  type: string;
  subject: string;
  body: string;
}

function createTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,           // classpilot.edu@gmail.com
      pass: process.env.GMAIL_APP_PASSWORD,   // 16-char app password
    },
  });
}

export const ContactService = {
  async sendContactForm(data: ContactFormData) {
    const transporter = createTransporter();

    // Notification email to YOU
    await transporter.sendMail({
      from: `"Class Pilot" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: data.email,
      subject: `[${data.type}] ${data.subject || "New message"} — from ${data.name}`,
      html: `
        <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#fff;">
          <div style="background:#043873;border-radius:12px;padding:24px 28px;margin-bottom:28px;">
            <h1 style="color:#FFE492;font-size:22px;font-weight:900;margin:0 0 4px;">
              New message via Class Pilot
            </h1>
            <p style="color:rgba(255,255,255,0.6);font-size:13px;margin:0;">
              Contact form submission
            </p>
          </div>

          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #E5E5E5;font-size:13px;color:#737373;width:100px;">Name</td>
              <td style="padding:10px 0;border-bottom:1px solid #E5E5E5;font-size:13px;color:#0A0A0A;font-weight:600;">${data.name}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #E5E5E5;font-size:13px;color:#737373;">Email</td>
              <td style="padding:10px 0;border-bottom:1px solid #E5E5E5;font-size:13px;color:#0A0A0A;font-weight:600;">
                <a href="mailto:${data.email}" style="color:#043873;">${data.email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #E5E5E5;font-size:13px;color:#737373;">Type</td>
              <td style="padding:10px 0;border-bottom:1px solid #E5E5E5;font-size:13px;">
                <span style="background:#FFE492;color:#043873;font-size:11px;font-weight:700;
                  text-transform:uppercase;letter-spacing:.08em;border-radius:999px;padding:2px 10px;">
                  ${data.type}
                </span>
              </td>
            </tr>
            ${data.subject ? `
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #E5E5E5;font-size:13px;color:#737373;">Subject</td>
              <td style="padding:10px 0;border-bottom:1px solid #E5E5E5;font-size:13px;color:#0A0A0A;font-weight:600;">${data.subject}</td>
            </tr>` : ""}
          </table>

          <div style="background:#F5F5F5;border-radius:10px;padding:20px 22px;">
            <p style="font-size:12px;font-weight:700;color:#737373;text-transform:uppercase;
              letter-spacing:.12em;margin:0 0 10px;">Message</p>
            <p style="font-size:14px;color:#0A0A0A;line-height:1.7;margin:0;white-space:pre-wrap;">${data.body}</p>
          </div>

          <p style="font-size:12px;color:#737373;margin-top:28px;text-align:center;">
            Reply directly to this email to respond to ${data.name}.
          </p>
        </div>
      `,
    });

    // Confirmation email to the SENDER
    await transporter.sendMail({
      from: `"Class Pilot" <${process.env.GMAIL_USER}>`,
      to: data.email,
      subject: "We got your message — Class Pilot",
      html: `
        <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#fff;">
          <div style="background:#043873;border-radius:12px;padding:24px 28px;margin-bottom:28px;">
            <h1 style="color:#FFE492;font-size:22px;font-weight:900;margin:0 0 4px;">
              We got your message, ${data.name.split(" ")[0]}.
            </h1>
            <p style="color:rgba(255,255,255,0.6);font-size:13px;margin:0;">
              Class Pilot Support
            </p>
          </div>

          <p style="font-size:15px;color:#0A0A0A;line-height:1.7;margin:0 0 16px;">
            Thanks for getting in touch. We've received your message and will
            get back to you within a few hours.
          </p>

          <p style="font-size:14px;color:#737373;line-height:1.7;margin:0 0 28px;">
            In the meantime, you might find an answer in our
            <a href="https://classpilot.edu/help" style="color:#043873;font-weight:600;">Help Center</a>.
          </p>

          <div style="background:#F5F5F5;border-radius:10px;padding:20px 22px;margin-bottom:28px;">
            <p style="font-size:12px;font-weight:700;color:#737373;text-transform:uppercase;
              letter-spacing:.12em;margin:0 0 10px;">Your message</p>
            <p style="font-size:13px;color:#0A0A0A;line-height:1.7;margin:0;white-space:pre-wrap;">${data.body}</p>
          </div>

          <p style="font-size:12px;color:#737373;text-align:center;">
            — The Class Pilot team
          </p>
        </div>
      `,
    });
  }
}
