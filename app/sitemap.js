// app/sitemap.js
// Auto-generates /sitemap.xml — submit URL to Google Search Console
// taxdcal.co.uk/sitemap.xml

export default function sitemap() {
  const base = 'https://taxdcal.co.uk';
  const now = new Date();

  const calculators = [
    { url: base,                                      priority: 1.0, freq: 'monthly' },
    { url: base + '/ir35',                            priority: 0.9, freq: 'monthly' },
    { url: base + '/nhs',                             priority: 0.9, freq: 'monthly' },
    { url: base + '/maternity',                       priority: 0.8, freq: 'monthly' },
    { url: base + '/hourly',                          priority: 0.8, freq: 'monthly' },
    { url: base + '/bonus',                           priority: 0.8, freq: 'monthly' },
    { url: base + '/sacrifice',                       priority: 0.8, freq: 'monthly' },
    { url: base + '/comparison',                      priority: 0.7, freq: 'monthly' },
    { url: base + '/tools',                           priority: 0.7, freq: 'monthly' },
    { url: base + '/part-time-salary-calculator',     priority: 0.8, freq: 'monthly' },
    { url: base + '/maternity-pay-self-employed',     priority: 0.8, freq: 'yearly'  },
    { url: base + '/nhs-pay-guide',                   priority: 0.85, freq: 'yearly' },
    { url: base + '/teacher-pay-guide',               priority: 0.85, freq: 'yearly' },
  ];

  const blogPages = [
    { url: base + '/blog',                                                    priority: 0.8, freq: 'weekly' },
    { url: base + '/blog/how-uk-income-tax-brackets-work',                   priority: 0.8, freq: 'yearly' },
    { url: base + '/blog/national-insurance-explained',                      priority: 0.8, freq: 'yearly' },
    { url: base + '/blog/pension-tax-relief-your-free-money',                priority: 0.8, freq: 'yearly' },
    { url: base + '/blog/2026-27-tax-year-changes-uk',                       priority: 0.9, freq: 'yearly' },
    { url: base + '/blog/45000-salary-take-home-uk-2026',                    priority: 0.9, freq: 'yearly' },
    { url: base + '/blog/50000-salary-after-tax-uk-2026',                    priority: 0.9, freq: 'yearly' },
    { url: base + '/blog/40000-salary-after-tax-uk-2026',                    priority: 0.9, freq: 'yearly' },
    { url: base + '/blog/30000-salary-take-home-pay-uk-2026',                priority: 0.9, freq: 'yearly' },
    { url: base + '/blog/nhs-band-5-take-home-pay-2026',                     priority: 0.9, freq: 'yearly' },
    { url: base + '/blog/minimum-wage-take-home-pay-2026',                   priority: 0.9, freq: 'yearly' },
    { url: base + '/blog/ir35-inside-outside-calculator-2026',               priority: 0.9, freq: 'yearly' },
    { url: base + '/blog/salary-sacrifice-electric-car-uk-2026',             priority: 0.8, freq: 'yearly' },
    { url: base + '/blog/60-percent-tax-trap',                               priority: 0.9, freq: 'yearly' },
    { url: base + '/blog/hicbc-child-benefit-charge',                        priority: 0.9, freq: 'yearly' },
    { url: base + '/blog/personal-allowance-taper-100k',                     priority: 0.9, freq: 'yearly' },
    { url: base + '/blog/plan-5-student-loan-take-home',                     priority: 0.9, freq: 'yearly' },
  ];

  const salaryAmounts = [
    20000,22000,25000,27000,28000,30000,32000,35000,38000,40000,
    42000,45000,48000,50000,55000,60000,65000,70000,75000,80000,
    85000,90000,95000,100000,105000,110000,120000,125000,150000,
  ];
  const salaryPages = salaryAmounts.map(s => ({
    url: base + '/' + s + '-salary-take-home', priority: 0.85, freq: 'yearly',
  }));

  const specialPages = [
    { url: base + '/minimum-wage-take-home',          priority: 0.85, freq: 'yearly' },
    { url: base + '/nhs-band-5-take-home',            priority: 0.85, freq: 'yearly' },
    { url: base + '/nhs-band-6-take-home',            priority: 0.85, freq: 'yearly' },
    { url: base + '/nhs-band-7-take-home',            priority: 0.80, freq: 'yearly' },
    { url: base + '/teacher-salary-take-home',        priority: 0.80, freq: 'yearly' },
    { url: base + '/graduate-salary-take-home',       priority: 0.80, freq: 'yearly' },
  ];

  return [...calculators, ...blogPages, ...salaryPages, ...specialPages].map(p => ({
    url: p.url,
    lastModified: now,
    changeFrequency: p.freq,
    priority: p.priority,
  }));
}
