export const metadata = {
  title: 'NHS Band 4 Take-Home 2026-27 | Entry £21,418/yr | TaxdCalc',
  description: 'NHS Band 4 entry take-home: £21,418/year (£1,785/month) after income tax, NI and 6.1% NHS pension. London HCAS included. 2026-27 Agenda for Change figures.',
  alternates: { canonical: 'https://taxdcal.co.uk/nhs-band-4-take-home-pay' },
  openGraph: {
    title: 'NHS Band 4 Take-Home 2026-27 | Entry £21,418/yr | TaxdCalc',
    description: 'NHS Band 4 entry take-home: £21,418/year (£1,785/month) after income tax, NI and 6.1% NHS pension.',
    url: 'https://taxdcal.co.uk/nhs-band-4-take-home-pay',
    siteName: 'TaxdCalc',
    locale: 'en_GB',
    type: 'website',
    images: [{ url: '/api/og?title=NHS+Band+4+Take-Home+2026-27&subtitle=Entry+%C2%A321%2C418%2Fyr', width: 1200, height: 630, alt: 'NHS Band 4 Take-Home 2026-27 | TaxdCalc' }],
  },
  twitter: { card: 'summary_large_image', title: 'NHS Band 4 Take-Home 2026-27 | TaxdCalc', description: 'NHS Band 4 entry: £21,418/year after tax, NI and 6.1% pension.', images: ['/api/og?title=NHS+Band+4+Take-Home+2026-27&subtitle=Entry+%C2%A321%2C418%2Fyr'] },
  robots: { index: true, follow: true },
};

export default function Layout({ children }) { return children; }
