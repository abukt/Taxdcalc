export const metadata = {
  title: 'NHS Band 2 Take-Home 2026-27 | Entry £19,422/yr | TaxdCalc',
  description: 'NHS Band 2 entry take-home: £19,422/year (£1,618/month) after income tax, NI and 5.0% NHS pension. London HCAS included. 2026-27 Agenda for Change figures.',
  alternates: { canonical: 'https://taxdcal.co.uk/nhs-band-2-take-home-pay' },
  openGraph: {
    title: 'NHS Band 2 Take-Home 2026-27 | Entry £19,422/yr | TaxdCalc',
    description: 'NHS Band 2 entry take-home: £19,422/year (£1,618/month) after income tax, NI and 5.0% NHS pension.',
    url: 'https://taxdcal.co.uk/nhs-band-2-take-home-pay',
    siteName: 'TaxdCalc',
    locale: 'en_GB',
    type: 'website',
    images: [{ url: '/api/og?title=NHS+Band+2+Take-Home+2026-27&subtitle=Entry+%C2%A319%2C422%2Fyr', width: 1200, height: 630, alt: 'NHS Band 2 Take-Home 2026-27 | TaxdCalc' }],
  },
  twitter: { card: 'summary_large_image', title: 'NHS Band 2 Take-Home 2026-27 | TaxdCalc', description: 'NHS Band 2 entry: £19,422/year after tax, NI and 5.0% pension.', images: ['/api/og?title=NHS+Band+2+Take-Home+2026-27&subtitle=Entry+%C2%A319%2C422%2Fyr'] },
  robots: { index: true, follow: true },
};

export default function Layout({ children }) { return children; }
