(function () {
  var interval = setInterval(function () {
    if (document.head) {
      // Check if <head> exists
      clearInterval(interval); // Stop checking once found
      var style = document.createElement("style");
      style.innerHTML = `.MVT-85-Var_C
  #booking-widget
  #booking-widget-desktop-form
  [data-testid="drivers-age-dropdown"]
  #mui-component-select-ageSelect {
  font-weight: 500;
  color: #000;
  font-size: 14px !important;
}
.MVT-85-Var_C .mvt-85-age-wrapper {
  margin-bottom: 0 !important;
}
.MVT-85-Var_C .mvt-85-age-wrapper .mvt-85-top-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.MVT-85-Var_C .mvt-85-age-wrapper input.mvt-85-checkbox {
  margin: 0 !important;
  cursor: pointer;
  flex-shrink: 0;
  appearance: none;
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border: 1px solid #000;
  border-radius: 2px;
  background-color: #fff;
  position: relative;
}
.MVT-85-Var_C .mvt-85-age-wrapper input.mvt-85-checkbox:checked {
  background-color: #000;
  padding: 4px;
}
.MVT-85-Var_C .mvt-85-age-wrapper input.mvt-85-checkbox:checked::after {
  content: "";
  position: absolute;
  left: 6px;
  top: 2px;
  width: 4px;
  height: 8px;
  border: solid #fff;
  border-width: 0 1.5px 1.5px 0;
  transform: rotate(45deg);
}
.MVT-85-Var_C .mvt-85-age-wrapper svg.MuiSvgIcon-root {
  display: none;
}
.MVT-85-Var_C
  .mvt-85-residency-wrapper
  [data-testid="residency-dropdown-button"]
  span {
  color: #000;
  font-weight: 500;
}
.MVT-85-Var_C
  #booking-widget
  #booking-widget-desktop-form
  [data-testid="residency-dropdown-button"]
  span {
  font-size: 14px !important;
}
.MVT-85-Var_C .mvt-85-extra-labels-container {
  display: flex;
  gap: 48px;
}
.MVT-85-Var_C .mvt-85-extra-labels-container .mvt-85-age-label {
  margin-bottom: 0 !important;
  font-size: 12px;
  pointer-events: none;
  user-select: none;
  letter-spacing: 0.036px;
  margin-left: 25px;
  min-width: 80px;
}
.MVT-85-Var_C .mvt-85-extra-labels-container .mvt-85-residency-label {
  margin-left: 27px;
}
.MVT-85-Var_C
  #booking-widget
  #booking-widget-desktop-form
  [data-testid="wizard-number-popup-trigger-button"]
  p {
  color: #000;
  font-weight: 500;
}
.MVT-85-Var_C
  #booking-widget
  #booking-widget-desktop-form
  [data-testid="discount-coupon-popup-trigger-button"]
  p:not(.mui-1i5m7g4) {
  font-size: 14px !important;
  font-weight: 500;
  color: #000;
}
.MVT-85-Var_C
  [data-testid="residency-dropdown-menu-container"]:last-child
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
  const VAR_ID = "Var_C";

  const TARGET_PATHS = [
    "/en/home",
    "/en/reservation/make-reservation",
    "/en/reservation/vehicle-availability",
    "/en/reservation/protectioncoverage",
    "/en/reservation/addons",
  ];

  // Module-level refs so ageOptionsFn can access them
  var _ageDropdownEl = null;
  var _ageCheckboxEl = null;

  // -----------------------------
  // Helpers
  // -----------------------------

  function isTargetPage() {
    var path = window.location.pathname;

    for (var i = 0; i < TARGET_PATHS.length; i++) {
      if (path.indexOf(TARGET_PATHS[i]) !== -1) {
        return true;
      }
    }

    return false;
  }

  function waitForStableElement(selector, callback) {
    let lastEl = null;
    let stableCount = 0;

    const interval = setInterval(() => {
      try {
        const el = document.querySelector(selector);

        if (!el) {
          stableCount = 0;
          lastEl = null;
          return;
        }

        if (el === lastEl) {
          stableCount++;
        } else {
          stableCount = 0;
          lastEl = el;
        }

        // element stable for 5 checks
        if (stableCount >= 5) {
          clearInterval(interval);
          callback(el);
        }
      } catch (err) {
        console.error("[MVT-85] stable check error:", err);
      }
    }, 200);
  }

  function updateAgeUI(targetElement, checkboxEl, selectedAge) {
    if (selectedAge === "25+") {
      if (checkboxEl) checkboxEl.checked = true;
    } else {
      if (checkboxEl) checkboxEl.checked = false;
    }
  }

  function updateResidencyUI(targetElement, checkboxEl) {
    setTimeout(function () {
      const spans = targetElement.querySelectorAll("span");
      const selectedResidency =
        spans.length >= 3 ? spans[2].textContent.trim() : "US";
      const isUS = selectedResidency === "US" || selectedResidency === "USA";

      if (isUS && spans.length >= 3 && spans[2].textContent !== "USA") {
        spans[2].textContent = "USA";
      }

      if (checkboxEl) {
        checkboxEl.checked = isUS;
      }
    }, 100);
  }

  function applyCode() {
    console.log("[MVT-85] applyCode");

    try {
      // Wait for Age Dropdown
      waitForStableElement(
        '[data-testid="drivers-age-dropdown"]',
        function (targetElement) {
          try {
            // Re-check after the stable wait — another call may have injected already
            if (document.querySelector(".mvt-85-age-wrapper")) return;
            if (!targetElement) return;

            const selectEl = targetElement.querySelector(
              "#mui-component-select-ageSelect",
            );

            if (!selectEl) {
              console.log("[MVT-85] select element not found");
              return;
            }
            const ageWrapperEl = document.createElement("div");
            ageWrapperEl.className = "mvt-85-age-wrapper";

            // Top row: checkbox (left) + dropdown (right) side by side
            const topRowEl = document.createElement("div");
            topRowEl.className = "mvt-85-top-row";
            ageWrapperEl.appendChild(topRowEl);

            // Bare checkbox — no label text, no interaction on the text
            topRowEl.insertAdjacentHTML(
              "beforeend",
              `<input type="checkbox" id="ageCheckbox" class="mvt-85-checkbox" />`,
            );

            // Move dropdown into the top row (right of checkbox)
            targetElement.parentNode.insertBefore(ageWrapperEl, targetElement);
            topRowEl.appendChild(targetElement);

            const checkboxEl = topRowEl.querySelector(".mvt-85-checkbox");
            _ageDropdownEl = targetElement;
            _ageCheckboxEl = checkboxEl;

            // Set initial state based on React's rendered text
            const currentText = selectEl.textContent.trim();
            let initialSelectedAge = "25+";
            if (!currentText.includes("25+")) {
              initialSelectedAge = currentText
                .replace("Driver's Age:", "")
                .trim();
            }
            updateAgeUI(targetElement, checkboxEl, initialSelectedAge);

            // Checkbox opens the MUI dropdown (using click + preventDefault to stop native toggle)
            checkboxEl.addEventListener("click", function (e) {
              e.preventDefault();
              selectEl.dispatchEvent(
                new MouseEvent("mousedown", {
                  bubbles: true,
                  cancelable: true,
                  view: window,
                }),
              );
              selectEl.dispatchEvent(
                new MouseEvent("click", {
                  bubbles: true,
                  cancelable: true,
                  view: window,
                }),
              );
            });

            // Observe age changes so the checkbox updates if React natively changes the text
            const ageTextObserver = new MutationObserver(function () {
              const newText = selectEl.textContent.trim();
              let newSelectedAge = "25+";
              if (!newText.includes("25+")) {
                newSelectedAge = newText.replace("Driver's Age:", "").trim();
              }
              updateAgeUI(targetElement, checkboxEl, newSelectedAge);
            });
            ageTextObserver.observe(selectEl, {
              childList: true,
              subtree: true,
              characterData: true,
            });

            document.body.classList.add(TEST_ID + "-" + VAR_ID);
          } catch (err) {
            console.error("[MVT-85] injection error:", err);
          }
        },
      );

      // Wait for Residency Dropdown
      waitForStableElement(
        '[data-testid="residency-dropdown-button"]',
        function (targetElement) {
          try {
            if (document.querySelector(".mvt-85-residency-wrapper")) return;
            if (!targetElement) return;

            const wrapperEl = document.createElement("div");
            // Reuse age-wrapper styles, plus add a unique class
            wrapperEl.className = "mvt-85-age-wrapper mvt-85-residency-wrapper";

            const topRowEl = document.createElement("div");
            topRowEl.className = "mvt-85-top-row";
            wrapperEl.appendChild(topRowEl);

            // Checked conditionally based on 3rd span text
            const spans = targetElement.querySelectorAll("span");
            const isUS =
              spans.length >= 3 &&
              (spans[2].textContent.trim() === "US" ||
                spans[2].textContent.trim() === "USA");
            if (isUS && spans[2].textContent !== "USA") {
              spans[2].textContent = "USA";
            }
            const checkedAttr = isUS ? "checked" : "";

            topRowEl.insertAdjacentHTML(
              "beforeend",
              `<input type="checkbox" id="residencyCheckbox" class="mvt-85-checkbox" ${checkedAttr} />`,
            );

            // Wrap it
            targetElement.parentNode.insertBefore(wrapperEl, targetElement);
            topRowEl.appendChild(targetElement);

            const checkboxEl = topRowEl.querySelector(".mvt-85-checkbox");

            // Open dropdown when clicking checkbox (using click + preventDefault to stop native toggle)
            checkboxEl.addEventListener("click", function (e) {
              e.preventDefault();
              targetElement.dispatchEvent(
                new MouseEvent("mousedown", {
                  bubbles: true,
                  cancelable: true,
                  view: window,
                }),
              );
              targetElement.dispatchEvent(
                new MouseEvent("click", {
                  bubbles: true,
                  cancelable: true,
                  view: window,
                }),
              );
            });

            // Initial UI update and setup observer to watch for React text changes
            updateResidencyUI(targetElement, checkboxEl);
            const residencyTextObserver = new MutationObserver(function () {
              updateResidencyUI(targetElement, checkboxEl);
            });
            residencyTextObserver.observe(targetElement, {
              childList: true,
              subtree: true,
              characterData: true,
            });
          } catch (err) {
            console.error("[MVT-85] residency injection error:", err);
          }
        },
      );
    } catch (err) {
      console.error("[MVT-85] applyCode error:", err);
    }
  }

  // -----------------------------
  // Route Change
  // -----------------------------

  function onRouteChange() {
    if (!isTargetPage()) return;
    setTimeout(() => {
      applyCode();
    }, 800);
  }

  // -----------------------------
  // History Patch
  // -----------------------------

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

  // -----------------------------
  // Event Listeners
  // -----------------------------

  window.addEventListener("avis:routechange", onRouteChange);

  window.addEventListener("popstate", onRouteChange);

  // -----------------------------
  // Age Options Menu
  // -----------------------------

  function ageOptionsFn() {
    const ageMenuEl = document.querySelector(
      '[data-testid="drivers-age-menu"]',
    );
    if (!ageMenuEl) return;

    if (!ageMenuEl.querySelector(".mvt-85-menu-title")) {
      ageMenuEl.insertAdjacentHTML(
        "afterbegin",
        `<p class="mvt-85-menu-title" style="font-weight: 700; color: #000; font-size: 10px; margin: 8px 16px 4px 16px; margin: 0px; margin-bottom: 8px;">Driver's Age</p>`,
      );
    }

    const options = ageMenuEl.querySelectorAll("li");
    options.forEach((option) => {
      // Use mousedown — MUI closes & removes the menu before 'click' fires
      option.addEventListener("mousedown", () => {
        const optionValue = option.getAttribute("data-value");
        if (_ageDropdownEl && _ageCheckboxEl) {
          updateAgeUI(_ageDropdownEl, _ageCheckboxEl, optionValue);
        }
      });
    });
  }

  // -----------------------------
  // Residency Options Menu
  // -----------------------------

  function residencyOptionsFn() {
    const residencyMenuEl = document.querySelector(
      '[data-testid="residency-dropdown-menu-container"]',
    );
    if (!residencyMenuEl) return;

    if (!residencyMenuEl.querySelector(".mvt-85-menu-title")) {
      residencyMenuEl.insertAdjacentHTML(
        "afterbegin",
        `<p class="mvt-85-menu-title" style="font-weight: 700; color: #000; font-size: 10px; margin: 8px 16px 4px 9px;">Residency:</p>`,
      );
    }
  }

  // -----------------------------
  // Mutation Observer
  // -----------------------------

  function startObserver() {
    var _ageMenuHandled = false;
    var _residencyMenuHandled = false;

    const observer = new MutationObserver(function () {
      if (!isTargetPage()) return;

      const wrapperExists = document.querySelector(".mvt-85-age-wrapper");
      const targetExists = document.querySelector(
        '[data-testid="drivers-age-dropdown"]',
      );
      const residencyWrapperExists = document.querySelector(
        ".mvt-85-residency-wrapper",
      );
      const residencyTargetExists = document.querySelector(
        '[data-testid="residency-dropdown-button"]',
      );

      // React rerender removed experiment
      if (
        (targetExists && !wrapperExists) ||
        (residencyTargetExists && !residencyWrapperExists)
      ) {
        console.log("[MVT-85] wrapper removed by rerender, reinjecting");
        applyCode();
      }

      // Age options menu observer
      const ageMenuExists = document.querySelector(
        '[data-testid="drivers-age-menu"]',
      );
      if (ageMenuExists && !_ageMenuHandled) {
        _ageMenuHandled = true;
        ageOptionsFn();
      } else if (!ageMenuExists) {
        _ageMenuHandled = false;
      }

      // Residency options menu observer
      const residencyMenuExists = document.querySelector(
        '[data-testid="residency-dropdown-menu-container"]',
      );
      if (residencyMenuExists && !_residencyMenuHandled) {
        _residencyMenuHandled = true;
        residencyOptionsFn();
      } else if (!residencyMenuExists) {
        _residencyMenuHandled = false;
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  // -----------------------------
  // Init
  // -----------------------------

  function init() {
    if (!document.body) {
      setTimeout(init, 100);
      return;
    }
    startObserver();
    onRouteChange();
  }
  init();
})();
