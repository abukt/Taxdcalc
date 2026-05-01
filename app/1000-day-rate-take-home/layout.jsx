export const metadata = {
  title: '£1,000/Day Rate 2026-27: £117,818 Inside vs £126,574 Outside IR35 | TaxdCalc',
  description: '£1,000/day contractor take-home 2026-27: £117,818/yr inside IR35 (PAYE) vs £126,574/yr outside IR35 (Ltd Co). Based on 220 working days.',
  alternates: { canonical: 'https://taxdcal.co.uk/1000-day-rate-take-home' },
  openGraph: {
    title: '£1,000/Day Rate 2026-27: £117,818 Inside vs £126,574 Outside IR35',
    description: '£1,000/day contractor take-home: inside IR35 £117,818 vs outside IR35 £126,574. Outside wins by £8,756.',
    url: 'https://taxdcal.co.uk/1000-day-rate-take-home',
    siteName: 'TaxdCalc', locale: 'en_GB', type: 'website',
    images: [{ url: '/api/og?title=%C2%A31%2C000%2FDay+Rate+2026-27&subtitle=Inside+vs+Outside+IR35', width: 1200, height: 630, alt: '£1,000/Day Rate IR35 Take-Home 2026-27 | TaxdCalc' }],
  },
  twitter: { card: 'summary_large_image', title: '£1,000/Day Rate 2026-27 | Inside vs Outside IR35 | TaxdCalc', description: '£1,000/day: inside IR35 £117,818 vs outside IR35 £126,574/yr.', images: ['/api/og?title=%C2%A31%2C000%2FDay+Rate+2026-27&subtitle=Inside+vs+Outside+IR35'] },
  robots: { index: true, follow: true },
};
export default function Layout({ children }) { return children; }
