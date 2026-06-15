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
  title: "CapiMind - Plateforme de Formation E-Learning Premium au Maroc",
  description: "CapiMind est la plateforme de formation premium au Maroc et en Afrique qui accompagne les professionnels ambitieux dans leur transformation digitale. Intelligence Artificielle, Data, Cybersécurité, Business et Innovation : développez les compétences les plus recherchées du marché aux côtés d'experts reconnus et donnez un nouvel élan à votre carrière.",
  keywords: ["CapiMind", "formation", "e-learning", "Maroc", "Afrique", "IA", "intelligence artificielle", "data analytics", "cybersécurité", "business", "innovation", "leadership", "certification", "formation en ligne", "formation professionnelle", "transformation digitale"],
  authors: [{ name: "CapiMind" }],
  icons: {
    icon: "/images/logo.webp",
  },
  openGraph: {
    title: "CapiMind - Plateforme de Formation E-Learning Premium au Maroc",
    description: "CapiMind est la plateforme de formation premium au Maroc et en Afrique qui accompagne les professionnels ambitieux dans leur transformation digitale. IA, Data, Cybersécurité, Business et Innovation : développez les compétences les plus recherchées du marché.",
    siteName: "CapiMind",
    type: "website",
    url: "https://capimind.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "CapiMind - Plateforme de Formation E-Learning Premium au Maroc",
    description: "CapiMind est la plateforme de formation premium au Maroc et en Afrique. IA, Data, Cybersécurité, Business et Innovation : développez les compétences les plus recherchées.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://capimind.com",
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
