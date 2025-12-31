(() => {
  function waitForNuxtReady(cb) {
    const check = () => {
      if (
        window.$nuxt &&
        window.$nuxt._isMounted &&
        document.querySelector(".base-call-to-action-section__actions")
      ) {
        cb();
      } else {
        requestAnimationFrame(check);
      }
    };
    check();
  }

  // STATE FUNCTION
  function createState() {
    return {
      step: 0,
    };
  }

  // DOM ELEMENTS
  const SELECTORS = {
    checkoutButton: ".base-call-to-action-section__actions .base-button",
    slider: ".slick-track",
    sliderWrapper: ".carousel-wrapper",
  };

  // UI UPDATES
  function createNewButton(originalButton, onClick) {
    const newButton = document.createElement("button");
    newButton.className =
      originalButton.className
        .replace("base-basket-page__checkout-button", "")
        .trim() + " variation-checkout-button";

    newButton.innerHTML = `
      <div class="base-button__container">
        <span class="base-button__text">checkout 1</span>
      </div>
    `;

    newButton.addEventListener("click", onClick);
    return newButton;
  }

  function removeExistingVariationButton(container) {
    const existingButton = container.querySelector(
      ".variation-checkout-button"
    );
    if (existingButton) {
      existingButton.remove();
    }
  }

  function updateUI(state, targetButton) {
    if (!targetButton) return;
    const container = targetButton.parentNode;
    removeExistingVariationButton(container);
    if (state.step === 0) {
      targetButton.style.display = "none";
      const newButton = createNewButton(targetButton, () => {
        state.step = 1;
        updateUI(state, targetButton);
      });
      container.insertBefore(newButton, targetButton.nextSibling);
    } else {
      targetButton.style.display = "block";
    }
  }

  function waitForSliderToLoad(callback) {
    const observer = new MutationObserver((mutation, obs) => {
      const sliderItems = document.querySelector(SELECTORS.slider);
      if (sliderItems && sliderItems.children.length > 0) {
        callback(Array.from(sliderItems.children));
        obs.disconnect();
        return;
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Initial check in case slider is already loaded
    const sliderItems = document.querySelector(SELECTORS.slider);
    if (sliderItems && sliderItems.children.length > 0) {
      observer.disconnect();
      callback(Array.from(sliderItems.children));
    }
  }

  function extractProductData(sliderItems) {
    return Array.from(sliderItems).map((item, index) => {
      const nameElement = item.querySelector(
        ".base-room-for-more__product-name"
      );
      const priceElement = item.querySelector(".base-room-for-more__price");
      const imageElement = item.querySelector(".base-room-for-more__image");
      const caloriesElement = item.querySelector(
        ".base-room-for-more__calories-slot span"
      );
      const isVegetarian = !!item.querySelector(
        ".base-nutritional-icon-list__item--vegetarian"
      );



      return {
        id: 5162,
        name: nameElement ? nameElement.textContent.trim() : "Product Name",
        price: priceElement ? priceElement.textContent.trim() : "£0.00",
        imageUrl: imageElement ? imageElement.src : "",
        description:
          item.getAttribute("product-description") || "Delicious menu item",
        calories: caloriesElement
          ? caloriesElement.textContent.trim()
          : "0 kcal",
        serves: "3-4",
        isVegetarian: isVegetarian,
        variants: [
          { value: "60", label: 'Large 13.5"', selected: true },
          { value: "35", label: 'Medium 11.5"', selected: false },
          { value: "10", label: 'Small 9.5"', selected: false },
        ],
        customizeUrl: "#",
      };
    });
  }

  function openAllergenModal(id) {
    try {
      const appEl = document.querySelector("#app");
      const rootVue = appEl && appEl.__vue__;
      const headerComponent =
        rootVue &&
        rootVue.$children &&
        rootVue.$children.find(
          ({ showProductInfo }) => typeof showProductInfo === "function"
        );
      if (!headerComponent) return;

      const store = window.$nuxt && window.$nuxt.$store;
      if (!store || !store.getters || !store.getters["menu/getProductById"]) {
        return;
      }

      const product = store.getters["menu/getProductById"](id);
      if (!product) {
        console.log("Product not found for id:", id);
        console.log(store, "168");
        return;
      }

      headerComponent.upsellDipItem = product;
      headerComponent.showProductInfo(true);
    } catch (e) {
      console.log("openAllergenModal error:", e);
    }
  }

  function createProductCard(product) {
    const card = document.createElement("div");
    card.className = "base-menu-card";
    card.setAttribute("data-ref-id", "base-menu-item-container");
    card.setAttribute("data-ref", "base-menu-card");
    card.setAttribute("data-cy", "pizza-menu-card");
    card.setAttribute("product-description", product.description);
    card.id = product.id;
    card.innerHTML = `
    <div data-ref-id="base-menu-card__image-container" class="base-menu-card__image-container">
      <div class="base-menu-card__icons-container">
        <div class="base-menu-card__info-button-wrapper">
          <button data-ref-id="info-button" aria-label="${product.name} allergen information" 
                  class="base-info-trigger base-menu-card__info-button base-info-trigger--larger-above-mobile">
            <svg data-v-db19d898="" xmlns="http://www.w3.org/2000/svg" 
                 class="base-icon base-info-trigger__icon ic-ui-notification-info base-info-trigger__icon--info">
              <use data-v-db19d898="" xlink:href="#ic-ui-notification-info"></use>
            </svg>
          </button>
        </div>
        ${
          product.isVegetarian
            ? `
          <ul class="base-nutritional-icon-list base-menu-card__nutritional-icon-list">
            <li title="Vegetarian" data-ref-id="vegetarian-icon" 
                class="base-nutritional-icon-list__item base-nutritional-icon-list__item--large base-nutritional-icon-list__item--with-background">
              <svg data-v-db19d898="" xmlns="http://www.w3.org/2000/svg" 
                   class="base-icon ic-ui-nutritional-vegetable base-nutritional-icon-list__icon base-nutritional-icon-list__icon--large" 
                   title="vegetarian">
                <use data-v-db19d898="" xlink:href="#ic-ui-nutritional-vegetarian"></use>
              </svg>
            </li>
          </ul>
        `
            : ""
        }
      </div>
      <picture data-ref-id="base-menu-card-image">
        <source srcset="${product.imageUrl}" media="(min-width: 1024px)">
        <img loading="lazy" src="${product.imageUrl}" 
             alt="${product.name}" 
             class="base-lazy-image" 
             onerror="this.onerror=null; this.src='/store/_nuxt/img/pizza.a5cb2ff.svg'">
      </picture>
      <div class="base-menu-card__image-footer">
        <div class="base-menu-card__image-footer-upper">
          <a href="${product.customizeUrl}" 
             data-ref-id="base-menu-card__customise" 
             class="base-menu-card__customise">
            Customise
          </a>
        </div>
      </div>
    </div>
    <div class="base-menu-card__content">
      <div class="base-menu-card__content-container">
        <div class="base-menu-card__title-container">
          <h3 data-ref="base-menu-product-name" 
              data-ref-id="base-menu-product-name" 
              class="base-menu-card__title">
            ${product.name}
          </h3>
          <div class="base-menu-card__description">
            <p>
              <span data-ref-id="product-calories__calories-info" 
                    class="base-color--neutral-grey-dark">
                ${product.calories} | Serves ${product.serves}
              </span>
            </p>
          </div>
        </div>
      </div>
      <div class="base-menu-card__actions-container">
          <div data-ref-id="base-menu-price-container" 
               class="base-menu-card__price-container">
            <div class="base-menu-card__product-price">
              <span data-ref="base-menu-price-text" 
                    data-ref-id="base-menu-price-text" 
                    class="base-menu-card__price">
                ${product.price}
              </span>
            </div>
          </div>
          <button data-v-4d4dcda2="" 
                  aria-label="Add ${product.name} to basket" 
                  data-ref-id="base-menu-item-button" 
                  class="base-add-to-basket base-button--primary base-add-to-basket--single-button-default base-menu-card__add-to-basket" 
                  type="button">
            <svg data-v-db19d898="" data-v-4d4dcda2="" 
                 xmlns="http://www.w3.org/2000/svg" 
                 class="base-icon base-add-to-basket__icon ic-ui-generic-plus">
              <use data-v-db19d898="" xlink:href="#ic-ui-generic-plus"></use>
            </svg>
          </button>
        </div>
    </div>
  `;
    card.addEventListener("click", (e) => {
      const infoButton = e.target.closest('[data-ref-id="info-button"]');
      if (infoButton) {
        e.preventDefault();
        e.stopPropagation();
        openAllergenModal(product.id);
      }
    });
    return card;
  }

  function createProductGrid(products) {
    const sliderWrapper = document.querySelector(SELECTORS.sliderWrapper);
    if (!sliderWrapper) return;

    // Create grid container
    const gridSection = document.createElement("div");
    gridSection.className = "product-grid";

    // Add title
    const title = document.createElement("h2");
    title.textContent = "Popular Items";
    title.className = "product-grid__title";
    gridSection.appendChild(title);

    // Create grid container
    const grid = document.createElement("div");
    grid.className = "product-grid__container";

    // Add product cards to grid
    products.forEach((product) => {
      const card = createProductCard(product);
      grid.appendChild(card);
    });

    gridSection.appendChild(grid);

    // Insert after the slider wrapper
    sliderWrapper.parentNode.insertBefore(
      gridSection,
      sliderWrapper.nextSibling
    );
  }

  function mainJs() {
    let state = createState();
    const targetButton = document.querySelector(SELECTORS.checkoutButton);

    waitForSliderToLoad((sliderItems) => {
      const products = extractProductData(sliderItems);
      if (products.length > 0) {
        createProductGrid(products);
      }
    });

    if (targetButton) {
      updateUI(state, targetButton);
    } else {
      console.log("Checkout button not found");
    }
  }

  waitForNuxtReady(() => {
    mainJs();
  });
})();
