"use client";

import LegalPageLayout, { P, UL, LI, A, Strong, Section } from "@/components/layout/LegalPageLayout";
import { ACCESSIBILITY_SECTIONS } from "@/lib/data/marketing/accessibility";
import React from "react";

/**
 * Helper to render sections from data with simple markdown-like support
 */
function renderContent(text: string) {
  // Simple Link support [text](url)
  const linkRegex = /\[(.*?)\]\((.*?)\)/g;
  const parts = text.split(linkRegex);
  
  if (parts.length === 1) {
    // Basic Strong support **text**
    return text.includes('**') 
      ? text.split('**').map((part, i) => i % 2 === 1 ? <Strong key={i}>{part}</Strong> : part) 
      : text;
  }

  const result = [];
  for (let i = 0; i < parts.length; i++) {
    if (i % 3 === 0) {
      const p = parts[i];
      result.push(p.includes('**') 
        ? p.split('**').map((part, j) => j % 2 === 1 ? <Strong key={`${i}-${j}`}>{part}</Strong> : part) 
        : p);
    } else if (i % 3 === 1) {
      result.push(<A key={i} href={parts[i+1]}>{parts[i]}</A>);
      i++; // skip url part
    }
  }
  return result;
}

function renderDataSections(data: any[]): Section[] {
  return data.map((section) => ({
    title: section.title,
    content: (
      <React.Fragment>
        {section.intro && <P>{renderContent(section.intro)}</P>}
        {section.paragraphs && section.paragraphs.map((p: string, idx: number) => (
          <P key={idx}>{renderContent(p)}</P>
        ))}
        {section.list && (
          <UL>
            {section.list.map((item: string, idx: number) => (
              <LI key={idx}>{renderContent(item)}</LI>
            ))}
          </UL>
        )}
        {section.footer && <P>{renderContent(section.footer)}</P>}
      </React.Fragment>
    ),
  }));
}

export default function AccessibilityPage() {
  const sections = renderDataSections(ACCESSIBILITY_SECTIONS);

  return (
    <LegalPageLayout
      badge="Accessibility"
      title="Accessibility Statement"
      subtitle="Class Pilot is committed to making education technology accessible to every teacher and student, regardless of ability."
      lastUpdated="March 2026"
      sections={[
        ...sections,
        {
          title: "Feedback & Contact",
          content: (
            <>
              <P>
                We welcome feedback on the accessibility of Class Pilot. If you experience
                any barriers, notice something that doesn't work with your assistive technology,
                or have a suggestion for improvement, please let us know.
              </P>
              <UL>
                <LI>Email: <A href="mailto:support@theclasspilot.com">support@theclasspilot.com</A></LI>
                <LI>Contact form: <A href="/contact">classpilot.edu/contact</A></LI>
              </UL>
              <P>
                We aim to respond to accessibility feedback within <Strong>2 business days</Strong>.
                If you need content in an alternative format, we will do our best to accommodate
                your request.
              </P>
            </>
          ),
        },
      ]}
    />
  );
}
