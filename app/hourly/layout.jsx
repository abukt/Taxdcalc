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
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export default function HourlyLayout({ children }) {
  return children;
}
