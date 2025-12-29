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
    return Array.from(sliderItems).map((item) => {
      const nameElement = item.querySelector(
        ".base-room-for-more__product-name"
      );
      const priceElement = item.querySelector(".base-room-for-more__price");
      const imageElement = item.querySelector(".base-room-for-more__image");

      return {
        name: nameElement ? nameElement.textContent.trim() : "Product Name",
        price: priceElement ? priceElement.textContent.trim() : "",
        imageUrl: imageElement ? imageElement.src : "",
      };
    });
  }

  function createProductCard(product) {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-card__image" style="background-image: url('${product.imageUrl}');">
        ${product.imageUrl ? "" : '<div class="product-card__image-placeholder"></div>'}
      </div>
      <div class="product-card__content">
        <h3 class="product-card__name">${product.name}</h3>
        ${product.price ? `<div class="product-card__price">${product.price}</div>` : ""}
      </div>
    `;
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
