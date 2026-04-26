export const metadata = {
  title: 'UK Salary Take-Home Pay 2026-27 — Every Common Salary | TaxdCalc',
  description: 'Take-home pay for every common UK salary in 2026-27. From £20,000 to £150,000 — exact annual and monthly net pay after income tax, NI and 5% pension.',
  alternates: { canonical: 'https://taxdcal.co.uk/salary-take-home-pay-uk' },
  openGraph: {
    title: 'UK Salary Take-Home Pay 2026-27 | TaxdCalc',
    description: 'Every common UK salary from £20k to £150k — exact take-home pay after income tax and NI. Updated for 2026-27.',
    url: 'https://taxdcal.co.uk/salary-take-home-pay-uk',
    siteName: 'TaxdCalc',
    locale: 'en_GB',
    type: 'website',
    images: [{ url: '/api/og?title=UK+Salary+Take-Home+Pay&subtitle=2026-27+All+Salaries', width: 1200, height: 630, alt: 'UK Salary Take-Home Pay 2026-27 | TaxdCalc' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UK Salary Take-Home Pay 2026-27 | TaxdCalc',
    description: 'All common UK salaries £20k–£150k with exact take-home pay after income tax, NI and 5% pension.',
    images: ['/api/og?title=UK+Salary+Take-Home+Pay&subtitle=2026-27+All+Salaries'],
  },
  robots: { index: true, follow: true },
};

export default function SalaryTakeHomePayUKLayout({ children }) {
  return children;
}
