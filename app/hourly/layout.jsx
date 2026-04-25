export const metadata = {
  title: 'Hourly Rate to Salary Calculator 2026-27 | TaxdCalc',
  description: 'Convert hourly rate to annual salary and take-home pay for 2026-27. Calculate net pay for any hours worked per week. Updated for 2026-27 tax rates.',
  alternates: { canonical: 'https://taxdcal.co.uk/hourly' },
  openGraph: {
    title: 'Hourly Rate to Salary Calculator 2026-27 | TaxdCalc',
    description: 'Convert hourly rate to annual salary and take-home pay for 2026-27. Calculate net pay for any hours worked per week. Updated for 2026-27 tax rates.',
    url: 'https://taxdcal.co.uk/hourly',
    siteName: 'TaxdCalc',
    locale: 'en_GB',
    type: 'website',
    images: [{ url: '/api/og?title=Hourly+Rate+Calculator&subtitle=Convert+to+Annual+Salary', width: 1200, height: 630, alt: 'Hourly Rate to Salary Calculator 2026-27 | TaxdCalc' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hourly Rate to Salary Calculator 2026-27 | TaxdCalc',
    description: 'Convert any hourly rate to annual take-home pay. Any hours per week. Updated for 2026-27.',
    images: ['/api/og?title=Hourly+Rate+Calculator&subtitle=Convert+to+Annual+Salary'],
  },
  robots: { index: true, follow: true },
};

export default function HourlyLayout({ children }) {
  return children;
}
