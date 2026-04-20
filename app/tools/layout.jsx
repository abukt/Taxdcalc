// app/tools/layout.jsx
// Server component — canonical metadata for the /tools hub page.
// Prevents redirect loops caused by missing canonical on client-only pages.

export const metadata = {
  title: 'All UK Tax & Salary Calculators 2026-27 | TaxdCalc — Tools Hub',
  description: 'Every free UK pay calculator in one place: salary, IR35, NHS bands, maternity, bonus, hourly rate, salary sacrifice, job comparison, part-time and more. Updated for 2026-27.',
  alternates: {
    canonical: 'https://taxdcal.co.uk/tools',
  },
  openGraph: {
    title: 'All UK Tax & Salary Calculators 2026-27 | TaxdCalc',
    description: 'Every free UK pay calculator: salary, IR35, NHS, maternity, bonus, hourly, sacrifice, comparison, part-time and more.',
    url: 'https://taxdcal.co.uk/tools',
    siteName: 'TaxdCalc',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All UK Tax & Salary Calculators 2026-27 | TaxdCalc',
    description: 'Every free UK pay calculator in one place. Updated for 2026-27.',
  },
  robots: { index: true, follow: true },
};

export default function ToolsLayout({ children }) {
  return children;
}