// app/robots.js
// Next.js auto-generates /robots.txt from this file.
// Tells Google to crawl everything and where the sitemap is.

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://taxdcal.co.uk/sitemap.xml',
    host: 'https://taxdcal.co.uk',
  };
}
