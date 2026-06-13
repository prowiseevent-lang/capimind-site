import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CapiMind - Designed for Exceptional Minds",
  description: "Plateforme de formation e-learning premium au Maroc. IA, Data Analytics, Cybersécurité, Business et plus encore. Designed for Exceptional Minds.",
  keywords: ["Formation", "E-learning", "IA", "Data Analytics", "Cybersécurité", "Business", "Maroc", "CapiMind"],
  authors: [{ name: "CapiMind" }],
  icons: {
    icon: "/images/logo.jpg",
  },
  openGraph: {
    title: "CapiMind - Designed for Exceptional Minds",
    description: "Investissez dans votre avenir avec nos formations premium en IA, data, cybersécurité et business.",
    siteName: "CapiMind",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CapiMind - Designed for Exceptional Minds",
    description: "Investissez dans votre avenir avec nos formations premium",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
