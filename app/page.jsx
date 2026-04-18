'use client';
import React, { useState, useEffect, useRef } from 'react'; // Added React for the local state in new components
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

// SECTION 1: AUTHORITY CONSTANTS
const VISA_THRESHOLD = 41700;       
const MTD_TRIGGER    = 50000;       
const DIR_SALARY     = 5000;        
const CORP_TAX_RATE  = 0.19;        
const DIV_BASIC_RATE = 0.1075;      
const DIV_ALLOW      = 500;         

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

// SECTION 2: NEW AUTHORITY LOGIC
function checkVisaEligibility(gross) {
  const shortfall = Math.max(0, VISA_THRESHOLD - gross);
  return { eligible: gross >= VISA_THRESHOLD, shortfall, threshold: VISA_THRESHOLD, pct: Math.min(100, Math.round((gross / VISA_THRESHOLD) * 100)) };
}

function checkMTD(gross) { return gross >= MTD_TRIGGER; }

function calcDirectorOptimiser(revenue) {
  if (revenue <= 0) return null;
  const payeIT = calcTax(revenue, 0, false, '');
  const payeNI = calcNI(revenue);
  const payeTH = revenue - payeIT - payeNI;
  const dirSalary = Math.min(DIR_SALARY, revenue);
  const profitPool = Math.max(0, revenue - dirSalary);
  const corpTax = profitPool * CORP_TAX_RATE;
  const divPool = profitPool - corpTax;
  const taxableDivs = Math.max(0, divPool - DIV_ALLOW);
  const paRemaining = Math.max(0, 12570 - dirSalary);
  const divCovered = Math.min(taxableDivs, paRemaining);
  const divBasic = Math.min(Math.max(0, taxableDivs - divCovered), 37700 - dirSalary);
  const divTax = divBasic * DIV_BASIC_RATE + Math.max(0, taxableDivs - divCovered - divBasic) * 0.3375;
  const dirTH = dirSalary + divPool - divTax;
  const saving = Math.round(dirTH - payeTH);
  return { payeTH, dirTH, saving, corpTax, divTax, divPool, dirSalary, worthwhile: saving > 500 };
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
    // SECTION 3: EXTENDED RETURN
    visa: checkVisaEligibility(g),
    mtd: checkMTD(g),
    director: calcDirectorOptimiser(g)
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
.fu{animation:fadeUp 0.38s ease both;}
.bfill{transition:width 0.48s cubic-bezier(0.4,0,0.2,1);}
button{-webkit-tap-highlight-color:transparent;cursor:pointer;font-family:inherit;}
a{text-decoration:none;color:inherit;}
`;

const ARTICLES = [
  { slug: 'how-uk-income-tax-brackets-work', title: 'How UK Income Tax Brackets Work (2026-27)', category: 'Tax Basics', desc: 'Understand marginal rates and why a pay rise never means less take-home pay.' },
  { slug: 'national-insurance-explained', title: 'National Insurance Explained (2026-27)', category: 'Tax Basics', desc: 'Class 1 NI rates, 2026-27 thresholds, and how NI differs from income tax.' },
  { slug: 'pension-tax-relief-your-free-money', title: 'Pension Tax Relief: Free Money From HMRC', category: 'Tax Planning', desc: 'How salary sacrifice saves both income tax and NI. Real examples.' },
  { slug: '2026-27-tax-year-changes-uk', title: '2026-27 Tax Year: Everything That Changed', category: 'Tax Year Updates', desc: 'Thresholds frozen, NLW 12.71/hr, dividend rates up. Complete guide.' },
];

function NavBar() {
  const [open, setOpen] = useState(false);
  const mob = useW() < 700;
  const links = [
    ['/', 'Salary Calculator'],
    ['/ir35', 'IR35'],
    ['/nhs', 'NHS Bands'],
    ['/tools', 'All Tools'],
    ['/blog', 'Tax Guides'],
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
    </div>
  );
}

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
          <input type="text" value={taxCode} onChange={e => setTaxCode(e.target.value)} placeholder="1257L"
            style={{ width: '100%', padding: '11px 13px', border: `1.5px solid ${C.borderDark}`, borderRadius: 7, fontSize: 14, fontFamily: 'JetBrains Mono', color: C.navy, background: 'white', outline: 'none' }} />
        </div>
      )}
    </div>
  );
}

// SECTION 5: NEW UI COMPONENTS
function HMRCBadge() {
  return (
    <a href="https://www.gov.uk/income-tax-rates" target="_blank" rel="noopener noreferrer"
      style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: 4, padding: '3px 8px', fontSize: 10, color: '#166534', fontFamily: 'JetBrains Mono', fontWeight: 600, textDecoration: 'none', marginTop: 8 }}>
      <span>✓</span> Source: HMRC April 2026 Verified Data
    </a>
  );
}

function VisaCheckerCard({ visa, mob }) {
  if (!visa || visa.threshold === undefined) return null;
  const { eligible, shortfall, pct } = visa;
  return (
    <div style={{ background: eligible ? '#F0FDF4' : '#FFF7ED', border: `1.5px solid ${eligible ? '#86EFAC' : '#FED7AA'}`, borderRadius: 12, padding: mob ? '14px 15px' : '16px 18px', marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: eligible ? '#166534' : '#92400E' }}>Skilled Worker Visa {eligible ? '✅' : '⚠️'}</div>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 13, fontWeight: 700 }}>{pct}%</div>
      </div>
      <div style={{ height: 4, background: 'rgba(0,0,0,0.06)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: eligible ? '#22C55E' : '#F97316', transition: 'width 0.5s' }} />
      </div>
      <div style={{ marginTop: 8, fontSize: 10, color: '#64748B' }}>
        {eligible ? 'Threshold of £41,700 met.' : `Shortfall: ${fmt(shortfall)} of £41,700 floor.`} <a href="https://www.gov.uk/skilled-worker-visa/your-job" target="_blank" style={{ fontWeight: 600 }}>GOV.UK ↗</a>
      </div>
    </div>
  );
}

function ComplianceAlert({ mtd, gross, mob }) {
  const [dismissed, setDismissed] = React.useState(false);
  if (!mtd || dismissed) return null;
  return (
    <div style={{ background: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: 12, padding: '14px 15px', position: 'relative', marginBottom: 14 }}>
      <button onClick={() => setDismissed(true)} style={{ position: 'absolute', top: 10, right: 12, background: 'none', border: 'none', color: '#94A3B8' }}>✕</button>
      <div style={{ fontSize: 12, fontWeight: 700, color: '#991B1B' }}>🔴 Making Tax Digital 2026</div>
     <div style={{ fontSize: 11, color: '#7F1D1D', marginTop: 4 }}>
  Income {'>'} £50k requires quarterly digital filing. <a href="https://www.gov.uk/guidance/find-software-thats-compatible-with-making-tax-digital-for-income-tax" target="_blank" style={{ fontWeight: 700 }}>Software Guide ↗</a>
</div>
  );
}

function DirectorOptimizer({ director, mob }) {
  const [expanded, setExpanded] = React.useState(false);
  if (!director || !director.worthwhile) return null;
  const { saving, dirTH, payeTH } = director;
  return (
    <div style={{ background: '#F0FDFA', border: '1.5px solid #99F6E4', borderRadius: 12, padding: '14px 15px', marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 12, fontWeight: 700 }}>💼 Director Optimiser</div>
        <button onClick={() => setExpanded(!expanded)} style={{ fontSize: 11, color: '#0D9488', background: 'none', border: 'none', fontWeight: 700 }}>{expanded ? 'Hide' : 'Save ' + fmt(saving)}</button>
      </div>
      {expanded && <div style={{ marginTop: 10, fontSize: 11, color: '#475569' }}>Taking £5,000 salary + dividends avoids 15% Employer NI. Est Take-home: {fmt(dirTH)} vs {fmt(payeTH)} PAYE.</div>}
    </div>
  );
}

function SitemapDirectory({ mob }) {
  const salaries = [];
  for (let s = 15000; s <= 200000; s += 5000) salaries.push(s);
  return (
    <section style={{ background: '#07111F', padding: '40px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'DM Serif Display', fontSize: 20, color: 'white', marginBottom: 20 }}>Salary Index</h2>
        <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr 1fr' : 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
          {salaries.map(s => (
            <Link key={s} href={`/salary-after-tax/${s}`} style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: 6, color: 'rgba(255,255,255,0.7)', fontSize: 12, fontFamily: 'JetBrains Mono' }}>
              £{s.toLocaleString()} <span style={{ color: '#14B8A6' }}>→</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const mob = useW() < 640;
  return (
    <footer style={{ background: '#07111F', padding: '24px 20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: mob ? 'column' : 'row', justifyContent: 'space-between', gap: 14, alignItems: mob ? 'flex-start' : 'center' }}>
        <Link href="/" style={{ color: 'white', fontFamily: 'DM Serif Display', fontSize: 15 }}>Taxd<span style={{ color: '#14B8A6' }}>Calc</span></Link>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.18)' }}>Updated April 2026. Official HMRC verification logic.</span>
      </div>
    </footer>
  );
}

export default function HomePage() {
  const mob = useW() < 768;
  const [salaryStr, setSalaryStr] = useState('45000');
  const [pension, setPension] = useState(5);
  const [loan, setLoan] = useState('none');
  const [period, setPeriod] = useState('annual');
  const [tab, setTab] = useState('breakdown');
  const [scotland, setScotland] = useState(false);
  const [taxCode, setTaxCode] = useState('');

  const salary = Math.max(0, Number(salaryStr) || 0);
  const r = calculate(salary, pension, loan, scotland, taxCode);
  const pm = { annual: { g: r.gross, th: r.takeHome }, monthly: { g: r.monthly.gross, th: r.monthly.takeHome }, weekly: { g: r.weekly.gross, th: r.weekly.takeHome }, daily: { g: r.daily.gross, th: r.daily.takeHome } };
  const items = [{ label: 'Income Tax', value: r.incomeTax, color: C.red }, { label: 'Nat. Insurance', value: r.ni, color: '#F59E0B' }, { label: 'Student Loan', value: r.studentLoan, color: '#6366F1' }, { label: 'Pension', value: r.pension, color: '#14B8A6' }];

  return (
    <>
      <style>{STYLE}</style>
      {/* SECTION 4: SCHEMA INJECTION */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FinancialProduct', name: 'UK Take-Home Pay Calculator 2026-27', url: 'https://taxdcal.co.uk', dateModified: '2026-04-06' }) }} />
      <NavBar />
      <div style={{ background: `linear-gradient(135deg,${C.navy},${C.navyMid})`, padding: mob ? '36px 20px 68px' : '48px 24px 80px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'DM Serif Display', fontSize: mob ? 32 : 48, color: 'white' }}>Take-Home Calculator <span style={{ color: '#14B8A6' }}>2026</span></h1>
      </div>
      <div style={{ maxWidth: 1100, margin: '-40px auto 0', padding: '0 20px', display: 'grid', gridTemplateColumns: mob ? '1fr' : '380px 1fr', gap: 20 }}>
        <div style={{ background: 'white', padding: 20, borderRadius: 14, boxShadow: C.shadow }}>
          <label style={{ fontSize: 13, fontWeight: 700 }}>Annual Salary</label>
          <input type="number" value={salaryStr} onChange={e => setSalaryStr(e.target.value)} style={{ width: '100%', padding: 12, marginTop: 8, borderRadius: 8, border: '1.5px solid #CBD5E1' }} />
          <div style={{ marginTop: 20 }}><ScotlandToggle scotland={scotland} setScotland={setScotland} /></div>
          <TaxCodePanel taxCode={taxCode} setTaxCode={setTaxCode} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: C.navy, padding: 24, borderRadius: 14, color: 'white' }}>
            <div style={{ fontSize: 11, textTransform: 'uppercase', opacity: 0.6 }}>Estimated Take-Home</div>
            <div style={{ fontSize: 42, fontFamily: 'DM Serif Display' }}><AnimNum value={r.takeHome} /></div>
          </div>
          {/* SECTION 6: AUTHORITY CARDS INSERTION */}
          <VisaCheckerCard visa={r.visa} mob={mob} />
          <ComplianceAlert mtd={r.mtd} gross={salary} mob={mob} />
          <DirectorOptimizer director={r.director} mob={mob} />
          <div style={{ background: 'white', padding: 20, borderRadius: 14, boxShadow: C.shadow }}>
            <div style={{ display: 'flex', gap: 15, borderBottom: '1px solid #EEE', marginBottom: 15 }}>
              <button onClick={() => setTab('breakdown')} style={{ paddingBottom: 8, borderBottom: tab === 'breakdown' ? '2px solid #0D9488' : 'none', fontWeight: 700 }}>Breakdown</button>
              <button onClick={() => setTab('table')} style={{ paddingBottom: 8, borderBottom: tab === 'table' ? '2px solid #0D9488' : 'none', fontWeight: 700 }}>Table</button>
            </div>
            {tab === 'breakdown' && (
              <div>
                {items.filter(it => it.value > 0).map(it => (
                  <div key={it.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                    <span style={{ fontSize: 13 }}>{it.label}</span>
                    <span style={{ color: C.red, fontWeight: 600 }}>-{fmt(it.value)}</span>
                  </div>
                ))}
                <div style={{ borderTop: '1px solid #EEE', marginTop: 10, paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                  <span>Final Take-Home</span>
                  <span style={{ color: C.teal }}>{fmt(r.takeHome)}</span>
                </div>
                {/* SECTION 7: HMRC BADGE */}
                <HMRCBadge />
              </div>
            )}
          </div>
        </div>
      </div>
      {/* SECTION 9: SITEMAP INSERTION */}
      <SitemapDirectory mob={mob} />
      <Footer />
    </>
  );
}
