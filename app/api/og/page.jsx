// app/api/og/route.jsx
// Dynamic OG images for social sharing
// Usage: /api/og?salary=45000&th=34120&mo=2843
// These images appear when TaxdCalc URLs are shared on LinkedIn, WhatsApp, Twitter

import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const salary = searchParams.get('salary') || '45000';
  const th = searchParams.get('th') || '34120';
  const mo = searchParams.get('mo') || '2843';
  const type = searchParams.get('type') || 'salary'; // salary | nhs | teacher | trap

  const fmt = n => '\u00A3' + parseInt(n).toLocaleString('en-GB');

  // Different templates by type
  const isNHS = type === 'nhs';
  const isTrap = type === 'trap';

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #0C1E3C 0%, #1e3d6e 100%)',
          padding: '60px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background circle decoration */}
        <div style={{
          position: 'absolute', top: -80, right: -80,
          width: 400, height: 400, borderRadius: '50%',
          background: 'rgba(13,148,136,0.12)', display: 'flex',
        }} />
        <div style={{
          position: 'absolute', bottom: -60, left: -60,
          width: 300, height: 300, borderRadius: '50%',
          background: 'rgba(13,148,136,0.06)', display: 'flex',
        }} />

        {/* TaxdCalc Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 48 }}>
          <div style={{
            width: 44, height: 44,
            background: 'linear-gradient(135deg, #0D9488, #14B8A6)',
            borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: 'white', fontWeight: 700, fontSize: 18 }}>Tx</span>
          </div>
          <span style={{ color: 'white', fontSize: 26, fontWeight: 700 }}>TaxdCalc</span>
          <div style={{
            background: 'rgba(13,148,136,0.2)', border: '1px solid rgba(20,184,166,0.3)',
            borderRadius: 20, padding: '4px 14px', marginLeft: 8,
          }}>
            <span style={{ color: '#14B8A6', fontSize: 14, fontWeight: 600 }}>2026-27</span>
          </div>
        </div>

        {/* Main content */}
        {isTrap ? (
          // Tax trap template
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div style={{ fontSize: 18, color: '#FCA5A5', marginBottom: 16 }}>⚠️ 60% Effective Tax Rate Detected</div>
            <div style={{ fontSize: 54, fontWeight: 800, color: 'white', lineHeight: 1.1, marginBottom: 20 }}>
              You keep only 28p<br />of each extra pound
            </div>
            <div style={{ fontSize: 20, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
              On a {fmt(salary)} salary between £100,000–£125,140<br />
              salary sacrifice pension escapes the 60% trap entirely
            </div>
          </div>
        ) : (
          // Standard salary template
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)', marginBottom: 12 }}>
              {isNHS ? 'NHS Salary' : `${fmt(salary)} salary`} — UK Take-Home Pay 2026-27
            </div>
            <div style={{
              fontSize: 84, fontWeight: 800, color: '#14B8A6',
              lineHeight: 0.95, letterSpacing: '-0.03em', marginBottom: 8,
            }}>
              {fmt(th)}
            </div>
            <div style={{ fontSize: 28, color: 'rgba(255,255,255,0.6)', marginBottom: 40 }}>
              per year  ·  {fmt(mo)}/month net
            </div>

            {/* Mini breakdown */}
            <div style={{ display: 'flex', gap: 20 }}>
              {[
                ['Income Tax', Math.round(parseInt(salary) - parseInt(th) - parseInt(salary) * 0.08), '#F87171'],
                ['Nat. Insurance', Math.round(parseInt(salary) * 0.05), '#FCA5A5'],
                ['You keep', `${((parseInt(th) / parseInt(salary)) * 100).toFixed(0)}%`, '#34D399'],
              ].map(([label, value, color]) => (
                <div key={label} style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 10, padding: '14px 20px',
                }}>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color }}>{typeof value === 'string' ? value : fmt(value)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20, marginTop: 24,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.35)' }}>
            taxdcal.co.uk — Free UK salary calculator
          </span>
          <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.25)' }}>
            Rates verified 6 April 2026
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
