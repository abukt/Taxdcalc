export const metadata = {
  title: 'UK Tax Traps 2026-27 — 60% Rate, HICBC & £100k Taper | TaxdCalc',
  description: 'The three UK tax traps that cost high earners thousands: the 60% marginal rate above £100k, the High Income Child Benefit Charge, and the personal allowance taper. How to escape each with salary sacrifice.',
  alternates: { canonical: 'https://taxdcal.co.uk/tax-traps' },
  openGraph: {
    title: 'UK Tax Traps 2026-27 — How to Escape Them | TaxdCalc',
    description: '60% effective rate above £100k, HICBC child benefit taper at £60k, personal allowance withdrawn by £125,140. Salary sacrifice escapes all three.',
    url: 'https://taxdcal.co.uk/tax-traps',
    siteName: 'TaxdCalc',
    locale: 'en_GB',
    type: 'website',
    images: [{ url: '/api/og?salary=110000&th=65557&mo=5463&type=trap', width: 1200, height: 630, alt: 'UK Tax Traps 2026-27 | TaxdCalc' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UK Tax Traps 2026-27 | TaxdCalc',
    description: 'The 60% trap, HICBC and £100k personal allowance taper — and exactly how pension sacrifice escapes them.',
    images: ['/api/og?salary=110000&th=65557&mo=5463&type=trap'],
  },
  robots: { index: true, follow: true },
};

export default function TaxTrapsLayout({ children }) {
  return children;
}
