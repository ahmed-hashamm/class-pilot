// 

import { Linkedin, Github, GraduationCap } from "lucide-react";

// ── Footer Component ──────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "How It Works", href: "/how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
  { label: "Help Center", href: "/help" },
];

const LEGAL_LINKS = [
  { label: "Terms & Privacy", href: "/terms" },
  { label: "Cookie Policy", href: "/cookies" },
  { label: "Accessibility", href: "/accessibility" },
];

const SOCIAL_LINKS = [
  {
    href: "https://github.com/ahmed-hashamm",
    label: "GitHub",
    icon: <Github size={17} />,
  },
  {
    href: "https://www.linkedin.com/in/hasham-ahmed-dev",
    label: "LinkedIn",
    icon: <Linkedin size={17} />,
  },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy text-primary-foreground">
      {/* ── Top section ── */}
      <div className="w-full max-w-[1600px] mx-auto px-8 md:px-12 lg:px-16 py-10 lg:py-20  lg:pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 mb-8">

          {/* Brand */}
          <div className="flex flex-col gap-3 col-span-2">
            <a href="/" className="flex items-center gap-2 text-primary-foreground font-semibold text-lg">
              <GraduationCap size={22} className="text-accent" />
              Class Pilot
            </a>
            <p className="text-sm text-primary-foreground/60 leading-relaxed max-w-xs">
              AI-powered lesson planning and classroom tools — built by teachers, for teachers.
            </p>
          </div>

          {/* Product links */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/40 mb-1">
              Product
            </p>
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className="text-sm text-primary-foreground/70 hover:text-accent transition-colors w-fit"
              >
                {label}
              </a>
            ))}
          </div>

          {/* Legal links */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/40 mb-1">
              Legal
            </p>
            {LEGAL_LINKS.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className="text-sm text-primary-foreground/70 hover:text-accent transition-colors w-fit"
              >
                {label}
              </a>
            ))}
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/40 mb-1">
              Connect
            </p>
            <a
              href="mailto:support@theclasspilot.com"
              className="text-sm text-primary-foreground/70 hover:text-accent transition-colors w-fit"
            >
              support@theclasspilot.com
            </a>
            <a
              href="/contact"
              className="text-sm text-primary-foreground/70 hover:text-accent transition-colors w-fit"
            >
              Contact Us
            </a>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="border-t border-primary-foreground/10" />

        {/* ── Bottom bar ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5">
          <p className="text-xs text-primary-foreground/40">
            © {year} Class Pilot. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            {SOCIAL_LINKS.map(({ href, label, icon }) => (
              <a
                key={href}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/50 hover:text-accent transition-colors"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
