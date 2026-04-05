"use client";
import { useState, useEffect, useRef } from "react";

function useWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 800);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return w;
}

const TAX = {
  personalAllowance: 12570, basicRateLimit: 50270, higherRateLimit: 125140,
  niPrimaryThreshold: 12570, niUpperEarningsLimit: 50270,
  studentLoan: {
    plan1:{threshold:24990,rate:0.09}, plan2:{threshold:27295,rate:0.09},
    plan4:{threshold:31395,rate:0.09}, plan5:{threshold:25000,rate:0.09}, none:null
  }
};

function calcIncomeTax(gross, pension) {
  const ti = Math.max(0, gross - pension);
  let allow = TAX.personalAllowance;
  if (ti > 100000) allow = Math.max(0, TAX.personalAllowance - (ti - 100000) / 2);
  const taxable = Math.max(0, ti - allow);
  const b1 = TAX.basicRateLimit - TAX.personalAllowance;
  const b2 = TAX.higherRateLimit - TAX.personalAllowance;
  if (taxable <= b1) return taxable * 0.20;
  if (taxable <= b2) return b1 * 0.20 + (taxable - b1) * 0.40;
  return b1 * 0.20 + (b2 - b1) * 0.40 + (taxable - b2) * 0.45;
}

function calcNI(gross) {
  if (gross <= TAX.niPrimaryThreshold) return 0;
  if (gross <= TAX.niUpperEarningsLimit) return (gross - TAX.niPrimaryThreshold) * 0.08;
  return (TAX.niUpperEarningsLimit - TAX.niPrimaryThreshold) * 0.08 + (gross - TAX.niUpperEarningsLimit) * 0.02;
}

function calcStudentLoan(gross, plan) {
  if (!plan || plan === "none") return 0;
  const p = TAX.studentLoan[plan];
  if (!p || gross <= p.threshold) return 0;
  return (gross - p.threshold) * p.rate;
}

function calculate(gross, pensionPct, slPlan) {
  const pension = gross * (pensionPct / 100);
  const incomeTax = calcIncomeTax(gross, pension);
  const ni = calcNI(gross);
  const studentLoan = calcStudentLoan(gross, slPlan);
  const totalDeductions = incomeTax + ni + studentLoan + pension;
  const takeHome = gross - totalDeductions;
  return {
    gross, incomeTax, ni, studentLoan, pension, totalDeductions, takeHome,
    monthly: { gross: gross/12, takeHome: takeHome/12 },
    weekly: { gross: gross/52, takeHome: takeHome/52 },
    daily: { gross: gross/260, takeHome: takeHome/260 },
    effectiveRate: gross > 0 ? ((incomeTax + ni) / gross) * 100 : 0
  };
}

const fmt = n => "£" + Math.abs(n).toLocaleString("en-GB", { maximumFractionDigits: 0 });
const fmtD = n => "£" + n.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function AnimNum({ value, format }) {
  const f = format || fmt;
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);
  useEffect(() => {
    const start = prev.current, end = value, diff = end - start;
    if (Math.abs(diff) < 1) { setDisplay(end); prev.current = end; return; }
    const dur = 420, t0 = performance.now(); let raf;
    const step = now => {
      const t = Math.min(1,(now-t0)/dur), e = t<0.5?2*t*t:-1+(4-2*t)*t;
      setDisplay(start + diff*e);
      if (t < 1) raf = requestAnimationFrame(step);
      else { setDisplay(end); prev.current = end; }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <span>{f(display)}</span>;
}

const C = {
  cream:"#F8F9FA", white:"#FFFFFF",
  navy:"#0C1E3C", navyLight:"#162d52", navyMid:"#1e3d6e",
  teal:"#0D9488", tealLight:"#14B8A6", tealBg:"#F0FDFA", tealBorder:"#99F6E4",
  amber:"#D97706", amberLight:"#F59E0B", amberBg:"#FFFBEB", amberBorder:"#FDE68A",
  slate:"#64748B", slateLight:"#94A3B8",
  border:"#E2E8F0", borderDark:"#CBD5E1",
  green:"#059669", greenBg:"#ECFDF5",
  red:"#DC2626", text:"#1E293B", textMid:"#475569",
};

const gs = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Source+Serif+4:wght@300;400;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  body{background:#F8F9FA;color:#1E293B;font-family:'Source Serif 4',Georgia,serif;-webkit-tap-highlight-color:transparent;}
  input[type=number]{-moz-appearance:textfield;}
  input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;}
  input[type=range]{-webkit-appearance:none;width:100%;height:4px;background:#CBD5E1;border-radius:2px;outline:none;cursor:pointer;}
  input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;border-radius:50%;background:#0C1E3C;cursor:pointer;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.2);}
  select{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2364748b' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;background-color:white;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
  .fu{animation:fadeUp 0.45s ease both;}
  .bfill{transition:width 0.55s cubic-bezier(0.4,0,0.2,1);}
  button{-webkit-tap-highlight-color:transparent;}
`;

function Logo({ size, light }) {
  const s = size === "sm" ? {box:26,font:12,text:15} : size === "lg" ? {box:44,font:20,text:26} : {box:32,font:14,text:18};
  return (
    <div style={{display:"flex",alignItems:"center",gap:9}}>
      <div style={{width:s.box,height:s.box,background:"linear-gradient(135deg,#0D9488,#14B8A6)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:"0 2px 8px rgba(13,148,136,0.4)"}}>
        <span style={{color:"white",fontWeight:700,fontSize:s.font,fontFamily:"JetBrains Mono"}}>Tx</span>
      </div>
      <span style={{color:light?"white":"#0C1E3C",fontFamily:"DM Serif Display",fontSize:s.text,letterSpacing:"-0.02em"}}>
        Taxd<span style={{color:"#0D9488"}}>Calc</span>
      </span>
    </div>
  );
}

function InputField({ label, value, onChange, prefix, hint, min, max }) {
  return (
    <div style={{marginBottom:20}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:7}}>
        <label style={{fontSize:13,fontWeight:600,color:"#162d52"}}>{label}</label>
        {hint && <span style={{fontSize:11,color:"#64748B"}}>{hint}</span>}
      </div>
      <div style={{position:"relative"}}>
        {prefix && <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:"#64748B",fontSize:15,fontWeight:600,fontFamily:"JetBrains Mono",pointerEvents:"none"}}>{prefix}</span>}
        <input type="number" value={value} onChange={e => onChange(Number(e.target.value))} min={min || 0} max={max || 500000}
          style={{width:"100%",padding:"13px 14px 13px " + (prefix ? "28px" : "14px"),border:"1.5px solid #CBD5E1",borderRadius:8,fontSize:16,fontFamily:"JetBrains Mono",fontWeight:500,color:"#0C1E3C",background:"white",outline:"none"}}
          onFocus={e => e.target.style.borderColor = "#0D9488"}
          onBlur={e => e.target.style.borderColor = "#CBD5E1"} />
      </div>
    </div>
  );
}

function SliderField({ label, value, onChange, min, max, step, format }) {
  return (
    <div style={{marginBottom:22}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:10}}>
        <label style={{fontSize:13,fontWeight:600,color:"#162d52"}}>{label}</label>
        <span style={{fontFamily:"JetBrains Mono",fontSize:14,color:"#0D9488",fontWeight:600}}>{format(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} />
      <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
        <span style={{fontSize:11,color:"#94A3B8"}}>{format(min)}</span>
        <span style={{fontSize:11,color:"#94A3B8"}}>{format(max)}</span>
      </div>
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div style={{marginBottom:20}}>
      <label style={{display:"block",fontSize:13,fontWeight:600,color:"#162d52",marginBottom:7}}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{width:"100%",padding:"13px 40px 13px 14px",border:"1.5px solid #CBD5E1",borderRadius:8,fontSize:14,fontFamily:"Source Serif 4",color:"#0C1E3C",cursor:"pointer"}}
        onFocus={e => e.target.style.borderColor = "#0D9488"}
        onBlur={e => e.target.style.borderColor = "#CBD5E1"}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function NavBar({ page, setPage }) {
  const [open, setOpen] = useState(false);
  const w = useWidth();
  const mob = w < 640;
  const navItems = [
    {id:"home",label:"Salary Calculator"},
    {id:"contractor",label:"Contractor"},
    {id:"tools",label:"All Tools"}
  ];
  return (
    <nav style={{background:"#0C1E3C",position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 16px rgba(0,0,0,0.25)"}}>
      <div style={{maxWidth:1100,margin:"0 auto",padding:"0 20px",height:58,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div onClick={() => { setPage("home"); setOpen(false); }} style={{cursor:"pointer"}}>
          <Logo light={true} />
        </div>
        {mob ? (
          <button onClick={() => setOpen(!open)}
            style={{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:7,padding:"8px 10px",cursor:"pointer",display:"flex",flexDirection:"column",gap:4}}>
            {[0,1,2].map(i => (
              <span key={i} style={{display:"block",width:18,height:2,background:"white",borderRadius:1,transition:"all 0.2s",
                transform: open && i===0 ? "rotate(45deg) translate(4px,4px)" : open && i===2 ? "rotate(-45deg) translate(4px,-4px)" : "none",
                opacity: open && i===1 ? 0 : 1}} />
            ))}
          </button>
        ) : (
          <div style={{display:"flex",gap:2,alignItems:"center"}}>
            {navItems.map(n => (
              <button key={n.id} onClick={() => setPage(n.id)}
                style={{padding:"7px 14px",borderRadius:6,border:"none",background:page===n.id?"rgba(13,148,136,0.2)":"transparent",color:page===n.id?"#14B8A6":"rgba(255,255,255,0.6)",fontSize:13,fontFamily:"Source Serif 4",cursor:"pointer",fontWeight:page===n.id?600:400}}>
                {n.label}
              </button>
            ))}
            <div style={{width:1,height:18,background:"rgba(255,255,255,0.12)",margin:"0 8px"}} />
            <span style={{fontSize:11,color:"#14B8A6",fontFamily:"JetBrains Mono",background:"rgba(13,148,136,0.15)",padding:"3px 9px",borderRadius:4,border:"1px solid rgba(20,184,166,0.3)"}}>2026-27</span>
          </div>
        )}
      </div>
      {mob && open && (
        <div style={{background:"#162d52",borderTop:"1px solid rgba(255,255,255,0.08)",padding:"8px 0 14px"}}>
          {navItems.map(n => (
            <button key={n.id} onClick={() => { setPage(n.id); setOpen(false); }}
              style={{display:"block",width:"100%",padding:"13px 24px",background:page===n.id?"rgba(13,148,136,0.15)":"transparent",border:"none",color:page===n.id?"#14B8A6":"rgba(255,255,255,0.65)",fontSize:15,fontFamily:"Source Serif 4",cursor:"pointer",textAlign:"left",fontWeight:page===n.id?600:400}}>
              {n.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

function HomePage() {
  const w = useWidth();
  const mob = w < 768;
  const [salary, setSalary] = useState(45000);
  const [pension, setPension] = useState(5);
  const [studentLoan, setStudentLoan] = useState("none");
  const [period, setPeriod] = useState("annual");
  const [tab, setTab] = useState("breakdown");
  const r = calculate(salary, pension, studentLoan);
  const pm = {
    annual:{g:r.gross,th:r.takeHome},
    monthly:{g:r.monthly.gross,th:r.monthly.takeHome},
    weekly:{g:r.weekly.gross,th:r.weekly.takeHome},
    daily:{g:r.daily.gross,th:r.daily.takeHome}
  };
  const items = [
    {label:"Income Tax",value:r.incomeTax,color:"#DC2626"},
    {label:"Nat. Insurance",value:r.ni,color:"#F59E0B"},
    {label:"Student Loan",value:r.studentLoan,color:"#6366F1"},
    {label:"Pension",value:r.pension,color:"#14B8A6"}
  ];
  const subLabel = {
    annual: fmtD(r.monthly.takeHome) + "/mo",
    monthly: fmtD(r.takeHome) + "/yr",
    weekly: fmtD(r.weekly.takeHome*52) + "/yr",
    daily: fmtD(r.daily.takeHome*260) + "/yr"
  };

  return (
    <div>
      <div style={{background:"linear-gradient(135deg,#0C1E3C 0%,#1e3d6e 100%)",padding:mob?"38px 20px 72px":"50px 24px 82px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-60,right:-40,width:260,height:260,borderRadius:"50%",background:"rgba(13,148,136,0.08)",pointerEvents:"none"}} />
        <div style={{maxWidth:640,margin:"0 auto",textAlign:"center",position:"relative"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:7,background:"rgba(13,148,136,0.15)",border:"1px solid rgba(20,184,166,0.3)",borderRadius:20,padding:"5px 14px",fontSize:11,color:"#14B8A6",marginBottom:20,fontFamily:"JetBrains Mono"}}>
            <span style={{width:6,height:6,borderRadius:"50%",background:"#14B8A6",display:"inline-block"}} />
            Updated for 2026-27 tax year
          </div>
          <h1 style={{fontFamily:"DM Serif Display",fontSize:mob?30:"clamp(30px,5vw,54px)",color:"white",lineHeight:1.1,marginBottom:14,letterSpacing:"-0.025em"}}>
            UK Take-Home Pay<br /><em style={{color:"#14B8A6"}}>Calculator</em>
          </h1>
          <p style={{color:"rgba(255,255,255,0.55)",fontSize:mob?14:16,lineHeight:1.65,maxWidth:420,margin:"0 auto"}}>
            Instantly see your net salary after income tax, NI, student loan and pension.
          </p>
          <div style={{display:"flex",gap:20,flexWrap:"wrap",justifyContent:"center",marginTop:16}}>
            {["✓ 2026-27 HMRC thresholds","✓ All student loan plans","✓ Free, no sign-up"].map(t => (
              <span key={t} style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{maxWidth:1100,margin:mob?"-32px 0 0":"-44px auto 0",padding:mob?"0 16px":"0 24px"}}>
        <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"minmax(300px,400px) 1fr",gap:20,alignItems:"start"}}>

          <div style={{background:"white",borderRadius:14,padding:mob?20:26,boxShadow:"0 1px 3px rgba(0,0,0,0.07),0 4px 16px rgba(0,0,0,0.04)",border:"1px solid #E2E8F0"}} className="fu">
            <h2 style={{fontFamily:"DM Serif Display",fontSize:19,color:"#0C1E3C",marginBottom:22}}>Your Details</h2>
            <InputField label="Annual Salary" value={salary} onChange={setSalary} prefix="£" hint={"≈ " + fmt(salary/12) + "/mo"} />
            <SliderField label="Pension Contribution" value={pension} onChange={setPension} min={0} max={30} step={0.5} format={v => v + "%"} />
            <SelectField label="Student Loan Plan" value={studentLoan} onChange={setStudentLoan} options={[
              {value:"none",label:"No student loan"},
              {value:"plan1",label:"Plan 1 - pre Sept 2012 (£24,990)"},
              {value:"plan2",label:"Plan 2 - Sept 2012 to Jul 2023 (£27,295)"},
              {value:"plan4",label:"Plan 4 - Scotland (£31,395)"},
              {value:"plan5",label:"Plan 5 - Aug 2023 onwards (£25,000)"},
            ]} />
            <div style={{padding:"13px 14px",background:"#F0FDFA",border:"1px solid #99F6E4",borderRadius:8}}>
              <div style={{fontSize:11,color:"#0D9488",fontWeight:700,marginBottom:6}}>2026-27 Income Tax Bands</div>
              {[["£0 to £12,570","0%"],["£12,571 to £50,270","20%"],["£50,271 to £125,140","40%"],["Over £125,140","45%"]].map(([range,rate]) => (
                <div key={range} style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#0f766e",fontFamily:"JetBrains Mono",padding:"3px 0",borderBottom:"1px solid rgba(13,148,136,0.15)"}}>
                  <span>{range}</span><span style={{fontWeight:600}}>{rate}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{display:"flex",flexDirection:"column",gap:14}} className="fu">
            <div style={{background:"linear-gradient(135deg,#0C1E3C,#1e3d6e)",borderRadius:14,padding:mob?"20px 18px":26,boxShadow:"0 4px 24px rgba(12,30,60,0.3)",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:-20,right:-20,width:130,height:130,borderRadius:"50%",background:"rgba(13,148,136,0.12)",pointerEvents:"none"}} />
              <div style={{fontSize:10,color:"rgba(255,255,255,0.4)",letterSpacing:"0.12em",textTransform:"uppercase",fontWeight:600,marginBottom:6,fontFamily:"JetBrains Mono"}}>Annual Take-Home Pay</div>
              <div style={{fontFamily:"DM Serif Display",fontSize:mob?38:54,color:"white",lineHeight:1}}><AnimNum value={r.takeHome} /></div>
              <div style={{fontSize:13,color:"rgba(255,255,255,0.45)",fontFamily:"JetBrains Mono",marginTop:6}}><AnimNum value={r.monthly.takeHome} format={fmtD} /> per month</div>
              <div style={{marginTop:16,display:"flex",alignItems:"center",gap:10}}>
                <div style={{flex:1,height:4,background:"rgba(255,255,255,0.08)",borderRadius:2,overflow:"hidden"}}>
                  <div className="bfill" style={{width: ((r.takeHome/r.gross)*100) + "%",height:"100%",background:"linear-gradient(90deg,#0D9488,#14B8A6)",borderRadius:2}} />
                </div>
                <span style={{fontSize:12,color:"#14B8A6",fontFamily:"JetBrains Mono",fontWeight:600,flexShrink:0}}>{((r.takeHome/r.gross)*100).toFixed(1)}% kept</span>
              </div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.28)",fontFamily:"JetBrains Mono",marginTop:4}}>Effective tax rate: {r.effectiveRate.toFixed(1)}%</div>
            </div>

            <div style={{display:"flex",gap:4,background:"white",padding:5,borderRadius:10,border:"1px solid #E2E8F0"}}>
              {["annual","monthly","weekly","daily"].map(p => (
                <button key={p} onClick={() => setPeriod(p)}
                  style={{flex:1,padding:"9px 4px",borderRadius:7,border:"none",background:period===p?"#0D9488":"transparent",color:period===p?"white":"#64748B",fontSize:mob?11:12,cursor:"pointer",fontFamily:"Source Serif 4",fontWeight:period===p?600:400,textTransform:"capitalize",transition:"all 0.15s"}}>
                  {p}
                </button>
              ))}
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              {[["Gross Pay",pm[period].g,"#0C1E3C"],["Net Pay",pm[period].th,"#059669"]].map(([lbl,val,clr]) => (
                <div key={lbl} style={{background:"white",border:"1px solid #E2E8F0",borderRadius:10,padding:mob?"13px 14px":"15px 16px",boxShadow:"0 1px 3px rgba(0,0,0,0.07)"}}>
                  <div style={{fontSize:10,color:"#64748B",letterSpacing:"0.08em",textTransform:"uppercase",fontWeight:600,marginBottom:5,fontFamily:"JetBrains Mono"}}>{lbl}</div>
                  <div style={{fontFamily:"DM Serif Display",fontSize:mob?20:26,color:clr,lineHeight:1}}><AnimNum value={val} /></div>
                  <div style={{fontSize:10,color:"#94A3B8",fontFamily:"JetBrains Mono",marginTop:3}}>{subLabel[period]}</div>
                </div>
              ))}
            </div>

            <div style={{background:"white",borderRadius:14,padding:mob?"16px":"20px 22px",boxShadow:"0 1px 3px rgba(0,0,0,0.07)",border:"1px solid #E2E8F0"}}>
              <div style={{display:"flex",gap:2,marginBottom:16,borderBottom:"1px solid #E2E8F0"}}>
                {["breakdown","table"].map(t => (
                  <button key={t} onClick={() => setTab(t)}
                    style={{padding:"7px 14px",border:"none",background:"transparent",fontSize:13,fontFamily:"Source Serif 4",cursor:"pointer",color:tab===t?"#0C1E3C":"#64748B",fontWeight:tab===t?700:400,borderBottom:tab===t?"2px solid #0D9488":"2px solid transparent",marginBottom:-1,textTransform:"capitalize"}}>
                    {t}
                  </button>
                ))}
              </div>

              {tab === "breakdown" && (
                <div>
                  <div style={{height:10,borderRadius:5,overflow:"hidden",display:"flex",background:"#E2E8F0",marginBottom:18}}>
                    {items.filter(it => it.value > 0).map(it => (
                      <div key={it.label} className="bfill" style={{width: ((it.value/r.gross)*100) + "%",background:it.color,height:"100%"}} />
                    ))}
                    <div className="bfill" style={{flex:1,background:"#0D9488"}} />
                  </div>
                  {[...items.filter(it => it.value > 0).map(it => ({...it,neg:true})), {label:"Take-home",value:r.takeHome,color:"#0D9488"}].map(it => (
                    <div key={it.label} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 0",borderBottom:it.label !== "Take-home" ? "1px solid #E2E8F0" : "none"}}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <div style={{width:9,height:9,borderRadius:2,background:it.color,flexShrink:0}} />
                        <span style={{fontSize:13,color:it.label==="Take-home"?"#1E293B":"#475569",fontWeight:it.label==="Take-home"?700:400}}>{it.label}</span>
                      </div>
                      <span style={{fontFamily:"JetBrains Mono",fontSize:13,color:it.neg?"#DC2626":"#0D9488",fontWeight:it.label==="Take-home"?700:400,minWidth:60,textAlign:"right"}}>
                        {it.neg ? "-" + fmt(it.value) : "+" + fmt(it.value)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {tab === "table" && (
                <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,minWidth:300}}>
                    <thead>
                      <tr>{["","Annual","Monthly","Weekly"].map(h => <th key={h} style={{textAlign:h?"right":"left",padding:"6px",color:"#64748B",fontSize:10,letterSpacing:"0.07em",textTransform:"uppercase",borderBottom:"1px solid #E2E8F0"}}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {[
                        {l:"Gross",a:r.gross,m:r.monthly.gross,w:r.weekly.gross},
                        {l:"Income Tax",a:r.incomeTax,m:r.incomeTax/12,w:r.incomeTax/52,neg:true},
                        {l:"Nat. Insurance",a:r.ni,m:r.ni/12,w:r.ni/52,neg:true},
                        r.studentLoan > 0 ? {l:"Student Loan",a:r.studentLoan,m:r.studentLoan/12,w:r.studentLoan/52,neg:true} : null,
                        r.pension > 0 ? {l:"Pension",a:r.pension,m:r.pension/12,w:r.pension/52,neg:true} : null,
                        {l:"Take-Home",a:r.takeHome,m:r.monthly.takeHome,w:r.weekly.takeHome,bold:true,green:true},
                      ].filter(Boolean).map((row, i) => (
                        <tr key={row.l} style={{background:i%2===0?"transparent":"rgba(0,0,0,0.015)",borderBottom:"1px solid #E2E8F0"}}>
                          <td style={{padding:"9px 6px",fontWeight:row.bold?700:400,color:row.green?"#0D9488":"#1E293B",fontSize:12}}>{row.l}</td>
                          {[row.a,row.m,row.w].map((v,j) => (
                            <td key={j} style={{padding:"9px 6px",textAlign:"right",fontFamily:"JetBrains Mono",fontSize:11,color:row.neg?"#DC2626":row.green?"#0D9488":"#1E293B",fontWeight:row.bold?700:400}}>
                              {row.neg ? "-" + fmt(v) : fmtD(v)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{background:"white",borderTop:"1px solid #E2E8F0",padding:mob?"44px 16px":"56px 24px",marginTop:48}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <h2 style={{fontFamily:"DM Serif Display",fontSize:mob?22:28,color:"#0C1E3C",marginBottom:6}}>More Calculators</h2>
          <p style={{color:"#64748B",marginBottom:24,fontSize:14}}>Every scenario, every type of worker.</p>
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr 1fr":"repeat(auto-fill,minmax(190px,1fr))",gap:12}}>
            {[
              {icon:"🏗️",label:"IR35 Contractor",sub:"Inside vs outside",tag:"Popular"},
              {icon:"⏰",label:"Hourly Rate",sub:"Annual take-home"},
              {icon:"👶",label:"Maternity Pay",sub:"SMP and enhanced"},
              {icon:"🏥",label:"NHS Pay Bands",sub:"Bands 1 to 9"},
              {icon:"🎓",label:"Student Loan",sub:"Plans 1, 2, 4 and 5"},
              {icon:"💼",label:"Bonus Calculator",sub:"Net after tax"},
              {icon:"🏦",label:"Salary Sacrifice",sub:"EV, cycle, pension"},
              {icon:"📊",label:"Job Comparison",sub:"Compare 2 offers"},
            ].map(c => (
              <div key={c.label} style={{background:"#F8F9FA",border:"1px solid #E2E8F0",borderRadius:10,padding:"15px 14px",cursor:"pointer"}}>
                <div style={{fontSize:mob?20:22,marginBottom:7}}>{c.icon}</div>
                <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:4}}>
                  <div style={{fontSize:mob?12:13,fontWeight:700,color:"#0C1E3C",lineHeight:1.3}}>{c.label}</div>
                  {c.tag && <span style={{fontSize:9,background:"#F0FDFA",color:"#0D9488",border:"1px solid #99F6E4",borderRadius:3,padding:"2px 5px",flexShrink:0,fontWeight:700}}>{c.tag}</span>}
                </div>
                <div style={{fontSize:11,color:"#64748B",marginTop:2}}>{c.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{background:"#F0FDFA",borderTop:"1px solid #99F6E4",borderBottom:"1px solid #99F6E4",padding:mob?"28px 16px":"32px 24px"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:16}}>
            <div>
              <div style={{fontFamily:"DM Serif Display",fontSize:mob?18:22,color:"#0C1E3C",marginBottom:4}}>Available in Multiple Countries</div>
              <div style={{fontSize:13,color:"#64748B"}}>Same accuracy. Local tax rules.</div>
            </div>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              {[
                {flag:"🇬🇧",label:"UK",live:true},
                {flag:"🇨🇦",label:"Canada",live:false},
                {flag:"🇦🇺",label:"Australia",live:false},
                {flag:"🇳🇱",label:"Netherlands",live:false},
                {flag:"🇸🇪",label:"Sweden",live:false},
              ].map(c => (
                <div key={c.label} style={{display:"flex",alignItems:"center",gap:6,background:"white",border:"1px solid " + (c.live ? "#99F6E4" : "#E2E8F0"),borderRadius:8,padding:"8px 12px"}}>
                  <span style={{fontSize:16}}>{c.flag}</span>
                  <span style={{fontSize:12,fontWeight:600,color:"#0C1E3C"}}>{c.label}</span>
                  <span style={{fontSize:9,background:c.live?"#F0FDFA":"#F1F5F9",color:c.live?"#0D9488":"#64748B",borderRadius:3,padding:"1px 5px",fontWeight:700,fontFamily:"JetBrains Mono",border:c.live?"1px solid #99F6E4":"none"}}>{c.live?"LIVE":"SOON"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{background:"#0C1E3C",padding:mob?"40px 16px":"48px 24px"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <h2 style={{fontFamily:"DM Serif Display",fontSize:mob?20:26,color:"white",marginBottom:6}}>Understanding Your Tax</h2>
          <p style={{color:"rgba(255,255,255,0.4)",marginBottom:22,fontSize:13}}>Plain-English guides to your payslip</p>
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"repeat(auto-fill,minmax(230px,1fr))",gap:12}}>
            {[
              {t:"How UK income tax brackets work",d:"Marginal rates, personal allowances and why a pay rise does not mean you lose money."},
              {t:"National Insurance explained",d:"Class 1 NI, how it is calculated, and employee vs employer contributions."},
              {t:"Pension tax relief: your free money",d:"How salary sacrifice cuts your tax bill. Contributing 5% might only cost you 3%."},
              {t:"2026-27 tax year: what has changed?",d:"Frozen thresholds, NI rates, and student loan changes from April 2026."},
            ].map(g => (
              <div key={g.t} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10,padding:"16px 17px",cursor:"pointer"}}>
                <div style={{fontSize:13,fontWeight:700,color:"#14B8A6",marginBottom:6,lineHeight:1.35}}>{g.t} →</div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",lineHeight:1.6}}>{g.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer style={{background:"#070D1C",padding:"26px 20px",borderTop:"1px solid rgba(255,255,255,0.05)"}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"flex",flexDirection:mob?"column":"row",justifyContent:"space-between",gap:14,alignItems:mob?"flex-start":"center"}}>
          <Logo light={true} size="sm" />
          <div style={{fontSize:11,color:"rgba(255,255,255,0.2)",fontFamily:"JetBrains Mono"}}>Updated 6 April 2026 - 2026-27 tax year</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.18)",maxWidth:300,lineHeight:1.6}}>For guidance only. Always consult HMRC or a qualified adviser.</div>
        </div>
      </footer>
    </div>
  );
}

function ContractorPage() {
  const w = useWidth();
  const mob = w < 640;
  const [dayRate, setDayRate] = useState(500);
  const [daysPerYear, setDaysPerYear] = useState(220);
  const annual = dayRate * daysPerYear;
  const rInside = calculate(annual, 5, "none");
  const salary = 12570;
  const corpTax = Math.max(0, (annual - salary - 9100) * 0.19);
  const divs = Math.max(0, annual - salary - corpTax - 9100);
  const divTax = Math.max(0, divs - 37700) * 0.0875;
  const limitedTH = salary + divs - divTax;
  const saving = limitedTH - rInside.takeHome;
  return (
    <div>
      <div style={{background:"linear-gradient(135deg,#0C1E3C,#1e3d6e)",padding:mob?"38px 20px 68px":"46px 24px 74px",textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-60,right:-40,width:240,height:240,borderRadius:"50%",background:"rgba(13,148,136,0.08)",pointerEvents:"none"}} />
        <div style={{display:"inline-block",background:"rgba(13,148,136,0.15)",border:"1px solid rgba(20,184,166,0.3)",borderRadius:20,padding:"4px 13px",fontSize:11,color:"#14B8A6",marginBottom:14,fontFamily:"JetBrains Mono"}}>IR35 and Contractor Tools</div>
        <h1 style={{fontFamily:"DM Serif Display",fontSize:mob?26:44,color:"white",marginBottom:12,letterSpacing:"-0.02em"}}>Contractor Take-Home<br /><em style={{color:"#14B8A6"}}>Calculator</em></h1>
        <p style={{color:"rgba(255,255,255,0.5)",fontSize:mob?13:15,maxWidth:420,margin:"0 auto"}}>Compare PAYE (inside IR35) vs. Limited Company (outside IR35).</p>
      </div>
      <div style={{maxWidth:860,margin:mob?"-28px 0 0":"-36px auto 0",padding:mob?"0 16px 48px":"0 24px 60px"}}>
        <div style={{background:"white",borderRadius:14,padding:mob?20:26,boxShadow:"0 1px 3px rgba(0,0,0,0.07)",border:"1px solid #E2E8F0",marginBottom:16}} className="fu">
          <h2 style={{fontFamily:"DM Serif Display",fontSize:19,color:"#0C1E3C",marginBottom:20}}>Your Contract Details</h2>
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:16}}>
            <InputField label="Day Rate" value={dayRate} onChange={setDayRate} prefix="£" min={0} max={5000} hint="Exc. VAT" />
            <InputField label="Days per Year" value={daysPerYear} onChange={setDaysPerYear} min={0} max={260} hint="Typical: 220" />
          </div>
          <div style={{padding:"10px 14px",background:"#F0FDFA",borderRadius:7,border:"1px solid #99F6E4",display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
            <span style={{fontSize:13,color:"#0D9488",fontWeight:600}}>Annual contract value</span>
            <span style={{fontFamily:"JetBrains Mono",fontSize:14,fontWeight:700,color:"#0C1E3C"}}>{fmt(annual)}</span>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:14,marginBottom:14}}>
          {[
            {label:"Inside IR35 (PAYE)",value:rInside.takeHome,sub:"All income taxed as employment.",color:"#DC2626",bg:"#FEF2F2",border:"#FECACA"},
            {label:"Outside IR35 (Ltd Co.)",value:limitedTH,sub:"Salary plus dividends structure.",color:"#0D9488",bg:"#F0FDFA",border:"#99F6E4"},
          ].map(s => (
            <div key={s.label} style={{background:s.bg,border:"1.5px solid " + s.border,borderRadius:12,padding:mob?"20px 18px":24}}>
              <div style={{fontSize:11,color:"#64748B",fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:8}}>{s.label}</div>
              <div style={{fontFamily:"DM Serif Display",fontSize:mob?32:44,color:s.color}}><AnimNum value={s.value} /></div>
              <div style={{fontSize:12,color:"#64748B",marginTop:6,fontFamily:"JetBrains Mono"}}>{fmtD(s.value/12)}/month</div>
              <div style={{fontSize:12,color:"#475569",marginTop:8,lineHeight:1.5}}>{s.sub}</div>
            </div>
          ))}
        </div>
        {saving !== 0 && (
          <div style={{background:saving>0?"#F0FDFA":"#FEF2F2",border:"1.5px solid " + (saving>0?"#99F6E4":"#FECACA"),borderRadius:10,padding:"15px 18px",marginBottom:14}}>
            <span style={{fontSize:14,color:"#1E293B",lineHeight:1.5}}>
              Outside IR35 saves you <strong style={{color:saving>0?"#0D9488":"#DC2626"}}>{fmt(Math.abs(saving))}/year</strong> ({fmt(Math.abs(saving/12))}/month) more in take-home pay
            </span>
          </div>
        )}
        <div style={{background:"#FFFBEB",border:"1px solid #FDE68A",borderRadius:10,padding:"14px 18px"}}>
          <div style={{fontSize:12,fontWeight:700,color:"#92400E",marginBottom:4}}>Disclaimer</div>
          <div style={{fontSize:12,color:"#78350F",lineHeight:1.6}}>IR35 status is determined by your actual working practices. This is indicative only. Always seek advice from a qualified IR35 specialist.</div>
        </div>
      </div>
    </div>
  );
}

function AllToolsPage() {
  const w = useWidth();
  const mob = w < 640;
  const cats = [
    {name:"Employee Calculators",emoji:"👤",tools:["Annual Salary to Take-Home","Hourly Rate to Take-Home","Part-Time Salary","Reverse Net to Gross","Overtime Calculator","Bonus Take-Home","Salary Sacrifice Impact"]},
    {name:"Contractor and Freelancer",emoji:"💻",tools:["IR35 Inside vs Outside","Limited Company vs PAYE","Day Rate to Annual","Self-Employed Tax and NI","VAT Registration Checker","Annual vs Monthly Payroll"]},
    {name:"Tax and Deductions",emoji:"📋",tools:["Income Tax Breakdown","National Insurance Calc","Student Loan Plans 1 to 5","Pension Contribution Impact","Capital Gains Tax","Dividend Income Tax"]},
    {name:"Sector-Specific",emoji:"🏥",tools:["NHS Pay Bands 1 to 9","Teaching Spine Points","Police Pay Scales","Minimum Wage to Take-Home","Apprentice Wage","Graduate Take-Home plus Loan"]},
    {name:"Employer and HR",emoji:"🏢",tools:["Employer NI Cost","True Cost of Employee","Maternity Pay SMP","Redundancy Pay","Salary Increase Impact","Job Offer Comparison"]},
    {name:"Countries",emoji:"🌍",tools:["United Kingdom - Live","Canada - Coming soon","Australia - Coming soon","Netherlands - Coming soon","Sweden - Coming soon"]},
  ];
  return (
    <div style={{minHeight:"80vh"}}>
      <div style={{background:"linear-gradient(135deg,#0C1E3C,#1e3d6e)",padding:mob?"38px 20px 58px":"46px 24px 64px",textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-40,right:-30,width:200,height:200,borderRadius:"50%",background:"rgba(13,148,136,0.08)",pointerEvents:"none"}} />
        <h1 style={{fontFamily:"DM Serif Display",fontSize:mob?26:42,color:"white",marginBottom:8}}>All Calculators</h1>
        <p style={{color:"rgba(255,255,255,0.45)",fontSize:14}}>100+ tools for every UK worker, contractor, and employer.</p>
      </div>
      <div style={{maxWidth:1100,margin:mob?"-22px 0 0":"-26px auto 0",padding:mob?"0 16px 48px":"0 24px 60px"}}>
        <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"repeat(auto-fill,minmax(290px,1fr))",gap:16}}>
          {cats.map(cat => (
            <div key={cat.name} style={{background:"white",border:"1px solid #E2E8F0",borderRadius:12,padding:mob?"18px 16px":22,boxShadow:"0 1px 3px rgba(0,0,0,0.07)"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14,paddingBottom:12,borderBottom:"2px solid #0D9488"}}>
                <span style={{fontSize:18}}>{cat.emoji}</span>
                <span style={{fontSize:13,fontWeight:700,color:"#0C1E3C"}}>{cat.name}</span>
              </div>
              {cat.tools.map(t => (
                <div key={t} style={{padding:"9px 0",borderBottom:"1px solid #E2E8F0",fontSize:13,color:"#475569",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  {t} <span style={{color:"#94A3B8",fontSize:11}}>→</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("home");
  return (
    <>
      <style>{gs}</style>
      <NavBar page={page} setPage={setPage} />
      {page === "home" && <HomePage />}
      {page === "contractor" && <ContractorPage />}
      {page === "tools" && <AllToolsPage />}
    </>
  );
}