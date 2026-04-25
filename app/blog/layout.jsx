export const metadata = {
  title: 'UK Tax Guides 2026-27 — Salary, Income Tax & NI Explained | TaxdCalc',
  description: 'Plain-English guides to UK take-home pay, income tax, NI, pension tax relief and the 60% trap. All updated for April 2026 changes. Free salary calculator.',
  alternates: { canonical: 'https://taxdcal.co.uk/blog' },
  openGraph: {
    title: 'UK Tax Guides 2026-27 | TaxdCalc',
    description: 'Plain-English guides to UK take-home pay, income tax, NI, pension tax relief and the 60% trap. All updated for April 2026 changes. Free salary calculator.',
    url: 'https://taxdcal.co.uk/blog',
    siteName: 'TaxdCalc',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export default function BlogLayout({ children }) {
  return children;
}
