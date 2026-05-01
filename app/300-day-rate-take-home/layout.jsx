export const metadata = {
  title: '£300/Day Rate 2026-27: £44,348 Inside vs £49,211 Outside IR35 | TaxdCalc',
  description: '£300/day contractor take-home 2026-27: £44,348/yr inside IR35 (PAYE) vs £49,211/yr outside IR35 (Ltd Co). Based on 220 working days.',
  alternates: { canonical: 'https://taxdcal.co.uk/300-day-rate-take-home' },
  openGraph: {
    title: '£300/Day Rate 2026-27: £44,348 Inside vs £49,211 Outside IR35',
    description: '£300/day contractor take-home: inside IR35 £44,348 vs outside IR35 £49,211. Outside wins by £4,863.',
    url: 'https://taxdcal.co.uk/300-day-rate-take-home',
    siteName: 'TaxdCalc', locale: 'en_GB', type: 'website',
    images: [{ url: '/api/og?title=%C2%A3300%2FDay+Rate+2026-27&subtitle=Inside+vs+Outside+IR35', width: 1200, height: 630, alt: '£300/Day Rate IR35 Take-Home 2026-27 | TaxdCalc' }],
  },
  twitter: { card: 'summary_large_image', title: '£300/Day Rate 2026-27 | Inside vs Outside IR35 | TaxdCalc', description: '£300/day: inside IR35 £44,348 vs outside IR35 £49,211/yr.', images: ['/api/og?title=%C2%A3300%2FDay+Rate+2026-27&subtitle=Inside+vs+Outside+IR35'] },
  robots: { index: true, follow: true },
};
export default function Layout({ children }) { return children; }
