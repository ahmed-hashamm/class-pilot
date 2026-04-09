"use client";

import LegalPageLayout, { P, UL, LI, A, Strong, Section } from "@/components/layout/LegalPageLayout";
import { TERMS_SECTIONS, PRIVACY_SECTIONS } from "@/lib/data/marketing/terms";
import React from "react";

interface MarketingDataSection {
  title: string;
  intro?: string;
  paragraphs?: string[];
  list?: string[];
  paragraphsAfter?: string[];
  footer?: string;
}

/**
 * Helper to render text with **bold** markers
 */
function formatText(text: string) {
  if (!text.includes("**")) return text;
  return text.split("**").map((part, i) => (
    i % 2 === 1 ? <Strong key={i}>{part}</Strong> : part
  ));
}

/**
 * Helper to render sections from data
 */
function renderDataSections(data: MarketingDataSection[]): Section[] {
  return data.map((section) => ({
    title: section.title,
    content: (
      <React.Fragment>
        {section.intro && <P>{section.intro}</P>}
        {section.paragraphs && section.paragraphs.map((p, idx) => (
          <P key={idx}>{formatText(p)}</P>
        ))}
        {section.list && (
          <UL>
            {section.list.map((item, idx) => (
              <LI key={idx}>{formatText(item)}</LI>
            ))}
          </UL>
        )}
        {section.paragraphsAfter && section.paragraphsAfter.map((p, idx) => (
          <P key={idx}>{formatText(p)}</P>
        ))}
        {section.footer && (
          <P>{formatText(section.footer)}</P>
        )}
      </React.Fragment>
    ),
  }));
}

export default function TermsAndPrivacyPage() {
  const termsSections = renderDataSections(TERMS_SECTIONS);
  const privacySections = renderDataSections(PRIVACY_SECTIONS);

  return (
    <LegalPageLayout
      badge="Legal"
      title="Terms & Privacy"
      subtitle="The legal framework that keeps Class Pilot safe and private for everyone."
      lastUpdated="March 2026"
      sections={[
        ...termsSections,
        ...privacySections,
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
