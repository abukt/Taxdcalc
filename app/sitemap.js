import { ARTICLES } from './blog/[slug]/page'; // Adjust path if your file is named differently

export default async function sitemap() {
  const base = 'https://www.taxdcal.co.uk';

  // 1. CORE PAGES (Static)
  const corePaths = [
    '',
    '/ir35',
    '/nhs',
    '/tools',
    '/blog',
    '/sacrifice',
    '/hourly',
    '/maternity',
    '/bonus',
    '/comparison',
    '/nhs-pay-guide',
    '/teacher-pay-guide',
    '/public-sector-pay',
    '/maternity-pay-self-employed',
    '/teacher-salary-take-home'
  ];

  const corePages = corePaths.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: path === '' ? 1.0 : 0.8,
  }));

  // 2. BLOG POSTS (Automatic from your ARTICLES array)
  const blogPages = ARTICLES.map((article) => ({
    url: `${base}/blog/${article.slug}`,
    lastModified: new Date(), // If you add a 'date' field to ARTICLES, use that here
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // 3. SALARY PAGES (Automatic)
  // Add any new salary numbers here and the sitemap builds the URL for you
  const salaryAmounts = [20000, 30000, 40000, 45000, 50000, 60000, 70000, 80000, 100000];
  const salaryPages = salaryAmounts.map((amount) => ({
    url: `${base}/${amount}-salary-take-home`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...corePages, ...blogPages, ...salaryPages];
}
