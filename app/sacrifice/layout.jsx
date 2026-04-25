export const metadata = {
  title: 'Salary Sacrifice Calculator 2026-27 — Tax Savings | TaxdCalc',
  description: 'Calculate your salary sacrifice tax savings for 2026-27. Pension, cycle to work and EV schemes. Higher rate taxpayers save income tax AND NI.',
  alternates: { canonical: 'https://taxdcal.co.uk/sacrifice' },
  openGraph: {
    title: 'Salary Sacrifice Calculator 2026-27 | TaxdCalc',
    description: 'Calculate your salary sacrifice tax savings for 2026-27. Pension, cycle to work and EV schemes. Higher rate taxpayers save income tax AND NI.',
    url: 'https://taxdcal.co.uk/sacrifice',
    siteName: 'TaxdCalc',
    locale: 'en_GB',
    type: 'website',
    images: [{ url: '/api/og?title=Salary+Sacrifice+Calculator&subtitle=How+Much+Do+You+Save%3F', width: 1200, height: 630, alt: 'Salary Sacrifice Calculator 2026-27 | TaxdCalc' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Salary Sacrifice Calculator 2026-27 | TaxdCalc',
    description: 'See exactly how much salary sacrifice saves on income tax and NI. Pension, EV & cycle to work.',
    images: ['/api/og?title=Salary+Sacrifice+Calculator&subtitle=How+Much+Do+You+Save%3F'],
  },
  robots: { index: true, follow: true },
};

export default function SacrificeLayout({ children }) {
  return children;
}
