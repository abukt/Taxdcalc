'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

function useW() {
  const [w, setW] = useState(typeof window !== 'undefined' ? window.innerWidth : 800);
  useEffect(() => { const f = () => setW(window.innerWidth); window.addEventListener('resize', f); return () => window.removeEventListener('resize', f); }, []);
  return w;
}
const C = {
  navy:'#0C1E3C',navyLight:'#162d52',teal:'#0D9488',tealLight:'#14B8A6',tealBg:'#F0FDFA',tealBorder:'#99F6E4',
  border:'#E2E8F0',borderDark:'#CBD5E1',white:'#FFFFFF',green:'#059669',red:'#DC2626',
  text:'#1E293B',textMid:'#475569',slate:'#64748B',slateLight:'#94A3B8',
  shadow:'0 1px 3px rgba(0,0,0,0.07),0 4px 16px rgba(0,0,0,0.04)',
};
const GS = '@import url(\'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Source+Serif+4:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap\');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}body{background:#F8F9FA;color:#1E293B;font-family:\'Source Serif 4\',Georgia,serif;-webkit-tap-highlight-color:transparent;}input[type=number]{-moz-appearance:textfield;}input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;}input[type=range]{-webkit-appearance:none;width:100%;height:4px;background:#CBD5E1;border-radius:2px;outline:none;}input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;border-radius:50%;background:#0C1E3C;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.2);}select{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\'%3E%3Cpath d=\'M1 1l5 5 5-5\' stroke=\'%2364748b\' stroke-width=\'1.5\' fill=\'none\'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;background-color:white;}@keyframes fadeUp{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}.fu{animation:fadeUp 0.4s ease both;}button{cursor:pointer;}a{text-decoration:none;color:inherit;}';
const fmt = n => '\u00A3' + Math.abs(n||0).toLocaleString('en-GB',{maximumFractionDigits:0});
const fmtD = n => '\u00A3' + (n||0).toLocaleString('en-GB',{minimumFractionDigits:2,maximumFractionDigits:2});
function calcIT(gross,pension){const ti=Math.max(0,gross-pension);let pa=12570;if(ti>100000)pa=Math.max(0,12570-(ti-100000)/2);const tx=Math.max(0,ti-pa),b1=37700,b2=75140;if(tx<=b1)return tx*0.20;if(tx<=b2)return b1*0.20+(tx-b1)*0.40;return b1*0.20+(b2-b1)*0.40+(tx-b2)*0.45;}
function calcNI(g){if(g<=12570)return 0;if(g<=50270)return(g-12570)*0.08;return(50270-12570)*0.08+(g-50270)*0.02;}
function calcLoan(g,p){const t={plan1:24990,plan2:27295,plan4:31395,plan5:25000};if(!p||p==='none'||!t[p]||g<=t[p])return 0;return(g-t[p])*0.09;}

function Nav(){const[open,setOpen]=useState(false);const mob=useW()<640;const links=[['/',   'Salary Calculator'],['/ir35','IR35'],['/nhs','NHS Bands'],['/tools','All Tools'],['/blog','Tax Guides']];
return(<nav style={{background:'#0C1E3C',position:'sticky',top:0,zIndex:100,boxShadow:'0 2px 16px rgba(0,0,0,0.25)'}}><div style={{maxWidth:1100,margin:'0 auto',padding:'0 20px',height:56,display:'flex',alignItems:'center',justifyContent:'space-between'}}><Link href="/" style={{display:'flex',alignItems:'center',gap:9}}><div style={{width:30,height:30,background:'linear-gradient(135deg,#0D9488,#14B8A6)',borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><span style={{color:'white',fontWeight:700,fontSize:12,fontFamily:'JetBrains Mono'}}>Tx</span></div><span style={{color:'white',fontFamily:'DM Serif Display',fontSize:17}}>Taxd<span style={{color:'#14B8A6'}}>Calc</span></span></Link>{mob?(<button onClick={()=>setOpen(!open)} style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:7,padding:'8px 10px',display:'flex',flexDirection:'column',gap:4}}>{[0,1,2].map(i=><span key={i} style={{display:'block',width:18,height:2,background:'white',borderRadius:1,transition:'all 0.2s',transform:open&&i===0?'rotate(45deg) translate(4px,4px)':open&&i===2?'rotate(-45deg) translate(4px,-4px)':'none',opacity:open&&i===1?0:1}}/>)}</button>):(<div style={{display:'flex',gap:2,alignItems:'center'}}>{links.map(([href,label])=>(<Link key={href} href={href} style={{padding:'7px 13px',borderRadius:6,background:'transparent',color:'rgba(255,255,255,0.6)',fontSize:13,fontFamily:'Source Serif 4'}}>{label}</Link>))}<span style={{fontSize:11,color:'#14B8A6',fontFamily:'JetBrains Mono',background:'rgba(13,148,136,0.15)',padding:'3px 9px',borderRadius:4,border:'1px solid rgba(20,184,166,0.3)',marginLeft:8}}>2026-27</span></div>)}</div>{mob&&open&&(<div style={{background:'#162d52',borderTop:'1px solid rgba(255,255,255,0.08)',padding:'6px 0 12px'}}>{links.map(([href,label])=>(<Link key={href} href={href} onClick={()=>setOpen(false)} style={{display:'block',padding:'12px 24px',color:'rgba(255,255,255,0.65)',fontSize:14,fontFamily:'Source Serif 4'}}>{label}</Link>))}</div>)}</nav>);}
function Footer(){return(<footer style={{background:'#070D1C',padding:'24px 20px',borderTop:'1px solid rgba(255,255,255,0.05)',marginTop:48}}><div style={{maxWidth:1100,margin:'0 auto',display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:14,alignItems:'center'}}><Link href="/" style={{display:'flex',alignItems:'center',gap:8}}><div style={{width:26,height:26,background:'linear-gradient(135deg,#0D9488,#14B8A6)',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{color:'white',fontWeight:700,fontSize:11,fontFamily:'JetBrains Mono'}}>Tx</span></div><span style={{color:'white',fontFamily:'DM Serif Display',fontSize:15}}>Taxd<span style={{color:'#14B8A6'}}>Calc</span></span></Link><span style={{fontSize:11,color:'rgba(255,255,255,0.2)',fontFamily:'JetBrains Mono'}}>Updated April 2026 - 2026-27</span><span style={{fontSize:11,color:'rgba(255,255,255,0.18)',maxWidth:280,lineHeight:1.6}}>For guidance only. Always consult HMRC or a qualified adviser.</span></div></footer>);}

export default function HourlyPage() {
  const mob = useW() < 640;
  const [hourly, setHourly] = useState(18);
  const [hours, setHours] = useState(37.5);
  const [pension, setPension] = useState(5);
  const [loan, setLoan] = useState('none');
  const annual = hourly * hours * 52;
  const p = annual * (pension / 100);
  const it = calcIT(annual, p), ni = calcNI(annual), sl = calcLoan(annual, loan);
  const th = annual - it - ni - sl - p;
  const netHourly = hours > 0 ? th / (hours * 52) : 0;

  return (
    <>
      <style>{GS}</style>
      <Nav/>
      <div style={{background:'linear-gradient(135deg,#0C1E3C,#1e3d6e)',padding:mob?'36px 20px 64px':'44px 24px 72px',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:-50,right:-50,width:220,height:220,borderRadius:'50%',background:'rgba(13,148,136,0.07)',pointerEvents:'none'}}/>
        <div style={{display:'inline-block',background:'rgba(13,148,136,0.15)',border:'1px solid rgba(20,184,166,0.3)',borderRadius:20,padding:'4px 13px',fontSize:11,color:'#14B8A6',marginBottom:13,fontFamily:'JetBrains Mono'}}>Hourly Rate Calculator</div>
        <h1 style={{fontFamily:'DM Serif Display',fontSize:mob?26:42,color:'white',marginBottom:10,letterSpacing:'-0.02em'}}>
          Hourly Rate<br/><em style={{color:'#14B8A6'}}>Take-Home Calculator</em>
        </h1>
        <p style={{color:'rgba(255,255,255,0.5)',fontSize:mob?13:15,maxWidth:440,margin:'0 auto'}}>Convert your hourly wage to annual salary and see your exact take-home pay after tax and NI.</p>
      </div>
      <div style={{maxWidth:960,margin:mob?'-28px 0 0':'-34px auto 0',padding:mob?'0 16px 48px':'0 24px 56px'}}>
        <Link href="/" style={{display:'inline-flex',alignItems:'center',gap:8,background:C.navy,color:'white',padding:'10px 18px',borderRadius:8,fontSize:13,fontWeight:700,marginBottom:20}}>← Back to Salary Calculator</Link>
        <div style={{display:'grid',gridTemplateColumns:mob?'1fr':'minmax(280px,380px) 1fr',gap:20,alignItems:'start'}}>
          <div style={{background:'white',borderRadius:14,padding:mob?20:26,boxShadow:C.shadow,border:'1px solid '+C.border}} className="fu">
            <h2 style={{fontFamily:'DM Serif Display',fontSize:19,color:C.navy,marginBottom:20}}>Your Hours</h2>
            {/* Hourly rate */}
            <div style={{marginBottom:20}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:7}}>
                <label style={{fontSize:13,fontWeight:600,color:C.navyLight}}>Hourly Rate</label>
                <span style={{fontSize:11,color:C.slate}}>Gross, before tax</span>
              </div>
              <div style={{position:'relative'}}>
                <span style={{position:'absolute',left:13,top:'50%',transform:'translateY(-50%)',color:C.slate,fontSize:15,fontWeight:600,fontFamily:'JetBrains Mono',pointerEvents:'none'}}>{'\u00A3'}</span>
                <input type="number" value={hourly} onChange={e=>setHourly(Math.max(0,Number(e.target.value)))} min={0} max={500}
                  style={{width:'100%',padding:'13px 14px 13px 28px',border:'1.5px solid '+C.borderDark,borderRadius:8,fontSize:16,fontFamily:'JetBrains Mono',fontWeight:500,color:C.navy,background:'white',outline:'none'}}
                  onFocus={e=>e.target.style.borderColor=C.teal} onBlur={e=>e.target.style.borderColor=C.borderDark}/>
              </div>
            </div>
            {/* Sliders */}
            {[
              {label:'Hours per week',value:hours,setValue:setHours,min:1,max:60,step:0.5,fmt:v=>v+' hrs'},
              {label:'Pension contribution',value:pension,setValue:setPension,min:0,max:30,step:0.5,fmt:v=>v+'%'},
            ].map(s=>(
              <div key={s.label} style={{marginBottom:22}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
                  <label style={{fontSize:13,fontWeight:600,color:C.navyLight}}>{s.label}</label>
                  <span style={{fontFamily:'JetBrains Mono',fontSize:14,color:C.teal,fontWeight:600}}>{s.fmt(s.value)}</span>
                </div>
                <input type="range" min={s.min} max={s.max} step={s.step} value={s.value} onChange={e=>s.setValue(Number(e.target.value))}/>
                <div style={{display:'flex',justifyContent:'space-between',marginTop:4}}>
                  <span style={{fontSize:11,color:C.slateLight}}>{s.fmt(s.min)}</span>
                  <span style={{fontSize:11,color:C.slateLight}}>{s.fmt(s.max)}</span>
                </div>
              </div>
            ))}
            {/* Student loan */}
            <div style={{marginBottom:20}}>
              <label style={{display:'block',fontSize:13,fontWeight:600,color:C.navyLight,marginBottom:7}}>Student Loan Plan</label>
              <select value={loan} onChange={e=>setLoan(e.target.value)} style={{width:'100%',padding:'12px 40px 12px 14px',border:'1.5px solid '+C.borderDark,borderRadius:8,fontSize:14,color:C.navy,outline:'none'}}
                onFocus={e=>e.target.style.borderColor=C.teal} onBlur={e=>e.target.style.borderColor=C.borderDark}>
                <option value="none">No student loan</option>
                <option value="plan1">Plan 1 (threshold: 24,990)</option>
                <option value="plan2">Plan 2 (threshold: 27,295)</option>
                <option value="plan4">Plan 4 Scotland (threshold: 31,395)</option>
                <option value="plan5">Plan 5 (threshold: 25,000)</option>
              </select>
            </div>
            {hourly > 0 && (
              <div style={{padding:'10px 13px',background:C.tealBg,border:'1px solid '+C.tealBorder,borderRadius:7}}>
                <div style={{fontSize:12,color:C.teal,fontWeight:600,marginBottom:2}}>Equivalent annual salary</div>
                <div style={{fontFamily:'DM Serif Display',fontSize:22,color:C.navy}}>{fmt(annual)}</div>
                <div style={{fontSize:11,color:'#0f766e',marginTop:2}}>{hours} hrs/wk x 52 weeks x {'\u00A3'}{hourly}/hr</div>
              </div>
            )}
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:14}} className="fu">
            <div style={{background:'linear-gradient(135deg,#0C1E3C,#1e3d6e)',borderRadius:14,padding:mob?20:26,boxShadow:'0 4px 24px rgba(12,30,60,0.3)',position:'relative',overflow:'hidden'}}>
              <div style={{position:'absolute',top:-20,right:-20,width:120,height:120,borderRadius:'50%',background:'rgba(13,148,136,0.12)',pointerEvents:'none'}}/>
              <div style={{fontSize:10,color:'rgba(255,255,255,0.4)',letterSpacing:'0.12em',textTransform:'uppercase',fontFamily:'JetBrains Mono',marginBottom:6}}>Annual Take-Home Pay</div>
              <div style={{fontFamily:'DM Serif Display',fontSize:mob?36:50,color:'white',lineHeight:1}}>{fmt(th)}</div>
              <div style={{fontSize:13,color:'rgba(255,255,255,0.45)',fontFamily:'JetBrains Mono',marginTop:5}}>{fmtD(th/12)} per month</div>
              <div style={{marginTop:14,display:'flex',alignItems:'center',gap:10}}>
                <div style={{flex:1,height:4,background:'rgba(255,255,255,0.08)',borderRadius:2,overflow:'hidden'}}>
                  <div style={{width:annual>0?((th/annual)*100)+'%':'0%',height:'100%',background:'linear-gradient(90deg,#0D9488,#14B8A6)',borderRadius:2,transition:'width 0.5s'}}/>
                </div>
                <span style={{fontSize:12,color:'#14B8A6',fontFamily:'JetBrains Mono',fontWeight:600,flexShrink:0}}>{annual>0?((th/annual)*100).toFixed(1):0}% kept</span>
              </div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              {[['Gross hourly',fmt(hourly)],['Net hourly',fmtD(netHourly)],['Monthly gross',fmt(annual/12)],['Monthly net',fmt(th/12)]].map(([l,v])=>(
                <div key={l} style={{background:'white',border:'1px solid '+C.border,borderRadius:10,padding:'14px 16px',boxShadow:C.shadow}}>
                  <div style={{fontSize:10,color:C.slate,letterSpacing:'0.08em',textTransform:'uppercase',fontWeight:600,marginBottom:5,fontFamily:'JetBrains Mono'}}>{l}</div>
                  <div style={{fontFamily:'DM Serif Display',fontSize:mob?20:24,color:C.navy,lineHeight:1}}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{background:'white',borderRadius:12,padding:mob?16:22,border:'1px solid '+C.border,boxShadow:C.shadow}}>
              <h3 style={{fontFamily:'DM Serif Display',fontSize:17,color:C.navy,marginBottom:14}}>Annual Deductions</h3>
              {[
                {l:'Gross salary',v:annual,color:C.navy},
                {l:'Income Tax',v:it,color:C.red,neg:true},
                {l:'National Insurance',v:ni,color:'#F59E0B',neg:true},
                sl>0&&{l:'Student Loan',v:sl,color:'#6366F1',neg:true},
                p>0&&{l:'Pension',v:p,color:'#14B8A6',neg:true},
                {l:'Take-home',v:th,color:C.teal,bold:true},
              ].filter(Boolean).map(row=>(
                <div key={row.l} style={{display:'flex',justifyContent:'space-between',padding:'9px 0',borderBottom:'1px solid '+C.border}}>
                  <span style={{fontSize:13,color:row.bold?C.text:C.textMid,fontWeight:row.bold?700:400}}>{row.l}</span>
                  <span style={{fontFamily:'JetBrains Mono',fontSize:12,color:row.color,fontWeight:row.bold?700:400}}>{row.neg?'-':''}{fmt(row.v)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}
