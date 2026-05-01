export const metadata = {
  title: 'NHS Band 6 Take-Home 2026-27 | Entry £27,454/yr | TaxdCalc',
  description: 'NHS Band 6 entry take-home: £27,454/year (£2,288/month) after income tax, NI and 10.7% NHS pension. London HCAS included. 2026-27 Agenda for Change figures.',
  alternates: { canonical: 'https://taxdcal.co.uk/nhs-band-6-take-home-pay' },
  openGraph: {
    title: 'NHS Band 6 Take-Home 2026-27 | Entry £27,454/yr | TaxdCalc',
    description: 'NHS Band 6 entry take-home: £27,454/year (£2,288/month) after income tax, NI and 10.7% NHS pension.',
    url: 'https://taxdcal.co.uk/nhs-band-6-take-home-pay',
    siteName: 'TaxdCalc',
    locale: 'en_GB',
    type: 'website',
    images: [{ url: '/api/og?title=NHS+Band+6+Take-Home+2026-27&subtitle=Entry+%C2%A327%2C454%2Fyr', width: 1200, height: 630, alt: 'NHS Band 6 Take-Home 2026-27 | TaxdCalc' }],
  },
  twitter: { card: 'summary_large_image', title: 'NHS Band 6 Take-Home 2026-27 | TaxdCalc', description: 'NHS Band 6 entry: £27,454/year after tax, NI and 10.7% pension.', images: ['/api/og?title=NHS+Band+6+Take-Home+2026-27&subtitle=Entry+%C2%A327%2C454%2Fyr'] },
  robots: { index: true, follow: true },
};

export default function Layout({ children }) { return children; }
