'use client';
import { useState } from 'react';
import { NavBar, Footer, PageHero, Disclaimer, InputField, SliderField, SelectField, AnimNum, GLOBAL_CSS, C, calculate, fmt, fmtD, useWidth } from '../AppRoot';

export default function ComparisonPage() {
  const w = useWidth();
  const mob = w < 640;

  const [job1, setJob1] = useState({ salary: 45000, pension: 5, loan: 'none', label: 'Job A' });
  const [job2, setJob2] = useState({ salary: 52000, pension: 3, loan: 'none', label: 'Job B' });

  const r1 = calculate(job1.salary, job1.pension, job1.loan);
  const r2 = calculate(job2.salary, job2.pension, job2.loan);

  const diff = r2.takeHome - r1.takeHome;
  const monthlyDiff = diff / 12;

  const loanOptions = [
    { value: 'none', label: 'No student loan' },
    { value: 'plan1', label: 'Plan 1' },
    { value: 'plan2', label: 'Plan 2' },
    { value: 'plan4', label: 'Plan 4 Scotland' },
    { value: 'plan5', label: 'Plan 5' },
  ];

  function JobPanel({ job, setJob, result, color }) {
    return (
      <div>
        <div style={{ background: 'white', borderRadius: 14, padding: mob ? 18 : 24, boxShadow: C.shadow, border: '1px solid ' + C.border, marginBottom: 14 }}>
          <input value={job.label} onChange={e => setJob({ ...job, label: e.target.value })}
            style={{ fontFamily: 'DM Serif Display', fontSize: 18, color: C.navy, border: 'none', outline: 'none', width: '100%', background: 'transparent', marginBottom: 16 }} />
          <InputField label="Annual Salary" value={job.salary} onChange={v => setJob({ ...job, salary: v })} prefix="£" hint={fmt(v => v / 12)} />
          <SliderField label="Pension" value={job.pension} onChange={v => setJob({ ...job, pension: v })} min={0} max={20} step={0.5} format={v => v + '%'} />
          <SelectField label="Student Loan" value={job.loan} onChange={v => setJob({ ...job, loan: v })} options={loanOptions} />
        </div>

        <div style={{ background: color === 'teal' ? C.tealBg : 'linear-gradient(135deg,#0C1E3C,#1e3d6e)', borderRadius: 12, padding: '20px 22px', border: '1.5px solid ' + (color === 'teal' ? C.tealBorder : 'transparent') }}>
          <div style={{ fontSize: 10, color: color === 'teal' ? C.teal : 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 6, fontFamily: 'JetBrains Mono' }}>Annual Take-Home</div>
          <div style={{ fontFamily: 'DM Serif Display', fontSize: 36, color: color === 'teal' ? C.teal : 'white', lineHeight: 1 }}><AnimNum value={result.takeHome} /></div>
          <div style={{ fontSize: 12, color: color === 'teal' ? C.teal : 'rgba(255,255,255,0.45)', fontFamily: 'JetBrains Mono', marginTop: 6 }}>{fmtD(result.monthly.takeHome)}/mo</div>
          <div style={{ marginTop: 12, fontSize: 12, color: color === 'teal' ? '#0f766e' : 'rgba(255,255,255,0.4)' }}>
            Tax: {fmt(result.incomeTax)} | NI: {fmt(result.ni)} | Pension: {fmt(result.pension)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <NavBar active="/comparison" />

      <PageHero
        tag="Job Comparison Tool"
        title="Compare Two Job"
        accent={C.tealLight}
        desc="Enter the details of two job offers to see which puts more money in your pocket after tax."
      />

      <div style={{ maxWidth: 1000, margin: mob ? '-28px 0 0' : '-36px auto 0', padding: mob ? '0 16px 48px' : '0 24px 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gap: 20, marginBottom: 20 }}>
          <JobPanel job={job1} setJob={setJob1} result={r1} color="navy" />
          <JobPanel job={job2} setJob={setJob2} result={r2} color="teal" />
        </div>

        <div style={{ background: diff >= 0 ? C.tealBg : C.redBg, border: '2px solid ' + (diff >= 0 ? C.tealBorder : C.redBorder), borderRadius: 14, padding: '22px 26px', marginBottom: 16 }}>
          <div style={{ fontFamily: 'DM Serif Display', fontSize: 16, color: C.navy, marginBottom: 6 }}>
            {diff >= 0 ? job2.label : job1.label} pays more after tax
          </div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 10, color: C.slate, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4, fontFamily: 'JetBrains Mono' }}>Annual difference</div>
              <div style={{ fontFamily: 'DM Serif Display', fontSize: 32, color: diff >= 0 ? C.teal : C.red }}><AnimNum value={Math.abs(diff)} /></div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: C.slate, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4, fontFamily: 'JetBrains Mono' }}>Monthly difference</div>
              <div style={{ fontFamily: 'DM Serif Display', fontSize: 32, color: diff >= 0 ? C.teal : C.red }}><AnimNum value={Math.abs(monthlyDiff)} format={fmtD} /></div>
            </div>
          </div>
          <div style={{ fontSize: 13, color: C.textMid, marginTop: 12, lineHeight: 1.6 }}>
            {job2.label} ({fmt(job2.salary)} gross) takes home {fmt(Math.abs(diff))} more per year than {job1.label} ({fmt(job1.salary)} gross) after income tax, NI, pension and student loan deductions.
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: 12, padding: mob ? 18 : 24, border: '1px solid ' + C.border, marginBottom: 16 }}>
          <h3 style={{ fontFamily: 'DM Serif Display', fontSize: 17, color: C.navy, marginBottom: 16 }}>Side by Side</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 340 }}>
              <thead>
                <tr>
                  {['', job1.label, job2.label].map((h, i) => (
                    <th key={i} style={{ textAlign: i === 0 ? 'left' : 'right', padding: '8px 10px', fontSize: 10, color: C.slate, letterSpacing: '0.07em', textTransform: 'uppercase', borderBottom: '2px solid ' + C.border }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { l: 'Gross salary', v1: r1.gross, v2: r2.gross },
                  { l: 'Income tax', v1: r1.incomeTax, v2: r2.incomeTax, neg: true },
                  { l: 'National Insurance', v1: r1.ni, v2: r2.ni, neg: true },
                  { l: 'Pension', v1: r1.pension, v2: r2.pension, neg: true },
                  { l: 'Student loan', v1: r1.studentLoan, v2: r2.studentLoan, neg: true },
                  { l: 'Take-home', v1: r1.takeHome, v2: r2.takeHome, bold: true },
                ].map((row, i) => (
                  <tr key={row.l} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)', borderBottom: '1px solid ' + C.border }}>
                    <td style={{ padding: '10px', fontSize: 13, fontWeight: row.bold ? 700 : 400, color: row.bold ? C.navy : C.textMid }}>{row.l}</td>
                    <td style={{ padding: '10px', textAlign: 'right', fontFamily: 'JetBrains Mono', fontSize: 12, color: row.bold ? C.navy : row.neg ? C.red : C.text, fontWeight: row.bold ? 700 : 400 }}>
                      {row.v1 === 0 ? '-' : (row.neg ? '-' : '') + fmt(row.v1)}
                    </td>
                    <td style={{ padding: '10px', textAlign: 'right', fontFamily: 'JetBrains Mono', fontSize: 12, color: row.bold ? C.teal : row.neg ? C.red : C.text, fontWeight: row.bold ? 700 : 400 }}>
                      {row.v2 === 0 ? '-' : (row.neg ? '-' : '') + fmt(row.v2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <Disclaimer text="This comparison is based on salary, pension and student loan only. It does not include benefits such as health insurance, bonus potential, holiday allowance or share schemes, which may significantly affect the true value of each offer." />
      </div>
      <Footer />
    </>
  );
}
