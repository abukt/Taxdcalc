// ============================================================
// taxdcal.co.uk — Tax Trap Logic Engine
// app/lib/taxTrapEngine.js
//
// Three engines:
//   1. 60% Effective Tax Trap  (£100k–£125,140)
//   2. Plan 5 Student Loan     (£25,000 threshold)
//   3. HICBC Taper             (£60k–£80k)
//
// Each engine returns a TrapResult:
// {
//   active: boolean,
//   severity: 'critical' | 'warning' | 'info',
//   headline: string,        // bold above-fold text
//   detail: string,          // 1-sentence explanation
//   saving: number,          // £ you could save by acting
//   action: string,          // the concrete thing to do
//   actionUrl: string,       // internal link
//   range: [number, number]  // income range where trap applies
// }
// ============================================================

// ── CONSTANTS 2026-27 ────────────────────────────────────────────────────────
const TAX = {
  PA_STANDARD: 12570,
  BASIC_LIMIT: 50270,
  HIGHER_LIMIT: 125140,
  BASIC_RATE: 0.20,
  HIGHER_RATE: 0.40,
  ADDITIONAL_RATE: 0.45,
  NI_PT: 12570,
  NI_UEL: 50270,
  NI_MAIN: 0.08,
  NI_UPPER: 0.02,
  TRAP_START: 100000,
  TRAP_END: 125140,
  PLAN5_THRESHOLD: 25000,
  PLAN5_RATE: 0.09,
  HICBC_START: 60000,
  HICBC_END: 80000,
  HICBC_FULL_CHARGE: 2212.60, // Full CB for 1 child 2026-27
};

// ── CORE TAX CALC ────────────────────────────────────────────────────────────
function calcTaxFull(gross, pensionSacrifice = 0) {
  const ti = Math.max(0, gross - pensionSacrifice);
  let pa = TAX.PA_STANDARD;
  if (ti > TAX.TRAP_START) {
    pa = Math.max(0, TAX.PA_STANDARD - Math.floor((ti - TAX.TRAP_START) / 2));
  }
  const taxable = Math.max(0, ti - pa);
  const b1 = Math.min(taxable, TAX.BASIC_LIMIT - TAX.PA_STANDARD);
  const b2 = Math.min(Math.max(0, taxable - b1), TAX.HIGHER_LIMIT - TAX.BASIC_LIMIT);
  const b3 = Math.max(0, taxable - b1 - b2);
  return b1 * TAX.BASIC_RATE + b2 * TAX.HIGHER_RATE + b3 * TAX.ADDITIONAL_RATE;
}

function calcNI(gross) {
  if (gross <= TAX.NI_PT) return 0;
  const main = Math.min(gross, TAX.NI_UEL) - TAX.NI_PT;
  const upper = Math.max(0, gross - TAX.NI_UEL);
  return main * TAX.NI_MAIN + upper * TAX.NI_UPPER;
}

function takeHome(gross, pension = 0, plan5 = false, children = 0) {
  const it = calcTaxFull(gross, pension);
  const ni = calcNI(gross);
  const sl = plan5 && gross > TAX.PLAN5_THRESHOLD
    ? (gross - TAX.PLAN5_THRESHOLD) * TAX.PLAN5_RATE
    : 0;
  const hicbc = calcHICBC(gross, children);
  return gross - it - ni - sl - pension - hicbc;
}

// ── 1. SIXTY PERCENT TRAP ENGINE ─────────────────────────────────────────────
export function sixtyPercentTrap(gross) {
  const active = gross > TAX.TRAP_START && gross <= TAX.TRAP_END;
  const approaching = gross > 95000 && gross <= TAX.TRAP_START;

  if (!active && !approaching) return { active: false };

  // Calculate effective marginal rate in the trap zone
  const th1 = takeHome(TAX.TRAP_START, 0, false, 0);
  const th2 = takeHome(Math.min(gross, TAX.TRAP_END), 0, false, 0);
  const additionalGross = Math.min(gross, TAX.TRAP_END) - TAX.TRAP_START;
  const effectiveMarginalRate = additionalGross > 0
    ? Math.round((1 - (th2 - th1) / additionalGross) * 100)
    : 60;

  // Pension needed to escape trap
  const amountInTrap = Math.max(0, gross - TAX.TRAP_START);
  const pensionToEscape = amountInTrap; // sacrifice this much to get back to £100k

  // Tax saving from sacrificing into pension
  const withoutSacrifice = takeHome(gross, 0);
  const withSacrifice = takeHome(gross, pensionToEscape);
  const pensionPotValue = pensionToEscape; // goes into pension, not lost
  // Net benefit = pension pot gained + tax saved on trap portion
  const taxSaved = calcTaxFull(gross) - calcTaxFull(gross, pensionToEscape);
  const niSaved = calcNI(gross) - calcNI(Math.max(0, gross - pensionToEscape));

  if (approaching) {
    return {
      active: false,
      approaching: true,
      severity: 'warning',
      headline: `Warning: You are £${(TAX.TRAP_START - gross).toLocaleString('en-GB')} away from the 60% tax trap`,
      detail: `At £100,000 your Personal Allowance starts being withdrawn — creating a 60% effective marginal rate on earnings between £100,000 and £125,140.`,
      saving: 0,
      action: 'Consider a salary sacrifice pension contribution now to build buffer below £100,000.',
      actionUrl: '/sacrifice',
      range: [TAX.TRAP_START, TAX.TRAP_END],
    };
  }

  return {
    active: true,
    severity: 'critical',
    headline: `You are in the 60% tax trap — your effective marginal rate is ${effectiveMarginalRate}%`,
    detail: `Between £100,000 and £125,140, your Personal Allowance is withdrawn at 50p per £1 earned. Combined with the 40% higher rate, you keep only ${100 - effectiveMarginalRate}p of every additional pound.`,
    saving: Math.round(taxSaved + niSaved),
    pensionToEscape: Math.round(pensionToEscape),
    action: `Sacrifice £${Math.round(pensionToEscape).toLocaleString('en-GB')} into your pension to escape the trap — saving £${Math.round(taxSaved + niSaved).toLocaleString('en-GB')} in tax and NI while putting the full amount into your pension.`,
    actionUrl: '/sacrifice',
    range: [TAX.TRAP_START, TAX.TRAP_END],
    breakdown: {
      grossInTrap: Math.min(gross, TAX.TRAP_END) - TAX.TRAP_START,
      effectiveMarginalRate,
      taxSaved: Math.round(taxSaved),
      niSaved: Math.round(niSaved),
      pensionReceives: Math.round(pensionToEscape),
    },
  };
}

// ── 2. PLAN 5 STUDENT LOAN ENGINE ────────────────────────────────────────────
export function plan5Engine(gross, plan) {
  if (plan !== 'plan5') return { active: false };

  const active = gross > TAX.PLAN5_THRESHOLD;
  if (!active) return { active: false };

  const annualRepayment = (gross - TAX.PLAN5_THRESHOLD) * TAX.PLAN5_RATE;
  const monthlyRepayment = annualRepayment / 12;

  // Comparison to Plan 2
  const plan2Threshold = 27295;
  const plan2Repayment = gross > plan2Threshold
    ? (gross - plan2Threshold) * 0.09
    : 0;
  const plan5ExtraCost = annualRepayment - plan2Repayment;

  // Comparison to Plan 1
  const plan1Threshold = 24990;
  const plan1Repayment = gross > plan1Threshold
    ? (gross - plan1Threshold) * 0.09
    : 0;

  // At what salary does Plan 5 start costing more?
  // Always above 25k for Plan 5, but the threshold being lower matters

  const yearsToWriteOff = 40; // Plan 5 write-off period
  const projectedLifetimeRepayment = annualRepayment * Math.min(yearsToWriteOff, 30); // simplified

  return {
    active: true,
    severity: gross < 30000 ? 'critical' : 'warning',
    headline: `Plan 5: You repay £${Math.round(monthlyRepayment).toLocaleString('en-GB')}/month — £${Math.round(plan5ExtraCost).toLocaleString('en-GB')}/year more than Plan 2`,
    detail: `Plan 5 has the lowest threshold (£25,000) of any UK student loan plan. Nearly every full-time worker repays. The write-off period is 40 years — 10 years longer than Plan 2.`,
    saving: 0,
    action: 'Unlike Plan 2, overpaying a Plan 5 loan may be beneficial for high earners given the 40-year write-off period. Check if voluntary overpayments save total cost.',
    actionUrl: '/blog/plan-5-student-loan-take-home',
    range: [TAX.PLAN5_THRESHOLD, Infinity],
    breakdown: {
      threshold: TAX.PLAN5_THRESHOLD,
      annualRepayment: Math.round(annualRepayment),
      monthlyRepayment: Math.round(monthlyRepayment),
      extraVsPlan2: Math.round(plan5ExtraCost),
      writeOffYears: yearsToWriteOff,
    },
  };
}

// ── 3. HICBC (HIGH INCOME CHILD BENEFIT CHARGE) ENGINE ──────────────────────
function calcHICBC(gross, numChildren) {
  if (numChildren === 0 || gross <= TAX.HICBC_START) return 0;

  // Child Benefit rates 2026-27 (per year)
  const cbRates = [
    0,          // 0 children
    1331.60,    // 1 child (eldest: £25.60/wk)
    2212.60,    // 2 children (+£16.95/wk for second)
    3093.60,    // 3 children
    3974.60,    // 4 children
  ];
  const cb = cbRates[Math.min(numChildren, 4)] || numChildren * 881;

  if (gross >= TAX.HICBC_END) return cb; // full charge = no benefit
  const taper = (gross - TAX.HICBC_START) / (TAX.HICBC_END - TAX.HICBC_START);
  return Math.min(cb, cb * taper);
}

export function hicbcEngine(gross, numChildren = 0) {
  if (numChildren === 0) return { active: false };
  const active = gross > TAX.HICBC_START;
  if (!active) return { active: false };

  const approaching = gross > 55000 && gross <= TAX.HICBC_START;

  const cbRates = [0, 1331.60, 2212.60, 3093.60, 3974.60];
  const fullCB = cbRates[Math.min(numChildren, 4)] || numChildren * 881;
  const charge = calcHICBC(gross, numChildren);
  const netBenefit = fullCB - charge;

  // Effective marginal rate in HICBC zone
  const effectiveMarginalRate = gross < TAX.HICBC_END
    ? Math.round(40 + (fullCB / (TAX.HICBC_END - TAX.HICBC_START)) * 100)
    : 40;

  // Pension to escape (bring income below £60k)
  const toEscape = Math.max(0, gross - TAX.HICBC_START);
  const taxSavedByEscaping = charge; // get full CB back
  const niSaved = calcNI(gross) - calcNI(Math.max(0, gross - toEscape));
  const incomeTaxSaved = calcTaxFull(gross) - calcTaxFull(gross, toEscape);

  if (approaching) {
    return {
      active: false,
      approaching: true,
      severity: 'warning',
      headline: `Warning: Child Benefit taper starts at £60,000 — you're £${(TAX.HICBC_START - gross).toLocaleString('en-GB')} away`,
      detail: `Above £60,000, 1% of your Child Benefit is clawed back for every £200 earned. At £80,000 all Child Benefit is lost. With ${numChildren} child${numChildren > 1 ? 'ren' : ''} that's up to £${Math.round(fullCB).toLocaleString('en-GB')}/year at risk.`,
      saving: 0,
      action: 'Salary sacrifice pension contributions below £60,000 preserve full Child Benefit.',
      actionUrl: '/sacrifice',
      range: [TAX.HICBC_START, TAX.HICBC_END],
    };
  }

  return {
    active: true,
    severity: gross > 75000 ? 'critical' : 'warning',
    headline: `Child Benefit taper: you're losing £${Math.round(charge).toLocaleString('en-GB')}/year — your effective marginal rate is ~${effectiveMarginalRate}%`,
    detail: `With ${numChildren} child${numChildren > 1 ? 'ren' : ''}, you receive £${Math.round(fullCB).toLocaleString('en-GB')}/year in Child Benefit but the HICBC claws back £${Math.round(charge).toLocaleString('en-GB')}. Net benefit: £${Math.round(netBenefit).toLocaleString('en-GB')}/year.`,
    saving: Math.round(taxSavedByEscaping + incomeTaxSaved + niSaved),
    pensionToEscape: Math.round(toEscape),
    action: `Sacrifice £${Math.round(toEscape).toLocaleString('en-GB')} into your pension to bring income below £60,000 — recovering £${Math.round(charge).toLocaleString('en-GB')}/year in Child Benefit and saving additional income tax and NI.`,
    actionUrl: '/sacrifice',
    range: [TAX.HICBC_START, TAX.HICBC_END],
    breakdown: {
      fullChildBenefit: Math.round(fullCB),
      chargeAmount: Math.round(charge),
      netBenefit: Math.round(netBenefit),
      effectiveMarginalRate,
      numChildren,
    },
  };
}

// ── COMPOSITE: RUN ALL TRAPS ─────────────────────────────────────────────────
export function detectAllTraps(gross, options = {}) {
  const { plan = 'none', numChildren = 0, pensionPct = 0 } = options;
  const pension = gross * (pensionPct / 100);

  const traps = [
    sixtyPercentTrap(gross - pension),
    plan5Engine(gross, plan),
    hicbcEngine(gross - pension, numChildren),
  ].filter(t => t.active || t.approaching);

  // Sort by severity
  const order = { critical: 0, warning: 1, info: 2 };
  traps.sort((a, b) => order[a.severity] - order[b.severity]);

  return {
    traps,
    hasActive: traps.some(t => t.active),
    hasCritical: traps.some(t => t.severity === 'critical'),
    totalSaving: traps.reduce((sum, t) => sum + (t.saving || 0), 0),
  };
}

// ── INTENT ROUTING: BLOG vs TOOL DECISION LOGIC ──────────────────────────────
// Used to determine which page type should be canonical for a given query
export function intentRouter(queryType, gross) {
  // Scenario A: Blog-First Trap — blog ranks but tool should be primary
  // Scenario B: Tool-First Win — tool already ranking
  // Scenario C: Zero Visibility — niche down

  const SCENARIOS = {
    // Direct salary queries → always tool
    NUMERIC_SALARY: { type: 'tool', canonical: `/${gross}-salary-take-home`, blogsupport: true },
    // Complex tax topics → blog primary with embedded tool
    TAX_TRAP: { type: 'hybrid', canonical: `/blog/60-percent-tax-trap`, tool: '/sacrifice', blogsupport: false },
    PLAN5: { type: 'hybrid', canonical: `/blog/plan-5-student-loan-take-home`, tool: '/', blogsupport: false },
    // NHS/Teaching with specialism → niche tool
    NHS_BAND: { type: 'niche-tool', canonical: '/nhs', blogsupport: true },
    TEACHER: { type: 'niche-tool', canonical: '/teacher-salary', blogsupport: true },
    // Legislative/research → blog only
    LEGISLATIVE: { type: 'blog', canonical: '/blog/2026-27-tax-year-changes-uk', blogsupport: false },
  };

  if (queryType === 'numeric') return SCENARIOS.NUMERIC_SALARY;
  if (queryType === 'trap') return SCENARIOS.TAX_TRAP;
  if (queryType === 'plan5') return SCENARIOS.PLAN5;
  if (queryType === 'nhs') return SCENARIOS.NHS_BAND;
  if (queryType === 'teacher') return SCENARIOS.TEACHER;
  return SCENARIOS.LEGISLATIVE;
}

export default {
  sixtyPercentTrap,
  plan5Engine,
  hicbcEngine,
  detectAllTraps,
  intentRouter,
  TAX,
};
