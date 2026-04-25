export const metadata = {
  title: 'Police Pay Guide 2026-27 — Take-Home Pay by Rank | TaxdCalc',
  description: 'Police Constable to Chief Inspector take-home pay 2026-27. Entry P1 at £29,907 takes home £23,497/year after income tax, NI and 6.5% Police Pension Scheme.',
  alternates: { canonical: 'https://taxdcal.co.uk/public-sector-pay/police' },
  openGraph: {
    title: 'Police Pay Guide 2026-27 | TaxdCalc',
    description: 'Police Constable to Chief Inspector take-home pay 2026-27. Entry P1 at £29,907 takes home £23,497/year after income tax, NI and 6.5% Police Pension Scheme.',
    url: 'https://taxdcal.co.uk/public-sector-pay/police',
    siteName: 'TaxdCalc',
    locale: 'en_GB',
    type: 'website',
    images: [{ url: '/api/og?title=Police+Pay+Guide+2026-27&subtitle=Take-Home+by+Rank', width: 1200, height: 630, alt: 'Police Pay Guide 2026-27 — Take-Home by Rank | TaxdCalc' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Police Pay Guide 2026-27 | TaxdCalc',
    description: 'PC to Chief Inspector take-home pay after tax, NI and 6.5% pension. 2026-27 figures.',
    images: ['/api/og?title=Police+Pay+Guide+2026-27&subtitle=Take-Home+by+Rank'],
  },
  robots: { index: true, follow: true },
};

export default function PoliceLayout({ children }) {
  return children;
}
