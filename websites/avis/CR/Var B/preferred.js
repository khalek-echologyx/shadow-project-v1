/* ============================================================================
 * Avis "Pay with Points" — variant code for the condensed checkout test
 * ----------------------------------------------------------------------------
 * Context:
 *   The condensed-checkout variant skips /extras and /add-ons and takes users
 *   straight to /reservation/review-and-book. Because the original Pay-with-
 *   Points element relies on data fetched on /extras (protectionsData with
 *   freedayItem + redemptionStatus), it never renders in the variant.
 *
 *   Per Avis dev (latest spec), the element shows when ALL of:
 *     1. Region is NAM (avis.com).
 *     2. loyaltySummary.points > 0.
 *     3. EITHER protectionsData.freedayItem exists
 *        OR    protectionsData.redemptionStatus.isRedeemable === false.
 *
 *   Two states:
 *     A. Redemption possible — user picks number of days to redeem
 *        (1..rentalPeriod). On change, we POST the page's existing calculate
 *        body with `freedayItem: { quantity: N }` added so the price re-runs.
 *     B. Redemption not possible — informational block:
 *        "You would need {{perDayPoints}} of Avis Preferred Points for a free
 *         day or {{totalPoints}} for entire rental." (no controls)
 *
 *   On book-now, we also patch outgoing /reservation/create to inject
 *   `freedayItem: { quantity: N }` so the booking is created with the
 *   redemption applied.
 *
 *   Built for: Convert / Optimizely / VWO style variant injection.
 *   No deps. Idempotent. Self-cleans on SPA route changes.
 * ========================================================================== */

export function initPreferred() {
  'use strict';

  // ---------- Config -------------------------------------------------------
  var CFG = {
    pageMatch: /\/reservation\/review-and-book/i,

    endpoints: {
      // Note: /web/customer/loyalty/summary (401 — JWT server-only) and
      // /web/reservation/extras (404 — server-only Next.js BFF route) are
      // intentionally NOT called from this script. Loyalty & protections are
      // read from React fiber + Zustand store. See impl notes.
      calculate: '/web/reservation/price/calculate?context.locale=en-US'
    },

    // Patterns used by the fetch interceptor to capture/mutate outbound calls
    interceptPatterns: {
      calculate: /\/price\/calculate(\?|$)/i,
      create:    /\/reservation\/create(\?|$)/i
    },

    ss: {
      protectionsData:  'protectionsData',
      loyaltySummary:   'loyaltySummary',
      reservationStore: 'reservation.store'
    },

    // Confirmed against the live Avis Control page on /reservation/review-and-book.
    // Note: Avis uses `data-testid` (one word) — not `data-test-id`.
    selectors: {
      paymentSectionAnchor: '[data-testid="rc-paymentoptions-title"]',
      sectionTitle:         '[data-testid="rc-title"]',
      bookingSummaryRoot:   '[data-testid="rental-summary-title"], aside, .booking-summary',
      // Multiple selectors comma-separated — Avis renders the points value
      // in different places depending on page state.
      domPointsValue:       '[data-testid="points-value"], [data-testid="profile-menu-profile-btn"]',
      existingPwpCard:      '[data-testid="pay-with-points-container"]'
    },

    // i18n strings — defaults pulled from the Avis bundle
    copy: {
      sectionHeading:        'Save More By Using Your Points',
      preferredPointsLabel:  'AVIS PREFERRED POINTS:',
      pointsPerDay:          '{{n}} Pts/Day',
      freeRentalDayOne:      '1 day of Free Rental',
      freeRentalDayMany:     '{{n}} days of Free Rental',
      pointsNotRedeemable:   'Points cannot be redeemed for this reservation.',
      freeDayPointsNeeded:   'You would need {{forFreeDay}} of Avis Preferred Points for a free day or {{forFreeTrip}} for entire rental.',
      selectLabel:           'Select',
      daysToRedeem:          'Days to redeem'
    },

    debug: false
  };

  function readStore() {
    console.log("insideREadStore");
    try { return JSON.parse(sessionStorage.getItem(CFG.ss.reservationStore)) || {}; }
    catch (e) { return {}; }
  }

  function log() { if (CFG.debug) try { console.log.apply(console, ['[pwp]'].concat([].slice.call(arguments))); } catch (e) {} }

  // ---------- Fetch interceptor (install ASAP) -----------------------------
  var __pwpState = {
    quantity: 0,
    lastCalculateBody: null,
    lastCalculateUrl:  null
  };
  window.__avisPwpState = __pwpState;

  (function patchFetch() {
    if (window.__avisPwpFetchPatched) return;
    window.__avisPwpFetchPatched = true;
    var origFetch = window.fetch.bind(window);
    window.fetch = function (input, init) {
      try {
        console.log("pwp fetch")
        var url = (typeof input === 'string') ? input : (input && input.url) || '';
        init = init || {};
        if (CFG.interceptPatterns.calculate.test(url) && init.body && typeof init.body === 'string') {
          try {
            console.log("pwp calculate")
            var parsed = JSON.parse(init.body);
            console.log("parsedBody", parsed)
            __pwpState.lastCalculateBody = parsed;
            __pwpState.lastCalculateUrl  = url;
          } catch (e) {
            console.log("Error parsing calculate body", e)
          }
        }
        if (CFG.interceptPatterns.create.test(url) && __pwpState.quantity > 0 && init.body && typeof init.body === 'string') {
          try {
            var body = JSON.parse(init.body);
            body.freedayItem = { quantity: __pwpState.quantity };
            init.body = JSON.stringify(body);
          } catch (e) {}
        }
      } catch (e) {}
      return origFetch(input, init);
    };
  })();

  // Route guard — per-mount idempotency is in renderBlock so re-pasting works
  if (!CFG.pageMatch.test(location.pathname)) {
    console.log('[pwp] not on review-and-book — script idle. Current path:', location.pathname);
    return;
  }

  // ---------- Helpers ------------------------------------------------------
  function $(sel, root) { return (root || document).querySelector(sel); }

  function tpl(str, vars) {
    return Object.keys(vars || {}).reduce(function (s, k) {
      return s.replace(new RegExp('{{\\s*' + k + '\\s*}}', 'g'), String(vars[k]));
    }, str);
  }

  function fmtNum(n) { n = Number(n) || 0; return n.toLocaleString('en-US'); }

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function isNamRegion() { return /(^|\.)avis\.com$/i.test(location.hostname); }

  // ---- Bounded React fiber walk (fallback when DOM/store paths miss) ------
  var MAX_NODES       = 1200;
  var MAX_FIBER_DEPTH = 30;
  var MAX_HOPS        = 15;
  var MAX_OBJ_DEPTH   = 3;
  var WALL_CLOCK_MS   = 250;

  function fiberSearch(predicate) {
    var deadline = Date.now() + WALL_CLOCK_MS;
    var roots = document.querySelectorAll('body *');
    var n = Math.min(roots.length, MAX_NODES);
    for (var i = 0; i < n; i++) {
      if (Date.now() > deadline) return null;
      var el = roots[i];
      var keys = Object.keys(el).filter(function (k) { return k.indexOf('__reactFiber') === 0; });
      if (!keys.length) continue;
      var f = el[keys[0]];
      var depth = 0;
      while (f && depth < MAX_FIBER_DEPTH) {
        var props = ['memoizedProps', 'memoizedState', 'pendingProps'];
        for (var p = 0; p < props.length; p++) {
          var obj = f[props[p]];
          var match = obj && walkObj(obj, predicate, 0);
          if (match) return match;
        }
        f = f.return; depth++;
      }
    }
    return null;
  }
  function walkObj(obj, predicate, depth) {
    if (!obj || typeof obj !== 'object' || depth > MAX_OBJ_DEPTH) return null;
    try { if (predicate(obj)) return obj; } catch (e) {}
    if (depth >= MAX_OBJ_DEPTH - 1 && Array.isArray(obj)) return null;
    for (var k in obj) {
      try {
        var v = obj[k];
        if (v && typeof v === 'object') {
          var nested = walkObj(v, predicate, depth + 1);
          if (nested) return nested;
        }
      } catch (e) {}
    }
    return null;
  }
  function fiberHookSearch(predicate) {
    var deadline = Date.now() + WALL_CLOCK_MS;
    var roots = document.querySelectorAll('body *');
    var n = Math.min(roots.length, MAX_NODES);
    for (var i = 0; i < n; i++) {
      if (Date.now() > deadline) return null;
      var el = roots[i];
      var keys = Object.keys(el).filter(function (k) { return k.indexOf('__reactFiber') === 0; });
      if (!keys.length) continue;
      var f = el[keys[0]];
      var depth = 0;
      while (f && depth < MAX_FIBER_DEPTH) {
        var hook = f.memoizedState;
        var hopCount = 0;
        while (hook && hopCount < MAX_HOPS) {
          var v = hook.memoizedState;
          if (v && typeof v === 'object') {
            try { if (predicate(v)) return v; } catch (e) {}
          }
          hook = hook.next;
          hopCount++;
        }
        f = f.return;
        depth++;
      }
    }
    return null;
  }
  function fiberFromElement(el, predicate) {
    if (!el) return null;
    var keys = Object.keys(el).filter(function (k) { return k.indexOf('__reactFiber') === 0; });
    if (!keys.length) return null;
    var f = el[keys[0]];
    var depth = 0;
    while (f && depth < MAX_FIBER_DEPTH) {
      var props = ['memoizedProps', 'memoizedState', 'pendingProps'];
      for (var p = 0; p < props.length; p++) {
        var obj = f[props[p]];
        var match = obj && walkObj(obj, predicate, 0);
        if (match) return match;
      }
      var hook = f.memoizedState;
      var hop = 0;
      while (hook && hop < MAX_HOPS) {
        var v = hook.memoizedState;
        if (v && typeof v === 'object') {
          try { if (predicate(v)) return v; } catch (e) {}
        }
        hook = hook.next; hop++;
      }
      f = f.return; depth++;
    }
    return null;
  }

  // QA overrides — checked first so they survive any React re-render
  function readLoyaltyFromOverride() {
    if (window.__pwpForcePoints == null) return null;
    return {
      points:        String(window.__pwpForcePoints),
      status:        'ACTIVE',
      profileNumber: window.__pwpForceProfile || 'QA-TEST'
    };
  }
  function readProtectionsFromOverride() {
    if (!window.__pwpForceProtections) return null;
    return window.__pwpForceProtections;
  }

  function readLoyaltyFromFiber() {
    var pred = function (o) { return o && o.profileNumber && o.points != null; };
    var scoped = fiberFromElement($('[data-testid="profile-menu-container"]'), pred);
    if (scoped) return scoped;
    return fiberHookSearch(pred)
        || fiberSearch(function (o) { return o && o.profileNumber && o.points != null && o.status; })
        || null;
  }
  function readProtectionsFromFiber() {
    var pred = function (o) { return o && (o.freedayItem || o.redemptionStatus); };
    var scoped = fiberFromElement($('[data-testid="rc-paymentoptions-title"]'), pred)
              || fiberFromElement($('[data-testid="pay-with-points-container"]'), pred);
    if (scoped) return scoped;
    return fiberHookSearch(pred) || fiberSearch(pred) || null;
  }
  // DOM-based loyalty read — try multiple sources, since Avis renders the
  // points value in different places depending on page/state:
  //   - [data-testid="points-value"]         the PWP card's own points h4
  //   - [data-testid="profile-menu-profile-btn"]  the loyalty header button
  //                                          ("CHAIRMANS (274 pts) My profile")
  function readLoyaltyFromDom() {
    var sources = [
      $(CFG.selectors.domPointsValue),
      $('[data-testid="profile-menu-profile-btn"]'),
      $('[data-testid="profile-menu-container"]')
    ];
    for (var i = 0; i < sources.length; i++) {
      var el = sources[i];
      if (!el) continue;
      var text = el.textContent || '';
      // Match patterns like "274 Points", "274 pts", "1,400 Pts", "(274 pts)"
      var m = text.match(/(\d{1,3}(?:,\d{3})*|\d+)\s*(?:points|pts)\b/i);
      if (m) {
        var n = parseInt(m[1].replace(/,/g, ''), 10);
        if (n >= 0) {
          return { points: String(n), status: 'ACTIVE', profileNumber: null };
        }
      }
    }
    return null;
  }

  
  function writeStore(patch) {
    console.log(patch, "patch")
    var existing = readStore();
    existing.state = Object.assign({}, existing.state || {}, patch);
    existing.version = existing.version != null ? existing.version : 0;
    console.log(existing, "existing")
    try { sessionStorage.setItem(CFG.ss.reservationStore, JSON.stringify(existing)); } catch (e) {}
  }
  function persistProtections(data) {
    try { sessionStorage.setItem(CFG.ss.protectionsData, JSON.stringify(data)); } catch (e) {}
    writeStore({ protectionsData: data });
  }
  function persistLoyalty(loyalty) {
    try { sessionStorage.setItem(CFG.ss.loyaltySummary, JSON.stringify(loyalty)); } catch (e) {}
    writeStore({ loyaltySummary: loyalty });
  }

  // MutationObserver-based selector wait
  function waitFor(sel, timeoutMs) {
    return new Promise(function (resolve, reject) {
      var existing = $(sel);
      if (existing) return resolve(existing);
      var done = false;
      var observer = new MutationObserver(function () {
        var el = $(sel);
        if (el && !done) { done = true; observer.disconnect(); resolve(el); }
      });
      observer.observe(document.body, { childList: true, subtree: true });
      setTimeout(function () {
        if (done) return;
        done = true; observer.disconnect();
        reject(new Error('timeout: ' + sel));
      }, timeoutMs || 15000);
    });
  }

  // ---------- Eligibility --------------------------------------------------
  function isEligible(loyalty, protections) {
    if (!loyalty || !protections) return false;
    if (!isNamRegion()) return false;
    var pts = parseInt(loyalty.points, 10) || 0;
    if (pts <= 0) return false;
    var hasFreeDay = !!(protections.freedayItem);
    var explicitlyNotRedeemable = !!(protections.redemptionStatus
      && protections.redemptionStatus.isRedeemable === false);
    return hasFreeDay || explicitlyNotRedeemable;
  }

  function isRedeemableNow(loyalty, protections) {
    var canRedeem = !!(protections.redemptionStatus && protections.redemptionStatus.isRedeemable);
    var fd = protections.freedayItem;
    if (!canRedeem || !fd) return false;
    var have = parseInt(loyalty.points, 10) || 0;
    var perDay = Number(fd.perDayPoints) || 0;
    return perDay > 0 && have >= perDay;
  }

  // ---------- UI -----------------------------------------------------------
  function styleOnce() {
    if (document.getElementById('avis-pwp-styles')) return;
    // Styles copied 1:1 from Control's live computed styles on /review-and-book
    //   Card:  white, 8px radius, soft shadow, padding 32px 24px 24px
    //   Eyebrow heading & points-value: AvisHeadline 24px / 36px / 400, uppercase
    //   Sub-title: AvisSans 18px / 28px / 500
    //   Body / description: AvisSans 14px / 21px, black
    //   Avis red: rgb(212, 0, 42)
    var FONT_HEADLINE = 'AvisHeadline,"AvisHeadline Fallback",Georgia,serif';
    var FONT_BODY     = 'AvisSans,"AvisSans Fallback",-apple-system,Helvetica,Arial,sans-serif';
    var AVIS_RED      = 'rgb(212, 0, 42)';

    var css = ''
      + '#avis-pwp-block{font-family:' + FONT_BODY + ';color:#000;background:#fff;'
      +   'border-radius:8px;padding:32px 24px 24px;margin:16px 0 0 0;'
      +   'box-shadow:rgba(0,0,0,0.06) 0px 2px 8px 0px;}'
      // Label row: heading+title block on the left (inline row, gap 12px),
      // points value on the right.
      + '#avis-pwp-block .pwp-label-row{display:flex;flex-direction:row;gap:16px;'
      +   'justify-content:space-between;align-items:center;flex-wrap:wrap;}'
      + '#avis-pwp-block .pwp-label-text{display:flex;flex-direction:row;gap:12px;'
      +   'align-items:center;min-width:0;flex-wrap:wrap;}'
      + '#avis-pwp-block .pwp-eyebrow{font-family:' + FONT_HEADLINE + ';font-size:24px;'
      +   'font-weight:400;line-height:36px;letter-spacing:-0.8px;color:#000;'
      +   'text-transform:uppercase;margin:0;}'
      + '#avis-pwp-block .pwp-title{font-family:' + FONT_BODY + ';font-size:18px;'
      +   'font-weight:500;line-height:28px;color:#000;margin:0;}'
      + '#avis-pwp-block .pwp-points-value{font-family:' + FONT_HEADLINE + ';font-size:24px;'
      +   'font-weight:400;line-height:36px;color:' + AVIS_RED + ';margin:0 0 0 8px;'
      +   'white-space:nowrap;}'
      + '#avis-pwp-block .pwp-note{font-family:' + FONT_BODY + ';font-size:14px;'
      +   'line-height:21px;color:#000;margin:16px 0 0 0;padding:0;background:transparent;'
      +   'border:0;border-radius:0;}'
      + '#avis-pwp-block .pwp-row{display:flex;align-items:center;justify-content:space-between;'
      +   'gap:16px;margin-top:16px;}'
      + '#avis-pwp-block .pwp-picker{display:flex;align-items:center;gap:12px;flex:1;}'
      + '#avis-pwp-block .pwp-picker label{font-family:' + FONT_BODY + ';font-size:14px;'
      +   'color:#000;font-weight:500;}'
      + '#avis-pwp-block .pwp-picker select{font-family:' + FONT_BODY + ';padding:12px 14px;'
      +   'border:1px solid #c4c4c4;border-radius:8px;font-size:14px;background:#fff;'
      +   'cursor:pointer;min-width:240px;color:#000;}'
      + '#avis-pwp-block .pwp-picker select:focus{outline:2px solid ' + AVIS_RED + ';outline-offset:1px;}'
      + '#avis-pwp-block .pwp-picker select:disabled{opacity:0.55;cursor:not-allowed;}'
      + '#avis-pwp-block .pwp-pts{font-family:' + FONT_HEADLINE + ';font-size:18px;'
      +   'font-weight:400;color:' + AVIS_RED + ';white-space:nowrap;}'
      + '#avis-pwp-block .pwp-busy{font-family:' + FONT_BODY + ';font-size:13px;color:#666;margin-top:8px;}'
      + '#avis-pwp-block .pwp-error{font-family:' + FONT_BODY + ';font-size:13px;color:#a00;margin-top:8px;}';
    var s = document.createElement('style');
    s.id = 'avis-pwp-styles';
    s.textContent = css;
    document.head.appendChild(s);
  }

  // Mirror Control DOM:
  //   [pay-with-points-children-container]
  //     [points-label-container]   ← flex row, space-between
  //       [text stack]              ← flex row, gap 12, items inline
  //         <h4 points-heading>
  //         <div pay-with-points-title>
  //       <h4 points-value>
  //     <div pay-with-points-description-points>
  function renderHeader(loyalty) {
    return ''
      + '<div class="pwp-label-row" data-testid="points-label-container">'
      +   '<div class="pwp-label-text">'
      +     '<h4 class="pwp-eyebrow" data-testid="points-heading">' + escapeHtml(CFG.copy.preferredPointsLabel) + '</h4>'
      +     '<div class="pwp-title" data-testid="pay-with-points-title">' + escapeHtml(CFG.copy.sectionHeading) + '</div>'
      +   '</div>'
      +   '<h4 class="pwp-points-value" data-testid="points-value">' + fmtNum(loyalty.points || 0) + ' Points</h4>'
      + '</div>';
  }

  function renderRedeemable(loyalty, protections) {
    var fd = protections.freedayItem;
    var rentalPeriod = Math.max(1, Number(fd.rentalPeriod) || 1);
    var perDayPoints = Number(fd.perDayPoints) || 0;
    var have = parseInt(loyalty.points, 10) || 0;
    var maxDays = Math.min(rentalPeriod, Math.floor(have / Math.max(perDayPoints, 1)));

    var options = '<option value="0">' + escapeHtml(CFG.copy.selectLabel) + '</option>';
    for (var n = 1; n <= rentalPeriod; n++) {
      var disabled = n > maxDays ? ' disabled' : '';
      var label = (n === 1 ? CFG.copy.freeRentalDayOne : tpl(CFG.copy.freeRentalDayMany, { n: n }));
      var pts = perDayPoints * n;
      options += '<option value="' + n + '"' + disabled + '>'
              + escapeHtml(label) + ' — ' + fmtNum(pts) + ' Pts'
              + '</option>';
    }

    return ''
      + '<div class="pwp-row" id="avis-pwp-row">'
      +   '<div class="pwp-picker">'
      +     '<label for="avis-pwp-days">' + escapeHtml(CFG.copy.daysToRedeem) + '</label>'
      +     '<select id="avis-pwp-days" data-testid="pay-with-points-day-select">'
      +       options
      +     '</select>'
      +   '</div>'
      +   '<span class="pwp-pts">' + tpl(CFG.copy.pointsPerDay, { n: fmtNum(perDayPoints) }) + '</span>'
      + '</div>';
  }

  function renderNotRedeemable(protections) {
    var fd = protections.freedayItem || {};
    var perDayPoints = Number(fd.perDayPoints) || 0;
    var totalPoints  = Number(fd.totalPoints)  || 0;
    var note = '';
    if (perDayPoints > 0 || totalPoints > 0) {
      note = tpl(CFG.copy.freeDayPointsNeeded, {
        forFreeDay:  fmtNum(perDayPoints || totalPoints),
        forFreeTrip: fmtNum(totalPoints  || perDayPoints)
      });
    } else {
      note = CFG.copy.pointsNotRedeemable;
    }
    return '<div class="pwp-note" data-testid="pay-with-points-description-points">' + escapeHtml(note) + '</div>';
  }

  function renderBlock(loyalty, protections) {
    if (document.getElementById('avis-pwp-block')) return;
    if ($(CFG.selectors.existingPwpCard)) { log('control PWP already on page — skipping render'); return; }
    styleOnce();

    var canRedeem = isRedeemableNow(loyalty, protections);
    var inner = ''
              + '<div class="pwp-children" data-testid="pay-with-points-children-container">'
              +   renderHeader(loyalty)
              +   (canRedeem ? renderRedeemable(loyalty, protections)
                             : renderNotRedeemable(protections))
              + '</div>'
              + '<div class="pwp-busy" id="avis-pwp-busy" hidden>Updating price…</div>'
              + '<div class="pwp-error" id="avis-pwp-err" hidden></div>';

    var block = document.createElement('div');
    block.id = 'avis-pwp-block';
    block.setAttribute('data-testid', 'pay-with-points-container');
    block.innerHTML = inner;

    var anchor = $(CFG.selectors.paymentSectionAnchor) || $(CFG.selectors.bookingSummaryRoot);
    if (anchor) {
      var paper = anchor.closest && anchor.closest('.MuiPaper-root');
      var insertTarget = paper || anchor;
      insertTarget.parentNode.insertBefore(block, insertTarget);
    } else {
      document.body.appendChild(block);
    }

    if (canRedeem) {
      var picker = $('#avis-pwp-days', block);
      if (picker) {
        picker.addEventListener('change', function (e) {
          var qty = parseInt(e.target.value, 10) || 0;
          onQuantityChange(qty, protections);
        });
      }
    }
  }

  // ---------- Calculate (price recalc) -------------------------------------
  function setBusy(on) { var n = $('#avis-pwp-busy'); if (n) n.hidden = !on; }
  function setError(msg) { var n = $('#avis-pwp-err'); if (!n) return; n.textContent = msg || ''; n.hidden = !msg; }

  function onQuantityChange(qty, protections) {
    setError(''); setBusy(true);
    __pwpState.quantity = qty;
    writeStore({ payWithPoints: qty > 0, freedayItemQuantity: qty });
    callCalculate(qty)
      .then(function (resp) {
        setBusy(false);
        if (resp && resp.price) writeStore({ price: resp.price });
        window.dispatchEvent(new CustomEvent('avis:pwp:changed', {
          detail: { quantity: qty, response: resp }
        }));
      })
      .catch(function (err) {
        setBusy(false);
        setError('Sorry, we could not apply your points. Please try again.');
        var picker = $('#avis-pwp-days');
        if (picker) picker.value = '0';
        __pwpState.quantity = 0;
        writeStore({ payWithPoints: false, freedayItemQuantity: 0 });
      });
  }

  // ⚠ KNOWN GAP — booking summary won't auto-update from this call.
  // The calculate response lands in our hand; we write to reservation.store
  // but Avis's booking-summary subscribes to its Zustand price slice via
  // React state. To make the summary reflect the discount, the dev team
  // needs to wire the day-picker into the same redemption action Control
  // uses on /protectioncoverage. The book-now /create call still includes
  // freedayItem via the fetch interceptor, so the booking IS made with the
  // redemption applied.
  function callCalculate(qty) {
    var template = __pwpState.lastCalculateBody;
    console.log(template, "template")
    var url = __pwpState.lastCalculateUrl || CFG.endpoints.calculate;
    console.log(url, "url")
    if (!template) template = buildCalculateBodyFromStore();
    console.log(template, "template2")
    if (!template) return Promise.reject(new Error('no calculate template available yet'));
    var body = Object.assign({}, template);
    console.log(body, "reqBody")
    body.freedayItem = qty > 0 ? { quantity: qty } : null;
    return fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body)
    }).then(function (r) {
      if (!r.ok) throw new Error('calculate ' + r.status);
      return r.json();
    });
  }

  function buildCalculateBodyFromStore() {

    var sessionData = (readStore().state || {});
    console.log(sessionData, "rez")
    if (!sessionData) return null;
    const addOnItemsForCalc = sessionData.addOnItemsBackup ? sessionData.addOnItemsBackup.split(",").map((item, index) => {
      return {
        code: item || "",
        quantity: sessionData.addOnItemsQuantity.split(",")[index] === "false" ? null : Number(sessionData.addOnItemsQuantity.split(",")[index]) || "",
      }
    }) : [];
    console.log(addOnItemsForCalc, "addOnItemsForCalc")
    const payloadForCalc = {
      pickupLocation: sessionData.pickUpLocationMnemonic || sessionData.pickupLocationCode || sessionData.pickup_location_code,
      dropoffLocation: sessionData.dropOffLocationMnemonic || sessionData.returnLocationCode || sessionData.return_location_code,
      pickupDate: sessionData.pickupDatetime.split("T")[0],
      pickupTime: (function () {
        var h = parseInt(sessionData.pickupHour, 10);
        var ampm = (sessionData.pickupAmPm || "").toUpperCase();
        if (ampm === "PM" && h !== 12) h += 12;
        if (ampm === "AM" && h === 12) h = 0;
        return (h < 10 ? "0" + h : String(h)) + ":00";
      })(),
      dropoffDate:         sessionData.returnDatetime.split("T")[0],
      dropoffTime:         (function () {
        var h = parseInt(sessionData.returnHour, 10);
        var ampm = (sessionData.returnAmPm || "").toUpperCase();
        if (ampm === "PM" && h !== 12) h += 12;
        if (ampm === "AM" && h === 12) h = 0;
        return (h < 10 ? "0" + h : String(h)) + ":00";
      })(),
      age:                 Number(sessionData.age) || 25,
      discountCodes:       [],
      priceView:           sessionData.priceView || "LOWEST_PRICE",
      countryOfResidence:  sessionData.residencyValue || 'US',
      currencyCode:        sessionData.userSelectedCurrency || 'USD',
      vehicleCode:         sessionData.vehicleCode || "",
      vehicleId:           sessionData.vehicleId  || "",
      priceRateCode:       sessionData.priceRateCode || "",
      priceType:           sessionData.priceType || "VEHICLE_LEISURE_PAY_NOW",
      addOnItems:          addOnItemsForCalc,
      isAvisFirst:         sessionData.isAvisFirst || false
    };
    console.log(payloadForCalc, "payloadForCalc")
    return payloadForCalc;
  }

  // ---------- QA helpers ---------------------------------------------------
  // window.__pwpQaMode() — sets sensible override defaults so the redeemable
  // picker shows up on any page state (no real auth/data needed).
  window.__pwpQaMode = function (opts) {
    opts = opts || {};
    window.__pwpForcePoints = opts.points != null ? opts.points : 99999;
    window.__pwpForceProtections = opts.protections || {
      freedayItem:      { perDayPoints: 1400, rentalPeriod: 5, totalPoints: 7000 },
      redemptionStatus: { isRedeemable: true }
    };
    window.__pwpRerender();
    return '[pwp] QA mode on — points=' + window.__pwpForcePoints;
  };

  // window.__pwpRerender() — removes any existing card and re-runs boot.
  window.__pwpRerender = function () {
    var existing = document.getElementById('avis-pwp-block');
    if (existing) existing.remove();
    document.querySelectorAll('[data-testid="pay-with-points-container"]').forEach(function (el) {
      if (el.id !== 'avis-pwp-block') {
        var paper = el.closest('.MuiPaper-root');
        (paper || el).remove();
      }
    });
    boot();
    return '[pwp] re-rendered';
  };

  // window.__pwpDiagnose() — one-shot status snapshot.
  window.__pwpDiagnose = function () {
    var loyalty     = readLoyaltyFromOverride() || readLoyaltyFromDom() || readLoyaltyFromFiber();
    var protections = readProtectionsFromOverride()
                   || (readStore().state || {}).protectionsData
                   || readProtectionsFromFiber();
    var pts = parseInt(loyalty && loyalty.points, 10) || 0;
    var fd  = protections && protections.freedayItem;
    var rs  = protections && protections.redemptionStatus;
    var report = {
      onCorrectRoute: CFG.pageMatch.test(location.pathname),
      isNamRegion:    isNamRegion(),
      pointsOverride: window.__pwpForcePoints != null ? window.__pwpForcePoints : null,
      loyalty:        loyalty ? { points: loyalty.points, status: loyalty.status, profile: loyalty.profileNumber } : null,
      protections:    { freedayItem: fd || null, redemptionStatus: rs || null },
      eligibilityChecks: {
        nam:                       isNamRegion(),
        pointsAboveZero:           pts > 0,
        freedayOrNotRedeemable:    !!fd || (rs && rs.isRedeemable === false)
      },
      isEligibleOverall:           isEligible(loyalty, protections),
      canRedeemNow:                loyalty && protections ? isRedeemableNow(loyalty, protections) : false,
      blockInDom:                  !!document.getElementById('avis-pwp-block'),
      controlCardInDom:            (function () {
        var matches = document.querySelectorAll(CFG.selectors.existingPwpCard);
        for (var i = 0; i < matches.length; i++) {
          if (matches[i].id !== 'avis-pwp-block') return true;
        }
        return false;
      })(),
      paymentAnchorPresent:        !!$(CFG.selectors.paymentSectionAnchor),
      fetchPatchInstalled:         !!window.__avisPwpFetchPatched,
      lastCalculateBodyCaptured:   !!__pwpState.lastCalculateBody
    };
    console.log('[pwp] diagnose:', report);
    return report;
  };

  // ---------- Boot ---------------------------------------------------------
  function boot() {
    window.__avisPayWithPointsMounted = true;

    // Loyalty: override → DOM (waits for points-value, 4s) → fiber walk
    var override = readLoyaltyFromOverride();
    var pLoyalty;
    if (override) {
      pLoyalty = Promise.resolve(override);
    } else {
      pLoyalty = waitFor(CFG.selectors.domPointsValue, 4000)
        .then(function () { return readLoyaltyFromDom(); })
        .catch(function () { return readLoyaltyFromFiber(); });
    }
    pLoyalty = pLoyalty.then(function (s) { if (s) persistLoyalty(s); return s; });

    // Protections: override → store.protectionsData → fiber walk
    var protectionsOverride = readProtectionsFromOverride();
    var existingProtections = (readStore().state || {}).protectionsData || null;
    var pExtras = Promise.resolve(
      protectionsOverride
        || ((existingProtections && (existingProtections.freedayItem || existingProtections.redemptionStatus))
              ? existingProtections
              : readProtectionsFromFiber())
    ).then(function (p) { if (p) persistProtections(p); return p; });

    Promise.all([pLoyalty, pExtras]).then(function (parts) {
      console.log(parts, "parts")
      var loyalty = parts[0];
      var protections = parts[1];

      var pts = parseInt(loyalty && loyalty.points, 10) || 0;
      var fd  = protections && protections.freedayItem;
      var rs  = protections && protections.redemptionStatus;
      var eligible = isEligible(loyalty, protections);
      console.log('[pwp] boot complete:',
        'eligible=' + eligible,
        '| nam=' + isNamRegion(),
        '| points=' + pts,
        '| freedayItem=' + (fd ? 'yes' : 'no'),
        '| isRedeemable=' + (rs ? rs.isRedeemable : 'unknown'),
        '| controlCardOnPage=' + !!$(CFG.selectors.existingPwpCard)
      );

      if (!eligible) {
        console.log('[pwp] not eligible — call __pwpDiagnose() for details');
        return;
      }

      waitFor(CFG.selectors.paymentSectionAnchor, 20000)
        .catch(function () { return null; })
        .then(function () { renderBlock(loyalty, protections); });
    });
  }

  function watchRoute() {
    var lastPath = location.pathname;
    setInterval(function () {
      if (location.pathname === lastPath) return;
      lastPath = location.pathname;
      window.__avisPayWithPointsMounted = false;
      var existing = document.getElementById('avis-pwp-block');
      if (existing) existing.remove();
      __pwpState.quantity = 0;
      if (CFG.pageMatch.test(location.pathname)) boot();
    }, 500);
  }

  // Defer to next tick so paste-time work doesn't block the main thread
  function start() {
    setTimeout(function () { boot(); watchRoute(); }, 0);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
}