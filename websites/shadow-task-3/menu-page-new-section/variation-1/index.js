(() => {
  function waitForNuxtReady(cb) {
    const check = () => {
      if (
        window.$nuxt &&
        window.$nuxt._isMounted &&
        document.querySelector("#base-accordion-alert__header-trigger")
      ) {
        cb();
      } else {
        requestAnimationFrame(check);
      }
    };
    check();
  }

  const SELECTORS = {
    accordionTrigger: ".accordion-alert-visible",
    subNavTarget: ".base-navigation__items--subnav",
  };

  // ================================
  // PRODUCT IDS (A/B TEST SCOPE)
  // ================================
  const TARGET_PRODUCT_IDS = [
    5155, // The ultimate gunpowder chicken
    5156, // The ultimate masala paneer
    5127, // Gunpowder chicken wings
    5113, // 3 Tenders
    5114, // 5 Tenders
    5117, // 8 boneless bites
    5118, // 12 boneless bites
    5115, // 8 wings
    5116, // 12 wings
    5153, // Hot honey
    5154, // Garlic aioli
    5152, // Mexicana mayo
    5147, // Garlic & Herb
    5146, // BBQ
    5151, // Katsu Curry
    5150, // Buffalo hot sauce
    5148, // Teriyaki
    5149, // Ghost chilli glaze
  ];
  let storeProducts = [];

  // ================================
  // STATE (LOCAL TO A/B TEST)
  // ================================
  let productState = [];

  // ================================
  // PRODUCT FINDER
  // ================================
  function newProductFinder() {
    if (!window.$nuxt || !$nuxt.$store) return [];

    const getter = $nuxt.$store.getters["menu/getProductById"];
    if (typeof getter !== "function") return [];

    const foundProducts = TARGET_PRODUCT_IDS.map((id) => {
      try {
        return getter(id);
      } catch (e) {
        return null;
      }
    }).filter(Boolean);

    productState = foundProducts;
    return foundProducts;
  }

  function createStandardProductCard(product) {
    const primarySku = product.skuList?.[0] || {};
    const price = primarySku.price || "";
    const calories = primarySku.calorieInformation?.calorie
      ? `${primarySku.calorieInformation.calorie.amount}${primarySku.calorieInformation.calorie.units}`
      : "";

    const optionsHtml = product.skuList
      ? product.skuList
          .map(
            (sku, index) => `
        <option ${index === 0 ? "selected" : ""} value="${sku.sku}">
          ${sku.name}
        </option>
      `
          )
          .join("")
      : "";

    return `
<div data-ref-id="base-menu-item-container"
     data-ref="base-menu-card"
     data-cy="product-card"
     product-description="${product.description || ""}"
     id="${product.id}"
     data-item-id="${product.id}"
     class="base-menu-card">

  <div class="base-menu-card__image-container">
    <picture data-ref-id="base-menu-card-image">
      <source srcset="${product.images?.desktop || ""}" media="(min-width: 1024px)">
      <source srcset="${product.images?.tablet || ""}" media="(min-width: 544px)">
      <source srcset="${product.images?.mobile || ""}" media="(min-width: 350px)">
      <img loading="lazy" src="${product.image || ""}" alt="${product.name}" class="base-lazy-image">
    </picture>
  </div>

  <div class="base-menu-card__content">
    <div class="base-menu-card__content-container">
      <h3 class="base-menu-card__title">${product.name}</h3>

      <div class="base-menu-card__description">
        <span class="base-color--neutral-grey-dark">${calories}</span>
      </div>

      <div class="base-menu-card__variants-container">
        <select class="base-select base-select--with-button">
          <option selected disabled hidden></option>
          ${optionsHtml}
        </select>
      </div>
    </div>

    <div class="base-menu-card__actions-container"><div data-ref-id="base-menu-price-container" class="base-menu-card__price-container"><div class="base-menu-card__product-price"><!----> <span data-ref="base-menu-price-text" data-ref-id="base-menu-price-text" class="base-menu-card__price">
             ${price}
            </span> <!----></div> <!----> <!----></div> <button data-v-4d4dcda2="" aria-label="Add Original Cheese &amp; Tomato to basket" data-ref-id="base-menu-item-button" class="base-add-to-basket base-button--primary base-add-to-basket--single-button-default base-menu-card__add-to-basket" type="single-button"><svg data-v-db19d898="" data-v-4d4dcda2="" xmlns="http://www.w3.org/2000/svg" class="base-icon base-add-to-basket__icon ic-ui-generic-plus"><use data-v-db19d898="" xlink:href="#ic-ui-generic-plus"></use></svg> <!----></button></div>
  </div>
</div>`;
  }

  function createSideProductCard(product) {
    const primarySku = product.skuList?.[0] || {};
    const price = primarySku.price || "";
    const variantName = primarySku.name || "";
    const image = product.images?.desktop || product.image || "";

    return `
    <div data-ref-id="base-menu-item-container"
        data-ref="base-menu-card"
        data-cy="pizza-menu-card--single-variant"
        product-description="${product.description || ""}"
        is-special-product="true"
        id="${product.id}"
        data-item-id="${product.id}"
        class="base-menu-card">

      <div class="base-menu-card__image-container">
        <picture data-ref-id="base-menu-card-image">
          <img loading="lazy"
              src="${image}"
              alt="${product.name}"
              class="base-lazy-image">
        </picture>
      </div>

      <div class="base-menu-card__content">
        <div class="base-menu-card__content-container">
          <div class="base-menu-card__title-container">
            <h3 class="base-menu-card__title">${product.name}</h3>
            <div class="base-menu-card__description">
              ${product.description || ""}
            </div>
          </div>

          <div class="base-menu-card__variants-container">
            <span class="base-menu-card__restricted-options">
              ${variantName}
            </span>
          </div>
        </div>

        <div class="base-menu-card__actions-container">
          <div data-ref-id="base-menu-price-container" class="base-menu-card__price-container"><div class="base-menu-card__product-price"><!----> <span data-ref="base-menu-price-text" data-ref-id="base-menu-price-text" class="base-menu-card__price">
                  ${price}
                </span> <!----></div> </div>
                
                <button data-side-product-button="true" data-product-id="${product.id}" data-v-4d4dcda2="" aria-label="Customise your pizza"                data-ref-id="customised-button" class="base-add-to-basket base-button--primary base-add-to-basket--single-button-default" type="single-button"><svg data-v-db19d898="" data-v-4d4dcda2="" xmlns="http://www.w3.org/2000/svg" class="base-icon base-add-to-basket__icon ic-ui-generic-chevron-right"><use data-v-db19d898="" xlink:href="#ic-ui-generic-chevron-right"></use></svg> <!---->
            </button>
          </div>
        </div>
      </div>
  </div>`;
  }

  function createProductItem(product) {
    if (!product) return "";

    if (product.productType === "Sides") {
      return createSideProductCard(product);
    }

    return createStandardProductCard(product);
  }

  //INJECT NEW SECTION
  function injectNewSection(products) {
    const newSection = document.createElement("div");
    newSection.id = "whats-new";
    newSection.className =
      "base-grid base-grid--mobile-gap-xs base-grid--mobile-1 base-grid--s-tablet-2 base-grid--m-tablet-3 base-grid--l-tablet-3 base-grid--s-desktop-4 base-grid--desktop-4 base-menu-card__new-section";
    newSection.innerHTML = `
      ${products.map((product) => createProductItem(product)).join("")}
    `;
    document
      .querySelector(SELECTORS.accordionTrigger)
      .insertAdjacentElement("afterend", newSection);
  }

  function ensureSubnavActiveFlag(subNavTarget) {
    if (!subNavTarget) return null;
    subNavTarget.classList.add("variation-has-active-flag");

    let flag = subNavTarget.querySelector(".variation-subnav-active-flag");
    if (!flag) {
      flag = document.createElement("div");
      flag.className = "variation-subnav-active-flag";
      subNavTarget.appendChild(flag);
    }

    return flag;
  }

  function setSubnavActive(subNavTarget, activeLink) {
    if (!subNavTarget || !activeLink) return;

    const links = subNavTarget.querySelectorAll("a");
    links.forEach((a) => a.classList.remove("base-navigation__item--active"));
    activeLink.classList.add("base-navigation__item--active");

    const flag = ensureSubnavActiveFlag(subNavTarget);
    if (!flag) return;

    const left = (activeLink.offsetLeft || 0) - (subNavTarget.scrollLeft || 0);
    const width = activeLink.offsetWidth || 0;
    flag.style.transform = `translateX(${left}px)`;
    flag.style.width = `${width}px`;
    flag.classList.add("is-visible");
  }

  function smoothScrollToWhatsNew() {
    const section = document.querySelector("#whats-new");
    if (!section) return;
    section.scrollIntoView({ behavior: "smooth", block: "start" });

    try {
      const url = new URL(window.location.href);
      url.hash = "#whats-new";
      window.history.pushState({}, "", url.toString());
    } catch (e) {
      // ignore
    }
  }

  function whatsNewHeading() {
    return `
              <h1 data-ref-id="base-ribbon" class="base-ribbon-title base-ribbon-title--brand-red"
            data-v-559c8b16="">
            <span data-ref-id="base-ribbon-title"
              class="base-ribbon-title__text-container base-ribbon-title__text-container--default"
              data-v-559c8b16="">
              <svg class="base-ribbon-title__left-icon" data-v-559c8b16="">
                <use xlink:href="#ribbon-brand-red" data-v-559c8b16=""></use>
              </svg>
              <span data-ref-id="base-ribbon-title__text-line-top"
                class="base-ribbon-title__text-line base-ribbon-title__text-line-top" data-v-559c8b16="">
                What's New
              </span> <!---->
              <svg class="base-ribbon-title__right-icon" data-v-559c8b16="">
                <use xlink:href="#ribbon-brand-red" data-v-559c8b16=""></use>
              </svg>
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" class="base-ribbon-title__svg-container"
              data-v-559c8b16="">
              <defs data-v-559c8b16="">
                <symbol id="ribbon-brand-red" viewBox="0 0 66 66" fill="none"
                  xmlns="http://www.w3.org/2000/svg" data-v-559c8b16="">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M66 0H38V7H0L11 36.5L0 66H59V62V59H66V0Z"
                    fill="var(--element-brand-red)" data-v-559c8b16=""></path>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M29 7V59L59 66L38 59V33V7H29Z"
                    fill="var(--element-shadow-brand-red)" data-v-559c8b16=""></path>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M38 59L59 66V59H38Z"
                    fill="var(--element-grey-bolder)" data-v-559c8b16=""></path>
                </symbol>
              </defs>
            </svg>
          </h1>
    `;
  }

  function spiceSection() {
    return `
    <div class="base-page__block-center">
    <ul data-ref-id="list-nutritional-icons"
        class="base-nutritional-key base-nutritional-key--boxed">
        <li title="Vegetarian" data-ref-id="vegetarian-icon"
            class="base-nutritional-key__item base-nutritional-key__item--vegetarian">
            <button type="button" tabindex="0"
                class="base-button--reset base-nutritional-key__button">
                <svg xmlns="http://www.w3.org/2000/svg" title="vegetarian"
                    class="base-icon ic-ui-nutritional-vegetarian base-nutritional-key__icon"
                    data-v-db19d898="">
                    <use xlink:href="#ic-ui-nutritional-vegetarian" data-v-db19d898=""></use>
                </svg>
                <span class="base-nutritional-key__label">Vegetarian</span>
            </button>
        </li>
        <li title="Plant-Based" data-ref-id="vegan-icon"
            class="base-nutritional-key__item base-nutritional-key__item--vegan">
            <button type="button" tabindex="0"
                class="base-button--reset base-nutritional-key__button">
                <svg xmlns="http://www.w3.org/2000/svg" title="vegan"
                    class="base-icon ic-ui-nutritional-vegan base-nutritional-key__icon"
                    data-v-db19d898="">
                    <use xlink:href="#ic-ui-nutritional-vegan" data-v-db19d898=""></use>
                </svg>
                <span class="base-nutritional-key__label">Plant-Based</span>
            </button>
        </li>
        <li title="Gluten free" data-ref-id="gluten-free-icon"
            class="base-nutritional-key__item base-nutritional-key__item--gluten-free">
            <button type="button" tabindex="0"
                class="base-button--reset base-nutritional-key__button">
                <svg xmlns="http://www.w3.org/2000/svg" title="gluten-free"
                    class="base-icon ic-ui-nutritional-gluten-free base-nutritional-key__icon"
                    data-v-db19d898="">
                    <use xlink:href="#ic-ui-nutritional-gluten-free" data-v-db19d898=""></use>
                </svg>
                <span class="base-nutritional-key__label">Gluten free</span>
            </button>
        </li>
        <li title="Hot &amp; spicy" data-ref-id="spicy-icon"
            class="base-nutritional-key__item base-nutritional-key__item--spicy">
            <button type="button" tabindex="-1"
                class="base-button--reset base-nutritional-key__button base-nutritional-key__not-clickable">
                <svg xmlns="http://www.w3.org/2000/svg" title="spicy"
                    class="base-icon ic-ui-nutritional-spicy base-nutritional-key__icon"
                    data-v-db19d898="">
                    <use xlink:href="#ic-ui-nutritional-spicy" data-v-db19d898=""></use>
                </svg>
                <span class="base-nutritional-key__label">Hot &amp; spicy</span>
            </button>
        </li>
    </ul>
    <div
        class="base-padding-block base-padding-block--mobile-8 base-padding-block--s-tablet-16 base-padding-block--m-tablet-16 base-padding-block--l-tablet-24 base-padding-block--s-desktop-null base-padding-block--desktop-null"></div>
</div>
    `;
  }

  async function handleSideDetailsClick(id) {
    const clickedProduct = storeProducts.find(item => item.id === Number(id))
    const skuId = clickedProduct.skuList[0].sku;
    const quantity = clickedProduct?.selectedQuantity || 0;

    await window.$nuxt.$store.dispatch('order/addToBasket', {
        sku: skuId,
        quantity: quantity,
        isUpsell: false,
        itemType: "Product"
    });
  }

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-side-product-button]");
    if (!btn) return;

    e.preventDefault();
    e.stopPropagation();

    const productId = btn.dataset.productId;
    handleSideDetailsClick(productId)
  });

  // ================================
  // MAIN ENTRY
  // ================================
  function mainJs() {
    // -----------------------------
    // Navbar submenu adding
    // -----------------------------
    const subNavTarget = document.querySelector(SELECTORS.subNavTarget);
    if (!subNavTarget) return;

    ensureSubnavActiveFlag(subNavTarget);

    if (!subNavTarget.dataset.variationWhatsNewBound) {
      subNavTarget.dataset.variationWhatsNewBound = "1";

      subNavTarget.addEventListener("click", (e) => {
        const link = e.target && e.target.closest && e.target.closest("a");
        if (!link || !subNavTarget.contains(link)) return;
        setSubnavActive(subNavTarget, link);
      });

      window.addEventListener("resize", () => {
        const active = subNavTarget.querySelector(
          ".base-navigation__item--active"
        );
        if (active) setSubnavActive(subNavTarget, active);
      });
    }

    // Prevent duplicate injection
    if (subNavTarget.querySelector('a[href*="#whats-new"]')) return;

    // Find Pizza item (template)
    const pizzaItem = subNavTarget.querySelector('a[href*="#pizza"]');
    if (!pizzaItem) return;

    // Clone Pizza item
    const whatsNewItem = pizzaItem.cloneNode(true);

    // Update text
    whatsNewItem.textContent = "What's New";

    // Update href & ref-id
    const whatsNewHash = "#whats-new";
    whatsNewItem.href = whatsNewHash;
    whatsNewItem.setAttribute("data-ref-id", whatsNewHash);
    whatsNewItem.dataset.variationWhatsNewLink = "1";

    // Remove active state from clone
    whatsNewItem.classList.remove("base-navigation__item--active");

    // Insert at the beginning
    subNavTarget.insertAdjacentElement("afterbegin", whatsNewItem);

    whatsNewItem.addEventListener("click", (e) => {
      e.preventDefault();
      setSubnavActive(subNavTarget, whatsNewItem);
      smoothScrollToWhatsNew();
    });

    // -----------------------------
    // Activate "What's New" properly
    // -----------------------------

    // Remove active from current item
    const currentActive = subNavTarget.querySelector(
      ".base-navigation__item--active"
    );
    currentActive?.classList.remove("base-navigation__item--active");

    // Trigger Vue logic by clicking
    requestAnimationFrame(() => {
      setSubnavActive(subNavTarget, whatsNewItem);
      smoothScrollToWhatsNew();
    });

    // -----------------------------
    // What's New Section code
    // -----------------------------

    const targetElement = document.querySelector(SELECTORS.accordionTrigger);
    if (!targetElement) return;

    const products = newProductFinder();
    if (!products) return;
    storeProducts = products;
    injectNewSection(products);
    targetElement.insertAdjacentHTML("afterend", spiceSection());
    targetElement.insertAdjacentHTML("afterend", whatsNewHeading());
  }

  waitForNuxtReady(() => mainJs());
})();
