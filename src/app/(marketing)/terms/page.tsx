"use client";

import LegalPageLayout, { P, UL, LI, A, Strong } from "@/components/layout/LegalPageLayout";

/* ─────────────────────────────────────────────────────────────────────────────
   TERMS & PRIVACY — combined page
   Route: /terms
───────────────────────────────────────────────────────────────────────────── */
export default function TermsAndPrivacyPage() {
  return (
    <LegalPageLayout
      badge="Legal"
      title="Terms of Service & Privacy Policy"
      subtitle="Please read these terms carefully before using Class Pilot. By creating an account you agree to them."
      lastUpdated="March 2026"
      sections={[

        /* ── TERMS OF SERVICE ── */
        {
          title: "Acceptance of Terms",
          content: (
            <>
              <P>
                By accessing or using Class Pilot ("the Service"), you agree to be bound by these
                Terms of Service. If you do not agree to these terms, please do not use the Service.
              </P>
              <P>
                These terms apply to all users of Class Pilot, including teachers, students, and
                any other individuals who access the Service. We may update these terms from time
                to time — continued use of the Service after changes are posted constitutes
                acceptance of the updated terms.
              </P>
            </>
          ),
        },

        {
          title: "Description of Service",
          content: (
            <>
              <P>
                Class Pilot is a classroom management platform that enables teachers to create
                classes, post assignments, grade student work, and communicate with students.
                Students can join classes, view assignments, submit work, and interact with
                Class Pilot's AI-powered features.
              </P>
              <P>The Service currently includes the following features:</P>
              <UL>
                <LI>Class creation and student management</LI>
                <LI>Assignment posting with file attachments and due dates</LI>
                <LI>AI-assisted grading and personalised feedback drafting</LI>
                <LI>Real-time group collaboration workspaces</LI>
                <LI>Class-specific AI Assistant trained on teacher-uploaded materials</LI>
              </UL>
              <P>
                Class Pilot is currently <Strong>free to use</Strong>. We may introduce optional
                paid plans in the future — we will give reasonable notice before any pricing
                changes take effect.
              </P>
            </>
          ),
        },

        {
          title: "User Accounts & Eligibility",
          content: (
            <>
              <P>To use Class Pilot you must:</P>
              <UL>
                <LI>Be at least 13 years of age, or have parental/guardian consent if younger</LI>
                <LI>Provide accurate and complete registration information</LI>
                <LI>Keep your account credentials secure and not share them with others</LI>
                <LI>Notify us immediately of any unauthorised use of your account</LI>
              </UL>
              <P>
                Teachers are responsible for ensuring students in their classes meet the
                eligibility requirements above. If you are a teacher enrolling students under
                the age of 13, you must obtain appropriate parental consent in accordance with
                applicable laws including COPPA (US) and GDPR (EU/UK).
              </P>
            </>
          ),
        },

        {
          title: "Acceptable Use",
          content: (
            <>
              <P>You agree not to use Class Pilot to:</P>
              <UL>
                <LI>Upload, post, or transmit any content that is unlawful, harmful, or offensive</LI>
                <LI>Harass, bully, or intimidate other users</LI>
                <LI>Impersonate any person or entity</LI>
                <LI>Attempt to gain unauthorised access to any part of the Service</LI>
                <LI>Use automated tools (bots, scrapers) to access or extract data from the Service</LI>
                <LI>Upload content that infringes the intellectual property rights of others</LI>
                <LI>Use the Service for any commercial purpose without our written consent</LI>
              </UL>
              <P>
                We reserve the right to suspend or terminate accounts that violate these terms
                without prior notice.
              </P>
            </>
          ),
        },

        {
          title: "Content Ownership & Licences",
          content: (
            <>
              <P>
                <Strong>Your content:</Strong> You retain ownership of all content you upload to
                Class Pilot — including assignments, materials, submissions, and feedback. By
                uploading content, you grant Class Pilot a limited, non-exclusive licence to
                store, display, and process that content solely to provide the Service to you.
              </P>
              <P>
                <Strong>AI-processed content:</Strong> Materials you upload to the Class AI
                Assistant are used exclusively to power that class's AI tutor. They are not
                used to train our AI models or shared with any third party.
              </P>
              <P>
                <Strong>Class Pilot's content:</Strong> The Class Pilot platform, interface,
                branding, and underlying technology remain the intellectual property of
                Class Pilot. You may not copy, modify, or distribute them without permission.
              </P>
            </>
          ),
        },

        {
          title: "Limitation of Liability",
          content: (
            <>
              <P>
                Class Pilot is provided "as is" without warranties of any kind. We do not
                guarantee that the Service will be uninterrupted, error-free, or completely
                secure.
              </P>
              <P>
                To the fullest extent permitted by law, Class Pilot shall not be liable for
                any indirect, incidental, special, or consequential damages arising from your
                use of the Service, including but not limited to loss of data, loss of revenue,
                or academic consequences.
              </P>
              <P>
                Our total liability to you for any claim arising from use of the Service
                shall not exceed the amount you have paid us in the twelve months preceding
                the claim (which, during the free period, is zero).
              </P>
            </>
          ),
        },

        {
          title: "Termination",
          content: (
            <>
              <P>
                You may delete your account at any time from Account Settings. Upon deletion,
                your personal data and class content will be permanently removed within 30 days,
                except where we are required to retain it by law.
              </P>
              <P>
                We may suspend or terminate your access to Class Pilot at any time if you
                violate these terms, if we are required to do so by law, or if we discontinue
                the Service. We will provide reasonable notice where possible.
              </P>
            </>
          ),
        },

        /* ── PRIVACY POLICY ── */
        {
          title: "Privacy Policy — What We Collect",
          content: (
            <>
              <P>When you use Class Pilot, we collect the following information:</P>
              <UL>
                <LI><Strong>Account information:</Strong> name, email address, and role (teacher or student)</LI>
                <LI><Strong>Content you create:</Strong> assignments, submissions, feedback, and uploaded materials</LI>
                <LI><Strong>Usage data:</Strong> pages visited, features used, and actions taken within the Service</LI>
                <LI><Strong>Technical data:</Strong> IP address, browser type, device type, and operating system</LI>
              </UL>
              <P>
                We do <Strong>not</Strong> collect payment information (the Service is free),
                sell your data to third parties, or use your content to train AI models.
              </P>
            </>
          ),
        },

        {
          title: "Privacy Policy — How We Use Your Data",
          content: (
            <>
              <P>We use the data we collect to:</P>
              <UL>
                <LI>Provide, operate, and improve the Class Pilot Service</LI>
                <LI>Authenticate your account and keep it secure</LI>
                <LI>Send transactional emails (account confirmation, password reset, grading notifications)</LI>
                <LI>Diagnose technical issues and monitor Service performance</LI>
                <LI>Comply with our legal obligations</LI>
              </UL>
              <P>
                We do <Strong>not</Strong> use your data for advertising, sell it to data
                brokers, or share it with third parties except as described in the section below.
              </P>
            </>
          ),
        },

        {
          title: "Privacy Policy — Third Parties & Data Sharing",
          content: (
            <>
              <P>
                We use a small number of trusted third-party services to operate Class Pilot.
                Each of these processes your data only to the extent necessary:
              </P>
              <UL>
                <LI><Strong>Hosting:</Strong> Vercel — serves the application and stores data on secure infrastructure</LI>
                <LI><Strong>Authentication:</Strong> our own secure auth system — no third-party identity provider</LI>
                <LI><Strong>Email delivery:</Strong> Nodemailer / Resend — used only to send transactional emails</LI>
                <LI><Strong>AI processing:</Strong> OpenAI — used to power grading assistance and the Class AI Assistant. Data sent to OpenAI is governed by their data processing agreement and is not used to train their models under our enterprise agreement</LI>
              </UL>
              <P>
                We may disclose your information if required by law, court order, or
                to protect the rights and safety of our users or the public.
              </P>
            </>
          ),
        },

        {
          title: "Privacy Policy — Data Retention & Your Rights",
          content: (
            <>
              <P>
                We retain your personal data for as long as your account is active. When you
                delete your account, we remove your personal data within 30 days.
              </P>
              <P>Depending on your location, you may have the right to:</P>
              <UL>
                <LI>Access the personal data we hold about you</LI>
                <LI>Request correction of inaccurate data</LI>
                <LI>Request deletion of your data ("right to be forgotten")</LI>
                <LI>Object to or restrict certain types of processing</LI>
                <LI>Data portability — receive your data in a machine-readable format</LI>
              </UL>
              <P>
                To exercise any of these rights, contact us at{" "}
                <A href="mailto:classpilot.edu@gmail.com">classpilot.edu@gmail.com</A>.
                We will respond within 30 days.
              </P>
            </>
          ),
        },

        {
          title: "Privacy Policy — Children's Privacy",
          content: (
            <>
              <P>
                Class Pilot may be used by students under the age of 13 where a teacher or
                institution has obtained appropriate parental consent. We do not knowingly
                collect personal data from children under 13 without verified parental consent.
              </P>
              <P>
                If you believe a child under 13 has provided us with personal information
                without parental consent, please contact us immediately at{" "}
                <A href="mailto:classpilot.edu@gmail.com">classpilot.edu@gmail.com</A>{" "}
                and we will take steps to remove that information.
              </P>
            </>
          ),
        },

        {
          title: "Contact & Governing Law",
          content: (
            <>
              <P>
                These Terms of Service and Privacy Policy are governed by applicable law.
                If you have any questions or concerns about these policies, please contact us:
              </P>
              <UL>
                <LI>Email: <A href="mailto:classpilot.edu@gmail.com">classpilot.edu@gmail.com</A></LI>
                <LI>Contact form: <A href="/contact">classpilot.edu/contact</A></LI>
              </UL>
              <P>
                We aim to resolve all concerns promptly and fairly. If you are not satisfied
                with our response, you may have the right to lodge a complaint with your
                local data protection authority.
              </P>
            </>
          ),
        },

      ]}
    />
  );
}