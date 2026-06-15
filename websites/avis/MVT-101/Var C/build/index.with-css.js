(function () {
  var interval = setInterval(function () {
    if (document.head) {
      // Check if <head> exists
      clearInterval(interval); // Stop checking once found
      var style = document.createElement("style");
      style.innerHTML = `.MVT-101-Var_C [data-testid="avis-first-banner-container"] {
  display: none;
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
    // The element you want to wait for and modify
    targetSelector: '[data-testid="avis-first-banner-container"]',
    // The specific path to run the test on (e.g., '/checkout'). Leave empty '' to run on all pages.
    targetPathname: "/en/reservation/vehicle-availability",
    // Unique class to prevent duplicate injections
    injectedClass: "MVT-101-Var_C",
  };

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

    // Step C: Check if the target element exists in the DOM yet
    const targetElement = document.querySelector(CONFIG.targetSelector);
    console.log(targetElement, "targetElement=================");
    if (!targetElement) {
      return; // Element not ready yet, MutationObserver will catch it later
    }
    document.body.classList.add(CONFIG.injectedClass);
  }

  // 3. SPA DOM Observer
  function initSPAObserver() {
    // Try injecting immediately in case the element is already there
    inject();

    // Setup MutationObserver to watch for DOM/Route changes continuously
    const observer = new MutationObserver(() => {
      // Because inject() checks for isTargetPage and injectedClass,
      // it is safe to call it repeatedly on every DOM change.
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
