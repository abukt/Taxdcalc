import Link from 'next/link';

export const metadata = {
  title: 'Page Not Found | TaxdCalc',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', background: '#F4F6F9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: "'Source Serif 4', Georgia, serif" }}>
      <div style={{ maxWidth: 480, textAlign: 'center' }}>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 64, fontWeight: 700, color: '#E2E8F0', marginBottom: 8, lineHeight: 1 }}>404</div>
        <h1 style={{ fontFamily: 'DM Serif Display', fontSize: 28, color: '#0C1E3C', marginBottom: 12 }}>Page not found</h1>
        <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.6, marginBottom: 28 }}>
          This page doesn&apos;t exist. Try one of these instead:
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{ background: '#0D9488', color: 'white', padding: '11px 22px', borderRadius: 8, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
            Salary Calculator
          </Link>
          <Link href="/blog" style={{ background: '#0C1E3C', color: 'white', padding: '11px 22px', borderRadius: 8, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
            Tax Guides
          </Link>
          <Link href="/tools" style={{ background: 'white', color: '#0C1E3C', border: '1px solid #E2E8F0', padding: '11px 22px', borderRadius: 8, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
            All Tools
          </Link>
        </div>
      </div>
    </div>
  );
}
