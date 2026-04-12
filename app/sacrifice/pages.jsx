'use client';
import { useState } from 'react';
import { NavBar, Footer, PageHero, Disclaimer, InputField, SliderField, AnimNum, GLOBAL_CSS, C, calcIncomeTax, calcNI, fmt, fmtD, useWidth } from '../AppRoot';

export default function SacrificePage() {
  const w = useWidth();
  const mob = w < 640;
  const [salary, setSalary] = useState(45000);
  const [sacrificeAmount, setSacrificeAmount] = useState(200);
  const [sacrificeType, setSacrificeType] = useState('pension');

  const monthlyGross = salary / 12;
  const annualSacrifice = sacrificeAmount * 12;
  const newSalary = Math.max(0, salary - annualSacrifice);

  const taxBefore = calcIncomeTax(salary, 0) + calcNI(salary);
  const taxAfter = calcIncomeTax(newSalary, 0) + calcNI(newSalary);

  const thBefore = salary - taxBefore;
  const thAfter = newSalary - taxAfter;

  const monthlyThBefore = thBefore / 12;
  const monthlyThAfter = thAfter / 12;
  const monthlyCost = monthlyThBefore - monthlyThAfter;
  const taxSaving = (taxBefore - taxAfter) / 12;

  const types = [
    { id: 'pension', label: 'Pension', icon: '🏦' },
    { id: 'ev', label: 'Electric Car', icon: '🚗' },
    { id: 'cycle', label: 'Cycle to Work', icon: '🚲' },
    { id: 'childcare', label: 'Childcare', icon: '👶' },
  ];

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <NavBar active="/sacrifice" />

      <PageHero
        tag="Salary Sacrifice"
        title="Salary Sacrifice"
        desc="See the real cost of salary sacrifice after tax and NI savings. Pension, EV, cycle to work and more."
      />

      <div style={{ maxWidth: 1000, margin: mob ? '-28px 0 0' : '-36px auto 0', padding: mob ? '0 16px 48px' : '0 24px 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : 'minmax(300px,380px) 1fr', gap: 20, alignItems: 'start' }}>

          <div style={{ background: 'white', borderRadius: 14, padding: mob ? 20 : 26, boxShadow: C.shadow, border: '1px solid ' + C.border }} className="fu">
            <h2 style={{ fontFamily: 'DM Serif Display', fontSize: 19, color: C.navy, marginBottom: 20 }}>Your Details</h2>

            <InputField label="Annual Salary" value={salary} onChange={setSalary} prefix="£" hint={fmt(salary / 12) + '/mo'} />

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.navyLight, marginBottom: 8 }}>Sacrifice Type</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {types.map(t => (
                  <button key={t.id} onClick={() => setSacrificeType(t.id)}
                    style={{ padding: '10px 12px', borderRadius: 8, border: '1.5px solid ' + (sacrificeType === t.id ? C.teal : C.border), background: sacrificeType === t.id ? C.tealBg : 'white', color: sacrificeType === t.id ? C.teal : C.textMid, fontSize: 13, fontWeight: sacrificeType === t.id ? 700 : 400, display: 'flex', alignItems: 'center', gap: 7, transition: 'all 0.15s' }}>
                    <span>{t.icon}</span><span>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <SliderField label="Monthly sacrifice amount" value={sacrificeAmount} onChange={setSacrificeAmount} min={10} max={2000} step={10} format={v => fmtD(v) + '/mo'} />

            <div style={{ padding: '12px 14px', background: C.tealBg, border: '1px solid ' + C.tealBorder, borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: C.teal, fontWeight: 700, marginBottom: 4 }}>Annual sacrifice</div>
              <div style={{ fontFamily: 'DM Serif Display', fontSize: 22, color: C.navy }}>{fmt(annualSacrifice)}</div>
              <div style={{ fontSize: 11, color: C.slate, marginTop: 2 }}>New annual salary: {fmt(newSalary)}</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }} className="fu">
            <div style={{ background: 'linear-gradient(135deg,#0C1E3C,#1e3d6e)', borderRadius: 14, padding: mob ? '20px 18px' : 26, boxShadow: '0 4px 24px rgba(12,30,60,0.3)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -20, right: -20, width: 130, height: 130, borderRadius: '50%', background: 'rgba(13,148,136,0.12)', pointerEvents: 'none' }} />
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 6, fontFamily: 'JetBrains Mono' }}>Real monthly cost to you</div>
              <div style={{ fontFamily: 'DM Serif Display', fontSize: mob ? 38 : 52, color: 'white', lineHeight: 1 }}><AnimNum value={monthlyCost} format={fmtD} /></div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', fontFamily: 'JetBrains Mono', marginTop: 6 }}>Not {fmtD(sacrificeAmount)} — because of tax and NI savings</div>
              <div style={{ marginTop: 14, padding: '10px 14px', background: 'rgba(13,148,136,0.15)', borderRadius: 8, border: '1px solid rgba(20,184,166,0.2)' }}>
                <div style={{ fontSize: 11, color: '#14B8A6', fontWeight: 600 }}>Tax and NI saving: {fmtD(taxSaving)}/month</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: 'Take-home before', value: monthlyThBefore, color: C.navy },
                { label: 'Take-home after', value: monthlyThAfter, color: C.teal },
              ].map(s => (
                <div key={s.label} style={{ background: 'white', border: '1px solid ' + C.border, borderRadius: 10, padding: '14px 16px', boxShadow: C.shadow }}>
                  <div style={{ fontSize: 10, color: C.slate, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 5, fontFamily: 'JetBrains Mono' }}>{s.label}</div>
                  <div style={{ fontFamily: 'DM Serif Display', fontSize: mob ? 20 : 24, color: s.color, lineHeight: 1 }}><AnimNum value={s.value} format={fmtD} /></div>
                  <div style={{ fontSize: 10, color: C.slateLight, marginTop: 3, fontFamily: 'JetBrains Mono' }}>per month</div>
                </div>
              ))}
            </div>

            <div style={{ background: 'white', borderRadius: 12, padding: mob ? 16 : 22, border: '1px solid ' + C.border }}>
              <h3 style={{ fontFamily: 'DM Serif Display', fontSize: 16, color: C.navy, marginBottom: 14 }}>Monthly breakdown</h3>
              {[
                { label: 'Sacrifice amount', value: sacrificeAmount, note: 'Goes to ' + types.find(t => t.id === sacrificeType).label },
                { label: 'Tax + NI saved', value: taxSaving, green: true, note: 'Government subsidy' },
                { label: 'Net cost to you', value: monthlyCost, bold: true, note: 'Actual reduction in take-home' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '10px 0', borderBottom: '1px solid ' + C.border }}>
                  <div>
                    <div style={{ fontSize: 13, color: row.bold ? C.text : C.textMid, fontWeight: row.bold ? 700 : 400 }}>{row.label}</div>
                    <div style={{ fontSize: 11, color: C.slateLight, marginTop: 2 }}>{row.note}</div>
                  </div>
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 13, color: row.green ? C.teal : row.bold ? C.navy : C.text, fontWeight: row.bold ? 700 : 400 }}>
                    {row.green ? '+' : ''}{fmtD(row.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Disclaimer text="Salary sacrifice reduces your gross salary, which may affect mortgage applications, life insurance and state benefits. Electric car benefit-in-kind tax applies to EV salary sacrifice schemes. Always check with your employer and a financial adviser." />
      </div>
      <Footer />
    </>
  );
}
