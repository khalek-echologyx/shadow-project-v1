(() => {
  var TEST_ID = "MVT-85";
  const VAR_ID = "Var_D";
  var TARGET_PATH = "/en/home";
  const infoSvg = '<svg class="mvt-85-info-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">\
<path d="M0 6C0.00172054 4.40923 0.634401 2.88409 1.75925 1.75925C2.88409 0.634401 4.40923 0.00172054 6 0C7.59073 0.00185261 9.11578 0.634583 10.2406 1.7594C11.3654 2.88422 11.9981 4.40927 12 6C11.998 7.59069 11.3652 9.11566 10.2404 10.2404C9.11566 11.3652 7.59069 11.998 6 12C4.40923 11.9983 2.88409 11.3656 1.75925 10.2408C0.634401 9.11591 0.00172054 7.59077 0 6ZM0.705994 6C0.707582 7.40357 1.26586 8.7492 2.25833 9.74167C3.2508 10.7341 4.59643 11.2924 6 11.294C7.40348 11.2923 8.74897 10.7339 9.74133 9.74149C10.7337 8.74903 11.2919 7.40348 11.2935 6C11.2919 4.59652 10.7337 3.25097 9.74133 2.25851C8.74897 1.26606 7.40348 0.707714 6 0.705994C4.59643 0.707582 3.2508 1.26586 2.25833 2.25833C1.26586 3.2508 0.707582 4.59643 0.705994 6ZM5.64651 8.54001V4.86551C5.64638 4.77237 5.68311 4.68293 5.74869 4.61679C5.81427 4.55065 5.90335 4.51317 5.99649 4.51251C6.09016 4.51251 6.18 4.54969 6.24628 4.61588C6.31256 4.68206 6.34987 4.77184 6.35001 4.86551V8.54001C6.34987 8.63368 6.31256 8.72346 6.24628 8.78964C6.18 8.85583 6.09016 8.89301 5.99649 8.89301C5.90326 8.89234 5.8141 8.85476 5.7485 8.78851C5.68291 8.72226 5.64625 8.63272 5.64651 8.53949V8.54001ZM5.47 3.27301C5.47072 3.20418 5.48502 3.13615 5.51205 3.07285C5.53909 3.00954 5.57833 2.9522 5.62756 2.90408C5.67679 2.85597 5.73504 2.81803 5.79895 2.79245C5.86286 2.76687 5.93117 2.75415 6 2.755C6.06875 2.75421 6.13699 2.76696 6.20081 2.79254C6.26462 2.81812 6.32278 2.85603 6.37195 2.90408C6.42112 2.95214 6.46033 3.00939 6.48737 3.0726C6.5144 3.13582 6.52873 3.20374 6.52951 3.27249C6.52873 3.34124 6.5144 3.40917 6.48737 3.47238C6.46033 3.5356 6.42112 3.59288 6.37195 3.64093C6.32278 3.68899 6.26462 3.72686 6.20081 3.75244C6.13699 3.77802 6.06875 3.7908 6 3.79001C5.93119 3.79093 5.86289 3.77827 5.79898 3.75275C5.73508 3.72722 5.67683 3.68931 5.62759 3.64124C5.57836 3.59316 5.5391 3.53584 5.51205 3.47256C5.48501 3.40929 5.47072 3.3413 5.47 3.27249V3.27301Z" fill="#736D6D"/>\
</svg>'
  
  const toolTipHtml = '<div class="mvt-85-tooltip">\
          Drivers aged 21–24 must be declared, a surcharge may apply.\
        </div>'

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
        svgEl.setAttribute('viewBox', '0 0 13 12')
        const path = svgEl.querySelector('path');
        if (!path) return;
        path.setAttribute('stroke', '#524D4D');
        // path.setAttribute('stroke-width', '.5');
        path.setAttribute('d', 'M0.581951 3.12198C0.757625 2.95934 1.04245 2.95934 1.21812 3.12198L6.4502 7.96589L11.6823 3.12198C11.8579 2.95934 12.1428 2.95934 12.3184 3.12198C12.4941 3.28462 12.4941 3.54831 12.3184 3.71095L6.71541 8.89831C6.56895 9.0339 6.33144 9.0339 6.18498 8.89831L0.581951 3.71095C0.406278 3.54831 0.406278 3.28462 0.581951 3.12198Z');

        const ageText = targetElement.querySelector('#mui-component-select-ageSelect')
        if (!ageText) return;
        ageText.insertAdjacentHTML("afterend", infoSvg);
        const infoIconEl = document.querySelector('.mvt-85-info-icon');
        if (!infoIconEl) return;
        infoIconEl.insertAdjacentHTML('afterend', toolTipHtml);

        document.body.classList.add(TEST_ID + "-" + VAR_ID);
      }
    );
  }


  function isTargetPage() {
    return window.location.pathname.indexOf(TARGET_PATH) !== -1;
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
