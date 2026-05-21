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
    // Delay so React finishes re-rendering before we query fresh nodes
    setTimeout(function () {
      // Age label lives outside ageWrapperEl — query it directly from document
      const ageLabelEl = document.querySelector(".mvt-85-age-label");

      if (selectedAge === "25+") {
        // Checkbox checked, age label hidden
        if (checkboxEl) checkboxEl.checked = true;
        if (ageLabelEl) {
          ageLabelEl.style.display = "";
          ageLabelEl.style.visibility = "hidden";
          ageLabelEl.style.width = "80px";
        }
      } else {
        // Checkbox unchecked, age label visible with selected age
        if (checkboxEl) checkboxEl.checked = false;
        if (ageLabelEl) {
          ageLabelEl.textContent = "Driver's Age " + selectedAge;
          ageLabelEl.style.display = "";
          ageLabelEl.style.visibility = "visible";
          ageLabelEl.style.width = "auto";
        }
      }
    }, 100);
  }

  function updateResidencyUI(targetElement, checkboxEl) {
    setTimeout(function () {
      const spans = targetElement.querySelectorAll("span");
      const selectedResidency =
        spans.length >= 3 ? spans[2].textContent.trim() : "US";
      const isUS = selectedResidency === "US";

      if (checkboxEl) {
        checkboxEl.checked = isUS;
      }

      // Check if .mvt-85-extra-labels-container exists
      let containerEl = document.querySelector(
        ".mvt-85-extra-labels-container",
      );

      // If it doesn't exist, create it below the age/residency row
      if (!containerEl) {
        const residencyWrapper = document.querySelector(
          ".mvt-85-residency-wrapper",
        );
        if (residencyWrapper) {
          containerEl = document.createElement("div");
          containerEl.className = "mvt-85-extra-labels-container";
          residencyWrapper.parentNode.insertAdjacentElement(
            "afterend",
            containerEl,
          );
        }
      }

      if (containerEl) {
        // Ensure the age label placeholder exists so residency takes the second place
        let ageLabelEl = containerEl.querySelector(
          ".mvt-85-age-label:not(.mvt-85-residency-label)",
        );
        if (!ageLabelEl) {
          ageLabelEl = document.createElement("div");
          ageLabelEl.className = "mvt-85-age-label";
          ageLabelEl.style.visibility = "hidden";
          ageLabelEl.style.width = "102px";
          containerEl.insertBefore(ageLabelEl, containerEl.firstChild);
        }

        let residencyLabelEl = containerEl.querySelector(
          ".mvt-85-residency-label",
        );

        if (!isUS) {
          if (!residencyLabelEl) {
            residencyLabelEl = document.createElement("div");
            // Reuse age-label class for identical styling
            residencyLabelEl.className =
              "mvt-85-residency-label mvt-85-age-label";
            containerEl.appendChild(residencyLabelEl);
          }
          residencyLabelEl.textContent = "Residency: " + selectedResidency;
          residencyLabelEl.style.display = "";
        } else {
          if (residencyLabelEl) {
            residencyLabelEl.style.display = "none";
          }
        }
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

            // Age label — in its own div, placed below the parent of ageWrapperEl
            const ageLabelContainerEl = document.createElement("div");
            ageLabelContainerEl.className = "mvt-85-extra-labels-container";
            ageLabelContainerEl.insertAdjacentHTML(
              "beforeend",
              `<div class="mvt-85-age-label" style="visibility:hidden; width:102px;"></div>`,
            );
            const ageWrapperParentEl = ageWrapperEl.parentNode;
            ageWrapperParentEl.insertAdjacentElement(
              "afterend",
              ageLabelContainerEl,
            );

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

            // Keep the original MUI dropdown text locked to "25+" — React re-renders
            // overwrite any one-shot textContent change, so we use a MutationObserver
            // to immediately reset it whenever React updates the node.
            const selectTextObserver = new MutationObserver(function () {
              if (selectEl.textContent !== "Driver's Age: 25+") {
                selectTextObserver.disconnect();
                selectEl.textContent = "Driver's Age: 25+";
                selectTextObserver.observe(selectEl, {
                  childList: true,
                  subtree: true,
                  characterData: true,
                });
              }
            });
            selectEl.textContent = "Driver's Age: 25+";
            selectTextObserver.observe(selectEl, {
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
              spans.length >= 3 && spans[2].textContent.trim() === "US";
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
