/**
 * Maps content to the use-case and solution pages it belongs with.
 *
 * Blog posts, podcast episodes, and customer stories are written about
 * topics, not products. This module reads the words in a title, a tag, a
 * description, or a body and returns the pages that answer the same
 * question, so an article about career readiness links to /career-outcomes/
 * and an article about early alerts links to /advising-and-student-success/.
 *
 * Every rule is a regular expression over plain words. Add a rule when a
 * page is added. Keep the list short: a rule that matches everything links
 * nothing useful.
 */
import solutions from '../data/solutions.json';

export interface PageRef {
  slug: string;
  eyebrow: string;
  headline: string;
}

interface Rule {
  slug: string;
  re: RegExp;
}

const rules: Rule[] = [
  { slug: 'career-outcomes', re: /\b(career\w*|earnings|employ\w*|workforce|accountab\w*|gainful|internship\w*)\b/gi },
  { slug: 'improve-on-time-completion', re: /\b(completion|graduat\w*|time to degree|degree plan\w*|bottleneck\w*|on-time)\b/gi },
  { slug: 'enrollment-management', re: /\b(enrollment|enroll\w*|registration|register\w*|yield|melt|course demand|schedul\w*)\b/gi },
  { slug: 'advising-and-student-success', re: /\b(advis\w*|retention|persistence|persist\w*|early alert\w*|caseload\w*|at-risk)\b/gi },
  { slug: 'coordinate-student-care', re: /\b(student care|coordinat\w*|case management|belonging|cross-functional|network of care)\b/gi },
  { slug: 'academic-leaders-and-faculty', re: /\b(faculty|academic leader\w*|dean\w*|department chair\w*|engagement|course-level|DFW)\b/gi },
  { slug: 'institutional-research-effectiveness', re: /\b(institutional research|institutional effectiveness|strategic planning|accredit\w*|IPEDS|board)\b/gi },
  { slug: 'ensure-initiative-efficacy-and-roi', re: /\b(ROI|efficacy|initiative (analysis|effectiveness|impact)|budget\w*|financial sustainability|return on investment|what works)\b/gi },
  { slug: 'institutional-technology', re: /\b(technology|integration\w*|tech stack|procurement|implementation|AI readiness|change management)\b/gi },
  { slug: 'curate-student-data', re: /\b(data quality|disconnected|student data|data governance|data silo\w*|single source)\b/gi },
  { slug: 'analytics', re: /\b(analytics|predictive|prediction\w*)\b/gi },
  { slug: 'ai-solutions', re: /\b(AI|artificial intelligence|agent\w*)\b/g },
  { slug: 'platform', re: /\b(student (success|impact) platform|student success software)\b/gi },
];

// Pages that are not in solutions.json but are still valid targets.
const extra: PageRef[] = [
  { slug: 'ai-solutions', eyebrow: 'Civitas Learning AI', headline: 'Agents and models built on your data.' },
];

const refs: Record<string, PageRef> = {};
for (const p of solutions as { slug: string; eyebrow: string; headline: string }[]) refs[p.slug] = { slug: p.slug, eyebrow: p.eyebrow, headline: p.headline };
for (const p of extra) refs[p.slug] = p;

export interface Weighted {
  text: string;
  weight: number;
}

function count(re: RegExp, text: string): number {
  re.lastIndex = 0;
  const m = text.match(re);
  return m ? m.length : 0;
}

/**
 * Score every page against the weighted texts and return the best matches.
 * A tag or a title should carry more weight than a body; the body only breaks ties.
 */
export function matchPages(texts: Weighted[], max = 2): PageRef[] {
  const scores = new Map<string, number>();
  for (const r of rules) {
    let s = 0;
    for (const t of texts) {
      if (!t.text) continue;
      s += Math.min(count(r.re, t.text), 12) * t.weight;
    }
    if (s > 0) scores.set(r.slug, (scores.get(r.slug) || 0) + s);
  }
  return [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([slug]) => refs[slug])
    .filter(Boolean)
    .slice(0, max);
}

/** The one page a short label (a tag, a solution name) points at, or null. */
export function pageForLabel(label: string): PageRef | null {
  const hit = matchPages([{ text: label, weight: 1 }], 1);
  return hit[0] || null;
}
