import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help Center",
  description: "Search for answers or browse by topic. We're here to help you get the most out of Class Pilot.",
};

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
