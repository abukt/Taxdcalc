export const metadata = {
  title: 'NHS Band 7 Take-Home 2026-27 | Entry £32,942/yr | TaxdCalc',
  description: 'NHS Band 7 entry take-home: £32,942/year (£2,745/month) after income tax, NI and 12.5% NHS pension. London HCAS included. 2026-27 Agenda for Change figures.',
  alternates: { canonical: 'https://taxdcal.co.uk/nhs-band-7-take-home-pay' },
  openGraph: {
    title: 'NHS Band 7 Take-Home 2026-27 | Entry £32,942/yr | TaxdCalc',
    description: 'NHS Band 7 entry take-home: £32,942/year (£2,745/month) after income tax, NI and 12.5% NHS pension.',
    url: 'https://taxdcal.co.uk/nhs-band-7-take-home-pay',
    siteName: 'TaxdCalc',
    locale: 'en_GB',
    type: 'website',
    images: [{ url: '/api/og?title=NHS+Band+7+Take-Home+2026-27&subtitle=Entry+%C2%A332%2C942%2Fyr', width: 1200, height: 630, alt: 'NHS Band 7 Take-Home 2026-27 | TaxdCalc' }],
  },
  twitter: { card: 'summary_large_image', title: 'NHS Band 7 Take-Home 2026-27 | TaxdCalc', description: 'NHS Band 7 entry: £32,942/year after tax, NI and 12.5% pension.', images: ['/api/og?title=NHS+Band+7+Take-Home+2026-27&subtitle=Entry+%C2%A332%2C942%2Fyr'] },
  robots: { index: true, follow: true },
};

export default function Layout({ children }) { return children; }
