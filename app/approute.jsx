'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// ── SHARED STYLES ─────────────────────────────────────────────────────────────

export const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Source+Serif+4:wght@300;400;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  body{background:#F8F9FA;color:#1E293B;font-family:'Source Serif 4',Georgia,serif;-webkit-tap-highlight-color:transparent;}
  input[type=number]{-moz-appearance:textfield;}
  input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;}
  input[type=range]{-webkit-appearance:none;width:100%;height:4px;background:#CBD5E1;border-radius:2px;outline:none;cursor:pointer;}
  input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;border-radius:50%;background:#0C1E3C;cursor:pointer;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.2);}
  select{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2364748b' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;background-color:white;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
  .fu{animation:fadeUp 0.45s ease both;}
  .bfill{transition:width 0.55s cubic-bezier(0.4,0,0.2,1);}
  button{-webkit-tap-highlight-color:transparent;cursor:pointer;}
  a{text-decoration:none;color:inherit;}
`;

// ── COLOURS ───────────────────────────────────────────────────────────────────

export const C = {
  cream: '#F8F9FA', white: '#FFFFFF',
  navy: '#0C1E3C', navyLight: '#162d52', navyMid: '#1e3d6e',
  teal: '#0D9488', tealLight: '#14B8A6', tealBg: '#F0FDFA', tealBorder: '#99F6E4',
  amber: '#D97706', amberLight: '#F59E0B', amberBg: '#FFFBEB', amberBorder: '#FDE68A',
  slate: '#64748B', slateLight: '#94A3B8',
  border: '#E2E8F0', borderDark: '#CBD5E1',
  green: '#059669', greenBg: '#ECFDF5', greenBorder: '#6EE7B7',
  red: '#DC2626', redBg: '#FEF2F2', redBorder: '#FECACA',
  text: '#1E293B', textMid: '#475569',
  shadow: '0 1px 3px rgba(0,0,0,0.07),0 4px 16px rgba(0,0,0,0.04)',
};

// ── RESPONSIVE HOOK ───────────────────────────────────────────────────────────

export function useWidth() {
  const [w, setW] = useState(typeof window !== 'undefined' ? window.innerWidth : 800);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return w;
}

// ── UK TAX LOGIC 2026-27 ──────────────────────────────────────────────────────

export const TAX = {
  personalAllowance: 12570,
  basicRateLimit: 50270,
  higherRateLimit: 125140,
  niPrimaryThreshold: 12570,
  niUpperEarningsLimit: 50270,
  studentLoan: {
    plan1: { threshold: 24990, rate: 0.09 },
    plan2: { threshold: 27295, rate: 0.09 },
    plan4: { threshold: 31395, rate: 0.09 },
    plan5: { threshold: 25000, rate: 0.09 },
    none: null,
  },
};

export function calcIncomeTax(gross, pension) {
  const ti = Math.max(0, gross - pension);
  let allow = TAX.personalAllowance;
  if (ti > 100000) allow = Math.max(0, TAX.personalAllowance - (ti - 100000) / 2);
  const taxable = Math.max(0, ti - allow);
  const b1 = TAX.basicRateLimit - TAX.personalAllowance;
  const b2 = TAX.higherRateLimit - TAX.personalAllowance;
  if (taxable <= b1) return taxable * 0.20;
  if (taxable <= b2) return b1 * 0.20 + (taxable - b1) * 0.40;
  return b1 * 0.20 + (b2 - b1) * 0.40 + (taxable - b2) * 0.45;
}

export function calcNI(gross) {
  if (gross <= TAX.niPrimaryThreshold) return 0;
  if (gross <= TAX.niUpperEarningsLimit) return (gross - TAX.niPrimaryThreshold) * 0.08;
  return (TAX.niUpperEarningsLimit - TAX.niPrimaryThreshold) * 0.08 + (gross - TAX.niUpperEarningsLimit) * 0.02;
}

export function calcStudentLoan(gross, plan) {
  if (!plan || plan === 'none') return 0;
  const p = TAX.studentLoan[plan];
  if (!p || gross <= p.threshold) return 0;
  return (gross - p.threshold) * p.rate;
}

export function calculate(gross, pensionPct, slPlan) {
  const pension = gross * (pensionPct / 100);
  const incomeTax = calcIncomeTax(gross, pension);
  const ni = calcNI(gross);
  const studentLoan = calcStudentLoan(gross, slPlan);
  const totalDeductions = incomeTax + ni + studentLoan + pension;
  const takeHome = gross - totalDeductions;
  return {
    gross, incomeTax, ni, studentLoan, pension, totalDeductions, takeHome,
    monthly: { gross: gross / 12, takeHome: takeHome / 12 },
    weekly: { gross: gross / 52, takeHome: takeHome / 52 },
    daily: { gross: gross / 260, takeHome: takeHome / 260 },
    effectiveRate: gross > 0 ? ((incomeTax + ni) / gross) * 100 : 0,
  };
}

// ── FORMAT ────────────────────────────────────────────────────────────────────

export const fmt = n => '£' + Math.abs(n).toLocaleString('en-GB', { maximumFractionDigits: 0 });
export const fmtD = n => '£' + n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ── ANIMATED NUMBER ───────────────────────────────────────────────────────────

export function AnimNum({ value, format }) {
  const f = format || fmt;
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);
  useEffect(() => {
    const start = prev.current, end = value, diff = end - start;
    if (Math.abs(diff) < 1) { setDisplay(end); prev.current = end; return; }
    const dur = 420, t0 = performance.now(); let raf;
    const step = now => {
      const t = Math.min(1, (now - t0) / dur);
      const e = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      setDisplay(start + diff * e);
      if (t < 1) raf = requestAnimationFrame(step);
      else { setDisplay(end); prev.current = end; }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <span>{f(display)}</span>;
}

// ── LOGO ──────────────────────────────────────────────────────────────────────

export function Logo({ size, light }) {
  const s = size === 'sm' ? { box: 26, font: 12, text: 15 } : size === 'lg' ? { box: 44, font: 20, text: 26 } : { box: 32, font: 14, text: 18 };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
      <div style={{ width: s.box, height: s.box, background: 'linear-gradient(135deg,#0D9488,#14B8A6)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 8px rgba(13,148,136,0.4)' }}>
        <span style={{ color: 'white', fontWeight: 700, fontSize: s.font, fontFamily: 'JetBrains Mono' }}>Tx</span>
      </div>
      <span style={{ color: light ? 'white' : C.navy, fontFamily: 'DM Serif Display', fontSize: s.text, letterSpacing: '-0.02em' }}>
        Taxd<span style={{ color: C.teal }}>Calc</span>
      </span>
    </div>
  );
}

// ── SHARED FIELD COMPONENTS ───────────────────────────────────────────────────

export function InputField({ label, value, onChange, prefix, hint, min, max }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 7 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: C.navyLight }}>{label}</label>
        {hint && <span style={{ fontSize: 11, color: C.slate }}>{hint}</span>}
      </div>
      <div style={{ position: 'relative' }}>
        {prefix && <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: C.slate, fontSize: 15, fontWeight: 600, fontFamily: 'JetBrains Mono', pointerEvents: 'none' }}>{prefix}</span>}
        <input type="number" value={value} onChange={e => onChange(Number(e.target.value))} min={min || 0} max={max || 500000}
          style={{ width: '100%', padding: '13px 14px 13px ' + (prefix ? '28px' : '14px'), border: '1.5px solid ' + C.borderDark, borderRadius: 8, fontSize: 16, fontFamily: 'JetBrains Mono', fontWeight: 500, color: C.navy, background: 'white', outline: 'none' }}
          onFocus={e => e.target.style.borderColor = C.teal}
          onBlur={e => e.target.style.borderColor = C.borderDark} />
      </div>
    </div>
  );
}

export function SliderField({ label, value, onChange, min, max, step, format }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: C.navyLight }}>{label}</label>
        <span style={{ fontFamily: 'JetBrains Mono', fontSize: 14, color: C.teal, fontWeight: 600 }}>{format(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        <span style={{ fontSize: 11, color: C.slateLight }}>{format(min)}</span>
        <span style={{ fontSize: 11, color: C.slateLight }}>{format(max)}</span>
      </div>
    </div>
  );
}

export function SelectField({ label, value, onChange, options }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.navyLight, marginBottom: 7 }}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{ width: '100%', padding: '13px 40px 13px 14px', border: '1.5px solid ' + C.borderDark, borderRadius: 8, fontSize: 14, fontFamily: 'Source Serif 4', color: C.navy, cursor: 'pointer' }}
        onFocus={e => e.target.style.borderColor = C.teal}
        onBlur={e => e.target.style.borderColor = C.borderDark}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

export function ResultCard({ label, value, sub, color }) {
  return (
    <div style={{ background: 'white', border: '1px solid ' + C.border, borderRadius: 10, padding: '14px 16px', boxShadow: C.shadow }}>
      <div style={{ fontSize: 10, color: C.slate, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 5, fontFamily: 'JetBrains Mono' }}>{label}</div>
      <div style={{ fontFamily: 'DM Serif Display', fontSize: 26, color: color || C.navy, lineHeight: 1 }}><AnimNum value={value} /></div>
      {sub && <div style={{ fontSize: 10, color: C.slateLight, fontFamily: 'JetBrains Mono', marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

export function PageHero({ tag, title, accent, desc }) {
  const w = useWidth();
  const mob = w < 640;
  return (
    <div style={{ background: 'linear-gradient(135deg,#0C1E3C,#1e3d6e)', padding: mob ? '38px 20px 68px' : '46px 24px 74px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -60, right: -40, width: 240, height: 240, borderRadius: '50%', background: 'rgba(13,148,136,0.08)', pointerEvents: 'none' }} />
      {tag && (
        <div style={{ display: 'inline-block', background: 'rgba(13,148,136,0.15)', border: '1px solid rgba(20,184,166,0.3)', borderRadius: 20, padding: '4px 13px', fontSize: 11, color: C.tealLight, marginBottom: 14, fontFamily: 'JetBrains Mono' }}>{tag}</div>
      )}
      <h1 style={{ fontFamily: 'DM Serif Display', fontSize: mob ? 26 : 44, color: 'white', marginBottom: 12, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
        {title}<br /><em style={{ color: accent || C.tealLight }}>Calculator</em>
      </h1>
      {desc && <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: mob ? 13 : 15, maxWidth: 420, margin: '0 auto' }}>{desc}</p>}
    </div>
  );
}

export function Disclaimer({ text }) {
  return (
    <div style={{ background: C.amberBg, border: '1px solid ' + C.amberBorder, borderRadius: 10, padding: '14px 18px', marginTop: 16 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: '#92400E', marginBottom: 4 }}>Disclaimer</div>
      <div style={{ fontSize: 12, color: '#78350F', lineHeight: 1.6 }}>{text || 'For guidance only. Always consult HMRC or a qualified tax adviser for your personal circumstances.'}</div>
    </div>
  );
}

// ── NAV ───────────────────────────────────────────────────────────────────────

export function NavBar({ active }) {
  const [open, setOpen] = useState(false);
  const w = useWidth();
  const mob = w < 640;
  const navItems = [
    { href: '/', label: 'Salary Calculator' },
    { href: '/ir35', label: 'IR35' },
    { href: '/nhs', label: 'NHS Bands' },
    { href: '/tools', label: 'All Tools' },
    { href: '/blog', label: 'Tax Guides' },
  ];
  return (
    <nav style={{ background: C.navy, position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 16px rgba(0,0,0,0.25)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/"><Logo light /></Link>
        {mob ? (
          <button onClick={() => setOpen(!open)} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 7, padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{ display: 'block', width: 18, height: 2, background: 'white', borderRadius: 1, transition: 'all 0.2s', transform: open && i === 0 ? 'rotate(45deg) translate(4px,4px)' : open && i === 2 ? 'rotate(-45deg) translate(4px,-4px)' : 'none', opacity: open && i === 1 ? 0 : 1 }} />
            ))}
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {navItems.map(n => (
              <Link key={n.href} href={n.href}
                style={{ padding: '7px 13px', borderRadius: 6, background: active === n.href ? 'rgba(13,148,136,0.2)' : 'transparent', color: active === n.href ? C.tealLight : 'rgba(255,255,255,0.6)', fontSize: 13, fontFamily: 'Source Serif 4', fontWeight: active === n.href ? 600 : 400 }}>
                {n.label}
              </Link>
            ))}
            <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.12)', margin: '0 8px' }} />
            <span style={{ fontSize: 11, color: C.tealLight, fontFamily: 'JetBrains Mono', background: 'rgba(13,148,136,0.15)', padding: '3px 9px', borderRadius: 4, border: '1px solid rgba(20,184,166,0.3)' }}>2026-27</span>
          </div>
        )}
      </div>
      {mob && open && (
        <div style={{ background: C.navyLight, borderTop: '1px solid rgba(255,255,255,0.08)', padding: '8px 0 14px' }}>
          {navItems.map(n => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)}
              style={{ display: 'block', width: '100%', padding: '13px 24px', background: active === n.href ? 'rgba(13,148,136,0.15)' : 'transparent', color: active === n.href ? C.tealLight : 'rgba(255,255,255,0.65)', fontSize: 15, fontFamily: 'Source Serif 4', fontWeight: active === n.href ? 600 : 400 }}>
              {n.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

// ── FOOTER ────────────────────────────────────────────────────────────────────

export function Footer() {
  const w = useWidth();
  const mob = w < 640;
  return (
    <footer style={{ background: '#070D1C', padding: '26px 20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: mob ? 'column' : 'row', justifyContent: 'space-between', gap: 14, alignItems: mob ? 'flex-start' : 'center' }}>
        <Logo light size="sm" />
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', fontFamily: 'JetBrains Mono' }}>Updated 6 April 2026 - 2026-27 tax year</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.18)', maxWidth: 300, lineHeight: 1.6 }}>For guidance only. Always consult HMRC or a qualified adviser.</div>
      </div>
    </footer>
  );
}
