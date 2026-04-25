export const metadata = {
  title: 'TaxdCalc — UK Salary & Take-Home Pay Calculator 2026-27',
  description: 'Calculate your UK net salary after income tax, NI, student loan and pension. Free, accurate, updated for 2026-27.',
  metadataBase: new URL('https://taxdcal.co.uk'),
  openGraph: {
    title: 'TaxdCalc — UK Take-Home Pay Calculator 2026-27',
    description: 'Free UK salary calculator updated for 2026-27.',
    url: 'https://taxdcal.co.uk',
    siteName: 'TaxdCalc',
    locale: 'en_GB',
    type: 'website',
    images: [{ url: '/api/og?title=TaxdCalc&subtitle=UK+Pay+Calculator+2026-27', width: 1200, height: 630, alt: 'TaxdCalc — UK Salary Take-Home Pay Calculator 2026-27' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TaxdCalc — UK Take-Home Pay Calculator 2026-27',
    description: 'Free UK salary calculator updated for 2026-27.',
    images: ['/api/og?title=TaxdCalc&subtitle=UK+Pay+Calculator+2026-27'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-GB">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
