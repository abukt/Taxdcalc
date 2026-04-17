'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

function useW(){const[w,setW]=useState(typeof window!=='undefined'?window.innerWidth:800);useEffect(()=>{const f=()=>setW(window.innerWidth);window.addEventListener('resize',f);return()=>window.removeEventListener('resize',f);},[]);return w;}
const C={navy:'#0C1E3C',navyLight:'#162d52',teal:'#0D9488',tealLight:'#14B8A6',tealBg:'#F0FDFA',tealBorder:'#99F6E4',amber:'#D97706',amberLight:'#F59E0B',amberBg:'#FFFBEB',amberBorder:'#FDE68A',border:'#E2E8F0',borderDark:'#CBD5E1',white:'#FFFFFF',green:'#059669',red:'#DC2626',text:'#1E293B',textMid:'#475569',slate:'#64748B',slateLight:'#94A3B8',shadow:'0 1px 3px rgba(0,0,0,0.07),0 4px 16px rgba(0,0,0,0.04)'};
const GS='@import url(\'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Source+Serif+4:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap\');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}body{background:#F8F9FA;color:#1E293B;font-family:\'Source Serif 4\',Georgia,serif;-webkit-tap-highlight-color:transparent;}input[type=number]{-moz-appearance:textfield;}input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;}input[type=range]{-webkit-appearance:none;width:100%;height:4px;background:#CBD5E1;border-radius:2px;outline:none;}input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;border-radius:50%;background:#0C1E3C;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.2);}select{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\'%3E%3Cpath d=\'M1 1l5 5 5-5\' stroke=\'%2364748b\' stroke-width=\'1.5\' fill=\'none\'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;background-color:white;}@keyframes fadeUp{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}.fu{animation:fadeUp 0.4s ease both;}button{cursor:pointer;}a{text-decoration:none;color:inherit;}';
const fmt=n=>'\u00A3'+Math.abs(n||0).toLocaleString('en-GB',{maximumFractionDigits:0});
const fmtD=n=>'\u00A3'+(n||0).toLocaleString('en-GB',{minimumFractionDigits:2,maximumFractionDigits:2});
function calcIT(gross,pension){const ti=Math.max(0,gross-pension);let pa=12570;if(ti>100000)pa=Math.max(0,12570-(ti-100000)/2);const tx=Math.max(0,ti-pa),b1=37700,b2=75140;if(tx<=b1)return tx*0.20;if(tx<=b2)return b1*0.20+(tx-b1)*0.40;return b1*0.20+(b2-b1)*0.40+(tx-b2)*0.45;}
function calcNI(g){if(g<=12570)return 0;if(g<=50270)return(g-12570)*0.08;return(50270-12570)*0.08+(g-50270)*0.02;}
function calcLoan(g,p){const t={plan1:24990,plan2:27295,plan4:31395,plan5:25000};if(!p||p==='none'||!t[p]||g<=t[p])return 0;return(g-t[p])*0.09;}
function doCalc(gross,pPct,sl){const p=gross*(pPct/100),it=calcIT(gross,p),ni=calcNI(gross),loan=calcLoan(gross,sl),th=gross-it-ni-loan-p;return{gross,incomeTax:it,ni,pension:p,studentLoan:loan,takeHome:th,monthly:{takeHome:th/12}};}
function Nav(){const[open,setOpen]=useState(false);const mob=useW()<640;const links=[['/',   'Salary Calculator'],['/ir35','IR35'],['/nhs','NHS Bands'],['/tools','All Tools'],['/blog','Tax Guides']];return(<nav style={{background:'#0C1E3C',position:'sticky',top:0,zIndex:100,boxShadow:'0 2px 16px rgba(0,0,0,0.25)'}}><div style={{maxWidth:1100,margin:'0 auto',padding:'0 20px',height:56,display:'flex',alignItems:'center',justifyContent:'space-between'}}><Link href="/" style={{display:'flex',alignItems:'center',gap:9}}><div style={{width:30,height:30,background:'linear-gradient(135deg,#0D9488,#14B8A6)',borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><span style={{color:'white',fontWeight:700,fontSize:12,fontFamily:'JetBrains Mono'}}>Tx</span></div><span style={{color:'white',fontFamily:'DM Serif Display',fontSize:17}}>Taxd<span style={{color:'#14B8A6'}}>Calc</span></span></Link>{mob?(<button onClick={()=>setOpen(!open)} style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:7,padding:'8px 10px',display:'flex',flexDirection:'column',gap:4}}>{[0,1,2].map(i=><span key={i} style={{display:'block',width:18,height:2,background:'white',borderRadius:1,transition:'all 0.2s',transform:open&&i===0?'rotate(45deg) translate(4px,4px)':open&&i===2?'rotate(-45deg) translate(4px,-4px)':'none',opacity:open&&i===1?0:1}}/>)}</button>):(<div style={{display:'flex',gap:2,alignItems:'center'}}>{links.map(([href,label])=>(<Link key={href} href={href} style={{padding:'7px 13px',borderRadius:6,background:'transparent',color:'rgba(255,255,255,0.6)',fontSize:13,fontFamily:'Source Serif 4'}}>{label}</Link>))}<span style={{fontSize:11,color:'#14B8A6',fontFamily:'JetBrains Mono',background:'rgba(13,148,136,0.15)',padding:'3px 9px',borderRadius:4,border:'1px solid rgba(20,184,166,0.3)',marginLeft:8}}>2026-27</span></div>)}</div>{mob&&open&&(<div style={{background:'#162d52',borderTop:'1px solid rgba(255,255,255,0.08)',padding:'6px 0 12px'}}>{links.map(([href,label])=>(<Link key={href} href={href} onClick={()=>setOpen(false)} style={{display:'block',padding:'12px 24px',color:'rgba(255,255,255,0.65)',fontSize:14,fontFamily:'Source Serif 4'}}>{label}</Link>))}</div>)}</nav>);}
function Footer(){return(<footer style={{background:'#070D1C',padding:'24px 20px',borderTop:'1px solid rgba(255,255,255,0.05)',marginTop:48}}><div style={{maxWidth:1100,margin:'0 auto',display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:14,alignItems:'center'}}><Link href="/" style={{display:'flex',alignItems:'center',gap:8}}><div style={{width:26,height:26,background:'linear-gradient(135deg,#0D9488,#14B8A6)',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{color:'white',fontWeight:700,fontSize:11,fontFamily:'JetBrains Mono'}}>Tx</span></div><span style={{color:'white',fontFamily:'DM Serif Display',fontSize:15}}>Taxd<span style={{color:'#14B8A6'}}>Calc</span></span></Link><span style={{fontSize:11,color:'rgba(255,255,255,0.2)',fontFamily:'JetBrains Mono'}}>Updated April 2026</span><span style={{fontSize:11,color:'rgba(255,255,255,0.18)',maxWidth:280,lineHeight:1.6}}>For guidance only. Consult HMRC or a qualified adviser.</span></div></footer>);}

function JobPanel({ label, salary, setSalary, pension, setPension, loan, setLoan, result, accentColor, accentBg, accentBorder }) {
  const mob = useW() < 640;
  return (
    <div>
      <div style={{background:'white',borderRadius:14,padding:mob?18:24,boxShadow:C.shadow,border:'1px solid '+C.border,marginBottom:12}}>
        <div style={{fontFamily:'DM Serif Display',fontSize:18,color:C.navy,marginBottom:16}}>{label}</div>
        <div style={{marginBottom:18}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:7}}>
            <label style={{fontSize:13,fontWeight:600,color:C.navyLight}}>Annual Salary</label>
          </div>
          <div style={{position:'relative'}}>
            <span style={{position:'absolute',left:13,top:'50%',transform:'translateY(-50%)',color:C.slate,fontSize:15,fontWeight:600,fontFamily:'JetBrains Mono',pointerEvents:'none'}}>{'\u00A3'}</span>
            <input type="number" value={salary} onChange={e=>setSalary(Math.max(0,Number(e.target.value)))} min={0} max={500000}
              style={{width:'100%',padding:'13px 14px 13px 28px',border:'1.5px solid '+C.borderDark,borderRadius:8,fontSize:16,fontFamily:'JetBrains Mono',fontWeight:500,color:C.navy,background:'white',outline:'none'}}
              onFocus={e=>e.target.style.borderColor=accentColor} onBlur={e=>e.target.style.borderColor=C.borderDark}/>
          </div>
        </div>
        <div style={{marginBottom:18}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
            <label style={{fontSize:13,fontWeight:600,color:C.navyLight}}>Pension</label>
            <span style={{fontFamily:'JetBrains Mono',fontSize:14,color:accentColor,fontWeight:600}}>{pension}%</span>
          </div>
          <input type="range" min={0} max={20} step={0.5} value={pension} onChange={e=>setPension(Number(e.target.value))} style={{accentColor}}/>
        </div>
        <div style={{marginBottom:4}}>
          <label style={{display:'block',fontSize:13,fontWeight:600,color:C.navyLight,marginBottom:7}}>Student Loan</label>
          <select value={loan} onChange={e=>setLoan(e.target.value)} style={{width:'100%',padding:'12px 40px 12px 14px',border:'1.5px solid '+C.borderDark,borderRadius:8,fontSize:14,color:C.navy,outline:'none'}}>
            <option value="none">No student loan</option>
            <option value="plan1">Plan 1</option>
            <option value="plan2">Plan 2</option>
            <option value="plan4">Plan 4 Scotland</option>
            <option value="plan5">Plan 5</option>
          </select>
        </div>
      </div>
      <div style={{background:accentBg,border:'2px solid '+accentBorder,borderRadius:12,padding:'18px',textAlign:'center'}}>
        <div style={{fontSize:11,color:accentColor,fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:5}}>{label} Take-Home</div>
        <div style={{fontFamily:'DM Serif Display',fontSize:'clamp(24px,4vw,34px)',color:C.navy}}>{fmt(result.takeHome)}</div>
        <div style={{fontSize:12,color:C.textMid,marginTop:3,fontFamily:'JetBrains Mono'}}>{fmtD(result.monthly.takeHome)}/month</div>
      </div>
    </div>
  );
}

export default function ComparisonPage() {
  const mob = useW() < 640;
  const [aS, setAS] = useState(50000); const [aP, setAP] = useState(5); const [aL, setAL] = useState('none');
  const [bS, setBS] = useState(55000); const [bP, setBP] = useState(3); const [bL, setBL] = useState('none');
  const rA = doCalc(aS, aP, aL), rB = doCalc(bS, bP, bL);
  const diff = rB.takeHome - rA.takeHome;

  return (
    <>
      <style>{GS}</style>
      <Nav/>
      <div style={{background:'linear-gradient(135deg,#0C1E3C,#1e3d6e)',padding:mob?'36px 20px 64px':'44px 24px 72px',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:-50,right:-50,width:220,height:220,borderRadius:'50%',background:'rgba(13,148,136,0.07)',pointerEvents:'none'}}/>
        <div style={{display:'inline-block',background:'rgba(13,148,136,0.15)',border:'1px solid rgba(20,184,166,0.3)',borderRadius:20,padding:'4px 13px',fontSize:11,color:'#14B8A6',marginBottom:13,fontFamily:'JetBrains Mono'}}>Job Comparison Tool</div>
        <h1 style={{fontFamily:'DM Serif Display',fontSize:mob?26:42,color:'white',marginBottom:10,letterSpacing:'-0.02em'}}>
          Compare Two Job<br/><em style={{color:'#14B8A6'}}>Offers Side by Side</em>
        </h1>
        <p style={{color:'rgba(255,255,255,0.5)',fontSize:mob?13:15,maxWidth:480,margin:'0 auto'}}>See which offer puts more money in your pocket after income tax, NI, pension and student loan.</p>
      </div>
      <div style={{background:'#F4F6F9',padding:mob?'16px 16px 0':'18px 24px 0',maxWidth:1000,margin:'0 auto'}}>
        <Link href="/" style={{display:'inline-flex',alignItems:'center',gap:8,background:C.navy,color:'white',padding:'10px 18px',borderRadius:8,fontSize:13,fontWeight:700}}>← Back to Salary Calculator</Link>
      </div>
      <div style={{maxWidth:1000,margin:'0 auto',padding:mob?'16px 16px 48px':'16px 24px 56px'}}>
        <div style={{display:'grid',gridTemplateColumns:mob?'1fr':'1fr 1fr',gap:20,marginBottom:20}}>
          <JobPanel label="Job A" salary={aS} setSalary={setAS} pension={aP} setPension={setAP} loan={aL} setLoan={setAL} result={rA} accentColor={C.teal} accentBg={C.tealBg} accentBorder={C.tealBorder}/>
          <JobPanel label="Job B" salary={bS} setSalary={setBS} pension={bP} setPension={setBP} loan={bL} setLoan={setBL} result={rB} accentColor={C.amber} accentBg={C.amberBg} accentBorder={C.amberBorder}/>
        </div>
        <div style={{background:'white',borderRadius:14,padding:'22px 26px',boxShadow:C.shadow,border:'1px solid '+C.border,textAlign:'center',marginBottom:16}}>
          <div style={{fontSize:13,color:C.textMid,marginBottom:5}}>Difference in annual take-home pay</div>
          <div style={{fontFamily:'DM Serif Display',fontSize:mob?30:42,color:diff>=0?C.teal:C.red,lineHeight:1}}>
            {diff>=0?'+':''}{fmt(diff)}
          </div>
          <div style={{fontSize:13,color:C.slate,marginTop:6}}>{fmtD(Math.abs(diff/12))}/month difference - {diff>=0?'Job B':'Job A'} pays more after tax</div>
        </div>
        <div style={{background:'white',borderRadius:12,padding:mob?16:22,border:'1px solid '+C.border,boxShadow:C.shadow}}>
          <h3 style={{fontFamily:'DM Serif Display',fontSize:18,color:C.navy,marginBottom:14}}>Side by Side Breakdown</h3>
          <div style={{overflowX:'auto',WebkitOverflowScrolling:'touch'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:13,minWidth:340}}>
              <thead>
                <tr>
                  <th style={{textAlign:'left',padding:'8px 12px',borderBottom:'2px solid '+C.border,fontSize:11,color:C.slate,textTransform:'uppercase'}}></th>
                  <th style={{textAlign:'right',padding:'8px 12px',borderBottom:'2px solid '+C.tealBorder,color:C.teal,fontSize:13}}>Job A</th>
                  <th style={{textAlign:'right',padding:'8px 12px',borderBottom:'2px solid '+C.amberBorder,color:C.amber,fontSize:13}}>Job B</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {l:'Gross salary',va:rA.gross,vb:rB.gross},
                  {l:'Income Tax',va:rA.incomeTax,vb:rB.incomeTax,red:true},
                  {l:'National Insurance',va:rA.ni,vb:rB.ni,red:true},
                  {l:'Pension',va:rA.pension,vb:rB.pension,red:true},
                  rA.studentLoan>0||rB.studentLoan>0?{l:'Student Loan',va:rA.studentLoan,vb:rB.studentLoan,red:true}:null,
                  {l:'Annual take-home',va:rA.takeHome,vb:rB.takeHome,bold:true},
                  {l:'Monthly take-home',va:rA.monthly.takeHome,vb:rB.monthly.takeHome,bold:true},
                ].filter(Boolean).map((row,i)=>(
                  <tr key={row.l} style={{background:i%2===0?C.white:'#F8F9FA',borderBottom:'1px solid '+C.border}}>
                    <td style={{padding:'10px 12px',fontSize:13,color:row.bold?C.navy:C.textMid,fontWeight:row.bold?700:400}}>{row.l}</td>
                    <td style={{padding:'10px 12px',textAlign:'right',fontFamily:'JetBrains Mono',fontSize:12,color:row.red?C.red:row.bold?C.teal:C.text,fontWeight:row.bold?700:400}}>{row.red?'-':''}{fmt(row.va)}</td>
                    <td style={{padding:'10px 12px',textAlign:'right',fontFamily:'JetBrains Mono',fontSize:12,color:row.red?C.red:row.bold?C.amber:C.text,fontWeight:row.bold?700:400}}>{row.red?'-':''}{fmt(row.vb)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div style={{marginTop:14,background:'#FFFBEB',border:'1px solid #FDE68A',borderRadius:10,padding:'13px 17px'}}>
          <div style={{fontSize:12,color:'#78350F',lineHeight:1.6}}>This comparison covers salary, pension and student loan only. It does not account for bonus potential, holiday allowance, health insurance, share schemes, location costs or career progression. Always consider the full package.</div>
        </div>
      </div>
      <Footer/>
    </>
  );
}
