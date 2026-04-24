'use client';'use client';
import { useState } from 'react';
import Link from 'next/link';

const GS=`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Source+Serif+4:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}body{background:#F4F6F9;color:#1E293B;font-family:'Source Serif 4',Georgia,serif;-webkit-tap-highlight-color:transparent;}a{text-decoration:none;color:inherit;}button{cursor:pointer;font-family:inherit;}@keyframes fi{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}.fi{animation:fi 0.35s ease both;}`;
const fmt=n=>'\u00A3'+Math.round(n).toLocaleString('en-GB');
const fmtD=n=>'\u00A3'+n.toLocaleString('en-GB',{minimumFractionDigits:2,maximumFractionDigits:2});
const GRADES=[{rank:'Private / Able Rating L1',gross:23907,pen:4.5,th:19872,mo:1656,desc:'Entry — other ranks'},{rank:'Private / AB Level 5 (competent)',gross:27698,pen:4.5,th:22465,mo:1872,desc:'Competent other rank'},{rank:'Corporal / Leading Rate',gross:32234,pen:4.5,th:25568,mo:2131,desc:'Junior NCO'},{rank:'Sergeant / Petty Officer',gross:38845,pen:4.5,th:30090,mo:2507,desc:'Senior NCO'},{rank:'Warrant Officer Class 2',gross:47480,pen:4.5,th:35996,mo:3000,desc:'Senior Warrant Officer'},{rank:'2nd Lieutenant / Midshipman',gross:34614,pen:4.5,th:27196,mo:2266,desc:'Junior commissioned officer'},{rank:'Lieutenant / Flying Officer',gross:42681,pen:4.5,th:32713,mo:2726,desc:'Mid-rank officer'},{rank:'Captain / Flight Lieutenant',gross:51923,pen:4.5,th:39134,mo:3261,desc:'Company/squadron level'},{rank:'Major / Squadron Leader',gross:62282,pen:4.5,th:44999,mo:3750,desc:'Senior officer'}];
function Nav(){const[open,setOpen]=useState(false);return(<nav style={{background:'#0C1E3C',position:'sticky',top:0,zIndex:100,boxShadow:'0 2px 16px rgba(0,0,0,0.25)'}}><div style={{maxWidth:1100,margin:'0 auto',padding:'0 20px',height:56,display:'flex',alignItems:'center',justifyContent:'space-between'}}><Link href="/" style={{display:'flex',alignItems:'center',gap:9}}><div style={{width:30,height:30,background:'linear-gradient(135deg,#0D9488,#14B8A6)',borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{color:'white',fontWeight:700,fontSize:12,fontFamily:'JetBrains Mono'}}>Tx</span></div><span style={{color:'white',fontFamily:'DM Serif Display',fontSize:17}}>Taxd<span style={{color:'#14B8A6'}}>Calc</span></span></Link><div style={{display:'flex',gap:2}}>{[['/','Salary'],['/ir35','IR35'],['/nhs','NHS'],['/public-sector-pay','Public Sector'],['/blog','Guides']].map(([h,l])=><Link key={h} href={h} style={{padding:'7px 11px',borderRadius:6,color:'rgba(255,255,255,0.6)',fontSize:12}}>{l}</Link>)}</div></div></nav>);}
function Footer(){return(<footer style={{background:'#070D1C',padding:'40px 24px 28px',borderTop:'1px solid rgba(255,255,255,0.06)'}}><div style={{maxWidth:1100,margin:'0 auto'}}><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:'28px 24px',marginBottom:28}}><div><div style={{fontSize:10,color:'rgba(255,255,255,0.28)',letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:12,fontFamily:'JetBrains Mono',fontWeight:600}}>Core Tools</div>{[['/','Salary Calculator'],['/ir35','IR35 Calculator'],['/nhs','NHS Pay Bands'],['/hourly','Hourly Rate'],['/bonus','Bonus Tax'],['/sacrifice','Salary Sacrifice'],['/comparison','Job Comparison'],['/maternity','Maternity Pay'],['/part-time-salary-calculator','Part-Time Pay']].map(([h,l])=><Link key={h} href={h} style={{display:'block',fontSize:12,color:'rgba(255,255,255,0.42)',marginBottom:7,lineHeight:1.4}}>{l}</Link>)}</div><div><div style={{fontSize:10,color:'rgba(255,255,255,0.28)',letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:12,fontFamily:'JetBrains Mono',fontWeight:600}}>Tax Planning</div>{[['/blog/60-percent-tax-trap','60% Tax Trap'],['/blog/hicbc-child-benefit-charge','Child Benefit Taper'],['/blog/personal-allowance-taper-100k','\u00a3100k PA Taper'],['/blog/plan-5-student-loan-take-home','Plan 5 Student Loan'],['/blog/pension-tax-relief-your-free-money','Pension Tax Relief']].map(([h,l])=><Link key={h} href={h} style={{display:'block',fontSize:12,color:'rgba(255,255,255,0.42)',marginBottom:7,lineHeight:1.4}}>{l}</Link>)}</div><div><div style={{fontSize:10,color:'rgba(255,255,255,0.28)',letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:12,fontFamily:'JetBrains Mono',fontWeight:600}}>Public Sector</div>{[['/nhs-pay-guide','NHS Pay Guide'],['/teacher-pay-guide','Teacher Pay Guide'],['/public-sector-pay','Public Sector Hub'],['/public-sector-pay/police','Police Pay'],['/public-sector-pay/firefighters','Firefighter Pay'],['/public-sector-pay/civil-service','Civil Service Pay'],['/public-sector-pay/armed-forces','Armed Forces Pay'],['/public-sector-pay/council-workers','Council Workers Pay']].map(([h,l])=><Link key={h} href={h} style={{display:'block',fontSize:12,color:'rgba(255,255,255,0.42)',marginBottom:7,lineHeight:1.4}}>{l}</Link>)}</div><div><div style={{fontSize:10,color:'rgba(255,255,255,0.28)',letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:12,fontFamily:'JetBrains Mono',fontWeight:600}}>Guides</div>{[['/blog','All Tax Guides'],['/blog/45000-salary-take-home-uk-2026','\u00a345k Salary Guide'],['/blog/50000-salary-after-tax-uk-2026','\u00a350k Salary Guide'],['/maternity-pay-self-employed','Self-Employed Maternity'],['/tools','All Tools']].map(([h,l])=><Link key={h} href={h} style={{display:'block',fontSize:12,color:'rgba(255,255,255,0.42)',marginBottom:7,lineHeight:1.4}}>{l}</Link>)}</div></div><div style={{borderTop:'1px solid rgba(255,255,255,0.07)',paddingTop:20,display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:12,alignItems:'center'}}><Link href="/" style={{display:'flex',alignItems:'center',gap:9}}><div style={{width:28,height:28,background:'linear-gradient(135deg,#0D9488,#14B8A6)',borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{color:'white',fontWeight:700,fontSize:12,fontFamily:'JetBrains Mono'}}>Tx</span></div><span style={{color:'white',fontFamily:'DM Serif Display',fontSize:16}}>Taxd<span style={{color:'#14B8A6'}}>Calc</span></span></Link><span style={{fontSize:11,color:'rgba(255,255,255,0.22)',fontFamily:'JetBrains Mono'}}>Updated April 2026 \u00b7 2026-27 rates</span><span style={{fontSize:11,color:'rgba(255,255,255,0.18)',maxWidth:320,lineHeight:1.6}}>For guidance only. Consult HMRC or a qualified adviser.</span></div></div></footer>);}
function FAQItem({q,a}){const[open,setOpen]=useState(false);return(<div style={{borderBottom:'1px solid #E2E8F0'}}><button onClick={()=>setOpen(!open)} style={{width:'100%',textAlign:'left',padding:'14px 0',background:'none',border:'none',display:'flex',justifyContent:'space-between',gap:12}}><span style={{fontSize:14,fontWeight:700,color:'#0C1E3C',lineHeight:1.4,flex:1}}>{q}</span><span style={{color:'#0D9488',fontSize:18,fontWeight:700,transition:'transform 0.2s',display:'inline-block',transform:open?'rotate(45deg)':'none',flexShrink:0}}>+</span></button>{open&&<div style={{paddingBottom:14,fontSize:13,color:'#475569',lineHeight:1.8}}>{a}</div>}</div>);}

export default function Page(){
  const schemaFAQ={'@context':'https://schema.org','@type':'FAQPage',mainEntity:[{'@type':'Question',name:'What is armed forces take-home pay in 2026-27?',acceptedAnswer:{'@type':'Answer',text:'A Private on Level 1 (£23,907, including X-Factor) takes home £19,872/year (£1,656/month) after income tax and NI. A Sergeant (£38,845) takes home £30,090/year. A Captain (£51,923) takes home £39,134/year. A Major (£62,282) takes home £44,999/year.'}},{'@type':'Question',name:'What is the X-Factor allowance?',acceptedAnswer:{'@type':'Answer',text:'The X-Factor is a 14.5% supplement paid to all armed forces personnel on top of base pay, compensating for the unique demands of service life including separation from family, deployment, and the requirement to serve wherever directed. The X-Factor is already included in all AFPRB pay figures shown above.'}},{'@type':'Question',name:'What is the Armed Forces Pension Scheme 2015?',acceptedAnswer:{'@type':'Answer',text:'AFPS 2015 is a defined benefit career average scheme. Members build pension at 1/47.5 of pensionable pay each year, revalued annually with CPI. Normal Pension Age is 60. An Early Departure Payment is available at 18 years’ qualifying service.'}},{'@type':'Question',name:'Do armed forces pay income tax?',acceptedAnswer:{'@type':'Answer',text:'Yes. Armed forces pay is subject to UK income tax and National Insurance. When deployed on designated operations, Operational Tax Relief may exempt some pay from income tax — typically for the duration of the operation only.'}},{'@type':'Question',name:'Does food and accommodation affect armed forces take-home?',acceptedAnswer:{'@type':'Answer',text:'Yes. Many serving personnel receive food and accommodation in kind or receive allowances such as SAFA (Substitute Accommodation and Food Allowance). These reduce actual cost of living substantially. A Private living in has far lower living costs than civilian equivalents, making the effective real income higher than take-home alone suggests.'}}]};
  const schemaBreadcrumb={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'TaxdCalc',item:'https://taxdcal.co.uk'},{'@type':'ListItem',position:2,name:'Public Sector Pay',item:'https://taxdcal.co.uk/public-sector-pay'},{'@type':'ListItem',position:3,name:'Armed Forces Pay Guide 2026-27',item:'https://taxdcal.co.uk/public-sector-pay/armed-forces'}]};

  return(
    <>
      <style>{GS}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schemaFAQ)}}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schemaBreadcrumb)}}/>
      <Nav/>
      <div style={{background:'#F0FDFA',borderBottom:'1px solid #99F6E4',padding:'13px 24px'}}>
        <div style={{maxWidth:900,margin:'0 auto'}}><div style={{fontSize:10,color:'#0D9488',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',fontFamily:'JetBrains Mono',marginBottom:4}}>Quick Answer — 2026-27</div><p style={{fontSize:14,color:'#0f766e',fontWeight:600,lineHeight:1.6}}>A Private/Able Rating on Level 1 (£23,907) takes home £19,872/year (£1,656/month) after income tax and NI in 2026-27. The X-Factor allowance (14.5%) is already included in the AFPRB pay figures. A Captain (£51,923) takes home £39,134/year.</p></div>
      </div>
      <div style={{background:'linear-gradient(135deg,#422006,#78350F)',padding:'34px 24px 46px',position:'relative',overflow:'hidden'}}>
        <div style={{maxWidth:900,margin:'0 auto'}}>
          <div style={{display:'flex',gap:6,marginBottom:10,alignItems:'center',flexWrap:'wrap'}}><Link href="/public-sector-pay" style={{fontSize:12,color:'rgba(255,255,255,0.5)'}}>Public Sector</Link><span style={{color:'rgba(255,255,255,0.3)'}}>›</span><span style={{fontSize:12,color:'rgba(255,255,255,0.8)'}}>{'Armed Forces Pay Guide 2026-27'.split(' ')[0]} Pay</span></div>
          <h1 style={{fontFamily:'DM Serif Display',fontSize:34,color:'white',lineHeight:1.15,marginBottom:10}}>Armed Forces Pay Guide 2026-27</h1>
          <p style={{color:'rgba(255,255,255,0.55)',fontSize:15,maxWidth:560,lineHeight:1.65,marginBottom:16}}>AFPRB Scale — Other Ranks and Officers — take-home pay after income tax, NI and pension deductions. Updated April 2026.</p>
          <div style={{display:'flex',gap:10,flexWrap:'wrap'}}><Link href="/public-sector-pay" style={{background:'rgba(255,255,255,0.1)',color:'white',padding:'8px 16px',borderRadius:7,fontSize:12,fontWeight:600,border:'1px solid rgba(255,255,255,0.15)'}}>← All Public Sector</Link><Link href="/" style={{background:'#0D9488',color:'white',padding:'8px 16px',borderRadius:7,fontSize:12,fontWeight:700}}>Full Salary Calculator</Link></div>
        </div>
      </div>
      <div style={{maxWidth:900,margin:'0 auto',padding:'20px 24px 72px'}}>
        <div style={{background:'white',borderRadius:12,border:'1px solid #E2E8F0',boxShadow:'0 1px 3px rgba(0,0,0,0.07),0 4px 16px rgba(0,0,0,0.04)',marginBottom:16,overflow:'hidden'}} className="fi">
          <div style={{padding:'18px 20px 12px'}}><h2 style={{fontFamily:'DM Serif Display',fontSize:20,color:'#0C1E3C',marginBottom:4}}>Pay Scale — Take-Home Pay 2026-27</h2><p style={{fontSize:13,color:'#64748B'}}>After income tax, NI and pension. England and Wales.</p></div>
          <div style={{overflowX:'auto',WebkitOverflowScrolling:'touch'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:13,minWidth:500}}>
              <thead><tr style={{background:'#F4F6F9'}}>{['Grade/Rank','Gross','Take-Home/Year','Monthly Net','Pension','Role'].map(h=><th key={h} style={{textAlign:'left',padding:'10px 14px',color:'#64748B',fontSize:10,textTransform:'uppercase',letterSpacing:'0.06em',borderBottom:'1px solid #E2E8F0',fontFamily:'JetBrains Mono',whiteSpace:'nowrap'}}>{h}</th>)}</tr></thead>
              <tbody>{GRADES.map((g,i)=>(<tr key={g.rank} style={{borderBottom:'1px solid #E2E8F0',background:i%2===0?'transparent':'rgba(0,0,0,0.013)'}}><td style={{padding:'11px 14px',fontWeight:700,color:'#0C1E3C',whiteSpace:'nowrap'}}>{g.rank}</td><td style={{padding:'11px 14px',fontFamily:'JetBrains Mono',fontSize:12,color:'#475569',whiteSpace:'nowrap'}}>{'£'}{g.gross.toLocaleString('en-GB')}</td><td style={{padding:'11px 14px',fontFamily:'JetBrains Mono',fontWeight:700,color:'#0D9488',whiteSpace:'nowrap'}}>{'£'}{g.th.toLocaleString('en-GB')}</td><td style={{padding:'11px 14px',fontFamily:'JetBrains Mono',fontWeight:700,color:'#0D9488',whiteSpace:'nowrap'}}>{'£'}{g.mo.toLocaleString('en-GB',{minimumFractionDigits:2,maximumFractionDigits:2})}</td><td style={{padding:'11px 14px',fontFamily:'JetBrains Mono',fontSize:11,color:'#64748B',whiteSpace:'nowrap'}}>{g.pen}%</td><td style={{padding:'11px 14px',fontSize:12,color:'#64748B'}}>{g.desc}</td></tr>))}</tbody>
            </table>
          </div>
        </div>
        <div style={{background:'white',borderRadius:12,padding:'20px 22px',border:'1px solid #E2E8F0',boxShadow:'0 1px 3px rgba(0,0,0,0.07)',marginBottom:16}}>
          <h2 style={{fontFamily:'DM Serif Display',fontSize:20,color:'#0C1E3C',marginBottom:8}}>Armed Forces Pension Scheme 2015 (AFPS 2015)</h2>
          <p style={{fontSize:14,color:'#475569',lineHeight:1.8,marginBottom:14}}>AFPS 2015 is a defined benefit career average scheme. Members accrue pension at 1/47.5 of pensionable earnings each year, revalued annually. Normal Pension Age is 60 for most members. The X-Factor allowance (14.5%) — included in all AFPRB figures — compensates for the unique demands of service life.</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))',gap:10,marginBottom:12}}>{[['Employee contribution','Contribution rate set annually'],['Employer contribution','~26% of salary (estimated)'],['Normal Pension Age','60 years'],['Scheme type','Defined Benefit CARE'],['X-Factor included','Yes — 14.5% in AFPRB rates'],['Early Departure','Payment at 18 years’ service']].map(([l,v])=><div key={l} style={{background:'#EFF6FF',border:'1px solid #BFDBFE',borderRadius:8,padding:'11px 14px'}}><div style={{fontSize:10,color:'#1D4ED8',textTransform:'uppercase',letterSpacing:'0.08em',fontFamily:'JetBrains Mono',marginBottom:4}}>{l}</div><div style={{fontSize:13,fontWeight:700,color:'#0C1E3C'}}>{v}</div></div>)}</div>
          <div style={{background:'#FFFBEB',border:'1px solid #FDE68A',borderRadius:8,padding:'12px 16px',fontSize:13,color:'#92400E',lineHeight:1.7}}>Armed forces personnel also typically receive food and accommodation in kind, or Substitute Accommodation and Food Allowance (SAFA) when living out. These benefits have significant financial value not reflected in gross salary figures.</div>
        </div>
        <div style={{background:'white',borderRadius:12,padding:'20px 22px',border:'1px solid #E2E8F0',boxShadow:'0 1px 3px rgba(0,0,0,0.07)',marginBottom:16}}>
          <h2 style={{fontFamily:'DM Serif Display',fontSize:20,color:'#0C1E3C',marginBottom:4}}>Frequently Asked Questions</h2>
          <p style={{fontSize:13,color:'#64748B',marginBottom:14}}>Common questions about armed forces pay.</p>
          {[{q:'What is armed forces take-home pay in 2026-27?',a:'A Private on Level 1 (£23,907, including X-Factor) takes home £19,872/year (£1,656/month) after income tax and NI. A Sergeant (£38,845) takes home £30,090/year. A Captain (£51,923) takes home £39,134/year. A Major (£62,282) takes home £44,999/year.'},{q:'What is the X-Factor allowance?',a:'The X-Factor is a 14.5% supplement paid to all armed forces personnel on top of base pay, compensating for the unique demands of service life including separation from family, deployment, and the requirement to serve wherever directed. The X-Factor is already included in all AFPRB pay figures shown above.'},{q:'What is the Armed Forces Pension Scheme 2015?',a:'AFPS 2015 is a defined benefit career average scheme. Members build pension at 1/47.5 of pensionable pay each year, revalued annually with CPI. Normal Pension Age is 60. An Early Departure Payment is available at 18 years’ qualifying service.'},{q:'Do armed forces pay income tax?',a:'Yes. Armed forces pay is subject to UK income tax and National Insurance. When deployed on designated operations, Operational Tax Relief may exempt some pay from income tax — typically for the duration of the operation only.'},{q:'Does food and accommodation affect armed forces take-home?',a:'Yes. Many serving personnel receive food and accommodation in kind or receive allowances such as SAFA (Substitute Accommodation and Food Allowance). These reduce actual cost of living substantially. A Private living in has far lower living costs than civilian equivalents, making the effective real income higher than take-home alone suggests.'}].map((f,i)=><FAQItem key={i} q={f.q} a={f.a}/>)}
        </div>
        <div style={{background:'white',borderRadius:12,padding:'16px 20px',border:'1px solid #E2E8F0',boxShadow:'0 1px 3px rgba(0,0,0,0.07)',marginBottom:16}}>
          <h3 style={{fontFamily:'DM Serif Display',fontSize:16,color:'#0C1E3C',marginBottom:12}}>Related Pay Guides</h3>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:8}}>
            {[['/public-sector-pay/police','Police Pay'],['/public-sector-pay/civil-service','Civil Service Pay'],['/public-sector-pay/council-workers','Council Workers Pay'],['/nhs-pay-guide','NHS Pay Guide'],['/','Salary Calculator'],['/blog/pension-tax-relief-your-free-money','Pension Tax Relief']].map(([h,l])=><Link key={h} href={h} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 13px',background:'#F4F6F9',borderRadius:8,border:'1px solid #E2E8F0',fontSize:13,fontWeight:600,color:'#0C1E3C'}}>{l}<span style={{color:'#0D9488'}}>→</span></Link>)}
          </div>
        </div>
        <div style={{background:'linear-gradient(135deg,#0C1E3C,#1e3d6e)',borderRadius:12,padding:'18px 22px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
          <div><div style={{fontFamily:'DM Serif Display',fontSize:16,color:'white',marginBottom:3}}>Calculate your exact take-home pay</div><div style={{fontSize:12,color:'rgba(255,255,255,0.45)'}}>Any salary — pension, student loan, Scotland rates</div></div>
          <Link href="/" style={{background:'#0D9488',color:'white',padding:'10px 20px',borderRadius:7,fontSize:13,fontWeight:700}}>Open Salary Calculator →</Link>
        </div>
      </div>
      <Footer/>
    </>
  );
}
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
