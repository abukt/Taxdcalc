export const metadata = {
  title: 'NHS Pay Bands 2026-27 — Take-Home Pay by Band | TaxdCalc',
  description: 'NHS Agenda for Change pay bands 2026-27. Band 5 entry at £29,970 takes home £22,748/year after income tax, NI and 9.8% NHS pension. All bands included.',
  alternates: { canonical: 'https://taxdcal.co.uk/nhs' },
  openGraph: {
    title: 'NHS Pay Bands 2026-27 | TaxdCalc',
    description: 'NHS Agenda for Change pay bands 2026-27. Band 5 entry at £29,970 takes home £22,748/year after income tax, NI and 9.8% NHS pension. All bands included.',
    url: 'https://taxdcal.co.uk/nhs',
    siteName: 'TaxdCalc',
    locale: 'en_GB',
    type: 'website',
    images: [{ url: '/api/og?salary=29970&th=22748&mo=1896&type=nhs', width: 1200, height: 630, alt: 'NHS Pay Bands 2026-27 — Take-Home by Band | TaxdCalc' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NHS Pay Bands 2026-27 | TaxdCalc',
    description: 'NHS Band 5 takes home £22,748/year after tax and 9.8% pension. All AfC bands included.',
    images: ['/api/og?salary=29970&th=22748&mo=1896&type=nhs'],
  },
  robots: { index: true, follow: true },
};

export default function NhsLayout({ children }) {
  return children;
}
