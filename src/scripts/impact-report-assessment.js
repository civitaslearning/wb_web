/* ============================================================
  Impact Report Self-Assessment (2026)
  Ported as written from www.civitaslearning.com/impact-report-assessment-2026/
  (WPCode snippet, JavaScript tab). Two changes: the booking link is
  set in the page markup, and the script is a module.
  Impact Report Self-Assessment — JavaScript tab
  Production version: spec logic (two lowest + conditional third
  + role tiebreak), gated by a real HubSpot form.

  Adds: Salesforce campaign ID, recommendations + results-URL
  hidden fields, shareable results links (?r=&a=), and a share
  button that copies the results URL (bypasses the gate).

  SETUP — edit the values in CL_CONFIG below.
  The HubSpot form must contain FIVE hidden fields whose
  internal names match HIDDEN_FIELDS exactly.
============================================================= */
(function () {
  'use strict';

  var CL_CONFIG = {
    portalId: '47005231',
    formId: 'd19a3e8e-7683-43c8-b144-8a8f9696556b',
    region: 'na1',
    sfdcCampaignId: '701Uo00000KWVGUIA5',   // Salesforce campaign attribution
    failOpenSeconds: 10
  };
  var HIDDEN_FIELDS = {
    score: 'assessment_score',
    profile: 'assessment_profile',
    role: 'assessment_role',
    recommendations: 'assessment_recommendations',  // add to form as hidden single-line text
    resultsUrl: 'assessment_results_url'            // add to form as hidden single-line text
  };

  /* ---------------- CONTENT (approved copy) ---------------- */
  var ROLES = [
    { id: 'provost', name: 'Provost or academic leader', desc: 'Academic affairs, faculty, programs' },
    { id: 'vp', name: 'VP of Student Success or Enrollment', desc: 'Advising, retention, outreach teams' },
    { id: 'ir', name: 'IR or Institutional Effectiveness', desc: 'Data, research, accreditation' },
    { id: 'cio', name: 'CIO or IT leader', desc: 'Systems, data infrastructure, integration' }
  ];

  var QUESTIONS = [
    { t: 'How early do you connect students who need support with an advisor?', s: 'Do at-risk students meet with an advisor in the first few weeks\u2014or after problems have already surfaced?' },
    { t: 'Is outreach coordinated across teams and triggered by student need?', s: 'Or does each office communicate independently?' },
    { t: 'When you automate outreach, do people still guide the timing and message?', s: 'Or does automation make those decisions on its own?' },
    { t: 'Is academic planning something students revisit throughout their journey?', s: 'Or a one-time task students complete and forget?' },
    { t: 'Can you see which career and experiential learning opportunities have the greatest impact on persistence?', s: 'Or are you investing without knowing which experiences matter most?' },
    { t: 'Are your engagement efforts reaching the students who need them most?', s: 'Or are they primarily designed for full-time residential students?' },
    { t: 'Can you see what works for different groups of students?', s: 'Or are you relying on institution-wide averages?' }
  ];

  var ANSWERS = [
    { label: 'Not yet', desc: "This isn't happening in a structured way today.", pts: 0 },
    { label: 'In progress', desc: "It happens in pockets, but it's not consistent.", pts: 1 },
    { label: 'Systematic', desc: 'This is how we work, and we could show you.', pts: 2 }
  ];

  var PROFILES = [
    { min: 0, max: 5, name: 'Getting started', intro: "You're already investing in student success. The next step is connecting those efforts so teams can see what works and act together." },
    { min: 6, max: 9, name: 'Building', intro: "You've built strong practices in key areas. Your biggest opportunity is coordinating those efforts so they have a greater impact together." },
    { min: 10, max: 14, name: 'Systematic', intro: 'Your institution has the foundation high-performing peers share. The next gains come from measuring impact by student population and continuously improving what works.' }
  ];

  var RECS = [
    { title: 'Start with earlier advising',
      body: 'Students benefit most when advising happens before small problems become larger ones. Look at how quickly your teams identify students who need support, connect them with an advisor, and follow through during the first few weeks.',
      peers: '<b>What peers saw:</b> Advising appointments were associated with a <span class="cl-stat">+17%</span> persistence lift at four-year institutions and <span class="cl-stat">+10%</span> at two-year institutions. Advising notes produced a <span class="cl-stat">+14%</span> lift for new students.',
      lens: { provost: 'Advising produced some of the strongest persistence gains in the 2026 Impact Report. The opportunity is to make early engagement a shared academic priority, not only an advising responsibility.',
              vp: 'Review how quickly risk becomes action. The strongest approaches identify students early, assign follow-up clearly, and make it easy to see whether contact occurred.',
              ir: 'Measure advising by timing, student population, and outcome. Institution-wide appointment counts will not show which interactions are making the greatest difference.',
              cio: 'Focus on whether advisors can see timely risk and engagement signals inside their regular workflow. Better timing depends on accessible, reliable data.' },
      step: 'Compare the date a student first shows signs of risk with the date meaningful advisor contact occurs.' },
    { title: 'Coordinate outreach around student need',
      body: 'Students are less likely to respond when messages arrive from different offices with no shared timing or context. Start by identifying where outreach overlaps, which signals trigger communication, and who owns the next step.',
      peers: '<b>What peers saw:</b> Student success outreach was associated with a <span class="cl-stat">+16%</span> persistence lift, sustained at <span class="cl-stat">+16%</span> over five years. SMS outreach produced a <span class="cl-stat">+12%</span> lift.',
      lens: { provost: 'Coordinated outreach requires clear ownership across academic affairs, enrollment, advising, and student support. The goal is a shared approach, not simply another communication calendar.',
              vp: 'Review the student experience across offices. At Macomb Community College, students were receiving 17\u201320 communications a day before the institution shifted toward more targeted, relationship-first outreach.',
              ir: 'Connect outreach activity with risk, timing, response, and persistence. Volume alone cannot show which communication is helping students act.',
              cio: 'Give teams a shared view of communication history and student signals so they can coordinate outreach without relying on separate lists and systems.' },
      step: 'Map every message a student in one high-need population receives during a typical week.' },
    { title: 'Keep people in the loop',
      body: "Automation can help teams prioritize students, draft communication, and act sooner. People should still guide when a message is sent, what it says, and whether outreach is appropriate for the student's situation.",
      peers: '<b>What the data showed:</b> Persistence declined by <span class="cl-stat">6.8 percentage points</span> when communication was fully automated without human judgment guiding timing and context.',
      lens: { provost: 'Set a clear expectation that automation supports institutional judgment rather than replacing it.',
              vp: 'Define which outreach can be automated and which situations require review, personalization, or direct contact from a staff member.',
              ir: 'Compare outcomes from automated, staff-guided, and person-to-person outreach. Look beyond delivery and open rates to student action and persistence.',
              cio: 'Build review, approval, and escalation points into automated workflows. Teams should be able to understand why a student was selected and adjust the response.' },
      step: 'Review one automated campaign and identify where a person guides the audience, timing, message, and follow-up.' },
    { title: 'Make planning something students revisit',
      body: 'Academic planning has greater value when students and advisors use it throughout the student journey. Plans should change as goals, course availability, academic progress, and personal circumstances change.',
      peers: '<b>What peers saw:</b> Academic planning produced a <span class="cl-stat">+10%</span> sustained persistence lift over five years, including <span class="cl-stat">+11%</span> for new students and <span class="cl-stat">+15%</span> for online students.',
      lens: { provost: 'Ongoing planning helps academic leaders see where program requirements, course availability, and student pathways create barriers to progress.',
              vp: 'Build planning into advising and registration milestones so students revisit their path before disengagement or scheduling problems occur.',
              ir: 'Track whether plans are current, who revisits them, and how planning behavior relates to persistence and completion.',
              cio: 'Make plans visible across advising and academic workflows, and ensure students can access and update them regardless of location or modality.' },
      step: 'Identify when students last revisited their plans and where outdated plans are creating registration or completion risk.' },
    { title: 'Find out which career experiences make a difference',
      body: 'Internships, mentoring, career coaching, and applied learning may all be valuable. The opportunity is to see which experiences improve persistence, for which students, and where additional investment is justified.',
      peers: '<b>What peers saw:</b> Career engagement was associated with a <span class="cl-stat">+7%</span> persistence lift at two-year institutions and <span class="cl-stat">+2%</span> at four-year institutions.',
      lens: { provost: 'Use evidence to decide which career-connected experiences should be expanded, redesigned, or better integrated into academic programs.',
              vp: 'Look beyond participation totals. Identify which students are accessing these opportunities and whether engagement leads to continued enrollment.',
              ir: 'Measure outcomes by program, student population, and type of experience. This turns broad claims about career readiness into evidence the institution can use.',
              cio: 'Connect participation data from career services, academic programs, and experiential learning systems with student outcomes.' },
      step: 'Select one high-participation career program and compare persistence for participants and similar nonparticipants.' },
    { title: 'Help more students connect',
      body: 'Engagement opportunities often work best for students who can be easiest to miss. Review whether part-time, transfer, online, commuting, and working students can participate as easily as full-time residential students.',
      peers: '<b>What peers saw:</b> Student-organization participation was associated with a <span class="cl-stat">+16%</span> persistence lift for part-time students and <span class="cl-stat">+9%</span> for transfer students. Co-curricular engagement showed a <span class="cl-stat">+7%</span> sustained lift over five years.',
      lens: { provost: 'Connection contributes to persistence, but participation opportunities must reflect how different students experience the institution.',
              vp: 'Look at who participates, who does not, and what barriers make engagement harder for students with limited time or less familiarity with campus.',
              ir: 'Break participation and outcomes out by enrollment status, transfer status, modality, and other relevant student populations.',
              cio: "Make engagement opportunities easier to discover and connect participation data with the institution's broader view of student success." },
      step: 'Compare participation rates for full-time students with those of part-time, transfer, online, and commuting students.' },
    { title: 'See what works for different groups of students',
      body: 'Institution-wide averages can hide meaningful differences. Break results out by student population so teams can see who is benefiting, where gaps remain, and which practices deserve a closer look.',
      peers: '<b>What the data showed:</b> Academic planning produced a <span class="cl-stat">+2%</span> persistence lift across the broader student population, but a <span class="cl-stat">+15%</span> lift for online students.',
      lens: { provost: 'Population-level results help leaders decide where to expand support, where to investigate uneven outcomes, and which questions need further study.',
              vp: 'Use segmented results to tailor support instead of assuming the same approach works equally well for every student.',
              ir: 'This is the foundation for the rest of the assessment. Advising, outreach, planning, career engagement, and connection become more useful when impact can be examined by population.',
              cio: 'Ensure teams can connect data across systems and access consistent definitions for populations, activities, and outcomes.' },
      step: 'Take one major student success initiative and compare its results across at least three student populations.' }
  ];

  /* --------- RECOMMENDATION LOGIC (spec: 2 lowest + conditional 3rd + role tiebreak) --------- */
  var ROLE_PRIORITY = {
    provost: [1, 5, 3, 4, 2, 6, 7],
    vp:      [2, 1, 4, 5, 6, 3, 7],
    ir:      [5, 4, 7, 2, 3, 6, 1],
    cio:     [4, 3, 1, 5, 7, 6, 2]
  };
  var SUPPORT_PAIRS = [[0, 1], [1, 2], [0, 3]];
  function supports(a, b) {
    if (a === 6 || b === 6) return true;
    return SUPPORT_PAIRS.some(function (p) { return (p[0] === a && p[1] === b) || (p[0] === b && p[1] === a); });
  }
  function pickRecommendations(scores, role) {
    var pr = ROLE_PRIORITY[role];
    var order = [0, 1, 2, 3, 4, 5, 6].sort(function (a, b) {
      return (scores[a] - scores[b]) || (pr[a] - pr[b]) || (a - b);
    });
    var picks = [order[0], order[1]];
    var third = order[2];
    var lowest = scores[order[0]];
    var tieAtLowest = scores.filter(function (s) { return s === lowest; }).length >= 3;
    var supportsPick = scores[third] < 2 && (supports(third, picks[0]) || supports(third, picks[1]));
    if (tieAtLowest && scores[third] === lowest) picks.push(third);
    else if (supportsPick) picks.push(third);
    return picks;
  }

  /* ---------------- STATE & HELPERS ---------------- */
  var state = { role: null, q: 0, answers: [null, null, null, null, null, null, null], resultsShown: false, formLoaded: false };
  function $(id) { return document.getElementById(id); }
  var SCREENS = ['cl-scr-intro', 'cl-scr-question', 'cl-scr-gate', 'cl-scr-results'];
  function show(id) {
    SCREENS.forEach(function (s) { $(s).classList.toggle('cl-active', s === id); });
    var top = $('cl-assess').getBoundingClientRect().top + window.pageYOffset - 40;
    window.scrollTo({ top: top > 0 ? top : 0 });
  }
  function track(name, params) {
    try {
      if (window.gtag) window.gtag('event', name, params || {});
      else if (window.dataLayer) window.dataLayer.push(Object.assign({ event: name }, params || {}));
    } catch (e) { /* analytics must never break the experience */ }
  }
  function currentScores() { return state.answers.map(function (i) { return ANSWERS[i].pts; }); }
  function currentTotal() { return currentScores().reduce(function (a, b) { return a + b; }, 0); }
  function currentProfile() {
    var t = currentTotal();
    return PROFILES.filter(function (p) { return t >= p.min && t <= p.max; })[0];
  }
  function currentRecTitles() {
    return pickRecommendations(currentScores(), state.role)
      .map(function (i) { return RECS[i].title; })
      .join('; ');
  }
  function buildResultsUrl() {
    return window.location.origin + window.location.pathname +
      '?r=' + encodeURIComponent(state.role) + '&a=' + state.answers.join('');
  }
  function hideFallback() {
    var fb = $('cl-hs-fallback');
    if (fb) { fb.hidden = true; fb.style.display = 'none'; }
  }
  function showFallback() {
    var fb = $('cl-hs-fallback');
    if (fb) { fb.hidden = false; fb.style.display = ''; }
  }
  function formIsPresent() {
    var mount = $('cl-hs-form');
    return !!(mount && mount.querySelector('form, iframe'));
  }

  /* ---------------- SHARED RESULTS LINK ---------------- */
  // If the URL carries ?r=<role>&a=<7 answers>, jump straight to
  // rendered results (no gate — the sharer already converted).
  function restoreFromUrl() {
    var params = new URLSearchParams(window.location.search);
    var r = params.get('r');
    var a = params.get('a');
    if (!r || !a || !ROLE_PRIORITY[r] || !/^[0-2]{7}$/.test(a)) return false;
    state.role = r;
    state.answers = a.split('').map(Number);
    state.resultsShown = true;
    renderResults();
    show('cl-scr-results');
    track('cl_results_view', { assessment_score: currentTotal(), assessment_profile: currentProfile().name, gate_source: 'shared_link' });
    return true;
  }

  /* ---------------- INTRO ---------------- */
  function initIntro() {
    ROLES.forEach(function (r) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'cl-role';
      b.innerHTML = r.name + '<span>' + r.desc + '</span>';
      b.addEventListener('click', function () {
        state.role = r.id;
        var all = document.querySelectorAll('#cl-role-grid .cl-role');
        for (var i = 0; i < all.length; i++) all[i].classList.remove('cl-selected');
        b.classList.add('cl-selected');
        $('cl-btn-start').disabled = false;
      });
      $('cl-role-grid').appendChild(b);
    });
    $('cl-btn-start').addEventListener('click', function () {
      state.q = 0; renderQ(); show('cl-scr-question');
      track('cl_assessment_start', { assessment_role: state.role });
    });
  }

  /* ---------------- QUESTIONS ---------------- */
  function renderQ() {
    var q = QUESTIONS[state.q];
    $('cl-progress').innerHTML = QUESTIONS.map(function (_, i) { return '<i class="' + (i <= state.q ? 'cl-done' : '') + '"></i>'; }).join('');
    $('cl-qcount').textContent = 'Question ' + (state.q + 1) + ' of 7';
    $('cl-qtitle').textContent = q.t;
    $('cl-qsub').textContent = q.s;
    $('cl-qopts').innerHTML = '';
    ANSWERS.forEach(function (a, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'cl-opt' + (state.answers[state.q] === i ? ' cl-selected' : '');
      b.innerHTML = '<b>' + a.label + '</b><em>' + a.desc + '</em>';
      b.addEventListener('click', function () { state.answers[state.q] = i; renderQ(); $('cl-btn-next').disabled = false; });
      $('cl-qopts').appendChild(b);
    });
    $('cl-btn-next').disabled = state.answers[state.q] === null;
    $('cl-btn-next').textContent = state.q === 6 ? 'Finish' : 'Next';
    $('cl-btn-back').style.visibility = state.q === 0 ? 'hidden' : 'visible';
  }
  function initQuestions() {
    $('cl-btn-next').addEventListener('click', function () {
      if (state.q < 6) { state.q++; renderQ(); }
      else {
        show('cl-scr-gate');
        loadHubSpotForm();
        track('cl_assessment_complete', { assessment_score: currentTotal(), assessment_profile: currentProfile().name });
        track('cl_gate_view', {});
      }
    });
    $('cl-btn-back').addEventListener('click', function () { if (state.q > 0) { state.q--; renderQ(); } });
  }

  /* ---------------- HUBSPOT GATE ---------------- */
  function setFieldValue(formEl, name, value) {
    // Handles both <input> and <select> hidden fields.
    // For selects, the option's internal VALUE must exactly match
    // what we send, or the field submits empty.
    var field = formEl.querySelector('[name="' + name + '"]');
    if (!field) return;
    if (field.tagName === 'SELECT') {
      var matched = false;
      for (var i = 0; i < field.options.length; i++) {
        if (field.options[i].value === value || field.options[i].text === value) {
          field.selectedIndex = i;
          matched = true;
          break;
        }
      }
      if (!matched) return; // no matching option — leave untouched
    } else {
      field.value = value;
    }
    field.dispatchEvent(new Event('input', { bubbles: true }));
    field.dispatchEvent(new Event('change', { bubbles: true }));
  }
  function setHiddenFields(formEl) {
    setFieldValue(formEl, HIDDEN_FIELDS.score, String(currentTotal()));
    setFieldValue(formEl, HIDDEN_FIELDS.profile, currentProfile().name);
    setFieldValue(formEl, HIDDEN_FIELDS.role, state.role);
    setFieldValue(formEl, HIDDEN_FIELDS.recommendations, currentRecTitles());
    setFieldValue(formEl, HIDDEN_FIELDS.resultsUrl, buildResultsUrl());
  }
  function loadHubSpotForm() {
    // Fallback must start hidden every time the gate appears —
    // it is only revealed if the form genuinely never renders.
    hideFallback();
    if (state.formLoaded) return;
    state.formLoaded = true;
    var s = document.createElement('script');
    s.src = 'https://js.hsforms.net/forms/embed/v2.js';
    s.async = true;
    s.onload = function () {
      if (!window.hbspt) return;
      $('cl-hs-form').innerHTML = '';
      window.hbspt.forms.create({
        region: CL_CONFIG.region,
        portalId: CL_CONFIG.portalId,
        formId: CL_CONFIG.formId,
        sfdcCampaignId: CL_CONFIG.sfdcCampaignId,
        target: '#cl-hs-form',
        onFormReady: function ($form) {
          hideFallback(); // form arrived — never show "couldn't load"
          var el = $form && $form.length ? $form[0] : document.querySelector('#cl-hs-form form');
          if (el) setHiddenFields(el);
        },
        onFormSubmitted: function () { revealResults('form'); }
      });
    };
    s.onerror = function () {
      // Script blocked outright (ad blocker) — no point waiting the full timeout
      if (!state.resultsShown) { showFallback(); track('cl_gate_form_blocked', {}); }
    };
    document.head.appendChild(s);
    // Backup listener: catches submission even if the embed renders in an iframe
    window.addEventListener('message', function (e) {
      if (e.data && e.data.type === 'hsFormCallback' && e.data.eventName === 'onFormSubmitted' && e.data.id === CL_CONFIG.formId) {
        revealResults('form');
      }
    });
    // Fail-open: if the form never rendered, don't strand the visitor
    setTimeout(function () {
      if (!state.resultsShown && !formIsPresent()) {
        showFallback();
        track('cl_gate_form_blocked', {});
      }
    }, CL_CONFIG.failOpenSeconds * 1000);
  }

  /* ---------------- RESULTS ---------------- */
  function revealResults(source) {
    if (state.resultsShown) return;
    state.resultsShown = true;
    renderResults();
    show('cl-scr-results');
    track('cl_results_view', { assessment_score: currentTotal(), assessment_profile: currentProfile().name, gate_source: source });
  }
  function renderResults() {
    var scores = currentScores();
    var total = currentTotal();
    var profile = currentProfile();
    var picks = pickRecommendations(scores, state.role);

    $('cl-r-profile').textContent = profile.name;
    $('cl-r-intro').textContent = 'Based on your answers, ' + profile.intro.charAt(0).toLowerCase() + profile.intro.slice(1);
    var bar = '';
    for (var i = 0; i < 14; i++) bar += '<i class="' + (i < total ? 'cl-fill' : '') + '"></i>';
    $('cl-r-bar').innerHTML = bar;
    $('cl-r-score').textContent = 'Your score: ' + total + ' of 14';
    $('cl-r-lede').textContent = 'We identified ' + (picks.length === 3 ? 'three' : 'two') + ' areas where your institution may have the clearest opportunity to improve persistence. Here is where to look first, what peer institutions have seen, and one practical place to begin.';

    var prio = ['Where to look first', 'Where to look second', 'Also worth attention'];
    $('cl-r-recs').innerHTML = '';
    picks.forEach(function (qi, n) {
      var rec = RECS[qi];
      var div = document.createElement('div');
      div.className = 'cl-card cl-rec';
      var tabs = ROLES.map(function (r) {
        return '<button type="button" class="cl-tab' + (r.id === state.role ? ' cl-on' : '') + '" data-r="' + r.id + '">' + r.name.split(' or ')[0] + '</button>';
      }).join('');
      div.innerHTML = '<p class="cl-priority">' + prio[n] + '</p><h3>' + rec.title + '</h3><p>' + rec.body + '</p>' +
        '<div class="cl-peers">' + rec.peers + '</div>' +
        '<div class="cl-tabs">' + tabs + '</div>' +
        '<div class="cl-lens" id="cl-lens-' + n + '">' + rec.lens[state.role] + '</div>' +
        '<p class="cl-step"><b>Suggested first step:</b> ' + rec.step + '</p>';
      $('cl-r-recs').appendChild(div);
      var tabEls = div.querySelectorAll('.cl-tab');
      for (var t = 0; t < tabEls.length; t++) {
        (function (tab) {
          tab.addEventListener('click', function () {
            for (var x = 0; x < tabEls.length; x++) tabEls[x].classList.remove('cl-on');
            tab.classList.add('cl-on');
            $('cl-lens-' + n).textContent = rec.lens[tab.getAttribute('data-r')];
          });
        })(tabEls[t]);
      }
    });
  }

  /* ---------------- CTAS & RESTART ---------------- */
  function initResults() {
    $('cl-cta-share').addEventListener('click', function () {
      var btn = $('cl-cta-share');
      var shareUrl = buildResultsUrl(); // link opens straight to these results
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareUrl).then(function () {
          btn.textContent = 'Link copied!';
          setTimeout(function () { btn.textContent = 'Share with a colleague'; }, 2000);
        });
      } else {
        window.location.href = 'mailto:?subject=Student%20Success%20Self%20Check&body=' + encodeURIComponent(shareUrl);
      }
      track('cl_share_click', {});
    });
    $('cl-btn-restart').addEventListener('click', function () {
      state.q = 0;
      state.answers = [null, null, null, null, null, null, null];
      state.resultsShown = false;
      // Clear any shared-results params so a fresh run starts clean
      if (window.location.search) {
        window.history.replaceState(null, '', window.location.pathname);
      }
      show('cl-scr-intro');
    });
    $('cl-btn-fallback').addEventListener('click', function () { revealResults('fallback'); });
  }

  /* ---------------- INIT ---------------- */
  function init() {
    initIntro(); initQuestions(); initResults();
    restoreFromUrl(); // shared link? jump straight to results
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
