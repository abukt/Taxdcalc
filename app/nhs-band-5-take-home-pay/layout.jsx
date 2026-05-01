export const metadata = {
  title: 'NHS Band 5 Take-Home 2026-27 | Entry £22,748/yr | TaxdCalc',
  description: 'NHS Band 5 entry take-home: £22,748/year (£1,896/month) after income tax, NI and 9.8% NHS pension. London HCAS included. 2026-27 Agenda for Change figures.',
  alternates: { canonical: 'https://taxdcal.co.uk/nhs-band-5-take-home-pay' },
  openGraph: {
    title: 'NHS Band 5 Take-Home 2026-27 | Entry £22,748/yr | TaxdCalc',
    description: 'NHS Band 5 entry take-home: £22,748/year (£1,896/month) after income tax, NI and 9.8% NHS pension.',
    url: 'https://taxdcal.co.uk/nhs-band-5-take-home-pay',
    siteName: 'TaxdCalc',
    locale: 'en_GB',
    type: 'website',
    images: [{ url: '/api/og?title=NHS+Band+5+Take-Home+2026-27&subtitle=Entry+%C2%A322%2C748%2Fyr', width: 1200, height: 630, alt: 'NHS Band 5 Take-Home 2026-27 | TaxdCalc' }],
  },
  twitter: { card: 'summary_large_image', title: 'NHS Band 5 Take-Home 2026-27 | TaxdCalc', description: 'NHS Band 5 entry: £22,748/year after tax, NI and 9.8% pension.', images: ['/api/og?title=NHS+Band+5+Take-Home+2026-27&subtitle=Entry+%C2%A322%2C748%2Fyr'] },
  robots: { index: true, follow: true },
};

export default function Layout({ children }) { return children; }
