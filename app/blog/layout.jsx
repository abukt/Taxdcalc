export const metadata = {
  title: 'UK Tax Guides 2026-27 — Income Tax & NI Explained | TaxdCalc',
  description: 'Plain-English guides to UK take-home pay, income tax, NI, pension tax relief and the 60% trap. All updated for April 2026 changes. Free salary calculator.',
  alternates: { canonical: 'https://taxdcal.co.uk/blog' },
  openGraph: {
    title: 'UK Tax Guides 2026-27 | TaxdCalc',
    description: 'Plain-English guides to UK take-home pay, income tax, NI, pension tax relief and the 60% trap. All updated for April 2026 changes. Free salary calculator.',
    url: 'https://taxdcal.co.uk/blog',
    siteName: 'TaxdCalc',
    locale: 'en_GB',
    type: 'website',
    images: [{ url: '/api/og?title=UK+Tax+Guides+2026-27&subtitle=Income+Tax%2C+NI+%26+Take-Home', width: 1200, height: 630, alt: 'UK Tax Guides 2026-27 | TaxdCalc' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UK Tax Guides 2026-27 | TaxdCalc',
    description: 'Plain-English guides to UK income tax, NI, pension relief and the 60% trap. Updated April 2026.',
    images: ['/api/og?title=UK+Tax+Guides+2026-27&subtitle=Income+Tax%2C+NI+%26+Take-Home'],
  },
  robots: { index: true, follow: true },
};

export default function BlogLayout({ children }) {
  return children;
}
