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

export function preferredPoint() {
  'use strict';

  // ---------- Config -------------------------------------------------------
  var CFG = {
    pageMatch: /\/reservation\/review-and-book/i,

    endpoints: {
      // Note: /web/customer/loyalty/summary (401 — JWT server-only) and
      // /web/reservation/extras (404 — server-only Next.js BFF route) are
      // intentionally NOT called from this script. Loyalty & protections are
      // read from React fiber + Zustand store. See impl notes.
      //
      // The full URL is built dynamically in callCalculate() to include the
      // correlationIdentifier from sessionStorage — Avis's BFF requires it.
      calculatePath: '/web/reservation/price/calculate'
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
      // Anchors checked in order; PWP card is inserted just before the
      // first one that's present. paymentoptions-title matches Control's
      // exact placement; flight-details-title is the fallback when the
      // page doesn't render a payment section (variant flows where
      // checkout is condensed and payment is on a later step).
      paymentSectionAnchor: '[data-testid="rc-paymentoptions-title"]',
      flightDetailsAnchor:  '[data-testid="rc-flight-details-title"]',
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

  function log() { if (CFG.debug) try { console.log.apply(console, ['[pwp]'].concat([].slice.call(arguments))); } catch (e) {} }

  // ---------- Fetch interceptor (install ASAP) -----------------------------
  var __pwpState = {
    quantity: 0,                  // freedayItem.quantity
    payWithPointsCodes: [],       // add-on codes paid with points
    lastCalculateBody: null,
    lastCalculateUrl:  null
  };
  window.__avisPwpState = __pwpState;

  (function patchFetch() {
    if (window.__avisPwpFetchPatched) return;
    window.__avisPwpFetchPatched = true;
    var origFetch = window.fetch.bind(window);
    window.fetch = function (input, init) {
      var capturedCalculate = false;
      try {
        var url = (typeof input === 'string') ? input : (input && input.url) || '';
        init = init || {};
        if (CFG.interceptPatterns.calculate.test(url) && init.body && typeof init.body === 'string') {
          try {
            var parsed = JSON.parse(init.body);
            // Modify the outgoing body so EVERY calculate (host or ours) has
            // our payWithPoints flags applied. Host doesn't know about our
            // toggle, so without this its calculate body would request the
            // points-paid items at full cash price.
            var pwpCodes = __pwpState.payWithPointsCodes || [];
            if (pwpCodes.length) {
              parsed.addOnItems = Array.isArray(parsed.addOnItems) ? parsed.addOnItems.slice() : [];
              parsed.addOnItems = parsed.addOnItems.map(function (item) {
                return pwpCodes.indexOf(item.code) > -1
                  ? Object.assign({}, item, { payWithPoints: true })
                  : item;
              });
              var existingCodes = parsed.addOnItems.map(function (i) { return i.code; });
              pwpCodes.forEach(function (code) {
                if (existingCodes.indexOf(code) === -1) {
                  parsed.addOnItems.push({ code: code, payWithPoints: true });
                }
              });
              init.body = JSON.stringify(parsed);
            }
            __pwpState.lastCalculateBody = parsed;
            __pwpState.lastCalculateUrl  = url;
            capturedCalculate = true;
          } catch (e) {}
        }
        // Inject points-related fields into /reservation/create on book-now.
        // Verified live shape: addOnItems get a per-item payWithPoints:true.
        var pwpHasFreeday = __pwpState.quantity > 0;
        var pwpHasAddOnCodes = (__pwpState.payWithPointsCodes || []).length > 0;
        if (CFG.interceptPatterns.create.test(url) && (pwpHasFreeday || pwpHasAddOnCodes) && init.body && typeof init.body === 'string') {
          try {
            var body = JSON.parse(init.body);
            if (pwpHasFreeday) body.freedayItem = { quantity: __pwpState.quantity };
            if (pwpHasAddOnCodes) {
              // Apply payWithPoints flag to existing items in body.addOnItems
              // (host built the body), and add any pwp codes the host doesn't
              // have. We can't rebuild from store here because the host's
              // create body has fields beyond addOnItems we shouldn't touch.
              body.addOnItems = Array.isArray(body.addOnItems) ? body.addOnItems.slice() : [];
              body.addOnItems = body.addOnItems.map(function (item) {
                return __pwpState.payWithPointsCodes.indexOf(item.code) > -1
                  ? Object.assign({}, item, { payWithPoints: true })
                  : item;
              });
              var existingCodes = body.addOnItems.map(function (i) { return i.code; });
              __pwpState.payWithPointsCodes.forEach(function (code) {
                if (existingCodes.indexOf(code) === -1) {
                  body.addOnItems.push({ code: code, payWithPoints: true });
                }
              });
            }
            init.body = JSON.stringify(body);
          } catch (e) {}
        }
      } catch (e) {}

      var p = origFetch(input, init);
      // After ANY calculate response (ours or the host variant's), re-apply
      // our points indicator from our authoritative state. This stops the
      // host's calculates (which don't include our payWithPoints flags) from
      // wiping the indicator.
      if (capturedCalculate) {
        // Capture the response and re-sync the entire summary 150ms later
        // (gives the host time to finish its own render cycle first; our
        // sync is the last write, ensuring our state-driven values stick).
        p = p.then(function (r) {
          try {
            r.clone().json().then(function (j) {
              __pwpState.lastCalculateResponse = j;
              setTimeout(function () {
                if (typeof syncSummary === 'function') syncSummary(j);
              }, 150);
            }).catch(function () {});
          } catch (e) {}
          return r;
        });
      }
      return p;
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

  // Compute the actual rental length in days. Tries multiple sources so we
  // get a reliable answer even when one of them is missing:
  //   1. protectionsData.price.rentalDays (most direct, when present)
  //   2. Difference between pickup and return dates from the store
  //   3. Falls back to 0 (caller decides what to do)
  function getRentalDays() {
    var s = (readStore().state || {});
    var pd = s.protectionsData;
    if (pd && pd.price && pd.price.rentalDays) {
      var n = Number(pd.price.rentalDays);
      if (n > 0) return n;
    }
    var py = Number(s.pickupYear), pm = Number(s.pickupMonth), pdy = Number(s.pickupDay);
    var ry = Number(s.returnYear), rm = Number(s.returnMonth), rdy = Number(s.returnDay);
    if (py && pm && pdy && ry && rm && rdy) {
      var pickup = new Date(py, pm - 1, pdy);
      var ret    = new Date(ry, rm - 1, rdy);
      var ms = ret - pickup;
      if (ms > 0) return Math.ceil(ms / 86400000);
    }
    return 0;
  }

  // Build the calculate endpoint URL with all the BFF-required context
  // params. The correlationIdentifier in particular is required — Avis's
  // BFF rejects calls without it, which is one cause of our earlier 400s.
  function buildCalculateUrl() {
    var corrId = '';
    try { corrId = sessionStorage.getItem('correlationIdentifier') || ''; } catch (e) {}
    var qs = 'context.locale=en-US'
           + '&context.domainCountry=US'
           + (corrId ? '&context.correlationIdentifier=' + encodeURIComponent(corrId) : '')
           + '&device=WEB';
    return CFG.endpoints.calculatePath + '?' + qs;
  }

  // Format a number as a currency-prefixed price string ("$209.95"). Mirrors
  // the helper used in the MVT-36 variant.
  function formatPrice(currencyCode, amount) {
    var formatted = Number(amount || 0).toLocaleString('en', {
      minimumFractionDigits: 2, maximumFractionDigits: 2
    });
    var symbol;
    try {
      symbol = (0).toLocaleString('en', { style: 'currency', currency: currencyCode || 'USD' })
                   .replace(/[\d\s.,]/g, '');
    } catch (e) { symbol = '$'; }
    if (/[a-zA-Z]/.test(symbol)) return symbol + ' ' + formatted;
    return symbol + formatted;
  }

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
  // Read loyalty from reservation.store.state.loyaltySummary (where Avis or
  // our own persistLoyalty() writes it). Cheapest source — just a JSON parse.
  function readLoyaltyFromStore() {
    var s = (readStore().state || {});
    var ls = s.loyaltySummary;
    if (!ls || ls.points == null) return null;
    return {
      points:        String(ls.points),
      status:        ls.status || 'ACTIVE',
      profileNumber: ls.profileNumber || null
    };
  }

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

  function readStore() {
    try { return JSON.parse(sessionStorage.getItem(CFG.ss.reservationStore)) || {}; }
    catch (e) { return {}; }
  }
  function writeStore(patch) {
    var existing = readStore();
    existing.state = Object.assign({}, existing.state || {}, patch);
    existing.version = existing.version != null ? existing.version : 0;
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
    if (!loyalty) return false;
    if (!isNamRegion()) return false;
    var pts = parseInt(loyalty.points, 10) || 0;
    if (pts <= 0) return false;
    // Eligible if EITHER day redemption is available OR any add-on can be
    // paid with points. Some rates support only one; don't bail on the
    // other path just because the rate doesn't support free-day redemption.
    return isDayEligible(protections) || isAddOnEligible();
  }

  function isDayEligible(protections) {
    if (!protections) return false;
    var hasFreeDay = !!(protections.freedayItem);
    var explicitlyNotRedeemable = !!(protections.redemptionStatus
      && protections.redemptionStatus.isRedeemable === false);
    return hasFreeDay || explicitlyNotRedeemable;
  }

  function isAddOnEligible() {
    return Object.keys(getAddOnEligibilityMap()).length > 0;
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
      +   'border-radius:8px;padding:32px 24px 24px;margin:24px 0 24px 0;'
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
    var perDayPoints = Number(fd.perDayPoints) || 0;
    var have = parseInt(loyalty.points, 10) || 0;

    // Cap the picker by the strictest of the three constraints:
    //   - freedayItem.rentalPeriod (what the backend says is allowed)
    //   - actual rental length in days (so we never offer more days than the
    //     booking covers — handles QA mode where rentalPeriod might be off)
    //   - what the user can actually afford (points ÷ perDayPoints)
    var bookingDays    = getRentalDays();
    var backendAllowed = Math.max(1, Number(fd.rentalPeriod) || 1);
    var rentalPeriod   = bookingDays > 0
      ? Math.min(backendAllowed, bookingDays)
      : backendAllowed;
    var maxAffordable  = Math.floor(have / Math.max(perDayPoints, 1));
    var maxDays        = Math.min(rentalPeriod, maxAffordable);

    // Only render options up to the actual rental length. Options the user
    // can't afford are still rendered but disabled so they can see why.
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

    // Always place the PWP card immediately after the add-ons section. We
    // anchor on rc-flight-details-title (which is the next section after
    // add-ons in the variant layout) — NOT on the payment section, since
    // that comes and goes based on the user's payment-method choice and
    // would cause the card to jump around. paymentSectionAnchor and
    // bookingSummaryRoot are kept as last-resort fallbacks for layouts
    // that don't have a flight-details section either.
    var anchor = $(CFG.selectors.flightDetailsAnchor)
              || $(CFG.selectors.paymentSectionAnchor)
              || $(CFG.selectors.bookingSummaryRoot);
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
        // Direct-DOM update of the booking summary — this is the bit that
        // actually makes the user *see* the discount. Mirrors the pattern the
        // MVT-36 variant uses for its own protection/add-on toggles.
        updateBookingSummary(resp);
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

  // Single, idempotent function that syncs the entire booking summary from
  // the latest calculate response. Replaces the previous tangle of multiple
  // update paths (per-section functions, observer-triggered re-renders,
  // separate handlers for our calc vs the host's). Called from ONE place
  // after each calc response. Idempotent — running it twice with the same
  // response produces the same result, no duplicate rows.
  function syncSummary(calc) {
    if (!calc) return;
    var cc = calc.currencyCode || 'USD';
    var totals = calc.totals || {};

    function setText(sel, value) {
      var el = $(sel);
      if (el && value != null) el.textContent = value;
    }

    // Total — straight from response (correct because our calc body had
    // payWithPoints flags applied via the interceptor).
    if (totals.total != null) {
      var totalStr = formatPrice(cc, Number(totals.total).toFixed(2));
      setText('[data-testid="rental-summary-total-value"]', totalStr);
      setText('[data-testid="action-footer-total-amount"]', totalStr);
    }

    // Protections & Add-ons header — CASH cost only. Use addOnTotal +
    // protectionTotal, NOT rentalOptionsTotal (gross — includes points-paid
    // items at full pre-discount price, which is wrong to display).
    var paCash = (Number(totals.addOnTotal) || 0) + (Number(totals.protectionTotal) || 0);
    if (totals.addOnTotal != null || totals.protectionTotal != null) {
      setText('[data-testid="rental-summary-protection-addons-recent-cost"]',
        formatPrice(cc, paCash.toFixed(2)));
    }
    if (totals.taxAndFreeTotal != null) {
      setText('[data-testid="rental-summary-taxes-fees-recent-cost"]',
        formatPrice(cc, Number(totals.taxAndFreeTotal).toFixed(2)));
    }
    if (calc.savings) {
      var s = calc.savings;
      if (s.totalSavings != null) {
        setText('[data-testid="rental-summary-savings-discounts-recent-cost"]',
          formatPrice(cc, Number(s.totalSavings).toFixed(2)));
      }

      // Re-render the inner items inside the Savings & discounts accordion.
      // Verified live on beta.avis.com: points redemption is NOT surfaced as
      // a savings line — points are tracked separately via totals.totalPoints
      // and displayed in the action footer (handled below). The savings
      // dropdown only contains genuine cash-discount fields.
      var sd = $('[aria-label="Savings & discounts"]');
      if (sd) {
        var existing = sd.querySelector(':scope > .MuiAccordionDetails-root, :scope > #pwp-summary-savings');
        if (existing) try { existing.remove(); } catch (e) { }
        const existingMvtEl = sd.querySelector('.accordion-wrapper');
        if (existingMvtEl) try { existingMvtEl.remove(); } catch (e) { }

        var rows = '';
        function row(label, amount) {
          if (!amount || Number(amount) === 0) return '';
          return '<div class="pwp-summary-row" style="display:flex;justify-content:space-between;color:#736d6d;font-size:14px;line-height:20px;padding:4px 0;">'
               + '<span>' + escapeHtml(label) + '</span>'
               + '<span>' + escapeHtml(formatPrice(cc, Number(amount).toFixed(2))) + '</span>'
               + '</div>';
        }
        rows += row('Pay Now Savings',               s.payNowSavings);
        rows += row('Protection & Add-ons Savings',  s.extrasSavings);
        rows += row('Discount Code Savings',         s.discountCodeSavings);
        rows += row('Member Credit',                 s.memberCreditAmt);

        if (rows) {
          var wrap = document.createElement('div');
          wrap.id = 'pwp-summary-savings';
          wrap.style.cssText = 'padding:4px 24px;';
          wrap.innerHTML = rows;
          sd.appendChild(wrap);
        }
      }
    }

    // Sync the points-paid rows in Protections & Add-ons. Idempotent: removes
    // ALL of our previously injected rows first, then re-creates exactly what
    // the response says should be there. No duplicates possible.
    syncPointsPaidRows(calc);

    // Hide the host's "You have not added any protections or add-ons"
    // placeholder when we have at least one add-on (cash or points). Host's
    // MVT-36 hides it from its own calc handler, but our calc doesn't trigger
    // that, so we mirror the same logic.
    syncEmptyAddOnsPlaceholder(calc);

    // "Applied Preferred Points (X Points)" indicator in the action footer
    updatePointsAppliedIndicator(calc);

    // "Applied Preferred Points" accordion section in the booking summary
    renderAppliedPointsSection();

    // Re-evaluate add-on cards. If a protection bundle was just selected
    // that includes one of our points-paid items, the card now has the
    // .included class — enhanceAddOnCards strips our toggle off and removes
    // the code from payWithPointsCodes. If a bundle was just deselected,
    // the toggle gets re-injected on the next pass.
    var l = readLoyaltyFromOverride() || readLoyaltyFromStore() || readLoyaltyFromDom() || readLoyaltyFromFiber();
    var p = readProtectionsFromOverride() || (readStore().state || {}).protectionsData;
    if (l && p) enhanceAddOnCards(l, p);
  }

  // Backwards-compatible alias for older call sites
  function updateBookingSummary(calc) { syncSummary(calc); }

  // Hide / show the host's empty-state placeholder text in the P&A accordion.
  // The placeholder lives as the next sibling of the
  // [data-testid="category-expand-button-protections-addons"] header and
  // shows "You have not added any protections or add-ons" when the section
  // has no items. Host hides it from their own calc handler; we mirror that.
  function syncEmptyAddOnsPlaceholder(calc) {
    var hasItems = false;
    if (calc && Array.isArray(calc.addOnItems) && calc.addOnItems.length > 0) hasItems = true;
    if (!hasItems && Array.isArray(calc && calc.protectionItems) && calc.protectionItems.length > 0) hasItems = true;
    // Belt-and-braces: also count our injected rows
    if (!hasItems && document.querySelectorAll('[id^="pwp-injected-paddon-"]').length > 0) hasItems = true;

    var btn = document.querySelector('[data-testid="category-expand-button-protections-addons"]');
    if (!btn) return;
    var placeholder = btn.nextSibling;
    while (placeholder && placeholder.nodeType !== 1) placeholder = placeholder.nextSibling; // skip whitespace
    if (!placeholder) return;
    if (!/added any protections or add[-\s]?ons/i.test(placeholder.textContent || '')) return;
    placeholder.style.display = hasItems ? 'none' : '';
  }

  // Idempotent row injection. Always wipes our previous rows, then re-injects
  // exactly the points-paid items from the latest response. No state to keep
  // in sync, no race conditions between observers and direct calls.
  function syncPointsPaidRows(calc) {
    // 1. Wipe every row we've previously injected
    document.querySelectorAll('[id^="pwp-injected-paddon-"]').forEach(function (r) {
      try { r.remove(); } catch (e) {}
    });
    __pwpState.injectedAddOnRows = {};

    if (!calc || !Array.isArray(calc.addOnItems)) return;
    var cc = calc.currencyCode || 'USD';

    // 2. Update existing host-rendered rows AND inject ours for missing
    //    points-paid items. (The host filters items with netSubtotal === 0,
    //    so points-paid items are typically missing from its render.)
    calc.addOnItems.forEach(function (item) {
      if (!item || !item.code) return;
      var price = Number(item.netSubtotal != null ? item.netSubtotal : item.amount) || 0;
      var existing = findProtAddOnRowByCode(item.code);

      if (existing) {
        // Update the amount cell. Use direct DOM navigation rather than a
        // CSS selector — selectors like '.MuiBox-root:last-child span' get
        // confused when the row itself happens to be the last child of its
        // container, and end up matching the DESCRIPTION span instead of the
        // amount, wiping the item's name.
        // Row structure (host's MVT-36 + ours):
        //   <div class="...mvt-36-summary-prot-item">
        //     <span class="sum-prot-item-desc">DESC</span>   ← first child
        //     <div class="MuiBox-root"><span>$X</span></div> ← last child
        //   </div>
        if (existing.classList.contains('mvt-36-summary-prot-item')) {
          var amountWrapper = existing.lastElementChild;
          var firstChild   = existing.firstElementChild;
          if (amountWrapper && amountWrapper !== firstChild) {
            var amountSpan = amountWrapper.querySelector('span') || amountWrapper;
            amountSpan.textContent = formatPrice(cc, price.toFixed(2));
          }
        }
      } else if (item.payWithPoints) {
        injectProtectionsAddOnRow(item, price, cc);
      }
    });
  }

  // (updateProtectionsAddOnsAmounts removed — replaced by syncPointsPaidRows
  // which is fully idempotent: wipes our previous rows then re-creates them.)

  // Find the inner container where Protections & Add-ons rows live. The
  // running variant (MVT-36 style) replaces the host's MuiAccordionDetails
  // with its own #mvt-36-summary-prot wrapper — items go inside that.
  // We try variant-specific containers first, then fall back to anything
  // that looks like the accordion-details panel.
  function findProtectionsAddOnsContainer() {
    var mvt = document.querySelector('#mvt-36-summary-prot');
    if (mvt) return { container: mvt, source: 'mvt-36-summary-prot' };

    var pa = document.querySelector('[aria-label="Protections & Add-ons"]');
    if (pa) {
      // Variant may inject .MuiAccordionDetails-root inside; prefer that as
      // the row container.
      var details = pa.querySelector(':scope > .MuiAccordionDetails-root, :scope .MuiAccordionDetails-root');
      return { container: details || pa, source: details ? 'mui-accordion-details' : 'aria-label' };
    }

    var firstDesc = document.querySelector('[data-testid^="cost-"][data-testid$="-description"]');
    if (firstDesc) {
      var probe = firstDesc;
      for (var i = 0; i < 6; i++) {
        var parent = probe.parentElement;
        if (!parent) break;
        if (parent.querySelectorAll('[data-testid^="cost-"][data-testid$="-description"]').length >= 1) {
          return { container: parent, source: 'cost-row-parent', anchor: firstDesc };
        }
        probe = parent;
      }
    }

    var btn = document.querySelector('[data-testid="category-expand-button-protections-addons"]');
    if (btn) {
      var accordion = btn.closest('.MuiAccordion-root, [class*="Accordion"]');
      if (accordion) {
        var details2 = accordion.querySelector('.MuiAccordionDetails-root');
        if (details2) return { container: details2, source: 'accordion-details' };
        return { container: accordion, source: 'accordion-ancestor' };
      }
    }
    return null;
  }

  // Find an existing row in Protections & Add-ons by code. Handles both the
  // variant's row format (.mvt-36-summary-prot-item with .sum-prot-item-desc)
  // and the legacy cost-N-description testid pattern.
  function findProtAddOnRowByCode(code) {
    var mvtRows = document.querySelectorAll('.mvt-36-summary-prot-item');
    for (var i = 0; i < mvtRows.length; i++) {
      if ((mvtRows[i].textContent || '').indexOf('(' + code + ')') > -1) return mvtRows[i];
    }
    var descRows = document.querySelectorAll('[data-testid^="cost-"][data-testid$="-description"]');
    for (var j = 0; j < descRows.length; j++) {
      if ((descRows[j].textContent || '').indexOf('(' + code + ')') > -1) return descRows[j];
    }
    return null;
  }

  // Insert a new row into the Protections & Add-ons accordion for an add-on
  // the user has chosen to pay with points but hasn't otherwise added to
  // their cart. Matches the host variant's row format (.mvt-36-summary-prot-
  // item with .sum-prot-item-desc) so visuals and downstream lookups treat
  // it like any other add-on row.
  function injectProtectionsAddOnRow(item, price, cc) {
    var found = findProtectionsAddOnsContainer();
    if (!found) {
      console.warn('[pwp] Protections & Add-ons container not found — cannot inject row for', item.code);
      return;
    }

    var rowParent = found.container;
    var row = document.createElement('div');
    row.id = 'pwp-injected-paddon-' + item.code;

    // Match the variant's row classes so the host's CSS picks it up. Inline
    // style as a belt-and-braces fallback in case the host's CSS isn't
    // present yet at injection time.
    row.className = 'MuiBox-root mvt-36-summary-prot-item';
    row.style.cssText = 'display:flex !important;justify-content:space-between;align-items:center;'
                     + 'color:rgb(82, 77, 77);'
                     + 'font-family:AvisSans,\'AvisSans Fallback\',-apple-system,Helvetica,Arial,sans-serif;'
                     + 'font-size:14px;line-height:20px;padding:0 0 4px 0;';

    var descSpan = document.createElement('span');
    descSpan.className = 'checkout-redesign MuiTypography-root MuiTypography-bodySmallRegular sum-prot-item-desc';
    descSpan.style.cssText = 'color:#1ea238 !important;';
    descSpan.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="10" viewBox="0 0 14 10" fill="none" style="margin-right:4px;vertical-align:middle;">'
                      + '<path d="M13.2604 0.59375L4.55208 9.30208L0.59375 5.34375" stroke="#1EA238" stroke-width="1.1875" stroke-linecap="round" stroke-linejoin="round"/>'
                      + '</svg> '
                      + escapeHtml(getAddOnDescription(item.code));

    var amountWrapper = document.createElement('div');
    amountWrapper.className = 'MuiBox-root';
    var amountSpan = document.createElement('span');
    amountSpan.className = 'MuiTypography-root MuiTypography-bodySmallRegular';
    amountSpan.textContent = formatPrice(cc, price.toFixed(2));
    amountWrapper.appendChild(amountSpan);

    row.appendChild(descSpan);
    row.appendChild(amountWrapper);

    rowParent.appendChild(row);
    console.log('[pwp] injected protections row for', item.code, 'into', found.source);

    __pwpState.injectedAddOnRows = __pwpState.injectedAddOnRows || {};
    __pwpState.injectedAddOnRows[item.code] = { price: price, cc: cc };

    ensureProtectionsObserver();
  }

  // MutationObserver as a safety net. If the host re-renders the summary
  // (e.g. after its own calc) and wipes our injected rows, we re-run
  // syncSummary with the last cached response. Single point of injection,
  // no risk of duplicates.
  var __pwpProtAddObs = null;
  var __pwpSyncing = false;
  function ensureProtectionsObserver() {
    if (__pwpProtAddObs) return;
    var stable = document.querySelector('[data-testid="rental-summary-wrapper"]')
              || document.querySelector('aside')
              || document.body;
    if (!stable) return;

    __pwpProtAddObs = new MutationObserver(function () {
      if (__pwpSyncing) return; // ignore mutations our own sync caused
      var pwpCodes = __pwpState.payWithPointsCodes || [];
      var anyMissing = pwpCodes.some(function (code) {
        return !findProtAddOnRowByCode(code);
      });
      if (anyMissing && __pwpState.lastCalculateResponse) {
        __pwpSyncing = true;
        try { syncSummary(__pwpState.lastCalculateResponse); }
        finally { setTimeout(function () { __pwpSyncing = false; }, 50); }
      }
    });
    __pwpProtAddObs.observe(stable, { childList: true, subtree: true });
  }

  // Static fallback map of common add-on codes → human names. Used when the
  // page hasn't rendered a card we can read the name from (e.g. WFI lives
  // in a collapsed "view all" section). Keep in sync with Avis's i18n.
  var __pwpCodeToName = {
    ADR: 'Additional Driver',
    ADD: 'Additional Driver',
    BBS: 'Baby Seat',
    CBS: 'Child Booster Seat',
    CIS: 'Child Infant Seat',
    CSS: 'Child Safety Seat',
    CFS: 'Child Front-Facing Seat',
    CSB: 'Child Seat Booster',
    GPS: 'Hands-Free Navigation',
    GSO: 'Fuel Plans',
    RSN: 'Extended Roadside Assistance',
    SKR: 'Ski Rack',
    TOL: 'E-Toll Unlimited',
    WFI: 'Mobile Wi-Fi',
    XMR: 'SiriusXM Radio',
    TPR: 'Travel Partner'
  };

  // Look up an add-on's human-readable description by code. Output format:
  // "Hands-Free Navigation (GPS)" — matches what Avis renders when the
  // card title includes the code in parens, and constructs the same shape
  // when the card title doesn't (e.g. "Child Safety Seats" → "Child Safety
  // Seats (CSS)"). Multi-source so we always get something readable.
  function getAddOnDescription(code) {
    // 1. Match by data-code attribute on add-on cards (most reliable source)
    var cards = document.querySelectorAll('.add-on-card, [data-testid="single-addons-item-card-container"]');
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      // Look for any element with matching data-code inside the card
      var coded = card.querySelector('[data-code="' + code + '"]');
      if (!coded) {
        // Some cards might put data-code on the card itself
        if (card.getAttribute('data-code') !== code) continue;
      }
      var nameEl = card.querySelector('[data-testid="single-addons-item-name"], .add-on-title, h4, h3');
      if (!nameEl) continue;
      var nameText = (nameEl.textContent || '').trim();
      if (!nameText) continue;
      // If card name already includes "(CODE)" use it as-is, else append it
      return nameText.indexOf('(' + code + ')') > -1 ? nameText : nameText + ' (' + code + ')';
    }
    // 2. Match by "(CODE)" text in any rendered Protections & Add-ons row
    var rendered = document.querySelectorAll('[data-testid^="cost-"][data-testid$="-description"]');
    for (var r = 0; r < rendered.length; r++) {
      var txt = (rendered[r].textContent || '').trim();
      if (txt.indexOf('(' + code + ')') > -1) return txt;
    }
    // 3. pricesAddOnItems store slice (when populated by host)
    var s = (readStore().state || {});
    var prices = s.pricesAddOnItems || [];
    for (var p = 0; p < prices.length; p++) {
      if (prices[p].code === code && prices[p].description) return prices[p].description;
    }
    // 4. Static fallback table for common codes whose cards we couldn't find
    if (__pwpCodeToName[code]) return __pwpCodeToName[code] + ' (' + code + ')';
    // 5. Last resort — just the code in brackets
    return '(' + code + ')';
  }

  // Build & insert (or update) the "Applied Preferred Points" accordion
  // section in the booking summary. Items list is computed from our state:
  //   - free-day redemption (one row, e.g. "2 days of Free Rental")
  //   - each toggled add-on (one row each, by description)
  function renderAppliedPointsSection() {
    var sectionId = 'pwp-applied-points-section';
    var existing  = document.getElementById(sectionId);

    var items = [];
    var fd = getFreedayItem();
    if (__pwpState.quantity > 0 && fd) {
      var perDay = Number(fd.perDayPoints) || 0;
      var label = (__pwpState.quantity === 1)
        ? CFG.copy.freeRentalDayOne
        : tpl(CFG.copy.freeRentalDayMany, { n: __pwpState.quantity });
      items.push({ label: label, points: perDay * __pwpState.quantity });
    }
    var elig = getAddOnEligibilityMap();
    (__pwpState.payWithPointsCodes || []).forEach(function (code) {
      if (!elig[code]) return;
      items.push({
        label:  getAddOnDescription(code),
        points: Number(elig[code].pointValuePoints) || 0
      });
    });

    var totalPoints = items.reduce(function (sum, i) { return sum + (i.points || 0); }, 0);
    if (!totalPoints) {
      if (existing) existing.remove();
      return;
    }

    // Build the section markup
    var rowsHTML = items.map(function (it) {
      return ''
        + '<div class="pwp-app-pts-row" style="display:flex;justify-content:space-between;'
        +   'padding:4px 24px;font-size:14px;line-height:20px;color:#1a1a1a;'
        +   'font-family:AvisSans,\'AvisSans Fallback\',-apple-system,Helvetica,Arial,sans-serif;">'
        +   '<span>' + escapeHtml(it.label) + '</span>'
        +   '<span style="color:#1ea238;font-weight:500;white-space:nowrap;">' + fmtNum(it.points) + ' Points</span>'
        + '</div>';
    }).join('');

    var headerHTML = ''
      + '<div class="pwp-app-pts-header" style="display:flex;justify-content:space-between;align-items:center;'
      +   'padding:12px 24px;font-size:14px;font-weight:700;line-height:20px;'
      +   'border-top:1px solid #e0e0e0;color:#1a1a1a;'
      +   'font-family:AvisSans,\'AvisSans Fallback\',-apple-system,Helvetica,Arial,sans-serif;">'
      +   '<span>Applied Preferred Points</span>'
      +   '<span style="color:#1ea238;font-weight:500;white-space:nowrap;">' + fmtNum(totalPoints) + ' Points</span>'
      + '</div>';

    var bodyHTML = '<div class="pwp-app-pts-body" style="padding:4px 0 12px 0;">' + rowsHTML + '</div>';

    if (existing) {
      existing.innerHTML = headerHTML + bodyHTML;
      return;
    }

    // Insert at the end of the booking-summary wrapper, after the Total row
    var wrapper = $('[data-testid="rental-summary-wrapper"]');
    if (!wrapper) {
      console.warn('[pwp] rental-summary-wrapper not found; cannot render Applied Preferred Points section');
      return;
    }
    var section = document.createElement('div');
    section.id = sectionId;
    section.innerHTML = headerHTML + bodyHTML;
    wrapper.appendChild(section);
  }

  // Compute committed points from OUR internal state (freedayItem.quantity ×
  // perDayPoints + sum of payWithPoints add-on costs). This is authoritative
  // — we don't trust calc.totals.totalPoints alone because the host variant
  // may fire its own calculate without our payWithPoints flags, returning
  // totalPoints: 0 and wiping the indicator.
  function getStateCommittedPoints() {
    var fd = getFreedayItem();
    var freedayCost = (__pwpState.quantity > 0 && fd)
      ? __pwpState.quantity * (Number(fd.perDayPoints) || 0)
      : 0;
    var addOnCost = 0;
    var elig = getAddOnEligibilityMap();
    (__pwpState.payWithPointsCodes || []).forEach(function (code) {
      if (elig[code]) addOnCost += Number(elig[code].pointValuePoints) || 0;
    });
    return freedayCost + addOnCost;
  }

  function updatePointsAppliedIndicator(calc) {
    // Prefer our authoritative state. Fall back to backend totalPoints only
    // when state has nothing committed (e.g. user externally cleared, or on
    // first paint before our state has been touched).
    var statePts = getStateCommittedPoints();
    var respPts = calc && calc.totals && Number(calc.totals.totalPoints || 0);
    var pts = statePts || respPts || 0;
    var existing = document.getElementById('pwp-applied-points');
    if (!pts) {
      if (existing) existing.remove();
      return;
    }
    var label = 'Applied Preferred Points (' + fmtNum(pts) + ' Points)';
    if (existing) {
      existing.textContent = label;
      return;
    }

    // Build the indicator node
    var node = document.createElement('span');
    node.id = 'pwp-applied-points';
    node.style.cssText = 'color:#1ea238;font-size:14px;font-weight:500;margin-right:16px;'
                       + 'white-space:nowrap;align-self:center;'
                       + 'font-family:AvisSans,"AvisSans Fallback",-apple-system,Helvetica,Arial,sans-serif;';
    node.textContent = label;

    // Find the Total label / amount in the footer and place the indicator
    // immediately before it, in the same parent so they sit on one row.
    var totalLabel  = $('[data-testid="action-footer-total-label"]');
    var totalAmount = $('[data-testid="action-footer-total-amount"]');
    var actionFooter = $('[data-testid="ancillaries-action-footer"]');

    var inserted = false;
    var anchorNode = totalLabel || totalAmount;
    if (anchorNode) {
      // Walk up until the parent has multiple children (i.e. a real row).
      // That sibling-rich parent is where we insert before the anchor.
      var probe = anchorNode;
      for (var i = 0; i < 6; i++) {
        var parent = probe.parentElement;
        if (!parent) break;
        if (parent.children.length > 1) {
          parent.insertBefore(node, probe);
          inserted = true;
          break;
        }
        probe = parent;
      }
    }
    if (!inserted && actionFooter) {
      actionFooter.insertBefore(node, actionFooter.firstChild);
      inserted = true;
    }
    if (!inserted) {
      // Last resort — pin to the bottom-right of the viewport so QA can at
      // least see the points are tracked, and log so we can fix the anchor.
      console.warn('[pwp] could not locate action-footer anchor; pinning indicator to viewport');
      node.style.cssText += ';position:fixed;bottom:16px;right:200px;z-index:9999;background:#fff;padding:4px 8px;border-radius:4px;box-shadow:0 1px 4px rgba(0,0,0,0.2);';
      document.body.appendChild(node);
    }
  }

  function callCalculate(qty) {
    var template = __pwpState.lastCalculateBody;
    // Always rebuild the URL fresh so we pick up the latest correlationIdentifier
    var url = buildCalculateUrl();
    if (!template) template = buildCalculateBodyFromStore();
    if (!template) return Promise.reject(new Error('no calculate template available yet'));
    var body = Object.assign({}, template);
    body.freedayItem = qty > 0 ? { quantity: qty } : null;

    // Build addOnItems from the host's source of truth — state.addOnItems
    // (CSV of selected codes) plus state.addOnItemsQuantity (parallel CSV of
    // quantities) — so we always include exactly what's in the user's cart,
    // not whatever stale snapshot the captured template happens to have. We
    // then layer our payWithPoints flags on top.
    var pwpCodes = __pwpState.payWithPointsCodes || [];
    body.addOnItems = buildAddOnItemsForCalc(pwpCodes);

    console.log('[pwp] POST', url, body);

    return fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body)
    }).then(function (r) {
      if (!r.ok) {
        return r.text().then(function (txt) {
          console.error('[pwp] calculate failed', r.status, txt);
          throw new Error('calculate ' + r.status);
        });
      }
      return r.json();
    });
  }

  // Build a calculate body from the Zustand-persisted reservation.store. This
  // is the fallback path when the page hasn't yet fired a calculate call for
  // our fetch interceptor to capture. Verified against live store shape:
  // dates/times are stored as separate Year/Month/Day/Hour/Minute/AmPm fields
  // and need to be reassembled into ISO 8601 (YYYY-MM-DD) and 24-hour (HH:MM)
  // formats the calculate API expects.
  // Build the addOnItems array for our calculate body from the host's source
  // of truth (state.addOnItems CSV + state.addOnItemsQuantity CSV), then
  // layer payWithPoints flags on top for items in pwpCodes. Adds any codes
  // from pwpCodes that aren't in the host's selection (so e.g. toggling
  // "Add Using Points" on RSN that wasn't yet in the cart still sends RSN).
  function buildAddOnItemsForCalc(pwpCodes) {
    pwpCodes = pwpCodes || [];
    var s = (readStore().state || {});
    var hostCodes = String(s.addOnItems || '')
      .split(',').map(function (c) { return c.trim(); }).filter(Boolean);
    var hostQuantities = String(s.addOnItemsQuantity || '')
      .split(',').map(function (q) { return q.trim(); });

    var items = [];
    hostCodes.forEach(function (code, i) {
      var item = { code: code };
      var qty = hostQuantities[i];
      if (qty && qty !== 'false' && qty !== '') {
        var n = parseInt(qty, 10);
        if (!isNaN(n)) item.quantity = n;
      } else {
        item.quantity = null;
      }
      if (pwpCodes.indexOf(code) > -1) item.payWithPoints = true;
      items.push(item);
    });

    // Add any payWithPoints codes that aren't in the host's cart yet
    var existing = items.map(function (i) { return i.code; });
    pwpCodes.forEach(function (code) {
      if (existing.indexOf(code) === -1) {
        items.push({ code: code, payWithPoints: true });
      }
    });
    return items;
  }

  function buildCalculateBodyFromStore() {
    var s = (readStore().state || {});
    if (!s.pickupLocationCode || !s.vehicleCode) return null;

    function pad2(n) { n = String(n); return n.length === 1 ? '0' + n : n; }
    function fmtDate(y, m, d) {
      if (!y || !m || !d) return null;
      return y + '-' + pad2(m) + '-' + pad2(d);
    }
    function fmtTime(h, m, ampm) {
      if (h == null || m == null) return null;
      var hh = parseInt(h, 10);
      if (isNaN(hh)) return null;
      if (ampm) {
        var a = String(ampm).toUpperCase();
        if (a === 'PM' && hh !== 12) hh += 12;
        if (a === 'AM' && hh === 12) hh = 0;
      }
      return pad2(hh) + ':' + pad2(m);
    }

    // Discount codes: the store has awdCode + couponCode; reconstruct the
    // shape the API expects ({type, value[, membershipId]}). If neither is
    // set we send an empty array (the dev spec allows this).
    var discountCodes = [];
    if (s.awdCode) {
      var dc = { type: 'PARTNER', value: s.awdCode };
      if (s.iata) dc.membershipId = s.iata;
      discountCodes.push(dc);
    }
    if (s.couponCode) discountCodes.push({ type: 'COUPON', value: s.couponCode });

    return {
      pickupLocation:      s.pickupLocationCode,
      dropoffLocation:     s.returnLocationCode,
      pickupDate:          fmtDate(s.pickupYear, s.pickupMonth, s.pickupDay),
      pickupTime:          fmtTime(s.pickupHour, s.pickupMinute, s.pickupAmPm),
      dropoffDate:         fmtDate(s.returnYear, s.returnMonth, s.returnDay),
      dropoffTime:         fmtTime(s.returnHour, s.returnMinute, s.returnAmPm),
      age:                 Number(s.age) || 25,
      discountCodes:       discountCodes,
      priceView:           s.priceView || 'AWD_CODE',
      countryOfResidence:  String(s.country || 'us').toUpperCase(),
      currencyCode:        'USD',
      vehicleCode:         s.vehicleCode,
      vehicleId:           s.vehicleId,
      priceRateCode:       s.priceRateCode,
      priceType:           s.priceType || 'VEHICLE_LEISURE_PAY_NOW',
      addOnItems:          [],     // selected add-ons would go here if any
      protectionItems:     [],
      isAvisFirst:         !!s.isAvisFirst
    };
  }

  // ---------- QA helpers ---------------------------------------------------
  // window.__pwpQaMode() — sets sensible override defaults so the redeemable
  // picker shows up on any page state (no real auth/data needed).
  window.__pwpQaMode = function (opts) {
    opts = opts || {};
    // Default rentalPeriod to the actual booking length so the picker can't
    // offer more days than the user is renting for.
    var actualDays = getRentalDays() || 2;
    var perDay = 1400;
    window.__pwpForcePoints = opts.points != null ? opts.points : 99999;
    window.__pwpForceProtections = opts.protections || {
      freedayItem:      { perDayPoints: perDay, rentalPeriod: actualDays, totalPoints: perDay * actualDays },
      redemptionStatus: { isRedeemable: true }
    };
    window.__pwpRerender();
    return '[pwp] QA mode on — points=' + window.__pwpForcePoints + ', days=' + actualDays;
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
      lastCalculateBodyCaptured:   !!__pwpState.lastCalculateBody,
      freedayQuantitySelected:     __pwpState.quantity || 0,
      addOnsPaidWithPoints:        (__pwpState.payWithPointsCodes || []).slice(),
      addOnsEligibleForPoints:     Object.keys(getAddOnEligibilityMap()),
      committedPointsTotal:        loyalty && protections ? getCommittedPoints(loyalty, protections) : 0
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

    // Protections acquisition order:
    //   1. QA override (if set)
    //   2. Existing reservation.store.state.protectionsData (server-rendered)
    //   3. Direct fetch of /web/reservation/extras — runs BEFORE the
    //      eligibility check so first-page-load works. Without this the
    //      script would idle when protectionsData is empty (variant skips
    //      the /protectioncoverage server-render that normally populates
    //      it), forcing the user to refresh.
    //   4. Iframe prefetch of /protectioncoverage as a last resort
    //   5. Fiber walk
    var protectionsOverride = readProtectionsFromOverride();
    var existingProtections = (readStore().state || {}).protectionsData || null;
    var hasUsable = function (p) { return p && (p.freedayItem || p.redemptionStatus); };

    var pExtras;
    if (protectionsOverride) {
      pExtras = Promise.resolve(protectionsOverride);
    } else if (hasUsable(existingProtections)) {
      pExtras = Promise.resolve(existingProtections);
    } else {
      // Try the direct extras endpoint first — fast and reliable when the
      // user is signed in and the correlationIdentifier is in sessionStorage.
      // After a successful fetch we read from our own __pwpState.extras cache
      // (resilient to host store wipes), then fall back to the store, then
      // to fiber walk as a last resort.
      pExtras = fetchExtrasIfMissing().then(function () {
        if (__pwpState.extras && (__pwpState.extras.freedayItem || __pwpState.extras.redemptionStatus)) {
          return {
            freedayItem:      __pwpState.extras.freedayItem,
            redemptionStatus: __pwpState.extras.redemptionStatus,
            addOnItems:       __pwpState.extras.addOnItems || []
          };
        }
        var fresh = (readStore().state || {}).protectionsData || null;
        if (hasUsable(fresh)) return fresh;
        return readProtectionsFromFiber();
      });
    }
    pExtras = pExtras.then(function (p) { if (p) persistProtections(p); return p; });

    Promise.all([pLoyalty, pExtras]).then(function (parts) {
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

      // Wait for EITHER the payment section OR the flight-details anchor —
      // both are valid insertion points and we want to proceed as soon as
      // either appears (instead of timing out for 20s on flows that don't
      // have a payment section).
      waitFor(CFG.selectors.paymentSectionAnchor + ', ' + CFG.selectors.flightDetailsAnchor, 20000)
        .catch(function () { return null; })
        .then(function () {
          // Only render the PWP card (with day picker / not-redeemable text)
          // when the rate actually supports day redemption. If only add-on
          // redemption is available, skip the card and just enhance add-on
          // toggles — showing "Points cannot be redeemed" on the card would
          // be misleading because they CAN be redeemed (just on add-ons).
          if (isDayEligible(protections)) {
            renderBlock(loyalty, protections);
          } else {
            console.log('[pwp] day redemption not available for this rate — skipping PWP card, enhancing add-on toggles only');
          }
          startCardEnhancer(loyalty, protections);
          enhanceAddOnCards(loyalty, protections);
          fetchExtrasIfMissing().then(function (didFetch) {
            if (didFetch) {
              console.log('[pwp] re-enhancing cards after extras fetch');
              enhanceAddOnCards(loyalty, protections);
            }
          });
        });
    });
  }

  // ---------- Per-add-on "Add Using Points" toggles ------------------------
  // Mirrors what beta.avis.com's /addons page surfaces on each redeemable
  // add-on card. On the variant flow the cards are already rendered into
  // /review-and-book (by the host MVT-36 variant code or similar); we just
  // inject the points toggle next to the existing "Add to trip" control.
  //
  // Verified live calculate body shape (per-item flag):
  //   addOnItems: [{ code: "GPS", payWithPoints: true }, { code: "RSN" }]
  // Eligibility per dev spec: show toggle if (item.pointValuePoints +
  //   alreadyCommitted) <= userPointBalance. Items the user can't afford
  //   render disabled rather than hidden, mirroring beta.

  function getAddOnEligibilityMap() {
    // Prefer our cache (resilient to host store wipes), fall back to store
    var items = (__pwpState.extras && __pwpState.extras.addOnItems)
             || ((readStore().state || {}).addOnsData || {}).addOnItems
             || [];
    var map = {};
    items.forEach(function (item) {
      if (item && item.loyalty && item.loyalty.pointValuePoints) {
        map[item.code] = item.loyalty;
      }
    });
    return map;
  }

  // Read freedayItem with fallback chain: __pwpState.extras (our cache),
  // then store's protectionsData. Used by render and eligibility logic so
  // that if the host wipes our store writes the data is still available.
  function getFreedayItem() {
    if (__pwpState.extras && __pwpState.extras.freedayItem) return __pwpState.extras.freedayItem;
    var pd = (readStore().state || {}).protectionsData;
    return pd && pd.freedayItem || null;
  }

  // Fetch /web/reservation/extras directly to populate addOnsData. The
  // variant flow skips the /addons URL, so Avis doesn't populate
  // reservation.store.state.addOnsData server-side, leaving us with no
  // loyalty info per add-on item. Verified live (MVT-36 variant): with
  // the correlationIdentifier in the URL the BFF accepts the call.
  var __pwpExtrasFetched = false;
  function fetchExtrasIfMissing() {
    if (__pwpExtrasFetched) return Promise.resolve(false);
    var s = (readStore().state || {});
    var ad = s.addOnsData || {};
    if (ad.addOnItems && ad.addOnItems.some(function (i) { return i.loyalty && i.loyalty.pointValuePoints; })) {
      // Already have eligibility data; nothing to fetch
      return Promise.resolve(false);
    }
    if (!s.pickupLocationCode || !s.vehicleCode) return Promise.resolve(false);

    var corrId = '';
    try { corrId = sessionStorage.getItem('correlationIdentifier') || ''; } catch (e) {}
    var url = '/web/reservation/extras'
            + '?context.locale=en-US'
            + '&context.domainCountry=US'
            + (corrId ? '&context.correlationIdentifier=' + encodeURIComponent(corrId) : '')
            + '&device=WEB';

    function pad2(n) { n = String(n); return n.length === 1 ? '0' + n : n; }
    function fmtDate(y, m, d) { return y + '-' + pad2(m) + '-' + pad2(d); }
    function fmtTime(h, m, ampm) {
      var hh = parseInt(h, 10);
      if (isNaN(hh)) return '12:00';
      var a = String(ampm || '').toUpperCase();
      if (a === 'PM' && hh !== 12) hh += 12;
      if (a === 'AM' && hh === 12) hh = 0;
      return pad2(hh) + ':' + pad2(m || 0);
    }

    var discountCodes = [];
    if (s.awdCode) discountCodes.push({ type: 'PARTNER', value: s.awdCode });
    if (s.couponCode) discountCodes.push({ type: 'COUPON', value: s.couponCode });

    var payload = {
      pickupLocation:     s.pickupLocationCode,
      dropoffLocation:    s.returnLocationCode,
      pickupDate:         fmtDate(s.pickupYear, s.pickupMonth, s.pickupDay),
      pickupTime:         fmtTime(s.pickupHour, s.pickupMinute, s.pickupAmPm),
      dropoffDate:        fmtDate(s.returnYear, s.returnMonth, s.returnDay),
      dropoffTime:        fmtTime(s.returnHour, s.returnMinute, s.returnAmPm),
      age:                Number(s.age) || 25,
      discountCodes:      discountCodes,
      priceView:          s.priceView || 'AWD_CODE',
      countryOfResidence: String(s.country || s.residencyValue || 'us').toUpperCase(),
      currencyCode:       s.userSelectedCurrency || 'USD',
      vehicleCode:        s.vehicleCode,
      vehicleId:          s.vehicleId,
      priceRateCode:      s.priceRateCode,
      priceType:          s.priceType || 'VEHICLE_LEISURE_PAY_NOW',
      protectionBundles:  [],
      addOnBundles:       [],
      isAvisFirst:        !!s.isAvisFirst
    };

    console.log('[pwp] fetching /web/reservation/extras to populate addOnsData…');
    // NOTE: only mark the flag true on SUCCESS — if the initial fetch fails
    // (e.g. correlationIdentifier wasn't in sessionStorage yet on first
    // page load), the polling safety net in startCardEnhancer will retry.
    return fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload)
    }).then(function (r) {
      if (!r.ok) {
        console.warn('[pwp] extras call failed', r.status);
        return false;
      }
      return r.json().then(function (j) {
        if (!j || !j.addOnItems) return false;

        // Persist add-ons data
        var newAddOnsData = {
          addOnItems:        j.addOnItems        || [],
          addOnBundles:      j.addOnBundles      || [],
          freedayItem:       j.freedayItem       || null,
          redemptionStatus:  j.redemptionStatus  || null
        };

        // ALSO persist protectionsData with the same shape Avis populates
        // server-side on /protectioncoverage. Critical for first-page-load:
        // our eligibility check reads protectionsData.freedayItem and
        // protectionsData.redemptionStatus, and without this write those
        // would still be null even after a successful extras fetch.
        var existing = (readStore().state || {}).protectionsData || {};
        var newProtections = {
          freedayItem:       j.freedayItem       || existing.freedayItem      || null,
          redemptionStatus:  j.redemptionStatus  || existing.redemptionStatus || null,
          protectionItems:   j.protectionItems   || existing.protectionItems  || [],
          protectionBundles: j.protectionBundles || existing.protectionBundles|| [],
          addOnItems:        j.addOnItems        || existing.addOnItems       || [],
          addOnBundles:      j.addOnBundles      || existing.addOnBundles     || [],
          price:             j.price             || existing.price            || null,
          currencyCode:      j.currencyCode      || existing.currencyCode     || null
        };

        // Cache in our own state — host's React hydration overwrites
        // sessionStorage's reservation.store periodically and wipes any
        // keys it doesn't know about (addOnsData, protectionsData). Reading
        // from __pwpState.extras everywhere makes us resilient to that.
        __pwpState.extras = {
          addOnItems:        j.addOnItems        || [],
          addOnBundles:      j.addOnBundles      || [],
          freedayItem:       j.freedayItem       || null,
          redemptionStatus:  j.redemptionStatus  || null,
          protectionItems:   j.protectionItems   || [],
          protectionBundles: j.protectionBundles || []
        };
        // Belt-and-braces: still write to store so other code paths that
        // read from the store get the data while it's there.
        writeStore({ addOnsData: newAddOnsData, protectionsData: newProtections });
        var withLoyalty = (j.addOnItems || []).filter(function (i) { return i.loyalty && i.loyalty.pointValuePoints; }).length;
        console.log('[pwp] extras fetched —', j.addOnItems.length, 'items,', withLoyalty, 'eligible for points;',
          'freedayItem=' + (newProtections.freedayItem ? 'yes' : 'no'),
          'isRedeemable=' + (newProtections.redemptionStatus ? newProtections.redemptionStatus.isRedeemable : 'unknown'));
        __pwpExtrasFetched = true; // success — don't retry
        return true;
      });
    }).catch(function (e) {
      console.warn('[pwp] extras fetch error', e);
      // leave __pwpExtrasFetched false so the polling retry can try again
      return false;
    });
  }

  function getCommittedPoints(loyalty, protections) {
    // Free-day redemption cost (rentalDays × perDayPoints) — prefer the
    // freedayItem we've cached in __pwpState, fall back to whatever
    // protections argument we got passed (might be stale if host wiped store)
    var fd = (protections && protections.freedayItem) || getFreedayItem();
    var freedayCost = (__pwpState.quantity > 0 && fd)
      ? __pwpState.quantity * (Number(fd.perDayPoints) || 0)
      : 0;
    // Add-on items paid with points
    var addOnCost = 0;
    var elig = getAddOnEligibilityMap();
    (__pwpState.payWithPointsCodes || []).forEach(function (code) {
      if (elig[code]) addOnCost += Number(elig[code].pointValuePoints) || 0;
    });
    return freedayCost + addOnCost;
  }

  // Find every add-on card on the page across known variants. Order of
  // selectors covers the MVT-36 variant cards first (most likely on the
  // production variant page), then beta-style cards as a fallback.
  function findAddOnCards() {
    var sel = '.add-on-card[data-code], .add-on-card, [data-testid="single-addons-item-card-container"]';
    return Array.from(document.querySelectorAll(sel));
  }

  // Extract the add-on code from a card. Tries multiple strategies because
  // different host variants encode it differently.
  function extractCardCode(card) {
    var code = card.getAttribute('data-code');
    if (code) return code;
    var coded = card.querySelector('[data-code]');
    if (coded) return coded.getAttribute('data-code');
    // Beta cards don't have data-code; the code lives in the name in parens
    // e.g. "Hands-Free Navigation (GPS)"
    var name = card.querySelector('[data-testid="single-addons-item-name"]');
    var text = name ? name.textContent : card.textContent;
    var m = text && text.match(/\(([A-Z]{2,4})\)/);
    return m ? m[1] : null;
  }

  // Check if an add-on code is currently covered ("included") by a selected
  // protection or add-on bundle. The source of truth is the bundle's items
  // array in the store; we also fall back to the host's CSS classes
  // (.included / .included-in-bundle) for resilience.
  function isCodeIncludedByBundle(code) {
    var s = (readStore().state || {});
    var bundles = [s.protectionBundleSelected, s.addOnBundleSelected];
    for (var i = 0; i < bundles.length; i++) {
      var b = bundles[i];
      if (b && Array.isArray(b.items)) {
        for (var j = 0; j < b.items.length; j++) {
          if (b.items[j] && b.items[j].code === code && b.items[j].included === true) return true;
        }
      }
    }
    return false;
  }

  function enhanceAddOnCards(loyalty, protections) {
    if (!loyalty || !protections) return;
    var elig = getAddOnEligibilityMap();
    if (!Object.keys(elig).length) return;

    var balance   = parseInt(loyalty.points, 10) || 0;
    var committed = getCommittedPoints(loyalty, protections);
    var stateChanged = false;

    findAddOnCards().forEach(function (card) {
      // Already enhanced? Update affordability state, don't re-inject.
      var existing = card.querySelector('.pwp-addon-pts-toggle');

      var code = extractCardCode(card);
      if (!code || !elig[code]) {
        if (existing) existing.remove();
        return;
      }

      // If the code is currently covered by a selected bundle, remove our
      // toggle and strip it from payWithPointsCodes so it stops appearing
      // in the Applied Preferred Points section. When the bundle is later
      // deselected the next enhance pass re-injects the toggle.
      // Sources checked (most reliable first):
      //   1. state.protectionBundleSelected.items[code].included === true
      //   2. state.addOnBundleSelected.items[code].included === true
      //   3. host CSS classes on the card: .included, .included-in-bundle
      var inBundle = isCodeIncludedByBundle(code)
                  || card.classList.contains('included')
                  || card.classList.contains('included-in-bundle');
      if (inBundle) {
        if (existing) existing.remove();
        var pwpCodes = __pwpState.payWithPointsCodes || [];
        var includedIdx = pwpCodes.indexOf(code);
        if (includedIdx > -1) {
          pwpCodes.splice(includedIdx, 1);
          stateChanged = true;
        }
        return;
      }

      var info = elig[code];
      var isOn = (__pwpState.payWithPointsCodes || []).indexOf(code) > -1;
      // For affordability, exclude this item's own cost when it's already
      // toggled on (otherwise toggling on then off would show as unaffordable)
      var ownCost = isOn ? Number(info.pointValuePoints) || 0 : 0;
      var canAfford = (balance - (committed - ownCost)) >= Number(info.pointValuePoints);

      // If the user can't afford this item AND they haven't already toggled
      // it on, hide the option entirely. The toggle reappears the moment
      // they free up enough points (e.g. de-toggling another item) — the
      // next enhance pass after that change re-injects it.
      if (!canAfford && !isOn) {
        if (existing) existing.remove();
        return;
      }

      if (existing) {
        var inp = existing.querySelector('input');
        if (inp) inp.checked = isOn;
        return;
      }

      var toggle = document.createElement('label');
      toggle.className = 'pwp-addon-pts-toggle';
      toggle.style.cssText = 'display:inline-flex;align-items:center;gap:8px;'
                           + 'font-family:AvisSans,"AvisSans Fallback",-apple-system,Helvetica,Arial,sans-serif;'
                           + 'font-size:14px;font-weight:500;color:#524d4d;'
                           + 'cursor:pointer;margin-top:8px;';
      toggle.innerHTML =
          '<input type="checkbox" data-pwp-code="' + escapeHtml(code) + '"'
        + (isOn ? ' checked' : '')
        + ' style="accent-color:rgb(212,0,42);width:16px;height:16px;cursor:inherit;">'
        + '<span>Add Using Points (' + fmtNum(info.pointValuePoints) + ' Pts)</span>';

      // Place the toggle near the existing "Add to trip" control so it sits
      // alongside it visually. Falls back to appending to the card.
      var addToTrip = card.querySelector('.add-on-toggle, [data-testid="single-addons-item-add-to-trip-btn"], .add-on-actions, .card-footer');
      if (addToTrip && addToTrip.parentElement) {
        addToTrip.parentElement.appendChild(toggle);
      } else {
        card.appendChild(toggle);
      }

      var input = toggle.querySelector('input');
      input.addEventListener('change', function (e) {
        onAddOnPointsToggle(code, e.target.checked);
      });
    });

    // If we stripped any codes (e.g. because they're now included in a
    // selected bundle), persist the new state and re-sync the summary so the
    // Applied Preferred Points section + footer indicator + Protections row
    // all reflect the change immediately.
    if (stateChanged) {
      writeStore({ payWithPointsCodes: (__pwpState.payWithPointsCodes || []).slice() });
      if (__pwpState.lastCalculateResponse) {
        syncSummary(__pwpState.lastCalculateResponse);
      } else {
        if (typeof renderAppliedPointsSection === 'function') renderAppliedPointsSection();
        if (typeof updatePointsAppliedIndicator === 'function') updatePointsAppliedIndicator(null);
      }
    }
  }

  function onAddOnPointsToggle(code, isOn) {
    __pwpState.payWithPointsCodes = __pwpState.payWithPointsCodes || [];
    var idx = __pwpState.payWithPointsCodes.indexOf(code);
    if (isOn && idx === -1) __pwpState.payWithPointsCodes.push(code);
      else if (!isOn && idx > -1) __pwpState.payWithPointsCodes.splice(idx, 1);
      
      // uncheck the money checkbox if already checked
      const allMoneyToggles = document.querySelectorAll(".add-on-toggle input[type='checkbox']");
      allMoneyToggles.forEach(item => {
        if (item.getAttribute('data-code') === code && isOn) {
          if (item.checked) {
            const parentLabel = item.parentElement;
            if (parentLabel) parentLabel.click();
          }
        }
      });

    writeStore({ payWithPointsCodes: __pwpState.payWithPointsCodes.slice() });

    // OPTIMISTIC UI UPDATES — render the state-driven elements immediately
    // so the user sees their action reflected without waiting for the calc
    // API response (~500ms-1s round trip). The Total / section header still
    // require the real response (they depend on Avis's discount/savings
    // logic) but the points section, footer indicator, and the points-paid
    // row in Protections & Add-ons can all be derived from our state alone.
    renderAppliedPointsSection();
    updatePointsAppliedIndicator(__pwpState.lastCalculateResponse);

    // Disable just this toggle while the calculate is in flight — DON'T call
    // the global setBusy(), which shows "Updating price..." under the days
    // picker (wrong place for an add-on action).
    var thisToggle = document.querySelector('.pwp-addon-pts-toggle input[data-pwp-code="' + code + '"]');
    if (thisToggle) thisToggle.disabled = true;

    callCalculate(__pwpState.quantity)
      .then(function (resp) {
        if (thisToggle) thisToggle.disabled = false;
        if (resp && resp.price) writeStore({ price: resp.price });
        updateBookingSummary(resp);
        var loy = readLoyaltyFromOverride() || readLoyaltyFromStore() || readLoyaltyFromDom() || readLoyaltyFromFiber();
        var prot = readProtectionsFromOverride() || (readStore().state || {}).protectionsData || readProtectionsFromFiber();
        enhanceAddOnCards(loy, prot);
        window.dispatchEvent(new CustomEvent('avis:pwp:changed', {
          detail: { code: code, payWithPoints: isOn, response: resp }
        }));
      })
      .catch(function (err) {
        if (thisToggle) thisToggle.disabled = false;
        console.error('[pwp] add-on toggle calculate failed', err);
        // Revert toggle state in our model
        if (isOn) {
          var i = __pwpState.payWithPointsCodes.indexOf(code);
          if (i > -1) __pwpState.payWithPointsCodes.splice(i, 1);
        } else {
          if (__pwpState.payWithPointsCodes.indexOf(code) === -1) __pwpState.payWithPointsCodes.push(code);
        }
        var loy2 = readLoyaltyFromOverride() || readLoyaltyFromStore() || readLoyaltyFromDom() || readLoyaltyFromFiber();
        var prot2 = readProtectionsFromOverride() || (readStore().state || {}).protectionsData || readProtectionsFromFiber();
        enhanceAddOnCards(loy2, prot2);
      });
  }

  // Watch the DOM for new add-on cards (the host variant may re-render them
  // after price/AB-flag changes). Re-enhance any new ones.
  var __pwpCardObserver = null;
  function startCardEnhancer(loyalty, protections) {
    if (__pwpCardObserver) return;

    // Resolve loyalty + protections fresh from every available source
    // (overrides, store, DOM, fiber). Falls back to the values we had at
    // boot time. The fiber walk fallback is critical on first page load
    // where the loyalty header may not be in the DOM yet.
    function tryEnhance() {
      var l = readLoyaltyFromOverride() || readLoyaltyFromStore() || readLoyaltyFromDom() || readLoyaltyFromFiber() || loyalty;
      var p = readProtectionsFromOverride() || (readStore().state || {}).protectionsData || readProtectionsFromFiber() || protections;
      if (l && p) enhanceAddOnCards(l, p);
    }

    __pwpCardObserver = new MutationObserver(tryEnhance);
    __pwpCardObserver.observe(document.body, { childList: true, subtree: true });

    // First-page-load safety net: poll every second for the first 30s. The
    // host's variant code (MVT-36) doesn't render add-on cards until ~800ms
    // after its boot, plus its extras fetch + hydration. State (addOnsData,
    // loyaltySummary, etc.) may not be in sessionStorage yet when our script
    // first runs. The MutationObserver catches most cases, but races and
    // missed mutations make a short polling fallback worth the ~30 cheap
    // ticks. After 30s we rely on the MO alone.
    var deadline = Date.now() + 30000;
    var poll = setInterval(function () {
      if (Date.now() > deadline) { clearInterval(poll); return; }
      // Also re-fetch extras if still missing (could happen if the first
      // attempt failed because correlationIdentifier wasn't set yet).
      if (typeof fetchExtrasIfMissing === 'function' && !__pwpExtrasFetched) {
        fetchExtrasIfMissing().then(function (didFetch) {
          if (didFetch) tryEnhance();
        });
      }
      tryEnhance();
    }, 1000);
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
      __pwpState.payWithPointsCodes = [];
      __pwpExtrasFetched = false;
      if (__pwpCardObserver) { try { __pwpCardObserver.disconnect(); } catch (e) {} __pwpCardObserver = null; }
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