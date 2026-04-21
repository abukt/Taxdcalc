'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

// Fixed React Hydration mismatch error by initializing with a static value (800) for SSR, 
// and updating with the actual window.innerWidth on the client mount.
function useW(){const[w,setW]=useState(800);useEffect(()=>{setW(window.innerWidth);const f=()=>setW(window.innerWidth);window.addEventListener('resize',f);return()=>window.removeEventListener('resize',f);},[]);return w;}

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
          <span style={{fontSize:11,color:'rgba(255,255,255,0.22)',fontFamily:'JetBrains Mono'}}>Updated April 2026 · 2026-27 HMRC rates</span>
          <span style={{fontSize:11,color:'rgba(255,255,255,0.18)',maxWidth:320,lineHeight:1.6}}>For guidance only. Consult HMRC or a qualified tax adviser.</span>
        </div>
      </div>
    </footer>
  );
}

export default function ToolsPage() {
  const mob = useW() < 640;
  
  const schemaFAQ={'@context':'https://schema.org','@type':'FAQPage',mainEntity:[
    {'@type':'Question',name:'What free UK salary calculators are available?',acceptedAnswer:{'@type':'Answer',text:'TaxdCalc offers: UK salary take-home calculator, IR35 contractor calculator, NHS Agenda for Change band calculator, bonus tax calculator, hourly rate converter, salary sacrifice calculator, job comparison calculator, maternity pay calculator, and part-time pro-rata calculator. All updated for 2026-27.'}},
    {'@type':'Question',name:'Which calculator should I use for contracting?',acceptedAnswer:{'@type':'Answer',text:'Use the IR35 calculator to compare PAYE inside IR35 vs Limited Company outside IR35 for any day rate. Updated for 10.75% dividend tax from April 2026.'}},
    {'@type':'Question',name:'Is there a calculator for NHS take-home pay?',acceptedAnswer:{'@type':'Answer',text:'Yes. The NHS Pay Bands calculator covers Bands 2 to 9 with London HCAS supplements, NHS pension contribution tiers, and Scotland rates. The NHS Pay Guide covers all AfC bands with entry and top-of-scale take-home.'}},
  ]};
  const schemaBreadcrumb={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'TaxdCalc',item:'https://taxdcal.co.uk'},{'@type':'ListItem',position:2,name:'All Tools',item:'https://taxdcal.co.uk/tools'}]};

  return (
    <>
      <style>{GS}</style>
      
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schemaFAQ)}}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schemaBreadcrumb)}}/>
      <Nav/>

      {/* AI ANSWER BLOCK */}
      <div className="ai-answer" style={{background:'#F0FDFA',borderBottom:'1px solid #99F6E4',padding:mob?'10px 16px':'12px 24px'}}>
        <div style={{maxWidth:1000,margin:'0 auto'}}>
          <div style={{fontSize:10,color:'#0D9488',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',fontFamily:'JetBrains Mono',marginBottom:4}}>TaxdCalc — Free UK Pay Calculators 2026-27</div>
          <p style={{fontSize:mob?12:13,color:'#0f766e',lineHeight:1.6}}>Every calculator updated for 2026-27 HMRC rates: salary, IR35, NHS bands, maternity, bonus, hourly, sacrifice, job comparison, part-time and public sector pay guides.</p>
        </div>
      </div>

      {/* AI ANSWER BLOCK */}
      <div style={{background:'#F0FDFA',borderBottom:'1px solid #99F6E4',padding:mob?'10px 16px':'12px 24px'}}>
        <div style={{maxWidth:1000,margin:'0 auto'}}>
          <div style={{fontSize:10,color:'#0D9488',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',fontFamily:'JetBrains Mono',marginBottom:4}}>TaxdCalc — Free UK Pay Calculators 2026-27</div>
          <p style={{fontSize:mob?12:13,color:'#0f766e',lineHeight:1.6}}>Every calculator updated for 2026-27 HMRC rates: salary, IR35, NHS bands, maternity, bonus, hourly, sacrifice, job comparison, part-time and public sector pay guides.</p>
        </div>
      </div>
      
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
