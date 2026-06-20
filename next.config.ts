import type { NextConfig } from "next";

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
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // 301-redirect every legacy WordPress URL to the homepage. A 301 (permanent)
  // is the fastest signal to Google to drop the old URL from its index and
  // consolidate ranking signals onto the canonical homepage.
  async redirects() {
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
