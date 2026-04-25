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
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export default function NhsLayout({ children }) {
  return children;
}
