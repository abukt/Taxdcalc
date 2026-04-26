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

function calcTH(gross) {
  const pen = gross * 0.05;
  const ti = Math.max(0, gross - pen);
  let pa = 12570;
  if (ti > 100000) pa = Math.max(0, 12570 - Math.floor((ti - 100000) / 2));
  const tx = Math.max(0, ti - pa);
  const it =
    Math.min(tx, 37700) * 0.20 +
    Math.min(Math.max(0, tx - 37700), 74870) * 0.40 +
    Math.max(0, tx - 37700 - 74870) * 0.45;
  const ni =
    gross <= 12570 ? 0
      : (Math.min(gross, 50270) - 12570) * 0.08 + Math.max(0, gross - 50270) * 0.02;
  const th = gross - it - ni - pen;
  return { th: Math.round(th), mo: Math.round(th / 12) };
}

const fmt = n => '£' + n.toLocaleString('en-GB');

const NUMERIC_SALARIES = [
  20000, 22000, 25000, 27000, 28000, 30000, 32000, 35000, 38000, 40000,
  42000, 45000, 48000, 50000, 55000, 60000, 65000, 70000, 75000, 80000,
  85000, 90000, 95000, 100000, 105000, 110000, 120000, 125000, 150000,
];

const SPECIAL_SALARIES = [
  { slug: 'minimum-wage-take-home',    label: 'Minimum Wage (£12.71/hr)', salary: 26418 },
  { slug: 'nhs-band-5-take-home',      label: 'NHS Band 5 Entry',         salary: 29970 },
  { slug: 'nhs-band-6-take-home',      label: 'NHS Band 6 Entry',         salary: 37338 },
  { slug: 'nhs-band-7-take-home',      label: 'NHS Band 7 Entry',         salary: 43742 },
  { slug: 'teacher-salary-take-home',  label: 'NQT Teacher M1',           salary: 32916 },
  { slug: 'graduate-salary-take-home', label: 'UK Graduate Average',      salary: 28000 },
];

const C = {
  navy: '#0C1E3C', navyM: '#1e3d6e',
  teal: '#0D9488', tealL: '#14B8A6', tealBg: '#F0FDFA', tealBd: '#99F6E4',
  border: '#E2E8F0', bg: '#F4F6F9', white: '#FFFFFF',
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
    <footer style={{ background: '#070D1C', padding: '40px 24px 28px', borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 0 }}>
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

function SalaryCard({ slug, label, salary }) {
  const { th, mo } = calcTH(salary);
  return (
    <Link href={`/${slug}`} style={{ display: 'block', background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: '14px 16px', boxShadow: C.shadow, transition: 'border-color 0.15s' }}>
      <div style={{ fontSize: 11, color: C.slate, fontFamily: 'JetBrains Mono', marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: 'DM Serif Display', fontSize: 22, color: C.teal, lineHeight: 1 }}>{fmt(th)}/yr</div>
      <div style={{ fontSize: 11, color: C.mid, marginTop: 3 }}>{fmt(mo)}/month net</div>
    </Link>
  );
}

export default function SalaryTakeHomePayUKPage() {
  const mob = useW() < 640;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://taxdcal.co.uk' },
      { '@type': 'ListItem', position: 2, name: 'UK Salary Take-Home Pay', item: 'https://taxdcal.co.uk/salary-take-home-pay-uk' },
    ],
  };

  return (
    <>
      <style>{GS}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Nav />

      <div style={{ background: C.tealBg, borderBottom: `1px solid ${C.tealBd}`, padding: mob ? '14px 16px' : '16px 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ fontSize: 10, color: C.teal, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'JetBrains Mono', marginBottom: 6 }}>Quick Answer — 2026-27</div>
          <p style={{ fontSize: mob ? 14 : 16, color: '#0f766e', lineHeight: 1.6, fontWeight: 600 }}>
            At £40,000 you take home <strong>£30,720/year</strong> (£2,560/month). At £50,000 you take home <strong>£37,520/year</strong>. Figures include 5% pension, no student loan.
          </p>
        </div>
      </div>

      <div style={{ background: `linear-gradient(135deg,${C.navy},${C.navyM})`, padding: mob ? '24px 20px 36px' : '32px 24px 44px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'DM Serif Display', fontSize: mob ? 22 : 32, color: 'white', lineHeight: 1.2, marginBottom: 10 }}>UK Salary Take-Home Pay 2026-27</h1>
          <p style={{ fontSize: mob ? 13 : 15, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, maxWidth: 640 }}>
            Every common UK salary from £20,000 to £150,000 — exact take-home pay after income tax, National Insurance and 5% pension contribution. All figures use confirmed 2026-27 HMRC rates.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: mob ? '16px 16px 48px' : '24px 24px 56px' }}>

        <h2 style={{ fontFamily: 'DM Serif Display', fontSize: mob ? 18 : 22, color: C.navy, marginBottom: 4 }}>Salary Take-Home Pay Table</h2>
        <p style={{ fontSize: 13, color: C.slate, marginBottom: 16 }}>Click any salary to open the full calculator with pension, student loan and Scotland adjustments.</p>

        <div style={{ display: 'grid', gridTemplateColumns: mob ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: 10, marginBottom: 32 }} className="fi">
          {NUMERIC_SALARIES.map(s => (
            <SalaryCard key={s} slug={`${s}-salary-take-home`} label={fmt(s) + ' salary'} salary={s} />
          ))}
        </div>

        <h2 style={{ fontFamily: 'DM Serif Display', fontSize: mob ? 18 : 22, color: C.navy, marginBottom: 4 }}>Common Role Salaries</h2>
        <p style={{ fontSize: 13, color: C.slate, marginBottom: 16 }}>Minimum wage, NHS bands, teacher pay and graduate salary take-home.</p>

        <div style={{ display: 'grid', gridTemplateColumns: mob ? 'repeat(2,1fr)' : 'repeat(3,1fr)', gap: 10, marginBottom: 32 }}>
          {SPECIAL_SALARIES.map(({ slug, label, salary }) => (
            <SalaryCard key={slug} slug={slug} label={label} salary={salary} />
          ))}
        </div>

        <div style={{ background: C.tealBg, border: `1px solid ${C.tealBd}`, borderRadius: 12, padding: mob ? 16 : 22, marginBottom: 16 }}>
          <h2 style={{ fontFamily: 'DM Serif Display', fontSize: mob ? 17 : 20, color: C.navy, marginBottom: 8 }}>Want to adjust pension, student loan or Scotland rates?</h2>
          <p style={{ fontSize: 13, color: C.mid, marginBottom: 14, lineHeight: 1.7 }}>
            Each salary page above includes a full interactive calculator — adjust pension contribution (0–20%), student loan plan (1, 2, 4, or 5), and toggle Scottish income tax. Results update instantly.
          </p>
          <Link href="/" style={{ display: 'inline-block', background: C.teal, color: 'white', padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 700 }}>Open main salary calculator →</Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gap: 12 }}>
          <Link href="/nhs" style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: '16px 18px', display: 'block', boxShadow: C.shadow }}>
            <div style={{ fontFamily: 'DM Serif Display', fontSize: 17, color: C.navy, marginBottom: 4 }}>NHS Pay Bands Calculator</div>
            <div style={{ fontSize: 12, color: C.mid }}>Interactive calculator for all NHS Agenda for Change bands 2–9, including HCAS London supplements.</div>
          </Link>
          <Link href="/public-sector-pay" style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: '16px 18px', display: 'block', boxShadow: C.shadow }}>
            <div style={{ fontFamily: 'DM Serif Display', fontSize: 17, color: C.navy, marginBottom: 4 }}>Public Sector Pay Hub</div>
            <div style={{ fontSize: 12, color: C.mid }}>NHS, teachers, police, firefighters, civil service, armed forces and council workers take-home pay.</div>
          </Link>
        </div>

      </div>
      <Footer />
    </>
  );
}
