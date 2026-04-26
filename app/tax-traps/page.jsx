'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

function useW() {
  const [w, setW] = useState(typeof window !== 'undefined' ? window.innerWidth : 800);
  useEffect(() => {
    const f = () => setW(window.innerWidth);
    window.addEventListener('resize', f);
    return () => window.removeEventListener('resize', f);
  }, []);
  return w;
}

const C = {
  navy: '#0C1E3C', navyM: '#1e3d6e',
  teal: '#0D9488', tealL: '#14B8A6', tealBg: '#F0FDFA', tealBd: '#99F6E4',
  red: '#DC2626', redBg: '#FEF2F2', redBd: '#FECACA',
  orange: '#EA580C', orgBg: '#FFF7ED', orgBd: '#FED7AA',
  amber: '#D97706', amberBg: '#FFFBEB', amberBd: '#FDE68A',
  border: '#E2E8F0', white: '#FFFFFF',
  text: '#1E293B', mid: '#475569', slate: '#64748B',
  shadow: '0 1px 3px rgba(0,0,0,0.07),0 4px 16px rgba(0,0,0,0.04)',
};

const GS = `@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Source+Serif+4:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{background:#F4F6F9;color:#1E293B;font-family:'Source Serif 4',Georgia,serif;}
a{text-decoration:none;color:inherit;}
@keyframes fi{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
.fi{animation:fi 0.35s ease both;}`;

function Nav() {
  const mob = useW() < 640;
  const [open, setOpen] = useState(false);
  const links = [['/', 'Salary Calculator'], ['/ir35', 'IR35'], ['/nhs', 'NHS Bands'], ['/tools', 'All Tools'], ['/blog', 'Tax Guides']];
  return (
    <nav style={{ background: C.navy, position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 16px rgba(0,0,0,0.25)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 30, height: 30, background: 'linear-gradient(135deg,#0D9488,#14B8A6)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontWeight: 700, fontSize: 12, fontFamily: 'JetBrains Mono' }}>Tx</span>
          </div>
          <span style={{ color: 'white', fontFamily: 'DM Serif Display', fontSize: 17 }}>Taxd<span style={{ color: '#14B8A6' }}>Calc</span></span>
        </Link>
        {mob ? (
          <button onClick={() => setOpen(!open)} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 7, padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[0, 1, 2].map(i => <span key={i} style={{ display: 'block', width: 18, height: 2, background: 'white', borderRadius: 1 }} />)}
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {links.map(([href, label]) => <Link key={href} href={href} style={{ padding: '7px 13px', borderRadius: 6, color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{label}</Link>)}
            <span style={{ fontSize: 11, color: '#14B8A6', fontFamily: 'JetBrains Mono', background: 'rgba(13,148,136,0.15)', padding: '3px 9px', borderRadius: 4, border: '1px solid rgba(20,184,166,0.3)', marginLeft: 8 }}>2026-27</span>
          </div>
        )}
      </div>
      {mob && open && (
        <div style={{ background: '#162d52', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '6px 0 12px' }}>
          {links.map(([href, label]) => <Link key={href} href={href} onClick={() => setOpen(false)} style={{ display: 'block', padding: '12px 24px', color: 'rgba(255,255,255,0.65)', fontSize: 14 }}>{label}</Link>)}
        </div>
      )}
    </nav>
  );
}

function Footer() {
  return (
    <footer style={{ background: '#070D1C', padding: '40px 24px 28px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg,#0D9488,#14B8A6)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontWeight: 700, fontSize: 12, fontFamily: 'JetBrains Mono' }}>Tx</span>
            </div>
            <span style={{ color: 'white', fontFamily: 'DM Serif Display', fontSize: 16 }}>Taxd<span style={{ color: '#14B8A6' }}>Calc</span></span>
          </Link>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.22)', fontFamily: 'JetBrains Mono' }}>Updated April 2026 · 2026-27 HMRC rates</span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.18)', maxWidth: 320, lineHeight: 1.6 }}>For guidance only. Consult HMRC or a qualified tax adviser.</span>
        </div>
      </div>
    </footer>
  );
}

const TRAPS = [
  {
    icon: '🚨',
    name: '60% Tax Trap',
    range: '£100,000 – £125,140',
    headline: 'Between £100,000 and £125,140 your effective marginal rate is 60%.',
    detail: 'Every £2 earned above £100,000 withdraws £1 of your Personal Allowance, creating a 60p effective tax rate on top of the 40% higher rate. By £125,140 your entire £12,570 Personal Allowance is gone.',
    fix: 'Salary sacrifice into pension brings adjusted income below £100,000, restoring the Personal Allowance in full.',
    href: '/blog/60-percent-tax-trap',
    ctaLabel: 'Full 60% trap guide',
    col: { bg: C.redBg, bd: C.redBd, txt: C.red },
  },
  {
    icon: '👶',
    name: 'High Income Child Benefit Charge',
    range: '£60,000 – £80,000',
    headline: 'Child Benefit is clawed back between £60,000 and £80,000 via HICBC.',
    detail: 'For every £200 of adjusted net income above £60,000, 1% of Child Benefit is reclaimed. At £80,000 all Child Benefit is repaid — costing up to £3,974/year for a family with 4 children.',
    fix: 'Salary sacrifice or pension contributions that reduce adjusted net income below £60,000 recover the benefit in full.',
    href: '/blog/hicbc-child-benefit-charge',
    ctaLabel: 'HICBC full guide',
    col: { bg: C.orgBg, bd: C.orgBd, txt: C.orange },
  },
  {
    icon: '⚠️',
    name: 'Personal Allowance Taper',
    range: 'Above £100,000',
    headline: 'Your £12,570 tax-free Personal Allowance is withdrawn above £100,000.',
    detail: 'The Personal Allowance reduces by £1 for every £2 of income above £100,000. At £125,140 the allowance is zero. This is the mechanism behind the 60% trap — fixing it also fixes the trap.',
    fix: 'Pension contributions, Gift Aid donations, and salary sacrifice all reduce adjusted net income, preserving the Personal Allowance.',
    href: '/blog/personal-allowance-taper-100k',
    ctaLabel: 'Personal allowance taper guide',
    col: { bg: C.amberBg, bd: C.amberBd, txt: C.amber },
  },
];

export default function TaxTrapsPage() {
  const mob = useW() < 640;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://taxdcal.co.uk' },
      { '@type': 'ListItem', position: 2, name: 'UK Tax Traps', item: 'https://taxdcal.co.uk/tax-traps' },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What is the 60% tax trap in the UK?', acceptedAnswer: { '@type': 'Answer', text: 'Between £100,000 and £125,140 the Personal Allowance is withdrawn at £1 per £2 earned, creating an effective marginal rate of 60%. Salary sacrifice into a pension removes income from this range and escapes the trap entirely.' } },
      { '@type': 'Question', name: 'What is the High Income Child Benefit Charge?', acceptedAnswer: { '@type': 'Answer', text: 'The HICBC claws back Child Benefit at 1% per £200 of adjusted net income above £60,000. It is fully repaid at £80,000. Reducing adjusted income below £60,000 via pension contributions recovers it.' } },
      { '@type': 'Question', name: 'How do I avoid the personal allowance taper?', acceptedAnswer: { '@type': 'Answer', text: 'The Personal Allowance reduces by £1 for every £2 earned above £100,000. Salary sacrifice pension contributions reduce adjusted net income below £100,000, preserving the full £12,570 allowance.' } },
    ],
  };

  return (
    <>
      <style>{GS}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Nav />

      <div style={{ background: C.tealBg, borderBottom: `1px solid ${C.tealBd}`, padding: mob ? '14px 16px' : '16px 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ fontSize: 10, color: C.teal, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'JetBrains Mono', marginBottom: 6 }}>Quick Answer — 2026-27</div>
          <p style={{ fontSize: mob ? 14 : 16, color: '#0f766e', lineHeight: 1.6, fontWeight: 600 }}>
            Between £100,000 and £125,140 your effective marginal rate is <strong>60%</strong>. Salary sacrifice into pension eliminates this trap and restores your full Personal Allowance.
          </p>
        </div>
      </div>

      <div style={{ background: `linear-gradient(135deg,${C.navy},${C.navyM})`, padding: mob ? '24px 20px 36px' : '32px 24px 44px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'DM Serif Display', fontSize: mob ? 22 : 32, color: 'white', lineHeight: 1.2, marginBottom: 10 }}>UK Tax Traps 2026-27</h1>
          <p style={{ fontSize: mob ? 13 : 15, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, maxWidth: 640 }}>
            Three quirks of the UK tax system create disproportionately high marginal rates at specific income levels. All three can be avoided — usually by redirecting income into a pension.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: mob ? '16px 16px 48px' : '24px 24px 56px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }} className="fi">
          {TRAPS.map(trap => (
            <div key={trap.name} style={{ background: trap.col.bg, border: `1.5px solid ${trap.col.bd}`, borderRadius: 12, padding: mob ? 16 : 22 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
                <span style={{ fontSize: 20 }}>{trap.icon}</span>
                <div>
                  <div style={{ fontSize: 10, color: trap.col.txt, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'JetBrains Mono', marginBottom: 2 }}>{trap.range}</div>
                  <h2 style={{ fontFamily: 'DM Serif Display', fontSize: mob ? 18 : 22, color: C.navy, lineHeight: 1.2 }}>{trap.name}</h2>
                </div>
              </div>
              <p style={{ fontSize: 14, fontWeight: 700, color: trap.col.txt, lineHeight: 1.5, marginBottom: 8 }}>{trap.headline}</p>
              <p style={{ fontSize: 13, color: C.mid, lineHeight: 1.7, marginBottom: 8 }}>{trap.detail}</p>
              <p style={{ fontSize: 13, color: C.mid, lineHeight: 1.7, marginBottom: 14 }}><strong style={{ color: C.navy }}>Fix:</strong> {trap.fix}</p>
              <Link href={trap.href} style={{ display: 'inline-block', background: trap.col.txt, color: 'white', padding: '9px 18px', borderRadius: 7, fontSize: 12, fontWeight: 700 }}>{trap.ctaLabel} →</Link>
            </div>
          ))}
        </div>

        <div style={{ background: C.tealBg, border: `1px solid ${C.tealBd}`, borderRadius: 12, padding: mob ? 16 : 22 }}>
          <h2 style={{ fontFamily: 'DM Serif Display', fontSize: mob ? 17 : 20, color: C.navy, marginBottom: 8 }}>Calculate your salary sacrifice saving</h2>
          <p style={{ fontSize: 13, color: C.mid, marginBottom: 14, lineHeight: 1.7 }}>
            The salary sacrifice calculator shows exactly how much you can save by redirecting income into pension. Enter your salary and desired contribution to see the tax and NI reduction.
          </p>
          <Link href="/sacrifice" style={{ display: 'inline-block', background: C.teal, color: 'white', padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 700 }}>Open salary sacrifice calculator →</Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
