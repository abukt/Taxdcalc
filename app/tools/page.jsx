'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

function useW(){const[w,setW]=useState(typeof window!=='undefined'?window.innerWidth:800);useEffect(()=>{const f=()=>setW(window.innerWidth);window.addEventListener('resize',f);return()=>window.removeEventListener('resize',f);},[]);return w;}
const C={navy:'#0C1E3C',navyLight:'#162d52',teal:'#0D9488',tealLight:'#14B8A6',tealBg:'#F0FDFA',tealBorder:'#99F6E4',border:'#E2E8F0',white:'#FFFFFF',text:'#1E293B',textMid:'#475569',slate:'#64748B',slateLight:'#94A3B8',shadow:'0 1px 3px rgba(0,0,0,0.07),0 4px 16px rgba(0,0,0,0.04)'};
const GS='@import url(\'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Source+Serif+4:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap\');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}body{background:#F8F9FA;color:#1E293B;font-family:\'Source Serif 4\',Georgia,serif;}a{text-decoration:none;color:inherit;}button{cursor:pointer;}@keyframes fadeUp{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}.fu{animation:fadeUp 0.4s ease both;}';

const TOOLS = [
  {href:'/',icon:'💷',label:'Salary Calculator',sub:'Full UK take-home pay. Scotland + tax code.',live:true,tag:'Main'},
  {href:'/ir35',icon:'🏗',label:'IR35 Contractor',sub:'PAYE vs Ltd Co — 2026-27 dividend rates.',live:true,tag:'Popular'},
  {href:'/hourly',icon:'⏰',label:'Hourly Rate',sub:'Hourly wage to annual take-home.',live:true},
  {href:'/nhs',icon:'🏥',label:'NHS Pay Bands',sub:'All Bands 1 to 9 take-home pay.',live:true},
  {href:'/maternity',icon:'👶',label:'Maternity Pay',sub:'SMP at 187.18/week for 2026-27.',live:true},
  {href:'/bonus',icon:'💼',label:'Bonus Calculator',sub:'Net bonus after tax and NI.',live:true},
  {href:'/sacrifice',icon:'🏦',label:'Salary Sacrifice',sub:'Real cost of pension contribution.',live:true},
  {href:'/comparison',icon:'📊',label:'Job Comparison',sub:'Compare two salary packages.',live:true},
  {href:'#',icon:'🏠',label:'Mortgage Calculator',sub:'Coming soon',live:false},
  {href:'#',icon:'🧾',label:'VAT Calculator',sub:'Coming soon',live:false},
  {href:'#',icon:'⚖',label:'Redundancy Pay',sub:'Coming soon',live:false},
  {href:'#',icon:'🏛',label:'Stamp Duty',sub:'Coming soon',live:false},
];

function Nav(){const[open,setOpen]=useState(false);const mob=useW()<640;const links=[['/',   'Salary Calculator'],['/ir35','IR35'],['/nhs','NHS Bands'],['/tools','All Tools'],['/blog','Tax Guides']];return(<nav style={{background:'#0C1E3C',position:'sticky',top:0,zIndex:100,boxShadow:'0 2px 16px rgba(0,0,0,0.25)'}}><div style={{maxWidth:1100,margin:'0 auto',padding:'0 20px',height:56,display:'flex',alignItems:'center',justifyContent:'space-between'}}><Link href="/" style={{display:'flex',alignItems:'center',gap:9}}><div style={{width:30,height:30,background:'linear-gradient(135deg,#0D9488,#14B8A6)',borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><span style={{color:'white',fontWeight:700,fontSize:12,fontFamily:'JetBrains Mono'}}>Tx</span></div><span style={{color:'white',fontFamily:'DM Serif Display',fontSize:17}}>Taxd<span style={{color:'#14B8A6'}}>Calc</span></span></Link>{mob?(<button onClick={()=>setOpen(!open)} style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:7,padding:'8px 10px',display:'flex',flexDirection:'column',gap:4}}>{[0,1,2].map(i=><span key={i} style={{display:'block',width:18,height:2,background:'white',borderRadius:1,transition:'all 0.2s',transform:open&&i===0?'rotate(45deg) translate(4px,4px)':open&&i===2?'rotate(-45deg) translate(4px,-4px)':'none',opacity:open&&i===1?0:1}}/>)}</button>):(<div style={{display:'flex',gap:2,alignItems:'center'}}>{links.map(([href,label])=>(<Link key={href} href={href} style={{padding:'7px 13px',borderRadius:6,background:href==='/tools'?'rgba(13,148,136,0.2)':'transparent',color:href==='/tools'?'#14B8A6':'rgba(255,255,255,0.6)',fontSize:13,fontFamily:'Source Serif 4',fontWeight:href==='/tools'?600:400}}>{label}</Link>))}<span style={{fontSize:11,color:'#14B8A6',fontFamily:'JetBrains Mono',background:'rgba(13,148,136,0.15)',padding:'3px 9px',borderRadius:4,border:'1px solid rgba(20,184,166,0.3)',marginLeft:8}}>2026-27</span></div>)}</div>{mob&&open&&(<div style={{background:'#162d52',borderTop:'1px solid rgba(255,255,255,0.08)',padding:'6px 0 12px'}}>{links.map(([href,label])=>(<Link key={href} href={href} onClick={()=>setOpen(false)} style={{display:'block',padding:'12px 24px',background:href==='/tools'?'rgba(13,148,136,0.15)':'transparent',color:href==='/tools'?'#14B8A6':'rgba(255,255,255,0.65)',fontSize:14,fontFamily:'Source Serif 4',fontWeight:href==='/tools'?600:400}}>{label}</Link>))}</div>)}</nav>);}
function Footer(){return(<footer style={{background:'#070D1C',padding:'24px 20px',borderTop:'1px solid rgba(255,255,255,0.05)',marginTop:48}}><div style={{maxWidth:1100,margin:'0 auto',display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:14,alignItems:'center'}}><Link href="/" style={{display:'flex',alignItems:'center',gap:8}}><div style={{width:26,height:26,background:'linear-gradient(135deg,#0D9488,#14B8A6)',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{color:'white',fontWeight:700,fontSize:11,fontFamily:'JetBrains Mono'}}>Tx</span></div><span style={{color:'white',fontFamily:'DM Serif Display',fontSize:15}}>Taxd<span style={{color:'#14B8A6'}}>Calc</span></span></Link><span style={{fontSize:11,color:'rgba(255,255,255,0.2)',fontFamily:'JetBrains Mono'}}>Updated April 2026</span><span style={{fontSize:11,color:'rgba(255,255,255,0.18)',maxWidth:280,lineHeight:1.6}}>For guidance only. Consult HMRC or a qualified adviser.</span></div></footer>);}

export default function ToolsPage() {
  const mob = useW() < 640;
  return (
    <>
      <style>{GS}</style>
      <Nav/>
      <div style={{background:'linear-gradient(135deg,#0C1E3C,#1e3d6e)',padding:mob?'36px 20px 56px':'44px 24px 64px',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:-40,right:-30,width:200,height:200,borderRadius:'50%',background:'rgba(13,148,136,0.08)',pointerEvents:'none'}}/>
        <h1 style={{fontFamily:'DM Serif Display',fontSize:mob?28:44,color:'white',marginBottom:8}}>All Calculators</h1>
        <p style={{color:'rgba(255,255,255,0.45)',fontSize:14}}>8 live UK tax calculators. Scotland supported throughout. More tools coming soon.</p>
      </div>
      <div style={{maxWidth:1100,margin:mob?'-22px 0 0':'-26px auto 0',padding:mob?'0 16px 48px':'0 24px 56px'}}>
        <div style={{display:'grid',gridTemplateColumns:mob?'1fr 1fr':'repeat(auto-fill,minmax(210px,1fr))',gap:14}} className="fu">
          {TOOLS.map(t=>(
            t.live ? (
              <Link key={t.label} href={t.href}
                style={{background:C.white,border:'1px solid '+C.border,borderRadius:12,padding:'18px 16px',display:'block',boxShadow:C.shadow,transition:'all 0.2s'}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=C.teal;e.currentTarget.style.boxShadow='0 4px 20px rgba(0,0,0,0.1)';}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.boxShadow=C.shadow;}}>
                <div style={{fontSize:24,marginBottom:10}}>{t.icon}</div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:4,marginBottom:4}}>
                  <div style={{fontSize:13,fontWeight:700,color:C.navy,lineHeight:1.3}}>{t.label}</div>
                  {t.tag&&<span style={{fontSize:9,background:C.tealBg,color:C.teal,border:'1px solid '+C.tealBorder,borderRadius:3,padding:'2px 5px',flexShrink:0,fontWeight:700}}>{t.tag}</span>}
                </div>
                <div style={{fontSize:11,color:C.slateLight,lineHeight:1.4,marginBottom:8}}>{t.sub}</div>
                <div style={{fontSize:12,color:C.teal,fontWeight:600}}>Open calculator</div>
              </Link>
            ) : (
              <div key={t.label} style={{background:'#F8F9FA',border:'1px solid '+C.border,borderRadius:12,padding:'18px 16px',opacity:0.6}}>
                <div style={{fontSize:24,marginBottom:10}}>{t.icon}</div>
                <div style={{fontSize:13,fontWeight:700,color:C.slate,marginBottom:4}}>{t.label}</div>
                <div style={{fontSize:11,color:C.slateLight,marginBottom:8}}>{t.sub}</div>
                <div style={{fontSize:9,background:'#F1F5F9',color:C.slateLight,borderRadius:3,padding:'2px 7px',display:'inline-block',fontFamily:'JetBrains Mono',fontWeight:700}}>SOON</div>
              </div>
            )
          ))}
        </div>
        <div style={{marginTop:24,background:C.tealBg,border:'1px solid '+C.tealBorder,borderRadius:12,padding:'18px 22px'}}>
          <div style={{fontFamily:'DM Serif Display',fontSize:17,color:C.navy,marginBottom:6}}>More Countries Coming</div>
          <div style={{fontSize:13,color:C.textMid,lineHeight:1.6}}>Canada, Australia, Netherlands and Sweden tax calculators are in development. All will use the same accuracy and 2026 rates as the UK tools.</div>
          <div style={{display:'flex',gap:10,marginTop:12,flexWrap:'wrap'}}>
            {[['CA','Canada'],['AU','Australia'],['NL','Netherlands'],['SE','Sweden']].map(([code,name])=>(
              <div key={code} style={{background:'white',border:'1px solid '+C.tealBorder,borderRadius:6,padding:'6px 12px',display:'flex',alignItems:'center',gap:6}}>
                <span style={{fontSize:12,fontWeight:600,color:C.navy}}>{name}</span>
                <span style={{fontSize:9,background:'#F1F5F9',color:C.slate,borderRadius:3,padding:'1px 5px',fontWeight:700,fontFamily:'JetBrains Mono'}}>SOON</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}
