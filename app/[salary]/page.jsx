'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useParams } from 'next/navigation';

function useW(){const[w,setW]=useState(typeof window!=='undefined'?window.innerWidth:800);useEffect(()=>{const f=()=>setW(window.innerWidth);window.addEventListener('resize',f);return()=>window.removeEventListener('resize',f);},[]);return w;}

// Valid salary pages - each maps to a URL like /45000-salary-take-home
const VALID_SALARIES = [
  20000,22000,25000,27000,28000,30000,32000,35000,38000,40000,
  42000,45000,48000,50000,55000,60000,65000,70000,75000,80000,
  85000,90000,95000,100000,110000,120000,125000,150000
];

// Slug to salary mapping
function slugToSalary(slug) {
  const match = slug.match(/^(\d+)-salary/);
  if (!match) return null;
  const n = parseInt(match[1], 10);
  return VALID_SALARIES.includes(n) ? n : null;
}

// Special pages
const SPECIAL = {
  'minimum-wage-take-home': { salary: 26418, label: 'Minimum Wage', desc: 'Based on National Living Wage of £12.71/hr x 40hrs x 52 weeks = £26,418/year' },
  'nhs-band-5-take-home': { salary: 29970, label: 'NHS Band 5', desc: 'Entry point of NHS Agenda for Change Band 5 (2026-27)' },
  'nhs-band-6-take-home': { salary: 37338, label: 'NHS Band 6', desc: 'Entry point of NHS Agenda for Change Band 6 (2026-27)' },
  'nhs-band-7-take-home': { salary: 46148, label: 'NHS Band 7', desc: 'Entry point of NHS Agenda for Change Band 7 (2026-27)' },
  'teacher-salary-take-home': { salary: 31650, label: 'NQT Teacher', desc: 'Newly Qualified Teacher (NQT) starting salary England 2026-27' },
  'graduate-salary-take-home': { salary: 28000, label: 'Graduate', desc: 'Average UK graduate starting salary 2026-27' },
  'apprentice-wage-take-home': { salary: 15652, label: 'Apprentice', desc: 'Based on apprentice NLW of £7.55/hr x 40hrs x 52 weeks' },
};

const C = {
  navy:'#0C1E3C',navyMid:'#1e3d6e',teal:'#0D9488',tealLight:'#14B8A6',tealBg:'#F0FDFA',tealBorder:'#99F6E4',
  scot:'#1D4ED8',scotBg:'#EFF6FF',scotBorder:'#BFDBFE',
  border:'#E2E8F0',borderDark:'#CBD5E1',bg:'#F4F6F9',white:'#FFFFFF',
  green:'#059669',red:'#DC2626',text:'#1E293B',textMid:'#475569',slate:'#64748B',slateLight:'#94A3B8',
  shadow:'0 1px 3px rgba(0,0,0,0.07),0 4px 16px rgba(0,0,0,0.04)',
};
const GS = `@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Source+Serif+4:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}body{background:#F4F6F9;color:#1E293B;font-family:'Source Serif 4',Georgia,serif;-webkit-tap-highlight-color:transparent;}input[type=number]{-moz-appearance:textfield;}input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;}input[type=range]{-webkit-appearance:none;width:100%;height:4px;background:#CBD5E1;border-radius:2px;outline:none;}input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;border-radius:50%;background:#0C1E3C;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.2);}select{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2364748b' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;background-color:white;}@keyframes fadeUp{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}.fu{animation:fadeUp 0.35s ease both;}a{text-decoration:none;color:inherit;}button{cursor:pointer;}`;

const SCOT_BANDS=[{from:0,to:12570,rate:0},{from:12570,to:16537,rate:0.19},{from:16537,to:29526,rate:0.20},{from:29526,to:43662,rate:0.21},{from:43662,to:75000,rate:0.42},{from:75000,to:125140,rate:0.45},{from:125140,to:Infinity,rate:0.48}];
const UK_BANDS=[{from:0,to:12570,rate:0},{from:12570,to:50270,rate:0.20},{from:50270,to:125140,rate:0.40},{from:125140,to:Infinity,rate:0.45}];

function calcTax(gross,pension,scotland){
  const ti=Math.max(0,gross-pension);let pa=12570;if(ti>100000)pa=Math.max(0,12570-(ti-100000)/2);
  const taxable=Math.max(0,ti-pa),bands=scotland?SCOT_BANDS:UK_BANDS;
  let tax=0,rem=taxable;
  for(const b of bands){if(rem<=0||b.rate===0)continue;const start=Math.max(0,b.from-pa);const end=b.to===Infinity?Infinity:Math.max(0,b.to-pa);const w=end===Infinity?rem:Math.min(rem,end-start);if(w>0){tax+=w*b.rate;rem-=w;}}
  return Math.max(0,tax);
}
function calcNI(g){if(g<=12570)return 0;if(g<=50270)return(g-12570)*0.08;return(50270-12570)*0.08+(g-50270)*0.02;}
function calcLoan(g,p){const t={plan1:24990,plan2:27295,plan4:31395,plan5:25000};if(!p||p==='none'||!t[p]||g<=t[p])return 0;return(g-t[p])*0.09;}
function calc(gross,pPct,sl,scot){const p=gross*(pPct/100),it=calcTax(gross,p,scot),ni=calcNI(gross),loan=calcLoan(gross,sl),th=gross-it-ni-loan-p;return{gross,incomeTax:it,ni,studentLoan:loan,pension:p,takeHome:th,monthly:{gross:gross/12,takeHome:th/12},weekly:{gross:gross/52,takeHome:th/52},effectiveRate:gross>0?((it+ni)/gross)*100:0};}

const fmt=n=>'\u00A3'+Math.abs(n||0).toLocaleString('en-GB',{maximumFractionDigits:0});
const fmtD=n=>'\u00A3'+(n||0).toLocaleString('en-GB',{minimumFractionDigits:2,maximumFractionDigits:2});
const fmtK=n=>n>=1000?'\u00A3'+(n/1000).toFixed(0)+'k':fmt(n);

function Nav(){const[open,setOpen]=useState(false);const mob=useW()<640;const links=[['/',   'Salary Calculator'],['/ir35','IR35'],['/nhs','NHS Bands'],['/tools','All Tools'],['/blog','Tax Guides']];
return(<nav style={{background:C.navy,position:'sticky',top:0,zIndex:100,boxShadow:'0 2px 16px rgba(0,0,0,0.25)'}}><div style={{maxWidth:1100,margin:'0 auto',padding:'0 20px',height:56,display:'flex',alignItems:'center',justifyContent:'space-between'}}><Link href="/" style={{display:'flex',alignItems:'center',gap:9}}><div style={{width:30,height:30,background:'linear-gradient(135deg,#0D9488,#14B8A6)',borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><span style={{color:'white',fontWeight:700,fontSize:12,fontFamily:'JetBrains Mono'}}>Tx</span></div><span style={{color:'white',fontFamily:'DM Serif Display',fontSize:17}}>Taxd<span style={{color:'#14B8A6'}}>Calc</span></span></Link>{mob?(<button onClick={()=>setOpen(!open)} style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:7,padding:'8px 10px',display:'flex',flexDirection:'column',gap:4}}>{[0,1,2].map(i=><span key={i} style={{display:'block',width:18,height:2,background:'white',borderRadius:1,transition:'all 0.2s',transform:open&&i===0?'rotate(45deg) translate(4px,4px)':open&&i===2?'rotate(-45deg) translate(4px,-4px)':'none',opacity:open&&i===1?0:1}}/>)}</button>):(<div style={{display:'flex',gap:2,alignItems:'center'}}>{links.map(([href,label])=>(<Link key={href} href={href} style={{padding:'7px 13px',borderRadius:6,background:'transparent',color:'rgba(255,255,255,0.6)',fontSize:13,fontFamily:'Source Serif 4'}}>{label}</Link>))}<span style={{fontSize:11,color:'#14B8A6',fontFamily:'JetBrains Mono',background:'rgba(13,148,136,0.15)',padding:'3px 9px',borderRadius:4,border:'1px solid rgba(20,184,166,0.3)',marginLeft:8}}>2026-27</span></div>)}</div>{mob&&open&&(<div style={{background:'#162d52',borderTop:'1px solid rgba(255,255,255,0.08)',padding:'6px 0 12px'}}>{links.map(([href,label])=>(<Link key={href} href={href} onClick={()=>setOpen(false)} style={{display:'block',padding:'12px 24px',color:'rgba(255,255,255,0.65)',fontSize:14,fontFamily:'Source Serif 4'}}>{label}</Link>))}</div>)}</nav>);}
function Footer(){return(<footer style={{background:'#070D1C',padding:'24px 20px',borderTop:'1px solid rgba(255,255,255,0.05)',marginTop:48}}><div style={{maxWidth:1100,margin:'0 auto',display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:14,alignItems:'center'}}><Link href="/" style={{display:'flex',alignItems:'center',gap:8}}><div style={{width:26,height:26,background:'linear-gradient(135deg,#0D9488,#14B8A6)',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{color:'white',fontWeight:700,fontSize:11,fontFamily:'JetBrains Mono'}}>Tx</span></div><span style={{color:'white',fontFamily:'DM Serif Display',fontSize:15}}>Taxd<span style={{color:'#14B8A6'}}>Calc</span></span></Link><span style={{fontSize:11,color:'rgba(255,255,255,0.2)',fontFamily:'JetBrains Mono'}}>Updated April 2026 - 2026-27</span><span style={{fontSize:11,color:'rgba(255,255,255,0.18)',maxWidth:280,lineHeight:1.6}}>For guidance only. Always consult HMRC or a qualified adviser.</span></div></footer>);}

export default function SalaryPage() {
  const params = useParams();
  const slug = params.salary;
  const mob = useW() < 768;

  // Resolve salary from slug
  const special = SPECIAL[slug];
  const salaryFromSlug = special ? special.salary : slugToSalary(slug);
  if (!salaryFromSlug && !special) {
    // Render 404-like state
    return (
      <>
        <style>{GS}</style>
        <Nav/>
        <div style={{maxWidth:680,margin:'60px auto',padding:'0 24px',textAlign:'center'}}>
          <h1 style={{fontFamily:'DM Serif Display',fontSize:32,color:C.navy,marginBottom:16}}>Page not found</h1>
          <Link href="/" style={{color:C.teal}}>Open salary calculator</Link>
        </div>
        <Footer/>
      </>
    );
  }

  const baseSalary = salaryFromSlug;
  const label = special ? special.label : fmt(baseSalary);
  const specialDesc = special ? special.desc : null;

  const [pension, setPension] = useState(5);
  const [loan, setLoan] = useState('none');
  const [scotland, setScotland] = useState(false);

  const r = calc(baseSalary, pension, loan, scotland);
  const items = [{label:'Income Tax',value:r.incomeTax,color:C.red},{label:'Nat. Insurance',value:r.ni,color:'#F59E0B'},{label:'Student Loan',value:r.studentLoan,color:'#6366F1'},{label:'Pension',value:r.pension,color:'#14B8A6'}];

  // SEO content - contextual paragraph
  const seoContent = () => {
    const th = fmt(Math.round(r.takeHome / 100) * 100);
    const thM = fmtD(r.monthly.takeHome);
    const thW = fmtD(r.weekly.takeHome);
    const it = fmt(r.incomeTax);
    const ni = fmt(r.ni);
    const eff = r.effectiveRate.toFixed(1);
    return `If you earn ${label === fmt(baseSalary) ? fmt(baseSalary) : label + ' (' + fmt(baseSalary) + '/year)'} in the UK for the 2026-27 tax year, your take-home pay is approximately ${th} per year, or ${thM} per month and ${thW} per week. You pay ${it} in income tax and ${ni} in National Insurance contributions, giving an effective tax rate of ${eff}%. These figures assume the standard 1257L tax code, no student loan, and a ${pension}% pension contribution. Use the options below to adjust for your actual pension, student loan plan, and whether you pay Scottish income tax rates.`;
  };

  // Related salary pages
  const related = VALID_SALARIES.filter(s => s !== baseSalary).slice(0, 8).map(s => ({
    salary: s, slug: s + '-salary-take-home', th: calc(s, 5, 'none', false).takeHome
  }));

  return (
    <>
      <style>{GS}</style>
      <Nav/>
      <div style={{background:'linear-gradient(135deg,#0C1E3C,#1e3d6e)',padding:mob?'34px 20px 60px':'42px 24px 70px',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:-50,right:-50,width:200,height:200,borderRadius:'50%',background:'rgba(13,148,136,0.07)',pointerEvents:'none'}}/>
        <div style={{maxWidth:780,margin:'0 auto'}}>
          <div style={{display:'inline-block',background:'rgba(13,148,136,0.15)',border:'1px solid rgba(20,184,166,0.3)',borderRadius:20,padding:'4px 13px',fontSize:11,color:'#14B8A6',marginBottom:12,fontFamily:'JetBrains Mono'}}>UK Take-Home Pay 2026-27</div>
          <h1 style={{fontFamily:'DM Serif Display',fontSize:mob?24:38,color:'white',lineHeight:1.2,marginBottom:8}}>
            {special ? special.label + ' Take-Home Pay' : fmt(baseSalary) + ' Salary'} After Tax<br/>
            <em style={{color:'#14B8A6'}}>2026-27 UK Tax Year</em>
          </h1>
          {specialDesc && <div style={{fontSize:12,color:'rgba(255,255,255,0.45)',fontFamily:'JetBrains Mono',marginBottom:10}}>{specialDesc}</div>}
          <p style={{color:'rgba(255,255,255,0.55)',fontSize:mob?13:15,lineHeight:1.65,maxWidth:560}}>
            Exact take-home pay breakdown after income tax, National Insurance, pension and student loan. Updated for 2026-27 HMRC thresholds.
          </p>
        </div>
      </div>

      <div style={{maxWidth:1000,margin:mob?'-28px 0 0':'-34px auto 0',padding:mob?'0 16px 48px':'0 24px 56px'}}>
        {/* SEO answer box */}
        <div style={{background:C.tealBg,border:'1.5px solid '+C.tealBorder,borderRadius:14,padding:'18px 22px',marginBottom:20}} className="fu">
          <div style={{fontSize:11,color:C.teal,fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:8,fontFamily:'JetBrains Mono'}}>Quick Answer — 2026-27</div>
          <p style={{fontSize:14,color:'#0f766e',lineHeight:1.75}}>{seoContent()}</p>
        </div>

        <div style={{display:'grid',gridTemplateColumns:mob?'1fr':'minmax(260px,340px) 1fr',gap:20,alignItems:'start'}}>
          {/* Adjust panel */}
          <div style={{background:'white',borderRadius:14,padding:mob?18:24,boxShadow:C.shadow,border:'1px solid '+C.border}} className="fu">
            <h2 style={{fontFamily:'DM Serif Display',fontSize:17,color:C.navy,marginBottom:16}}>Adjust Your Figures</h2>
            <div style={{padding:'10px 14px',background:C.bg,borderRadius:8,border:'1px solid '+C.border,marginBottom:16}}>
              <div style={{fontSize:11,color:C.slate,marginBottom:2}}>Base salary</div>
              <div style={{fontFamily:'JetBrains Mono',fontSize:18,fontWeight:700,color:C.navy}}>{fmt(baseSalary)}</div>
            </div>
            {/* Pension */}
            <div style={{marginBottom:20}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
                <label style={{fontSize:13,fontWeight:600,color:C.navy}}>Pension Contribution</label>
                <span style={{fontFamily:'JetBrains Mono',fontSize:13,color:C.teal,fontWeight:600}}>{pension}%</span>
              </div>
              <input type="range" min={0} max={20} step={0.5} value={pension} onChange={e=>setPension(Number(e.target.value))}/>
            </div>
            {/* Student loan */}
            <div style={{marginBottom:16}}>
              <label style={{display:'block',fontSize:13,fontWeight:600,color:C.navy,marginBottom:7}}>Student Loan Plan</label>
              <select value={loan} onChange={e=>setLoan(e.target.value)} style={{width:'100%',padding:'11px 40px 11px 13px',border:'1.5px solid '+C.borderDark,borderRadius:7,fontSize:13,color:C.navy,outline:'none'}}>
                <option value="none">No student loan</option>
                <option value="plan1">Plan 1 (£24,990)</option>
                <option value="plan2">Plan 2 (£27,295)</option>
                <option value="plan4">Plan 4 Scotland (£31,395)</option>
                <option value="plan5">Plan 5 (£25,000)</option>
              </select>
            </div>
            {/* Scotland */}
            <div style={{padding:'11px 13px',background:scotland?C.scotBg:C.bg,border:'1.5px solid '+(scotland?C.scotBorder:C.borderDark),borderRadius:8,display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
              <div>
                <div style={{fontSize:13,fontWeight:600,color:scotland?C.scot:C.navy}}>Based in Scotland?</div>
                <div style={{fontSize:11,color:C.slate,marginTop:1}}>Different income tax rates</div>
              </div>
              <button onClick={()=>setScotland(!scotland)} style={{width:42,height:23,borderRadius:12,border:'none',background:scotland?C.scot:C.borderDark,position:'relative',transition:'background 0.2s',flexShrink:0}}>
                <span style={{position:'absolute',top:2,left:scotland?22:2,width:19,height:19,borderRadius:'50%',background:'white',boxShadow:'0 1px 4px rgba(0,0,0,0.22)',transition:'left 0.2s'}}/>
              </button>
            </div>
          </div>

          {/* Results */}
          <div style={{display:'flex',flexDirection:'column',gap:14}} className="fu">
            <div style={{background:'linear-gradient(135deg,#0C1E3C,#1e3d6e)',borderRadius:14,padding:mob?20:26,boxShadow:'0 4px 24px rgba(12,30,60,0.3)',position:'relative',overflow:'hidden'}}>
              <div style={{position:'absolute',top:-18,right:-18,width:110,height:110,borderRadius:'50%',background:'rgba(13,148,136,0.12)',pointerEvents:'none'}}/>
              <div style={{fontSize:10,color:'rgba(255,255,255,0.4)',letterSpacing:'0.12em',textTransform:'uppercase',fontFamily:'JetBrains Mono',marginBottom:6}}>Annual Take-Home Pay</div>
              <div style={{fontFamily:'DM Serif Display',fontSize:mob?38:52,color:'white',lineHeight:1}}>{fmt(r.takeHome)}</div>
              <div style={{fontSize:13,color:'rgba(255,255,255,0.45)',fontFamily:'JetBrains Mono',marginTop:5}}>{fmtD(r.monthly.takeHome)} per month · {fmtD(r.weekly.takeHome)} per week</div>
              <div style={{marginTop:14,display:'flex',alignItems:'center',gap:10}}>
                <div style={{flex:1,height:4,background:'rgba(255,255,255,0.08)',borderRadius:2,overflow:'hidden'}}>
                  <div style={{width:((r.takeHome/r.gross)*100)+'%',height:'100%',background:'linear-gradient(90deg,#0D9488,#14B8A6)',borderRadius:2,transition:'width 0.5s'}}/>
                </div>
                <span style={{fontSize:12,color:'#14B8A6',fontFamily:'JetBrains Mono',fontWeight:600,flexShrink:0}}>{((r.takeHome/r.gross)*100).toFixed(1)}% kept</span>
              </div>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:12}}>
              {[['Annual Gross',fmt(r.gross)],['Annual Net',fmt(r.takeHome)],['Monthly Gross',fmtD(r.monthly.gross)],['Monthly Net',fmtD(r.monthly.takeHome)]].map(([l,v])=>(
                <div key={l} style={{background:'white',border:'1px solid '+C.border,borderRadius:10,padding:'13px 15px',boxShadow:C.shadow}}>
                  <div style={{fontSize:10,color:C.slate,letterSpacing:'0.07em',textTransform:'uppercase',fontWeight:600,marginBottom:4,fontFamily:'JetBrains Mono'}}>{l}</div>
                  <div style={{fontFamily:'DM Serif Display',fontSize:mob?18:22,color:C.navy,lineHeight:1}}>{v}</div>
                </div>
              ))}
            </div>

            <div style={{background:'white',borderRadius:12,padding:mob?16:22,border:'1px solid '+C.border,boxShadow:C.shadow}}>
              <h3 style={{fontFamily:'DM Serif Display',fontSize:16,color:C.navy,marginBottom:14}}>Full Deduction Breakdown</h3>
              <div style={{height:8,borderRadius:4,overflow:'hidden',display:'flex',background:C.border,marginBottom:16}}>
                {items.filter(it=>it.value>0).map(it=><div key={it.label} className="bfill" style={{width:((it.value/r.gross)*100)+'%',background:it.color,height:'100%'}}/>)}
                <div style={{flex:1,background:C.teal}}/>
              </div>
              {[...items.filter(it=>it.value>0).map(it=>({...it,neg:true})),{label:'Take-home',value:r.takeHome,color:C.teal}].map(it=>(
                <div key={it.label} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'9px 0',borderBottom:it.neg?'1px solid '+C.border:'none'}}>
                  <div style={{display:'flex',alignItems:'center',gap:9}}>
                    <div style={{width:8,height:8,borderRadius:2,background:it.color,flexShrink:0}}/>
                    <span style={{fontSize:13,color:it.neg?C.textMid:C.text,fontWeight:it.neg?400:700}}>{it.label}</span>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontFamily:'JetBrains Mono',fontSize:13,color:it.neg?C.red:C.teal,fontWeight:it.neg?400:700}}>{it.neg?'-':'+' }{fmt(it.value)}</div>
                    <div style={{fontFamily:'JetBrains Mono',fontSize:10,color:C.slateLight}}>{fmtD(it.value/12)}/mo</div>
                  </div>
                </div>
              ))}
              <div style={{marginTop:10,paddingTop:8,borderTop:'1px solid '+C.border,display:'flex',justifyContent:'space-between',fontSize:12,color:C.slate}}>
                <span>Effective tax rate (income tax + NI)</span>
                <span style={{fontFamily:'JetBrains Mono',fontWeight:600}}>{r.effectiveRate.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Context section - SEO content */}
        <div style={{marginTop:24,background:'white',borderRadius:12,padding:mob?18:28,border:'1px solid '+C.border,boxShadow:C.shadow}}>
          <h2 style={{fontFamily:'DM Serif Display',fontSize:mob?18:22,color:C.navy,marginBottom:14}}>
            {special ? special.label : fmt(baseSalary)} Take-Home Pay — Detailed Guide (2026-27)
          </h2>
          <p style={{fontSize:14,color:C.textMid,lineHeight:1.8,marginBottom:14}}>
            On a {special ? special.label.toLowerCase() + ' salary of ' + fmt(baseSalary) : fmt(baseSalary) + ' annual salary'}, your take-home pay for the 2026-27 UK tax year is <strong style={{color:C.teal}}>{fmt(r.takeHome)}</strong> per year (<strong style={{color:C.teal}}>{fmtD(r.monthly.takeHome)}</strong> per month).
          </p>
          <p style={{fontSize:14,color:C.textMid,lineHeight:1.8,marginBottom:14}}>
            You will pay <strong>{fmt(r.incomeTax)}</strong> in income tax and <strong>{fmt(r.ni)}</strong> in National Insurance contributions. Combined, these deductions represent an effective tax rate of <strong>{r.effectiveRate.toFixed(1)}%</strong> on your gross salary — meaning you keep <strong>{((r.takeHome/r.gross)*100).toFixed(1)}%</strong> of what you earn.
          </p>
          <h3 style={{fontFamily:'DM Serif Display',fontSize:16,color:C.navy,margin:'18px 0 10px'}}>How is income tax calculated on {fmt(baseSalary)}?</h3>
          <p style={{fontSize:14,color:C.textMid,lineHeight:1.8,marginBottom:14}}>
            Income tax in the UK uses marginal rates. Your first £12,570 is tax-free (the personal allowance). The portion of your salary between £12,571 and £50,270 is taxed at 20%. {baseSalary > 50270 ? 'The portion above £50,270 is taxed at 40% (higher rate).' : ''} This means only the portion above each threshold is taxed at the higher rate — not your entire salary.
          </p>
          <h3 style={{fontFamily:'DM Serif Display',fontSize:16,color:C.navy,margin:'18px 0 10px'}}>How to increase your take-home pay on {fmt(baseSalary)}</h3>
          <p style={{fontSize:14,color:C.textMid,lineHeight:1.8}}>
            The most effective way to increase take-home pay is through salary sacrifice pension contributions. By contributing to your pension before tax, you reduce your taxable income and save both income tax and National Insurance. Use the pension slider above to see the real cost of increasing your contributions. You can also check your tax code — many people are on the wrong code and overpay tax as a result.
          </p>
        </div>

        {/* Related salary pages */}
        <div style={{marginTop:24}}>
          <h2 style={{fontFamily:'DM Serif Display',fontSize:mob?18:22,color:C.navy,marginBottom:14}}>Other Salary Take-Home Calculations</h2>
          <div style={{display:'grid',gridTemplateColumns:mob?'repeat(2,1fr)':'repeat(auto-fill,minmax(160px,1fr))',gap:10}}>
            {related.map(s=>(
              <Link key={s.slug} href={'/'+s.slug} style={{background:'white',border:'1px solid '+C.border,borderRadius:9,padding:'12px 14px',display:'block',transition:'border-color 0.2s'}}
                onMouseEnter={e=>e.currentTarget.style.borderColor=C.teal}
                onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                <div style={{fontFamily:'JetBrains Mono',fontSize:13,fontWeight:700,color:C.navy,marginBottom:3}}>{fmt(s.salary)}</div>
                <div style={{fontSize:11,color:C.teal,fontFamily:'JetBrains Mono'}}>{fmt(s.th)}/yr</div>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA to main calc */}
        <div style={{marginTop:20,background:'linear-gradient(135deg,#0C1E3C,#1e3d6e)',borderRadius:12,padding:'18px 22px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
          <div>
            <div style={{fontFamily:'DM Serif Display',fontSize:16,color:'white',marginBottom:3}}>Need a different salary?</div>
            <div style={{fontSize:12,color:'rgba(255,255,255,0.45)'}}>Enter any salary in the full calculator</div>
          </div>
          <Link href="/" style={{background:C.teal,color:'white',padding:'10px 20px',borderRadius:8,fontSize:13,fontWeight:700,display:'inline-block'}}>Open Salary Calculator</Link>
        </div>
      </div>
      <Footer/>
    </>
  );
}
