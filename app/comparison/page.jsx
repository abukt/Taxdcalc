'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

function useW(){const[w,setW]=useState(typeof window!=='undefined'?window.innerWidth:800);useEffect(()=>{const f=()=>setW(window.innerWidth);window.addEventListener('resize',f);return()=>window.removeEventListener('resize',f);},[]);return w;}
const C={navy:'#0C1E3C',navyLight:'#162d52',teal:'#0D9488',tealLight:'#14B8A6',tealBg:'#F0FDFA',tealBorder:'#99F6E4',amber:'#D97706',amberLight:'#F59E0B',amberBg:'#FFFBEB',amberBorder:'#FDE68A',border:'#E2E8F0',borderDark:'#CBD5E1',white:'#FFFFFF',green:'#059669',red:'#DC2626',text:'#1E293B',textMid:'#475569',slate:'#64748B',slateLight:'#94A3B8',shadow:'0 1px 3px rgba(0,0,0,0.07),0 4px 16px rgba(0,0,0,0.04)'};
const GS='@import url(\'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Source+Serif+4:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap\');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}body{background:#F8F9FA;color:#1E293B;font-family:\'Source Serif 4\',Georgia,serif;-webkit-tap-highlight-color:transparent;}input[type=number]{-moz-appearance:textfield;}input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;}input[type=range]{-webkit-appearance:none;width:100%;height:4px;background:#CBD5E1;border-radius:2px;outline:none;}input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;border-radius:50%;background:#0C1E3C;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.2);}select{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\'%3E%3Cpath d=\'M1 1l5 5 5-5\' stroke=\'%2364748b\' stroke-width=\'1.5\' fill=\'none\'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;background-color:white;}@keyframes fadeUp{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}.fu{animation:fadeUp 0.4s ease both;}button{cursor:pointer;}a{text-decoration:none;color:inherit;}';
const fmt=n=>'\u00A3'+Math.abs(n||0).toLocaleString('en-GB',{maximumFractionDigits:0});
const fmtD=n=>'\u00A3'+(n||0).toLocaleString('en-GB',{minimumFractionDigits:2,maximumFractionDigits:2});
function calcIT(gross,pension){const ti=Math.max(0,gross-pension);let pa=12570;if(ti>100000)pa=Math.max(0,12570-(ti-100000)/2);const tx=Math.max(0,ti-pa),b1=37700,b2=75140;if(tx<=b1)return tx*0.20;if(tx<=b2)return b1*0.20+(tx-b1)*0.40;return b1*0.20+(b2-b1)*0.40+(tx-b2)*0.45;}
function calcNI(g){if(g<=12570)return 0;if(g<=50270)return(g-12570)*0.08;return(50270-12570)*0.08+(g-50270)*0.02;}
function calcLoan(g,p){const t={plan1:24990,plan2:27295,plan4:31395,plan5:25000};if(!p||p==='none'||!t[p]||g<=t[p])return 0;return(g-t[p])*0.09;}
function doCalc(gross,pPct,sl){const p=gross*(pPct/100),it=calcIT(gross,p),ni=calcNI(gross),loan=calcLoan(gross,sl),th=gross-it-ni-loan-p;return{gross,incomeTax:it,ni,pension:p,studentLoan:loan,takeHome:th,monthly:{takeHome:th/12}};}
function Nav(){const[open,setOpen]=useState(false);const mob=useW()<640;const links=[['/',   'Salary Calculator'],['/ir35','IR35'],['/nhs','NHS Bands'],['/tools','All Tools'],['/blog','Tax Guides']];return(<nav style={{background:'#0C1E3C',position:'sticky',top:0,zIndex:100,boxShadow:'0 2px 16px rgba(0,0,0,0.25)'}}><div style={{maxWidth:1100,margin:'0 auto',padding:'0 20px',height:56,display:'flex',alignItems:'center',justifyContent:'space-between'}}><Link href="/" style={{display:'flex',alignItems:'center',gap:9}}><div style={{width:30,height:30,background:'linear-gradient(135deg,#0D9488,#14B8A6)',borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><span style={{color:'white',fontWeight:700,fontSize:12,fontFamily:'JetBrains Mono'}}>Tx</span></div><span style={{color:'white',fontFamily:'DM Serif Display',fontSize:17}}>Taxd<span style={{color:'#14B8A6'}}>Calc</span></span></Link>{mob?(<button onClick={()=>setOpen(!open)} style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:7,padding:'8px 10px',display:'flex',flexDirection:'column',gap:4}}>{[0,1,2].map(i=><span key={i} style={{display:'block',width:18,height:2,background:'white',borderRadius:1,transition:'all 0.2s',transform:open&&i===0?'rotate(45deg) translate(4px,4px)':open&&i===2?'rotate(-45deg) translate(4px,-4px)':'none',opacity:open&&i===1?0:1}}/>)}</button>):(<div style={{display:'flex',gap:2,alignItems:'center'}}>{links.map(([href,label])=>(<Link key={href} href={href} style={{padding:'7px 13px',borderRadius:6,background:'transparent',color:'rgba(255,255,255,0.6)',fontSize:13,fontFamily:'Source Serif 4'}}>{label}</Link>))}<span style={{fontSize:11,color:'#14B8A6',fontFamily:'JetBrains Mono',background:'rgba(13,148,136,0.15)',padding:'3px 9px',borderRadius:4,border:'1px solid rgba(20,184,166,0.3)',marginLeft:8}}>2026-27</span></div>)}</div>{mob&&open&&(<div style={{background:'#162d52',borderTop:'1px solid rgba(255,255,255,0.08)',padding:'6px 0 12px'}}>{links.map(([href,label])=>(<Link key={href} href={href} onClick={()=>setOpen(false)} style={{display:'block',padding:'12px 24px',color:'rgba(255,255,255,0.65)',fontSize:14,fontFamily:'Source Serif 4'}}>{label}</Link>))}</div>)}</nav>);}
function Footer(){
  return(
    <footer style={{background:'#070D1C',padding:'40px 24px 28px',borderTop:'1px solid rgba(255,255,255,0.06)',marginTop:0}}>
      <div style={{maxWidth:1100,margin:'0 auto'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:'28px 24px',marginBottom:28}}>
          <div>
            <div style={{fontSize:10,color:'rgba(255,255,255,0.28)',letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:12,fontFamily:'JetBrains Mono',fontWeight:600}}>Core Tools</div>
            {[['/','Salary Calculator'],['/ir35','IR35 Calculator'],['/nhs','NHS Pay Bands'],['/hourly','Hourly Rate'],['/bonus','Bonus Tax'],['/sacrifice','Salary Sacrifice'],['/comparison','Job Comparison'],['/maternity','Maternity Pay'],['/part-time-salary-calculator','Part-Time Pay']].map(([h,l])=>(
              <Link key={h} href={h} style={{display:'block',fontSize:12,color:'rgba(255,255,255,0.42)',marginBottom:7,lineHeight:1.4,textDecoration:'none'}}>{l}</Link>
            ))}
          </div>
          <div>
            <div style={{fontSize:10,color:'rgba(255,255,255,0.28)',letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:12,fontFamily:'JetBrains Mono',fontWeight:600}}>Tax Planning</div>
            {[['/blog/60-percent-tax-trap','60% Tax Trap'],['/blog/hicbc-child-benefit-charge','Child Benefit Taper'],['/blog/personal-allowance-taper-100k','£100k PA Taper'],['/blog/plan-5-student-loan-take-home','Plan 5 Student Loan'],['/blog/salary-sacrifice-electric-car-uk-2026','EV Salary Sacrifice'],['/blog/pension-tax-relief-your-free-money','Pension Tax Relief'],['/blog/ir35-inside-outside-calculator-2026','IR35 Guide']].map(([h,l])=>(
              <Link key={h} href={h} style={{display:'block',fontSize:12,color:'rgba(255,255,255,0.42)',marginBottom:7,lineHeight:1.4,textDecoration:'none'}}>{l}</Link>
            ))}
          </div>
          <div>
            <div style={{fontSize:10,color:'rgba(255,255,255,0.28)',letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:12,fontFamily:'JetBrains Mono',fontWeight:600}}>Public Sector</div>
            {[['/nhs-pay-guide','NHS Pay Guide'],['/teacher-pay-guide','Teacher Pay Guide'],['/public-sector-pay','Public Sector Hub'],['/public-sector-pay/police','Police Pay'],['/public-sector-pay/firefighters','Firefighter Pay'],['/public-sector-pay/civil-service','Civil Service Pay'],['/public-sector-pay/armed-forces','Armed Forces Pay'],['/public-sector-pay/council-workers','Council Workers Pay']].map(([h,l])=>(
              <Link key={h} href={h} style={{display:'block',fontSize:12,color:'rgba(255,255,255,0.42)',marginBottom:7,lineHeight:1.4,textDecoration:'none'}}>{l}</Link>
            ))}
          </div>
          <div>
            <div style={{fontSize:10,color:'rgba(255,255,255,0.28)',letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:12,fontFamily:'JetBrains Mono',fontWeight:600}}>Guides</div>
            {[['/blog','All Tax Guides'],['/blog/45000-salary-take-home-uk-2026','£45k Salary Guide'],['/blog/50000-salary-after-tax-uk-2026','£50k Salary Guide'],['/blog/nhs-band-5-take-home-pay-2026','NHS Band 5 Guide'],['/maternity-pay-self-employed','Self-Employed Maternity'],['/tools','All Tools']].map(([h,l])=>(
              <Link key={h} href={h} style={{display:'block',fontSize:12,color:'rgba(255,255,255,0.42)',marginBottom:7,lineHeight:1.4,textDecoration:'none'}}>{l}</Link>
            ))}
          </div>
        </div>
        <div style={{borderTop:'1px solid rgba(255,255,255,0.07)',paddingTop:20,display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:12,alignItems:'center'}}>
          <Link href="/" style={{display:'flex',alignItems:'center',gap:9,textDecoration:'none'}}>
            <div style={{width:28,height:28,background:'linear-gradient(135deg,#0D9488,#14B8A6)',borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <span style={{color:'white',fontWeight:700,fontSize:12,fontFamily:'JetBrains Mono'}}>Tx</span>
            </div>
            <span style={{color:'white',fontFamily:'DM Serif Display',fontSize:16}}>Taxd<span style={{color:'#14B8A6'}}>Calc</span></span>
          </Link>
          <span style={{fontSize:11,color:'rgba(255,255,255,0.22)',fontFamily:'JetBrains Mono'}}>Updated April 2026 &middot; 2026-27 HMRC rates</span>
          <span style={{fontSize:11,color:'rgba(255,255,255,0.18)',maxWidth:320,lineHeight:1.6}}>For guidance only. Consult HMRC or a qualified tax adviser.</span>
        </div>
      </div>
    </footer>
  );
}
function JobPanel({ label, salary, setSalary, pension, setPension, loan, setLoan, result, accentColor, accentBg, accentBorder }) {
  const mob = useW() < 640;
  return (
    <div>
      <div style={{background:'white',borderRadius:14,padding:mob?18:24,boxShadow:C.shadow,border:'1px solid '+C.border,marginBottom:12}}>
        <div style={{fontFamily:'DM Serif Display',fontSize:18,color:C.navy,marginBottom:16}}>{label}</div>
        <div style={{marginBottom:18}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:7}}>
            <label style={{fontSize:13,fontWeight:600,color:C.navyLight}}>Annual Salary</label>
          </div>
          <div style={{position:'relative'}}>
            <span style={{position:'absolute',left:13,top:'50%',transform:'translateY(-50%)',color:C.slate,fontSize:15,fontWeight:600,fontFamily:'JetBrains Mono',pointerEvents:'none'}}>{'\u00A3'}</span>
            <input type="number" value={salary} onChange={e=>setSalary(Math.max(0,Number(e.target.value)))} min={0} max={500000}
              style={{width:'100%',padding:'13px 14px 13px 28px',border:'1.5px solid '+C.borderDark,borderRadius:8,fontSize:16,fontFamily:'JetBrains Mono',fontWeight:500,color:C.navy,background:'white',outline:'none'}}
              onFocus={e=>e.target.style.borderColor=accentColor} onBlur={e=>e.target.style.borderColor=C.borderDark}/>
          </div>
        </div>
        <div style={{marginBottom:18}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
            <label style={{fontSize:13,fontWeight:600,color:C.navyLight}}>Pension %</label>
            <span style={{fontFamily:'JetBrains Mono',fontSize:14,color:accentColor,fontWeight:600}}>{pension}%</span>
          </div>
          <input type="range" min={0} max={20} step={0.5} value={pension} onChange={e=>setPension(Number(e.target.value))} style={{accentColor}}/>
        </div>
        <div style={{marginBottom:4}}>
          <label style={{display:'block',fontSize:13,fontWeight:600,color:C.navyLight,marginBottom:7}}>Student Loan</label>
          <select value={loan} onChange={e=>setLoan(e.target.value)} style={{width:'100%',padding:'12px 40px 12px 14px',border:'1.5px solid '+C.borderDark,borderRadius:8,fontSize:14,color:C.navy,outline:'none'}}>
            <option value="none">No student loan</option>
            <option value="plan1">Plan 1</option>
            <option value="plan2">Plan 2</option>
            <option value="plan4">Plan 4 Scotland</option>
            <option value="plan5">Plan 5</option>
          </select>
        </div>
      </div>
      <div style={{background:accentBg,border:'2px solid '+accentBorder,borderRadius:12,padding:'18px',textAlign:'center'}}>
        <div style={{fontSize:11,color:accentColor,fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:5}}>{label} Take-Home</div>
        <div style={{fontFamily:'DM Serif Display',fontSize:'clamp(24px,4vw,34px)',color:C.navy}}>{fmt(result.takeHome)}</div>
        <div style={{fontSize:12,color:C.textMid,marginTop:3,fontFamily:'JetBrains Mono'}}>{fmtD(result.monthly.takeHome)}/month</div>
      </div>
    </div>
  );
}

export default function ComparisonPage() {
  const mob = useW() < 640;
  const [aS, setAS] = useState(50000); const [aP, setAP] = useState(5); const [aL, setAL] = useState('none');
  const [bS, setBS] = useState(55000); const [bP, setBP] = useState(3); const [bL, setBL] = useState('none');
  const rA = doCalc(aS, aP, aL), rB = doCalc(bS, bP, bL);
  const diff = rB.takeHome - rA.takeHome;

  const schemaFAQ={'@context':'https://schema.org','@type':'FAQPage',mainEntity:[
    {'@type':'Question',name:'How do I compare two job offers on take-home pay?',acceptedAnswer:{'@type':'Answer',text:'Enter both gross salaries, pension percentages and student loan plans into the job comparison calculator above.'}},
    {'@type':'Question',name:'Does a higher salary always mean more take-home pay?',acceptedAnswer:{'@type':'Answer',text:'Almost always yes. The exception is crossing £100,000 where the 60% effective rate applies.'}}
  ]};
  const schemaBreadcrumb={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'TaxdCalc',item:'https://taxdcal.co.uk'},{'@type':'ListItem',position:2,name:'Job Comparison Calculator',item:'https://taxdcal.co.uk/comparison'}]};
  const schemaCalc={'@context':'https://schema.org','@type':'WebApplication',name:'UK Job Comparison Calculator 2026-27',applicationCategory:'FinanceApplication',operatingSystem:'Any',offers:{'@type':'Offer',price:'0',priceCurrency:'GBP'},provider:{'@type':'Organization',name:'TaxdCalc',url:'https://taxdcal.co.uk'},url:'https://taxdcal.co.uk/comparison'};

  return (
    <>
      <style>{GS}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schemaCalc)}}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schemaFAQ)}}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schemaBreadcrumb)}}/>
      <Nav/>

      {/* AI ANSWER BLOCK */}
      {(rA.takeHome > 0 || rB.takeHome > 0) && (
        <div className="ai-answer" style={{background:'#F0FDFA',borderBottom:'1px solid #99F6E4',padding:mob?'13px 16px':'15px 24px'}}>
          <div style={{maxWidth:1000,margin:'0 auto'}}>
            <div style={{fontSize:10,color:'#0D9488',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',fontFamily:'JetBrains Mono',marginBottom:5}}>Quick Comparison &mdash; 2026-27</div>
            <p style={{fontSize:mob?13:14,color:'#0f766e',fontWeight:600,lineHeight:1.6}}>
              Job A take-home: <strong>{fmt(rA.takeHome)}/yr</strong> &middot; Job B: <strong>{fmt(rB.takeHome)}/yr</strong> &mdash; difference: <strong>{diff>=0?'+':''}{fmt(diff)}/year</strong>.
            </p>
          </div>
        </div>
      )}

      <div style={{background:'linear-gradient(135deg,#0C1E3C,#1e3d6e)',padding:mob?'36px 20px 64px':'44px 24px 72px',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:-50,right:-50,width:220,height:220,borderRadius:'50%',background:'rgba(13,148,136,0.07)',pointerEvents:'none'}}/>
        <div style={{display:'inline-block',background:'rgba(13,148,136,0.15)',border:'1px solid rgba(20,184,166,0.3)',borderRadius:20,padding:'4px 13px',fontSize:11,color:'#14B8A6',marginBottom:13,fontFamily:'JetBrains Mono'}}>Comparison Tool</div>
        <h1 style={{fontFamily:'DM Serif Display',fontSize:mob?26:42,color:'white',marginBottom:10,letterSpacing:'-0.02em'}}>
          Compare Job<br/><em style={{color:'#14B8A6'}}>Offers Side by Side</em>
        </h1>
        <p style={{color:'rgba(255,255,255,0.5)',fontSize:mob?13:15,maxWidth:480,margin:'0 auto'}}>Analyze two offers after tax, NI, pension and student loans to
