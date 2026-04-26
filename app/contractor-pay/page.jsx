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
  return Math.round(gross - it - ni - pen);
}

const fmt = n => '£' + n.toLocaleString('en-GB');

const DAY_RATES = [
  { rate: 200, slug: '200-day-rate-take-home', salary: 44000 },
  { rate: 250, slug: '250-day-rate-take-home', salary: 55000 },
  { rate: 300, slug: '300-day-rate-take-home', salary: 66000 },
  { rate: 350, slug: '350-day-rate-take-home', salary: 77000 },
  { rate: 400, slug: '400-day-rate-take-home', salary: 88000 },
  { rate: 450, slug: '450-day-rate-take-home', salary: 99000 },
  { rate: 500, slug: '500-day-rate-take-home', salary: 110000 },
  { rate: 550, slug: '550-day-rate-take-home', salary: 121000 },
  { rate: 600, slug: '600-day-rate-take-home', salary: 132000 },
  { rate: 650, slug: '650-day-rate-take-home', salary: 143000 },
  { rate: 700, slug: '700-day-rate-take-home', salary: 154000 },
  { rate: 750,  slug: '750-day-rate-take-home',  salary: 165000 },
  { rate: 800,  slug: '800-day-rate-take-home',  salary: 176000 },
  { rate: 1000, slug: '1000-day-rate-take-home', salary: 220000 },
];

const C = {
  navy: '#0C1E3C', navyM: '#1e3d6e',
  teal: '#0D9488', tealL: '#14B8A6', tealBg: '#F0FDFA', tealBd: '#99F6E4',
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

export default function ContractorPayPage() {
  const mob = useW() < 640;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://taxdcal.co.uk' },
      { '@type': 'ListItem', position: 2, name: 'Contractor Pay', item: 'https://taxdcal.co.uk/contractor-pay' },
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
            A £400/day contractor <strong>outside IR35</strong> takes home approx <strong>£65,000/year</strong> via Ltd Co vs <strong>~£59,000 inside IR35</strong> (PAYE, 5% pension). Dividend tax rises to 10.75% from April 2026.
          </p>
        </div>
      </div>

      <div style={{ background: `linear-gradient(135deg,${C.navy},${C.navyM})`, padding: mob ? '24px 20px 36px' : '32px 24px 44px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'DM Serif Display', fontSize: mob ? 22 : 32, color: 'white', lineHeight: 1.2, marginBottom: 10 }}>Contractor Pay UK 2026-27</h1>
          <p style={{ fontSize: mob ? 13 : 15, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, maxWidth: 640 }}>
            IR35 status, day-rate take-home, and contractor tax planning. Updated for the April 2026 dividend tax increase to 10.75% and the 15% employer NI rate.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: mob ? '16px 16px 48px' : '24px 24px 56px' }}>

        <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gap: 14, marginBottom: 32 }} className="fi">
          <Link href="/ir35" style={{ background: C.white, border: `1.5px solid ${C.tealBd}`, borderRadius: 12, padding: mob ? 16 : 22, display: 'block', boxShadow: C.shadow }}>
            <div style={{ fontSize: 10, color: C.teal, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'JetBrains Mono', marginBottom: 6 }}>Interactive Calculator</div>
            <div style={{ fontFamily: 'DM Serif Display', fontSize: mob ? 19 : 23, color: C.navy, marginBottom: 6 }}>IR35 Inside vs Outside</div>
            <div style={{ fontSize: 13, color: C.mid, lineHeight: 1.7, marginBottom: 14 }}>Enter your day rate and days/year. See exact take-home for PAYE inside IR35 versus Limited Company outside IR35, side by side.</div>
            <span style={{ display: 'inline-block', background: C.teal, color: 'white', padding: '9px 18px', borderRadius: 7, fontSize: 12, fontWeight: 700 }}>Open IR35 calculator →</span>
          </Link>
          <Link href="/blog/ir35-inside-outside-calculator-2026" style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: mob ? 16 : 22, display: 'block', boxShadow: C.shadow }}>
            <div style={{ fontSize: 10, color: C.slate, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'JetBrains Mono', marginBottom: 6 }}>In-depth Guide</div>
            <div style={{ fontFamily: 'DM Serif Display', fontSize: mob ? 19 : 23, color: C.navy, marginBottom: 6 }}>IR35 Explained 2026-27</div>
            <div style={{ fontSize: 13, color: C.mid, lineHeight: 1.7 }}>How IR35 works, the April 2026 dividend tax rise to 10.75%, and the exact numbers for common day rates. Updated for 2026-27.</div>
          </Link>
        </div>

        <h2 style={{ fontFamily: 'DM Serif Display', fontSize: mob ? 18 : 22, color: C.navy, marginBottom: 4 }}>Day-Rate Take-Home (PAYE, 220 days)</h2>
        <p style={{ fontSize: 13, color: C.slate, marginBottom: 16 }}>Annualised at 220 working days with 5% pension. Click any rate for a full breakdown with pension and student loan adjustments.</p>

        <div style={{ overflowX: 'auto', marginBottom: 32 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 380, background: C.white, borderRadius: 10, overflow: 'hidden', boxShadow: C.shadow }}>
            <thead>
              <tr style={{ background: C.navy }}>
                {['Day Rate', 'Annualised', 'Take-Home/yr', 'Take-Home/mo', 'Details'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: 'rgba(255,255,255,0.8)', fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DAY_RATES.map(({ rate, slug, salary }, i) => {
                const th = calcTH(salary);
                return (
                  <tr key={rate} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? C.white : '#FAFBFC' }}>
                    <td style={{ padding: '10px 14px', fontFamily: 'JetBrains Mono', fontWeight: 700, color: C.navy }}>{fmt(rate)}/day</td>
                    <td style={{ padding: '10px 14px', color: C.mid }}>{fmt(salary)}/yr</td>
                    <td style={{ padding: '10px 14px', fontFamily: 'JetBrains Mono', color: C.teal, fontWeight: 700 }}>{fmt(th)}</td>
                    <td style={{ padding: '10px 14px', color: C.mid }}>{fmt(Math.round(th / 12))}/mo</td>
                    <td style={{ padding: '10px 14px' }}>
                      <Link href={`/${slug}`} style={{ color: C.teal, fontWeight: 700, fontSize: 12 }}>Full breakdown →</Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gap: 12 }}>
          <Link href="/blog/salary-sacrifice-electric-car-uk-2026" style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: '16px 18px', display: 'block', boxShadow: C.shadow }}>
            <div style={{ fontFamily: 'DM Serif Display', fontSize: 17, color: C.navy, marginBottom: 4 }}>EV Salary Sacrifice 2026-27</div>
            <div style={{ fontSize: 12, color: C.mid, lineHeight: 1.6 }}>3% BiK on electric cars makes EV salary sacrifice highly efficient. A £400/month car costs a basic rate taxpayer only £288/month.</div>
          </Link>
          <Link href="/blog/pension-tax-relief-your-free-money" style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: '16px 18px', display: 'block', boxShadow: C.shadow }}>
            <div style={{ fontFamily: 'DM Serif Display', fontSize: 17, color: C.navy, marginBottom: 4 }}>Pension Tax Relief Guide</div>
            <div style={{ fontSize: 12, color: C.mid, lineHeight: 1.6 }}>Salary sacrifice saves income tax AND NI. For a 40% taxpayer, £80 costs only £60 net. The most efficient way to reduce your tax bill.</div>
          </Link>
        </div>

      </div>
      <Footer />
    </>
  );
}
