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
          <button class="filter-btn sort-btn-inner" data-content="sort">
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
      // price range: [min, max]
      selectedPriceRange: [2, 45],
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

  // FILTERS BY PRICE RANGE
  function filterDealsByPrice(deals, selectedRange) {
    if (!selectedRange || selectedRange.length !== 2) return deals;
    const [min, max] = selectedRange;
    return filterDealsRecursively(deals, (deal) => {
      const price = getDealPrice(deal);
      if (typeof price !== "number" || !isFinite(price)) return false;
      return price >= min && price <= max;
    });
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

      // Special-case: `all-filters` - open sidebar
      if (type === "all-filters") {
        btn.classList.add("no-dropdown");
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          openFilterSidebar(state);
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

  /* ---------- Filter Sidebar (All Filters) ---------- */
  function createFilterSidebar(state) {
    if (document.querySelector(".ab-filter-overlay")) return;

    // Styles moved to style.scss; no inline injection here

    const overlay = document.createElement("div");
    overlay.className = "ab-filter-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-hidden", "true");

    const sidebar = document.createElement("aside");
    sidebar.className = "ab-filter-sidebar";

    sidebar.innerHTML = `
      <div class="ab-filter-header">
        <h2>Filter deals</h2>
        <button class="ab-filter-close" aria-label="Close">×</button>
      </div>
      <div class="ab-filter-body">
        <!-- Filters can be inserted here if desired -->
      </div>
    `;

    overlay.appendChild(sidebar);
    document.body.appendChild(overlay);

    // Close when clicking outside sidebar (on overlay)
    overlay.addEventListener("click", (ev) => {
      if (ev.target === overlay) closeFilterSidebar();
    });

    // Close button
    const closeBtn = sidebar.querySelector(".ab-filter-close");
    if (closeBtn) closeBtn.addEventListener("click", closeFilterSidebar);

    // Esc key handler (attach once)
    function escHandler(e) {
      if (e.key === "Escape") closeFilterSidebar();
    }
    overlay._escHandler = escHandler;
    // body badge click handler (delegated) - handle many filter badge types
    overlay._badgeClickHandler = function (ev) {
      const btn = ev.target.closest(".ab-filter-badge, .ab-deal-badge");
      if (!btn) return;
      ev.stopPropagation();
      const filter = btn.dataset.filter || btn.dataset.type || "deals";
      const value = btn.dataset.value || btn.dataset.content;
      if (!filter || typeof value === "undefined") return;
      if (!window.__abTestLabState) return;
      const st = window.__abTestLabState;

      // Helper to toggle numeric or string values
      function toggleArray(arr, val, asNumber) {
        const v = asNumber ? Number(val) : String(val);
        const idx = arr.indexOf(v);
        if (idx === -1) arr.push(v);
        else arr.splice(idx, 1);
      }

      if (filter === "deals") {
        const slug = String(value);
        const idx = st.selectedDeals.indexOf(slug);
        if (idx === -1) st.selectedDeals.push(slug);
        else st.selectedDeals.splice(idx, 1);
      } else if (filter === "pizzaSize") {
        const id = Number(value);
        const idx = st.selectedPizzaSizes.indexOf(id);
        if (idx === -1) st.selectedPizzaSizes.push(id);
        else st.selectedPizzaSizes.splice(idx, 1);
      } else if (filter === "pizzaQty") {
        const id = Number(value);
        if (id === 0) {
          st.selectedPizzaQty = [];
        } else {
          const idx = st.selectedPizzaQty.indexOf(id);
          if (idx === -1) st.selectedPizzaQty.push(id);
          else st.selectedPizzaQty.splice(idx, 1);
        }
      } else if (filter === "sides") {
        const id = Number(value);
        if (id === 0) {
          st.selectedSides = [];
        } else {
          const idx = st.selectedSides.indexOf(id);
          if (idx === -1) st.selectedSides.push(id);
          else st.selectedSides.splice(idx, 1);
        }
      } else if (filter === "sort") {
        const val = String(value);
        if (st.sort === val) st.sort = "";
        else st.sort = val;
      }

      // re-render sidebar UI and apply filters
      renderDealsInSidebar(st);
      applyDealFilters(st);
    };
    // attach delegated listener to overlay
    overlay.addEventListener("click", overlay._badgeClickHandler);
  }

  function openFilterSidebar(state) {
    createFilterSidebar(state);
    const overlay = document.querySelector(".ab-filter-overlay");
    if (!overlay) return;
    overlay.classList.add("active");
    overlay.setAttribute("aria-hidden", "false");

    // Attach keydown if not attached
    if (!overlay._escAttached) {
      document.addEventListener("keydown", overlay._escHandler);
      overlay._escAttached = true;
    }
    // render current deals into sidebar
    renderDealsInSidebar(state);
  }

  function renderDealsInSidebar(state) {
    const body = document.querySelector(".ab-filter-body");
    if (!body) return;

    const container = document.createElement("div");
    container.className = "ab-deal-badges";

    (state.dealsList || []).forEach((deal) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "ab-deal-badge";
      btn.dataset.content = deal.slug || (deal.name || "").toLowerCase();
      btn.textContent = deal.name;
      if ((state.selectedDeals || []).includes(btn.dataset.content)) {
        btn.classList.add("selected");
      }
      container.appendChild(btn);
    });

    // replace body content but keep existing informative text if present
    const existingText = body.querySelector("p");
    body.innerHTML = "";

    // Heading
    const heading = document.createElement("div");
    heading.className = "ab-deals-heading";
    heading.textContent = "Deal contains only";
    body.appendChild(heading);

    if (existingText) body.appendChild(existingText);
    body.appendChild(container);

    // separator between deals and sizes
    const sep1 = document.createElement("div");
    sep1.className = "ab-filter-separator";
    body.appendChild(sep1);

    // -- Pizza Size badges
    const sizeHeading = document.createElement("div");
    sizeHeading.className = "ab-deals-heading";
    sizeHeading.textContent = "Pizza size";
    body.appendChild(sizeHeading);

    const sizeContainer = document.createElement("div");
    sizeContainer.className = "ab-deal-badges";
    (state.pizzaSizes || []).forEach((size) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "ab-deal-badge ab-filter-badge";
      btn.dataset.filter = "pizzaSize";
      btn.dataset.value = String(size.id);
      btn.textContent = size.label;
      if ((state.selectedPizzaSizes || []).includes(size.id))
        btn.classList.add("selected");
      sizeContainer.appendChild(btn);
    });
    body.appendChild(sizeContainer);

    // separator between sizes and quantity
    const sep2 = document.createElement("div");
    sep2.className = "ab-filter-separator";
    body.appendChild(sep2);

    // -- Pizza Quantity badges
    const qtyHeading = document.createElement("div");
    qtyHeading.className = "ab-deals-heading";
    qtyHeading.textContent = "How many pizzas?";
    body.appendChild(qtyHeading);

    const qtyContainer = document.createElement("div");
    qtyContainer.className = "ab-deal-badges ab-deal-badges-qty";
    (state.pizzaQty || []).forEach((q) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "ab-deal-badge ab-filter-badge ab-filter-badge-qty";
      btn.dataset.filter = "pizzaQty";
      btn.dataset.value = String(q.id);
      btn.textContent = q.label;
      if ((state.selectedPizzaQty || []).includes(q.id))
        btn.classList.add("selected");
      qtyContainer.appendChild(btn);
    });
    body.appendChild(qtyContainer);

    // separator between quantity and sides
    const sep3 = document.createElement("div");
    sep3.className = "ab-filter-separator";
    body.appendChild(sep3);

    // -- Sides badges
    const sidesHeading = document.createElement("div");
    sidesHeading.className = "ab-deals-heading";
    sidesHeading.textContent = "How many sides?";
    body.appendChild(sidesHeading);

    const sidesContainer = document.createElement("div");
    sidesContainer.className = "ab-deal-badges ab-deal-badges-side";
    (state.sidesList || []).forEach((s) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "ab-deal-badge ab-filter-badge ab-filter-badge-side";
      btn.dataset.filter = "sides";
      btn.dataset.value = String(s.id);
      btn.textContent = s.label;
      if ((state.selectedSides || []).includes(s.id))
        btn.classList.add("selected");
      sidesContainer.appendChild(btn);
    });
    body.appendChild(sidesContainer);

    // separator between sides and price
    const sep4 = document.createElement("div");
    sep4.className = "ab-filter-separator";
    body.appendChild(sep4);

    // PRICE RANGE UI
    const priceWrapper = document.createElement("div");
    priceWrapper.style.marginTop = "18px";

    // fixed bounds: min 2, max 45
    const globalMin = 2;
    const globalMax = 45;

    // initialize state price range if not set
    if (!state.selectedPriceRange || state.selectedPriceRange.length !== 2) {
      state.selectedPriceRange = [globalMin, globalMax];
    }

    const [selMin, selMax] = state.selectedPriceRange;

    priceWrapper.innerHTML = `
      <div class="ab-deals-heading" style="margin:0 0 8px;">How much would you like to spend?</div>
      <div style="padding:8px 0 6px;">
        <div class="ab-price-slider" style="position:relative;height:36px;">
          <div class="ab-price-track" style="position:absolute;left:0;right:0;top:18px;height:6px;background:#e6e6e6;border-radius:999px;"></div>
          <div class="ab-price-fill" style="position:absolute;top:18px;height:6px;background:#006491;border-radius:999px;left:0;width:0;"></div>
          <div class="ab-price-handle ab-price-handle-min" role="slider" tabindex="0" aria-valuemin="${globalMin}" aria-valuemax="${globalMax}" aria-valuenow="${selMin}" style="position:absolute;top:6px;width:28px;height:28px;border-radius:50%;background:#fff;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.15);transform:translateX(-50%);cursor:pointer;"></div>
          <div class="ab-price-handle ab-price-handle-max" role="slider" tabindex="0" aria-valuemin="${globalMin}" aria-valuemax="${globalMax}" aria-valuenow="${selMax}" style="position:absolute;top:6px;width:28px;height:28px;border-radius:50%;background:#fff;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.15);transform:translateX(-50%);cursor:pointer;"></div>
        </div>
        <div style="display:flex;justify-content:space-between;padding-top:8px;font-size:14px;color:#444">
          <div class="ab-price-min-label">£${selMin}</div>
          <div class="ab-price-max-label">£${selMax}</div>
        </div>
      </div>
    `;

    body.appendChild(priceWrapper);

    const slider = priceWrapper.querySelector(".ab-price-slider");
    const track = priceWrapper.querySelector(".ab-price-track");
    const fill = priceWrapper.querySelector(".ab-price-fill");
    const handleMin = priceWrapper.querySelector(".ab-price-handle-min");
    const handleMax = priceWrapper.querySelector(".ab-price-handle-max");
    const minLabel = priceWrapper.querySelector(".ab-price-min-label");
    const maxLabel = priceWrapper.querySelector(".ab-price-max-label");

    function valueToPercent(v) {
      return ((v - globalMin) / (globalMax - globalMin)) * 100;
    }
    function percentToValue(p) {
      const v = globalMin + (p / 100) * (globalMax - globalMin);
      return Math.round(v);
    }

    function updateUI(minV, maxV) {
      const minP = valueToPercent(minV);
      const maxP = valueToPercent(maxV);
      handleMin.style.left = minP + "%";
      handleMax.style.left = maxP + "%";
      fill.style.left = minP + "%";
      fill.style.width = Math.max(0, maxP - minP) + "%";
      minLabel.textContent = "£" + minV;
      maxLabel.textContent = "£" + maxV;
      handleMin.setAttribute("aria-valuenow", minV);
      handleMax.setAttribute("aria-valuenow", maxV);
    }

    // initial render
    updateUI(state.selectedPriceRange[0], state.selectedPriceRange[1]);

    let activeHandle = null;

    function onPointerMove(e) {
      if (!activeHandle) return;
      const rect = track.getBoundingClientRect();
      let p = ((e.clientX - rect.left) / rect.width) * 100;
      p = Math.max(0, Math.min(100, p));
      let v = percentToValue(p);
      if (activeHandle === "min") {
        v = Math.min(v, state.selectedPriceRange[1]);
        state.selectedPriceRange[0] = v;
      } else {
        v = Math.max(v, state.selectedPriceRange[0]);
        state.selectedPriceRange[1] = v;
      }
      updateUI(state.selectedPriceRange[0], state.selectedPriceRange[1]);
      applyDealFilters(state);
    }

    function onPointerUp(e) {
      if (!activeHandle) return;
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerUp);
      activeHandle = null;
    }

    function onPointerDownHandle(e, which) {
      e.preventDefault();
      activeHandle = which;
      e.target.setPointerCapture && e.target.setPointerCapture(e.pointerId);
      document.addEventListener("pointermove", onPointerMove);
      document.addEventListener("pointerup", onPointerUp);
      // immediately move to pointer position
      onPointerMove(e);
    }

    handleMin.addEventListener("pointerdown", (e) =>
      onPointerDownHandle(e, "min")
    );
    handleMax.addEventListener("pointerdown", (e) =>
      onPointerDownHandle(e, "max")
    );

    // --- SORT UI (below price range)
    const sepSort = document.createElement("div");
    sepSort.className = "ab-filter-separator";
    body.appendChild(sepSort);

    const sortHeading = document.createElement("div");
    sortHeading.className = "ab-deals-heading";
    sortHeading.textContent = "Sort";
    body.appendChild(sortHeading);

    const sortContainer = document.createElement("div");
    sortContainer.className = "ab-deal-badges ab-deal-badges-sort";

    (state.sortList || []).forEach((s) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "ab-deal-badge ab-filter-badge ab-filter-badge-sort";
      btn.dataset.filter = "sort";
      btn.dataset.value = String(s.value);
      btn.textContent = s.label;
      if (state.sort === s.value) btn.classList.add("selected");

      btn.addEventListener("click", (ev) => {
        ev.stopPropagation();
        // toggle sort: selecting same option clears it
        if (state.sort === s.value) state.sort = "";
        else state.sort = s.value;
        // re-render sidebar and re-apply filters
        renderDealsInSidebar(state);
        applyDealFilters(state);
      });

      sortContainer.appendChild(btn);
    });

    body.appendChild(sortContainer);

    // --- FOOTER: Clear + Count
    const sepFooter = document.createElement("div");
    sepFooter.className = "ab-filter-separator";
    body.appendChild(sepFooter);
    const footer = document.createElement("div");
    footer.className = "ab-filter-footer";

    const clearBtn = document.createElement("button");
    clearBtn.type = "button";
    clearBtn.className = "ab-filter-clear";
    clearBtn.textContent = "Clear all filters";

    const countBtn = document.createElement("button");
    countBtn.type = "button";
    countBtn.className = "ab-filter-count";
    const currentCount = (state.filteredDeals || []).length || 0;
    countBtn.textContent = `Showing ${currentCount} deals`;

    footer.appendChild(clearBtn);
    footer.appendChild(countBtn);
    body.appendChild(footer);

    // Clear handler: reset selections and price range, then re-render/apply
    clearBtn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      state.selectedDeals = [];
      state.selectedPizzaSizes = [];
      state.selectedPizzaQty = [];
      state.selectedSides = [];
      state.sort = "";
      state.selectedPriceRange = [globalMin, globalMax];
      renderDealsInSidebar(state);
      applyDealFilters(state);
    });

    // Count button closes the sidebar when clicked
    countBtn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      closeFilterSidebar();
    });
  }

  function closeFilterSidebar() {
    const overlay = document.querySelector(".ab-filter-overlay");
    if (!overlay) return;
    overlay.classList.remove("active");
    overlay.setAttribute("aria-hidden", "true");

    // detach esc
    if (overlay._escAttached && overlay._escHandler) {
      document.removeEventListener("keydown", overlay._escHandler);
      overlay._escAttached = false;
    }
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

          console.log({ groupDeal, cardId }, "Line 930");
          if (!groupDeal) return;

          const innerDeals = Array.isArray(groupDeal.deals)
            ? groupDeal.deals
            : [];

          const orderedInnerIds = innerDeals
            .map((d) => d.cardId)
            .filter(Boolean);

          // ⏳ wait for Nuxt to finish rendering
          setTimeout(() => {
            const globalAllowed = window.__allowedDealCardIds || new Set();

            const dealCards = Array.from(
              document.querySelectorAll(
                'section[data-ref-id="base-grid"] .base-deal-card'
              )
            );

            if (!dealCards.length) return;

            const parentEl = document.getElementById(cardId);

            // First: hide everything except the parent and allowed inner deals
            dealCards.forEach((cardEl) => {
              if (!cardEl.id) return;
              const shouldShow =
                cardEl.id === cardId ||
                (orderedInnerIds.includes(cardEl.id) &&
                  globalAllowed.has(cardEl.id));
              cardEl.style.display = shouldShow ? "" : "none";
            });

            // Then: move inner deal cards so they appear directly after the parent card, preserving order
            if (parentEl && parentEl.parentNode) {
              let reference = parentEl.nextSibling;
              orderedInnerIds.forEach((childId) => {
                const childEl = document.getElementById(childId);
                if (!childEl) return;
                // only move if currently in the same container
                try {
                  parentEl.parentNode.insertBefore(childEl, reference);
                  // advance reference to remain after the newly inserted child
                  reference = childEl.nextSibling;
                } catch (err) {
                  // ignore insertion errors
                }
              });
            }
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

    // Require that every selected deal type is present in the deal's items
    return filterDealsRecursively(deals, (deal) => {
      if (!deal.items || !deal.items.length) return false;

      return selectedDeals.every((sel) =>
        deal.items.some((item) => {
          if (!item.productType || typeof item.productType !== "string")
            return false;
          return item.productType.toLowerCase() === sel;
        })
      );
    });
  }

  // FILTERS BY SIZES
  function filterDealsByPizzaSize(deals, selectedSizes) {
    if (!selectedSizes.length) return deals;

    // Require that all selected sizes are present in the deal's pizza sizes
    return filterDealsRecursively(deals, (deal) => {
      const pizzaItems = deal.items?.filter(
        (item) => item.productType === "Pizza"
      );

      if (!pizzaItems?.length) return false;

      const dealSizes = pizzaItems.flatMap((item) => item.sizes || []);

      return selectedSizes.every((sizeId) => dealSizes.includes(sizeId));
    });
  }

  // FILTER BY PIZZA QUANTITY
  function filterDealsByPizzaQty(deals, selectedQty) {
    if (!selectedQty.length || selectedQty.includes(0)) {
      return deals; // "Any"
    }

    // Require that every selected qty condition is satisfied by the deal
    return filterDealsRecursively(deals, (deal) => {
      const pizzaCount =
        deal.items?.filter((item) => item.productType === "Pizza").length || 0;

      return selectedQty.every((qty) => {
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
    // Require that every selected side-quantity condition is satisfied
    return filterDealsRecursively(deals, (deal) => {
      const sideCount =
        deal.items?.filter((item) => item.productType === "Side").length || 0;

      return selectedSides.every((qty) => {
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
    // Apply price filter
    filteredDeals = filterDealsByPrice(filteredDeals, state.selectedPriceRange);

    // Apply sorting if selected
    const sorted = sortDeals(filteredDeals, state.sort);

    // Always store the latest filteredDeals in state
    state.filteredDeals = sorted;
    updateDealCardsUI(sorted);

    // Update sidebar footer count if present
    try {
      const countBtn = document.querySelector(".ab-filter-count");
      if (countBtn) {
        const cnt = Array.isArray(sorted) ? sorted.length : 0;
        countBtn.textContent = `Showing ${cnt} deals`;
      }
    } catch (err) {
      // ignore
    }
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
    let lastPath = window.location.pathname;

    function normalizePath(p) {
      try {
        return String(p || "").replace(/\/+$|^\s+|\s+$/g, "");
      } catch (err) {
        return p;
      }
    }

    function isDealsRoute() {
      // Exact-matching path for this install — adjust if needed
      return (
        normalizePath(window.location.pathname) ===
        normalizePath("/store/28484/hatfield/deals")
      );
    }

    function cleanupABTest() {
      // Remove injected nav
      const injected = document.querySelector("[data-ab-test='filter-nav-v1']");
      if (injected) injected.remove();

      // Remove overlay/sidebar and detach its handlers if present
      const overlay = document.querySelector(".ab-filter-overlay");
      if (overlay) {
        if (overlay._escHandler)
          document.removeEventListener("keydown", overlay._escHandler);
        if (overlay._badgeClickHandler)
          overlay.removeEventListener("click", overlay._badgeClickHandler);
        overlay.remove();
      }

      // Attempt to remove global click handlers added by setupFilterButtons
      try {
        document.removeEventListener("click", closeAllFilters);
      } catch (err) {
        // ignore
      }

      // Clear global state
      try {
        delete window.__abTestLabState;
        delete window.__allowedDealCardIds;
      } catch (err) {
        // ignore
      }
    }

    function handleRouteChange() {
      const currentPath = window.location.pathname;

      if (currentPath === lastPath) return;
      lastPath = currentPath;

      if (isDealsRoute()) {
        // Only inject when the route matches
        mainJs([document.body]);
        setupFilterButtons();
      } else {
        // Remove the UI when leaving the deals page
        cleanupABTest();
      }
    }

    // Initial load: inject only if current route matches
    if (isDealsRoute()) {
      mainJs([document.body]);
      setupFilterButtons();
    } else {
      // Ensure nothing is present from previous runs
      cleanupABTest();
    }

    const pushState = history.pushState;
    history.pushState = function () {
      pushState.apply(history, arguments);
      handleRouteChange();
    };

    window.addEventListener("popstate", handleRouteChange);
  });
})();
