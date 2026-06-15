(() => {
  // --- CONFIGURATION ---
  const CONFIG = {
    targetSelector: '[data-testid="rc-title"]',
    targetElement: '[data-testid="best-price-banner"]',
    targetPathname: '/en/reservation/review-and-book',
    injectedClass: 'MVT-32-Var_C',
    testId: 'MVT-32',
    variationId: 'Var_C',
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
    if (document.querySelector('.' + CONFIG.injectedClass)) {
      return;
    }

    try {
      // Step C: Check if the target element exists in the DOM yet
      const targetElement = document.querySelector(CONFIG.targetElement);
      if (!targetElement) {
        return;
      }
      const targetSelector = document.querySelector(CONFIG.targetSelector);
      if (!targetSelector) {
        return;
      }
      const targetSelectorParent = targetSelector.closest('.MuiPaper-root');
      if (!targetSelectorParent) {
        return;
      }

      targetSelectorParent.insertAdjacentElement('beforebegin', targetElement);

      document.body.classList.add(CONFIG.injectedClass);
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
    frequency = 25
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
            timer - frequency
          ),
        frequency
      );
  }

  // Initialize
  waitForElem("body", initSPAObserver);
})();
