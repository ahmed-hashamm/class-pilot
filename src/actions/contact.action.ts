"use server";

import nodemailer from "nodemailer";

/* ─────────────────────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────────────────────── */
export interface ContactFormState {
  status: "idle" | "success" | "error";
  message?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  type: string;
  subject: string;
  body: string;
}

/* ─────────────────────────────────────────────────────────────────────────────
   TRANSPORTER  — Gmail SMTP, works locally and in production with no domain
───────────────────────────────────────────────────────────────────────────── */
function createTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,           // classpilot.edu@gmail.com
      pass: process.env.GMAIL_APP_PASSWORD,   // 16-char app password (not your Gmail password)
    },
  });
}

/* ─────────────────────────────────────────────────────────────────────────────
   ACTION
───────────────────────────────────────────────────────────────────────────── */
export async function sendContactForm(
  data: ContactFormData
): Promise<ContactFormState> {
  // Server-side validation
  if (!data.name.trim() || !data.email.trim() || !data.body.trim()) {
    return { status: "error", message: "Please fill in all required fields." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  const transporter = createTransporter();

  try {
    // ── Notification email to YOU ────────────────────────────────────────
    await transporter.sendMail({
      from:     `"Class Pilot" <${process.env.GMAIL_USER}>`,
      to:       process.env.GMAIL_USER,   // lands in your own Gmail inbox
      replyTo:  data.email,               // hit Reply in Gmail → goes straight to sender
      subject:  `[${data.type}] ${data.subject || "New message"} — from ${data.name}`,
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

    // ── Confirmation email to the SENDER ────────────────────────────────
    await transporter.sendMail({
      from:    `"Class Pilot" <${process.env.GMAIL_USER}>`,
      to:      data.email,
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

    return { status: "success" };
  } catch (err) {
    console.error("Nodemailer error:", err);
    return {
      status: "error",
      message: "Something went wrong. Please try again or email us directly.",
    };
  }
}

// "use server";

// import { Resend } from "resend";

// /* ─────────────────────────────────────────────────────────────────────────────
//    TYPES
// ───────────────────────────────────────────────────────────────────────────── */
// export interface ContactFormState {
//   status: "idle" | "success" | "error";
//   message?: string;
// }

// export interface ContactFormData {
//   name: string;
//   email: string;
//   type: string;
//   subject: string;
//   body: string;
// }

/* ─────────────────────────────────────────────────────────────────────────────
   ACTION
   To activate:
   1. Domain is verified on Resend (green checkmark)
   2. Add RESEND_API_KEY to .env.local and your hosting dashboard
   3. Replace src/actions/contact.action.ts with this file
   That's it — the contact page requires zero changes.
───────────────────────────────────────────────────────────────────────────── */
// export async function sendContactForm(
//   data: ContactFormData
// ): Promise<ContactFormState> {
//   // Server-side validation
//   if (!data.name.trim() || !data.email.trim() || !data.body.trim()) {
//     return { status: "error", message: "Please fill in all required fields." };
//   }

//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (!emailRegex.test(data.email)) {
//     return { status: "error", message: "Please enter a valid email address." };
//   }

//   const resend = new Resend(process.env.RESEND_API_KEY);

//   try {
//     // ── Notification email to YOU ────────────────────────────────────────
//     await resend.emails.send({
//       from:    "Class Pilot <hello@classpilot.edu>",  // must match your verified domain
//       to:      "classpilot.edu@gmail.com",            // your Gmail inbox
//       replyTo: data.email,                            // Reply in Gmail → goes to sender
//       subject: `[${data.type}] ${data.subject || "New message"} — from ${data.name}`,
//       html: `
//         <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#fff;">
//           <div style="background:#043873;border-radius:12px;padding:24px 28px;margin-bottom:28px;">
//             <h1 style="color:#FFE492;font-size:22px;font-weight:900;margin:0 0 4px;">
//               New message via Class Pilot
//             </h1>
//             <p style="color:rgba(255,255,255,0.6);font-size:13px;margin:0;">
//               Contact form submission
//             </p>
//           </div>

//           <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
//             <tr>
//               <td style="padding:10px 0;border-bottom:1px solid #E5E5E5;font-size:13px;color:#737373;width:100px;">Name</td>
//               <td style="padding:10px 0;border-bottom:1px solid #E5E5E5;font-size:13px;color:#0A0A0A;font-weight:600;">${data.name}</td>
//             </tr>
//             <tr>
//               <td style="padding:10px 0;border-bottom:1px solid #E5E5E5;font-size:13px;color:#737373;">Email</td>
//               <td style="padding:10px 0;border-bottom:1px solid #E5E5E5;font-size:13px;color:#0A0A0A;font-weight:600;">
//                 <a href="mailto:${data.email}" style="color:#043873;">${data.email}</a>
//               </td>
//             </tr>
//             <tr>
//               <td style="padding:10px 0;border-bottom:1px solid #E5E5E5;font-size:13px;color:#737373;">Type</td>
//               <td style="padding:10px 0;border-bottom:1px solid #E5E5E5;font-size:13px;">
//                 <span style="background:#FFE492;color:#043873;font-size:11px;font-weight:700;
//                   text-transform:uppercase;letter-spacing:.08em;border-radius:999px;padding:2px 10px;">
//                   ${data.type}
//                 </span>
//               </td>
//             </tr>
//             ${data.subject ? `
//             <tr>
//               <td style="padding:10px 0;border-bottom:1px solid #E5E5E5;font-size:13px;color:#737373;">Subject</td>
//               <td style="padding:10px 0;border-bottom:1px solid #E5E5E5;font-size:13px;color:#0A0A0A;font-weight:600;">${data.subject}</td>
//             </tr>` : ""}
//           </table>

//           <div style="background:#F5F5F5;border-radius:10px;padding:20px 22px;">
//             <p style="font-size:12px;font-weight:700;color:#737373;text-transform:uppercase;
//               letter-spacing:.12em;margin:0 0 10px;">Message</p>
//             <p style="font-size:14px;color:#0A0A0A;line-height:1.7;margin:0;white-space:pre-wrap;">${data.body}</p>
//           </div>

//           <p style="font-size:12px;color:#737373;margin-top:28px;text-align:center;">
//             Reply directly to this email to respond to ${data.name}.
//           </p>
//         </div>
//       `,
//     });

//     // ── Confirmation email to the SENDER ────────────────────────────────
//     await resend.emails.send({
//       from:    "Class Pilot <hello@classpilot.edu>",
//       to:      data.email,
//       subject: "We got your message — Class Pilot",
//       html: `
//         <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#fff;">
//           <div style="background:#043873;border-radius:12px;padding:24px 28px;margin-bottom:28px;">
//             <h1 style="color:#FFE492;font-size:22px;font-weight:900;margin:0 0 4px;">
//               We got your message, ${data.name.split(" ")[0]}.
//             </h1>
//             <p style="color:rgba(255,255,255,0.6);font-size:13px;margin:0;">
//               Class Pilot Support
//             </p>
//           </div>

//           <p style="font-size:15px;color:#0A0A0A;line-height:1.7;margin:0 0 16px;">
//             Thanks for getting in touch. We've received your message and will
//             get back to you within a few hours.
//           </p>

//           <p style="font-size:14px;color:#737373;line-height:1.7;margin:0 0 28px;">
//             In the meantime, you might find an answer in our
//             <a href="https://classpilot.edu/help" style="color:#043873;font-weight:600;">Help Center</a>.
//           </p>

//           <div style="background:#F5F5F5;border-radius:10px;padding:20px 22px;margin-bottom:28px;">
//             <p style="font-size:12px;font-weight:700;color:#737373;text-transform:uppercase;
//               letter-spacing:.12em;margin:0 0 10px;">Your message</p>
//             <p style="font-size:13px;color:#0A0A0A;line-height:1.7;margin:0;white-space:pre-wrap;">${data.body}</p>
//           </div>

//           <p style="font-size:12px;color:#737373;text-align:center;">
//             — The Class Pilot team
//           </p>
//         </div>
//       `,
//     });

//     return { status: "success" };
//   } catch (err) {
//     console.error("Resend error:", err);
//     return {
//       status: "error",
//       message: "Something went wrong. Please try again or email us directly.",
//     };
//   }
// }