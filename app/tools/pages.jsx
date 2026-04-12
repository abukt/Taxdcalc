'use client';
import Link from 'next/link';
import { NavBar, Footer, GLOBAL_CSS, C, useWidth } from '../AppRoot';

const TOOLS = [
  {
    category: 'Employee Calculators',
    emoji: '👤',
    items: [
      { href: '/', label: 'Salary Calculator', desc: 'Annual salary to take-home pay' },
      { href: '/hourly', label: 'Hourly Rate Calculator', desc: 'Hourly wage to annual take-home' },
      { href: '/bonus', label: 'Bonus Tax Calculator', desc: 'See your net bonus after tax' },
      { href: '/sacrifice', label: 'Salary Sacrifice Calculator', desc: 'Pension, EV, cycle to work' },
      { href: '/comparison', label: 'Job Offer Comparison', desc: 'Compare two salary packages' },
    ],
  },
  {
    category: 'Contractor and Freelancer',
    emoji: '💻',
    items: [
      { href: '/ir35', label: 'IR35 Calculator', desc: 'Inside vs outside IR35 comparison' },
    ],
  },
  {
    category: 'Sector-Specific',
    emoji: '🏥',
    items: [
      { href: '/nhs', label: 'NHS Pay Band Calculator', desc: 'All bands 1-9 take-home pay' },
      { href: '/maternity', label: 'Maternity Pay Calculator', desc: 'SMP and enhanced maternity pay' },
    ],
  },
  {
    category: 'Tax Guides',
    emoji: '📖',
    items: [
      { href: '/blog/how-uk-tax-brackets-work', label: 'How UK Tax Brackets Work', desc: 'Marginal rates explained simply' },
      { href: '/blog/national-insurance-explained', label: 'National Insurance Explained', desc: 'What you pay and why' },
      { href: '/blog/pension-tax-relief-explained', label: 'Pension Tax Relief', desc: 'How to get free money from HMRC' },
      { href: '/blog/2026-27-tax-year-changes', label: '2026-27 Tax Year Changes', desc: 'Everything that changed in April 2026' },
    ],
  },
  {
    category: 'Coming Soon',
    emoji: '🌍',
    items: [
      { href: '#', label: 'Canada Salary Calculator', desc: 'Federal + provincial take-home', soon: true },
      { href: '#', label: 'Australia Salary Calculator', desc: 'ATO rates + superannuation', soon: true },
      { href: '#', label: 'Netherlands Salary Calculator', desc: 'Box 1/2/3 + 30% ruling', soon: true },
      { href: '#', label: 'Sweden Salary Calculator', desc: 'State + municipal income tax', soon: true },
    ],
  },
];

export default function ToolsPage() {
  const w = useWidth();
  const mob = w < 640;

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <NavBar active="/tools" />

      <div style={{ background: 'linear-gradient(135deg,#0C1E3C,#1e3d6e)', padding: mob ? '38px 20px 58px' : '46px 24px 64px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, right: -30, width: 200, height: 200, borderRadius: '50%', background: 'rgba(13,148,136,0.08)', pointerEvents: 'none' }} />
        <h1 style={{ fontFamily: 'DM Serif Display', fontSize: mob ? 26 : 42, color: 'white', marginBottom: 8 }}>All Calculators</h1>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14 }}>Every tool for every UK worker, contractor and employer. Free, updated for 2026-27.</p>
      </div>

      <div style={{ maxWidth: 1100, margin: mob ? '-22px 0 0' : '-26px auto 0', padding: mob ? '0 16px 48px' : '0 24px 60px' }}>
        {TOOLS.map(section => (
          <div key={section.category} style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 20 }}>{section.emoji}</span>
              <h2 style={{ fontFamily: 'DM Serif Display', fontSize: 20, color: C.navy }}>{section.category}</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : 'repeat(auto-fill,minmax(240px,1fr))', gap: 12 }}>
              {section.items.map(item => (
                <Link key={item.href + item.label} href={item.href}
                  style={{ background: 'white', border: '1px solid ' + (item.soon ? C.border : C.border), borderRadius: 10, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 4, transition: 'all 0.2s', boxShadow: C.shadow, opacity: item.soon ? 0.6 : 1, pointerEvents: item.soon ? 'none' : 'auto' }}
                  onMouseEnter={e => { if (!item.soon) { e.currentTarget.style.borderColor = C.teal; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)'; } }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = C.shadow; }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.navy, lineHeight: 1.3 }}>{item.label}</span>
                    {item.soon && <span style={{ fontSize: 9, background: '#F1F5F9', color: C.slate, borderRadius: 3, padding: '2px 6px', fontWeight: 700, fontFamily: 'JetBrains Mono', flexShrink: 0 }}>SOON</span>}
                    {!item.soon && <span style={{ color: C.slateLight, fontSize: 14 }}>→</span>}
                  </div>
                  <span style={{ fontSize: 12, color: C.slate }}>{item.desc}</span>
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
