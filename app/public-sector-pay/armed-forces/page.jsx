'use client';
import { useState } from 'react';
import Link from 'next/link';

const GS = `@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Source+Serif+4:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}body{background:#F4F6F9;color:#1E293B;font-family:'Source Serif 4',Georgia,serif;-webkit-tap-highlight-color:transparent;}a{text-decoration:none;color:inherit;}button{cursor:pointer;font-family:inherit;}@keyframes fi{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}.fi{animation:fi 0.35s ease both;}`;
const fmt = n => '£' + Math.round(n).toLocaleString('en-GB');
const GRADES = [{rank:'Private / Able Rating L1',gross:23907,pen:4.5,th:19872,mo:1656,desc:'Entry — other ranks'},{rank:'Private / AB Level 5 (competent)',gross:27698,pen:4.5,th:22465,mo:1872,desc:'Competent other rank'},{rank:'Corporal / Leading Rate',gross:32234,pen:4.5,th:25568,mo:2131,desc:'Junior NCO'},{rank:'Sergeant / Petty Officer',gross:38845,pen:4.5,th:30090,mo:2507,desc:'Senior NCO'},{rank:'Warrant Officer Class 2',gross:47480,pen:4.5,th:35996,mo:3000,desc:'Senior Warrant Officer'},{rank:'2nd Lieutenant / Midshipman',gross:34614,pen:4.5,th:27196,mo:2266,desc:'Junior commissioned officer'},{rank:'Lieutenant / Flying Officer',gross:42681,pen:4.5,th:32713,mo:2726,desc:'Mid-rank officer'},{rank:'Captain / Flight Lieutenant',gross:51923,pen:4.5,th:39134,mo:3261,desc:'Company/squadron level'},{rank:'Major / Squadron Leader',gross:62282,pen:4.5,th:44999,mo:3750,desc:'Senior officer'}];

function Nav(){return(<nav style={{background:'#0C1E3C',position:'sticky',top:0,zIndex:100,boxShadow:'0 2px 16px rgba(0,0,0,0.25)'}}><div style={{maxWidth:1100,margin:'0 auto',padding:'0 20px',height:56,display:'flex',alignItems:'center',justifyContent:'space-between'}}><Link href="/" style={{display:'flex',alignItems:'center',gap:9}}><div style={{width:30,height:30,background:'linear-gradient(135deg,#0D9488,#14B8A6)',borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{color:'white',fontWeight:700,fontSize:12,fontFamily:'JetBrains Mono'}}>Tx</span></div><span style={{color:'white',fontFamily:'DM Serif Display',fontSize:17}}>Taxd<span style={{color:'#14B8A6'}}>Calc</span></span></Link><div style={{display:'flex',gap:2}}>{[['/','Salary'],['/ir35','IR35'],['/nhs','NHS'],['/public-sector-pay','Public Sector'],['/blog','Guides']].map(([h,l])=><Link key={h} href={h} style={{padding:'7px 11px',borderRadius:6,color:'rgba(255,255,255,0.6)',fontSize:12}}>{l}</Link>)}</div></div></nav>);}
function Footer(){return(<footer style={{background:'#070D1C',padding:'40px 24px 28px',borderTop:'1px solid rgba(255,255,255,0.06)'}}><div style={{maxWidth:1100,margin:'0 auto'}}><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:'28px 24px',marginBottom:28}}><div><div style={{fontSize:10,color:'rgba(255,255,255,0.28)',letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:12,fontFamily:'JetBrains Mono',fontWeight:600}}>Core Tools</div>{[['/','Salary Calculator'],['/ir35','IR35 Calculator'],['/nhs','NHS Pay Bands'],['/hourly','Hourly Rate']].map(([h,l])=><Link key={h} href={h} style={{display:'block',fontSize:12,color:'rgba(255,255,255,0.42)',marginBottom:7,lineHeight:1.4}}>{l}</Link>)}</div></div><div style={{borderTop:'1px solid rgba(255,255,255,0.07)',paddingTop:20,display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:12,alignItems:'center'}}><Link href="/" style={{display:'flex',alignItems:'center',gap:9}}><div style={{width:28,height:28,background:'linear-gradient(135deg,#0D9488,#14B8A6)',borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{color:'white',fontWeight:700,fontSize:12,fontFamily:'JetBrains Mono'}}>Tx</span></div><span style={{color:'white',fontFamily:'DM Serif Display',fontSize:16}}>Taxd<span style={{color:'#14B8A6'}}>Calc</span></span></Link><span style={{fontSize:11,color:'rgba(255,255,255,0.22)',fontFamily:'JetBrains Mono'}}>Updated April 2026</span></div></div></footer>);}
function FAQItem({q,a}){const[open,setOpen]=useState(false);return(<div style={{borderBottom:'1px solid #E2E8F0'}}><button onClick={()=>setOpen(!open)} style={{width:'100%',textAlign:'left',padding:'14px 0',background:'none',border:'none',display:'flex',justifyContent:'space-between',gap:12}}><span style={{fontSize:14,fontWeight:700,color:'#0C1E3C',lineHeight:1.4,flex:1}}>{q}</span><span style={{color:'#0D9488',fontSize:18,fontWeight:700,transition:'transform 0.2s',display:'inline-block',transform:open?'rotate(45deg)':'none',flexShrink:0}}>+</span></button>{open&&<div style={{paddingBottom:14,fontSize:13,color:'#475569',lineHeight:1.8}}>{a}</div>}</div>);}

export default function Page(){
  const schemaFAQ={'@context':'https://schema.org','@type':'FAQPage',mainEntity:[{'@type':'Question',name:'What is armed forces take-home pay in 2026-27?',acceptedAnswer:{'@type':'Answer',text:'A Private on Level 1 (£23,907, including X-Factor) takes home £19,872/year (£1,656/month) after income tax and NI.'}}]};
  const schemaBreadcrumb={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'TaxdCalc',item:'https://taxdcal.co.uk'}]};

  return(
    <>
      <style>{GS}</style>
      <Nav/>
      <div style={{background:'#F0FDFA',borderBottom:'1px solid #99F6E4',padding:'13px 24px'}}>
        <div style={{maxWidth:900,margin:'0 auto'}}><p style={{fontSize:14,color:'#0f766e',fontWeight:600}}>Armed Forces Pay Guide 2026-27</p></div>
      </div>
      <div style={{background:'linear-gradient(135deg,#422006,#78350F)',padding:'34px 24px 46px'}}>
        <div style={{maxWidth:900,margin:'0 auto'}}>
          <h1 style={{fontFamily:'DM Serif Display',fontSize:34,color:'white'}}>Armed Forces Pay Scales 2026-27</h1>
        </div>
      </div>
      <div style={{maxWidth:900,margin:'0 auto',padding:'20px 24px 72px'}}>
        <div style={{background:'white',borderRadius:12,border:'1px solid #E2E8F0',boxShadow:'0 4px 16px rgba(0,0,0,0.04)',overflow:'hidden'}} className="fi">
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
            <thead><tr style={{background:'#F4F6F9'}}>{['Grade','Gross','Take-Home','Monthly','Details'].map(h=><th key={h} style={{textAlign:'left',padding:'12px 14px',color:'#64748B'}}>{h}</th>)}</tr></thead>
            <tbody>{GRADES.map((g,i)=>(<tr key={i} style={{borderBottom:'1px solid #E2E8F0'}}><td style={{padding:'12px 14px',fontWeight:700}}>{g.rank}</td><td style={{padding:'12px 14px'}}>{fmt(g.gross)}</td><td style={{padding:'12px 14px',color:'#0D9488',fontWeight:700}}>{fmt(g.th)}</td><td style={{padding:'12px 14px',color:'#0D9488'}}>{fmt(g.mo)}</td><td style={{padding:'12px 14px',color:'#64748B'}}>{g.desc}</td></tr>))}</tbody>
          </table>
        </div>
        <div style={{marginTop:24}}>
          <h2 style={{fontFamily:'DM Serif Display',fontSize:20,marginBottom:12}}>FAQs</h2>
          <FAQItem q="What is the X-Factor?" a="The X-Factor is a 14.5% supplement reflecting the unique demands of military life." />
        </div>
      </div>
      <Footer/>
    </>
  );
}
