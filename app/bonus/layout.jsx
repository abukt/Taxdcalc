export const metadata = {
  title: 'Bonus Tax Calculator 2026-27 — How Much Do You Keep? | TaxdCalc',
  description: 'Calculate exactly how much of your bonus you keep after income tax and NI in 2026-27. Includes higher rate, 40% and 60% trap scenarios.',
  alternates: { canonical: 'https://taxdcal.co.uk/bonus' },
  openGraph: {
    title: 'Bonus Tax Calculator 2026-27 | TaxdCalc',
    description: 'Calculate exactly how much of your bonus you keep after income tax and NI in 2026-27. Includes higher rate, 40% and 60% trap scenarios.',
    url: 'https://taxdcal.co.uk/bonus',
    siteName: 'TaxdCalc',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export default function BonusLayout({ children }) {
  return children;
}
