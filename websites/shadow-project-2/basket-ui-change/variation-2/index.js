import testInfo from "./info.json" assert { type: "json" };

(() => {
  /* ------------------ NUXT READY ------------------ */
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

  /* ------------------ STATE ------------------ */
  function createState() {
    return {
      step: 0,
    };
  }

  /* ------------------ SELECTORS ------------------ */
  const SELECTORS = {
    checkoutButton: ".base-call-to-action-section__actions .base-button",
    slider: ".slick-track",
    sliderWrapper: ".carousel-wrapper",
  };

  /* ------------------ UI HELPERS ------------------ */
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
    if (existingButton) existingButton.remove();
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

  /* ------------------ WAIT FOR SLIDER ------------------ */
  function waitForSliderToLoad(callback) {
    const observer = new MutationObserver((_, obs) => {
      const sliderItems = document.querySelector(SELECTORS.slider);
      if (sliderItems && sliderItems.children.length > 0) {
        callback(Array.from(sliderItems.children));
        obs.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Immediate check
    const sliderItems = document.querySelector(SELECTORS.slider);
    if (sliderItems && sliderItems.children.length > 0) {
      observer.disconnect();
      callback(Array.from(sliderItems.children));
    }
  }

  function observeSliderUpdates() {
    const sliderWrapper = document.querySelector(SELECTORS.sliderWrapper);
    if (!sliderWrapper) return;

    const observer = new MutationObserver(() => {
      const sliderItems = document.querySelector(SELECTORS.slider);
      if (!sliderItems || !sliderItems.children.length) return;

      createOrUpdateGridSection(Array.from(sliderItems.children));
    });

    observer.observe(sliderWrapper, {
      childList: true,
      subtree: true,
    });
  }

  /* ------------------ GRID CREATION ------------------ */
  function createGridFromSliderItems(sliderChildren) {
    const sliderWrapper = document.querySelector(SELECTORS.sliderWrapper);
    if (!sliderWrapper || !sliderChildren.length) return;

    // prevent duplicate grid
    if (document.querySelector(".ab-grid-section")) return;

    const gridSection = document.createElement("div");
    gridSection.className = "ab-grid-section";

    const gridInner = document.createElement("div");
    gridInner.className = "ab-grid";

    // MOVE items (keep Vue handlers)
    sliderChildren.forEach((item) => {
      item.style.display = "block";
      item.style.transform = "none";
      item.style.position = "static";
      gridInner.appendChild(item);
    });

    gridSection.appendChild(gridInner);

    // insert grid BEFORE slider
    sliderWrapper.parentNode.insertBefore(gridSection, sliderWrapper);

    // hide slider to prevent it flashing back
    sliderWrapper.style.display = "none";
  }

  function createOrUpdateGridSection(sliderItems) {
    const sliderWrapper = document.querySelector(SELECTORS.sliderWrapper);
    if (!sliderWrapper) return;

    let gridSection = document.querySelector(".grid-section");

    // If grid already exists → reset it
    if (gridSection) {
      gridSection.innerHTML = "";
    } else {
      gridSection = document.createElement("div");
      gridSection.className = "grid-section";
      sliderWrapper.parentNode.insertBefore(
        gridSection,
        sliderWrapper.nextSibling
      );
    }

    // MOVE nodes instead of cloning
    sliderItems.forEach((item) => {
      gridSection.appendChild(item);
    });
  }

  /* ------------------ MAIN ------------------ */
  function mainJs() {
    let state = createState();
    const targetButton = document.querySelector(SELECTORS.checkoutButton);

    // Initial load
    waitForSliderToLoad((childElements) => {
      createOrUpdateGridSection(childElements);
      observeSliderUpdates(); // 🔥 THIS fixes the issue
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
