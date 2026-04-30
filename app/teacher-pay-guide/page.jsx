'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

function useW(){const[w,setW]=useState(typeof window!=='undefined'?window.innerWidth:800);useEffect(()=>{const f=()=>setW(window.innerWidth);window.addEventListener('resize',f);return()=>window.removeEventListener('resize',f);},[]);return w;}

const C={navy:'#0C1E3C',navyMid:'#1e3d6e',teal:'#0D9488',tealL:'#14B8A6',tealBg:'#F0FDFA',tealBd:'#99F6E4',border:'#E2E8F0',borderDk:'#CBD5E1',bg:'#F4F6F9',white:'#FFFFFF',green:'#059669',purple:'#7C3AED',purpleBg:'#F5F3FF',purpleBd:'#DDD6FE',red:'#DC2626',text:'#1E293B',mid:'#475569',slate:'#64748B',sl:'#94A3B8',shadow:'0 1px 3px rgba(0,0,0,0.07),0 4px 16px rgba(0,0,0,0.04)'};
const GS=`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Source+Serif+4:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}body{background:#F4F6F9;color:#1E293B;font-family:'Source Serif 4',Georgia,serif;-webkit-tap-highlight-color:transparent;}a{text-decoration:none;color:inherit;}button{cursor:pointer;font-family:inherit;}@keyframes fi{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}.fi{animation:fi 0.35s ease both;}`;

// Teacher pay scales 2026-27
const TPY={
  M1:{england:32916,fringe:34398,outer:37870,inner:40317,label:'M1 — NQT entry'},
  M2:{england:34537,fringe:36025,outer:39541,inner:41965,label:'M2'},
  M3:{england:36413,fringe:37934,outer:41418,inner:43853,label:'M3'},
  M4:{england:38185,fringe:39700,outer:43259,inner:45816,label:'M4'},
  M5:{england:40237,fringe:41764,outer:45417,inner:49039,label:'M5'},
  M6:{england:45352,fringe:46839,outer:50474,inner:52300,label:'M6 — top of MPR'},
  U1:{england:47472,fringe:48913,outer:52219,inner:57632,label:'U1 — UPR entry'},
  U2:{england:49260,fringe:50699,outer:54186,inner:59772,label:'U2'},
  U3:{england:51048,fringe:52490,outer:56154,inner:62496,label:'U3 — top of UPR'},
};

function tpsPct(g){return g<32135?7.4:g<43259?8.6:g<51292?9.7:g<67415?10.2:11.7;}
function calcIT(g,p=0){const ti=Math.max(0,g-p);let pa=12570;if(ti>100000)pa=Math.max(0,12570-(ti-100000)/2);const tx=Math.max(0,ti-pa);const b1=Math.min(tx,37700),b2=Math.min(Math.max(0,tx-b1),74870),b3=Math.max(0,tx-b1-b2);return b1*0.20+b2*0.40+b3*0.45;}
function calcNI(g){if(g<=12570)return 0;return(Math.min(g,50270)-12570)*0.08+Math.max(0,g-50270)*0.02;}
function calcTH(gross){const tps=tpsPct(gross),p=gross*(tps/100),it=calcIT(gross,p),ni=calcNI(gross);return{th:gross-it-ni-p,mo:(gross-it-ni-p)/12,tps,it,ni,p};}

const fmt=n=>'\u00A3'+Math.round(n||0).toLocaleString('en-GB');
const fmtD=n=>'\u00A3'+(n||0).toLocaleString('en-GB',{minimumFractionDigits:2,maximumFractionDigits:2});

function Nav(){const mob=useW()<640;const[open,setOpen]=useState(false);const links=[['/',   'Salary Calculator'],['/nhs','NHS Bands'],['/tools','All Tools'],['/blog','Tax Guides']];return(<nav style={{background:C.navy,position:'sticky',top:0,zIndex:100,boxShadow:'0 2px 16px rgba(0,0,0,0.25)'}}><div style={{maxWidth:1100,margin:'0 auto',padding:'0 20px',height:56,display:'flex',alignItems:'center',justifyContent:'space-between'}}><Link href="/" style={{display:'flex',alignItems:'center',gap:9}}><div style={{width:30,height:30,background:'linear-gradient(135deg,#0D9488,#14B8A6)',borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><span style={{color:'white',fontWeight:700,fontSize:12,fontFamily:'JetBrains Mono'}}>Tx</span></div><span style={{color:'white',fontFamily:'DM Serif Display',fontSize:17}}>Taxd<span style={{color:'#14B8A6'}}>Calc</span></span></Link>{mob?(<button onClick={()=>setOpen(!open)} style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:7,padding:'8px 10px',display:'flex',flexDirection:'column',gap:4}}>{[0,1,2].map(i=><span key={i} style={{display:'block',width:18,height:2,background:'white',borderRadius:1}}/>)}</button>):(<div style={{display:'flex',gap:2,alignItems:'center'}}>{links.map(([href,label])=>(<Link key={href} href={href} style={{padding:'7px 13px',borderRadius:6,color:'rgba(255,255,255,0.6)',fontSize:13}}>{label}</Link>))}<span style={{fontSize:11,color:'#14B8A6',fontFamily:'JetBrains Mono',background:'rgba(13,148,136,0.15)',padding:'3px 9px',borderRadius:4,border:'1px solid rgba(20,184,166,0.3)',marginLeft:8}}>2026-27</span></div>)}</div>{mob&&open&&(<div style={{background:'#162d52',borderTop:'1px solid rgba(255,255,255,0.08)',padding:'6px 0 12px'}}>{links.map(([href,label])=>(<Link key={href} href={href} onClick={()=>setOpen(false)} style={{display:'block',padding:'12px 24px',color:'rgba(255,255,255,0.65)',fontSize:14}}>{label}</Link>))}</div>)}</nav>);}
function Footer(){return(<footer style={{background:'#070D1C',padding:'24px 20px',borderTop:'1px solid rgba(255,255,255,0.05)',marginTop:48}}><div style={{maxWidth:1100,margin:'0 auto',display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:14,alignItems:'center'}}><Link href="/" style={{display:'flex',alignItems:'center',gap:8}}><div style={{width:26,height:26,background:'linear-gradient(135deg,#0D9488,#14B8A6)',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{color:'white',fontWeight:700,fontSize:11,fontFamily:'JetBrains Mono'}}>Tx</span></div><span style={{color:'white',fontFamily:'DM Serif Display',fontSize:15}}>Taxd<span style={{color:'#14B8A6'}}>Calc</span></span></Link><span style={{fontSize:11,color:'rgba(255,255,255,0.2)',fontFamily:'JetBrains Mono'}}>Updated April 2026</span><span style={{fontSize:11,color:'rgba(255,255,255,0.18)',maxWidth:280,lineHeight:1.6}}>For guidance only. Consult HMRC or a qualified adviser.</span></div></footer>);}

export default function TeacherPayGuide(){
  const mob=useW()<640;
  const[region,setRegion]=useState('england');

  // Schema split into separate blocks — prevents duplicate FAQPage error
const schemaFAQ={
  '@context':'https://schema.org',
  '@type':'FAQPage',
  mainEntity:[
    {'@type':'Question',name:'What is the minimum teacher salary in England in 2026-27?',acceptedAnswer:{'@type':'Answer',text:'The minimum qualified teacher salary (M1) in England outside London is £32,916 in 2026-27. In Inner London it is £40,317. These are set by the School Teachers Review Body (STRB).'}},
    {'@type':'Question',name:'How much is the Teachers Pension Scheme contribution?',acceptedAnswer:{'@type':'Answer',text:'TPS employee contributions range from 7.4% for salaries below £32,135 up to 11.7% for salaries above £67,415. Most newly qualified teachers on M1-M3 pay 7.4%. The TPS is a defined benefit pension.'}},
    {'@type':'Question',name:'What is the difference between MPR and UPR?',acceptedAnswer:{'@type':'Answer',text:'The Main Pay Range (MPR, M1-M6) covers qualified teachers in their first years. The Upper Pay Range (UPR, U1-U3) is for experienced teachers who apply to cross the threshold and evidence impact beyond their classroom.'}},
    {'@type':'Question',name:'How much does a newly qualified teacher take home per month?',acceptedAnswer:{'@type':'Answer',text:'An NQT on M1 in England (£32,916 gross) takes home approximately £21,950 per year or £1,829 per month after income tax, NI and 7.4% TPS pension contribution in 2026-27.'}},
    {'@type':'Question',name:'What is the top teacher salary in Inner London?',acceptedAnswer:{'@type':'Answer',text:'The top of the Upper Pay Range (U3) in Inner London is £62,496 per year in 2026-27. Take-home after income tax, NI and TPS pension is approximately £40,300 per year.'}},
  ]
};
const schemaBreadcrumb={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'TaxdCalc',item:'https://taxdcal.co.uk'},{'@type':'ListItem',position:2,name:'Teacher Pay Guide 2026-27',item:'https://taxdcal.co.uk/teacher-pay-guide'}]};
const schemaArticle={'@context':'https://schema.org','@type':'Article','@id':'https://taxdcal.co.uk/teacher-pay-guide#article',headline:'Teacher Pay Guide 2026-27: MPR, UPR, TPS Pension and Take-Home Pay',description:'Complete guide to teacher pay scales, TPS pension, and take-home pay across all regional tiers in England for 2026-27.',datePublished:'2026-04-18',dateModified:'2026-04-18',author:{'@type':'Organization',name:'TaxdCalc',url:'https://taxdcal.co.uk'},publisher:{'@type':'Organization',name:'TaxdCalc',url:'https://taxdcal.co.uk'},mainEntityOfPage:{'@type':'WebPage','@id':'https://taxdcal.co.uk/teacher-pay-guide'}};

  const regions=[['england','England (Base)'],['fringe','London Fringe'],['outer','Outer London'],['inner','Inner London']];

  return(
    <>
      <style>{GS}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schemaFAQ)}}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schemaBreadcrumb)}}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schemaArticle)}}/>
      <Nav/>

      {/* AI ANSWER BLOCK — above fold, machine-readable for AI systems */}
      <div className="ai-answer" style={{background:'#F0FDFA',borderBottom:'1px solid #99F6E4',padding:mob?'14px 16px':'16px 24px'}}>
        <div style={{maxWidth:900,margin:'0 auto'}}>
          <div style={{fontSize:10,color:'#0D9488',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',fontFamily:'JetBrains Mono',marginBottom:6}}>Quick Answer — 2026-27</div>
          <p style={{fontSize:mob?14:15,color:'#0f766e',lineHeight:1.65,fontWeight:600,marginBottom:10}}>
            An NQT teacher on M1 in England takes home approximately <strong>£21,950/year (£1,829/month)</strong> after income tax, NI and 7.4% TPS pension. Top of UPR (U3) in Inner London: <strong>£40,300/year</strong>.
          </p>
          <div style={{display:'grid',gridTemplateColumns:mob?'repeat(2,1fr)':'repeat(4,1fr)',gap:8}}>
            {[['M1 England take-home','£21,950/yr'],['M6 England take-home','£29,660/yr'],['U3 Inner London','£40,300/yr'],['TPS pension (M1)','7.4% rate']].map(([l,v])=>(
              <div key={l} style={{background:'rgba(13,148,136,0.1)',borderRadius:7,padding:'9px 11px'}}>
                <div style={{fontSize:9,color:'#0D9488',textTransform:'uppercase',letterSpacing:'0.1em',fontFamily:'JetBrains Mono',marginBottom:3}}>{l}</div>
                <div style={{fontFamily:'JetBrains Mono',fontSize:12,fontWeight:700,color:'#0f766e'}}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{marginTop:10,fontSize:12,color:'#0f766e',lineHeight:1.6}}>
            💡 <strong>Optimisation tip:</strong> TPS salary sacrifice reduces both income tax and NI. At M6 (£45,352), increasing TPS from the standard rate saves approximately £600/year in combined tax and NI — while the full contribution goes to your defined benefit pension.
            {' '}<a href="/sacrifice" style={{color:'#0D9488',fontWeight:700,borderBottom:'1px solid #99F6E4'}}>Calculate your saving →</a>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div style={{background:`linear-gradient(135deg,#4C1D95,#6D28D9)`,padding:mob?'32px 20px 48px':'44px 24px 60px',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:-50,right:-50,width:220,height:220,borderRadius:'50%',background:'rgba(255,255,255,0.05)',pointerEvents:'none'}}/>
        <div style={{maxWidth:900,margin:'0 auto'}}>
          <div style={{display:'inline-block',background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.2)',borderRadius:20,padding:'3px 12px',fontSize:11,color:'white',marginBottom:12,fontFamily:'JetBrains Mono'}}>Teacher Pay — England 2026-27</div>
          <h1 style={{fontFamily:'DM Serif Display',fontSize:mob?26:40,color:'white',lineHeight:1.15,marginBottom:12}}>Teacher Pay Guide 2026-27</h1>
          <p style={{color:'rgba(255,255,255,0.6)',fontSize:mob?13:16,maxWidth:580,lineHeight:1.7,marginBottom:20}}>Complete guide to the Main Pay Range (MPR), Upper Pay Range (UPR), TPS pension contributions, and take-home pay for teachers in England. All 4 regional tiers included.</p>
          <Link href="/teacher-salary-take-home" style={{background:'white',color:'#4C1D95',padding:'11px 22px',borderRadius:8,fontSize:13,fontWeight:700,display:'inline-block'}}>Open Teacher Pay Calculator →</Link>
        </div>
      </div>

      <div style={{maxWidth:900,margin:'0 auto',padding:mob?'20px 16px 60px':'28px 24px 72px'}}>

        {/* Region selector */}
        <div style={{background:C.white,borderRadius:12,padding:mob?16:20,border:`1px solid ${C.border}`,boxShadow:C.shadow,marginBottom:20}} className="fi">
          <h2 style={{fontFamily:'DM Serif Display',fontSize:16,color:C.navy,marginBottom:12}}>Select Your Region</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:8}}>
            {regions.map(([val,label])=>(
              <button key={val} onClick={()=>setRegion(val)}
                style={{padding:'10px 12px',borderRadius:8,border:`1.5px solid ${region===val?C.purple:C.borderDk}`,background:region===val?C.purpleBg:'white',color:region===val?C.purple:C.mid,fontSize:13,fontWeight:region===val?700:400,textAlign:'left',transition:'all 0.15s'}}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Full pay scale table */}
        <div style={{background:C.white,borderRadius:12,padding:mob?'16px 0':'20px 0',border:`1px solid ${C.border}`,boxShadow:C.shadow,marginBottom:20}}>
          <div style={{padding:mob?'0 16px 14px':'0 20px 16px'}}>
            <h2 style={{fontFamily:'DM Serif Display',fontSize:18,color:C.navy,marginBottom:4}}>Teacher Pay Scale 2026-27 — {regions.find(r=>r[0]===region)?.[1]}</h2>
            <p style={{fontSize:12,color:C.slate}}>Gross salary, take-home pay after income tax, NI and TPS pension. Includes pension contribution rate for each pay point.</p>
          </div>
          <div style={{overflowX:'auto',WebkitOverflowScrolling:'touch'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:12,minWidth:500}}>
              <thead>
                <tr style={{background:C.bg}}>
                  {['Pay Point','Gross Salary','TPS Rate','Annual Take-Home','Monthly Take-Home'].map(h=>(
                    <th key={h} style={{textAlign:'left',padding:'9px 12px',color:C.slate,fontSize:10,textTransform:'uppercase',letterSpacing:'0.06em',borderBottom:`1px solid ${C.border}`,fontFamily:'JetBrains Mono',whiteSpace:'nowrap'}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(TPY).map(([key,scale],i)=>{
                  const gross=scale[region]||scale.england;
                  const r=calcTH(gross);
                  const isMPR=key.startsWith('M');
                  return(
                    <tr key={key} style={{borderBottom:`1px solid ${C.border}`,background:key==='M1'?C.tealBg:key==='U1'?C.purpleBg:i%2===0?'transparent':'rgba(0,0,0,0.012)'}}>
                      <td style={{padding:'10px 12px',whiteSpace:'nowrap'}}>
                        <div style={{fontWeight:700,color:isMPR?C.navy:C.purple,fontFamily:'JetBrains Mono',fontSize:13}}>{key}</div>
                        <div style={{fontSize:10,color:C.slate,marginTop:1}}>{scale.label.split(' — ')[1]||''}</div>
                      </td>
                      <td style={{padding:'10px 12px',fontFamily:'JetBrains Mono',fontSize:13,color:C.text,fontWeight:600,whiteSpace:'nowrap'}}>{fmt(gross)}</td>
                      <td style={{padding:'10px 12px',fontFamily:'JetBrains Mono',fontSize:12,color:C.slate,whiteSpace:'nowrap'}}>{r.tps}%</td>
                      <td style={{padding:'10px 12px',fontFamily:'JetBrains Mono',fontSize:13,color:C.teal,fontWeight:700,whiteSpace:'nowrap'}}>{fmt(r.th)}</td>
                      <td style={{padding:'10px 12px',fontFamily:'JetBrains Mono',fontSize:13,color:C.teal,fontWeight:700,whiteSpace:'nowrap'}}>{fmtD(r.mo)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* TPS pension */}
        <div style={{background:C.white,borderRadius:12,padding:mob?16:22,border:`1px solid ${C.border}`,boxShadow:C.shadow,marginBottom:20}}>
          <h2 style={{fontFamily:'DM Serif Display',fontSize:20,color:C.navy,marginBottom:6}}>The Teachers Pension Scheme (TPS)</h2>
          <p style={{fontSize:14,color:C.mid,lineHeight:1.75,marginBottom:16}}>The TPS is a defined benefit (DB) pension scheme for teachers in England and Wales. Like the NHS pension, it guarantees a retirement income based on your career average earnings rather than depending on investment performance.</p>
          <div style={{display:'grid',gridTemplateColumns:mob?'1fr':'1fr 1fr',gap:14,marginBottom:16}}>
            {[
              {title:'TPS contribution tiers 2026-27',items:['Below £32,135: 7.4%','£32,135 to £43,259: 8.6%','£43,260 to £51,292: 9.7%','£51,293 to £67,415: 10.2%','Above £67,415: 11.7%']},
              {title:'What the TPS provides',items:['Career Average Revalued Earnings (CARE)','1/57th of pensionable pay added each year','CPI revaluation each April','Death in service (3× salary) lump sum','Ill-health and dependants benefits']},
            ].map(({title,items})=>(
              <div key={title} style={{background:C.purpleBg,border:`1px solid ${C.purpleBd}`,borderRadius:10,padding:'14px 16px'}}>
                <div style={{fontSize:12,fontWeight:700,color:C.purple,marginBottom:10,fontFamily:'JetBrains Mono',textTransform:'uppercase',letterSpacing:'0.08em'}}>{title}</div>
                {items.map(item=>(<div key={item} style={{display:'flex',gap:8,padding:'4px 0',fontSize:13,color:'#5B21B6'}}><span style={{color:C.purple,flexShrink:0}}>▸</span>{item}</div>))}
              </div>
            ))}
          </div>
          <div style={{background:'#FEF3C7',border:'1px solid #FDE68A',borderRadius:9,padding:'12px 16px',fontSize:12,color:'#92400E',lineHeight:1.7}}>
            <strong>Comparing teaching to private sector:</strong> Add approximately 18–22% of gross salary to account for the TPS employer contribution when comparing to private sector roles. An M6 teacher at £45,352 with TPS is broadly equivalent to a private sector role at approximately £54,000 with a standard auto-enrolment pension.
          </div>
        </div>

        {/* MPR vs UPR */}
        <div style={{background:C.white,borderRadius:12,padding:mob?16:22,border:`1px solid ${C.border}`,boxShadow:C.shadow,marginBottom:20}}>
          <h2 style={{fontFamily:'DM Serif Display',fontSize:20,color:C.navy,marginBottom:6}}>Main Pay Range vs Upper Pay Range</h2>
          <p style={{fontSize:14,color:C.mid,lineHeight:1.75,marginBottom:16}}>The MPR (M1–M6) is for newly qualified and developing teachers. The UPR (U1–U3) rewards experienced teachers who can demonstrate impact beyond their classroom.</p>
          <div style={{display:'grid',gridTemplateColumns:mob?'1fr':'1fr 1fr',gap:14}}>
            {[
              {title:'Main Pay Range (MPR) — M1 to M6',color:C.teal,bg:C.tealBg,bd:C.tealBd,points:['Entry point for all NQTs (now ECTs)','Annual progression by default subject to appraisal','Most teachers complete MPR in 5–7 years','No formal application required to progress']},
              {title:'Upper Pay Range (UPR) — U1 to U3',color:C.purple,bg:C.purpleBg,bd:C.purpleBd,points:['Application required to cross the threshold','Must evidence sustained high-quality teaching','Shows impact beyond own classroom (e.g. coaching others)','Schools may set their own criteria beyond the minimum']},
            ].map(({title,color,bg,bd,points})=>(
              <div key={title} style={{background:bg,border:`1px solid ${bd}`,borderRadius:10,padding:'14px 16px'}}>
                <div style={{fontSize:13,fontWeight:700,color,marginBottom:12,lineHeight:1.3}}>{title}</div>
                {points.map(p=>(<div key={p} style={{display:'flex',gap:8,padding:'5px 0',borderBottom:`1px solid ${bd}`,fontSize:13,color:C.mid}}><span style={{color,flexShrink:0}}>▸</span>{p}</div>))}
              </div>
            ))}
          </div>
        </div>

        {/* London pay differential */}
        <div style={{background:C.white,borderRadius:12,padding:mob?16:22,border:`1px solid ${C.border}`,boxShadow:C.shadow,marginBottom:20}}>
          <h2 style={{fontFamily:'DM Serif Display',fontSize:20,color:C.navy,marginBottom:6}}>London Pay Differentials</h2>
          <p style={{fontSize:14,color:C.mid,lineHeight:1.75,marginBottom:16}}>Teacher pay scales have four regional tiers reflecting cost of living. The differences can be substantial — an Inner London M6 teacher earns over £7,000 more than an England base equivalent.</p>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:12,minWidth:400}}>
              <thead><tr style={{background:C.bg}}>{['Pay Point','England','London Fringe','Outer London','Inner London'].map(h=><th key={h} style={{textAlign:'left',padding:'8px 12px',color:C.slate,fontSize:10,textTransform:'uppercase',borderBottom:`1px solid ${C.border}`,fontFamily:'JetBrains Mono'}}>{h}</th>)}</tr></thead>
              <tbody>
                {[['M1',32916,34398,37870,40317],['M6',45352,46839,50474,52300],['U1',47472,48913,52219,57632],['U3',51048,52490,56154,62496]].map(([pp,...salaries],i)=>(
                  <tr key={pp} style={{borderBottom:`1px solid ${C.border}`,background:i%2===0?'transparent':'rgba(0,0,0,0.012)'}}>
                    <td style={{padding:'9px 12px',fontFamily:'JetBrains Mono',fontWeight:700,color:C.navy}}>{pp}</td>
                    {salaries.map((s,j)=>{const r=calcTH(s);return<td key={j} style={{padding:'9px 12px',fontFamily:'JetBrains Mono',fontSize:12,color:j===3?C.purple:C.mid,fontWeight:j===3?700:400}}>{fmt(s)}<span style={{fontSize:10,color:C.sl,marginLeft:4}}>→{fmt(r.mo)}/mo</span></td>;})}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div style={{background:`linear-gradient(135deg,#4C1D95,#6D28D9)`,borderRadius:12,padding:'22px 24px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:14}}>
          <div>
            <div style={{fontFamily:'DM Serif Display',fontSize:18,color:'white',marginBottom:4}}>Calculate your exact teacher take-home pay</div>
            <div style={{fontSize:13,color:'rgba(255,255,255,0.5)'}}>Select pay point, region and TPS contribution tier</div>
          </div>
          <Link href="/teacher-salary-take-home" style={{background:'white',color:'#4C1D95',padding:'12px 24px',borderRadius:8,fontSize:14,fontWeight:700,display:'inline-block',flexShrink:0}}>Open Teacher Calculator →</Link>
        </div>

        <div style={{background:'#FFFFFF',borderRadius:12,padding:mob?16:22,border:'1px solid #E2E8F0',boxShadow:'0 1px 3px rgba(0,0,0,0.07)',marginTop:20}}>
          <div style={{fontSize:11,fontWeight:700,color:'#0D9488',letterSpacing:'0.15em',textTransform:'uppercase',marginBottom:10,fontFamily:'JetBrains Mono'}}>Related Calculators</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
            {[['/sacrifice','Salary sacrifice & TPS pension'],['/','Full salary calculator'],['/comparison','Compare two job offers']].map(([href,label])=>(
              <Link key={href} href={href} style={{display:'inline-block',padding:'7px 12px',background:'#F0FDFA',border:'1px solid #99F6E4',borderRadius:7,fontSize:12,color:'#0D9488',fontWeight:600}}>{label}</Link>
            ))}
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}