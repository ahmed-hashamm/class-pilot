/**
 * TERMS AND PRIVACY DATA
 */

export const TERMS_SECTIONS = [
  {
    title: "Acceptance of Terms",
    paragraphs: [
      "By accessing or using Class Pilot (\"the Service\"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.",
      "These terms apply to all users of Class Pilot, including teachers, students, and any other individuals who access the Service. We may update these terms from time to time — continued use of the Service after changes are posted constitutes acceptance of the updated terms.",
    ],
  },
  {
    title: "Description of Service",
    paragraphs: [
      "Class Pilot is a classroom management platform that enables teachers to create classes, post assignments, grade student work, and communicate with students. Students can join classes, view assignments, submit work, and interact with Class Pilot's AI-powered features.",
      "The Service currently includes the following features:",
    ],
    list: [
      "Class creation and student management",
      "Assignment posting with file attachments and due dates",
      "AI-assisted grading and personalised feedback drafting",
      "Real-time group collaboration workspaces",
      "Class-specific AI Assistant trained on teacher-uploaded materials",
    ],
    footer: "Class Pilot is currently **free to use**. We may introduce optional paid plans in the future — we will give reasonable notice before any pricing changes take effect.",
  },
  {
    title: "User Accounts & Eligibility",
    intro: "To use Class Pilot you must:",
    list: [
      "Be at least 13 years of age, or have parental/guardian consent if younger",
      "Provide accurate and complete registration information",
      "Keep your account credentials secure and not share them with others",
      "Notify us immediately of any unauthorised use of your account",
    ],
    paragraphs: [
      "Teachers are responsible for ensuring students in their classes meet the eligibility requirements above. If you are a teacher enrolling students under the age of 13, you must obtain appropriate parental consent in accordance with applicable laws including COPPA (US) and GDPR (EU/UK).",
    ],
  },
  {
    title: "Acceptable Use",
    intro: "You agree not to use Class Pilot to:",
    list: [
      "Upload, post, or transmit any content that is unlawful, harmful, or offensive",
      "Harass, bully, or intimidate other users",
      "Impersonate any person or entity",
      "Attempt to gain unauthorised access to any part of the Service",
      "Use automated tools (bots, scrapers) to access or extract data from the Service",
      "Upload content that infringes the intellectual property rights of others",
      "Use the Service for any commercial purpose without our written consent",
    ],
    paragraphs: [
      "We reserve the right to suspend or terminate accounts that violate these terms without prior notice.",
    ],
  },
  {
    title: "Content Ownership & Licences",
    paragraphs: [
      "**Your content:** You retain ownership of all content you upload to Class Pilot — including assignments, materials, submissions, and feedback. By uploading content, you grant Class Pilot a limited, non-exclusive licence to store, display, and process that content solely to provide the Service to you.",
      "**AI-processed content:** Materials you upload to the Class AI Assistant are used exclusively to power that class's AI tutor. They are not used to train our AI models or shared with any third party.",
      "**Class Pilot's content:** The Class Pilot platform, interface, branding, and underlying technology remain the intellectual property of Class Pilot. You may not copy, modify, or distribute them without permission.",
    ],
  },
  {
    title: "Limitation of Liability",
    paragraphs: [
      "Class Pilot is provided \"as is\" without warranties of any kind. We do not guarantee that the Service will be uninterrupted, error-free, or completely secure.",
      "To the fullest extent permitted by law, Class Pilot shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service, including but not limited to loss of data, loss of revenue, or academic consequences.",
      "Our total liability to you for any claim arising from use of the Service shall not exceed the amount you have paid us in the twelve months preceding the claim (which, during the free period, is zero).",
    ],
  },
];

export const PRIVACY_SECTIONS = [
  {
    title: "Privacy Policy — What We Collect",
    intro: "When you use Class Pilot, we collect the following information:",
    list: [
      "**Account information:** name, email address, and role (teacher or student)",
      "**Content you create:** assignments, submissions, feedback, and uploaded materials",
      "**Usage data:** pages visited, features used, and actions taken within the Service",
      "**Technical data:** IP address, browser type, device type, and operating system",
    ],
    paragraphs: [
      "We do **not** collect payment information (the Service is free), sell your data to third parties, or use your content to train AI models.",
    ],
  },
  {
    title: "Privacy Policy — How We Use Your Data",
    intro: "We use the data we collect to:",
    list: [
      "Provide, operate, and improve the Class Pilot Service",
      "Authenticate your account and keep it secure",
      "Send transactional emails (account confirmation, password reset, grading notifications)",
      "Diagnose technical issues and monitor Service performance",
      "Comply with our legal obligations",
    ],
    paragraphs: [
      "We do **not** use your data for advertising, sell it to data brokers, or share it with third parties except as described in the section below.",
    ],
  },
  {
    title: "Privacy Policy — Third Parties & Data Sharing",
    paragraphs: [
      "We use a small number of trusted third-party services to operate Class Pilot. Each of these processes your data only to the extent necessary:",
    ],
    list: [
      "**Hosting:** Vercel — serves the application and stores data on secure infrastructure",
      "**Authentication:** our own secure auth system — no third-party identity provider",
      "**Email delivery:** Nodemailer / Resend — used only to send transactional emails",
      "**AI processing:** OpenAI — used to power grading assistance and the Class AI Assistant. Data sent to OpenAI is governed by their data processing agreement and is not used to train their models under our enterprise agreement",
    ],
    paragraphsAfter: [
      "We may disclose your information if required by law, court order, or to protect the rights and safety of our users or the public.",
    ],
  },
  {
    title: "Privacy Policy — Data Retention & Your Rights",
    paragraphs: [
      "We retain your personal data for as long as your account is active. When you delete your account, we remove your personal data within 30 days.",
      "Depending on your location, you may have the right to:",
    ],
    list: [
      "Access the personal data we hold about you",
      "Request correction of inaccurate data",
      "Request deletion of your data (\"right to be forgotten\")",
      "Object to or restrict certain types of processing",
      "Data portability — receive your data in a machine-readable format",
    ],
    footer: "To exercise any of these rights, contact us at classpilot.edu@gmail.com. We will respond within 30 days.",
  },
];
