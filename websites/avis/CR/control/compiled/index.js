(() => {
  var TEST_ID = "MVT-36";

  // ── Utility: poll for a DOM element ──────────────────────────────────────
  function poll(condition, callback, timeout, interval) {
    timeout = timeout || 10000;
    interval = interval || 50;
    var start = Date.now();
    function check() {
      if (condition()) {
        callback();
      } else if (Date.now() - start < timeout) {
        setTimeout(check, interval);
      }
    }
    check();
  }

  // ── Core logic: hide the savings element on review-and-book ───────────────
  function applyMemberPayNowSection() {
    // Guard: only run once per page load — if body class already set, skip
    if (document.body.classList.contains(TEST_ID)) return;

    poll(
      function () {
        return !!document.querySelector('[data-testid="rate-terms-accordion"]');
      },
      function () {
        var el = document.querySelector('[data-testid="rate-terms-accordion"]');
        if (!el) return;
        var nextEl = el.nextElementSibling;
        if (nextEl) {
          var hasSavings = nextEl.textContent.toLowerCase().includes("savings");
          const hasMaxDiscount = nextEl.textContent.includes("MAX DISCOUNT");
          if (hasSavings || hasMaxDiscount) {
            nextEl.style.display = "none";
          }
        }
        // Inject TEST_ID class into body (same pattern as Var B)
        document.body.classList.add(TEST_ID);
      }
    );
  }

  // ── SPA URL detection ─────────────────────────────────────────────────────
  var TARGET_PATH = "/reservation/review-and-book";

  function isTargetPage() {
    return window.location.pathname.indexOf(TARGET_PATH) !== -1;
  }

  function onRouteChange() {
    if (isTargetPage()) {
      // Remove guard class on route change so logic re-runs on SPA navigation
      // back to this page from another route
      document.body.classList.remove(TEST_ID);
      applyMemberPayNowSection();
    }
  }

  // Patch pushState and replaceState to fire a custom event
  function patchHistoryMethod(method) {
    var original = history[method];
    history[method] = function () {
      var result = original.apply(this, arguments);
      window.dispatchEvent(new Event("avis:routechange"));
      return result;
    };
  }
  patchHistoryMethod("pushState");
  patchHistoryMethod("replaceState");

  // Listen to back/forward navigation
  window.addEventListener("popstate", onRouteChange);

  // Listen to our custom route change event
  window.addEventListener("avis:routechange", onRouteChange);

  // MutationObserver for URL changes ONLY — disconnected immediately once the
  // target page is detected to prevent any possibility of an infinite loop
  // from our own DOM mutations re-triggering the observer.
  var lastPath = window.location.pathname;
  var pathObserver = new MutationObserver(function () {
    var currentPath = window.location.pathname;
    if (currentPath !== lastPath) {
      lastPath = currentPath;
      if (isTargetPage()) {
        // Disconnect BEFORE touching the DOM — eliminates infinite loop risk
        pathObserver.disconnect();
        onRouteChange();
      }
    }
  });
  pathObserver.observe(document.body, { childList: true, subtree: false });

  // Run immediately in case the script loads directly on the target page
  onRouteChange();
})();
