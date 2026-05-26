(() => {
  var TEST_ID = "MVT-85";
  const VAR_ID = "Var_B";
  const TARGET_PATHS = [
    "/en/home",
    "/en/reservation/make-reservation",
    "/en/reservation/vehicle-availability",
    "/en/reservation/protectioncoverage",
    "/en/reservation/addons"
  ];
  const downArrowSvg = '<svg class="custom_down_arrow-age" xmlns="http://www.w3.org/2000/svg" width="13" height="12" viewBox="0 0 13 12" fill="none">\
      <path fill-rule="evenodd" clip-rule="evenodd" d="M0.581951 3.12198C0.757625 2.95934 1.04245 2.95934 1.21812 3.12198L6.4502 7.96589L11.6823 3.12198C11.8579 2.95934 12.1428 2.95934 12.3184 3.12198C12.4941 3.28462 12.4941 3.54831 12.3184 3.71095L6.71541 8.89831C6.56895 9.0339 6.33144 9.0339 6.18498 8.89831L0.581951 3.71095C0.406278 3.54831 0.406278 3.28462 0.581951 3.12198Z" fill="#524D4D" stroke="black" stroke-width="0.9" stroke-linecap="round"/>\
      </svg>';

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

  function applyCode() {
    if (document.body.classList.contains(TEST_ID + "-" + VAR_ID)) return;

    // age section
    poll(
      function () {
        return !!document.querySelector('[data-testid="drivers-age-dropdown"]');
      },
      function () {
        const targetElement = document.querySelector('[data-testid="drivers-age-dropdown"]');
        if (!targetElement) return;
        const svgEl = targetElement.querySelector('svg');
        if (!svgEl) return;
        if (window.location.pathname.indexOf('/en/home') === -1) {
          svgEl.classList.add('not-home');
        }
        svgEl.setAttribute('viewBox', '0 0 13 12')
        const path = svgEl.querySelector('path');
        if (!path) return;
        path.setAttribute('stroke', '#524D4D');
        path.setAttribute('stroke-width', '0.8');
        path.setAttribute('d', 'M0.581951 3.12198C0.757625 2.95934 1.04245 2.95934 1.21812 3.12198L6.4502 7.96589L11.6823 3.12198C11.8579 2.95934 12.1428 2.95934 12.3184 3.12198C12.4941 3.28462 12.4941 3.54831 12.3184 3.71095L6.71541 8.89831C6.56895 9.0339 6.33144 9.0339 6.18498 8.89831L0.581951 3.71095C0.406278 3.54831 0.406278 3.28462 0.581951 3.12198Z');


      }
    );

    // residency section
    poll(
      function () {
        return !!document.querySelector('[data-testid="residency-dropdown-button"]');
      },
      function () {
        const targetElement = document.querySelector('[data-testid="residency-dropdown-button"]');
        if (!targetElement) return;

        const checkSpans = () => {
          const btn = document.querySelector('[data-testid="residency-dropdown-button"]');
          if (btn) {
            const spans = btn.querySelectorAll('span');
            if (spans.length >= 3) {
              if (spans[2].textContent.trim() === 'US') {
                spans[2].textContent = 'USA';
              }
            }
          }
        };
        checkSpans();
        if (!window.residencyObserver) {
          window.residencyObserver = new MutationObserver(checkSpans);
          window.residencyObserver.observe(document.body, { childList: true, subtree: true, characterData: true });
        }

        const svgEl = targetElement.querySelector('svg');
        if (!svgEl) return;
        if (window.location.pathname.indexOf('/en/home') === -1) {
          svgEl.classList.add('not-home');
        }
        svgEl.setAttribute('viewBox', '0 0 13 12')
        const path = svgEl.querySelector('path');
        if (!path) return;
        path.setAttribute('stroke', '#524D4D');
        path.setAttribute('stroke-width', '.9');
        path.setAttribute('d', 'M0.581951 3.12198C0.757625 2.95934 1.04245 2.95934 1.21812 3.12198L6.4502 7.96589L11.6823 3.12198C11.8579 2.95934 12.1428 2.95934 12.3184 3.12198C12.4941 3.28462 12.4941 3.54831 12.3184 3.71095L6.71541 8.89831C6.56895 9.0339 6.33144 9.0339 6.18498 8.89831L0.581951 3.71095C0.406278 3.54831 0.406278 3.28462 0.581951 3.12198Z');

        document.body.classList.add(TEST_ID + "-" + VAR_ID);
      }
    );

    poll(
      () => !!document.querySelector('[data-testid="wizard-number-popup-trigger-button"] p'),
      () => {
        const targetElement = document.querySelector('[data-testid="wizard-number-popup-trigger-button"] svg')
        if (!targetElement) return;
      }
    )
  }


  function isTargetPage() {
    var path = window.location.pathname;
    for (var i = 0; i < TARGET_PATHS.length; i++) {
      if (path.indexOf(TARGET_PATHS[i]) !== -1) {
        return true;
      }
    }
    return false;
  }

  function onRouteChange() {
    if (isTargetPage()) {
      document.body.classList.remove(TEST_ID + "-" + VAR_ID);
      applyCode();
    }
  }

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

  var lastPath = window.location.pathname;
  var pathObserver = new MutationObserver(function () {
    var currentPath = window.location.pathname;
    if (currentPath !== lastPath) {
      lastPath = currentPath;
      if (isTargetPage()) {
        pathObserver.disconnect();
        onRouteChange();
      }
    }
  });
  pathObserver.observe(document.body, { childList: true, subtree: false });
  onRouteChange();
})();
