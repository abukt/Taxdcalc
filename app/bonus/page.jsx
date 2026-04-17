'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

function useW() {
  const [w, setW] = useState(typeof window !== 'undefined' ? window.innerWidth : 800);
  useEffect(() => { const f = () => setW(window.innerWidth); window.addEventListener('resize', f); return () => window.removeEventListener('resize', f); }, []);
  return w;
}
const C = {
  navy:'#0C1E3C',navyLight:'#162d52',navyMid:'#1e3d6e',
  teal:'#0D9488',tealLight:'#14B8A6',tealBg:'#F0FDFA',tealBorder:'#99F6E4',
  amber:'#D97706',amberBg:'#FFFBEB',amberBorder:'#FDE68A',
  border:'#E2E8F0',borderDark:'#CBD5E1',cream:'#F8F9FA',white:'#FFFFFF',
  green:'#059669',red:'#DC2626',redBg:'#FEF2F2',redBorder:'#FECACA',
  text:'#1E293B',textMid:'#475569',slate:'#64748B',slateLight:'#94A3B8',
  shadow:'0 1px 3px rgba(0,0,0,0.07),0 4px 16px rgba(0,0,0,0.04)',
};
const GS = '@import url(\'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Source+Serif+4:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap\');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}body{background:#F8F9FA;color:#1E293B;font-family:\'Source Serif 4\',Georgia,serif;-webkit-tap-highlight-color:transparent;}input[type=number]{-moz-appearance:textfield;}input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;}@keyframes fadeUp{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}.fu{animation:fadeUp 0.4s ease both;}button{cursor:pointer;-webkit-tap-highlight-color:transparent;}a{text-decoration:none;color:inherit;}';
const fmt = n => '\u00A3' + Math.abs(n || 0).toLocaleString('en-GB', { maximumFractionDigits: 0 });
const fmtD = n => '\u00A3' + (n || 0).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
function calcIT(gross) {
  let pa = 12570; if (gross > 100000) pa = Math.max(0, 12570 - (gross - 100000) / 2);
  const tx = Math.max(0, gross - pa), b1 = 37700, b2 = 75140;
  if (tx <= b1) return tx * 0.20;
  if (tx <= b2) return b1 * 0.20 + (tx - b1) * 0.40;
  return b1 * 0.20 + (b2 - b1) * 0.40 + (tx - b2) * 0.45;
}
function calcNI(g) {
  if (g <= 12570) return 0;
  if (g <= 50270) return (g - 12570) * 0.08;
  return (50270 - 12570) * 0.08 + (g - 50270) * 0.02;
}

function NumIn({ label, value, onChange, hint }) {
  return (
    <div style={{marginBottom:20}}>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:7}}>
        <label style={{fontSize:13,fontWeight:600,color:C.navyLight}}>{label}</label>
        {hint&&<span style={{fontSize:11,color:C.slate}}>{hint}</span>}
      </div>
      <div style={{position:'relative'}}>
        <span style={{position:'absolute',left:13,top:'50%',transform:'translateY(-50%)',color:C.slate,fontSize:15,fontWeight:600,fontFamily:'JetBrains Mono',pointerEvents:'none'}}>{'\u00A3'}</span>
        <input type="number" value={value} onChange={e=>onChange(Math.max(0,Number(e.target.value)))} min={0} max={999999}
          style={{width:'100%',padding:'13px 14px 13px 28px',border:'1.5px solid '+C.borderDark,borderRadius:8,fontSize:16,fontFamily:'JetBrains Mono',fontWeight:500,color:C.navy,background:'white',outline:'none'}}
          onFocus={e=>e.target.style.borderColor=C.teal} onBlur={e=>e.target.style.borderColor=C.borderDark}/>
      </div>
    </div>
  );
}

function Nav() {
  const [open, setOpen] = useState(false); const mob = useW() < 640;
  const links = [['/', 'Salary Calculator'],['/ir35','IR35'],['/nhs','NHS Bands'],['/tools','All Tools'],['/blog','Tax Guides']];
  return (
    <nav style={{background:C.navy,position:'sticky',top:0,zIndex:100,boxShadow:'0 2px 16px rgba(0,0,0,0.25)'}}>
      <div style={{maxWidth:1100,margin:'0 auto',padding:'0 20px',height:56,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <Link href="/" style={{display:'flex',alignItems:'center',gap:9}}>
          <div style={{width:30,height:30,background:'linear-gradient(135deg,#0D9488,#14B8A6)',borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><span style={{color:'white',fontWeight:700,fontSize:12,fontFamily:'JetBrains Mono'}}>Tx</span></div>
          <span style={{color:'white',fontFamily:'DM Serif Display',fontSize:17}}>Taxd<span style={{color:'#14B8A6'}}>Calc</span></span>
        </Link>
        {mob ? (
          <button onClick={()=>setOpen(!open)} style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:7,padding:'8px 10px',display:'flex',flexDirection:'column',gap:4}}>
            {[0,1,2].map(i=><span key={i} style={{display:'block',width:18,height:2,background:'white',borderRadius:1,transition:'all 0.2s',transform:open&&i===0?'rotate(45deg) translate(4px,4px)':open&&i===2?'rotate(-45deg) translate(4px,-4px)':'none',opacity:open&&i===1?0:1}}/>)}
          </button>
        ) : (
          <div style={{display:'flex',gap:2,alignItems:'center'}}>
            {links.map(([href,label])=>(
              <Link key={href} href={href} style={{padding:'7px 13px',borderRadius:6,background:'transparent',color:'rgba(255,255,255,0.6)',fontSize:13,fontFamily:'Source Serif 4'}}>{label}</Link>
            ))}
            <span style={{fontSize:11,color:'#14B8A6',fontFamily:'JetBrains Mono',background:'rgba(13,148,136,0.15)',padding:'3px 9px',borderRadius:4,border:'1px solid rgba(20,184,166,0.3)',marginLeft:8}}>2026-27</span>
          </div>
        )}
      </div>
      {mob&&open&&(
        <div style={{background:'#162d52',borderTop:'1px solid rgba(255,255,255,0.08)',padding:'6px 0 12px'}}>
          {links.map(([href,label])=>(
            <Link key={href} href={href} onClick={()=>setOpen(false)} style={{display:'block',padding:'12px 24px',color:'rgba(255,255,255,0.65)',fontSize:14,fontFamily:'Source Serif 4'}}>{label}</Link>
          ))}
        </div>
      )}
    </nav>
  );
}
function Footer() {
  return (
    <footer style={{background:'#070D1C',padding:'24px 20px',borderTop:'1px solid rgba(255,255,255,0.05)',marginTop:48}}>
      <div style={{maxWidth:1100,margin:'0 auto',display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:14,alignItems:'center'}}>
        <Link href="/" style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{width:26,height:26,background:'linear-gradient(135deg,#0D9488,#14B8A6)',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{color:'white',fontWeight:700,fontSize:11,fontFamily:'JetBrains Mono'}}>Tx</span></div>
          <span style={{color:'white',fontFamily:'DM Serif Display',fontSize:15}}>Taxd<span style={{color:'#14B8A6'}}>Calc</span></span>
        </Link>
        <span style={{fontSize:11,color:'rgba(255,255,255,0.2)',fontFamily:'JetBrains Mono'}}>Updated April 2026 - 2026-27</span>
        <span style={{fontSize:11,color:'rgba(255,255,255,0.18)',maxWidth:280,lineHeight:1.6}}>For guidance only. Always consult HMRC or a qualified adviser.</span>
      </div>
    </footer>
  );
}

export default function BonusPage() {
  const mob = useW() < 640;
  const [salary, setSalary] = useState(40000);
  const [bonus, setBonus] = useState(5000);
  const itBase = calcIT(salary), niBase = calcNI(salary);
  const itWith = calcIT(salary + bonus), niWith = calcNI(salary + bonus);
  const bonusTax = (itWith - itBase) + (niWith - niBase);
  const netBonus = Math.max(0, bonus - bonusTax);
  const pct = bonus > 0 ? (netBonus / bonus) * 100 : 0;
  const thBase = salary - itBase - niBase;
  const thWith = (salary + bonus) - itWith - niWith;

  return (
    <>
      <style>{GS}</style>
      <Nav/>
      <div style={{background:'linear-gradient(135deg,#0C1E3C,#1e3d6e)',padding:mob?'36px 20px 64px':'44px 24px 72px',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:-50,right:-50,width:220,height:220,borderRadius:'50%',background:'rgba(13,148,136,0.07)',pointerEvents:'none'}}/>
        <div style={{display:'inline-block',background:'rgba(13,148,136,0.15)',border:'1px solid rgba(20,184,166,0.3)',borderRadius:20,padding:'4px 13px',fontSize:11,color:'#14B8A6',marginBottom:13,fontFamily:'JetBrains Mono'}}>Bonus Tax Calculator</div>
        <h1 style={{fontFamily:'DM Serif Display',fontSize:mob?26:42,color:'white',marginBottom:10,letterSpacing:'-0.02em'}}>
          Bonus Take-Home<br/><em style={{color:'#14B8A6'}}>Calculator 2026-27</em>
        </h1>
        <p style={{color:'rgba(255,255,255,0.5)',fontSize:mob?13:15,maxWidth:440,margin:'0 auto'}}>See exactly how much of your bonus you keep after income tax and National Insurance.</p>
      </div>
      <div style={{background:'#F4F6F9',padding:mob?'16px 16px 0':'18px 24px 0',maxWidth:860,margin:'0 auto'}}>
        <Link href="/" style={{display:'inline-flex',alignItems:'center',gap:8,background:C.navy,color:'white',padding:'10px 18px',borderRadius:8,fontSize:13,fontWeight:700}}><- Back to Salary Calculator</Link>
      </div>
      <div style={{maxWidth:860,margin:'0 auto',padding:mob?'16px 16px 48px':'16px 24px 56px'}}>
        <div style={{display:'grid',gridTemplateColumns:mob?'1fr':'1fr 1fr',gap:20,alignItems:'start'}}>
          <div style={{background:'white',borderRadius:14,padding:mob?20:26,boxShadow:C.shadow,border:'1px solid '+C.border}} className="fu">
            <h2 style={{fontFamily:'DM Serif Display',fontSize:19,color:C.navy,marginBottom:20}}>Your Details</h2>
            <NumIn label="Annual Salary (before bonus)" value={salary} onChange={setSalary} hint={fmt(salary/12)+'/mo'}/>
            <NumIn label="Gross Bonus Amount" value={bonus} onChange={setBonus} hint="Before tax"/>
            <div style={{padding:'12px 14px',background:C.tealBg,border:'1px solid '+C.tealBorder,borderRadius:8,fontSize:12,color:'#0f766e',lineHeight:1.65}}>
              Your bonus is taxed at your marginal rate. If salary plus bonus crosses into a higher tax band, only that portion is taxed at the higher rate.
            </div>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:14}} className="fu">
            <div style={{background:'linear-gradient(135deg,#0C1E3C,#1e3d6e)',borderRadius:14,padding:mob?20:26,boxShadow:'0 4px 24px rgba(12,30,60,0.3)'}}>
              <div style={{fontSize:10,color:'rgba(255,255,255,0.4)',letterSpacing:'0.12em',textTransform:'uppercase',fontFamily:'JetBrains Mono',marginBottom:6}}>Net Bonus (After Tax)</div>
              <div style={{fontFamily:'DM Serif Display',fontSize:mob?36:50,color:'white',lineHeight:1}}>{fmt(netBonus)}</div>
              <div style={{fontSize:13,color:'#14B8A6',fontFamily:'JetBrains Mono',marginTop:5,fontWeight:600}}>{pct.toFixed(1)}% of gross bonus kept</div>
              <div style={{marginTop:14,height:4,background:'rgba(255,255,255,0.08)',borderRadius:2,overflow:'hidden'}}>
                <div style={{width:Math.min(100,pct)+'%',height:'100%',background:'linear-gradient(90deg,#0D9488,#14B8A6)',borderRadius:2,transition:'width 0.5s'}}/>
              </div>
            </div>
            <div style={{background:'white',borderRadius:12,padding:mob?16:22,border:'1px solid '+C.border,boxShadow:C.shadow}}>
              <h3 style={{fontFamily:'DM Serif Display',fontSize:17,color:C.navy,marginBottom:14}}>Bonus Breakdown</h3>
              {[
                {l:'Gross bonus',v:bonus,color:C.navy},
                {l:'Extra income tax',v:itWith-itBase,color:C.red,neg:true},
                {l:'Extra National Insurance',v:niWith-niBase,color:'#F59E0B',neg:true},
                {l:'Net bonus (you receive)',v:netBonus,color:C.teal,bold:true},
              ].map(row=>(
                <div key={row.l} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid '+C.border}}>
                  <span style={{fontSize:13,fontWeight:row.bold?700:400,color:row.bold?C.text:C.textMid}}>{row.l}</span>
                  <span style={{fontFamily:'JetBrains Mono',fontSize:row.bold?15:13,color:row.color,fontWeight:row.bold?700:400}}>{row.neg?'-':''}{fmt(row.v)}</span>
                </div>
              ))}
            </div>
            <div style={{background:'white',borderRadius:12,padding:mob?16:22,border:'1px solid '+C.border,boxShadow:C.shadow}}>
              <h3 style={{fontFamily:'DM Serif Display',fontSize:17,color:C.navy,marginBottom:14}}>Before and After Comparison</h3>
              {[['Without bonus',salary,itBase,niBase,thBase],['With bonus',salary+bonus,itWith,niWith,thWith]].map(([lbl,g,it,ni,th])=>(
                <div key={lbl} style={{marginBottom:14,paddingBottom:14,borderBottom:'1px solid '+C.border}}>
                  <div style={{fontSize:11,fontWeight:700,color:C.teal,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:8}}>{lbl}</div>
                  {[['Gross',fmt(g),'#0C1E3C'],['Income Tax','-'+fmt(it),C.red],['NI','-'+fmt(ni),'#F59E0B'],['Take-home',fmt(th),C.teal]].map(([l,v,c])=>(
                    <div key={l} style={{display:'flex',justifyContent:'space-between',fontSize:12,padding:'4px 0'}}>
                      <span style={{color:C.textMid}}>{l}</span>
                      <span style={{fontFamily:'JetBrains Mono',color:c,fontWeight:l==='Take-home'?700:400}}>{v}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{marginTop:16,background:C.amberBg,border:'1px solid '+C.amberBorder,borderRadius:10,padding:'14px 18px'}}>
          <div style={{fontSize:12,fontWeight:700,color:'#92400E',marginBottom:4}}>Tip: Sacrifice your bonus into your pension</div>
          <div style={{fontSize:12,color:'#78350F',lineHeight:1.6}}>If your employer allows it, contributing your bonus to your pension via salary sacrifice saves both income tax and National Insurance. A basic rate taxpayer contributing a {fmt(bonus)} bonus only saves {fmt(bonus*0.20)} in tax normally — but salary sacrifice would save {fmt(bonus*0.28)} in combined tax and NI.</div>
        </div>
      </div>
      <Footer/>
    </>
  );
}
