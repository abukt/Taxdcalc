'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

function useW(){const[w,setW]=useState(typeof window!=='undefined'?window.innerWidth:800);useEffect(()=>{const f=()=>setW(window.innerWidth);window.addEventListener('resize',f);return()=>window.removeEventListener('resize',f);},[]);return w;}

const C={navy:'#0C1E3C',navyMid:'#1e3d6e',teal:'#0D9488',tealL:'#14B8A6',tealBg:'#F0FDFA',tealBd:'#99F6E4',border:'#E2E8F0',borderDk:'#CBD5E1',bg:'#F4F6F9',white:'#FFFFFF',green:'#059669',amber:'#D97706',amberBg:'#FFFBEB',amberBd:'#FDE68A',red:'#DC2626',text:'#1E293B',mid:'#475569',slate:'#64748B',sl:'#94A3B8',shadow:'0 1px 3px rgba(0,0,0,0.07),0 4px 16px rgba(0,0,0,0.04)',pink:'#EC4899',pinkBg:'#FDF2F8',pinkBd:'#FBCFE8'};
const GS=`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Source+Serif+4:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}body{background:#F4F6F9;color:#1E293B;font-family:'Source Serif 4',Georgia,serif;-webkit-tap-highlight-color:transparent;}input[type=range]{-webkit-appearance:none;width:100%;height:4px;background:#CBD5E1;border-radius:2px;outline:none;}input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;border-radius:50%;background:#0C1E3C;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.2);}a{text-decoration:none;color:inherit;}button{cursor:pointer;font-family:inherit;}@keyframes fi{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}.fi{animation:fi 0.35s ease both;}`;

// 2026-27 rates
const MA_WEEKLY = 184.03;
const MA_WEEKS = 39;
const SMP_HIGHER_PCT = 0.90;
const SMP_STANDARD_WEEKLY = 184.03;
const SMP_WEEKS = 39;

function Nav(){const mob=useW()<640;const[open,setOpen]=useState(false);const links=[['/',   'Salary Calculator'],['/maternity','Employed Maternity'],['/tools','All Tools'],['/blog','Tax Guides']];return(<nav style={{background:C.navy,position:'sticky',top:0,zIndex:100,boxShadow:'0 2px 16px rgba(0,0,0,0.25)'}}><div style={{maxWidth:1100,margin:'0 auto',padding:'0 20px',height:56,display:'flex',alignItems:'center',justifyContent:'space-between'}}><Link href="/" style={{display:'flex',alignItems:'center',gap:9}}><div style={{width:30,height:30,background:'linear-gradient(135deg,#0D9488,#14B8A6)',borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><span style={{color:'white',fontWeight:700,fontSize:12,fontFamily:'JetBrains Mono'}}>Tx</span></div><span style={{color:'white',fontFamily:'DM Serif Display',fontSize:17}}>Taxd<span style={{color:'#14B8A6'}}>Calc</span></span></Link>{mob?(<button onClick={()=>setOpen(!open)} style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:7,padding:'8px 10px',display:'flex',flexDirection:'column',gap:4}}>{[0,1,2].map(i=><span key={i} style={{display:'block',width:18,height:2,background:'white',borderRadius:1}}/>)}</button>):(<div style={{display:'flex',gap:2,alignItems:'center'}}>{links.map(([href,label])=>(<Link key={href} href={href} style={{padding:'7px 13px',borderRadius:6,color:'rgba(255,255,255,0.6)',fontSize:13}}>{label}</Link>))}<span style={{fontSize:11,color:'#14B8A6',fontFamily:'JetBrains Mono',background:'rgba(13,148,136,0.15)',padding:'3px 9px',borderRadius:4,border:'1px solid rgba(20,184,166,0.3)',marginLeft:8}}>2026-27</span></div>)}</div>{mob&&open&&(<div style={{background:'#162d52',borderTop:'1px solid rgba(255,255,255,0.08)',padding:'6px 0 12px'}}>{links.map(([href,label])=>(<Link key={href} href={href} onClick={()=>setOpen(false)} style={{display:'block',padding:'12px 24px',color:'rgba(255,255,255,0.65)',fontSize:14}}>{label}</Link>))}</div>)}</nav>);}
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
export default function MaternityPaySelfEmployed(){
  const mob=useW()<640;
  const[avgEarnings,setAvgEarnings]=useState('');
  const[weeksOff,setWeeksOff]=useState(26);
  const[hasClass2,setHasClass2]=useState(true);

  const annualEarnings=Math.max(0,Number(avgEarnings)||0);
  const weeklyEarnings=annualEarnings/52;

  const maWeeklyRate=Math.min(MA_WEEKLY, weeklyEarnings*0.90);
  const maTotal=maWeeklyRate*MA_WEEKS;

  const smpHigherWeeks=6;
  const smpHigher=(weeklyEarnings*SMP_HIGHER_PCT)*smpHigherWeeks;
  const smpStandard=SMP_STANDARD_WEEKLY*(SMP_WEEKS-smpHigherWeeks);
  const smpTotal=smpHigher+smpStandard;

  const lostEarnings=(weeklyEarnings*weeksOff)-(maWeeklyRate*Math.min(weeksOff,MA_WEEKS));

  const schemaCalc={'@context':'https://schema.org','@type':'WebApplication','@id':'https://taxdcal.co.uk/maternity-pay-self-employed#calc',name:'Self-Employed Maternity Pay Calculator UK 2026-27',applicationCategory:'FinanceApplication',operatingSystem:'Any',offers:{'@type':'Offer',price:'0',priceCurrency:'GBP'},provider:{'@type':'Organization',name:'TaxdCalc',url:'https://taxdcal.co.uk'},url:'https://taxdcal.co.uk/maternity-pay-self-employed'};
  const schemaFAQ={'@context':'https://schema.org','@type':'FAQPage',mainEntity:[
    {'@type':'Question',name:'Can self-employed people get maternity pay?',acceptedAnswer:{'@type':'Answer',text:'Yes. Self-employed people cannot claim SMP but can claim Maternity Allowance (MA) from the DWP. The standard rate in 2026-27 is £184.03 per week for up to 39 weeks.'}},
    {'@type':'Question',name:'How much is Maternity Allowance in 2026-27?',acceptedAnswer:{'@type':'Answer',text:'Maternity Allowance is £184.03 per week for up to 39 weeks in 2026-27, provided you have paid Class 2 NI and earned at least £30/week average over any 13 weeks in the 66 weeks before your due date.'}},
    {'@type':'Question',name:'Is Maternity Allowance taxable?',acceptedAnswer:{'@type':'Answer',text:'No. Maternity Allowance is not taxable income. It does not count for income tax purposes but should be reported via Self Assessment if you complete one.'}},
    {'@type':'Question',name:'How long does Maternity Allowance last?',acceptedAnswer:{'@type':'Answer',text:'Maternity Allowance lasts up to 39 weeks. You can choose when it starts — from 11 weeks before your due date at the earliest, or any time after the birth.'}},
    {'@type':'Question',name:'What if I have not paid enough Class 2 NI?',acceptedAnswer:{'@type':'Answer',text:'If you have not paid Class 2 NI you may still qualify for MA at the lower rate of £27 per week, provided you were registered as self-employed for at least 26 weeks in the 66 weeks before your due date.'}},
  ]};
  const schemaBreadcrumb={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'TaxdCalc',item:'https://taxdcal.co.uk'},{'@type':'ListItem',position:2,name:'Self-Employed Maternity Pay',item:'https://taxdcal.co.uk/maternity-pay-self-employed'}]};

  return(
    <>
      <style>{GS}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schemaCalc)}}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schemaFAQ)}}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schemaBreadcrumb)}}/>
      <Nav/>
      {annualEarnings > 0 && (
        <div className="ai-answer" style={{background:'#F0FDFA',borderBottom:'1px solid #99F6E4',padding:mob?'13px 16px':'15px 24px'}}>
          <div style={{maxWidth:1000,margin:'0 auto'}}>
            <div style={{fontSize:10,color:'#0D9488',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',fontFamily:'JetBrains Mono',marginBottom:5}}>Quick Answer — Maternity Allowance 2026-27</div>
            <p style={{fontSize:mob?13:14,color:'#0f766e',fontWeight:600,lineHeight:1.6}}>
              On {'£'}{annualEarnings.toLocaleString('en-GB')} earnings ({'£'}{weeklyEarnings.toFixed(2)}/week): Maternity Allowance is <strong>{'£'}{maWeeklyRate.toFixed(2)}/week</strong> for up to 39 weeks — total <strong>{'£'}{Math.round(maWeeklyRate*39).toLocaleString('en-GB')}</strong>. Standard rate capped at {'£'}184.03/week.
            </p>
          </div>
        </div>
      )}
      <div style={{background:`linear-gradient(135deg,#831843,#9D174D)`,padding:mob?'32px 20px 48px':'44px 24px 60px',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:-50,right:-50,width:200,height:200,borderRadius:'50%',background:'rgba(255,255,255,0.05)',pointerEvents:'none'}}/>
        <div style={{maxWidth:900,margin:'0 auto'}}>
          <div style={{display:'inline-block',background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.2)',borderRadius:20,padding:'3px 12px',fontSize:11,color:'white',marginBottom:12,fontFamily:'JetBrains Mono'}}>Self-Employed Maternity 2026-27</div>
          <h1 style={{fontFamily:'DM Serif Display',fontSize:mob?26:40,color:'white',lineHeight:1.15,marginBottom:12}}>Self-Employed Maternity Pay 2026-27</h1>
          <p style={{color:'rgba(255,255,255,0.6)',fontSize:mob?13:16,maxWidth:580,lineHeight:1.7}}>Self-employed mothers cannot claim SMP but can get Maternity Allowance from the DWP. This guide calculates exactly how much you get, how it compares to employed SMP, and how to plan your finances during maternity leave.</p>
        </div>
      </div>

      <div style={{maxWidth:900,margin:'0 auto',padding:mob?'20px 16px 60px':'28px 24px 72px'}}>
        <div style={{background:C.white,borderRadius:12,padding:mob?18:24,border:`1px solid ${C.border}`,boxShadow:C.shadow,marginBottom:20}} className="fi">
          <h2 style={{fontFamily:'DM Serif Display',fontSize:17,color:C.navy,marginBottom:16}}>Your Maternity Allowance Estimate</h2>

          <div style={{display:'grid',gridTemplateColumns:mob?'1fr':'1fr 1fr',gap:16,marginBottom:16}}>
            <div>
              <label style={{display:'block',fontSize:12,fontWeight:600,color:C.navy,marginBottom:7}}>Average annual self-employed earnings</label>
              <div style={{position:'relative'}}>
                <span style={{position:'absolute',left:13,top:'50%',transform:'translateY(-50%)',color:C.slate,fontSize:15,fontWeight:600,fontFamily:'JetBrains Mono',pointerEvents:'none'}}>&pound;</span>
                <input type="number" inputMode="decimal" value={avgEarnings} onChange={e=>setAvgEarnings(e.target.value)}
                  style={{width:'100%',padding:'12px 14px 12px 28px',border:`1.5px solid ${C.borderDk}`,borderRadius:8,fontSize:15,fontFamily:'JetBrains Mono',color:C.navy,background:'white',outline:'none'}}
                  onFocus={e=>e.target.style.borderColor=C.teal} onBlur={e=>e.target.style.borderColor=C.borderDk}/>
              </div>
              <div style={{fontSize:11,color:C.slate,marginTop:4}}>Weekly earnings: {fmt(weeklyEarnings)}</div>
            </div>
            <div>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:7}}>
                <label style={{fontSize:12,fontWeight:600,color:C.navy}}>Planned weeks off</label>
                <span style={{fontFamily:'JetBrains Mono',fontSize:12,color:C.teal,fontWeight:600}}>{weeksOff} weeks</span>
              </div>
              <input type="range" min={1} max={52} value={weeksOff} onChange={e=>setWeeksOff(Number(e.target.value))}/>
              <div style={{display:'flex',justifyContent:'space-between',marginTop:4}}>
                <span style={{fontSize:10,color:C.sl}}>1 week</span>
                <span style={{fontSize:10,color:C.teal,fontWeight:700}}>39 wks = full MA</span>
                <span style={{fontSize:10,color:C.sl}}>52 weeks</span>
              </div>
            </div>
          </div>

          <div style={{padding:'12px 14px',background:hasClass2?C.tealBg:C.amberBg,border:`1.5px solid ${hasClass2?C.tealBd:C.amberBd}`,borderRadius:9,marginBottom:16,display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
            <div>
              <div style={{fontSize:13,fontWeight:700,color:hasClass2?C.teal:C.amber}}>Paying Class 2 National Insurance?</div>
              <div style={{fontSize:11,color:C.slate,marginTop:2}}>Required to qualify for Maternity Allowance. Rate: £3.45/week in 2026-27</div>
            </div>
            <button onClick={()=>setHasClass2(!hasClass2)} style={{width:46,height:25,borderRadius:13,border:'none',background:hasClass2?C.teal:C.amberBd,position:'relative',transition:'background 0.2s',flexShrink:0}}>
              <span style={{position:'absolute',top:2.5,left:hasClass2?23:2.5,width:20,height:20,borderRadius:'50%',background:'white',boxShadow:'0 1px 4px rgba(0,0,0,0.2)',transition:'left 0.2s'}}/>
            </button>
          </div>

          {!hasClass2&&(
            <div style={{background:C.amberBg,border:`1px solid ${C.amberBd}`,borderRadius:9,padding:'12px 14px',fontSize:12,color:C.amber,lineHeight:1.6,marginBottom:16}}>
              ⚠️ Without Class 2 NI contributions, you may only qualify for the lower rate of Maternity Allowance (£27/week) or may not qualify at all. You need to have been self-employed for at least 26 of the 66 weeks before your due date and paid Class 2 NI.
            </div>
          )}

          {annualEarnings>0&&(
            <div style={{display:'grid',gridTemplateColumns:mob?'1fr 1fr':'repeat(3,1fr)',gap:10}}>
              {[
                ['Weekly MA rate',fmt(maWeeklyRate),'#14B8A6'],
                [`Total MA (${Math.min(weeksOff,MA_WEEKS)} wks)`,fmt(maWeeklyRate*Math.min(weeksOff,MA_WEEKS)),'#14B8A6'],
                ['Lost earnings',fmt(lostEarnings),'#DC2626'],
              ].map(([label,value,color])=>(
                <div key={label} style={{background:C.bg,borderRadius:9,padding:'12px 14px',textAlign:'center'}}>
                  <div style={{fontSize:10,color:C.slate,letterSpacing:'0.08em',textTransform:'uppercase',fontFamily:'JetBrains Mono',marginBottom:4}}>{label}</div>
                  <div style={{fontFamily:'DM Serif Display',fontSize:mob?20:24,color:color,lineHeight:1}}>{value}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{background:C.white,borderRadius:12,padding:mob?16:22,border:`1px solid ${C.border}`,boxShadow:C.shadow,marginBottom:20}}>
          <h2 style={{fontFamily:'DM Serif Display',fontSize:18,color:C.navy,marginBottom:6}}>Maternity Allowance vs Employed SMP</h2>
          <p style={{fontSize:13,color:C.mid,lineHeight:1.7,marginBottom:16}}>The key difference: employed mothers get 6 weeks at 90% of their actual salary, which for higher earners is significantly more than MA. Self-employed mothers get MA capped at £{MA_WEEKLY}/week regardless of earnings.</p>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:12,minWidth:420}}>
              <thead><tr style={{background:C.bg}}>{['','Maternity Allowance (self-employed)','SMP (employed)'].map(h=><th key={h} style={{textAlign:'left',padding:'9px 12px',color:C.slate,fontSize:10,textTransform:'uppercase',borderBottom:`1px solid ${C.border}`,fontFamily:'JetBrains Mono'}}>{h}</th>)}</tr></thead>
              <tbody>
                {[
                  ['Duration','39 weeks maximum','39 weeks (52 weeks available unpaid)'],
                  ['Weeks 1–6',annualEarnings>0?`${fmt(maWeeklyRate)}/week (lower of 90% or £${MA_WEEKLY})`:`90% of weekly earnings (max £${MA_WEEKLY})`,'90% of average weekly earnings (no cap)'],
                  ['Weeks 7–39',`${fmt(maWeeklyRate)}/week`,`£${SMP_STANDARD_WEEKLY}/week`],
                  annualEarnings>0?['Total (39 weeks)',fmt(maWeeklyRate*39),fmt(smpTotal)]:null,
                  ['Paid by','DWP (claim via Jobcentre Plus)','Your employer (HMRC reimburses)'],
                  ['Taxable?','No — not taxable','Yes — taxable as income'],
                  ['Affects pension?','No pension contributions during MA','Yes — employer pension contributions continue during SMP'],
                ].filter(Boolean).map(([label,...rest],i)=>(
                  <tr key={label} style={{borderBottom:`1px solid ${C.border}`,background:i%2===0?'transparent':'rgba(0,0,0,0.012)'}}>
                    <td style={{padding:'10px 12px',fontWeight:600,color:C.navy,fontSize:12}}>{label}</td>
                    {rest.map((v,j)=><td key={j} style={{padding:'10px 12px',fontSize:12,color:C.mid,lineHeight:1.5}}>{v}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{background:C.white,borderRadius:12,padding:mob?16:22,border:`1px solid ${C.border}`,boxShadow:C.shadow,marginBottom:20}}>
          <h2 style={{fontFamily:'DM Serif Display',fontSize:18,color:C.navy,marginBottom:14}}>Maternity Allowance Eligibility Checklist</h2>
          {[
            {label:'Self-employed for 26+ weeks',detail:'Must have been registered as self-employed for at least 26 of the 66 weeks before your expected due date.'},
            {label:'Earning at least £30/week average',detail:'Average weekly earnings of at least £30 over any 13 of the 66 weeks before your due date. Self-employed earnings are based on your Class 2 NI record.'},
            {label:'Class 2 NI paid (or exempt)',detail:'Must have paid Class 2 National Insurance contributions for the qualifying period. Small profits threshold in 2026-27: £6,725/year.'},
            {label:'Claim within qualifying window',detail:'You can claim MA from 26 weeks pregnant. Your payments can start up to 11 weeks before your due date.'},
          ].map(({label,detail},i)=>(
            <div key={label} style={{display:'flex',gap:12,padding:'12px 0',borderBottom:i<3?`1px solid ${C.border}`:undefined}}>
              <div style={{width:22,height:22,borderRadius:'50%',background:C.tealBg,border:`1.5px solid ${C.tealBd}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:1}}>
                <span style={{color:C.teal,fontSize:11,fontWeight:700}}>✓</span>
              </div>
              <div>
                <div style={{fontSize:13,fontWeight:700,color:C.navy,marginBottom:3}}>{label}</div>
                <div style={{fontSize:12,color:C.mid,lineHeight:1.6}}>{detail}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{background:C.amberBg,border:`1px solid ${C.amberBd}`,borderRadius:12,padding:mob?16:22,marginBottom:20}}>
          <h2 style={{fontFamily:'DM Serif Display',fontSize:18,color:'#92400E',marginBottom:14}}>Planning Tips for Self-Employed Parents</h2>
          {[
            ['Invoice ahead of going on leave','Any invoices raised before going on leave count as trading income. Consider invoicing outstanding work early.'],
            ['Keep Self Assessment up to date','Your Class 2 NI record is based on your Self Assessment. If you are behind on returns, HMRC may not have accurate records for your MA claim.'],
            ['Budget for the MA cap','If your weekly earnings are above £204.47, you will notice the difference. Budget for a lower income from week 1 of leave.'],
            ['Pension contributions during MA','Unlike employed mothers, your pension contributions pause unless you choose to continue them voluntarily. HMRC does not require pension contributions during MA.'],
          ].map(([title,detail])=>(
            <div key={title} style={{padding:'9px 0',borderBottom:`1px solid ${C.amberBd}`}}>
              <div style={{fontSize:13,fontWeight:700,color:C.amber,marginBottom:3}}>{title}</div>
              <p style={{fontSize:12,color:'#92400E',lineHeight:1.6}}>{detail}</p>
            </div>
          ))}
        </div>

        <div style={{display:'grid',gridTemplateColumns:mob?'1fr':'1fr 1fr',gap:12}}>
          <div style={{background:`linear-gradient(135deg,${C.navy},${C.navyMid})`,borderRadius:12,padding:'18px 20px'}}>
            <div style={{fontFamily:'DM Serif Display',fontSize:15,color:'white',marginBottom:4}}>Employed maternity pay</div>
            <div style={{fontSize:12,color:'rgba(255,255,255,0.45)',marginBottom:14}}>SMP calculator for employees</div>
            <Link href="/maternity" style={{background:C.teal,color:'white',padding:'9px 18px',borderRadius:7,fontSize:12,fontWeight:700,display:'inline-block'}}>Employed SMP Calculator →</Link>
          </div>
          <div style={{background:C.tealBg,border:`1px solid ${C.tealBd}`,borderRadius:12,padding:'18px 20px'}}>
            <div style={{fontFamily:'DM Serif Display',fontSize:15,color:C.navy,marginBottom:4}}>Salary calculator</div>
            <div style={{fontSize:12,color:C.slate,marginBottom:14}}>Calculate take-home on any salary</div>
            <Link href="/" style={{background:C.navy,color:'white',padding:'9px 18px',borderRadius:7,fontSize:12,fontWeight:700,display:'inline-block'}}>Full Salary Calculator →</Link>
          </div>
        </div>
      </div>

      {mob && annualEarnings > 0 && (
        <div style={{position:'fixed',bottom:0,left:0,right:0,background:C.navy,zIndex:90,height:52,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 20px',boxShadow:'0 -2px 16px rgba(0,0,0,0.3)'}}>
          <div>
            <div style={{fontSize:9,color:'rgba(255,255,255,0.4)',fontFamily:'JetBrains Mono',textTransform:'uppercase',letterSpacing:'0.1em'}}>Maternity Allowance</div>
            <div style={{fontFamily:'DM Serif Display',fontSize:19,color:'#14B8A6',lineHeight:1}}>{fmt(maWeeklyRate * 39)}</div>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:9,color:'rgba(255,255,255,0.4)',fontFamily:'JetBrains Mono',textTransform:'uppercase',letterSpacing:'0.1em'}}>Weekly MA</div>
            <div style={{fontFamily:'JetBrains Mono',fontSize:13,color:'white',fontWeight:700,lineHeight:1}}>{fmtD(maWeeklyRate)}</div>
          </div>
        </div>
      )}
      <Footer/>
    </>
  );
}
