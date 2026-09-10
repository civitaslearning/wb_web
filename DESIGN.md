# DESIGN.md — positioning and design notes for civitaslearning.com

Written 2026-09-09 from the work in this repository. Companion to NOTES.md (which covers
repository state and next steps). This file covers *why* the site looks and reads the way it does.

---

## 1. Positioning

### The competitor read (Element451, Sept 2026)

- Headline: "AI Built for the Student Lifecycle." Message: your staff cannot do the work alone;
  AI agents do it.
- Two products. **Bolt** deploys agents on the systems you have (Slate, Salesforce, Banner,
  Workday). **Element** is a full AI-native CRM.
- Proof is volume: 60M student journeys, 5.5M agent conversations, 350+ institutions.
- Case studies show enrollment growth, staff hours saved, lower cost per application.
- Public pricing page and an ROI calculator. Lowers buyer risk.
- Buyer: VP Enrollment, CMO. Strength is the front door — marketing and admissions.

### The competitor read (CollegeVine, Sept 2026)

Read from collegevine.com on 2026-09-09: home, the five solution pages, the IPEDS agent, the
CRM analyst, and the case studies page.

**What they say**

- Headline: "The AI operating system for universities." Subhead: "unifies your data, models
  your operations, and deploys AI across every office on campus." Tagline: "Professional Class
  AI for Higher Education."
- Architecture is the pitch: an "ontology" data model, then agents, apps, and ML models on top.
  "All major campus systems are finally talking to each other." "Live in weeks, not years."
- Breadth is the proof of seriousness. One page lists agents for enrollment, financial aid,
  advancement, academic operations, career services, dining, housing, research, accreditation,
  student affairs, compliance, IT, finance, HR, facilities, health services, parking, and
  procurement.
- Buyer is the whole cabinet: VP Enrollment, CFO, CIO, VP Advancement, Provost. Security is on
  every page: zero trust, FERPA, SOC 2 Type II, HECVAT, a trust center.
- Two free hands-on demos. An IPEDS agent that answers plain-English questions across 4,000+
  institutions, and a CRM analyst demo behind an email gate. Both lower buyer risk without a
  data share.
- Eleven case studies. Titles are process stories: "How Molloy partnered with CollegeVine to
  use AI for transcript processing, giving 835 hours back." "How Bridgeport and Goodwin unified
  Slate and Colleague into one data layer."
- Best-written page is Academic Affairs: "Catches the student in week 8, not in December."
  "Every dollar traces back to a named course and a specific decision, so you can defend it to a
  faculty senate."

**Where they are weak**

1. Proof is activity, not outcome. Email open rate. SMS reply rate. Staff hours saved. "Months
   is the average time for partners to see results." "X% of partners report their agent exceeded
   expectations." Their ROI FAQ answer is "staff capacity, operational efficiency, and outcomes
   tied to your specific goals." No retention, completion, or revenue number anywhere.
2. Student success is rules, not models. "Continuously scans student records for slipping GPA,
   missed registration, and other risk signals." No institution-specific model, no history, no
   comparison group. They cannot say whether an intervention worked.
3. Breadth dilutes the claim. Parking and procurement sit on the same page as retention. A
   president cannot tell what they are best at.
4. "AI operating system" and "ontology" are replacement language. It reads as a platform that
   wants to sit under everything. Our "nothing gets replaced" is the direct counter.
5. "Hundreds of institutional partners." No number, no logos in the first screen. We have 375
   and names.
6. Jargon in headlines: "Operational Intelligence Platform", "unified ontology", "Professional
   Class AI".

**Where they beat us today**

- Hands-on demos that a prospect can run alone. We have a calculator; they have an agent on
  public data.
- Concrete Monday-morning copy on every solution page, one job per section, each with a
  named person and title.
- Security on every page. We have none visible.
- A time-to-value claim ("weeks"). We have the Lawrence Tech story ("live in six weeks") and do
  not use it as a headline stat.
- Case study count in the first screen. We have 31 stories and show 4.

**How to out-message them**

| Move | What it does |
|---|---|
| Sharpen the thesis line on the home page: "An operating system runs the work. Civitas proves the work paid off." | Turns their strongest word ("operating system") into the setup for ours ("proves"). Never names them. |
| Add their metrics to the comparison table under "Generic AI agent": open rate, reply rate, hours saved, "exceeded expectations". | Makes the activity-versus-outcome contrast concrete. Our column keeps persistence, completion, revenue versus a matched comparison group. |
| Add a "How risk is found" row: rules on GPA and missed registration versus a model trained on your own history and refreshed each term. | Their early alert is rules. Ours is a model. Say it in one line. |
| Build a public IPEDS benchmark tool: pick your institution, see retention and completion versus peers, and what one point is worth. | Matches their IPEDS agent on our terms. Fits the rule that sessions start from IPEDS. Feeds the ROI calculator with real inputs. |
| Put "375 institutions, 31 measured outcomes" in the stat band or the story index. Link the count. | Beats "hundreds" with a number and a list. |
| Add "Live in six weeks, Lawrence Tech" as a stat or a proof line on the platform page. | Answers "weeks, not years" with a name. |
| Add a security line to every solution page and a /security page: FERPA, SOC 2, HECVAT, role-based access. | Removes the objection they raise on every page. Low effort. |
| List CollegeVine as an integration next to Element451. | Same rule as Element451: competitors appear only as systems we read from. |
| Rewrite the three job cards to their level of concreteness: "week 8, not December" is the bar. | Their academic affairs page is better copy than our jobs section. Match it. |
| Keep the frame "institutional effectiveness", but define it as measurement across offices, not plumbing under offices. | Nick's broadening and their breadth story overlap. Ours is "every office gets a scoreboard"; theirs is "every office gets an agent". |

All ten moves are built on the `collegevine` branch (2026-09-09). Notes on two of them:

- The IPEDS tool lives in the home page calculator. `scripts/build-ipeds.py` turns five IPEDS
  tables into `public/data/ipeds.json` (3,169 institutions, 2023-24). The browser loads it on
  first use, fills headcount and net price, and shows first-year retention and graduation rate
  against a peer median. Peers are the 40 institutions with the same control (public, private
  nonprofit, for-profit) and Carnegie group (associate's, doctoral, master's, baccalaureate,
  special focus) nearest in headcount, Pell share, and net price. The peer list never shows.
  Copy branches: below peers, "closing that gap is worth $X"; above peers, "every point you
  hold is worth $X"; no retention rate, "one point is worth $X".
- A retention rate from a full-time cohort under 50 students is dropped. A community college
  that awards a few bachelor's degrees reports retention on that tiny bachelor's cohort, so
  Sinclair showed 100% from three students. The page then shows "n/a" and the one-point copy.
- The AI vendor checklist (Meredith's name for it) sits under the comparison table and has its
  own page at `/ai-vendor-checklist/`. Ten questions a cabinet should ask any AI vendor, each
  with a good answer and a weak answer. Every question is one Civitas answers with a number or
  a name, and the weak answers are quotes from competitor sites. Nobody is named. The page is a
  sales leave-behind: a prospect who brings it to a competitor demo is asking our questions.
- Use-case pages carry the institutional-success frame, not only student success (Will,
  2026-09-09). Each page has a headline in the home page voice, and every use-case page shows
  the same six-outcome scoreboard strip: Enroll, Engage, Persist, Graduate, Employ, Prove. The
  body sections are still the live site's copy. A new page, `/career-outcomes/`, covers the
  career module (the career readiness index built with UT San Antonio) and the Department of
  Education's earnings accountability framework, finalized in 2026 and effective July 2027.
  The rule text on the page follows the podcast episode with Mario Vela; the exact test and
  dates should be checked against the final rule before launch. Feature claims for the career
  module (program-level earnings against the federal threshold) need product confirmation.
  The old site had no career page and no product screenshots of the career module. The
  screens on the page (`public/assets/screens/career-*.webp`) were captured on 2026-09-09 from
  the Post-Graduation Outcomes module at demo.civitaslearning.com: overview, geographic,
  career paths, by major, the outcomes-by-major table, and a single program (nursing). The
  demo tenant's numbers are illustrative, like every other product screen on the site.
- Articles link to the pages they belong with. `src/lib/usecases.ts` scores a title, tags,
  description, and body against one keyword rule per use-case page. Blog posts, podcast
  episodes, and customer stories show a "Where this fits" card for the top two matches, and
  topic chips link to the use case they name. On the home page the "Outcomes you report"
  cards link to the matching use case. Add a rule when a page is added.
- The security line claims only what the live site already states: FERPA school-official
  status, the data sharing agreement, single sign-on, platform specifications, and VPATs.
  SOC 2 and HECVAT are not on the site. Add them only when the reports exist.

### Where the old Civitas home page was weak

1. "AI Built on Your Data" has the same shape as Element's headline. Two vendors saying "AI";
   the other one says it louder.
2. Internal terms in headlines: "Institutional Impact Management", "Impact Platform",
   "Data Lakehouse". (The names stay; they belong in navigation and product copy, not the h1.)
3. Proof in ranges ("3–11% lift"). A range is weaker than one number and one school.
4. AI section lists verbs ("Chats, Plans, Builds, Acts") instead of what an agent does on Monday.
5. Did not answer "does it run on my systems?" in the first screen. Element does.
6. Demo-only CTA. No price signal, no ROI tool.

### The position we took

**Do not compete on the word "AI". Compete on proof.**

Element measures activity (messages sent, hours saved). Civitas measures outcomes
(persistence, completion, revenue) against a matched comparison group. No agent vendor can
make that claim. It is the headline: *"Every vendor sells AI. We prove what works."*

Supporting moves, in order down the page:

| Section | Job |
|---|---|
| Hero + example impact ledger | State the thesis; show the one picture only Civitas can show (lift with confidence intervals, two interventions with no effect). |
| Logo strip in the hero | Trust from named institutions, not a number. |
| Stat band | Four numbers: 220 measured initiatives, 89%, +8 pts, $4:$1. |
| "One institution, one dataset" | Nick's broadening: institutional effectiveness across every system the university runs. Systems in → Civitas (Unify, Predict, Act, Measure) → outcomes out, student success first. |
| Three cabinet questions | Set the buying criteria. Question 2 ("which interventions are really working?") is one Element cannot answer. |
| Three jobs with named agents | Recruit & enroll, Success & progress, Graduate & employ. Each job has one number and one school. |
| "Beyond the student journey" | Course demand, program portfolio, aid leverage, IR. Signals the platform is bigger than student success. |
| Comparison table | "Generic AI agent" vs "your model". Element is never named. |
| Outcome cards | One number, one institution, linked to the story. |
| ROI calculator | Retention is the cheapest enrollment. Public inputs only. |
| Final CTA | "Bring your questions." No data-sample promise. |

### Rules that came from Will and the board

- Frame: institutional effectiveness. Student success stays the lead use case. (Nick Zeppos)
- Integrations are a headline claim: Banner, PeopleSoft, Workday, Slate, Canvas, Salesforce,
  Element451, 100+ systems. "Nothing gets replaced." Civitas reads from the competitor's CRM.
- Element451 appears on the site only as an integration, never as a named competitor.
- No "bring your data" demo. Prospects cannot share data pre-sale. Sessions start from IPEDS.
- `$4 : $1` stays in the stat band and outcome card, not in the calculator.
- Proof is one number and one institution. No ranges.
- No institution-count claims (Will, 2026-09-10). No "375 institutions", no "hundreds of
  partners". The logo strip and the named outcomes carry the trust. Counts of measured
  initiatives and published stories are fine, because each one links to its evidence.
- No internal jargon in headlines. Plain terms a president uses.
- The product is the **Institutional Impact Platform** and the category is Institutional
  Impact Management (Will, 2026-09-10; the live site made the change in 2026). "Student Impact
  Platform" is the old name. Use the new name in navigation, product pages, and authored copy.
  Keep it out of the h1. Title tags keep the old name where the live site still ranks on it
  (the platform page title is still "Student Impact Platform | Civitas Learning"). Imported
  articles keep the name they were written with.

### Voice

Short declaratives. Second person. The buyer is the cabinet, not the advisor. Every claim has a
number or a name next to it. Verbs over adjectives. No "innovative", "seamless", "empower".

---

## 2. Visual system

The site keeps the live brand and tightens it. Nothing here should read as a rebrand.

### Color

| Token | Value | Use |
|---|---|---|
| `--navy` | `#001F4C` | Page-hero backgrounds, dark bands, headings |
| `--navy2` | `#0F3773` | Hero gradient end, hover on navy buttons |
| `--cyan` | `#02ADF2` | Brand accent. Primary buttons, measured lift, eyebrows on dark |
| `--cyan-ink` | `#0077B6` | Cyan for text on white (AA contrast) |
| `--cyan-soft` | `#E3F5FD` | Highlight fills, the "your model" column |
| `--coral` / `--coral2` | `#FF530C` / `#FF6444` | Action. Every primary button, the accent line in the home h1. Hover is `--coral2`. Same coral as the live site. |
| `--orange-soft` | `#FFEDE3` | The prototype banner only. |
| `--ink / --ink2 / --ink3` | `#0E1B33 / #465873 / #7A879C` | Text, secondary, captions. Blue-biased greys, not neutral. |
| `--paper / --tint / --line` | `#FFFFFF / #F5F7F9 / #DAE0E8` | Ground, alternating section ground, rules |

Single light theme, by decision. The live site is light; a marketing site does not flip with
the OS.

Navy and coral are the brand (Will, 2026-09-10). The header is navy with white text and a
coral pill button, the home hero is the same navy gradient as the inner-page heroes, and every
primary button is a coral pill with white text, as on the live site. Ghost buttons are navy
outlines on white and white outlines on navy. Cyan is the data color: eyebrows, measured
lift, the "your model" column. Coral is the action color and nothing else, so "not
significant" in the ledger is grey, not coral.

### Type

- **Sora** 500/600 — headings. Geometric, confident, matches the live site.
- **Nunito Sans** 400/600/700 — body. Matches the live site.
- **IBM Plex Mono** 400/500 — eyebrows, data labels, "n = 412", chip labels. New. It marks
  anything that is a measurement, which is the point of the brand.

Scale: h1 `clamp(38px, 4.6vw, 58px)`, h2 `clamp(28px, 3.1vw, 40px)`, h3 22px, body 16.5px,
captions 13–13.5px. Headings use `text-wrap: balance` and `letter-spacing: -0.015em`.
Numbers use `font-variant-numeric: tabular-nums` wherever they line up.

### Layout

- Content width 1180px, 28px side padding.
- Sections at 84px vertical padding; `tight` at 56px. Alternating white / `--tint` grounds.
- Section header is a two-column grid: eyebrow + h2 on the left, one paragraph on the right.
  Every section uses it; it is the rhythm of the page.
- Cards: 1px `--line` border, 10px radius, no shadow. Shadow is spent once, on the hero ledger.
- Dark bands (`.band`, `.phero`, `.final`) are navy with `#DCE6F5` text and cyan eyebrows.
- Breakpoint at 900px: grids collapse to one column, the flow diagram stacks vertically with
  the arrows rotated, the menu hides behind a burger (not wired yet).

### Signature components

- **Impact ledger** (hero): five interventions, bar = point estimate, whisker = 95% CI, zero
  line at 8% of track. Cyan for significant lift, grey for not significant. This is the
  brand's argument as a picture. Labeled "example".
- **Flow diagram**: systems → Civitas → outcomes. Left and right columns are `.sys` cards,
  center is a navy `.core-box` with four steps on a cyan rule. Student success card is
  highlighted (`.out-lead`).
- **Cabinet questions**: three columns on navy, hairline dividers, `Question 1/2/3` in mono.
- **Job cards**: stage label in mono, h3, one paragraph, two named agents as `agent` rows,
  proof line pinned to the bottom with the number in cyan.
- **Comparison table**: two columns, right column tinted cyan, `—` vs `✓` in mono.
- **ROI calculator**: three inputs left, big cyan number right. Formula stated in a note.
- **Screenshots**: the live site's product screenshots, one beside each feature row in a
  tinted frame with a soft shadow; feature lists become image cards. No invented UI.
- **Logo strip**: real customer logos at 34–40px height, greyscale at 75% opacity, color on
  hover.

### Wordmark

The live SVG, inlined as `Logo.astro`, fills set to `currentColor`. The mask rectangle stays
white. Rendered navy in the header and footer. Do not swap in a raster.

---

## 3. Inner-page pattern

Every inner page: navy `PageHero` (breadcrumbs in mono, eyebrow, h1, sub, two CTAs) →
content sections → optional stat band → optional integrations chips → testimonial grid →
`FinalCta`. Solution and use-case pages get a new headline in the new voice; the body sections
are the live site's copy, unchanged, so nothing that ranks is lost.

Customer story pages: hero with institution logo box, two-column body (challenge/approach/quote
left, outcome cards pinned right), three more stories, final CTA. Slugs match the live site.

---

## 4. Open design work

1. Check each screenshot sits beside the right section; the mapping is heuristic.
2. Mobile menu behavior.
3. Story filters (institution type, outcome, solution) are visual only; wire to data.
4. Resource library filters, same.
5. A real photo or two. The site is all type and data right now; one image of a campus or an
   advisor at work would lower the temperature without diluting the argument.
6. Video embeds on the podcast pages. (The platform page has the product video; the webinar
   page gates its recording behind the HubSpot form, as the live site does.)

---

## 5. HubSpot, video, and what the live site loads

Checked on www.civitaslearning.com on 2026-09-10. HubSpot on the live site is **forms only**:
portal `47005231`, region `na1`. There is no tracking loader (`js.hs-scripts.com`) on the page
or in the GTM container, so this site does not add one either. Add it in `Base.astro` if
marketing wants visitor tracking.

| Where | Form | Salesforce campaign |
|---|---|---|
| `/contact/` (every "Book a demo" lands here) | `a9cb8985-…` | `7010z000000mb8iAAA` |
| `/subscribe/` Signals newsletter | `13901ac7-…` | — |
| Impact Report download pages, 2023 and 2024 | `f6ef0318-…` | `701Uo00000KWVGUIA5` |
| 2024 Impact Report webinar (gates the recording) | `eddb235c-…` | `701Uo0000097G2tIAE` |
| `/impact-report-assessment-2026/` results gate | `d19a3e8e-…` | `701Uo00000KWVGUIA5` |

How it is wired:

- `src/lib/hubspot.ts` holds the IDs. `src/lib/hubspot-embed.ts` runs on every page from
  `Base.astro`: if the page has a `[data-hs-form]` mount, it loads the HubSpot script once and
  renders a form into each mount. After ten seconds with no form, the mount shows a fallback line.
- Astro pages use `<HubSpotForm form="contact" />`. Markdown pages put the mount in raw HTML
  (see the download pages). Styles for the inline form are in `site.css` under `.hs-form`:
  site type, coral pill button.
- The self-assessment is the live WPCode snippet ported as written: markup in
  `src/pages/impact-report-assessment-2026.astro`, styles in `src/styles/assess.css` (brand
  overrides at the end), logic in `src/scripts/impact-report-assessment.js`. It loads its own
  form and fills five hidden fields (`assessment_score`, `_profile`, `_role`,
  `_recommendations`, `_results_url`). The page is noindex, as on the live site.
- The live `/ai-readiness-assessment/` is a "[TEST – Do Not Publish]" page with placeholder
  IDs (`YOUR_PORTAL_ID`). Its imported stub stays noindex and is not wired.

Not ported, on purpose: Google Tag Manager `GTM-WXN8XFP` (carries GA4 `G-5GJP94659P`), the
LinkedIn Insight tag, and OneTrust cookie consent. Add them together when the site goes live;
consent has to load before the tags.

**Video.** The live site has four videos, all on YouTube. Each one now sits under the hero of
the page it belongs to, from a `video` field on that entry in `solutions.json`. Any solution
page can carry one. They embed from `youtube-nocookie.com`.

| Page | Video | Length |
|---|---|---|
| `/platform/` (the live home page's video) | The Civitas Learning Student Impact Platform | 1:15 |
| `/analytics/` | How Higher Education Leaders Drive Better Student Outcomes | 2:05 |
| `/data-lakehouse/` | AI-Powered Data Access for Higher Ed | 2:36 |
| `/ai-solutions/` (its own page, so the embed is inline) | Document Every Student Conversation in Seconds | 0:45 |

The platform video still says "Student Impact Platform" on screen and in its YouTube title.
Re-cut or re-title it when the rename reaches the video library.

**Customers in the nav.** The header has a Customers menu between Use Cases and Resources:
Customer Stories, Next Practices Podcast, and the newest episode by name and guest (read from
the podcast collection in `Header.astro`). The footer has a matching Customers column.

---

## 6. Answer-engine optimization

The premise (Will, 2026-09-10): when a provost asks an assistant "how do we know if our student
success interventions are working", or a chief financial officer asks "what is one point of
retention worth", Civitas should be the cited answer. Answer engines pull from pages with
explicit question headings, a direct first-sentence answer, defined entities, structured data,
and third-party corroboration. Neither the live site nor this prototype had any of that.

### The rules

1. **Every heading a reader could type into a search box is a question.** The six home page
   headings were slogans; they are now questions, and the slogan survives as the bold deck at
   the front of the paragraph under it. Nothing was lost, and the page now matches the query.
2. **The answer goes in the first sentence.** An engine quotes that sentence without the
   question next to it, so it has to stand alone. "Measure each initiative against a matched
   comparison group" works; "There are three things to consider here" does not.
3. **Mark up only what the reader can see.** Every FAQ answer is visible on the page, never
   behind an accordion. Marking up hidden content violates the search guidelines and loses the
   rich result.
4. **Never make a claim in an FAQ that is not made in the visible copy elsewhere.** The FAQ is
   the most quotable part of the site and therefore the easiest place to create a claim nobody
   in the company has approved.

### What was built

- **`src/lib/schema.ts`** builds the JSON-LD. `Base.astro` emits Organization and WebSite on
  every page as one `@graph`, and takes a `jsonld` prop for page-level nodes. Current coverage:
  221 pages with Organization and WebSite, 23 BreadcrumbList, 23 FAQPage, 2 SoftwareApplication,
  1 DefinedTermSet.
- **`src/data/faqs.json`** holds 143 questions across 18 pages, keyed by path, rendered by
  `src/components/Faq.astro`, which also emits the FAQPage data. Every solution and use-case
  page has six to nine. **Marketing owns this file**, and the source for new questions is the
  Gong call record: write the question the way the buyer said it on the call.
- **The nine live `/ai-solutions/` FAQs are ported back**, word for word except where the
  product name changed, and now carry markup they did not have on the live site.
- **Comparison pages** at `/compare/`: EAB Navigate360, Salesforce Education Cloud,
  Element451, and a category buyer's guide. These capture the highest-intent search we
  currently cede to review sites. The template rule is that each page names what the other
  product is genuinely better at, in its own section, before the table. A comparison page that
  only flatters the publisher is discounted by readers and by answer engines, and it loses the
  deal in the room when the buyer notices.
- **`/glossary/`** defines 17 terms as a DefinedTermSet with stable anchors: Student Impact
  Gap, CLOSE, matched comparison group, institution-specific model, Institutional Impact
  Management, lift, persistence, unified data layer, program accountability, and the rest.
  Answer engines cite the page that defines the term.
- **`/pricing/`** answers the question buyers ask an assistant first. It is not a price list:
  it gives the model (annual subscription scaled to institution size, no token metering, no
  per-agent charge), the four things that move the number, what is included, and what is not.

### The competitor fact check (2026-09-10)

Every claim on the comparison pages about another vendor was checked against that vendor's own
current material. **Two were wrong, not merely stale**, and the pages were corrected before
launch. Each comparison page now ends with the sources we read, and carries the date.

| What we had said | What their own site says |
|---|---|
| EAB Navigate360 proves impact with activity reporting only | EAB sells an Intervention Effectiveness Tool and publishes graduation gains of 3–15%, retention gains of 2–12%, and a typical 5:1 return |
| EAB's risk scores are largely generic | EAB reports more than 200 custom-built models, some trained on ten years of an institution's history |
| Element451 proves activity: conversations, response rates, hours saved | Element451 publishes a 2–7% term-to-term retention lift and 3–10% grade gains |
| Element451 is a front-door CRM | It now sells student success and retention products and reads SIS and LMS data |
| Salesforce implementations "commonly run in quarters" | Salesforce publishes no implementation timeline. We had no source |

The corrected pages make the difference **method and disclosure, not ability**. Most vendors now
publish an outcome number; what separates them is whether they will tell you how the comparison
group was built and hand you the population size and the confidence interval. That is a claim we
can defend, and the previous one was not. Three other unsourced assertions were changed into
questions to put to the vendor, and Navigate360 AI and Agentforce for Education were added,
because a reader who knows the market would have noticed we left them out.

Re-read the competitor pages on a schedule. Their products change and ours does not get to say so.

### Open items

- **Naming: settled** (Will, 2026-09-10). The Element451 comparison page stands, and it
  supersedes the older section 1 rule that Element451 appears only as an integration. It is now
  both, an integration and a named comparison.
- **Pricing: settled** (Will, 2026-09-10). The pricing page claims are approved as written.
- **Third-party corroboration is still the weakest link, and the research found less than
  expected.** No source contradicts our outcome claims, and none independently supports them
  either. Two specific risks:
  - **The 89% accuracy figure has no third-party source.** It appears in three comparison rows
    and two FAQs, and the AI vendor checklist tells buyers to make vendors prove their models.
    Expect the same question back from a procurement office.
  - **Trade press reports the efficacy study at a different scale than we do.** Higher Ed Dive
    and Campus Technology both covered it as "more than 1,000 initiatives across 55 colleges"
    with about 60% positive. The site says 220 initiatives and 40–60%. These may be different
    editions of the report, but a journalist comparing them will ask, and the answer should be
    ready before launch. The same coverage quotes Mark Milliron cautioning against a binary
    reading of the finding, which is our own executive arguing our headline number is too simple.
  - Review-site presence is thin: three G2 reviews for Inspire, no Capterra profile, a 404 on
    Software Advice, and TrustRadius blocked automated reading. Building that presence is
    off-site work nobody has started.

---

## 7. What the product actually is: work with the CRM, or be the CRM

A correction that ran through the whole site (Will, 2026-09-10). The copy said Civitas is "a
measurement layer, not a system of record" and that "nothing gets replaced". **That undersold the
product badly.** Civitas has an advising CRM with case management, notes, alerts, dynamic lists,
and outreach; collaborative degree planning; registration; class scheduling; and, new, a
student-facing mobile app.

The position that follows is stronger than either extreme in the market:

| Vendor | Deployment |
|---|---|
| EAB Navigate360 | Advising moves into Navigate360. It becomes the system of record. |
| Salesforce Education Cloud, Element451 | It is the CRM. |
| **Civitas Learning** | **Your choice. Be the advising CRM, or read from the one you keep and write back to it.** The measurement is the same either way. |

"Nothing gets replaced" survives as a de-risking promise for the CIO, but it is now "nothing
**has** to be replaced" — a choice the buyer makes rather than a limit on what we can do. The SIS
and the LMS are genuinely never replaced. An advising or early alert contract can be retired onto
Civitas, which is a way to reduce the vendor count rather than add to it.

This was costing us the head-to-head. The EAB comparison page previously conceded "a mature
student mobile app" and "Navigate360 becomes the advising system of record" as reasons to choose
them, when we ship both a mobile app and an advising CRM. Those rows are corrected, and the mobile
app is no longer listed under "choose EAB when".

### Six outcomes, a model each, end to end

The second half of the same correction. The site said "multiple student outcomes" and
"multi-outcome analytics" and never named them, which is a claim a reader cannot check and an
answer engine cannot quote. **Civitas models six outcomes per institution, each its own custom
model: persistence, graduation, engagement, thriving, grades, and career outcomes.** End to end
means the first term through what a graduate earns.

The competitive point is countable rather than superlative, which is why it lands:

> Most platforms in this category model one thing: will this student come back.

That is checkable in a demo. It is also the answer to EAB's "more than 200 custom-built models"
claim, which counts models across their whole customer base rather than outcomes per institution.
The corrected EAB FAQ presses exactly there: ask both vendors to name every outcome they predict.

Every comparison page now carries a "What gets modeled" row, and none of the three competitors
publishes its list of modeled outcomes, so those cells say so and hand the buyer the question.
The home comparison table gained an "Outcomes modeled" row for the same reason. `/analytics/` owns
the claim and its headline is now "Six outcomes. A model for each. All of them yours."

**Before launch, two things to confirm:**

1. **The student mobile app** is new and is not yet on `www.civitaslearning.com`. Confirm its
   product name, availability date, and what it does for students, then use that wording rather
   than the generic phrase used here.
2. **"More models per institution than anyone else in the category"** appears once, on
   `/analytics/`. It is the one superlative on the site and it is Will's claim rather than a
   sourced one. Either substantiate it or cut it; the countable version ("six outcomes, a model
   each") carries the argument on its own and is not attackable.

---

## 8. Persona pages: lead with the buyer's win

The home page speaks to the president and the chief financial officer. The five team use-case
pages are where a VP of Enrollment, a director of advising, or an IR director decides whether we
understand their job. They were failing that test: the headlines described institutional
outcomes or product behavior, and everything under the hero was Title Case capability copy
carried over from the live site.

**The rule now: the headline is the win that person gets, in their words. The how goes in the
subhead.**

| Page | Was | Is |
|---|---|---|
| Strategic Enrollment | Fill the class with students who will finish. | Make your number. Then keep it. |
| Advising & Student Success | Keep the students you already have. | Get your time back. Spend it on the students who need you this week. |
| Academic Leaders & Faculty | See student engagement by week, not by grade report. | Catch the slide in week four, while you can still change the outcome. |
| IR & Effectiveness | One dataset for the board, the accreditor, and the Department of Education. | Win the board meeting. |
| Institutional Technology | Get more from the systems you already run. Nothing gets replaced. | Nothing to rip out. Nothing new to maintain. |

Under each hero, the three body-only Title Case rows became one numbered card grid naming that
role's wins ("What a VP of Enrollment gets", "What a CIO gets"), and every feature row was
rewritten as an outcome for that reader rather than a capability. "Democratize Student Data"
became "Answer the cabinet's question the day it is asked." "Simplify Your Tech Stack" became
"Configure it yourself, without opening a ticket."

**Duplicates are gone.** "Customize Analytics to Your Institutional Needs", "Prioritize
Engagement", "Equip Teams with Centralized Information" and six other blocks appeared on two or
three pages each. Each capability now lives on the one page whose reader cares about it: IT owns
configuration, IR owns the same-day answer, coordinate-student-care owns the shared plan. No
heading repeats across any use-case page now, apart from the shared closing checklist.

### Three defects fixed while in there

1. **The advising page was titled "About Civitas Learning."** This is a real defect on the live
   site, not an import error: `www.civitaslearning.com/advising-and-student-success/` still
   serves `<title>About Civitas Learning</title>`, which costs that page its ranking for every
   advising term. This is the one place the site deliberately departs from the rule that title
   tags match the live site, because the live title is a defect rather than an asset. The page
   is now "Advising & Student Success Software".
2. **The academic leaders page carried a stray "Footer CTA" heading** in the body, from the
   import. Removed.
3. **The Use Cases breadcrumb pointed at the advising page**, so "Use Cases" led to one use case
   rather than to a list. There is now a hub at `/use-cases/`, grouped by team and by goal,
   reading its grouping from `nav.json` and its copy from `solutions.json` so the menu and the
   page cannot drift apart. The header's Use Cases menu opens with a link to it.
