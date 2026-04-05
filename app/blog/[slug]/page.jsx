import { articles } from ‘../../../lib/articles’;
import Link from ‘next/link’;
import { notFound } from ‘next/navigation’;

export async function generateStaticParams() {
return articles.map(a => ({ slug: a.slug }));
}

export async function generateMetadata({ params }) {
const article = articles.find(a => a.slug === params.slug);
if (!article) return {};
return {
title: article.metaTitle,
description: article.metaDescription,
};
}

function parseContent(content) {
const lines = content.trim().split(’\n’);
const elements = [];
let i = 0;
let tableBuffer = [];
let inTable = false;

while (i < lines.length) {
const line = lines[i];

```
// Table detection
if (line.trim().startsWith('|')) {
  if (!inTable) inTable = true;
  tableBuffer.push(line.trim());
  i++;
  continue;
} else if (inTable) {
  // Render table
  const rows = tableBuffer.filter(r => !r.match(/^\|[-|:\s]+\|$/));
  const headerRow = rows[0];
  const dataRows = rows.slice(1);
  const headers = headerRow.split('|').filter(c => c.trim()).map(c => c.trim());
  elements.push(
    <div key={'table-' + i} style={{ overflowX: 'auto', margin: '20px 0' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr>
            {headers.map((h, j) => (
              <th key={j} style={{ background: '#F0FDFA', color: '#0D9488', padding: '10px 14px', textAlign: 'left', borderBottom: '2px solid #99F6E4', fontSize: 13, fontWeight: 700 }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataRows.map((row, ri) => {
            const cells = row.split('|').filter(c => c.trim()).map(c => c.trim());
            return (
              <tr key={ri} style={{ background: ri % 2 === 0 ? 'white' : '#F8F9FA' }}>
                {cells.map((cell, ci) => (
                  <td key={ci} style={{ padding: '9px 14px', borderBottom: '1px solid #E2E8F0', fontSize: 13, color: '#1E293B' }}>
                    {cell}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
  tableBuffer = [];
  inTable = false;
  continue;
}

// H2
if (line.startsWith('## ')) {
  elements.push(
    <h2 key={i} style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(18px,3vw,24px)', color: '#0C1E3C', marginTop: 40, marginBottom: 14, lineHeight: 1.3 }}>
      {line.replace('## ', '')}
    </h2>
  );
}
// H3
else if (line.startsWith('### ')) {
  elements.push(
    <h3 key={i} style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: '#0C1E3C', marginTop: 28, marginBottom: 10 }}>
      {line.replace('### ', '')}
    </h3>
  );
}
// Bold paragraph (FAQ question style)
else if (line.startsWith('**') && line.endsWith('**')) {
  elements.push(
    <p key={i} style={{ fontSize: 15, color: '#0C1E3C', fontWeight: 700, marginTop: 16, marginBottom: 4, lineHeight: 1.6 }}>
      {line.replace(/\*\*/g, '')}
    </p>
  );
}
// Bullet point
else if (line.startsWith('- ')) {
  const text = line.replace('- ', '');
  // Check if it has bold inside
  const parts = text.split(/\*\*(.*?)\*\*/g);
  elements.push(
    <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'flex-start' }}>
      <span style={{ color: '#0D9488', flexShrink: 0, marginTop: 2, fontSize: 16, lineHeight: 1.5 }}>•</span>
      <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.7, margin: 0 }}>
        {parts.map((part, pi) =>
          pi % 2 === 1 ? <strong key={pi} style={{ color: '#0C1E3C' }}>{part}</strong> : part
        )}
      </p>
    </div>
  );
}
// Empty line
else if (line.trim() === '') {
  // skip
}
// Regular paragraph
else if (line.trim()) {
  const parts = line.split(/\*\*(.*?)\*\*/g);
  elements.push(
    <p key={i} style={{ fontSize: 15, color: '#475569', lineHeight: 1.8, marginBottom: 16 }}>
      {parts.map((part, pi) =>
        pi % 2 === 1 ? <strong key={pi} style={{ color: '#0C1E3C' }}>{part}</strong> : part
      )}
    </p>
  );
}

i++;
```

}
return elements;
}

export default function ArticlePage({ params }) {
const article = articles.find(a => a.slug === params.slug);
if (!article) notFound();

const otherArticles = articles.filter(a => a.slug !== params.slug).slice(0, 3);

return (
<div style={{ background: ‘#F8F9FA’, minHeight: ‘100vh’, fontFamily: ‘Georgia, serif’ }}>

```
  {/* Nav breadcrumb */}
  <div style={{ background: '#0C1E3C', padding: '0 24px' }}>
    <div style={{ maxWidth: 800, margin: '0 auto', height: 52, display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
      <Link href="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>TaxdCalc</Link>
      <span style={{ color: 'rgba(255,255,255,0.25)' }}>›</span>
      <Link href="/blog" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Guides</Link>
      <span style={{ color: 'rgba(255,255,255,0.25)' }}>›</span>
      <span style={{ color: '#14B8A6' }}>{article.category}</span>
    </div>
  </div>

  {/* Hero */}
  <div style={{ background: 'linear-gradient(135deg,#0C1E3C,#1e3d6e)', padding: 'clamp(32px,5vw,56px) 24px clamp(40px,6vw,72px)', position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(13,148,136,0.08)' }} />
    <div style={{ maxWidth: 740, margin: '0 auto', position: 'relative' }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 11, background: 'rgba(13,148,136,0.15)', color: '#14B8A6', border: '1px solid rgba(20,184,166,0.3)', borderRadius: 4, padding: '2px 10px', fontFamily: 'monospace', fontWeight: 700 }}>
          {article.category}
        </span>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>{article.readTime}</span>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>Updated {article.date}</span>
      </div>
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px,4vw,42px)', color: 'white', lineHeight: 1.2, marginBottom: 16, letterSpacing: '-0.01em' }}>
        {article.title}
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 16, lineHeight: 1.65, maxWidth: 560 }}>
        {article.metaDescription}
      </p>
    </div>
  </div>

  {/* Calculator CTA strip */}
  <div style={{ background: '#F0FDFA', borderBottom: '1px solid #99F6E4', padding: '14px 24px' }}>
    <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
      <span style={{ fontSize: 14, color: '#0D9488', fontWeight: 600 }}>See how this affects your pay</span>
      <Link href="/" style={{ display: 'inline-block', background: '#0D9488', color: 'white', padding: '9px 20px', borderRadius: 7, fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
        Try the Calculator →
      </Link>
    </div>
  </div>

  {/* Article body */}
  <div style={{ maxWidth: 800, margin: '0 auto', padding: 'clamp(24px,4vw,48px) 20px' }}>
    <div style={{ background: 'white', borderRadius: 14, padding: 'clamp(20px,4vw,40px)', boxShadow: '0 1px 3px rgba(0,0,0,0.07)', border: '1px solid #E2E8F0' }}>
      {parseContent(article.content)}
    </div>

    {/* Bottom CTA */}
    <div style={{ background: 'linear-gradient(135deg,#0C1E3C,#1e3d6e)', borderRadius: 14, padding: 'clamp(20px,4vw,36px)', marginTop: 28, textAlign: 'center' }}>
      <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: 'white', marginBottom: 8 }}>Calculate your exact take-home pay</h3>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginBottom: 20 }}>Free, accurate, updated for 2026-27. No sign-up required.</p>
      <Link href="/" style={{ display: 'inline-block', background: '#0D9488', color: 'white', padding: '13px 28px', borderRadius: 8, fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
        Open Salary Calculator
      </Link>
    </div>

    {/* Related articles */}
    {otherArticles.length > 0 && (
      <div style={{ marginTop: 36 }}>
        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: '#0C1E3C', marginBottom: 16 }}>More Tax Guides</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 14 }}>
          {otherArticles.map(a => (
            <Link key={a.slug} href={'/blog/' + a.slug} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'white', borderRadius: 10, padding: 18, border: '1px solid #E2E8F0', cursor: 'pointer' }}>
                <div style={{ fontSize: 10, color: '#0D9488', fontWeight: 700, fontFamily: 'monospace', marginBottom: 6, textTransform: 'uppercase' }}>{a.category}</div>
                <div style={{ fontSize: 14, fontFamily: 'Georgia, serif', color: '#0C1E3C', lineHeight: 1.4, marginBottom: 8 }}>{a.title}</div>
                <div style={{ fontSize: 13, color: '#0D9488', fontWeight: 600 }}>Read →</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    )}
  </div>

  {/* Footer */}
  <footer style={{ background: '#070D1C', padding: '24px 20px', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: 40 }}>
    <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
      <Link href="/" style={{ color: '#14B8A6', textDecoration: 'none', fontFamily: 'Georgia, serif', fontSize: 16 }}>TaxdCalc</Link>
      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace' }}>Updated {article.date} · 2026-27 tax year</span>
      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.18)', maxWidth: 280, lineHeight: 1.5 }}>For guidance only. Always consult HMRC or a qualified adviser.</span>
    </div>
  </footer>
</div>
```

);
}
