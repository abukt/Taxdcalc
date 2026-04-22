'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// --- STYLES & CONFIG ---
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

const GRADES = [
  { grade: 'Private (L1)', gross: 23907, penPct: 0, desc: 'Entry Rate', th: 20733, mo: 1728 },
  { grade: 'Lance Corporal', gross: 29850, penPct: 0, desc: 'Junior NCO', th: 24980, mo: 2081 },
  { grade: 'Corporal', gross: 32234, penPct: 0, desc: 'Section Leader', th: 26728, mo: 2227 },
  { grade: 'Sergeant', gross: 38845, penPct: 0, desc: 'Senior NCO', th: 31488, mo: 2624 },
  { grade: 'Staff Sergeant', gross: 43100, penPct: 0, desc: 'Senior NCO', th: 34560, mo: 2880 },
  { grade: 'Warrant Officer 2', gross: 47480, penPct: 0, desc: 'Senior WO', th: 37705, mo: 3142 },
  { grade: '2nd Lieutenant', gross: 31500, penPct: 0, desc: 'Graduate Entry', th: 26180, mo: 2182 },
  { grade: 'Lieutenant', gross: 42681, penPct: 0, desc: 'Junior Officer', th: 34250, mo: 2854 },
  { grade: 'Captain', gross: 51923, penPct: 0, desc: 'Mid Officer', th: 40673, mo: 3389 },
  { grade: 'Major', gross: 62282, penPct: 0, desc: 'Senior Officer', th: 46681, mo: 3890 }
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

// --- SHARED COMPONENTS ---
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
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontFamily: 'JetBrains Mono' }}>© 2026 TaxdCalc | Armed Forces Pay Review Body (AFPRB) Data</span>
      </div>
    </footer>
  );
}

// --- MAIN PAGE ---
export default function Page() {
  const mob = useW() < 640;

  return (
    <>
      <style>{GS}</style>
      <Nav />
      
      {/* 1. Header & Hero */}
      <div style={{ background: `linear-gradient(135deg,${C.navy},${C.navyMid})`, padding: mob ? '32px 20px 48px' : '48px 24px 64px', color: 'white' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: 'rgba(20,184,166,0.15)', border: '1px solid rgba(20,184,166,0.3)', borderRadius: 20, padding: '4px 12px', fontSize: 11, color: '#14B8A6', marginBottom: 12, fontFamily: 'JetBrains Mono' }}>Updated for FY 2026-27</div>
          <h1 style={{ fontFamily: 'DM Serif Display', fontSize: mob ? 28 : 42, lineHeight: 1.1, marginBottom: 16 }}>Armed Forces Pay Scales & Take-Home</h1>
          <p style={{ fontSize: mob ? 15 : 18, color: 'rgba(255,255,255,0.7)', maxWidth: 650, lineHeight: 1.6 }}>
            A comprehensive guide to British Military pay for 2026. Explore salaries, the 14.5% X-Factor, and AFPS 2015 pension benefits.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: mob ? '16px' : '24px', marginTop: mob ? -20 : -30 }}>
        
        {/* 2. Primary Table */}
        <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, boxShadow: C.shadow, overflow: 'hidden', marginBottom: 24 }} className="fi">
          <div style={{ padding: '20px', borderBottom: `1px solid ${C.border}` }}>
            <h2 style={{ fontFamily: 'DM Serif Display', fontSize: 20, color: C.navy }}>2026/27 Pay Table</h2>
            <p style={{ fontSize: 13, color: C.slate }}>Estimated net pay after UK Income Tax (Standard Code) and National Insurance.</p>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead style={{ background: C.bg }}>
                <tr>
                  {['Rank', 'Gross Pay', 'Annual Net', 'Monthly Net', 'Details'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: 10, textTransform: 'uppercase', color: C.slate, fontFamily: 'JetBrains Mono' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {GRADES.map((g, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: C.navy }}>{g.grade}</td>
                    <td style={{ padding: '14px 16px', fontFamily: 'JetBrains Mono' }}>{fmt(g.gross)}</td>
                    <td style={{ padding: '14px 16px', fontFamily: 'JetBrains Mono', color: C.teal, fontWeight: 700 }}>{fmt(g.th)}</td>
                    <td style={{ padding: '14px 16px', fontFamily: 'JetBrains Mono', color: C.teal, fontWeight: 700 }}>{fmtD(g.mo)}</td>
                    <td style={{ padding: '14px 16px', fontSize: 11, color: C.sl }}>{g.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. The X-Factor Explanation */}
        <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1.5fr 1fr', gap: 20, marginBottom: 24 }}>
          <div style={{ background: C.white, padding: 24, borderRadius: 12, border: `1px solid ${C.border}` }}>
            <h3 style={{ fontFamily: 'DM Serif Display', fontSize: 18, color: C.navy, marginBottom: 12 }}>What is the "X-Factor"?</h3>
            <p style={{ fontSize: 14, color: C.mid, lineHeight: 1.7, marginBottom: 12 }}>
              The X-Factor is an addition to basic pay that reflects the unique challenges of military life compared to civilian employment. As of 2026, it remains at <strong>14.5%</strong> for most regular personnel.
            </p>
            <ul style={{ fontSize: 13, color: C.mid, paddingLeft: 18, lineHeight: 1.8 }}>
              <li><strong>Turbulence:</strong> Frequent moves and separation from family.</li>
              <li><strong>Danger:</strong> Exposure to physical risk in combat or training.</li>
              <li><strong>Discipline:</strong> Subject to military law 24/7.</li>
            </ul>
          </div>
          <div style={{ background: C.tealBg, padding: 24, borderRadius: 12, border: `1px solid ${C.tealBd}` }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: C.teal, marginBottom: 8 }}>Estimated Deductions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ borderBottom: `1px solid ${C.tealBd}`, pb: 8 }}>
                <span style={{ fontSize: 11, color: '#0f766e', display: 'block' }}>Daily Food Charge</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: C.navy }}>£10.20 - £12.50</span>
              </div>
              <div>
                <span style={{ fontSize: 11, color: '#0f766e', display: 'block' }}>SLA/SFA (Grade 1)</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: C.navy }}>Variable by Type</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Pension Section */}
        <div style={{ background: C.navy, color: 'white', borderRadius: 12, padding: 32, marginBottom: 24 }}>
          <div style={{ maxWidth: 600 }}>
            <h3 style={{ fontFamily: 'DM Serif Display', fontSize: 22, marginBottom: 12 }}>AFPS 15 Pension Scheme</h3>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: 20 }}>
              The Armed Forces Pension Scheme 2015 is a non-contributory, defined benefit scheme. You do not pay into it from your gross salary; the Ministry of Defence funds it entirely.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: 12, borderRadius: 8 }}>
                <span style={{ fontSize: 10, textTransform: 'uppercase', color: '#14B8A6' }}>Accrual Rate</span>
                <div style={{ fontSize: 18, fontWeight: 700 }}>1/47th</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: 12, borderRadius: 8 }}>
                <span style={{ fontSize: 10, textTransform: 'uppercase', color: '#14B8A6' }}>Retirement Age</span>
                <div style={{ fontSize: 18, fontWeight: 700 }}>60 (Active)</div>
              </div>
            </div>
          </div>
        </div>

        {/* 5. FAQs */}
        <div style={{ padding: '20px 0' }}>
          <h3 style={{ fontFamily: 'DM Serif Display', fontSize: 22, color: C.navy, marginBottom: 16 }}>Frequently Asked Questions</h3>
          {[
            ['Does military pay include Council Tax?', 'Personnel living in SFA pay a Contribution in Lieu of Council Tax (CILOCT), which is usually lower than standard civilian rates.'],
            ['Is the salary the same across branches?', 'Yes, the core pay scales for the Army, RAF, and Royal Navy are harmonised by the AFPRB, though specialist pay (diving, flying, parachuting) varies.'],
            ['When does military pay increase?', 'Pay awards are typically announced in the spring and backdated to April 1st each year.']
          ].map(([q, a], i) => (
            <div key={i} style={{ marginBottom: 16, borderBottom: `1px solid ${C.border}`, paddingBottom: 16 }}>
              <div style={{ fontWeight: 700, color: C.navy, fontSize: 15, marginBottom: 4 }}>{q}</div>
              <div style={{ fontSize: 14, color: C.mid, lineHeight: 1.6 }}>{a}</div>
            </div>
          ))}
        </div>

      </div>
      <Footer />
    </>
  );
}
