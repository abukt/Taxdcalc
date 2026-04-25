export const metadata = {
  title: 'UK Salary Calculator Widget — Embeddable | TaxdCalc',
  description: 'Free embeddable UK salary calculator widget for 2026-27. Add to any website with a single iframe. Calculates income tax, NI and take-home pay.',
  alternates: { canonical: 'https://taxdcal.co.uk/embed' },
  openGraph: {
    title: 'Embeddable UK Salary Calculator Widget | TaxdCalc',
    description: 'Free embeddable UK salary calculator widget. One iframe, instant take-home results.',
    url: 'https://taxdcal.co.uk/embed',
    siteName: 'TaxdCalc',
    locale: 'en_GB',
    type: 'website',
    images: [{ url: '/api/og?title=Salary+Calculator+Widget&subtitle=Free+Embeddable+UK+Tool', width: 1200, height: 630, alt: 'Embeddable UK Salary Calculator Widget | TaxdCalc' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Embeddable UK Salary Calculator Widget | TaxdCalc',
    description: 'Free embeddable UK salary calculator. One iframe, instant take-home results for 2026-27.',
    images: ['/api/og?title=Salary+Calculator+Widget&subtitle=Free+Embeddable+UK+Tool'],
  },
  robots: { index: true, follow: true },
};

export default function EmbedLayout({ children }) {
  return children;
}
