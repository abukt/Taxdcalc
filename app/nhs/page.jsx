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
  green:'#059669',text:'#1E293B',textMid:'#475569',slate:'#64748B',slateLight:'#94A3B8',
  red:'#DC2626',shadow:'0 1px 3px rgba(0,0,0,0.07),0 4px 16px rgba(0,0,0,0.04)',
};
const GS = '@import url(\'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Source+Serif+4:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap\');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}body{background:#F8F9FA;color:#1E293B;font-family:\'Source Serif 4\',Georgia,serif;-webkit-tap-highlight-color:transparent;}input[type=range]{-webkit-appearance:none;width:100%;height:4px;background:#CBD5E1;border-radius:2px;outline:none;}input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;border-radius:50%;background:#0C1E3C;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.2);}select{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\'%3E%3Cpath d=\'M1 1l5 5 5-5\' stroke=\'%2364748b\' stroke-width=\'1.5\' fill=\'none\'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;background-color:white;}@keyframes fadeUp{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}.fu{animation:fadeUp 0.4s ease both;}button{cursor:pointer;-webkit-tap-highlight-color:transparent;}a{text-decoration:none;color:inherit;}';
const fmt = n => '\u00A3' + Math.abs(n || 0).toLocaleString('en-GB', { maximumFractionDigits: 0 });
const fmtD = n => '\u00A3' + (n || 0).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const NHS_BANDS = [
  { band: 'Band 2', min: 23615, max: 24336 },
  { band: 'Band 3', min: 24336, max: 25527 },
  { band: 'Band 4', min: 26530, max: 29114 },
  { band: 'Band 5', min: 29970, max: 36483 },
  { band: 'Band 6', min: 37338, max: 44962 },
  { band: 'Band 7', min: 46148, max: 52809 },
  { band: 'Band 8a', min: 53755, max: 60504 },
  { band: 'Band 8b', min: 62215, max: 72293 },
  { band: 'Band 8c', min: 74290, max: 85601 },
  { band: 'Band 8d', min: 88168, max: 101677 },
  { band: 'Band 9', min: 105385, max: 121271 },
];

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
function calcNHS(gross, pensionPct) {
  const pension = gross * (pensionPct / 100);
  const it = calcIT(gross, pension), ni = calcNI(gross);
  return { gross, incomeTax: it, ni, pension, takeHome: gross - it - ni - pension };
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
              <Link key={href} href={href} style={{padding:'7px 13px',borderRadius:6,background:href==='/nhs'?'rgba(13,148,136,0.2)':'transparent',color:href==='/nhs'?'#14B8A6':'rgba(255,255,255,0.6)',fontSize:13,fontFamily:'Source Serif 4',fontWeight:href==='/nhs'?600:400}}>{label}</Link>
            ))}
            <span style={{fontSize:11,color:'#14B8A6',fontFamily:'JetBrains Mono',background:'rgba(13,148,136,0.15)',padding:'3px 9px',borderRadius:4,border:'1px solid rgba(20,184,166,0.3)',marginLeft:8}}>2026-27</span>
          </div>
        )}
      </div>
      {mob&&open&&(
        <div style={{background:'#162d52',borderTop:'1px solid rgba(255,255,255,0.08)',padding:'6px 0 12px'}}>
          {links.map(([href,label])=>(
            <Link key={href} href={href} onClick={()=>setOpen(false)} style={{display:'block',padding:'12px 24px',background:href==='/nhs'?'rgba(13,148,136,0.15)':'transparent',color:href==='/nhs'?'#14B8A6':'rgba(255,255,255,0.65)',fontSize:14,fontFamily:'Source Serif 4',fontWeight:href==='/nhs'?600:400}}>{label}</Link>
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

export default function NHSPage() {
  const mob = useW() < 640;
  const [selBand, setSelBand] = useState('Band 5');
  const [point, setPoint] = useState('min');
  const [pensionPct, setPensionPct] = useState(9.8);
  const band = NHS_BANDS.find(b => b.band === selBand) || NHS_BANDS[3];
  const gross = point === 'min' ? band.min : band.max;
  const r = calcNHS(gross, pensionPct);

  return (
    <>
      <style>{GS}</style>
      <Nav/>
      <div style={{background:'linear-gradient(135deg,#0C1E3C,#1e3d6e)',padding:mob?'36px 20px 64px':'44px 24px 72px',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:-50,right:-50,width:220,height:220,borderRadius:'50%',background:'rgba(13,148,136,0.07)',pointerEvents:'none'}}/>
        <div style={{display:'inline-block',background:'rgba(13,148,136,0.15)',border:'1px solid rgba(20,184,166,0.3)',borderRadius:20,padding:'4px 13px',fontSize:11,color:'#14B8A6',marginBottom:13,fontFamily:'JetBrains Mono'}}>NHS Pay Bands 2026-27</div>
        <h1 style={{fontFamily:'DM Serif Display',fontSize:mob?26:42,color:'white',marginBottom:10,letterSpacing:'-0.02em',lineHeight:1.15}}>
          NHS Pay Bands<br/><em style={{color:'#14B8A6'}}>Take-Home Calculator</em>
        </h1>
        <p style={{color:'rgba(255,255,255,0.5)',fontSize:mob?13:15,maxWidth:480,margin:'0 auto'}}>Agenda for Change pay scales with real take-home after income tax, NI and NHS pension. All bands 1 to 9.</p>
      </div>
      <div style={{background:'#F4F6F9',padding:mob?'16px 16px 0':'18px 24px 0',maxWidth:960,margin:'0 auto'}}>
        <Link href="/" style={{display:'inline-flex',alignItems:'center',gap:8,background:C.navy,color:'white',padding:'10px 18px',borderRadius:8,fontSize:13,fontWeight:700}}> ← Back to Salary Calculator</Link>
      </div>
      <div style={{maxWidth:960,margin:'0 auto',padding:mob?'16px 16px 48px':'16px 24px 56px'}}>
        <div style={{display:'grid',gridTemplateColumns:mob?'1fr':'1fr 1fr',gap:20,alignItems:'start',marginBottom:20}}>
          <div style={{background:'white',borderRadius:14,padding:mob?20:26,boxShadow:C.shadow,border:'1px solid '+C.border}} className="fu">
            <h2 style={{fontFamily:'DM Serif Display',fontSize:19,color:C.navy,marginBottom:20}}>Select Your Band</h2>
            <div style={{marginBottom:20}}>
              <label style={{display:'block',fontSize:13,fontWeight:600,color:C.navyLight,marginBottom:8}}>NHS Pay Band</label>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(80px,1fr))',gap:8}}>
                {NHS_BANDS.map(b=>(
                  <button key={b.band} onClick={()=>setSelBand(b.band)}
                    style={{padding:'9px 6px',borderRadius:8,border:'1.5px solid '+(selBand===b.band?C.teal:C.border),background:selBand===b.band?C.tealBg:'white',color:selBand===b.band?C.teal:C.textMid,fontSize:12,fontWeight:selBand===b.band?700:400,fontFamily:'JetBrains Mono'}}>
                    {b.band}
                  </button>
                ))}
              </div>
            </div>
            <div style={{marginBottom:20}}>
              <label style={{display:'block',fontSize:13,fontWeight:600,color:C.navyLight,marginBottom:8}}>Pay Point</label>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                {[['min','Entry '+fmt(band.min)],['max','Top '+fmt(band.max)]].map(([val,lbl])=>(
                  <button key={val} onClick={()=>setPoint(val)} style={{padding:'11px',borderRadius:8,border:'1.5px solid '+(point===val?C.teal:C.border),background:point===val?C.tealBg:'white',color:point===val?C.teal:C.textMid,fontSize:13,fontWeight:point===val?700:400}}>
                    {lbl}
                  </button>
                ))}
              </div>
            </div>
            <div style={{marginBottom:8}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
                <label style={{fontSize:13,fontWeight:600,color:C.navyLight}}>NHS Pension Rate</label>
                <span style={{fontFamily:'JetBrains Mono',fontSize:14,color:C.teal,fontWeight:600}}>{pensionPct}%</span>
              </div>
              <input type="range" min={5} max={14.5} step={0.5} value={pensionPct} onChange={e=>setPensionPct(Number(e.target.value))}/>
              <div style={{display:'flex',justifyContent:'space-between',marginTop:4}}>
                <span style={{fontSize:11,color:C.slateLight}}>5%</span>
                <span style={{fontSize:11,color:C.slateLight}}>14.5%</span>
              </div>
            </div>
            <div style={{padding:'10px 13px',background:C.tealBg,border:'1px solid '+C.tealBorder,borderRadius:7,fontSize:11,color:'#0f766e',lineHeight:1.6,marginTop:12}}>
              NHS pension contribution rates range from 5% to 14.5% depending on your pensionable pay tier. The NHS pension is a defined benefit scheme.
            </div>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:14}} className="fu">
            <div style={{background:'linear-gradient(135deg,#0C1E3C,#1e3d6e)',borderRadius:14,padding:mob?'20px':26,boxShadow:'0 4px 24px rgba(12,30,60,0.3)',position:'relative',overflow:'hidden'}}>
              <div style={{position:'absolute',top:-20,right:-20,width:120,height:120,borderRadius:'50%',background:'rgba(13,148,136,0.12)',pointerEvents:'none'}}/>
              <div style={{fontSize:10,color:'rgba(255,255,255,0.4)',letterSpacing:'0.12em',textTransform:'uppercase',fontFamily:'JetBrains Mono',marginBottom:6}}>{selBand} Annual Take-Home</div>
              <div style={{fontFamily:'DM Serif Display',fontSize:mob?36:50,color:'white',lineHeight:1}}>{fmt(r.takeHome)}</div>
              <div style={{fontSize:13,color:'rgba(255,255,255,0.45)',fontFamily:'JetBrains Mono',marginTop:5}}>{fmtD(r.takeHome/12)} per month</div>
              <div style={{marginTop:14,display:'flex',alignItems:'center',gap:10}}>
                <div style={{flex:1,height:4,background:'rgba(255,255,255,0.08)',borderRadius:2,overflow:'hidden'}}>
                  <div style={{width:((r.takeHome/r.gross)*100)+'%',height:'100%',background:'linear-gradient(90deg,#0D9488,#14B8A6)',borderRadius:2,transition:'width 0.5s'}}/>
                </div>
                <span style={{fontSize:12,color:'#14B8A6',fontFamily:'JetBrains Mono',fontWeight:600,flexShrink:0}}>{((r.takeHome/r.gross)*100).toFixed(1)}% kept</span>
              </div>
            </div>
            <div style={{background:'white',borderRadius:12,padding:mob?16:22,border:'1px solid '+C.border,boxShadow:C.shadow}}>
              <h3 style={{fontFamily:'DM Serif Display',fontSize:17,color:C.navy,marginBottom:14}}>Full Breakdown</h3>
              {[
                {l:'Gross salary',v:r.gross,color:C.navy},
                {l:'Income Tax',v:r.incomeTax,color:C.red,neg:true},
                {l:'National Insurance (8%/2%)',v:r.ni,color:'#F59E0B',neg:true},
                {l:'NHS Pension ('+pensionPct+'%)',v:r.pension,color:'#6366F1',neg:true},
                {l:'Take-home pay',v:r.takeHome,color:C.teal,bold:true},
              ].map(row=>(
                <div key={row.l} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid '+C.border}}>
                  <span style={{fontSize:13,color:row.bold?C.text:C.textMid,fontWeight:row.bold?700:400}}>{row.l}</span>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontFamily:'JetBrains Mono',fontSize:13,color:row.color,fontWeight:row.bold?700:400}}>{row.neg?'-':''}{fmt(row.v)}</div>
                    <div style={{fontFamily:'JetBrains Mono',fontSize:10,color:C.slateLight}}>{fmtD(row.v/12)}/mo</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{background:'white',borderRadius:12,padding:mob?16:22,border:'1px solid '+C.border,marginBottom:16}}>
          <h3 style={{fontFamily:'DM Serif Display',fontSize:18,color:C.navy,marginBottom:14}}>All NHS Pay Bands 2026-27</h3>
          <div style={{overflowX:'auto',WebkitOverflowScrolling:'touch'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:13,minWidth:480}}>
              <thead>
                <tr>{['Band','Min Salary','Max Salary','Min Take-Home','Max Take-Home'].map(h=>(
                  <th key={h} style={{textAlign:h==='Band'?'left':'right',padding:'10px 12px',background:C.tealBg,color:C.teal,borderBottom:'2px solid '+C.tealBorder,fontSize:11,fontWeight:700}}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {NHS_BANDS.map((b,i)=>{
                  const rMin = calcNHS(b.min, 9.8), rMax = calcNHS(b.max, 9.8);
                  const sel = b.band === selBand;
                  return (
                    <tr key={b.band} onClick={()=>setSelBand(b.band)} style={{background:sel?C.tealBg:i%2===0?'white':'#F8F9FA',cursor:'pointer',borderBottom:'1px solid '+C.border}}>
                      <td style={{padding:'10px 12px',fontWeight:700,color:sel?C.teal:C.navy}}>{b.band}</td>
                      <td style={{padding:'10px 12px',textAlign:'right',fontFamily:'JetBrains Mono',fontSize:12}}>{fmt(b.min)}</td>
                      <td style={{padding:'10px 12px',textAlign:'right',fontFamily:'JetBrains Mono',fontSize:12}}>{fmt(b.max)}</td>
                      <td style={{padding:'10px 12px',textAlign:'right',fontFamily:'JetBrains Mono',fontSize:12,color:C.green}}>{fmt(rMin.takeHome)}</td>
                      <td style={{padding:'10px 12px',textAlign:'right',fontFamily:'JetBrains Mono',fontSize:12,color:C.green}}>{fmt(rMax.takeHome)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{fontSize:11,color:C.slateLight,marginTop:8}}>Tap any row to load in the calculator above. Assumes 9.8% NHS pension contribution.</div>
        </div>
        <div style={{padding:'14px 16px',background:'#F8F9FA',border:'1px solid '+C.border,borderRadius:10,display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:10}}>
          <span style={{fontSize:13,color:C.textMid}}>Need take-home for any UK salary?</span>
          <Link href="/" style={{background:C.teal,color:'white',padding:'9px 18px',borderRadius:7,fontWeight:700,fontSize:13,display:'inline-block'}}>Open Salary Calculator</Link>
        </div>
      </div>
      <Footer/>
    </>
  );
}
