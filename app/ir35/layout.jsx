// app/ir35/layout.jsx
// SERVER COMPONENT — provides metadata with canonical to fix GSC indexing error.
// Root cause: 'use client' pages cannot export metadata. This layout.jsx
// runs server-side and injects the correct <head> for the /ir35 route.
// Single canonical URL: https://taxdcal.co.uk/ir35 — no trailing slash.

export const metadata = {
  title: 'IR35 Calculator 2026-27 — Inside vs Outside Take-Home | TaxdCalc',
  description: 'Compare PAYE inside IR35 vs Limited Company outside IR35 for any day rate. Updated for 10.75% dividend tax from April 2026. Free UK contractor calculator.',
  keywords: 'IR35 calculator, inside outside IR35, contractor take home pay, IR35 2026, dividend tax contractor',
  alternates: {
    canonical: 'https://taxdcal.co.uk/ir35',
  },
  openGraph: {
    title: 'IR35 Calculator 2026-27 — Inside vs Outside Take-Home | TaxdCalc',
    description: 'Compare PAYE inside IR35 vs Limited Company outside IR35 for any day rate. Updated for 10.75% dividend tax.',
    url: 'https://taxdcal.co.uk/ir35',
    siteName: 'TaxdCalc',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IR35 Calculator 2026-27 — Inside vs Outside Take-Home',
    description: 'Compare PAYE vs Ltd Company for any day rate. Updated for April 2026 dividend tax changes.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function IR35Layout({ children }) {
  return children;
}