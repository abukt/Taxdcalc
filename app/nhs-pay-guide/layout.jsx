export const metadata = {
  title: 'NHS Pay Guide 2026-27 — AfC Bands 2–9 with Pension | TaxdCalc',
  description: 'Full NHS Agenda for Change pay guide 2026-27. All bands 2–9 with NHS pension, London HCAS, and take-home pay at each spine point. Updated April 2026.',
  alternates: { canonical: 'https://taxdcal.co.uk/nhs-pay-guide' },
  openGraph: {
    title: 'NHS Pay Guide 2026-27 | TaxdCalc',
    description: 'Full NHS Agenda for Change pay guide 2026-27. All bands 2–9 with NHS pension, London HCAS, and take-home pay at each spine point. Updated April 2026.',
    url: 'https://taxdcal.co.uk/nhs-pay-guide',
    siteName: 'TaxdCalc',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export default function NhsPayGuideLayout({ children }) {
  return children;
}
