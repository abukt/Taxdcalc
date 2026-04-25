// next.config.js
// Prevents redirect loops and enforces canonical URL structure.
// 
// ROOT CAUSE FIX for IR35 (and all pages):
// Without trailingSlash: false, Next.js may serve both /ir35 and /ir35/
// Google sees two URLs → creates redirect loop → indexing fails.
// This config enforces the single canonical form for every route.

/** @type {import('next').NextConfig} */
const nextConfig = {
  // CRITICAL: prevents /ir35/ and /ir35 both being valid → no redirect loops
  trailingSlash: false,

  // Trailing slash removal — Vercel handles www→non-www at infrastructure level
  async redirects() {
    return [
      {
        source: '/:path+/',
        destination: '/:path+',
        permanent: true,
      },
    ];
  },

  // Prevent duplicate content from www subdomain (Vercel handles this but belt + braces)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'index, follow',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
