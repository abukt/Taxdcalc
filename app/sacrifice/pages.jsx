'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

function useW(){const[w,setW]=useState(typeof window!=='undefined'?window.innerWidth:800);useEffect(()=>{const f=()=>setW(window.innerWidth);window.addEventListener('resize',f);return()=>window.removeEventListener('resize',f);},[]);return w;}
const C={navy:'#0C1E3C',navyLight:'#162d52',teal:'#0D9488',tealLight:'#14B8A6',tealBg:'#F0FDFA',tealBorder:'#99F6E4',border:'#E2E8F0',borderDark:'#CBD5E1',white:'#FFFFFF',green:'#059669',red:'#DC2626',text:'#1E293B',textMid:'#475569',slate:'#64748B',slateLight:'#94A3B8',shadow:'0 1px 3px rgba(0,0,0,0.07),0 4px 16px rgba(0,0,0,0.04)'};
const GS='@import url(\'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Source+Serif+4:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap\');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}body{background:#F8F9FA;color:#1E293B;font-family:\'Source Serif 4\',Georgia,serif;-webkit-tap-highlight-color:transparent;}input[type=number]{-moz-appearance:textfield;}input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;}input[type=range]{-webkit-appearance:none;width:100%;height:4px;background:#CBD5E1;border-radius:2px;outline:none;}input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;border-radius:50%;background:#0C1E3C;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.2);}@keyframes fadeUp{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}.fu{animation:fadeUp 0.4s ease both;}button{cursor:pointer;}a{text-decoration:none;color:inherit;}';
const fmt=n=>'\u00A3'+Math.abs(n||0).toLocaleString('en-GB',{maximumFractionDigits:0});
const fmtD=n=>'\u00A3'+(n||0).toLocaleString('en-GB',{minimumFractionDigits:2,maximumFractionDigits:2});
function calcIT(gross){let pa=12570;if(gross>100000)pa=Math.max(0,12570-(gross-100000)/2);const tx=Math.max(0,gross-pa),b1=37700,b2=75140;if(tx<=b1)return tx*0.20;if(tx<=b2)return b1*0.20+(tx-b1)*0.40;return b1*0.20+(b2-b1)*0.40+(tx-b2)*0.45;}
function calcNI(g){if(g<=12570)return 0;if(g<=50270)return(g-12570)*0.08;return(50270-12570)*0.08+(g-50270)*0.02;}
function Nav(){const[open,setOpen]=useState(false);const mob=useW()<640;const links=[['/',   'Salary Calculator'],['/ir35','IR35'],['/nhs','NHS Bands'],['/tools','All Tools'],['/blog','Tax Guides']];return(<nav style={{background:'#0C1E3C',position:'sticky',top:0,zIndex:100,boxShadow:'0 2px 16px rgba(0,0,0,0.25)'}}><div style={{maxWidth:1100,margin:'0 auto',padding:'0 20px',height:56,display:'flex',alignItems:'center',justifyContent:'space-between'}}><Link href="/" style={{display:'flex',alignItems:'center',gap:9}}><div style={{width:30,height:30,background:'linear-gradient(135deg,#0D9488,#14B8A6)',borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><span style={{color:'white',fontWeight:700,fontSize:12,fontFamily:'JetBrains Mono'}}>Tx</span></div><span style={{color:'white',fontFamily:'DM Serif Display',fontSize:17}}>Taxd<span style={{color:'#14B8A6'}}>Calc</span></span></Link>{mob?(<button onClick={()=>setOpen(!open)} style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:7,padding:'8px 10px',display:'flex',flexDirection:'column',gap:4}}>{[0,1,2].map(i=><span key={i} style={{display:'block',width:18,height:2,background:'white',borderRadius:1,transition:'all 0.2s',transform:open&&i===0?'rotate(45deg) translate(4px,4px)':open&&i===2?'rotate(-45deg) translate(4px,-4px)':'none',opacity:open&&i===1?0:1}}/>)}</button>):(<div style={{display:'flex',gap:2,alignItems:'center'}}>{links.map(([href,label])=>(<Link key={href} href={href} style={{padding:'7px 13px',borderRadius:6,background:'transparent',color:'rgba(255,255,255,0.6)',fontSize:13,fontFamily:'Source Serif 4'}}>{label}</Link>))}<span style={{fontSize:11,color:'#14B8A6',fontFamily:'JetBrains Mono',background:'rgba(13,148,136,0.15)',padding:'3px 9px',borderRadius:4,border:'1px solid rgba(20,184,166,0.3)',marginLeft:8}}>2026-27</span></div>)}</div>{mob&&open&&(<div style={{background:'#162d52',borderTop:'1px solid rgba(255,255,255,0.08)',padding:'6px 0 12px'}}>{links.map(([href,label])=>(<Link key={href} href={href} onClick={()=>setOpen(false)} style={{display:'block',padding:'12px 24px',color:'rgba(255,255,255,0.65)',fontSize:14,fontFamily:'Source Serif 4'}}>{label}</Link>))}</div>)}</nav>);}
function Footer(){return(<footer style={{background:'#070D1C',padding:'24px 20px',borderTop:'1px solid rgba(255,255,255,0.05)',marginTop:48}}><div style={{maxWidth:1100,margin:'0 auto',display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:14,alignItems:'center'}}><Link href="/" style={{display:'flex',alignItems:'center',gap:8}}><div style={{width:26,height:26,background:'linear-gradient(135deg,#0D9488,#14B8A6)',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{color:'white',fontWeight:700,fontSize:11,fontFamily:'JetBrains Mono'}}>Tx</span></div><span style={{color:'white',fontFamily:'DM Serif Display',fontSize:15}}>Taxd<span style={{color:'#14B8A6'}}>Calc</span></span></Link><span style={{fontSize:11,color:'rgba(255,255,255,0.2)',fontFamily:'JetBrains Mono'}}>Updated April 2026</span><span style={{fontSize:11,color:'rgba(255,255,255,0.18)',maxWidth:280,lineHeight:1.6}}>For guidance only. Consult HMRC or a qualified adviser.</span></div></footer>);}

export default function SacrificePage() {
  const mob = useW() < 640;
  const [salary, setSalary] = useState(45000);
  const [pct, setPct] = useState(5);
  const amt = salary * (pct / 100);
  const newSalary = Math.max(0, salary - amt);
  const itBefore = calcIT(salary), niBefore = calcNI(salary);
  const itAfter = calcIT(newSalary), niAfter = calcNI(newSalary);
  const taxSaving = (itBefore - itAfter);
  const niSaving = (niBefore - niAfter);
  const netCost = Math.max(0, amt - taxSaving - niSaving);
  const thBefore = salary - itBefore - niBefore;
  const thAfter = newSalary - itAfter - niAfter;

  return (
    <>
      <style>{GS}</style>
      <Nav/>
      <div style={{background:'linear-gradient(135deg,#0C1E3C,#1e3d6e)',padding:mob?'36px 20px 64px':'44px 24px 72px',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:-50,right:-50,width:220,height:220,borderRadius:'50%',background:'rgba(13,148,136,0.07)',pointerEvents:'none'}}/>
        <div style={{display:'inline-block',background:'rgba(13,148,136,0.15)',border:'1px solid rgba(20,184,166,0.3)',borderRadius:20,padding:'4px 13px',fontSize:11,color:'#14B8A6',marginBottom:13,fontFamily:'JetBrains Mono'}}>Salary Sacrifice</div>
        <h1 style={{fontFamily:'DM Serif Display',fontSize:mob?26:42,color:'white',marginBottom:10,letterSpacing:'-0.02em'}}>
          Salary Sacrifice<br/><em style={{color:'#14B8A6'}}>Pension Calculator</em>
        </h1>
        <p style={{color:'rgba(255,255,255,0.5)',fontSize:mob?13:15,maxWidth:440,margin:'0 auto'}}>See the real cost of your pension contribution after income tax and National Insurance savings.</p>
      </div>
      <div style={{maxWidth:860,margin:mob?'-28px 0 0':'-34px auto 0',padding:mob?'0 16px 48px':'0 24px 56px'}}>
        <Link href="/" style={{display:'inline-flex',alignItems:'center',gap:8,background:C.navy,color:'white',padding:'10px 18px',borderRadius:8,fontSize:13,fontWeight:700,marginBottom:20}}>← Back to Salary Calculator</Link>
        <div style={{display:'grid',gridTemplateColumns:mob?'1fr':'1fr 1fr',gap:20,alignItems:'start'}}>
          <div style={{background:'white',borderRadius:14,padding:mob?20:26,boxShadow:C.shadow,border:'1px solid '+C.border}} className="fu">
            <h2 style={{fontFamily:'DM Serif Display',fontSize:19,color:C.navy,marginBottom:20}}>Your Details</h2>
            <div style={{marginBottom:20}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:7}}>
                <label style={{fontSize:13,fontWeight:600,color:C.navyLight}}>Annual Salary</label>
                <span style={{fontSize:11,color:C.slate}}>{fmt(salary/12)}/mo</span>
              </div>
              <div style={{position:'relative'}}>
                <span style={{position:'absolute',left:13,top:'50%',transform:'translateY(-50%)',color:C.slate,fontSize:15,fontWeight:600,fontFamily:'JetBrains Mono',pointerEvents:'none'}}>{'\u00A3'}</span>
                <input type="number" value={salary} onChange={e=>setSalary(Math.max(0,Number(e.target.value)))} min={0} max={500000}
                  style={{width:'100%',padding:'13px 14px 13px 28px',border:'1.5px solid '+C.borderDark,borderRadius:8,fontSize:16,fontFamily:'JetBrains Mono',fontWeight:500,color:C.navy,background:'white',outline:'none'}}
                  onFocus={e=>e.target.style.borderColor=C.teal} onBlur={e=>e.target.style.borderColor=C.borderDark}/>
              </div>
            </div>
            <div style={{marginBottom:22}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
                <label style={{fontSize:13,fontWeight:600,color:C.navyLight}}>Sacrifice Percentage</label>
                <span style={{fontFamily:'JetBrains Mono',fontSize:14,color:C.teal,fontWeight:600}}>{pct}% = {fmt(amt)}</span>
              </div>
              <input type="range" min={1} max={30} step={0.5} value={pct} onChange={e=>setPct(Number(e.target.value))}/>
              <div style={{display:'flex',justifyContent:'space-between',marginTop:4}}>
                <span style={{fontSize:11,color:C.slateLight}}>1%</span>
                <span style={{fontSize:11,color:C.slateLight}}>30%</span>
              </div>
            </div>
            <div style={{padding:'12px 14px',background:C.tealBg,border:'1px solid '+C.tealBorder,borderRadius:8,fontSize:12,color:'#0f766e',lineHeight:1.7}}>
              Salary sacrifice reduces your gross salary before tax AND National Insurance are calculated. This saves both. A personal pension only recovers income tax. Higher rate taxpayers save significantly more.
            </div>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:14}} className="fu">
            <div style={{background:'linear-gradient(135deg,#0C1E3C,#1e3d6e)',borderRadius:14,padding:mob?20:26,boxShadow:'0 4px 24px rgba(12,30,60,0.3)'}}>
              <div style={{fontSize:10,color:'rgba(255,255,255,0.4)',letterSpacing:'0.12em',textTransform:'uppercase',fontFamily:'JetBrains Mono',marginBottom:6}}>Real Annual Cost to You</div>
              <div style={{fontFamily:'DM Serif Display',fontSize:mob?36:50,color:'white',lineHeight:1}}>{fmt(netCost)}</div>
              <div style={{fontSize:13,color:'rgba(255,255,255,0.45)',fontFamily:'JetBrains Mono',marginTop:5}}>vs {fmt(amt)} gross contribution</div>
              <div style={{marginTop:12,padding:'10px 14px',background:'rgba(13,148,136,0.15)',borderRadius:8,border:'1px solid rgba(20,184,166,0.2)'}}>
                <div style={{fontSize:11,color:'#14B8A6',fontWeight:600}}>Tax and NI saving: {fmt(taxSaving + niSaving)}/year</div>
              </div>
            </div>
            <div style={{background:'white',borderRadius:12,padding:mob?16:22,border:'1px solid '+C.border,boxShadow:C.shadow}}>
              <h3 style={{fontFamily:'DM Serif Display',fontSize:17,color:C.navy,marginBottom:14}}>Breakdown</h3>
              {[
                {l:'Gross contribution',v:amt,color:C.navy},
                {l:'Income tax saved',v:taxSaving,color:C.green,pos:true},
                {l:'NI saved',v:niSaving,color:C.green,pos:true},
                {l:'Real annual cost to you',v:netCost,color:C.teal,bold:true},
              ].map(row=>(
                <div key={row.l} style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid '+C.border}}>
                  <span style={{fontSize:13,fontWeight:row.bold?700:400,color:row.bold?C.text:C.textMid}}>{row.l}</span>
                  <span style={{fontFamily:'JetBrains Mono',fontSize:row.bold?15:13,color:row.color,fontWeight:row.bold?700:400}}>{row.pos?'+':''}{fmt(row.v)}</span>
                </div>
              ))}
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              {[['Take-home before',thBefore,C.navy],['Take-home after',thAfter,C.teal]].map(([l,v,c])=>(
                <div key={l} style={{background:'white',border:'1px solid '+C.border,borderRadius:10,padding:'14px 16px',boxShadow:C.shadow}}>
                  <div style={{fontSize:10,color:C.slate,letterSpacing:'0.08em',textTransform:'uppercase',fontWeight:600,marginBottom:5,fontFamily:'JetBrains Mono'}}>{l}</div>
                  <div style={{fontFamily:'DM Serif Display',fontSize:mob?20:24,color:c,lineHeight:1}}>{fmt(v)}</div>
                  <div style={{fontSize:10,color:C.slateLight,marginTop:3,fontFamily:'JetBrains Mono'}}>{fmtD(v/12)}/mo</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{marginTop:16,background:'#FFFBEB',border:'1px solid #FDE68A',borderRadius:10,padding:'14px 18px'}}>
          <div style={{fontSize:12,fontWeight:700,color:'#92400E',marginBottom:4}}>Important</div>
          <div style={{fontSize:12,color:'#78350F',lineHeight:1.6}}>Salary sacrifice reduces your gross salary which may affect mortgage affordability calculations, life cover, and some state benefits linked to earnings. Always check the impact before increasing contributions significantly.</div>
        </div>
      </div>
      <Footer/>
    </>
  );
}
