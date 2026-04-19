'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

function useW(){const[w,setW]=useState(typeof window!=='undefined'?window.innerWidth:800);useEffect(()=>{const f=()=>setW(window.innerWidth);window.addEventListener('resize',f);return()=>window.removeEventListener('resize',f);},[]);return w;}

const C={navy:'#0C1E3C',navyMid:'#1e3d6e',teal:'#0D9488',tealL:'#14B8A6',tealBg:'#F0FDFA',tealBd:'#99F6E4',border:'#E2E8F0',borderDk:'#CBD5E1',bg:'#F4F6F9',white:'#FFFFFF',green:'#059669',greenBg:'#ECFDF5',red:'#DC2626',text:'#1E293B',mid:'#475569',slate:'#64748B',sl:'#94A3B8',shadow:'0 1px 3px rgba(0,0,0,0.07),0 4px 16px rgba(0,0,0,0.04)'};
const GS=`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Source+Serif+4:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}body{background:#F4F6F9;color:#1E293B;font-family:'Source Serif 4',Georgia,serif;-webkit-tap-highlight-color:transparent;}a{text-decoration:none;color:inherit;}button{cursor:pointer;font-family:inherit;}@keyframes fi{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}.fi{animation:fi 0.35s ease both;}`;

// NHS data 2026-27
const BANDS = [
  {band:'Band 2',min:23615,max:24336,pen:5.0,roles:'Healthcare assistant, domestic, porter, catering'},
  {band:'Band 3',min:24336,max:25527,pen:5.0,roles:'Senior healthcare assistant, medical secretary'},
  {band:'Band 4',min:26530,max:29114,pen:6.1,roles:'Assistant practitioner, technician, admin officer'},
  {band:'Band 5',min:29970,max:36483,pen:9.8,roles:'Staff nurse, newly qualified AHP, junior doctor (FY1/2)'},
  {band:'Band 6',min:37338,max:44962,pen:10.7,roles:'Senior nurse, physiotherapist, radiographer, specialist'},
  {band:'Band 7',min:46148,max:52809,pen:12.5,roles:'Ward manager, advanced practitioner, specialist nurse'},
  {band:'Band 8a',min:53755,max:60504,pen:12.5,roles:'Team leader, consultant AHP, service manager'},
  {band:'Band 8b',min:62215,max:72293,pen:13.5,roles:'Head of service, lead pharmacist, senior manager'},
  {band:'Band 8c',min:74290,max:85932,pen:13.5,roles:'Director of service, senior clinical lead'},
  {band:'Band 8d',min:88168,max:102585,pen:13.5,roles:'Deputy director, consultant level clinical manager'},
  {band:'Band 9',min:105385,max:121271,pen:13.5,roles:'Director, executive level clinical director'},
];
const HCAS={none:0,fringe:1478,outer:4271,inner:5132};

function calcIT(g,p=0){const ti=Math.max(0,g-p);let pa=12570;if(ti>100000)pa=Math.max(0,12570-(ti-100000)/2);const tx=Math.max(0,ti-pa);const b1=Math.min(tx,37700),b2=Math.min(Math.max(0,tx-b1),74870),b3=Math.max(0,tx-b1-b2);return b1*0.20+b2*0.40+b3*0.45;}
function calcNI(g){if(g<=12570)return 0;return(Math.min(g,50270)-12570)*0.08+Math.max(0,g-50270)*0.02;}
function calcTH(gross,penPct){const p=gross*(penPct/100),it=calcIT(gross,p),ni=calcNI(gross);return{th:gross-it-ni-p,mo:(gross-it-ni-p)/12,it,ni,p};}

const fmt=n=>'\u00A3'+Math.round(n||0).toLocaleString('en-GB');
const fmtD=n=>'\u00A3'+(n||0).toLocaleString('en-GB',{minimumFractionDigits:2,maximumFractionDigits:2});

function Nav(){const mob=useW()<640;const[open,setOpen]=useState(false);const links=[['/',   'Salary Calculator'],['/nhs','NHS Calculator'],['/tools','All Tools'],['/blog','Tax Guides']];return(<nav style={{background:C.navy,position:'sticky',top:0,zIndex:100,boxShadow:'0 2px 16px rgba(0,0,0,0.25)'}}><div style={{maxWidth:1100,margin:'0 auto',padding:'0 20px',height:56,display:'flex',alignItems:'center',justifyContent:'space-between'}}><Link href="/" style={{display:'flex',alignItems:'center',gap:9}}><div style={{width:30,height:30,background:'linear-gradient(135deg,#0D9488,#14B8A6)',borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><span style={{color:'white',fontWeight:700,fontSize:12,fontFamily:'JetBrains Mono'}}>Tx</span></div><span style={{color:'white',fontFamily:'DM Serif Display',fontSize:17}}>Taxd<span style={{color:'#14B8A6'}}>Calc</span></span></Link>{mob?(<button onClick={()=>setOpen(!open)} style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:7,padding:'8px 10px',display:'flex',flexDirection:'column',gap:4}}>{[0,1,2].map(i=><span key={i} style={{display:'block',width:18,height:2,background:'white',borderRadius:1}}/>)}</button>):(<div style={{display:'flex',gap:2,alignItems:'center'}}>{links.map(([href,label])=>(<Link key={href} href={href} style={{padding:'7px 13px',borderRadius:6,color:'rgba(255,255,255,0.6)',fontSize:13}}>{label}</Link>))}<span style={{fontSize:11,color:'#14B8A6',fontFamily:'JetBrains Mono',background:'rgba(13,148,136,0.15)',padding:'3px 9px',borderRadius:4,border:'1px solid rgba(20,184,166,0.3)',marginLeft:8}}>2026-27</span></div>)}</div>{mob&&open&&(<div style={{background:'#162d52',borderTop:'1px solid rgba(255,255,255,0.08)',padding:'6px 0 12px'}}>{links.map(([href,label])=>(<Link key={href} href={href} onClick={()=>setOpen(false)} style={{display:'block',padding:'12px 24px',color:'rgba(255,255,255,0.65)',fontSize:14}}>{label}</Link>))}</div>)}</nav>);}
function Footer(){return(<footer style={{background:'#070D1C',padding:'24px 20px',borderTop:'1px solid rgba(255,255,255,0.05)',marginTop:48}}><div style={{maxWidth:1100,margin:'0 auto',display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:14,alignItems:'center'}}><Link href="/" style={{display:'flex',alignItems:'center',gap:8}}><div style={{width:26,height:26,background:'linear-gradient(135deg,#0D9488,#14B8A6)',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{color:'white',fontWeight:700,fontSize:11,fontFamily:'JetBrains Mono'}}>Tx</span></div><span style={{color:'white',fontFamily:'DM Serif Display',fontSize:15}}>Taxd<span style={{color:'#14B8A6'}}>Calc</span></span></Link><span style={{fontSize:11,color:'rgba(255,255,255,0.2)',fontFamily:'JetBrains Mono'}}>Updated April 2026</span><span style={{fontSize:11,color:'rgba(255,255,255,0.18)',maxWidth:280,lineHeight:1.6}}>For guidance only. Consult HMRC or a qualified adviser.</span></div></footer>);}

function BandRow({band,hcas}){
  const gross=band.min+(HCAS[hcas]||0);
  const r=calcTH(gross,band.pen);
  const grossMax=band.max+(HCAS[hcas]||0);
  const rMax=calcTH(grossMax,band.pen);
  return(
    <tr style={{borderBottom:`1px solid ${C.border}`}}>
      <td style={{padding:'10px 12px',fontWeight:700,color:C.navy,fontFamily:'JetBrains Mono',fontSize:13,whiteSpace:'nowrap'}}>{band.band}</td>
      <td style={{padding:'10px 12px',fontFamily:'JetBrains Mono',fontSize:12,color:C.mid,whiteSpace:'nowrap'}}>{fmt(gross)} – {fmt(grossMax)}</td>
      <td style={{padding:'10px 12px',fontFamily:'JetBrains Mono',fontSize:12,color:C.teal,fontWeight:700,whiteSpace:'nowrap'}}>{fmt(r.th)} – {fmt(rMax.th)}</td>
      <td style={{padding:'10px 12px',fontFamily:'JetBrains Mono',fontSize:12,color:C.teal,whiteSpace:'nowrap'}}>{fmtD(r.mo)} – {fmtD(rMax.mo)}</td>
      <td style={{padding:'10px 12px',fontSize:11,color:C.slate}}>{band.pen}%</td>
    </tr>
  );
}

export default function NHSPayGuide(){
  const mob=useW()<640;
  const[hcas,setHcas]=useState('none');

  const schemaFAQ={
  '@context':'https://schema.org',
  '@type':'FAQPage',
  mainEntity:[
    {'@type':'Question',name:'What is Agenda for Change (AfC)?',acceptedAnswer:{'@type':'Answer',text:'Agenda for Change is the pay system for NHS staff in England, Wales and Northern Ireland. All roles (except doctors, dentists and very senior managers) are placed into pay bands 1 to 9, each with specific salary ranges and spine points.'}},
    {'@type':'Question',name:'How does NHS London weighting work?',acceptedAnswer:{'@type':'Answer',text:'NHS London weighting is called the High Cost Area Supplement (HCAS). In 2026-27: fringe +£1,478/year, outer London +£4,271/year, inner London +£5,132/year. HCAS is pensionable and based on your workplace postcode, not where you live.'}},
    {'@type':'Question',name:'How much is the NHS pension contribution in 2026-27?',acceptedAnswer:{'@type':'Answer',text:'NHS pension contribution rates range from 5.0% for Bands 2 and 3 up to 13.5% for Bands 8c and above. Band 5 staff contribute 9.8%. The NHS pension is a defined benefit scheme valued at roughly 20-23% employer contribution equivalent.'}},
    {'@type':'Question',name:'What is the take-home pay for NHS Band 5 in 2026-27?',acceptedAnswer:{'@type':'Answer',text:'NHS Band 5 entry salary (£29,970) takes home approximately £22,748 per year (£1,896 per month) after income tax, NI and 9.8% NHS pension. At the top of Band 5 (£36,483) take-home is approximately £26,927 per year.'}},
    {'@type':'Question',name:'What is the difference between NHS Band 5 and Band 6?',acceptedAnswer:{'@type':'Answer',text:'Band 5 covers roles like staff nurses and newly qualified AHPs. Band 6 covers senior nurses and specialist practitioners. Band 6 entry is £37,338 in 2026-27, compared to Band 5 entry at £29,970 — a difference of approximately £4,000 in annual take-home pay.'}},
  ]
};
const schemaBreadcrumb={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'TaxdCalc',item:'https://taxdcal.co.uk'},{'@type':'ListItem',position:2,name:'NHS Pay Guide 2026-27',item:'https://taxdcal.co.uk/nhs-pay-guide'}]};
const schemaArticle={'@context':'https://schema.org','@type':'Article','@id':'https://taxdcal.co.uk/nhs-pay-guide#article',headline:'NHS Pay Guide 2026-27: Agenda for Change Bands, Take-Home Pay and Pension',description:'All NHS Agenda for Change bands 2-9, take-home pay after income tax, NI and NHS pension, and London HCAS weighting for 2026-27.',datePublished:'2026-04-18',dateModified:'2026-04-18',author:{'@type':'Organization',name:'TaxdCalc'},publisher:{'@type':'Organization',name:'TaxdCalc',url:'https://taxdcal.co.uk'}};

  return(
    <>
      <style>{GS}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schemaFAQ)}}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schemaBreadcrumb)}}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schemaArticle)}}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({
        '@context':'https://schema.org','@type':'HowTo',
        name:'How to calculate NHS take-home pay in 2026-27',
        description:'Step-by-step guide to calculating your NHS Agenda for Change take-home pay including HCAS and NHS pension.',
        step:[
          {'@type':'HowToStep',position:1,name:'Find your Agenda for Change band',text:'Your AfC band determines your pay range. Check your contract or payslip. Bands run from 2 to 9.'},
          {'@type':'HowToStep',position:2,name:'Check your London HCAS supplement',text:'If you work in London or the commuter belt, add your HCAS: fringe £1,478, outer London £4,271, inner London £5,132 per year.'},
          {'@type':'HowToStep',position:3,name:'Find your NHS pension contribution rate',text:'Bands 2-3: 5%, Band 4: 6.1%, Band 5: 9.8%, Band 6: 10.7%, Band 7-8a: 12.5%, Bands 8b and above: 13.5%.'},
          {'@type':'HowToStep',position:4,name:'Calculate income tax and NI',text:'Income tax: 20% on earnings between £12,570 and £50,270, 40% above. NI: 8% on £12,570–£50,270, 2% above. NHS pension is salary sacrifice so reduces your taxable income.'},
          {'@type':'HowToStep',position:5,name:'Use the TaxdCalc NHS pay calculator',text:'Enter your band, London zone and Scotland to get your exact take-home pay with all NHS-specific deductions calculated correctly.'},
        ]
      })}}/>
      <Nav/>

      {/* AI ANSWER BLOCK */}
      <div className="ai-answer" style={{background:'#F0FDFA',borderBottom:'1px solid #99F6E4',padding:mob?'14px 16px':'16px 24px'}}>
        <div style={{maxWidth:900,margin:'0 auto'}}>
          <div style={{fontSize:10,color:'#0D9488',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',fontFamily:'JetBrains Mono',marginBottom:6}}>Quick Answer — NHS Pay 2026-27</div>
          <p style={{fontSize:mob?14:15,color:'#0f766e',lineHeight:1.65,fontWeight:600,marginBottom:10}}>
            NHS Band 5 entry take-home is <strong>£22,748/year (£1,896/month)</strong> after income tax, NI and 9.8% NHS pension. Band 6 entry: <strong>£26,215/year</strong>. Inner London Band 5 entry with HCAS: <strong>£25,680/year</strong>.
          </p>
          <div style={{display:'grid',gridTemplateColumns:mob?'repeat(2,1fr)':'repeat(4,1fr)',gap:8}}>
            {[['Band 5 entry','£22,748/yr'],['Band 6 entry','£26,215/yr'],['Inner London Band 5','£25,680/yr'],['NHS pension (Band 5)','9.8% rate']].map(([l,v])=>(
              <div key={l} style={{background:'rgba(13,148,136,0.1)',borderRadius:7,padding:'9px 11px'}}>
                <div style={{fontSize:9,color:'#0D9488',textTransform:'uppercase',letterSpacing:'0.1em',fontFamily:'JetBrains Mono',marginBottom:3}}>{l}</div>
                <div style={{fontFamily:'JetBrains Mono',fontSize:12,fontWeight:700,color:'#0f766e'}}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{marginTop:10,fontSize:12,color:'#0f766e',lineHeight:1.6}}>
            💡 <strong>Tip:</strong> NHS pension contributions are salary sacrifice — they reduce your taxable income and save both income tax and NI. The NHS pension is a defined benefit scheme worth approximately 20-23% employer contribution equivalent.
          </div>
        </div>
      </div>

      {/* Hero */}
      <div style={{background:`linear-gradient(135deg,${C.navy},${C.navyMid})`,padding:mob?'32px 20px 48px':'44px 24px 60px',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:-50,right:-50,width:220,height:220,borderRadius:'50%',background:'rgba(13,148,136,0.08)',pointerEvents:'none'}}/>
        <div style={{maxWidth:900,margin:'0 auto'}}>
          <div style={{display:'inline-block',background:'rgba(13,148,136,0.15)',border:'1px solid rgba(20,184,166,0.3)',borderRadius:20,padding:'3px 12px',fontSize:11,color:'#14B8A6',marginBottom:12,fontFamily:'JetBrains Mono'}}>NHS Agenda for Change 2026-27</div>
          <h1 style={{fontFamily:'DM Serif Display',fontSize:mob?26:40,color:'white',lineHeight:1.15,marginBottom:12}}>NHS Pay Guide 2026-27</h1>
          <p style={{color:'rgba(255,255,255,0.5)',fontSize:mob?13:16,maxWidth:580,lineHeight:1.7,marginBottom:20}}>Complete guide to NHS Agenda for Change pay bands, take-home pay after income tax, NI and NHS pension. All bands from 2 to 9 with London HCAS weighting.</p>
          <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
            <Link href="/nhs" style={{background:C.teal,color:'white',padding:'11px 22px',borderRadius:8,fontSize:13,fontWeight:700,display:'inline-block'}}>Open NHS Pay Calculator →</Link>
            <Link href="/blog/nhs-band-5-take-home-pay-2026" style={{background:'rgba(255,255,255,0.1)',color:'white',padding:'11px 22px',borderRadius:8,fontSize:13,fontWeight:600,border:'1px solid rgba(255,255,255,0.15)',display:'inline-block'}}>Band 5 detailed guide</Link>
          </div>
        </div>
      </div>

      <div style={{maxWidth:900,margin:'0 auto',padding:mob?'20px 16px 60px':'28px 24px 72px'}}>

        {/* HCAS toggle */}
        <div style={{background:C.white,borderRadius:12,padding:mob?16:20,border:`1px solid ${C.border}`,boxShadow:C.shadow,marginBottom:20}} className="fi">
          <h2 style={{fontFamily:'DM Serif Display',fontSize:16,color:C.navy,marginBottom:12}}>London Weighting (HCAS)</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:8,marginBottom:4}}>
            {[['none','No supplement — England/Wales/NI'],['fringe',`Fringe +${fmt(HCAS.fringe)}/yr`],['outer',`Outer London +${fmt(HCAS.outer)}/yr`],['inner',`Inner London +${fmt(HCAS.inner)}/yr`]].map(([val,label])=>(
              <button key={val} onClick={()=>setHcas(val)}
                style={{padding:'10px 12px',borderRadius:8,border:`1.5px solid ${hcas===val?C.teal:C.borderDk}`,background:hcas===val?C.tealBg:'white',color:hcas===val?C.teal:C.mid,fontSize:12,fontWeight:hcas===val?700:400,textAlign:'left',transition:'all 0.15s'}}>
                {label}
              </button>
            ))}
          </div>
          <p style={{fontSize:11,color:C.slate,lineHeight:1.6,marginTop:10}}>HCAS supplements are pensionable, meaning they increase both your gross pay and your NHS pension contributions. The supplements apply to permanent NHS staff and are paid monthly alongside basic salary.</p>
        </div>

        {/* Complete pay table */}
        <div style={{background:C.white,borderRadius:12,padding:mob?'16px 0':'20px 0',border:`1px solid ${C.border}`,boxShadow:C.shadow,marginBottom:20}}>
          <div style={{padding:mob?'0 16px 12px':'0 20px 14px'}}>
            <h2 style={{fontFamily:'DM Serif Display',fontSize:18,color:C.navy,marginBottom:4}}>All NHS Bands — Take-Home Pay 2026-27</h2>
            <p style={{fontSize:12,color:C.slate}}>Entry point salary. Shows annual take-home after income tax, NI and NHS pension. {hcas!=='none'?`Includes ${hcas} HCAS supplement.`:''}</p>
          </div>
          <div style={{overflowX:'auto',WebkitOverflowScrolling:'touch'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:12,minWidth:520}}>
              <thead>
                <tr style={{background:C.bg}}>
                  {['Band','Gross Salary Range','Annual Take-Home','Monthly Take-Home','Pension Rate'].map((h,i)=>(
                    <th key={h} style={{textAlign:i>0?'left':'left',padding:'9px 12px',color:C.slate,fontSize:10,textTransform:'uppercase',letterSpacing:'0.06em',borderBottom:`1px solid ${C.border}`,fontFamily:'JetBrains Mono',whiteSpace:'nowrap'}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {BANDS.map((band,i)=><BandRow key={band.band} band={band} hcas={hcas}/>)}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pension section */}
        <div style={{background:C.white,borderRadius:12,padding:mob?16:22,border:`1px solid ${C.border}`,boxShadow:C.shadow,marginBottom:20}}>
          <h2 style={{fontFamily:'DM Serif Display',fontSize:20,color:C.navy,marginBottom:6}}>The NHS Pension — Worth More Than You Think</h2>
          <p style={{fontSize:14,color:C.mid,lineHeight:1.75,marginBottom:16}}>The NHS Pension Scheme is a defined benefit (DB) scheme — one of the most valuable employee benefits in the UK. Unlike a defined contribution pension where your pot depends on investment returns, the NHS pension guarantees a retirement income based on your career average earnings.</p>
          <div style={{display:'grid',gridTemplateColumns:mob?'1fr':'1fr 1fr',gap:14,marginBottom:16}}>
            {[
              {title:'What you receive',items:['Career Average Revalued Earnings (CARE) scheme','1/54th of your pensionable pay added each year','Revalued annually in line with CPI inflation','Lump sum option at retirement','Death in service benefits included']},
              {title:'Pension contribution rates 2026-27',items:['Bands 2–3: 5.0% of pensionable pay','Band 4: 6.1%','Band 5: 9.8%','Band 6: 10.7%','Band 7 and 8a: 12.5%','Bands 8b–9: 13.5%']},
            ].map(({title,items})=>(
              <div key={title} style={{background:C.tealBg,border:`1px solid ${C.tealBd}`,borderRadius:10,padding:'14px 16px'}}>
                <div style={{fontSize:12,fontWeight:700,color:C.teal,marginBottom:10,fontFamily:'JetBrains Mono',textTransform:'uppercase',letterSpacing:'0.08em'}}>{title}</div>
                {items.map(item=>(<div key={item} style={{display:'flex',gap:8,padding:'4px 0',fontSize:13,color:'#0f766e'}}><span style={{color:C.teal,flexShrink:0}}>▸</span>{item}</div>))}
              </div>
            ))}
          </div>
          <div style={{background:'#FEF3C7',border:'1px solid #FDE68A',borderRadius:9,padding:'12px 16px',fontSize:12,color:'#92400E',lineHeight:1.7}}>
            <strong>Comparing NHS to private sector:</strong> When evaluating a private sector job offer, you need to add approximately 20–23% of salary to the NHS offer value to account for the NHS pension. A Band 6 at £39,958 with NHS pension is financially equivalent to a private sector role paying approximately £48,000 with a standard 5% employer pension match.
          </div>
        </div>

        {/* HCAS explanation */}
        <div style={{background:C.white,borderRadius:12,padding:mob?16:22,border:`1px solid ${C.border}`,boxShadow:C.shadow,marginBottom:20}}>
          <h2 style={{fontFamily:'DM Serif Display',fontSize:20,color:C.navy,marginBottom:6}}>London HCAS Supplements Explained</h2>
          <p style={{fontSize:14,color:C.mid,lineHeight:1.75,marginBottom:16}}>The High Cost Area Supplement (HCAS) compensates NHS staff for the higher cost of living in and around London. It is separate from basic pay and is pensionable.</p>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:13,minWidth:400}}>
              <thead><tr style={{background:C.bg}}>{['Zone','Annual Supplement','Monthly Supplement','Area covered'].map(h=><th key={h} style={{textAlign:'left',padding:'9px 12px',color:C.slate,fontSize:10,textTransform:'uppercase',borderBottom:`1px solid ${C.border}`,fontFamily:'JetBrains Mono'}}>{h}</th>)}</tr></thead>
              <tbody>
                {[
                  ['No supplement','£0','£0','England (excl. London/fringe), Wales, NI'],
                  ['Fringe',`£${HCAS.fringe.toLocaleString('en-GB')}`,fmtD(HCAS.fringe/12),'Outer commuter belt: parts of Hertfordshire, Essex, Kent, Surrey, Buckinghamshire'],
                  ['Outer London',`£${HCAS.outer.toLocaleString('en-GB')}`,fmtD(HCAS.outer/12),'Outer London boroughs: Croydon, Barnet, Bromley, Havering, Sutton'],
                  ['Inner London',`£${HCAS.inner.toLocaleString('en-GB')}`,fmtD(HCAS.inner/12),'Inner London boroughs: Westminster, Islington, Tower Hamlets, Southwark, Camden'],
                ].map(([zone,...rest],i)=>(
                  <tr key={zone} style={{borderBottom:`1px solid ${C.border}`,background:i%2===0?'transparent':'rgba(0,0,0,0.012)'}}>
                    <td style={{padding:'10px 12px',fontWeight:600,color:C.navy}}>{zone}</td>
                    {rest.map((v,j)=><td key={j} style={{padding:'10px 12px',fontFamily:j<2?'JetBrains Mono':undefined,fontSize:j<2?13:12,color:j<2?C.teal:C.mid,fontWeight:j<2?700:400}}>{v}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{fontSize:12,color:C.slate,marginTop:12,lineHeight:1.6}}>HCAS eligibility is based on your workplace postcode, not where you live. A nurse working in Inner London who commutes from outside still receives the Inner London supplement.</p>
        </div>

        {/* Band progression */}
        <div style={{background:C.white,borderRadius:12,padding:mob?16:22,border:`1px solid ${C.border}`,boxShadow:C.shadow,marginBottom:20}}>
          <h2 style={{fontFamily:'DM Serif Display',fontSize:20,color:C.navy,marginBottom:6}}>Band Progression and Pay Review</h2>
          <p style={{fontSize:14,color:C.mid,lineHeight:1.75,marginBottom:16}}>NHS Agenda for Change pay is reviewed annually by the NHS Pay Review Body (NHSPRB). Staff progress through spine points within their band over time, and a cost of living increase applies across all bands each April.</p>
          <div style={{display:'grid',gridTemplateColumns:mob?'1fr':'repeat(3,1fr)',gap:12}}>
            {[
              {title:'Annual pay review',desc:'Confirmed each April. The 2026-27 uplift was 5.5% for most bands following NHSPRB recommendations.'},
              {title:'Spine point progression',desc:'Most bands have 3–6 spine points. New starters begin at the entry point and progress annually subject to satisfactory appraisal.'},
              {title:'Band gateway (Band 5)',desc:'Band 5 has a gateway after 3 years (spine point 4). Staff must meet a competency threshold before progressing to spine points 5 and 6.'},
            ].map(({title,desc})=>(
              <div key={title} style={{background:C.bg,borderRadius:9,padding:'14px 16px'}}>
                <div style={{fontSize:12,fontWeight:700,color:C.navy,marginBottom:6}}>{title}</div>
                <p style={{fontSize:12,color:C.mid,lineHeight:1.6}}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Calculator CTA */}
        <div style={{background:`linear-gradient(135deg,${C.navy},${C.navyMid})`,borderRadius:12,padding:'22px 24px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:14}}>
          <div>
            <div style={{fontFamily:'DM Serif Display',fontSize:18,color:'white',marginBottom:4}}>Calculate your exact NHS take-home pay</div>
            <div style={{fontSize:13,color:'rgba(255,255,255,0.45)'}}>Select your band, spine point, London zone and Scotland toggle</div>
          </div>
          <Link href="/nhs" style={{background:C.teal,color:'white',padding:'12px 24px',borderRadius:8,fontSize:14,fontWeight:700,display:'inline-block',flexShrink:0}}>Open NHS Calculator →</Link>
        </div>
      </div>
      <Footer/>
    </>
  );
}