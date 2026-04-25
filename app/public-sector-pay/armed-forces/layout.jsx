export const metadata = {
  title: 'Armed Forces Pay Guide 2026-27 — By Rank | TaxdCalc',
  description: 'British military pay 2026-27. Private L1 at £23,907 takes home £20,733/year after income tax and NI. Includes X-Factor allowance and AFPS 2015 pension.',
  alternates: { canonical: 'https://taxdcal.co.uk/public-sector-pay/armed-forces' },
  openGraph: {
    title: 'Armed Forces Pay Guide 2026-27 | TaxdCalc',
    description: 'British military pay 2026-27. Private L1 at £23,907 takes home £20,733/year after income tax and NI. Includes X-Factor allowance and AFPS 2015 pension.',
    url: 'https://taxdcal.co.uk/public-sector-pay/armed-forces',
    siteName: 'TaxdCalc',
    locale: 'en_GB',
    type: 'website',
    images: [{ url: '/api/og?title=Armed+Forces+Pay+2026-27&subtitle=AFPRB+Ranks+%26+Take-Home', width: 1200, height: 630, alt: 'Armed Forces Pay Guide 2026-27 | TaxdCalc' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Armed Forces Pay Guide 2026-27 | TaxdCalc',
    description: 'British military take-home pay by rank. X-Factor allowance and AFPS 2015 pension included.',
    images: ['/api/og?title=Armed+Forces+Pay+2026-27&subtitle=AFPRB+Ranks+%26+Take-Home'],
  },
  robots: { index: true, follow: true },
};

export default function ArmedForcesLayout({ children }) {
  return children;
}
