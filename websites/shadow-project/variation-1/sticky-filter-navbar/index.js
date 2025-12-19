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
          <button class="filter-btn" data-content="all-filters">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="14" viewBox="0 0 16 14" fill="none">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M8.5 4C8.775 4 9 3.775 9 3.5V3H15C15.55 3 16 2.55 16 2C16 1.45 15.55 1 15 1H9V0.5C9 0.225 8.775 0 8.5 0H7.5C7.225 0 7 0.225 7 0.5V1H1C0.45 1 0 1.45 0 2C0 2.55 0.45 3 1 3H7V3.5C7 3.775 7.225 4 7.5 4H8.5ZM12.5 9C12.775 9 13 8.775 13 8.5V8H15C15.55 8 16 7.55 16 7C16 6.45 15.55 6 15 6H13V5.5C13 5.225 12.775 5 12.5 5H11.5C11.225 5 11 5.225 11 5.5V6H1C0.45 6 0 6.45 0 7C0 7.55 0.45 8 1 8H11V8.5C11 8.775 11.225 9 11.5 9H12.5ZM4.5 14C4.775 14 5 13.775 5 13.5V13H15C15.55 13 16 12.55 16 12C16 11.45 15.55 11 15 11H5V10.5C5 10.225 4.775 10 4.5 10H3.5C3.225 10 3 10.225 3 10.5V11H1C0.45 11 0 11.45 0 12C0 12.55 0.45 13 1 13H3V13.5C3 13.775 3.225 14 3.5 14H4.5Z" fill="#545454"/>
              </svg>
            All Filters
          </button>

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
        </div>
        <div class="sort-btn">
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
        { name: "Wrap", slug: "wrap" },
        { name: "Dessert", slug: "dessert" },
        { name: "Drink", slug: "drink" },
      ],
      selectedPizzaSizes: [],
      pizzaSizes: [
        {
          id: 0,
          label: 'Personal 7"',
        },
        {
          id: 1,
          label: 'Small 9.5"',
        },
        {
          id: 2,
          label: 'Medium 11.5"',
        },
        {
          id: 3,
          label: 'Large 13.5"',
        },
        {
          id: 4,
          label: "I don't mind",
        },
      ],
      selectedPizzaQty: [],
      pizzaQty: [
        {
          id: 0,
          label: "Any",
        },
        {
          id: 1,
          label: "1",
        },
        {
          id: 2,
          label: "2",
        },
        {
          id: 3,
          label: "3+",
        },
      ],
      selectedSides: [],
      sidesList: [
        {
          id: 0,
          label: "Any",
        },
        {
          id: 1,
          label: "1",
        },
        {
          id: 2,
          label: "2",
        },
        {
          id: 3,
          label: "3+",
        },
      ],
      sortList: [
        {
          label: "Price high to low",
          value: "high-to-low",
        },
        {
          label: "Price low to high",
          value: "low-to-high",
        },
        {
          label: "Popularity",
          value: "popularity",
        },
      ],
      sort: "",
    };
  }
  // DEALS UI
  function generateDealsContent(state) {
    return `
    <div class="dropdown-items">
      ${state.dealsList
        .map(
          (deal) => `
        <div class="dropdown-item" data-content="${deal?.slug}">
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
  // SIZES UI
  function generatePizzaSizeContent(state) {
    return `
      <div class="dropdown-items">
        ${state.pizzaSizes
          .map(
            (size) => `
    <div class="dropdown-item" data-content="${size.id}">
          <div>
          ${
            state.selectedPizzaSizes?.some((item) => item === size.id)
              ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="1" y="1" width="22" height="22" rx="4" stroke="#545454" stroke-width="2"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M20.0488 6.04104C19.6699 5.65299 19.0869 5.65299 18.7074 6.04104L9.05374 15.9117L5.29294 12.0664C4.91342 11.679 4.33039 11.679 3.95087 12.0664C3.57204 12.4544 3.57204 13.0513 3.95087 13.4386L8.37309 17.9602C8.37515 17.963 8.42603 18.013 8.42603 18.013C8.80417 18.3349 9.36588 18.3363 9.72271 17.9715L20.0488 7.41327C20.4283 7.02522 20.4283 6.42909 20.0488 6.04104Z" fill="#006491"/>
                  </svg>`
              : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="1" y="1" width="22" height="22" rx="4" stroke="#545454" stroke-width="2"/>
                  </svg>`
          }
          </div>
          <div>${size.label}</div>
        </div>
    `
          )
          .join("")}
      </div>
    `;
  }
  //QUANTITY UI
  function generatePizzaQty(state) {
    return `
      <div class="dropdown-items">
        ${state.pizzaQty
          .map(
            (qty) => `
    <div class="dropdown-item" data-content="${qty.id}">
          <div>
          ${
            state.selectedPizzaQty?.some((item) => item === qty.id)
              ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="1" y="1" width="22" height="22" rx="4" stroke="#545454" stroke-width="2"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M20.0488 6.04104C19.6699 5.65299 19.0869 5.65299 18.7074 6.04104L9.05374 15.9117L5.29294 12.0664C4.91342 11.679 4.33039 11.679 3.95087 12.0664C3.57204 12.4544 3.57204 13.0513 3.95087 13.4386L8.37309 17.9602C8.37515 17.963 8.42603 18.013 8.42603 18.013C8.80417 18.3349 9.36588 18.3363 9.72271 17.9715L20.0488 7.41327C20.4283 7.02522 20.4283 6.42909 20.0488 6.04104Z" fill="#006491"/>
                  </svg>`
              : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="1" y="1" width="22" height="22" rx="4" stroke="#545454" stroke-width="2"/>
                  </svg>`
          }
          </div>
          <div>${qty.label}</div>
        </div>
    `
          )
          .join("")}
      </div>
    `;
  }
  // SIDES UI
  function generateSidesContent(state) {
    return `
      <div class="dropdown-items">
        ${state.sidesList
          .map(
            (side) => `
    <div class="dropdown-item" data-content="${side.id}">
          <div>
          ${
            state.selectedSides?.some((item) => item === side.id)
              ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="1" y="1" width="22" height="22" rx="4" stroke="#545454" stroke-width="2"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M20.0488 6.04104C19.6699 5.65299 19.0869 5.65299 18.7074 6.04104L9.05374 15.9117L5.29294 12.0664C4.91342 11.679 4.33039 11.679 3.95087 12.0664C3.57204 12.4544 3.57204 13.0513 3.95087 13.4386L8.37309 17.9602C8.37515 17.963 8.42603 18.013 8.42603 18.013C8.80417 18.3349 9.36588 18.3363 9.72271 17.9715L20.0488 7.41327C20.4283 7.02522 20.4283 6.42909 20.0488 6.04104Z" fill="#006491"/>
                  </svg>`
              : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="1" y="1" width="22" height="22" rx="4" stroke="#545454" stroke-width="2"/>
                  </svg>`
          }
          </div>
          <div>${side.label}</div>
        </div>
    `
          )
          .join("")}
      </div>
    `;
  }
  //SORTING UI
  function generateSortContent(state) {
    return `
      <div class="dropdown-items">
        ${state.sortList
          .map(
            (sortItem) => `
          <div class="dropdown-item" data-content="${sortItem.value}">
          <div>${sortItem.label}</div>
          <div>
            ${
              state.sort === sortItem.value
                ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="15" viewBox="0 0 20 15" fill="none">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M19.6584 0.349246C19.2038 -0.116415 18.5042 -0.116415 18.0488 0.349246L6.46439 12.1941L1.95143 7.57964C1.496 7.11482 0.79637 7.11482 0.340948 7.57964C-0.113649 8.0453 -0.113649 8.76151 0.340948 9.22632L5.6476 14.6523C5.65008 14.6557 5.71113 14.7156 5.71113 14.7156C6.16491 15.1019 6.83896 15.1036 7.26716 14.6658L19.6584 1.99593C20.1139 1.53027 20.1139 0.814906 19.6584 0.349246Z" fill="#006491"/>
                    </svg>`
                : ""
            }
          </div>
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

      // Special-case: `all-filters` - no dropdown, just log the click
      if (type === "all-filters") {
        btn.classList.add("no-dropdown");
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          console.log(type);
        });
        return; // skip dropdown creation
      }

      // ✅ Create dropdown as SIBLING (not inside button)
      const dropdown = document.createElement("div");
      dropdown.className = "dropdown-menu";
      if (type === "sort") {
        dropdown.style.left = "auto";
        dropdown.style.setProperty("right", "0", "important");
      }
      dropdown.innerHTML = `
      <div class="dropdown-content">
        ${type === "deal-contains-only" ? generateDealsContent(state) : type === "pizza-size" ? generatePizzaSizeContent(state) : type === "pizza-quantity" ? generatePizzaQty(state) : type === "side-quantity" ? generateSidesContent(state) : type === "sort" ? generateSortContent(state) : type}
      </div>
    `;

      wrapper.appendChild(dropdown);

      if (
        type === "deal-contains-only" ||
        type === "pizza-size" ||
        type === "pizza-quantity" ||
        type === "side-quantity" ||
        type === "sort"
      ) {
        dropdown.addEventListener("click", (e) =>
          handleDropdownItemClick(e, dropdown, state, type)
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
      // Skip buttons that explicitly have no dropdown behavior
      if (btn.classList.contains("no-dropdown")) return;
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
    const allowedCardIds = new Set();

    filteredDeals.forEach((deal) => {
      if (deal.type === "group") {
        const inner = deal.deals || deal.matchedDeals || [];
        inner.forEach((d) => d.cardId && allowedCardIds.add(d.cardId));
        // also allow group's own card if present
        if (deal.cardId) allowedCardIds.add(deal.cardId);
      } else {
        if (deal.cardId) allowedCardIds.add(deal.cardId);
      }
      window.__allowedDealCardIds = allowedCardIds;
    });

    const allCards = document.querySelectorAll(".base-cards-tray__card--deal");

    allCards.forEach((card) => {
      const cardId = card.id;
      if (!cardId) return;
      card.style.display = allowedCardIds.has(cardId) ? "" : "none";

      // Add click listener to group deal card's button
      const groupBtn = card.querySelector(".base-button__container");
      if (groupBtn && !groupBtn._groupClickLogged) {
        groupBtn.addEventListener("click", function () {
          const state = window.__abTestLabState;
          if (!state || !state.filteredDeals) return;

          const groupDeal = state.filteredDeals.find(
            (deal) => deal && deal.cardId === cardId && deal.type === "group"
          );
          if (!groupDeal) return;

          const innerDeals = Array.isArray(groupDeal.deals)
            ? groupDeal.deals
            : [];

          const groupAllowedIds = new Set(
            innerDeals.map((d) => d.cardId).filter(Boolean)
          );

          // ⏳ wait for Nuxt to finish rendering
          setTimeout(() => {
            const globalAllowed = window.__allowedDealCardIds || new Set();

            const dealCards = document.querySelectorAll(
              'section[data-ref-id="base-grid"] .base-deal-card'
            );

            if (!dealCards.length) return;

            dealCards.forEach((card) => {
              const isAllowed =
                groupAllowedIds.has(card.id) && globalAllowed.has(card.id);

              card.style.display = isAllowed ? "" : "none";
            });
          }, 0);
        });

        groupBtn._groupClickLogged = true;
      }
    });

    // Reorder DOM cards to match filteredDeals order (if possible)
    try {
      const first = document.querySelector(".base-cards-tray__card--deal");
      const parent = first ? first.parentNode : null;
      if (parent && Array.isArray(filteredDeals) && filteredDeals.length) {
        filteredDeals.forEach((deal) => {
          if (!deal || !deal.cardId) return;
          const el = document.getElementById(deal.cardId);
          if (el && el.parentNode === parent) parent.appendChild(el);
        });
      }
    } catch (err) {
      // ignore DOM reordering errors
    }
  }

  function filterDealsRecursively(deals, predicate) {
    if (!deals || !deals.length) return deals;

    return deals
      .map((deal) => {
        // Group deal: apply predicate to each inner deal
        if (deal.type === "group" && Array.isArray(deal.deals)) {
          const filteredInner = filterDealsRecursively(deal.deals, predicate);
          if (filteredInner.length) {
            // return a shallow copy of the group with only matching inner deals
            return { ...deal, deals: filteredInner };
          }
          // no inner matches -> exclude this group
          return null;
        }

        // Single deal: run predicate
        return predicate(deal) ? deal : null;
      })
      .filter(Boolean);
  }

  // FILTERS BY DEALS
  function filterDealsBySelection(deals, selectedDeals) {
    if (!selectedDeals.length) return deals;

    return filterDealsRecursively(deals, (deal) =>
      deal.items?.some((item) => {
        if (!item.productType || typeof item.productType !== "string")
          return false;
        return selectedDeals.includes(item.productType.toLowerCase());
      })
    );
  }

  // FILTERS BY SIZES
  function filterDealsByPizzaSize(deals, selectedSizes) {
    if (!selectedSizes.length) return deals;

    return filterDealsRecursively(deals, (deal) => {
      const pizzaItems = deal.items?.filter(
        (item) => item.productType === "Pizza"
      );

      if (!pizzaItems?.length) return false;

      const dealSizes = pizzaItems.flatMap((item) => item.sizes || []);

      return selectedSizes.some((sizeId) => dealSizes.includes(sizeId));
    });
  }

  // FILTER BY PIZZA QUANTITY
  function filterDealsByPizzaQty(deals, selectedQty) {
    if (!selectedQty.length || selectedQty.includes(0)) {
      return deals; // "Any"
    }

    return filterDealsRecursively(deals, (deal) => {
      const pizzaCount =
        deal.items?.filter((item) => item.productType === "Pizza").length || 0;

      return selectedQty.some((qty) => {
        if (qty === 3) return pizzaCount >= 3;
        return pizzaCount === qty;
      });
    });
  }

  // FILTERS BY SIDE QUANTITY
  function filterDealsBySideQty(deals, selectedSides) {
    if (!selectedSides.length || selectedSides.includes(0)) {
      return deals; // "Any"
    }
    return filterDealsRecursively(deals, (deal) => {
      const sideCount =
        deal.items?.filter((item) => item.productType === "Side").length || 0;

      return selectedSides.some((qty) => {
        if (qty === 3) return sideCount >= 3;
        return sideCount === qty;
      });
    });
  }

  // SORT HELPERS (top-level)
  function getDealPrice(deal) {
    if (!deal) return Infinity;
    const direct = deal.indicativePrice?.payable?.amount;
    if (typeof direct === "number") return direct;

    // Try matchedDeals or deals inside group
    const inner = Array.isArray(deal.deals) ? deal.deals : [];
    const prices = inner
      .map((d) => d.indicativePrice?.payable?.amount)
      .filter((p) => typeof p === "number");
    if (prices.length) return Math.min(...prices);

    return Infinity;
  }

  function getDealPopularity(deal) {
    if (!deal) return 0;
    if (typeof deal.feeds === "number") return deal.feeds;

    const inner = Array.isArray(deal.deals) ? deal.deals : [];
    return inner.reduce((sum, d) => sum + (Number(d.feeds) || 0), 0);
  }

  function sortDeals(deals, sortKey) {
    if (!sortKey) return deals;
    // create shallow copy to avoid mutating original
    const arr = Array.isArray(deals) ? deals.slice() : [];

    if (sortKey === "high-to-low") {
      arr.sort((a, b) => getDealPrice(b) - getDealPrice(a));
    } else if (sortKey === "low-to-high") {
      arr.sort((a, b) => getDealPrice(a) - getDealPrice(b));
    } else if (sortKey === "popularity") {
      arr.sort((a, b) => getDealPopularity(b) - getDealPopularity(a));
    }

    return arr;
  }

  function applyDealFilters(state) {
    const allDeals = getDealCardsSafe();

    let filteredDeals = allDeals;

    filteredDeals = filterDealsBySelection(filteredDeals, state.selectedDeals);
    filteredDeals = filterDealsByPizzaSize(
      filteredDeals,
      state.selectedPizzaSizes
    );
    filteredDeals = filterDealsByPizzaQty(
      filteredDeals,
      state.selectedPizzaQty
    );
    filteredDeals = filterDealsBySideQty(filteredDeals, state.selectedSides);

    console.log(filteredDeals, "line 346");

    // Apply sorting if selected
    const sorted = sortDeals(filteredDeals, state.sort);

    // Always store the latest filteredDeals in state
    state.filteredDeals = sorted;
    updateDealCardsUI(sorted);
  }

  function handleDropdownItemClick(e, dropdown, state, type) {
    const item = e.target.closest(".dropdown-item");
    if (!item) return;
    e.stopPropagation();

    const data = item.dataset.content;
    const dealIndex = state.selectedDeals.indexOf(data);

    if (type === "deal-contains-only") {
      dealIndex === -1
        ? state.selectedDeals.push(data)
        : state.selectedDeals.splice(dealIndex, 1);

      const content = dropdown.querySelector(".dropdown-content");
      if (content) {
        content.replaceChildren(
          document
            .createRange()
            .createContextualFragment(generateDealsContent(state))
        );
      }
      applyDealFilters(state);
    } else if (type === "pizza-size") {
      const sizeId = Number(data);
      const sizeIndex = state.selectedPizzaSizes.indexOf(sizeId);

      if (sizeId === 4) {
        state.selectedPizzaSizes = [];
        const content = dropdown.querySelector(".dropdown-content");
        if (content) {
          content.replaceChildren(
            document
              .createRange()
              .createContextualFragment(generatePizzaSizeContent(state))
          );
        }
        applyDealFilters(state);
        return;
      }

      sizeIndex === -1
        ? state.selectedPizzaSizes.push(sizeId)
        : state.selectedPizzaSizes.splice(sizeIndex, 1);
      // 🔁 RE-RENDER dropdown UI
      const content = dropdown.querySelector(".dropdown-content");
      if (content) {
        content.replaceChildren(
          document
            .createRange()
            .createContextualFragment(generatePizzaSizeContent(state))
        );
      }

      applyDealFilters(state);
    } else if (type === "pizza-quantity") {
      const qtyId = Number(data);
      const index = state.selectedPizzaQty.indexOf(qtyId);

      // "Any"
      if (qtyId === 0) {
        state.selectedPizzaQty = [];
      } else {
        index === -1
          ? state.selectedPizzaQty.push(qtyId)
          : state.selectedPizzaQty.splice(index, 1);
      }

      // 🔁 Re-render dropdown UI
      const content = dropdown.querySelector(".dropdown-content");
      if (content) {
        content.replaceChildren(
          document
            .createRange()
            .createContextualFragment(generatePizzaQty(state))
        );
      }

      applyDealFilters(state);
    } else if (type === "side-quantity") {
      const sideId = Number(data);
      const index = state.selectedSides.indexOf(sideId);

      // "Any"
      if (sideId === 0) {
        state.selectedSides = [];
      } else {
        index === -1
          ? state.selectedSides.push(sideId)
          : state.selectedSides.splice(index, 1);
      }

      // 🔁 Re-render dropdown UI
      const content = dropdown.querySelector(".dropdown-content");
      if (content) {
        content.replaceChildren(
          document
            .createRange()
            .createContextualFragment(generateSidesContent(state))
        );
      }

      applyDealFilters(state);
    } else if (type === "sort") {
      // store selected sort option
      state.sort = data;

      const content = dropdown.querySelector(".dropdown-content");
      if (content) {
        content.replaceChildren(
          document
            .createRange()
            .createContextualFragment(generateSortContent(state))
        );
      }

      applyDealFilters(state);
    }
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
        "Initial Deals"
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
    // Expose state globally for group button logic
    window.__abTestLabState = state;

    setupDropdowns(state);
    setupGlobalListeners();
    safeNuxtLog();
  }

  waitForNuxtReady(() => {
    mainJs([document.body]);
    setupFilterButtons();
  });
})();
