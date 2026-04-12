export const metadata = {
  title: 'TaxdCal - UK Salary & Take-Home Pay Calculator 2026-27',
  description: 'Calculate your UK net salary after income tax, NI, student loan and pension. Free, accurate, updated for 2026-27.',
  metadataBase: new URL('https://taxdcal.co.uk'),
  openGraph: {
    title: 'TaxdCal - UK Take-Home Pay Calculator',
    description: 'Free UK salary calculator updated for 2026-27.',
    url: 'https://taxdcal.co.uk',
    siteName: 'TaxdCal',
    locale: 'en_GB',
    type: 'website',
  },
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-GB">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
