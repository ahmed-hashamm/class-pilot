import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, honest classroom tools. Class Pilot is currently free for all teachers and students.",
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
