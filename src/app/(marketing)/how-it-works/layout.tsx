import { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works",
  description: "See how Class Pilot simplifies classroom management with AI-powered grading and real-time collaboration.",
};

export default function HowItWorksLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
