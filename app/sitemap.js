// app/sitemap.js
// Next.js auto-generates /sitemap.xml from this file.
// Submit taxdcal.co.uk/sitemap.xml to Google Search Console.

export default function sitemap() {
  const base = 'https://taxdcal.co.uk';
  const now = new Date();

  // Core calculator pages — these need separate URL routes first
  // (see checklist: "Convert to proper URL routing")
  const calculators = [
    { url: `${base}`,             priority: 1.0,  changeFrequency: 'monthly' },
    { url: `${base}/ir35`,        priority: 0.9,  changeFrequency: 'monthly' },
    { url: `${base}/nhs`,         priority: 0.9,  changeFrequency: 'monthly' },
    { url: `${base}/maternity`,   priority: 0.8,  changeFrequency: 'monthly' },
    { url: `${base}/hourly`,      priority: 0.8,  changeFrequency: 'monthly' },
    { url: `${base}/bonus`,       priority: 0.8,  changeFrequency: 'monthly' },
    { url: `${base}/sacrifice`,   priority: 0.8,  changeFrequency: 'monthly' },
    { url: `${base}/comparison`,  priority: 0.7,  changeFrequency: 'monthly' },
    { url: `${base}/tools`,       priority: 0.7,  changeFrequency: 'monthly' },
  ];

  // Blog index and articles
  const blog = [
    { url: `${base}/blog`,        priority: 0.8,  changeFrequency: 'weekly' },
    { url: `${base}/blog/how-uk-income-tax-brackets-work`,   priority: 0.7, changeFrequency: 'yearly' },
    { url: `${base}/blog/national-insurance-explained`,       priority: 0.7, changeFrequency: 'yearly' },
    { url: `${base}/blog/pension-tax-relief-your-free-money`, priority: 0.7, changeFrequency: 'yearly' },
    { url: `${base}/blog/2026-27-tax-year-changes-uk`,        priority: 0.8, changeFrequency: 'yearly' },
  ];

  return [...calculators, ...blog].map(page => ({
    url: page.url,
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
