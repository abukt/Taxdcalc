export const metadata = {
  title: '£500/Day Rate 2026-27: £68,468 Inside vs £73,134 Outside IR35 | TaxdCalc',
  description: '£500/day contractor take-home 2026-27: £68,468/yr inside IR35 (PAYE) vs £73,134/yr outside IR35 (Ltd Co). Based on 220 working days.',
  alternates: { canonical: 'https://taxdcal.co.uk/500-day-rate-take-home' },
  openGraph: {
    title: '£500/Day Rate 2026-27: £68,468 Inside vs £73,134 Outside IR35',
    description: '£500/day contractor take-home: inside IR35 £68,468 vs outside IR35 £73,134. Outside wins by £4,666.',
    url: 'https://taxdcal.co.uk/500-day-rate-take-home',
    siteName: 'TaxdCalc', locale: 'en_GB', type: 'website',
    images: [{ url: '/api/og?title=%C2%A3500%2FDay+Rate+2026-27&subtitle=Inside+vs+Outside+IR35', width: 1200, height: 630, alt: '£500/Day Rate IR35 Take-Home 2026-27 | TaxdCalc' }],
  },
  twitter: { card: 'summary_large_image', title: '£500/Day Rate 2026-27 | Inside vs Outside IR35 | TaxdCalc', description: '£500/day: inside IR35 £68,468 vs outside IR35 £73,134/yr.', images: ['/api/og?title=%C2%A3500%2FDay+Rate+2026-27&subtitle=Inside+vs+Outside+IR35'] },
  robots: { index: true, follow: true },
};
export default function Layout({ children }) { return children; }
