import type { NextConfig } from "next";

// GitHub Pages static export mode (set via DEPLOY_TARGET env var in CI).
// When enabled, we export a fully static site (no server, no API routes)
// that can be hosted on GitHub Pages, Netlify, or any static host.
// basePath must match the public repo name where the static site is deployed.
const isStaticExport = process.env.DEPLOY_TARGET === "github-pages";
const basePath = isStaticExport ? "/capimind-web" : "";

const LEGACY_WORDPRESS_PATHS = [
  "/hello-world",
  "/hello-world/",
  "/sample-page",
  "/sample-page/",
  "/reservation",
  "/reservation/",
  "/contact",
  "/contact/",
  "/des-outils-pedagogiques",
  "/des-outils-pedagogiques/",
  "/blog",
  "/blog/",
  "/wp-admin",
  "/wp-login.php",
  "/category",
  "/tag",
  "/author",
];

const nextConfig: NextConfig = {
  // Static export for GitHub Pages; standalone server for Vercel/self-hosting.
  output: isStaticExport ? "export" : "standalone",
  // basePath is required for GitHub Pages project sites (served from /CapiMind/).
  basePath,
  assetPrefix: isStaticExport ? `${basePath}/` : undefined,
  // Static export cannot use the Next.js image optimization server.
  images: isStaticExport ? { unoptimized: true } : undefined,
  // Trailing slashes make GitHub Pages routing more reliable.
  trailingSlash: isStaticExport,
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // 301-redirect every legacy WordPress URL to the homepage. A 301 (permanent)
  // is the fastest signal to Google to drop the old URL from its index and
  // consolidate ranking signals onto the canonical homepage.
  // (Skipped in static-export mode — redirects require a server.)
  async redirects() {
    if (isStaticExport) return [];
    return [
      // Catch-all for any path starting with /blog/ (e.g. /blog/post-slug)
      {
        source: "/blog/:path*",
        destination: "/",
        permanent: true,
      },
      // Catch-all for /category/, /tag/, /author/ archives
      {
        source: "/category/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/tag/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/author/:path*",
        destination: "/",
        permanent: true,
      },
      // Date-based archives (e.g. /2024/06/hello-world)
      {
        source: "/:year(\\d{4})/:path*",
        destination: "/",
        permanent: true,
      },
      // WordPress admin & login
      {
        source: "/wp-admin/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/wp-content/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/wp-includes/:path*",
        destination: "/",
        permanent: true,
      },
      // Static legacy paths
      ...LEGACY_WORDPRESS_PATHS.filter(
        (p) => !p.includes(":path") && !p.endsWith("/")
      ).map((source) => ({
        source,
        destination: "/",
        permanent: true,
      })),
      // Catch p= query parameter (WordPress permalink ?p=123)
      {
        source: "/",
        has: [
          {
            type: "query",
            key: "p",
          },
        ],
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
