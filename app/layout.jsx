import Script from ‘next/script’;

export const metadata = {
title: ‘TaxdCalc — UK Salary & Take-Home Pay Calculator 2026-27’,
description: ‘Free UK salary calculator. See your take-home pay after income tax, National Insurance, student loan and pension. Scotland supported. Updated for 2026-27.’,
openGraph: {
title: ‘TaxdCalc — UK Take-Home Pay Calculator 2026-27’,
description: ‘Free UK salary calculator. Income tax, NI, pension and student loan. Scotland supported.’,
url: ‘https://taxdcalc.co.uk’,
siteName: ‘TaxdCalc’,
type: ‘website’,
},
alternates: {
canonical: ‘https://taxdcalc.co.uk’,
},
robots: {
index: true,
follow: true,
},
};

export default function RootLayout({ children }) {
return (
<html lang="en">
<head>
<Script
async
src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9662262980322033"
crossOrigin="anonymous"
strategy="lazyOnload"
/>
<Script
src="https://www.googletagmanager.com/gtag/js?id=G-KQ1X0ZXFK3"
strategy="afterInteractive"
/>
<Script id="ga4-init" strategy="afterInteractive">
{`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-KQ1X0ZXFK3');`}
</Script>
</head>
<body style={{ margin: 0 }}>{children}</body>
</html>
);
}
