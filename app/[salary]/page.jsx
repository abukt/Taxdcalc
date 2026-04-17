'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

function useW(){const[w,setW]=useState(typeof window!=='undefined'?window.innerWidth:800);useEffect(()=>{const f=()=>setW(window.innerWidth);window.addEventListener('resize',f);return()=>window.removeEventListener('resize',f);},[]);return w;}

// ── TAX 2026-27 ───────────────────────────────────────────────────────────────
const TRAP_START=100000,TRAP_END=125140,HICBC_S=60000,HICBC_E=80000,P5=25000;
function calcIT(gross,pen=0,scot=false){
  const ti=Math.max(0,gross-pen);let pa=12570;
  if(ti>TRAP_START)pa=Math.max(0,12570-Math.floor((ti-TRAP_START)/2));
  const tx=Math.max(0,ti-pa);
  if(!scot){const b1=Math.min(tx,37700),b2=Math.min(Math.max(0,tx-b1),74870),b3=Math.max(0,tx-b1-b2);return b1*0.20+b2*0.40+b3*0.45;}
  const bands=[[0,3967,0.19],[3967,16956,0.20],[16956,31092,0.21],[31092,62430,0.42],[62430,112570,0.45],[112570,1e9,0.48]];
  let tax=0,rem=tx;for(const[,hi,r]of bands){if(rem<=0)break;const lo=bands.indexOf([0,hi,r])||0;const prev=bands[bands.indexOf([0,hi,r])-1];const start=prev?prev[1]:0;const w=Math.min(rem,hi-start);if(w>0){tax+=w*r;rem-=w;}}
  // simplified Scotland calc
  const sb=[[0,3967,0.19],[3967,16956,0.20],[16956,31092,0.21],[31092,62430,0.42],[62430,112570,0.45],[112570,1e9,0.48]];
  let stax=0,srem=tx;for(const[lo,hi,rate]of sb){if(srem<=0)break;const avail=Math.max(0,Math.min(tx,hi)-lo);const used=Math.min(srem,avail);stax+=used*rate;srem-=used;}
  return Math.max(0,stax);
}
function calcNI(g){if(g<=12570)return 0;return(Math.min(g,50270)-12570)*0.08+Math.max(0,g-50270)*0.02;}
function calcLoan(g,p){const t={plan1:24990,plan2:27295,plan4:31395,plan5:P5};if(!p||p==='none'||!t[p]||g<=t[p])return 0;return(g-t[p])*0.09;}
function calc(gross,pPct,sl,scot=false){
  const p=gross*(pPct/100),it=calcIT(gross,p,scot),ni=calcNI(gross),loan=calcLoan(gross,sl),th=gross-it-ni-loan-p;
  return{gross,incomeTax:it,ni,studentLoan:loan,pension:p,takeHome:th,monthly:{gross:gross/12,takeHome:th/12},effectiveRate:gross>0?((it+ni)/gross)*100:0};
}

// ── TRAP DETECTION ────────────────────────────────────────────────────────────
function detectTraps(gross,pPct,plan,kids){
  const pen=gross*(pPct/100),adj=gross-pen,traps=[];
  if(adj>95000&&adj<=TRAP_END){
    const inTrap=adj>TRAP_START,amt=Math.max(0,Math.min(adj,TRAP_END)-TRAP_START);
    const taxSaved=inTrap?calcIT(adj)-calcIT(TRAP_START)-amt*0.40:0;
    const niSaved=inTrap?calcNI(adj)-calcNI(Math.max(0,adj-(adj-TRAP_START))):0;
    traps.push({id:'trap60',active:inTrap,approaching:!inTrap,severity:inTrap?'critical':'warning',icon:'⚠',
      headline:inTrap?`60% effective rate — you keep only 28p of each extra pound earned`:`£${(TRAP_START-adj).toLocaleString('en-GB')} away from the 60% tax trap`,
      detail:inTrap?`Your Personal Allowance is being withdrawn (£1 per £2 over £100k). Sacrifice £${Math.round(adj-TRAP_START).toLocaleString('en-GB')} into pension to escape — saving £${Math.round(taxSaved+niSaved).toLocaleString('en-GB')} in tax.`:`At £100,000 your Personal Allowance starts being withdrawn, creating a 60% effective marginal rate. Stay below by increasing pension sacrifice.`,
      saving:Math.round(taxSaved+niSaved),action:'/sacrifice',actionLabel:'Calculate pension sacrifice'});
  }
  if(plan==='plan5'&&gross>P5){
    const annual=(gross-P5)*0.09,extra=gross>27295?annual-(gross-27295)*0.09:annual;
    traps.push({id:'plan5',active:true,severity:gross<30000?'critical':'warning',icon:'🎓',
      headline:`Plan 5: £${Math.round(annual/12).toLocaleString('en-GB')}/month repayment — 40-year write-off`,
      detail:`Plan 5 has the lowest threshold (£25,000) of any student loan. You repay £${Math.round(annual).toLocaleString('en-GB')}/year — £${Math.round(extra).toLocaleString('en-GB')} more per year than Plan 2. The 40-year write-off period means high earners may benefit from voluntary overpayments.`,
      saving:0,action:'/blog/plan-5-student-loan-take-home',actionLabel:'Plan 5 full guide'});
  }
  if(kids>0&&adj>HICBC_S){
    const cbr=[0,1331.60,2212.60,3093.60,3974.60],fullCB=cbr[Math.min(kids,4)];
    const taper=Math.min(1,(adj-HICBC_S)/(HICBC_E-HICBC_S)),charge=fullCB*taper;
    traps.push({id:'hicbc',active:true,severity:adj>75000?'critical':'warning',icon:'👶',
      headline:`Child Benefit taper: losing £${Math.round(charge).toLocaleString('en-GB')}/year — net benefit £${Math.round(fullCB-charge).toLocaleString('en-GB')}`,
      detail:`With ${kids} child${kids>1?'ren':''}, the HICBC between £60k–£80k claws back your Child Benefit. Pension sacrifice to bring income below £60,000 recovers it all.`,
      saving:Math.round(charge),action:'/sacrifice',actionLabel:'Recover Child Benefit'});
  }
  return traps;
}

// ── NHS DATA ──────────────────────────────────────────────────────────────────
const NHS=[{band:'Band 2',min:23615,max:24336,pen:5.0},{band:'Band 3',min:24336,max:25527,pen:5.0},{band:'Band 4',min:26530,max:29114,pen:6.1},{band:'Band 5',min:29970,max:36483,pen:9.8},{band:'Band 6',min:37338,max:44962,pen:10.7},{band:'Band 7',min:46148,max:52809,pen:12.5},{band:'Band 8a',min:53755,max:60504,pen:12.5},{band:'Band 8b',min:62215,max:72293,pen:13.5}];
const HCAS={none:0,fringe:1478,outer:4271,inner:5132};

// ── TEACHER DATA ──────────────────────────────────────────────────────────────
const TPY={M1:{england:32916,fringe:34398,outer:37870,inner:40317},M2:{england:34537,fringe:36025,outer:39541,inner:41965},M3:{england:36413,fringe:37934,outer:41418,inner:43853},M4:{england:38185,fringe:39700,outer:43259,inner:45816},M5:{england:40237,fringe:41764,outer:45417,inner:49039},M6:{england:45352,fringe:46839,outer:50474,inner:52300},U1:{england:47472,fringe:48913,outer:52219,inner:57632},U2:{england:49260,fringe:50699,outer:54186,inner:59772},U3:{england:51048,fringe:52490,outer:56154,inner:62496}};
function tpsPct(g){return g<32135?7.4:g<43259?8.6:g<51292?9.7:g<67415?10.2:11.7;}

// ── PAGE REGISTRY ─────────────────────────────────────────────────────────────
const VALID=[20000,22000,25000,27000,28000,30000,32000,35000,38000,40000,42000,45000,48000,50000,55000,60000,65000,70000,75000,80000,85000,90000,95000,100000,105000,110000,120000,125000,150000];
const SPECIAL={'minimum-wage-take-home':{salary:26418,label:'Minimum Wage',type:'numeric'},'nhs-band-5-take-home':{salary:29970,label:'NHS Band 5',type:'nhs'},'nhs-band-6-take-home':{salary:37338,label:'NHS Band 6',type:'nhs'},'teacher-salary-take-home':{salary:32916,label:'NQT Teacher (M1)',type:'teacher'},'graduate-salary-take-home':{salary:28000,label:'Graduate',type:'numeric'}};

// ── FORMAT ────────────────────────────────────────────────────────────────────
const fmt=n=>'\u00A3'+Math.abs(n||0).toLocaleString('en-GB',{maximumFractionDigits:0});
const fmtD=n=>'\u00A3'+(n||0).toLocaleString('en-GB',{minimumFractionDigits:2,maximumFractionDigits:2});

// ── COLOURS ───────────────────────────────────────────────────────────────────
const C={navy:'#0C1E3C',teal:'#0D9488',tealL:'#14B8A6',tealBg:'#F0FDFA',tealBd:'#99F6E4',amber:'#D97706',amberBg:'#FFFBEB',amberBd:'#FDE68A',red:'#DC2626',redBg:'#FEF2F2',redBd:'#FECACA',orange:'#EA580C',orangeBg:'#FFF7ED',orangeBd:'#FED7AA',border:'#E2E8F0',borderDk:'#CBD5E1',bg:'#F4F6F9',white:'#FFFFFF',green:'#059669',text:'#1E293B',mid:'#475569',slate:'#64748B',sl:'#94A3B8',shadow:'0 1px 3px rgba(0,0,0,0.07),0 4px 16px rgba(0,0,0,0.04)'};
const GS=`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Source+Serif+4:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}body{background:#F4F6F9;color:#1E293B;font-family:'Source Serif 4',Georgia,serif;-webkit-tap-highlight-color:transparent;}input[type=range]{-webkit-appearance:none;width:100%;height:4px;background:#CBD5E1;border-radius:2px;outline:none;}input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;border-radius:50%;background:#0C1E3C;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.2);}select{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2364748b' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;background-color:white;}@keyframes fi{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}.fi{animation:fi 0.35s ease both;}@keyframes trapPulse{0%,100%{box-shadow:0 0 0 0 rgba(220,38,38,0.25);}60%{box-shadow:0 0 0 10px rgba(220,38,38,0);}}.pulse{animation:trapPulse 2.5s infinite;}a{text-decoration:none;color:inherit;}button{cursor:pointer;font-family:inherit;}`;

function Nav(){const[open,setOpen]=useState(false);const mob=useW()<640;const links=[['/',   'Salary Calculator'],['/ir35','IR35'],['/nhs','NHS Bands'],['/tools','All Tools'],['/blog','Tax Guides']];return(<nav style={{background:C.navy,position:'sticky',top:0,zIndex:100,boxShadow:'0 2px 16px rgba(0,0,0,0.25)'}}><div style={{maxWidth:1100,margin:'0 auto',padding:'0 20px',height:56,display:'flex',alignItems:'center',justifyContent:'space-between'}}><Link href="/" style={{display:'flex',alignItems:'center',gap:9}}><div style={{width:30,height:30,background:'linear-gradient(135deg,#0D9488,#14B8A6)',borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><span style={{color:'white',fontWeight:700,fontSize:12,fontFamily:'JetBrains Mono'}}>Tx</span></div><span style={{color:'white',fontFamily:'DM Serif Display',fontSize:17}}>Taxd<span style={{color:'#14B8A6'}}>Calc</span></span></Link>{mob?(<button onClick={()=>setOpen(!open)} style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:7,padding:'8px 10px',display:'flex',flexDirection:'column',gap:4}}>{[0,1,2].map(i=><span key={i} style={{display:'block',width:18,height:2,background:'white',borderRadius:1,transition:'all 0.2s',transform:open&&i===0?'rotate(45deg) translate(4px,4px)':open&&i===2?'rotate(-45deg) translate(4px,-4px)':'none',opacity:open&&i===1?0:1}}/>)}</button>):(<div style={{display:'flex',gap:2,alignItems:'center'}}>{links.map(([href,label])=>(<Link key={href} href={href} style={{padding:'7px 13px',borderRadius:6,background:'transparent',color:'rgba(255,255,255,0.6)',fontSize:13,fontFamily:'Source Serif 4'}}>{label}</Link>))}<span style={{fontSize:11,color:'#14B8A6',fontFamily:'JetBrains Mono',background:'rgba(13,148,136,0.15)',padding:'3px 9px',borderRadius:4,border:'1px solid rgba(20,184,166,0.3)',marginLeft:8}}>2026-27</span></div>)}</div>{mob&&open&&(<div style={{background:'#162d52',borderTop:'1px solid rgba(255,255,255,0.08)',padding:'6px 0 12px'}}>{links.map(([href,label])=>(<Link key={href} href={href} onClick={()=>setOpen(false)} style={{display:'block',padding:'12px 24px',color:'rgba(255,255,255,0.65)',fontSize:14,fontFamily:'Source Serif 4'}}>{label}</Link>))}</div>)}</nav>);}
function Footer(){return(<footer style={{background:'#070D1C',padding:'24px 20px',borderTop:'1px solid rgba(255,255,255,0.05)',marginTop:24}}><div style={{maxWidth:1000,margin:'0 auto',display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:14,alignItems:'center'}}><Link href="/" style={{display:'flex',alignItems:'center',gap:8}}><div style={{width:26,height:26,background:'linear-gradient(135deg,#0D9488,#14B8A6)',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{color:'white',fontWeight:700,fontSize:11,fontFamily:'JetBrains Mono'}}>Tx</span></div><span style={{color:'white',fontFamily:'DM Serif Display',fontSize:15}}>Taxd<span style={{color:'#14B8A6'}}>Calc</span></span></Link><span style={{fontSize:11,color:'rgba(255,255,255,0.2)',fontFamily:'JetBrains Mono'}}>Updated April 2026</span><span style={{fontSize:11,color:'rgba(255,255,255,0.18)',maxWidth:280,lineHeight:1.6}}>For guidance only. Always consult HMRC or a qualified adviser.</span></div></footer>);}

// ── TRAP ALERT ────────────────────────────────────────────────────────────────
function TrapAlert({trap}){
  const[exp,setExp]=useState(false);
  const col={critical:{bg:C.redBg,bd:C.redBd,txt:C.red},warning:{bg:C.orangeBg,bd:C.orangeBd,txt:C.orange},info:{bg:C.tealBg,bd:C.tealBd,txt:C.teal}}[trap.severity]||{bg:C.tealBg,bd:C.tealBd,txt:C.teal};
  return(
    <div className={trap.severity==='critical'?'pulse':''} style={{background:col.bg,border:'1.5px solid '+col.bd,borderRadius:10,padding:'13px 15px',marginBottom:8}}>
      <div style={{display:'flex',alignItems:'flex-start',gap:10}}>
        <span style={{fontSize:17,flexShrink:0,marginTop:1}}>{trap.icon}</span>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:13,fontWeight:700,color:col.txt,marginBottom:3,lineHeight:1.4}}>{trap.headline}</div>
          {exp&&<div style={{fontSize:12,color:C.mid,lineHeight:1.65,marginBottom:8}}>{trap.detail}</div>}
          <div style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'center',marginTop:4}}>
            {trap.saving>0&&<span style={{fontSize:10,background:col.bg,color:col.txt,border:'1px solid '+col.bd,borderRadius:3,padding:'2px 7px',fontWeight:700,fontFamily:'JetBrains Mono'}}>Save up to {fmt(trap.saving)}/yr</span>}
            {trap.action&&<Link href={trap.action} style={{fontSize:11,color:col.txt,fontWeight:700,borderBottom:'1px solid '+col.bd}}>{trap.actionLabel||'Learn more'} {'>'}</Link>}
            <button onClick={()=>setExp(!exp)} style={{fontSize:11,color:C.slate,background:'none',border:'none',padding:0}}>{exp?'Less':'Why?'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── NHS PANEL ─────────────────────────────────────────────────────────────────
function NHSPanel({baseSalary}){
  const mob=useW()<640;
  const band=NHS.find(b=>baseSalary>=b.min&&baseSalary<=b.max);
  const[hcas,setHcas]=useState('none');
  if(!band)return null;
  const gross=baseSalary+(HCAS[hcas]||0);
  const r=calc(gross,band.pen,'none',false);
  return(
    <div style={{background:'white',borderRadius:12,padding:mob?16:20,border:'1px solid '+C.border,boxShadow:C.shadow,marginTop:14}}>
      <div style={{fontSize:11,fontWeight:700,color:C.teal,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:12,fontFamily:'JetBrains Mono'}}>NHS Agenda for Change — {band.band} 2026-27</div>
      <div style={{marginBottom:14}}>
        <label style={{fontSize:12,fontWeight:600,color:C.navy,display:'block',marginBottom:8}}>London Weighting (HCAS)</label>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:7}}>
          {[['none','No supplement'],['fringe','Fringe +'+fmt(HCAS.fringe)],['outer','Outer London +'+fmt(HCAS.outer)],['inner','Inner London +'+fmt(HCAS.inner)]].map(([val,label])=>(
            <button key={val} onClick={()=>setHcas(val)} style={{padding:'9px 10px',borderRadius:7,border:'1.5px solid '+(hcas===val?C.teal:C.borderDk),background:hcas===val?C.tealBg:'white',color:hcas===val?C.teal:C.mid,fontSize:12,fontWeight:hcas===val?700:400,textAlign:'left'}}>{label}</button>
          ))}
        </div>
      </div>
      <div style={{background:'linear-gradient(135deg,#0C1E3C,#1e3d6e)',borderRadius:10,padding:'16px',marginBottom:12}}>
        <div style={{fontSize:10,color:'rgba(255,255,255,0.4)',letterSpacing:'0.12em',textTransform:'uppercase',fontFamily:'JetBrains Mono',marginBottom:4}}>{band.band} Annual Take-Home{hcas!=='none'?' incl. HCAS':''}</div>
        <div style={{fontFamily:'DM Serif Display',fontSize:38,color:'white',lineHeight:1}}>{fmt(r.takeHome)}</div>
        <div style={{fontSize:12,color:'rgba(255,255,255,0.45)',fontFamily:'JetBrains Mono',marginTop:4}}>{fmtD(r.monthly.takeHome)}/month {'·'} NHS Pension {band.pen}%</div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:7}}>
        {[['Gross',fmt(gross)],['Income Tax','-'+fmt(r.incomeTax)],['Nat. Insurance','-'+fmt(r.ni)],['NHS Pension '+band.pen+'%','-'+fmt(r.pension)]].map(([l,v])=>(
          <div key={l} style={{background:C.bg,borderRadius:7,padding:'9px 11px'}}>
            <div style={{fontSize:10,color:C.slate,marginBottom:2,fontFamily:'JetBrains Mono'}}>{l}</div>
            <div style={{fontSize:13,fontWeight:700,color:v.startsWith('-')?C.red:C.navy,fontFamily:'JetBrains Mono'}}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{marginTop:10,padding:'10px 12px',background:C.tealBg,border:'1px solid '+C.tealBd,borderRadius:7,fontSize:11,color:'#0f766e',lineHeight:1.6}}>NHS pension contribution of {band.pen}% for this band. HCAS supplements are pensionable. The NHS pension is a defined benefit scheme — significantly more valuable than the contribution rate suggests.</div>
    </div>
  );
}

// ── TEACHER PANEL ─────────────────────────────────────────────────────────────
function TeacherPanel(){
  const mob=useW()<640;
  const[region,setRegion]=useState('england');
  const[pp,setPP]=useState('M1');
  const scale=TPY[pp];if(!scale)return null;
  const gross=scale[region]||scale.england;
  const tps=tpsPct(gross);
  const r=calc(gross,tps,'none',false);
  return(
    <div style={{background:'white',borderRadius:12,padding:mob?16:20,border:'1px solid '+C.border,boxShadow:C.shadow,marginTop:14}}>
      <div style={{fontSize:11,fontWeight:700,color:'#7C3AED',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:12,fontFamily:'JetBrains Mono'}}>Teacher Pay Scale — Teachers Pension Scheme 2026-27</div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:14}}>
        <div>
          <label style={{fontSize:12,fontWeight:600,color:C.navy,display:'block',marginBottom:8}}>Region</label>
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            {[['england','England (Base)'],['fringe','London Fringe'],['outer','Outer London'],['inner','Inner London']].map(([val,label])=>(
              <button key={val} onClick={()=>setRegion(val)} style={{padding:'8px 10px',borderRadius:7,border:'1.5px solid '+(region===val?'#7C3AED':C.borderDk),background:region===val?'#F5F3FF':'white',color:region===val?'#7C3AED':C.mid,fontSize:12,fontWeight:region===val?700:400,textAlign:'left'}}>{label}</button>
            ))}
          </div>
        </div>
        <div>
          <label style={{fontSize:12,fontWeight:600,color:C.navy,display:'block',marginBottom:8}}>Pay Point</label>
          <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
            {Object.keys(TPY).map(p=>(<button key={p} onClick={()=>setPP(p)} style={{padding:'6px 10px',borderRadius:5,border:'1.5px solid '+(pp===p?'#7C3AED':C.border),background:pp===p?'#F5F3FF':'white',color:pp===p?'#7C3AED':C.mid,fontSize:11,fontWeight:pp===p?700:400,fontFamily:'JetBrains Mono'}}>{p}</button>))}
          </div>
        </div>
      </div>
      <div style={{background:'linear-gradient(135deg,#4C1D95,#6D28D9)',borderRadius:10,padding:'16px',marginBottom:12}}>
        <div style={{fontSize:10,color:'rgba(255,255,255,0.4)',letterSpacing:'0.12em',textTransform:'uppercase',fontFamily:'JetBrains Mono',marginBottom:4}}>{pp} {region.charAt(0).toUpperCase()+region.slice(1)} — Annual Take-Home</div>
        <div style={{fontFamily:'DM Serif Display',fontSize:38,color:'white',lineHeight:1}}>{fmt(r.takeHome)}</div>
        <div style={{fontSize:12,color:'rgba(255,255,255,0.45)',fontFamily:'JetBrains Mono',marginTop:4}}>{fmtD(r.monthly.takeHome)}/month {'·'} TPS {tps}%</div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:7}}>
        {[['Gross',fmt(gross)],['Income Tax','-'+fmt(r.incomeTax)],['Nat. Insurance','-'+fmt(r.ni)],['TPS Pension '+tps+'%','-'+fmt(r.pension)]].map(([l,v])=>(
          <div key={l} style={{background:C.bg,borderRadius:7,padding:'9px 11px'}}>
            <div style={{fontSize:10,color:C.slate,marginBottom:2,fontFamily:'JetBrains Mono'}}>{l}</div>
            <div style={{fontSize:13,fontWeight:700,color:v.startsWith('-')?C.red:C.navy,fontFamily:'JetBrains Mono'}}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{marginTop:10,padding:'10px 12px',background:'#F5F3FF',border:'1px solid #DDD6FE',borderRadius:7,fontSize:11,color:'#5B21B6',lineHeight:1.6}}>TPS contribution of {tps}% for this salary range. Teachers Pension Scheme is a defined benefit scheme. London pay scales are set by the STRB and include Inner/Outer London Allowances.</div>
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function SalaryPage(){
  const params=useParams();const slug=params.salary;const mob=useW()<768;
  const special=SPECIAL[slug];
  const baseSalary=special?special.salary:(()=>{const m=slug&&slug.match(/^(\d+)-salary/);if(!m)return null;const n=parseInt(m[1],10);return VALID.includes(n)?n:null;})();

  if(!baseSalary){return(<><style>{GS}</style><Nav/><div style={{maxWidth:680,margin:'60px auto',padding:'0 24px',textAlign:'center'}}><h1 style={{fontFamily:'DM Serif Display',fontSize:32,color:C.navy,marginBottom:16}}>Page not found</h1><Link href="/" style={{color:C.teal}}>Open salary calculator</Link></div><Footer/></>);}

  const isNHS=special&&special.type==='nhs';
  const isTeacher=special&&special.type==='teacher';
  const label=special?special.label:fmt(baseSalary);

  const[pension,setPension]=useState(isNHS?9.8:isTeacher?tpsPct(baseSalary):5);
  const[loan,setLoan]=useState('none');
  const[scotland,setScotland]=useState(false);
  const[kids,setKids]=useState(0);

  const r=calc(baseSalary,pension,loan,scotland);
  const traps=detectTraps(baseSalary,pension,loan,kids);
  const related=VALID.filter(s=>s!==baseSalary).slice(0,8);

  // JSON-LD Schema — Deliverable 4
  const schema={
    '@context':'https://schema.org',
    '@graph':[
      {'@type':'WebApplication','@id':'https://taxdcal.co.uk/'+slug+'#calc',name:(special?label:fmt(baseSalary)+' Salary')+' Take-Home Pay Calculator 2026-27',applicationCategory:'FinanceApplication',operatingSystem:'Any',offers:{'@type':'Offer',price:'0',priceCurrency:'GBP'},url:'https://taxdcal.co.uk/'+slug},
      {'@type':'FAQPage',mainEntity:[
        {'@type':'Question',name:'What is take-home pay on '+(special?label:fmt(baseSalary))+' in the UK?',acceptedAnswer:{'@type':'Answer',text:'On a '+(special?label:fmt(baseSalary))+' salary with '+pension+'% pension and no student loan, take-home pay is approximately '+fmt(r.takeHome)+' per year or '+fmtD(r.monthly.takeHome)+' per month in 2026-27 after income tax and National Insurance.'}},
        {'@type':'Question',name:'How much income tax on '+fmt(baseSalary)+'?',acceptedAnswer:{'@type':'Answer',text:'On '+fmt(baseSalary)+' you pay '+fmt(r.incomeTax)+' in income tax for 2026-27. Effective income tax rate: '+((r.incomeTax/baseSalary)*100).toFixed(1)+'%.'}},
        {'@type':'Question',name:'How much National Insurance on '+fmt(baseSalary)+'?',acceptedAnswer:{'@type':'Answer',text:'On '+fmt(baseSalary)+' you pay '+fmt(r.ni)+' in National Insurance for 2026-27.'}},
      ]},
      {'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'TaxdCalc',item:'https://taxdcal.co.uk/'},{'@type':'ListItem',position:2,name:(special?label:fmt(baseSalary))+' Salary Take-Home',item:'https://taxdcal.co.uk/'+slug}]},
    ]
  };

  return(
    <>
      <style>{GS}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/>
      <Nav/>

      {/* HERO — primary answer above fold */}
      <div style={{background:'linear-gradient(135deg,#0C1E3C,#1e3d6e)',padding:mob?'26px 20px 38px':'34px 24px 46px',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:-40,right:-40,width:180,height:180,borderRadius:'50%',background:'rgba(13,148,136,0.08)',pointerEvents:'none'}}/>
        <div style={{maxWidth:1000,margin:'0 auto'}}>
          <div style={{display:'inline-block',background:'rgba(13,148,136,0.15)',border:'1px solid rgba(20,184,166,0.3)',borderRadius:20,padding:'3px 12px',fontSize:11,color:'#14B8A6',marginBottom:10,fontFamily:'JetBrains Mono'}}>
            {isNHS?'NHS Agenda for Change 2026-27':isTeacher?'Teacher Pay Scale 2026-27':'UK Take-Home Pay 2026-27'}
          </div>
          <h1 style={{fontFamily:'DM Serif Display',fontSize:mob?21:32,color:'white',lineHeight:1.2,marginBottom:12}}>
            {special?label:fmt(baseSalary)+' Salary'} — Take-Home Pay 2026-27
          </h1>
          {/* 4-metric above-fold summary */}
          <div style={{display:'grid',gridTemplateColumns:mob?'1fr 1fr':'repeat(4,1fr)',gap:10}}>
            {[['Annual take-home',fmt(r.takeHome),'#14B8A6'],['Monthly net',fmtD(r.monthly.takeHome),'white'],['Income Tax','-'+fmt(r.incomeTax),'#F87171'],['Nat. Insurance','-'+fmt(r.ni),'#FCA5A5']].map(([lbl,val,col])=>(
              <div key={lbl} style={{background:'rgba(255,255,255,0.06)',borderRadius:10,padding:'12px 14px',border:'1px solid rgba(255,255,255,0.08)'}}>
                <div style={{fontSize:9,color:'rgba(255,255,255,0.4)',letterSpacing:'0.1em',textTransform:'uppercase',fontFamily:'JetBrains Mono',marginBottom:4}}>{lbl}</div>
                <div style={{fontFamily:'DM Serif Display',fontSize:mob?18:24,color:col,lineHeight:1}}>{val}</div>
              </div>
            ))}
          </div>
          <div style={{marginTop:12,display:'flex',alignItems:'center',gap:10}}>
            <div style={{flex:1,height:4,background:'rgba(255,255,255,0.08)',borderRadius:2,overflow:'hidden'}}><div style={{width:((r.takeHome/r.gross)*100)+'%',height:'100%',background:'linear-gradient(90deg,#0D9488,#14B8A6)',borderRadius:2}}/></div>
            <span style={{fontSize:11,color:'#14B8A6',fontFamily:'JetBrains Mono',fontWeight:600,flexShrink:0}}>{((r.takeHome/r.gross)*100).toFixed(1)}% kept {'·'} {r.effectiveRate.toFixed(1)}% effective rate</span>
          </div>
        </div>
      </div>

      {/* TAX TRAP ALERTS — immediately after hero */}
      {traps.length>0&&(
        <div style={{background:'#FFF7ED',borderBottom:'1px solid '+C.orangeBd,padding:mob?'12px 16px':'14px 24px'}}>
          <div style={{maxWidth:1000,margin:'0 auto'}}>
            <div style={{fontSize:10,fontWeight:700,color:C.orange,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:8,fontFamily:'JetBrains Mono'}}>
              {traps.some(t=>t.severity==='critical')?'🚨 Tax Traps Detected':'⚠ Tax Warnings'}
            </div>
            {traps.map(trap=><TrapAlert key={trap.id} trap={trap}/>)}
          </div>
        </div>
      )}

      <div style={{maxWidth:1000,margin:'0 auto',padding:mob?'14px 16px 48px':'18px 24px 56px'}}>

        {/* QUICK ANSWER — SEO paragraph */}
        <div style={{background:C.tealBg,border:'1.5px solid '+C.tealBd,borderRadius:12,padding:'14px 18px',marginBottom:14}} className="fi">
          <div style={{fontSize:10,color:C.teal,fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:6,fontFamily:'JetBrains Mono'}}>Quick Answer — 2026-27</div>
          <p style={{fontSize:14,color:'#0f766e',lineHeight:1.75}}>
            On a {special?label.toLowerCase()+' ('+fmt(baseSalary)+'/year)':fmt(baseSalary)+' annual salary'} with {pension}% pension and no student loan, take-home pay is <strong>{fmt(r.takeHome)}</strong> per year (<strong>{fmtD(r.monthly.takeHome)}</strong> per month) for the 2026-27 UK tax year.
            {baseSalary>TRAP_START&&baseSalary<=TRAP_END?' This salary is within the 60% effective tax trap zone — pension sacrifice can significantly improve take-home pay.':''}
          </p>
        </div>

        {/* ADJUSTERS */}
        <div style={{background:'white',borderRadius:14,padding:mob?16:22,boxShadow:C.shadow,border:'1px solid '+C.border,marginBottom:14}} className="fi">
          <h2 style={{fontFamily:'DM Serif Display',fontSize:16,color:C.navy,marginBottom:14}}>Adjust Your Figures</h2>
          <div style={{display:'grid',gridTemplateColumns:mob?'1fr':'1fr 1fr 1fr',gap:14}}>
            <div>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}><label style={{fontSize:12,fontWeight:600,color:C.navy}}>Pension</label><span style={{fontFamily:'JetBrains Mono',fontSize:12,color:C.teal,fontWeight:600}}>{pension}% = {fmt(baseSalary*pension/100)}</span></div>
              <input type="range" min={0} max={20} step={0.5} value={pension} onChange={e=>setPension(Number(e.target.value))}/>
            </div>
            <div>
              <label style={{display:'block',fontSize:12,fontWeight:600,color:C.navy,marginBottom:8}}>Student Loan Plan</label>
              <select value={loan} onChange={e=>setLoan(e.target.value)} style={{width:'100%',padding:'9px 36px 9px 12px',border:'1.5px solid '+C.borderDk,borderRadius:7,fontSize:12,color:C.navy,outline:'none'}} onFocus={e=>e.target.style.borderColor=C.teal} onBlur={e=>e.target.style.borderColor=C.borderDk}>
                <option value="none">No student loan</option>
                <option value="plan1">Plan 1 (£24,990)</option>
                <option value="plan2">Plan 2 (£27,295)</option>
                <option value="plan4">Plan 4 Scotland</option>
                <option value="plan5">Plan 5 (£25,000) ⚠</option>
              </select>
            </div>
            <div>
              <label style={{display:'block',fontSize:12,fontWeight:600,color:C.navy,marginBottom:8}}>Children {baseSalary>55000?'(HICBC)':''}</label>
              <select value={kids} onChange={e=>setKids(Number(e.target.value))} style={{width:'100%',padding:'9px 36px 9px 12px',border:'1.5px solid '+C.borderDk,borderRadius:7,fontSize:12,color:C.navy,outline:'none'}} onFocus={e=>e.target.style.borderColor=C.teal} onBlur={e=>e.target.style.borderColor=C.borderDk}>
                {[0,1,2,3,4].map(n=><option key={n} value={n}>{n===0?'No children':n+' child'+(n>1?'ren':'')}</option>)}
              </select>
            </div>
          </div>
          {/* Scotland toggle */}
          <div style={{marginTop:14,padding:'11px 13px',background:scotland?'#EFF6FF':C.bg,border:'1.5px solid '+(scotland?'#BFDBFE':C.borderDk),borderRadius:8,display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
            <div style={{fontSize:12,fontWeight:600,color:scotland?'#1D4ED8':C.navy}}>Scotland?<span style={{fontSize:11,fontWeight:400,color:C.slate,marginLeft:6}}>Different income tax rates apply</span></div>
            <button onClick={()=>setScotland(!scotland)} style={{width:40,height:22,borderRadius:11,border:'none',background:scotland?'#1D4ED8':C.borderDk,position:'relative',transition:'background 0.2s',flexShrink:0}}>
              <span style={{position:'absolute',top:2,left:scotland?20:2,width:18,height:18,borderRadius:'50%',background:'white',boxShadow:'0 1px 3px rgba(0,0,0,0.2)',transition:'left 0.2s'}}/>
            </button>
          </div>
        </div>

        {/* NHS / TEACHER PANELS */}
        {isNHS&&<NHSPanel baseSalary={baseSalary}/>}
        {isTeacher&&<TeacherPanel/>}

        {/* BREAKDOWN TABLE */}
        <div style={{background:'white',borderRadius:12,padding:mob?14:20,border:'1px solid '+C.border,boxShadow:C.shadow,marginBottom:14}}>
          <h3 style={{fontFamily:'DM Serif Display',fontSize:15,color:C.navy,marginBottom:12}}>Full Deduction Breakdown</h3>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:12,minWidth:320}}>
              <thead><tr>{['','Annual','Monthly','Weekly'].map(h=><th key={h} style={{textAlign:h?'right':'left',padding:'6px 8px',color:C.slate,fontSize:10,textTransform:'uppercase',letterSpacing:'0.06em',borderBottom:'1px solid '+C.border}}>{h}</th>)}</tr></thead>
              <tbody>
                {[{l:'Gross salary',a:r.gross},{l:'Income Tax',a:r.incomeTax,neg:true},{l:'Nat. Insurance',a:r.ni,neg:true},r.studentLoan>0?{l:'Student Loan',a:r.studentLoan,neg:true}:null,r.pension>0?{l:'Pension '+pension+'%',a:r.pension,neg:true}:null,{l:'Take-Home Pay',a:r.takeHome,bold:true,grn:true}].filter(Boolean).map((row,i)=>(
                  <tr key={row.l} style={{background:i%2===0?'transparent':'rgba(0,0,0,0.012)',borderBottom:'1px solid '+C.border}}>
                    <td style={{padding:'8px',fontWeight:row.bold?700:400,color:row.grn?C.teal:C.text,fontSize:12}}>{row.l}</td>
                    {[row.a,row.a/12,row.a/52].map((v,j)=><td key={j} style={{padding:'8px',textAlign:'right',fontFamily:'JetBrains Mono',fontSize:11,color:row.neg?C.red:row.grn?C.teal:C.text,fontWeight:row.bold?700:400}}>{row.neg?'-':''}{j===0?fmt(v):fmtD(v)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RELATED SALARY PAGES */}
        <div style={{marginBottom:14}}>
          <h2 style={{fontFamily:'DM Serif Display',fontSize:mob?17:20,color:C.navy,marginBottom:10}}>Other UK Salary Take-Home Calculations</h2>
          <div style={{display:'grid',gridTemplateColumns:mob?'repeat(2,1fr)':'repeat(auto-fill,minmax(140px,1fr))',gap:8}}>
            {related.map(s=>{const rel=calc(s,5,'none',false);return(
              <Link key={s} href={'/'+s+'-salary-take-home'} style={{background:'white',border:'1px solid '+C.border,borderRadius:9,padding:'11px 13px',display:'block',transition:'border-color 0.2s'}} onMouseEnter={e=>e.currentTarget.style.borderColor=C.teal} onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                <div style={{fontFamily:'JetBrains Mono',fontSize:13,fontWeight:700,color:C.navy,marginBottom:2}}>{fmt(s)}</div>
                <div style={{fontSize:11,color:C.teal,fontFamily:'JetBrains Mono'}}>{fmt(rel.takeHome)}/yr</div>
              </Link>
            );})}
          </div>
        </div>

        {/* CTA */}
        <div style={{background:'linear-gradient(135deg,#0C1E3C,#1e3d6e)',borderRadius:12,padding:'16px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
          <div><div style={{fontFamily:'DM Serif Display',fontSize:15,color:'white',marginBottom:2}}>Need a different salary?</div><div style={{fontSize:11,color:'rgba(255,255,255,0.4)'}}>Scotland, tax code, all 5 student loan plans</div></div>
          <Link href="/" style={{background:C.teal,color:'white',padding:'10px 18px',borderRadius:7,fontSize:13,fontWeight:700,display:'inline-block'}}>Open Full Calculator</Link>
        </div>
      </div>
      <Footer/>
    </>
  );
}