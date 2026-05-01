import fs from 'fs';
import path from 'path';
import { BLOG_POSTS } from './lib/blog-data.js';

const base = 'https://taxdcal.co.uk';
const appDir = path.join(process.cwd(), 'app');

// Priority + changeFrequency for known routes.
// New static pages discovered via filesystem scan use defaultConfig unless listed here.
const routeConfig = {
  '/':                                { priority: 1.0,  freq: 'monthly' },
  '/ir35':                            { priority: 0.9,  freq: 'monthly' },
  '/nhs':                             { priority: 0.9,  freq: 'monthly' },
  '/maternity':                       { priority: 0.8,  freq: 'monthly' },
  '/hourly':                          { priority: 0.8,  freq: 'monthly' },
  '/bonus':                           { priority: 0.8,  freq: 'monthly' },
  '/sacrifice':                       { priority: 0.8,  freq: 'monthly' },
  '/comparison':                      { priority: 0.7,  freq: 'monthly' },
  '/tools':                           { priority: 0.7,  freq: 'monthly' },
  '/part-time-salary-calculator':     { priority: 0.8,  freq: 'monthly' },
  '/maternity-pay-self-employed':     { priority: 0.8,  freq: 'yearly'  },
  '/embed':                           { priority: 0.4,  freq: 'yearly'  },
  '/nhs-pay-guide':                   { priority: 0.85, freq: 'yearly'  },
  '/teacher-pay-guide':               { priority: 0.85, freq: 'yearly'  },
  '/public-sector-pay':               { priority: 0.85, freq: 'yearly'  },
  '/public-sector-pay/civil-service':    { priority: 0.80, freq: 'yearly'  },
  '/public-sector-pay/armed-forces':    { priority: 0.80, freq: 'yearly'  },
  '/public-sector-pay/police':          { priority: 0.80, freq: 'yearly'  },
  '/public-sector-pay/firefighters':    { priority: 0.80, freq: 'yearly'  },
  '/public-sector-pay/council-workers': { priority: 0.80, freq: 'yearly'  },
  '/blog':                              { priority: 0.8,  freq: 'weekly'  },
  // NHS Band pages (new -take-home-pay URLs)
  '/nhs-band-5-take-home-pay':          { priority: 0.88, freq: 'yearly'  },
  '/nhs-band-6-take-home-pay':          { priority: 0.88, freq: 'yearly'  },
  '/nhs-band-7-take-home-pay':          { priority: 0.88, freq: 'yearly'  },
  '/nhs-band-2-take-home-pay':          { priority: 0.82, freq: 'yearly'  },
  '/nhs-band-3-take-home-pay':          { priority: 0.82, freq: 'yearly'  },
  '/nhs-band-4-take-home-pay':          { priority: 0.82, freq: 'yearly'  },
  '/nhs-band-8a-take-home-pay':         { priority: 0.82, freq: 'yearly'  },
  '/nhs-band-8b-take-home-pay':         { priority: 0.82, freq: 'yearly'  },
  // IR35 Day Rate pages
  '/300-day-rate-take-home':            { priority: 0.85, freq: 'yearly'  },
  '/350-day-rate-take-home':            { priority: 0.85, freq: 'yearly'  },
  '/400-day-rate-take-home':            { priority: 0.85, freq: 'yearly'  },
  '/450-day-rate-take-home':            { priority: 0.85, freq: 'yearly'  },
  '/500-day-rate-take-home':            { priority: 0.85, freq: 'yearly'  },
  '/550-day-rate-take-home':            { priority: 0.85, freq: 'yearly'  },
  '/600-day-rate-take-home':            { priority: 0.85, freq: 'yearly'  },
  '/650-day-rate-take-home':            { priority: 0.85, freq: 'yearly'  },
  '/700-day-rate-take-home':            { priority: 0.85, freq: 'yearly'  },
  '/750-day-rate-take-home':            { priority: 0.85, freq: 'yearly'  },
  '/800-day-rate-take-home':            { priority: 0.85, freq: 'yearly'  },
  '/1000-day-rate-take-home':           { priority: 0.85, freq: 'yearly'  },
  // Teacher Pay Scale pages
  '/m1-teacher-salary-take-home':       { priority: 0.82, freq: 'yearly'  },
  '/m2-teacher-salary-take-home':       { priority: 0.82, freq: 'yearly'  },
  '/m3-teacher-salary-take-home':       { priority: 0.82, freq: 'yearly'  },
  '/m4-teacher-salary-take-home':       { priority: 0.82, freq: 'yearly'  },
  '/m5-teacher-salary-take-home':       { priority: 0.82, freq: 'yearly'  },
  '/m6-teacher-salary-take-home':       { priority: 0.82, freq: 'yearly'  },
  '/ups1-teacher-salary-take-home':     { priority: 0.82, freq: 'yearly'  },
  '/ups2-teacher-salary-take-home':     { priority: 0.82, freq: 'yearly'  },
  '/ups3-teacher-salary-take-home':     { priority: 0.82, freq: 'yearly'  },
};

const defaultConfig = { priority: 0.7, freq: 'monthly' };

function getMtime(filePath) {
  try {
    return fs.statSync(filePath).mtime;
  } catch {
    return new Date('2026-04-18');
  }
}

// Recursively find all page.jsx / page.js files, skipping dynamic [param] dirs,
// api, and lib. Each page file maps to a URL route derived from its directory path.
function scanStaticRoutes(dir, prefix = '') {
  const routes = [];
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return routes;
  }
  for (const entry of entries) {
    if (entry.name.startsWith('.') || entry.name.startsWith('_')) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name.startsWith('[') || entry.name === 'api' || entry.name === 'lib') continue;
      routes.push(...scanStaticRoutes(fullPath, `${prefix}/${entry.name}`));
    } else if (entry.name === 'page.jsx' || entry.name === 'page.js') {
      routes.push({ route: prefix || '/', filePath: fullPath });
    }
  }
  return routes;
}

// Salary slugs served by the [salary] dynamic route.
// Add a new entry here when you create a new salary landing page.
const salaryRoutes = [
  ...[
    18000, 19000, 20000, 21000, 22000, 23000, 24000, 25000, 26000, 27000,
    28000, 29000, 30000, 31000, 32000, 33000, 34000, 35000, 36000, 37000,
    38000, 39000, 40000, 41000, 42000, 43000, 44000, 45000, 46000, 47000,
    48000, 49000, 50000, 52000, 55000, 58000, 60000, 65000, 70000, 75000,
    80000, 85000, 90000, 95000, 100000, 110000, 120000, 125000, 130000, 140000, 150000,
  ].map(s => ({ slug: `/${s}-salary-take-home`, priority: 0.85 })),
  { slug: '/minimum-wage-take-home',    priority: 0.85 },
  { slug: '/nhs-band-5-take-home',      priority: 0.85 },
  { slug: '/nhs-band-6-take-home',      priority: 0.85 },
  { slug: '/nhs-band-7-take-home',      priority: 0.80 },
  { slug: '/teacher-salary-take-home',  priority: 0.80 },
  { slug: '/graduate-salary-take-home', priority: 0.80 },
  { slug: '/nhs-band-2-take-home',      priority: 0.80 },
  { slug: '/nhs-band-3-take-home',      priority: 0.80 },
  { slug: '/nhs-band-4-take-home',      priority: 0.80 },
  { slug: '/nhs-band-8a-take-home',     priority: 0.80 },
  { slug: '/nhs-band-8b-take-home',     priority: 0.80 },
  { slug: '/200-day-rate-take-home',    priority: 0.80 },
  { slug: '/250-day-rate-take-home',    priority: 0.80 },
];

export default function sitemap() {
  const salaryMtime = getMtime(path.join(appDir, '[salary]', 'page.jsx'));

  // Static pages: auto-discovered from the filesystem.
  // lastModified reflects the actual file mtime, so it updates whenever the file changes.
  const staticEntries = scanStaticRoutes(appDir).map(({ route, filePath }) => {
    const cfg = routeConfig[route] || defaultConfig;
    return {
      url: base + route,
      lastModified: getMtime(filePath),
      changeFrequency: cfg.freq,
      priority: cfg.priority,
    };
  });

  // Blog posts: sourced from blog-data.js.
  // To add a post: add one entry to blog-data.js and the article content to blog/[slug]/page.jsx.
  const blogEntries = BLOG_POSTS.map(({ slug, date, priority }) => ({
    url: `${base}/blog/${slug}`,
    lastModified: new Date(date),
    changeFrequency: 'yearly',
    priority,
  }));

  // Salary pages: served by the [salary] dynamic route.
  // lastModified tracks the salary page template file's mtime.
  const salaryEntries = salaryRoutes.map(({ slug, priority }) => ({
    url: base + slug,
    lastModified: salaryMtime,
    changeFrequency: 'yearly',
    priority,
  }));

  return [...staticEntries, ...blogEntries, ...salaryEntries];
}
