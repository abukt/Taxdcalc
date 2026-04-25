export const metadata = {
  title: 'Job Offer Comparison Calculator 2026-27 | TaxdCalc',
  description: 'Compare two job offers side by side on take-home pay in 2026-27. Accounts for pension, student loan, location and benefits. Make the right decision.',
  alternates: { canonical: 'https://taxdcal.co.uk/comparison' },
  openGraph: {
    title: 'Job Offer Comparison Calculator 2026-27 | TaxdCalc',
    description: 'Compare two job offers side by side on take-home pay in 2026-27. Accounts for pension, student loan, location and benefits. Make the right decision.',
    url: 'https://taxdcal.co.uk/comparison',
    siteName: 'TaxdCalc',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export default function ComparisonLayout({ children }) {
  return children;
}
