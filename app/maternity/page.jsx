‘use client’;
import { useState } from ‘react’;
import { NavBar, Footer, PageHero, Disclaimer, InputField, SliderField, AnimNum, GLOBAL_CSS, C, fmt, fmtD, useWidth } from ‘../AppRoot’;

const SMP_WEEKLY = 187.18;

function calcMaternity(grossAnnual, enhancedWeeks, enhancedPct) {
const weeklyGross = grossAnnual / 52;
const weeks = [];

for (let w = 1; w <= 52; w++) {
let gross = 0;
if (w <= enhancedWeeks) {
gross = weeklyGross * (enhancedPct / 100);
} else if (w <= 6) {
gross = weeklyGross * 0.9;
} else if (w <= 39) {
gross = SMP_WEEKLY;
} else {
gross = 0;
}
weeks.push(gross);
}

const totalGross = weeks.reduce((a, b) => a + b, 0);
const smtWeeks = Math.min(6, 52);
const smpTotal = Math.min(39, 52) > 6 ? (weeklyGross * 0.9 * Math.min(6, 52)) + (SMP_WEEKLY * (Math.min(39, 52) - 6)) : weeklyGross * 0.9 * Math.min(39, 52);

return {
weeks,
totalGross,
monthlyAvg: totalGross / 12,
week1to6: weeklyGross * 0.9,
week7to39: SMP_WEEKLY,
enhancedTotal: enhancedWeeks > 0 ? weeklyGross * (enhancedPct / 100) * Math.min(enhancedWeeks, 39) : 0,
};
}

export default function MaternityPage() {
const w = useWidth();
const mob = w < 640;
const [salary, setSalary] = useState(35000);
const [enhanced, setEnhanced] = useState(false);
const [enhancedWeeks, setEnhancedWeeks] = useState(13);
const [enhancedPct, setEnhancedPct] = useState(100);

const r = calcMaternity(salary, enhanced ? enhancedWeeks : 0, enhancedPct);
const weeklyNormal = salary / 52;

const periods = [
{ label: enhanced && enhancedWeeks > 0 ? ‘Weeks 1-’ + enhancedWeeks + ’ (Enhanced)’ : ‘Weeks 1-6 (90% of salary)’, gross: enhanced ? weeklyNormal * (enhancedPct / 100) : weeklyNormal * 0.9, weeks: enhanced ? enhancedWeeks : 6, color: C.teal },
{ label: ‘Weeks 7-39 (Statutory SMP)’, gross: SMP_WEEKLY, weeks: 33, color: ‘#6366F1’ },
{ label: ‘Weeks 40-52 (Unpaid)’, gross: 0, weeks: 13, color: C.slateLight },
];

return (
<>
<style>{GLOBAL_CSS}</style>
<NavBar active="/maternity" />

```
  <PageHero
    tag="Maternity Pay"
    title="Maternity Pay"
    desc="Calculate your statutory maternity pay (SMP) week by week for 2026-27, with or without enhanced pay."
  />

  <div style={{ maxWidth: 860, margin: mob ? '-28px 0 0' : '-36px auto 0', padding: mob ? '0 16px 48px' : '0 24px 60px' }}>
    <div style={{ background: 'white', borderRadius: 14, padding: mob ? 20 : 26, boxShadow: C.shadow, border: '1px solid ' + C.border, marginBottom: 16 }} className="fu">
      <h2 style={{ fontFamily: 'DM Serif Display', fontSize: 19, color: C.navy, marginBottom: 20 }}>Your Details</h2>
      <InputField label="Annual Salary (before maternity leave)" value={salary} onChange={setSalary} prefix="£" hint={fmt(salary / 52) + '/wk'} />

      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.navyLight, marginBottom: 10 }}>Does your employer offer enhanced maternity pay?</label>
        <div style={{ display: 'flex', gap: 10 }}>
          {[['No - statutory SMP only', false], ['Yes - enhanced pay', true]].map(([label, val]) => (
            <button key={label} onClick={() => setEnhanced(val)}
              style={{ flex: 1, padding: '11px 14px', borderRadius: 8, border: '1.5px solid ' + (enhanced === val ? C.teal : C.border), background: enhanced === val ? C.tealBg : 'white', color: enhanced === val ? C.teal : C.textMid, fontSize: 13, fontWeight: enhanced === val ? 700 : 400, fontFamily: 'Source Serif 4', transition: 'all 0.15s' }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {enhanced && (
        <>
          <SliderField label="Enhanced weeks" value={enhancedWeeks} onChange={setEnhancedWeeks} min={1} max={39} step={1} format={v => v + ' weeks'} />
          <SliderField label="Enhanced pay rate" value={enhancedPct} onChange={setEnhancedPct} min={50} max={100} step={5} format={v => v + '% of salary'} />
        </>
      )}
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
      {[
        { label: 'Total maternity pay (39 wks)', value: r.totalGross },
        { label: 'Monthly average', value: r.monthlyAvg },
        { label: 'Statutory SMP rate', value: SMP_WEEKLY * 52 / 12 },
      ].map(s => (
        <div key={s.label} style={{ background: 'white', border: '1px solid ' + C.border, borderRadius: 10, padding: '16px', boxShadow: C.shadow }}>
          <div style={{ fontSize: 10, color: C.slate, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 5, fontFamily: 'JetBrains Mono' }}>{s.label}</div>
          <div style={{ fontFamily: 'DM Serif Display', fontSize: 24, color: C.navy, lineHeight: 1 }}><AnimNum value={s.value} /></div>
        </div>
      ))}
    </div>

    <div style={{ background: 'white', borderRadius: 12, padding: mob ? 18 : 24, border: '1px solid ' + C.border, marginBottom: 16 }}>
      <h3 style={{ fontFamily: 'DM Serif Display', fontSize: 17, color: C.navy, marginBottom: 16 }}>Pay by Period</h3>
      {periods.map(p => (
        <div key={p.label} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: '1px solid ' + C.border }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: p.color, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>{p.label}</div>
            <div style={{ fontSize: 11, color: C.slate, marginTop: 2 }}>{p.weeks} weeks</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 13, color: p.gross === 0 ? C.slateLight : C.text, fontWeight: 600 }}>{p.gross === 0 ? 'Unpaid' : fmtD(p.gross) + '/wk'}</div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: C.slateLight }}>{p.gross === 0 ? '' : fmt(p.gross * p.weeks) + ' total'}</div>
          </div>
        </div>
      ))}
    </div>

    <div style={{ background: C.tealBg, border: '1px solid ' + C.tealBorder, borderRadius: 10, padding: '14px 18px', marginBottom: 16 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: C.teal, marginBottom: 6 }}>SMP Eligibility</div>
      <div style={{ fontSize: 12, color: '#0f766e', lineHeight: 1.7 }}>
        To qualify for SMP you must: have been employed by your employer continuously for at least 26 weeks by the 15th week before your baby is due, earn at least £123 per week on average, and give the correct notice. The statutory SMP rate for 2026-27 is £187.18 per week.
      </div>
    </div>

    <Disclaimer text="This calculator shows gross maternity pay before tax and National Insurance deductions. Your actual take-home pay will be lower. SMP figures are for 2026-27. Enhanced pay varies by employer." />
  </div>

  <Footer />
</>
```

);
}
