"use client";

import LegalPageLayout, { P, UL, LI, A, Strong } from "@/components/layout/LegalPageLayout";
import { CookieGroup } from "@/components/features/marketing";
import { COOKIE_GROUPS, BROWSER_LINKS } from "@/lib/data/marketing/cookies";

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
                {COOKIE_GROUPS.map((group) => (
                  <CookieGroup key={group.type} group={group} />
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
                {BROWSER_LINKS.map(link => (
                  <LI key={link.label}><A href={link.url}>{link.label}</A></LI>
                ))}
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
                settings at any time.
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
                cookies we use or for legal and regulatory reasons.
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
