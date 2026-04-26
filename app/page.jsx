'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

// ── RESPONSIVE ────────────────────────────────────────────────────────────────
function useW() {
  const [w, setW] = useState(typeof window !== 'undefined' ? window.innerWidth : 800);
  useEffect(() => {
    const f = () => setW(window.innerWidth);
    window.addEventListener('resize', f);
    return () => window.removeEventListener('resize', f);
  }, []);
  return w;
}

// ── UK + SCOTLAND TAX LOGIC 2026-27 ──────────────────────────────────────────
const UK_BANDS = [
  { from: 0, to: 12570, rate: 0 },
  { from: 12570, to: 50270, rate: 0.20 },
  { from: 50270, to: 125140, rate: 0.40 },
  { from: 125140, to: Infinity, rate: 0.45 },
];
const SCOT_BANDS = [
  { from: 0, to: 12570, rate: 0 },
  { from: 12570, to: 16537, rate: 0.19 },
  { from: 16537, to: 29526, rate: 0.20 },
  { from: 29526, to: 43662, rate: 0.21 },
  { from: 43662, to: 75000, rate: 0.42 },
  { from: 75000, to: 125140, rate: 0.45 },
  { from: 125140, to: Infinity, rate: 0.48 },
];

function parseTaxCode(raw) {
  if (!raw || raw.trim() === '') return { pa: null };
  const c = raw.trim().toUpperCase().replace(/\s/g, '');
  if (c === 'NT') return { noTax: true };
  if (c === 'BR') return { flatRate: 0.20 };
  if (c === 'D0') return { flatRate: 0.40 };
  if (c === 'D1') return { flatRate: 0.45 };
  if (c === '0T') return { pa: 0 };
  if (c.startsWith('K')) { const n = parseInt(c.slice(1), 10); if (!isNaN(n)) return { pa: -(n * 10) }; }
  const stripped = c.replace(/^[SC]/, '').replace(/[A-Z]+$/, '');
  const n = parseInt(stripped, 10);
  if (!isNaN(n) && n > 0) return { pa: n * 10 };
  return { pa: null, unknown: true };
}

function calcTax(gross, pension, scotland, taxCode) {
  const parsed = parseTaxCode(taxCode);
  if (parsed.noTax) return 0;
  const ti = Math.max(0, gross - pension);
  if (parsed.flatRate !== undefined) return ti * parsed.flatRate;
  let pa = parsed.pa !== null ? parsed.pa : 12570;
  if (pa > 0 && ti > 100000) pa = Math.max(0, pa - (ti - 100000) / 2);
  const taxable = pa >= 0 ? Math.max(0, ti - pa) : ti + Math.abs(pa);
  const bands = scotland ? SCOT_BANDS : UK_BANDS;
  let tax = 0, rem = taxable;
  for (const b of bands) {
    if (rem <= 0 || b.rate === 0) continue;
    const start = Math.max(0, b.from - (pa > 0 ? pa : 0));
    const end = b.to === Infinity ? Infinity : Math.max(0, b.to - (pa > 0 ? pa : 0));
    const width = end === Infinity ? rem : Math.min(rem, end - start);
    if (width > 0) { tax += width * b.rate; rem -= width; }
  }
  return Math.max(0, tax);
}

function calcNI(gross) {
  if (gross <= 12570) return 0;
  if (gross <= 50270) return (gross - 12570) * 0.08;
  return (50270 - 12570) * 0.08 + (gross - 50270) * 0.02;
}

function calcLoan(gross, plan) {
  const t = { plan1: 24990, plan2: 27295, plan4: 31395, plan5: 25000 };
  if (!plan || plan === 'none' || !t[plan] || gross <= t[plan]) return 0;
  return (gross - t[plan]) * 0.09;
}

function calculate(gross, pensionPct, slPlan, scotland, taxCode) {
  const g = Math.max(0, gross || 0);
  const pension = g * ((pensionPct || 0) / 100);
  const incomeTax = calcTax(g, pension, scotland, taxCode);
  const ni = calcNI(g);
  const studentLoan = calcLoan(g, slPlan);
  const deductions = incomeTax + ni + studentLoan + pension;
  const takeHome = g - deductions;
  return {
    gross: g, incomeTax, ni, studentLoan, pension, deductions, takeHome,
    monthly: { gross: g / 12, takeHome: takeHome / 12 },
    weekly: { gross: g / 52, takeHome: takeHome / 52 },
    daily: { gross: g / 260, takeHome: takeHome / 260 },
    effectiveRate: g > 0 ? ((incomeTax + ni) / g) * 100 : 0,
  };
}

// ── FORMAT ────────────────────────────────────────────────────────────────────
const fmt = n => '\u00A3' + Math.max(0, Math.abs(n || 0)).toLocaleString('en-GB', { maximumFractionDigits: 0 });
const fmtD = n => '\u00A3' + Math.max(0, n || 0).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ── ANIMATED NUMBER ───────────────────────────────────────────────────────────
function AnimNum({ value, f }) {
  const fn = f || fmt;
  const [disp, setDisp] = useState(value);
  const prev = useRef(value);
  useEffect(() => {
    const s = prev.current, e = value || 0, diff = e - s;
    if (Math.abs(diff) < 1) { setDisp(e); prev.current = e; return; }
    const dur = 360, t0 = performance.now(); let raf;
    const step = now => {
      const t = Math.min(1, (now - t0) / dur), ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      setDisp(s + diff * ease);
      if (t < 1) raf = requestAnimationFrame(step);
      else { setDisp(e); prev.current = e; }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <span>{fn(disp)}</span>;
}

// ── COLOURS ───────────────────────────────────────────────────────────────────
const C = {
  bg: '#F4F6F9', white: '#FFFFFF',
  navy: '#0C1E3C', navyLight: '#162d52', navyMid: '#1e3d6e',
  teal: '#0D9488', tealLight: '#14B8A6', tealBg: '#F0FDFA', tealBorder: '#99F6E4',
  scot: '#1D4ED8', scotBg: '#EFF6FF', scotBorder: '#BFDBFE',
  amber: '#D97706', amberBg: '#FFFBEB', amberBorder: '#FDE68A',
  border: '#E2E8F0', borderDark: '#CBD5E1',
  green: '#059669',
  red: '#DC2626', redBg: '#FEF2F2', redBorder: '#FECACA',
  text: '#1E293B', textMid: '#475569', slate: '#64748B', slateLight: '#94A3B8',
  shadow: '0 1px 3px rgba(0,0,0,0.06),0 4px 16px rgba(0,0,0,0.04)',
};

// ── GLOBAL CSS ────────────────────────────────────────────────────────────────
const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Source+Serif+4:wght@300;400;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{-webkit-text-size-adjust:100%;}
body{background:#F4F6F9;color:#1E293B;font-family:'Source Serif 4',Georgia,serif;-webkit-tap-highlight-color:transparent;}
input[type=number]{-moz-appearance:textfield;}
input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;}
input[type=range]{-webkit-appearance:none;width:100%;height:4px;background:#CBD5E1;border-radius:2px;outline:none;cursor:pointer;}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;border-radius:50%;background:#0C1E3C;cursor:pointer;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.2);}
select{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2364748b' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;background-color:white;}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}
@media print{.no-print{display:none!important;}body{background:white!important;padding-bottom:0!important;}}
@media(max-width:767px){body{padding-bottom:52px;}}
.fu{animation:fadeUp 0.38s ease both;}
.bfill{transition:width 0.48s cubic-bezier(0.4,0,0.2,1);}
button{-webkit-tap-highlight-color:transparent;cursor:pointer;font-family:inherit;}
a{text-decoration:none;color:inherit;}
`;

// ── BLOG ARTICLES (for homepage teasers) ──────────────────────────────────────

// ── TAX TRAP DETECTOR ─────────────────────────────────────────────────────────
function detectTraps(gross, pensionPct, loan, numChildren) {
  const pen = gross * (pensionPct / 100);
  const adj = gross - pen;
  const traps = [];
  // 60% trap
  if (adj > 95000 && adj <= 125140) {
    const inTrap = adj > 100000;
    const toEscape = Math.max(0, adj - 100000);
    const itWith = calcTax(adj, 0, false, '');
    const itEscape = calcTax(adj, toEscape, false, '');
    const niSaved = calcNI(adj) - calcNI(Math.max(0, adj - toEscape));
    traps.push({ id: 'trap60', active: inTrap, approaching: !inTrap, severity: inTrap ? 'critical' : 'warning',
      headline: inTrap
        ? `60% effective rate — you keep only 28p of each extra pound (£${Math.round(adj - 100000).toLocaleString('en-GB')} in the trap)`
        : `£${(100000 - adj).toLocaleString('en-GB')} away from the 60% tax trap`,
      detail: inTrap
        ? `Sacrificing £${Math.round(toEscape).toLocaleString('en-GB')} into pension escapes it — saving £${Math.round(itWith - itEscape + niSaved).toLocaleString('en-GB')} in tax.`
        : `Above £100,000 your Personal Allowance is withdrawn, creating a 60% marginal rate. Stay below with salary sacrifice.`,
      saving: inTrap ? Math.round(itWith - itEscape + niSaved) : 0,
      action: '/sacrifice', actionLabel: 'Calculate pension sacrifice',
    });
  }
  // Plan 5
  if (loan === 'plan5' && gross > 25000) {
    const annual = (gross - 25000) * 0.09;
    const extra = gross > 27295 ? annual - (gross - 27295) * 0.09 : annual;
    traps.push({ id: 'plan5', active: true, severity: gross < 30000 ? 'critical' : 'warning',
      headline: `Plan 5: £${Math.round(annual / 12).toLocaleString('en-GB')}/month repayment — 40-year write-off period`,
      detail: `£${Math.round(extra).toLocaleString('en-GB')}/year more than Plan 2. At £25,000 threshold, nearly every full-time worker repays.`,
      saving: 0, action: '/blog/plan-5-student-loan-take-home', actionLabel: 'Plan 5 full guide',
    });
  }
  // HICBC
  if (numChildren > 0 && adj > 60000) {
    const cbRates = [0, 1331.60, 2212.60, 3093.60, 3974.60];
    const fullCB = cbRates[Math.min(numChildren, 4)];
    const taper = Math.min(1, (adj - 60000) / 20000);
    const charge = fullCB * taper;
    traps.push({ id: 'hicbc', active: true, severity: adj > 75000 ? 'critical' : 'warning',
      headline: `Child Benefit taper: losing £${Math.round(charge).toLocaleString('en-GB')}/year — net benefit £${Math.round(fullCB - charge).toLocaleString('en-GB')}`,
      detail: `With ${numChildren} child${numChildren > 1 ? 'ren' : ''}, salary sacrifice below £60,000 recovers all Child Benefit.`,
      saving: Math.round(charge), action: '/sacrifice', actionLabel: 'Recover Child Benefit',
    });
  }
  return traps;
}
function TrapAlert({ trap }) {
  const [exp, setExp] = useState(false);
  const col = trap.severity === 'critical'
    ? { bg: '#FEF2F2', bd: '#FECACA', txt: '#DC2626' }
    : { bg: '#FFF7ED', bd: '#FED7AA', txt: '#EA580C' };
  return (
    <div style={{ background: col.bg, border: `1.5px solid ${col.bd}`, borderRadius: 10, padding: '12px 14px', marginBottom: 8 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
        <span style={{ fontSize: 16, flexShrink: 0 }}>{trap.severity === 'critical' ? '🚨' : '⚠️'}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: col.txt, lineHeight: 1.4, marginBottom: 3 }}>{trap.headline}</div>
          {exp && <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.6, marginBottom: 8 }}>{trap.detail}</div>}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            {trap.saving > 0 && <span style={{ fontSize: 10, background: col.bg, color: col.txt, border: `1px solid ${col.bd}`, borderRadius: 3, padding: '2px 6px', fontWeight: 700, fontFamily: 'JetBrains Mono' }}>Save up to £{trap.saving.toLocaleString('en-GB')}/yr</span>}
            <a href={trap.action} style={{ fontSize: 11, color: col.txt, fontWeight: 700, borderBottom: `1px solid ${col.bd}` }}>{trap.actionLabel} →</a>
            <button onClick={() => setExp(!exp)} style={{ fontSize: 11, color: '#64748B', background: 'none', border: 'none', padding: 0 }}>{exp ? 'Less ↑' : 'Why? ↓'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const ARTICLES = [
  { slug: 'how-uk-income-tax-brackets-work', title: 'How UK Income Tax Brackets Work (2026-27)', category: 'Tax Basics', desc: 'Understand marginal rates and why a pay rise never means less take-home pay.' },
  { slug: 'national-insurance-explained', title: 'National Insurance Explained (2026-27)', category: 'Tax Basics', desc: 'Class 1 NI rates, 2026-27 thresholds, and how NI differs from income tax.' },
  { slug: 'pension-tax-relief-your-free-money', title: 'Pension Tax Relief: Free Money From HMRC', category: 'Tax Planning', desc: 'How salary sacrifice saves both income tax and NI. Real examples.' },
  { slug: '2026-27-tax-year-changes-uk', title: '2026-27 Tax Year: Everything That Changed', category: 'Tax Year Updates', desc: 'Thresholds frozen, NLW 12.71/hr, dividend rates up. Complete guide.' },
];

// ── NAV ───────────────────────────────────────────────────────────────────────
function NavBar() {
  const [open, setOpen] = useState(false);
  const mob = useW() < 700;
  const links = [
    ['/', 'Calculator'],
    ['/salary-take-home-pay-uk', 'Salary Hub'],
    ['/tools', 'Tools'],
    ['/nhs', 'NHS'],
    ['/ir35', 'IR35'],
    ['/blog', 'Guides'],
  ];
  return (
    <nav style={{ background: C.navy, position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(0,0,0,0.28)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 30, height: 30, background: 'linear-gradient(135deg,#0D9488,#14B8A6)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 8px rgba(13,148,136,0.3)' }}>
            <span style={{ color: 'white', fontWeight: 700, fontSize: 12, fontFamily: 'JetBrains Mono' }}>Tx</span>
          </div>
          <span style={{ color: 'white', fontFamily: 'DM Serif Display', fontSize: 17 }}>Taxd<span style={{ color: '#14B8A6' }}>Calc</span></span>
        </Link>
        {mob ? (
          <button onClick={() => setOpen(!open)} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 7, padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{ display: 'block', width: 18, height: 2, background: 'white', borderRadius: 1, transition: 'all 0.2s', transform: open && i === 0 ? 'rotate(45deg) translate(4px,4px)' : open && i === 2 ? 'rotate(-45deg) translate(4px,-4px)' : 'none', opacity: open && i === 1 ? 0 : 1 }} />
            ))}
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {links.map(([href, label]) => (
              <Link key={href} href={href} style={{ padding: '7px 13px', borderRadius: 6, background: href === '/' ? 'rgba(13,148,136,0.2)' : 'transparent', color: href === '/' ? '#14B8A6' : 'rgba(255,255,255,0.58)', fontSize: 13, fontWeight: href === '/' ? 600 : 400 }}>
                {label}
              </Link>
            ))}
            <span style={{ fontSize: 11, color: '#14B8A6', fontFamily: 'JetBrains Mono', background: 'rgba(13,148,136,0.15)', padding: '3px 9px', borderRadius: 4, border: '1px solid rgba(20,184,166,0.3)', marginLeft: 8 }}>2026-27</span>
          </div>
        )}
      </div>
      {mob && open && (
        <div style={{ background: C.navyLight, borderTop: '1px solid rgba(255,255,255,0.08)', padding: '6px 0 12px' }}>
          {links.map(([href, label]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)} style={{ display: 'block', padding: '12px 24px', background: href === '/' ? 'rgba(13,148,136,0.15)' : 'transparent', color: href === '/' ? '#14B8A6' : 'rgba(255,255,255,0.65)', fontSize: 14, fontWeight: href === '/' ? 600 : 400 }}>
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

// ── SCOTLAND TOGGLE ───────────────────────────────────────────────────────────
function ScotlandToggle({ scotland, setScotland }) {
  return (
    <div style={{ marginBottom: 18, padding: '13px 15px', background: scotland ? C.scotBg : C.bg, border: `1.5px solid ${scotland ? C.scotBorder : C.borderDark}`, borderRadius: 10, transition: 'all 0.2s' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: scotland ? C.scot : C.navyLight }}>Are you based in Scotland?</div>
          <div style={{ fontSize: 11, color: C.slate, marginTop: 2 }}>Scottish taxpayers pay different income tax rates</div>
        </div>
        <button onClick={() => setScotland(!scotland)} style={{ width: 46, height: 25, borderRadius: 13, border: 'none', background: scotland ? C.scot : C.borderDark, position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
          <span style={{ position: 'absolute', top: 2.5, left: scotland ? 23 : 2.5, width: 20, height: 20, borderRadius: '50%', background: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.22)', transition: 'left 0.2s' }} />
        </button>
      </div>
      {scotland && (
        <div style={{ marginTop: 9, paddingTop: 9, borderTop: `1px solid ${C.scotBorder}`, fontSize: 11, color: C.scot, lineHeight: 1.6 }}>
          Using Scottish rates: 19% Starter to 20% Basic to 21% Intermediate to 42% Higher to 45% Advanced to 48% Top
        </div>
      )}
    </div>
  );
}

// ── TAX CODE PANEL ────────────────────────────────────────────────────────────
function TaxCodePanel({ taxCode, setTaxCode }) {
  const [show, setShow] = useState(false);
  const parsed = parseTaxCode(taxCode);
  return (
    <div style={{ marginBottom: 18 }}>
      <button onClick={() => setShow(!show)} style={{ background: 'none', border: 'none', color: C.slate, fontSize: 12, fontWeight: 600, padding: '2px 0', display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ color: C.teal, fontFamily: 'JetBrains Mono', fontSize: 10, transition: 'transform 0.2s', display: 'inline-block', transform: show ? 'rotate(90deg)' : 'none' }}>▸</span>
        Tax code (optional — leave blank for standard)
      </button>
      {show && (
        <div style={{ marginTop: 10, padding: '13px 15px', background: C.bg, border: `1px solid ${C.border}`, borderRadius: 9 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.navyLight, marginBottom: 7 }}>Your Tax Code</label>
          <input type="text" value={taxCode} onChange={e => setTaxCode(e.target.value)} placeholder="1257L"
            style={{ width: '100%', padding: '11px 13px', border: `1.5px solid ${C.borderDark}`, borderRadius: 7, fontSize: 14, fontFamily: 'JetBrains Mono', color: C.navy, background: 'white', outline: 'none' }}
            onFocus={e => e.target.style.borderColor = C.teal}
            onBlur={e => e.target.style.borderColor = C.borderDark} />
          {taxCode && parsed.unknown && <div style={{ fontSize: 11, color: C.red, marginTop: 5 }}>Unrecognised code — using default 12,570 allowance</div>}
          <div style={{ fontSize: 11, color: C.slate, lineHeight: 1.7, marginTop: 8 }}>
            Common codes: 1257L = standard. BR = 20% on all. D0 = 40% on all. 0T = no allowance. NT = no tax. K codes add to taxable income.
          </div>
        </div>
      )}
    </div>
  );
}

// ── FOOTER ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: '#07111F', padding: '40px 24px 28px', borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 0 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '28px 24px', marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12, fontFamily: 'JetBrains Mono', fontWeight: 600 }}>Salary Pages</div>
            {[['/30000-salary-take-home', '£30,000 take-home pay'], ['/40000-salary-take-home', '£40,000 take-home pay'], ['/50000-salary-take-home', '£50,000 take-home pay'], ['/60000-salary-take-home', '£60,000 take-home pay'], ['/80000-salary-take-home', '£80,000 take-home pay'], ['/100000-salary-take-home', '£100,000 take-home pay'], ['/125000-salary-take-home', '£125,000 take-home pay'], ['/salary-take-home-pay-uk', 'All UK salary guides']].map(([h, l]) => (
              <Link key={h} href={h} style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.42)', marginBottom: 7, lineHeight: 1.4, textDecoration: 'none' }}>{l}</Link>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12, fontFamily: 'JetBrains Mono', fontWeight: 600 }}>Tools</div>
            {[['/', 'Salary calculator'], ['/ir35', 'IR35 calculator'], ['/nhs', 'NHS pay bands'], ['/bonus', 'Bonus tax calculator'], ['/sacrifice', 'Salary sacrifice'], ['/comparison', 'Job comparison'], ['/hourly', 'Hourly rate'], ['/maternity', 'Maternity pay'], ['/tools', 'All tax tools']].map(([h, l]) => (
              <Link key={h} href={h} style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.42)', marginBottom: 7, lineHeight: 1.4, textDecoration: 'none' }}>{l}</Link>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12, fontFamily: 'JetBrains Mono', fontWeight: 600 }}>Tax Planning</div>
            {[['/tax-traps', 'Tax traps guide'], ['/blog/60-percent-tax-trap', '60% tax trap explained'], ['/blog/hicbc-child-benefit-charge', 'Child benefit taper'], ['/blog/personal-allowance-taper-100k', '£100k PA taper'], ['/blog/pension-tax-relief-your-free-money', 'Pension tax relief'], ['/blog/salary-sacrifice-electric-car-uk-2026', 'EV salary sacrifice'], ['/blog/plan-5-student-loan-take-home', 'Plan 5 student loan'], ['/sacrifice', 'Salary sacrifice calculator']].map(([h, l]) => (
              <Link key={h} href={h} style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.42)', marginBottom: 7, lineHeight: 1.4, textDecoration: 'none' }}>{l}</Link>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12, fontFamily: 'JetBrains Mono', fontWeight: 600 }}>Public Sector</div>
            {[['/nhs', 'NHS pay calculator'], ['/nhs-pay-guide', 'NHS pay guide'], ['/teacher-pay-guide', 'Teacher pay guide'], ['/public-sector-pay', 'Public sector hub'], ['/public-sector-pay/police', 'Police pay'], ['/public-sector-pay/firefighters', 'Firefighter pay'], ['/public-sector-pay/civil-service', 'Civil service pay'], ['/public-sector-pay/armed-forces', 'Armed forces pay']].map(([h, l]) => (
              <Link key={h} href={h} style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.42)', marginBottom: 7, lineHeight: 1.4, textDecoration: 'none' }}>{l}</Link>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12, fontFamily: 'JetBrains Mono', fontWeight: 600 }}>Contractor Pay</div>
            {[['/contractor-pay', 'Contractor pay hub'], ['/ir35', 'IR35 calculator'], ['/300-day-rate-take-home', '£300/day take-home'], ['/400-day-rate-take-home', '£400/day take-home'], ['/500-day-rate-take-home', '£500/day take-home'], ['/600-day-rate-take-home', '£600/day take-home'], ['/700-day-rate-take-home', '£700/day take-home'], ['/blog/ir35-inside-outside-calculator-2026', 'IR35 guide 2026']].map(([h, l]) => (
              <Link key={h} href={h} style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.42)', marginBottom: 7, lineHeight: 1.4, textDecoration: 'none' }}>{l}</Link>
            ))}
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
            <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg,#0D9488,#14B8A6)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
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

// ── HOME PAGE ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  const mob = useW() < 768;
  const [salaryStr, setSalaryStr] = useState('45000');
  const [pension, setPension] = useState(5);
  const [loan, setLoan] = useState('none');
  const [period, setPeriod] = useState('annual');
  const [tab, setTab] = useState('breakdown');
  const [scotland, setScotland] = useState(false);
  const [taxCode, setTaxCode] = useState('');
  const [numChildren, setNumChildren] = useState(0);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailCaptured, setEmailCaptured] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [showScenario, setShowScenario] = useState(false);
  const [scenarioSalary, setScenarioSalary] = useState('');
  const [scenarioPension, setScenarioPension] = useState(5);
  const [shareStatus, setShareStatus] = useState('');
  const [showYoY, setShowYoY] = useState(false);
  const [showEmployer, setShowEmployer] = useState(false);

  // ── localStorage persistence ─────────────────────────────────────────────
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('txdc_prefs') || '{}');
      if (saved.salary) setSalaryStr(String(saved.salary));
      if (saved.pension !== undefined) setPension(saved.pension);
      if (saved.loan) setLoan(saved.loan);
      if (saved.scotland !== undefined) setScotland(saved.scotland);
    } catch (e) {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem('txdc_prefs', JSON.stringify({ salary: salaryStr, pension, loan, scotland }));
    } catch (e) {}
  }, [salaryStr, pension, loan, scotland]);

  // ── URL permalink ?salary=45000&pension=5&plan=none ──────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const p = new URLSearchParams(window.location.search);
    if (p.get('salary')) setSalaryStr(p.get('salary'));
    if (p.get('pension')) setPension(Number(p.get('pension')));
    if (p.get('plan')) setLoan(p.get('plan'));
  }, []);

  const salary = Math.max(0, Number(salaryStr) || 0);
  const r = calculate(salary, pension, loan, scotland, taxCode);
  const traps = detectTraps(salary, pension, loan, numChildren);

  // ── Derived values ────────────────────────────────────────────────────────
  const employerNI = salary > 5000 ? (salary - 5000) * 0.15 : 0;
  const totalEmployerCost = salary + employerNI;
  const netHourly = r.takeHome / (52 * 37.5);
  // Year-on-year: 2025-26 had same thresholds but NLW was £11.44, NI same
  const r2526 = calculate(salary, pension, loan, scotland, taxCode); // thresholds identical
  const yoyDelta = r.takeHome - r2526.takeHome;

  // ── Scenario comparison ───────────────────────────────────────────────────
  const scenSalaryNum = Math.max(0, Number(scenarioSalary) || 0);
  const rScen = calculate(scenSalaryNum, scenarioPension, loan, scotland, taxCode);
  const scenDelta = rScen.takeHome - r.takeHome;

  // ── Share function ────────────────────────────────────────────────────────
  const handleShare = useCallback(async () => {
    const url = `${window.location.origin}/?salary=${salary}&pension=${pension}&plan=${loan}`;
    const text = `I take home ${fmt(r.takeHome)}/year on my ${fmt(salary)} salary — check yours:`;
    if (navigator.share) {
      try { await navigator.share({ title: 'TaxdCalc — My Take-Home Pay', text, url }); setShareStatus('shared'); } catch (e) {}
    } else {
      await navigator.clipboard?.writeText(url);
      setShareStatus('copied');
    }
    setTimeout(() => setShareStatus(''), 2500);
  }, [salary, pension, loan, r.takeHome]);

  // ── PDF print ─────────────────────────────────────────────────────────────
  const handlePDF = useCallback(() => {
    if (!emailCaptured) { setShowEmailModal(true); return; }
    window.print();
  }, [emailCaptured]);

  const pm = {
    annual: { g: r.gross, th: r.takeHome },
    monthly: { g: r.monthly.gross, th: r.monthly.takeHome },
    weekly: { g: r.weekly.gross, th: r.weekly.takeHome },
    daily: { g: r.daily.gross, th: r.daily.takeHome },
  };

  const items = [
    { label: 'Income Tax', value: r.incomeTax, color: C.red },
    { label: 'Nat. Insurance', value: r.ni, color: '#F59E0B' },
    { label: 'Student Loan', value: r.studentLoan, color: '#6366F1' },
    { label: 'Pension', value: r.pension, color: '#14B8A6' },
  ];

  const taxBands = scotland ? [
    ['12,571 to 16,537', '19% Starter'],
    ['16,538 to 29,526', '20% Basic'],
    ['29,527 to 43,662', '21% Intermediate'],
    ['43,663 to 75,000', '42% Higher'],
    ['75,001 to 125,140', '45% Advanced'],
    ['Over 125,140', '48% Top'],
  ] : [
    ['Up to 12,570', '0% Personal Allowance'],
    ['12,571 to 50,270', '20% Basic Rate'],
    ['50,271 to 125,140', '40% Higher Rate'],
    ['Over 125,140', '45% Additional Rate'],
  ];

  return (
    <>
      <style>{STYLE}</style>
      <NavBar />

      {/* AI ANSWER BLOCK — above fold, dynamic, machine-readable for AI systems */}
      {salary > 0 && (
        <div className="ai-answer" style={{ background: C.tealBg, borderBottom: `1px solid ${C.tealBorder}`, padding: mob ? '13px 16px' : '15px 24px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ fontSize: 10, color: C.teal, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'JetBrains Mono', marginBottom: 5 }}>
              Quick Answer — 2026-27
            </div>
            <p style={{ fontSize: mob ? 13 : 14, color: '#0f766e', fontWeight: 600, lineHeight: 1.6, marginBottom: 8 }}>
              On a <strong>{fmt(salary)}</strong> salary, take-home pay is <strong>{fmt(r.takeHome)}</strong>/year (<strong>{fmtD(r.monthly.takeHome)}</strong>/month) after income tax of {fmt(r.incomeTax)} and National Insurance of {fmt(r.ni)} in 2026-27{scotland ? ' (Scotland rates)' : ''}.
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: '#0f766e', background: 'rgba(13,148,136,0.12)', padding: '3px 10px', borderRadius: 4, fontFamily: 'JetBrains Mono' }}>
                {((r.takeHome / r.gross) * 100).toFixed(1)}% kept
              </span>
              <span style={{ fontSize: 11, color: '#0f766e', background: 'rgba(13,148,136,0.12)', padding: '3px 10px', borderRadius: 4, fontFamily: 'JetBrains Mono' }}>
                Effective rate: {r.effectiveRate.toFixed(1)}%
              </span>
              {salary > 100000 && salary <= 125140 && (
                <span style={{ fontSize: 11, color: '#DC2626', background: '#FEF2F2', border: '1px solid #FECACA', padding: '3px 10px', borderRadius: 4, fontWeight: 700 }}>
                  ⚠️ 60% tax trap — salary sacrifice recommended
                </span>
              )}
              {salary > 50270 && salary <= 100000 && (
                <span style={{ fontSize: 11, color: '#D97706', background: '#FFFBEB', border: '1px solid #FDE68A', padding: '3px 10px', borderRadius: 4, fontWeight: 700 }}>
                  40% higher rate on earnings above £50,270
                </span>
              )}
              <a href="/sacrifice" style={{ fontSize: 11, color: C.teal, fontWeight: 700, borderBottom: `1px solid ${C.tealBorder}`, textDecoration: 'none' }}>
                Optimise with salary sacrifice →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* HERO */}
      <div style={{ background: `linear-gradient(135deg,${C.navy},${C.navyMid})`, padding: mob ? '36px 20px 68px' : '48px 24px 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -40, width: 260, height: 260, borderRadius: '50%', background: 'rgba(13,148,136,0.07)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(13,148,136,0.15)', border: '1px solid rgba(20,184,166,0.3)', borderRadius: 20, padding: '5px 14px', fontSize: 11, color: '#14B8A6', marginBottom: 18, fontFamily: 'JetBrains Mono' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#14B8A6', display: 'inline-block' }} />
            Updated for 2026-27 tax year
          </div>
          <h1 style={{ fontFamily: 'DM Serif Display', fontSize: mob ? 28 : 'clamp(28px,5vw,50px)', color: 'white', lineHeight: 1.1, marginBottom: 12, letterSpacing: '-0.025em' }}>
            UK Take-Home Pay<br /><em style={{ color: '#14B8A6' }}>Calculator</em>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: mob ? 14 : 16, lineHeight: 1.65, maxWidth: 420, margin: '0 auto' }}>
            Net salary after income tax, NI, student loan and pension. Scotland and tax code supported.
          </p>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center', marginTop: 14 }}>
            {['✓ 2026-27 HMRC thresholds', '✓ Scotland supported', '✓ Free, no sign-up'].map(t => (
              <span key={t} style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* CALCULATOR */}
      <div style={{ maxWidth: 1100, margin: mob ? '-32px 0 0' : '-44px auto 0', padding: mob ? '0 16px' : '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : 'minmax(280px,390px) 1fr', gap: 20, alignItems: 'start' }}>

          {/* INPUT PANEL */}
          <div className="fu" style={{ background: C.white, borderRadius: 14, padding: 22, boxShadow: C.shadow, border: `1px solid ${C.border}` }}>
            <h2 style={{ fontFamily: 'DM Serif Display', fontSize: 19, color: C.navy, marginBottom: 20 }}>Your Details</h2>

            {/* Salary input */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 7 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: C.navyLight }}>Annual Salary</label>
                {salary > 0 && <span style={{ fontSize: 11, color: C.slate }}>{fmt(salary / 12)}/mo gross</span>}
              </div>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: C.slate, fontSize: 16, fontWeight: 600, fontFamily: 'JetBrains Mono', pointerEvents: 'none', lineHeight: 1 }}>{'\u00A3'}</span>
                <input type="number" inputMode="decimal" value={salaryStr} placeholder="0" min={0} max={999999}
                  onChange={e => setSalaryStr(e.target.value)}
                  style={{ width: '100%', padding: '13px 14px 13px 30px', border: `1.5px solid ${C.borderDark}`, borderRadius: 8, fontSize: 16, fontFamily: 'JetBrains Mono', fontWeight: 500, color: C.navy, background: 'white', outline: 'none', WebkitAppearance: 'none' }}
                  onFocus={e => e.target.style.borderColor = C.teal}
                  onBlur={e => e.target.style.borderColor = C.borderDark} />
              </div>
            </div>

            {/* Pension slider */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: C.navyLight }}>Pension Contribution</label>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 14, color: C.teal, fontWeight: 600 }}>{pension}%</span>
              </div>
              <input type="range" min={0} max={30} step={0.5} value={pension} onChange={e => setPension(Number(e.target.value))} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <span style={{ fontSize: 11, color: C.slateLight }}>0%</span>
                <span style={{ fontSize: 11, color: C.slateLight }}>30%</span>
              </div>
            </div>

            {/* Student loan */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.navyLight, marginBottom: 7 }}>Student Loan Plan</label>
              <select value={loan} onChange={e => setLoan(e.target.value)}
                style={{ width: '100%', padding: '12px 40px 12px 14px', border: `1.5px solid ${C.borderDark}`, borderRadius: 8, fontSize: 14, color: C.navy, outline: 'none' }}
                onFocus={e => e.target.style.borderColor = C.teal}
                onBlur={e => e.target.style.borderColor = C.borderDark}>
                <option value="none">No student loan</option>
                <option value="plan1">Plan 1 — pre Sept 2012 (threshold: 24,990)</option>
                <option value="plan2">Plan 2 — Sept 2012 to Jul 2023 (27,295)</option>
                <option value="plan4">Plan 4 — Scotland (31,395)</option>
                <option value="plan5">Plan 5 — Aug 2023 onwards (25,000)</option>
              </select>
            </div>

            <ScotlandToggle scotland={scotland} setScotland={setScotland} />
            <TaxCodePanel taxCode={taxCode} setTaxCode={setTaxCode} />

            {/* Children for HICBC — only show if salary >55k */}
            {salary > 55000 && (
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.navyLight, marginBottom: 7 }}>
                  Children <span style={{ fontWeight: 400, color: C.slate }}>(affects Child Benefit)</span>
                </label>
                <select value={numChildren} onChange={e => setNumChildren(Number(e.target.value))}
                  style={{ width: '100%', padding: '11px 40px 11px 14px', border: `1.5px solid ${C.borderDark}`, borderRadius: 8, fontSize: 14, color: C.navy, outline: 'none' }}
                  onFocus={e => e.target.style.borderColor = C.teal} onBlur={e => e.target.style.borderColor = C.borderDark}>
                  {[0,1,2,3,4].map(n => <option key={n} value={n}>{n === 0 ? 'No children' : `${n} child${n > 1 ? 'ren' : ''}`}</option>)}
                </select>
              </div>
            )}

            {/* Tax bands reference */}
            <div style={{ padding: '12px 14px', background: scotland ? C.scotBg : C.tealBg, border: `1px solid ${scotland ? C.scotBorder : C.tealBorder}`, borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: scotland ? C.scot : C.teal, fontWeight: 700, marginBottom: 6 }}>
                {scotland ? 'Scottish' : 'England / Wales / NI'} Income Tax Bands 2026-27
              </div>
              {taxBands.map(([range, rate]) => (
                <div key={range} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: scotland ? '#1e3a8a' : '#0f766e', fontFamily: 'JetBrains Mono', padding: '3px 0', borderBottom: '1px solid rgba(99,102,241,0.08)' }}>
                  <span>{range}</span>
                  <span style={{ fontWeight: 600 }}>{rate}</span>
                </div>
              ))}
              <div style={{ fontSize: 10, color: scotland ? '#1e3a8a' : '#0f766e', marginTop: 5 }}>
                {scotland ? 'Scottish rates confirmed Feb 2026. NI rates are UK-wide.' : 'Thresholds frozen until 2031.'}
              </div>
            </div>
          </div>

          {/* RESULTS PANEL */}
          <div className="fu" style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>

            {/* Take-home hero */}
            <div style={{ background: `linear-gradient(135deg,${C.navy},${C.navyMid})`, borderRadius: 14, padding: mob ? 20 : 24, boxShadow: '0 4px 20px rgba(12,30,60,0.22)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -20, right: -20, width: 110, height: 110, borderRadius: '50%', background: 'rgba(13,148,136,0.12)', pointerEvents: 'none' }} />
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'JetBrains Mono', marginBottom: 6 }}>Annual Take-Home Pay</div>
              <div style={{ fontFamily: 'DM Serif Display', fontSize: mob ? 36 : 'clamp(32px,5vw,50px)', color: 'white', lineHeight: 1.05, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <AnimNum value={Math.max(0, r.takeHome)} />
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', fontFamily: 'JetBrains Mono', marginTop: 5 }}>
                <AnimNum value={Math.max(0, r.monthly.takeHome)} f={fmtD} /> per month
              </div>
              <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden', minWidth: 0 }}>
                  <div className="bfill" style={{ width: salary > 0 ? `${Math.max(0, (r.takeHome / r.gross) * 100)}%` : '0%', height: '100%', background: 'linear-gradient(90deg,#0D9488,#14B8A6)', borderRadius: 2 }} />
                </div>
                <span style={{ fontSize: 12, color: '#14B8A6', fontFamily: 'JetBrains Mono', fontWeight: 600, flexShrink: 0 }}>
                  {salary > 0 ? `${((r.takeHome / r.gross) * 100).toFixed(1)}% kept` : '0% kept'}
                </span>
              </div>
              {r.effectiveRate > 0 && (
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'JetBrains Mono', marginTop: 4 }}>
                  Effective tax rate (income tax + NI): {r.effectiveRate.toFixed(1)}%
                </div>
              )}
            </div>

            {/* Period selector */}
            <div style={{ display: 'flex', gap: 4, background: C.white, padding: 5, borderRadius: 10, border: `1px solid ${C.border}` }}>
              {['annual', 'monthly', 'weekly', 'daily'].map(p => (
                <button key={p} onClick={() => setPeriod(p)}
                  style={{ flex: 1, padding: '9px 4px', borderRadius: 7, border: 'none', background: period === p ? C.teal : 'transparent', color: period === p ? 'white' : C.slate, fontSize: mob ? 11 : 12, fontWeight: period === p ? 600 : 400, textTransform: 'capitalize', transition: 'all 0.15s' }}>
                  {p}
                </button>
              ))}
            </div>

            {/* Gross / Net cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[['Gross Pay', pm[period].g, C.navy], ['Net Pay', pm[period].th, C.green]].map(([lbl, val, cl]) => (
                <div key={lbl} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: mob ? '13px 14px' : '14px 16px', boxShadow: C.shadow, minWidth: 0 }}>
                  <div style={{ fontSize: 10, color: C.slate, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 5, fontFamily: 'JetBrains Mono' }}>{lbl}</div>
                  <div style={{ fontFamily: 'DM Serif Display', fontSize: mob ? 20 : 'clamp(18px,3vw,24px)', color: cl, lineHeight: 1.1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <AnimNum value={Math.max(0, val || 0)} />
                  </div>
                </div>
              ))}
            </div>

            {/* Breakdown / Table */}
            <div style={{ background: C.white, borderRadius: 14, padding: mob ? 16 : '20px 22px', boxShadow: C.shadow, border: `1px solid ${C.border}` }}>
              <div style={{ display: 'flex', gap: 2, marginBottom: 16, borderBottom: `1px solid ${C.border}` }}>
                {['breakdown', 'table'].map(t => (
                  <button key={t} onClick={() => setTab(t)}
                    style={{ padding: '7px 14px', border: 'none', background: 'transparent', fontSize: 13, color: tab === t ? C.navy : C.slate, fontWeight: tab === t ? 700 : 400, borderBottom: tab === t ? `2px solid ${C.teal}` : '2px solid transparent', marginBottom: -1, textTransform: 'capitalize' }}>
                    {t}
                  </button>
                ))}
              </div>

              {tab === 'breakdown' && (
                <div>
                  <div style={{ height: 10, borderRadius: 5, overflow: 'hidden', display: 'flex', background: C.border, marginBottom: 16 }}>
                    {items.filter(it => it.value > 0).map(it => (
                      <div key={it.label} className="bfill" style={{ width: r.gross > 0 ? `${(it.value / r.gross) * 100}%` : '0%', background: it.color, height: '100%' }} />
                    ))}
                    <div className="bfill" style={{ flex: 1, background: C.teal }} />
                  </div>
                  {[...items.filter(it => it.value > 0).map(it => ({ ...it, neg: true })), { label: 'Take-home', value: r.takeHome, color: C.teal }].map(it => (
                    <div key={it.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: it.neg ? `1px solid ${C.border}` : 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                        <div style={{ width: 8, height: 8, borderRadius: 2, background: it.color, flexShrink: 0 }} />
                        <span style={{ fontSize: 13, color: it.neg ? C.textMid : C.text, fontWeight: it.neg ? 400 : 700 }}>{it.label}</span>
                      </div>
                      <span style={{ fontFamily: 'JetBrains Mono', fontSize: 13, color: it.neg ? C.red : C.teal, fontWeight: it.neg ? 400 : 700, flexShrink: 0, marginLeft: 8 }}>
                        {(it.neg ? '-' : '+') + fmt(it.value)}
                      </span>
                    </div>
                  ))}
                  {r.effectiveRate > 0 && (
                    <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', fontSize: 12, color: C.slate }}>
                      <span>Effective tax rate (income tax + NI)</span>
                      <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 600 }}>{r.effectiveRate.toFixed(1)}%</span>
                    </div>
                  )}
                </div>
              )}

              {tab === 'table' && (
                <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, minWidth: 300 }}>
                    <thead>
                      <tr>{['', 'Annual', 'Monthly', 'Weekly'].map(h => (
                        <th key={h} style={{ textAlign: h ? 'right' : 'left', padding: '6px', color: C.slate, fontSize: 10, textTransform: 'uppercase', borderBottom: `1px solid ${C.border}` }}>{h}</th>
                      ))}</tr>
                    </thead>
                    <tbody>
                      {[
                        { l: 'Gross', a: r.gross, m: r.monthly.gross, w: r.weekly.gross },
                        { l: 'Income Tax', a: r.incomeTax, m: r.incomeTax / 12, w: r.incomeTax / 52, neg: true },
                        { l: 'Nat. Insurance', a: r.ni, m: r.ni / 12, w: r.ni / 52, neg: true },
                        r.studentLoan > 0 ? { l: 'Student Loan', a: r.studentLoan, m: r.studentLoan / 12, w: r.studentLoan / 52, neg: true } : null,
                        r.pension > 0 ? { l: 'Pension', a: r.pension, m: r.pension / 12, w: r.pension / 52, neg: true } : null,
                        { l: 'Take-Home', a: r.takeHome, m: r.monthly.takeHome, w: r.weekly.takeHome, bold: true, grn: true },
                      ].filter(Boolean).map((row, i) => (
                        <tr key={row.l} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)', borderBottom: `1px solid ${C.border}` }}>
                          <td style={{ padding: '9px 6px', fontWeight: row.bold ? 700 : 400, color: row.grn ? C.teal : C.text, fontSize: 12 }}>{row.l}</td>
                          {[row.a, row.m, row.w].map((v, j) => (
                            <td key={j} style={{ padding: '9px 6px', textAlign: 'right', fontFamily: 'JetBrains Mono', fontSize: 11, color: row.neg ? C.red : row.grn ? C.teal : C.text, fontWeight: row.bold ? 700 : 400 }}>
                              {row.neg ? '-' + fmt(v) : fmtD(v)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* TAX TRAP ALERTS */}
      {traps.length > 0 && (
        <div style={{ maxWidth: 1100, margin: '16px auto 0', padding: mob ? '0 16px' : '0 24px' }}>
          <div style={{ padding: '14px 18px', background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#EA580C', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10, fontFamily: 'JetBrains Mono' }}>
              {traps.some(t => t.severity === 'critical') ? '🚨 Tax Traps Detected' : '⚠️ Tax Warnings'}
            </div>
            {traps.map(trap => <TrapAlert key={trap.id} trap={trap} />)}
          </div>
        </div>
      )}

      {/* SHARE / PDF / EXTRA TOOLS BAR */}
      {salary > 0 && (
        <div style={{ maxWidth: 1100, margin: '12px auto 0', padding: mob ? '0 16px' : '0 24px' }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <button onClick={handleShare}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 8, border: `1.5px solid ${C.borderDark}`, background: C.white, color: shareStatus ? C.teal : C.navyLight, fontSize: 12, fontWeight: 600 }}>
              {shareStatus === 'copied' ? '✓ Link copied' : shareStatus === 'shared' ? '✓ Shared' : '↗ Share result'}
            </button>
            <button onClick={handlePDF}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 8, border: `1.5px solid ${C.borderDark}`, background: C.white, color: C.navyLight, fontSize: 12, fontWeight: 600 }}>
              ↓ Save PDF
            </button>
            <button onClick={() => setShowScenario(!showScenario)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 8, border: `1.5px solid ${showScenario ? C.teal : C.borderDark}`, background: showScenario ? C.tealBg : C.white, color: showScenario ? C.teal : C.navyLight, fontSize: 12, fontWeight: 600 }}>
              ⇄ Compare scenario
            </button>
            <button onClick={() => setShowEmployer(!showEmployer)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 8, border: `1.5px solid ${showEmployer ? C.amber : C.borderDark}`, background: showEmployer ? C.amberBg : C.white, color: showEmployer ? C.amber : C.navyLight, fontSize: 12, fontWeight: 600 }}>
              £ Employer cost
            </button>
            {/* Net hourly truth */}
            {salary > 0 && (
              <div style={{ marginLeft: 'auto', fontSize: 12, color: C.slate, fontFamily: 'JetBrains Mono', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span>Net hourly</span>
                <span style={{ fontWeight: 700, color: C.navy }}>{fmtD(netHourly)}</span>
                <span style={{ color: C.slateLight, fontSize: 10 }}>37.5h wk</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SCENARIO COMPARISON PANEL */}
      {showScenario && salary > 0 && (
        <div style={{ maxWidth: 1100, margin: '12px auto 0', padding: mob ? '0 16px' : '0 24px' }}>
          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: mob ? 16 : 22, boxShadow: C.shadow }}>
            <h3 style={{ fontFamily: 'DM Serif Display', fontSize: 16, color: C.navy, marginBottom: 14 }}>Pay Rise / Scenario Comparison</h3>
            <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gap: 16, marginBottom: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.navyLight, marginBottom: 7 }}>Compare salary</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: C.slate, fontSize: 16, fontWeight: 600, fontFamily: 'JetBrains Mono', pointerEvents: 'none' }}>£</span>
                  <input type="number" inputMode="decimal" value={scenarioSalary} placeholder={String(salary)}
                    onChange={e => setScenarioSalary(e.target.value)}
                    style={{ width: '100%', padding: '12px 14px 12px 28px', border: `1.5px solid ${C.borderDark}`, borderRadius: 8, fontSize: 15, fontFamily: 'JetBrains Mono', color: C.navy, background: 'white', outline: 'none' }}
                    onFocus={e => e.target.style.borderColor = C.teal} onBlur={e => e.target.style.borderColor = C.borderDark} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.navyLight }}>Pension</label>
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: C.teal }}>{scenarioPension}%</span>
                </div>
                <input type="range" min={0} max={30} step={0.5} value={scenarioPension} onChange={e => setScenarioPension(Number(e.target.value))} />
              </div>
            </div>
            {scenSalaryNum > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                {[
                  ['Current', fmt(r.takeHome), C.navy],
                  [scenSalaryNum > salary ? 'After pay rise' : 'New salary', fmt(rScen.takeHome), scenDelta >= 0 ? C.green : C.red],
                  ['Annual difference', (scenDelta >= 0 ? '+' : '') + fmt(scenDelta), scenDelta >= 0 ? C.green : C.red],
                ].map(([label, value, color]) => (
                  <div key={label} style={{ background: C.bg, borderRadius: 8, padding: '12px 14px', textAlign: 'center' }}>
                    <div style={{ fontSize: 10, color: C.slate, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'JetBrains Mono', marginBottom: 4 }}>{label}</div>
                    <div style={{ fontFamily: 'DM Serif Display', fontSize: mob ? 18 : 22, color, lineHeight: 1 }}>{value}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* EMPLOYER COST PANEL */}
      {showEmployer && salary > 0 && (
        <div style={{ maxWidth: 1100, margin: '12px auto 0', padding: mob ? '0 16px' : '0 24px' }}>
          <div style={{ background: C.white, border: `1px solid ${C.amberBorder}`, borderRadius: 12, padding: mob ? 16 : 22, boxShadow: C.shadow }}>
            <h3 style={{ fontFamily: 'DM Serif Display', fontSize: 16, color: C.navy, marginBottom: 4 }}>Employer Cost Calculator</h3>
            <p style={{ fontSize: 12, color: C.slate, marginBottom: 14 }}>What hiring you actually costs your employer in 2026-27.</p>
            <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr 1fr' : 'repeat(4,1fr)', gap: 10 }}>
              {[
                ['Your salary', fmt(salary), C.navy],
                ['Employer NI (15%)', fmt(employerNI), C.red],
                ['Total employer cost', fmt(totalEmployerCost), C.amber],
                ['Cost premium', `+${((employerNI / salary) * 100).toFixed(1)}%`, C.amber],
              ].map(([label, value, color]) => (
                <div key={label} style={{ background: C.amberBg, border: `1px solid ${C.amberBorder}`, borderRadius: 8, padding: '12px 14px' }}>
                  <div style={{ fontSize: 10, color: C.amber, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'JetBrains Mono', marginBottom: 4 }}>{label}</div>
                  <div style={{ fontFamily: 'DM Serif Display', fontSize: mob ? 18 : 22, color, lineHeight: 1 }}>{value}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, fontSize: 11, color: C.slate, lineHeight: 1.6 }}>
              Employer NI is charged at 15% on salary above £5,000/year. This cost is invisible on your payslip but is the reason salary sacrifice pension contributions are valuable for employers too — every £1 of salary sacrifice saves your employer 15p.
            </div>
          </div>
        </div>
      )}

      {/* EMAIL CAPTURE MODAL */}
      {showEmailModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px' }}>
          <div style={{ background: 'white', borderRadius: 16, padding: 28, maxWidth: 420, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <h3 style={{ fontFamily: 'DM Serif Display', fontSize: 22, color: C.navy, marginBottom: 8 }}>Save your breakdown as PDF</h3>
            <p style={{ fontSize: 13, color: C.slate, lineHeight: 1.7, marginBottom: 18 }}>
              Get your full take-home breakdown and optionally receive an alert when 2027-28 rates go live.
            </p>
            <input type="email" value={emailInput} onChange={e => setEmailInput(e.target.value)}
              placeholder="Your email (optional)"
              style={{ width: '100%', padding: '12px 14px', border: `1.5px solid ${C.borderDark}`, borderRadius: 8, fontSize: 14, color: C.navy, outline: 'none', marginBottom: 12 }}
              onFocus={e => e.target.style.borderColor = C.teal} onBlur={e => e.target.style.borderColor = C.borderDark} />
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => { setEmailCaptured(true); setShowEmailModal(false); window.print(); }}
                style={{ flex: 1, padding: '12px', background: C.teal, color: 'white', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700 }}>
                Download PDF
              </button>
              <button onClick={() => setShowEmailModal(false)}
                style={{ padding: '12px 16px', background: C.bg, color: C.slate, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 14 }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE STICKY RESULT BAR */}
      {mob && salary > 0 && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: C.navy, zIndex: 90, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', boxShadow: '0 -2px 16px rgba(0,0,0,0.3)' }}>
          <div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', fontFamily: 'JetBrains Mono', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Take-home</div>
            <div style={{ fontFamily: 'DM Serif Display', fontSize: 20, color: '#14B8A6', lineHeight: 1 }}>
              <AnimNum value={Math.max(0, r.takeHome)} />
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', fontFamily: 'JetBrains Mono', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Monthly</div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 14, color: 'white', fontWeight: 700, lineHeight: 1 }}>
              <AnimNum value={Math.max(0, r.monthly.takeHome)} f={fmtD} />
            </div>
          </div>
        </div>
      )}

      {/* MORE CALCULATORS */}
      <section style={{ background: C.white, borderTop: `1px solid ${C.border}`, padding: mob ? '44px 16px' : '52px 24px', marginTop: 48 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'DM Serif Display', fontSize: mob ? 22 : 28, color: C.navy, marginBottom: 5 }}>More Calculators</h2>
          <p style={{ color: C.slate, marginBottom: 22, fontSize: 14 }}>Every scenario. Every type of worker.</p>
          <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr 1fr' : 'repeat(auto-fill,minmax(175px,1fr))', gap: 12 }}>
            {[
              { icon: '🏗️', label: 'IR35 Contractor', sub: 'PAYE vs Ltd Co', tag: 'Popular', href: '/ir35' },
              { icon: '⏰', label: 'Hourly Rate', sub: 'Hourly to annual', href: '/hourly' },
              { icon: '👶', label: 'Maternity Pay', sub: 'SMP calculator', href: '/maternity' },
              { icon: '🏥', label: 'NHS Pay Bands', sub: 'Bands 1 to 9', href: '/nhs' },
              { icon: '💼', label: 'Bonus Calculator', sub: 'Net after tax', href: '/bonus' },
              { icon: '🏦', label: 'Salary Sacrifice', sub: 'Pension real cost', href: '/sacrifice' },
              { icon: '📊', label: 'Job Comparison', sub: 'Compare 2 offers', href: '/comparison' },
              { icon: '🌍', label: 'All Tools', sub: 'View everything', href: '/tools' },
            ].map(c => (
              <Link key={c.href} href={c.href} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: '14px 13px', display: 'block', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.teal; e.currentTarget.style.background = C.white; e.currentTarget.style.boxShadow = C.shadow; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.bg; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ fontSize: 20, marginBottom: 7 }}>{c.icon}</div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 4 }}>
                  <div style={{ fontSize: mob ? 12 : 13, fontWeight: 700, color: C.navy, lineHeight: 1.3 }}>{c.label}</div>
                  {c.tag && <span style={{ fontSize: 9, background: C.tealBg, color: C.teal, border: `1px solid ${C.tealBorder}`, borderRadius: 3, padding: '2px 5px', flexShrink: 0, fontWeight: 700 }}>{c.tag}</span>}
                </div>
                <div style={{ fontSize: 11, color: C.slate, marginTop: 2 }}>{c.sub}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* COUNTRIES STRIP */}
      <div style={{ background: C.tealBg, borderTop: `1px solid ${C.tealBorder}`, borderBottom: `1px solid ${C.tealBorder}`, padding: mob ? '26px 16px' : '30px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontFamily: 'DM Serif Display', fontSize: mob ? 17 : 20, color: C.navy, marginBottom: 3 }}>Available in Multiple Countries</div>
            <div style={{ fontSize: 13, color: C.slate }}>Same accuracy. Local tax rules.</div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[['🇬🇧', 'UK', true], ['🇨🇦', 'Canada', false], ['🇦🇺', 'Australia', false], ['🇳🇱', 'Netherlands', false], ['🇸🇪', 'Sweden', false]].map(([flag, label, live]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, background: C.white, border: `1px solid ${live ? C.tealBorder : C.border}`, borderRadius: 7, padding: '7px 11px' }}>
                <span style={{ fontSize: 15 }}>{flag}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>{label}</span>
                <span style={{ fontSize: 9, background: live ? C.tealBg : '#F1F5F9', color: live ? C.teal : C.slate, borderRadius: 3, padding: '1px 5px', fontWeight: 700, fontFamily: 'JetBrains Mono' }}>{live ? 'LIVE' : 'SOON'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BLOG / GUIDES */}
      <section style={{ background: C.navy, padding: mob ? '38px 16px' : '46px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'DM Serif Display', fontSize: mob ? 20 : 26, color: 'white', marginBottom: 5 }}>Understanding Your Tax</h2>
          <p style={{ color: 'rgba(255,255,255,0.38)', marginBottom: 20, fontSize: 13 }}>Plain-English guides. Confirmed 2026-27 HMRC and Scottish Government figures.</p>
          <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : 'repeat(auto-fill,minmax(230px,1fr))', gap: 12 }}>
            {ARTICLES.map(a => (
              <Link key={a.slug} href={'/blog/' + a.slug}
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 16, display: 'block', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(13,148,136,0.12)'; e.currentTarget.style.borderColor = 'rgba(20,184,166,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}>
                <div style={{ fontSize: 10, color: '#14B8A6', marginBottom: 5, fontFamily: 'JetBrains Mono', fontWeight: 600 }}>{a.category}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#14B8A6', marginBottom: 5, lineHeight: 1.35 }}>{a.title}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', lineHeight: 1.55 }}>{a.desc}</div>
              </Link>
            ))}
          </div>
          <div style={{ marginTop: 20, textAlign: 'center' }}>
            <Link href="/blog" style={{ display: 'inline-block', background: 'rgba(13,148,136,0.15)', border: '1px solid rgba(20,184,166,0.3)', color: '#14B8A6', padding: '10px 24px', borderRadius: 8, fontSize: 13, fontWeight: 600 }}>
              View all tax guides →
            </Link>
          </div>
        </div>
      </section>

      {/* SEO INTERNAL LINKING AUTHORITY SECTION */}
      <section style={{ background: C.white, borderTop: `1px solid ${C.border}`, padding: mob ? '44px 16px 52px' : '56px 24px 64px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'DM Serif Display', fontSize: mob ? 22 : 30, color: C.navy, marginBottom: 6 }}>UK Salary &amp; Tax Guides</h2>
          <p style={{ color: C.slate, fontSize: 14, marginBottom: 36, maxWidth: 560 }}>Every calculator, every salary, every tax scenario — 2026-27 HMRC rates throughout.</p>
          <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr 1fr' : 'repeat(5,1fr)', gap: mob ? '28px 20px' : 32 }}>

            <div>
              <h3 style={{ fontFamily: 'DM Serif Display', fontSize: 15, color: C.navy, marginBottom: 8, paddingBottom: 8, borderBottom: `2px solid ${C.teal}` }}>Popular Salary Pages</h3>
              <p style={{ fontSize: 11, color: C.slate, marginBottom: 10, lineHeight: 1.5 }}>Income tax &amp; NI breakdown by salary.</p>
              {[
                ['/30000-salary-take-home', '£30,000 salary take-home pay'],
                ['/40000-salary-take-home', '£40,000 salary take-home pay'],
                ['/50000-salary-take-home', '£50,000 salary take-home pay'],
                ['/60000-salary-take-home', '£60,000 salary take-home pay'],
                ['/80000-salary-take-home', '£80,000 salary take-home pay'],
                ['/100000-salary-take-home', '£100,000 salary take-home pay'],
                ['/125000-salary-take-home', '£125,000 salary take-home pay'],
              ].map(([href, label]) => (
                <Link key={href} href={href} style={{ display: 'block', fontSize: 12, color: C.teal, marginBottom: 7, lineHeight: 1.4, fontWeight: 500 }}>{label}</Link>
              ))}
            </div>

            <div>
              <h3 style={{ fontFamily: 'DM Serif Display', fontSize: 15, color: C.navy, marginBottom: 8, paddingBottom: 8, borderBottom: `2px solid ${C.teal}` }}>Salary Hubs &amp; Tools</h3>
              <p style={{ fontSize: 11, color: C.slate, marginBottom: 10, lineHeight: 1.5 }}>Compare salaries and model scenarios.</p>
              {[
                ['/salary-take-home-pay-uk', 'All UK salary guides'],
                ['/tools', 'All tax calculators'],
                ['/comparison', 'Compare two job offers'],
                ['/bonus', 'Bonus tax calculator'],
                ['/sacrifice', 'Salary sacrifice calculator'],
              ].map(([href, label]) => (
                <Link key={href} href={href} style={{ display: 'block', fontSize: 12, color: C.teal, marginBottom: 7, lineHeight: 1.4, fontWeight: 500 }}>{label}</Link>
              ))}
            </div>

            <div>
              <h3 style={{ fontFamily: 'DM Serif Display', fontSize: 15, color: C.navy, marginBottom: 8, paddingBottom: 8, borderBottom: `2px solid ${C.teal}` }}>Public Sector Pay</h3>
              <p style={{ fontSize: 11, color: C.slate, marginBottom: 10, lineHeight: 1.5 }}>NHS bands, teachers, police &amp; more.</p>
              {[
                ['/nhs', 'NHS Band pay calculator'],
                ['/nhs-pay-guide', 'NHS pay guide 2026-27'],
                ['/teacher-pay-guide', 'Teacher pay guide 2026-27'],
                ['/public-sector-pay', 'Public sector pay hub'],
                ['/public-sector-pay/police', 'Police pay take-home'],
                ['/public-sector-pay/firefighters', 'Firefighter pay take-home'],
              ].map(([href, label]) => (
                <Link key={href} href={href} style={{ display: 'block', fontSize: 12, color: C.teal, marginBottom: 7, lineHeight: 1.4, fontWeight: 500 }}>{label}</Link>
              ))}
            </div>

            <div>
              <h3 style={{ fontFamily: 'DM Serif Display', fontSize: 15, color: C.navy, marginBottom: 8, paddingBottom: 8, borderBottom: `2px solid ${C.teal}` }}>Tax Planning Guides</h3>
              <p style={{ fontSize: 11, color: C.slate, marginBottom: 10, lineHeight: 1.5 }}>Avoid traps. Reclaim thousands.</p>
              {[
                ['/tax-traps', 'Tax traps guide'],
                ['/blog/60-percent-tax-trap', '60% tax trap explained'],
                ['/blog/hicbc-child-benefit-charge', 'High income child benefit charge'],
                ['/blog/personal-allowance-taper-100k', 'Personal allowance taper at £100k'],
                ['/blog/pension-tax-relief-your-free-money', 'Pension tax relief: free money from HMRC'],
              ].map(([href, label]) => (
                <Link key={href} href={href} style={{ display: 'block', fontSize: 12, color: C.teal, marginBottom: 7, lineHeight: 1.4, fontWeight: 500 }}>{label}</Link>
              ))}
            </div>

            <div>
              <h3 style={{ fontFamily: 'DM Serif Display', fontSize: 15, color: C.navy, marginBottom: 8, paddingBottom: 8, borderBottom: `2px solid ${C.teal}` }}>Contractor Pay</h3>
              <p style={{ fontSize: 11, color: C.slate, marginBottom: 10, lineHeight: 1.5 }}>IR35 and day rate take-home calculators.</p>
              {[
                ['/contractor-pay', 'Contractor pay hub'],
                ['/ir35', 'Inside vs outside IR35 calculator'],
                ['/300-day-rate-take-home', '£300/day contractor take-home'],
                ['/500-day-rate-take-home', '£500/day contractor take-home'],
                ['/700-day-rate-take-home', '£700/day contractor take-home'],
              ].map(([href, label]) => (
                <Link key={href} href={href} style={{ display: 'block', fontSize: 12, color: C.teal, marginBottom: 7, lineHeight: 1.4, fontWeight: 500 }}>{label}</Link>
              ))}
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}