export const metadata = {
  title: 'Public Sector Pay Guide 2026-27 — All Sectors | TaxdCalc',
  description: 'UK public sector pay 2026-27. NHS, teachers, police, firefighters, civil servants, armed forces and council workers. Includes defined benefit pension deductions.',
  alternates: { canonical: 'https://taxdcal.co.uk/public-sector-pay' },
  openGraph: {
    title: 'Public Sector Pay Guide 2026-27 | TaxdCalc',
    description: 'UK public sector pay 2026-27. NHS, teachers, police, firefighters, civil servants, armed forces and council workers. Includes defined benefit pension deductions.',
    url: 'https://taxdcal.co.uk/public-sector-pay',
    siteName: 'TaxdCalc',
    locale: 'en_GB',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function PublicSectorLayout({ children }) {
  return children;
}
