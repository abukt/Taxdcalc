'use client';
import Link from 'next/link';

export default function Error({ error, reset }) {
  return (
    <div style={{ minHeight: '100vh', background: '#F4F6F9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: "'Source Serif 4', Georgia, serif" }}>
      <div style={{ maxWidth: 480, textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, background: 'linear-gradient(135deg,#0D9488,#14B8A6)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <span style={{ color: 'white', fontWeight: 700, fontSize: 18, fontFamily: 'JetBrains Mono' }}>!</span>
        </div>
        <h1 style={{ fontFamily: 'DM Serif Display', fontSize: 28, color: '#0C1E3C', marginBottom: 12 }}>Something went wrong</h1>
        <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.6, marginBottom: 28 }}>
          An error occurred loading this page. Try refreshing, or go back to the calculator.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={reset}
            style={{ background: '#0D9488', color: 'white', border: 'none', padding: '11px 22px', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
          >
            Try again
          </button>
          <Link
            href="/"
            style={{ background: '#0C1E3C', color: 'white', padding: '11px 22px', borderRadius: 8, fontSize: 14, fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}
          >
            Go to calculator
          </Link>
        </div>
      </div>
    </div>
  );
}
