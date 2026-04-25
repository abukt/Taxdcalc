'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

function useW(){const[w,setW]=useState(typeof window!=='undefined'?window.innerWidth:800);useEffect(()=>{const f=()=>setW(window.innerWidth);window.addEventListener('resize',f);return()=>window.removeEventListener('resize',f);},[]);return w;}
const C={navy:'#0C1E3C',navyLight:'#162d52',teal:'#0D9488',tealLight:'#14B8A6',tealBg:'#F0FDFA',tealBorder:'#99F6E4',border:'#E2E8F0',white:'#FFFFFF',text:'#1E293B',textMid:'#475569',slate:'#64748B',slateLight:'#94A3B8',shadow:'0 1px 3px rgba(0,0,0,0.07),0 4px 16px rgba(0,0,0,0.04)'};
const GS='@import url(\'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Source+Serif+4:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap\');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}body{background:#F8F9FA;color:#1E293B;font-family:\'Source Serif 4\',Georgia,serif;}a{text-decoration:none;color:inherit;}button{cursor:pointer;}@keyframes fadeUp{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}.fu{animation:fadeUp 0.4s ease both;}';

const ARTICLES = [
  {slug:'45000-salary-take-home-uk-2026',title:'45,000 Salary Take-Home Pay UK 2026-27',desc:'Exactly how much you take home on a 45,000 salary in the UK for 2026-27. Full income tax, NI and pension breakdown.',category:'Salary Guide',date:'16 April 2026',readTime:'4 min'},
  {slug:'50000-salary-after-tax-uk-2026',title:'50,000 Salary After Tax UK 2026-27',desc:'Take-home pay on a 50,000 salary in the UK for 2026-27, including the higher rate threshold explained.',category:'Salary Guide',date:'16 April 2026',readTime:'4 min'},
  {slug:'40000-salary-after-tax-uk-2026',title:'40,000 Salary After Tax UK 2026-27',desc:'How much take-home pay on a 40,000 salary in the UK for 2026-27. Income tax, NI and monthly net pay.',category:'Salary Guide',date:'16 April 2026',readTime:'4 min'},
  {slug:'30000-salary-take-home-pay-uk-2026',title:'30,000 Salary Take-Home Pay UK 2026-27',desc:'What you actually take home on a 30,000 salary in the UK for 2026-27. Full breakdown included.',category:'Salary Guide',date:'16 April 2026',readTime:'4 min'},
  {slug:'nhs-band-5-take-home-pay-2026',title:'NHS Band 5 Take-Home Pay 2026-27',desc:'Exact take-home pay for NHS Band 5 workers in 2026-27. Entry to top of band with NHS pension included.',category:'NHS Pay',date:'16 April 2026',readTime:'5 min'},
  {slug:'minimum-wage-take-home-pay-2026',title:'Minimum Wage Take-Home Pay 2026-27',desc:'Exactly how much you take home on the National Living Wage of 12.71 per hour in 2026-27.',category:'Salary Guide',date:'16 April 2026',readTime:'4 min'},
  {slug:'ir35-inside-outside-calculator-2026',title:'IR35 Inside vs Outside: What You Actually Take Home in 2026-27',desc:'Side-by-side comparison of PAYE inside IR35 vs Limited Company outside IR35. Updated for 2026-27 dividend rates.',category:'Contractor Tax',date:'16 April 2026',readTime:'6 min'},
  {slug:'salary-sacrifice-electric-car-uk-2026',title:'Salary Sacrifice Electric Car UK 2026-27: Is It Worth It?',desc:'How EV salary sacrifice works in 2026-27, what you actually save, and how to calculate your real monthly cost.',category:'Tax Planning',date:'16 April 2026',readTime:'7 min'},
  {slug:'how-uk-income-tax-brackets-work',title:'How UK Income Tax Brackets Work (2026-27)',desc:'Understand UK income tax in plain English. Learn how marginal rates work and why a pay rise never means less take-home pay.',category:'Tax Basics',date:'6 April 2026',readTime:'5 min'},
  {slug:'national-insurance-explained',title:'National Insurance Explained: What You Pay and Why (2026-27)',desc:'Class 1 NI rates, 2026-27 thresholds, and how NI differs from income tax on your payslip.',category:'Tax Basics',date:'6 April 2026',readTime:'5 min'},
  {slug:'pension-tax-relief-your-free-money',title:'Pension Tax Relief: How to Get Free Money From HMRC (2026-27)',desc:'How salary sacrifice saves both income tax and NI, and how to make the most of the annual allowance.',category:'Tax Planning',date:'6 April 2026',readTime:'6 min'},
  {slug:'2026-27-tax-year-changes-uk',title:'2026-27 Tax Year: Everything That Changed in April 2026',desc:'Thresholds frozen to 2031, NLW rises to 12.71/hr, employer NI at 15%, dividend rates increase. Complete guide.',category:'Tax Year Updates',date:'6 April 2026',readTime:'5 min'},
  {slug:'60-percent-tax-trap',title:'The 60% Tax Trap: How to Escape It in 2026-27',desc:'Between £100,000 and £125,140 your effective marginal rate is 60%. Salary sacrifice into pension escapes it entirely.',category:'Tax Planning',date:'18 April 2026',readTime:'6 min'},
  {slug:'hicbc-child-benefit-charge',title:'High Income Child Benefit Charge (HICBC) 2026-27 Explained',desc:'Child Benefit is clawed back between £60,000 and £80,000. Salary sacrifice can recover all of it. Calculate your exact position.',category:'Tax Planning',date:'18 April 2026',readTime:'5 min'},
  {slug:'personal-allowance-taper-100k',title:'Personal Allowance Taper at £100k — 2026-27 Guide',desc:'Above £100,000 your Personal Allowance is withdrawn at £1 per £2 earned. By £125,140 you have none. How to reclaim it.',category:'Tax Planning',date:'18 April 2026',readTime:'5 min'},
  {slug:'plan-5-student-loan-take-home',title:'Plan 5 Student Loan Take-Home Pay 2026-27',desc:'Plan 5 has the lowest repayment threshold (£25,000) of any UK student loan and a 40-year write-off period. How it affects take-home.',category:'Tax Basics',date:'18 April 2026',readTime:'4 min'},
];

const CATEGORIES = ['All','Salary Guide','NHS Pay','Contractor Tax','Tax Basics','Tax Planning','Tax Year Updates'];

function Nav(){const[open,setOpen]=useState(false);const mob=useW()<640;const links=[['/',   'Salary Calculator'],['/ir35','IR35'],['/nhs','NHS Bands'],['/tools','All Tools'],['/blog','Tax Guides']];return(<nav style={{background:'#0C1E3C',position:'sticky',top:0,zIndex:100,boxShadow:'0 2px 16px rgba(0,0,0,0.25)'}}><div style={{maxWidth:1100,margin:'0 auto',padding:'0 20px',height:56,display:'flex',alignItems:'center',justifyContent:'space-between'}}><Link href="/" style={{display:'flex',alignItems:'center',gap:9}}><div style={{width:30,height:30,background:'linear-gradient(135deg,#0D9488,#14B8A6)',borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><span style={{color:'white',fontWeight:700,fontSize:12,fontFamily:'JetBrains Mono'}}>Tx</span></div><span style={{color:'white',fontFamily:'DM Serif Display',fontSize:17}}>Taxd<span style={{color:'#14B8A6'}}>Calc</span></span></Link>{mob?(<button onClick={()=>setOpen(!open)} style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:7,padding:'8px 10px',display:'flex',flexDirection:'column',gap:4}}>{[0,1,2].map(i=><span key={i} style={{display:'block',width:18,height:2,background:'white',borderRadius:1,transition:'all 0.2s',transform:open&&i===0?'rotate(45deg) translate(4px,4px)':open&&i===2?'rotate(-45deg) translate(4px,-4px)':'none',opacity:open&&i===1?0:1}}/>)}</button>):(<div style={{display:'flex',gap:2,alignItems:'center'}}>{links.map(([href,label])=>(<Link key={href} href={href} style={{padding:'7px 13px',borderRadius:6,background:href==='/blog'?'rgba(13,148,136,0.2)':'transparent',color:href==='/blog'?'#14B8A6':'rgba(255,255,255,0.6)',fontSize:13,fontFamily:'Source Serif 4',fontWeight:href==='/blog'?600:400}}>{label}</Link>))}<span style={{fontSize:11,color:'#14B8A6',fontFamily:'JetBrains Mono',background:'rgba(13,148,136,0.15)',padding:'3px 9px',borderRadius:4,border:'1px solid rgba(20,184,166,0.3)',marginLeft:8}}>2026-27</span></div>)}</div>{mob&&open&&(<div style={{background:'#162d52',borderTop:'1px solid rgba(255,255,255,0.08)',padding:'6px 0 12px'}}>{links.map(([href,label])=>(<Link key={href} href={href} onClick={()=>setOpen(false)} style={{display:'block',padding:'12px 24px',background:href==='/blog'?'rgba(13,148,136,0.15)':'transparent',color:href==='/blog'?'#14B8A6':'rgba(255,255,255,0.65)',fontSize:14,fontFamily:'Source Serif 4',fontWeight:href==='/blog'?600:400}}>{label}</Link>))}</div>)}</nav>);}
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
export default function BlogPage() {
  const mob = useW() < 640;
  const [cat, setCat] = useState('All');
  const filtered = cat === 'All' ? ARTICLES : ARTICLES.filter(a => a.category === cat);

  const schemaFAQ={'@context':'https://schema.org','@type':'FAQPage',mainEntity:[
    {'@type':'Question',name:'What are the best UK tax guides for 2026-27?',acceptedAnswer:{'@type':'Answer',text:'TaxdCalc covers: the 60% tax trap above £100k, HICBC child benefit taper, Plan 5 student loans, salary sacrifice EV schemes, pension tax relief, IR35 inside vs outside, and all UK salary take-home guides. All updated for April 2026 changes.'}},
    {'@type':'Question',name:'What changed in UK tax in April 2026?',acceptedAnswer:{'@type':'Answer',text:'Key April 2026 changes: National Living Wage rose to £12.71/hr, dividend tax rose to 10.75% basic rate (8.75% previously), employee NI remained at 8%, Personal Allowance frozen at £12,570 until 2031. See the 2026-27 tax year changes guide for full details.'}},
  ]};
  const schemaBreadcrumb={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'TaxdCalc',item:'https://taxdcal.co.uk'},{'@type':'ListItem',position:2,name:'Tax Guides',item:'https://taxdcal.co.uk/blog'}]};

  return (
    <>
      <style>{GS}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schemaFAQ)}}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schemaBreadcrumb)}}/>
      <Nav/>
      <div style={{background:'#F0FDFA',borderBottom:'1px solid #99F6E4',padding:mob?'10px 16px':'12px 24px'}}>
        <div style={{maxWidth:900,margin:'0 auto',display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
          <div style={{fontSize:10,color:'#0D9488',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',fontFamily:'JetBrains Mono',flexShrink:0}}>Tax Guides 2026-27</div>
          <p style={{fontSize:12,color:'#0f766e',lineHeight:1.5,margin:0}}>All guides updated for April 2026 — NLW £12.71/hr, dividend tax 10.75%, NI 8%, PA frozen at £12,570.</p>
        </div>
      </div>
      <div style={{background:'linear-gradient(135deg,#0C1E3C,#1e3d6e)',padding:mob?'36px 20px 56px':'44px 24px 64px',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:-40,right:-30,width:200,height:200,borderRadius:'50%',background:'rgba(13,148,136,0.08)',pointerEvents:'none'}}/>
        <div style={{display:'inline-block',background:'rgba(13,148,136,0.15)',border:'1px solid rgba(20,184,166,0.3)',borderRadius:20,padding:'4px 13px',fontSize:11,color:'#14B8A6',marginBottom:14,fontFamily:'JetBrains Mono'}}>Tax Guides</div>
        <h1 style={{fontFamily:'DM Serif Display',fontSize:mob?28:44,color:'white',marginBottom:8}}>UK Tax Guides 2026-27</h1>
        <p style={{color:'rgba(255,255,255,0.45)',fontSize:14,maxWidth:420,margin:'0 auto'}}>Plain-English guides to take-home pay, income tax, NI, pensions and your payslip. All figures confirmed for 2026-27.</p>
      </div>
      <div style={{maxWidth:920,margin:mob?'-22px 0 0':'-26px auto 0',padding:mob?'0 16px 48px':'0 24px 56px'}}>
        <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:22}}>
          {CATEGORIES.map(c=>(
            <button key={c} onClick={()=>setCat(c)}
              style={{padding:'6px 14px',borderRadius:20,border:'1px solid '+(cat===c?C.teal:C.border),background:cat===c?C.tealBg:'white',color:cat===c?C.teal:C.textMid,fontSize:12,fontWeight:cat===c?700:400,transition:'all 0.15s'}}>
              {c}
            </button>
          ))}
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:14}} className="fu">
          {filtered.map(a=>(
            <Link key={a.slug} href={'/blog/'+a.slug}
              style={{background:C.white,border:'1px solid '+C.border,borderRadius:12,padding:mob?'18px 16px':22,display:'block',boxShadow:C.shadow,transition:'all 0.2s'}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=C.teal;e.currentTarget.style.transform='translateY(-1px)';e.currentTarget.style.boxShadow='0 4px 20px rgba(0,0,0,0.08)';}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow=C.shadow;}}>
              <div style={{display:'flex',gap:10,marginBottom:10,alignItems:'center',flexWrap:'wrap'}}>
                <span style={{fontSize:11,background:C.tealBg,color:C.teal,border:'1px solid '+C.tealBorder,borderRadius:4,padding:'2px 8px',fontWeight:700,fontFamily:'JetBrains Mono'}}>{a.category}</span>
                <span style={{fontSize:11,color:C.slateLight,fontFamily:'JetBrains Mono'}}>{a.readTime} read</span>
                <span style={{fontSize:11,color:C.slateLight,fontFamily:'JetBrains Mono'}}>{a.date}</span>
              </div>
              <h2 style={{fontFamily:'DM Serif Display',fontSize:mob?17:22,color:C.navy,lineHeight:1.3,marginBottom:7}}>{a.title}</h2>
              <p style={{fontSize:13,color:C.slate,lineHeight:1.6,marginBottom:10}}>{a.desc}</p>
              <div style={{fontSize:13,color:C.teal,fontWeight:600}}>Read guide</div>
            </Link>
          ))}
        </div>
      </div>
      <Footer/>
    </>
  );
}
