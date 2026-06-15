(function () {
  var interval = setInterval(function () {
    if (document.head) {
      // Check if <head> exists
      clearInterval(interval); // Stop checking once found
      var style = document.createElement("style");
      style.innerHTML = `.MVT-32-Var_D .mvt-32-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}
.MVT-32-Var_D .mvt-32-wrapper #countdown {
  margin-bottom: 0;
  display: flex;
  align-items: center;
}
.MVT-32-Var_D .mvt-32-wrapper [data-testid="best-price-banner"] {
  margin: 0;
  border-radius: 8px;
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
  // --- CONFIGURATION ---
  const CONFIG = {
    targetSelector: '[data-testid="rc-title"]',
    targetElement: '[data-testid="best-price-banner"]',
    targetCountdownEl: "#countdown",
    targetPathname: "/en/reservation/review-and-book",
    injectedClass: "MVT-32-Var_D",
    testId: "MVT-32",
    variationId: "Var_D",
  };

  function poll(t, i, o = false, e = 10000, a = 25) {
    e < 0 ||
      (t()
        ? i()
        : setTimeout(() => {
            poll(t, i, o, o ? e : e - a, a);
          }, a));
  }

  // 1. Pathname Validator
  function isTargetPage() {
    const currentPath = window.location.pathname;
    return currentPath.includes(CONFIG.targetPathname);
  }

  // 2. Main Injection Logic
  function inject() {
    // Step A: Check if we are on the target route
    if (!isTargetPage()) return;

    // Step B: Check if our code is already injected (prevent duplicate injections)
    if (document.querySelector("." + CONFIG.injectedClass)) {
      return;
    }

    try {
      // Step C: Check if the target element exists in the DOM yet
      const targetElement = document.querySelector(CONFIG.targetElement);
      if (!targetElement) {
        return;
      }
      const targetSelector = document.querySelector(CONFIG.targetSelector);
      const targetSelectorParent = targetSelector.closest(".MuiGrid2-root");
      poll(
        () => {
          return document.querySelector(CONFIG.targetCountdownEl);
        },
        () => {
          if (document.querySelector(".mvt-32-wrapper")) return;
          const targetCountdownEl = document.querySelector(
            CONFIG.targetCountdownEl,
          );
          console.log(
            "===> index.js:39 ~ targetCountdownEl",
            targetCountdownEl,
          );
          const wraperDiv = document.createElement("div");
          wraperDiv.classList.add("mvt-32-wrapper");
          wraperDiv.append(targetCountdownEl);
          wraperDiv.append(targetElement);
          targetSelectorParent.insertAdjacentElement("afterbegin", wraperDiv);
          document.body.classList.add(CONFIG.injectedClass);
        },
      );
    } catch (error) {
      console.log(error, "Error occaring during test");
    }
  }

  // 3. SPA DOM Observer
  function initSPAObserver() {
    inject();

    const observer = new MutationObserver(() => {
      inject();
    });

    // Observe document body for deep changes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  // Utility to wait for the initial body tag or basic elements before setting up the observer
  function waitForElem(
    waitFor,
    callback,
    minElements = 1,
    isVariable = false,
    timer = 10000,
    frequency = 25,
  ) {
    let elements = isVariable
      ? window[waitFor]
      : document.querySelectorAll(waitFor);
    if (timer <= 0) return;
    (!isVariable && elements.length >= minElements) ||
    (isVariable && typeof window[waitFor] !== "undefined")
      ? callback(elements)
      : setTimeout(
          () =>
            waitForElem(
              waitFor,
              callback,
              minElements,
              isVariable,
              timer - frequency,
            ),
          frequency,
        );
  }

  // Initialize
  waitForElem("body", initSPAObserver);
})();
