'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

function useW(){const[w,setW]=useState(typeof window!=='undefined'?window.innerWidth:800);useEffect(()=>{const f=()=>setW(window.innerWidth);window.addEventListener('resize',f);return()=>window.removeEventListener('resize',f);},[]);return w;}

function calcIT(gross,pen=0){const ti=Math.max(0,gross-pen);let pa=12570;if(ti>100000)pa=Math.max(0,12570-Math.floor((ti-100000)/2));const tx=Math.max(0,ti-pa),b1=37700,b2=75140;if(tx<=b1)return tx*0.20;if(tx<=b2)return b1*0.20+(tx-b1)*0.40;return b1*0.20+(b2-b1)*0.40+(tx-b2)*0.45;}
function calcNI(g){if(g<=12570)return 0;return(Math.min(g,50270)-12570)*0.08+Math.max(0,g-50270)*0.02;}
function calcInside(a,pp=5){const p=a*(pp/100),it=calcIT(a,p),ni=calcNI(a);return {takeHome:a-it-ni-p,it,ni,p};}
function calcOutside(a){const salary=12570,corp=Math.max(0,(a-salary-9100)*0.19),divs=Math.max(0,a-salary-corp-9100),divTax=Math.max(0,divs-500),bDiv=Math.max(0,Math.min(divTax,37700))*0.1075,hDiv=Math.max(0,divTax-37700)*0.3575;return {takeHome:salary+divs-bDiv-hDiv,corp,divs,bDiv,hDiv};}

const fmt=n=>'£'+Math.round(Math.abs(n||0)).toLocaleString('en-GB');
const fmtD=n=>'£'+(n||0).toLocaleString('en-GB',{minimumFractionDigits:2,maximumFractionDigits:2});

const C={navy:'#0C1E3C',navyMid:'#1e3d6e',teal:'#0D9488',tealL:'#14B8A6',tealBg:'#F0FDFA',tealBd:'#99F6E4',amber:'#D97706',amberBg:'#FFFBEB',amberBd:'#FDE68A',green:'#059669',greenBg:'#ECFDF5',red:'#DC2626',border:'#E2E8F0',borderDk:'#CBD5E1',bg:'#F4F6F9',white:'#FFFFFF',text:'#1E293B',mid:'#475569',slate:'#64748B',sl:'#94A3B8',shadow:'0 1px 3px rgba(0,0,0,0.07),0 4px 16px rgba(0,0,0,0.04)'};
const GS=`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Source+Serif+4:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}body{background:#F4F6F9;color:#1E293B;font-family:'Source Serif 4',Georgia,serif;-webkit-tap-highlight-color:transparent;}input[type=number]{-moz-appearance:textfield;}input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;}input[type=range]{-webkit-appearance:none;width:100%;height:4px;background:#CBD5E1;border-radius:2px;outline:none;}input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;border-radius:50%;background:#0C1E3C;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.2);}select{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2364748b' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;background-color:white;}@keyframes fi{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}.fi{animation:fi 0.35s ease both;}a{text-decoration:none;color:inherit;}button{cursor:pointer;font-family:inherit;}@media(max-width:767px){body{padding-bottom:52px;}}`;

function AnimNum({value,f}){const fn=f||fmt;const[d,setD]=useState(value);const prev=useRef(value);useEffect(()=>{const s=prev.current,e=value||0,diff=e-s;if(Math.abs(diff)<1){setD(e);prev.current=e;return;}const dur=400,t0=performance.now();let raf;const step=now=>{const t=Math.min(1,(now-t0)/dur),ease=t<0.5?2*t*t:-1+(4-2*t)*t;setD(s+diff*ease);if(t<1)raf=requestAnimationFrame(step);else{setD(e);prev.current=e;}};raf=requestAnimationFrame(step);return()=>cancelAnimationFrame(raf);},[value]);return<span>{fn(d)}</span>;}

function Nav(){const[open,setOpen]=useState(false);const mob=useW()<640;const links=[['/', 'Salary Calculator'],['/ir35','IR35'],['/nhs','NHS Bands'],['/tools','All Tools'],['/blog','Tax Guides']];return(<nav style={{background:C.navy,position:'sticky',top:0,zIndex:100,boxShadow:'0 2px 16px rgba(0,0,0,0.25)'}}><div style={{maxWidth:1100,margin:'0 auto',padding:'0 20px',height:56,display:'flex',alignItems:'center',justifyContent:'space-between'}}><Link href="/" style={{display:'flex',alignItems:'center',gap:9}}><div style={{width:30,height:30,background:'linear-gradient(135deg,#0D9488,#14B8A6)',borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><span style={{color:'white',fontWeight:700,fontSize:12,fontFamily:'JetBrains Mono'}}>Tx</span></div><span style={{color:'white',fontFamily:'DM Serif Display',fontSize:17}}>Taxd<span style={{color:'#14B8A6'}}>Calc</span></span></Link>{mob?(<button onClick={()=>setOpen(!open)} style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:7,padding:'8px 10px',display:'flex',flexDirection:'column',gap:4}}>{[0,1,2].map(i=><span key={i} style={{display:'block',width:18,height:2,background:'white',borderRadius:1,transition:'all 0.2s',transform:open&&i===0?'rotate(45deg) translate(4px,4px)':open&&i===2?'rotate(-45deg) translate(4px,-4px)':'none',opacity:open&&i===1?0:1}}/>)}</button>):(<div style={{display:'flex',gap:2,alignItems:'center'}}>{links.map(([href,label])=>(<Link key={href} href={href} style={{padding:'7px 13px',borderRadius:6,background:href==='/ir35'?'rgba(13,148,136,0.2)':'transparent',color:href==='/ir35'?'#14B8A6':'rgba(255,255,255,0.6)',fontSize:13,fontWeight:href==='/ir35'?600:400}}>{label}</Link>))}<span style={{fontSize:11,color:'#14B8A6',fontFamily:'JetBrains Mono',background:'rgba(13,148,136,0.15)',padding:'3px 9px',borderRadius:4,border:'1px solid rgba(20,184,166,0.3)',marginLeft:8}}>2026-27</span></div>)}</div>{mob&&open&&(<div style={{background:'#162d52',borderTop:'1px solid rgba(255,255,255,0.08)',padding:'6px 0 12px'}}>{links.map(([href,label])=>(<Link key={href} href={href} onClick={()=>setOpen(false)} style={{display:'block',padding:'12px 24px',background:href==='/ir35'?'rgba(13,148,136,0.15)':'transparent',color:href==='/ir35'?'#14B8A6':'rgba(255,255,255,0.65)',fontSize:14,fontWeight:href==='/ir35'?600:400}}>{label}</Link>))}</div>)}</nav>);}

function Footer(){const mob=useW()<640;return(<footer style={{background:'#070D1C',padding:'32px 20px',borderTop:'1px solid rgba(255,255,255,0.05)',marginTop:48}}><div style={{maxWidth:1100,margin:'0 auto'}}><div style={{display:'grid',gridTemplateColumns:mob?'1fr 1fr':'repeat(4,1fr)',gap:24,marginBottom:24}}><div><div style={{fontSize:11,color:'rgba(255,255,255,0.3)',letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:10,fontFamily:'JetBrains Mono'}}>Core Tools</div>{[['/','Salary Calculator'],['/ir35','IR35 Calculator'],['/nhs','NHS Pay Bands'],['/hourly','Hourly Rate'],['/bonus','Bonus Tax'],['/sacrifice','Salary Sacrifice'],['/comparison','Job Comparison'],['/maternity','Maternity Pay'],['/part-time-salary-calculator','Part-Time Pay']].map(([h,l])=><Link key={h} href={h} style={{display:'block',fontSize:12,color:'rgba(255,255,255,0.45)',marginBottom:5}}>{l}</Link>)}</div><div><div style={{fontSize:11,color:'rgba(255,255,255,0.3)',letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:10,fontFamily:'JetBrains Mono'}}>Tax Planning</div>{[['/blog/60-percent-tax-trap','60% Tax Trap'],['/blog/hicbc-child-benefit-charge','Child Benefit Taper'],['/blog/personal-allowance-taper-100k','£100k PA Taper'],['/blog/plan-5-student-loan-take-home','Plan 5 Student Loan'],['/blog/salary-sacrifice-electric-car-uk-2026','EV Salary Sacrifice'],['/blog/pension-tax-relief-your-free-money','Pension Tax Relief']].map(([h,l])=><Link key={h} href={h} style={{display:'block',fontSize:12,color:'rgba(255,255,255,0.45)',marginBottom:5}}>{l}</Link>)}</div><div><div style={{fontSize:11,color:'rgba(255,255,255,0.3)',letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:10,fontFamily:'JetBrains Mono'}}>Public Sector</div>{[['/nhs-pay-guide','NHS Pay Guide'],['/teacher-pay-guide','Teacher Pay Guide'],['/public-sector-pay','Public Sector Hub'],['/public-sector-pay/police','Police Pay'],['/public-sector-pay/firefighters','Firefighter Pay'],['/public-sector-pay/civil-service','Civil Service Pay']].map(([h,l])=><Link key={h} href={h} style={{display:'block',fontSize:12,color:'rgba(255,255,255,0.45)',marginBottom:5}}>{l}</Link>)}</div><div><div style={{fontSize:11,color:'rgba(255,255,255,0.3)',letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:10,fontFamily:'JetBrains Mono'}}>Guides</div>{[['/blog','All Tax Guides'],['/blog/ir35-inside-outside-calculator-2026','IR35 Guide'],['/blog/45000-salary-take-home-uk-2026','£45k Salary'],['/blog/nhs-band-5-take-home-pay-2026','NHS Band 5'],['/maternity-pay-self-employed','Self-Employed Maternity'],['/tools','All Tools']].map(([h,l])=><Link key={h} href={h} style={{display:'block',fontSize:12,color:'rgba(255,255,255,0.45)',marginBottom:5}}>{l}</Link>)}</div></div><div style={{borderTop:'1px solid rgba(255,255,255,0.06)',paddingTop:18,display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:10,alignItems:'center'}}><Link href="/" style={{display:'flex',alignItems:'center',gap:8}}><div style={{width:26,height:26,background:'linear-gradient(135deg,#0D9488,#14B8A6)',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{color:'white',fontWeight:700,fontSize:11,fontFamily:'JetBrains Mono'}}>Tx</span></div><span style={{color:'white',fontFamily:'DM Serif Display',fontSize:15}}>Taxd<span style={{color:'#14B8A6'}}>Calc</span></span></Link><span style={{fontSize:11,color:'rgba(255,255,255,0.2)',fontFamily:'JetBrains Mono'}}>Updated April 2026 · 2026-27 HMRC rates</span><span style={{fontSize:11,color:'rgba(255,255,255,0.18)',maxWidth:300,lineHeight:1.6}}>For guidance only. Always consult HMRC or a qualified adviser.</span></div></div></footer>);}

function FAQItem({q,a}){const[open,setOpen]=useState(false);return(<div style={{borderBottom:`1px solid ${C.border}`}}><button onClick={()=>setOpen(!open)} style={{width:'100%',textAlign:'left',padding:'13px 0',background:'none',border:'none',display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:12}}><span style={{fontSize:14,fontWeight:700,color:C.navy,lineHeight:1.4,flex:1}}>{q}</span><span style={{color:C.teal,fontSize:16,flexShrink:0,marginTop:2,fontWeight:700,transition:'transform 0.2s',transform:open?'rotate(45deg)':'none'}}>+</span></button>{open&&<div style={{padding:'0 0 14px',fontSize:13,color:C.mid,lineHeight:1.75}}>{a}</div>}</div>);}

export default function IR35Page(){
  const mob=useW()<640;
  const[dayRate,setDayRate]=useState(500);
  const[days,setDays]=useState(220);
  const[penPct,setPenPct]=useState(5);

  const annual=dayRate*days;
  const inside=calcInside(annual,penPct);
  const outside=calcOutside(annual);
  const diff=outside.takeHome-inside.takeHome;
  const outsideWins=diff>0;

  const TABLE=[350,400,500,600,750].map(r=>{const a=r*220,i=calcInside(a,5),o=calcOutside(a),d=o.takeHome-i.takeHome;return {rate:r,annual:a,insideTH:i.takeHome,outsideTH:o.takeHome,diff:d};});

  return(
    <>
      <style>{GS}</style>
      <Nav/>

      <div className="ai-answer" style={{background:C.tealBg,borderBottom:`1px solid ${C.tealBd}`,padding:mob?'14px 16px':'16px 24px'}}>
        <div style={{maxWidth:900,margin:'0 auto'}}>
          <div style={{fontSize:10,color:C.teal,fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',fontFamily:'JetBrains Mono',marginBottom:6}}>Quick Answer — IR35 2026-27</div>
          <p style={{fontSize:mob?14:15,color:'#0f766e',fontWeight:600,lineHeight:1.6,marginBottom:10}}>
            On a £{dayRate.toLocaleString()}/day × {days} days (£{annual.toLocaleString()}/yr): inside IR35 <strong>{fmt(inside.takeHome)}/year</strong>, outside IR35 (Ltd Co.) <strong>{fmt(outside.takeHome)}/year</strong> — {outsideWins?`outside IR35 pays ${fmt(diff)} more`:`inside IR35 pays ${fmt(Math.abs(diff))} more`} in 2026-27.
          </p>
          <div style={{display:'grid',gridTemplateColumns:mob?'repeat(2,1fr)':'repeat(4,1fr)',gap:8}}>
            {[['Inside IR35',fmt(inside.takeHome)],['Outside IR35 (Ltd)',fmt(outside.takeHome)],['Difference',(diff>=0?'+':'')+fmt(diff)],['Dividend tax','10.75% basic']].map(([l,v])=>(
              <div key={l} style={{background:'rgba(13,148,136,0.1)',borderRadius:7,padding:'9px 11px'}}>
                <div style={{fontSize:9,color:C.teal,textTransform:'uppercase',letterSpacing:'0.1em',fontFamily:'JetBrains Mono',marginBottom:3}}>{l}</div>
                <div style={{fontFamily:'JetBrains Mono',fontSize:12,fontWeight:700,color:'#0f766e'}}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{background:`linear-gradient(135deg,${C.navy},${C.navyMid})`,padding:mob?'24px 20px 38px':'32px 24px 46px',position:'relative',overflow:'hidden'}}>
        <div style={{maxWidth:900,margin:'0 auto'}}>
          <h1 style={{fontFamily:'DM Serif Display',fontSize:mob?22:36,color:'white',lineHeight:1.15,marginBottom:10}}>IR35 Contractor Calculator 2026-27</h1>
          <p style={{color:'rgba(255,255,255,0.5)',fontSize:mob?13:15,maxWidth:540}}>Compare PAYE inside IR35 vs Limited Company outside IR35. Updated for 10.75% dividend tax.</p>
        </div>
      </div>

      <div style={{maxWidth:900,margin:'0 auto',padding:mob?'14px 16px 48px':'16px 24px 56px'}}>
        <div style={{background:C.white,borderRadius:14,padding:mob?18:24,boxShadow:C.shadow,border:`1px solid ${C.border}`,marginBottom:16}} className="fi">
          <h2 style={{fontFamily:'DM Serif Display',fontSize:17,color:C.navy,marginBottom:16}}>Your Contract Details</h2>
          <div style={{display:'grid',gridTemplateColumns:mob?'1fr':'1fr 1fr 1fr',gap:14,marginBottom:18}}>
            <div>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:7}}><label style={{fontSize:12,fontWeight:600,color:C.navy}}>Day Rate</label></div>
              <div style={{position:'relative'}}>
                <span style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:C.slate,fontSize:15,fontWeight:600,fontFamily:'JetBrains Mono',pointerEvents:'none'}}>£</span>
                <input type="number" inputMode="decimal" value={dayRate === 0 ? '' : dayRate} placeholder="0" onChange={e=>setDayRate(e.target.value === '' ? 0 : Number(e.target.value))} style={{width:'100%',padding:'12px 14px 12px 28px',border:`1.5px solid ${C.borderDk}`,borderRadius:8,fontSize:16,fontFamily:'JetBrains Mono',fontWeight:600,color:C.navy,background:'white',outline:'none'}} onFocus={e=>e.target.style.borderColor=C.teal} onBlur={e=>e.target.style.borderColor=C.borderDk}/>
              </div>
            </div>
            <div>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:7}}><label style={{fontSize:12,fontWeight:600,color:C.navy}}>Days/Year</label></div>
              <input type="number" inputMode="decimal" value={days === 0 ? '' : days} placeholder="0" onChange={e=>setDays(e.target.value === '' ? 0 : Number(e.target.value))} style={{width:'100%',padding:'12px 14px',border:`1.5px solid ${C.borderDk}`,borderRadius:8,fontSize:16,fontFamily:'JetBrains Mono',fontWeight:600,color:C.navy,background:'white',outline:'none'}} onFocus={e=>e.target.style.borderColor=C.teal} onBlur={e=>e.target.style.borderColor=C.borderDk}/>
            </div>
            <div>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}><label style={{fontSize:12,fontWeight:600,color:C.navy}}>Pension %</label><span style={{fontFamily:'JetBrains Mono',fontSize:12,color:C.teal,fontWeight:600}}>{penPct}%</span></div>
              <input type="range" min={0} max={20} step={0.5} value={penPct} onChange={e=>setPenPct(Number(e.target.value))}/>
            </div>
          </div>

          <div style={{background:C.tealBg,border:`1px solid ${C.tealBd}`,borderRadius:8,padding:'10px 14px',marginBottom:18,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span style={{fontSize:12,color:C.teal,fontWeight:600}}>Annual contract value</span>
            <span style={{fontFamily:'JetBrains Mono',fontSize:16,fontWeight:700,color:C.teal}}><AnimNum value={annual}/></span>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:14}}>
            <div style={{background:`linear-gradient(135deg,${C.navy},${C.navyMid})`,borderRadius:12,padding:'18px 16px'}}>
              <div style={{fontSize:10,color:'rgba(255,255,255,0.45)',letterSpacing:'0.1em',textTransform:'uppercase',fontFamily:'JetBrains Mono',marginBottom:4}}>Inside IR35 (PAYE)</div>
              <div style={{fontFamily:'DM Serif Display',fontSize:mob?26:34,color:'white',lineHeight:1}}><AnimNum value={inside.takeHome}/></div>
              <div style={{fontSize:11,color:'rgba(255,255,255,0.4)',fontFamily:'JetBrains Mono',marginTop:4}}><AnimNum value={inside.takeHome/12} f={fmtD}/>/month</div>
            </div>
            <div style={{background:outsideWins?`linear-gradient(135deg,#064E3B,#065F46)`:`linear-gradient(135deg,#1E1B4B,#312E81)`,borderRadius:12,padding:'18px 16px'}}>
              <div style={{fontSize:10,color:'rgba(255,255,255,0.45)',letterSpacing:'0.1em',textTransform:'uppercase',fontFamily:'JetBrains Mono',marginBottom:4}}>Outside IR35 (Ltd)</div>
              <div style={{fontFamily:'DM Serif Display',fontSize:mob?26:34,color:'white',lineHeight:1}}><AnimNum value={outside.takeHome}/></div>
              <div style={{fontSize:11,color:'rgba(255,255,255,0.4)',fontFamily:'JetBrains Mono',marginTop:4}}><AnimNum value={outside.takeHome/12} f={fmtD}/>/month</div>
            </div>
          </div>
        </div>

        <div style={{background:C.white,borderRadius:12,padding:mob?16:22,border:`1px solid ${C.border}`,boxShadow:C.shadow,marginBottom:16}}>
          <h2 style={{fontFamily:'DM Serif Display',fontSize:mob?17:20,color:C.navy,marginBottom:4}}>Rate Comparison</h2>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:12,minWidth:480}}>
              <thead><tr style={{background:C.bg}}>{['Day Rate','Annual','Inside','Outside','Diff'].map(h=><th key={h} style={{textAlign:'left',padding:'9px 10px',color:C.slate,fontSize:10,textTransform:'uppercase',fontFamily:'JetBrains Mono'}}>{h}</th>)}</tr></thead>
              <tbody>
                {TABLE.map((row,i)=>(
                  <tr key={row.rate} style={{borderBottom:`1px solid ${C.border}`,background:row.rate===dayRate?C.tealBg:i%2===0?'transparent':'rgba(0,0,0,0.012)'}}>
                    <td style={{padding:'10px',fontFamily:'JetBrains Mono'}}>£{row.rate}/day</td>
                    <td style={{padding:'10px',fontFamily:'JetBrains Mono'}}>{fmt(row.annual)}</td>
                    <td style={{padding:'10px',fontFamily:'JetBrains Mono',fontWeight:700}}>{fmt(row.insideTH)}</td>
                    <td style={{padding:'10px',fontFamily:'JetBrains Mono',fontWeight:700}}>{fmt(row.outsideTH)}</td>
                    <td style={{padding:'10px',fontFamily:'JetBrains Mono',fontWeight:700,color:row.diff>0?C.green:C.red}}>{row.diff>=0?'+':''}{fmt(row.diff)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {mob && annual > 0 && (
        <div style={{position:'fixed',bottom:0,left:0,right:0,background:C.navy,zIndex:90,height:52,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 20px',boxShadow:'0 -2px 16px rgba(0,0,0,0.3)'}}>
          <div>
            <div style={{fontSize:9,color:'rgba(255,255,255,0.4)',fontFamily:'JetBrains Mono',textTransform:'uppercase'}}>Inside</div>
            <div style={{fontFamily:'DM Serif Display',fontSize:19,color:'#14B8A6',lineHeight:1}}>{fmt(inside.takeHome)}</div>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:9,color:'rgba(255,255,255,0.4)',fontFamily:'JetBrains Mono',textTransform:'uppercase'}}>Outside</div>
            <div style={{fontFamily:'JetBrains Mono',fontSize:13,color:'white',fontWeight:700,lineHeight:1}}>{fmt(outside.takeHome)}</div>
          </div>
        </div>
      )}
      <Footer/>
    </>
  );
}
