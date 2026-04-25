export const metadata = {
  title: 'Self-Employed Maternity Pay 2026-27 — MA Guide | TaxdCalc',
  description: 'Self-employed Maternity Allowance 2026-27: £187.18/week for 39 weeks. Eligibility, how to claim, and how MA compares to SMP. Updated April 2026.',
  alternates: { canonical: 'https://taxdcal.co.uk/maternity-pay-self-employed' },
  openGraph: {
    title: 'Self-Employed Maternity Pay 2026-27 | TaxdCalc',
    description: 'Self-employed Maternity Allowance 2026-27: £187.18/week for 39 weeks. Eligibility, how to claim, and how MA compares to SMP.',
    url: 'https://taxdcal.co.uk/maternity-pay-self-employed',
    siteName: 'TaxdCalc',
    locale: 'en_GB',
    type: 'website',
    images: [{ url: '/api/og?title=Self-Employed+Maternity+Pay&subtitle=Maternity+Allowance+2026-27', width: 1200, height: 630, alt: 'Self-Employed Maternity Pay Guide 2026-27 | TaxdCalc' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Self-Employed Maternity Pay 2026-27 | TaxdCalc',
    description: 'MA 2026-27: £187.18/week for 39 weeks. Who qualifies, how to claim, vs SMP explained.',
    images: ['/api/og?title=Self-Employed+Maternity+Pay&subtitle=Maternity+Allowance+2026-27'],
  },
  robots: { index: true, follow: true },
};

export default function MaternityPaySelfEmployedLayout({ children }) {
  return children;
}
