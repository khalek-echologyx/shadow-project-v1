import { avisLogo, carSvg, clockSvg, starSvg } from "./avisLogo";

(() => {
  // --- CONFIGURATION ---
  const CONFIG = {
    // The element you want to wait for and modify
    targetSelector: '[data-testid="avis-first-banner-container"]',
    targetSelector2: '[data-testid="vehicle-cards-container"]',
    // The specific path to run the test on (e.g., '/checkout'). Leave empty '' to run on all pages.
    targetPathname: '/en/reservation/vehicle-availability',
    // Unique class to prevent duplicate injections
    injectedClass: 'MVT-101-Var_D',
    testId: 'MVT-101',
    variationId: 'Var_D',
  };

  let initialVehicleCountText = null;

  const getHeaderBannerHtml = () => `
    <div class="banner-wrapper" id="${CONFIG.testId}-${CONFIG.variationId}">
      <div class="banner-header">
        <h4>Take Off Faster</h4>
        <p>
          <span>with</span>
          <span>${avisLogo}</span>
        </p>
      </div>
      <div class="banner-body">
        <div class="banner-item">
          ${clockSvg}
          <div class="banner-item-desc">
            Collect & drop-off seconds from terminal
          </div>
        </div>
        <div class="banner-item">
          ${carSvg}
          <div class="banner-item-desc">
            No counter. No queues. No paperwork.
          </div>
        </div>
        <div class="banner-item">
          ${starSvg}
          <div class="banner-item-desc">
            Dedicated concierge service
          </div>
        </div>
      </div>
    </div>
  `;


  // 1. Pathname Validator
  function isTargetPage() {
    if (!CONFIG.targetPathname) return true;
    const currentPath = window.location.pathname;
    return currentPath.includes(CONFIG.targetPathname);
  }

  // 2. Main Injection Logic
  function inject() {
    // Step A: Check if we are on the target route
    if (!isTargetPage()) return;

    // --- CAPTURE INITIAL COUNT ---
    if (document.querySelector('.banner-wrapper')) {
      const countElement = document.querySelector('[data-aue-prop="availableVehiclesSectionTitle"]')?.parentElement?.querySelector('[aria-label="vehicles-count"]');
      console.log(countElement, "countElementIntial")
      if (countElement && initialVehicleCountText === null) {
        initialVehicleCountText = countElement.textContent.trim();
      }
    }

    // Step B: Check if our code is already injected (prevent duplicate injections)
    if (document.querySelector(`.${CONFIG.injectedClass}`)) {
      return;
    }

    // --- AVIS FIRST CHECK ---
    const avisFirstLocation = document.querySelectorAll('[data-vehicle-isavisfirst="true"]');
    if (avisFirstLocation.length === 0) {
      return;
    }

    // Step C: Check if the target element exists in the DOM yet
    const targetElement = document.querySelector(CONFIG.targetSelector);
    console.log(targetElement, "targetElement=================")
    if (!targetElement) {
      return; // Element not ready yet, MutationObserver will catch it later
    }
    // targetElement.style.border = '2px solid red'
    if (!document.querySelector(`#${CONFIG.testId}-${CONFIG.variationId}`)) {
      targetElement.insertAdjacentHTML('afterend', getHeaderBannerHtml());
    }

    // Inject the avis first banner card
    const vehicleCardsContainer = document.querySelector(CONFIG.targetSelector2);
    if (vehicleCardsContainer) {
      const avisFirstBannerCardHtml = `
          <div class="avis-first-banner-card">
            <div class="card-content">
              <div class="card-header">
                <h4>Take Off Faster</h4>
                <p>
                  <span>with</span>
                  <span>${avisLogo}</span>
                </p>
              </div>
              <div class="card-body">
                <div class="card-item">
                  ${clockSvg}
                  <div class="card-item-desc">
                    Collect & drop-off seconds from terminal
                  </div>
                </div>
                <div class="card-item">
                  ${carSvg}
                  <div class="card-item-desc">
                    No counter. No queues. No paperwork.
                  </div>
                </div>
                <div class="card-item">
                  ${starSvg}
                  <div class="card-item-desc">
                    Dedicated concierge service
                  </div>
                </div>
              </div>
            </div>
          </div>
          `;

      function insertBannerCard() {
        const countElement = document.querySelector('[data-aue-prop="availableVehiclesSectionTitle"]')?.parentElement?.querySelector('[aria-label="vehicles-count"]');
        if (countElement && initialVehicleCountText === null) {
          initialVehicleCountText = countElement.textContent.trim();
        }

        let isFilterApplied = false;
        console.log(initialVehicleCountText, countElement.textContent.trim(), "checkValue")
        if (initialVehicleCountText !== null && countElement) {
           if (countElement.textContent.trim() !== initialVehicleCountText) {
             isFilterApplied = true;
           }
        }

        const avisFirstLocation = document.querySelectorAll('[data-vehicle-isavisfirst="true"]');
        console.log(avisFirstLocation.length, "avisFirstLocation=================")
        if (avisFirstLocation.length === 0) {
          const oldBannerCard = document.querySelector('.avis-first-banner-card');
          if (oldBannerCard) {
            console.log(oldBannerCard, "oldBannerCard")
            oldBannerCard.remove();
          }
          const oldHeaderBanner = document.querySelector('.banner-wrapper');
          if (oldHeaderBanner) {
            console.log(oldHeaderBanner, "oldHeaderBanner")
            oldHeaderBanner.remove();
          }
          return;
        }

        if (isFilterApplied) {
          console.log(isFilterApplied, "isFilterApplied")
          const oldBannerCard = document.querySelector('.avis-first-banner-card');
          if (oldBannerCard) {
            console.log(oldBannerCard, "oldBannerCard")
            oldBannerCard.remove();
          }
          return;
        }

        const currentArticles = vehicleCardsContainer.querySelectorAll('article');
        if (currentArticles.length > 3) {
          const currentTargetCard = currentArticles[3];
          console.log(currentTargetCard, "currentTargetCard")
          const nextSibling = currentTargetCard.nextElementSibling;
          
          if (nextSibling && nextSibling.classList.contains('avis-first-banner-card')) {
            return; // Already in correct position
          }

          const oldBannerCard = document.querySelector('.avis-first-banner-card');
          if (oldBannerCard) {
            oldBannerCard.remove();
          }

          currentTargetCard.insertAdjacentHTML('afterend', avisFirstBannerCardHtml);
        }
      }

      if (!document.querySelector('.avis-first-banner-card')) {
        insertBannerCard();
        
        const vehcileContainerObserver = new MutationObserver(() => {
          vehcileContainerObserver.disconnect();
          insertBannerCard();
          vehcileContainerObserver.observe(vehicleCardsContainer, {
            childList: true,
            subtree: true,
          });
        });
        
        vehcileContainerObserver.observe(vehicleCardsContainer, {
          childList: true,
          subtree: true,
        });
      }
    }
    document.body.classList.add(CONFIG.injectedClass)

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
