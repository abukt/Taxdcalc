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
  personalAllowance: 12570,
  basicRateLimit: 50270,
  higherRateLimit: 125140,
  niPrimaryThreshold: 12570,
  niUpperEarningsLimit: 50270,
  studentLoan: {
    plan1: { threshold: 24990, rate: 0.09 },
    plan2: { threshold: 27295, rate: 0.09 },
    plan4: { threshold: 31395, rate: 0.09 },
    plan5: { threshold: 25000, rate: 0.09 },
    none: null,
  },
};

function calcIncomeTax(gross, pension) {
  const ti = Math.max(0, gross - pension);
  let allow = TAX.personalAllowance;
  if (ti > 100000) allow = Math.max(0, TAX.personalAllowance - (ti - 100000) / 2);
  const taxable = Math.max(0, ti - allow);
  const b1 = TAX.basicRateLimit - TAX.personalAllowance;
  const b2 = TAX.higherRateLimit - TAX.personalAllowance;
  if (taxable <= b1) return taxable * 0.2;
  if (taxable <= b2) return b1 * 0.2 + (taxable - b1) * 0.4;
  return b1 * 0.2 + (b2 - b1) * 0.4 + (taxable - b2) * 0.45;
}

function calcNI(gross) {
  if (gross <= TAX.niPrimaryThreshold) return 0;
  if (gross <= TAX.niUpperEarningsLimit) return (gross - TAX.niPrimaryThreshold) * 0.08;
  return (
    (TAX.niUpperEarningsLimit - TAX.niPrimaryThreshold) * 0.08 +
    (gross - TAX.niUpperEarningsLimit) * 0.02
  );
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
    gross,
    incomeTax,
    ni,
    studentLoan,
    pension,
    totalDeductions,
    takeHome,
    monthly: { gross: gross / 12, takeHome: takeHome / 12 },
    weekly: { gross: gross / 52, takeHome: takeHome / 52 },
    daily: { gross: gross / 260, takeHome: takeHome / 260 },
    effectiveRate: gross > 0 ? ((incomeTax + ni) / gross) * 100 : 0,
  };
}

const fmt = (n) => "£" + Math.abs(n).toLocaleString("en-GB", { maximumFractionDigits: 0 });
const fmtD = (n) =>
  "£" + n.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Additional components and logic...
export default function App() {
  const [page, setPage] = useState("home");
  return (
    <>
      <NavBar page={page} setPage={setPage} />
      {page === "home" && <HomePage />}
      {page === "contractor" && <ContractorPage />}
      {page === "tools" && <AllToolsPage />}
    </>
  );
}