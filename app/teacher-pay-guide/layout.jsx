export const metadata = {
  title: 'Teacher Pay Guide 2026-27 — MPR & UPR Take-Home | TaxdCalc',
  description: 'Teacher pay guide 2026-27. MPR M1 at £32,916 through UPR U3 with TPS pension deductions. England, Wales, London and outer London scales included.',
  alternates: { canonical: 'https://taxdcal.co.uk/teacher-pay-guide' },
  openGraph: {
    title: 'Teacher Pay Guide 2026-27 | TaxdCalc',
    description: 'Teacher pay guide 2026-27. MPR M1 at £32,916 through UPR U3 with TPS pension deductions. England, Wales, London and outer London scales included.',
    url: 'https://taxdcal.co.uk/teacher-pay-guide',
    siteName: 'TaxdCalc',
    locale: 'en_GB',
    type: 'website',
    images: [{ url: '/api/og?title=Teacher+Pay+Guide+2026-27&subtitle=MPR+%26+UPR+Take-Home', width: 1200, height: 630, alt: 'Teacher Pay Guide 2026-27 — MPR & UPR Take-Home | TaxdCalc' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Teacher Pay Guide 2026-27 | TaxdCalc',
    description: 'MPR M1 to UPR U3 take-home pay with TPS pension. England, Wales and London scales.',
    images: ['/api/og?title=Teacher+Pay+Guide+2026-27&subtitle=MPR+%26+UPR+Take-Home'],
  },
  robots: { index: true, follow: true },
};

export default function TeacherPayGuideLayout({ children }) {
  return children;
}
