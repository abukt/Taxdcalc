'use client';
import { useState } from 'react';
import { NavBar, Footer, PageHero, Disclaimer, AnimNum, GLOBAL_CSS, C, calcIncomeTax, calcNI, fmt, fmtD, useWidth } from '../AppRoot';

const NHS_BANDS = [
  { band: 'Band 1', min: 23615, max: 23615 },
  { band: 'Band 2', min: 23615, max: 25674 },
  { band: 'Band 3', min: 24625, max: 26258 },
  { band: 'Band 4', min: 26530, max: 29114 },
  { band: 'Band 5', min: 29969, max: 36483 },
  { band: 'Band 6', min: 37338, max: 44962 },
  { band: 'Band 7', min: 46148, max: 52809 },
  { band: 'Band 8a', min: 53755, max: 60504 },
  { band: 'Band 8b', min: 58972, max: 68525 },
  { band: 'Band 8c', min: 70417, max: 81138 },
  { band: 'Band 8d', min: 83571, max: 96376 },
  { band: 'Band 9', min: 99891, max: 114949 },
];

const PENSION_RATES = [
  { threshold: 22221, rate: 0.052 },
  { threshold: 25147, rate: 0.065 },
  { threshold: 30638, rate: 0.083 },
  { threshold: 48982, rate: 0.097 },
  { threshold: 72030, rate: 0.1225 },
  { threshold: Infinity, rate: 0.135 },
];

function getNHSPension(gross) {
  for (const tier of PENSION_RATES) {
    if (gross <= tier.threshold) return gross * tier.rate;
  }
  return gross * 0.135;
}

export default function NHSPage() {
  const w = useWidth();
  const mob = w < 640;
  const [selectedBand, setSelectedBand] = useState('Band 5');
  const [pointInBand, setPointInBand] = useState('min');

  const band = NHS_BANDS.find(b => b.band === selectedBand);
  const gross = pointInBand === 'min' ? band.min : band.max;
  const pension = getNHSPension(gross);
  const incomeTax = calcIncomeTax(gross, pension);
  const ni = calcNI(gross);
  const takeHome = gross - incomeTax - ni - pension;

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <NavBar active="/nhs" />

      <PageHero
        tag="NHS Pay Bands"
        title="NHS Pay Band"
        desc="Calculate your exact take-home pay for every NHS Agenda for Change pay band (2026-27)."
      />

      <div style={{ maxWidth: 860, margin: mob ? '-28px 0 0' : '-36px auto 0', padding: mob ? '0 16px 48px' : '0 24px 60px' }}>
        <div style={{ background: 'white', borderRadius: 14, padding: mob ? 20 : 26, boxShadow: C.shadow, border: '1px solid ' + C.border, marginBottom: 16 }} className="fu">
          <h2 style={{ fontFamily: 'DM Serif Display', fontSize: 19, color: C.navy, marginBottom: 20 }}>Select Your Band</h2>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.navyLight, marginBottom: 7 }}>Pay Band</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(90px,1fr))', gap: 8 }}>
              {NHS_BANDS.map(b => (
                <button key={b.band} onClick={() => setSelectedBand(b.band)}
                  style={{ padding: '10px 6px', borderRadius: 8, border: '1.5px solid ' + (selectedBand === b.band ? C.teal : C.border), background: selectedBand === b.band ? C.tealBg : 'white', color: selectedBand === b.band ? C.teal : C.textMid, fontSize: 12, fontWeight: selectedBand === b.band ? 700 : 400, fontFamily: 'JetBrains Mono', transition: 'all 0.15s' }}>
                  {b.band}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.navyLight, marginBottom: 7 }}>Pay Point</label>
            <div style={{ display: 'flex', gap: 10 }}>
              {[['min', 'Entry point ' + fmt(band.min)], ['max', 'Top of band ' + fmt(band.max)]].map(([val, label]) => (
                <button key={val} onClick={() => setPointInBand(val)}
                  style={{ flex: 1, padding: '11px 14px', borderRadius: 8, border: '1.5px solid ' + (pointInBand === val ? C.teal : C.border), background: pointInBand === val ? C.tealBg : 'white', color: pointInBand === val ? C.teal : C.textMid, fontSize: 13, fontWeight: pointInBand === val ? 700 : 400, fontFamily: 'Source Serif 4', transition: 'all 0.15s' }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ background: 'linear-gradient(135deg,#0C1E3C,#1e3d6e)', borderRadius: 14, padding: mob ? '20px 18px' : 26, boxShadow: '0 4px 24px rgba(12,30,60,0.3)', marginBottom: 16, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -20, right: -20, width: 130, height: 130, borderRadius: '50%', background: 'rgba(13,148,136,0.12)', pointerEvents: 'none' }} />
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 4, fontFamily: 'JetBrains Mono' }}>{selectedBand} — Annual Take-Home</div>
          <div style={{ fontFamily: 'DM Serif Display', fontSize: mob ? 38 : 52, color: 'white', lineHeight: 1 }}><AnimNum value={takeHome} /></div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', fontFamily: 'JetBrains Mono', marginTop: 6 }}>{fmtD(takeHome / 12)} per month</div>
          <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
              <div className="bfill" style={{ width: ((takeHome / gross) * 100) + '%', height: '100%', background: 'linear-gradient(90deg,#0D9488,#14B8A6)', borderRadius: 2 }} />
            </div>
            <span style={{ fontSize: 12, color: '#14B8A6', fontFamily: 'JetBrains Mono', fontWeight: 600, flexShrink: 0 }}>{((takeHome / gross) * 100).toFixed(1)}% kept</span>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: 12, padding: mob ? 18 : 24, border: '1px solid ' + C.border, marginBottom: 16 }}>
          <h3 style={{ fontFamily: 'DM Serif Display', fontSize: 17, color: C.navy, marginBottom: 16 }}>Full Breakdown</h3>
          {[
            { label: 'Gross salary', value: gross, color: C.navy },
            { label: 'Income tax', value: -incomeTax, color: C.red },
            { label: 'National Insurance (8%/2%)', value: -ni, color: '#F59E0B' },
            { label: 'NHS pension (' + (getNHSPension(gross) / gross * 100).toFixed(1) + '%)', value: -pension, color: '#6366F1' },
            { label: 'Take-home pay', value: takeHome, color: C.teal, bold: true },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid ' + C.border }}>
              <span style={{ fontSize: 13, color: row.bold ? C.text : C.textMid, fontWeight: row.bold ? 700 : 400 }}>{row.label}</span>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 13, color: row.color, fontWeight: row.bold ? 700 : 400 }}>{fmt(Math.abs(row.value))}</div>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: C.slateLight }}>{fmtD(Math.abs(row.value) / 12)}/mo</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: C.tealBg, border: '1px solid ' + C.tealBorder, borderRadius: 10, padding: '14px 18px', marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.teal, marginBottom: 4 }}>About NHS Pension Contributions</div>
          <div style={{ fontSize: 12, color: '#0f766e', lineHeight: 1.6 }}>NHS pension contributions are tiered based on your pay. The rate shown above uses the 2026-27 tiered contribution schedule. The NHS pension is a defined benefit scheme, one of the most valuable workplace pensions available.</div>
        </div>

        <Disclaimer text="Pay bands shown are based on 2026-27 Agenda for Change rates for England. Rates may differ in Scotland, Wales and Northern Ireland. Pension contribution tiers are approximate." />
      </div>

      <Footer />
    </>
  );
}
