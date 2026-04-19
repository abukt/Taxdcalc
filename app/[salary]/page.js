'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

function useW(){const[w,setW]=useState(typeof window!=='undefined'?window.innerWidth:800);useEffect(()=>{const f=()=>setW(window.innerWidth);window.addEventListener('resize',f);return()=>window.removeEventListener('resize',f);},[]);return w;}

// ── TAX LOGIC 2026-27 ─────────────────────────────────────────────────────────
function calcIT(g,p=0,scot=false){
  const ti=Math.max(0,g-p);let pa=12570;
  if(ti>100000)pa=Math.max(0,12570-Math.floor((ti-100000)/2));
  const tx=Math.max(0,ti-pa);
  if(!scot){const b1=Math.min(tx,37700),b2=Math.min(Math.max(0,tx-b1),74870),b3=Math.max(0,tx-b1-b2);return b1*0.20+b2*0.40+b3*0.45;}
  const sb=[[0,3967,0.19],[3967,16956,0.20],[16956,31092,0.21],[31092,62430,0.42],[62430,112570,0.45],[112570,1e9,0.48]];
  let tax=0,rem=tx;for(const[lo,hi,rate]of sb){if(rem<=0)break;const avail=Math.max(0,Math.min(tx,hi)-lo);const used=Math.min(rem,avail);tax+=used*rate;rem-=used;}
  return Math.max(0,tax);
}
function calcNI(g){if(g<=12570)return 0;return(Math.min(g,50270)-12570)*0.08+Math.max(0,g-50270)*0.02;}
function calcLoan(g,p){const t={plan1:24990,plan2:27295,plan4:31395,plan5:25000};if(!p||p==='none'||!t[p]||g<=t[p])return 0;return(g-t[p])*0.09;}
function calc(g,pp=5,sl='none',scot=false){
  const pen=g*(pp/100),it=calcIT(g,pen,scot),ni=calcNI(g),loan=calcLoan(g,sl),th=g-it-ni-pen-loan;
  return{gross:g,it,ni,loan,pen,th,mo:th/12,wk:th/52,hr:th/(52*37.5),effRate:g>0?((it+ni)/g)*100:0};
}

// ── TRAP DETECTION ────────────────────────────────────────────────────────────
function detectTraps(g,pp,sl,kids){
  const pen=g*(pp/100),adj=g-pen,traps=[];
  if(adj>95000&&adj<=125140){
    const inTrap=adj>100000,toEscape=Math.max(0,adj-100000);
    const saved=inTrap?Math.round((calcIT(adj)-calcIT(adj,toEscape))+calcNI(adj)-calcNI(Math.max(0,adj-toEscape))):0;
    traps.push({id:'trap60',severity:inTrap?'critical':'warning',icon:inTrap?'🚨':'⚠️',
      headline:inTrap?`60% effective rate — you keep 28p of each extra pound (£${(adj-100000).toLocaleString('en-GB')} in the trap)`:`£${(100000-adj).toLocaleString('en-GB')} from the 60% tax trap`,
      detail:inTrap?`Sacrifice £${toEscape.toLocaleString('en-GB')} into pension to escape — saving approx £${saved.toLocaleString('en-GB')} in tax.`:`Above £100,000 the Personal Allowance is withdrawn — pension sacrifice prevents it.`,
      saving:saved,href:'/sacrifice',cta:'Calculate pension sacrifice'});
  }
  if(adj>60000&&kids>0){
    const cbr=[0,1331.60,2212.60,3093.60,3974.60],full=cbr[Math.min(kids,4)];
    const taper=Math.min(1,(adj-60000)/20000),charge=Math.round(full*taper);
    traps.push({id:'hicbc',severity:adj>75000?'critical':'warning',icon:'👶',
      headline:`Child Benefit taper: losing £${charge.toLocaleString('en-GB')}/year`,
      detail:`With ${kids} child${kids>1?'ren':''}, salary sacrifice below £60,000 recovers it.`,
      saving:charge,href:'/sacrifice',cta:'Recover Child Benefit'});
  }
  if(sl==='plan5'&&g>25000){
    const annual=Math.round((g-25000)*0.09);
    traps.push({id:'plan5',severity:g<30000?'critical':'warning',icon:'🎓',
      headline:`Plan 5: £${Math.round(annual/12).toLocaleString('en-GB')}/month repayment — 40-year write-off`,
      detail:`£${annual.toLocaleString('en-GB')}/year deducted. The 40-year write-off means high earners may benefit from overpayments.`,
      saving:0,href:'/blog/plan-5-student-loan-take-home',cta:'Plan 5 full guide'});
  }
  return traps;
}

// ── VALID SALARY REGISTRY ─────────────────────────────────────────────────────
const VALID=[20000,22000,25000,27000,28000,30000,32000,35000,38000,40000,42000,45000,48000,50000,55000,60000,65000,70000,75000,80000,85000,90000,95000,100000,105000,110000,120000,125000,150000];
const SPECIAL={'minimum-wage-take-home':{salary:26418,label:'Minimum Wage (£12.71/hr)'},'nhs-band-5-take-home':{salary:29970,label:'NHS Band 5 Entry'},'nhs-band-6-take-home':{salary:37338,label:'NHS Band 6 Entry'},'teacher-salary-take-home':{salary:32916,label:'NQT Teacher M1'},'graduate-salary-take-home':{salary:28000,label:'UK Graduate Average'}};

// ── FORMAT ────────────────────────────────────────────────────────────────────
const fmt=n=>'\u00A3'+Math.round(Math.abs(n||0)).toLocaleString('en-GB');
const fmtD=n=>'\u00A3'+(n||0).toLocaleString('en-GB',{minimumFractionDigits:2,maximumFractionDigits:2});
const pct=n=>n.toFixed(1)+'%';

// ── COLOURS ───────────────────────────────────────────────────────────────────
const C={navy:'#0C1E3C',navyM:'#1e3d6e',teal:'#0D9488',tealL:'#14B8A6',tealBg:'#F0FDFA',tealBd:'#99F6E4',amber:'#D97706',amberBg:'#FFFBEB',amberBd:'#FDE68A',red:'#DC2626',redBg:'#FEF2F2',redBd:'#FECACA',orange:'#EA580C',orgBg:'#FFF7ED',orgBd:'#FED7AA',green:'#059669',greenBg:'#ECFDF5',border:'#E2E8F0',borderDk:'#CBD5E1',bg:'#F4F6F9',white:'#FFFFFF',text:'#1E293B',mid:'#475569',slate:'#64748B',sl:'#94A3B8',shadow:'0 1px 3px rgba(0,0,0,0.07),0 4px 16px rgba(0,0,0,0.04)'};
const GS=`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Source+Serif+4:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}body{background:#F4F6F9;color:#1E293B;font-family:'Source Serif 4',Georgia,serif;-webkit-tap-highlight-color:transparent;}input[type=range]{-webkit-appearance:none;width:100%;height:4px;background:#CBD5E1;border-radius:2px;outline:none;}input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;border-radius:50%;background:#0C1E3C;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.2);}select{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2364748b' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;background-color:white;}@keyframes fi{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}.fi{animation:fi 0.35s ease both;}a{text-decoration:none;color:inherit;}button{cursor:pointer;font-family:inherit;}`;

function Nav(){const[open,setOpen]=useState(false);const mob=useW()<640;const links=[['/',   'Salary Calculator'],['/ir35','IR35'],['/nhs','NHS Bands'],['/tools','All Tools'],['/blog','Tax Guides']];return(<nav style={{background:C.navy,position:'sticky',top:0,zIndex:100,boxShadow:'0 2px 16px rgba(0,0,0,0.25)'}}><div style={{maxWidth:1100,margin:'0 auto',padding:'0 20px',height:56,display:'flex',alignItems:'center',justifyContent:'space-between'}}><Link href="/" style={{display:'flex',alignItems:'center',gap:9}}><div style={{width:30,height:30,background:'linear-gradient(135deg,#0D9488,#14B8A6)',borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><span style={{color:'white',fontWeight:700,fontSize:12,fontFamily:'JetBrains Mono'}}>Tx</span></div><span style={{color:'white',fontFamily:'DM Serif Display',fontSize:17}}>Taxd<span style={{color:'#14B8A6'}}>Calc</span></span></Link>{mob?(<button onClick={()=>setOpen(!open)} style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:7,padding:'8px 10px',display:'flex',flexDirection:'column',gap:4}}>{[0,1,2].map(i=><span key={i} style={{display:'block',width:18,height:2,background:'white',borderRadius:1,transition:'all 0.2s',transform:open&&i===0?'rotate(45deg) translate(4px,4px)':open&&i===2?'rotate(-45deg) translate(4px,-4px)':'none',opacity:open&&i===1?0:1}}/>)}</button>):(<div style={{display:'flex',gap:2,alignItems:'center'}}>{links.map(([href,label])=>(<Link key={href} href={href} style={{padding:'7px 13px',borderRadius:6,color:'rgba(255,255,255,0.6)',fontSize:13}}>{label}</Link>))}<span style={{fontSize:11,color:'#14B8A6',fontFamily:'JetBrains Mono',background:'rgba(13,148,136,0.15)',padding:'3px 9px',borderRadius:4,border:'1px solid rgba(20,184,166,0.3)',marginLeft:8}}>2026-27</span></div>)}</div>{mob&&open&&(<div style={{background:'#162d52',borderTop:'1px solid rgba(255,255,255,0.08)',padding:'6px 0 12px'}}>{links.map(([href,label])=>(<Link key={href} href={href} onClick={()=>setOpen(false)} style={{display:'block',padding:'12px 24px',color:'rgba(255,255,255,0.65)',fontSize:14}}>{label}</Link>))}</div>)}</nav>);}
function Footer(){return(<footer style={{background:'#070D1C',padding:'24px 20px',borderTop:'1px solid rgba(255,255,255,0.05)',marginTop:32}}><div style={{maxWidth:1000,margin:'0 auto',display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:14,alignItems:'center'}}><Link href="/" style={{display:'flex',alignItems:'center',gap:8}}><div style={{width:26,height:26,background:'linear-gradient(135deg,#0D9488,#14B8A6)',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{color:'white',fontWeight:700,fontSize:11,fontFamily:'JetBrains Mono'}}>Tx</span></div><span style={{color:'white',fontFamily:'DM Serif Display',fontSize:15}}>Taxd<span style={{color:'#14B8A6'}}>Calc</span></span></Link><div style={{display:'flex',gap:14,flexWrap:'wrap'}}>{[['/nhs-pay-guide','NHS Pay Guide'],['/teacher-pay-guide','Teacher Pay Guide'],['/part-time-salary-calculator','Part-Time Calculator'],['/blog','Tax Guides'],['/tools','All Tools']].map(([href,label])=>(<Link key={href} href={href} style={{fontSize:12,color:'rgba(255,255,255,0.35)'}}>{label}</Link>))}</div><span style={{fontSize:11,color:'rgba(255,255,255,0.18)',maxWidth:280,lineHeight:1.6}}>For guidance only. Consult HMRC or a qualified adviser. Updated April 2026.</span></div></footer>);}

// ── TRAP ALERT COMPONENT ──────────────────────────────────────────────────────
function TrapAlert({trap}){
  const[exp,setExp]=useState(false);
  const col=trap.severity==='critical'?{bg:C.redBg,bd:C.redBd,txt:C.red}:{bg:C.orgBg,bd:C.orgBd,txt:C.orange};
  return(
    <div style={{background:col.bg,border:`1.5px solid ${col.bd}`,borderRadius:10,padding:'13px 15px',marginBottom:8}}>
      <div style={{display:'flex',gap:8,alignItems:'flex-start'}}>
        <span style={{fontSize:16,flexShrink:0}}>{trap.icon}</span>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:13,fontWeight:700,color:col.txt,lineHeight:1.4,marginBottom:3}}>{trap.headline}</div>
          {exp&&<div style={{fontSize:12,color:C.mid,lineHeight:1.65,marginBottom:8}}>{trap.detail}</div>}
          <div style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'center',marginTop:4}}>
            {trap.saving>0&&<span style={{fontSize:10,background:col.bg,color:col.txt,border:`1px solid ${col.bd}`,borderRadius:3,padding:'2px 6px',fontWeight:700,fontFamily:'JetBrains Mono'}}>Save up to {fmt(trap.saving)}/yr</span>}
            <Link href={trap.href} style={{fontSize:11,color:col.txt,fontWeight:700,borderBottom:`1px solid ${col.bd}`}}>{trap.cta} →</Link>
            <button onClick={()=>setExp(!exp)} style={{fontSize:11,color:C.slate,background:'none',border:'none',padding:0}}>{exp?'Less':'Why?'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── COMPARISON MODULE ─────────────────────────────────────────────────────────
function ComparisonModule({salary,pension,loan}){
  const mob=useW()<640;
  const base=calc(salary,pension,loan);
  const payrise=calc(salary+5000,pension,loan);
  const pension10=calc(salary,10,loan);
  const plan5=calc(salary,pension,'plan5');
  const loanDelta=base.th-plan5.th;
  return(
    <div style={{background:C.white,borderRadius:12,padding:mob?16:22,border:`1px solid ${C.border}`,boxShadow:C.shadow,marginBottom:14}}>
      <h2 style={{fontFamily:'DM Serif Display',fontSize:mob?17:20,color:C.navy,marginBottom:4}}>What-If Comparisons</h2>
      <p style={{fontSize:12,color:C.slate,marginBottom:14}}>How different scenarios change your annual take-home pay.</p>
      <div style={{display:'grid',gridTemplateColumns:mob?'1fr':'repeat(3,1fr)',gap:12}}>
        {/* Pay rise */}
        <div style={{background:C.greenBg,border:`1px solid #6EE7B7`,borderRadius:10,padding:'14px 16px'}}>
          <div style={{fontSize:10,color:C.green,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:8,fontFamily:'JetBrains Mono'}}>+£5,000 pay rise</div>
          <div style={{fontSize:12,color:C.mid,marginBottom:6}}>Take-home increases by:</div>
          <div style={{fontFamily:'DM Serif Display',fontSize:28,color:C.green,lineHeight:1}}>{fmt(payrise.th-base.th)}</div>
          <div style={{fontSize:11,color:C.mid,marginTop:4,fontFamily:'JetBrains Mono'}}>+{fmt((payrise.th-base.th)/12)}/month</div>
          <div style={{marginTop:10,fontSize:11,color:C.mid,lineHeight:1.6}}>A {fmt(salary+5000)} salary takes home {fmt(payrise.th)}/yr vs {fmt(base.th)} now. You keep {Math.round(((payrise.th-base.th)/5000)*100)}p of each extra pound.</div>
        </div>
        {/* Pension 10% */}
        <div style={{background:C.tealBg,border:`1px solid ${C.tealBd}`,borderRadius:10,padding:'14px 16px'}}>
          <div style={{fontSize:10,color:C.teal,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:8,fontFamily:'JetBrains Mono'}}>Increase pension to 10%</div>
          <div style={{fontSize:12,color:C.mid,marginBottom:6}}>Take-home reduces by:</div>
          <div style={{fontFamily:'DM Serif Display',fontSize:28,color:C.teal,lineHeight:1}}>{fmt(base.th-pension10.th)}</div>
          <div style={{fontSize:11,color:C.mid,marginTop:4,fontFamily:'JetBrains Mono'}}>-{fmt((base.th-pension10.th)/12)}/month</div>
          <div style={{marginTop:10,fontSize:11,color:C.mid,lineHeight:1.6}}>But {fmt(salary*0.10)}/yr goes into your pension. Real cost = {fmt(base.th-pension10.th)} for {fmt(salary*0.10)} pension contribution.</div>
        </div>
        {/* Plan 5 */}
        <div style={{background:C.amberBg,border:`1px solid ${C.amberBd}`,borderRadius:10,padding:'14px 16px'}}>
          <div style={{fontSize:10,color:C.amber,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:8,fontFamily:'JetBrains Mono'}}>Plan 5 student loan</div>
          <div style={{fontSize:12,color:C.mid,marginBottom:6}}>Take-home reduces by:</div>
          <div style={{fontFamily:'DM Serif Display',fontSize:28,color:C.amber,lineHeight:1}}>{salary>25000?fmt(loanDelta):'£0'}</div>
          <div style={{fontSize:11,color:C.mid,marginTop:4,fontFamily:'JetBrains Mono'}}>{salary>25000?'-'+fmt(loanDelta/12)+'/month':'Not applicable'}</div>
          <div style={{marginTop:10,fontSize:11,color:C.mid,lineHeight:1.6}}>{salary>25000?`Plan 5 threshold is £25,000. You repay 9% on £${(salary-25000).toLocaleString('en-GB')} = ${fmt(loanDelta)}/yr.`:'Your salary is below the Plan 5 £25,000 threshold — no repayments.'}</div>
        </div>
      </div>
    </div>
  );
}

// ── FAQ SECTION ───────────────────────────────────────────────────────────────
function FAQSection({salary,r}){
  const[open,setOpen]=useState(null);
  const faqs=[
    {q:`What is the take-home pay on ${fmt(salary)} in the UK?`,a:`On ${fmt(salary)} with 5% pension and no student loan, take-home pay is ${fmt(r.th)} per year (${fmtD(r.mo)} per month) in 2026-27 after income tax of ${fmt(r.it)} and National Insurance of ${fmt(r.ni)}.`},
    {q:`How much income tax on ${fmt(salary)} in 2026-27?`,a:`On ${fmt(salary)} you pay ${fmt(r.it)} in income tax. Your effective income tax rate is ${pct(r.it/salary*100)}. ${salary<=50270?'You are within the 20% basic rate band — the 40% higher rate does not apply until £50,270.':'You pay 20% on earnings from £12,570 to £50,270, and 40% on earnings above £50,270.'}`},
    {q:`How much National Insurance on ${fmt(salary)}?`,a:`On ${fmt(salary)} you pay ${fmt(r.ni)} in National Insurance in 2026-27. NI is charged at 8% on earnings between £12,570 and £50,270, and 2% on earnings above that. Your effective NI rate is ${pct(r.ni/salary*100)}.`},
    {q:`What is the monthly take-home on ${fmt(salary)}?`,a:`Monthly take-home on ${fmt(salary)} is ${fmtD(r.mo)} with 5% pension. Monthly income tax is ${fmtD(r.it/12)} and monthly NI is ${fmtD(r.ni/12)}. Total monthly deductions are ${fmtD((r.it+r.ni+r.pen)/12)}.`},
    {q:`How can I increase my take-home pay on ${fmt(salary)}?`,a:`The most effective method is salary sacrifice pension contributions. Each pound sacrificed saves income tax (${salary>50270?'40':'20'}%) and National Insurance (8%), so the real cost to take-home is ${salary>50270?'52p':'72p'} per pound contributed. Increasing pension from 5% to 10% on ${fmt(salary)} reduces take-home by only ${fmt((r.th-calc(salary,10).th))} while adding ${fmt(salary*0.05)} to your pension.`},
  ];
  return(
    <div style={{background:C.white,borderRadius:12,padding:useW()<640?16:22,border:`1px solid ${C.border}`,boxShadow:C.shadow,marginBottom:14}}>
      <h2 style={{fontFamily:'DM Serif Display',fontSize:useW()<640?17:20,color:C.navy,marginBottom:4}}>Frequently Asked Questions</h2>
      <p style={{fontSize:12,color:C.slate,marginBottom:14}}>Common questions about {fmt(salary)} salary take-home pay in the UK.</p>
      {faqs.map((faq,i)=>(
        <div key={i} style={{borderBottom:i<faqs.length-1?`1px solid ${C.border}`:'none'}}>
          <button onClick={()=>setOpen(open===i?null:i)}
            style={{width:'100%',textAlign:'left',padding:'13px 0',background:'none',border:'none',display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:12}}>
            <span style={{fontSize:14,fontWeight:700,color:C.navy,lineHeight:1.4,flex:1}}>{faq.q}</span>
            <span style={{color:C.teal,fontSize:16,flexShrink:0,marginTop:2,fontWeight:700,transition:'transform 0.2s',transform:open===i?'rotate(45deg)':'none'}}>+</span>
          </button>
          {open===i&&(
            <div style={{padding:'0 0 14px',fontSize:13,color:C.mid,lineHeight:1.75}}>{faq.a}</div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function SalaryPage(){
  const params=useParams();const slug=params.salary;const mob=useW()<640;
  const special=SPECIAL[slug];
  const salaryNum=special?special.salary:(()=>{const m=slug&&slug.match(/^(\d+)-salary/);if(!m)return null;const n=parseInt(m[1],10);return VALID.includes(n)?n:null;})();

  if(!salaryNum){return(<><style>{GS}</style><Nav/><div style={{maxWidth:680,margin:'60px auto',padding:'0 24px',textAlign:'center'}}><h1 style={{fontFamily:'DM Serif Display',fontSize:32,color:C.navy,marginBottom:16}}>Page not found</h1><Link href="/" style={{color:C.teal}}>Open salary calculator</Link></div><Footer/></>);}

  const label=special?special.label:fmt(salaryNum);
  const[pension,setPension]=useState(5);
  const[loan,setLoan]=useState('none');
  const[scotland,setScotland]=useState(false);
  const[numChildren,setNumChildren]=useState(0);
  const[showFAQ,setShowFAQ]=useState(false);

  const r=calc(salaryNum,pension,loan,scotland);
  const traps=detectTraps(salaryNum,pension,loan,numChildren);
  const related=VALID.filter(s=>s!==salaryNum).slice(0,8);
  const blogLink=special?null:(`/blog/${salaryNum===45000?'45000':salaryNum===50000?'50000':salaryNum===40000?'40000':salaryNum===30000?'30000':null}-salary-${salaryNum<=50000?'take-home-uk-2026':null}`);

  // ── SCHEMA — separate scripts, never bundled in @graph ──────────────────────
  const schemaCalc={
    '@context':'https://schema.org','@type':'WebApplication',
    '@id':`https://taxdcal.co.uk/${slug}#calculator`,
    name:`${label} Take-Home Pay Calculator 2026-27`,
    description:`Calculate exact take-home pay on ${label} salary after income tax, NI, pension and student loan. 2026-27 UK rates including Scotland.`,
    applicationCategory:'FinanceApplication',operatingSystem:'Any',
    offers:{'@type':'Offer',price:'0',priceCurrency:'GBP'},
    provider:{'@type':'Organization',name:'TaxdCalc',url:'https://taxdcal.co.uk'},
    url:`https://taxdcal.co.uk/${slug}`,
  };
  const schemaFAQ={
    '@context':'https://schema.org','@type':'FAQPage',
    mainEntity:[
      {'@type':'Question',name:`What is the take-home pay on ${label} in the UK?`,acceptedAnswer:{'@type':'Answer',text:`On ${label} with 5% pension and no student loan, take-home pay is ${fmt(r.th)} per year (${fmtD(r.mo)} per month) in 2026-27 after income tax of ${fmt(r.it)} and National Insurance of ${fmt(r.ni)}.`}},
      {'@type':'Question',name:`How much income tax on ${label} in 2026-27?`,acceptedAnswer:{'@type':'Answer',text:`On ${label} in 2026-27 you pay ${fmt(r.it)} in income tax. Effective income tax rate: ${pct(r.it/salaryNum*100)}. ${salaryNum<=50270?'Entirely within the 20% basic rate band.':'Pays 20% up to £50,270 and 40% above.'}`}},
      {'@type':'Question',name:`How much National Insurance on ${label}?`,acceptedAnswer:{'@type':'Answer',text:`${fmt(r.ni)} in National Insurance on ${label} in 2026-27. Rate: 8% on £12,570–£50,270, 2% above. Effective NI rate: ${pct(r.ni/salaryNum*100)}.`}},
      {'@type':'Question',name:`What is the monthly take-home on ${label}?`,acceptedAnswer:{'@type':'Answer',text:`Monthly take-home on ${label} is ${fmtD(r.mo)} with 5% pension and no student loan. Monthly income tax ${fmtD(r.it/12)}, monthly NI ${fmtD(r.ni/12)}.`}},
      {'@type':'Question',name:`How can I increase take-home pay on ${label}?`,acceptedAnswer:{'@type':'Answer',text:`Salary sacrifice pension contributions reduce both income tax and NI. Each pound sacrificed costs only ${salaryNum>50270?'52p':'72p'} in take-home while the full pound goes to pension. Increasing from 5% to 10% pension saves ${fmt(salaryNum*0.05)} in deductions while reducing take-home by only ${fmt(r.th-calc(salaryNum,10).th)}.`}},
    ]
  };
  const schemaBreadcrumb={
    '@context':'https://schema.org','@type':'BreadcrumbList',
    itemListElement:[
      {'@type':'ListItem',position:1,name:'TaxdCalc',item:'https://taxdcal.co.uk'},
      {'@type':'ListItem',position:2,name:`${label} Take-Home Pay`,item:`https://taxdcal.co.uk/${slug}`},
    ]
  };
  const schemaSpeakable={
    '@context':'https://schema.org','@type':'WebPage',
    '@id':`https://taxdcal.co.uk/${slug}`,
    speakable:{'@type':'SpeakableSpecification',cssSelector:['.ai-answer','h1','.quick-answer']}
  };

  return(
    <>
      <style>{GS}</style>
      {/* Separate schema scripts — never @graph bundled */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schemaCalc)}}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schemaFAQ)}}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schemaBreadcrumb)}}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schemaSpeakable)}}/>
      <Nav/>

      {/* ── AI ANSWER BLOCK — above fold, machine-readable ──────────────────── */}
      <div className="ai-answer" style={{background:C.tealBg,borderBottom:`1px solid ${C.tealBd}`,padding:mob?'14px 16px':'16px 24px'}}>
        <div style={{maxWidth:1000,margin:'0 auto'}}>
          <div style={{fontSize:10,color:C.teal,fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',fontFamily:'JetBrains Mono',marginBottom:6}}>Quick Answer — 2026-27</div>
          {/* One-sentence answer for AI snippets */}
          <p style={{fontSize:mob?14:16,color:'#0f766e',lineHeight:1.6,fontWeight:600,marginBottom:10}}>
            On a {label} salary, take-home pay is <strong>{fmt(r.th)}/year</strong> ({fmtD(r.mo)}/month) after income tax, National Insurance{pension>0?` and ${pension}% pension`:''} in 2026-27.
          </p>
          <div style={{display:'grid',gridTemplateColumns:mob?'repeat(2,1fr)':'repeat(4,1fr)',gap:8}}>
            {[['Annual take-home',fmt(r.th)],[`Monthly (${fmt(r.mo)})`,'net pay'],['Income Tax',fmt(r.it)],['Nat. Insurance',fmt(r.ni)]].map(([l,v])=>(
              <div key={l} style={{background:'rgba(13,148,136,0.1)',borderRadius:7,padding:'9px 11px'}}>
                <div style={{fontSize:9,color:C.teal,textTransform:'uppercase',letterSpacing:'0.1em',fontFamily:'JetBrains Mono',marginBottom:3}}>{l}</div>
                <div style={{fontFamily:'JetBrains Mono',fontSize:13,fontWeight:700,color:'#0f766e'}}>{v}</div>
              </div>
            ))}
          </div>
          {/* Optimisation tip */}
          {r.th>0&&(
            <div style={{marginTop:10,fontSize:12,color:'#0f766e',lineHeight:1.6}}>
              💡 <strong>Optimisation tip:</strong>{' '}
              {salaryNum>100000&&salaryNum<=125140
                ?`You are in the 60% tax trap. Salary sacrifice of ${fmt(salaryNum-100000)} brings you below £100,000 and saves approximately ${fmt(Math.round((r.it-calc(salaryNum,salaryNum>salaryNum?0:(100000/salaryNum-0.05)*100).it)*0.6))} in tax.`
                :salaryNum>50000
                ?`Above £50,270 you pay 40% tax on additional income. Salary sacrifice is worth 48p saving per pound sacrificed (40% tax + 8% NI).`
                :`Salary sacrifice pension contributions cost only ${salaryNum>50270?'52':'72'}p per pound — saving ${salaryNum>50270?'48':'28'}p in tax and NI on every pound contributed.`}
              {' '}<Link href="/sacrifice" style={{color:C.teal,fontWeight:700,borderBottom:`1px solid ${C.tealBd}`}}>Calculate your saving →</Link>
            </div>
          )}
        </div>
      </div>

      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <div style={{background:`linear-gradient(135deg,${C.navy},${C.navyM})`,padding:mob?'24px 20px 36px':'32px 24px 44px',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:-40,right:-40,width:160,height:160,borderRadius:'50%',background:'rgba(13,148,136,0.08)',pointerEvents:'none'}}/>
        <div style={{maxWidth:1000,margin:'0 auto'}}>
          <h1 style={{fontFamily:'DM Serif Display',fontSize:mob?20:30,color:'white',lineHeight:1.2,marginBottom:10}}>
            {label} Salary — Take-Home Pay 2026-27
          </h1>
          <div style={{display:'grid',gridTemplateColumns:mob?'1fr 1fr':'repeat(4,1fr)',gap:10}}>
            {[['Annual take-home',fmt(r.th),'#14B8A6'],['Monthly net',fmtD(r.mo),'white'],['Income Tax','-'+fmt(r.it),'#F87171'],['Nat. Insurance','-'+fmt(r.ni),'#FCA5A5']].map(([l,v,cl])=>(
              <div key={l} style={{background:'rgba(255,255,255,0.06)',borderRadius:10,padding:'12px 14px',border:'1px solid rgba(255,255,255,0.08)'}}>
                <div style={{fontSize:9,color:'rgba(255,255,255,0.4)',letterSpacing:'0.1em',textTransform:'uppercase',fontFamily:'JetBrains Mono',marginBottom:4}}>{l}</div>
                <div style={{fontFamily:'DM Serif Display',fontSize:mob?18:24,color:cl,lineHeight:1}}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{marginTop:10,display:'flex',alignItems:'center',gap:10}}>
            <div style={{flex:1,height:4,background:'rgba(255,255,255,0.08)',borderRadius:2,overflow:'hidden'}}>
              <div style={{width:`${(r.th/r.gross*100).toFixed(1)}%`,height:'100%',background:'linear-gradient(90deg,#0D9488,#14B8A6)',transition:'width 0.4s ease'}}/>
            </div>
            <span style={{fontSize:11,color:'#14B8A6',fontFamily:'JetBrains Mono',fontWeight:600,flexShrink:0}}>{pct(r.th/r.gross*100)} kept · {pct(r.effRate)} effective rate</span>
          </div>
        </div>
      </div>

      {/* ── TAX TRAP ALERTS ────────────────────────────────────────────────── */}
      {traps.length>0&&(
        <div style={{background:C.orgBg,borderBottom:`1px solid ${C.orgBd}`,padding:mob?'12px 16px':'14px 24px'}}>
          <div style={{maxWidth:1000,margin:'0 auto'}}>
            <div style={{fontSize:10,fontWeight:700,color:C.orange,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:8,fontFamily:'JetBrains Mono'}}>
              {traps.some(t=>t.severity==='critical')?'🚨 Tax Traps Detected':'⚠️ Tax Warnings'}
            </div>
            {traps.map(trap=><TrapAlert key={trap.id} trap={trap}/>)}
          </div>
        </div>
      )}

      <div style={{maxWidth:1000,margin:'0 auto',padding:mob?'14px 16px 48px':'18px 24px 56px'}}>

        {/* ── ADJUSTERS ─────────────────────────────────────────────────────── */}
        <div style={{background:C.white,borderRadius:14,padding:mob?16:22,boxShadow:C.shadow,border:`1px solid ${C.border}`,marginBottom:14}} className="fi">
          <h2 style={{fontFamily:'DM Serif Display',fontSize:16,color:C.navy,marginBottom:14}}>Adjust Your Figures</h2>
          <div style={{display:'grid',gridTemplateColumns:mob?'1fr':'1fr 1fr 1fr',gap:14}}>
            <div>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
                <label style={{fontSize:12,fontWeight:600,color:C.navy}}>Pension</label>
                <span style={{fontFamily:'JetBrains Mono',fontSize:12,color:C.teal,fontWeight:600}}>{pension}% = {fmt(salaryNum*pension/100)}</span>
              </div>
              <input type="range" min={0} max={20} step={0.5} value={pension} onChange={e=>setPension(Number(e.target.value))}/>
            </div>
            <div>
              <label style={{display:'block',fontSize:12,fontWeight:600,color:C.navy,marginBottom:8}}>Student Loan</label>
              <select value={loan} onChange={e=>setLoan(e.target.value)} style={{width:'100%',padding:'9px 36px 9px 12px',border:`1.5px solid ${C.borderDk}`,borderRadius:7,fontSize:12,color:C.navy,outline:'none'}} onFocus={e=>e.target.style.borderColor=C.teal} onBlur={e=>e.target.style.borderColor=C.borderDk}>
                <option value="none">No student loan</option>
                <option value="plan1">Plan 1 (£24,990)</option>
                <option value="plan2">Plan 2 (£27,295)</option>
                <option value="plan4">Plan 4 Scotland</option>
                <option value="plan5">Plan 5 (£25,000) ⚠</option>
              </select>
            </div>
            {salaryNum>55000?(
              <div>
                <label style={{display:'block',fontSize:12,fontWeight:600,color:C.navy,marginBottom:8}}>Children (Child Benefit)</label>
                <select value={numChildren} onChange={e=>setNumChildren(Number(e.target.value))} style={{width:'100%',padding:'9px 36px 9px 12px',border:`1.5px solid ${C.borderDk}`,borderRadius:7,fontSize:12,color:C.navy,outline:'none'}} onFocus={e=>e.target.style.borderColor=C.teal} onBlur={e=>e.target.style.borderColor=C.borderDk}>
                  {[0,1,2,3,4].map(n=><option key={n} value={n}>{n===0?'No children':`${n} child${n>1?'ren':''}`}</option>)}
                </select>
              </div>
            ):(
              <div style={{padding:'10px 12px',background:scotland?'#EFF6FF':C.bg,border:`1.5px solid ${scotland?'#BFDBFE':C.borderDk}`,borderRadius:8,display:'flex',alignItems:'center',justifyContent:'space-between',gap:10}}>
                <span style={{fontSize:12,fontWeight:600,color:scotland?'#1D4ED8':C.navy}}>Scotland?</span>
                <button onClick={()=>setScotland(!scotland)} style={{width:40,height:22,borderRadius:11,border:'none',background:scotland?'#1D4ED8':C.borderDk,position:'relative',transition:'background 0.2s',flexShrink:0}}>
                  <span style={{position:'absolute',top:2,left:scotland?20:2,width:18,height:18,borderRadius:'50%',background:'white',boxShadow:'0 1px 3px rgba(0,0,0,0.2)',transition:'left 0.2s'}}/>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── FULL DEDUCTION TABLE ──────────────────────────────────────────── */}
        <div style={{background:C.white,borderRadius:12,padding:mob?14:20,border:`1px solid ${C.border}`,boxShadow:C.shadow,marginBottom:14}}>
          <h2 style={{fontFamily:'DM Serif Display',fontSize:mob?16:19,color:C.navy,marginBottom:12}}>Full Deduction Breakdown — {label}</h2>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:12,minWidth:320}}>
              <thead><tr>{['','Annual','Monthly','Weekly'].map(h=><th key={h} style={{textAlign:h?'right':'left',padding:'7px 8px',color:C.slate,fontSize:10,textTransform:'uppercase',letterSpacing:'0.06em',borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
              <tbody>
                {[{l:'Gross salary',a:r.gross},{l:'Income Tax',a:r.it,neg:true},{l:'Nat. Insurance',a:r.ni,neg:true},r.loan>0?{l:'Student Loan',a:r.loan,neg:true}:null,r.pen>0?{l:`Pension (${pension}%)`,a:r.pen,neg:true}:null,{l:'Take-Home Pay',a:r.th,bold:true,grn:true}].filter(Boolean).map((row,i)=>(
                  <tr key={row.l} style={{background:i%2===0?'transparent':'rgba(0,0,0,0.012)',borderBottom:`1px solid ${C.border}`}}>
                    <td style={{padding:'9px 8px',fontWeight:row.bold?700:400,color:row.grn?C.teal:C.text,fontSize:12}}>{row.l}</td>
                    {[row.a,row.a/12,row.a/52].map((v,j)=><td key={j} style={{padding:'9px 8px',textAlign:'right',fontFamily:'JetBrains Mono',fontSize:11,color:row.neg?C.red:row.grn?C.teal:C.text,fontWeight:row.bold?700:400}}>{row.neg?'-':''}{j===0?fmt(v):fmtD(v)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{marginTop:10,padding:'10px 12px',background:C.bg,borderRadius:7,fontSize:11,color:C.slate,lineHeight:1.6}}>
            Effective tax rate (income tax + NI): <strong style={{color:C.navy}}>{pct(r.effRate)}</strong> of gross salary. Net hourly rate at 37.5hrs/week: <strong style={{color:C.navy}}>{fmtD(r.hr)}/hr</strong>. Thresholds: Personal Allowance £12,570 · Basic Rate limit £50,270 · Higher Rate limit £125,140. Frozen until 2031.
          </div>
        </div>

        {/* ── COMPARISON MODULE ─────────────────────────────────────────────── */}
        <ComparisonModule salary={salaryNum} pension={pension} loan={loan}/>

        {/* ── FAQ ───────────────────────────────────────────────────────────── */}
        <FAQSection salary={salaryNum} r={r}/>

        {/* ── RELATED SALARY PAGES ─────────────────────────────────────────── */}
        <div style={{marginBottom:14}}>
          <h2 style={{fontFamily:'DM Serif Display',fontSize:mob?17:20,color:C.navy,marginBottom:10}}>Compare Other UK Salaries</h2>
          <div style={{display:'grid',gridTemplateColumns:mob?'repeat(2,1fr)':'repeat(auto-fill,minmax(140px,1fr))',gap:8}}>
            {related.map(s=>{const rel=calc(s,5,'none',false);return(
              <Link key={s} href={'/'+s+'-salary-take-home'} style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:9,padding:'11px 13px',display:'block',transition:'border-color 0.2s'}} onMouseEnter={e=>e.currentTarget.style.borderColor=C.teal} onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                <div style={{fontFamily:'JetBrains Mono',fontSize:13,fontWeight:700,color:C.navy,marginBottom:2}}>{fmt(s)}</div>
                <div style={{fontSize:11,color:C.teal,fontFamily:'JetBrains Mono'}}>{fmt(rel.th)}/yr</div>
                <div style={{fontSize:10,color:C.sl,fontFamily:'JetBrains Mono'}}>{fmtD(rel.mo)}/mo</div>
              </Link>
            );})}
          </div>
        </div>

        {/* ── INTERNAL LINKS ───────────────────────────────────────────────── */}
        <div style={{background:C.white,borderRadius:12,padding:mob?14:18,border:`1px solid ${C.border}`,boxShadow:C.shadow,marginBottom:14}}>
          <h3 style={{fontFamily:'DM Serif Display',fontSize:15,color:C.navy,marginBottom:12}}>Related Calculators & Guides</h3>
          <div style={{display:'grid',gridTemplateColumns:mob?'1fr':'repeat(2,1fr)',gap:8}}>
            {[
              {href:'/sacrifice',label:'Salary Sacrifice Calculator',desc:`Save ${salaryNum>50270?'48%':'28%'} of every pension pound`},
              {href:'/ir35',label:'IR35 Calculator',desc:'PAYE vs Ltd Company comparison'},
              {href:'/blog/60-percent-tax-trap',label:'60% Tax Trap Guide',desc:'Does this salary affect your Personal Allowance?',show:salaryNum>=90000},
              {href:'/blog/pension-tax-relief-your-free-money',label:'Pension Tax Relief Guide',desc:'Get free money from HMRC'},
              {href:'/part-time-salary-calculator',label:'Part-Time Calculator',desc:'Pro-rata take-home for any hours'},
              {href:salaryNum>=50000?'/nhs-pay-guide':'/blog/nhs-band-5-take-home-pay-2026',label:salaryNum>=50000?'NHS Pay Guide':'NHS Band 5 Take-Home',desc:'NHS Agenda for Change band comparison'},
            ].filter(item=>item.show!==false).map(({href,label,desc})=>(
              <Link key={href} href={href} style={{display:'flex',gap:10,padding:'11px 13px',background:C.bg,borderRadius:8,border:`1px solid ${C.border}`,transition:'all 0.15s',alignItems:'flex-start'}} onMouseEnter={e=>{e.currentTarget.style.borderColor=C.teal;e.currentTarget.style.background=C.tealBg;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.bg;}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:700,color:C.navy,marginBottom:2}}>{label}</div>
                  <div style={{fontSize:11,color:C.slate}}>{desc}</div>
                </div>
                <span style={{color:C.teal,fontSize:14,flexShrink:0,marginTop:1}}>→</span>
              </Link>
            ))}
          </div>
        </div>

        {/* ── CTA ───────────────────────────────────────────────────────────── */}
        <div style={{background:`linear-gradient(135deg,${C.navy},${C.navyM})`,borderRadius:12,padding:'16px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
          <div><div style={{fontFamily:'DM Serif Display',fontSize:15,color:'white',marginBottom:2}}>Need a different salary?</div><div style={{fontSize:11,color:'rgba(255,255,255,0.4)'}}>Tax code, Scotland, all 5 student loan plans</div></div>
          <Link href="/" style={{background:C.teal,color:'white',padding:'10px 18px',borderRadius:7,fontSize:13,fontWeight:700,display:'inline-block'}}>Open Full Calculator</Link>
        </div>
      </div>
      <Footer/>
    </>
  );
}