import type { Metadata } from "next";
import { Bitcount_Grid_Double, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bitCount = Bitcount_Grid_Double({
  variable: "--font-bitcount",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Performativ Dashboard",
  description:
    "A simplified financial dashboard for managing transactions, tracking performance, and viewing holdings, built with Next.js, React, and Tailwind CSS.",
  keywords: [
    "Next.js",
    "React",
    "Tailwind CSS",
    "TypeScript",
    "Financial Dashboard",
    "Portfolio Management",
    "Frontend Challenge",
    "Performativ",
  ],
  authors: [{ name: "Kim Fajardo", url: "https://www.devkpf.com" }],
  creator: "Kim Fajardo",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  metadataBase: new URL("https://performativ-dashboard.vercel.app"),
  openGraph: {
    title: "Performativ Dashboard",
    description:
      "A portfolio management dashboard challenge for Performativ. View transactions, analyze performance, and explore asset holdings.",
    url: "https://performativ-dashboard.vercel.app",
    siteName: "Performativ Dashboard",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Performativ Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Performativ Dashboard",
    description:
      "Manage transactions, view holdings, and analyze performance data using a clean React + Next.js UI.",
    images: ["/og-image.png"],
    creator: "@yourhandle", // optional
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
        className={`${geistSans.variable} ${geistMono.variable} ${bitCount.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light">
          {children}
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
