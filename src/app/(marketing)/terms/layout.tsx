import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Privacy",
  description: "The legal framework that keeps Class Pilot safe and private for everyone.",
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
