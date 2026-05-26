(function () {
  var interval = setInterval(function () {
    if (document.head) {
      // Check if <head> exists
      clearInterval(interval); // Stop checking once found
      var style = document.createElement("style");
      style.innerHTML = `.MVT-85-Var_B
  #booking-widget
  #booking-widget-desktop-form
  [data-testid="drivers-age-dropdown"] {
  color: #000;
  font-weight: 700;
}
.MVT-85-Var_B
  #booking-widget
  #booking-widget-desktop-form
  [data-testid="drivers-age-dropdown"]
  svg {
  width: 12px;
  height: 12px;
  top: 6px;
  right: -8px !important;
  color: #524d4d;
}
.MVT-85-Var_B
  #booking-widget
  #booking-widget-desktop-form
  [data-testid="drivers-age-dropdown"]
  #mui-component-select-ageSelect {
  font-size: 14px !important;
}
.MVT-85-Var_B
  #booking-widget
  #booking-widget-desktop-form
  [data-testid="residency-dropdown-button"] {
  color: #000;
  font-weight: 700;
  margin-left: 8px;
}
.MVT-85-Var_B
  #booking-widget
  #booking-widget-desktop-form
  [data-testid="residency-dropdown-button"]
  span.MuiButton-icon {
  margin-left: 10px;
}
.MVT-85-Var_B
  #booking-widget
  #booking-widget-desktop-form
  [data-testid="residency-dropdown-button"]
  svg {
  width: 12px;
  height: 12px;
  color: #524d4d;
}
.MVT-85-Var_B
  #booking-widget
  #booking-widget-desktop-form
  [data-testid="residency-dropdown-button"]
  span {
  font-size: 14px !important;
}
.MVT-85-Var_B
  #booking-widget
  #booking-widget-desktop-form
  [data-testid="wizard-number-popup-trigger-button"]
  p:not(.mui-1i5m7g4),
.MVT-85-Var_B
  #booking-widget
  #booking-widget-desktop-form
  [data-testid="discount-coupon-popup-trigger-button"]
  p:not(.mui-1i5m7g4) {
  color: #000;
  font-weight: 700;
  font-size: 14px !important;
  margin-right: 2px;
}
.MVT-85-Var_B
  #booking-widget
  #booking-widget-desktop-form
  [data-testid="wizard-number-popup-trigger-button"]
  p.mui-1i5m7g4,
.MVT-85-Var_B
  #booking-widget
  #booking-widget-desktop-form
  [data-testid="discount-coupon-popup-trigger-button"]
  p.mui-1i5m7g4 {
  font-size: 14px !important;
}
.MVT-85-Var_B
  #booking-widget
  #booking-widget-desktop-form
  [data-testid="wizard-number-popup-trigger-button"]
  svg,
.MVT-85-Var_B
  #booking-widget
  #booking-widget-desktop-form
  [data-testid="discount-coupon-popup-trigger-button"]
  svg {
  width: 16px;
  height: 16px;
  color: #736d6d;
}
.MVT-85-Var_B
  #booking-widget
  #booking-widget-desktop-form
  [data-testid="wizard-number-popup-trigger-button"]
  div,
.MVT-85-Var_B
  #booking-widget
  #booking-widget-desktop-form
  [data-testid="discount-coupon-popup-trigger-button"]
  div {
  margin-left: 5px;
}
.MVT-85-Var_B
  [data-testid="residency-dropdown-menu-container"]
  div:nth-child(2)
  > div {
  background-color: #fff !important;
  border-radius: 0 0 4px 4px !important;
}
`;
      document.head.appendChild(style);
      setTimeout(() => {
        clearInterval(interval); // Clear the interval after 5 seconds
      }, 5000);
    }
  }, 100); // Check every 100ms for <head>
})();
(() => {
  var TEST_ID = "MVT-85";
  const VAR_ID = "Var_B";
  const TARGET_PATHS = [
    "/en/home",
    "/en/reservation/make-reservation",
    "/en/reservation/vehicle-availability",
    "/en/reservation/protectioncoverage",
    "/en/reservation/addons",
  ];

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
        const targetElement = document.querySelector(
          '[data-testid="drivers-age-dropdown"]',
        );
        if (!targetElement) return;
        const svgEl = targetElement.querySelector("svg");
        if (!svgEl) return;
        if (window.location.pathname.indexOf("/en/home") === -1) {
          svgEl.classList.add("not-home");
        }
        svgEl.setAttribute("viewBox", "0 0 13 12");
        const path = svgEl.querySelector("path");
        if (!path) return;
        path.setAttribute("stroke", "#524D4D");
        path.setAttribute("stroke-width", "0.8");
        path.setAttribute(
          "d",
          "M0.581951 3.12198C0.757625 2.95934 1.04245 2.95934 1.21812 3.12198L6.4502 7.96589L11.6823 3.12198C11.8579 2.95934 12.1428 2.95934 12.3184 3.12198C12.4941 3.28462 12.4941 3.54831 12.3184 3.71095L6.71541 8.89831C6.56895 9.0339 6.33144 9.0339 6.18498 8.89831L0.581951 3.71095C0.406278 3.54831 0.406278 3.28462 0.581951 3.12198Z",
        );
      },
    );

    // residency section
    poll(
      function () {
        return !!document.querySelector(
          '[data-testid="residency-dropdown-button"]',
        );
      },
      function () {
        const targetElement = document.querySelector(
          '[data-testid="residency-dropdown-button"]',
        );
        if (!targetElement) return;

        const checkSpans = () => {
          const btn = document.querySelector(
            '[data-testid="residency-dropdown-button"]',
          );
          if (btn) {
            const spans = btn.querySelectorAll("span");
            if (spans.length >= 3) {
              if (spans[2].textContent.trim() === "US") {
                spans[2].textContent = "USA";
              }
            }
          }
        };
        checkSpans();
        if (!window.residencyObserver) {
          window.residencyObserver = new MutationObserver(checkSpans);
          window.residencyObserver.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true,
          });
        }

        const svgEl = targetElement.querySelector("svg");
        if (!svgEl) return;
        if (window.location.pathname.indexOf("/en/home") === -1) {
          svgEl.classList.add("not-home");
        }
        svgEl.setAttribute("viewBox", "0 0 13 12");
        const path = svgEl.querySelector("path");
        if (!path) return;
        path.setAttribute("stroke", "#524D4D");
        path.setAttribute("stroke-width", ".9");
        path.setAttribute(
          "d",
          "M0.581951 3.12198C0.757625 2.95934 1.04245 2.95934 1.21812 3.12198L6.4502 7.96589L11.6823 3.12198C11.8579 2.95934 12.1428 2.95934 12.3184 3.12198C12.4941 3.28462 12.4941 3.54831 12.3184 3.71095L6.71541 8.89831C6.56895 9.0339 6.33144 9.0339 6.18498 8.89831L0.581951 3.71095C0.406278 3.54831 0.406278 3.28462 0.581951 3.12198Z",
        );

        document.body.classList.add(TEST_ID + "-" + VAR_ID);
      },
    );

    poll(
      () =>
        !!document.querySelector(
          '[data-testid="wizard-number-popup-trigger-button"] p',
        ),
      () => {
        const targetElement = document.querySelector(
          '[data-testid="wizard-number-popup-trigger-button"] svg',
        );
        if (!targetElement) return;
      },
    );
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
