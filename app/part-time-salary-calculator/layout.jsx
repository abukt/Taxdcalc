export const metadata = {
  title: 'Part-Time Salary Calculator 2026-27 | Pro-Rata Tax Calc',
  description: 'Calculate pro-rata take-home pay for part-time work. Compare 4-day weeks or custom hours against full-time salaries for the 2026-27 tax year.',
  alternates: { canonical: 'https://taxdcal.co.uk/part-time-salary-calculator' },
  openGraph: {
    title: 'Part-Time Salary Calculator 2026-27 | TaxdCalc',
    description: 'Calculate pro-rata take-home pay for part-time work. Compare 4-day weeks or custom hours against full-time salaries for the 2026-27 tax year.',
    url: 'https://taxdcal.co.uk/part-time-salary-calculator',
    siteName: 'TaxdCalc',
    locale: 'en_GB',
    type: 'website',
    images: [{ url: '/api/og?title=Part-Time+Salary+Calculator&subtitle=Pro-Rata+Take-Home+2026-27', width: 1200, height: 630, alt: 'Part-Time Salary Calculator 2026-27 | TaxdCalc' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Part-Time Salary Calculator 2026-27 | TaxdCalc',
    description: 'Pro-rata take-home pay for any hours. Compare 4-day weeks and custom hours against full-time.',
    images: ['/api/og?title=Part-Time+Salary+Calculator&subtitle=Pro-Rata+Take-Home+2026-27'],
  },
  robots: { index: true, follow: true },
};

export default function PartTimeLayout({ children }) {
  return <>{children}</>;
}
