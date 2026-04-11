import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import QueryProvider from "@/components/providers/QueryProvider";
import { Toaster } from 'sonner';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://theclasspilot.com"),
  title: {
    default: "Class Pilot - AI-Powered Classroom Management",
    template: "%s | Class Pilot",
  },
  description: "A comprehensive e-classroom platform with AI-powered grading, real-time discussions, and seamless assignment management.",
  openGraph: {
    title: "Class Pilot - AI-Powered Classroom Management",
    description: "A comprehensive e-classroom platform with AI-powered grading, real-time discussions, and seamless assignment management.",
    url: "/",
    siteName: "Class Pilot",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Class Pilot Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Class Pilot - AI-Powered Classroom Management",
    description: "AI-Powered Classroom Management for modern education.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <AuthProvider>
            {children}
            <Toaster position="bottom-right" richColors />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
