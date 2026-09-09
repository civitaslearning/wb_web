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
