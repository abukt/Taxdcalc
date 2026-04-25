export const metadata = {
  title: 'Council Workers Pay Guide 2026-27 — NJC Take-Home | TaxdCalc',
  description: 'Council worker NJC Green Book pay 2026-27. SCP 2 at £24,294 takes home £19,942/year after income tax, NI and 5.5% LGPS pension.',
  alternates: { canonical: 'https://taxdcal.co.uk/public-sector-pay/council-workers' },
  openGraph: {
    title: 'Council Workers Pay Guide 2026-27 | TaxdCalc',
    description: 'Council worker NJC Green Book pay 2026-27. SCP 2 at £24,294 takes home £19,942/year after income tax, NI and 5.5% LGPS pension.',
    url: 'https://taxdcal.co.uk/public-sector-pay/council-workers',
    siteName: 'TaxdCalc',
    locale: 'en_GB',
    type: 'website',
    images: [{ url: '/api/og?title=Council+Workers+Pay+2026-27&subtitle=NJC+Green+Book+Take-Home', width: 1200, height: 630, alt: 'Council Workers Pay Guide 2026-27 | TaxdCalc' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Council Workers Pay Guide 2026-27 | TaxdCalc',
    description: 'NJC Green Book take-home pay after tax, NI and 5.5% LGPS pension. 2026-27 figures.',
    images: ['/api/og?title=Council+Workers+Pay+2026-27&subtitle=NJC+Green+Book+Take-Home'],
  },
  robots: { index: true, follow: true },
};

export default function CouncilWorkersLayout({ children }) {
  return children;
}
