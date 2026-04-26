const BASE = 'https://taxdcal.co.uk';

function calcTakeHome(gross) {
  const pension = gross * 0.05;
  const ti = Math.max(0, gross - pension);
  let pa = 12570;
  if (ti > 100000) pa = Math.max(0, 12570 - Math.floor((ti - 100000) / 2));
  const tx = Math.max(0, ti - pa);
  const it =
    Math.min(tx, 37700) * 0.20 +
    Math.min(Math.max(0, tx - 37700), 74870) * 0.40 +
    Math.max(0, tx - 37700 - 74870) * 0.45;
  const ni =
    gross <= 12570
      ? 0
      : (Math.min(gross, 50270) - 12570) * 0.08 + Math.max(0, gross - 50270) * 0.02;
  const takeHome = gross - it - ni - pension;
  return { takeHome, monthly: takeHome / 12 };
}

const VALID = new Set([
  20000, 22000, 25000, 27000, 28000, 30000, 32000, 35000, 38000, 40000,
  42000, 45000, 48000, 50000, 55000, 60000, 65000, 70000, 75000, 80000,
  85000, 90000, 95000, 100000, 105000, 110000, 120000, 125000, 150000,
]);

const SPECIAL = {
  'minimum-wage-take-home':    { salary: 26418,  label: 'Minimum Wage (£12.71/hr)' },
  'nhs-band-5-take-home':      { salary: 29970,  label: 'NHS Band 5 Entry' },
  'nhs-band-6-take-home':      { salary: 37338,  label: 'NHS Band 6 Entry' },
  'nhs-band-7-take-home':      { salary: 43742,  label: 'NHS Band 7 Entry' },
  'teacher-salary-take-home':  { salary: 32916,  label: 'NQT Teacher M1' },
  'graduate-salary-take-home': { salary: 28000,  label: 'UK Graduate Average' },
  'nhs-band-2-take-home':      { salary: 23615,  label: 'NHS Band 2 Entry' },
  'nhs-band-3-take-home':      { salary: 24625,  label: 'NHS Band 3 Entry' },
  'nhs-band-4-take-home':      { salary: 26530,  label: 'NHS Band 4 Entry' },
  'nhs-band-8a-take-home':     { salary: 53755,  label: 'NHS Band 8a Entry' },
  'nhs-band-8b-take-home':     { salary: 62215,  label: 'NHS Band 8b Entry' },
  '200-day-rate-take-home':    { salary: 44000,  label: '£200/Day Contractor' },
  '250-day-rate-take-home':    { salary: 55000,  label: '£250/Day Contractor' },
  '300-day-rate-take-home':    { salary: 66000,  label: '£300/Day Contractor' },
  '350-day-rate-take-home':    { salary: 77000,  label: '£350/Day Contractor' },
  '400-day-rate-take-home':    { salary: 88000,  label: '£400/Day Contractor' },
  '450-day-rate-take-home':    { salary: 99000,  label: '£450/Day Contractor' },
  '500-day-rate-take-home':    { salary: 110000, label: '£500/Day Contractor' },
  '550-day-rate-take-home':    { salary: 121000, label: '£550/Day Contractor' },
  '600-day-rate-take-home':    { salary: 132000, label: '£600/Day Contractor' },
  '650-day-rate-take-home':    { salary: 143000, label: '£650/Day Contractor' },
  '700-day-rate-take-home':    { salary: 154000, label: '£700/Day Contractor' },
  '750-day-rate-take-home':    { salary: 165000, label: '£750/Day Contractor' },
};

const fmt = n => '£' + Math.round(n).toLocaleString('en-GB');

export function generateStaticParams() {
  return [
    ...[...VALID].map(s => ({ salary: `${s}-salary-take-home` })),
    ...Object.keys(SPECIAL).map(slug => ({ salary: slug })),
  ];
}

export async function generateMetadata({ params }) {
  const { salary: slug } = await params;

  let salaryNum, label;
  if (SPECIAL[slug]) {
    salaryNum = SPECIAL[slug].salary;
    label = SPECIAL[slug].label;
  } else {
    const m = slug?.match(/^(\d+)-salary/);
    if (!m || !VALID.has(+m[1])) return {};
    salaryNum = +m[1];
    label = fmt(salaryNum);
  }

  const { takeHome, monthly } = calcTakeHome(salaryNum);
  const isDayRate = slug.endsWith('-day-rate-take-home');
  const title = isDayRate
    ? `${fmt(takeHome)} Take-Home | ${label} After Tax | 2026-27 UK`
    : `${fmt(takeHome)} Take-Home | ${label} Salary After Tax | 2026-27 UK`;
  const description = isDayRate
    ? `${label} annualised at 220 days (${fmt(salaryNum)}/year) takes home ${fmt(takeHome)}/year (${fmt(monthly)}/month) in 2026-27 after income tax and NI. Free UK calculator.`
    : `${label} salary takes home ${fmt(takeHome)}/year (${fmt(monthly)}/month) in 2026-27 after income tax and NI. Adjust pension, student loan, Scotland. Free.`;
  const pageUrl = `${BASE}/${slug}`;
  const ogImg = `${BASE}/api/og?salary=${salaryNum}&th=${Math.round(takeHome)}&mo=${Math.round(monthly)}&type=salary`;

  return {
    title,
    description,
    alternates: { canonical: pageUrl },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: 'TaxdCalc',
      locale: 'en_GB',
      type: 'website',
      images: [{ url: ogImg, width: 1200, height: 630, alt: `${label} take-home pay 2026-27` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImg],
    },
    robots: { index: true, follow: true },
  };
}

export default function SalaryLayout({ children }) {
  return children;
}
