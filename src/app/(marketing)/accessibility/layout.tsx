import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description: "Our commitment to making Class Pilot accessible to everyone.",
};

export default function AccessibilityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
