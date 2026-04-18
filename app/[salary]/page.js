// app/[salary]/page.js
import SalaryClient from './SalaryClient';

export async function generateMetadata({ params }) {
  const { salary } = await params;
  
  // Clean the slug (e.g., "45000-salary-take-home" -> "45,000")
  const num = salary.match(/\d+/);
  const label = num 
    ? new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(num[0])
    : "UK";

  return {
    title: `${label} Salary After Tax 2026/27 | Take Home Pay Calculator`,
    description: `Calculate take home pay for a ${label} annual salary in the 2026-27 tax year. Includes Income Tax, NI, and pension deductions.`,
  };
}

export default function Page() {
  return <SalaryClient />;
}
