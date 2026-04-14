'use client';
import { useState, useEffect, useRef } from 'react';
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
  green:'#059669',greenBg:'#ECFDF5',
  red:'#DC2626',redBg:'#FEF2F2',redBorder:'#FECACA',
  text:'#1E293B',textMid:'#475569',slate:'#64748B',slateLight:'#94A3B8',
  shadow:'0 1px 3px rgba(0,0,0,0.07),0 4px 16px rgba(0,0,0,0.04)',
};
const GS = '@import url(\'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Source+Serif+4:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap\');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}body{background:#F8F9FA;color:#1E293B;font-family:\'Source Serif 4\',Georgia,serif;-webkit-tap-highlight-color:transparent;}input[type=number]{-moz-appearance:textfield;}input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;}input[type=range]{-webkit-appearance:none;width:100%;height:4px;background:#CBD5E1;border-radius:2px;outline:none;}input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;border-radius:50%;background:#0C1E3C;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.2);}select{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\'%3E%3Cpath d=\'M1 1l5 5 5-5\' stroke=\'%2364748b\' stroke-width=\'1.5\' fill=\'none\'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;background-color:white;}@keyframes fadeUp{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}.fu{animation:fadeUp 0.4s ease both;}button{cursor:pointer;-webkit-tap-highlight-color:transparent;}a{text-decoration:none;color:inherit;}';
const fmt = n => '\u00A3' + Math.abs(n || 0).toLocaleString('en-GB', { maximumFractionDigits: 0 });
const fmtD = n => '\u00A3' + (n || 0).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
function calcIT(gross, pension) {
  const ti = Math.max(0, gross - pension);
  let pa = 12570; if (ti > 100000) pa = Math.max(0, 12570 - (ti - 100000) / 2);
  const tx = Math.max(0, ti - pa), b1 = 37700, b2 = 75140;
  if (tx <= b1) return tx * 0.20;
  if (tx <= b2) return b1 * 0.20 + (tx - b1) * 0.40;
  return b1 * 0.20 + (b2 - b1) * 0.40 + (tx - b2) * 0.45;
}
function calcNI(g) {
  if (g <= 12570) return 0;
  if (g <= 50270) return (g - 12570) * 0.08;
  return (50270 - 12570) * 0.08 + (g - 50270) * 0.02;
}
function AnimNum({ value, f }) {
  const fn = f || fmt; const [d, setD] = useState(value); const prev = useRef(value);
  useEffect(() => {
    const s = prev.current, e = value || 0, diff = e - s;
    if (Math.abs(diff) < 1) { setD(e); prev.current = e; return; }
    const dur = 400, t0 = performance.now(); let raf;
    const step = now => { const t = Math.min(1,(now-t0)/dur), ease = t<0.5?2*t*t:-1+(4-2*t)*t; setD(s+diff*ease); if(t<1) raf=requestAnimationFrame(step); else{setD(e);prev.current=e;} };
    raf = requestAnimationFrame(step); return () => cancelAnimationFrame(raf);
  }, [value]);
  return <span>{fn(d)}</span>;
}
function Nav() {
  const [open, setOpen] = useState(false); const mob = useW() < 640;
  const links = [['/', 'Salary Calculator'],['/ir35','IR35'],['/nhs','NHS Bands'],['/tools','All Tools'],['/blog','Tax Guides']];
  return (
    <nav style={{background:C.navy,position:'sticky',top:0,zIndex:100,boxShadow:'0 2px 16px rgba(0,0,0,0.25)'}}>
      <div style={{maxWidth:1100,margin:'0 auto',padding:'0 20px',height:56,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <Link href="/" style={{display:'flex',alignItems:'center',gap:9}}>
          <div style={{width:30,height:30,background:'linear-gradient(135deg,#0D9488,#14B8A6)',borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
            <span style={{color:'white',fontWeight:700,fontSize:12,fontFamily:'JetBrains Mono'}}>Tx</span>
          </div>
          <span style={{color:'white',fontFamily:'DM Serif Display',fontSize:17}}>Taxd<span style={{color:'#14B8A6'}}>Calc</span></span>
        </Link>
        {mob ? (
          <button onClick={()=>setOpen(!open)} style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:7,padding:'8px 10px',display:'flex',flexDirection:'column',gap:4}}>
            {[0,1,2].map(i=><span key={i} style={{display:'block',width:18,height:2,background:'white',borderRadius:1,transition:'all 0.2s',transform:open&&i===0?'rotate(45deg) translate(4px,4px)':open&&i===2?'rotate(-45deg) translate(4px,-4px)':'none',opacity:open&&i===1?0:1}}/>)}
          </button>
        ) : (
          <div style={{display:'flex',gap:2,alignItems:'center'}}>
            {links.map(([href,label])=>(
              <Link key={href} href={href} style={{padding:'7px 13px',borderRadius:6,background:href==='/ir35'?'rgba(13,148,136,0.2)':'transparent',color:href==='/ir35'?'#14B8A6':'rgba(255,255,255,0.6)',fontSize:13,fontFamily:'Source Serif 4',fontWeight:href==='/ir35'?600:400}}>{label}</Link>
            ))}
            <span style={{fontSize:11,color:'#14B8A6',fontFamily:'JetBrains Mono',background:'rgba(13,148,136,0.15)',padding:'3px 9px',borderRadius:4,border:'1px solid rgba(20,184,166,0.3)',marginLeft:8}}>2026-27</span>
          </div>
        )}
      </div>
      {mob&&open&&(
        <div style={{background:'#162d52',borderTop:'1px solid rgba(255,255,255,0.08)',padding:'6px 0 12px'}}>
          {links.map(([href,label])=>(
            <Link key={href} href={href} onClick={()=>setOpen(false)} style={{display:'block',padding:'12px 24px',background:href==='/ir35'?'rgba(13,148,136,0.15)':'transparent',color:href==='/ir35'?'#14B8A6':'rgba(255,255,255,0.65)',fontSize:14,fontFamily:'Source Serif 4',fontWeight:href==='/ir35'?600:400}}>{label}</Link>
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

export default function IR35Page() {
  const mob = useW() < 640;
  const [dayRate, setDayRate] = useState(500);
  const [daysPerYear, setDaysPerYear] = useState(220);
  const annual = dayRate * daysPerYear;
  const rInside = (() => {
    const it = calcIT(annual, annual * 0.05), ni = calcNI(annual), p = annual * 0.05;
    return { takeHome: annual - it - ni - p, incomeTax: it, ni, pension: p };
  })();
  const salary = 12570;
  const corpTax = Math.max(0, (annual - salary - 9100) * 0.19);
  const divs = Math.max(0, annual - salary - corpTax - 9100);
  const divTax = Math.max(0, divs - 500);
  const basicDiv = Math.max(0, Math.min(divTax, 37700)) * 0.1075;
  const higherDiv = Math.max(0, divTax - 37700) * 0.3575;
  const limitedTH = salary + divs - basicDiv - higherDiv;
  const saving = limitedTH - rInside.takeHome;

  return (
    <>
      <style>{GS}</style>
      <Nav />
      <div style={{background:'linear-gradient(135deg,#0C1E3C,#1e3d6e)',padding:mob?'36px 20px 64px':'44px 24px 72px',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:-50,right:-50,width:220,height:220,borderRadius:'50%',background:'rgba(13,148,136,0.07)',pointerEvents:'none'}}/>
        <div style={{display:'inline-block',background:'rgba(13,148,136,0.15)',border:'1px solid rgba(20,184,166,0.3)',borderRadius:20,padding:'4px 13px',fontSize:11,color:'#14B8A6',marginBottom:13,fontFamily:'JetBrains Mono'}}>IR35 and Contractor Tools</div>
        <h1 style={{fontFamily:'DM Serif Display',fontSize:mob?26:42,color:'white',marginBottom:10,letterSpacing:'-0.02em',lineHeight:1.15}}>
          IR35 Contractor<br/><em style={{color:'#14B8A6'}}>Calculator 2026-27</em>
        </h1>
        <p style={{color:'rgba(255,255,255,0.5)',fontSize:mob?13:15,maxWidth:480,margin:'0 auto'}}>Compare your take-home pay inside IR35 (PAYE) vs outside IR35 (Limited Company). Updated for 2026-27 dividend rates.</p>
      </div>
      <div style={{maxWidth:860,margin:mob?'-28px 0 0':'-34px auto 0',padding:mob?'0 16px 48px':'0 24px 56px'}}>
        <Link href="/" style={{display:'inline-flex',alignItems:'center',gap:8,background:C.navy,color:'white',padding:'10px 18px',borderRadius:8,fontSize:13,fontWeight:700,marginBottom:20}}>← Back to Salary Calculator</Link>
        <div style={{background:'white',borderRadius:14,padding:mob?20:26,boxShadow:C.shadow,border:'1px solid '+C.border,marginBottom:16}} className="fu">
          <h2 style={{fontFamily:'DM Serif Display',fontSize:19,color:C.navy,marginBottom:20}}>Your Contract Details</h2>
          <div style={{display:'grid',gridTemplateColumns:mob?'1fr':'1fr 1fr',gap:16}}>
            {[['Day Rate',dayRate,setDayRate,5000,'Exc. VAT'],['Days per Year',daysPerYear,setDaysPerYear,260,'Typical: 220']].map(([label,val,setter,max,hint])=>(
              <div key={label} style={{marginBottom:4}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:7}}>
                  <label style={{fontSize:13,fontWeight:600,color:C.navyLight}}>{label}</label>
                  <span style={{fontSize:11,color:C.slate}}>{hint}</span>
                </div>
                <div style={{position:'relative'}}>
                  <span style={{position:'absolute',left:13,top:'50%',transform:'translateY(-50%)',color:C.slate,fontSize:15,fontWeight:600,fontFamily:'JetBrains Mono',pointerEvents:'none'}}>{label==='Day Rate'?'\u00A3':''}</span>
                  <input type="number" value={val} onChange={e=>setter(Math.max(0,Number(e.target.value)))} min={0} max={max}
                    style={{width:'100%',padding:label==='Day Rate'?'13px 14px 13px 28px':'13px 14px',border:'1.5px solid '+C.borderDark,borderRadius:8,fontSize:16,fontFamily:'JetBrains Mono',fontWeight:500,color:C.navy,background:'white',outline:'none'}}
                    onFocus={e=>e.target.style.borderColor=C.teal} onBlur={e=>e.target.style.borderColor=C.borderDark}/>
                </div>
              </div>
            ))}
          </div>
          <div style={{padding:'10px 14px',background:C.tealBg,borderRadius:7,border:'1px solid '+C.tealBorder,display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:8,marginTop:8}}>
            <span style={{fontSize:13,color:C.teal,fontWeight:600}}>Annual contract value</span>
            <span style={{fontFamily:'JetBrains Mono',fontSize:14,fontWeight:700,color:C.navy}}>{fmt(annual)}</span>
          </div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:mob?'1fr':'1fr 1fr',gap:14,marginBottom:14}}>
          {[
            {label:'Inside IR35 (PAYE)',value:rInside.takeHome,sub:'All income taxed as employment. Full income tax and NI.',color:C.red,bg:C.redBg,border:C.redBorder},
            {label:'Outside IR35 (Ltd Co.)',value:limitedTH,sub:'Salary plus dividends after corporation tax. Basic rate dividend tax: 10.75%.',color:C.teal,bg:C.tealBg,border:C.tealBorder},
          ].map(s=>(
            <div key={s.label} style={{background:s.bg,border:'1.5px solid '+s.border,borderRadius:12,padding:mob?'18px':24}}>
              <div style={{fontSize:11,color:C.slate,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',marginBottom:8}}>{s.label}</div>
              <div style={{fontFamily:'DM Serif Display',fontSize:mob?30:42,color:s.color,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                <AnimNum value={Math.max(0,s.value)}/>
              </div>
              <div style={{fontSize:12,color:C.slate,marginTop:5,fontFamily:'JetBrains Mono'}}>{fmtD(Math.max(0,s.value)/12)}/month</div>
              <div style={{fontSize:12,color:C.textMid,marginTop:8,lineHeight:1.5}}>{s.sub}</div>
            </div>
          ))}
        </div>
        {annual > 0 && (
          <div style={{background:saving>0?C.tealBg:C.redBg,border:'1.5px solid '+(saving>0?C.tealBorder:C.redBorder),borderRadius:10,padding:'14px 18px',marginBottom:14}}>
            <span style={{fontSize:14,color:C.text,lineHeight:1.5}}>
              Outside IR35 {saving>0?'saves you':'costs you'} <strong style={{color:saving>0?C.teal:C.red}}>{fmt(Math.abs(saving))}/year</strong> ({fmtD(Math.abs(saving/12))}/month) {saving>0?'more':'less'} in take-home pay.
            </span>
          </div>
        )}
        <div style={{background:'white',borderRadius:12,padding:mob?18:24,border:'1px solid '+C.border,marginBottom:16}}>
          <h3 style={{fontFamily:'DM Serif Display',fontSize:17,color:C.navy,marginBottom:14}}>How this is calculated</h3>
          <div style={{display:'grid',gridTemplateColumns:mob?'1fr':'1fr 1fr',gap:16}}>
            {[
              {title:'Inside IR35',color:C.red,rows:[['Contract revenue',fmt(annual)],['Income tax','-'+fmt(rInside.incomeTax)],['National Insurance','-'+fmt(rInside.ni)],['Pension (5%)','-'+fmt(rInside.pension)],['Take-home',fmt(rInside.takeHome)]]},
              {title:'Outside IR35 (Ltd Co.)',color:C.teal,rows:[['Contract revenue',fmt(annual)],['Director salary',fmt(salary)],['Corporation tax (19%)','-'+fmt(corpTax)],['Dividends',fmt(divs)],['Dividend tax','-'+fmt(basicDiv+higherDiv)],['Take-home',fmt(limitedTH)]]},
            ].map(col=>(
              <div key={col.title}>
                <div style={{fontSize:11,fontWeight:700,color:col.color,letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:8}}>{col.title}</div>
                {col.rows.map(([l,v])=>(
                  <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'7px 0',borderBottom:'1px solid '+C.border,fontSize:12}}>
                    <span style={{color:l==='Take-home'?C.text:C.textMid,fontWeight:l==='Take-home'?700:400}}>{l}</span>
                    <span style={{fontFamily:'JetBrains Mono',color:l==='Take-home'?col.color:C.text,fontWeight:l==='Take-home'?700:400}}>{v}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div style={{background:C.amberBg,border:'1px solid '+C.amberBorder,borderRadius:10,padding:'14px 18px'}}>
          <div style={{fontSize:12,fontWeight:700,color:'#92400E',marginBottom:4}}>Disclaimer</div>
          <div style={{fontSize:12,color:'#78350F',lineHeight:1.6}}>IR35 status is determined by your actual working practices, not your preference. This is an indicative comparison only. Always seek professional advice from a qualified IR35 specialist or accountant. Dividend tax rates increased to 10.75% basic rate from April 2026.</div>
        </div>
      </div>
      <Footer/>
    </>
  );
}
