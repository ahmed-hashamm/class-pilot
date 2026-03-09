// 

import { Twitter, Facebook, Linkedin, GraduationCap } from "lucide-react";


// ── Footer Component ──────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "How It Works", href: "/how-it-works" },
  { label: "Pricing",       href: "/pricing" },
  { label: "Blog",          href: "/blog" },
  { label: "Help Center",   href: "/help" },
];

const LEGAL_LINKS = [
  { label: "Terms & Privacy", href: "/terms" },
  { label: "Cookie Policy",   href: "/cookies" },
  { label: "Accessibility",   href: "/accessibility" },
];

const SOCIAL_LINKS = [
  {
    href: "https://facebook.com/classpilot",
    label: "Facebook",
    icon: <Facebook size={17} />,
  },
  {
    href: "https://twitter.com/classpilot",
    label: "Twitter / X",
    icon: <Twitter size={17} />,
  },
  {
    href: "https://linkedin.com/company/classpilot",
    label: "LinkedIn",
    icon: <Linkedin size={17} />,
  },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy text-primary-foreground">
      {/* ── Top section ── */}
      <div className="container mx-auto px-6 pt-10 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

          {/* Brand */}
          <div className="flex flex-col gap-3">
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

          {/* Contact / Social */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/40 mb-1">
              Connect
            </p>
            <a
              href="mailto:classpilot.edu@gmail.com"
              className="text-sm text-primary-foreground/70 hover:text-accent transition-colors w-fit"
            >
              classpilot.edu@gmail.com
            </a>
            <a
              href="/contact"
              className="text-sm text-primary-foreground/70 hover:text-accent transition-colors w-fit"
            >
              Contact Us
            </a>

            {/* Social icons */}
            <div className="flex items-center gap-3 mt-2">
              {SOCIAL_LINKS.map(({ href, label, icon }) => (
                <a
                  key={href}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-foreground/60 hover:text-accent transition-colors"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="border-t border-primary-foreground/10" />

        {/* ── Bottom bar ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5">
          <p className="text-xs text-primary-foreground/40">
            © {year} Class Pilot. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {LEGAL_LINKS.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className="text-xs text-primary-foreground/50 hover:text-accent transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;