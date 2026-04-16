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
];

const CATEGORIES = ['All','Salary Guide','NHS Pay','Contractor Tax','Tax Basics','Tax Planning','Tax Year Updates'];

function Nav(){const[open,setOpen]=useState(false);const mob=useW()<640;const links=[['/',   'Salary Calculator'],['/ir35','IR35'],['/nhs','NHS Bands'],['/tools','All Tools'],['/blog','Tax Guides']];return(<nav style={{background:'#0C1E3C',position:'sticky',top:0,zIndex:100,boxShadow:'0 2px 16px rgba(0,0,0,0.25)'}}><div style={{maxWidth:1100,margin:'0 auto',padding:'0 20px',height:56,display:'flex',alignItems:'center',justifyContent:'space-between'}}><Link href="/" style={{display:'flex',alignItems:'center',gap:9}}><div style={{width:30,height:30,background:'linear-gradient(135deg,#0D9488,#14B8A6)',borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><span style={{color:'white',fontWeight:700,fontSize:12,fontFamily:'JetBrains Mono'}}>Tx</span></div><span style={{color:'white',fontFamily:'DM Serif Display',fontSize:17}}>Taxd<span style={{color:'#14B8A6'}}>Calc</span></span></Link>{mob?(<button onClick={()=>setOpen(!open)} style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:7,padding:'8px 10px',display:'flex',flexDirection:'column',gap:4}}>{[0,1,2].map(i=><span key={i} style={{display:'block',width:18,height:2,background:'white',borderRadius:1,transition:'all 0.2s',transform:open&&i===0?'rotate(45deg) translate(4px,4px)':open&&i===2?'rotate(-45deg) translate(4px,-4px)':'none',opacity:open&&i===1?0:1}}/>)}</button>):(<div style={{display:'flex',gap:2,alignItems:'center'}}>{links.map(([href,label])=>(<Link key={href} href={href} style={{padding:'7px 13px',borderRadius:6,background:href==='/blog'?'rgba(13,148,136,0.2)':'transparent',color:href==='/blog'?'#14B8A6':'rgba(255,255,255,0.6)',fontSize:13,fontFamily:'Source Serif 4',fontWeight:href==='/blog'?600:400}}>{label}</Link>))}<span style={{fontSize:11,color:'#14B8A6',fontFamily:'JetBrains Mono',background:'rgba(13,148,136,0.15)',padding:'3px 9px',borderRadius:4,border:'1px solid rgba(20,184,166,0.3)',marginLeft:8}}>2026-27</span></div>)}</div>{mob&&open&&(<div style={{background:'#162d52',borderTop:'1px solid rgba(255,255,255,0.08)',padding:'6px 0 12px'}}>{links.map(([href,label])=>(<Link key={href} href={href} onClick={()=>setOpen(false)} style={{display:'block',padding:'12px 24px',background:href==='/blog'?'rgba(13,148,136,0.15)':'transparent',color:href==='/blog'?'#14B8A6':'rgba(255,255,255,0.65)',fontSize:14,fontFamily:'Source Serif 4',fontWeight:href==='/blog'?600:400}}>{label}</Link>))}</div>)}</nav>);}
function Footer(){return(<footer style={{background:'#070D1C',padding:'24px 20px',borderTop:'1px solid rgba(255,255,255,0.05)',marginTop:48}}><div style={{maxWidth:1100,margin:'0 auto',display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:14,alignItems:'center'}}><Link href="/" style={{display:'flex',alignItems:'center',gap:8}}><div style={{width:26,height:26,background:'linear-gradient(135deg,#0D9488,#14B8A6)',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{color:'white',fontWeight:700,fontSize:11,fontFamily:'JetBrains Mono'}}>Tx</span></div><span style={{color:'white',fontFamily:'DM Serif Display',fontSize:15}}>Taxd<span style={{color:'#14B8A6'}}>Calc</span></span></Link><span style={{fontSize:11,color:'rgba(255,255,255,0.2)',fontFamily:'JetBrains Mono'}}>Updated April 2026</span><span style={{fontSize:11,color:'rgba(255,255,255,0.18)',maxWidth:280,lineHeight:1.6}}>For guidance only. Consult HMRC or a qualified adviser.</span></div></footer>);}

export default function BlogPage() {
  const mob = useW() < 640;
  const [cat, setCat] = useState('All');
  const filtered = cat === 'All' ? ARTICLES : ARTICLES.filter(a => a.category === cat);

  return (
    <>
      <style>{GS}</style>
      <Nav/>
      <div style={{background:'linear-gradient(135deg,#0C1E3C,#1e3d6e)',padding:mob?'36px 20px 56px':'44px 24px 64px',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:-40,right:-30,width:200,height:200,borderRadius:'50%',background:'rgba(13,148,136,0.08)',pointerEvents:'none'}}/>
        <div style={{display:'inline-block',background:'rgba(13,148,136,0.15)',border:'1px solid rgba(20,184,166,0.3)',borderRadius:20,padding:'4px 13px',fontSize:11,color:'#14B8A6',marginBottom:14,fontFamily:'JetBrains Mono'}}>Tax Guides</div>
        <h1 style={{fontFamily:'DM Serif Display',fontSize:mob?28:44,color:'white',marginBottom:8}}>UK Tax Guides 2026-27</h1>
        <p style={{color:'rgba(255,255,255,0.45)',fontSize:14,maxWidth:420,margin:'0 auto'}}>Plain-English guides to take-home pay, income tax, NI, pensions and your payslip. All figures confirmed for 2026-27.</p>
      </div>

      <div style={{maxWidth:920,margin:mob?'-22px 0 0':'-26px auto 0',padding:mob?'0 16px 48px':'0 24px 56px'}}>
        {/* Category filter */}
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
