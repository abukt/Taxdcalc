'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// --- CONFIG & THEME ---
const C = {
  navy: '#0C1E3C',
  navyMid: '#1e3d6e',
  teal: '#0D9488',
  tealL: '#14B8A6',
  tealBg: '#F0FDFA',
  tealBd: '#99F6E4',
  border: '#E2E8F0',
  borderDk: '#CBD5E1',
  bg: '#F4F6F9',
  white: '#FFFFFF',
  green: '#059669',
  red: '#DC2626',
  text: '#1E293B',
  mid: '#475569',
  slate: '#64748B',
  sl: '#94A3B8',
  shadow: '0 1px 3px rgba(0,0,0,0.07),0 4px 16px rgba(0,0,0,0.04)'
};

const GS = `@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Source+Serif+4:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}body{background:#F4F6F9;color:#1E293B;font-family:'Source Serif 4',Georgia,serif;-webkit-tap-highlight-color:transparent;}a{text-decoration:none;color:inherit;}button{cursor:pointer;font-family:inherit;}@keyframes fi{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}.fi{animation:fi 0.35s ease both;}`;

// 2026-27 Civil Service Specific Data (England/Wales National Rates)
const GRADES = [
  { grade: 'AA / AO', gross: 24547, penPct: 4.6, desc: 'Admin Officer', th: 20290, mo: 1691 },
  { grade: 'EO', gross: 28230, penPct: 5.45, desc: 'Executive Officer', th: 22614, mo: 1885 },
  { grade: 'HEO', gross: 34080, penPct: 5.45, desc: 'Higher Executive', th: 26571, mo: 2214 },
  { grade: 'SEO', gross: 40474, penPct: 5.45, desc: 'Senior Executive', th: 30896, mo: 2575 },
  { grade: 'Grade 7', gross: 54667, penPct: 5.45, desc: 'Principal', th: 40477, mo: 3373 },
  { grade: 'Grade 6', gross: 68040, penPct: 6.35, desc: 'Senior Manager', th: 47428, mo: 3952 }
];

const fmt = n => '£' + Math.round(Math.abs(n || 0)).toLocaleString('en-GB');
const fmtD = n => '£' + (n || 0).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function useW() {
  const [w, setW] = useState(typeof window !== 'undefined' ? window.innerWidth : 800);
  useEffect(() => {
    const f = () => setW(window.innerWidth);
    window.addEventListener('resize', f);
    return () => window.removeEventListener('resize', f);
  }, []);
  return w;
}

// --- COMPONENTS ---
function Nav() {
  const [open, setOpen] = useState(false);
  const mob = useW() < 640;
  const links = [['/', 'Salary Calculator'], ['/ir35', 'IR35'], ['/nhs', 'NHS Bands'], ['/tools', 'All Tools']];
  return (
    <nav style={{ background: C.navy, position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 16px rgba(0,0,0,0.25)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 30, height: 30, background: 'linear-gradient(135deg,#0D9488,#14B8A6)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontWeight: 700, fontSize: 12, fontFamily: 'JetBrains Mono' }}>Tx</span>
          </div>
          <span style={{ color: 'white', fontFamily: 'DM Serif Display', fontSize: 17 }}>Taxd<span style={{ color: '#14B8A6' }}>Calc</span></span>
        </Link>
        {!mob && (
          <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {links.map(([href, label]) => (
              <Link key={href} href={href} style={{ padding: '7px 13px', borderRadius: 6, color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{label}</Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer style={{ background: '#070D1C', padding: '40px 20px', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: 40 }}>
      <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', fontFamily: 'JetBrains Mono' }}>Updated April 2026 | Public Sector Pay Data</span>
      </div>
    </footer>
  );
}

// --- PAGE ---
export default function Page() {
  const mob = useW() < 640;

  const schemaFAQ = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What is the Civil Service pension contribution?', acceptedAnswer: { '@type': 'Answer', text: 'Alpha pension contributions range from 4.6% to 8.05% depending on your gross salary.' } },
      { '@type': 'Question', name: 'What is London Weighting?', acceptedAnswer: { '@type': 'Answer', text: 'Civil servants in London typically receive an additional allowance of £3,500 to £5,000 depending on the department.' } }
    ]
  };

  return (
    <>
      <style>{GS}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFAQ) }} />
      <Nav />

      {/* Hero Section */}
      <div style={{ background: `linear-gradient(135deg,${C.navy},${C.navyMid})`, padding: mob ? '32px 20px 48px' : '48px 24px 64px', position: 'relative' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: 'rgba(20,184,166,0.15)', border: '1px solid rgba(20,184,166,0.3)', borderRadius: 20, padding: '4px 12px', fontSize: 11, color: '#14B8A6', marginBottom: 12, fontFamily: 'JetBrains Mono' }}>2026-27 Financial Year</div>
          <h1 style={{ fontFamily: 'DM Serif Display', fontSize: mob ? 28 : 42, color: 'white', lineHeight: 1.1, marginBottom: 16 }}>Civil Service Pay & Alpha Pension</h1>
          <p style={{ fontSize: mob ? 15 : 18, color: 'rgba(255,255,255,0.7)', maxWidth: 650, lineHeight: 1.6 }}>
            Understand your take-home pay across different Civil Service grades. Includes calculations for the Alpha pension scheme and latest tax thresholds.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: mob ? '16px' : '24px', marginTop: mob ? -20 : -34 }}>
        
        {/* Main Table Card */}
        <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, boxShadow: C.shadow, overflow: 'hidden', marginBottom: 24 }} className="fi">
          <div style={{ padding: '20px', borderBottom: `1px solid ${C.border}` }}>
            <h2 style={{ fontFamily: 'DM Serif Display', fontSize: 20, color: C.navy }}>Standard Pay Scale (National)</h2>
            <p style={{ fontSize: 13, color: C.slate }}>Estimated net pay after Alpha pension, Income Tax, and National Insurance.</p>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead style={{ background: C.bg }}>
                <tr>
                  {['Grade', 'Gross Salary', 'Annual Net', 'Monthly Net', 'Pension'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: 10, textTransform: 'uppercase', color: C.slate, fontFamily: 'JetBrains Mono', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {GRADES.map((g, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.01)' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: C.navy }}>{g.grade}</td>
                    <td style={{ padding: '14px 16px', fontFamily: 'JetBrains Mono' }}>{fmt(g.gross)}</td>
                    <td style={{ padding: '14px 16px', fontFamily: 'JetBrains Mono', color: C.teal, fontWeight: 700 }}>{fmt(g.th)}</td>
                    <td style={{ padding: '14px 16px', fontFamily: 'JetBrains Mono', color: C.teal, fontWeight: 700 }}>{fmtD(g.mo)}</td>
                    <td style={{ padding: '14px 16px', fontSize: 11, color: C.slate }}>{g.penPct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gap: 20, marginBottom: 24 }}>
          <div style={{ background: C.tealBg, padding: 24, borderRadius: 12, border: `1px solid ${C.tealBd}` }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: C.teal, marginBottom: 10 }}>Alpha Pension Scheme</h3>
            <p style={{ fontSize: 14, color: '#0f766e', lineHeight: 1.7 }}>
              The Alpha scheme is a defined benefit pension. For 2026-27, the employer contribution averages <strong>27% - 28.9%</strong>. Contributions are taken from your gross pay, reducing your taxable income.
            </p>
          </div>
          <div style={{ background: C.white, padding: 24, borderRadius: 12, border: `1px solid ${C.border}` }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: C.navy, marginBottom: 10 }}>London Weighting</h3>
            <p style={{ fontSize: 14, color: C.mid, lineHeight: 1.7 }}>
              Salaries above are "National" rates. Civil Servants in London usually receive an additional <strong>London Pay Addition</strong> ranging from £3,800 to £5,500 depending on the department.
            </p>
          </div>
        </div>

        {/* Summary Block */}
        <div style={{ background: C.navy, color: 'white', padding: 32, borderRadius: 12, textAlign: 'center' }}>
          <h3 style={{ fontFamily: 'DM Serif Display', fontSize: 22, marginBottom: 8 }}>Get a precise breakdown</h3>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', marginBottom: 20, maxWidth: 500, margin: '0 auto 20px' }}>
            Our full calculator allows you to factor in London Weighting, student loans, and custom pension percentages.
          </p>
          <Link href="/" style={{ background: C.teal, color: 'white', padding: '12px 24px', borderRadius: 8, fontSize: 14, fontWeight: 700, display: 'inline-block' }}>
            Open Advanced Calculator →
          </Link>
        </div>
      </div>
      
      <Footer />
    </>
  );
}
