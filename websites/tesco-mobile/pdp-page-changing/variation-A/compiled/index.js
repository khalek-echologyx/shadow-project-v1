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

  function poll(t, i, o = false, e = 10000, a = 25) {
    e < 0 ||
      (t()
        ? i()
        : setTimeout(() => {
          poll(t, i, o, o ? e : e - a, a);
        }, a));
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
            content: `Eligible Handsets:\niPhone 17\niPhone 17 Pro\niPhone 17 Pro Max\niPhone Air\niPhone 16 with Apple iPad A16\niPhone 16e\niPhone 16 Pro Max\niPhone 16 Pro Max with Apple Watch Series 10\niPhone 16 Pro\niPhone 16 Plus\niPhone 16\niPhone 15 Pro Max\niPhone 15\niPhone 14\niPhone 13\n\nHow to claim 3 months of Apple TV+\n\nTurn on your new iPhone and sign in with your Apple ID.\nOpen the Apple TV app. Make sure your eligible device is running the latest version of iOS, iPad OS, tvOS, or macOS.\nThe offer should appear immediately after you launch the Apple TV app. If not, scroll down in Watch Now until the offer appears.\nTap Enjoy 3 months Free. You might be asked to enter your Apple ID password, confirm your billing information, or add a valid payment method.\nNew subscribers get three months of Apple News+ free when you buy a new iPhone, subject to the terms and conditions.\n\nClick Here for Full Terms & Conditions.\n\n£9.99/month after free trial. One subscription per Family Sharing group. Offer good for 3 months after eligible device activation. Plan automatically renews until cancelled. Restrictions and other terms apply. See apple.com/uk/promo for more information.`,
          },
          {
            title: "Apple Music",
            content: `Eligible Handsets:\niPhone 17\niPhone 17 Pro\niPhone 17 Pro Max\niPhone Air\niPhone 16 with Apple iPad A16\niPhone 16e\niPhone 16 Pro Max\niPhone 16 Pro Max with Apple Watch Series 10\niPhone 16 Pro\niPhone 16 Plus\niPhone 16\niPhone 15 Pro Max\niPhone 15\niPhone 14\niPhone 13\n\nHow to claim 3 months of Apple TV+\n\nTurn on your new iPhone and sign in with your Apple ID.\nOpen the Apple TV app. Make sure your eligible device is running the latest version of iOS, iPad OS, tvOS, or macOS.\nThe offer should appear immediately after you launch the Apple TV app. If not, scroll down in Watch Now until the offer appears.\nTap Enjoy 3 months Free. You might be asked to enter your Apple ID password, confirm your billing information, or add a valid payment method.\nNew subscribers get three months of Apple News+ free when you buy a new iPhone, subject to the terms and conditions.\n\nClick Here for Full Terms & Conditions.\n\n£9.99/month after free trial. One subscription per Family Sharing group. Offer good for 3 months after eligible device activation. Plan automatically renews until cancelled. Restrictions and other terms apply. See apple.com/uk/promo for more information.`,
          },
          {
            title: "Apple Fintess +",
            content: "Lorem",
          },
          {
            title: "Apple Arcade",
            content: "Lorem",
          },
          {
            title: "Apple News +",
            content: "Lorem",
          },
        ],
      };
    }

    /* --- HELPERS --- */
    function renderPromoImages(items) {
      if (!Array.isArray(items) || items.length <= 2) return "";
      const usableItems = items.slice(2).filter((item) => item.image);
      const displayItems = usableItems.slice(0, 3);
      const remaining = usableItems.length - displayItems.length;
      let html = "";
      displayItems.forEach((item) => {
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

      const accordions = document.querySelectorAll(".custom-sidebar-accordion");
      if (!accordions.length) return;

      accordions.forEach((acc, index) => {
        const content = acc.querySelector(".cust-sidebar-accordion-content");
        const icon = acc.querySelector(".custom-sidebar-accordion-icon");
        if (index === 0) {
          acc.classList.add("_open");
          content.style.maxHeight = content.scrollHeight + "px";
          icon.innerHTML = ACCORDION_ICON_EXPANDED;
        } else {
          icon.innerHTML = ACCORDION_ICON_COLLAPSED;
        }
      });

      accordions.forEach((accordion) => {
        const header = accordion.querySelector(
          ".custom-sidebar-accordion-header"
        );
        const content = accordion.querySelector(
          ".cust-sidebar-accordion-content"
        );
        const icon = accordion.querySelector(".custom-sidebar-accordion-icon");

        header.addEventListener("click", () => {
          const isOpen = accordion.classList.contains("_open");
          accordions.forEach((acc) => {
            acc.classList.remove("_open");
            acc.querySelector(
              ".cust-sidebar-accordion-content"
            ).style.maxHeight = null;
            acc.querySelector(".custom-sidebar-accordion-icon").innerHTML =
              ACCORDION_ICON_COLLAPSED;
          });
          if (!isOpen) {
            accordion.classList.add("_open");
            content.style.maxHeight = content.scrollHeight + "px";
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
        modalWrapper.insertAdjacentHTML(
          "beforebegin",
          `<div class="modals-overlay" style="z-index: 901;"></div>`
        );
      }
      document.body.classList.add("_has-modal");
      sidebar.classList.add("_show");
      sidebar.style.zIndex = "902";
    }

    function closeSidebar() {
      const sidebar = document.getElementById("promo-custom-sidebar");
      if (!sidebar || !sidebar.classList.contains("_show")) return;

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
      document.body.insertAdjacentHTML(
        "beforeend",
        sidebarTemplate(globalState)
      );
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
        .filter((item) => item.offsetParent !== null)
        .map((item) => {
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
          try {
            node.click();
          } catch {
            node.dispatchEvent(
              new MouseEvent("click", { bubbles: true, cancelable: true })
            );
          }
        };
        const trigger = document.getElementById(triggerId);
        if (trigger) {
          clickIt(trigger);
          return;
        }
        createObserver(`#${triggerId}`, clickIt, { timeout: 5000 });
      });
    }

    attachPromoClick(
      "frozen-prices",
      "promotion-trigger-49632199458",
      "frozenListener"
    );
    attachPromoClick(
      "no-eu-roaming",
      "promotion-trigger-49845199458",
      "roamingListener"
    );

    document.body.addEventListener("click", (e) => {
      if (
        e.target.closest("#promo-custom-sidebar .action-close") ||
        e.target.hasAttribute("data-promo-backdrop")
      ) {
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
    const paymentOptionsWrapper = document.querySelector(
      ".swatch-attribute-options"
    );

    if (!labelSpan || !paymentOptionsWrapper) return;
    if (document.querySelector(".payment-select-wrapper")) return;

    const paymentOptions = [
      ...paymentOptionsWrapper.querySelectorAll(".swatch-option-item"),
    ].map((item) => ({
      label: item.querySelector("span")?.textContent.trim(),
      value: item.dataset.name,
      el: item,
    }));

    const selectedText = paymentOptionsWrapper
      .querySelector(".swatch-option-item.selected span")
      ?.textContent.trim();

    const paymentSelect = `
    <div class="payment-select-wrapper">
      <select name="payment-select" class="payment-select">
        ${paymentOptions
        .map(
          (option) => `
          <option 
            value="${option.value}" 
            ${option.label === selectedText ? "selected" : ""}
          >
            ${option.label}
          </option>
        `
        )
      .join("")}
      </select>
    </div>
  `;

    labelSpan.insertAdjacentHTML("afterend", paymentSelect);

    const selectEl = document.querySelector(".payment-select");

    selectEl.addEventListener("change", (e) => {
      const selectedValue = e.target.value;

      const targetSwatch = paymentOptions.find(
        (opt) => opt.value === selectedValue
      )?.el;

      if (targetSwatch) {
        targetSwatch.click();
      }
    });

    paymentOptionsWrapper.style.display = "none";

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

    const colorAndStorageSelect = document.getElementById(
      "tm-deal-device-wrapper"
    );
    if (!colorAndStorageSelect) return;

    waitForFirstElement(colorAndStorageSelect, (firstChild) => {
      const swatchAttributes = firstChild.querySelectorAll(".swatch-attribute");

      let colorSwatchAttribute = null;
      let storageSwatchAttribute = null;

      swatchAttributes.forEach((attr) => {
        const label = attr
          .querySelector(".swatch-attribute-label")
          ?.textContent.trim();
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

      // Filter out disabled options and keep track of original indices, colors, and labels
      const enabledColorOptions = colorSwatchOptions
        .map((option, originalIndex) => {
          const colorSpan = option.querySelector(".swatch-color");
          const bgColor = colorSpan
            ? colorSpan.style.backgroundColor ||
            getComputedStyle(colorSpan).backgroundColor
            : "";
          const label =
            option
              .querySelector("span:not(.swatch-color)")
              ?.textContent.trim() || option.textContent.trim();
          return { element: option, originalIndex, bgColor, label };
        })
        .filter(({ element }) => !element.classList.contains("disabled"));

      const enabledStorageOptions = storageSwatchOptions
        .map((option, originalIndex) => ({
          element: option,
          originalIndex,
          label: option.textContent.trim(),
        }))
        .filter(({ element }) => !element.classList.contains("disabled"));

      // Create custom color and storage select dropdowns
      const customColorStorageContainer = `
        <div class="custom-color-storage-container">
          <div class="custom-color">
            <div class="custom-color-title">Colour</div>
            <div class="custom-select-ui" id="custom-color-select">
              <div class="custom-select-selected" style="height: auto;">
                ${enabledColorOptions
        .filter(({ element }) =>
          element.classList.contains("selected")
        )
        .map(
          (opt) => `
                  <span class="selected-color-dot" style="background: ${opt.bgColor}"></span>
                  <span class="selected-label">${opt.label}</span>
                `
      )
        .join("")}
              </div>
              <div class="custom-select-options">
                ${enabledColorOptions
        .map(
          (opt) => `
                  <div class="custom-select-option ${opt.element.classList.contains("selected") ? "selected" : ""}" data-value="${opt.originalIndex}">
                    <span class="color-dot" style="background: ${opt.bgColor}"></span>
                    <span class="option-label">${opt.label}</span>
                  </div>
                `
      )
        .join("")}
              </div>
            </div>
          </div>
          <div class="custom-storage">
            <div class="custom-storage-title">Storage</div>
            <select name="storage-select" class="custom-storage-options">
              ${enabledStorageOptions
        .map(
          ({ element, originalIndex }) => `
                <option value="${originalIndex}" ${element.classList.contains("selected") ? "selected" : ""}>
                  ${element.textContent.trim()}
                </option>
              `
      )
        .join("")}
            </select>
          </div>
        </div>
      `;

      // Inject custom container before firstChild
      firstChild.insertAdjacentHTML("beforebegin", customColorStorageContainer);

      // Get references to the custom select elements
      const colorSelectUI = document.getElementById("custom-color-select");
      const storageSelectEl = document.querySelector(".custom-storage-options");

      // Function to update select options based on current enabled/disabled state
      function updateSelectOptions() {
        // Re-check current state of color swatches
        const currentColorOptions = colorSwatchOptions
          .map((option, originalIndex) => {
            const colorSpan = option.querySelector(".swatch-color");
            const bgColor = colorSpan
              ? colorSpan.style.backgroundColor ||
              getComputedStyle(colorSpan).backgroundColor
              : "";
            const label =
              option
                .querySelector("span:not(.swatch-color)")
                ?.textContent.trim() || option.textContent.trim();
            return { element: option, originalIndex, bgColor, label };
          })
          .filter(({ element }) => !element.classList.contains("disabled"));

        // Update Color UI Options
        const optionsContainer = colorSelectUI.querySelector(
          ".custom-select-options"
        );
        optionsContainer.innerHTML = currentColorOptions
          .map(
            (opt) => `
          <div class="custom-select-option ${opt.element.classList.contains("selected") ? "selected" : ""}" data-value="${opt.originalIndex}">
            <span class="color-dot" style="background: ${opt.bgColor}"></span>
            <span class="option-label">${opt.label}</span>
          </div>
        `
          )
          .join("");

        // Update Color UI Selected State
        const selectedDisplay = colorSelectUI.querySelector(
          ".custom-select-selected"
        );
        const activeOpt = currentColorOptions.find(({ element }) =>
          element.classList.contains("selected")
        );
        if (activeOpt) {
          selectedDisplay.innerHTML = `
            <span class="selected-color-dot" style="background: ${activeOpt.bgColor}"></span>
            <span class="selected-label">${activeOpt.label}</span>
          `;
        }

        // Re-check storage swatches
        const currentStorageOptions = storageSwatchOptions
          .map((option, originalIndex) => ({ element: option, originalIndex }))
          .filter(({ element }) => !element.classList.contains("disabled"));

        // Rebuild storage options
        storageSelectEl.innerHTML = currentStorageOptions
          .map(
            ({ element, originalIndex }) => `
          <option value="${originalIndex}" ${element.classList.contains("selected") ? "selected" : ""}>
            ${element.textContent.trim()}
          </option>
        `
          )
          .join("");
      }

      // Color select UI click handlers
      if (colorSelectUI) {
        const selectedDisplay = colorSelectUI.querySelector(
          ".custom-select-selected"
        );
        selectedDisplay.addEventListener("click", () => {
          colorSelectUI.classList.toggle("_open");
        });

        colorSelectUI.addEventListener("click", (e) => {
          const optionEl = e.target.closest(".custom-select-option");
          if (optionEl) {
            const selectedIndex = parseInt(optionEl.dataset.value, 10);
            const targetSwatch = colorSwatchOptions[selectedIndex];
            if (targetSwatch) {
              targetSwatch.click();
              colorSelectUI.classList.remove("_open");
              // Update options after a short delay to allow DOM to update
              setTimeout(() => updateSelectOptions(), 150);
            }
          }
        });

        // Close when clicking outside
        document.addEventListener("click", (e) => {
          if (!colorSelectUI.contains(e.target)) {
            colorSelectUI.classList.remove("_open");
          }
        });
      }

      // Storage select change handler
      if (storageSelectEl) {
        storageSelectEl.addEventListener("change", (e) => {
          const selectedIndex = parseInt(e.target.value, 10);
          const targetSwatch = storageSwatchOptions[selectedIndex];
          if (targetSwatch) {
            targetSwatch.click();
            // IMPORTANT: When storage changes, available colors often change.
            // We wait for the DOM to update then refresh the color dropdown.
            setTimeout(() => updateSelectOptions(), 200);
          }
        });
      }

      // Hide the original firstChild
      firstChild.style.display = "none";
    });
  }

  /* =========================
     TASK 3: NEW TASK
  ========================= */
  function taskThree() {
    // CUSTOM CC WRAPPER SECTIONS
    poll(
      () =>
        document.querySelector(".custom-cc-wrapper") &&
        document.querySelector(".cc-savings") &&
        document.querySelector(".tm-option-wrapper.option-type-tariff"),
      () => {
        const customCCWrapper = document.querySelector(".custom-cc-wrapper");
        if (customCCWrapper) {
          const ccSaving = customCCWrapper.querySelector(".cc-savings");
          if (!document.querySelector(".custom-cc-savings")) {
            ccSaving.classList.add("custom-cc-savings");
            document
              .querySelector(".tm-option-wrapper.option-type-tariff")
              .insertAdjacentElement("beforebegin", ccSaving);
          }
          if (!customCCWrapper.classList.contains("new-cc-wrapper")) {
            customCCWrapper.classList.add("new-cc-wrapper");
            const regularPriceWrapper = customCCWrapper.querySelectorAll(
              ".field .label .price .regular-price-wrapper > span"
            );
            regularPriceWrapper.forEach((price) => {
              price.innerText = "/month";
            });
            const clubPriceWrapper = customCCWrapper.querySelectorAll(
              ".field .label .price .clubcard-price-wrapper .clubcard-price-value"
            );
            clubPriceWrapper.forEach((span) => {
              span.innerHTML = span.innerHTML.replace(" a month", "/month");
            });
          }
        }
      }
    );

    // REGULAR SECTION
    poll(
      () =>
        document.querySelector(".nested.options-list") &&
        document.querySelector(".custom-cc-wrapper"),
      () => {
        const optionsList = document.querySelector(".nested.options-list");
        const targetccWraper = optionsList.querySelector(".custom-cc-wrapper");
        const filteredDataChoices =
          optionsList.querySelectorAll(".field.choice");

        // 1️⃣ insert template string
        targetccWraper.insertAdjacentHTML(
          "afterend",
          `<div class="new-grid-section"></div>`
        );

        // 2️⃣ get the newly inserted element
        const newGridSection = optionsList.querySelector(".new-grid-section");

        // 3️⃣ move each choice into the new grid section
        filteredDataChoices.forEach((choice) => {
          newGridSection.appendChild(choice);
        });

        const regularPriceWrapper = newGridSection.querySelectorAll(
          ".field .label .price .regular-price-wrapper > span"
        );
        regularPriceWrapper.forEach((price) => {
          price.innerText = "/month";
        });
        const clubPriceWrapper = newGridSection.querySelectorAll(
          ".field .label .price .clubcard-price-wrapper .clubcard-price-value"
        );
        clubPriceWrapper.forEach((span) => {
          span.innerHTML = span.innerHTML.replace(" a month", "/month");
        });
      }
    );

    poll(
      () => document.querySelector(".nested.options-list"),
      () => {
        const optionsList = document.querySelector(".nested.options-list");
        const filteredDataChoices =
          optionsList.querySelectorAll(".field.choice");

        // 1️⃣ insert template string
        optionsList.insertAdjacentHTML(
          "afterend",
          `<div class="new-grid-section"></div>`
        );

        // 2️⃣ get the newly inserted element
        const newGridSection = optionsList.querySelector(".new-grid-section");

        // 3️⃣ move each choice into the new grid section
        filteredDataChoices.forEach((choice) => {
          newGridSection.appendChild(choice);
        });

        const regularPriceWrapper = newGridSection.querySelectorAll(
          ".field .label .price .regular-price-wrapper > span"
        );
        regularPriceWrapper.forEach((price) => {
          price.innerText = "/month";
        });
        const clubPriceWrapper = newGridSection.querySelectorAll(
          ".field .label .price .clubcard-price-wrapper .clubcard-price-value"
        );
        clubPriceWrapper.forEach((span) => {
          span.innerHTML = span.innerHTML.replace(" a month", "/month");
        });
      }
    );
  }

  // DATA CALCULATOR
  function taskFour() {
    const DATA_CALCULATOR_ITEMS = [
      {
        key: "browsing",
        name: "Browsing",
        icon: "click.png",
        rate: 0.015,
        unit: "hours",
        options: [
          { label: "Never", value: 0 },
          { label: "30 mins", value: 30 },
          { label: "1 hour", value: 60 },
          { label: "2 hours", value: 120 },
          { label: "4 hours", value: 240 },
        ],
      },
      {
        key: "social",
        name: "Social",
        icon: "facebook.png",
        rate: 0.018,
        options: [
          { label: "Never", value: 0 },
          { label: "30 mins", value: 30 },
          { label: "1 hour", value: 60 },
          { label: "2 hours", value: 120 },
          { label: "4 hours", value: 240 },
        ],
      },
      {
        key: "music",
        name: "Music",
        icon: "headphone.png",
        rate: 0.16,
        options: [
          { label: "Never", value: 0 },
          { label: "30 mins", value: 30 },
          { label: "1 hour", value: 60 },
          { label: "2 hours", value: 120 },
          { label: "4 hours", value: 240 },
        ],
      },
      {
        key: "emails",
        name: "Emails",
        icon: "email.png",
        rate: 0.003,
        options: [
          { label: "0", value: 0 },
          { label: "20", value: 20 },
          { label: "100", value: 100 },
          { label: "200", value: 200 },
          { label: "300", value: 300 },
        ],
      },
      {
        key: "apps",
        name: "Apps",
        icon: "apps.png",
        rate: 0.098,
        options: [
          { label: "0", value: 0 },
          { label: "5", value: 5 },
          { label: "10", value: 10 },
          { label: "20", value: 20 },
          { label: "30", value: 30 },
        ],
      },
    ];

    const selectedValues = {
      browsing: 0,
      social: 0,
      music: 0,
      emails: 0,
      apps: 0,
    };

    const iconBasePath =
      "/etc.clientlibs/tescomobile/clientlibs/clientlib-site/resources/images";

    function renderOptions({ key, options, unit }) {
      return options
        .map(
          ({ label, value }) => `
        <label>
          <input type="radio"
                 class="calc__input"
                 name="${key}"
                 value="${value}"
                 ${unit ? `data-unit="${unit}"` : ""}>
          <span class="button button--alpha">${label}</span>
        </label>
      `
        )
        .join("");
    }

    function renderRow(item) {
      return `
        <div class="data-calculator__context__row">
          <div class="data-calculator__context__label">
            <div class="data-calculator__context__label--layout">
              <img class="data-calculator__context__icon"
                  src="${iconBasePath}/${item.icon}"
                  alt="${item.name}">
              <strong class="data-calculator__context__name">${item.name}</strong>
            </div>
          </div>

          <div class="data-calculator__context__values button-group"
              data-group="${item.key}"
              data-value="${item.rate}">
            ${renderOptions(item)}
          </div>
        </div>
      `;
    }
    function dataCalculatorSidebarTemplate() {
      return `
        <aside id="data-cal-sidebar"
              class="modal-slide spotify cart-slider show-close _inner-scroll"
              tabindex="0"
              role="dialog"
              data-role="modal"
              data-type="slide">

          <div class="modal-inner-wrap">
            <header class="modal-header">
              <button class="action-close" data-role="closeBtn" type="button">
                <span>Close</span>
              </button>
            </header>

            <div class="modal-content" data-role="content">
              <div class="custom-data-calculator">
                <section class="custom-data-calculator__header-container">
                  <div>
                    <h1>How much data do I need?</h1>
                    <p class="subtitle">Select your typical <strong>daily internet usage</strong> from the options
                      below</p>
                    <p class="description">We’ll then estimate your monthly mobile data usage to help find the
                      right tariff for you</p>
                  </div>
                </section>
                <section class="custom-data-calculator__content">
                  <div class="data-calculator__context">
                    ${DATA_CALCULATOR_ITEMS.map(renderRow).join("")}
                  </div>
              </div>
            </div>
          </div>
        </aside>

        <div class="promo-sidebar-backdrop" data-promo-backdrop style="display:none"></div>
      `;
    }

    document.body.insertAdjacentHTML(
      "beforeend",
      dataCalculatorSidebarTemplate()
    );

    function openDataCalculatorSidebar() {
      const sidebar = document.getElementById("data-cal-sidebar");
      const backdrop = document.querySelector("[data-promo-backdrop]");
      const modalWrapper = document.querySelector(".modals-wrapper");
      if (!sidebar || !backdrop || !modalWrapper) return;
      if (!document.querySelector(".modals-overlay")) {
        modalWrapper.insertAdjacentHTML(
          "beforebegin",
          `<div class="modals-overlay" style="z-index: 901;"></div>`
        );
      }
      document.body.classList.add("_has-modal");
      sidebar.classList.add("_show");
      sidebar.style.zIndex = "902";
    }

    function closeDataCalculatorSidebar() {
      const sidebar = document.getElementById("data-cal-sidebar");
      if (!sidebar || !sidebar.classList.contains("_show")) return;

      const backdrop = document.querySelector("[data-promo-backdrop]");
      const modalWrapper = document.querySelector(".modals-wrapper");
      if (!sidebar || !backdrop || !modalWrapper) return;
      const overlay = document.querySelector(".modals-overlay");
      if (overlay) overlay.remove();
      document.body.classList.remove("_has-modal");
      sidebar.classList.remove("_show");
    }

    document.body.addEventListener("click", (e) => {
      if (
        e.target.closest(".modals-overlay") ||
        e.target.closest("#data-cal-sidebar .action-close")
      ) {
        closeDataCalculatorSidebar();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeDataCalculatorSidebar();
    });

    const targetDataCalculator = document.getElementById("tariff-hint");
    targetDataCalculator.addEventListener("click", (e) => {
      e.preventDefault();
      openDataCalculatorSidebar();
    });

    const dataContext = document.querySelector(".data-calculator__context");

    dataContext.addEventListener("click", (e) => {
      const label = e.target.closest("label");
      if (!label) return;
      const group = e.target.closest(".data-calculator__context__values");
      if (!group) return;
      const input = label.querySelector("input");
      const groupKey = group.dataset.group;
      const groupDataValue = Number(group.dataset.value);
      const calcSelectedValue = groupDataValue * Number(input.value);

      selectedValues[groupKey] = calcSelectedValue.toFixed(2);

      group.querySelectorAll("span.button").forEach((span) => {
        span.classList.add("button--alpha");
      });

      const clickedSpan = label.querySelector("span.button");
      if (clickedSpan) {
        clickedSpan.classList.remove("button--alpha");
      }

      const total = Object.values(selectedValues).reduce(
        (sum, v) => sum + Number(v || 0),
        0
      );
      const totalFixed = Math.ceil(total);

      let estimationEl = document.getElementById("data-estimation-value");

      // If element doesn't exist, try to find or create it
      if (!estimationEl) {
        const estSection = document.querySelector(".estimation-section");
        if (estSection) {
          estimationEl = estSection.querySelector("h2");
          if (!estimationEl) {
            // Create it if missing
            const contentPart = estSection.querySelector(".content-part");
            if (contentPart) {
              estimationEl = document.createElement("h2");
              estimationEl.id = "data-estimation-value";
              contentPart.appendChild(estimationEl);
            }
          }
        }
      }

      if (estimationEl) {
        estimationEl.textContent = (total < 0.5 ? 500 : totalFixed) + (total < 0.5 ? "MB" : "GB");


      }

    });

    // Estimation section
    const estimationSectionTarget = document.querySelector(
      ".custom-data-calculator__content"
    );
    if (!estimationSectionTarget) {
      console.warn("Estimation target not found");
      return;
    }
    const estimationSection = `
    <div class="estimation-section">
      <div class="text-part">
        Estimated usage
      </div>
      <div class="content-part">
        <h2 id="data-estimation-value">0MB</h2>
      </div>
    </div>
    `;
    estimationSectionTarget.insertAdjacentHTML("afterend", estimationSection);

    // Verify element was created
    setTimeout(() => {
      const testEl = document.getElementById("data-estimation-value");
      console.log("Estimation element found:", testEl ? "yes" : "no");
    }, 100);

    // TARIFF CTA BUTTON SECTION
    const targetForTariffButton = document.querySelector(".estimation-section");
    const tariffSection = `
      <div class="tariff-section">
        <div class="tariff-cta-btn">
          <button class="button tariff-btn">
            Select Tariff
        </button>
        </div>
        <p>
          This is a rough guide, based on average data uses, and all amounts are rounded up. Your actual data usage may be higher. According to Ofcom, customers tend to increase their data usage each year. Think about future-proofing your data allowance so you don’t run out of data later down the line.
        </p>
      </div>
    `;
    targetForTariffButton.insertAdjacentHTML("afterend", tariffSection);

    const tariffBtn = document.querySelector(".tariff-btn");
    if (tariffBtn) {
      tariffBtn.addEventListener("click", (e) => {
        e.preventDefault();

        // Recalculate total to be safe, though selectedValues is up to date
        const total = Object.values(selectedValues).reduce(
          (sum, v) => sum + Number(v || 0),
          0
        );
        const totalFixed = Math.ceil(total);

        // Select the nearest match tariff
        const tariffInputs = document.querySelectorAll(
          '.option-type-tariff .field.choice input[type="radio"]'
        );
        const targetUsage = total < 0.5 ? 0.5 : totalFixed; // Target in GB

        let closestInput = null;
        let minDiff = Infinity;

        tariffInputs.forEach((input) => {
          // Find the label text. Typically follows the input.
          const label = input.nextElementSibling;
          const text = label ? label.textContent.trim().toLowerCase() : "";

          let itemValue = 0;

          // Parse value from text
          if (text.includes("unlimited")) {
            itemValue = 10000; // Large number for unlimited
          } else {
            const match = text.match(/(\d+(\.\d+)?)\s*(gb|mb)/i);
            if (match) {
              const val = parseFloat(match[1]);
              const unit = match[3].toLowerCase();
              itemValue = unit === "gb" ? val : val / 1000;
            }
          }

          if (itemValue > 0) {
            const diff = Math.abs(itemValue - targetUsage);
            if (diff < minDiff) {
              minDiff = diff;
              closestInput = input;
            }
          }
        });

        if (closestInput) {
          closestInput.click();
          closestInput.scrollIntoView({ behavior: "smooth", block: "center" });

          // Close the sidebar to show the user the selected tariff
          closeDataCalculatorSidebar();
        }
      });
    }
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

    try {
      taskFour();
    } catch (e) {
      console.error("Error in New Task Init:", e);
    }
  });
})();
