/**
 * Structured data (schema.org JSON-LD).
 *
 * Answer engines and search engines read this to learn what an entity is, what
 * a page answers, and who says it. Every helper returns a plain object; the
 * layout serializes it. Keep the claims here identical to the claims in the
 * visible copy — marking up something the reader cannot see is a violation of
 * the search guidelines and is also how a page loses its rich result.
 */

export const SITE = 'https://www.civitaslearning.com';
export const ORG_ID = `${SITE}/#organization`;

/** Text for a schema field: strip the inline markup we allow in answers. */
export function plain(html: string): string {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** The company. Referenced by every other node, so it is defined once. */
export function organization() {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: 'Civitas Learning',
    alternateName: 'Civitas Learning, Inc.',
    url: `${SITE}/`,
    description:
      'Civitas Learning connects the systems a college or university already runs into one model of the institution, trains institution-specific predictive models on it, and measures the impact of every student success initiative against a matched comparison group. The platform includes an advising CRM with case management, degree planning, registration, class scheduling, and a student mobile app, so it can serve as the advising system of record or work alongside the CRM an institution already has.',
    foundingDate: '2011',
    slogan: 'Every vendor sells AI. We prove what works.',
    knowsAbout: [
      'student success',
      'student retention',
      'student persistence prediction',
      'graduation and completion prediction',
      'student engagement measurement',
      'student thriving',
      'academic performance prediction',
      'graduate career outcomes and earnings',
      'institutional effectiveness',
      'higher education analytics',
      'predictive modeling in higher education',
      'academic advising',
      'strategic enrollment management',
      'program accountability and graduate earnings',
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: '6705 W Highway 290, Suite 607 PMB 1205',
      addressLocality: 'Austin',
      addressRegion: 'TX',
      postalCode: '78735-8407',
      addressCountry: 'US',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        telephone: '+1-512-692-7175',
        url: `${SITE}/contact/`,
        areaServed: 'US',
        availableLanguage: 'English',
      },
      {
        '@type': 'ContactPoint',
        contactType: 'technical support',
        email: 'support@civitaslearning.com',
        url: `${SITE}/support/`,
      },
    ],
    sameAs: [
      'https://www.linkedin.com/company/civitas-learning',
      'https://twitter.com/civitaslearning',
      'https://www.facebook.com/CivitasLearning',
      'https://www.youtube.com/user/CivitasLearning',
    ],
  };
}

/** The site itself, so an engine can name the publisher of every page. */
export function website() {
  return {
    '@type': 'WebSite',
    '@id': `${SITE}/#website`,
    url: `${SITE}/`,
    name: 'Civitas Learning',
    publisher: { '@id': ORG_ID },
    inLanguage: 'en-US',
  };
}

/** The product, for the platform and solution pages. */
export function softwareApplication() {
  return {
    '@type': 'SoftwareApplication',
    '@id': `${SITE}/platform/#software`,
    name: 'Civitas Learning Institutional Impact Platform',
    alternateName: 'Student Impact Platform',
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Higher education student success and institutional effectiveness platform',
    operatingSystem: 'Web browser',
    url: `${SITE}/platform/`,
    publisher: { '@id': ORG_ID },
    audience: {
      '@type': 'Audience',
      audienceType: 'Colleges and universities',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      // No list price is published. The pricing page explains what sets the number.
      url: `${SITE}/pricing/`,
      availability: 'https://schema.org/InStock',
    },
  };
}

export interface FaqItem {
  q: string;
  /** May carry inline links. Stripped for the schema. */
  a: string;
}

export function faqPage(items: FaqItem[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: plain(i.q),
      acceptedAnswer: { '@type': 'Answer', text: plain(i.a) },
    })),
  };
}

export interface Crumb {
  text: string;
  href?: string;
}

export function breadcrumbs(crumbs: Crumb[], currentPath: string) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.text,
      item: SITE + (c.href ?? currentPath),
    })),
  };
}

export interface Term {
  term: string;
  short: string;
  body: string;
  also?: string[];
}

export function definedTermSet(terms: Term[]) {
  const id = `${SITE}/glossary/#terms`;
  return {
    '@type': 'DefinedTermSet',
    '@id': id,
    name: 'Civitas Learning glossary of student success and institutional effectiveness terms',
    url: `${SITE}/glossary/`,
    hasDefinedTerm: terms.map((t) => ({
      '@type': 'DefinedTerm',
      '@id': `${SITE}/glossary/#${slug(t.term)}`,
      name: t.term,
      alternateName: t.also,
      description: plain(`${t.short} ${t.body}`),
      inDefinedTermSet: { '@id': id },
    })),
  };
}

export function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
