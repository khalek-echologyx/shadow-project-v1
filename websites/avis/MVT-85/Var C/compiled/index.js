(() => {
  var TEST_ID = "MVT-85";
  const VAR_ID = "Var_C";

  const TARGET_PATHS = [
    "/en/home",
    "/en/reservation/make-reservation",
    "/en/reservation/vehicle-availability",
    "/en/reservation/protectioncoverage",
    "/en/reservation/addons"
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
    // Delay so React finishes re-rendering before we query fresh nodes
    setTimeout(function () {
      const freshWrapper = document.querySelector(".mvt-85-age-wrapper");
      const ageLabelEl = freshWrapper ? freshWrapper.querySelector(".mvt-85-age-label") : null;

      if (selectedAge === "25+") {
        // Checkbox checked, age label hidden
        if (checkboxEl) checkboxEl.checked = true;
        if (ageLabelEl) ageLabelEl.style.display = "none";
      } else {
        // Checkbox unchecked, age label visible with selected age
        if (checkboxEl) checkboxEl.checked = false;
        if (ageLabelEl) {
          ageLabelEl.textContent = "Driver's Age: " + selectedAge;
          ageLabelEl.style.display = "";
        }
      }
    }, 100);
  }
  function applyCode() {
    console.log("[MVT-85] applyCode");

    try {

      // Already injected
      if (document.querySelector(".mvt-85-age-wrapper")) {
        return;
      }

      waitForStableElement(
        '[data-testid="drivers-age-dropdown"]',
        function (targetElement) {
          try {
            // Re-check after the stable wait — another call may have injected already
            if (document.querySelector(".mvt-85-age-wrapper")) return;
            if (!targetElement) return;

            const selectEl = targetElement.querySelector(
              "#mui-component-select-ageSelect"
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
              `<input type="checkbox" id="ageCheckbox" class="mvt-85-checkbox" />`
            );

            // Move dropdown into the top row (right of checkbox)
            targetElement.parentNode.insertBefore(ageWrapperEl, targetElement);
            topRowEl.appendChild(targetElement);

            // Age label — below the top row, no click listener, hidden by default
            ageWrapperEl.insertAdjacentHTML(
              "beforeend",
              `<div class="mvt-85-age-label" style="display:none;"></div>`
            );

            const checkboxEl = topRowEl.querySelector(".mvt-85-checkbox");
            _ageDropdownEl = targetElement;
            _ageCheckboxEl = checkboxEl;

            // Set initial state (default age is 25+)
            updateAgeUI(targetElement, checkboxEl, "25+");

            // Checkbox opens the MUI dropdown
            checkboxEl.addEventListener("change", function () {
              selectEl.dispatchEvent(
                new MouseEvent("mousedown", { bubbles: true, cancelable: true, view: window })
              );
              selectEl.dispatchEvent(
                new MouseEvent("click", { bubbles: true, cancelable: true, view: window })
              );
            });

            document.body.classList.add(TEST_ID + "-" + VAR_ID);

          } catch (err) {
            console.error("[MVT-85] injection error:", err);
          }
        }
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
      window.dispatchEvent(
        new Event("avis:routechange")
      );
      return result;
    };
  }

  patchHistoryMethod("pushState");
  patchHistoryMethod("replaceState");

  // -----------------------------
  // Event Listeners
  // -----------------------------

  window.addEventListener(
    "avis:routechange",
    onRouteChange
  );

  window.addEventListener(
    "popstate",
    onRouteChange
  );

  // -----------------------------
  // Age Options Menu
  // -----------------------------

  function ageOptionsFn() {
    const ageMenuEl = document.querySelector('[data-testid="drivers-age-menu"]');
    if (!ageMenuEl) return;

    const options = ageMenuEl.querySelectorAll('li');
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
  // Mutation Observer
  // -----------------------------

  function startObserver() {
    var _ageMenuHandled = false;

    const observer = new MutationObserver(function () {
      if (!isTargetPage()) return;

      const wrapperExists = document.querySelector(
        ".mvt-85-age-wrapper"
      );
      const targetExists = document.querySelector(
        '[data-testid="drivers-age-dropdown"]'
      );
      // React rerender removed experiment
      if (targetExists && !wrapperExists) {
        console.log(
          "[MVT-85] wrapper removed by rerender, reinjecting"
        );
        applyCode();
      }

      // Age options menu observer
      const ageMenuExists = document.querySelector(
        '[data-testid="drivers-age-menu"]'
      );
      if (ageMenuExists && !_ageMenuHandled) {
        _ageMenuHandled = true;
        ageOptionsFn();
      } else if (!ageMenuExists) {
        _ageMenuHandled = false;
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
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
