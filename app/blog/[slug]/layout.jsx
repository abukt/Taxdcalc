// app/blog/[slug]/layout.jsx
// Server component — generates result-first meta titles for all blog posts

import { BLOG_POSTS } from '../../lib/blog-data.js';

const META = {
  'minimum-wage-take-home-pay-2026': {
    title: '£21,478 Take-Home | UK Minimum Wage 2026 After Tax',
    description: 'Full-time minimum wage worker (£12.71/hr, 40hrs) takes home £21,478/year (£1,790/month) after income tax and NI in 2026-27.',
  },
  '45000-salary-take-home-uk-2026': {
    title: '£34,120 Take-Home | £45,000 Salary After Tax 2026-27',
    description: '£45,000 salary: £34,120 take-home per year (£2,843/month) after £6,486 income tax and £2,594 NI in 2026-27.',
  },
  '50000-salary-after-tax-uk-2026': {
    title: '£37,520 Take-Home | £50,000 Salary After Tax 2026-27',
    description: '£50,000 salary: £37,520 take-home per year (£3,127/month) after £7,486 income tax and £3,004 NI in 2026-27.',
  },
  '40000-salary-after-tax-uk-2026': {
    title: '£30,510 Take-Home | £40,000 Salary After Tax 2026-27',
    description: '£40,000 salary: £30,510 take-home per year (£2,542/month) after £5,686 income tax and £2,554 NI in 2026-27.',
  },
  '30000-salary-take-home-pay-uk-2026': {
    title: '£25,350 Take-Home | £30,000 Salary After Tax 2026-27',
    description: '£30,000 salary: £25,350 take-home per year (£2,112/month) after £3,486 income tax and £1,404 NI in 2026-27.',
  },
  'nhs-band-5-take-home-pay-2026': {
    title: '£22,748 Take-Home | NHS Band 5 Salary After Tax 2026-27 | TaxdCalc',
    description: 'NHS Band 5 entry take-home: £22,748/year (£1,896/month) after income tax, NI and 9.8% NHS pension. Full band 5 spine point table. London HCAS included.',
  },
  'ir35-inside-outside-calculator-2026': {
    title: 'IR35 2026: Inside vs Outside Take-Home at Every Day Rate',
    description: 'Compare PAYE inside IR35 vs Ltd Company outside IR35 for £300–£800/day. Dividend tax rose to 10.75% April 2026. Updated figures.',
  },
  'salary-sacrifice-electric-car-uk-2026': {
    title: 'EV Salary Sacrifice 2026: Real Cost After Tax Savings',
    description: 'Electric car salary sacrifice: real monthly cost after income tax and NI savings. 2% BIK rate continues in 2026-27.',
  },
  'how-uk-income-tax-brackets-work': {
    title: 'How UK Income Tax Brackets Work 2026-27 — Plain English Guide | TaxdCalc',
    description: 'UK income tax uses marginal rates: 0% to £12,570, 20% to £50,270, 40% to £125,140. A pay rise never reduces take-home. Confirmed 2026-27 figures.',
  },
  'national-insurance-explained': {
    title: 'National Insurance Explained 2026-27 — What You Pay and Why | TaxdCalc',
    description: 'Employee NI: 8% on £12,570–£50,270, 2% above. 2026-27 thresholds confirmed. How NI differs from income tax on your payslip.',
  },
  'pension-tax-relief-your-free-money': {
    title: 'Pension Tax Relief 2026-27 — Free Money From HMRC | TaxdCalc',
    description: 'Salary sacrifice saves income tax AND NI. Basic rate: £80 costs you £72. Higher rate: £80 costs £60. The 60% trap fix explained with real numbers.',
  },
  '2026-27-tax-year-changes-uk': {
    title: '2026-27 UK Tax Year Changes — Everything That Changed in April 2026 | TaxdCalc',
    description: 'Thresholds frozen to 2031. NLW rises to £12.71/hr. Employer NI up to 15%. Dividend tax rises to 10.75%. Complete guide to April 2026 tax changes.',
  },
  '60-percent-tax-trap': {
    title: '60% Tax Trap 2026: What It Is and How to Escape It',
    description: 'Personal Allowance withdraws between £100k–£125,140 creating a 60% effective rate. Salary sacrifice is the fix. Explained.',
  },
  'hicbc-child-benefit-charge': {
    title: 'HICBC 2026: Child Benefit You Lose at £60k–£80k',
    description: 'High Income Child Benefit Charge: how much you lose between £60,000 and £80,000, and how salary sacrifice can stop it.',
  },
  'personal-allowance-taper-100k': {
    title: '60% Tax Trap 2026: Escape the £100k–£125k PA Taper',
    description: 'Personal Allowance withdrawn at £1 per £2 above £100k. Effective 60% rate on £100k–£125,140. How salary sacrifice fixes it.',
  },
  'plan-5-student-loan-take-home': {
    title: 'Plan 5 Student Loan 2026: How Much It Cuts Your Pay',
    description: '9% on earnings above £25,000. Plan 5 starts April 2026. See exactly how much it reduces take-home at every salary.',
  },
};

const DEFAULT_META = {
  title: 'UK Tax Guide 2026-27 | TaxdCalc',
  description: 'Plain-English guide to UK income tax, National Insurance, and take-home pay. Confirmed 2026-27 HMRC figures. Free salary calculator.',
};

const OG_PARAMS = {
  'minimum-wage-take-home-pay-2026':    { salary: 26418, th: 21478, mo: 1790 },
  '45000-salary-take-home-uk-2026':     { salary: 45000, th: 34120, mo: 2843 },
  '50000-salary-after-tax-uk-2026':     { salary: 50000, th: 37520, mo: 3127 },
  '40000-salary-after-tax-uk-2026':     { salary: 40000, th: 30720, mo: 2560 },
  '30000-salary-take-home-pay-uk-2026': { salary: 30000, th: 23920, mo: 1993 },
  'nhs-band-5-take-home-pay-2026':      { salary: 29970, th: 22748, mo: 1896, type: 'nhs' },
  '60-percent-tax-trap':                { salary: 110000, th: 65557, mo: 5463, type: 'trap' },
};

export function generateStaticParams() {
  return BLOG_POSTS.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const meta = META[slug] || DEFAULT_META;
  const pageUrl = `https://taxdcal.co.uk/blog/${slug}`;
  const ogP = OG_PARAMS[slug];
  const ogImg = ogP
    ? `https://taxdcal.co.uk/api/og?salary=${ogP.salary}&th=${ogP.th}&mo=${ogP.mo}&type=${ogP.type || 'salary'}`
    : undefined;

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: pageUrl },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: pageUrl,
      siteName: 'TaxdCalc',
      locale: 'en_GB',
      type: 'article',
      ...(ogImg ? { images: [{ url: ogImg, width: 1200, height: 630, alt: meta.title }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      ...(ogImg ? { images: [ogImg] } : {}),
    },
    robots: { index: true, follow: true },
  };
}

export default function BlogSlugLayout({ children }) {
  return children;
}
