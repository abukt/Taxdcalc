// app/sitemap.js
// Next.js auto-generates /sitemap.xml from this file.
// Submit taxdcal.co.uk/sitemap.xml to Google Search Console.

export default function sitemap() {
  const base = 'https://taxdcal.co.uk';
  const now = new Date();

  const calculators = [
    { url: base,                      priority: 1.0, changeFrequency: 'monthly' },
    { url: base + '/ir35',            priority: 0.9, changeFrequency: 'monthly' },
    { url: base + '/nhs',             priority: 0.9, changeFrequency: 'monthly' },
    { url: base + '/maternity',       priority: 0.8, changeFrequency: 'monthly' },
    { url: base + '/hourly',          priority: 0.8, changeFrequency: 'monthly' },
    { url: base + '/bonus',           priority: 0.8, changeFrequency: 'monthly' },
    { url: base + '/sacrifice',       priority: 0.8, changeFrequency: 'monthly' },
    { url: base + '/comparison',      priority: 0.7, changeFrequency: 'monthly' },
    { url: base + '/tools',           priority: 0.7, changeFrequency: 'monthly' },
  ];

  // Original 4 blog articles
  const blogOriginal = [
    { url: base + '/blog',                                          priority: 0.8, changeFrequency: 'weekly' },
    { url: base + '/blog/how-uk-income-tax-brackets-work',         priority: 0.8, changeFrequency: 'yearly' },
    { url: base + '/blog/national-insurance-explained',            priority: 0.8, changeFrequency: 'yearly' },
    { url: base + '/blog/pension-tax-relief-your-free-money',      priority: 0.8, changeFrequency: 'yearly' },
    { url: base + '/blog/2026-27-tax-year-changes-uk',             priority: 0.9, changeFrequency: 'yearly' },
  ];

  // 8 new SEO blog articles
  const blogNew = [
    { url: base + '/blog/45000-salary-take-home-uk-2026',          priority: 0.9, changeFrequency: 'yearly' },
    { url: base + '/blog/50000-salary-after-tax-uk-2026',          priority: 0.9, changeFrequency: 'yearly' },
    { url: base + '/blog/40000-salary-after-tax-uk-2026',          priority: 0.9, changeFrequency: 'yearly' },
    { url: base + '/blog/30000-salary-take-home-pay-uk-2026',      priority: 0.9, changeFrequency: 'yearly' },
    { url: base + '/blog/nhs-band-5-take-home-pay-2026',           priority: 0.9, changeFrequency: 'yearly' },
    { url: base + '/blog/minimum-wage-take-home-pay-2026',         priority: 0.9, changeFrequency: 'yearly' },
    { url: base + '/blog/ir35-inside-outside-calculator-2026',     priority: 0.9, changeFrequency: 'yearly' },
    { url: base + '/blog/salary-sacrifice-electric-car-uk-2026',   priority: 0.8, changeFrequency: 'yearly' },
  ];

  // Dynamic salary pages
  const salaryAmounts = [
    20000,22000,25000,27000,28000,30000,32000,35000,38000,40000,
    42000,45000,48000,50000,55000,60000,65000,70000,75000,80000,
    85000,90000,95000,100000,110000,120000,125000,150000
  ];
  const salaryPages = salaryAmounts.map(s => ({
    url: base + '/' + s + '-salary-take-home',
    priority: 0.85,
    changeFrequency: 'yearly',
  }));

  // Special salary pages
  const specialPages = [
    { url: base + '/minimum-wage-take-home',    priority: 0.85, changeFrequency: 'yearly' },
    { url: base + '/nhs-band-5-take-home',      priority: 0.85, changeFrequency: 'yearly' },
    { url: base + '/nhs-band-6-take-home',      priority: 0.85, changeFrequency: 'yearly' },
    { url: base + '/nhs-band-7-take-home',      priority: 0.80, changeFrequency: 'yearly' },
    { url: base + '/teacher-salary-take-home',  priority: 0.80, changeFrequency: 'yearly' },
    { url: base + '/graduate-salary-take-home', priority: 0.80, changeFrequency: 'yearly' },
  ];

  return [...calculators, ...blogOriginal, ...blogNew, ...salaryPages, ...specialPages].map(page => ({
    url: page.url,
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
