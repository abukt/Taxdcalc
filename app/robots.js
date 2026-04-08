// app/robots.js
// Next.js auto-generates /robots.txt from this file.
// Tells Google to crawl everything and where the sitemap is.

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://taxdcalc.co.uk/sitemap.xml',
    host: 'https://taxdcalc.co.uk',
  };
}
