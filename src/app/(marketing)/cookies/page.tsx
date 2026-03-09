"use client";

import LegalPageLayout, { P, UL, LI, A, Strong } from "@/components/layout/LegalPageLayout";

/* ─────────────────────────────────────────────────────────────────────────────
   COOKIE POLICY
   Route: /cookies
───────────────────────────────────────────────────────────────────────────── */
export default function CookiePolicyPage() {
  return (
    <LegalPageLayout
      badge="Legal"
      title="Cookie Policy"
      subtitle="How Class Pilot uses cookies and similar technologies to keep the Service working and improve your experience."
      lastUpdated="March 2026"
      sections={[

        {
          title: "What Are Cookies?",
          content: (
            <>
              <P>
                Cookies are small text files that are stored on your device when you visit a
                website. They help websites remember who you are, keep you logged in, and
                understand how you use the Service so it can be improved.
              </P>
              <P>
                Class Pilot uses cookies and similar technologies including local storage and
                session storage. This policy explains what we use, why, and how you can
                control them.
              </P>
            </>
          ),
        },

        {
          title: "Cookies We Use",
          content: (
            <>
              <P>We use a small, focused set of cookies — only what is necessary to run the Service:</P>

              <div className="flex flex-col gap-5 mt-2">
                {[
                  {
                    type: "Essential",
                    colour: "bg-navy text-white",
                    desc: "Required for the Service to function. Cannot be disabled.",
                    items: [
                      { name: "session_token", purpose: "Keeps you logged in across page loads. Expires when you log out or after 30 days of inactivity." },
                      { name: "csrf_token", purpose: "Protects against cross-site request forgery attacks. Session-scoped." },
                    ],
                  },
                  {
                    type: "Functional",
                    colour: "bg-yellow text-navy",
                    desc: "Remember your preferences to improve your experience.",
                    items: [
                      { name: "ui_theme", purpose: "Stores your light/dark mode preference." },
                      { name: "last_class", purpose: "Remembers the last class you had open so you return to it on next visit." },
                    ],
                  },
                  {
                    type: "Analytics",
                    colour: "bg-secondary text-foreground border border-border",
                    desc: "Help us understand how the Service is used so we can improve it. No personal data is shared with third parties.",
                    items: [
                      { name: "cp_session", purpose: "Anonymous session identifier used to count unique visits and measure feature usage. No personally identifiable information is stored." },
                    ],
                  },
                ].map((group) => (
                  <div key={group.type} className="border border-border rounded-xl overflow-hidden">
                    <div className={`flex items-center gap-2 px-4 py-2.5 ${group.colour}`}>
                      <span className="font-bold text-[13px]">{group.type}</span>
                    </div>
                    <div className="p-4">
                      <p className="text-[13px] text-muted-foreground mb-3">{group.desc}</p>
                      <div className="flex flex-col gap-3">
                        {group.items.map((item) => (
                          <div key={item.name} className="flex items-start gap-3">
                            <code className="shrink-0 text-[11px] font-mono font-bold bg-secondary
                              border border-border rounded px-2 py-0.5 text-navy mt-0.5">
                              {item.name}
                            </code>
                            <p className="text-[13px] text-muted-foreground leading-relaxed">
                              {item.purpose}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ),
        },

        {
          title: "Third-Party Cookies",
          content: (
            <>
              <P>
                Class Pilot does <Strong>not</Strong> use third-party advertising cookies or
                tracking pixels. We do not allow advertisers to set cookies on our platform.
              </P>
              <P>
                Our hosting provider (Vercel) may set infrastructure-level cookies for load
                balancing and security purposes. These are strictly necessary and do not
                identify you personally.
              </P>
            </>
          ),
        },

        {
          title: "How to Control Cookies",
          content: (
            <>
              <P>
                You can control and delete cookies through your browser settings. Here's
                how to do it in the most common browsers:
              </P>
              <UL>
                <LI><A href="https://support.google.com/chrome/answer/95647">Google Chrome</A></LI>
                <LI><A href="https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox">Mozilla Firefox</A></LI>
                <LI><A href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac">Safari</A></LI>
                <LI><A href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09">Microsoft Edge</A></LI>
              </UL>
              <P>
                Please note that disabling <Strong>essential cookies</Strong> will prevent
                Class Pilot from functioning correctly — you will not be able to stay logged in.
                Functional and analytics cookies can be disabled without affecting core
                functionality.
              </P>
            </>
          ),
        },

        {
          title: "Cookie Consent",
          content: (
            <>
              <P>
                By using Class Pilot, you consent to our use of essential cookies which are
                strictly necessary to provide the Service. For functional and analytics cookies,
                we rely on your continued use of the Service as implied consent.
              </P>
              <P>
                If you are located in the EU or UK and would like to withdraw consent for
                non-essential cookies, you can do so by clearing cookies in your browser
                settings at any time. This does not affect the lawfulness of any processing
                carried out before withdrawal.
              </P>
            </>
          ),
        },

        {
          title: "Changes to This Policy",
          content: (
            <>
              <P>
                We may update this Cookie Policy from time to time to reflect changes in the
                cookies we use or for legal and regulatory reasons. When we do, we will update
                the "Last updated" date at the top of this page.
              </P>
              <P>
                If you have any questions about our use of cookies, please contact us at{" "}
                <A href="mailto:classpilot.edu@gmail.com">classpilot.edu@gmail.com</A>.
              </P>
            </>
          ),
        },

      ]}
    />
  );
}