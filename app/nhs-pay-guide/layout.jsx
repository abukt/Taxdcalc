export const metadata = {
  title: 'NHS Pay Guide 2026-27 — AfC Bands & Pension | TaxdCalc',
  description: 'Full NHS Agenda for Change pay guide 2026-27. All bands 2–9 with NHS pension, London HCAS, and take-home pay at each spine point. Updated April 2026.',
  alternates: { canonical: 'https://taxdcal.co.uk/nhs-pay-guide' },
  openGraph: {
    title: 'NHS Pay Guide 2026-27 | TaxdCalc',
    description: 'Full NHS Agenda for Change pay guide 2026-27. All bands 2–9 with NHS pension, London HCAS, and take-home pay at each spine point. Updated April 2026.',
    url: 'https://taxdcal.co.uk/nhs-pay-guide',
    siteName: 'TaxdCalc',
    locale: 'en_GB',
    type: 'website',
    images: [{ url: '/api/og?salary=29970&th=22748&mo=1896&type=nhs', width: 1200, height: 630, alt: 'NHS Pay Guide 2026-27 — AfC Bands with Pension | TaxdCalc' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NHS Pay Guide 2026-27 | TaxdCalc',
    description: 'All AfC pay bands 2–9 with NHS pension and HCAS take-home. Updated April 2026.',
    images: ['/api/og?salary=29970&th=22748&mo=1896&type=nhs'],
  },
  robots: { index: true, follow: true },
};

export default function NhsPayGuideLayout({ children }) {
  return children;
}
