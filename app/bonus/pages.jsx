'use client';
import { useState } from 'react';
import { NavBar, Footer, PageHero, Disclaimer, InputField, AnimNum, GLOBAL_CSS, C, calcIncomeTax, calcNI, fmt, fmtD, useWidth } from '../AppRoot';

export default function BonusPage() {
  const w = useWidth();
  const mob = w < 640;
  const [salary, setSalary] = useState(45000);
  const [bonus, setBonus] = useState(5000);

  const taxWithout = calcIncomeTax(salary, 0) + calcNI(salary);
  const taxWith = calcIncomeTax(salary + bonus, 0) + calcNI(salary + bonus);
  const bonusTax = taxWith - taxWithout;
  const netBonus = bonus - bonusTax;
  const effectiveRate = bonus > 0 ? (bonusTax / bonus) * 100 : 0;

  const takeHomeWithout = salary - taxWithout;
  const takeHomeWith = salary + bonus - taxWith;

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <NavBar active="/bonus" />

      <PageHero
        tag="Bonus Calculator"
        title="Bonus Tax"
        desc="See exactly how much of your bonus you actually keep after income tax and National Insurance."
      />

      <div style={{ maxWidth: 860, margin: mob ? '-28px 0 0' : '-36px auto 0', padding: mob ? '0 16px 48px' : '0 24px 60px' }}>
        <div style={{ background: 'white', borderRadius: 14, padding: mob ? 20 : 26, boxShadow: C.shadow, border: '1px solid ' + C.border, marginBottom: 16 }} className="fu">
          <h2 style={{ fontFamily: 'DM Serif Display', fontSize: 19, color: C.navy, marginBottom: 20 }}>Your Details</h2>
          <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gap: 16 }}>
            <InputField label="Annual Salary (before bonus)" value={salary} onChange={setSalary} prefix="£" hint={fmt(salary / 12) + '/mo'} />
            <InputField label="Bonus Amount" value={bonus} onChange={setBonus} prefix="£" min={0} max={500000} hint="Gross bonus" />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gap: 14, marginBottom: 16 }}>
          <div style={{ background: C.redBg, border: '1.5px solid ' + C.redBorder, borderRadius: 12, padding: mob ? '20px 18px' : 24 }}>
            <div style={{ fontSize: 11, color: C.slate, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>Tax on your bonus</div>
            <div style={{ fontFamily: 'DM Serif Display', fontSize: mob ? 32 : 42, color: C.red }}><AnimNum value={bonusTax} /></div>
            <div style={{ fontSize: 12, color: C.slate, marginTop: 6, fontFamily: 'JetBrains Mono' }}>Effective rate: {effectiveRate.toFixed(1)}%</div>
            <div style={{ fontSize: 12, color: C.textMid, marginTop: 8, lineHeight: 1.5 }}>Income tax + NI taken from your bonus</div>
          </div>
          <div style={{ background: C.tealBg, border: '1.5px solid ' + C.tealBorder, borderRadius: 12, padding: mob ? '20px 18px' : 24 }}>
            <div style={{ fontSize: 11, color: C.slate, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>You actually receive</div>
            <div style={{ fontFamily: 'DM Serif Display', fontSize: mob ? 32 : 42, color: C.teal }}><AnimNum value={netBonus} /></div>
            <div style={{ fontSize: 12, color: C.slate, marginTop: 6, fontFamily: 'JetBrains Mono' }}>{fmt(bonus)} gross bonus</div>
            <div style={{ fontSize: 12, color: C.textMid, marginTop: 8, lineHeight: 1.5 }}>Net bonus after all deductions</div>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: 12, padding: mob ? 18 : 24, border: '1px solid ' + C.border, marginBottom: 16 }}>
          <h3 style={{ fontFamily: 'DM Serif Display', fontSize: 17, color: C.navy, marginBottom: 16 }}>Before and After Comparison</h3>
          <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gap: 16 }}>
            {[
              { label: 'Without bonus', gross: salary, tax: taxWithout, th: takeHomeWithout },
              { label: 'With bonus', gross: salary + bonus, tax: taxWith, th: takeHomeWith },
            ].map(col => (
              <div key={col.label}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.navy, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10, paddingBottom: 8, borderBottom: '2px solid ' + C.teal }}>{col.label}</div>
                {[
                  { l: 'Gross income', v: col.gross },
                  { l: 'Income tax + NI', v: -col.tax, red: true },
                  { l: 'Take-home', v: col.th, bold: true, teal: true },
                ].map(row => (
                  <div key={row.l} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid ' + C.border }}>
                    <span style={{ fontSize: 13, color: row.bold ? C.text : C.textMid, fontWeight: row.bold ? 700 : 400 }}>{row.l}</span>
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: row.red ? C.red : row.teal ? C.teal : C.text, fontWeight: row.bold ? 700 : 400 }}>
                      {row.v < 0 ? '-' + fmt(Math.abs(row.v)) : fmt(row.v)}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: C.amberBg, border: '1px solid ' + C.amberBorder, borderRadius: 10, padding: '14px 18px', marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#92400E', marginBottom: 4 }}>Tip: Salary Sacrifice Your Bonus</div>
          <div style={{ fontSize: 12, color: '#78350F', lineHeight: 1.6 }}>If your employer allows it, sacrificing some or all of your bonus into your pension can significantly reduce the tax you pay. A £5,000 bonus sacrificed to pension by a higher rate taxpayer saves approximately £2,000 in tax and NI combined.</div>
        </div>

        <Disclaimer />
      </div>
      <Footer />
    </>
  );
}
