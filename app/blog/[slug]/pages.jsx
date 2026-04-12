‘use client’;
import Link from ‘next/link’;
import { NavBar, Footer, GLOBAL_CSS, C, useWidth } from ‘../../AppRoot’;
import { articles, getArticle } from ‘../../lib/articles-meta’;
import { useParams } from ‘next/navigation’;

function renderContent(content) {
const lines = content.trim().split(’\n’);
const elements = [];
let i = 0;

while (i < lines.length) {
const line = lines[i].trim();
if (!line) { i++; continue; }

```
if (line.startsWith('## ')) {
  elements.push(
    <h2 key={i} style={{ fontFamily: 'DM Serif Display', fontSize: 22, color: '#0C1E3C', margin: '32px 0 12px', lineHeight: 1.2 }}>
      {line.replace('## ', '')}
    </h2>
  );
} else if (line.startsWith('### ')) {
  elements.push(
    <h3 key={i} style={{ fontFamily: 'DM Serif Display', fontSize: 18, color: '#0C1E3C', margin: '24px 0 8px' }}>
      {line.replace('### ', '')}
    </h3>
  );
} else if (line.startsWith('- **')) {
  const parts = line.replace('- **', '').split('**:');
  elements.push(
    <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8, paddingLeft: 8 }}>
      <span style={{ color: '#0D9488', flexShrink: 0, marginTop: 2 }}>▸</span>
      <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.7, margin: 0 }}>
        <strong style={{ color: '#1E293B' }}>{parts[0]}</strong>{parts[1] ? ':' + parts[1] : ''}
      </p>
    </div>
  );
} else if (line.startsWith('- ')) {
  elements.push(
    <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 6, paddingLeft: 8 }}>
      <span style={{ color: '#0D9488', flexShrink: 0, marginTop: 2 }}>▸</span>
      <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.7, margin: 0 }}>{line.replace('- ', '')}</p>
    </div>
  );
} else if (line.startsWith('**') && line.endsWith('**')) {
  elements.push(
    <p key={i} style={{ fontSize: 15, color: '#1E293B', lineHeight: 1.8, margin: '0 0 14px', fontWeight: 700 }}>
      {line.replace(/\*\*/g, '')}
    </p>
  );
} else {
  const formatted = line
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/£([\d,]+)/g, '<strong style="color:#0D9488">£$1</strong>');
  elements.push(
    <p key={i} style={{ fontSize: 15, color: '#475569', lineHeight: 1.8, margin: '0 0 14px' }} dangerouslySetInnerHTML={{ __html: formatted }} />
  );
}
i++;
```

}
return elements;
}

export default function BlogPostPage() {
const params = useParams();
const w = useWidth();
const mob = w < 640;
const article = getArticle(params.slug);

if (!article) {
return (
<>
<style>{GLOBAL_CSS}</style>
<NavBar active="/blog" />
<div style={{ maxWidth: 680, margin: ‘60px auto’, padding: ‘0 24px’, textAlign: ‘center’ }}>
<h1 style={{ fontFamily: ‘DM Serif Display’, fontSize: 32, color: ‘#0C1E3C’, marginBottom: 16 }}>Article not found</h1>
<Link href=”/blog” style={{ color: ‘#0D9488’, fontSize: 15 }}>Back to all guides</Link>
</div>
<Footer />
</>
);
}

const related = articles.filter(a => a.slug !== article.slug).slice(0, 2);

return (
<>
<style>{GLOBAL_CSS}</style>
<NavBar active="/blog" />

```
  <div style={{ background: 'linear-gradient(135deg,#0C1E3C,#1e3d6e)', padding: mob ? '36px 20px 56px' : '44px 24px 64px', position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: -40, right: -30, width: 200, height: 200, borderRadius: '50%', background: 'rgba(13,148,136,0.08)', pointerEvents: 'none' }} />
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 16, fontFamily: 'JetBrains Mono' }}>
        ← Back to Tax Guides
      </Link>
      <div style={{ display: 'inline-block', background: 'rgba(13,148,136,0.15)', border: '1px solid rgba(20,184,166,0.3)', borderRadius: 20, padding: '4px 13px', fontSize: 11, color: '#14B8A6', marginBottom: 14, fontFamily: 'JetBrains Mono', display: 'block', width: 'fit-content' }}>{article.category}</div>
      <h1 style={{ fontFamily: 'DM Serif Display', fontSize: mob ? 24 : 36, color: 'white', lineHeight: 1.2, marginBottom: 12 }}>{article.title}</h1>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: 'JetBrains Mono' }}>{article.date}</span>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: 'JetBrains Mono' }}>{article.readTime}</span>
        <span style={{ fontSize: 12, color: '#14B8A6', fontFamily: 'JetBrains Mono' }}>Updated for 2026-27</span>
      </div>
    </div>
  </div>

  <div style={{ maxWidth: 700, margin: mob ? '-20px 0 0' : '-28px auto 0', padding: mob ? '0 16px 48px' : '0 24px 60px' }}>
    <div style={{ background: 'white', borderRadius: 14, padding: mob ? '24px 20px' : '36px 40px', boxShadow: C.shadow, border: '1px solid ' + C.border, marginBottom: 24 }} className="fu">
      <p style={{ fontSize: 16, color: C.textMid, lineHeight: 1.75, marginBottom: 24, fontStyle: 'italic', borderLeft: '3px solid ' + C.teal, paddingLeft: 16 }}>
        {article.description}
      </p>
      {renderContent(article.content)}
    </div>

    <div style={{ background: C.tealBg, border: '1px solid ' + C.tealBorder, borderRadius: 12, padding: '20px 22px', marginBottom: 24 }}>
      <div style={{ fontFamily: 'DM Serif Display', fontSize: 17, color: C.navy, marginBottom: 8 }}>Calculate yours now</div>
      <p style={{ fontSize: 13, color: C.textMid, marginBottom: 14, lineHeight: 1.6 }}>Use the TaxdCalc salary calculator to see your exact take-home pay for 2026-27.</p>
      <Link href="/" style={{ display: 'inline-block', background: C.teal, color: 'white', padding: '11px 22px', borderRadius: 8, fontSize: 13, fontWeight: 700, fontFamily: 'Source Serif 4' }}>
        Open Calculator →
      </Link>
    </div>

    {related.length > 0 && (
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.teal, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 14, fontFamily: 'JetBrains Mono' }}>More Guides</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {related.map(r => (
            <Link key={r.slug} href={'/blog/' + r.slug}
              style={{ background: 'white', border: '1px solid ' + C.border, borderRadius: 10, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, transition: 'all 0.2s', boxShadow: C.shadow }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.teal; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.navy, marginBottom: 3 }}>{r.title}</div>
                <div style={{ fontSize: 12, color: C.slate }}>{r.readTime}</div>
              </div>
              <span style={{ color: C.teal, fontSize: 18, flexShrink: 0 }}>→</span>
            </Link>
          ))}
        </div>
      </div>
    )}
  </div>

  <Footer />
</>
```

);
}
