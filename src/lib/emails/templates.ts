/**
 * Centralized email templates for Class Pilot.
 * All functions return raw HTML strings ready for Resend.
 * Branding uses Class Pilot Navy (#0c1322 / #1e293b) and Yellow (#facc15).
 */

const COLORS = {
  navyDark: '#043873',
  navyLight: '#4F9CF9',
  yellow: '#FFE492',
  textMain: '#000000',
  textMuted: '#64748b',
  bgLight: '#f8fafc',
  white: '#ffffff',
  border: '#e2e8f0',
};

const APP_URL = 'https://theclasspilot.com';
const LOGO_URL = `${APP_URL}/logo.png`;

/**
 * Base layout wrapper for all emails. Ensures consistent branding.
 */
function BaseLayout(title: string, content: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>${title}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: ${COLORS.bgLight}; margin: 0; padding: 0; line-height: 1.6; color: ${COLORS.textMain}; }
          .container { max-width: 600px; margin: 0 auto; background-color: ${COLORS.white}; border-radius: 8px; overflow: hidden; margin-top: 40px; margin-bottom: 40px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); border: 1px solid ${COLORS.border}; }
          .header { background-color: ${COLORS.navyDark}; color: ${COLORS.white}; padding: 32px 40px; text-align: center; border-bottom: 4px solid ${COLORS.yellow}; }
          .header-title { margin: 12px 0 0 0; font-size: 24px; font-weight: 800; letter-spacing: -0.05em; color: ${COLORS.white}; }
          .content { padding: 40px; }
          .footer { background-color: ${COLORS.white}; color: ${COLORS.textMuted}; padding: 24px 40px; text-align: center; font-size: 13px; border-top: 1px solid ${COLORS.border}; }
          .btn { display: inline-block; background-color: ${COLORS.navyDark}; color: ${COLORS.white} !important; font-weight: 700; text-decoration: none; padding: 14px 28px; border-radius: 8px; margin-top: 24px; font-size: 16px; transition: all 0.2s ease; }
          .box { background-color: #F1F5F9; border: 1px solid ${COLORS.border}; padding: 24px; border-radius: 12px; margin: 24px 0; }
          .metric { display: inline-block; margin-right: 32px; }
          .metric-label { font-size: 11px; color: ${COLORS.textMuted}; text-transform: uppercase; font-weight: 700; letter-spacing: 0.1em; margin-bottom: 4px; }
          .metric-value { font-size: 20px; font-weight: 800; color: ${COLORS.navyDark}; }
          .text-muted { color: ${COLORS.textMuted}; font-size: 14px; }
          .logo { height: 48px; width: auto; display: block; margin: 0 auto; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <a href="${APP_URL}" target="_blank" style="text-decoration: none;">
              <img src="${LOGO_URL}" alt="Class Pilot" class="logo" />
              <div class="header-title">Class Pilot</div>
            </a>
          </div>
          <div class="content">
            ${content}
          </div>
          <div class="footer">
            <p style="margin-top: 0;">You're receiving this because you're enrolled in a classroom on <strong>Class Pilot</strong>.</p>
            <p>&copy; ${new Date().getFullYear()} Class Pilot Education. All rights reserved.</p>
            <div style="margin-top: 16px;">
              <a href="${APP_URL}" style="color: ${COLORS.navyLight}; text-decoration: none; font-weight: 600;">Visit Dashboard</a>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

export const EmailTemplates = {
  /**
   * Sent to students when a new assignment is posted.
   */
  NewAssignment: (data: {
    className: string;
    assignmentTitle: string;
    dueDate: string | null;
    points: number;
    url: string;
  }) => BaseLayout(
    `New Assignment: ${data.assignmentTitle}`,
    `
      <h2 style="color: ${COLORS.navyDark}; margin-top: 0;">New Assignment Posted</h2>
      <p>A new assignment has been posted in <strong>${data.className}</strong>.</p>
      
      <div class="box">
        <h3 style="margin-top: 0; color: ${COLORS.navyDark};">${data.assignmentTitle}</h3>
        <div>
          <div class="metric">
            <div class="metric-label">Points</div>
            <div class="metric-value">${data.points}</div>
          </div>
          ${data.dueDate ? `
          <div class="metric">
            <div class="metric-label">Due Date</div>
            <div class="metric-value">${new Date(data.dueDate).toLocaleDateString()}</div>
          </div>
          ` : ''}
        </div>
      </div>
      
      <p>Click the button below to view the assignment details and submit your work.</p>
      <a href="${data.url}" class="btn">View Assignment</a>
    `
  ),

  /**
   * Sent to students when a new announcement is posted.
   */
  NewAnnouncement: (data: {
    className: string;
    title: string;
    content: string;
    url: string;
  }) => BaseLayout(
    `New Announcement: ${data.title}`,
    `
      <h2 style="color: ${COLORS.navyDark}; margin-top: 0;">New Announcement</h2>
      <p>Your teacher posted a new announcement in <strong>${data.className}</strong>.</p>
      
      <div class="box" style="border-left: 4px solid ${COLORS.navyLight};">
        <h3 style="margin-top: 0; margin-bottom: 8px; color: ${COLORS.navyDark};">${data.title}</h3>
        <div style="color: ${COLORS.textMain}; white-space: pre-wrap;">${data.content}</div>
      </div>
      
      <a href="${data.url}" class="btn">Go to Class Feed</a>
    `
  ),

  /**
   * Sent to students when their assignment is graded.
   */
  GradingFeedback: (data: {
    className: string;
    assignmentTitle: string;
    grade: number;
    totalPoints: number;
    feedback: string | null;
    url: string;
  }) => BaseLayout(
    `Grade Updated: ${data.assignmentTitle}`,
    `
      <h2 style="color: ${COLORS.navyDark}; margin-top: 0;">Assignment Graded</h2>
      <p>Your submission for <strong>${data.assignmentTitle}</strong> in ${data.className} has been graded.</p>
      
      <div class="box">
        <div class="metric">
          <div class="metric-label">Your Score</div>
          <div class="metric-value" style="font-size: 24px; color: ${COLORS.navyDark};">${data.grade} / ${data.totalPoints}</div>
        </div>
      </div>
      
      ${data.feedback ? `
      <h4 style="color: ${COLORS.navyDark}; margin-bottom: 8px;">Teacher Feedback:</h4>
      <div style="background-color: ${COLORS.bgLight}; padding: 16px; border-radius: 6px; border: 1px solid ${COLORS.border}; margin-bottom: 24px; white-space: pre-wrap; font-style: italic;">"${data.feedback}"</div>
      ` : ''}
      
      <a href="${data.url}" class="btn">View Submission</a>
    `
  ),

  /**
   * Sent to students when a new poll is posted.
   */
  NewPoll: (data: {
    className: string;
    question: string;
    url: string;
  }) => BaseLayout(
    `New Poll: ${data.question}`,
    `
      <h2 style="color: ${COLORS.navyDark}; margin-top: 0;">New Poll Posted</h2>
      <p>A new poll has been posted in <strong>${data.className}</strong>.</p>
      
      <div class="box" style="border-left: 4px solid ${COLORS.navyLight};">
        <h3 style="margin-top: 0; margin-bottom: 8px; color: ${COLORS.navyDark};">${data.question}</h3>
      </div>
      
      <p>Click the button below to view and vote on the poll.</p>
      <a href="${data.url}" class="btn">View Poll</a>
    `
  ),

  /**
   * Sent to students when a new attendance session is started.
   */
  NewAttendance: (data: {
    className: string;
    url: string;
  }) => BaseLayout(
    `Attendance Session Started`,
    `
      <h2 style="color: ${COLORS.navyDark}; margin-top: 0;">Attendance Session Started</h2>
      <p>A new attendance session has started in <strong>${data.className}</strong>.</p>
      <p>Please make sure to mark yourself as present.</p>
      
      <a href="${data.url}" class="btn">Mark Attendance</a>
    `
  ),

  /**
   * Sent to students when a new material is uploaded.
   */
  NewMaterial: (data: {
    className: string;
    title: string;
    url: string;
  }) => BaseLayout(
    `New Material: ${data.title}`,
    `
      <h2 style="color: ${COLORS.navyDark}; margin-top: 0;">New Material Uploaded</h2>
      <p>New study material has been posted in <strong>${data.className}</strong>.</p>
      
      <div class="box" style="border-left: 4px solid ${COLORS.navyLight};">
        <h3 style="margin-top: 0; margin-bottom: 8px; color: ${COLORS.navyDark};">${data.title}</h3>
      </div>
      
      <p>Click the button below to view the new material.</p>
      <a href="${data.url}" class="btn">View Material</a>
    `
  ),

  /**
   * Sent to the user successfully submitting the contact form.
   */
  ContactConfirmationUser: (name: string) => BaseLayout(
    "We've received your message",
    `
      <h2 style="color: ${COLORS.navyDark}; margin-top: 0;">Hello ${name},</h2>
      <p>Thank you for reaching out to Class Pilot!</p>
      <p>This is an automated confirmation that we have received your message. Our support team will review your inquiry and get back to you as soon as possible, usually within 24-48 hours.</p>
      <p>In the meantime, feel free to explore our platform or reply directly to this email if you have any additional information to add.</p>
      <br/>
      <p>Best regards,<br/><strong>The Class Pilot Team</strong></p>
    `
  ),

  /**
   * Sent to the admin/support email when a user submits contact form.
   */
  ContactAlertAdmin: (data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) => BaseLayout(
    `New Support Request: ${data.subject}`,
    `
      <h2 style="color: ${COLORS.navyDark}; margin-top: 0;">New Contact Form Submission</h2>
      <p>You have received a new message from the Class Pilot website.</p>
      
      <div class="box">
        <p style="margin-top: 0;"><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
        <p style="margin-bottom: 0;"><strong>Subject:</strong> ${data.subject}</p>
      </div>
      
      <h4 style="color: ${COLORS.navyDark}; margin-bottom: 8px;">Message:</h4>
      <div style="background-color: ${COLORS.bgLight}; padding: 16px; border-radius: 6px; border: 1px solid ${COLORS.border}; white-space: pre-wrap;">${data.message}</div>
      
      <a href="mailto:${data.email}?subject=Re: ${encodeURIComponent(data.subject)}" class="btn">Reply to User</a>
    `
  )
};
