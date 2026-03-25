(() => {
  const TEST_ID = "POC";
  const VARIATION = "VAR_A";

  /* ---------------- poll utility ---------------- */

  function poll(condition, callback, timeout = 10000, interval = 50) {
    const start = Date.now();

    const check = () => {
      if (condition()) {
        callback();
      } else if (Date.now() - start < timeout) {
        setTimeout(check, interval);
      }
    };

    check();
  }

  function runProtectionCoverage() {
    const queryParams = window.location.search;
    window.location.replace("https://www.avis.com/en/reservation/review-and-book" + queryParams);
  }

  /* ---------------- hidden iframe scraper ---------------- */

  function scrapeHiddenPages() {
    console.log("test 1")
    const queryParams = window.location.search;

    const PAGES = [
      {
        url: "https://www.avis.com/en/reservation/protectioncoverage" + queryParams,
        testId: "single-protections-item-name",
        key: "protections"
      },
      {
        url: "https://www.avis.com/en/reservation/addons" + queryParams,
        testId: "single-addons-item-name",
        key: "addons"
      }
    ];

    // Ensure the container object exists on window
    window.__avisScrapedData = window.__avisScrapedData || {};

    PAGES.forEach(({ url, testId, key }) => {
      // Create a fully hidden iframe — zero size, clipped off-screen
      const iframe = document.createElement("iframe");
      iframe.src = url;
      iframe.setAttribute("aria-hidden", "true");
      iframe.setAttribute("tabindex", "-1");
      Object.assign(iframe.style, {
        position: "fixed",
        top: "0",
        left: "-9999px",
        width: "1px",
        height: "1px",
        opacity: "0",
        pointerEvents: "none",
        border: "none",
        visibility: "hidden"
      });

      iframe.addEventListener("load", () => {
        // Poll inside the iframe until the target elements are rendered
        const pollIframe = (retries = 60, delay = 500) => {
          try {
            const doc = iframe.contentDocument || iframe.contentWindow.document;
            const items = doc.querySelectorAll(`[data-testid="${testId}"]`);
            if (items.length > 0) {
              const list = Array.from(items).map(el => el.textContent.trim()).filter(Boolean);
              window.__avisScrapedData[key] = list;
              console.log(`[ABTest] ${key} list:`, list);
              // Clean up the iframe once done
              iframe.remove();
            } else if (retries > 0) {
              setTimeout(() => pollIframe(retries - 1, delay), delay);
            } else {
              console.warn(`[ABTest] Could not find [data-testid="${testId}"] after max retries.`);
              iframe.remove();
            }
          } catch (err) {
            // Cross-origin errors — page may block iframe access
            console.warn(`[ABTest] iframe access error for "${key}":`, err.message);
            iframe.remove();
          }
        };
        pollIframe();
      });

      document.body.appendChild(iframe);
    });
  }

  function runReviewAndBook() {
    const SELECTORS = {
      target: '[data-testid="rc-title"]'
    };
    const protSection = `
      <div class="new-prot-bundle" id="${TEST_ID}">
      <h2 class="prot-title">WHICH PROTECTION DO YOU NEED?</h2>
      <div class="prot-cards">
        <div class="prot-card selected">
          <div class="card-body">
            <div class="card-info">
              <h3 class="card-title">No extra protection</h3>
              <p class="card-subtitle text-red">
                Deductible: up to full vehicle value
              </p>
            </div>
            <div class="card-radio">
              <div class="radio-outer">
                <div class="radio-inner"></div>
              </div>
            </div>
          </div>
          <div class="card-actions">
            <div class="view-coverage">
              View coverage <span class="chevron"></span>
            </div>
            <div class="price-info">Included</div>
          </div>
        </div>

        <div class="prot-card">
          <div class="card-body">
            <div class="card-info">
              <h3 class="card-title">Cover The Car</h3>
              <p class="card-subtitle text-green">No deductible</p>
            </div>
            <div class="card-radio">
              <div class="radio-outer"></div>
            </div>
          </div>
          <div class="card-actions">
            <div class="view-coverage">
              View coverage <span class="chevron"></span>
            </div>
            <div class="price-info">$35.89 / day</div>
          </div>
        </div>

        <div class="prot-card">
          <div class="card-body">
            <div class="card-info">
              <h3 class="card-title">Enhance Protection</h3>
              <p class="card-subtitle text-green">No deductible</p>
            </div>
            <div class="card-radio">
              <div class="radio-outer"></div>
            </div>
          </div>
          <div class="card-actions">
            <div class="view-coverage">
              View coverage <span class="chevron"></span>
            </div>
            <div class="price-info">$35.89 / day</div>
          </div>
        </div>

        <div class="prot-card">
          <div class="card-body">
            <div class="card-info">
              <h3 class="card-title">Essential Protection</h3>
              <p class="card-subtitle text-green">No deductible</p>
            </div>
            <div class="card-radio">
              <div class="radio-outer"></div>
            </div>
          </div>
          <div class="card-actions">
            <div class="view-coverage">
              View coverage <span class="chevron"></span>
            </div>
            <div class="price-info">$35.89 / day</div>
          </div>
        </div>
      </div>
      <div class="prot-all-packages">
        <button class="btn-all-packages">View all protection packages</button>
      </div>
      <!-- Add-ons section -->
      <div class="add-ons-section">
        <h3 class="add-ons-title">Select add-ons</h3>
        <div class="add-ons-content">
          <div class="add-on-card">
            <div class="add-on-icon">
              <!-- Pentagon/Shield icon -->
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l9 6.5-3.5 10.5h-11L3 8.5 12 2z"></path></svg>
            </div>
            <div class="add-on-info">
              <h4 class="add-on-title">Supplemental Liability Insurance</h4>
              <p class="add-on-price">$16.18 / day</p>
            </div>
            <div class="add-on-actions">
              <a href="#" class="add-on-details">Details</a>
              <label class="add-on-toggle">
                <input type="checkbox">
                <span class="slider"></span>
              </label>
            </div>
          </div>

          <div class="add-on-card">
            <div class="add-on-icon">
              <!-- Gas pump icon -->
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" x2="15" y1="22" y2="22"/><line x1="4" x2="14" y1="9" y2="9"/><path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18"/><path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5"/></svg>
            </div>
            <div class="add-on-info">
              <h4 class="add-on-title">Prepaid Fuel</h4>
              <p class="add-on-price">$48.99 / one-time</p>
            </div>
            <div class="add-on-actions">
              <a href="#" class="add-on-details">Details</a>
              <label class="add-on-toggle">
                <input type="checkbox">
                <span class="slider"></span>
              </label>
            </div>
          </div>

          <div class="add-on-card">
            <div class="add-on-icon">
              <!-- Toll pass icon -->
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22V2"/><path d="M8 22V2"/><path d="M16 11h6"/><path d="M16 15h6"/><path d="M22 11v4"/><circle cx="20" cy="13" r="1"/><path d="M12 22V2"/></svg> 
            </div>
            <div class="add-on-info">
              <h4 class="add-on-title">Toll pass/Express lane</h4>
              <p class="add-on-price">$13.99 / day</p>
            </div>
            <div class="add-on-actions">
              <a href="#" class="add-on-details">Details</a>
              <label class="add-on-toggle">
                <input type="checkbox">
                <span class="slider"></span>
              </label>
            </div>
          </div>
        </div>
        <div class="add-ons-footer">
           <button class="btn-all-packages">View all add-ons options</button>
        </div>
      </div>
    </div>`;


    /* ---------------- main injection ---------------- */

    function inject() {
      const rawTarget = document.querySelector(SELECTORS.target);
      const target = rawTarget.parentElement;
      if (!target) return;
      if (document.getElementById(TEST_ID)) return;
      target.insertAdjacentHTML("afterend", protSection);
      document.body.classList.add(`${TEST_ID}-${VARIATION}`);

      // dynamically hide all cards beyond the first 2
      const allCards = document.querySelectorAll(`#${TEST_ID} .prot-card`);
      allCards.forEach((card, i) => {
        if (i >= 2) {
          card.classList.add("prot-card--extra")
        };
      });

      // accordion toggle
      const btn = document.querySelector(`#${TEST_ID} .btn-all-packages`);
      const container = document.getElementById(TEST_ID);
      if (btn && container) {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          const isExpanded = container.classList.toggle("show-all");
          btn.textContent = isExpanded ? "View less" : "View all protection packages";
        });
      }

      console.log(`${TEST_ID} injected`);
    }

    /* ---------------- observer for React re-render ---------------- */

    function observeDOM() {
      const observer = new MutationObserver((mutations) => {
        if (!document.getElementById(TEST_ID)) {
          observer.disconnect();
          // Wait for React to finish its render cycle, then re-initialize
          setTimeout(() => {
            init();
          }, 50);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }

    /* ---------------- init ---------------- */

    function init() {
      // Kick off the hidden iframe scraper immediately (doesn't need the target element)
      scrapeHiddenPages();

      poll(
        () => document.querySelector(SELECTORS.target),
        () => {
          inject();
          observeDOM();
        }
      );
    }

    init();
  }
  // route list
  const ROUTE_HANDLERS = [
    {
      path: "/reservation/protectioncoverage",
      handler: runProtectionCoverage
    },
    {
      path: "/reservation/review-and-book",
      handler: runReviewAndBook
    }
  ];
  // route handler
  function handleRoute(path) {
    ROUTE_HANDLERS.forEach((route) => {
      if (path.includes(route.path)) {
        console.log("Running for:", route.path);
        route.handler();
      }
    })
  }
  // URL detector
  function onUrlChange(callback) {
    let lastPath = location.pathname;

    const check = () => {
      const currentPath = location.pathname;

      if (currentPath !== lastPath) {
        lastPath = currentPath;
        callback(currentPath);
      }
    };

    const pushState = history.pushState;
    history.pushState = function () {
      pushState.apply(this, arguments);
      check();
    };

    const replaceState = history.replaceState;
    history.replaceState = function () {
      replaceState.apply(this, arguments);
      check();
    };

    window.addEventListener("popstate", check);
  }

  // reset function
  function resetState() {
    const el = document.getElementById("POC");
    if (el) el.remove();
    document.body.classList.remove("POC-VAR_A");
  }

  // current route
  let CURRENT_ROUTE = "";

  // safe route hander Fn
  function safeRouteHander(path) {
    if (path === CURRENT_ROUTE) return;
    CURRENT_ROUTE = path;

    // optional: reset previous stuff
    resetState();
    handleRoute(path)
  }

  // on first load
  safeRouteHander(location.pathname);

  // SPA navigation
  onUrlChange(path => {
    safeRouteHander(path)
  })

})();