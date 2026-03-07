// src/app/how-it-works/layout.tsx
import Navbar from "@/components/layout/Navbar";   // adjust path to match yours
import Footer from "@/components/layout/Footer";   // adjust path to match yours

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}