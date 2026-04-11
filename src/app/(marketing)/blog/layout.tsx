import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Teaching tips, AI in education, product news, and study strategies.",
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
