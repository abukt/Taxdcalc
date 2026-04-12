'use client';
import { useState } from 'react';
import { NavBar, Footer, Logo, PageHero, Disclaimer, InputField, AnimNum, GLOBAL_CSS, C, calculate, fmt, fmtD, useWidth } from '../AppRoot';

export default function IR35Page() {
  const w = useWidth();
  const mob = w < 640;
  const [dayRate, setDayRate] = useState(500);
  const [daysPerYear, setDaysPerYear] = useState(220);

  const annual = dayRate * daysPerYear;
  const rInside = calculate(annual, 5, 'none');

  const salary = 12570;
  const corpTax = Math.max(0, (annual - salary - 9100) * 0.19);
  const divs = Math.max(0, annual - salary - corpTax - 9100);
  const divTax = Math.max(0, divs - 37700) * 0.0875;
  const limitedTH = salary + divs - divTax;
  const saving = limitedTH - rInside.takeHome;

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <NavBar active="/ir35" />

      <PageHero
        tag="Contractor Tools"
        title="IR35 Contractor"
        desc="Compare your take-home pay inside IR35 (PAYE) vs outside IR35 (Limited Company)."
      />

      <div style={{ maxWidth: 860, margin: mob ? '-28px 0 0' : '-36px auto 0', padding: mob ? '0 16px 48px' : '0 24px 60px' }}>
        <div style={{ background: 'white', borderRadius: 14, padding: mob ? 20 : 26, boxShadow: C.shadow, border: '1px solid ' + C.border, marginBottom: 16 }} className="fu">
          <h2 style={{ fontFamily: 'DM Serif Display', fontSize: 19, color: C.navy, marginBottom: 20 }}>Your Contract Details</h2>
          <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gap: 16 }}>
            <InputField label="Day Rate" value={dayRate} onChange={setDayRate} prefix="£" min={0} max={5000} hint="Exc. VAT" />
            <InputField label="Days per Year" value={daysPerYear} onChange={setDaysPerYear} min={0} max={260} hint="Typical: 220" />
          </div>
          <div style={{ padding: '10px 14px', background: C.tealBg, borderRadius: 7, border: '1px solid ' + C.tealBorder, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <span style={{ fontSize: 13, color: C.teal, fontWeight: 600 }}>Annual contract value</span>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 14, fontWeight: 700, color: C.navy }}>{fmt(annual)}</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gap: 14, marginBottom: 14 }}>
          {[
            { label: 'Inside IR35 (PAYE)', value: rInside.takeHome, sub: 'Taxed as an employee. Full income tax and NI.', color: C.red, bg: C.redBg, border: C.redBorder },
            { label: 'Outside IR35 (Ltd Co.)', value: limitedTH, sub: 'Salary plus dividends after corporation tax.', color: C.teal, bg: C.tealBg, border: C.tealBorder },
          ].map(s => (
            <div key={s.label} style={{ background: s.bg, border: '1.5px solid ' + s.border, borderRadius: 12, padding: mob ? '20px 18px' : 24 }}>
              <div style={{ fontSize: 11, color: C.slate, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>{s.label}</div>
              <div style={{ fontFamily: 'DM Serif Display', fontSize: mob ? 32 : 44, color: s.color }}><AnimNum value={s.value} /></div>
              <div style={{ fontSize: 12, color: C.slate, marginTop: 6, fontFamily: 'JetBrains Mono' }}>{fmtD(s.value / 12)}/month</div>
              <div style={{ fontSize: 12, color: C.textMid, marginTop: 8, lineHeight: 1.5 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {saving !== 0 && (
          <div style={{ background: saving > 0 ? C.tealBg : C.redBg, border: '1.5px solid ' + (saving > 0 ? C.tealBorder : C.redBorder), borderRadius: 10, padding: '15px 18px', marginBottom: 14 }}>
            <span style={{ fontSize: 14, color: C.text, lineHeight: 1.5 }}>
              Operating outside IR35 saves you <strong style={{ color: saving > 0 ? C.teal : C.red }}>{fmt(Math.abs(saving))}/year</strong> ({fmt(Math.abs(saving / 12))}/month) more in take-home pay.
            </span>
          </div>
        )}

        <div style={{ background: 'white', borderRadius: 12, padding: mob ? 18 : 24, border: '1px solid ' + C.border, marginBottom: 16 }}>
          <h3 style={{ fontFamily: 'DM Serif Display', fontSize: 17, color: C.navy, marginBottom: 12 }}>How this is calculated</h3>
          <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.red, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Inside IR35</div>
              {[
                ['Contract revenue', fmt(annual)],
                ['Income tax', '-' + fmt(rInside.incomeTax)],
                ['National Insurance', '-' + fmt(rInside.ni)],
                ['Pension (5%)', '-' + fmt(rInside.pension)],
                ['Take-home', fmt(rInside.takeHome)],
              ].map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid ' + C.border, fontSize: 12, color: l === 'Take-home' ? C.red : C.textMid }}>
                  <span style={{ fontWeight: l === 'Take-home' ? 700 : 400 }}>{l}</span>
                  <span style={{ fontFamily: 'JetBrains Mono', fontWeight: l === 'Take-home' ? 700 : 400 }}>{v}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.teal, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Outside IR35 (Ltd Co.)</div>
              {[
                ['Contract revenue', fmt(annual)],
                ['Director salary', fmt(salary)],
                ['Corporation tax (19%)', '-' + fmt(corpTax)],
                ['Dividends', fmt(divs)],
                ['Dividend tax', '-' + fmt(divTax)],
                ['Take-home', fmt(limitedTH)],
              ].map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid ' + C.border, fontSize: 12, color: l === 'Take-home' ? C.teal : C.textMid }}>
                  <span style={{ fontWeight: l === 'Take-home' ? 700 : 400 }}>{l}</span>
                  <span style={{ fontFamily: 'JetBrains Mono', fontWeight: l === 'Take-home' ? 700 : 400 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Disclaimer text="IR35 status is determined by your actual working practices, not your preference. This calculator provides an indicative comparison only. Always seek professional advice from a qualified IR35 specialist or accountant before determining your status." />
      </div>

      <Footer />
    </>
  );
}
