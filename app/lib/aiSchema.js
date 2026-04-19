// app/lib/aiSchema.js
// ─────────────────────────────────────────────────────────────────────────────
// Schema generators for AI-ready structured data
// Key principle: NEVER use @graph to bundle FAQPage with other types.
// Each schema type must be a separate <script> tag with its own @context.
// This prevents the duplicate FAQPage error in Google Search Console.
// ─────────────────────────────────────────────────────────────────────────────

const BASE_URL = 'https://taxdcal.co.uk';
const ORG = { '@type': 'Organization', name: 'TaxdCalc', url: BASE_URL };

// ── 1. FAQPage — standalone, never inside @graph ─────────────────────────────
export function faqSchema(questions) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}

// ── 2. WebApplication — for calculator pages ─────────────────────────────────
export function calcSchema({ slug, name, description }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': `${BASE_URL}/${slug}#calculator`,
    name,
    description,
    applicationCategory: 'FinanceApplication',
    applicationSubCategory: 'Tax Calculator',
    operatingSystem: 'Any',
    inLanguage: 'en-GB',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
    provider: ORG,
    url: `${BASE_URL}/${slug}`,
    featureList: ['UK Income Tax 2026-27', 'National Insurance', 'Scotland Rates', 'Student Loan Plans 1-5', 'Salary Sacrifice', 'Tax Trap Alerts'],
  };
}

// ── 3. BreadcrumbList ─────────────────────────────────────────────────────────
export function breadcrumbSchema(crumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map(({ name, url }, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      item: url,
    })),
  };
}

// ── 4. Article — for guide pages (standalone, never with FAQPage in @graph) ──
export function articleSchema({ slug, headline, description, datePublished, dateModified }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${BASE_URL}/${slug}#article`,
    headline,
    description,
    datePublished: datePublished || '2026-04-18',
    dateModified: dateModified || '2026-04-18',
    inLanguage: 'en-GB',
    author: ORG,
    publisher: ORG,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE_URL}/${slug}` },
  };
}

// ── 5. Speakable — marks sections for AI / voice search ──────────────────────
export function speakableSchema({ url, selectors }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': url,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: selectors || ['.ai-answer', 'h1', '.quick-answer'],
    },
  };
}

// ── 6. HowTo — for process-based content (salary sacrifice, IR35, etc) ────────
export function howToSchema({ name, description, steps, totalTime }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    totalTime: totalTime || 'PT5M',
    step: steps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: step.name,
      text: step.text,
    })),
  };
}

// ── 7. Salary page FAQ generator ─────────────────────────────────────────────
export function salaryFAQ(salary, th, mo, ni, it, plan5Monthly) {
  const fmt = n => '\u00A3' + Math.round(n).toLocaleString('en-GB');
  const fmtD = n => '\u00A3' + n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return faqSchema([
    {
      q: `What is the take-home pay on ${fmt(salary)} in the UK?`,
      a: `On a ${fmt(salary)} salary with 5% pension and no student loan, take-home pay is ${fmt(th)} per year (${fmtD(mo)} per month) in 2026-27 after income tax and National Insurance.`,
    },
    {
      q: `How much income tax do you pay on ${fmt(salary)}?`,
      a: `On ${fmt(salary)} in 2026-27 you pay ${fmt(it)} in income tax. Your effective income tax rate is ${((it / salary) * 100).toFixed(1)}%. ${salary <= 50270 ? 'You are within the 20% basic rate band.' : 'You pay 20% on the first portion and 40% on earnings above £50,270.'}`,
    },
    {
      q: `How much National Insurance on ${fmt(salary)}?`,
      a: `On ${fmt(salary)} you pay ${fmt(ni)} in National Insurance in 2026-27 — charged at 8% on earnings between £12,570 and £50,270, and 2% above.`,
    },
    {
      q: `What is the monthly take-home pay on ${fmt(salary)}?`,
      a: `On ${fmt(salary)} per year, monthly take-home is ${fmtD(mo)} in 2026-27 with 5% pension and no student loan, after ${fmtD(it / 12)} income tax and ${fmtD(ni / 12)} National Insurance per month.`,
    },
    {
      q: `How can I increase take-home pay on ${fmt(salary)}?`,
      a: `The most effective strategy is salary sacrifice pension contributions. Each £1 sacrificed saves both income tax (20${salary > 50270 ? ' or 40' : ''}%) and National Insurance (8%). A 1% increase in pension contribution reduces take-home by approximately £${Math.round(salary * 0.01 * (salary > 50270 ? 0.52 : 0.72))} per year while adding £${Math.round(salary * 0.01)} to your pension pot.`,
    },
  ]);
}

// ── Helper: render multiple schema scripts ────────────────────────────────────
// Usage in JSX: <SchemaScripts schemas={[schemaFAQ, schemaBreadcrumb, schemaCalc]} />
export function renderSchemaScripts(schemas) {
  // Returns array of script tag objects for use with dangerouslySetInnerHTML
  return schemas.map((schema, i) => ({
    key: `schema-${i}`,
    json: JSON.stringify(schema),
  }));
}

export default {
  faqSchema, calcSchema, breadcrumbSchema, articleSchema, speakableSchema, howToSchema, salaryFAQ,
};
