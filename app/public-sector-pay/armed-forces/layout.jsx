'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

function useW(){const[w,setW]=useState(typeof window!=='undefined'?window.innerWidth:800);useEffect(()=>{const f=()=>setW(window.innerWidth);window.addEventListener('resize',f);return()=>window.removeEventListener('resize',f);},[]);return w;}

const C={navy:'#0C1E3C',navyMid:'#1e3d6e',teal:'#0D9488',tealL:'#14B8A6',tealBg:'#F0FDFA',tealBd:'#99F6E4',border:'#E2E8F0',borderDk:'#CBD5E1',bg:'#F4F6F9',white:'#FFFFFF',green:'#059669',red:'#DC2626',text:'#1E293B',mid:'#475569',slate:'#64748B',sl:'#94A3B8',shadow:'0 1px 3px rgba(0,0,0,0.07),0 4px 16px rgba(0,0,0,0.04)'};
const GS=`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Source+Serif+4:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}body{background:#F4F6F9;color:#1E293B;font-family:'Source Serif 4',Georgia,serif;-webkit-tap-highlight-color:transparent;}a{text-decoration:none;color:inherit;}button{cursor:pointer;font-family:inherit;}@keyframes fi{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}.fi{animation:fi 0.35s ease both;}`;

const GRADES=[{grade:'Private L1',gross:23907,penPct:0,desc:'Entry OR',th:20733,mo:1728},{grade:'Corporal',gross:32234,penPct:0,desc:'Junior NCO',th:26728,mo:2227},{grade:'Sergeant',gross:38845,penPct:0,desc:'Senior NCO',th:31488,mo:2624},{grade:'Warrant Officer 2',gross:47480,penPct:0,desc:'Senior WO',th:37705,mo:3142},{grade:'Lieutenant',gross:42681,penPct:0,desc:'Junior officer',th:34250,mo:2854},{grade:'Captain',gross:51923,penPct:0,desc:'Mid officer',th:40673,mo:3389},{grade:'Major',gross:62282,penPct:0,desc:'Senior officer',th:46681,mo:3890}];
const fmt=n=>'£'+Math.round(Math.abs(n||0)).toLocaleString('en-GB');
const fmtD=n=>'£'+(n||0).toLocaleString('en-GB',{minimumFractionDigits:2,maximumFractionDigits:2});

function Nav(){const[open,setOpen]=useState(false);const mob=useW()<640;const links=[['/',   'Salary Calculator'],['/ir35','IR35'],['/nhs','NHS Bands'],['/tools','All Tools'],['/blog','Tax Guides']];return(<nav style={{background:C.navy,position:'sticky',top:0,zIndex:100,boxShadow:'0 2px 16px rgba(0,0,0,0.25)'}}><div style={{maxWidth:1100,margin:'0 auto',padding:'0 20px',height:56,display:'flex',alignItems:'center',justifyContent:'space-between'}}><Link href="/" style={{display:'flex',alignItems:'center',gap:9}}><div style={{width:30,height:30,background:'linear-gradient(135deg,#0D9488,#14B8A6)',borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><span style={{color:'white',fontWeight:700,fontSize:12,fontFamily:'JetBrains Mono'}}>Tx</span></div><span style={{color:'white',fontFamily:'DM Serif Display',fontSize:17}}>Taxd<span style={{color:'#14B8A6'}}>Calc</span></span></Link>{mob?(<button onClick={()=>setOpen(!open)} style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:7,padding:'8px 10px',display:'flex',flexDirection:'column',gap:4}}>{[0,1,2].map(i=><span key={i} style={{display:'block',width:18,height:2,background:'white',borderRadius:1}}/>)}</button>):(<div style={{display:'flex',gap:2,alignItems:'center'}}>{links.map(([href,label])=>(<Link key={href} href={href} style={{padding:'7px 13px',borderRadius:6,color:'rgba(255,255,255,0.6)',fontSize:13}}>{label}</Link>))}<span style={{fontSize:11,color:'#14B8A6',fontFamily:'JetBrains Mono',background:'rgba(13,148,136,0.15)',padding:'3px 9px',borderRadius:4,border:'1px solid rgba(20,184,166,0.3)',marginLeft:8}}>2026-27</span></div>)}</div>{mob&&open&&(<div style={{background:'#162d52',borderTop:'1px solid rgba(255,255,255,0.08)',padding:'6px 0 12px'}}>{links.map(([href,label])=>(<Link key={href} href={href} onClick={()=>setOpen(false)} style={{display:'block',padding:'12px 24px',color:'rgba(255,255,255,0.65)',fontSize:14}}>{label}</Link>))}</div>)}</nav>);}
function Footer(){return(<footer style={{background:'#070D1C',padding:'24px 20px',borderTop:'1px solid rgba(255,255,255,0.05)',marginTop:8}}><div style={{maxWidth:900,margin:'0 auto',display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:12,alignItems:'center'}}><Link href="/" style={{display:'flex',alignItems:'center',gap:8}}><div style={{width:26,height:26,background:'linear-gradient(135deg,#0D9488,#14B8A6)',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{color:'white',fontWeight:700,fontSize:11,fontFamily:'JetBrains Mono'}}>Tx</span></div><span style={{color:'white',fontFamily:'DM Serif Display',fontSize:15}}>Taxd<span style={{color:'#14B8A6'}}>Calc</span></span></Link><span style={{fontSize:11,color:'rgba(255,255,255,0.2)',fontFamily:'JetBrains Mono'}}>Updated April 2026</span><span style={{fontSize:11,color:'rgba(255,255,255,0.18)',maxWidth:280,lineHeight:1.6}}>For guidance only. Consult HMRC or a qualified adviser.</span></div></footer>);}

export default function Page(){
  const mob=useW()<640;
  const schemaFAQ={
    '@context':'https://schema.org','@type':'FAQPage',
    mainEntity:[
      {'@type':'Question',name:'What is the take-home pay?',acceptedAnswer:{'@type':'Answer',text:'A Private/Able Rating on Level 1 (£23,907) takes home approximately £20,733/year (£1,728/month) after income tax and NI. Armed forces pay includes the X-Factor allowance (14.5%) in the AFPRB figures.'}},
      {'@type':'Question',name:'How is the pension contribution calculated?',acceptedAnswer:{'@type':'Answer',text:'Armed Forces Pension Scheme 2015 (AFPS 2015) — defined benefit career average. Normal pension age 60. X-Factor supplement (14.5%) already included in AFPRB pay rates.'}},
    ]
  };
  const schemaBreadcrumb={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'TaxdCalc',item:'https://taxdcal.co.uk'},{'@type':'ListItem',position:2,name:'Public Sector Pay',item:'https://taxdcal.co.uk/public-sector-pay'},{'@type':'ListItem',position:3,name:'Armed Forces Pay Guide 2026-27',item:'https://taxdcal.co.uk/public-sector-pay/armed-forces'}]};

  return(
    <>
      <style>{GS}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schemaFAQ)}}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schemaBreadcrumb)}}/>
      <Nav/>
      <div style={{background:C.tealBg,borderBottom:`1px solid ${C.tealBd}`,padding:mob?'13px 16px':'15px 24px'}}>
        <div style={{maxWidth:900,margin:'0 auto'}}>
          <div style={{fontSize:10,color:C.teal,fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',fontFamily:'JetBrains Mono',marginBottom:5}}>Quick Answer — 2026-27</div>
          <p style={{fontSize:mob?13:14,color:'#0f766e',fontWeight:600,lineHeight:1.6}}>A Private/Able Rating on Level 1 (£23,907) takes home approximately £20,733/year (£1,728/month) after income tax and NI. Armed forces pay includes the X-Factor allowance (14.5%) in the AFPRB figures.</p>
        </div>
      </div>
      <div style={{background:`linear-gradient(135deg,${C.navy},${C.navyMid})`,padding:mob?'26px 20px 40px':'34px 24px 48px',position:'relative',overflow:'hidden'}}>
        <div style={{maxWidth:900,margin:'0 auto'}}>
          <div style={{display:'inline-block',background:'rgba(13,148,136,0.15)',border:'1px solid rgba(20,184,166,0.3)',borderRadius:20,padding:'3px 12px',fontSize:11,color:'#14B8A6',marginBottom:10,fontFamily:'JetBrains Mono'}}>AFPRB Pay Scale — Other Ranks & Officers</div>
          <h1 style={{fontFamily:'DM Serif Display',fontSize:mob?22:36,color:'white',lineHeight:1.15,marginBottom:10}}>Armed Forces Pay Guide 2026-27</h1>
          <div style={{display:'flex',gap:10,flexWrap:'wrap',marginTop:12}}>
            <Link href="/public-sector-pay" style={{background:'rgba(255,255,255,0.1)',color:'white',padding:'8px 14px',borderRadius:7,fontSize:12,fontWeight:600,border:'1px solid rgba(255,255,255,0.15)'}}>← Public Sector Hub</Link>
            <Link href="/" style={{background:C.teal,color:'white',padding:'8px 14px',borderRadius:7,fontSize:12,fontWeight:700}}>Full Salary Calculator</Link>
          </div>
        </div>
      </div>
      <div style={{maxWidth:900,margin:'0 auto',padding:mob?'16px 16px 56px':'20px 24px 72px'}}>
        <div style={{background:C.white,borderRadius:12,padding:mob?'14px 0':'18px 0',border:`1px solid ${C.border}`,boxShadow:C.shadow,marginBottom:16}} className="fi">
          <div style={{padding:mob?'0 14px 12px':'0 20px 14px'}}><h2 style={{fontFamily:'DM Serif Display',fontSize:18,color:C.navy,marginBottom:4}}>Pay Scale & Take-Home 2026-27</h2><p style={{fontSize:12,color:C.slate}}>Take-home after income tax, NI and pension. Figures for England & Wales.</p></div>
          <div style={{overflowX:'auto',WebkitOverflowScrolling:'touch'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:12,minWidth:480}}>
              <thead><tr style={{background:C.bg}}>{['Grade','Gross Salary','Annual Take-Home','Monthly Net','Pension','Role'].map(h=><th key={h} style={{textAlign:'left',padding:'9px 12px',color:C.slate,fontSize:10,textTransform:'uppercase',letterSpacing:'0.06em',borderBottom:`1px solid ${C.border}`,fontFamily:'JetBrains Mono',whiteSpace:'nowrap'}}>{h}</th>)}</tr></thead>
              <tbody>
                {GRADES.map((g,i)=>(
                  <tr key={g.grade} style={{borderBottom:`1px solid ${C.border}`,background:i%2===0?'transparent':'rgba(0,0,0,0.012)'}}>
                    <td style={{padding:'10px 12px',fontWeight:700,color:C.navy,fontSize:12,whiteSpace:'nowrap'}}>{g.grade}</td>
                    <td style={{padding:'10px 12px',fontFamily:'JetBrains Mono',fontSize:11,color:C.mid,whiteSpace:'nowrap'}}>{fmt(g.gross)}</td>
                    <td style={{padding:'10px 12px',fontFamily:'JetBrains Mono',fontWeight:700,color:C.teal,whiteSpace:'nowrap'}}>{fmt(g.th)}</td>
                    <td style={{padding:'10px 12px',fontFamily:'JetBrains Mono',fontWeight:700,color:C.teal,whiteSpace:'nowrap'}}>{fmtD(g.mo)}</td>
                    <td style={{padding:'10px 12px',fontFamily:'JetBrains Mono',fontSize:11,color:C.slate,whiteSpace:'nowrap'}}>{g.penPct}%</td>
                    <td style={{padding:'10px 12px',fontSize:11,color:C.slate}}>{g.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div style={{background:C.tealBg,border:`1px solid ${C.tealBd}`,borderRadius:10,padding:'14px 16px',marginBottom:16}}>
          <div style={{fontSize:12,fontWeight:700,color:C.teal,marginBottom:6}}>Pension Scheme</div>
          <p style={{fontSize:13,color:'#0f766e',lineHeight:1.7}}>Armed Forces Pension Scheme 2015 (AFPS 2015) — defined benefit career average. Normal pension age 60. X-Factor supplement (14.5%) already included in AFPRB pay rates.</p>
        </div>
        <div style={{background:`linear-gradient(135deg,${C.navy},${C.navyMid})`,borderRadius:12,padding:'14px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:10}}>
          <div style={{fontFamily:'DM Serif Display',fontSize:14,color:'white'}}>Calculate exact take-home for any salary</div>
          <Link href="/" style={{background:C.teal,color:'white',padding:'9px 18px',borderRadius:7,fontSize:13,fontWeight:700,display:'inline-block'}}>Open Salary Calculator →</Link>
        </div>
      </div>
      <Footer/>
    </>
  );
}