export const metadata = {
  title: 'Salary Sacrifice Calculator 2026-27 — How Much Do You Save? | TaxdCalc',
  description: 'Calculate your salary sacrifice tax savings for 2026-27. Pension, cycle to work and EV schemes. Higher rate taxpayers save income tax AND NI.',
  alternates: { canonical: 'https://taxdcal.co.uk/sacrifice' },
  openGraph: {
    title: 'Salary Sacrifice Calculator 2026-27 | TaxdCalc',
    description: 'Calculate your salary sacrifice tax savings for 2026-27. Pension, cycle to work and EV schemes. Higher rate taxpayers save income tax AND NI.',
    url: 'https://taxdcal.co.uk/sacrifice',
    siteName: 'TaxdCalc',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export default function SacrificeLayout({ children }) {
  return children;
}
