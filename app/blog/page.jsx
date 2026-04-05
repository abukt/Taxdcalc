import { articles } from '../../lib/articles';
import Link from 'next/link';

export const metadata = {
  title: 'Tax Guides & Salary Advice | TaxdCalc Blog',
  description: 'Plain-English guides to UK income tax, National Insurance, pensions and salary. Updated for 2026-27.',
};

export default function BlogPage() {
  return (
    <div style={{ background: '#F8F9FA', minHeight: '100vh', fontFamily: 'Georgia, serif' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#0C1E3C,#1e3d6e)', padding: '48px 24px 64px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: 'rgba(13,148,136,0.15)', border: '1px solid rgba(20,184,166,0.3)', borderRadius: 20, padding: '4px 14px', fontSize: 11, color: '#14B8A6', marginBottom: 16, fontFamily: 'monospace' }}>
            Tax Guides
          </div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(26px,4vw,42px)', color: 'white', marginBottom: 12, lineHeight: 1.2 }}>
            Understanding Your Tax
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 16, maxWidth: 480, margin: '0 auto' }}>
            Plain-English guides to income tax, National Insurance, pensions and more. Updated for 2026-27.
          </p>
        </div>
      </div>

      {/* Article grid */}
      <div style={{ maxWidth: 1000, margin: '-32px auto 60px', padding: '0 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {articles.map(article => (
            <Link key={article.slug} href={'/blog/' + article.slug} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'white', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.07)', border: '1px solid #E2E8F0', height: '100%', cursor: 'pointer', transition: 'box-shadow 0.2s' }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 14, alignItems: 'center' }}>
                  <span style={{ fontSize: 11, background: '#F0FDFA', color: '#0D9488', border: '1px solid #99F6E4', borderRadius: 4, padding: '2px 8px', fontWeight: 700, fontFamily: 'monospace' }}>
                    {article.category}
                  </span>
                  <span style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'monospace' }}>{article.readTime}</span>
                </div>
                <h2 style={{ fontSize: 17, fontFamily: 'Georgia, serif', color: '#0C1E3C', lineHeight: 1.35, marginBottom: 10 }}>
                  {article.title}
                </h2>
                <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.6, marginBottom: 16 }}>
                  {article.metaDescription}
                </p>
                <div style={{ fontSize: 13, color: '#0D9488', fontWeight: 600 }}>
                  Read guide →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: '#0C1E3C', padding: '48px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 500, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 26, color: 'white', marginBottom: 10 }}>Ready to calculate your take-home pay?</h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 15, marginBottom: 24 }}>Use our free UK salary calculator, updated for 2026-27.</p>
          <Link href="/" style={{ display: 'inline-block', background: '#0D9488', color: 'white', padding: '13px 28px', borderRadius: 8, fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
            Try the Calculator
          </Link>
        </div>
      </div>
    </div>
  );
}
