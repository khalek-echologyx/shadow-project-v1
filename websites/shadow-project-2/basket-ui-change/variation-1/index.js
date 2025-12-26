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

  function mainJs() {
    let state = createState();
    const targetButton = document.querySelector(SELECTORS.checkoutButton);
    setTimeout(() => {
      const sliderItems = document.querySelector(SELECTORS.slider);
      console.log("Delayed slider check:", sliderItems); 
    }, 2000); // 2 second delay
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
