export const metadata = {
  title: 'Maternity Pay Calculator 2026-27 — SMP Take-Home | TaxdCalc',
  description: 'Calculate your statutory maternity pay (SMP) take-home for 2026-27. Includes the 6-week 90% period and 33-week flat rate. Compare with enhanced maternity pay.',
  alternates: { canonical: 'https://taxdcal.co.uk/maternity' },
  openGraph: {
    title: 'Maternity Pay Calculator 2026-27 | TaxdCalc',
    description: 'Calculate your statutory maternity pay (SMP) take-home for 2026-27. Includes the 6-week 90% period and 33-week flat rate. Compare with enhanced maternity pay.',
    url: 'https://taxdcal.co.uk/maternity',
    siteName: 'TaxdCalc',
    locale: 'en_GB',
    type: 'website',
    images: [{ url: '/api/og?title=Maternity+Pay+Calculator&subtitle=SMP+Take-Home+2026-27', width: 1200, height: 630, alt: 'Maternity Pay Calculator 2026-27 | TaxdCalc' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Maternity Pay Calculator 2026-27 | TaxdCalc',
    description: 'Calculate SMP take-home pay for 2026-27. 6-week 90% period + 33-week flat rate included.',
    images: ['/api/og?title=Maternity+Pay+Calculator&subtitle=SMP+Take-Home+2026-27'],
  },
  robots: { index: true, follow: true },
};

export default function MaternityLayout({ children }) {
  return children;
}
