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
   "Data Lakehouse".
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
| Stat band | Four numbers: 375+, 89%, +8 pts, $4:$1. |
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
- No internal jargon in headlines. Plain terms a president uses.

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
| `--orange` | `#FF530C` | One semantic use: "not significant" in the ledger. Also the prototype banner. |
| `--ink / --ink2 / --ink3` | `#0E1B33 / #465873 / #7A879C` | Text, secondary, captions. Blue-biased greys, not neutral. |
| `--paper / --tint / --line` | `#FFFFFF / #F5F7F9 / #DAE0E8` | Ground, alternating section ground, rules |

Single light theme, by decision. The live site is light; a marketing site does not flip with
the OS.

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
  line at 8% of track. Cyan for significant lift, orange for not significant. This is the
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
6. Video embeds on the webinar and podcast pages.
