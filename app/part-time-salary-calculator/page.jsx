'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

function useW(){const[w,setW]=useState(typeof window!=='undefined'?window.innerWidth:800);useEffect(()=>{const f=()=>setW(window.innerWidth);window.addEventListener('resize',f);return()=>window.removeEventListener('resize',f);},[]);return w;}

const C={navy:'#0C1E3C',navyMid:'#1e3d6e',teal:'#0D9488',tealL:'#14B8A6',tealBg:'#F0FDFA',tealBd:'#99F6E4',border:'#E2E8F0',borderDk:'#CBD5E1',bg:'#F4F6F9',white:'#FFFFFF',green:'#059669',red:'#DC2626',text:'#1E293B',mid:'#475569',slate:'#64748B',sl:'#94A3B8',shadow:'0 1px 3px rgba(0,0,0,0.07),0 4px 16px rgba(0,0,0,0.04)'};
const GS=`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Source+Serif+4:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}body{background:#F4F6F9;color:#1E293B;font-family:'Source Serif 4',Georgia,serif;-webkit-tap-highlight-color:transparent;}input[type=range]{-webkit-appearance:none;width:100%;height:4px;background:#CBD5E1;border-radius:2px;outline:none;}input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;border-radius:50%;background:#0C1E3C;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.2);}select{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2364748b' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;background-color:white;}@keyframes fi{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}.fi{animation:fi 0.35s ease both;}a{text-decoration:none;color:inherit;}button{cursor:pointer;font-family:inherit;}@media(max-width:767px){body{padding-bottom:52px;}}`;

function calcIT(gross,pen=0){const ti=Math.max(0,gross-pen);let pa=12570;if(ti>100000)pa=Math.max(0,12570-(ti-100000)/2);const tx=Math.max(0,ti-pa);const b1=Math.min(tx,37700),b2=Math.min(Math.max(0,tx-b1),74870),b3=Math.max(0,tx-b1-b2);return b1*0.20+b2*0.40+b3*0.45;}
function calcNI(g){if(g<=12570)return 0;return(Math.min(g,50270)-12570)*0.08+Math.max(0,g-50270)*0.02;}
function calc(gross,penPct){const p=gross*(penPct/100),it=calcIT(gross,p),ni=calcNI(gross),th=gross-it-ni-p;return{gross,it,ni,p,th,mo:th/12,wk:th/52};}

const fmt=n=>'\u00A3'+Math.round(Math.abs(n||0)).toLocaleString('en-GB');
const fmtD=n=>'\u00A3'+(n||0).toLocaleString('en-GB',{minimumFractionDigits:2,maximumFractionDigits:2});

function Nav(){const[open,setOpen]=useState(false);const mob=useW()<640;const links=[['/',   'Salary Calculator'],['/ir35','IR35'],['/nhs','NHS Bands'],['/tools','All Tools'],['/blog','Tax Guides']];return(<nav style={{background:C.navy,position:'sticky',top:0,zIndex:100,boxShadow:'0 2px 16px rgba(0,0,0,0.25)'}}><div style={{maxWidth:1100,margin:'0 auto',padding:'0 20px',height:56,display:'flex',alignItems:'center',justifyContent:'space-between'}}><Link href="/" style={{display:'flex',alignItems:'center',gap:9}}><div style={{width:30,height:30,background:'linear-gradient(135deg,#0D9488,#14B8A6)',borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><span style={{color:'white',fontWeight:700,fontSize:12,fontFamily:'JetBrains Mono'}}>Tx</span></div><span style={{color:'white',fontFamily:'DM Serif Display',fontSize:17}}>Taxd<span style={{color:'#14B8A6'}}>Calc</span></span></Link>{mob?(<button onClick={()=>setOpen(!open)} style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:7,padding:'8px 10px',display:'flex',flexDirection:'column',gap:4}}>{[0,1,2].map(i=><span key={i} style={{display:'block',width:18,height:2,background:'white',borderRadius:1,transition:'all 0.2s'}}/>)}</button>):(<div style={{display:'flex',gap:2,alignItems:'center'}}>{links.map(([href,label])=>(<Link key={href} href={href} style={{padding:'7px 13px',borderRadius:6,color:'rgba(255,255,255,0.6)',fontSize:13}}>{label}</Link>))}<span style={{fontSize:11,color:'#14B8A6',fontFamily:'JetBrains Mono',background:'rgba(13,148,136,0.15)',padding:'3px 9px',borderRadius:4,border:'1px solid rgba(20,184,166,0.3)',marginLeft:8}}>2026-27</span></div>)}</div>{mob&&open&&(<div style={{background:'#162d52',borderTop:'1px solid rgba(255,255,255,0.08)',padding:'6px 0 12px'}}>{links.map(([href,label])=>(<Link key={href} href={href} onClick={()=>setOpen(false)} style={{display:'block',padding:'12px 24px',color:'rgba(255,255,255,0.65)',fontSize:14}}>{label}</Link>))}</div>)}</nav>);}
function Footer(){return(<footer style={{background:'#070D1C',padding:'24px 20px',borderTop:'1px solid rgba(255,255,255,0.05)',marginTop:48}}><div style={{maxWidth:1100,margin:'0 auto',display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:14,alignItems:'center'}}><Link href="/" style={{display:'flex',alignItems:'center',gap:8}}><div style={{width:26,height:26,background:'linear-gradient(135deg,#0D9488,#14B8A6)',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{color:'white',fontWeight:700,fontSize:11,fontFamily:'JetBrains Mono'}}>Tx</span></div><span style={{color:'white',fontFamily:'DM Serif Display',fontSize:15}}>Taxd<span style={{color:'#14B8A6'}}>Calc</span></span></Link><span style={{fontSize:11,color:'rgba(255,255,255,0.2)',fontFamily:'JetBrains Mono'}}>Updated April 2026</span><span style={{fontSize:11,color:'rgba(255,255,255,0.18)',maxWidth:280,lineHeight:1.6}}>For guidance only. Consult HMRC or a qualified adviser.</span></div></footer>);}

export default function PartTimePage(){
  const mob=useW()<640;
  const[mode,setMode]=useState('hours');
  const[fteSalary,setFteSalary]=useState('45000');
  const[fteHours,setFteHours]=useState(37.5);
  const[actualHours,setActualHours]=useState(30);
  const[fteDays,setFteDays]=useState(5);
  const[actualDays,setActualDays]=useState(4);
  const[pension,setPension]=useState(5);

  const fte=Math.max(0,Number(fteSalary)||0);
  const ratio=mode==='hours'?(actualHours/fteHours):(actualDays/fteDays);
  const proRata=Math.round(fte*ratio);
  const rFTE=calc(fte,pension);
  const rPT=calc(proRata,pension);

  const schemaCalc={'@context':'https://schema.org','@type':'WebApplication','@id':'https://taxdcal.co.uk/part-time-salary-calculator#calc',name:'Part-Time Salary Calculator UK 2026-27',applicationCategory:'FinanceApplication',operatingSystem:'Any',offers:{'@type':'Offer',price:'0',priceCurrency:'GBP'},provider:{'@type':'Organization',name:'TaxdCalc',url:'https://taxdcal.co.uk'},url:'https://taxdcal.co.uk/part-time-salary-calculator'};
  const schemaFAQ={'@context':'https://schema.org','@type':'FAQPage',mainEntity:[
    {'@type':'Question',name:'How is pro-rata salary calculated?',acceptedAnswer:{'@type':'Answer',text:'Pro-rata salary = full-time salary multiplied by actual hours or days divided by full-time hours or days.'}},
    {'@type':'Question',name:'Is take-home pay proportional to hours worked?',acceptedAnswer:{'@type':'Answer',text:'Not exactly. Income tax thresholds are fixed amounts, meaning part-time workers keep a higher percentage of their gross pay.'}}
  ]};
  const schemaBreadcrumb={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'TaxdCalc',item:'https://taxdcal.co.uk'},{'@type':'ListItem',position:2,name:'Part-Time Salary Calculator',item:'https://taxdcal.co.uk/part-time-salary-calculator'}]};

  return(
    <>
      <style>{GS}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schemaCalc)}}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schemaFAQ)}}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schemaBreadcrumb)}}/>
      <Nav/>

      <div style={{background:`linear-gradient(135deg,${C.navy},${C.navyMid})`,padding:mob?'28px 20px 44px':'36px 24px 52px',position:'relative',overflow:'hidden'}}>
        <div style={{maxWidth:900,margin:'0 auto'}}>
          <div style={{display:'inline-block',background:'rgba(13,148,136,0.15)',border:'1px solid rgba(20,184,166,0.3)',borderRadius:20,padding:'3px 12px',fontSize:11,color:'#14B8A6',marginBottom:10,fontFamily:'JetBrains Mono'}}>Part-Time & Pro-Rata</div>
          <h1 style={{fontFamily:'DM Serif Display',fontSize:mob?22:34,color:'white',lineHeight:1.2,marginBottom:8}}>Part-Time Salary Calculator 2026-27</h1>
          {proRata>0&&(
            <div style={{display:'grid',gridTemplateColumns:mob?'1fr 1fr':'repeat(4,1fr)',gap:10,marginTop:16}}>
              {[['Pro-rata gross',fmt(proRata),'#14B8A6'],['Annual take-home',fmt(rPT.th),'white'],['Monthly net',fmtD(rPT.mo),'white'],['You keep',((rPT.th/proRata)*100).toFixed(1)+'%',C.tealL]].map(([l,v,cl])=>(
                <div key={l} style={{background:'rgba(255,255,255,0.06)',borderRadius:10,padding:'12px 14px',border:'1px solid rgba(255,255,255,0.08)'}}>
                  <div style={{fontSize:9,color:'rgba(255,255,255,0.4)',letterSpacing:'0.1em',textTransform:'uppercase',fontFamily:'JetBrains Mono',marginBottom:4}}>{l}</div>
                  <div style={{fontFamily:'DM Serif Display',fontSize:mob?18:24,color:cl,lineHeight:1}}>{v}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{maxWidth:900,margin:'0 auto',padding:mob?'16px 16px 48px':'20px 24px 56px'}}>
        <div style={{background:C.white,borderRadius:14,padding:mob?18:24,boxShadow:C.shadow,border:`1px solid ${C.border}`,marginBottom:14}} className="fi">
          <h2 style={{fontFamily:'DM Serif Display',fontSize:17,color:C.navy,marginBottom:16}}>Your Details</h2>
          <div style={{marginBottom:18}}>
            <label style={{display:'block',fontSize:12,fontWeight:600,color:C.navy,marginBottom:7}}>Full-time equivalent (FTE) annual salary</label>
            <div style={{position:'relative'}}>
              <span style={{position:'absolute',left:13,top:'50%',transform:'translateY(-50%)',color:C.slate,fontSize:15,fontWeight:600,fontFamily:'JetBrains Mono',pointerEvents:'none'}}>\u00A3</span>
              <input type="number" value={fteSalary} onChange={e=>setFteSalary(e.target.value)} style={{width:'100%',padding:'12px 14px 12px 28px',border:`1.5px solid ${C.borderDk}`,borderRadius:8,fontSize:15,fontFamily:'JetBrains Mono',color:C.navy}}/>
            </div>
          </div>
          <div style={{display:'flex',gap:4,marginBottom:16,background:C.bg,padding:4,borderRadius:9}}>
            {[['hours','Calculate by hours'],['days','Calculate by days']].map(([m,l])=>(
              <button key={m} onClick={()=>setMode(m)} style={{flex:1,padding:'9px 8px',borderRadius:6,border:'none',background:mode===m?C.navy:'transparent',color:mode===m?'white':C.slate,fontSize:12}}>{l}</button>
            ))}
          </div>
          <div style={{marginBottom:16}}>
            <input type="range" min={0} max={20} step={0.5} value={pension} onChange={e=>setPension(Number(e.target.value))}/>
          </div>
        </div>
      </div>

      {mob && proRata > 0 && (
        <div style={{position:'fixed',bottom:0,left:0,right:0,background:C.navy,zIndex:90,height:52,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 20px'}}>
          <div><div style={{fontFamily:'DM Serif Display',fontSize:19,color:'#14B8A6'}}>{fmt(rPT.th)}</div></div>
        </div>
      )}
      <Footer/>
    </>
  );
}
