export const metadata = {
  title: 'Contractor Pay UK 2026-27 — IR35, Day Rates & Take-Home | TaxdCalc',
  description: 'UK contractor take-home pay in 2026-27. Compare inside vs outside IR35 for any day rate. Day-rate to annual take-home calculator. Updated for 10.75% dividend tax from April 2026.',
  alternates: { canonical: 'https://taxdcal.co.uk/contractor-pay' },
  openGraph: {
    title: 'Contractor Pay UK 2026-27 — IR35 & Day Rates | TaxdCalc',
    description: 'IR35 inside vs outside calculator, day-rate take-home, and contractor tax planning for 2026-27.',
    url: 'https://taxdcal.co.uk/contractor-pay',
    siteName: 'TaxdCalc',
    locale: 'en_GB',
    type: 'website',
    images: [{ url: '/api/og?title=Contractor+Pay+2026-27&subtitle=IR35+%26+Day+Rates', width: 1200, height: 630, alt: 'Contractor Pay UK 2026-27 | TaxdCalc' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contractor Pay UK 2026-27 | TaxdCalc',
    description: 'IR35 calculator, day-rate take-home, and contractor tax planning. Updated for 10.75% dividend tax.',
    images: ['/api/og?title=Contractor+Pay+2026-27&subtitle=IR35+%26+Day+Rates'],
  },
  robots: { index: true, follow: true },
};

export default function ContractorPayLayout({ children }) {
  return children;
}
