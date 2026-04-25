// app/blog/[slug]/layout.jsx
// Server component — generates result-first meta titles for all blog posts

import { BLOG_POSTS } from '../../lib/blog-data.js';

const META = {
  'minimum-wage-take-home-pay-2026': {
    title: '£21,478 Take-Home | Minimum Wage 2026 After Tax UK | TaxdCalc',
    description: 'Minimum wage (£12.71/hr, 40hrs) takes home £21,478/year — £1,790/month in 2026-27. Full breakdown of income tax, NI and net pay. Free calculator.',
  },
  '45000-salary-take-home-uk-2026': {
    title: '£34,120 Take-Home | £45,000 Salary After Tax | 2026-27 UK | TaxdCalc',
    description: '£45,000 salary takes home £34,120/year (£2,843/month) in 2026-27 after income tax and NI. Adjust pension, student loan and Scotland. Free, accurate.',
  },
  '50000-salary-after-tax-uk-2026': {
    title: '£37,520 Take-Home | £50,000 Salary After Tax | 2026-27 UK | TaxdCalc',
    description: '£50,000 salary takes home £37,520/year (£3,127/month) in 2026-27. Just below the 40% threshold at £50,270. Full breakdown with pension and NI.',
  },
  '40000-salary-after-tax-uk-2026': {
    title: '£30,720 Take-Home | £40,000 Salary After Tax | 2026-27 UK | TaxdCalc',
    description: '£40,000 salary takes home £30,720/year (£2,560/month) in 2026-27 after income tax (20%) and National Insurance. Free UK calculator updated for 2026-27.',
  },
  '30000-salary-take-home-pay-uk-2026': {
    title: '£23,920 Take-Home | £30,000 Salary After Tax | 2026-27 UK | TaxdCalc',
    description: '£30,000 salary takes home £23,920/year (£1,993/month) in 2026-27. Full income tax, NI and pension breakdown. Free UK calculator.',
  },
  'nhs-band-5-take-home-pay-2026': {
    title: 'NHS Band 5 Take-Home Pay 2026-27 | £1,896/Month Net | TaxdCalc',
    description: 'NHS Band 5 entry take-home: £22,748/year (£1,896/month) after income tax, NI and 9.8% NHS pension. Full band 5 spine point table. London HCAS included.',
  },
  'ir35-inside-outside-calculator-2026': {
    title: 'IR35 Inside vs Outside 2026-27 — What You Actually Take Home | TaxdCalc',
    description: 'Updated for 10.75% dividend tax from April 2026. Side-by-side comparison of PAYE inside IR35 vs Limited Company outside IR35. See your exact figures.',
  },
  'salary-sacrifice-electric-car-uk-2026': {
    title: 'Salary Sacrifice Electric Car 2026-27 — Is It Worth It? | TaxdCalc',
    description: '3% BiK rate makes EV salary sacrifice exceptionally efficient in 2026-27. A £400/month car costs a basic rate taxpayer only £288/month. Full guide.',
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
    title: '60% Tax Trap Explained 2026-27 — How to Escape It | TaxdCalc',
    description: 'Between £100,000–£125,140 your effective marginal rate is 60%. Salary sacrifice into pension escapes it entirely. See exactly how much you can save.',
  },
  'hicbc-child-benefit-charge': {
    title: 'High Income Child Benefit Charge 2026-27 — HICBC Explained | TaxdCalc',
    description: 'Child Benefit is clawed back between £60,000–£80,000 through the HICBC taper. Salary sacrifice can recover all of it. Calculate your exact position.',
  },
  'personal-allowance-taper-100k': {
    title: 'Personal Allowance Taper at £100k — 2026-27 Guide | TaxdCalc',
    description: 'Above £100,000 your Personal Allowance is withdrawn at £1 per £2 earned. By £125,140 you have none. How to reclaim it with pension contributions.',
  },
  'plan-5-student-loan-take-home': {
    title: 'Plan 5 Student Loan Take-Home Pay 2026-27 — £25,000 Threshold | TaxdCalc',
    description: 'Plan 5 has the lowest repayment threshold (£25,000) of any UK student loan. 40-year write-off period. How it affects your monthly take-home pay.',
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
