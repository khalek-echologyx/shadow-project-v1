(() => {
  /* =========================
     SHARED UTILITIES
  ========================= */
  function waitForBody(callback) {
    if (document.body) {
      callback();
      return;
    }
    const observer = new MutationObserver(() => {
      if (document.body) {
        observer.disconnect();
        callback();
      }
    });
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }

  function createObserver(selector, onFound, options = {}) {
    const { root = document.documentElement, timeout = 10000 } = options;
    const el = document.querySelector(selector);
    if (el) {
      onFound(el);
      return;
    }
    const observer = new MutationObserver(() => {
      const found = document.querySelector(selector);
      if (found) {
        observer.disconnect();
        onFound(found);
      }
    });
    observer.observe(root, { childList: true, subtree: true });
    if (timeout) {
      setTimeout(() => observer.disconnect(), timeout);
    }
  }

  /* =========================
     TASK 1: APPLE PROMO SIDEBAR
  ========================= */
  function initApplePromo() {
  /* --- SELECTORS --- */
    const SELECTORS = {
      promoItems: ".promo-items",
      promoTargetSection: ".view-phone-details",
      promoImageGroup: ".promo-item-img-group",
    };

    /* --- STATE --- */
    function createState() {
      return {
        promoState: [],
        accrodionState: [
          {
            title: "Apple TV+",
            content: `Eligible Handsets:\niPhone 17\niPhone 17 Pro\niPhone 17 Pro Max\niPhone Air\niPhone 16 with Apple iPad A16\niPhone 16e\niPhone 16 Pro Max\niPhone 16 Pro Max with Apple Watch Series 10\niPhone 16 Pro\niPhone 16 Plus\niPhone 16\niPhone 15 Pro Max\niPhone 15\niPhone 14\niPhone 13\n\nHow to claim 3 months of Apple TV+\n\nTurn on your new iPhone and sign in with your Apple ID.\nOpen the Apple TV app. Make sure your eligible device is running the latest version of iOS, iPad OS, tvOS, or macOS.\nThe offer should appear immediately after you launch the Apple TV app. If not, scroll down in Watch Now until the offer appears.\nTap Enjoy 3 months Free. You might be asked to enter your Apple ID password, confirm your billing information, or add a valid payment method.\nNew subscribers get three months of Apple News+ free when you buy a new iPhone, subject to the terms and conditions.\n\nClick Here for Full Terms & Conditions.\n\n£9.99/month after free trial. One subscription per Family Sharing group. Offer good for 3 months after eligible device activation. Plan automatically renews until cancelled. Restrictions and other terms apply. See apple.com/uk/promo for more information.`
          },
          {
            title: "Apple Music",
            content: `Eligible Handsets:\niPhone 17\niPhone 17 Pro\niPhone 17 Pro Max\niPhone Air\niPhone 16 with Apple iPad A16\niPhone 16e\niPhone 16 Pro Max\niPhone 16 Pro Max with Apple Watch Series 10\niPhone 16 Pro\niPhone 16 Plus\niPhone 16\niPhone 15 Pro Max\niPhone 15\niPhone 14\niPhone 13\n\nHow to claim 3 months of Apple TV+\n\nTurn on your new iPhone and sign in with your Apple ID.\nOpen the Apple TV app. Make sure your eligible device is running the latest version of iOS, iPad OS, tvOS, or macOS.\nThe offer should appear immediately after you launch the Apple TV app. If not, scroll down in Watch Now until the offer appears.\nTap Enjoy 3 months Free. You might be asked to enter your Apple ID password, confirm your billing information, or add a valid payment method.\nNew subscribers get three months of Apple News+ free when you buy a new iPhone, subject to the terms and conditions.\n\nClick Here for Full Terms & Conditions.\n\n£9.99/month after free trial. One subscription per Family Sharing group. Offer good for 3 months after eligible device activation. Plan automatically renews until cancelled. Restrictions and other terms apply. See apple.com/uk/promo for more information.`
          },
          {
            title: "Apple Fintess +",
            content: "Lorem"
          },
          {
            title: "Apple Arcade",
            content: "Lorem"
          },
          {
            title: "Apple News +",
            content: "Lorem"
          }
        ]
      };
    }

    /* --- HELPERS --- */
    function renderPromoImages(items) {
      if (!Array.isArray(items) || items.length <= 2) return "";
      const usableItems = items.slice(2).filter(item => item.image);
      const displayItems = usableItems.slice(0, 3);
      const remaining = usableItems.length - displayItems.length;
      let html = "";
      displayItems.forEach(item => {
        if (item.image) {
          html += `<img class="promo-item-img" src="${item.image}" alt="" loading="lazy">`;
        }
      });
      if (remaining > 0) {
        html += `<span class="promo-more-count">+${remaining}</span>`;
      }
      return html;
    }

    function promoSection() {
      return `
        <div class="promo-section">
          <div class="promo-item">
            <div class="promo-item-img-group"></div>
            <div class="promo-item-content">Get 3 months free</div>
          </div>
          <div id="no-eu-roaming" class="promo-item">
            <img class="promo-item-img" src="https://www.tescomobile.com/media/attribute/swatch/swatch_thumb/110x90/r/o/roaming_icon.png" alt="" loading="lazy">
            <div class="promo-item-content">No EU roaming</div>
          </div>
          <div id="frozen-prices" class="promo-item">
            <img class="promo-item-img" src="https://www.tescomobile.com/media/attribute/swatch/swatch_thumb/110x90/c/c/ccp-logo_3.png" alt="" loading="lazy">
            <div class="promo-item-content">Frozen Prices</div>
          </div>
        </div>
      `;
    }

    function updatePromoImages(state) {
      const group = document.querySelector(SELECTORS.promoImageGroup);
      if (!group || !state.promoState.length) return;
      group.innerHTML = renderPromoImages(state.promoState);
    }

    function initAccordion() {
      const ACCORDION_ICON_COLLAPSED = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="1" y="1" width="22" height="22" rx="11" fill="white"/>
          <rect x="1" y="1" width="22" height="22" rx="11" stroke="#00539F" stroke-width="2"/>
          <path d="M17.2287 8.35382L12.0005 13.7705L6.77751 8.35407L5.69775 9.39528L12.0001 15.9309L18.3079 9.39553L17.2287 8.35382Z" fill="#00539F"/>
        </svg>`;
      const ACCORDION_ICON_EXPANDED = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="1" y="1" width="22" height="22" rx="11" fill="white"/>
          <rect x="1" y="1" width="22" height="22" rx="11" stroke="#00539F" stroke-width="2"/>
          <path d="M18.3026 14.6047L12.0003 8.06909L5.69238 14.6044L6.77166 15.6462L11.9998 10.2295L17.2228 15.6459L18.3026 14.6047Z" fill="#00539F"/>
        </svg>`;

      const accordions = document.querySelectorAll('.custom-sidebar-accordion');
      if (!accordions.length) return;

      accordions.forEach((acc, index) => {
        const content = acc.querySelector('.cust-sidebar-accordion-content');
        const icon = acc.querySelector('.custom-sidebar-accordion-icon');
        if (index === 0) {
          acc.classList.add('_open');
          content.style.maxHeight = content.scrollHeight + 'px';
          icon.innerHTML = ACCORDION_ICON_EXPANDED;
        } else {
          icon.innerHTML = ACCORDION_ICON_COLLAPSED;
        }
      });

      accordions.forEach(accordion => {
        const header = accordion.querySelector('.custom-sidebar-accordion-header');
        const content = accordion.querySelector('.cust-sidebar-accordion-content');
        const icon = accordion.querySelector('.custom-sidebar-accordion-icon');

        header.addEventListener('click', () => {
          const isOpen = accordion.classList.contains('_open');
          accordions.forEach(acc => {
            acc.classList.remove('_open');
            acc.querySelector('.cust-sidebar-accordion-content').style.maxHeight = null;
            acc.querySelector('.custom-sidebar-accordion-icon').innerHTML = ACCORDION_ICON_COLLAPSED;
          });
          if (!isOpen) {
            accordion.classList.add('_open');
            content.style.maxHeight = content.scrollHeight + 'px';
            icon.innerHTML = ACCORDION_ICON_EXPANDED;
          }
        });
      });
    }

    function renderAccrodion(state) {
      if (!state.accrodionState) return "";
      let html = "";
      state.accrodionState.forEach((item) => {
        html += `
        <div class="custom-sidebar-accordion">
          <div class="custom-sidebar-accordion-header" data-accordion-header>
            <span class="custom-sidebar-accordion-title">${item.title}</span>
            <span class="custom-sidebar-accordion-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="1" y="1" width="22" height="22" rx="11" fill="white"/>
                <rect x="1" y="1" width="22" height="22" rx="11" stroke="#00539F" stroke-width="2"/>
                <path d="M17.2287 8.35382L12.0005 13.7705L6.77751 8.35407L5.69775 9.39528L12.0001 15.9309L18.3079 9.39553L17.2287 8.35382Z" fill="#00539F"/>
              </svg>
            </span>
          </div>
          <div class="cust-sidebar-accordion-content">
            <div class="custom-sidebar-accordion-content-inner">
              <p class="custom-sidebar-accordion-content-text">${item.content}</p>
            </div>
          </div>
        </div>`;
      });
      return html;
    }

    function sidebarTemplate(state) {
      return `
      <aside id="promo-custom-sidebar" class="modal-slide spotify cart-slider show-close _inner-scroll" tabindex="0" role="dialog" data-role="modal" data-type="slide">
        <div class="modal-inner-wrap">
          <header class="modal-header">
            <button class="action-close" data-role="closeBtn" type="button"><span>Close</span></button>
          </header>
          <div id="modal-content-66" class="modal-content" data-role="content">
            <div class="custom-sidebar-content">
              <h2>Get 3 months free when you buy any iPhone.</h2>
              <div class="custom-sidebar-accordion-section">
                ${renderAccrodion(state)}
              </div>
            </div>
          </div>
        </div>
      </aside>
      <div class="promo-sidebar-backdrop" data-promo-backdrop style="display:none"></div>`;
    }

    function openSidebar() {
      const sidebar = document.getElementById("promo-custom-sidebar");
      const backdrop = document.querySelector("[data-promo-backdrop]");
      const modalWrapper = document.querySelector(".modals-wrapper");
      if (!sidebar || !backdrop || !modalWrapper) return;
      if (!document.querySelector(".modals-overlay")) {
        modalWrapper.insertAdjacentHTML("beforebegin", `<div class="modals-overlay" style="z-index: 901;"></div>`);
      }
      document.body.classList.add("_has-modal");
      sidebar.classList.add("_show");
      sidebar.style.zIndex = "902";
    }

    function closeSidebar() {
      const sidebar = document.getElementById("promo-custom-sidebar");
      const backdrop = document.querySelector("[data-promo-backdrop]");
      const modalWrapper = document.querySelector(".modals-wrapper");
      if (!sidebar || !backdrop || !modalWrapper) return;
      const overlay = document.querySelector(".modals-overlay");
      if (overlay) overlay.remove();
      document.body.classList.remove("_has-modal");
      sidebar.classList.remove("_show");
    }

    document.body.addEventListener("click", (e) => {
      if (e.target.closest(".modals-overlay")) {
        closeSidebar();
      }
    });

    /* --- LOGIC --- */
    const globalState = createState();

    const target = document.querySelector(SELECTORS.promoTargetSection);
    if (!target || document.querySelector(".promo-section")) return;

    if (!document.getElementById("promo-custom-sidebar")) {
      document.body.insertAdjacentHTML("beforeend", sidebarTemplate(globalState));
    }
    target.insertAdjacentHTML("afterend", promoSection());

    createObserver(SELECTORS.promoImageGroup, (imgGroup) => {
      if (imgGroup.dataset.sidebarBound) return;
      imgGroup.dataset.sidebarBound = "1";
      imgGroup.addEventListener("click", () => openSidebar());
    });

    initAccordion();

    createObserver(SELECTORS.promoItems, (promoItems) => {
      const formatted = [...promoItems.querySelectorAll(".sale-type")]
        .filter(item => item.offsetParent !== null)
        .map(item => {
          const img = item.querySelector("img");
          const text = item.querySelector(".promo-content");
          return {
            image: img?.src || null,
            text: text?.textContent.trim() || "",
          };
        });
      globalState.promoState = formatted;
      updatePromoImages(globalState);
    });

    const promoItemsSection = document.querySelector(SELECTORS.promoItems);
    if (promoItemsSection) promoItemsSection.style.display = "none";

    // Click Handlers
    function attachPromoClick(id, triggerId, flag) {
      const el = document.getElementById(id);
      if (!el || el.dataset[flag]) return;
      el.dataset[flag] = "1";
      el.addEventListener("click", () => {
        const clickIt = (node) => {
          try { node.click(); }
          catch { node.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true })); }
        };
        const trigger = document.getElementById(triggerId);
        if (trigger) { clickIt(trigger); return; }
        createObserver(`#${triggerId}`, clickIt, { timeout: 5000 });
      });
    }

    attachPromoClick("frozen-prices", "promotion-trigger-49632199458", "frozenListener");
    attachPromoClick("no-eu-roaming", "promotion-trigger-49845199458", "roamingListener");

    document.body.addEventListener("click", (e) => {
      if (e.target.closest(".action-close") || e.target.hasAttribute("data-promo-backdrop")) {
        closeSidebar();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeSidebar();
    });
  }

  /* =========================
     TASK 2: NEW TASK
  ========================= */
  function taskTwo() {
    const labelSpan = document.querySelector(
      ".product-type-switcher .swatch-attribute > .swatch-attribute-label"
    );
    const paymentOptionsWrapper = document.querySelector(".swatch-attribute-options");

    if (!labelSpan || !paymentOptionsWrapper) return;
    if (document.querySelector(".payment-select-wrapper")) return;

    const paymentOptions = [...paymentOptionsWrapper.querySelectorAll(".swatch-option-item")]
      .map(item => ({
        label: item.querySelector("span")?.textContent.trim(),
        value: item.dataset.name,
        el: item
      }));

    const selectedText = paymentOptionsWrapper.querySelector(
      ".swatch-option-item.selected span"
    )?.textContent.trim();

    const paymentSelect = `
    <div class="payment-select-wrapper">
      <select name="payment-select" class="payment-select">
        ${paymentOptions.map(option => `
          <option 
            value="${option.value}" 
            ${option.label === selectedText ? "selected" : ""}
          >
            ${option.label}
          </option>
        `).join("")}
      </select>
    </div>
  `;

    labelSpan.insertAdjacentHTML("afterend", paymentSelect);

    const selectEl = document.querySelector(".payment-select");

    selectEl.addEventListener("change", (e) => {
      const selectedValue = e.target.value;

      const targetSwatch = paymentOptions.find(
        opt => opt.value === selectedValue
      )?.el;

      if (targetSwatch) {
        targetSwatch.click();
      }
    });

    paymentOptionsWrapper.style.display = "none"



    // COLOR AND STORAGE SELECT FUNCTIONALITY
    function waitForFirstElement(parent, cb) {
      const el = parent.firstElementChild;
      if (el) {
        cb(el);
        return;
      }

      const observer = new MutationObserver(() => {
        const child = parent.firstElementChild;
        if (child) {
          observer.disconnect();
          cb(child);
        }
      });

      observer.observe(parent, { childList: true });
    }

    const colorAndStorageSelect = document.getElementById("tm-deal-device-wrapper");
    if (!colorAndStorageSelect) return;

    waitForFirstElement(colorAndStorageSelect, (firstChild) => {
      const swatchAttributes = firstChild.querySelectorAll(".swatch-attribute");

      let colorSwatchAttribute = null;
      let storageSwatchAttribute = null;

      swatchAttributes.forEach(attr => {
        const label = attr.querySelector(".swatch-attribute-label")?.textContent.trim();
        if (label === "Colour" || label === "Color") {
          colorSwatchAttribute = attr;
        } else if (label === "Storage") {
          storageSwatchAttribute = attr;
        }
      });

      // Extract swatch options from color attribute
      const colorSwatchOptions = colorSwatchAttribute
        ? [...colorSwatchAttribute.querySelectorAll(".swatch-option")]
        : [];

      // Extract swatch options from storage attribute
      const storageSwatchOptions = storageSwatchAttribute
        ? [...storageSwatchAttribute.querySelectorAll(".swatch-option")]
        : [];

      // Filter out disabled options and keep track of original indices
      const enabledColorOptions = colorSwatchOptions
        .map((option, originalIndex) => ({ element: option, originalIndex }))
        .filter(({ element }) => !element.classList.contains('disabled'));

      const enabledStorageOptions = storageSwatchOptions
        .map((option, originalIndex) => ({ element: option, originalIndex }))
        .filter(({ element }) => !element.classList.contains('disabled'));

      // Create custom color and storage select dropdowns
      const customColorStorageContainer = `
        <div class="custom-color-storage-container">
          <div class="custom-color">
            <div class="custom-color-title">Colour</div>
            <select name="color-select" class="custom-color-options">
              ${enabledColorOptions.map(({ element, originalIndex }) => `
                <option value="${originalIndex}" ${element.classList.contains('selected') ? 'selected' : ''}>
                  ${element.textContent.trim()}
                </option>
              `).join("")}
            </select>
          </div>
          <div class="custom-storage">
            <div class="custom-storage-title">Storage</div>
            <select name="storage-select" class="custom-storage-options">
              ${enabledStorageOptions.map(({ element, originalIndex }) => `
                <option value="${originalIndex}" ${element.classList.contains('selected') ? 'selected' : ''}>
                  ${element.textContent.trim()}
                </option>
              `).join("")}
            </select>
          </div>
        </div>
      `;

      // Inject custom container before firstChild
      firstChild.insertAdjacentHTML('beforebegin', customColorStorageContainer);

      // Get references to the custom select elements
      const colorSelectEl = document.querySelector('.custom-color-options');
      const storageSelectEl = document.querySelector('.custom-storage-options');

      // Function to update select options based on current enabled/disabled state
      function updateSelectOptions() {
        // Re-check current state of swatches
        const currentColorOptions = colorSwatchOptions
          .map((option, originalIndex) => ({ element: option, originalIndex }))
          .filter(({ element }) => !element.classList.contains('disabled'));

        const currentStorageOptions = storageSwatchOptions
          .map((option, originalIndex) => ({ element: option, originalIndex }))
          .filter(({ element }) => !element.classList.contains('disabled'));

        // Get currently selected values
        const selectedColorIndex = colorSelectEl.value;
        const selectedStorageIndex = storageSelectEl.value;

        // Rebuild color options
        colorSelectEl.innerHTML = currentColorOptions.map(({ element, originalIndex }) => `
          <option value="${originalIndex}" ${element.classList.contains('selected') ? 'selected' : ''}>
            ${element.textContent.trim()}
          </option>
        `).join('');

        // Rebuild storage options
        storageSelectEl.innerHTML = currentStorageOptions.map(({ element, originalIndex }) => `
          <option value="${originalIndex}" ${element.classList.contains('selected') ? 'selected' : ''}>
            ${element.textContent.trim()}
          </option>
        `).join('');
      }

      // Color select change handler
      if (colorSelectEl) {
        colorSelectEl.addEventListener('change', (e) => {
          const selectedIndex = parseInt(e.target.value, 10);
          const targetSwatch = colorSwatchOptions[selectedIndex];
          if (targetSwatch) {
            targetSwatch.click();
            // Update options after a short delay to allow DOM to update
            setTimeout(() => updateSelectOptions(), 100);
          }
        });
      }

      // Storage select change handler
      if (storageSelectEl) {
        storageSelectEl.addEventListener('change', (e) => {
          const selectedIndex = parseInt(e.target.value, 10);
          const targetSwatch = storageSwatchOptions[selectedIndex];
          if (targetSwatch) {
            targetSwatch.click();
            // Update options after a short delay to allow DOM to update
            setTimeout(() => updateSelectOptions(), 100);
          }
        });
      }

      // Hide the original firstChild
      firstChild.style.display = 'none';
    });



  }

  /* =========================
     TASK 3: NEW TASK
  ========================= */
  function taskThree() {
    const chooseDataLabel = document.querySelector(".field.option.required");
    console.log(chooseDataLabel, "534");
  }


  /* =========================
     MAIN EXECUTION
  ========================= */
  waitForBody(() => {
    try {
      initApplePromo();
    } catch (e) {
      console.error("Error in Apple Promo Init:", e);
    }

    try {
      taskTwo();
    } catch (e) {
      console.error("Error in New Task Init:", e);
    }

    try {
      taskThree();
    } catch (e) {
      console.error("Error in New Task Init:", e);
    }
  });

})();
