(() => {
  /* ------------------ BOOTSTRAP HELPERS ------------------ */
  function waitForNuxtReady(cb) {
    const check = () => {
      if (
        window.$nuxt &&
        window.$nuxt._isMounted &&
        document.querySelector(".base-header__main-navigation-wrapper")
      ) {
        cb();
      } else {
        requestAnimationFrame(check);
      }
    };
    check();
  }

  /* ------------------ WORKER FUNCTIONS ------------------ */
  function logExperiment() {
    console.log(
      "%cname: v-01",
      "background: black;border: 2px solid green;color: white;display: block;text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3);text-align: center;font-weight: bold;padding : 10px;margin : 10px"
    );
  }

  function getTargetSection() {
    const targetSection = document.querySelector(
      ".base-header__main-navigation-wrapper"
    );

    if (!targetSection) return null;

    // Prevent duplicate injection
    if (document.querySelector("[data-ab-test='filter-nav-v1']")) {
      return null;
    }

    return targetSection;
  }

  function injectFilterNavbar(targetSection) {
    const arrowSvg = `
    <span class="arrow">
      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="11" viewBox="0 0 20 11" fill="none">
        <path fill-rule="evenodd" clip-rule="evenodd"
          d="M19.6587 10.6653C19.2027 11.1116 18.4636 11.1116 18.0076 10.6653
             L9.95132 2.76425L1.99245 10.5708C1.53644 11.0171 0.797278 11.0171
             0.341265 10.5708C-0.113755 10.1236 -0.113755 9.39767 0.341265 8.95142
             L9.12573 0.335178C9.34728 0.119845 9.64036 0 9.95132 0
             C10.2633 0 10.5564 0.119845 10.7779 0.335178
             L19.6587 9.04593C20.1138 9.49218 20.1138 10.2191 19.6587 10.6653Z"
          fill="#006491"
        />
      </svg>
    </span>
  `;

    const html = `
    <div class="filter-nav-wrapper" data-ab-test="filter-nav-v1">
      <div class="base-container--main-nav filter-container">
        <div class="filter-bar">

          <button class="filter-btn" data-content="deal-contains-only">
            Deal contains only
            ${arrowSvg}
          </button>

          <button class="filter-btn" data-content="pizza-size">
            Pizza size
            ${arrowSvg}
          </button>

          <button class="filter-btn" data-content="pizza-quantity">
            How many pizzas?
            ${arrowSvg}
          </button>

          <button class="filter-btn" data-content="side-quantity">
            How many sides?
            ${arrowSvg}
          </button>

          <button class="filter-btn" data-content="sort">
            Sort
            ${arrowSvg}
          </button>

        </div>
      </div>
    </div>
  `;

    targetSection.insertAdjacentHTML("afterend", html);
  }

  // ALL STATE FUNCTION HERE
  function createState() {
    return {
      selectedDeals: [],
      dealsList: [
        { name: "Pizza", slug: "pizza" },
        { name: "Side", slug: "side" },
        { name: "Drink", slug: "drink" },
        { name: "Dessert", slug: "dessert" },
      ],
    };
  }

  function generateDealsContent(state) {
    return `
    <div class="deals-dropdown">
      ${state.dealsList
        .map(
          (deal) => `
        <div class="deals-dropdown-content" data-content="${deal?.slug}">
          <div>
          ${
            state.selectedDeals?.some((item) => item === deal.slug)
              ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
<rect x="1" y="1" width="22" height="22" rx="4" stroke="#545454" stroke-width="2"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M20.0488 6.04104C19.6699 5.65299 19.0869 5.65299 18.7074 6.04104L9.05374 15.9117L5.29294 12.0664C4.91342 11.679 4.33039 11.679 3.95087 12.0664C3.57204 12.4544 3.57204 13.0513 3.95087 13.4386L8.37309 17.9602C8.37515 17.963 8.42603 18.013 8.42603 18.013C8.80417 18.3349 9.36588 18.3363 9.72271 17.9715L20.0488 7.41327C20.4283 7.02522 20.4283 6.42909 20.0488 6.04104Z" fill="#006491"/>
</svg>`
              : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
<rect x="1" y="1" width="22" height="22" rx="4" stroke="#545454" stroke-width="2"/>
</svg>`
          }
          </div>
          <div>${deal.name}</div>
        </div>
        `
        )
        .join("")}
    </div>
  `;
  }

  function setupDropdowns(state) {
    const buttons = document.querySelectorAll(
      "[data-ab-test='filter-nav-v1'] .filter-btn"
    );

    buttons.forEach((btn) => {
      const type = btn.dataset.content;

      // ✅ Create a wrapper around the button
      const wrapper = document.createElement("div");
      wrapper.className = "filter-btn-wrapper";

      btn.parentNode.insertBefore(wrapper, btn);
      wrapper.appendChild(btn);

      // ✅ Create dropdown as SIBLING (not inside button)
      const dropdown = document.createElement("div");
      dropdown.className = "dropdown-menu";
      dropdown.innerHTML = `
      <div class="dropdown-content">
        ${type === "deal-contains-only" ? generateDealsContent(state) : type}
      </div>
    `;

      wrapper.appendChild(dropdown);

      if (type === "deal-contains-only") {
        dropdown.addEventListener("click", (e) =>
          handleDealClick(e, dropdown, state)
        );
      }

      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        closeAllDropdowns(dropdown);
        dropdown.classList.toggle("active");
      });
    });
  }

  function openDropdownFor(btn) {
    const wrapper = btn.closest(".filter-btn-wrapper");
    if (!wrapper) return;

    const dropdown = wrapper.querySelector(".dropdown-menu");
    if (dropdown) {
      dropdown.classList.add("active");
    }
  }

  function closeAllFilters() {
    document.querySelectorAll(".filter-btn.is-open").forEach((btn) => {
      btn.classList.remove("is-open");
      const arrow = btn.querySelector(".arrow");
      if (arrow) arrow.classList.remove("up"); // reset arrow rotation
    });

    document.querySelectorAll(".dropdown-menu.active").forEach((dd) => {
      dd.classList.remove("active");
    });
  }

  function setupFilterButtons() {
    const buttons = document.querySelectorAll(".filter-btn");

    buttons.forEach((btn) => {
      const arrow = btn.querySelector(".arrow"); // target the arrow span

      btn.addEventListener("click", (e) => {
        e.stopPropagation();

        const isOpen = btn.classList.contains("is-open");

        closeAllFilters();

        if (!isOpen) {
          btn.classList.add("is-open");
          if (arrow) arrow.classList.add("up"); // rotate arrow
          openDropdownFor(btn);
        }
      });
    });

    document.addEventListener("click", closeAllFilters);
  }

  function getDealCardsSafe() {
    if (
      window.$nuxt &&
      window.$nuxt.$store &&
      window.$nuxt.$store.getters &&
      window.$nuxt.$store.getters["deals/getDealCards"]
    ) {
      return window.$nuxt.$store.getters["deals/getDealCards"];
    }

    return [];
  }

  function updateDealCardsUI(filteredDeals) {
  const allowedCardIds = new Set(
    filteredDeals.map((deal) => deal.cardId)
  );

  const allCards = document.querySelectorAll(
    ".base-cards-tray__card--deal"
  );

  allCards.forEach((card) => {
    const cardId = card.id;

    if (!cardId) return;

    card.style.display = allowedCardIds.has(cardId)
      ? ""
      : "none";
  });
}


  function filterDealsBySelection(deals, selectedDeals) {
  if (!selectedDeals.length) return deals;

  return deals.filter((deal) =>
    deal.items?.some((item) =>
      selectedDeals.includes(item.productType.toLowerCase())
    )
  );
}


  function applyDealFilters(state) {
    const allDeals = getDealCardsSafe();
    const filteredDeals = filterDealsBySelection(allDeals, state.selectedDeals);

    console.log("Filtered deals: line 263", filteredDeals);

    updateDealCardsUI(filteredDeals);
  }

  function handleDealClick(e, dropdown, state) {
    const item = e.target.closest(".deals-dropdown-content");
    if (!item) return;

    e.stopPropagation();

    const slug = item.dataset.content;
    const index = state.selectedDeals.indexOf(slug);

    index === -1
      ? state.selectedDeals.push(slug)
      : state.selectedDeals.splice(index, 1);

    const content = dropdown.querySelector(".dropdown-content");
    if (content) {
      content.replaceChildren(
        document
          .createRange()
          .createContextualFragment(generateDealsContent(state))
      );
    }
    applyDealFilters(state);
  }

  function closeAllDropdowns(current = null) {
    document.querySelectorAll(".dropdown-menu").forEach((dd) => {
      if (dd !== current) dd.classList.remove("active");
    });
  }

  function setupGlobalListeners() {
    document.addEventListener("click", () => closeAllDropdowns());
  }

  function safeNuxtLog() {
    if (window.$nuxt && window.$nuxt.$store) {
      console.log(
        window.$nuxt.$store.getters["deals/getDealCards"],
        "Line 259"
      );
    }
  }

  /* ------------------ MAIN CONTROLLER ------------------ */
  function mainJs([body]) {
    logExperiment();

    const container = getTargetSection();
    if (!container) return;

    injectFilterNavbar(container);

    const state = createState();

    setupDropdowns(state);
    setupGlobalListeners();
    safeNuxtLog();
  }

  // waitForElem('[data-ref-id*="/deals"]', mainJs );
  waitForNuxtReady(() => {
    mainJs([document.body]);
    setupFilterButtons();
  });

  // waitForElem(".base-header__main-navigation-wrapper", () => {
  //   setupFilterButtons();
  // });
})();
