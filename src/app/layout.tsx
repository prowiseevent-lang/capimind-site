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

const SITE_URL = "https://capimind.com";
const SITE_TITLE =
  "CapiMind - Plateforme de Formation E-Learning Premium au Maroc";
const SITE_DESCRIPTION =
  "CapiMind est la plateforme de formation premium au Maroc et en Afrique qui accompagne les professionnels ambitieux dans leur transformation digitale. Intelligence Artificielle, Data, Cybersécurité, Business et Innovation : développez les compétences les plus recherchées du marché aux côtés d'experts reconnus et donnez un nouvel élan à votre carrière.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | CapiMind",
  },
  description: SITE_DESCRIPTION,
  applicationName: "CapiMind",
  keywords: [
    "CapiMind",
    "formation",
    "e-learning",
    "Maroc",
    "Afrique",
    "IA",
    "intelligence artificielle",
    "data analytics",
    "cybersécurité",
    "business",
    "innovation",
    "leadership",
    "certification",
    "formation en ligne",
    "formation professionnelle",
    "transformation digitale",
    "bootcamp",
    "PMP",
    "Agile",
    "Scrum",
    "SAP",
    "Odoo",
    "HubSpot",
    "Salesforce",
    "coaching",
    "VAE",
  ],
  authors: [{ name: "CapiMind" }],
  creator: "CapiMind",
  publisher: "CapiMind",
  category: "education",
  icons: {
    icon: [
      { url: "/images/logo.webp", type: "image/webp" },
      { url: "/images/logo.png", type: "image/png" },
    ],
    apple: "/images/logo.png",
  },
  manifest: undefined,
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: SITE_TITLE,
    description:
      "CapiMind est la plateforme de formation premium au Maroc et en Afrique qui accompagne les professionnels ambitieux dans leur transformation digitale. IA, Data, Cybersécurité, Business et Innovation : développez les compétences les plus recherchées du marché.",
    siteName: "CapiMind",
    type: "website",
    url: SITE_URL,
    locale: "fr_FR",
    images: [
      {
        url: "/images/hero-banner.png",
        width: 2816,
        height: 1374,
        alt: "CapiMind — Plateforme de formation e-learning premium au Maroc",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description:
      "CapiMind est la plateforme de formation premium au Maroc et en Afrique. IA, Data, Cybersécurité, Business et Innovation : développez les compétences les plus recherchées.",
    images: ["/images/hero-banner.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // Google Search Console verification placeholder. Replace `google-site-verification`
  // value with the token Google gives you in Search Console → Settings → Ownership verification.
  verification: {
    google: "google-site-verification=capimind-verification",
  },
};

// JSON-LD structured data for Organization — helps Google understand the entity
// and powers the knowledge panel.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "@id": `${SITE_URL}#organization`,
  name: "CapiMind",
  alternateName: "CapiMind E-Learning",
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo.png`,
  image: `${SITE_URL}/images/hero-banner.png`,
  description: SITE_DESCRIPTION,
  foundingDate: "2024",
  areaServed: [
    { "@type": "Country", name: "Maroc" },
    { "@type": "Continent", name: "Afrique" },
    { "@type": "Place", name: "Europe" },
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Marrakech",
    addressCountry: "MA",
  },
  sameAs: [
    "https://www.facebook.com/capimind",
    "https://www.instagram.com/capimind",
    "https://www.linkedin.com/company/capimind",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    telephone: "+212786249306",
    availableLanguage: ["French", "English", "Arabic"],
  },
};

// JSON-LD for the Website itself
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}#website`,
  url: SITE_URL,
  name: "CapiMind",
  publisher: { "@id": `${SITE_URL}#organization` },
  inLanguage: "fr-FR",
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
