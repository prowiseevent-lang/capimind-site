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
  title: 'CapiMind - Plateforme de Formation E-Learning Premium au Maroc',
  description: 'CapiMind est la plateforme de formation e-learning premium au Maroc. Formations certifiantes en IA, Data Analytics, Cybersécurité, Business, Leadership et plus encore. Designed for Exceptional Minds.',
  keywords: ['CapiMind', 'formation', 'e-learning', 'Maroc', 'IA', 'intelligence artificielle', 'data analytics', 'cybersécurité', 'business', 'leadership', 'certification', 'formation en ligne', 'formation professionnelle'],
  authors: [{ name: "CapiMind" }],
  icons: {
    icon: "/images/logo.webp",
  },
  openGraph: {
    title: 'CapiMind - Plateforme de Formation E-Learning Premium au Maroc',
    description: 'Investissez dans votre avenir avec nos formations premium en IA, Data Analytics, Cybersécurité et Business. 10+ formations certifiantes, 8K+ étudiants.',
    siteName: 'CapiMind',
    type: 'website',
    url: 'https://capimind.com',
  },
  twitter: {
    card: "summary_large_image",
    title: 'CapiMind - Plateforme de Formation E-Learning Premium au Maroc',
    description: 'Investissez dans votre avenir avec nos formations premium en IA, Data Analytics, Cybersécurité et Business.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://capimind.com',
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
