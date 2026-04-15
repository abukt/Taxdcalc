'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

function useW(){const[w,setW]=useState(typeof window!=='undefined'?window.innerWidth:800);useEffect(()=>{const f=()=>setW(window.innerWidth);window.addEventListener('resize',f);return()=>window.removeEventListener('resize',f);},[]);return w;}
const C={navy:'#0C1E3C',navyLight:'#162d52',teal:'#0D9488',tealLight:'#14B8A6',tealBg:'#F0FDFA',tealBorder:'#99F6E4',border:'#E2E8F0',white:'#FFFFFF',text:'#1E293B',textMid:'#475569',slate:'#64748B',slateLight:'#94A3B8',shadow:'0 1px 3px rgba(0,0,0,0.07),0 4px 16px rgba(0,0,0,0.04)'};
const GS='@import url(\'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Source+Serif+4:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap\');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}body{background:#F8F9FA;color:#1E293B;font-family:\'Source Serif 4\',Georgia,serif;}a{text-decoration:none;color:inherit;}button{cursor:pointer;}@keyframes fadeUp{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}.fu{animation:fadeUp 0.4s ease both;}';

const ARTICLES = [
  {
    slug:'how-uk-income-tax-brackets-work',
    title:'How UK Income Tax Brackets Work (2026-27)',
    desc:'Understand UK income tax in plain English. Learn how marginal rates work and why a pay rise never means less take-home pay.',
    category:'Tax Basics',date:'6 April 2026',readTime:'5 min',
    relatedCalc:{label:'Open Salary Calculator',href:'/'},
    faqs:[{q:'What tax bracket am I in?',a:'Under 50,270 is basic rate (20%). Between 50,271 and 125,140 is higher rate (40%). Above 125,140 is additional rate (45%). Scotland has different thresholds.'},{q:'Does a pay rise always mean more take-home pay?',a:'Yes, always. The UK uses marginal rates, so only the new income is taxed at the higher rate. The rest stays taxed at the same rates as before.'}],
    sections:[
      {h:'What is the UK income tax system?',p:'UK income tax uses a marginal rate system. Different portions of your income are taxed at different rates. You never pay the higher rate on your entire income, only on the portion that falls above each threshold.'},
      {h:'2026-27 UK income tax bands',table:{headers:['Band','Income Range','Rate'],rows:[['Personal Allowance','Up to 12,570','0%'],['Basic Rate','12,571 to 50,270','20%'],['Higher Rate','50,271 to 125,140','40%'],['Additional Rate','Over 125,140','45%']]}},
      {h:'Scotland has different income tax rates',p:'If you live in Scotland you pay Scottish Income Tax rates set by the Scottish Parliament. For 2026-27 there are 6 bands instead of 3. The Starter and Basic thresholds rose 7.4% this year, meaning Scottish taxpayers on lower incomes pay slightly less than equivalent earners in England.'},
      {h:'Scottish Income Tax Bands 2026-27',table:{headers:['Band','Income Range','Rate'],rows:[['Starter','12,571 to 16,537','19%'],['Basic','16,538 to 29,526','20%'],['Intermediate','29,527 to 43,662','21%'],['Higher','43,663 to 75,000','42%'],['Advanced','75,001 to 125,140','45%'],['Top','Over 125,140','48%']]}},
      {h:'Why a pay rise always increases take-home pay',p:'If you earn 55,000: the first 12,570 is tax-free, the next 37,700 is taxed at 20%, and only the 4,730 above 50,270 is taxed at 40%. Your effective rate is 17.1%, not 40%. A pay rise that pushes you over a band boundary only taxes the new income at the higher rate.'},
      {h:'The freeze until 2031',p:'UK income tax thresholds have been frozen since 2021-22 and will remain frozen until 2031-32. As wages rise with inflation, more income is pulled into higher tax bands each year. This is sometimes called fiscal drag or a stealth tax.'},
    ],
  },
  {
    slug:'national-insurance-explained',
    title:'National Insurance Explained: What You Pay and Why (2026-27)',
    desc:'Class 1 NI rates, 2026-27 thresholds, and how NI differs from income tax on your payslip.',
    category:'Tax Basics',date:'6 April 2026',readTime:'5 min',
    relatedCalc:{label:'Open Salary Calculator',href:'/'},
    faqs:[{q:'Do I pay NI if I earn under 12,570?',a:'No. Below the Primary Threshold of 12,570 you pay no employee National Insurance.'},{q:'Do Scottish residents pay different NI?',a:'No. National Insurance is the same across the whole of the UK. Only income tax differs in Scotland.'}],
    sections:[
      {h:'What is National Insurance?',p:'National Insurance is a separate tax from income tax. It funds the NHS, State Pension, and other benefits. As an employee you pay Class 1 contributions automatically through PAYE alongside income tax.'},
      {h:'Employee NI Rates 2026-27',table:{headers:['Earnings','Rate'],rows:[['Up to 12,570','0%'],['12,571 to 50,270','8%'],['Over 50,270','2%']]}},
      {h:'How NI differs from income tax',p:'Income tax and NI are calculated separately with different thresholds and rates. NI does not apply to pension income, investment income, or rental income. NI rates are lower than income tax rates for most earners. The NI rate drops to 2% above 50,270, unlike income tax which keeps increasing.'},
      {h:'Employer NI: the hidden cost',p:'Your employer also pays NI at 15% on your salary above 5,000 per year. For someone earning 40,000 that is an extra 5,250 on top of your salary. This is one reason salary sacrifice pension contributions benefit both employees and employers.'},
      {h:'What NI pays for',p:'Your NI contributions count towards your State Pension entitlement (you need 35 qualifying years for the full new State Pension), Statutory Maternity, Paternity, and Sick Pay, Jobseekers Allowance, and NHS services.'},
    ],
  },
  {
    slug:'pension-tax-relief-your-free-money',
    title:'Pension Tax Relief: How to Get Free Money From HMRC (2026-27)',
    desc:'How salary sacrifice saves both income tax and NI, and how to make the most of the annual allowance.',
    category:'Tax Planning',date:'6 April 2026',readTime:'6 min',
    relatedCalc:{label:'Try Salary Sacrifice Calculator',href:'/sacrifice'},
    faqs:[{q:'Does salary sacrifice work differently in Scotland?',a:'Same mechanism, but Scottish taxpayers on the 42% Higher band save significantly more per pound contributed than equivalent earners in England.'},{q:'What is the annual allowance?',a:'You can contribute up to 60,000 per year including employer contributions and receive full tax relief. Exceeding this results in a tax charge.'}],
    sections:[
      {h:'What is pension tax relief?',p:'When you contribute to a pension, HMRC adds back the income tax you would have paid on that money. A basic rate taxpayer contributing 80 gets 100 in their pension. A higher rate taxpayer contributing 60 gets 100. This is free money from the government.'},
      {h:'Tax relief rates by income band',table:{headers:['Tax Rate','Real Cost Per 100 in Pension'],rows:[['Basic rate 20%','80'],['Higher rate 40%','60'],['Scottish Higher 42%','58'],['Additional/Advanced 45%','55'],['Scottish Top 48%','52']]}},
      {h:'Salary sacrifice vs personal pension',p:'Salary sacrifice reduces your gross salary before tax AND National Insurance are calculated. This saves both. A 2,500 salary sacrifice saves 500 in income tax PLUS around 200 in NI for a basic rate taxpayer. Real cost: 1,800. A personal pension contribution only recovers income tax.'},
      {h:'The 100,000 trap',p:'Between 100,000 and 125,140 your Personal Allowance is gradually withdrawn, creating an effective 60% marginal tax rate. A pension contribution that brings your income below 100,000 restores your full Personal Allowance. This can save over 2,000 in a single year.'},
      {h:'Annual allowance 2026-27',p:'You can contribute up to 60,000 per year to your pension including employer contributions and receive full tax relief. This is called the annual allowance. Most people are nowhere near this limit. If you earn less than 60,000 the limit is your total earnings for the year.'},
    ],
  },
  {
    slug:'2026-27-tax-year-changes-uk',
    title:'2026-27 Tax Year: Everything That Changed in April 2026',
    desc:'Thresholds frozen to 2031, NLW rises to 12.71/hr, employer NI at 15%, dividend rates increase. Complete guide.',
    category:'Tax Year Updates',date:'6 April 2026',readTime:'5 min',
    relatedCalc:{label:'Check Your 2026-27 Take-Home Pay',href:'/'},
    faqs:[{q:'When do UK thresholds unfreeze?',a:'The freeze runs to April 2031. No earlier unfreeze has been confirmed by the government.'},{q:'Did Scotland change all its tax rates?',a:'No. Only the Starter and Basic thresholds rose by 7.4%. All rates and higher band thresholds were unchanged for 2026-27.'}],
    sections:[
      {h:'UK income tax thresholds: still frozen',table:{headers:['Threshold','2026-27 Amount','Frozen Until'],rows:[['Personal Allowance','12,570','April 2031'],['Basic Rate limit','50,270','April 2031'],['Higher Rate limit','125,140','April 2031']]}},
      {h:'Scotland: Starter and Basic thresholds rose 7.4%',table:{headers:['Scottish Band','2025-26','2026-27'],rows:[['Starter Rate ends','15,397','16,537'],['Basic Rate ends','27,491','29,526'],['Intermediate and above','unchanged','unchanged']]}},
      {h:'National Living Wage increased',table:{headers:['Category','2025-26','2026-27'],rows:[['NLW (aged 21 and over)','11.44/hr','12.71/hr'],['Aged 18 to 20','8.60/hr','10.00/hr'],['Under 18 and Apprentices','6.40/hr','7.55/hr']]}},
      {h:'Dividend tax rates increased from April 2026',table:{headers:['Band','2025-26','2026-27'],rows:[['Basic rate','8.75%','10.75%'],['Higher rate','33.75%','35.75%'],['Additional rate','39.35%','39.35%']]}},
      {h:'What the dividend rate increase means for contractors',p:'The increase in basic rate dividend tax from 8.75% to 10.75% makes Limited Company contractor structures slightly less efficient than in previous years. The dividend allowance remains at 500 per year. Use the IR35 calculator to see your updated 2026-27 outside IR35 take-home.'},
      {h:'Employee and employer NI: no change',p:'Employee NI rates are unchanged at 8% on earnings between 12,570 and 50,270, and 2% above that. The employer NI secondary threshold remains at 5,000 per year at 15%.'},
    ],
  },
];

function Nav(){const[open,setOpen]=useState(false);const mob=useW()<640;const links=[['/',   'Salary Calculator'],['/ir35','IR35'],['/nhs','NHS Bands'],['/tools','All Tools'],['/blog','Tax Guides']];return(<nav style={{background:'#0C1E3C',position:'sticky',top:0,zIndex:100,boxShadow:'0 2px 16px rgba(0,0,0,0.25)'}}><div style={{maxWidth:1100,margin:'0 auto',padding:'0 20px',height:56,display:'flex',alignItems:'center',justifyContent:'space-between'}}><Link href="/" style={{display:'flex',alignItems:'center',gap:9}}><div style={{width:30,height:30,background:'linear-gradient(135deg,#0D9488,#14B8A6)',borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><span style={{color:'white',fontWeight:700,fontSize:12,fontFamily:'JetBrains Mono'}}>Tx</span></div><span style={{color:'white',fontFamily:'DM Serif Display',fontSize:17}}>Taxd<span style={{color:'#14B8A6'}}>Calc</span></span></Link>{mob?(<button onClick={()=>setOpen(!open)} style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:7,padding:'8px 10px',display:'flex',flexDirection:'column',gap:4}}>{[0,1,2].map(i=><span key={i} style={{display:'block',width:18,height:2,background:'white',borderRadius:1,transition:'all 0.2s',transform:open&&i===0?'rotate(45deg) translate(4px,4px)':open&&i===2?'rotate(-45deg) translate(4px,-4px)':'none',opacity:open&&i===1?0:1}}/>)}</button>):(<div style={{display:'flex',gap:2,alignItems:'center'}}>{links.map(([href,label])=>(<Link key={href} href={href} style={{padding:'7px 13px',borderRadius:6,background:href==='/blog'?'rgba(13,148,136,0.2)':'transparent',color:href==='/blog'?'#14B8A6':'rgba(255,255,255,0.6)',fontSize:13,fontFamily:'Source Serif 4',fontWeight:href==='/blog'?600:400}}>{label}</Link>))}<span style={{fontSize:11,color:'#14B8A6',fontFamily:'JetBrains Mono',background:'rgba(13,148,136,0.15)',padding:'3px 9px',borderRadius:4,border:'1px solid rgba(20,184,166,0.3)',marginLeft:8}}>2026-27</span></div>)}</div>{mob&&open&&(<div style={{background:'#162d52',borderTop:'1px solid rgba(255,255,255,0.08)',padding:'6px 0 12px'}}>{links.map(([href,label])=>(<Link key={href} href={href} onClick={()=>setOpen(false)} style={{display:'block',padding:'12px 24px',background:href==='/blog'?'rgba(13,148,136,0.15)':'transparent',color:href==='/blog'?'#14B8A6':'rgba(255,255,255,0.65)',fontSize:14,fontFamily:'Source Serif 4',fontWeight:href==='/blog'?600:400}}>{label}</Link>))}</div>)}</nav>);}
function Footer(){return(<footer style={{background:'#070D1C',padding:'24px 20px',borderTop:'1px solid rgba(255,255,255,0.05)',marginTop:48}}><div style={{maxWidth:1100,margin:'0 auto',display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:14,alignItems:'center'}}><Link href="/" style={{display:'flex',alignItems:'center',gap:8}}><div style={{width:26,height:26,background:'linear-gradient(135deg,#0D9488,#14B8A6)',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{color:'white',fontWeight:700,fontSize:11,fontFamily:'JetBrains Mono'}}>Tx</span></div><span style={{color:'white',fontFamily:'DM Serif Display',fontSize:15}}>Taxd<span style={{color:'#14B8A6'}}>Calc</span></span></Link><span style={{fontSize:11,color:'rgba(255,255,255,0.2)',fontFamily:'JetBrains Mono'}}>Updated April 2026</span><span style={{fontSize:11,color:'rgba(255,255,255,0.18)',maxWidth:280,lineHeight:1.6}}>For guidance only. Consult HMRC or a qualified adviser.</span></div></footer>);}

export default function BlogPost() {
  const params = useParams();
  const mob = useW() < 640;
  const article = ARTICLES.find(a => a.slug === params.slug);
  const others = ARTICLES.filter(a => a.slug !== params.slug).slice(0, 2);

  if (!article) {
    return (
      <>
        <style>{GS}</style>
        <Nav/>
        <div style={{maxWidth:680,margin:'60px auto',padding:'0 24px',textAlign:'center'}}>
          <h1 style={{fontFamily:'DM Serif Display',fontSize:32,color:C.navy,marginBottom:16}}>Article not found</h1>
          <Link href="/blog" style={{color:C.teal,fontSize:15}}>Back to all guides</Link>
        </div>
        <Footer/>
      </>
    );
  }

  return (
    <>
      <style>{GS}</style>
      <Nav/>
      <div style={{background:'linear-gradient(135deg,#0C1E3C,#1e3d6e)',padding:mob?'34px 20px 54px':'42px 24px 62px',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:-40,right:-30,width:200,height:200,borderRadius:'50%',background:'rgba(13,148,136,0.08)',pointerEvents:'none'}}/>
        <div style={{maxWidth:720,margin:'0 auto'}}>
          <Link href="/blog" style={{display:'inline-flex',alignItems:'center',gap:6,fontSize:13,color:'rgba(255,255,255,0.45)',marginBottom:14,fontFamily:'JetBrains Mono'}}>← Back to Tax Guides</Link>
          <div style={{display:'inline-block',background:'rgba(13,148,136,0.15)',border:'1px solid rgba(20,184,166,0.3)',borderRadius:20,padding:'3px 12px',fontSize:11,color:'#14B8A6',marginBottom:12,fontFamily:'JetBrains Mono'}}>{article.category}</div>
          <h1 style={{fontFamily:'DM Serif Display',fontSize:mob?22:36,color:'white',lineHeight:1.2,marginBottom:12}}>{article.title}</h1>
          <div style={{display:'flex',gap:14,flexWrap:'wrap'}}>
            <span style={{fontSize:11,color:'rgba(255,255,255,0.38)',fontFamily:'JetBrains Mono'}}>{article.date}</span>
            <span style={{fontSize:11,color:'rgba(255,255,255,0.38)',fontFamily:'JetBrains Mono'}}>{article.readTime} read</span>
            <span style={{fontSize:11,color:'#14B8A6',fontFamily:'JetBrains Mono'}}>Updated for 2026-27</span>
          </div>
        </div>
      </div>

      <div style={{background:C.tealBg,borderBottom:'1px solid '+C.tealBorder,padding:'13px 24px'}}>
        <div style={{maxWidth:720,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
          <span style={{fontSize:14,color:C.teal,fontWeight:600}}>See how this affects your take-home pay</span>
          <Link href={article.relatedCalc.href} style={{background:C.teal,color:'white',padding:'9px 18px',borderRadius:7,fontWeight:700,fontSize:13,display:'inline-block'}}>{article.relatedCalc.label}</Link>
        </div>
      </div>

      <div style={{maxWidth:720,margin:'0 auto',padding:mob?'24px 16px 48px':'32px 24px 60px'}}>
        <div style={{background:'white',borderRadius:14,padding:mob?'22px 18px':'32px 36px',boxShadow:C.shadow,border:'1px solid '+C.border,marginBottom:20}} className="fu">
          <p style={{fontSize:16,color:C.textMid,lineHeight:1.75,marginBottom:24,fontStyle:'italic',borderLeft:'3px solid '+C.teal,paddingLeft:16}}>{article.desc}</p>
          {article.sections.map((s,i)=>(
            <div key={i}>
              <h2 style={{fontFamily:'DM Serif Display',fontSize:mob?18:22,color:C.navy,margin:'28px 0 10px',lineHeight:1.2}}>{s.h}</h2>
              {s.p&&<p style={{fontSize:15,color:C.textMid,lineHeight:1.8,marginBottom:14}}>{s.p}</p>}
              {s.table&&(
                <div style={{overflowX:'auto',margin:'12px 0',WebkitOverflowScrolling:'touch'}}>
                  <table style={{width:'100%',borderCollapse:'collapse',fontSize:14,minWidth:280}}>
                    <thead><tr>{s.table.headers.map((h,j)=><th key={j} style={{background:C.tealBg,color:C.teal,padding:'10px 14px',textAlign:'left',borderBottom:'2px solid '+C.tealBorder,fontSize:12,fontWeight:700}}>{h}</th>)}</tr></thead>
                    <tbody>{s.table.rows.map((row,ri)=><tr key={ri} style={{background:ri%2===0?C.white:'#F8F9FA',borderBottom:'1px solid '+C.border}}>{row.map((cell,ci)=><td key={ci} style={{padding:'9px 14px',fontSize:13,color:C.text}}>{cell}</td>)}</tr>)}</tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
          {article.faqs&&article.faqs.length>0&&(
            <div style={{marginTop:28}}>
              <h2 style={{fontFamily:'DM Serif Display',fontSize:mob?18:22,color:C.navy,marginBottom:14}}>Frequently Asked Questions</h2>
              {article.faqs.map((faq,i)=>(
                <div key={i} style={{marginBottom:12,padding:'14px 16px',background:'#F8F9FA',borderRadius:8,border:'1px solid '+C.border}}>
                  <p style={{fontSize:14,fontWeight:700,color:C.navy,marginBottom:6}}>{faq.q}</p>
                  <p style={{fontSize:14,color:C.textMid,lineHeight:1.7,margin:0}}>{faq.a}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{background:'linear-gradient(135deg,#0C1E3C,#1e3d6e)',borderRadius:14,padding:mob?20:28,marginBottom:20,textAlign:'center'}}>
          <h2 style={{fontFamily:'DM Serif Display',fontSize:22,color:'white',marginBottom:6}}>Calculate your exact take-home pay</h2>
          <p style={{color:'rgba(255,255,255,0.45)',fontSize:13,marginBottom:16}}>Free, accurate, 2026-27 rates. Scotland and tax code supported.</p>
          <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
            <Link href="/" style={{background:C.teal,color:'white',padding:'11px 22px',borderRadius:8,fontWeight:700,fontSize:13,display:'inline-block'}}>Open Salary Calculator</Link>
            {article.relatedCalc.href!=='/'&&<Link href={article.relatedCalc.href} style={{background:'rgba(255,255,255,0.1)',color:'white',padding:'11px 22px',borderRadius:8,fontWeight:700,fontSize:13,border:'1px solid rgba(255,255,255,0.2)',display:'inline-block'}}>{article.relatedCalc.label}</Link>}
          </div>
        </div>

        {others.length>0&&(
          <div>
            <div style={{fontSize:11,fontWeight:700,color:C.teal,letterSpacing:'0.15em',textTransform:'uppercase',marginBottom:12,fontFamily:'JetBrains Mono'}}>More Guides</div>
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {others.map(r=>(
                <Link key={r.slug} href={'/blog/'+r.slug}
                  style={{background:'white',border:'1px solid '+C.border,borderRadius:10,padding:'16px 20px',display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,boxShadow:C.shadow,transition:'border-color 0.2s'}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=C.teal}
                  onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                  <div>
                    <div style={{fontSize:14,fontWeight:700,color:C.navy,marginBottom:3}}>{r.title}</div>
                    <div style={{fontSize:12,color:C.slate}}>{r.readTime} read</div>
                  </div>
                  <span style={{color:C.teal,fontSize:18,flexShrink:0}}>→</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer/>
    </>
  );
}
