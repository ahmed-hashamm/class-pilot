import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How we use cookies and similar technologies to improve your experience on Class Pilot.",
};

export default function CookiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
