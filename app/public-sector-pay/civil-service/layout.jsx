export const metadata = {
  title: 'Civil Service Pay Guide 2026-27 — AO to Grade 6 | TaxdCalc',
  description: 'Civil Service Alpha Pension pay guide 2026-27. AO at £24,547 takes home £20,290/year after income tax, NI and 4.6% Alpha pension.',
  alternates: { canonical: 'https://taxdcal.co.uk/public-sector-pay/civil-service' },
  openGraph: {
    title: 'Civil Service Pay Guide 2026-27 | TaxdCalc',
    description: 'Civil Service Alpha Pension pay guide 2026-27. AO at £24,547 takes home £20,290/year after income tax, NI and 4.6% Alpha pension.',
    url: 'https://taxdcal.co.uk/public-sector-pay/civil-service',
    siteName: 'TaxdCalc',
    locale: 'en_GB',
    type: 'website',
    images: [{ url: '/api/og?title=Civil+Service+Pay+2026-27&subtitle=AO+to+Grade+6+Take-Home', width: 1200, height: 630, alt: 'Civil Service Pay Guide 2026-27 | TaxdCalc' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Civil Service Pay Guide 2026-27 | TaxdCalc',
    description: 'AO to Grade 6 take-home pay after tax, NI and 4.6% Alpha pension. 2026-27 figures.',
    images: ['/api/og?title=Civil+Service+Pay+2026-27&subtitle=AO+to+Grade+6+Take-Home'],
  },
  robots: { index: true, follow: true },
};

export default function CivilServiceLayout({ children }) {
  return children;
}
