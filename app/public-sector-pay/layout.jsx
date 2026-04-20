'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

function useW(){const[w,setW]=useState(typeof window!=='undefined'?window.innerWidth:800);useEffect(()=>{const f=()=>setW(window.innerWidth);window.addEventListener('resize',f);return()=>window.removeEventListener('resize',f);},[]);return w;}

const C={navy:'#0C1E3C',navyMid:'#1e3d6e',teal:'#0D9488',tealL:'#14B8A6',tealBg:'#F0FDFA',tealBd:'#99F6E4',border:'#E2E8F0',borderDk:'#CBD5E1',bg:'#F4F6F9',white:'#FFFFFF',green:'#059669',text:'#1E293B',mid:'#475569',slate:'#64748B',sl:'#94A3B8',shadow:'0 1px 3px rgba(0,0,0,0.07),0 4px 16px rgba(0,0,0,0.04)'};
const GS=`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Source+Serif+4:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}body{background:#F4F6F9;color:#1E293B;font-family:'Source Serif 4',Georgia,serif;-webkit-tap-highlight-color:transparent;}a{text-decoration:none;color:inherit;}button{cursor:pointer;font-family:inherit;}@keyframes fi{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}.fi{animation:fi 0.35s ease both;}`;

function Nav(){const mob=useW()<640;const[open,setOpen]=useState(false);const links=[['/',   'Salary Calculator'],['/ir35','IR35'],['/nhs','NHS Bands'],['/tools','All Tools'],['/blog','Tax Guides']];return(<nav style={{background:C.navy,position:'sticky',top:0,zIndex:100,boxShadow:'0 2px 16px rgba(0,0,0,0.25)'}}><div style={{maxWidth:1100,margin:'0 auto',padding:'0 20px',height:56,display:'flex',alignItems:'center',justifyContent:'space-between'}}><Link href="/" style={{display:'flex',alignItems:'center',gap:9}}><div style={{width:30,height:30,background:'linear-gradient(135deg,#0D9488,#14B8A6)',borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><span style={{color:'white',fontWeight:700,fontSize:12,fontFamily:'JetBrains Mono'}}>Tx</span></div><span style={{color:'white',fontFamily:'DM Serif Display',fontSize:17}}>Taxd<span style={{color:'#14B8A6'}}>Calc</span></span></Link>{mob?(<button onClick={()=>setOpen(!open)} style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:7,padding:'8px 10px',display:'flex',flexDirection:'column',gap:4}}>{[0,1,2].map(i=><span key={i} style={{display:'block',width:18,height:2,background:'white',borderRadius:1}}/>)}</button>):(<div style={{display:'flex',gap:2,alignItems:'center'}}>{links.map(([href,label])=>(<Link key={href} href={href} style={{padding:'7px 13px',borderRadius:6,color:'rgba(255,255,255,0.6)',fontSize:13}}>{label}</Link>))}<span style={{fontSize:11,color:'#14B8A6',fontFamily:'JetBrains Mono',background:'rgba(13,148,136,0.15)',padding:'3px 9px',borderRadius:4,border:'1px solid rgba(20,184,166,0.3)',marginLeft:8}}>2026-27</span></div>)}</div>{mob&&open&&(<div style={{background:'#162d52',borderTop:'1px solid rgba(255,255,255,0.08)',padding:'6px 0 12px'}}>{links.map(([href,label])=>(<Link key={href} href={href} onClick={()=>setOpen(false)} style={{display:'block',padding:'12px 24px',color:'rgba(255,255,255,0.65)',fontSize:14}}>{label}</Link>))}</div>)}</nav>);}

function Footer(){const mob=useW()<640;return(<footer style={{background:'#070D1C',padding:'32px 20px',borderTop:'1px solid rgba(255,255,255,0.05)',marginTop:48}}><div style={{maxWidth:1100,margin:'0 auto'}}><div style={{display:'grid',gridTemplateColumns:mob?'1fr 1fr':'repeat(4,1fr)',gap:24,marginBottom:24}}><div><div style={{fontSize:11,color:'rgba(255,255,255,0.3)',letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:10,fontFamily:'JetBrains Mono'}}>Core Tools</div>{[['/','Salary Calculator'],['/ir35','IR35 Calculator'],['/nhs','NHS Pay Bands'],['/sacrifice','Salary Sacrifice'],['/comparison','Job Comparison'],['/part-time-salary-calculator','Part-Time Pay']].map(([h,l])=><Link key={h} href={h} style={{display:'block',fontSize:12,color:'rgba(255,255,255,0.45)',marginBottom:5}}>{l}</Link>)}</div><div><div style={{fontSize:11,color:'rgba(255,255,255,0.3)',letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:10,fontFamily:'JetBrains Mono'}}>Tax Planning</div>{[['/blog/60-percent-tax-trap','60% Tax Trap'],['/blog/hicbc-child-benefit-charge','Child Benefit Taper'],['/blog/personal-allowance-taper-100k','£100k PA Taper'],['/blog/plan-5-student-loan-take-home','Plan 5 Student Loan']].map(([h,l])=><Link key={h} href={h} style={{display:'block',fontSize:12,color:'rgba(255,255,255,0.45)',marginBottom:5}}>{l}</Link>)}</div><div><div style={{fontSize:11,color:'rgba(255,255,255,0.3)',letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:10,fontFamily:'JetBrains Mono'}}>Public Sector</div>{[['/nhs-pay-guide','NHS Pay Guide'],['/teacher-pay-guide','Teacher Pay Guide'],['/public-sector-pay/police','Police Pay'],['/public-sector-pay/firefighters','Firefighter Pay'],['/public-sector-pay/civil-service','Civil Service Pay'],['/public-sector-pay/armed-forces','Armed Forces Pay']].map(([h,l])=><Link key={h} href={h} style={{display:'block',fontSize:12,color:'rgba(255,255,255,0.45)',marginBottom:5}}>{l}</Link>)}</div><div><div style={{fontSize:11,color:'rgba(255,255,255,0.3)',letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:10,fontFamily:'JetBrains Mono'}}>Guides</div>{[['/blog','All Tax Guides'],['/blog/45000-salary-take-home-uk-2026','£45k Salary'],['/blog/ir35-inside-outside-calculator-2026','IR35 Guide'],['/maternity-pay-self-employed','Self-Employed Maternity'],['/tools','All Tools']].map(([h,l])=><Link key={h} href={h} style={{display:'block',fontSize:12,color:'rgba(255,255,255,0.45)',marginBottom:5}}>{l}</Link>)}</div></div><div style={{borderTop:'1px solid rgba(255,255,255,0.06)',paddingTop:18,display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:10,alignItems:'center'}}><Link href="/" style={{display:'flex',alignItems:'center',gap:8}}><div style={{width:26,height:26,background:'linear-gradient(135deg,#0D9488,#14B8A6)',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{color:'white',fontWeight:700,fontSize:11,fontFamily:'JetBrains Mono'}}>Tx</span></div><span style={{color:'white',fontFamily:'DM Serif Display',fontSize:15}}>Taxd<span style={{color:'#14B8A6'}}>Calc</span></span></Link><span style={{fontSize:11,color:'rgba(255,255,255,0.2)',fontFamily:'JetBrains Mono'}}>Updated April 2026 · 2026-27 rates</span><span style={{fontSize:11,color:'rgba(255,255,255,0.18)',maxWidth:300,lineHeight:1.6}}>For guidance only. Consult HMRC or a qualified adviser.</span></div></div></footer>);}

const SECTORS=[
  {href:'/nhs-pay-guide',icon:'🏥',title:'NHS Pay Guide',sub:'Agenda for Change Bands 2–9',range:'£23,615 – £121,271',takeHome:'£18,500 – £78,000/yr',tags:['All bands','London HCAS','NHS pension'],detail:'Full AfC band table with HCAS London weighting and 9.8% Band 5 pension calculation.'},
  {href:'/teacher-pay-guide',icon:'📚',title:'Teacher Pay Guide',sub:'MPR M1 to UPR U3',range:'£32,916 – £62,496',takeHome:'£21,950 – £40,300/yr',tags:['4 regions','TPS pension','MPR/UPR'],detail:'Main Pay Range M1–M6 and Upper Pay Range U1–U3 with TPS pension contribution tiers.'},
  {href:'/public-sector-pay/police',icon:'👮',title:'Police Pay',sub:'NPCC Pay Scale 2026-27',range:'£29,907 – £60,678',takeHome:'£23,497 – £43,384/yr',tags:['England & Wales','Police pension','APCC'],detail:'Police Constable P1 through Chief Inspector with Police Pension Scheme rates.'},
  {href:'/public-sector-pay/firefighters',icon:'🚒',title:'Firefighter Pay',sub:'NJC Grey Book 2026-27',range:'£24,680 – £44,017',takeHome:'£18,426 – £30,106/yr',tags:['England & Wales','FPS pension','NJC scales'],detail:'Trainee through Watch Manager B on NJC Grey Book scale with Firefighters Pension Scheme.'},
  {href:'/public-sector-pay/civil-service',icon:'🏛',title:'Civil Service Pay',sub:'CS Pay Grades AO to Grade 6',range:'£24,547 – £68,040',takeHome:'£20,290 – £47,428/yr',tags:['AO to G6','Alpha pension','London/national'],detail:'Administrative Officer through Grade 6 with Civil Service Alpha Pension contributions.'},
  {href:'/public-sector-pay/armed-forces',icon:'🎖',title:'Armed Forces Pay',sub:'AFPRB Pay Scale 2026-27',range:'£23,907 – £62,282+',takeHome:'£20,733 – £46,681/yr',tags:['All ranks','AFPS pension','X-factor'],detail:'Private through Major with Armed Forces Pension Scheme and X-Factor allowance.'},
  {href:'/public-sector-pay/council-workers',icon:'🏢',title:'Council Workers Pay',sub:'NJC Green Book 2026-27',range:'£24,294 – £54,589',takeHome:'£19,900 – £40,300/yr',tags:['Green Book','LGPS pension','London weighting'],detail:'NJC Green Book pay points with Local Government Pension Scheme contribution tiers.'},
];

export default function PublicSectorHub(){
  const mob=useW()<640;

  const schemaFAQ={'@context':'https://schema.org','@type':'FAQPage',mainEntity:[
    {'@type':'Question',name:'What are the best-paid public sector jobs in the UK?',acceptedAnswer:{'@type':'Answer',text:'Senior civil servants (Grade 6, £68k+), NHS consultants and senior managers (Band 8b+, £62k+), police inspectors and above (£57k+), and senior armed forces officers (Major+, £62k+) are typically the best-paid public sector roles in 2026-27.'}},
    {'@type':'Question',name:'Do public sector workers pay less tax than private sector?',acceptedAnswer:{'@type':'Answer',text:'No — public sector workers pay the same income tax and NI as private sector employees on equivalent salaries. Many public sector roles have defined benefit pension schemes, which means pension contributions (4–14% depending on scheme) provide significant long-term value not captured in gross salary comparisons.'}},
    {'@type':'Question',name:'Are public sector pensions better than private sector?',acceptedAnswer:{'@type':'Answer',text:'Most public sector pensions (NHS, Teachers, Police, Civil Service, Armed Forces) are defined benefit (DB) schemes — they guarantee a retirement income based on career earnings. Private sector DB schemes are increasingly rare. The employer contribution equivalent in public sector DB schemes is typically 20–30% of salary, significantly more valuable than typical private sector defined contribution pension arrangements.'}},
  ]};
  const schemaBreadcrumb={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'TaxdCalc',item:'https://taxdcal.co.uk'},{'@type':'ListItem',position:2,name:'Public Sector Pay Hub',item:'https://taxdcal.co.uk/public-sector-pay'}]};

  return(
    <>
      <style>{GS}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schemaFAQ)}}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schemaBreadcrumb)}}/>
      <Nav/>

      {/* AI ANSWER BLOCK */}
      <div style={{background:C.tealBg,borderBottom:`1px solid ${C.tealBd}`,padding:mob?'14px 16px':'16px 24px'}}>
        <div style={{maxWidth:1000,margin:'0 auto'}}>
          <div style={{fontSize:10,color:C.teal,fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',fontFamily:'JetBrains Mono',marginBottom:6}}>Quick Answer — Public Sector Pay 2026-27</div>
          <p style={{fontSize:mob?13:14,color:'#0f766e',fontWeight:600,lineHeight:1.65}}>
            UK public sector salaries range from approximately <strong>£23,000 (entry level)</strong> to <strong>£120,000+ (senior NHS/civil service)</strong> in 2026-27. All public sector workers receive defined benefit pensions worth an additional 20–30% of salary in employer contribution equivalent. Select your sector below for exact take-home figures.
          </p>
        </div>
      </div>

      {/* HERO */}
      <div style={{background:`linear-gradient(135deg,${C.navy},${C.navyMid})`,padding:mob?'28px 20px 44px':'36px 24px 52px',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:-50,right:-50,width:220,height:220,borderRadius:'50%',background:'rgba(13,148,136,0.07)',pointerEvents:'none'}}/>
        <div style={{maxWidth:1000,margin:'0 auto'}}>
          <div style={{display:'inline-block',background:'rgba(13,148,136,0.15)',border:'1px solid rgba(20,184,166,0.3)',borderRadius:20,padding:'3px 12px',fontSize:11,color:'#14B8A6',marginBottom:10,fontFamily:'JetBrains Mono'}}>UK Public Sector 2026-27</div>
          <h1 style={{fontFamily:'DM Serif Display',fontSize:mob?24:38,color:'white',lineHeight:1.15,marginBottom:10}}>Public Sector Pay Guide 2026-27</h1>
          <p style={{color:'rgba(255,255,255,0.5)',fontSize:mob?13:15,maxWidth:580,lineHeight:1.65}}>Take-home pay for NHS, teachers, police, firefighters, civil servants, armed forces, and council workers. All figures include defined benefit pension deductions. Updated for 2026-27.</p>
        </div>
      </div>

      <div style={{maxWidth:1000,margin:'0 auto',padding:mob?'20px 16px 60px':'28px 24px 72px'}}>

        {/* SECTOR CARDS */}
        <div style={{display:'grid',gridTemplateColumns:mob?'1fr':'repeat(auto-fill,minmax(290px,1fr))',gap:16,marginBottom:28}} className="fi">
          {SECTORS.map(s=>(
            <Link key={s.href} href={s.href} style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:'20px',display:'block',boxShadow:C.shadow,transition:'all 0.2s'}} onMouseEnter={e=>{e.currentTarget.style.borderColor=C.teal;e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 4px 20px rgba(0,0,0,0.08)';}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow=C.shadow;}}>
              <div style={{display:'flex',alignItems:'flex-start',gap:12,marginBottom:12}}>
                <span style={{fontSize:28,flexShrink:0}}>{s.icon}</span>
                <div>
                  <div style={{fontFamily:'DM Serif Display',fontSize:18,color:C.navy,lineHeight:1.2,marginBottom:3}}>{s.title}</div>
                  <div style={{fontSize:11,color:C.slate}}>{s.sub}</div>
                </div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:12}}>
                <div style={{background:C.bg,borderRadius:7,padding:'9px 10px'}}>
                  <div style={{fontSize:9,color:C.slate,textTransform:'uppercase',letterSpacing:'0.08em',fontFamily:'JetBrains Mono',marginBottom:2}}>Gross range</div>
                  <div style={{fontSize:11,fontWeight:700,color:C.navy,fontFamily:'JetBrains Mono'}}>{s.range}</div>
                </div>
                <div style={{background:C.tealBg,borderRadius:7,padding:'9px 10px'}}>
                  <div style={{fontSize:9,color:C.teal,textTransform:'uppercase',letterSpacing:'0.08em',fontFamily:'JetBrains Mono',marginBottom:2}}>Take-home</div>
                  <div style={{fontSize:11,fontWeight:700,color:C.teal,fontFamily:'JetBrains Mono'}}>{s.takeHome}</div>
                </div>
              </div>
              <div style={{fontSize:12,color:C.mid,lineHeight:1.6,marginBottom:12}}>{s.detail}</div>
              <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                {s.tags.map(tag=><span key={tag} style={{fontSize:10,background:C.bg,color:C.slate,border:`1px solid ${C.border}`,borderRadius:4,padding:'2px 7px',fontFamily:'JetBrains Mono'}}>{tag}</span>)}
              </div>
              <div style={{marginTop:12,fontSize:13,color:C.teal,fontWeight:600}}>View pay guide →</div>
            </Link>
          ))}
        </div>

        {/* WHY COMPARE */}
        <div style={{background:C.white,borderRadius:12,padding:mob?16:22,border:`1px solid ${C.border}`,boxShadow:C.shadow,marginBottom:20}}>
          <h2 style={{fontFamily:'DM Serif Display',fontSize:mob?18:22,color:C.navy,marginBottom:14}}>How Public Sector Pay Compares to Private Sector</h2>
          <div style={{display:'grid',gridTemplateColumns:mob?'1fr':'1fr 1fr 1fr',gap:14,marginBottom:14}}>
            {[
              {title:'Pension advantage',desc:'Defined benefit pensions in public sector are worth 20–30% of salary in employer contribution equivalent. A Band 5 NHS nurse\'s total compensation is ~20% higher than gross salary suggests.'},
              {title:'Pay freeze history',desc:'Public sector pay has been subject to freezes and below-inflation rises since 2010. In real terms, many public sector workers earn less than a decade ago despite nominal salary increases.'},
              {title:'Job security',desc:'Public sector roles typically offer greater job security, sick pay, and holiday entitlement. These non-monetary benefits have significant financial value not captured in salary comparisons.'},
            ].map(({title,desc})=>(
              <div key={title} style={{background:C.bg,borderRadius:9,padding:'14px 16px'}}>
                <div style={{fontSize:13,fontWeight:700,color:C.navy,marginBottom:7}}>{title}</div>
                <p style={{fontSize:12,color:C.mid,lineHeight:1.65}}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SALARY CALCULATOR CTA */}
        <div style={{background:`linear-gradient(135deg,${C.navy},${C.navyMid})`,borderRadius:12,padding:'18px 22px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
          <div><div style={{fontFamily:'DM Serif Display',fontSize:16,color:'white',marginBottom:3}}>Not public sector?</div><div style={{fontSize:12,color:'rgba(255,255,255,0.45)'}}>Full UK salary calculator with Scotland, tax code and all student loan plans</div></div>
          <Link href="/" style={{background:C.teal,color:'white',padding:'10px 20px',borderRadius:7,fontSize:13,fontWeight:700,display:'inline-block'}}>Open Salary Calculator →</Link>
        </div>
      </div>
      <Footer/>
    </>
  );
}
