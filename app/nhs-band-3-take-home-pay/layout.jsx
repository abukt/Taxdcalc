export const metadata = {
  title: 'NHS Band 3 Take-Home 2026-27 | Entry £19,944/yr | TaxdCalc',
  description: 'NHS Band 3 entry take-home: £19,944/year (£1,662/month) after income tax, NI and 5.0% NHS pension. London HCAS included. 2026-27 Agenda for Change figures.',
  alternates: { canonical: 'https://taxdcal.co.uk/nhs-band-3-take-home-pay' },
  openGraph: {
    title: 'NHS Band 3 Take-Home 2026-27 | Entry £19,944/yr | TaxdCalc',
    description: 'NHS Band 3 entry take-home: £19,944/year (£1,662/month) after income tax, NI and 5.0% NHS pension.',
    url: 'https://taxdcal.co.uk/nhs-band-3-take-home-pay',
    siteName: 'TaxdCalc',
    locale: 'en_GB',
    type: 'website',
    images: [{ url: '/api/og?title=NHS+Band+3+Take-Home+2026-27&subtitle=Entry+%C2%A319%2C944%2Fyr', width: 1200, height: 630, alt: 'NHS Band 3 Take-Home 2026-27 | TaxdCalc' }],
  },
  twitter: { card: 'summary_large_image', title: 'NHS Band 3 Take-Home 2026-27 | TaxdCalc', description: 'NHS Band 3 entry: £19,944/year after tax, NI and 5.0% pension.', images: ['/api/og?title=NHS+Band+3+Take-Home+2026-27&subtitle=Entry+%C2%A319%2C944%2Fyr'] },
  robots: { index: true, follow: true },
};

export default function Layout({ children }) { return children; }
