/**
 * COOKIE POLICY DATA
 * Source: src/app/(marketing)/cookies/page.tsx
 */

export interface CookieItem {
  name: string;
  purpose: string;
}

export interface CookieGroup {
  type: string;
  colour: string;
  desc: string;
  items: CookieItem[];
}

export const COOKIE_GROUPS: CookieGroup[] = [
  {
    type: "Essential",
    colour: "bg-navy text-white",
    desc: "Required for the Service to function. Cannot be disabled.",
    items: [
      { name: "sb-access-token", purpose: "Securely authenticates your session and keeps you logged in across page loads. Managed by Supabase." },
      { name: "sb-refresh-token", purpose: "Maintains your authenticated session over time without requiring frequent log-ins. Managed by Supabase." },
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
];

export const BROWSER_LINKS = [
  { label: "Google Chrome", url: "https://support.google.com/chrome/answer/95647" },
  { label: "Mozilla Firefox", url: "https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox" },
  { label: "Safari", url: "https://support.apple.com/en-gb/guide/safari/sfri11471/mac" },
  { label: "Microsoft Edge", url: "https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" },
];
