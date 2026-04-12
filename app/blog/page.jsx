use client';
import Link from 'next/link';
import { NavBar, Footer, GLOBAL_CSS, C, useWidth } from '../AppRoot';
import { articles } from '../lib/articles-meta';

export default function BlogPage() {
  const w = useWidth();
  const mob = w < 640;

  const categories = [...new Set(articles.map(a => a.category))];

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <NavBar active="/blog" />

      <div style={{ background: 'linear-gradient(135deg,#0C1E3C,#1e3d6e)', padding: mob ? '38px 20px 58px' : '46px 24px 64px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, right: -30, width: 200, height: 200, borderRadius: '50%', background: 'rgba(13,148,136,0.08)', pointerEvents: 'none' }} />
        <div style={{ display: 'inline-block', background: 'rgba(13,148,136,0.15)', border: '1px solid rgba(20,184,166,0.3)', borderRadius: 20, padding: '4px 13px', fontSize: 11, color: '#14B8A6', marginBottom: 14, fontFamily: 'JetBrains Mono' }}>Tax Guides</div>
        <h1 style={{ fontFamily: 'DM Serif Display', fontSize: mob ? 26 : 42, color: 'white', marginBottom: 8 }}>UK Tax Guides 2026-27</h1>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, maxWidth: 400, margin: '0 auto' }}>Plain-English guides to income tax, National Insurance, pensions and your payslip.</p>
      </div>

      <div style={{ maxWidth: 860, margin: mob ? '-22px 0 0' : '-26px auto 0', padding: mob ? '0 16px 48px' : '0 24px 60px' }}>
        {categories.map(cat => (
          <div key={cat} style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.teal, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 14, fontFamily: 'JetBrains Mono', paddingBottom: 8, borderBottom: '2px solid ' + C.teal }}>{cat}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {articles.filter(a => a.category === cat).map(article => (
                <Link key={article.slug} href={'/blog/' + article.slug}
                  style={{ background: 'white', border: '1px solid ' + C.border, borderRadius: 12, padding: mob ? '18px 18px' : '20px 24px', display: 'block', transition: 'all 0.2s', boxShadow: C.shadow }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.teal; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = 'none'; }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <h2 style={{ fontFamily: 'DM Serif Display', fontSize: mob ? 17 : 20, color: C.navy, marginBottom: 6, lineHeight: 1.3 }}>{article.title}</h2>
                      <p style={{ fontSize: 13, color: C.textMid, lineHeight: 1.6, marginBottom: 10 }}>{article.description}</p>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <span style={{ fontSize: 11, color: C.slate, fontFamily: 'JetBrains Mono' }}>{article.date}</span>
                        <span style={{ fontSize: 11, color: C.slate }}>{article.readTime}</span>
                      </div>
                    </div>
                    <span style={{ color: C.teal, fontSize: 20, flexShrink: 0, marginTop: 4 }}>→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Footer />
    </>
  );
}
