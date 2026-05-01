'use client';
import { useState } from 'react';
import Link from 'next/link';

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
  { rate: 200,  slug: '200-day-rate-take-home',  salary: 44000  },
  { rate: 250,  slug: '250-day-rate-take-home',  salary: 55000  },
  { rate: 300,  slug: '300-day-rate-take-home',  salary: 66000  },
  { rate: 350,  slug: '350-day-rate-take-home',  salary: 77000  },
  { rate: 400,  slug: '400-day-rate-take-home',  salary: 88000  },
  { rate: 450,  slug: '450-day-rate-take-home',  salary: 99000  },
  { rate: 500,  slug: '500-day-rate-take-home',  salary: 110000 },
  { rate: 550,  slug: '550-day-rate-take-home',  salary: 121000 },
  { rate: 600,  slug: '600-day-rate-take-home',  salary: 132000 },
  { rate: 650,  slug: '650-day-rate-take-home',  salary: 143000 },
  { rate: 700,  slug: '700-day-rate-take-home',  salary: 154000 },
  { rate: 750,  slug: '750-day-rate-take-home',  salary: 165000 },
  { rate: 800,  slug: '800-day-rate-take-home',  salary: 176000 },
  { rate: 1000, slug: '1000-day-rate-take-home', salary: 220000 },
];

const GS = `@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Source+Serif+4:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}body{background:#F4F6F9;color:#1E293B;font-family:'Source Serif 4',Georgia,serif;-webkit-tap-highlight-color:transparent;}a{text-decoration:none;color:inherit;}button{cursor:pointer;font-family:inherit;}@keyframes fi{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}.fi{animation:fi 0.35s ease both;}`;

function Nav(){return(<nav style={{background:'#0C1E3C',position:'sticky',top:0,zIndex:100,boxShadow:'0 2px 16px rgba(0,0,0,0.25)'}}><div style={{maxWidth:1100,margin:'0 auto',padding:'0 20px',height:56,display:'flex',alignItems:'center',justifyContent:'space-between'}}><Link href="/" style={{display:'flex',alignItems:'center',gap:9}}><div style={{width:30,height:30,background:'linear-gradient(135deg,#0D9488,#14B8A6)',borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{color:'white',fontWeight:700,fontSize:12,fontFamily:'JetBrains Mono'}}>Tx</span></div><span style={{color:'white',fontFamily:'DM Serif Display',fontSize:17}}>Taxd<span style={{color:'#14B8A6'}}>Calc</span></span></Link><div style={{display:'flex',gap:2}}>{[['/','Salary'],['/ir35','IR35'],['/nhs','NHS'],['/public-sector-pay','Public Sector'],['/blog','Guides']].map(([h,l])=><Link key={h} href={h} style={{padding:'7px 11px',borderRadius:6,color:'rgba(255,255,255,0.6)',fontSize:12}}>{l}</Link>)}</div></div></nav>);}

function Footer(){return(<footer style={{background:'#070D1C',padding:'40px 24px 28px',borderTop:'1px solid rgba(255,255,255,0.06)'}}><div style={{maxWidth:1100,margin:'0 auto'}}><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:'28px 24px',marginBottom:28}}><div><div style={{fontSize:10,color:'rgba(255,255,255,0.28)',letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:12,fontFamily:'JetBrains Mono',fontWeight:600}}>Core Tools</div>{[['/','Salary Calculator'],['/ir35','IR35 Calculator'],['/nhs','NHS Pay Bands'],['/hourly','Hourly Rate'],['/bonus','Bonus Tax'],['/sacrifice','Salary Sacrifice'],['/comparison','Job Comparison'],['/maternity','Maternity Pay'],['/part-time-salary-calculator','Part-Time Pay']].map(([h,l])=><Link key={h} href={h} style={{display:'block',fontSize:12,color:'rgba(255,255,255,0.42)',marginBottom:7,lineHeight:1.4}}>{l}</Link>)}</div><div><div style={{fontSize:10,color:'rgba(255,255,255,0.28)',letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:12,fontFamily:'JetBrains Mono',fontWeight:600}}>Tax Planning</div>{[['/blog/60-percent-tax-trap','60% Tax Trap'],['/blog/hicbc-child-benefit-charge','Child Benefit Taper'],['/blog/personal-allowance-taper-100k','£100k PA Taper'],['/blog/plan-5-student-loan-take-home','Plan 5 Student Loan'],['/blog/pension-tax-relief-your-free-money','Pension Tax Relief']].map(([h,l])=><Link key={h} href={h} style={{display:'block',fontSize:12,color:'rgba(255,255,255,0.42)',marginBottom:7,lineHeight:1.4}}>{l}</Link>)}</div><div><div style={{fontSize:10,color:'rgba(255,255,255,0.28)',letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:12,fontFamily:'JetBrains Mono',fontWeight:600}}>Contractor</div>{[['/contractor-pay','Contractor Pay Hub'],['/ir35','IR35 Calculator'],['/300-day-rate-take-home','£300/day Take-Home'],['/400-day-rate-take-home','£400/day Take-Home'],['/500-day-rate-take-home','£500/day Take-Home'],['/600-day-rate-take-home','£600/day Take-Home']].map(([h,l])=><Link key={h} href={h} style={{display:'block',fontSize:12,color:'rgba(255,255,255,0.42)',marginBottom:7,lineHeight:1.4}}>{l}</Link>)}</div><div><div style={{fontSize:10,color:'rgba(255,255,255,0.28)',letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:12,fontFamily:'JetBrains Mono',fontWeight:600}}>Guides</div>{[['/blog','All Tax Guides'],['/blog/ir35-inside-outside-calculator-2026','IR35 Explained'],['/blog/salary-sacrifice-electric-car-uk-2026','EV Salary Sacrifice'],['/blog/pension-tax-relief-your-free-money','Pension Tax Relief'],['/tools','All Tools']].map(([h,l])=><Link key={h} href={h} style={{display:'block',fontSize:12,color:'rgba(255,255,255,0.42)',marginBottom:7,lineHeight:1.4}}>{l}</Link>)}</div></div><div style={{borderTop:'1px solid rgba(255,255,255,0.07)',paddingTop:20,display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:12,alignItems:'center'}}><Link href="/" style={{display:'flex',alignItems:'center',gap:9}}><div style={{width:28,height:28,background:'linear-gradient(135deg,#0D9488,#14B8A6)',borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{color:'white',fontWeight:700,fontSize:12,fontFamily:'JetBrains Mono'}}>Tx</span></div><span style={{color:'white',fontFamily:'DM Serif Display',fontSize:16}}>Taxd<span style={{color:'#14B8A6'}}>Calc</span></span></Link><span style={{fontSize:11,color:'rgba(255,255,255,0.22)',fontFamily:'JetBrains Mono'}}>Updated April 2026 · 2026-27 rates</span><span style={{fontSize:11,color:'rgba(255,255,255,0.18)',maxWidth:320,lineHeight:1.6}}>For guidance only. Consult HMRC or a qualified adviser.</span></div></div></footer>);}

export default function ContractorPayPage() {
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

      <div style={{ background: '#F0FDFA', borderBottom: '1px solid #99F6E4', padding: '16px 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ fontSize: 10, color: '#0D9488', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'JetBrains Mono', marginBottom: 6 }}>Quick Answer — 2026-27</div>
          <p style={{ fontSize: 15, color: '#0f766e', lineHeight: 1.6, fontWeight: 600 }}>
            A £400/day contractor <strong>outside IR35</strong> takes home approx <strong>£65,000/year</strong> via Ltd Co vs <strong>~£59,000 inside IR35</strong> (PAYE, 5% pension). Dividend tax rises to 10.75% from April 2026.
          </p>
        </div>
      </div>

      <div style={{ background: 'linear-gradient(135deg,#0C1E3C,#1e3d6e)', padding: '34px 24px 46px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <Link href="/" style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Home</Link>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>›</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>Contractor Pay 2026-27</span>
          </div>
          <h1 style={{ fontFamily: 'DM Serif Display', fontSize: 32, color: 'white', lineHeight: 1.2, marginBottom: 10 }}>Contractor Pay UK 2026-27</h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, maxWidth: 640, marginBottom: 16 }}>
            IR35 status, day-rate take-home, and contractor tax planning. Updated for the April 2026 dividend tax increase to 10.75% and the 15% employer NI rate.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link href="/" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '8px 16px', borderRadius: 7, fontSize: 12, fontWeight: 600, border: '1px solid rgba(255,255,255,0.15)' }}>← Home</Link>
            <Link href="/ir35" style={{ background: '#0D9488', color: 'white', padding: '8px 16px', borderRadius: 7, fontSize: 12, fontWeight: 700 }}>IR35 Calculator</Link>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 24px 56px' }}>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 14, marginBottom: 32 }} className="fi">
          <Link href="/ir35" style={{ background: '#FFFFFF', border: '1.5px solid #99F6E4', borderRadius: 12, padding: 22, display: 'block', boxShadow: '0 1px 3px rgba(0,0,0,0.07),0 4px 16px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 10, color: '#0D9488', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'JetBrains Mono', marginBottom: 6 }}>Interactive Calculator</div>
            <div style={{ fontFamily: 'DM Serif Display', fontSize: 22, color: '#0C1E3C', marginBottom: 6 }}>IR35 Inside vs Outside</div>
            <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.7, marginBottom: 14 }}>Enter your day rate and days/year. See exact take-home for PAYE inside IR35 versus Limited Company outside IR35, side by side.</div>
            <span style={{ display: 'inline-block', background: '#0D9488', color: 'white', padding: '9px 18px', borderRadius: 7, fontSize: 12, fontWeight: 700 }}>Open IR35 calculator →</span>
          </Link>
          <Link href="/blog/ir35-inside-outside-calculator-2026" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: 22, display: 'block', boxShadow: '0 1px 3px rgba(0,0,0,0.07),0 4px 16px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 10, color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'JetBrains Mono', marginBottom: 6 }}>In-depth Guide</div>
            <div style={{ fontFamily: 'DM Serif Display', fontSize: 22, color: '#0C1E3C', marginBottom: 6 }}>IR35 Explained 2026-27</div>
            <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.7 }}>How IR35 works, the April 2026 dividend tax rise to 10.75%, and the exact numbers for common day rates. Updated for 2026-27.</div>
          </Link>
        </div>

        <h2 style={{ fontFamily: 'DM Serif Display', fontSize: 22, color: '#0C1E3C', marginBottom: 4 }}>Day-Rate Take-Home (PAYE, 220 days)</h2>
        <p style={{ fontSize: 13, color: '#64748B', marginBottom: 16 }}>Annualised at 220 working days with 5% pension. Click any rate for a full breakdown with pension and student loan adjustments.</p>

        <div style={{ overflowX: 'auto', marginBottom: 32 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 380, background: '#FFFFFF', borderRadius: 10, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.07),0 4px 16px rgba(0,0,0,0.04)' }}>
            <thead>
              <tr style={{ background: '#0C1E3C' }}>
                {['Day Rate', 'Annualised', 'Take-Home/yr', 'Take-Home/mo', 'Details'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: 'rgba(255,255,255,0.8)', fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DAY_RATES.map(({ rate, slug, salary }, i) => {
                const th = calcTH(salary);
                return (
                  <tr key={rate} style={{ borderBottom: '1px solid #E2E8F0', background: i % 2 === 0 ? '#FFFFFF' : '#FAFBFC' }}>
                    <td style={{ padding: '10px 14px', fontFamily: 'JetBrains Mono', fontWeight: 700, color: '#0C1E3C' }}>{fmt(rate)}/day</td>
                    <td style={{ padding: '10px 14px', color: '#475569' }}>{fmt(salary)}/yr</td>
                    <td style={{ padding: '10px 14px', fontFamily: 'JetBrains Mono', color: '#0D9488', fontWeight: 700 }}>{fmt(th)}</td>
                    <td style={{ padding: '10px 14px', color: '#475569' }}>{fmt(Math.round(th / 12))}/mo</td>
                    <td style={{ padding: '10px 14px' }}>
                      <Link href={`/${slug}`} style={{ color: '#0D9488', fontWeight: 700, fontSize: 12 }}>Full breakdown →</Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 12 }}>
          <Link href="/blog/salary-sacrifice-electric-car-uk-2026" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 10, padding: '16px 18px', display: 'block', boxShadow: '0 1px 3px rgba(0,0,0,0.07),0 4px 16px rgba(0,0,0,0.04)' }}>
            <div style={{ fontFamily: 'DM Serif Display', fontSize: 17, color: '#0C1E3C', marginBottom: 4 }}>EV Salary Sacrifice 2026-27</div>
            <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.6 }}>3% BiK on electric cars makes EV salary sacrifice highly efficient. A £400/month car costs a basic rate taxpayer only £288/month.</div>
          </Link>
          <Link href="/blog/pension-tax-relief-your-free-money" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 10, padding: '16px 18px', display: 'block', boxShadow: '0 1px 3px rgba(0,0,0,0.07),0 4px 16px rgba(0,0,0,0.04)' }}>
            <div style={{ fontFamily: 'DM Serif Display', fontSize: 17, color: '#0C1E3C', marginBottom: 4 }}>Pension Tax Relief Guide</div>
            <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.6 }}>Salary sacrifice saves income tax AND NI. For a 40% taxpayer, £80 costs only £60 net. The most efficient way to reduce your tax bill.</div>
          </Link>
        </div>

      </div>
      <Footer />
    </>
  );
}
