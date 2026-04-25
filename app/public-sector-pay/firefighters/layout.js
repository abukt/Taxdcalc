export const metadata = {
  title: 'Firefighter Pay Guide 2026-27 — NJC Take-Home | TaxdCalc',
  description: 'Firefighter NJC Grey Book pay 2026-27. Competent firefighter at £37,898 takes home £26,410/year after income tax, NI and 14.5% Firefighters Pension Scheme.',
  alternates: { canonical: 'https://taxdcal.co.uk/public-sector-pay/firefighters' },
  openGraph: {
    title: 'Firefighter Pay Guide 2026-27 | TaxdCalc',
    description: 'Firefighter NJC Grey Book pay 2026-27. Competent firefighter at £37,898 takes home £26,410/year after income tax, NI and 14.5% Firefighters Pension Scheme.',
    url: 'https://taxdcal.co.uk/public-sector-pay/firefighters',
    siteName: 'TaxdCalc',
    locale: 'en_GB',
    type: 'website',
    images: [{ url: '/api/og?title=Firefighter+Pay+Guide+2026-27&subtitle=NJC+Grey+Book+Take-Home', width: 1200, height: 630, alt: 'Firefighter Pay Guide 2026-27 | TaxdCalc' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Firefighter Pay Guide 2026-27 | TaxdCalc',
    description: 'NJC Grey Book take-home pay after tax, NI and 14.5% pension. Competent FF at £26,410/year.',
    images: ['/api/og?title=Firefighter+Pay+Guide+2026-27&subtitle=NJC+Grey+Book+Take-Home'],
  },
  robots: { index: true, follow: true },
};

export default function FirefightersLayout({ children }) {
  return children;
}
