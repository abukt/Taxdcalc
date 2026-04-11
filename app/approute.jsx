‘use client’;
import React, { useState, useEffect, useRef } from ‘react’;

// ── RESPONSIVE ────────────────────────────────────────────────────────────────
function useWidth() {
const [w, setW] = useState(typeof window !== ‘undefined’ ? window.innerWidth : 800);
useEffect(() => {
const fn = () => setW(window.innerWidth);
window.addEventListener(‘resize’, fn);
return () => window.removeEventListener(‘resize’, fn);
}, []);
return w;
}

// ── URL ROUTE MAP ─────────────────────────────────────────────────────────────
const ROUTE_MAP = {
home:       ‘/’,
contractor: ‘/ir35’,
nhs:        ‘/nhs’,
maternity:  ‘/maternity’,
hourly:     ‘/hourly’,
bonus:      ‘/bonus’,
sacrifice:  ‘/sacrifice’,
comparison: ‘/comparison’,
tools:      ‘/tools’,
blog:       ‘/blog’,
};

// ── TAX LOGIC 2026-27 ─────────────────────────────────────────────────────────
const UK_BANDS = [
{ from: 0,      to: 12570,    rate: 0 },
{ from: 12570,  to: 50270,    rate: 0.20 },
{ from: 50270,  to: 125140,   rate: 0.40 },
{ from: 125140, to: Infinity, rate: 0.45 },
];
const SCOT_BANDS = [
{ from: 0,      to: 12570,    rate: 0 },
{ from: 12570,  to: 16537,    rate: 0.19 },
{ from: 16537,  to: 29526,    rate: 0.20 },
{ from: 29526,  to: 43662,    rate: 0.21 },
{ from: 43662,  to: 75000,    rate: 0.42 },
{ from: 75000,  to: 125140,   rate: 0.45 },
{ from: 125140, to: Infinity, rate: 0.48 },
];

function parseTaxCode(raw) {
if (!raw || raw.trim() === ‘’) return { pa: null };
const c = raw.trim().toUpperCase().replace(/\s/g, ‘’);
if (c === ‘NT’) return { noTax: true };
if (c === ‘BR’) return { flatRate: 0.20 };
if (c === ‘D0’) return { flatRate: 0.40 };
if (c === ‘D1’) return { flatRate: 0.45 };
if (c === ‘0T’) return { pa: 0 };
if (c.startsWith(‘K’)) { const n = parseInt(c.slice(1),10); if (!isNaN(n)) return { pa: -(n*10) }; }
const stripped = c.replace(/^[SC]/,’’).replace(/[A-Z]+$/,’’);
const n = parseInt(stripped, 10);
if (!isNaN(n) && n > 0) return { pa: n * 10 };
return { pa: null, unknown: true };
}

function calcTax(gross, pension, scotland, taxCode) {
const parsed = parseTaxCode(taxCode);
if (parsed.noTax) return 0;
const ti = Math.max(0, gross - pension);
if (parsed.flatRate !== undefined) return ti * parsed.flatRate;
let pa = parsed.pa !== null ? parsed.pa : 12570;
if (pa > 0 && ti > 100000) pa = Math.max(0, pa - (ti - 100000) / 2);
const taxable = pa >= 0 ? Math.max(0, ti - pa) : ti + Math.abs(pa);
const bands = scotland ? SCOT_BANDS : UK_BANDS;
let tax = 0, remaining = taxable;
for (const b of bands) {
if (remaining <= 0 || b.rate === 0) continue;
const start = Math.max(0, b.from - (pa > 0 ? pa : 0));
const end   = b.to === Infinity ? Infinity : Math.max(0, b.to - (pa > 0 ? pa : 0));
const width = end === Infinity ? remaining : Math.min(remaining, end - start);
if (width > 0) { tax += width * b.rate; remaining -= width; }
}
return Math.max(0, tax);
}

function calcNI(gross) {
if (gross <= 12570) return 0;
if (gross <= 50270) return (gross - 12570) * 0.08;
return (50270 - 12570) * 0.08 + (gross - 50270) * 0.02;
}

function calcLoan(gross, plan) {
const t = { plan1: 24990, plan2: 27295, plan4: 31395, plan5: 25000 };
if (!plan || !t[plan] || gross <= t[plan]) return 0;
return (gross - t[plan]) * 0.09;
}

function calculate(gross, pensionPct, slPlan, scotland, taxCode) {
const g = Math.max(0, gross || 0);
const pension = g * ((pensionPct || 0) / 100);
const incomeTax = calcTax(g, pension, scotland, taxCode);
const ni = calcNI(g);
const studentLoan = calcLoan(g, slPlan);
const deductions = incomeTax + ni + studentLoan + pension;
const takeHome = g - deductions;
return {
gross: g, incomeTax, ni, studentLoan, pension, deductions, takeHome,
monthly:  { gross: g/12,  takeHome: takeHome/12  },
weekly:   { gross: g/52,  takeHome: takeHome/52  },
daily:    { gross: g/260, takeHome: takeHome/260 },
effectiveRate: g > 0 ? ((incomeTax + ni) / g) * 100 : 0,
};
}

const NHS_BANDS = [
{ band:‘Band 2’,  min:23615,  max:24336,  points:[23615,23960,24336] },
{ band:‘Band 3’,  min:24336,  max:25527,  points:[24336,24875,25527] },
{ band:‘Band 4’,  min:26530,  max:29114,  points:[26530,27557,28368,29114] },
{ band:‘Band 5’,  min:29970,  max:36483,  points:[29970,31469,33280,34758,35392,36483] },
{ band:‘Band 6’,  min:37338,  max:44962,  points:[37338,39205,41659,43742,44119,44962] },
{ band:‘Band 7’,  min:46148,  max:52809,  points:[46148,47672,49764,51393,52809] },
{ band:‘Band 8a’, min:53755,  max:60504,  points:[53755,55058,57349,59028,60504] },
{ band:‘Band 8b’, min:62215,  max:72293,  points:[62215,63985,67035,70017,72293] },
{ band:‘Band 8c’, min:74290,  max:85601,  points:[74290,76897,81132,83571,85601] },
{ band:‘Band 8d’, min:88168,  max:101677, points:[88168,92546,97508,99976,101677] },
{ band:‘Band 9’,  min:105385, max:121271, points:[105385,110848,116288,119511,121271] },
];

// ── FORMAT ────────────────────────────────────────────────────────────────────
const fmtP  = n => ‘\u00A3’ + Math.max(0, Math.abs(n||0)).toLocaleString(‘en-GB’, { maximumFractionDigits: 0 });
const fmtPD = n => ‘\u00A3’ + Math.max(0, n||0).toLocaleString(‘en-GB’, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ── ANIMATED NUMBER ───────────────────────────────────────────────────────────
function AnimNum({ value, fmt }) {
const f = fmt || fmtP;
const [disp, setDisp] = useState(value);
const prev = useRef(value);
useEffect(() => {
const start = prev.current, end = value || 0, diff = end - start;
if (Math.abs(diff) < 1) { setDisp(end); prev.current = end; return; }
const dur = 360, t0 = performance.now(); let raf;
const step = now => {
const t = Math.min(1,(now-t0)/dur), e = t<0.5?2*t*t:-1+(4-2*t)*t;
setDisp(start + diff*e);
if (t<1) raf = requestAnimationFrame(step);
else { setDisp(end); prev.current = end; }
};
raf = requestAnimationFrame(step);
return () => cancelAnimationFrame(raf);
}, [value]);
return <span>{f(disp)}</span>;
}

// ── COLOURS ───────────────────────────────────────────────────────────────────
const C = {
bg:’#F4F6F9’, white:’#FFFFFF’,
navy:’#0C1E3C’, navyLight:’#162d52’, navyMid:’#1e3d6e’,
teal:’#0D9488’, tealLight:’#14B8A6’, tealBg:’#F0FDFA’, tealBorder:’#99F6E4’,
scot:’#1D4ED8’, scotBg:’#EFF6FF’, scotBorder:’#BFDBFE’,
amber:’#D97706’, amberBg:’#FFFBEB’, amberBorder:’#FDE68A’,
border:’#E2E8F0’, borderDark:’#CBD5E1’,
green:’#059669’, red:’#DC2626’, redBg:’#FEF2F2’, redBorder:’#FECACA’,
text:’#1E293B’, textMid:’#475569’, slate:’#64748B’, slateLight:’#94A3B8’,
shadow:‘0 1px 3px rgba(0,0,0,0.06),0 4px 16px rgba(0,0,0,0.04)’,
};

const STYLE = `@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Source+Serif+4:wght@300;400;600;700&family=JetBrains+Mono:wght@400;500&display=swap'); *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;} html{-webkit-text-size-adjust:100%;} body{background:#F4F6F9;color:#1E293B;font-family:'Source Serif 4',Georgia,serif;-webkit-tap-highlight-color:transparent;} input[type=number]{-moz-appearance:textfield;} input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;} input[type=range]{-webkit-appearance:none;width:100%;height:4px;background:#CBD5E1;border-radius:2px;outline:none;cursor:pointer;} input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;border-radius:50%;background:#0C1E3C;cursor:pointer;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.2);} select{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2364748b' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;background-color:white;} @keyframes fadeUp{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}} .fu{animation:fadeUp 0.38s ease both;} .bfill{transition:width 0.48s cubic-bezier(0.4,0,0.2,1);} button{-webkit-tap-highlight-color:transparent;cursor:pointer;font-family:inherit;}`;

// ── ARTICLES ──────────────────────────────────────────────────────────────────
export const ARTICLES = [
{
slug:‘how-uk-income-tax-brackets-work’,
title:‘How UK Income Tax Brackets Work (2026-27)’,
metaDesc:‘Understand UK income tax brackets in plain English. Learn how marginal rates work and why a pay rise never means less take-home pay.’,
date:‘6 April 2026’, readTime:‘5 min’, category:‘Tax Basics’,
relatedCalc:{ label:‘Open Salary Calculator’, page:‘home’ },
blocks:[
{t:‘h2’,v:‘What Are UK Income Tax Brackets?’},
{t:‘p’,v:‘UK income tax works on a marginal rate system. Different portions of your income are taxed at different rates, not your entire salary at one flat rate.’},
{t:‘table’,headers:[‘Band’,‘Income Range’,‘Rate’],rows:[[‘Personal Allowance’,‘Up to 12,570’,‘0%’],[‘Basic Rate’,‘12,571 to 50,270’,‘20%’],[‘Higher Rate’,‘50,271 to 125,140’,‘40%’],[‘Additional Rate’,‘Over 125,140’,‘45%’]]},
{t:‘h2’,v:‘Scotland Has Different Rates’},
{t:‘p’,v:‘If you live in Scotland you pay Scottish Income Tax rates with six bands. For 2026-27 the Starter band runs to 16,537 and Basic to 29,526, both rising 7.4% from last year.’},
{t:‘table’,headers:[‘Scottish Band’,‘Income Range’,‘Rate’],rows:[[‘Starter’,‘12,571 to 16,537’,‘19%’],[‘Basic’,‘16,538 to 29,526’,‘20%’],[‘Intermediate’,‘29,527 to 43,662’,‘21%’],[‘Higher’,‘43,663 to 75,000’,‘42%’],[‘Advanced’,‘75,001 to 125,140’,‘45%’],[‘Top’,‘Over 125,140’,‘48%’]]},
{t:‘h2’,v:‘Why a Pay Rise Always Helps’},
{t:‘p’,v:‘If you earn 55,000: the first 12,570 is tax-free, the next 37,700 taxed at 20%, only 4,730 above 50,270 at 40%. Effective rate: 17.1%, not 40%. A pay rise can never make you worse off.’},
{t:‘h2’,v:‘Thresholds Frozen Until 2031’},
{t:‘p’,v:‘UK-wide thresholds are frozen until 2031. Every pay rise pushes more income into higher bands without a real rate increase. Around 4 million extra people have moved into the higher rate band since 2022.’},
{t:‘h2’,v:‘Frequently Asked Questions’},
{t:‘faq’,q:‘What tax bracket am I in?’,a:‘Under 50,270 is basic rate. Between 50,271 and 125,140 is higher rate. Above 125,140 is additional rate. Scotland has different thresholds.’},
{t:‘faq’,q:‘Does my tax code affect my personal allowance?’,a:‘Yes. The standard code 1257L means a 12,570 personal allowance. A different number changes the allowance. Use Advanced options in the calculator to enter your code.’},
]
},
{
slug:‘national-insurance-explained’,
title:‘National Insurance Explained: What You Pay and Why (2026-27)’,
metaDesc:‘National Insurance explained simply. Class 1 NI rates, 2026-27 thresholds, and how it differs from income tax on your payslip.’,
date:‘6 April 2026’, readTime:‘5 min’, category:‘Tax Basics’,
relatedCalc:{ label:‘Open Salary Calculator’, page:‘home’ },
blocks:[
{t:‘h2’,v:‘What Is National Insurance?’},
{t:‘p’,v:‘National Insurance is a tax on earnings. Class 1 contributions are deducted automatically from your pay through PAYE alongside income tax. NI is UK-wide. Scotland has no separate NI rates.’},
{t:‘h2’,v:‘Employee NI Rates 2026-27’},
{t:‘table’,headers:[‘Earnings’,‘Rate’],rows:[[‘Up to 12,570’,‘0%’],[‘12,571 to 50,270’,‘8%’],[‘Over 50,270’,‘2%’]]},
{t:‘p’,v:‘The NI rate drops from 8% to 2% above 50,270. Higher earners pay a lower effective NI rate than basic rate taxpayers.’},
{t:‘h2’,v:‘Employer NI: The Hidden Cost’},
{t:‘p’,v:‘Your employer pays 15% NI on your salary above 5,000 per year (increased from 13.8% in April 2025). For someone earning 40,000 that is an extra 5,250 on top of your salary.’},
{t:‘h2’,v:‘Frequently Asked Questions’},
{t:‘faq’,q:‘Do I pay NI if I earn under 12,570?’,a:‘No. Below the Primary Threshold of 12,570 you pay no employee NI.’},
{t:‘faq’,q:‘Do Scottish residents pay different NI?’,a:‘No. National Insurance is the same across the whole UK. Only income tax differs in Scotland.’},
]
},
{
slug:‘pension-tax-relief-your-free-money’,
title:‘Pension Tax Relief: How to Get Free Money From HMRC (2026-27)’,
metaDesc:‘Pension tax relief explained. How salary sacrifice saves both income tax and NI, and how to make the most of the annual allowance.’,
date:‘6 April 2026’, readTime:‘6 min’, category:‘Tax Planning’,
relatedCalc:{ label:‘Try the Salary Sacrifice Calculator’, page:‘sacrifice’ },
blocks:[
{t:‘h2’,v:‘What Is Pension Tax Relief?’},
{t:‘p’,v:‘HMRC tops up your pension with the income tax you would have paid on that money. A basic rate taxpayer contributing 80p gets 100p in their pension. A higher rate taxpayer contributing 60p gets 100p.’},
{t:‘table’,headers:[‘Tax Rate’,‘Real Cost Per 100 Contributed’],rows:[[‘Basic rate (20%)’,‘80’],[‘Higher rate (40%)’,‘60’],[‘Additional / Advanced (45%)’,‘55’],[‘Scottish Top rate (48%)’,‘52’]]},
{t:‘h2’,v:‘Salary Sacrifice vs Personal Pension’},
{t:‘p’,v:‘Salary sacrifice reduces your gross salary before tax AND NI are calculated. A 2,500 salary sacrifice saves 500 in income tax PLUS 200 in NI. Real cost: 1,800. A personal pension only recovers income tax.’},
{t:‘h2’,v:‘The 100,000 Trap’},
{t:‘p’,v:‘Between 100,000 and 125,140 your Personal Allowance tapers, creating an effective 60% rate. A pension contribution bringing income below 100,000 restores your full allowance and can save over 2,000 immediately.’},
{t:‘h2’,v:‘Frequently Asked Questions’},
{t:‘faq’,q:‘Does salary sacrifice work differently in Scotland?’,a:‘Same mechanism, but Scottish taxpayers on the 42% Higher band save significantly more per pound contributed.’},
{t:‘faq’,q:‘What is the annual allowance?’,a:‘You can contribute up to 60,000 per year including employer contributions and receive full tax relief.’},
]
},
{
slug:‘2026-27-tax-year-changes-uk’,
title:‘2026-27 Tax Year: Everything That Changed in April 2026’,
metaDesc:‘Thresholds frozen to 2031, NLW rises to 12.71/hr, employer NI at 15%, dividend rates increase. Complete guide to 2026-27 changes.’,
date:‘6 April 2026’, readTime:‘5 min’, category:‘Tax Year Updates’,
relatedCalc:{ label:‘Check Your 2026-27 Take-Home Pay’, page:‘home’ },
blocks:[
{t:‘h2’,v:‘UK Thresholds Frozen Until 2031’},
{t:‘table’,headers:[‘Threshold’,‘2026-27’,‘Frozen Until’],rows:[[‘Personal Allowance’,‘12,570’,‘2031’],[‘Basic Rate limit’,‘50,270’,‘2031’],[‘Higher Rate limit’,‘125,140’,‘2031’],[‘NI Primary Threshold’,‘12,570’,‘2031’],[‘NI Upper Earnings Limit’,‘50,270’,‘2031’]]},
{t:‘h2’,v:‘Scotland: Starter and Basic Thresholds Rose 7.4%’},
{t:‘table’,headers:[‘Scottish Band’,‘2025-26’,‘2026-27’],rows:[[‘Starter ends at’,‘15,397’,‘16,537’],[‘Basic ends at’,‘27,491’,‘29,526’],[‘Intermediate ends at’,‘43,662’,‘43,662’],[‘Higher ends at’,‘75,000’,‘75,000’]]},
{t:‘h2’,v:‘National Living Wage: Up to 12.71 per Hour’},
{t:‘table’,headers:[‘Category’,‘2025-26’,‘2026-27’],rows:[[‘NLW (21+)’,‘11.44/hr’,‘12.71/hr’],[‘Age 18-20’,‘8.60/hr’,‘10.00/hr’],[‘Under 18 / Apprentice’,‘6.40/hr’,‘7.55/hr’]]},
{t:‘h2’,v:‘Dividend Tax Rates Increased From April 2026’},
{t:‘table’,headers:[‘Band’,‘2025-26’,‘2026-27’],rows:[[‘Basic rate’,‘8.75%’,‘10.75%’],[‘Higher rate’,‘33.75%’,‘35.75%’],[‘Additional rate’,‘39.35%’,‘39.35%’]]},
{t:‘h2’,v:‘Frequently Asked Questions’},
{t:‘faq’,q:‘When do UK thresholds unfreeze?’,a:‘The freeze runs to April 2031. No earlier unfreeze has been confirmed.’},
{t:‘faq’,q:‘Did Scotland change all its tax rates?’,a:‘No. Only the Starter and Basic thresholds rose by 7.4%. All rates and higher band thresholds were unchanged.’},
]
},
{
slug:‘45000-after-tax-uk-2026-27’,
title:‘What is 45,000 After Tax in the UK? (2026-27)’,
metaDesc:‘If you earn 45,000 your take-home pay is 35,920 per year — 2,993 per month. Full breakdown of income tax, NI and deductions for 2026-27.’,
date:‘6 April 2026’, readTime:‘4 min’, category:‘Salary Guides’,
relatedCalc:{ label:‘Calculate Your Exact Take-Home Pay’, page:‘home’ },
blocks:[
{t:‘h2’,v:‘45,000 After Tax: The Short Answer’},
{t:‘p’,v:‘On a salary of 45,000 in the 2026-27 tax year, your annual take-home pay is 35,920. That works out to 2,993 per month and 691 per week. You keep 79.8% of your gross pay.’},
{t:‘table’,headers:[‘Period’,‘Gross Pay’,‘Take-Home Pay’],rows:[[‘Annual’,‘45,000’,‘35,920’],[‘Monthly’,‘3,750’,‘2,993’],[‘Weekly’,‘865’,‘691’],[‘Daily’,‘173’,‘138’]]},
{t:‘h2’,v:‘Full Tax Breakdown for 45,000’},
{t:‘p’,v:‘A salary of 45,000 sits entirely within the basic rate band. Every pound of taxable income is taxed at exactly 20% — there is no higher rate tax at this salary level.’},
{t:‘table’,headers:[‘Deduction’,‘Calculation’,‘Annual Amount’],rows:[[‘Personal Allowance’,‘First 12,570 — tax free’,‘0’],[‘Income Tax’,‘32,430 x 20%’,‘6,486’],[‘National Insurance’,‘32,430 x 8%’,‘2,594’],[‘Total Deductions’,‘Income Tax + NI’,‘9,080’],[‘Take-Home Pay’,‘45,000 minus deductions’,‘35,920’]]},
{t:‘h2’,v:‘What Tax Band Is 45,000?’},
{t:‘p’,v:‘A 45,000 salary is solidly in the basic rate band (20%). The higher rate only starts at 50,271. You would need a pay rise of 5,271 before any income is taxed at 40%. Your effective tax rate — the actual percentage of your total salary lost to income tax and NI combined — is 20.2%.’},
{t:‘h2’,v:‘How Does Pension Affect Your Take-Home?’},
{t:‘p’,v:‘If you contribute to a pension through salary sacrifice, your taxable income falls and you pay less tax and NI. A 5% salary sacrifice on 45,000 means you contribute 2,250 to your pension but only lose 1,620 in take-home pay — because you save 450 in income tax and 180 in NI.’},
{t:‘table’,headers:[‘Pension Contribution’,‘Take-Home Pay’,‘Monthly Take-Home’],rows:[[‘0%’,‘35,920’,‘2,993’],[‘3%’,‘35,054’,‘2,921’],[‘5%’,‘34,493’,‘2,874’],[‘10%’,‘33,066’,‘2,756’]]},
{t:‘h2’,v:‘45,000 After Tax in Scotland’},
{t:‘p’,v:‘If you live in Scotland, you pay different income tax rates. On 45,000 your Scottish income tax bill is 7,536 compared to 6,486 in England — a difference of 1,050 per year. This is because Scotland has a 21% Intermediate rate band and a 42% Higher rate starting at 43,663.’},
{t:‘table’,headers:[‘Location’,‘Income Tax’,‘NI’,‘Take-Home (Annual)’],rows:[[‘England / Wales / NI’,‘6,486’,‘2,594’,‘35,920’],[‘Scotland’,‘7,536’,‘2,594’,‘34,870’]]},
{t:‘h2’,v:‘Student Loan on a 45,000 Salary’},
{t:‘p’,v:‘If you have a student loan, repayments reduce your take-home further. Plan 2 borrowers (most graduates since 2012) repay 9% of income above 27,295. On 45,000 that means 1,593 per year — bringing monthly take-home to 2,860.’},
{t:‘table’,headers:[‘Student Loan Plan’,‘Threshold’,‘Annual Repayment’,‘Monthly Take-Home’],rows:[[‘None’,’-’,‘0’,‘2,993’],[‘Plan 1’,‘24,990’,‘1,836’,‘2,840’],[‘Plan 2’,‘27,295’,‘1,593’,‘2,860’],[‘Plan 5’,‘25,000’,‘1,800’,‘2,843’]]},
{t:‘h2’,v:‘How Does 45,000 Compare to the UK Average?’},
{t:‘p’,v:‘The UK median annual salary for full-time workers is approximately 35,500 in 2026. A salary of 45,000 is around the 75th percentile — meaning you earn more than approximately 75% of full-time UK workers. In terms of after-tax pay, 45,000 delivers 35,920 per year versus roughly 28,800 for someone on the national average.’},
{t:‘h2’,v:‘Frequently Asked Questions’},
{t:‘faq’,q:‘Is 45,000 a good salary in the UK?’,a:‘Yes. A 45,000 salary puts you comfortably above the UK median of around 35,500. Monthly take-home of 2,993 is enough to cover average UK household costs in most regions outside London.’},
{t:‘faq’,q:‘How much National Insurance do I pay on 45,000?’,a:‘You pay 2,594 in National Insurance for 2026-27. This is 8% on earnings between 12,570 and 45,000 (a band of 32,430).’},
{t:‘faq’,q:‘Will I pay 40% tax on 45,000?’,a:‘No. The higher rate only starts at 50,271. Your entire 45,000 salary is taxed at 20% (after the tax-free personal allowance of 12,570). You would need to earn more than 50,271 before any income is taxed at 40%.’},
{t:‘faq’,q:‘How much is 45,000 a month after tax?’,a:‘A 45,000 salary gives you a monthly take-home of 2,993 after income tax and National Insurance. This assumes no pension contributions, student loan, or other deductions.’},
{t:‘faq’,q:‘What is the hourly rate equivalent of 45,000?’,a:‘Assuming a standard 37.5-hour week and 52 weeks, 45,000 is equivalent to 23.08 per hour gross. After tax, that is approximately 18.42 per hour net.’},
]
}
];

// ── SHARED COMPONENTS ─────────────────────────────────────────────────────────
function Logo({ light, size=‘md’ }) {
const box=size===‘sm’?26:32, font=size===‘sm’?11:13, text=size===‘sm’?15:18;
return (
<div style={{display:‘flex’,alignItems:‘center’,gap:9,minWidth:0}}>
<div style={{width:box,height:box,background:‘linear-gradient(135deg,#0D9488,#14B8A6)’,borderRadius:7,display:‘flex’,alignItems:‘center’,justifyContent:‘center’,flexShrink:0,boxShadow:‘0 2px 8px rgba(13,148,136,0.3)’}}>
<span style={{color:‘white’,fontWeight:700,fontSize:font,fontFamily:‘JetBrains Mono’}}>Tx</span>
</div>
<span style={{color:light?‘white’:C.navy,fontFamily:‘DM Serif Display’,fontSize:text,letterSpacing:’-0.02em’,lineHeight:1,flexShrink:0}}>
Taxd<span style={{color:C.teal}}>Cal</span>
</span>
</div>
);
}

function NavBar({ page, nav }) {
const [open,setOpen]=useState(false);
const mob=useWidth()<700;
const items=[{id:‘home’,label:‘Salary Calculator’},{id:‘contractor’,label:‘IR35’},{id:‘tools’,label:‘All Tools’},{id:‘blog’,label:‘Tax Guides’}];
const active=page===‘home’?‘home’:page===‘contractor’?‘contractor’:(page===‘blog’||page.startsWith(‘article-’))?‘blog’:‘tools’;
return (
<nav style={{background:C.navy,position:‘sticky’,top:0,zIndex:100,boxShadow:‘0 2px 12px rgba(0,0,0,0.28)’}}>
<div style={{maxWidth:1100,margin:‘0 auto’,padding:‘0 20px’,height:56,display:‘flex’,alignItems:‘center’,justifyContent:‘space-between’}}>
<button onClick={()=>{nav(‘home’);setOpen(false);}} style={{background:‘none’,border:‘none’,padding:0}}><Logo light /></button>
{mob?(
<button onClick={()=>setOpen(!open)} style={{background:‘rgba(255,255,255,0.08)’,border:‘1px solid rgba(255,255,255,0.12)’,borderRadius:7,padding:‘8px 10px’,display:‘flex’,flexDirection:‘column’,gap:4}}>
{[0,1,2].map(i=><span key={i} style={{display:‘block’,width:18,height:2,background:‘white’,borderRadius:1,transition:‘all 0.2s’,transform:open&&i===0?‘rotate(45deg) translate(4px,4px)’:open&&i===2?‘rotate(-45deg) translate(4px,-4px)’:‘none’,opacity:open&&i===1?0:1}} />)}
</button>
):(
<div style={{display:‘flex’,gap:2,alignItems:‘center’}}>
{items.map(n=>(
<button key={n.id} onClick={()=>nav(n.id)} style={{padding:‘7px 13px’,borderRadius:6,border:‘none’,background:active===n.id?‘rgba(13,148,136,0.2)’:‘transparent’,color:active===n.id?C.tealLight:‘rgba(255,255,255,0.58)’,fontSize:13,fontWeight:active===n.id?600:400}}>
{n.label}
</button>
))}
<span style={{fontSize:11,color:C.tealLight,fontFamily:‘JetBrains Mono’,background:‘rgba(13,148,136,0.15)’,padding:‘3px 9px’,borderRadius:4,border:‘1px solid rgba(20,184,166,0.3)’,marginLeft:8}}>2026-27</span>
</div>
)}
</div>
{mob&&open&&(
<div style={{background:C.navyLight,borderTop:‘1px solid rgba(255,255,255,0.08)’,padding:‘6px 0 12px’}}>
{items.map(n=>(
<button key={n.id} onClick={()=>{nav(n.id);setOpen(false);}} style={{display:‘block’,width:‘100%’,padding:‘12px 24px’,background:active===n.id?‘rgba(13,148,136,0.15)’:‘transparent’,border:‘none’,color:active===n.id?C.tealLight:‘rgba(255,255,255,0.65)’,fontSize:14,textAlign:‘left’,fontWeight:active===n.id?600:400}}>
{n.label}
</button>
))}
</div>
)}
</nav>
);
}

function Card({ children, style={} }) {
return <div style={{background:C.white,borderRadius:14,padding:22,boxShadow:C.shadow,border:`1px solid ${C.border}`,…style}}>{children}</div>;
}

function PageHero({ tag, title, sub, mob }) {
return (
<div style={{background:`linear-gradient(135deg,${C.navy},${C.navyMid})`,padding:mob?‘36px 20px 64px’:‘44px 24px 72px’,textAlign:‘center’,position:‘relative’,overflow:‘hidden’}}>
<div style={{position:‘absolute’,top:-50,right:-50,width:220,height:220,borderRadius:‘50%’,background:‘rgba(13,148,136,0.07)’,pointerEvents:‘none’}} />
<div style={{display:‘inline-block’,background:‘rgba(13,148,136,0.15)’,border:‘1px solid rgba(20,184,166,0.3)’,borderRadius:20,padding:‘4px 13px’,fontSize:11,color:C.tealLight,marginBottom:13,fontFamily:‘JetBrains Mono’}}>{tag}</div>
<h1 style={{fontFamily:‘DM Serif Display’,fontSize:mob?26:40,color:‘white’,marginBottom:10,letterSpacing:’-0.02em’,lineHeight:1.15}} dangerouslySetInnerHTML={{__html:title}} />
{sub&&<p style={{color:‘rgba(255,255,255,0.5)’,fontSize:mob?13:15,maxWidth:480,margin:‘0 auto’,lineHeight:1.6}}>{sub}</p>}
</div>
);
}

function BackBtn({ nav, to=‘tools’ }) {
return (
<button onClick={()=>nav(to)} style={{display:‘inline-flex’,alignItems:‘center’,gap:8,background:C.navy,color:‘white’,padding:‘11px 20px’,borderRadius:9,fontSize:13,fontWeight:700,border:‘none’,marginBottom:20,boxShadow:‘0 2px 8px rgba(12,30,60,0.2)’}}>
<span style={{fontSize:16,lineHeight:1}}>←</span> Back
</button>
);
}

function NumInput({ label, value, onChange, showPrefix, hint, max=999999 }) {
return (
<div style={{marginBottom:18}}>
<div style={{display:‘flex’,justifyContent:‘space-between’,alignItems:‘baseline’,marginBottom:7}}>
<label style={{fontSize:13,fontWeight:600,color:C.navyLight}}>{label}</label>
{hint&&<span style={{fontSize:11,color:C.slate}}>{hint}</span>}
</div>
<div style={{position:‘relative’}}>
{showPrefix&&<span style={{position:‘absolute’,left:13,top:‘50%’,transform:‘translateY(-50%)’,color:C.slate,fontSize:16,fontWeight:600,fontFamily:‘JetBrains Mono’,pointerEvents:‘none’,lineHeight:1,zIndex:1}}>£</span>}
<input type=“number” inputMode=“numeric” value={value} placeholder=“0” min={0} max={max}
onChange={e=>onChange(e.target.value)}
style={{width:‘100%’,padding:showPrefix?‘12px 14px 12px 30px’:‘12px 14px’,border:`1.5px solid ${C.borderDark}`,borderRadius:8,fontSize:16,fontFamily:‘JetBrains Mono’,fontWeight:500,color:C.navy,background:‘white’,outline:‘none’}}
onFocus={e=>e.target.style.borderColor=C.teal}
onBlur={e=>e.target.style.borderColor=C.borderDark} />
</div>
</div>
);
}

function TextInput({ label, value, onChange, placeholder, hint }) {
return (
<div style={{marginBottom:18}}>
<div style={{display:‘flex’,justifyContent:‘space-between’,alignItems:‘baseline’,marginBottom:7}}>
<label style={{fontSize:13,fontWeight:600,color:C.navyLight}}>{label}</label>
{hint&&<span style={{fontSize:11,color:C.slate}}>{hint}</span>}
</div>
<input type=“text” value={value} placeholder={placeholder} onChange={e=>onChange(e.target.value)}
style={{width:‘100%’,padding:‘12px 14px’,border:`1.5px solid ${C.borderDark}`,borderRadius:8,fontSize:15,fontFamily:‘JetBrains Mono’,color:C.navy,background:‘white’,outline:‘none’}}
onFocus={e=>e.target.style.borderColor=C.teal}
onBlur={e=>e.target.style.borderColor=C.borderDark} />
</div>
);
}

function SliderField({ label, value, onChange, min, max, step, fmtFn }) {
return (
<div style={{marginBottom:20}}>
<div style={{display:‘flex’,justifyContent:‘space-between’,alignItems:‘baseline’,marginBottom:10}}>
<label style={{fontSize:13,fontWeight:600,color:C.navyLight}}>{label}</label>
<span style={{fontFamily:‘JetBrains Mono’,fontSize:14,color:C.teal,fontWeight:600}}>{fmtFn(value)}</span>
</div>
<input type=“range” min={min} max={max} step={step} value={value} onChange={e=>onChange(Number(e.target.value))} />
<div style={{display:‘flex’,justifyContent:‘space-between’,marginTop:4}}>
<span style={{fontSize:11,color:C.slateLight}}>{fmtFn(min)}</span>
<span style={{fontSize:11,color:C.slateLight}}>{fmtFn(max)}</span>
</div>
</div>
);
}

function SelectField({ label, value, onChange, options }) {
return (
<div style={{marginBottom:18}}>
<label style={{display:‘block’,fontSize:13,fontWeight:600,color:C.navyLight,marginBottom:7}}>{label}</label>
<select value={value} onChange={e=>onChange(e.target.value)}
style={{width:‘100%’,padding:‘12px 40px 12px 14px’,border:`1.5px solid ${C.borderDark}`,borderRadius:8,fontSize:14,color:C.navy,outline:‘none’}}
onFocus={e=>e.target.style.borderColor=C.teal}
onBlur={e=>e.target.style.borderColor=C.borderDark}>
{options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
</select>
</div>
);
}

function Toggle({ on, onToggle, ariaLabel }) {
return (
<button onClick={onToggle} aria-pressed={on} aria-label={ariaLabel}
style={{flexShrink:0,width:48,height:26,borderRadius:13,border:‘none’,background:on?C.scot:C.borderDark,position:‘relative’,transition:‘background 0.2s’,cursor:‘pointer’}}>
<span style={{position:‘absolute’,top:3,left:on?25:3,width:20,height:20,borderRadius:‘50%’,background:‘white’,boxShadow:‘0 1px 4px rgba(0,0,0,0.22)’,transition:‘left 0.2s’}} />
</button>
);
}

function ScotlandToggle({ scotland, setScotland }) {
return (
<div style={{marginBottom:18,padding:‘14px 16px’,background:scotland?C.scotBg:C.bg,border:`1.5px solid ${scotland?C.scotBorder:C.borderDark}`,borderRadius:10,transition:‘all 0.2s’}}>
<div style={{display:‘flex’,alignItems:‘center’,justifyContent:‘space-between’,gap:12}}>
<div style={{minWidth:0}}>
<div style={{fontSize:13,fontWeight:700,color:scotland?C.scot:C.navyLight}}>Are you based in Scotland?</div>
<div style={{fontSize:11,color:C.slate,marginTop:2}}>Scottish taxpayers pay different income tax rates</div>
</div>
<Toggle on={scotland} onToggle={()=>setScotland(!scotland)} ariaLabel=“Toggle Scottish tax rates” />
</div>
{scotland&&(
<div style={{marginTop:10,paddingTop:10,borderTop:`1px solid ${C.scotBorder}`,fontSize:11,color:C.scot,lineHeight:1.6}}>
Using Scottish rates: 19% Starter → 20% Basic → 21% Intermediate → 42% Higher → 45% Advanced → 48% Top
</div>
)}
</div>
);
}

function TaxCodePanel({ taxCode, setTaxCode }) {
const [show,setShow]=useState(false);
const parsed=parseTaxCode(taxCode);
const invalid=taxCode&&taxCode.trim()!==’’&&parsed.unknown;
return (
<div style={{marginBottom:18}}>
<button onClick={()=>setShow(!show)} style={{display:‘flex’,alignItems:‘center’,gap:6,background:‘none’,border:‘none’,color:C.slate,fontSize:12,fontWeight:600,padding:‘2px 0’,cursor:‘pointer’}}>
<span style={{display:‘inline-block’,width:14,fontSize:10,color:C.teal,fontWeight:700,transition:‘transform 0.2s’,transform:show?‘rotate(90deg)’:‘rotate(0)’,fontFamily:‘JetBrains Mono’}}>▸</span>
Tax code (optional — leave blank for standard)
</button>
{show&&(
<div style={{marginTop:10,padding:‘14px 16px’,background:C.bg,border:`1px solid ${C.border}`,borderRadius:10}}>
<TextInput label="Your Tax Code" value={taxCode} onChange={setTaxCode} placeholder="1257L" hint="Standard is 1257L" />
{invalid&&<div style={{fontSize:11,color:C.red,marginTop:-10,marginBottom:10}}>Unrecognised code — using default 12,570 allowance</div>}
<div style={{fontSize:11,color:C.slate,lineHeight:1.7}}>
<strong>Common codes:</strong> 1257L = standard. BR = 20% on all income. D0 = 40% on all. 0T = no allowance. NT = no tax. K codes add to taxable income.
</div>
</div>
)}
</div>
);
}

function ResultHero({ label, value, monthly, pct, mob }) {
return (
<div style={{background:`linear-gradient(135deg,${C.navy},${C.navyMid})`,borderRadius:14,padding:mob?‘20px’:‘24px’,marginBottom:14,position:‘relative’,overflow:‘hidden’,boxShadow:‘0 4px 20px rgba(12,30,60,0.22)’}}>
<div style={{position:‘absolute’,top:-20,right:-20,width:110,height:110,borderRadius:‘50%’,background:‘rgba(13,148,136,0.12)’,pointerEvents:‘none’}} />
<div style={{fontSize:10,color:‘rgba(255,255,255,0.4)’,letterSpacing:‘0.12em’,textTransform:‘uppercase’,fontFamily:‘JetBrains Mono’,marginBottom:6}}>{label||‘Annual Take-Home Pay’}</div>
<div style={{fontFamily:‘DM Serif Display’,fontSize:‘clamp(28px,6vw,48px)’,color:‘white’,lineHeight:1.05,overflow:‘hidden’,textOverflow:‘ellipsis’,whiteSpace:‘nowrap’,minWidth:0}}>
<AnimNum value={Math.max(0,value||0)} />
</div>
{monthly!==undefined&&(
<div style={{fontSize:13,color:‘rgba(255,255,255,0.45)’,fontFamily:‘JetBrains Mono’,marginTop:5}}>
<AnimNum value={Math.max(0,monthly||0)} fmt={fmtPD} /> per month
</div>
)}
{pct!==undefined&&(
<div style={{marginTop:14,display:‘flex’,alignItems:‘center’,gap:10,minWidth:0}}>
<div style={{flex:1,height:4,background:‘rgba(255,255,255,0.1)’,borderRadius:2,overflow:‘hidden’,minWidth:0}}>
<div className=“bfill” style={{width:Math.min(100,Math.max(0,pct))+’%’,height:‘100%’,background:`linear-gradient(90deg,${C.teal},${C.tealLight})`,borderRadius:2}} />
</div>
<span style={{fontSize:12,color:C.tealLight,fontFamily:‘JetBrains Mono’,fontWeight:600,flexShrink:0}}>{Math.max(0,pct).toFixed(1)}% kept</span>
</div>
)}
</div>
);
}

function SiteFooter({ nav, mob }) {
return (
<footer style={{background:’#07111F’,padding:‘24px 20px’,borderTop:‘1px solid rgba(255,255,255,0.06)’,marginTop:48}}>
<div style={{maxWidth:1100,margin:‘0 auto’,display:‘flex’,flexDirection:mob?‘column’:‘row’,justifyContent:‘space-between’,gap:14,alignItems:mob?‘flex-start’:‘center’}}>
<button onClick={()=>nav(‘home’)} style={{background:‘none’,border:‘none’,padding:0}}><Logo light size="sm" /></button>
<div style={{display:‘flex’,gap:16,flexWrap:‘wrap’}}>
{[[‘Salary Calculator’,‘home’],[‘IR35’,‘contractor’],[‘NHS Bands’,‘nhs’],[‘Tax Guides’,‘blog’]].map(([l,p])=>(
<button key={p} onClick={()=>nav(p)} style={{background:‘none’,border:‘none’,color:‘rgba(255,255,255,0.35)’,fontSize:12,padding:0,cursor:‘pointer’}}>{l}</button>
))}
</div>
<span style={{fontSize:11,color:‘rgba(255,255,255,0.18)’,maxWidth:260,lineHeight:1.6}}>For guidance only. Always consult HMRC or a qualified tax adviser. Updated April 2026.</span>
</div>
</footer>
);
}

// ── HOME PAGE ─────────────────────────────────────────────────────────────────
function HomePage({ nav }) {
const mob=useWidth()<768;
const [salaryStr,setSalaryStr]=useState(‘45000’);
const [pension,setPension]=useState(5);
const [loan,setLoan]=useState(‘none’);
const [period,setPeriod]=useState(‘annual’);
const [tab,setTab]=useState(‘breakdown’);
const [scotland,setScotland]=useState(false);
const [taxCode,setTaxCode]=useState(’’);
const salary=Math.max(0,Number(salaryStr)||0);
const r=calculate(salary,pension,loan,scotland,taxCode);
const pm={annual:{g:r.gross,th:r.takeHome},monthly:{g:r.monthly.gross,th:r.monthly.takeHome},weekly:{g:r.weekly.gross,th:r.weekly.takeHome},daily:{g:r.daily.gross,th:r.daily.takeHome}};
const items=[{label:‘Income Tax’,value:r.incomeTax,color:C.red},{label:‘Nat. Insurance’,value:r.ni,color:’#F59E0B’},{label:‘Student Loan’,value:r.studentLoan,color:’#6366F1’},{label:‘Pension’,value:r.pension,color:’#14B8A6’}];
const taxBands=scotland?[[‘12,571 to 16,537’,‘19% Starter’],[‘16,538 to 29,526’,‘20% Basic’],[‘29,527 to 43,662’,‘21% Intermediate’],[‘43,663 to 75,000’,‘42% Higher’],[‘75,001 to 125,140’,‘45% Advanced’],[‘Over 125,140’,‘48% Top’]]:[[‘Up to 12,570’,‘0% Personal Allowance’],[‘12,571 to 50,270’,‘20% Basic Rate’],[‘50,271 to 125,140’,‘40% Higher Rate’],[‘Over 125,140’,‘45% Additional Rate’]];

return (
<main>
<div style={{background:`linear-gradient(135deg,${C.navy},${C.navyMid})`,padding:mob?‘36px 20px 68px’:‘48px 24px 80px’,position:‘relative’,overflow:‘hidden’}}>
<div style={{position:‘absolute’,top:-60,right:-40,width:260,height:260,borderRadius:‘50%’,background:‘rgba(13,148,136,0.07)’,pointerEvents:‘none’}} />
<div style={{maxWidth:600,margin:‘0 auto’,textAlign:‘center’,position:‘relative’}}>
<div style={{display:‘inline-flex’,alignItems:‘center’,gap:7,background:‘rgba(13,148,136,0.15)’,border:‘1px solid rgba(20,184,166,0.3)’,borderRadius:20,padding:‘5px 14px’,fontSize:11,color:C.tealLight,marginBottom:18,fontFamily:‘JetBrains Mono’}}>
<span style={{width:6,height:6,borderRadius:‘50%’,background:C.tealLight,display:‘inline-block’}} /> Updated for 2026-27 tax year
</div>
<h1 style={{fontFamily:‘DM Serif Display’,fontSize:mob?28:48,color:‘white’,lineHeight:1.1,marginBottom:12,letterSpacing:’-0.025em’}}>
UK Take-Home Pay<br /><em style={{color:C.tealLight}}>Calculator</em>
</h1>
<p style={{color:‘rgba(255,255,255,0.5)’,fontSize:mob?14:16,lineHeight:1.65,maxWidth:400,margin:‘0 auto’}}>
Net salary after income tax, NI, student loan and pension. Scotland and tax code supported.
</p>
</div>
</div>

```
  <div style={{maxWidth:1100,margin:mob?'-32px 0 0':'-44px auto 0',padding:mob?'0 16px':'0 24px'}}>
    <div style={{display:'grid',gridTemplateColumns:mob?'1fr':'minmax(280px,390px) 1fr',gap:20,alignItems:'start'}}>
      <Card className="fu">
        <h2 style={{fontFamily:'DM Serif Display',fontSize:19,color:C.navy,marginBottom:20}}>Your Details</h2>
        <NumInput label="Annual Salary" value={salaryStr} onChange={setSalaryStr} showPrefix hint={salary>0?`${fmtP(salary/12)}/mo gross`:undefined} />
        <SliderField label="Pension Contribution" value={pension} onChange={setPension} min={0} max={30} step={0.5} fmtFn={v=>v+'%'} />
        <SelectField label="Student Loan Plan" value={loan} onChange={setLoan} options={[{value:'none',label:'No student loan'},{value:'plan1',label:'Plan 1 — pre Sept 2012 (24,990)'},{value:'plan2',label:'Plan 2 — Sept 2012 to Jul 2023 (27,295)'},{value:'plan4',label:'Plan 4 — Scotland (31,395)'},{value:'plan5',label:'Plan 5 — Aug 2023 onwards (25,000)'}]} />
        <ScotlandToggle scotland={scotland} setScotland={setScotland} />
        <TaxCodePanel taxCode={taxCode} setTaxCode={setTaxCode} />
        <div style={{padding:'12px 14px',background:scotland?C.scotBg:C.tealBg,border:`1px solid ${scotland?C.scotBorder:C.tealBorder}`,borderRadius:8}}>
          <div style={{fontSize:11,color:scotland?C.scot:C.teal,fontWeight:700,marginBottom:6}}>{scotland?'Scottish':'England / Wales / NI'} Income Tax Bands 2026-27</div>
          {taxBands.map(([range,rate])=>(
            <div key={range} style={{display:'flex',justifyContent:'space-between',fontSize:11,color:scotland?'#1e3a8a':'#0f766e',fontFamily:'JetBrains Mono',padding:'3px 0',borderBottom:'1px solid rgba(99,102,241,0.08)'}}>
              <span>{range}</span><span style={{fontWeight:600}}>{rate}</span>
            </div>
          ))}
          <div style={{fontSize:10,color:scotland?'#1e3a8a':'#0f766e',marginTop:5}}>{scotland?'Scottish rates confirmed Feb 2026. NI rates are UK-wide.':'Thresholds frozen until 2031.'}</div>
        </div>
      </Card>

      <div className="fu" style={{display:'flex',flexDirection:'column',gap:14,minWidth:0}}>
        <ResultHero value={r.takeHome} monthly={r.monthly.takeHome} pct={salary>0?(r.takeHome/r.gross)*100:0} mob={mob} />
        <div style={{display:'flex',gap:4,background:C.white,padding:5,borderRadius:10,border:`1px solid ${C.border}`}}>
          {['annual','monthly','weekly','daily'].map(p=>(
            <button key={p} onClick={()=>setPeriod(p)} style={{flex:1,padding:'9px 4px',borderRadius:7,border:'none',background:period===p?C.teal:'transparent',color:period===p?'white':C.slate,fontSize:mob?11:12,fontWeight:period===p?600:400,textTransform:'capitalize'}}>{p}</button>
          ))}
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          {[['Gross Pay',pm[period].g,C.navy],['Net Pay',pm[period].th,C.green]].map(([lbl,val,cl])=>(
            <Card key={lbl} style={{padding:'14px 16px',minWidth:0}}>
              <div style={{fontSize:10,color:C.slate,letterSpacing:'0.08em',textTransform:'uppercase',fontWeight:600,marginBottom:5,fontFamily:'JetBrains Mono'}}>{lbl}</div>
              <div style={{fontFamily:'DM Serif Display',fontSize:'clamp(18px,3.5vw,24px)',color:cl,lineHeight:1.1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',minWidth:0}}>
                <AnimNum value={Math.max(0,val||0)} />
              </div>
            </Card>
          ))}
        </div>
        <Card style={{padding:mob?16:'20px 22px'}}>
          <div style={{display:'flex',gap:2,marginBottom:16,borderBottom:`1px solid ${C.border}`}}>
            {['breakdown','table'].map(t=>(
              <button key={t} onClick={()=>setTab(t)} style={{padding:'7px 14px',border:'none',background:'transparent',fontSize:13,color:tab===t?C.navy:C.slate,fontWeight:tab===t?700:400,borderBottom:tab===t?`2px solid ${C.teal}`:'2px solid transparent',marginBottom:-1,textTransform:'capitalize'}}>{t}</button>
            ))}
          </div>
          {tab==='breakdown'&&(
            <div>
              <div style={{height:10,borderRadius:5,overflow:'hidden',display:'flex',background:C.border,marginBottom:16}}>
                {items.filter(it=>it.value>0).map(it=><div key={it.label} className="bfill" style={{width:r.gross>0?`${(it.value/r.gross)*100}%`:'0%',background:it.color,height:'100%'}} />)}
                <div className="bfill" style={{flex:1,background:C.teal}} />
              </div>
              {[...items.filter(it=>it.value>0).map(it=>({...it,neg:true})),{label:'Take-home',value:r.takeHome,color:C.teal}].map(it=>(
                <div key={it.label} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'9px 0',borderBottom:it.neg?`1px solid ${C.border}`:'none'}}>
                  <div style={{display:'flex',alignItems:'center',gap:10,minWidth:0}}>
                    <div style={{width:8,height:8,borderRadius:2,background:it.color,flexShrink:0}} />
                    <span style={{fontSize:13,color:it.neg?C.textMid:C.text,fontWeight:it.neg?400:700,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{it.label}</span>
                  </div>
                  <span style={{fontFamily:'JetBrains Mono',fontSize:13,color:it.neg?C.red:C.teal,fontWeight:it.neg?400:700,flexShrink:0,marginLeft:8}}>{(it.neg?'-':'+')+fmtP(it.value)}</span>
                </div>
              ))}
              {r.effectiveRate>0&&(
                <div style={{marginTop:12,paddingTop:10,borderTop:`1px solid ${C.border}`,display:'flex',justifyContent:'space-between',fontSize:12,color:C.slate}}>
                  <span>Effective tax rate (income tax + NI)</span>
                  <span style={{fontFamily:'JetBrains Mono',fontWeight:600}}>{r.effectiveRate.toFixed(1)}%</span>
                </div>
              )}
            </div>
          )}
          {tab==='table'&&(
            <div style={{overflowX:'auto',WebkitOverflowScrolling:'touch'}}>
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:12,minWidth:300}}>
                <thead><tr>{['','Annual','Monthly','Weekly'].map(h=><th key={h} style={{textAlign:h?'right':'left',padding:'6px',color:C.slate,fontSize:10,textTransform:'uppercase',borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
                <tbody>
                  {[
                    {l:'Gross',a:r.gross,m:r.monthly.gross,w:r.weekly.gross},
                    {l:'Income Tax',a:r.incomeTax,m:r.incomeTax/12,w:r.incomeTax/52,neg:true},
                    {l:'Nat. Insurance',a:r.ni,m:r.ni/12,w:r.ni/52,neg:true},
                    r.studentLoan>0?{l:'Student Loan',a:r.studentLoan,m:r.studentLoan/12,w:r.studentLoan/52,neg:true}:null,
                    r.pension>0?{l:'Pension',a:r.pension,m:r.pension/12,w:r.pension/52,neg:true}:null,
                    {l:'Take-Home',a:r.takeHome,m:r.monthly.takeHome,w:r.weekly.takeHome,bold:true,grn:true}
                  ].filter(Boolean).map((row,i)=>(
                    <tr key={row.l} style={{background:i%2===0?'transparent':'rgba(0,0,0,0.015)',borderBottom:`1px solid ${C.border}`}}>
                      <td style={{padding:'9px 6px',fontWeight:row.bold?700:400,color:row.grn?C.teal:C.text,fontSize:12}}>{row.l}</td>
                      {[row.a,row.m,row.w].map((v,j)=>(
                        <td key={j} style={{padding:'9px 6px',textAlign:'right',fontFamily:'JetBrains Mono',fontSize:11,color:row.neg?C.red:row.grn?C.teal:C.text,fontWeight:row.bold?700:400}}>
                          {row.neg?'-'+fmtP(v):fmtPD(v)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  </div>

  <section style={{background:C.white,borderTop:`1px solid ${C.border}`,padding:mob?'44px 16px':'52px 24px',marginTop:48}}>
    <div style={{maxWidth:1100,margin:'0 auto'}}>
      <h2 style={{fontFamily:'DM Serif Display',fontSize:mob?22:28,color:C.navy,marginBottom:5}}>More Calculators</h2>
      <p style={{color:C.slate,marginBottom:22,fontSize:14}}>Every scenario. Every type of worker.</p>
      <div style={{display:'grid',gridTemplateColumns:mob?'1fr 1fr':'repeat(auto-fill,minmax(178px,1fr))',gap:12}}>
        {[{icon:'🏗️',label:'IR35 Contractor',sub:'PAYE vs Ltd Co',tag:'Popular',page:'contractor'},{icon:'⏰',label:'Hourly Rate',sub:'Hourly to annual',page:'hourly'},{icon:'👶',label:'Maternity Pay',sub:'SMP calculator',page:'maternity'},{icon:'🏥',label:'NHS Pay Bands',sub:'Bands 1 to 9',page:'nhs'},{icon:'💼',label:'Bonus Calculator',sub:'Net after tax',page:'bonus'},{icon:'🏦',label:'Salary Sacrifice',sub:'Pension real cost',page:'sacrifice'},{icon:'📊',label:'Job Comparison',sub:'Compare 2 offers',page:'comparison'},{icon:'🌍',label:'All Tools',sub:'View everything',page:'tools'}].map(c=>(
          <button key={c.label} onClick={()=>nav(c.page)} style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:'14px 13px',textAlign:'left'}}>
            <div style={{fontSize:20,marginBottom:7}}>{c.icon}</div>
            <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:4}}>
              <div style={{fontSize:mob?12:13,fontWeight:700,color:C.navy,lineHeight:1.3}}>{c.label}</div>
              {c.tag&&<span style={{fontSize:9,background:C.tealBg,color:C.teal,border:`1px solid ${C.tealBorder}`,borderRadius:3,padding:'2px 5px',flexShrink:0,fontWeight:700}}>{c.tag}</span>}
            </div>
            <div style={{fontSize:11,color:C.slate,marginTop:2}}>{c.sub}</div>
          </button>
        ))}
      </div>
    </div>
  </section>

  <div style={{background:C.tealBg,borderTop:`1px solid ${C.tealBorder}`,borderBottom:`1px solid ${C.tealBorder}`,padding:mob?'26px 16px':'30px 24px'}}>
    <div style={{maxWidth:1100,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:16}}>
      <div>
        <div style={{fontFamily:'DM Serif Display',fontSize:mob?17:20,color:C.navy,marginBottom:3}}>Available in Multiple Countries</div>
        <div style={{fontSize:13,color:C.slate}}>Same accuracy. Local tax rules.</div>
      </div>
      <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
        {[{flag:'🇬🇧',label:'UK',live:true},{flag:'🇨🇦',label:'Canada',live:false},{flag:'🇦🇺',label:'Australia',live:false},{flag:'🇳🇱',label:'Netherlands',live:false},{flag:'🇸🇪',label:'Sweden',live:false}].map(c=>(
          <div key={c.label} style={{display:'flex',alignItems:'center',gap:5,background:C.white,border:`1px solid ${c.live?C.tealBorder:C.border}`,borderRadius:7,padding:'7px 11px'}}>
            <span style={{fontSize:15}}>{c.flag}</span>
            <span style={{fontSize:12,fontWeight:600,color:C.navy}}>{c.label}</span>
            <span style={{fontSize:9,background:c.live?C.tealBg:'#F1F5F9',color:c.live?C.teal:C.slate,borderRadius:3,padding:'1px 5px',fontWeight:700,fontFamily:'JetBrains Mono'}}>{c.live?'LIVE':'SOON'}</span>
          </div>
        ))}
      </div>
    </div>
  </div>

  <section style={{background:C.navy,padding:mob?'38px 16px':'46px 24px'}}>
    <div style={{maxWidth:1100,margin:'0 auto'}}>
      <h2 style={{fontFamily:'DM Serif Display',fontSize:mob?20:26,color:'white',marginBottom:5}}>Understanding Your Tax</h2>
      <p style={{color:'rgba(255,255,255,0.38)',marginBottom:20,fontSize:13}}>Plain-English guides. Confirmed 2026-27 HMRC and Scottish Government figures.</p>
      <div style={{display:'grid',gridTemplateColumns:mob?'1fr':'repeat(auto-fill,minmax(230px,1fr))',gap:12}}>
        {ARTICLES.map(a=>(
          <button key={a.slug} onClick={()=>nav('article-'+a.slug)} style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:10,padding:16,textAlign:'left'}}>
            <div style={{fontSize:10,color:C.tealLight,marginBottom:5,fontFamily:'JetBrains Mono',fontWeight:600}}>{a.category}</div>
            <div style={{fontSize:13,fontWeight:700,color:C.tealLight,marginBottom:5,lineHeight:1.35}}>{a.title}</div>
            <div style={{fontSize:12,color:'rgba(255,255,255,0.38)',lineHeight:1.55}}>{a.metaDesc}</div>
          </button>
        ))}
      </div>
    </div>
  </section>
  <SiteFooter nav={nav} mob={mob} />
</main>
```

);
}

// ── CONTRACTOR PAGE ───────────────────────────────────────────────────────────
function ContractorPage({ nav }) {
const mob=useWidth()<640;
const [dayStr,setDayStr]=useState(‘500’);
const [daysStr,setDaysStr]=useState(‘220’);
const dayRate=Math.max(0,Number(dayStr)||0);
const days=Math.max(0,Number(daysStr)||0);
const annual=dayRate*days;
const rIn=calculate(annual,5,‘none’,false,’’);
const corpTax=Math.max(0,(annual-12570-9100)*0.19);
const divs=Math.max(0,annual-12570-corpTax-9100);
const taxDiv=Math.max(0,divs-500);
const basicBand=Math.max(0,50270-12570);
const divTax=taxDiv<=basicBand?taxDiv*0.1075:basicBand*0.1075+Math.max(0,taxDiv-basicBand)*0.3575;
const limitedTH=12570+divs-divTax;
const saving=limitedTH-rIn.takeHome;
return (
<main>
<PageHero tag="IR35 and Contractor Tools" title="IR35 Contractor<br /><em style='color:#14B8A6'>Calculator</em>" sub="Compare PAYE inside IR35 vs. Limited Company outside IR35. Updated for 2026-27 dividend rates (10.75%)." mob={mob} />
<div style={{maxWidth:860,margin:mob?’-28px 0 0’:’-34px auto 0’,padding:mob?‘0 16px 48px’:‘0 24px 56px’}}>
<BackBtn nav={nav} />
<Card style={{marginBottom:16}}>
<h2 style={{fontFamily:‘DM Serif Display’,fontSize:19,color:C.navy,marginBottom:20}}>Your Contract Details</h2>
<div style={{display:‘grid’,gridTemplateColumns:mob?‘1fr’:‘1fr 1fr’,gap:16}}>
<NumInput label="Day Rate" value={dayStr} onChange={setDayStr} showPrefix hint="Exc. VAT" max={5000} />
<NumInput label="Days per Year" value={daysStr} onChange={setDaysStr} hint="Typical: 220" max={260} />
</div>
<div style={{padding:‘10px 14px’,background:C.tealBg,borderRadius:7,border:`1px solid ${C.tealBorder}`,display:‘flex’,justifyContent:‘space-between’,flexWrap:‘wrap’,gap:8}}>
<span style={{fontSize:13,color:C.teal,fontWeight:600}}>Annual contract value</span>
<span style={{fontFamily:‘JetBrains Mono’,fontSize:14,fontWeight:700,color:C.navy}}>{fmtP(annual)}</span>
</div>
</Card>
<div style={{display:‘grid’,gridTemplateColumns:mob?‘1fr’:‘1fr 1fr’,gap:14,marginBottom:14}}>
{[{label:‘Inside IR35 (PAYE)’,value:rIn.takeHome,sub:‘All income taxed as employment income.’,color:C.red,bg:C.redBg,border:C.redBorder},{label:‘Outside IR35 (Ltd Co.)’,value:limitedTH,sub:‘Salary + dividends. Basic rate dividend tax now 10.75% from April 2026.’,color:C.teal,bg:C.tealBg,border:C.tealBorder}].map(s=>(
<div key={s.label} style={{background:s.bg,border:`1.5px solid ${s.border}`,borderRadius:12,padding:mob?‘18px’:‘22px’,minWidth:0}}>
<div style={{fontSize:11,color:C.slate,fontWeight:700,letterSpacing:‘0.06em’,textTransform:‘uppercase’,marginBottom:8}}>{s.label}</div>
<div style={{fontFamily:‘DM Serif Display’,fontSize:‘clamp(26px,5vw,40px)’,color:s.color,lineHeight:1,overflow:‘hidden’,textOverflow:‘ellipsis’,whiteSpace:‘nowrap’}}>
<AnimNum value={Math.max(0,s.value)} />
</div>
<div style={{fontSize:12,color:C.slate,marginTop:5,fontFamily:‘JetBrains Mono’}}>{fmtPD(Math.max(0,s.value)/12)}/month</div>
<div style={{fontSize:11,color:C.textMid,marginTop:8,lineHeight:1.5}}>{s.sub}</div>
</div>
))}
</div>
{annual>0&&(
<div style={{background:saving>0?C.tealBg:C.redBg,border:`1.5px solid ${saving>0?C.tealBorder:C.redBorder}`,borderRadius:10,padding:‘14px 18px’,marginBottom:14}}>
<span style={{fontSize:14,color:C.text}}>Outside IR35 {saving>0?‘saves you’:‘costs you’} <strong style={{color:saving>0?C.teal:C.red}}>{fmtP(Math.abs(saving))}/year</strong> ({fmtP(Math.abs(saving/12))}/month) {saving>0?‘more’:‘less’} in take-home pay</span>
</div>
)}
<div style={{background:C.amberBg,border:`1px solid ${C.amberBorder}`,borderRadius:10,padding:‘13px 17px’,marginBottom:20}}>
<div style={{fontSize:12,fontWeight:700,color:’#92400E’,marginBottom:4}}>Disclaimer</div>
<div style={{fontSize:12,color:’#78350F’,lineHeight:1.6}}>IR35 status depends on your actual working practices. This is indicative only. Seek advice from a qualified IR35 specialist.</div>
</div>
<div style={{padding:‘14px 16px’,background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,display:‘flex’,alignItems:‘center’,justifyContent:‘space-between’,flexWrap:‘wrap’,gap:10}}>
<span style={{fontSize:13,color:C.textMid}}>Also need your PAYE take-home?</span>
<button onClick={()=>nav(‘home’)} style={{background:C.teal,color:‘white’,padding:‘9px 18px’,borderRadius:7,fontWeight:700,fontSize:13,border:‘none’}}>Open Salary Calculator</button>
</div>
</div>
</main>
);
}

// ── NHS PAGE ──────────────────────────────────────────────────────────────────
function NHSPage({ nav }) {
const mob=useWidth()<640;
const [selectedBand,setSelectedBand]=useState(‘Band 5’);
const [spineIdx,setSpineIdx]=useState(0);
const [pension,setPension]=useState(9.8);
const [scotland,setScotland]=useState(false);
const band=NHS_BANDS.find(b=>b.band===selectedBand)||NHS_BANDS[4];
const salary=band.points[Math.min(spineIdx,band.points.length-1)];
const r=calculate(salary,pension,‘none’,scotland,’’);
return (
<main>
<PageHero tag="NHS Pay Bands 2026-27" title="NHS Pay Bands<br /><em style='color:#14B8A6'>Take-Home Calculator</em>" sub="Agenda for Change pay scales with real take-home after tax, NI and NHS pension. Scotland supported." mob={mob} />
<div style={{maxWidth:960,margin:mob?’-28px 0 0’:’-34px auto 0’,padding:mob?‘0 16px 48px’:‘0 24px 56px’}}>
<BackBtn nav={nav} />
<div style={{display:‘grid’,gridTemplateColumns:mob?‘1fr’:‘1fr 1fr’,gap:20,alignItems:‘start’,marginBottom:20}}>
<Card>
<h2 style={{fontFamily:‘DM Serif Display’,fontSize:19,color:C.navy,marginBottom:20}}>Select Your Band</h2>
<SelectField label=“NHS Pay Band” value={selectedBand} onChange={v=>{setSelectedBand(v);setSpineIdx(0);}} options={NHS_BANDS.map(b=>({value:b.band,label:`${b.band}  (${fmtP(b.min)} to ${fmtP(b.max)})`}))} />
<div style={{marginBottom:18}}>
<div style={{display:‘flex’,justifyContent:‘space-between’,marginBottom:10}}>
<label style={{fontSize:13,fontWeight:600,color:C.navyLight}}>Spine Point</label>
<span style={{fontFamily:‘JetBrains Mono’,fontSize:14,color:C.teal,fontWeight:600}}>{fmtP(salary)}/yr</span>
</div>
<input type=“range” min={0} max={band.points.length-1} step={1} value={spineIdx} onChange={e=>setSpineIdx(Number(e.target.value))} />
<div style={{display:‘flex’,justifyContent:‘space-between’,marginTop:4}}>
<span style={{fontSize:11,color:C.slateLight}}>Point 1: {fmtP(band.points[0])}</span>
<span style={{fontSize:11,color:C.slateLight}}>Top: {fmtP(band.points[band.points.length-1])}</span>
</div>
</div>
<SliderField label=“NHS Pension Contribution” value={pension} onChange={setPension} min={5} max={14.5} step={0.5} fmtFn={v=>v+’%’} />
<ScotlandToggle scotland={scotland} setScotland={setScotland} />
</Card>
<div style={{display:‘flex’,flexDirection:‘column’,gap:14,minWidth:0}}>
<ResultHero value={r.takeHome} monthly={r.monthly.takeHome} pct={(r.takeHome/r.gross)*100} mob={mob} />
<Card>
{[{l:‘Gross salary’,v:r.gross},{l:`Income Tax${scotland?' (Scottish)':''}`,v:r.incomeTax,neg:true},{l:‘National Insurance’,v:r.ni,neg:true},{l:`NHS Pension (${pension}%)`,v:r.pension,neg:true},{l:‘Annual take-home’,v:r.takeHome,big:true,color:C.teal}].map((row,i)=>(
<div key={row.l} style={{display:‘flex’,justifyContent:‘space-between’,alignItems:‘center’,padding:‘10px 0’,borderBottom:i<4?`1px solid ${C.border}`:‘none’}}>
<span style={{fontSize:row.big?14:13,fontWeight:row.big?700:400,color:row.big?C.text:C.textMid}}>{row.l}</span>
<span style={{fontFamily:‘JetBrains Mono’,fontSize:row.big?16:13,color:row.neg?C.red:(row.color||C.navy),fontWeight:row.big?700:400}}>{row.neg?’-’:’’}{fmtP(row.v)}</span>
</div>
))}
</Card>
</div>
</div>
<Card>
<h3 style={{fontFamily:‘DM Serif Display’,fontSize:18,color:C.navy,marginBottom:14}}>All NHS Pay Bands 2026-27</h3>
<div style={{overflowX:‘auto’,WebkitOverflowScrolling:‘touch’}}>
<table style={{width:‘100%’,borderCollapse:‘collapse’,fontSize:13,minWidth:480}}>
<thead><tr>{[‘Band’,‘Min Salary’,‘Max Salary’,‘Min Take-Home’,‘Max Take-Home’].map(h=><th key={h} style={{textAlign:h===‘Band’?‘left’:‘right’,padding:‘10px 12px’,background:C.tealBg,color:C.teal,borderBottom:`2px solid ${C.tealBorder}`,fontSize:11,fontWeight:700}}>{h}</th>)}</tr></thead>
<tbody>
{NHS_BANDS.map((b,i)=>{
const rMin=calculate(b.min,9.8,‘none’,scotland,’’);
const rMax=calculate(b.max,9.8,‘none’,scotland,’’);
const isSel=b.band===selectedBand;
return (
<tr key={b.band} onClick={()=>{setSelectedBand(b.band);setSpineIdx(0);window.scrollTo({top:0,behavior:‘smooth’});}} style={{background:isSel?C.tealBg:i%2===0?C.white:C.bg,cursor:‘pointer’,borderBottom:`1px solid ${C.border}`}}>
<td style={{padding:‘10px 12px’,fontWeight:700,color:isSel?C.teal:C.navy}}>{b.band}</td>
<td style={{padding:‘10px 12px’,textAlign:‘right’,fontFamily:‘JetBrains Mono’,fontSize:12}}>{fmtP(b.min)}</td>
<td style={{padding:‘10px 12px’,textAlign:‘right’,fontFamily:‘JetBrains Mono’,fontSize:12}}>{fmtP(b.max)}</td>
<td style={{padding:‘10px 12px’,textAlign:‘right’,fontFamily:‘JetBrains Mono’,fontSize:12,color:C.green}}>{fmtP(rMin.takeHome)}</td>
<td style={{padding:‘10px 12px’,textAlign:‘right’,fontFamily:‘JetBrains Mono’,fontSize:12,color:C.green}}>{fmtP(rMax.takeHome)}</td>
</tr>
);
})}
</tbody>
</table>
</div>
<div style={{fontSize:11,color:C.slateLight,marginTop:8}}>Tap any row to load in the calculator above. Assumes 9.8% NHS pension.{scotland?’ Using Scottish income tax rates.’:’’}</div>
</Card>
</div>
</main>
);
}

// ── MATERNITY PAGE ────────────────────────────────────────────────────────────
function MaternityPage({ nav }) {
const mob=useWidth()<640;
const [salaryStr,setSalaryStr]=useState(‘35000’);
const [enhanced,setEnhanced]=useState(false);
const [enhWeeks,setEnhWeeks]=useState(13);
const [enhPct,setEnhPct]=useState(100);
const salary=Math.max(0,Number(salaryStr)||0);
const weeklyGross=salary/52;
const smpRate=187.18;
const phase1=weeklyGross*0.9;
const phase2=Math.min(smpRate,phase1);
const smpTotal=phase1*6+phase2*33;
return (
<main>
<PageHero tag="Maternity Pay 2026-27" title="Statutory Maternity Pay<br /><em style='color:#14B8A6'>Calculator</em>" sub="SMP entitlement and weekly breakdown. Statutory rate: £187.18/week for 2026-27." mob={mob} />
<div style={{maxWidth:860,margin:mob?’-28px 0 0’:’-34px auto 0’,padding:mob?‘0 16px 48px’:‘0 24px 56px’}}>
<BackBtn nav={nav} />
<div style={{display:‘grid’,gridTemplateColumns:mob?‘1fr’:‘1fr 1fr’,gap:20,alignItems:‘start’}}>
<Card>
<h2 style={{fontFamily:‘DM Serif Display’,fontSize:19,color:C.navy,marginBottom:20}}>Your Details</h2>
<NumInput label="Annual Salary" value={salaryStr} onChange={setSalaryStr} showPrefix hint={salary>0?fmtPD(weeklyGross)+’/week’:undefined} />
<div style={{marginBottom:18}}>
<label style={{display:‘block’,fontSize:13,fontWeight:600,color:C.navyLight,marginBottom:10}}>Enhanced maternity pay from employer?</label>
<div style={{display:‘flex’,gap:10}}>
{[[‘Yes’,true],[‘No — SMP only’,false]].map(([lbl,val])=>(
<button key={String(val)} onClick={()=>setEnhanced(val)} style={{flex:1,padding:‘10px’,borderRadius:8,border:`1.5px solid ${enhanced===val?C.teal:C.borderDark}`,background:enhanced===val?C.tealBg:C.white,color:enhanced===val?C.teal:C.textMid,fontSize:13,fontWeight:enhanced===val?700:400}}>{lbl}</button>
))}
</div>
</div>
{enhanced&&(
<>
<SliderField label=“Weeks at enhanced pay” value={enhWeeks} onChange={setEnhWeeks} min={1} max={39} step={1} fmtFn={v=>v+’ wks’} />
<SliderField label=“Enhanced pay rate” value={enhPct} onChange={setEnhPct} min={50} max={100} step={5} fmtFn={v=>v+’%’} />
</>
)}
<div style={{padding:‘12px 14px’,background:C.amberBg,border:`1px solid ${C.amberBorder}`,borderRadius:8,fontSize:12,color:’#78350F’,lineHeight:1.65}}>
To qualify: employed for 26 weeks by the 15th week before your due date, earning at least £123/week on average.
</div>
</Card>
<div style={{display:‘flex’,flexDirection:‘column’,gap:14,minWidth:0}}>
<div style={{background:`linear-gradient(135deg,${C.navy},${C.navyMid})`,borderRadius:14,padding:mob?20:24,boxShadow:C.shadow}}>
<div style={{fontSize:10,color:‘rgba(255,255,255,0.4)’,letterSpacing:‘0.12em’,textTransform:‘uppercase’,fontFamily:‘JetBrains Mono’,marginBottom:6}}>Total SMP (39 weeks)</div>
<div style={{fontFamily:‘DM Serif Display’,fontSize:‘clamp(26px,5vw,44px)’,color:‘white’,lineHeight:1,overflow:‘hidden’,textOverflow:‘ellipsis’,whiteSpace:‘nowrap’}}>{fmtP(smpTotal)}</div>
<div style={{fontSize:13,color:‘rgba(255,255,255,0.45)’,fontFamily:‘JetBrains Mono’,marginTop:5}}>{fmtPD(smpTotal/39)}/week average</div>
</div>
<Card>
<div style={{fontSize:11,fontWeight:700,color:C.navy,textTransform:‘uppercase’,letterSpacing:‘0.08em’,marginBottom:14}}>SMP Breakdown</div>
<div style={{marginBottom:14,padding:‘12px 14px’,background:C.tealBg,border:`1px solid ${C.tealBorder}`,borderRadius:8}}>
<div style={{fontSize:12,fontWeight:700,color:C.teal,marginBottom:6}}>Weeks 1 to 6 — 90% of average weekly earnings</div>
<div style={{display:‘flex’,justifyContent:‘space-between’,fontSize:13}}><span style={{color:C.textMid}}>Weekly</span><span style={{fontFamily:‘JetBrains Mono’,fontWeight:700}}>{fmtPD(phase1)}</span></div>
<div style={{display:‘flex’,justifyContent:‘space-between’,fontSize:13,marginTop:3}}><span style={{color:C.textMid}}>6-week total</span><span style={{fontFamily:‘JetBrains Mono’,fontWeight:700}}>{fmtP(phase1*6)}</span></div>
</div>
<div style={{padding:‘12px 14px’,background:C.bg,border:`1px solid ${C.border}`,borderRadius:8}}>
<div style={{fontSize:12,fontWeight:700,color:C.navy,marginBottom:6}}>Weeks 7 to 39 — Statutory rate (2026-27)</div>
<div style={{display:‘flex’,justifyContent:‘space-between’,fontSize:13}}><span style={{color:C.textMid}}>Weekly</span><span style={{fontFamily:‘JetBrains Mono’,fontWeight:700}}>{fmtPD(smpRate)}</span></div>
<div style={{display:‘flex’,justifyContent:‘space-between’,fontSize:13,marginTop:3}}><span style={{color:C.textMid}}>33-week total</span><span style={{fontFamily:‘JetBrains Mono’,fontWeight:700}}>{fmtP(phase2*33)}</span></div>
</div>
</Card>
</div>
</div>
</div>
</main>
);
}

// ── HOURLY PAGE ───────────────────────────────────────────────────────────────
function HourlyPage({ nav }) {
const mob=useWidth()<640;
const [hourlyStr,setHourlyStr]=useState(‘18’);
const [hours,setHours]=useState(37.5);
const [pension,setPension]=useState(5);
const [scotland,setScotland]=useState(false);
const hourly=Math.max(0,Number(hourlyStr)||0);
const annual=hourly*hours*52;
const r=calculate(annual,pension,‘none’,scotland,’’);
const netHourly=hours>0?r.takeHome/(hours*52):0;
return (
<main>
<PageHero tag="Hourly Rate Calculator" title="Hourly Rate<br /><em style='color:#14B8A6'>Take-Home Calculator</em>" sub="Convert hourly wage to annual, monthly and weekly take-home. Scotland supported." mob={mob} />
<div style={{maxWidth:860,margin:mob?’-28px 0 0’:’-34px auto 0’,padding:mob?‘0 16px 48px’:‘0 24px 56px’}}>
<BackBtn nav={nav} />
<div style={{display:‘grid’,gridTemplateColumns:mob?‘1fr’:‘1fr 1fr’,gap:20,alignItems:‘start’}}>
<Card>
<h2 style={{fontFamily:‘DM Serif Display’,fontSize:19,color:C.navy,marginBottom:20}}>Your Details</h2>
<NumInput label="Hourly Rate" value={hourlyStr} onChange={setHourlyStr} showPrefix hint="Gross, before tax" max={500} />
<SliderField label=“Hours per Week” value={hours} onChange={setHours} min={1} max={60} step={0.5} fmtFn={v=>v+’ hrs’} />
<SliderField label=“Pension Contribution” value={pension} onChange={setPension} min={0} max={30} step={0.5} fmtFn={v=>v+’%’} />
<ScotlandToggle scotland={scotland} setScotland={setScotland} />
{hourly>0&&(
<div style={{padding:‘10px 13px’,background:C.tealBg,border:`1px solid ${C.tealBorder}`,borderRadius:7}}>
<div style={{display:‘flex’,justifyContent:‘space-between’,marginBottom:3}}>
<span style={{fontSize:12,color:C.teal,fontWeight:600}}>Equivalent annual salary</span>
<span style={{fontFamily:‘JetBrains Mono’,fontSize:13,fontWeight:700,color:C.navy}}>{fmtP(annual)}</span>
</div>
<div style={{fontSize:11,color:’#0f766e’}}>{hours} hrs/wk x 52 weeks</div>
</div>
)}
</Card>
<div style={{display:‘flex’,flexDirection:‘column’,gap:14,minWidth:0}}>
<ResultHero value={r.takeHome} monthly={r.monthly.takeHome} pct={annual>0?(r.takeHome/r.gross)*100:0} mob={mob} />
<Card>
{[{l:‘Gross hourly rate’,v:hourly},{l:‘Net hourly rate’,v:netHourly,color:C.teal,big:true},{l:‘Annual gross’,v:annual},{l:‘Annual take-home’,v:r.takeHome,color:C.teal,big:true},{l:‘Monthly take-home’,v:r.monthly.takeHome},{l:‘Weekly take-home’,v:r.weekly.takeHome}].map((row,i)=>(
<div key={row.l} style={{display:‘flex’,justifyContent:‘space-between’,alignItems:‘center’,padding:‘9px 0’,borderBottom:i<5?`1px solid ${C.border}`:‘none’}}>
<span style={{fontSize:row.big?14:13,fontWeight:row.big?700:400,color:row.big?C.text:C.textMid}}>{row.l}</span>
<span style={{fontFamily:‘JetBrains Mono’,fontSize:row.big?15:13,color:row.color||C.navy,fontWeight:row.big?700:400}}>{fmtPD(row.v)}</span>
</div>
))}
</Card>
</div>
</div>
</div>
</main>
);
}

// ── BONUS PAGE ────────────────────────────────────────────────────────────────
function BonusPage({ nav }) {
const mob=useWidth()<640;
const [salaryStr,setSalaryStr]=useState(‘40000’);
const [bonusStr,setBonusStr]=useState(‘5000’);
const [scotland,setScotland]=useState(false);
const salary=Math.max(0,Number(salaryStr)||0);
const bonus=Math.max(0,Number(bonusStr)||0);
const rBase=calculate(salary,0,‘none’,scotland,’’);
const rWith=calculate(salary+bonus,0,‘none’,scotland,’’);
const extraTax=rWith.incomeTax-rBase.incomeTax;
const extraNI=rWith.ni-rBase.ni;
const netBonus=Math.max(0,bonus-extraTax-extraNI);
const pct=bonus>0?(netBonus/bonus)*100:0;
return (
<main>
<PageHero tag="Bonus Calculator" title="Bonus Take-Home<br /><em style='color:#14B8A6'>Calculator</em>" sub="Exactly how much of your bonus you keep after income tax and NI. Scotland supported." mob={mob} />
<div style={{maxWidth:860,margin:mob?’-28px 0 0’:’-34px auto 0’,padding:mob?‘0 16px 48px’:‘0 24px 56px’}}>
<BackBtn nav={nav} />
<div style={{display:‘grid’,gridTemplateColumns:mob?‘1fr’:‘1fr 1fr’,gap:20,alignItems:‘start’}}>
<Card>
<h2 style={{fontFamily:‘DM Serif Display’,fontSize:19,color:C.navy,marginBottom:20}}>Your Details</h2>
<NumInput label="Annual Salary (before bonus)" value={salaryStr} onChange={setSalaryStr} showPrefix />
<NumInput label="Gross Bonus Amount" value={bonusStr} onChange={setBonusStr} showPrefix />
<ScotlandToggle scotland={scotland} setScotland={setScotland} />
</Card>
<div style={{display:‘flex’,flexDirection:‘column’,gap:14,minWidth:0}}>
<div style={{background:`linear-gradient(135deg,${C.navy},${C.navyMid})`,borderRadius:14,padding:mob?20:24,boxShadow:C.shadow}}>
<div style={{fontSize:10,color:‘rgba(255,255,255,0.4)’,letterSpacing:‘0.12em’,textTransform:‘uppercase’,fontFamily:‘JetBrains Mono’,marginBottom:6}}>Net Bonus (After Tax)</div>
<div style={{fontFamily:‘DM Serif Display’,fontSize:‘clamp(26px,5vw,44px)’,color:‘white’,lineHeight:1,overflow:‘hidden’,textOverflow:‘ellipsis’,whiteSpace:‘nowrap’}}><AnimNum value={netBonus} /></div>
<div style={{fontSize:13,color:C.tealLight,fontFamily:‘JetBrains Mono’,marginTop:5,fontWeight:600}}>{pct.toFixed(1)}% of gross bonus kept</div>
</div>
<Card>
{[{l:‘Gross bonus’,v:bonus},{l:‘Extra income tax’,v:extraTax,neg:true},{l:‘Extra NI’,v:extraNI,neg:true},{l:‘Net bonus (you receive)’,v:netBonus,big:true,color:C.teal}].map((row,i)=>(
<div key={row.l} style={{display:‘flex’,justifyContent:‘space-between’,alignItems:‘center’,padding:‘9px 0’,borderBottom:i<3?`1px solid ${C.border}`:‘none’}}>
<span style={{fontSize:row.big?14:13,fontWeight:row.big?700:400,color:row.big?C.text:C.textMid}}>{row.l}</span>
<span style={{fontFamily:‘JetBrains Mono’,fontSize:row.big?16:13,color:row.neg?C.red:(row.color||C.navy),fontWeight:row.big?700:400}}>{row.neg?’-’:’’}{fmtP(row.v)}</span>
</div>
))}
<div style={{marginTop:12,height:7,background:C.border,borderRadius:4,overflow:‘hidden’}}><div className=“bfill” style={{width:Math.min(100,pct)+’%’,height:‘100%’,background:`linear-gradient(90deg,${C.teal},${C.tealLight})`}} /></div>
</Card>
</div>
</div>
</div>
</main>
);
}

// ── SACRIFICE PAGE ────────────────────────────────────────────────────────────
function SacrificePage({ nav }) {
const mob=useWidth()<640;
const [salaryStr,setSalaryStr]=useState(‘45000’);
const [pct,setPct]=useState(5);
const [scotland,setScotland]=useState(false);
const salary=Math.max(0,Number(salaryStr)||0);
const amt=salary*(pct/100);
const rBefore=calculate(salary,0,‘none’,scotland,’’);
const rAfter=calculate(salary-amt,0,‘none’,scotland,’’);
const taxSaving=rBefore.incomeTax-rAfter.incomeTax;
const niSaving=rBefore.ni-rAfter.ni;
const netCost=Math.max(0,amt-taxSaving-niSaving);
const thDiff=rBefore.takeHome-rAfter.takeHome;
return (
<main>
<PageHero tag="Salary Sacrifice" title="Salary Sacrifice<br /><em style='color:#14B8A6'>Pension Calculator</em>" sub="The real cost of a pension contribution after tax and NI savings." mob={mob} />
<div style={{maxWidth:860,margin:mob?’-28px 0 0’:’-34px auto 0’,padding:mob?‘0 16px 48px’:‘0 24px 56px’}}>
<BackBtn nav={nav} />
<div style={{display:‘grid’,gridTemplateColumns:mob?‘1fr’:‘1fr 1fr’,gap:20,alignItems:‘start’}}>
<Card>
<h2 style={{fontFamily:‘DM Serif Display’,fontSize:19,color:C.navy,marginBottom:20}}>Your Details</h2>
<NumInput label="Annual Salary" value={salaryStr} onChange={setSalaryStr} showPrefix />
<SliderField label=“Sacrifice Percentage” value={pct} onChange={setPct} min={1} max={30} step={0.5} fmtFn={v=>`${v}% = ${fmtP(salary*v/100)}`} />
<ScotlandToggle scotland={scotland} setScotland={setScotland} />
</Card>
<div style={{display:‘flex’,flexDirection:‘column’,gap:14,minWidth:0}}>
<div style={{background:`linear-gradient(135deg,${C.navy},${C.navyMid})`,borderRadius:14,padding:mob?20:24,boxShadow:C.shadow}}>
<div style={{fontSize:10,color:‘rgba(255,255,255,0.4)’,letterSpacing:‘0.12em’,textTransform:‘uppercase’,fontFamily:‘JetBrains Mono’,marginBottom:6}}>Real Cost to You</div>
<div style={{fontFamily:‘DM Serif Display’,fontSize:‘clamp(26px,5vw,44px)’,color:‘white’,lineHeight:1,overflow:‘hidden’,textOverflow:‘ellipsis’,whiteSpace:‘nowrap’}}><AnimNum value={netCost} /></div>
<div style={{fontSize:13,color:C.tealLight,fontFamily:‘JetBrains Mono’,marginTop:5}}>vs {fmtP(amt)} gross contribution</div>
</div>
<Card>
{[{l:‘Gross contribution’,v:amt},{l:‘Income tax saved’,v:taxSaving,pos:true},{l:‘NI saved’,v:niSaving,pos:true},{l:‘Real cost to you’,v:netCost,big:true,color:C.teal},{l:‘Take-home reduction’,v:thDiff,neg:true}].map((row,i)=>(
<div key={row.l} style={{display:‘flex’,justifyContent:‘space-between’,alignItems:‘center’,padding:‘9px 0’,borderBottom:i<4?`1px solid ${C.border}`:‘none’}}>
<span style={{fontSize:row.big?14:13,fontWeight:row.big?700:400,color:row.big?C.text:C.textMid}}>{row.l}</span>
<span style={{fontFamily:‘JetBrains Mono’,fontSize:row.big?16:13,color:row.neg?C.red:row.pos?C.green:(row.color||C.navy),fontWeight:row.big?700:400}}>{row.pos?’+’:row.neg?’-’:’’}{fmtP(row.v)}</span>
</div>
))}
</Card>
</div>
</div>
</div>
</main>
);
}

// ── COMPARISON PAGE ───────────────────────────────────────────────────────────
function ComparisonPage({ nav }) {
const mob=useWidth()<640;
const [a,setA]=useState({s:‘50000’,pension:5,label:‘Job A’,scotland:false});
const [b,setB]=useState({s:‘55000’,pension:3,label:‘Job B’,scotland:false});
const rA=calculate(Math.max(0,Number(a.s)||0),a.pension,‘none’,a.scotland,’’);
const rB=calculate(Math.max(0,Number(b.s)||0),b.pension,‘none’,b.scotland,’’);
const diff=rB.takeHome-rA.takeHome;
const JobPanel=({job,setJob,color,bg,border,r,idx})=>(
<div>
<Card style={{marginBottom:12}}>
<input value={job.label} onChange={e=>setJob({…job,label:e.target.value})} style={{width:‘100%’,border:‘none’,fontFamily:‘DM Serif Display’,fontSize:20,color:C.navy,marginBottom:16,outline:‘none’,background:‘transparent’}} placeholder={idx===0?‘Job A’:‘Job B’} />
<NumInput label=“Annual Salary” value={job.s} onChange={v=>setJob({…job,s:v})} showPrefix />
<SliderField label=“Pension” value={job.pension} onChange={v=>setJob({…job,pension:v})} min={0} max={20} step={0.5} fmtFn={v=>v+’%’} />
<div style={{display:‘flex’,alignItems:‘center’,justifyContent:‘space-between’,padding:‘10px 13px’,background:job.scotland?C.scotBg:C.bg,border:`1px solid ${job.scotland?C.scotBorder:C.border}`,borderRadius:8}}>
<div>
<div style={{fontSize:12,fontWeight:700,color:job.scotland?C.scot:C.navyLight}}>Based in Scotland?</div>
<div style={{fontSize:10,color:C.slate}}>Scottish income tax rates</div>
</div>
<Toggle on={job.scotland} onToggle={()=>setJob({…job,scotland:!job.scotland})} ariaLabel={`Toggle Scotland for ${job.label}`} />
</div>
</Card>
<div style={{background:bg,border:`2px solid ${border}`,borderRadius:12,padding:‘18px’,textAlign:‘center’,minWidth:0}}>
<div style={{fontSize:11,color:color,fontWeight:700,letterSpacing:‘0.1em’,textTransform:‘uppercase’,marginBottom:5}}>{job.label} Take-Home</div>
<div style={{fontFamily:‘DM Serif Display’,fontSize:‘clamp(24px,4vw,34px)’,color:C.navy,overflow:‘hidden’,textOverflow:‘ellipsis’,whiteSpace:‘nowrap’}}><AnimNum value={r.takeHome} /></div>
<div style={{fontSize:12,color:C.textMid,marginTop:3,fontFamily:‘JetBrains Mono’}}>{fmtPD(r.monthly.takeHome)}/month</div>
</div>
</div>
);
return (
<main>
<PageHero tag="Job Comparison" title="Job Offer<br /><em style='color:#14B8A6'>Comparison Calculator</em>" sub="Compare two packages side by side. Even compare a Scotland job vs an England job." mob={mob} />
<div style={{maxWidth:1000,margin:mob?’-28px 0 0’:’-34px auto 0’,padding:mob?‘0 16px 48px’:‘0 24px 56px’}}>
<BackBtn nav={nav} />
<div style={{display:‘grid’,gridTemplateColumns:mob?‘1fr’:‘1fr 1fr’,gap:20,marginBottom:18}}>
<JobPanel job={a} setJob={setA} color={C.teal} bg={C.tealBg} border={C.tealBorder} r={rA} idx={0} />
<JobPanel job={b} setJob={setB} color={C.amber} bg={C.amberBg} border={C.amberBorder} r={rB} idx={1} />
</div>
<Card style={{textAlign:‘center’,padding:‘22px’,marginBottom:14}}>
<div style={{fontSize:13,color:C.textMid,marginBottom:5}}>Difference in annual take-home pay</div>
<div style={{fontFamily:‘DM Serif Display’,fontSize:mob?30:40,color:diff>=0?C.teal:C.red,overflow:‘hidden’,textOverflow:‘ellipsis’,whiteSpace:‘nowrap’}}>{diff>=0?’+’:’’}{fmtP(diff)}</div>
<div style={{fontSize:12,color:C.slate,marginTop:4}}>{fmtPD(Math.abs(diff/12))}/month difference</div>
</Card>
<Card>
<div style={{overflowX:‘auto’,WebkitOverflowScrolling:‘touch’}}>
<table style={{width:‘100%’,borderCollapse:‘collapse’,fontSize:13,minWidth:340}}>
<thead><tr>
<th style={{textAlign:‘left’,padding:‘8px 12px’,borderBottom:`2px solid ${C.border}`,fontSize:11,color:C.slate,textTransform:‘uppercase’}}></th>
<th style={{textAlign:‘right’,padding:‘8px 12px’,borderBottom:`2px solid ${C.tealBorder}`,color:C.teal,fontSize:13}}>{a.label}</th>
<th style={{textAlign:‘right’,padding:‘8px 12px’,borderBottom:`2px solid ${C.amberBorder}`,color:C.amber,fontSize:13}}>{b.label}</th>
</tr></thead>
<tbody>
{[{l:‘Gross salary’,va:rA.gross,vb:rB.gross},{l:‘Income Tax’,va:rA.incomeTax,vb:rB.incomeTax,red:true},{l:‘National Insurance’,va:rA.ni,vb:rB.ni,red:true},{l:‘Pension’,va:rA.pension,vb:rB.pension,red:true},{l:‘Annual take-home’,va:rA.takeHome,vb:rB.takeHome,bold:true},{l:‘Monthly take-home’,va:rA.monthly.takeHome,vb:rB.monthly.takeHome,bold:true}].map((row,i)=>(
<tr key={row.l} style={{background:i%2===0?C.white:C.bg,borderBottom:`1px solid ${C.border}`}}>
<td style={{padding:‘10px 12px’,fontSize:13,color:C.textMid,fontWeight:row.bold?700:400}}>{row.l}</td>
<td style={{padding:‘10px 12px’,textAlign:‘right’,fontFamily:‘JetBrains Mono’,fontSize:12,color:row.red?C.red:row.bold?C.teal:C.text,fontWeight:row.bold?700:400}}>{fmtP(row.va)}</td>
<td style={{padding:‘10px 12px’,textAlign:‘right’,fontFamily:‘JetBrains Mono’,fontSize:12,color:row.red?C.red:row.bold?C.amber:C.text,fontWeight:row.bold?700:400}}>{fmtP(row.vb)}</td>
</tr>
))}
</tbody>
</table>
</div>
</Card>
</div>
</main>
);
}

// ── TOOLS PAGE ────────────────────────────────────────────────────────────────
function ToolsPage({ nav }) {
const mob=useWidth()<640;
const tools=[
{icon:‘💷’,label:‘Salary Calculator’,sub:‘Full breakdown incl. Scotland + tax code’,page:‘home’,live:true},
{icon:‘🏗️’,label:‘IR35 Contractor’,sub:‘PAYE vs Ltd Co — 2026-27 dividend rates’,page:‘contractor’,live:true},
{icon:‘⏰’,label:‘Hourly Rate’,sub:‘Hourly wage to annual take-home’,page:‘hourly’,live:true},
{icon:‘🏥’,label:‘NHS Pay Bands’,sub:‘Bands 1 to 9 — Scotland supported’,page:‘nhs’,live:true},
{icon:‘👶’,label:‘Maternity Pay’,sub:‘SMP at £187.18/week for 2026-27’,page:‘maternity’,live:true},
{icon:‘💼’,label:‘Bonus Calculator’,sub:‘Net bonus after tax — Scotland supported’,page:‘bonus’,live:true},
{icon:‘🏦’,label:‘Salary Sacrifice’,sub:‘Pension real cost — Scotland supported’,page:‘sacrifice’,live:true},
{icon:‘📊’,label:‘Job Comparison’,sub:‘Compare Scotland vs England jobs’,page:‘comparison’,live:true},
{icon:‘🏠’,label:‘Mortgage Calc’,sub:‘Coming soon’,live:false},
{icon:‘🧾’,label:‘VAT Calculator’,sub:‘Coming soon’,live:false},
{icon:‘⚖️’,label:‘Redundancy Pay’,sub:‘Coming soon’,live:false},
{icon:‘🏛️’,label:‘Stamp Duty’,sub:‘Coming soon’,live:false},
];
return (
<main>
<PageHero tag="TaxdCal" title="All Calculators" sub="8 live UK tax calculators. Scotland supported throughout." mob={mob} />
<div style={{maxWidth:1100,margin:mob?’-22px 0 0’:’-26px auto 0’,padding:mob?‘0 16px 48px’:‘0 24px 56px’}}>
<div style={{display:‘grid’,gridTemplateColumns:mob?‘1fr 1fr’:‘repeat(auto-fill,minmax(210px,1fr))’,gap:14}}>
{tools.map(t=>(
<button key={t.label} onClick={()=>t.live&&t.page&&nav(t.page)} disabled={!t.live}
style={{background:t.live?C.white:C.bg,border:`1px solid ${t.live?C.border:C.borderDark}`,borderRadius:12,padding:‘18px 16px’,textAlign:‘left’,cursor:t.live?‘pointer’:‘default’,opacity:t.live?1:0.55,boxShadow:t.live?C.shadow:‘none’}}>
<div style={{fontSize:24,marginBottom:10}}>{t.icon}</div>
<div style={{fontSize:13,fontWeight:700,color:t.live?C.navy:C.slate,marginBottom:4}}>{t.label}</div>
<div style={{fontSize:11,color:C.slateLight,lineHeight:1.4}}>{t.sub}</div>
{t.live&&<div style={{fontSize:11,color:C.teal,marginTop:8,fontWeight:600}}>Open calculator</div>}
{!t.live&&<div style={{fontSize:9,color:C.slateLight,marginTop:6,background:C.bg,display:‘inline-block’,padding:‘2px 6px’,borderRadius:3,fontFamily:‘JetBrains Mono’,fontWeight:700}}>SOON</div>}
</button>
))}
</div>
</div>
</main>
);
}

// ── BLOG PAGE ─────────────────────────────────────────────────────────────────
function BlogPage({ nav }) {
const mob=useWidth()<640;
return (
<main style={{background:C.bg,minHeight:‘100vh’}}>
<PageHero tag="Tax Guides" title="Understanding Your Tax" sub="Plain-English guides. Confirmed 2026-27 HMRC and Scottish Government figures." mob={mob} />
<div style={{maxWidth:1000,margin:’-32px auto 60px’,padding:‘0 20px’}}>
<div style={{display:‘grid’,gridTemplateColumns:mob?‘1fr’:‘repeat(auto-fill,minmax(280px,1fr))’,gap:20}}>
{ARTICLES.map(a=>(
<button key={a.slug} onClick={()=>nav(‘article-’+a.slug)} style={{background:C.white,borderRadius:12,padding:22,boxShadow:C.shadow,border:`1px solid ${C.border}`,textAlign:‘left’,width:‘100%’,display:‘block’}}>
<div style={{display:‘flex’,gap:8,marginBottom:12,alignItems:‘center’}}>
<span style={{fontSize:11,background:C.tealBg,color:C.teal,border:`1px solid ${C.tealBorder}`,borderRadius:4,padding:‘2px 8px’,fontWeight:700,fontFamily:‘JetBrains Mono’}}>{a.category}</span>
<span style={{fontSize:11,color:C.slateLight,fontFamily:‘JetBrains Mono’}}>{a.readTime}</span>
</div>
<h2 style={{fontSize:16,fontFamily:‘DM Serif Display’,color:C.navy,lineHeight:1.35,marginBottom:9}}>{a.title}</h2>
<p style={{fontSize:13,color:C.slate,lineHeight:1.6,marginBottom:14}}>{a.metaDesc}</p>
<div style={{fontSize:13,color:C.teal,fontWeight:600}}>Read guide</div>
</button>
))}
</div>
</div>
</main>
);
}

// ── ARTICLE PAGE ──────────────────────────────────────────────────────────────
function ArticlePage({ nav, slug }) {
const mob=useWidth()<640;
const article=ARTICLES.find(a=>a.slug===slug);
if (!article) return <div style={{padding:48,textAlign:‘center’,color:C.slate}}>Article not found.</div>;
const others=ARTICLES.filter(a=>a.slug!==slug).slice(0,3);
function renderBlock(block,i) {
if (block.t===‘h2’) return <h2 key={i} style={{fontFamily:‘DM Serif Display’,fontSize:‘clamp(18px,3vw,24px)’,color:C.navy,marginTop:32,marginBottom:12,lineHeight:1.3}}>{block.v}</h2>;
if (block.t===‘p’)  return <p key={i} style={{fontSize:15,color:C.textMid,lineHeight:1.8,marginBottom:14}}>{block.v}</p>;
if (block.t===‘faq’) return (
<div key={i} style={{marginBottom:14,padding:‘13px 16px’,background:C.bg,borderRadius:8,border:`1px solid ${C.border}`}}>
<p style={{fontSize:14,fontWeight:700,color:C.navy,marginBottom:5}}>{block.q}</p>
<p style={{fontSize:14,color:C.textMid,lineHeight:1.7,margin:0}}>{block.a}</p>
</div>
);
if (block.t===‘table’) return (
<div key={i} style={{overflowX:‘auto’,margin:‘16px 0’,WebkitOverflowScrolling:‘touch’}}>
<table style={{width:‘100%’,borderCollapse:‘collapse’,fontSize:14,minWidth:280}}>
<thead><tr>{block.headers.map((h,j)=><th key={j} style={{background:C.tealBg,color:C.teal,padding:‘10px 14px’,textAlign:‘left’,borderBottom:`2px solid ${C.tealBorder}`,fontSize:12,fontWeight:700}}>{h}</th>)}</tr></thead>
<tbody>{block.rows.map((row,ri)=><tr key={ri} style={{background:ri%2===0?C.white:C.bg}}>{row.map((cell,ci)=><td key={ci} style={{padding:‘9px 14px’,borderBottom:`1px solid ${C.border}`,fontSize:13,color:C.text}}>{cell}</td>)}</tr>)}</tbody>
</table>
</div>
);
return null;
}
return (
<main style={{background:C.bg,minHeight:‘100vh’}}>
<nav aria-label=“Breadcrumb” style={{background:C.navy,padding:‘0 24px’}}>
<div style={{maxWidth:800,margin:‘0 auto’,height:46,display:‘flex’,alignItems:‘center’,gap:8,fontSize:13}}>
<button onClick={()=>nav(‘home’)} style={{background:‘none’,border:‘none’,color:‘rgba(255,255,255,0.45)’,fontSize:13,padding:0,cursor:‘pointer’}}>TaxdCal</button>
<span style={{color:‘rgba(255,255,255,0.2)’}}>›</span>
<button onClick={()=>nav(‘blog’)} style={{background:‘none’,border:‘none’,color:‘rgba(255,255,255,0.45)’,fontSize:13,padding:0,cursor:‘pointer’}}>Tax Guides</button>
<span style={{color:‘rgba(255,255,255,0.2)’}}>›</span>
<span style={{color:C.tealLight,fontSize:13}}>{article.category}</span>
</div>
</nav>
<div style={{background:`linear-gradient(135deg,${C.navy},${C.navyMid})`,padding:‘clamp(28px,5vw,50px) 24px clamp(36px,6vw,64px)’,position:‘relative’,overflow:‘hidden’}}>
<div style={{position:‘absolute’,top:-40,right:-40,width:200,height:200,borderRadius:‘50%’,background:‘rgba(13,148,136,0.07)’}} />
<div style={{maxWidth:720,margin:‘0 auto’,position:‘relative’}}>
<div style={{display:‘flex’,gap:10,marginBottom:14,flexWrap:‘wrap’}}>
<span style={{fontSize:11,background:‘rgba(13,148,136,0.15)’,color:C.tealLight,border:‘1px solid rgba(20,184,166,0.3)’,borderRadius:4,padding:‘2px 10px’,fontFamily:‘JetBrains Mono’,fontWeight:700}}>{article.category}</span>
<span style={{fontSize:11,color:‘rgba(255,255,255,0.38)’,fontFamily:‘JetBrains Mono’}}>{article.readTime} read</span>
<span style={{fontSize:11,color:‘rgba(255,255,255,0.38)’,fontFamily:‘JetBrains Mono’}}>Updated {article.date}</span>
</div>
<h1 style={{fontFamily:‘DM Serif Display’,fontSize:‘clamp(22px,4vw,40px)’,color:‘white’,lineHeight:1.2,marginBottom:14}}>{article.title}</h1>
<p style={{color:‘rgba(255,255,255,0.5)’,fontSize:mob?14:16,lineHeight:1.65,maxWidth:540}}>{article.metaDesc}</p>
</div>
</div>
<div style={{background:C.tealBg,borderBottom:`1px solid ${C.tealBorder}`,padding:‘13px 24px’}}>
<div style={{maxWidth:800,margin:‘0 auto’,display:‘flex’,alignItems:‘center’,justifyContent:‘space-between’,flexWrap:‘wrap’,gap:12}}>
<span style={{fontSize:14,color:C.teal,fontWeight:600}}>See how this affects your pay</span>
<button onClick={()=>nav(article.relatedCalc?.page||‘home’)} style={{background:C.teal,color:‘white’,padding:‘9px 20px’,borderRadius:7,fontWeight:700,fontSize:13,border:‘none’,cursor:‘pointer’}}>
{article.relatedCalc?.label||‘Open Salary Calculator’}
</button>
</div>
</div>
<div style={{maxWidth:800,margin:‘0 auto’,padding:‘clamp(20px,4vw,44px) 20px’}}>
<div style={{background:C.white,borderRadius:14,padding:22,boxShadow:C.shadow,border:`1px solid ${C.border}`}}>
{article.blocks.map((block,i)=>renderBlock(block,i))}
</div>
<div style={{background:`linear-gradient(135deg,${C.navy},${C.navyMid})`,borderRadius:14,padding:mob?22:32,marginTop:22,textAlign:‘center’}}>
<h2 style={{fontFamily:‘DM Serif Display’,fontSize:22,color:‘white’,marginBottom:7}}>Calculate your exact take-home pay</h2>
<p style={{color:‘rgba(255,255,255,0.48)’,fontSize:14,marginBottom:18}}>Free, accurate, 2026-27 rates. Scotland and tax code supported. No sign-up.</p>
<div style={{display:‘flex’,gap:12,justifyContent:‘center’,flexWrap:‘wrap’}}>
<button onClick={()=>nav(‘home’)} style={{background:C.teal,color:‘white’,padding:‘12px 24px’,borderRadius:8,fontWeight:700,fontSize:14,border:‘none’,cursor:‘pointer’}}>Salary Calculator</button>
{article.relatedCalc&&article.relatedCalc.page!==‘home’&&(
<button onClick={()=>nav(article.relatedCalc.page)} style={{background:‘rgba(255,255,255,0.12)’,color:‘white’,padding:‘12px 24px’,borderRadius:8,fontWeight:700,fontSize:14,border:‘1px solid rgba(255,255,255,0.2)’,cursor:‘pointer’}}>{article.relatedCalc.label}</button>
)}
</div>
</div>
{others.length>0&&(
<div style={{marginTop:30}}>
<h2 style={{fontFamily:‘DM Serif Display’,fontSize:19,color:C.navy,marginBottom:14}}>More Tax Guides</h2>
<div style={{display:‘grid’,gridTemplateColumns:mob?‘1fr’:‘repeat(auto-fill,minmax(220px,1fr))’,gap:12}}>
{others.map(a=>(
<button key={a.slug} onClick={()=>nav(‘article-’+a.slug)} style={{background:C.white,borderRadius:10,padding:16,border:`1px solid ${C.border}`,textAlign:‘left’,boxShadow:C.shadow,width:‘100%’,cursor:‘pointer’}}>
<div style={{fontSize:10,color:C.teal,fontWeight:700,fontFamily:‘JetBrains Mono’,marginBottom:5,textTransform:‘uppercase’}}>{a.category}</div>
<div style={{fontSize:14,fontFamily:‘DM Serif Display’,color:C.navy,lineHeight:1.4,marginBottom:7}}>{a.title}</div>
<div style={{fontSize:12,color:C.teal,fontWeight:600}}>Read guide</div>
</button>
))}
</div>
</div>
)}
</div>
<footer style={{background:’#07111F’,padding:‘22px 20px’,borderTop:‘1px solid rgba(255,255,255,0.05)’,marginTop:40}}>
<div style={{maxWidth:800,margin:‘0 auto’,display:‘flex’,justifyContent:‘space-between’,flexWrap:‘wrap’,gap:12,alignItems:‘center’}}>
<button onClick={()=>nav(‘home’)} style={{background:‘none’,border:‘none’,padding:0,cursor:‘pointer’}}><Logo light size="sm" /></button>
<span style={{fontSize:11,color:‘rgba(255,255,255,0.2)’,fontFamily:‘JetBrains Mono’}}>Updated {article.date}</span>
<span style={{fontSize:11,color:‘rgba(255,255,255,0.16)’,maxWidth:280,lineHeight:1.6}}>For guidance only. Always consult HMRC or a qualified adviser.</span>
</div>
</footer>
</main>
);
}

// ── APP ROOT ──────────────────────────────────────────────────────────────────
export default function AppRoot({ defaultPage = ‘home’ }) {
const [page, setPage] = useState(defaultPage);

function nav(p) {
// Articles navigate to real blog URLs
if (p.startsWith(‘article-’)) {
const slug = p.replace(‘article-’, ‘’);
if (typeof window !== ‘undefined’) window.location.href = ‘/blog/’ + slug;
return;
}
setPage(p);
const route = ROUTE_MAP[p] || ‘/’;
if (typeof window !== ‘undefined’) {
window.history.pushState({}, ‘’, route);
window.scrollTo({ top: 0, behavior: ‘smooth’ });
}
}

return (
<>
<style>{STYLE}</style>
<NavBar page={page} nav={nav} />
{page === ‘home’       && <HomePage       nav={nav} />}
{page === ‘contractor’ && <ContractorPage nav={nav} />}
{page === ‘nhs’        && <NHSPage        nav={nav} />}
{page === ‘maternity’  && <MaternityPage  nav={nav} />}
{page === ‘hourly’     && <HourlyPage     nav={nav} />}
{page === ‘bonus’      && <BonusPage      nav={nav} />}
{page === ‘sacrifice’  && <SacrificePage  nav={nav} />}
{page === ‘comparison’ && <ComparisonPage nav={nav} />}
{page === ‘tools’      && <ToolsPage      nav={nav} />}
{page === ‘blog’       && <BlogPage       nav={nav} />}
</>
);
}
