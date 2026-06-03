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

  if (!window._mvt85Patched) {
    window._mvt85Patched = true;

    const originalInsertBefore = Node.prototype.insertBefore;
    Node.prototype.insertBefore = function (newNode, referenceNode) {
      if (referenceNode && referenceNode.parentNode !== this) {
        let ancestor = referenceNode;
        while (ancestor && ancestor.parentNode !== this) {
          ancestor = ancestor.parentNode;
          if (ancestor === document.body || !ancestor) break;
        }
        if (ancestor && ancestor.parentNode === this) {
          return originalInsertBefore.call(this, newNode, ancestor);
        }
        return this.appendChild(newNode);
      }
      return originalInsertBefore.call(this, newNode, referenceNode);
    };

    const originalRemoveChild = Node.prototype.removeChild;
    Node.prototype.removeChild = function (child) {
      if (child && child.parentNode !== this) {
        if (child.parentNode) child.parentNode.removeChild(child);
        return child;
      }
      return originalRemoveChild.call(this, child);
    };

    const originalReplaceChild = Node.prototype.replaceChild;
    Node.prototype.replaceChild = function (newChild, oldChild) {
      if (oldChild && oldChild.parentNode !== this) {
        if (oldChild.parentNode)
          oldChild.parentNode.replaceChild(newChild, oldChild);
        return oldChild;
      }
      return originalReplaceChild.call(this, newChild, oldChild);
    };
  }

  const greenCheckSvg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">\
  <path fill-rule="evenodd" clip-rule="evenodd" d="M12.4446 1.34824C11.129 0.469192 9.58225 0 8 0C5.87827 0 3.84344 0.842855 2.34315 2.34315C0.842855 3.84344 0 5.87827 0 8C0 9.58225 0.469192 11.129 1.34824 12.4446C2.22729 13.7602 3.47672 14.7855 4.93853 15.391C6.40034 15.9965 8.00887 16.155 9.56072 15.8463C11.1126 15.5376 12.538 14.7757 13.6569 13.6569C14.7757 12.538 15.5376 11.1126 15.8463 9.56072C16.155 8.00887 15.9965 6.40034 15.391 4.93853C14.7855 3.47672 13.7602 2.22729 12.4446 1.34824ZM3.8934 8.40548L6.40007 11.0676C6.4445 11.1148 6.49826 11.152 6.55795 11.1773C6.61763 11.2025 6.68191 11.2154 6.74671 11.2144C6.86649 11.2146 6.9818 11.1686 7.06873 11.0861C7.08905 11.0672 7.10758 11.0466 7.12407 11.0243L9.5634 8.43511C9.57794 8.42306 9.59171 8.41007 9.6047 8.39637L12.1114 5.73426C12.154 5.68928 12.1873 5.63623 12.2094 5.57834C12.2315 5.52044 12.242 5.45896 12.2402 5.39702C12.2384 5.33508 12.2244 5.27417 12.1989 5.21766C12.1735 5.16115 12.1372 5.11003 12.092 5.06759C12.047 5.02502 11.994 4.99166 11.9361 4.96961C11.8782 4.94757 11.8165 4.93715 11.7546 4.93901C11.6926 4.94087 11.6316 4.9552 11.5752 4.98068C11.5187 5.00616 11.4678 5.04258 11.4254 5.08778L8.94739 7.71896C8.9343 7.73004 8.92182 7.74198 8.91004 7.75444L6.74272 10.0555L4.58004 7.759C4.53794 7.71332 4.48715 7.67639 4.43063 7.6506C4.37411 7.62482 4.31303 7.6108 4.25094 7.60893C4.18885 7.60707 4.12698 7.61751 4.06902 7.63986C4.01105 7.66221 3.95814 7.69575 3.91338 7.73882C3.8677 7.78092 3.83088 7.83171 3.8051 7.88823C3.77932 7.94475 3.76509 8.00583 3.76323 8.06792C3.76137 8.13001 3.77193 8.19192 3.79428 8.24988C3.81663 8.30785 3.85033 8.36072 3.8934 8.40548Z" fill="#46791D"/>\
  </svg>';

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
    if (checkboxEl) checkboxEl.checked = true;

    const selectEl = targetElement.querySelector(
      "#mui-component-select-ageSelect",
    );
    if (selectEl) {
      if (selectedAge === "25+") {
        if (selectEl.textContent !== "I am 25 or older") {
          selectEl.textContent = "I am 25 or older";
        }
      } else {
        const newText = "Driver's Age: " + selectedAge;
        if (selectEl.textContent !== newText) {
          selectEl.textContent = newText;
        }
      }
    }
  }

  function updateResidencyUI(targetElement, checkboxEl) {
    setTimeout(function () {
      const spans = targetElement.querySelectorAll("span");
      const selectedResidency =
        spans.length >= 3 ? spans[2].textContent.trim() : "US";
      const isUS =
        selectedResidency === "US" ||
        selectedResidency === "USA" ||
        selectedResidency === "I am a US resident";

      if (isUS && spans.length >= 3) {
        if (spans[2].textContent !== "I am a US resident") {
          spans[2].textContent = "I am a US resident";
        }
        if (spans[0]) spans[0].style.display = "none";
        if (spans[1]) spans[1].style.display = "none";
      } else if (spans.length >= 3) {
        if (spans[0]) spans[0].style.display = "";
        if (spans[1]) spans[1].style.display = "";
      }

      if (checkboxEl) {
        checkboxEl.checked = true;
      }
    }, 100);
  }

  function updateWizardUI(targetElement, checkboxEl, wrapperEl, topRowEl) {
    const pTag = targetElement.querySelector("p");
    if (!pTag) return;
    const text = pTag.textContent;
    console.log(text, "text");
    if (text.includes("*")) {
      checkboxEl.checked = true;

      if (!pTag.hasAttribute("data-wizard-click-listener")) {
        pTag.addEventListener("click", function () {
          console.log("Wizard pTag clicked");
          const removeWizardEl = document.querySelector(
            '[data-testid="recognized-state-logout"]',
          );
          if (removeWizardEl) {
            removeWizardEl.click();
          }
        });
        pTag.setAttribute("data-wizard-click-listener", "");
      }

      if (!wrapperEl.querySelector(".mvt-85-wizard-applied-text")) {
        wrapperEl.style.marginTop = "2px";
        console.log("discount text added");
        pTag.classList.add("wizard-applied-label");
        const wizardAppliedText =
          '<div class="mvt-85-wizard-applied-text">' +
          "<p>Wizard Number Applied</p>" +
          greenCheckSvg +
          "</div>";
        topRowEl.insertAdjacentHTML("afterend", wizardAppliedText);
      }
    } else {
      checkboxEl.checked = false;
      const wizardAppliedText = wrapperEl.querySelector(
        ".mvt-85-wizard-applied-text",
      );
      if (wizardAppliedText) {
        wizardAppliedText.remove();
        wrapperEl.style.marginTop = "";
      }
    }
  }

  function updateDiscountUI(targetElement, checkboxEl, wrapperEl, topRowEl) {
    try {
      const ptag = targetElement.querySelector("p");
      if (!ptag) return;

      const currentText = ptag.textContent;
      console.log(currentText, "currentText");

      if (currentText === "Discount Applied") {
        console.log("Discount text found");
        checkboxEl.checked = true;
      } else if (currentText !== "Add Discount") {
        checkboxEl.checked = false;
      }

      if (ptag.textContent !== "Add Discount") {
        ptag.textContent = "Add Discount";
      }

      if (checkboxEl.checked) {
        if (!wrapperEl.querySelector(".mvt-85-discount-applied-text")) {
          console.log("discount text added");
          wrapperEl.style.marginTop = "2px";
          const discountAppliedText =
            '<div class="mvt-85-discount-applied-text">' +
            "<p>Discount Applied</p>" +
            greenCheckSvg +
            "</div>";
          topRowEl.insertAdjacentHTML("afterend", discountAppliedText);
        }
      } else {
        const discountAppliedText = wrapperEl.querySelector(
          ".mvt-85-discount-applied-text",
        );
        if (discountAppliedText) {
          discountAppliedText.remove();
        }
      }
    } catch (err) {
      console.error("[MVT-85] updateDiscountUI error:", err);
    }
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
            if (document.querySelector("#ageCheckbox")) return;
            if (!targetElement || !targetElement.parentNode) return;

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
              '<input type="checkbox" id="ageCheckbox" class="mvt-85-checkbox" />',
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
            if (
              currentText !== "I am 25 or older" &&
              !currentText.includes("25+")
            ) {
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
              if (newText === "I am 25 or older") return;

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
            if (document.querySelector("#residencyCheckbox")) return;
            if (!targetElement || !targetElement.parentNode) return;

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
                spans[2].textContent.trim() === "USA" ||
                spans[2].textContent.trim() === "I am a US resident");

            if (isUS) {
              if (
                spans.length >= 3 &&
                spans[2].textContent !== "I am a US resident"
              ) {
                spans[2].textContent = "I am a US resident";
              }
              if (spans[0]) spans[0].style.display = "none";
              if (spans[1]) spans[1].style.display = "none";
            } else {
              if (spans[0]) spans[0].style.display = "";
              if (spans[1]) spans[1].style.display = "";
            }

            const checkedAttr = "checked";

            topRowEl.insertAdjacentHTML(
              "beforeend",
              '<input type="checkbox" id="residencyCheckbox" class="mvt-85-checkbox" ' +
                checkedAttr +
                " />",
            );

            // Wrap it
            console.log(targetElement, targetElement.parentNode, "resD");
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

      // wait for wizard number section
      waitForStableElement(
        '[data-testid="wizard-number-popup-trigger-button"]',
        function (targetElement) {
          try {
            if (!targetElement || !targetElement.parentNode) return;
            if (document.querySelector("#wizardCheckbox")) return;

            const wrapperEl = document.createElement("div");
            wrapperEl.className = "mvt-85-wizard-wrapper";

            const topRowEl = document.createElement("div");
            topRowEl.className = "mvt-85-top-row";
            wrapperEl.appendChild(topRowEl);

            //add checkbox
            const checkedAttr = "checked";
            topRowEl.insertAdjacentHTML(
              "beforeend",
              '<input type="checkbox" id="wizardCheckbox" class="mvt-85-checkbox" ' +
                checkedAttr +
                "/>",
            );

            // Wrap it
            targetElement.parentNode.insertBefore(wrapperEl, targetElement);
            topRowEl.appendChild(targetElement);

            const checkboxEl = topRowEl.querySelector(".mvt-85-checkbox");
            // Open dropdown when clicking checkbox (using click + preventDefault to stop native toggle)
            checkboxEl.addEventListener("click", function (e) {
              e.preventDefault();
              if (checkboxEl.hasAttribute("checked")) {
                console.log("Wizard checkbox clicked while checked");
                const removeWizardEl = document.querySelector(
                  '[data-testid="recognized-state-logout"]',
                );
                if (removeWizardEl) {
                  removeWizardEl.click();
                }
              }
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

            updateWizardUI(targetElement, checkboxEl, wrapperEl, topRowEl);

            const wizardObserver = new MutationObserver(function () {
              console.log("wizardObserver");
              updateWizardUI(targetElement, checkboxEl, wrapperEl, topRowEl);
            });
            wizardObserver.observe(targetElement, {
              childList: true,
              subtree: true,
              characterData: true,
            });
          } catch (err) {
            console.error(
              "[MVT-85] wizard number section injection error:",
              err,
            );
          }
        },
      );

      // wait for discount section
      waitForStableElement(
        '[data-testid="discount-coupon-popup-trigger-button"]',
        function (targetElement) {
          try {
            if (!targetElement || !targetElement.parentNode) return;
            if (document.querySelector("#discountCheckbox")) return;

            const wrapperEl = document.createElement("div");
            wrapperEl.className = "mvt-85-discount-wrapper";

            const topRowEl = document.createElement("div");
            topRowEl.className = "mvt-85-top-row";
            wrapperEl.appendChild(topRowEl);

            topRowEl.insertAdjacentHTML(
              "beforeend",
              '<input type="checkbox" id="discountCheckbox" class="mvt-85-checkbox"/>',
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

            updateDiscountUI(targetElement, checkboxEl, wrapperEl, topRowEl);

            const discountObserver = new MutationObserver(function () {
              console.log("discountObserver");
              updateDiscountUI(targetElement, checkboxEl, wrapperEl, topRowEl);
            });
            discountObserver.observe(targetElement, {
              childList: true,
              subtree: true,
              characterData: true,
            });
          } catch (err) {
            console.error("[MVT-85] discount section injection error:", err);
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
        '<p class="mvt-85-menu-title" style="font-weight: 700; color: #000; font-size: 10px; margin: 8px 16px 4px 16px; margin: 0px; margin-bottom: 8px;">Driver&rsquo;s Age</p>',
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
        '<p class="mvt-85-menu-title" style="font-weight: 700; color: #000; font-size: 10px; margin: 8px 16px 4px 9px;">Residency:</p>',
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

      const wrapperExists = document.querySelector("#ageCheckbox");
      const targetExists = document.querySelector(
        '[data-testid="drivers-age-dropdown"]',
      );
      const residencyWrapperExists =
        document.querySelector("#residencyCheckbox");
      const residencyTargetExists = document.querySelector(
        '[data-testid="residency-dropdown-button"]',
      );
      const wizardWrapperExists = document.querySelector("#wizardCheckbox");
      const wizardTargetExists = document.querySelector(
        '[data-testid="wizard-number-popup-trigger-button"]',
      );
      const discountWrapperExists = document.querySelector("#discountCheckbox");
      const discountTargetExists = document.querySelector(
        '[data-testid="discount-coupon-popup-trigger-button"]',
      );

      // React rerender removed experiment
      if (
        (targetExists && !wrapperExists) ||
        (residencyTargetExists && !residencyWrapperExists) ||
        (wizardTargetExists && !wizardWrapperExists) ||
        (discountTargetExists && !discountWrapperExists)
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
