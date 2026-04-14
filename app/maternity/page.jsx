'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

function useW(){const[w,setW]=useState(typeof window!=='undefined'?window.innerWidth:800);useEffect(()=>{const f=()=>setW(window.innerWidth);window.addEventListener('resize',f);return()=>window.removeEventListener('resize',f);},[]);return w;}
const C={navy:'#0C1E3C',navyLight:'#162d52',teal:'#0D9488',tealLight:'#14B8A6',tealBg:'#F0FDFA',tealBorder:'#99F6E4',amber:'#D97706',amberBg:'#FFFBEB',amberBorder:'#FDE68A',border:'#E2E8F0',borderDark:'#CBD5E1',white:'#FFFFFF',text:'#1E293B',textMid:'#475569',slate:'#64748B',slateLight:'#94A3B8',shadow:'0 1px 3px rgba(0,0,0,0.07),0 4px 16px rgba(0,0,0,0.04)'};
const GS='@import url(\'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Source+Serif+4:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap\');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}body{background:#F8F9FA;color:#1E293B;font-family:\'Source Serif 4\',Georgia,serif;-webkit-tap-highlight-color:transparent;}input[type=number]{-moz-appearance:textfield;}input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;}input[type=range]{-webkit-appearance:none;width:100%;height:4px;background:#CBD5E1;border-radius:2px;outline:none;}input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;border-radius:50%;background:#0C1E3C;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.2);}@keyframes fadeUp{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}.fu{animation:fadeUp 0.4s ease both;}button{cursor:pointer;}a{text-decoration:none;color:inherit;}';
const fmt=n=>'\u00A3'+Math.abs(n||0).toLocaleString('en-GB',{maximumFractionDigits:0});
const fmtD=n=>'\u00A3'+(n||0).toLocaleString('en-GB',{minimumFractionDigits:2,maximumFractionDigits:2});
const SMP = 187.18;
function Nav(){const[open,setOpen]=useState(false);const mob=useW()<640;const links=[['/',   'Salary Calculator'],['/ir35','IR35'],['/nhs','NHS Bands'],['/tools','All Tools'],['/blog','Tax Guides']];return(<nav style={{background:'#0C1E3C',position:'sticky',top:0,zIndex:100,boxShadow:'0 2px 16px rgba(0,0,0,0.25)'}}><div style={{maxWidth:1100,margin:'0 auto',padding:'0 20px',height:56,display:'flex',alignItems:'center',justifyContent:'space-between'}}><Link href="/" style={{display:'flex',alignItems:'center',gap:9}}><div style={{width:30,height:30,background:'linear-gradient(135deg,#0D9488,#14B8A6)',borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><span style={{color:'white',fontWeight:700,fontSize:12,fontFamily:'JetBrains Mono'}}>Tx</span></div><span style={{color:'white',fontFamily:'DM Serif Display',fontSize:17}}>Taxd<span style={{color:'#14B8A6'}}>Calc</span></span></Link>{mob?(<button onClick={()=>setOpen(!open)} style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:7,padding:'8px 10px',display:'flex',flexDirection:'column',gap:4}}>{[0,1,2].map(i=><span key={i} style={{display:'block',width:18,height:2,background:'white',borderRadius:1,transition:'all 0.2s',transform:open&&i===0?'rotate(45deg) translate(4px,4px)':open&&i===2?'rotate(-45deg) translate(4px,-4px)':'none',opacity:open&&i===1?0:1}}/>)}</button>):(<div style={{display:'flex',gap:2,alignItems:'center'}}>{links.map(([href,label])=>(<Link key={href} href={href} style={{padding:'7px 13px',borderRadius:6,background:'transparent',color:'rgba(255,255,255,0.6)',fontSize:13,fontFamily:'Source Serif 4'}}>{label}</Link>))}<span style={{fontSize:11,color:'#14B8A6',fontFamily:'JetBrains Mono',background:'rgba(13,148,136,0.15)',padding:'3px 9px',borderRadius:4,border:'1px solid rgba(20,184,166,0.3)',marginLeft:8}}>2026-27</span></div>)}</div>{mob&&open&&(<div style={{background:'#162d52',borderTop:'1px solid rgba(255,255,255,0.08)',padding:'6px 0 12px'}}>{links.map(([href,label])=>(<Link key={href} href={href} onClick={()=>setOpen(false)} style={{display:'block',padding:'12px 24px',color:'rgba(255,255,255,0.65)',fontSize:14,fontFamily:'Source Serif 4'}}>{label}</Link>))}</div>)}</nav>);}
function Footer(){return(<footer style={{background:'#070D1C',padding:'24px 20px',borderTop:'1px solid rgba(255,255,255,0.05)',marginTop:48}}><div style={{maxWidth:1100,margin:'0 auto',display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:14,alignItems:'center'}}><Link href="/" style={{display:'flex',alignItems:'center',gap:8}}><div style={{width:26,height:26,background:'linear-gradient(135deg,#0D9488,#14B8A6)',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{color:'white',fontWeight:700,fontSize:11,fontFamily:'JetBrains Mono'}}>Tx</span></div><span style={{color:'white',fontFamily:'DM Serif Display',fontSize:15}}>Taxd<span style={{color:'#14B8A6'}}>Calc</span></span></Link><span style={{fontSize:11,color:'rgba(255,255,255,0.2)',fontFamily:'JetBrains Mono'}}>Updated April 2026</span><span style={{fontSize:11,color:'rgba(255,255,255,0.18)',maxWidth:280,lineHeight:1.6}}>For guidance only. Consult HMRC or a qualified adviser.</span></div></footer>);}

export default function MaternityPage() {
  const mob = useW() < 640;
  const [salary, setSalary] = useState(35000);
  const [enhanced, setEnhanced] = useState(false);
  const [enhWeeks, setEnhWeeks] = useState(13);
  const [enhPct, setEnhPct] = useState(100);
  const weekly = salary / 52;
  const phase1 = weekly * 0.9;
  const phase2 = SMP;
  const smpTotal = phase1 * 6 + phase2 * 33;
  const enhTotal = enhanced ? weekly * (enhPct / 100) * Math.min(enhWeeks, 39) : smpTotal;

  return (
    <>
      <style>{GS}</style>
      <Nav/>
      <div style={{background:'linear-gradient(135deg,#0C1E3C,#1e3d6e)',padding:mob?'36px 20px 64px':'44px 24px 72px',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:-50,right:-50,width:220,height:220,borderRadius:'50%',background:'rgba(13,148,136,0.07)',pointerEvents:'none'}}/>
        <div style={{display:'inline-block',background:'rgba(13,148,136,0.15)',border:'1px solid rgba(20,184,166,0.3)',borderRadius:20,padding:'4px 13px',fontSize:11,color:'#14B8A6',marginBottom:13,fontFamily:'JetBrains Mono'}}>Maternity Pay 2026-27</div>
        <h1 style={{fontFamily:'DM Serif Display',fontSize:mob?26:42,color:'white',marginBottom:10,letterSpacing:'-0.02em'}}>
          Statutory Maternity Pay<br/><em style={{color:'#14B8A6'}}>Calculator</em>
        </h1>
        <p style={{color:'rgba(255,255,255,0.5)',fontSize:mob?13:15,maxWidth:480,margin:'0 auto'}}>Calculate your SMP entitlement week by week. Statutory rate: {fmtD(SMP)}/week for 2026-27.</p>
      </div>
      <div style={{maxWidth:860,margin:mob?'-28px 0 0':'-34px auto 0',padding:mob?'0 16px 48px':'0 24px 56px'}}>
        <Link href="/" style={{display:'inline-flex',alignItems:'center',gap:8,background:C.navy,color:'white',padding:'10px 18px',borderRadius:8,fontSize:13,fontWeight:700,marginBottom:20}}>← Back to Salary Calculator</Link>
        <div style={{display:'grid',gridTemplateColumns:mob?'1fr':'1fr 1fr',gap:20,alignItems:'start'}}>
          <div style={{background:'white',borderRadius:14,padding:mob?20:26,boxShadow:C.shadow,border:'1px solid '+C.border}} className="fu">
            <h2 style={{fontFamily:'DM Serif Display',fontSize:19,color:C.navy,marginBottom:20}}>Your Details</h2>
            <div style={{marginBottom:20}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:7}}>
                <label style={{fontSize:13,fontWeight:600,color:C.navyLight}}>Annual Salary (before leave)</label>
                {salary>0&&<span style={{fontSize:11,color:C.slate}}>{fmtD(weekly)}/wk</span>}
              </div>
              <div style={{position:'relative'}}>
                <span style={{position:'absolute',left:13,top:'50%',transform:'translateY(-50%)',color:C.slate,fontSize:15,fontWeight:600,fontFamily:'JetBrains Mono',pointerEvents:'none'}}>{'\u00A3'}</span>
                <input type="number" value={salary} onChange={e=>setSalary(Math.max(0,Number(e.target.value)))} min={0} max={500000}
                  style={{width:'100%',padding:'13px 14px 13px 28px',border:'1.5px solid '+C.borderDark,borderRadius:8,fontSize:16,fontFamily:'JetBrains Mono',fontWeight:500,color:C.navy,background:'white',outline:'none'}}
                  onFocus={e=>e.target.style.borderColor=C.teal} onBlur={e=>e.target.style.borderColor=C.borderDark}/>
              </div>
            </div>
            <div style={{marginBottom:18}}>
              <label style={{display:'block',fontSize:13,fontWeight:600,color:C.navyLight,marginBottom:10}}>Enhanced maternity pay from employer?</label>
              <div style={{display:'flex',gap:10}}>
                {[['No - SMP only',false],['Yes - enhanced',true]].map(([lbl,val])=>(
                  <button key={String(val)} onClick={()=>setEnhanced(val)} style={{flex:1,padding:'11px',borderRadius:8,border:'1.5px solid '+(enhanced===val?C.teal:C.borderDark),background:enhanced===val?C.tealBg:'white',color:enhanced===val?C.teal:C.textMid,fontSize:13,fontWeight:enhanced===val?700:400}}>
                    {lbl}
                  </button>
                ))}
              </div>
            </div>
            {enhanced&&(
              <>
                <div style={{marginBottom:22}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
                    <label style={{fontSize:13,fontWeight:600,color:C.navyLight}}>Enhanced weeks</label>
                    <span style={{fontFamily:'JetBrains Mono',fontSize:14,color:C.teal,fontWeight:600}}>{enhWeeks} weeks</span>
                  </div>
                  <input type="range" min={1} max={39} step={1} value={enhWeeks} onChange={e=>setEnhWeeks(Number(e.target.value))}/>
                </div>
                <div style={{marginBottom:22}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
                    <label style={{fontSize:13,fontWeight:600,color:C.navyLight}}>Enhanced pay rate</label>
                    <span style={{fontFamily:'JetBrains Mono',fontSize:14,color:C.teal,fontWeight:600}}>{enhPct}% of salary</span>
                  </div>
                  <input type="range" min={50} max={100} step={5} value={enhPct} onChange={e=>setEnhPct(Number(e.target.value))}/>
                </div>
              </>
            )}
            <div style={{padding:'12px 14px',background:'#FFFBEB',border:'1px solid #FDE68A',borderRadius:8,fontSize:12,color:'#78350F',lineHeight:1.65}}>
              To qualify for SMP: employed for 26 weeks by week 15 before due date, average earnings at least {'\u00A3'}123/week. Give 28 days notice where possible.
            </div>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:14}} className="fu">
            <div style={{background:'linear-gradient(135deg,#0C1E3C,#1e3d6e)',borderRadius:14,padding:mob?20:26,boxShadow:'0 4px 24px rgba(12,30,60,0.3)'}}>
              <div style={{fontSize:10,color:'rgba(255,255,255,0.4)',letterSpacing:'0.12em',textTransform:'uppercase',fontFamily:'JetBrains Mono',marginBottom:6}}>Total SMP (39 weeks)</div>
              <div style={{fontFamily:'DM Serif Display',fontSize:mob?36:50,color:'white',lineHeight:1}}>{fmt(smpTotal)}</div>
              <div style={{fontSize:13,color:'rgba(255,255,255,0.45)',fontFamily:'JetBrains Mono',marginTop:5}}>{fmtD(smpTotal/39)}/week average over 39 weeks</div>
            </div>
            <div style={{background:'white',borderRadius:12,padding:mob?16:22,border:'1px solid '+C.border,boxShadow:C.shadow}}>
              <h3 style={{fontFamily:'DM Serif Display',fontSize:17,color:C.navy,marginBottom:16}}>SMP Pay Periods</h3>
              {[
                {label:'Weeks 1 to 6',sub:'90% of average weekly earnings',weekly:phase1,weeks:6,color:C.teal},
                {label:'Weeks 7 to 39',sub:'Statutory rate (2026-27)',weekly:SMP,weeks:33,color:'#6366F1'},
                {label:'Weeks 40 to 52',sub:'Unpaid (if you take full 52 weeks)',weekly:0,weeks:13,color:C.slateLight},
              ].map(p=>(
                <div key={p.label} style={{display:'flex',alignItems:'center',gap:14,padding:'12px 0',borderBottom:'1px solid '+C.border}}>
                  <div style={{width:10,height:10,borderRadius:2,background:p.color,flexShrink:0}}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:600,color:C.navy}}>{p.label}</div>
                    <div style={{fontSize:11,color:C.slate,marginTop:2}}>{p.sub}</div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontFamily:'JetBrains Mono',fontSize:13,color:p.weekly===0?C.slateLight:C.text,fontWeight:600}}>{p.weekly===0?'Unpaid':fmtD(p.weekly)+'/wk'}</div>
                    {p.weekly>0&&<div style={{fontFamily:'JetBrains Mono',fontSize:10,color:C.slateLight}}>{fmt(p.weekly*p.weeks)} total</div>}
                  </div>
                </div>
              ))}
            </div>
            {salary > 0 && (
              <div style={{background:'white',borderRadius:12,padding:mob?16:22,border:'1px solid '+C.border,boxShadow:C.shadow}}>
                <h3 style={{fontFamily:'DM Serif Display',fontSize:17,color:C.navy,marginBottom:14}}>Normal Pay vs Maternity Pay</h3>
                {[
                  {l:'Normal weekly pay',v:weekly,pct:100,color:C.navy},
                  {l:'Weeks 1-6 (90%)',v:phase1,pct:90,color:C.teal},
                  {l:'Weeks 7-39 (SMP rate)',v:SMP,pct:Math.min(100,(SMP/weekly)*100),color:'#F59E0B'},
                ].map(row=>(
                  <div key={row.l} style={{marginBottom:12}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                      <span style={{fontSize:12,color:C.textMid}}>{row.l}</span>
                      <span style={{fontFamily:'JetBrains Mono',fontSize:13,color:row.color,fontWeight:600}}>{fmtD(row.v)}</span>
                    </div>
                    <div style={{height:5,background:C.border,borderRadius:3,overflow:'hidden'}}>
                      <div style={{width:Math.min(100,row.pct)+'%',height:'100%',background:row.color,borderRadius:3,transition:'width 0.5s'}}/>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}
