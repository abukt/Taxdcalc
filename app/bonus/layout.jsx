export const metadata = {
  title: 'Bonus Tax Calculator 2026-27 — Keep vs Pay | TaxdCalc',
  description: 'Calculate exactly how much of your bonus you keep after income tax and NI in 2026-27. Includes higher rate, 40% and 60% trap scenarios.',
  alternates: { canonical: 'https://taxdcal.co.uk/bonus' },
  openGraph: {
    title: 'Bonus Tax Calculator 2026-27 | TaxdCalc',
    description: 'Calculate exactly how much of your bonus you keep after income tax and NI in 2026-27. Includes higher rate, 40% and 60% trap scenarios.',
    url: 'https://taxdcal.co.uk/bonus',
    siteName: 'TaxdCalc',
    locale: 'en_GB',
    type: 'website',
    images: [{ url: '/api/og?title=Bonus+Tax+Calculator&subtitle=How+Much+Do+You+Keep%3F', width: 1200, height: 630, alt: 'Bonus Tax Calculator 2026-27 | TaxdCalc' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bonus Tax Calculator 2026-27 | TaxdCalc',
    description: 'How much of your bonus do you keep? Covers basic rate, 40% and the 60% trap.',
    images: ['/api/og?title=Bonus+Tax+Calculator&subtitle=How+Much+Do+You+Keep%3F'],
  },
  robots: { index: true, follow: true },
};

export default function BonusLayout({ children }) {
  return children;
}
