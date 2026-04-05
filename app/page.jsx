‘use client’;
import React, { useState, useEffect, useRef } from ‘react’;

// ── RESPONSIVE ────────────────────────────────────────────────────────────────
function useWidth() {
const [w, setW] = useState(typeof window !== ‘undefined’ ? window.innerWidth : 800);
useEffect(() => {
const fn = () => setW(window.innerWidth);
window.addEventListener(‘resize’, fn);
return () => window.removeEventListener(‘resize’, fn);
}, []);
return w;
}

// ── TAX LOGIC 2026-27 ─────────────────────────────────────────────────────────
const TAX = {
pa: 12570, basic: 50270, higher: 125140,
niPrimary: 12570, niUpper: 50270,
smp: { weekly: 187.18, weeks1: 6, weeks2: 33 },
studentLoan: {
plan1: { threshold: 24990, rate: 0.09 },
plan2: { threshold: 27295, rate: 0.09 },
plan4: { threshold: 31395, rate: 0.09 },
plan5: { threshold: 25000, rate: 0.09 },
none: null
}
};

function calcTax(gross, pension) {
const ti = Math.max(0, gross - pension);
let allow = TAX.pa;
if (ti > 100000) allow = Math.max(0, TAX.pa - (ti - 100000) / 2);
const t = Math.max(0, ti - allow);
const b1 = TAX.basic - TAX.pa, b2 = TAX.higher - TAX.pa;
if (t <= b1) return t * 0.20;
if (t <= b2) return b1 * 0.20 + (t - b1) * 0.40;
return b1 * 0.20 + (b2 - b1) * 0.40 + (t - b2) * 0.45;
}
function calcNI(gross) {
if (gross <= TAX.niPrimary) return 0;
if (gross <= TAX.niUpper) return (gross - TAX.niPrimary) * 0.08;
return (TAX.niUpper - TAX.niPrimary) * 0.08 + (gross - TAX.niUpper) * 0.02;
}
function calcLoan(gross, plan) {
if (!plan || plan === ‘none’) return 0;
const p = TAX.studentLoan[plan];
if (!p || gross <= p.threshold) return 0;
return (gross - p.threshold) * p.rate;
}
function calculate(gross, pensionPct, slPlan) {
const pension = gross * ((pensionPct || 0) / 100);
const incomeTax = calcTax(gross, pension);
const ni = calcNI(gross);
const studentLoan = calcLoan(gross, slPlan || ‘none’);
const deductions = incomeTax + ni + studentLoan + pension;
const takeHome = gross - deductions;
return {
gross, incomeTax, ni, studentLoan, pension, deductions, takeHome,
monthly: { gross: gross / 12, takeHome: takeHome / 12 },
weekly: { gross: gross / 52, takeHome: takeHome / 52 },
daily: { gross: gross / 260, takeHome: takeHome / 260 },
effectiveRate: gross > 0 ? ((incomeTax + ni) / gross) * 100 : 0
};
}

// ── NHS PAY BANDS 2026-27 (Agenda for Change) ─────────────────────────────────
const NHS_BANDS = [
{ band: ‘Band 2’, min: 23615, max: 24336, points: [23615, 23960, 24336] },
{ band: ‘Band 3’, min: 24336, max: 25527, points: [24336, 24875, 25527] },
{ band: ‘Band 4’, min: 26530, max: 29114, points: [26530, 27557, 28368, 29114] },
{ band: ‘Band 5’, min: 29970, max: 36483, points: [29970, 31469, 33280, 34758, 35392, 36483] },
{ band: ‘Band 6’, min: 37338, max: 44962, points: [37338, 39205, 41659, 43742, 44119, 44962] },
{ band: ‘Band 7’, min: 46148, max: 52809, points: [46148, 47672, 49764, 51393, 52809] },
{ band: ‘8a’, min: 53755, max: 60504, points: [53755, 55058, 57349, 59028, 60504] },
{ band: ‘8b’, min: 62215, max: 72293, points: [62215, 63985, 67035, 70017, 72293] },
{ band: ‘8c’, min: 74290, max: 85601, points: [74290, 76897, 81132, 83571, 85601] },
{ band: ‘8d’, min: 88168, max: 101677, points: [88168, 92546, 97508, 99976, 101677] },
{ band: ‘Band 9’, min: 105385, max: 121271, points: [105385, 110848, 116288, 119511, 121271] }
];

// ── FORMAT ────────────────────────────────────────────────────────────────────
const P = String.fromCharCode(163);
const fmtP = n => P + Math.abs(n).toLocaleString(‘en-GB’, { maximumFractionDigits: 0 });
const fmtPD = n => P + n.toLocaleString(‘en-GB’, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ── ANIMATED NUMBER ───────────────────────────────────────────────────────────
function AnimNum({ value, format }) {
const f = format || fmtP;
const [disp, setDisp] = useState(value);
const prev = useRef(value);
useEffect(() => {
const start = prev.current, end = value, diff = end - start;
if (Math.abs(diff) < 1) { setDisp(end); prev.current = end; return; }
const dur = 400, t0 = performance.now(); let raf;
const step = now => {
const t = Math.min(1, (now - t0) / dur), e = t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
setDisp(start + diff * e);
if (t < 1) raf = requestAnimationFrame(step);
else { setDisp(end); prev.current = end; }
};
raf = requestAnimationFrame(step);
return () => cancelAnimationFrame(raf);
}, [value]);
return <span>{f(disp)}</span>;
}

// ── COLOURS ───────────────────────────────────────────────────────────────────
const C = {
bg: ‘#F8F9FA’, white: ‘#FFFFFF’,
navy: ‘#0C1E3C’, navyLight: ‘#162d52’, navyMid: ‘#1e3d6e’,
teal: ‘#0D9488’, tealLight: ‘#14B8A6’, tealBg: ‘#F0FDFA’, tealBorder: ‘#99F6E4’,
amber: ‘#D97706’, amberBg: ‘#FFFBEB’, amberBorder: ‘#FDE68A’,
border: ‘#E2E8F0’, borderDark: ‘#CBD5E1’,
green: ‘#059669’, greenBg: ‘#ECFDF5’, greenBorder: ‘#6EE7B7’,
red: ‘#DC2626’, redBg: ‘#FEF2F2’, redBorder: ‘#FECACA’,
text: ‘#1E293B’, textMid: ‘#475569’, slate: ‘#64748B’, slateLight: ‘#94A3B8’,
shadow: ‘0 1px 3px rgba(0,0,0,0.07),0 4px 16px rgba(0,0,0,0.04)’
};

// ── GLOBAL CSS ────────────────────────────────────────────────────────────────
const STYLE = `@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Source+Serif+4:wght@300;400;600;700&family=JetBrains+Mono:wght@400;500&display=swap');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}body{background:#F8F9FA;color:#1E293B;font-family:'Source Serif 4',Georgia,serif;-webkit-tap-highlight-color:transparent;}input[type=number]{-moz-appearance:textfield;}input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;}input[type=range]{-webkit-appearance:none;width:100%;height:4px;background:#CBD5E1;border-radius:2px;outline:none;cursor:pointer;}input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;border-radius:50%;background:#0C1E3C;cursor:pointer;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.2);}select{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2364748b' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;background-color:white;}@keyframes fadeUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}.fu{animation:fadeUp 0.4s ease both;}.bfill{transition:width 0.5s cubic-bezier(0.4,0,0.2,1);}button{-webkit-tap-highlight-color:transparent;cursor:pointer;}`;

// ── ARTICLES ──────────────────────────────────────────────────────────────────
const ARTICLES = [
{
slug: ‘how-uk-income-tax-brackets-work’,
title: ‘How UK Income Tax Brackets Work (2026-27)’,
metaDesc: ‘Understand UK income tax brackets in plain English. Learn how marginal rates work and why a pay rise never means less take-home pay.’,
date: ‘6 April 2026’, readTime: ‘5 min read’, category: ‘Tax Basics’,
blocks: [
{ t: ‘h2’, v: ‘What Are UK Income Tax Brackets?’ },
{ t: ‘p’, v: ‘UK income tax works on a marginal rate system. Different portions of your income are taxed at different rates, not your entire salary at one flat rate.’ },
{ t: ‘table’, headers: [‘Band’, ‘Income Range’, ‘Rate’], rows: [[‘Personal Allowance’,‘Up to 12,570’,‘0%’],[‘Basic Rate’,‘12,571 to 50,270’,‘20%’],[‘Higher Rate’,‘50,271 to 125,140’,‘40%’],[‘Additional Rate’,‘Over 125,140’,‘45%’]] },
{ t: ‘h2’, v: ‘Marginal Rates: The Most Important Concept’ },
{ t: ‘p’, v: ‘The biggest misconception is that a higher tax rate applies to your entire income. It does not. If you earn 55,000: the first 12,570 is tax-free, the next 37,700 is taxed at 20%, and only the 4,730 above 50,270 is taxed at 40%. Your effective tax rate is just 17.1%, not 40%.’ },
{ t: ‘p’, v: ‘A pay rise can never make you worse off. Only the portion above each threshold is taxed at the higher rate.’ },
{ t: ‘h2’, v: ‘What Is the Personal Allowance?’ },
{ t: ‘p’, v: ‘The Personal Allowance is the amount you can earn completely tax-free: 12,570 for 2026-27. If you earn over 100,000 this reduces by 1 pound for every 2 pounds earned above that level, creating an effective 60% rate between 100,000 and 125,140.’ },
{ t: ‘h2’, v: ‘Does Pension Affect Income Tax?’ },
{ t: ‘p’, v: ‘Yes. Salary sacrifice pension contributions reduce your taxable income. A higher rate taxpayer contributing 5% of a 60,000 salary gets 40p back in tax relief for every 1 pound contributed, so the real cost is just 60p.’ },
{ t: ‘h2’, v: ‘Frequently Asked Questions’ },
{ t: ‘faq’, q: ‘What tax bracket am I in?’, a: ‘Under 50,270 is basic rate. Between 50,271 and 125,140 is higher rate. Above 125,140 is additional rate.’ },
{ t: ‘faq’, q: ‘Can I reduce my income tax bill?’, a: ‘Yes. Salary sacrifice pension contributions, ISA allowance, Gift Aid donations and claiming employment expenses can all reduce your tax.’ },
]
},
{
slug: ‘national-insurance-explained’,
title: ‘National Insurance Explained: What You Pay and Why (2026-27)’,
metaDesc: ‘National Insurance explained in plain English. Learn how Class 1 NI is calculated, what the 2026-27 rates are, and how it differs from income tax.’,
date: ‘6 April 2026’, readTime: ‘5 min read’, category: ‘Tax Basics’,
blocks: [
{ t: ‘h2’, v: ‘What Is National Insurance?’ },
{ t: ‘p’, v: ‘National Insurance is a tax on earnings paid by employees, employers, and the self-employed. As an employee, Class 1 contributions are deducted automatically from your pay through PAYE alongside income tax.’ },
{ t: ‘h2’, v: ‘National Insurance Rates 2026-27’ },
{ t: ‘table’, headers: [‘Earnings’, ‘NI Rate’], rows: [[‘Up to 12,570’,‘0%’],[‘12,571 to 50,270’,‘8%’],[‘Over 50,270’,‘2%’]] },
{ t: ‘p’, v: ‘The NI rate drops from 8% to 2% above 50,270 - unlike income tax which keeps rising. This is why higher earners have a lower effective NI rate than basic rate taxpayers.’ },
{ t: ‘h2’, v: ‘Employer National Insurance’ },
{ t: ‘p’, v: ‘Your employer also pays 13.8% NI on your salary above 5,000. For an employee earning 40,000 the employer pays an extra 4,830. This is why salary sacrifice schemes benefit both sides - reducing the salary reduces both sides' NI.’ },
{ t: ‘h2’, v: ‘Frequently Asked Questions’ },
{ t: ‘faq’, q: ‘Do I pay NI if I earn under 12,570?’, a: ‘No. Below the Primary Threshold of 12,570 you pay no employee NI contributions.’ },
{ t: ‘faq’, q: ‘Do I pay NI in retirement?’, a: ‘No. Once you reach State Pension age you stop paying employee NI even if you continue to work.’ },
]
},
{
slug: ‘pension-tax-relief-your-free-money’,
title: ‘Pension Tax Relief: How to Get Free Money From HMRC (2026-27)’,
metaDesc: ‘Pension tax relief explained simply. Learn how salary sacrifice reduces your income tax and NI and how to maximise your contributions.’,
date: ‘6 April 2026’, readTime: ‘6 min read’, category: ‘Tax Planning’,
blocks: [
{ t: ‘h2’, v: ‘What Is Pension Tax Relief?’ },
{ t: ‘p’, v: ‘HMRC contributes to your pension on your behalf, giving you back the income tax you would have paid on that money.’ },
{ t: ‘table’, headers: [‘Tax Rate’, ‘Your Cost Per 1 in Pension’], rows: [[‘Basic rate (20%)’,‘80p’],[‘Higher rate (40%)’,‘60p’],[‘Additional rate (45%)’,‘55p’]] },
{ t: ‘h2’, v: ‘Salary Sacrifice vs Personal Pension’ },
{ t: ‘p’, v: ‘Salary sacrifice reduces your gross salary before tax AND National Insurance are calculated - saving both. A personal pension only recovers income tax. For a basic rate taxpayer contributing 2,500 via salary sacrifice: income tax falls by 500 and NI falls by 200. You contribute 2,500 but only lose 1,800 in take-home pay.’ },
{ t: ‘h2’, v: ‘The 100,000 Trap’ },
{ t: ‘p’, v: ‘Between 100,000 and 125,140 your Personal Allowance reduces, creating an effective 60% tax rate. A 10,000 pension contribution that brings income below 100,000 can save over 2,000 in extra tax.’ },
{ t: ‘h2’, v: ‘Frequently Asked Questions’ },
{ t: ‘faq’, q: ‘Does my employer have to contribute?’, a: ‘Yes. Under auto-enrolment employers must contribute at least 3% of qualifying earnings.’ },
{ t: ‘faq’, q: ‘What is the annual allowance?’, a: ‘You can contribute up to 60,000 per year (including employer contributions) and receive tax relief.’ },
]
},
{
slug: ‘2026-27-tax-year-changes-uk’,
title: ‘2026-27 Tax Year: Everything That Changed in April 2026’,
metaDesc: ‘What changed in the 2026-27 UK tax year? Income tax thresholds, NI rates, minimum wage and student loan changes explained.’,
date: ‘6 April 2026’, readTime: ‘5 min read’, category: ‘Tax Year Updates’,
blocks: [
{ t: ‘h2’, v: ‘Income Tax Thresholds: Still Frozen’ },
{ t: ‘table’, headers: [‘Band’, ‘2025-26’, ‘2026-27’, ‘Change’], rows: [[‘Personal Allowance’,‘12,570’,‘12,570’,‘No change’],[‘Basic Rate ends’,‘50,270’,‘50,270’,‘No change’],[‘Higher Rate ends’,‘125,140’,‘125,140’,‘No change’]] },
{ t: ‘p’, v: ‘Thresholds remain frozen at 2022 levels. As wages rise, more people are pushed into higher brackets without real pay increases. An estimated 4 million extra people have been pulled into the higher rate band since the freeze began.’ },
{ t: ‘h2’, v: ‘Minimum Wage Increases’ },
{ t: ‘table’, headers: [‘Category’, ‘2025-26’, ‘2026-27’, ‘Increase’], rows: [[‘National Living Wage (21+)’,‘11.44/hr’,‘12.21/hr’,’+6.7%’],[‘Age 18-20’,‘8.60/hr’,‘10.00/hr’,’+16.3%’],[‘Under 18 and Apprentices’,‘6.40/hr’,‘7.55/hr’,’+18.0%’]] },
{ t: ‘h2’, v: ‘Student Loan Thresholds: Frozen’ },
{ t: ‘table’, headers: [‘Plan’, ‘Threshold’], rows: [[‘Plan 1’,‘24,990’],[‘Plan 2’,‘27,295’],[‘Plan 4 (Scotland)’,‘31,395’],[‘Plan 5’,‘25,000’]] },
{ t: ‘h2’, v: ‘State Pension’ },
{ t: ‘p’, v: ‘The new State Pension increased by 4.1% under the triple lock to 230.25 per week.’ },
{ t: ‘h2’, v: ‘Frequently Asked Questions’ },
{ t: ‘faq’, q: ‘When does the 2026-27 tax year end?’, a: ‘The 2026-27 tax year runs from 6 April 2026 to 5 April 2027.’ },
{ t: ‘faq’, q: ‘Will thresholds be unfrozen?’, a: ‘The freeze is scheduled to end in 2028 when thresholds are expected to rise with inflation.’ },
]
}
];

// ── SHARED UI COMPONENTS ──────────────────────────────────────────────────────

function Logo({ light, size = ‘md’ }) {
const box = size === ‘sm’ ? 26 : 32, font = size === ‘sm’ ? 12 : 14, text = size === ‘sm’ ? 15 : 18;
return (
<div style={{ display: ‘flex’, alignItems: ‘center’, gap: 9 }}>
<div style={{ width: box, height: box, background: ‘linear-gradient(135deg,#0D9488,#14B8A6)’, borderRadius: 8, display: ‘flex’, alignItems: ‘center’, justifyContent: ‘center’, flexShrink: 0, boxShadow: ‘0 2px 8px rgba(13,148,136,0.4)’ }}>
<span style={{ color: ‘white’, fontWeight: 700, fontSize: font, fontFamily: ‘JetBrains Mono’ }}>Tx</span>
</div>
<span style={{ color: light ? ‘white’ : C.navy, fontFamily: ‘DM Serif Display’, fontSize: text, letterSpacing: ‘-0.02em’ }}>
Taxd<span style={{ color: C.teal }}>Calc</span>
</span>
</div>
);
}

function NavBar({ page, nav }) {
const [open, setOpen] = useState(false);
const mob = useWidth() < 640;
const items = [
{ id: ‘home’, label: ‘Salary Calculator’ },
{ id: ‘contractor’, label: ‘IR35’ },
{ id: ‘tools’, label: ‘All Tools’ },
{ id: ‘blog’, label: ‘Tax Guides’ }
];
const active = page === ‘home’ ? ‘home’ : page === ‘contractor’ ? ‘contractor’ : page === ‘blog’ || page.startsWith(‘article-’) ? ‘blog’ : ‘tools’;
return (
<nav style={{ background: C.navy, position: ‘sticky’, top: 0, zIndex: 100, boxShadow: ‘0 2px 16px rgba(0,0,0,0.25)’ }}>
<div style={{ maxWidth: 1100, margin: ‘0 auto’, padding: ‘0 20px’, height: 58, display: ‘flex’, alignItems: ‘center’, justifyContent: ‘space-between’ }}>
<button onClick={() => { nav(‘home’); setOpen(false); }} style={{ background: ‘none’, border: ‘none’ }}><Logo light /></button>
{mob ? (
<button onClick={() => setOpen(!open)} style={{ background: ‘rgba(255,255,255,0.08)’, border: ‘1px solid rgba(255,255,255,0.12)’, borderRadius: 7, padding: ‘8px 10px’, display: ‘flex’, flexDirection: ‘column’, gap: 4 }}>
{[0,1,2].map(i => <span key={i} style={{ display: ‘block’, width: 18, height: 2, background: ‘white’, borderRadius: 1, transition: ‘all 0.2s’, transform: open && i===0 ? ‘rotate(45deg) translate(4px,4px)’ : open && i===2 ? ‘rotate(-45deg) translate(4px,-4px)’ : ‘none’, opacity: open && i===1 ? 0 : 1 }} />)}
</button>
) : (
<div style={{ display: ‘flex’, gap: 2, alignItems: ‘center’ }}>
{items.map(n => (
<button key={n.id} onClick={() => nav(n.id)} style={{ padding: ‘7px 12px’, borderRadius: 6, border: ‘none’, background: active === n.id ? ‘rgba(13,148,136,0.2)’ : ‘transparent’, color: active === n.id ? C.tealLight : ‘rgba(255,255,255,0.6)’, fontSize: 13, fontFamily: ‘Source Serif 4’, fontWeight: active === n.id ? 600 : 400 }}>
{n.label}
</button>
))}
<span style={{ fontSize: 11, color: C.tealLight, fontFamily: ‘JetBrains Mono’, background: ‘rgba(13,148,136,0.15)’, padding: ‘3px 9px’, borderRadius: 4, border: ‘1px solid rgba(20,184,166,0.3)’, marginLeft: 8 }}>2026-27</span>
</div>
)}
</div>
{mob && open && (
<div style={{ background: C.navyLight, borderTop: ‘1px solid rgba(255,255,255,0.08)’, padding: ‘8px 0 14px’ }}>
{items.map(n => (
<button key={n.id} onClick={() => { nav(n.id); setOpen(false); }} style={{ display: ‘block’, width: ‘100%’, padding: ‘13px 24px’, background: active === n.id ? ‘rgba(13,148,136,0.15)’ : ‘transparent’, border: ‘none’, color: active === n.id ? C.tealLight : ‘rgba(255,255,255,0.65)’, fontSize: 15, fontFamily: ‘Source Serif 4’, textAlign: ‘left’, fontWeight: active === n.id ? 600 : 400 }}>
{n.label}
</button>
))}
</div>
)}
</nav>
);
}

function PageHero({ tag, title, subtitle, mob }) {
return (
<div style={{ background: `linear-gradient(135deg,${C.navy},${C.navyMid})`, padding: mob ? ‘38px 20px 68px’ : ‘46px 24px 74px’, textAlign: ‘center’, position: ‘relative’, overflow: ‘hidden’ }}>
<div style={{ position: ‘absolute’, top: -60, right: -40, width: 240, height: 240, borderRadius: ‘50%’, background: ‘rgba(13,148,136,0.08)’, pointerEvents: ‘none’ }} />
<div style={{ display: ‘inline-block’, background: ‘rgba(13,148,136,0.15)’, border: ‘1px solid rgba(20,184,166,0.3)’, borderRadius: 20, padding: ‘4px 13px’, fontSize: 11, color: C.tealLight, marginBottom: 14, fontFamily: ‘JetBrains Mono’ }}>{tag}</div>
<h1 style={{ fontFamily: ‘DM Serif Display’, fontSize: mob ? 26 : 42, color: ‘white’, marginBottom: 10, letterSpacing: ‘-0.02em’, lineHeight: 1.15 }} dangerouslySetInnerHTML={{ __html: title }} />
{subtitle && <p style={{ color: ‘rgba(255,255,255,0.5)’, fontSize: mob ? 13 : 15, maxWidth: 480, margin: ‘0 auto’ }}>{subtitle}</p>}
</div>
);
}

function Card({ children, style = {} }) {
return <div style={{ background: ‘white’, borderRadius: 14, padding: 24, boxShadow: C.shadow, border: `1px solid ${C.border}`, …style }}>{children}</div>;
}

function ResultRow({ label, value, sub, color, big }) {
return (
<div style={{ padding: ‘12px 0’, borderBottom: `1px solid ${C.border}`, display: ‘flex’, justifyContent: ‘space-between’, alignItems: ‘center’ }}>
<div>
<div style={{ fontSize: big ? 14 : 13, fontWeight: big ? 700 : 400, color: big ? C.text : C.textMid }}>{label}</div>
{sub && <div style={{ fontSize: 11, color: C.slateLight, marginTop: 2 }}>{sub}</div>}
</div>
<div style={{ fontFamily: ‘JetBrains Mono’, fontSize: big ? 18 : 14, color: color || C.navy, fontWeight: big ? 700 : 500, textAlign: ‘right’ }}>
{typeof value === ‘number’ ? fmtP(value) : value}
</div>
</div>
);
}

function InputField({ label, value, onChange, prefix, hint, min = 0, max = 500000 }) {
return (
<div style={{ marginBottom: 18 }}>
<div style={{ display: ‘flex’, justifyContent: ‘space-between’, marginBottom: 7 }}>
<label style={{ fontSize: 13, fontWeight: 600, color: C.navyLight }}>{label}</label>
{hint && <span style={{ fontSize: 11, color: C.slate }}>{hint}</span>}
</div>
<div style={{ position: ‘relative’ }}>
{prefix && <span style={{ position: ‘absolute’, left: 14, top: ‘50%’, transform: ‘translateY(-50%)’, color: C.slate, fontSize: 15, fontWeight: 600, fontFamily: ‘JetBrains Mono’, pointerEvents: ‘none’ }}>{prefix}</span>}
<input type=“number” value={value} min={min} max={max} onChange={e => onChange(Number(e.target.value))}
style={{ width: ‘100%’, padding: `12px 14px 12px ${prefix ? '28px' : '14px'}`, border: `1.5px solid ${C.borderDark}`, borderRadius: 8, fontSize: 16, fontFamily: ‘JetBrains Mono’, fontWeight: 500, color: C.navy, background: ‘white’, outline: ‘none’ }}
onFocus={e => e.target.style.borderColor = C.teal}
onBlur={e => e.target.style.borderColor = C.borderDark} />
</div>
</div>
);
}

function SliderField({ label, value, onChange, min, max, step, format }) {
return (
<div style={{ marginBottom: 20 }}>
<div style={{ display: ‘flex’, justifyContent: ‘space-between’, marginBottom: 10 }}>
<label style={{ fontSize: 13, fontWeight: 600, color: C.navyLight }}>{label}</label>
<span style={{ fontFamily: ‘JetBrains Mono’, fontSize: 14, color: C.teal, fontWeight: 600 }}>{format(value)}</span>
</div>
<input type=“range” min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} />
</div>
);
}

function SelectField({ label, value, onChange, options }) {
return (
<div style={{ marginBottom: 18 }}>
<label style={{ display: ‘block’, fontSize: 13, fontWeight: 600, color: C.navyLight, marginBottom: 7 }}>{label}</label>
<select value={value} onChange={e => onChange(e.target.value)}
style={{ width: ‘100%’, padding: ‘12px 40px 12px 14px’, border: `1.5px solid ${C.borderDark}`, borderRadius: 8, fontSize: 14, fontFamily: ‘Source Serif 4’, color: C.navy }}
onFocus={e => e.target.style.borderColor = C.teal}
onBlur={e => e.target.style.borderColor = C.borderDark}>
{options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
</select>
</div>
);
}

function BackBtn({ nav, to = ‘tools’, label = ‘Back to All Tools’ }) {
return (
<button onClick={() => nav(to)} style={{ display: ‘inline-flex’, alignItems: ‘center’, gap: 6, background: ‘white’, border: `1px solid ${C.border}`, color: C.navy, padding: ‘9px 16px’, borderRadius: 8, fontSize: 13, fontFamily: ‘Source Serif 4’, fontWeight: 600, marginBottom: 20 }}>
<span style={{ fontSize: 16 }}>←</span> {label}
</button>
);
}

function TakeHomeHero({ value, monthly, pct, mob }) {
return (
<div style={{ background: `linear-gradient(135deg,${C.navy},${C.navyMid})`, borderRadius: 14, padding: mob ? ‘20px 18px’ : 26, marginBottom: 14, position: ‘relative’, overflow: ‘hidden’ }}>
<div style={{ position: ‘absolute’, top: -20, right: -20, width: 120, height: 120, borderRadius: ‘50%’, background: ‘rgba(13,148,136,0.12)’, pointerEvents: ‘none’ }} />
<div style={{ fontSize: 10, color: ‘rgba(255,255,255,0.4)’, letterSpacing: ‘0.12em’, textTransform: ‘uppercase’, fontFamily: ‘JetBrains Mono’, marginBottom: 6 }}>Annual Take-Home</div>
<div style={{ fontFamily: ‘DM Serif Display’, fontSize: mob ? 36 : 50, color: ‘white’, lineHeight: 1 }}><AnimNum value={value} /></div>
<div style={{ fontSize: 13, color: ‘rgba(255,255,255,0.45)’, fontFamily: ‘JetBrains Mono’, marginTop: 5 }}><AnimNum value={monthly} format={fmtPD} /> per month</div>
{pct !== undefined && (
<div style={{ marginTop: 14, display: ‘flex’, alignItems: ‘center’, gap: 10 }}>
<div style={{ flex: 1, height: 4, background: ‘rgba(255,255,255,0.08)’, borderRadius: 2, overflow: ‘hidden’ }}>
<div className=“bfill” style={{ width: pct + ‘%’, height: ‘100%’, background: `linear-gradient(90deg,${C.teal},${C.tealLight})`, borderRadius: 2 }} />
</div>
<span style={{ fontSize: 12, color: C.tealLight, fontFamily: ‘JetBrains Mono’, fontWeight: 600, flexShrink: 0 }}>{pct.toFixed(1)}% kept</span>
</div>
)}
</div>
);
}

// ── HOME PAGE ─────────────────────────────────────────────────────────────────
function HomePage({ nav }) {
const mob = useWidth() < 768;
const [salary, setSalary] = useState(45000);
const [pension, setPension] = useState(5);
const [loan, setLoan] = useState(‘none’);
const [period, setPeriod] = useState(‘annual’);
const [tab, setTab] = useState(‘breakdown’);
const r = calculate(salary, pension, loan);
const pm = { annual: { g: r.gross, th: r.takeHome }, monthly: { g: r.monthly.gross, th: r.monthly.takeHome }, weekly: { g: r.weekly.gross, th: r.weekly.takeHome }, daily: { g: r.daily.gross, th: r.daily.takeHome } };
const items = [{ label: ‘Income Tax’, value: r.incomeTax, color: C.red }, { label: ‘Nat. Insurance’, value: r.ni, color: ‘#F59E0B’ }, { label: ‘Student Loan’, value: r.studentLoan, color: ‘#6366F1’ }, { label: ‘Pension’, value: r.pension, color: ‘#14B8A6’ }];

return (
<div>
<div style={{ background: `linear-gradient(135deg,${C.navy},${C.navyMid})`, padding: mob ? ‘38px 20px 72px’ : ‘50px 24px 82px’, position: ‘relative’, overflow: ‘hidden’ }}>
<div style={{ position: ‘absolute’, top: -60, right: -40, width: 260, height: 260, borderRadius: ‘50%’, background: ‘rgba(13,148,136,0.08)’, pointerEvents: ‘none’ }} />
<div style={{ maxWidth: 640, margin: ‘0 auto’, textAlign: ‘center’, position: ‘relative’ }}>
<div style={{ display: ‘inline-flex’, alignItems: ‘center’, gap: 7, background: ‘rgba(13,148,136,0.15)’, border: ‘1px solid rgba(20,184,166,0.3)’, borderRadius: 20, padding: ‘5px 14px’, fontSize: 11, color: C.tealLight, marginBottom: 20, fontFamily: ‘JetBrains Mono’ }}>
<span style={{ width: 6, height: 6, borderRadius: ‘50%’, background: C.tealLight, display: ‘inline-block’ }} /> Updated for 2026-27 tax year
</div>
<h1 style={{ fontFamily: ‘DM Serif Display’, fontSize: mob ? 30 : ‘clamp(30px,5vw,52px)’, color: ‘white’, lineHeight: 1.1, marginBottom: 14 }}>
UK Take-Home Pay<br /><em style={{ color: C.tealLight }}>Calculator</em>
</h1>
<p style={{ color: ‘rgba(255,255,255,0.55)’, fontSize: mob ? 14 : 16, lineHeight: 1.65, maxWidth: 420, margin: ‘0 auto’ }}>Instantly see your net salary after income tax, NI, student loan and pension.</p>
</div>
</div>

```
  <div style={{ maxWidth: 1100, margin: mob ? '-32px 0 0' : '-44px auto 0', padding: mob ? '0 16px' : '0 24px' }}>
    <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : 'minmax(300px,400px) 1fr', gap: 20, alignItems: 'start' }}>
      <Card className="fu">
        <h2 style={{ fontFamily: 'DM Serif Display', fontSize: 19, color: C.navy, marginBottom: 22 }}>Your Details</h2>
        <InputField label="Annual Salary" value={salary} onChange={setSalary} prefix={P} hint={`approx ${fmtP(salary/12)}/mo`} />
        <SliderField label="Pension Contribution" value={pension} onChange={setPension} min={0} max={30} step={0.5} format={v => v + '%'} />
        <SelectField label="Student Loan Plan" value={loan} onChange={setLoan} options={[
          { value: 'none', label: 'No student loan' },
          { value: 'plan1', label: 'Plan 1 - pre Sept 2012 (24,990)' },
          { value: 'plan2', label: 'Plan 2 - Sept 2012 to Jul 2023 (27,295)' },
          { value: 'plan4', label: 'Plan 4 - Scotland (31,395)' },
          { value: 'plan5', label: 'Plan 5 - Aug 2023 onwards (25,000)' }
        ]} />
        <div style={{ padding: '13px 14px', background: C.tealBg, border: `1px solid ${C.tealBorder}`, borderRadius: 8 }}>
          <div style={{ fontSize: 11, color: C.teal, fontWeight: 700, marginBottom: 6 }}>2026-27 Tax Bands</div>
          {[['Up to 12,570','0%'],['12,571 to 50,270','20%'],['50,271 to 125,140','40%'],['Over 125,140','45%']].map(([range, rate]) => (
            <div key={range} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#0f766e', fontFamily: 'JetBrains Mono', padding: '3px 0', borderBottom: '1px solid rgba(13,148,136,0.15)' }}>
              <span>{range}</span><span style={{ fontWeight: 600 }}>{rate}</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="fu" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <TakeHomeHero value={r.takeHome} monthly={r.monthly.takeHome} pct={(r.takeHome/r.gross)*100} mob={mob} />

        <div style={{ display: 'flex', gap: 4, background: 'white', padding: 5, borderRadius: 10, border: `1px solid ${C.border}` }}>
          {['annual','monthly','weekly','daily'].map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{ flex: 1, padding: '9px 4px', borderRadius: 7, border: 'none', background: period === p ? C.teal : 'transparent', color: period === p ? 'white' : C.slate, fontSize: mob ? 11 : 12, fontFamily: 'Source Serif 4', fontWeight: period === p ? 600 : 400, textTransform: 'capitalize' }}>{p}</button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[['Gross', pm[period].g, C.navy],['Net', pm[period].th, C.green]].map(([l,v,cl]) => (
            <Card key={l} style={{ padding: '14px 16px' }}>
              <div style={{ fontSize: 10, color: C.slate, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 5, fontFamily: 'JetBrains Mono' }}>{l} Pay</div>
              <div style={{ fontFamily: 'DM Serif Display', fontSize: mob ? 20 : 26, color: cl, lineHeight: 1 }}><AnimNum value={v} /></div>
            </Card>
          ))}
        </div>

        <Card style={{ padding: mob ? 16 : '20px 22px' }}>
          <div style={{ display: 'flex', gap: 2, marginBottom: 16, borderBottom: `1px solid ${C.border}` }}>
            {['breakdown','table'].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ padding: '7px 14px', border: 'none', background: 'transparent', fontSize: 13, fontFamily: 'Source Serif 4', color: tab === t ? C.navy : C.slate, fontWeight: tab === t ? 700 : 400, borderBottom: tab === t ? `2px solid ${C.teal}` : '2px solid transparent', marginBottom: -1, textTransform: 'capitalize' }}>{t}</button>
            ))}
          </div>
          {tab === 'breakdown' && (
            <div>
              <div style={{ height: 10, borderRadius: 5, overflow: 'hidden', display: 'flex', background: C.border, marginBottom: 18 }}>
                {items.filter(it => it.value > 0).map(it => <div key={it.label} className="bfill" style={{ width: `${(it.value/r.gross)*100}%`, background: it.color, height: '100%' }} />)}
                <div className="bfill" style={{ flex: 1, background: C.teal }} />
              </div>
              {[...items.filter(it => it.value > 0).map(it => ({...it, neg: true})), { label: 'Take-home', value: r.takeHome, color: C.teal }].map(it => (
                <div key={it.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: it.neg ? `1px solid ${C.border}` : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 9, height: 9, borderRadius: 2, background: it.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: it.neg ? C.textMid : C.text, fontWeight: it.neg ? 400 : 700 }}>{it.label}</span>
                  </div>
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 13, color: it.neg ? C.red : C.teal, fontWeight: it.neg ? 400 : 700, minWidth: 60, textAlign: 'right' }}>{(it.neg ? '-' : '+') + fmtP(it.value)}</span>
                </div>
              ))}
            </div>
          )}
          {tab === 'table' && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, minWidth: 300 }}>
                <thead><tr>{['','Annual','Monthly','Weekly'].map(h => <th key={h} style={{ textAlign: h ? 'right' : 'left', padding: '6px', color: C.slate, fontSize: 10, textTransform: 'uppercase', borderBottom: `1px solid ${C.border}` }}>{h}</th>)}</tr></thead>
                <tbody>
                  {[
                    { l: 'Gross', a: r.gross, m: r.monthly.gross, w: r.weekly.gross },
                    { l: 'Income Tax', a: r.incomeTax, m: r.incomeTax/12, w: r.incomeTax/52, neg: true },
                    { l: 'Nat. Insurance', a: r.ni, m: r.ni/12, w: r.ni/52, neg: true },
                    r.studentLoan > 0 ? { l: 'Student Loan', a: r.studentLoan, m: r.studentLoan/12, w: r.studentLoan/52, neg: true } : null,
                    r.pension > 0 ? { l: 'Pension', a: r.pension, m: r.pension/12, w: r.pension/52, neg: true } : null,
                    { l: 'Take-Home', a: r.takeHome, m: r.monthly.takeHome, w: r.weekly.takeHome, bold: true, green: true }
                  ].filter(Boolean).map((row, i) => (
                    <tr key={row.l} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)', borderBottom: `1px solid ${C.border}` }}>
                      <td style={{ padding: '9px 6px', fontWeight: row.bold ? 700 : 400, color: row.green ? C.teal : C.text, fontSize: 12 }}>{row.l}</td>
                      {[row.a, row.m, row.w].map((v, j) => <td key={j} style={{ padding: '9px 6px', textAlign: 'right', fontFamily: 'JetBrains Mono', fontSize: 11, color: row.neg ? C.red : row.green ? C.teal : C.text, fontWeight: row.bold ? 700 : 400 }}>{row.neg ? '-' + fmtP(v) : fmtPD(v)}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  </div>

  {/* CALCULATORS GRID */}
  <div style={{ background: 'white', borderTop: `1px solid ${C.border}`, padding: mob ? '44px 16px' : '56px 24px', marginTop: 48 }}>
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <h2 style={{ fontFamily: 'DM Serif Display', fontSize: mob ? 22 : 28, color: C.navy, marginBottom: 6 }}>More Calculators</h2>
      <p style={{ color: C.slate, marginBottom: 24, fontSize: 14 }}>Every scenario, every type of worker.</p>
      <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr 1fr' : 'repeat(auto-fill,minmax(190px,1fr))', gap: 12 }}>
        {[
          { icon: '🏗️', label: 'IR35 Contractor', sub: 'Inside vs outside', tag: 'Popular', page: 'contractor' },
          { icon: '⏰', label: 'Hourly Rate', sub: 'Annual take-home', page: 'hourly' },
          { icon: '👶', label: 'Maternity Pay', sub: 'SMP calculator', page: 'maternity' },
          { icon: '🏥', label: 'NHS Pay Bands', sub: 'Bands 1 to 9', page: 'nhs' },
          { icon: '🎓', label: 'Student Loan', sub: 'Plans 1, 2, 4 and 5', page: 'home' },
          { icon: '💼', label: 'Bonus Calculator', sub: 'Net after tax', page: 'bonus' },
          { icon: '🏦', label: 'Salary Sacrifice', sub: 'Pension impact', page: 'sacrifice' },
          { icon: '📊', label: 'Job Comparison', sub: 'Compare 2 offers', page: 'comparison' }
        ].map(c => (
          <button key={c.label} onClick={() => nav(c.page)} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: '15px 14px', textAlign: 'left', cursor: 'pointer' }}>
            <div style={{ fontSize: mob ? 20 : 22, marginBottom: 7 }}>{c.icon}</div>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 4 }}>
              <div style={{ fontSize: mob ? 12 : 13, fontWeight: 700, color: C.navy, lineHeight: 1.3 }}>{c.label}</div>
              {c.tag && <span style={{ fontSize: 9, background: C.tealBg, color: C.teal, border: `1px solid ${C.tealBorder}`, borderRadius: 3, padding: '2px 5px', flexShrink: 0, fontWeight: 700 }}>{c.tag}</span>}
            </div>
            <div style={{ fontSize: 11, color: C.slate, marginTop: 2 }}>{c.sub}</div>
          </button>
        ))}
      </div>
    </div>
  </div>

  {/* COUNTRIES */}
  <div style={{ background: C.tealBg, borderTop: `1px solid ${C.tealBorder}`, borderBottom: `1px solid ${C.tealBorder}`, padding: mob ? '28px 16px' : '32px 24px' }}>
    <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
      <div>
        <div style={{ fontFamily: 'DM Serif Display', fontSize: mob ? 18 : 22, color: C.navy, marginBottom: 4 }}>Available in Multiple Countries</div>
        <div style={{ fontSize: 13, color: C.slate }}>Same accuracy. Local tax rules.</div>
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {[{flag:'🇬🇧',label:'UK',live:true},{flag:'🇨🇦',label:'Canada',live:false},{flag:'🇦🇺',label:'Australia',live:false},{flag:'🇳🇱',label:'Netherlands',live:false},{flag:'🇸🇪',label:'Sweden',live:false}].map(c => (
          <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'white', border: `1px solid ${c.live ? C.tealBorder : C.border}`, borderRadius: 8, padding: '8px 12px' }}>
            <span style={{ fontSize: 16 }}>{c.flag}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>{c.label}</span>
            <span style={{ fontSize: 9, background: c.live ? C.tealBg : '#F1F5F9', color: c.live ? C.teal : C.slate, borderRadius: 3, padding: '1px 5px', fontWeight: 700, fontFamily: 'JetBrains Mono', border: c.live ? `1px solid ${C.tealBorder}` : 'none' }}>{c.live ? 'LIVE' : 'SOON'}</span>
          </div>
        ))}
      </div>
    </div>
  </div>

  {/* GUIDES */}
  <div style={{ background: C.navy, padding: mob ? '40px 16px' : '48px 24px' }}>
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <h2 style={{ fontFamily: 'DM Serif Display', fontSize: mob ? 20 : 26, color: 'white', marginBottom: 6 }}>Understanding Your Tax</h2>
      <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 22, fontSize: 13 }}>Plain-English guides to your payslip</p>
      <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : 'repeat(auto-fill,minmax(230px,1fr))', gap: 12 }}>
        {ARTICLES.map(a => (
          <button key={a.slug} onClick={() => nav('article-' + a.slug)} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '16px 17px', textAlign: 'left', cursor: 'pointer' }}>
            <div style={{ fontSize: 11, color: C.tealLight, marginBottom: 4, fontFamily: 'JetBrains Mono' }}>{a.category}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.tealLight, marginBottom: 6, lineHeight: 1.35 }}>{a.title}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>{a.metaDesc}</div>
          </button>
        ))}
      </div>
    </div>
  </div>

  <footer style={{ background: '#070D1C', padding: '26px 20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
    <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: mob ? 'column' : 'row', justifyContent: 'space-between', gap: 14, alignItems: mob ? 'flex-start' : 'center' }}>
      <Logo light size="sm" />
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', fontFamily: 'JetBrains Mono' }}>Updated 6 April 2026 - 2026-27 tax year</div>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.18)', maxWidth: 300, lineHeight: 1.6 }}>For guidance only. Always consult HMRC or a qualified adviser.</div>
    </div>
  </footer>
</div>
```

);
}

// ── CONTRACTOR / IR35 PAGE ────────────────────────────────────────────────────
function ContractorPage({ nav }) {
const mob = useWidth() < 640;
const [dayRate, setDayRate] = useState(500);
const [days, setDays] = useState(220);
const annual = dayRate * days;
const rIn = calculate(annual, 5, ‘none’);
const salary = 12570;
const corpTax = Math.max(0, (annual - salary - 9100) * 0.19);
const divs = Math.max(0, annual - salary - corpTax - 9100);
const divTax = Math.max(0, divs - 37700) * 0.0875;
const limitedTH = salary + divs - divTax;
const saving = limitedTH - rIn.takeHome;

return (
<div>
<PageHero tag="IR35 and Contractor Tools" title="Contractor Take-Home<br /><em style='color:#14B8A6'>Calculator</em>" subtitle="Compare PAYE inside IR35 vs. Limited Company outside IR35." mob={mob} />
<div style={{ maxWidth: 860, margin: mob ? ‘-28px 0 0’ : ‘-36px auto 0’, padding: mob ? ‘0 16px 48px’ : ‘0 24px 60px’ }}>
<BackBtn nav={nav} />
<Card style={{ marginBottom: 16 }}>
<h2 style={{ fontFamily: ‘DM Serif Display’, fontSize: 19, color: C.navy, marginBottom: 20 }}>Your Contract Details</h2>
<div style={{ display: ‘grid’, gridTemplateColumns: mob ? ‘1fr’ : ‘1fr 1fr’, gap: 16 }}>
<InputField label="Day Rate" value={dayRate} onChange={setDayRate} prefix={P} min={0} max={5000} hint="Exc. VAT" />
<InputField label="Days per Year" value={days} onChange={setDays} min={0} max={260} hint="Typical: 220" />
</div>
<div style={{ padding: ‘10px 14px’, background: C.tealBg, borderRadius: 7, border: `1px solid ${C.tealBorder}`, display: ‘flex’, justifyContent: ‘space-between’ }}>
<span style={{ fontSize: 13, color: C.teal, fontWeight: 600 }}>Annual contract value</span>
<span style={{ fontFamily: ‘JetBrains Mono’, fontSize: 14, fontWeight: 700, color: C.navy }}>{fmtP(annual)}</span>
</div>
</Card>
<div style={{ display: ‘grid’, gridTemplateColumns: mob ? ‘1fr’ : ‘1fr 1fr’, gap: 14, marginBottom: 14 }}>
{[
{ label: ‘Inside IR35 (PAYE)’, value: rIn.takeHome, sub: ‘All income taxed as employment.’, color: C.red, bg: C.redBg, border: C.redBorder },
{ label: ‘Outside IR35 (Ltd Co.)’, value: limitedTH, sub: ‘Salary plus dividends structure.’, color: C.teal, bg: C.tealBg, border: C.tealBorder }
].map(s => (
<div key={s.label} style={{ background: s.bg, border: `1.5px solid ${s.border}`, borderRadius: 12, padding: mob ? ‘20px 18px’ : 24 }}>
<div style={{ fontSize: 11, color: C.slate, fontWeight: 700, letterSpacing: ‘0.06em’, textTransform: ‘uppercase’, marginBottom: 8 }}>{s.label}</div>
<div style={{ fontFamily: ‘DM Serif Display’, fontSize: mob ? 32 : 44, color: s.color }}><AnimNum value={s.value} /></div>
<div style={{ fontSize: 12, color: C.slate, marginTop: 6, fontFamily: ‘JetBrains Mono’ }}>{fmtPD(s.value/12)}/month</div>
<div style={{ fontSize: 12, color: C.textMid, marginTop: 8 }}>{s.sub}</div>
</div>
))}
</div>
{saving !== 0 && (
<div style={{ background: saving > 0 ? C.tealBg : C.redBg, border: `1.5px solid ${saving > 0 ? C.tealBorder : C.redBorder}`, borderRadius: 10, padding: ‘15px 18px’, marginBottom: 14 }}>
<span style={{ fontSize: 14, color: C.text }}>Outside IR35 saves you <strong style={{ color: saving > 0 ? C.teal : C.red }}>{fmtP(Math.abs(saving))}/year</strong> ({fmtP(Math.abs(saving/12))}/month) more in take-home pay</span>
</div>
)}
<div style={{ background: C.amberBg, border: `1px solid ${C.amberBorder}`, borderRadius: 10, padding: ‘14px 18px’ }}>
<div style={{ fontSize: 12, fontWeight: 700, color: ‘#92400E’, marginBottom: 4 }}>Disclaimer</div>
<div style={{ fontSize: 12, color: ‘#78350F’, lineHeight: 1.6 }}>IR35 status is determined by your actual working practices. This is indicative only. Always seek advice from a qualified IR35 specialist.</div>
</div>
</div>
</div>
);
}

// ── NHS PAY BANDS PAGE ────────────────────────────────────────────────────────
function NHSPage({ nav }) {
const mob = useWidth() < 640;
const [selectedBand, setSelectedBand] = useState(‘Band 5’);
const [spinePoint, setSpinePoint] = useState(0);
const [pension, setPension] = useState(9.8);
const band = NHS_BANDS.find(b => b.band === selectedBand) || NHS_BANDS[4];
const salary = band.points[Math.min(spinePoint, band.points.length - 1)];
const r = calculate(salary, pension, ‘none’);

const bandOptions = NHS_BANDS.map(b => ({ value: b.band, label: b.band + ’ (’ + P + b.min.toLocaleString() + ’ - ’ + P + b.max.toLocaleString() + ‘)’ }));

return (
<div>
<PageHero tag="NHS Pay Bands 2026-27" title="NHS Pay Bands<br /><em style='color:#14B8A6'>Take-Home Calculator</em>" subtitle="Agenda for Change pay scales with actual take-home pay after tax and NI." mob={mob} />
<div style={{ maxWidth: 900, margin: mob ? ‘-28px 0 0’ : ‘-36px auto 0’, padding: mob ? ‘0 16px 48px’ : ‘0 24px 60px’ }}>
<BackBtn nav={nav} />
<div style={{ display: ‘grid’, gridTemplateColumns: mob ? ‘1fr’ : ‘1fr 1fr’, gap: 20, alignItems: ‘start’ }}>
<Card>
<h2 style={{ fontFamily: ‘DM Serif Display’, fontSize: 19, color: C.navy, marginBottom: 20 }}>Your Pay Band</h2>
<SelectField label=“NHS Pay Band” value={selectedBand} onChange={v => { setSelectedBand(v); setSpinePoint(0); }} options={bandOptions} />
<div style={{ marginBottom: 18 }}>
<div style={{ display: ‘flex’, justifyContent: ‘space-between’, marginBottom: 10 }}>
<label style={{ fontSize: 13, fontWeight: 600, color: C.navyLight }}>Spine Point</label>
<span style={{ fontFamily: ‘JetBrains Mono’, fontSize: 14, color: C.teal, fontWeight: 600 }}>{fmtP(salary)}/yr</span>
</div>
<input type=“range” min={0} max={band.points.length - 1} step={1} value={spinePoint} onChange={e => setSpinePoint(Number(e.target.value))} />
<div style={{ display: ‘flex’, justifyContent: ‘space-between’, marginTop: 4 }}>
<span style={{ fontSize: 11, color: C.slateLight }}>Point 1: {fmtP(band.points[0])}</span>
<span style={{ fontSize: 11, color: C.slateLight }}>Top: {fmtP(band.points[band.points.length-1])}</span>
</div>
</div>
<SliderField label=“NHS Pension Contribution” value={pension} onChange={setPension} min={5} max={14.5} step={0.5} format={v => v + ‘%’} />
<div style={{ padding: ‘10px 14px’, background: C.tealBg, border: `1px solid ${C.tealBorder}`, borderRadius: 8, fontSize: 12, color: ‘#0f766e’, lineHeight: 1.6 }}>
NHS pension rates for 2026-27 range from 5% to 14.5% depending on your pensionable pay tier.
</div>
</Card>

```
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <TakeHomeHero value={r.takeHome} monthly={r.monthly.takeHome} pct={(r.takeHome/r.gross)*100} mob={mob} />
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.navy, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>Pay Breakdown</div>
          <ResultRow label="Gross salary" value={r.gross} />
          <ResultRow label="Income Tax" value={-r.incomeTax} color={C.red} />
          <ResultRow label="National Insurance" value={-r.ni} color={C.red} />
          <ResultRow label="NHS Pension" value={-r.pension} color={C.red} sub={pension + '% contribution'} />
          <ResultRow label="Annual take-home" value={r.takeHome} color={C.teal} big />
          <ResultRow label="Monthly take-home" value={r.monthly.takeHome} color={C.teal} />
        </Card>
        <Card style={{ background: C.tealBg, border: `1px solid ${C.tealBorder}` }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.teal, marginBottom: 8 }}>About NHS Pay Bands</div>
          <div style={{ fontSize: 12, color: C.textMid, lineHeight: 1.7 }}>
            Figures are based on indicative 2026-27 Agenda for Change pay scales. Actual pay may vary by trust, location, and any local pay supplements. Always check your payslip and NHS ESR system for your exact salary.
          </div>
        </Card>
      </div>
    </div>

    <Card style={{ marginTop: 20 }}>
      <h3 style={{ fontFamily: 'DM Serif Display', fontSize: 18, color: C.navy, marginBottom: 16 }}>All NHS Pay Bands 2026-27</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>{['Band', 'Min Salary', 'Max Salary', 'Min Take-Home/yr', 'Max Take-Home/yr'].map(h => <th key={h} style={{ textAlign: h === 'Band' ? 'left' : 'right', padding: '10px 12px', background: C.tealBg, color: C.teal, borderBottom: `2px solid ${C.tealBorder}`, fontSize: 11, fontWeight: 700, letterSpacing: '0.05em' }}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {NHS_BANDS.map((b, i) => {
              const rMin = calculate(b.min, 9.8, 'none');
              const rMax = calculate(b.max, 9.8, 'none');
              return (
                <tr key={b.band} style={{ background: i % 2 === 0 ? 'white' : C.bg, cursor: 'pointer' }} onClick={() => { setSelectedBand(b.band); setSpinePoint(0); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                  <td style={{ padding: '10px 12px', fontWeight: 700, color: C.teal, borderBottom: `1px solid ${C.border}` }}>{b.band}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'JetBrains Mono', fontSize: 12, borderBottom: `1px solid ${C.border}` }}>{fmtP(b.min)}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'JetBrains Mono', fontSize: 12, borderBottom: `1px solid ${C.border}` }}>{fmtP(b.max)}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'JetBrains Mono', fontSize: 12, color: C.green, borderBottom: `1px solid ${C.border}` }}>{fmtP(rMin.takeHome)}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'JetBrains Mono', fontSize: 12, color: C.green, borderBottom: `1px solid ${C.border}` }}>{fmtP(rMax.takeHome)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div style={{ fontSize: 11, color: C.slateLight, marginTop: 10 }}>Click any row to load that band in the calculator above. All take-home figures assume 9.8% NHS pension contribution.</div>
    </Card>
  </div>
</div>
```

);
}

// ── MATERNITY PAY PAGE ────────────────────────────────────────────────────────
function MaternityPage({ nav }) {
const mob = useWidth() < 640;
const [salary, setSalary] = useState(35000);
const [enhanced, setEnhanced] = useState(false);
const [enhancedWeeks, setEnhancedWeeks] = useState(13);
const [enhancedPct, setEnhancedPct] = useState(100);

const weeklyGross = salary / 52;
const smpWeekly = Math.min(TAX.smp.weekly, weeklyGross * 0.9);

// SMP: 6 weeks at 90% of AWE, then 33 weeks at statutory rate
const phase1Weekly = weeklyGross * 0.9;
const phase2Weekly = smpWeekly;

// Enhanced (if employer offers full pay for some weeks)
const enhancedWeekly = weeklyGross * (enhancedPct / 100);

const phase1Total = phase1Weekly * 6;
const phase2Total = phase2Weekly * 33;
const smpTotal = phase1Total + phase2Total;

const enhancedTotal = enhanced
? enhancedWeekly * Math.min(enhancedWeeks, 6) + phase1Weekly * Math.max(0, 6 - enhancedWeeks) + phase2Weekly * 33
: smpTotal;

const annualTax = salary > 0 ? calculate(salary, 0, ‘none’).incomeTax : 0;
const weeklyTax = annualTax / 52;
const phase1Net = Math.max(0, phase1Weekly - phase1Weekly * (weeklyTax / weeklyGross));
const phase2Net = Math.max(0, phase2Weekly * 0.8);

return (
<div>
<PageHero tag="Maternity Pay Calculator" title="Statutory Maternity Pay<br /><em style='color:#14B8A6'>Calculator 2026-27</em>" subtitle="Calculate your SMP entitlement and see what you will receive each week during maternity leave." mob={mob} />
<div style={{ maxWidth: 900, margin: mob ? ‘-28px 0 0’ : ‘-36px auto 0’, padding: mob ? ‘0 16px 48px’ : ‘0 24px 60px’ }}>
<BackBtn nav={nav} />
<div style={{ display: ‘grid’, gridTemplateColumns: mob ? ‘1fr’ : ‘1fr 1fr’, gap: 20, alignItems: ‘start’ }}>
<Card>
<h2 style={{ fontFamily: ‘DM Serif Display’, fontSize: 19, color: C.navy, marginBottom: 20 }}>Your Details</h2>
<InputField label=“Annual Salary” value={salary} onChange={setSalary} prefix={P} hint={fmtPD(salary/52) + ‘/week’} />
<div style={{ marginBottom: 18 }}>
<label style={{ display: ‘block’, fontSize: 13, fontWeight: 600, color: C.navyLight, marginBottom: 10 }}>Does your employer offer enhanced maternity pay?</label>
<div style={{ display: ‘flex’, gap: 10 }}>
{[[‘Yes’, true], [‘No - SMP only’, false]].map(([label, val]) => (
<button key={label} onClick={() => setEnhanced(val)} style={{ flex: 1, padding: ‘10px’, borderRadius: 8, border: `1.5px solid ${enhanced === val ? C.teal : C.borderDark}`, background: enhanced === val ? C.tealBg : ‘white’, color: enhanced === val ? C.teal : C.textMid, fontSize: 13, fontWeight: enhanced === val ? 700 : 400, fontFamily: ‘Source Serif 4’ }}>{label}</button>
))}
</div>
</div>
{enhanced && (
<>
<SliderField label=“Weeks at enhanced pay” value={enhancedWeeks} onChange={setEnhancedWeeks} min={1} max={39} step={1} format={v => v + ’ weeks’} />
<SliderField label=“Enhanced pay rate” value={enhancedPct} onChange={setEnhancedPct} min={50} max={100} step={5} format={v => v + ‘% of salary’} />
</>
)}
<div style={{ padding: ‘12px 14px’, background: C.amberBg, border: `1px solid ${C.amberBorder}`, borderRadius: 8, fontSize: 12, color: ‘#78350F’, lineHeight: 1.6, marginTop: 8 }}>
To qualify for SMP you must have been employed for 26 weeks by the 15th week before your due date and earn at least {P}123/week on average.
</div>
</Card>

```
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ background: `linear-gradient(135deg,${C.navy},${C.navyMid})`, borderRadius: 14, padding: mob ? '20px 18px' : 26, boxShadow: C.shadow }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'JetBrains Mono', marginBottom: 6 }}>Total SMP (39 weeks)</div>
          <div style={{ fontFamily: 'DM Serif Display', fontSize: mob ? 36 : 48, color: 'white', lineHeight: 1 }}>{fmtP(smpTotal)}</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', fontFamily: 'JetBrains Mono', marginTop: 5 }}>{fmtPD(smpTotal/39)}/week average</div>
        </div>

        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.navy, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>SMP Breakdown</div>
          <div style={{ marginBottom: 16, padding: '12px 14px', background: C.tealBg, border: `1px solid ${C.tealBorder}`, borderRadius: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.teal, marginBottom: 4 }}>Weeks 1 to 6: 90% of average weekly earnings</div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: C.textMid }}>Weekly gross</span>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 13, fontWeight: 700 }}>{fmtPD(phase1Weekly)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ fontSize: 13, color: C.textMid }}>6-week total</span>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 13, fontWeight: 700 }}>{fmtP(phase1Total)}</span>
            </div>
          </div>
          <div style={{ padding: '12px 14px', background: '#F8F9FA', border: `1px solid ${C.border}`, borderRadius: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 4 }}>Weeks 7 to 39: Statutory rate</div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: C.textMid }}>Weekly amount</span>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 13, fontWeight: 700 }}>{fmtPD(TAX.smp.weekly)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ fontSize: 13, color: C.textMid }}>33-week total</span>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 13, fontWeight: 700 }}>{fmtP(phase2Total)}</span>
            </div>
          </div>
        </Card>

        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.navy, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Your Normal Pay vs Maternity Pay</div>
          {[
            { label: 'Normal weekly gross', value: weeklyGross, color: C.navy },
            { label: 'Weeks 1-6 weekly (SMP)', value: phase1Weekly, color: C.teal },
            { label: 'Weeks 7-39 weekly (SMP)', value: TAX.smp.weekly, color: C.amber },
          ].map(row => (
            <div key={row.label} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: C.textMid }}>{row.label}</span>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 13, color: row.color, fontWeight: 600 }}>{fmtPD(row.value)}</span>
              </div>
              <div style={{ height: 6, background: C.border, borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, (row.value / weeklyGross) * 100)}%`, height: '100%', background: row.color, borderRadius: 3 }} />
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  </div>
</div>
```

);
}

// ── HOURLY RATE PAGE ──────────────────────────────────────────────────────────
function HourlyPage({ nav }) {
const mob = useWidth() < 640;
const [hourly, setHourly] = useState(18);
const [hoursPerWeek, setHoursPerWeek] = useState(37.5);
const [pension, setPension] = useState(5);
const annual = hourly * hoursPerWeek * 52;
const r = calculate(annual, pension, ‘none’);

return (
<div>
<PageHero tag="Hourly Rate Calculator" title="Hourly Rate<br /><em style='color:#14B8A6'>Take-Home Calculator</em>" subtitle="Convert your hourly wage to annual take-home pay after tax and NI." mob={mob} />
<div style={{ maxWidth: 860, margin: mob ? ‘-28px 0 0’ : ‘-36px auto 0’, padding: mob ? ‘0 16px 48px’ : ‘0 24px 60px’ }}>
<BackBtn nav={nav} />
<div style={{ display: ‘grid’, gridTemplateColumns: mob ? ‘1fr’ : ‘1fr 1fr’, gap: 20, alignItems: ‘start’ }}>
<Card>
<h2 style={{ fontFamily: ‘DM Serif Display’, fontSize: 19, color: C.navy, marginBottom: 20 }}>Your Details</h2>
<InputField label="Hourly Rate" value={hourly} onChange={setHourly} prefix={P} min={0} max={500} hint="Gross, before tax" />
<SliderField label=“Hours per Week” value={hoursPerWeek} onChange={setHoursPerWeek} min={1} max={60} step={0.5} format={v => v + ’ hrs’} />
<SliderField label=“Pension Contribution” value={pension} onChange={setPension} min={0} max={30} step={0.5} format={v => v + ‘%’} />
<div style={{ padding: ‘12px 14px’, background: C.tealBg, border: `1px solid ${C.tealBorder}`, borderRadius: 8 }}>
<div style={{ display: ‘flex’, justifyContent: ‘space-between’, marginBottom: 4 }}>
<span style={{ fontSize: 13, color: C.teal, fontWeight: 600 }}>Equivalent annual salary</span>
<span style={{ fontFamily: ‘JetBrains Mono’, fontSize: 14, fontWeight: 700, color: C.navy }}>{fmtP(annual)}</span>
</div>
<div style={{ fontSize: 11, color: ‘#0f766e’ }}>{hoursPerWeek} hours/week x 52 weeks</div>
</div>
</Card>
<div style={{ display: ‘flex’, flexDirection: ‘column’, gap: 14 }}>
<TakeHomeHero value={r.takeHome} monthly={r.monthly.takeHome} pct={(r.takeHome/r.gross)*100} mob={mob} />
<Card>
<div style={{ fontSize: 11, fontWeight: 700, color: C.navy, textTransform: ‘uppercase’, letterSpacing: ‘0.08em’, marginBottom: 14 }}>Hourly Breakdown</div>
{[
{ label: ‘Gross hourly rate’, value: hourly, sub: ‘Before tax’ },
{ label: ‘Net hourly rate’, value: r.takeHome / (hoursPerWeek * 52), sub: ‘After tax and NI’, color: C.teal, big: true },
{ label: ‘Annual gross’, value: annual },
{ label: ‘Annual take-home’, value: r.takeHome, color: C.teal, big: true },
{ label: ‘Monthly take-home’, value: r.monthly.takeHome },
{ label: ‘Weekly take-home’, value: r.weekly.takeHome },
].map((row, i) => <ResultRow key={i} {…row} />)}
</Card>
</div>
</div>
</div>
</div>
);
}

// ── BONUS CALCULATOR ──────────────────────────────────────────────────────────
function BonusPage({ nav }) {
const mob = useWidth() < 640;
const [salary, setSalary] = useState(40000);
const [bonus, setBonus] = useState(5000);
const rBase = calculate(salary, 0, ‘none’);
const rWithBonus = calculate(salary + bonus, 0, ‘none’);
const extraTax = rWithBonus.incomeTax - rBase.incomeTax;
const extraNI = rWithBonus.ni - rBase.ni;
const netBonus = bonus - extraTax - extraNI;
const pct = bonus > 0 ? (netBonus / bonus) * 100 : 0;

return (
<div>
<PageHero tag="Bonus Calculator" title="Bonus Take-Home<br /><em style='color:#14B8A6'>Calculator</em>" subtitle="See exactly how much of your bonus you will actually receive after income tax and National Insurance." mob={mob} />
<div style={{ maxWidth: 860, margin: mob ? ‘-28px 0 0’ : ‘-36px auto 0’, padding: mob ? ‘0 16px 48px’ : ‘0 24px 60px’ }}>
<BackBtn nav={nav} />
<div style={{ display: ‘grid’, gridTemplateColumns: mob ? ‘1fr’ : ‘1fr 1fr’, gap: 20, alignItems: ‘start’ }}>
<Card>
<h2 style={{ fontFamily: ‘DM Serif Display’, fontSize: 19, color: C.navy, marginBottom: 20 }}>Your Details</h2>
<InputField label="Annual Salary (before bonus)" value={salary} onChange={setSalary} prefix={P} />
<InputField label="Bonus Amount" value={bonus} onChange={setBonus} prefix={P} min={0} max={500000} hint="Gross bonus" />
<div style={{ padding: ‘12px 14px’, background: C.tealBg, border: `1px solid ${C.tealBorder}`, borderRadius: 8, marginTop: 8 }}>
<div style={{ fontSize: 12, color: ‘#0f766e’, lineHeight: 1.6 }}>
Your bonus is taxed at your marginal rate. If your salary plus bonus crosses a tax bracket boundary, part of the bonus is taxed at a higher rate.
</div>
</div>
</Card>

```
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ background: `linear-gradient(135deg,${C.navy},${C.navyMid})`, borderRadius: 14, padding: mob ? '20px 18px' : 26, boxShadow: C.shadow }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'JetBrains Mono', marginBottom: 6 }}>Net Bonus (After Tax)</div>
          <div style={{ fontFamily: 'DM Serif Display', fontSize: mob ? 36 : 48, color: 'white', lineHeight: 1 }}><AnimNum value={netBonus} /></div>
          <div style={{ fontSize: 13, color: C.tealLight, fontFamily: 'JetBrains Mono', marginTop: 5, fontWeight: 600 }}>{pct.toFixed(1)}% of gross bonus kept</div>
        </div>

        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.navy, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Bonus Breakdown</div>
          <ResultRow label="Gross bonus" value={bonus} />
          <ResultRow label="Extra income tax" value={-extraTax} color={C.red} />
          <ResultRow label="Extra NI" value={-extraNI} color={C.red} />
          <ResultRow label="Net bonus" value={netBonus} color={C.teal} big />
          <div style={{ marginTop: 16, height: 8, borderRadius: 4, overflow: 'hidden', background: C.border }}>
            <div className="bfill" style={{ width: pct + '%', height: '100%', background: `linear-gradient(90deg,${C.teal},${C.tealLight})`, borderRadius: 4 }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: C.slate }}>
            <span>Tax: {fmtP(extraTax + extraNI)}</span>
            <span>You keep: {fmtP(netBonus)}</span>
          </div>
        </Card>

        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.navy, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>With and Without Bonus</div>
          {[
            { label: 'Salary only', gross: rBase.gross, th: rBase.takeHome },
            { label: 'Salary + bonus', gross: rWithBonus.gross, th: rWithBonus.takeHome }
          ].map(row => (
            <div key={row.label} style={{ padding: '12px 0', borderBottom: `1px solid ${C.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 13, color: C.textMid }}>{row.label}</span>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 13, color: C.teal, fontWeight: 700 }}>{fmtP(row.th)}</span>
              </div>
              <div style={{ fontSize: 11, color: C.slateLight }}>Gross: {fmtP(row.gross)}</div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  </div>
</div>
```

);
}

// ── SALARY SACRIFICE PAGE ─────────────────────────────────────────────────────
function SacrificePage({ nav }) {
const mob = useWidth() < 640;
const [salary, setSalary] = useState(45000);
const [sacrificePct, setSacrificePct] = useState(5);
const sacrificeAmt = salary * (sacrificePct / 100);
const rBefore = calculate(salary, 0, ‘none’);
const rAfter = calculate(salary - sacrificeAmt, 0, ‘none’);
const takeHomeDiff = rBefore.takeHome - rAfter.takeHome;
const taxSaving = rBefore.incomeTax - rAfter.incomeTax;
const niSaving = rBefore.ni - rAfter.ni;
const netCost = sacrificeAmt - taxSaving - niSaving;

return (
<div>
<PageHero tag="Salary Sacrifice Calculator" title="Salary Sacrifice<br /><em style='color:#14B8A6'>Pension Calculator</em>" subtitle="See how much a salary sacrifice pension contribution actually costs you after tax and NI savings." mob={mob} />
<div style={{ maxWidth: 860, margin: mob ? ‘-28px 0 0’ : ‘-36px auto 0’, padding: mob ? ‘0 16px 48px’ : ‘0 24px 60px’ }}>
<BackBtn nav={nav} />
<div style={{ display: ‘grid’, gridTemplateColumns: mob ? ‘1fr’ : ‘1fr 1fr’, gap: 20, alignItems: ‘start’ }}>
<Card>
<h2 style={{ fontFamily: ‘DM Serif Display’, fontSize: 19, color: C.navy, marginBottom: 20 }}>Your Details</h2>
<InputField label="Annual Salary" value={salary} onChange={setSalary} prefix={P} />
<SliderField label=“Sacrifice Amount” value={sacrificePct} onChange={setSacrificePct} min={1} max={30} step={0.5} format={v => v + ’% = ’ + fmtP(salary * v / 100)} />
<div style={{ padding: ‘12px 14px’, background: C.tealBg, border: `1px solid ${C.tealBorder}`, borderRadius: 8 }}>
<div style={{ fontSize: 12, color: ‘#0f766e’, lineHeight: 1.7 }}>
Salary sacrifice reduces your <strong>gross</strong> salary before tax and NI are calculated. This means you save both income tax and National Insurance - unlike a personal pension which only recovers income tax.
</div>
</div>
</Card>

```
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ background: `linear-gradient(135deg,${C.navy},${C.navyMid})`, borderRadius: 14, padding: mob ? '20px 18px' : 26, boxShadow: C.shadow }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'JetBrains Mono', marginBottom: 6 }}>Real Cost of Contribution</div>
          <div style={{ fontFamily: 'DM Serif Display', fontSize: mob ? 36 : 48, color: 'white', lineHeight: 1 }}><AnimNum value={netCost} /></div>
          <div style={{ fontSize: 13, color: C.tealLight, fontFamily: 'JetBrains Mono', marginTop: 5 }}>vs {fmtP(sacrificeAmt)} gross contribution</div>
        </div>

        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.navy, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Sacrifice Breakdown</div>
          <ResultRow label="Gross contribution" value={sacrificeAmt} />
          <ResultRow label="Income tax saved" value={taxSaving} color={C.green} />
          <ResultRow label="NI saved" value={niSaving} color={C.green} />
          <ResultRow label="Net cost to you" value={netCost} color={C.teal} big />
          <ResultRow label="Take-home reduction" value={takeHomeDiff} color={C.red} />
        </Card>

        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.navy, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Before vs After</div>
          {[
            { label: 'Gross salary', before: rBefore.gross, after: rBefore.gross - sacrificeAmt },
            { label: 'Income Tax', before: rBefore.incomeTax, after: rAfter.incomeTax },
            { label: 'National Insurance', before: rBefore.ni, after: rAfter.ni },
            { label: 'Pension (employer sees)', before: 0, after: sacrificeAmt },
            { label: 'Take-home', before: rBefore.takeHome, after: rAfter.takeHome },
          ].map((row, i) => (
            <div key={row.label} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, padding: '8px 0', borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 12, color: C.textMid }}>{row.label}</span>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: C.text, textAlign: 'right' }}>{fmtP(row.before)}</span>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: i === 4 ? C.teal : C.text, textAlign: 'right', fontWeight: i === 4 ? 700 : 400 }}>{fmtP(row.after)}</span>
            </div>
          ))}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, padding: '8px 0 0', fontSize: 10, color: C.slateLight }}>
            <span></span><span style={{ textAlign: 'right' }}>Before</span><span style={{ textAlign: 'right' }}>After</span>
          </div>
        </Card>
      </div>
    </div>
  </div>
</div>
```

);
}

// ── JOB COMPARISON PAGE ───────────────────────────────────────────────────────
function ComparisonPage({ nav }) {
const mob = useWidth() < 640;
const [job1, setJob1] = useState({ salary: 50000, pension: 5, label: ‘Job A’ });
const [job2, setJob2] = useState({ salary: 55000, pension: 3, label: ‘Job B’ });
const r1 = calculate(job1.salary, job1.pension, ‘none’);
const r2 = calculate(job2.salary, job2.pension, ‘none’);
const diff = r2.takeHome - r1.takeHome;

return (
<div>
<PageHero tag="Job Comparison" title="Job Offer<br /><em style='color:#14B8A6'>Comparison Calculator</em>" subtitle="Compare two salary packages side by side and see which really pays more after tax." mob={mob} />
<div style={{ maxWidth: 1000, margin: mob ? ‘-28px 0 0’ : ‘-36px auto 0’, padding: mob ? ‘0 16px 48px’ : ‘0 24px 60px’ }}>
<BackBtn nav={nav} />
<div style={{ display: ‘grid’, gridTemplateColumns: mob ? ‘1fr’ : ‘1fr 1fr’, gap: 20, marginBottom: 20 }}>
{[[job1, setJob1, C.teal, C.tealBg, C.tealBorder, r1], [job2, setJob2, C.amber, C.amberBg, C.amberBorder, r2]].map(([job, setJob, color, bg, border, r], idx) => (
<div key={idx}>
<Card style={{ marginBottom: 14 }}>
<input value={job.label} onChange={e => setJob({…job, label: e.target.value})} style={{ width: ‘100%’, border: ‘none’, fontFamily: ‘DM Serif Display’, fontSize: 20, color: C.navy, marginBottom: 16, outline: ‘none’, background: ‘transparent’ }} placeholder={idx === 0 ? ‘Job A’ : ‘Job B’} />
<InputField label=“Annual Salary” value={job.salary} onChange={v => setJob({…job, salary: v})} prefix={P} />
<SliderField label=“Pension Contribution” value={job.pension} onChange={v => setJob({…job, pension: v})} min={0} max={20} step={0.5} format={v => v + ‘%’} />
</Card>
<div style={{ background: bg, border: `2px solid ${border}`, borderRadius: 12, padding: ‘20px 22px’, textAlign: ‘center’ }}>
<div style={{ fontSize: 11, color: color, fontWeight: 700, letterSpacing: ‘0.1em’, textTransform: ‘uppercase’, marginBottom: 6 }}>{job.label} Take-Home</div>
<div style={{ fontFamily: ‘DM Serif Display’, fontSize: mob ? 32 : 40, color: C.navy }}><AnimNum value={r.takeHome} /></div>
<div style={{ fontSize: 13, color: C.textMid, marginTop: 4, fontFamily: ‘JetBrains Mono’ }}>{fmtPD(r.monthly.takeHome)}/month</div>
</div>
</div>
))}
</div>

```
    <Card style={{ textAlign: 'center', padding: '28px' }}>
      <div style={{ fontSize: 13, color: C.textMid, marginBottom: 8 }}>Difference in annual take-home pay</div>
      <div style={{ fontFamily: 'DM Serif Display', fontSize: mob ? 32 : 44, color: diff >= 0 ? C.teal : C.red }}>{diff >= 0 ? '+' : ''}{fmtP(diff)}</div>
      <div style={{ fontSize: 14, color: C.textMid, marginTop: 6 }}>{job2.label} pays {diff >= 0 ? 'more' : 'less'} in take-home pay despite {diff >= 0 ? 'paying' : 'paying'} {fmtP(job2.salary - job1.salary)} {job2.salary >= job1.salary ? 'more' : 'less'} gross</div>
      <div style={{ fontSize: 12, color: C.slateLight, marginTop: 4 }}>{fmtPD(Math.abs(diff/12)}/month difference</div>
    </Card>

    <Card style={{ marginTop: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: C.navy, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Side by Side</div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead><tr>
            <th style={{ textAlign: 'left', padding: '8px 12px', borderBottom: `2px solid ${C.border}`, fontSize: 11, color: C.slate, textTransform: 'uppercase' }}></th>
            <th style={{ textAlign: 'right', padding: '8px 12px', borderBottom: `2px solid ${C.tealBorder}`, color: C.teal, fontSize: 13 }}>{job1.label}</th>
            <th style={{ textAlign: 'right', padding: '8px 12px', borderBottom: `2px solid ${C.amberBorder}`, color: C.amber, fontSize: 13 }}>{job2.label}</th>
          </tr></thead>
          <tbody>
            {[
              { l: 'Gross salary', v1: r1.gross, v2: r2.gross },
              { l: 'Income Tax', v1: r1.incomeTax, v2: r2.incomeTax, red: true },
              { l: 'National Insurance', v1: r1.ni, v2: r2.ni, red: true },
              { l: 'Pension contribution', v1: r1.pension, v2: r2.pension, red: true },
              { l: 'Annual take-home', v1: r1.takeHome, v2: r2.takeHome, bold: true },
              { l: 'Monthly take-home', v1: r1.monthly.takeHome, v2: r2.monthly.takeHome, bold: true },
              { l: 'Effective tax rate', v1: r1.effectiveRate.toFixed(1) + '%', v2: r2.effectiveRate.toFixed(1) + '%', str: true },
            ].map((row, i) => (
              <tr key={row.l} style={{ background: i % 2 === 0 ? 'white' : C.bg }}>
                <td style={{ padding: '10px 12px', fontSize: 13, color: C.textMid, fontWeight: row.bold ? 700 : 400, borderBottom: `1px solid ${C.border}` }}>{row.l}</td>
                <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'JetBrains Mono', fontSize: 12, color: row.red ? C.red : row.bold ? C.teal : C.text, fontWeight: row.bold ? 700 : 400, borderBottom: `1px solid ${C.border}` }}>{row.str ? row.v1 : fmtP(row.v1)}</td>
                <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'JetBrains Mono', fontSize: 12, color: row.red ? C.red : row.bold ? C.amber : C.text, fontWeight: row.bold ? 700 : 400, borderBottom: `1px solid ${C.border}` }}>{row.str ? row.v2 : fmtP(row.v2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
</div>
```

);
}

// ── TOOLS INDEX PAGE ──────────────────────────────────────────────────────────
function ToolsPage({ nav }) {
const mob = useWidth() < 640;
const tools = [
{ icon: ‘💷’, label: ‘Salary Calculator’, sub: ‘Annual take-home after all deductions’, page: ‘home’, live: true },
{ icon: ‘🏗️’, label: ‘IR35 Contractor’, sub: ‘PAYE vs Limited Company comparison’, page: ‘contractor’, live: true },
{ icon: ‘⏰’, label: ‘Hourly Rate’, sub: ‘Hourly wage to annual take-home’, page: ‘hourly’, live: true },
{ icon: ‘🏥’, label: ‘NHS Pay Bands’, sub: ‘Bands 1 to 9 take-home pay’, page: ‘nhs’, live: true },
{ icon: ‘👶’, label: ‘Maternity Pay’, sub: ‘SMP entitlement calculator’, page: ‘maternity’, live: true },
{ icon: ‘💼’, label: ‘Bonus Calculator’, sub: ‘Net bonus after tax’, page: ‘bonus’, live: true },
{ icon: ‘🏦’, label: ‘Salary Sacrifice’, sub: ‘Pension sacrifice real cost’, page: ‘sacrifice’, live: true },
{ icon: ‘📊’, label: ‘Job Comparison’, sub: ‘Compare two salary packages’, page: ‘comparison’, live: true },
{ icon: ‘🏠’, label: ‘Mortgage Calculator’, sub: ‘Coming soon’, page: null, live: false },
{ icon: ‘🧾’, label: ‘VAT Calculator’, sub: ‘Coming soon’, page: null, live: false },
{ icon: ‘🏛️’, label: ‘Stamp Duty’, sub: ‘Coming soon’, page: null, live: false },
{ icon: ‘⚖️’, label: ‘Redundancy Pay’, sub: ‘Coming soon’, page: null, live: false },
];

return (
<div>
<PageHero tag="TaxdCalc Tools" title="All Calculators" subtitle="Every scenario, every type of UK worker." mob={mob} />
<div style={{ maxWidth: 1100, margin: mob ? ‘-22px 0 0’ : ‘-26px auto 0’, padding: mob ? ‘0 16px 48px’ : ‘0 24px 60px’ }}>
<div style={{ display: ‘grid’, gridTemplateColumns: mob ? ‘1fr 1fr’ : ‘repeat(auto-fill,minmax(220px,1fr))’, gap: 14 }}>
{tools.map(t => (
<button key={t.label} onClick={() => t.live && t.page && nav(t.page)} disabled={!t.live}
style={{ background: t.live ? ‘white’ : C.bg, border: `1px solid ${t.live ? C.border : C.borderDark}`, borderRadius: 12, padding: ‘18px 16px’, textAlign: ‘left’, cursor: t.live ? ‘pointer’ : ‘default’, opacity: t.live ? 1 : 0.6, boxShadow: t.live ? C.shadow : ‘none’ }}>
<div style={{ fontSize: 24, marginBottom: 10 }}>{t.icon}</div>
<div style={{ fontSize: 13, fontWeight: 700, color: t.live ? C.navy : C.slate, marginBottom: 4 }}>{t.label}</div>
<div style={{ fontSize: 11, color: C.slateLight }}>{t.sub}</div>
{t.live && <div style={{ fontSize: 11, color: C.teal, marginTop: 8, fontWeight: 600 }}>Open calculator →</div>}
{!t.live && <div style={{ fontSize: 9, color: C.slateLight, marginTop: 6, background: C.bg, display: ‘inline-block’, padding: ‘2px 6px’, borderRadius: 3, fontFamily: ‘JetBrains Mono’, fontWeight: 700 }}>SOON</div>}
</button>
))}
</div>
</div>
</div>
);
}

// ── BLOG INDEX ────────────────────────────────────────────────────────────────
function BlogPage({ nav }) {
const mob = useWidth() < 640;
return (
<div style={{ background: C.bg, minHeight: ‘100vh’ }}>
<PageHero tag="Tax Guides" title="Understanding Your Tax" subtitle="Plain-English guides to income tax, National Insurance, pensions and more. Updated for 2026-27." mob={mob} />
<div style={{ maxWidth: 1000, margin: ‘-32px auto 60px’, padding: ‘0 20px’ }}>
<div style={{ display: ‘grid’, gridTemplateColumns: mob ? ‘1fr’ : ‘repeat(auto-fill,minmax(280px,1fr))’, gap: 20 }}>
{ARTICLES.map(a => (
<button key={a.slug} onClick={() => nav(‘article-’ + a.slug)} style={{ background: ‘white’, borderRadius: 12, padding: 24, boxShadow: C.shadow, border: `1px solid ${C.border}`, textAlign: ‘left’, cursor: ‘pointer’ }}>
<div style={{ display: ‘flex’, gap: 8, marginBottom: 14, alignItems: ‘center’ }}>
<span style={{ fontSize: 11, background: C.tealBg, color: C.teal, border: `1px solid ${C.tealBorder}`, borderRadius: 4, padding: ‘2px 8px’, fontWeight: 700, fontFamily: ‘JetBrains Mono’ }}>{a.category}</span>
<span style={{ fontSize: 11, color: C.slateLight, fontFamily: ‘JetBrains Mono’ }}>{a.readTime}</span>
</div>
<h2 style={{ fontSize: 17, fontFamily: ‘DM Serif Display’, color: C.navy, lineHeight: 1.35, marginBottom: 10 }}>{a.title}</h2>
<p style={{ fontSize: 13, color: C.slate, lineHeight: 1.6, marginBottom: 16 }}>{a.metaDesc}</p>
<div style={{ fontSize: 13, color: C.teal, fontWeight: 600 }}>Read guide →</div>
</button>
))}
</div>
</div>
</div>
);
}

// ── ARTICLE PAGE ──────────────────────────────────────────────────────────────
function ArticlePage({ nav, slug }) {
const mob = useWidth() < 640;
const article = ARTICLES.find(a => a.slug === slug);
if (!article) return <div style={{ padding: 40, textAlign: ‘center’ }}>Article not found.</div>;
const others = ARTICLES.filter(a => a.slug !== slug).slice(0, 3);

function renderBlock(block, i) {
if (block.t === ‘h2’) return <h2 key={i} style={{ fontFamily: ‘DM Serif Display’, fontSize: ‘clamp(18px,3vw,24px)’, color: C.navy, marginTop: 36, marginBottom: 12, lineHeight: 1.3 }}>{block.v}</h2>;
if (block.t === ‘h3’) return <h3 key={i} style={{ fontFamily: ‘DM Serif Display’, fontSize: 18, color: C.navy, marginTop: 24, marginBottom: 8 }}>{block.v}</h3>;
if (block.t === ‘p’) return <p key={i} style={{ fontSize: 15, color: C.textMid, lineHeight: 1.8, marginBottom: 14 }}>{block.v}</p>;
if (block.t === ‘faq’) return (
<div key={i} style={{ marginBottom: 16, padding: ‘14px 16px’, background: C.bg, borderRadius: 8, border: `1px solid ${C.border}` }}>
<p style={{ fontSize: 14, fontWeight: 700, color: C.navy, marginBottom: 6 }}>{block.q}</p>
<p style={{ fontSize: 14, color: C.textMid, lineHeight: 1.7, margin: 0 }}>{block.a}</p>
</div>
);
if (block.t === ‘table’) return (
<div key={i} style={{ overflowX: ‘auto’, margin: ‘20px 0’ }}>
<table style={{ width: ‘100%’, borderCollapse: ‘collapse’, fontSize: 14 }}>
<thead><tr>{block.headers.map((h, j) => <th key={j} style={{ background: C.tealBg, color: C.teal, padding: ‘10px 14px’, textAlign: ‘left’, borderBottom: `2px solid ${C.tealBorder}`, fontSize: 13, fontWeight: 700 }}>{h}</th>)}</tr></thead>
<tbody>{block.rows.map((row, ri) => <tr key={ri} style={{ background: ri % 2 === 0 ? ‘white’ : C.bg }}>{row.map((cell, ci) => <td key={ci} style={{ padding: ‘9px 14px’, borderBottom: `1px solid ${C.border}`, fontSize: 13, color: C.text }}>{cell}</td>)}</tr>)}</tbody>
</table>
</div>
);
return null;
}

return (
<div style={{ background: C.bg, minHeight: ‘100vh’ }}>
<div style={{ background: C.navy, padding: ‘0 24px’ }}>
<div style={{ maxWidth: 800, margin: ‘0 auto’, height: 48, display: ‘flex’, alignItems: ‘center’, gap: 8, fontSize: 13 }}>
<button onClick={() => nav(‘home’)} style={{ background: ‘none’, border: ‘none’, color: ‘rgba(255,255,255,0.5)’, fontFamily: ‘Source Serif 4’, fontSize: 13, cursor: ‘pointer’ }}>TaxdCalc</button>
<span style={{ color: ‘rgba(255,255,255,0.25)’ }}>›</span>
<button onClick={() => nav(‘blog’)} style={{ background: ‘none’, border: ‘none’, color: ‘rgba(255,255,255,0.5)’, fontFamily: ‘Source Serif 4’, fontSize: 13, cursor: ‘pointer’ }}>Guides</button>
<span style={{ color: ‘rgba(255,255,255,0.25)’ }}>›</span>
<span style={{ color: C.tealLight, fontSize: 13 }}>{article.category}</span>
</div>
</div>
<div style={{ background: `linear-gradient(135deg,${C.navy},${C.navyMid})`, padding: ‘clamp(32px,5vw,56px) 24px clamp(40px,6vw,72px)’, position: ‘relative’, overflow: ‘hidden’ }}>
<div style={{ position: ‘absolute’, top: -40, right: -40, width: 200, height: 200, borderRadius: ‘50%’, background: ‘rgba(13,148,136,0.08)’ }} />
<div style={{ maxWidth: 740, margin: ‘0 auto’, position: ‘relative’ }}>
<div style={{ display: ‘flex’, gap: 10, marginBottom: 16, flexWrap: ‘wrap’ }}>
<span style={{ fontSize: 11, background: ‘rgba(13,148,136,0.15)’, color: C.tealLight, border: ‘1px solid rgba(20,184,166,0.3)’, borderRadius: 4, padding: ‘2px 10px’, fontFamily: ‘JetBrains Mono’, fontWeight: 700 }}>{article.category}</span>
<span style={{ fontSize: 11, color: ‘rgba(255,255,255,0.4)’, fontFamily: ‘JetBrains Mono’ }}>{article.readTime}</span>
<span style={{ fontSize: 11, color: ‘rgba(255,255,255,0.4)’, fontFamily: ‘JetBrains Mono’ }}>Updated {article.date}</span>
</div>
<h1 style={{ fontFamily: ‘DM Serif Display’, fontSize: ‘clamp(24px,4vw,42px)’, color: ‘white’, lineHeight: 1.2, marginBottom: 16 }}>{article.title}</h1>
<p style={{ color: ‘rgba(255,255,255,0.55)’, fontSize: 16, lineHeight: 1.65, maxWidth: 560 }}>{article.metaDesc}</p>
</div>
</div>
<div style={{ background: C.tealBg, borderBottom: `1px solid ${C.tealBorder}`, padding: ‘14px 24px’ }}>
<div style={{ maxWidth: 800, margin: ‘0 auto’, display: ‘flex’, alignItems: ‘center’, justifyContent: ‘space-between’, flexWrap: ‘wrap’, gap: 12 }}>
<span style={{ fontSize: 14, color: C.teal, fontWeight: 600 }}>See how this affects your pay</span>
<button onClick={() => nav(‘home’)} style={{ background: C.teal, color: ‘white’, padding: ‘9px 20px’, borderRadius: 7, fontWeight: 700, fontSize: 13, border: ‘none’, fontFamily: ‘Source Serif 4’, cursor: ‘pointer’ }}>Try the Calculator</button>
</div>
</div>
<div style={{ maxWidth: 800, margin: ‘0 auto’, padding: ‘clamp(24px,4vw,48px) 20px’ }}>
<Card>{article.blocks.map((block, i) => renderBlock(block, i))}</Card>
<div style={{ background: `linear-gradient(135deg,${C.navy},${C.navyMid})`, borderRadius: 14, padding: ‘clamp(20px,4vw,36px)’, marginTop: 28, textAlign: ‘center’ }}>
<h3 style={{ fontFamily: ‘DM Serif Display’, fontSize: 22, color: ‘white’, marginBottom: 8 }}>Calculate your exact take-home pay</h3>
<p style={{ color: ‘rgba(255,255,255,0.5)’, fontSize: 14, marginBottom: 20 }}>Free, accurate, updated for 2026-27. No sign-up required.</p>
<button onClick={() => nav(‘home’)} style={{ background: C.teal, color: ‘white’, padding: ‘13px 28px’, borderRadius: 8, fontWeight: 700, fontSize: 15, border: ‘none’, fontFamily: ‘Source Serif 4’, cursor: ‘pointer’ }}>Open Salary Calculator</button>
</div>
{others.length > 0 && (
<div style={{ marginTop: 36 }}>
<h3 style={{ fontFamily: ‘DM Serif Display’, fontSize: 20, color: C.navy, marginBottom: 16 }}>More Tax Guides</h3>
<div style={{ display: ‘grid’, gridTemplateColumns: mob ? ‘1fr’ : ‘repeat(auto-fill,minmax(230px,1fr))’, gap: 14 }}>
{others.map(a => (
<button key={a.slug} onClick={() => nav(‘article-’ + a.slug)} style={{ background: ‘white’, borderRadius: 10, padding: 18, border: `1px solid ${C.border}`, textAlign: ‘left’, cursor: ‘pointer’ }}>
<div style={{ fontSize: 10, color: C.teal, fontWeight: 700, fontFamily: ‘JetBrains Mono’, marginBottom: 6, textTransform: ‘uppercase’ }}>{a.category}</div>
<div style={{ fontSize: 14, fontFamily: ‘DM Serif Display’, color: C.navy, lineHeight: 1.4, marginBottom: 8 }}>{a.title}</div>
<div style={{ fontSize: 13, color: C.teal, fontWeight: 600 }}>Read guide →</div>
</button>
))}
</div>
</div>
)}
</div>
<footer style={{ background: ‘#070D1C’, padding: ‘24px 20px’, borderTop: ‘1px solid rgba(255,255,255,0.05)’, marginTop: 40 }}>
<div style={{ maxWidth: 800, margin: ‘0 auto’, display: ‘flex’, justifyContent: ‘space-between’, flexWrap: ‘wrap’, gap: 12, alignItems: ‘center’ }}>
<button onClick={() => nav(‘home’)} style={{ background: ‘none’, border: ‘none’, color: C.tealLight, fontFamily: ‘DM Serif Display’, fontSize: 16, cursor: ‘pointer’ }}>TaxdCalc</button>
<span style={{ fontSize: 11, color: ‘rgba(255,255,255,0.2)’, fontFamily: ‘JetBrains Mono’ }}>Updated {article.date}</span>
<span style={{ fontSize: 11, color: ‘rgba(255,255,255,0.18)’, maxWidth: 280, lineHeight: 1.5 }}>For guidance only. Always consult HMRC or a qualified adviser.</span>
</div>
</footer>
</div>
);
}

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
const [page, setPage] = useState(‘home’);
function nav(p) {
setPage(p);
if (typeof window !== ‘undefined’) window.scrollTo({ top: 0, behavior: ‘smooth’ });
}
const isArticle = page.startsWith(‘article-’);
const articleSlug = isArticle ? page.replace(‘article-’, ‘’) : null;

return (
<>
<style>{STYLE}</style>
<NavBar page={page} nav={nav} />
{page === ‘home’ && <HomePage nav={nav} />}
{page === ‘contractor’ && <ContractorPage nav={nav} />}
{page === ‘nhs’ && <NHSPage nav={nav} />}
{page === ‘maternity’ && <MaternityPage nav={nav} />}
{page === ‘hourly’ && <HourlyPage nav={nav} />}
{page === ‘bonus’ && <BonusPage nav={nav} />}
{page === ‘sacrifice’ && <SacrificePage nav={nav} />}
{page === ‘comparison’ && <ComparisonPage nav={nav} />}
{page === ‘tools’ && <ToolsPage nav={nav} />}
{page === ‘blog’ && <BlogPage nav={nav} />}
{isArticle && <ArticlePage nav={nav} slug={articleSlug} />}
</>
);
}