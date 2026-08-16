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
      { url: "/favicon-48x48.png", type: "image/png", sizes: "48x48" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon.ico", type: "image/x-icon", sizes: "32x32" },
    ],
    apple: "/apple-touch-icon.png",
    other: [
      { url: "/android-chrome-192x192.png", type: "image/png", sizes: "192x192" },
      { url: "/android-chrome-512x512.png", type: "image/png", sizes: "512x512" },
    ],
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
        url: "/images/og-logo.png",
        width: 1200,
        height: 630,
        alt: "CapiMind — Plateforme de formation e-learning premium au Maroc",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description:
      "CapiMind est la plateforme de formation premium au Maroc et en Afrique. IA, Data, Cybersécurité, Business et Innovation : développez les compétences les plus recherchées.",
    images: ["/images/og-logo.png"],
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

// JSON-LD for the site navigation — explicitly declares the 6 main sections
// so Google can generate the correct sitelinks (À propos, Formations, Services,
// Pourquoi nous, FAQ, Contact) instead of the legacy WordPress pages.
const navigationSections = [
  { name: "À propos", url: `${SITE_URL}/#about` },
  { name: "Formations", url: `${SITE_URL}/#courses` },
  { name: "Services", url: `${SITE_URL}/#services` },
  { name: "Pourquoi nous", url: `${SITE_URL}/#features` },
  { name: "FAQ", url: `${SITE_URL}/#faq` },
  { name: "Contact", url: `${SITE_URL}/#contact` },
];

const siteNavigationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SiteNavigationElement",
  name: navigationSections.map((s) => s.name),
  url: navigationSections.map((s) => s.url),
};

// JSON-LD for BreadcrumbList — reinforces the site structure for Google.
const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Accueil",
      item: SITE_URL,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Formations",
      item: `${SITE_URL}/#courses`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Services",
      item: `${SITE_URL}/#services`,
    },
    {
      "@type": "ListItem",
      position: 4,
      name: "Contact",
      item: `${SITE_URL}/#contact`,
    },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNavigationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
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
