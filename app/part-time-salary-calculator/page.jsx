'use client';
import { useState, useEffect, useRef } from 'react';

// ── Embeddable TaxdCalc Widget ────────────────────────────────────────────────
// Usage: <iframe src="https://taxdcal.co.uk/embed" width="280" height="480"
//          style="border:none;border-radius:12px;" title="UK Salary Calculator">
//        </iframe>
//
// Also available with pre-filled salary:
// <iframe src="https://taxdcal.co.uk/embed?salary=45000" ...>

function calcIT(g,p=0){const ti=Math.max(0,g-p);let pa=12570;if(ti>100000)pa=Math.max(0,12570-(ti-100000)/2);const tx=Math.max(0,ti-pa);const b1=Math.min(tx,37700),b2=Math.min(Math.max(0,tx-b1),74870),b3=Math.max(0,tx-b1-b2);return b1*0.20+b2*0.40+b3*0.45;}
function calcNI(g){if(g<=12570)return 0;return(Math.min(g,50270)-12570)*0.08+Math.max(0,g-50270)*0.02;}
function calc(g,p){const pen=g*(p/100),it=calcIT(g,pen),ni=calcNI(g),th=g-it-ni-pen;return{th,mo:th/12,it,ni,pen};}
const fmt=n=>'\u00A3'+Math.round(n||0).toLocaleString('en-GB');
const fmtD=n=>'\u00A3'+(n||0).toLocaleString('en-GB',{minimumFractionDigits:2,maximumFractionDigits:2});

function AnimNum({val,f}){
  const fn=f||fmt;
  const[d,setD]=useState(val);
  const p=useRef(val);
  useEffect(()=>{
    const s=p.current,e=val,diff=e-s;
    if(Math.abs(diff)<1){setD(e);p.current=e;return;}
    const dur=300,t0=performance.now();let raf;
    const step=now=>{const t=Math.min(1,(now-t0)/dur),ease=t<0.5?2*t*t:-1+(4-2*t)*t;setD(s+diff*ease);if(t<1)raf=requestAnimationFrame(step);else{setD(e);p.current=e;}};
    raf=requestAnimationFrame(step);return()=>cancelAnimationFrame(raf);
  },[val]);
  return<span>{fn(d)}</span>;
}

export default function EmbedWidget(){
  const[salary,setSalary]=useState('');
  const[pension,setPension]=useState(5);
  const[copied,setCopied]=useState(false);

  // Read pre-filled salary from URL params
  useEffect(()=>{
    if(typeof window==='undefined')return;
    const p=new URLSearchParams(window.location.search);
    if(p.get('salary'))setSalary(p.get('salary'));
  },[]);

  const g=Math.max(0,Number(salary)||0);
  const r=g>0?calc(g,pension):null;

  const WS=`
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
    body{background:#0C1E3C;margin:0;padding:0;font-family:'Segoe UI',system-ui,sans-serif;}
    input[type=number]{-moz-appearance:textfield;}
    input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;}
    input[type=range]{-webkit-appearance:none;width:100%;height:3px;background:rgba(255,255,255,0.15);border-radius:2px;outline:none;}
    input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:white;box-shadow:0 1px 4px rgba(0,0,0,0.3);}
    button{cursor:pointer;font-family:inherit;}
    a{text-decoration:none;}
  `;

  return(
    <>
      <style>{WS}</style>
      <div style={{background:'linear-gradient(135deg,#0C1E3C,#162d52)',minHeight:'100vh',padding:16,display:'flex',flexDirection:'column',gap:12}}>

        {/* Header */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <a href="https://taxdcal.co.uk" target="_blank" rel="noreferrer" style={{display:'flex',alignItems:'center',gap:7}}>
            <div style={{width:24,height:24,background:'linear-gradient(135deg,#0D9488,#14B8A6)',borderRadius:5,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <span style={{color:'white',fontWeight:700,fontSize:10}}>Tx</span>
            </div>
            <span style={{color:'white',fontSize:14,fontWeight:700}}>TaxdCalc</span>
          </a>
          <span style={{fontSize:10,color:'rgba(255,255,255,0.3)'}}>2026-27</span>
        </div>

        {/* Salary input */}
        <div style={{background:'rgba(255,255,255,0.06)',borderRadius:10,padding:'12px 14px',border:'1px solid rgba(255,255,255,0.1)'}}>
          <div style={{fontSize:10,color:'rgba(255,255,255,0.45)',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:7}}>Annual Salary</div>
          <div style={{position:'relative'}}>
            <span style={{position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',color:'rgba(255,255,255,0.5)',fontSize:15,fontWeight:700}}>£</span>
            <input type="number" inputMode="decimal" value={salary} placeholder="45000"
              onChange={e=>setSalary(e.target.value)}
              style={{width:'100%',padding:'10px 12px 10px 26px',background:'rgba(255,255,255,0.08)',border:'1.5px solid rgba(255,255,255,0.15)',borderRadius:7,fontSize:18,fontWeight:700,color:'white',outline:'none',letterSpacing:'0.02em'}}
              onFocus={e=>e.target.style.borderColor='#14B8A6'}
              onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.15)'}/>
          </div>
        </div>

        {/* Pension slider */}
        <div style={{background:'rgba(255,255,255,0.04)',borderRadius:10,padding:'11px 14px',border:'1px solid rgba(255,255,255,0.08)'}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
            <span style={{fontSize:10,color:'rgba(255,255,255,0.45)',letterSpacing:'0.1em',textTransform:'uppercase'}}>Pension</span>
            <span style={{fontSize:12,color:'#14B8A6',fontWeight:700}}>{pension}%</span>
          </div>
          <input type="range" min={0} max={20} step={0.5} value={pension} onChange={e=>setPension(Number(e.target.value))}/>
        </div>

        {/* Result */}
        {r?(
          <>
            <div style={{background:'rgba(13,148,136,0.15)',borderRadius:12,padding:'16px 14px',border:'1px solid rgba(20,184,166,0.25)',textAlign:'center'}}>
              <div style={{fontSize:10,color:'rgba(255,255,255,0.4)',letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:6}}>Annual Take-Home</div>
              <div style={{fontSize:34,fontWeight:800,color:'#14B8A6',lineHeight:1,letterSpacing:'-0.02em'}}>
                <AnimNum val={r.th}/>
              </div>
              <div style={{fontSize:13,color:'rgba(255,255,255,0.5)',marginTop:5}}>
                <AnimNum val={r.mo} f={fmtD}/> per month
              </div>
            </div>

            {/* Mini breakdown */}
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              {[['Income Tax',r.it,'#F87171'],['Nat. Insurance',r.ni,'#FCA5A5'],r.pen>0?['Pension',r.pen,'#34D399']:null].filter(Boolean).map(([l,v,cl])=>(
                <div key={l} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 12px',background:'rgba(255,255,255,0.04)',borderRadius:7}}>
                  <span style={{fontSize:12,color:'rgba(255,255,255,0.55)'}}>{l}</span>
                  <span style={{fontSize:12,fontWeight:700,color:cl}}>-{fmt(v)}</span>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div style={{height:4,background:'rgba(255,255,255,0.08)',borderRadius:2,overflow:'hidden'}}>
              <div style={{width:`${(r.th/g*100).toFixed(1)}%`,height:'100%',background:'linear-gradient(90deg,#0D9488,#14B8A6)',transition:'width 0.4s ease'}}/>
            </div>
            <div style={{fontSize:11,color:'rgba(255,255,255,0.35)',textAlign:'center'}}>{(r.th/g*100).toFixed(1)}% of gross salary kept</div>
          </>
        ):(
          <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(255,255,255,0.25)',fontSize:13,textAlign:'center',padding:'20px 0'}}>
            Enter your salary above to calculate take-home pay
          </div>
        )}

        {/* Footer CTA */}
        <a href={`https://taxdcal.co.uk${g>0?`?salary=${g}&pension=${pension}`:''}`} target="_blank" rel="noreferrer"
          style={{display:'block',textAlign:'center',padding:'10px',background:'rgba(255,255,255,0.06)',borderRadius:8,border:'1px solid rgba(255,255,255,0.08)',color:'rgba(255,255,255,0.45)',fontSize:11}}>
          Full calculator with Scotland, tax code & student loans → taxdcal.co.uk
        </a>
      </div>
    </>
  );
}
