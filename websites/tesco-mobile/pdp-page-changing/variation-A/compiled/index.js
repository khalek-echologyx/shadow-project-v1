(() => {
  /* =========================
     WAIT FOR BODY
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

  /* =========================
     SELECTORS
  ========================= */
  const SELECTORS = {
    promoItems: ".promo-items",
    promoTargetSection: ".view-phone-details",
    promoImageGroup: ".promo-item-img-group",
  };

  /* =========================
     STATE
  ========================= */
  function createState() {
    return {
      promoState: [],
      accrodionState: [
        {
          title: "Apple TV+",
          content: `Eligible Handsets:
iPhone 17
iPhone 17 Pro
iPhone 17 Pro Max
iPhone Air
iPhone 16 with Apple iPad A16
iPhone 16e
iPhone 16 Pro Max
iPhone 16 Pro Max with Apple Watch Series 10
iPhone 16 Pro
iPhone 16 Plus
iPhone 16
iPhone 15 Pro Max
iPhone 15
iPhone 14
iPhone 13

How to claim 3 months of Apple TV+

Turn on your new iPhone and sign in with your Apple ID.
Open the Apple TV app. Make sure your eligible device is running the latest version of iOS, iPad OS, tvOS, or macOS.
The offer should appear immediately after you launch the Apple TV app. If not, scroll down in Watch Now until the offer appears.
Tap Enjoy 3 months Free. You might be asked to enter your Apple ID password, confirm your billing information, or add a valid payment method.
New subscribers get three months of Apple News+ free when you buy a new iPhone, subject to the terms and conditions.

Click Here for Full Terms & Conditions.

£9.99/month after free trial. One subscription per Family Sharing group. Offer good for 3 months after eligible device activation. Plan automatically renews until cancelled. Restrictions and other terms apply. See apple.com/uk/promo for more information.`
        },
        {
          title: "Apple Music",
          content: `Eligible Handsets:
iPhone 17
iPhone 17 Pro
iPhone 17 Pro Max
iPhone Air
iPhone 16 with Apple iPad A16
iPhone 16e
iPhone 16 Pro Max
iPhone 16 Pro Max with Apple Watch Series 10
iPhone 16 Pro
iPhone 16 Plus
iPhone 16
iPhone 15 Pro Max
iPhone 15
iPhone 14
iPhone 13

How to claim 3 months of Apple TV+

Turn on your new iPhone and sign in with your Apple ID.
Open the Apple TV app. Make sure your eligible device is running the latest version of iOS, iPad OS, tvOS, or macOS.
The offer should appear immediately after you launch the Apple TV app. If not, scroll down in Watch Now until the offer appears.
Tap Enjoy 3 months Free. You might be asked to enter your Apple ID password, confirm your billing information, or add a valid payment method.
New subscribers get three months of Apple News+ free when you buy a new iPhone, subject to the terms and conditions.

Click Here for Full Terms & Conditions.

£9.99/month after free trial. One subscription per Family Sharing group. Offer good for 3 months after eligible device activation. Plan automatically renews until cancelled. Restrictions and other terms apply. See apple.com/uk/promo for more information.`,
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

  /* =========================
     REUSABLE OBSERVER
  ========================= */
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

    observer.observe(root, {
      childList: true,
      subtree: true,
    });

    if (timeout) {
      setTimeout(() => observer.disconnect(), timeout);
    }
  }

  /* =========================
     RENDER PROMO IMAGES
  ========================= */
  function renderPromoImages(items) {
    if (!Array.isArray(items) || items.length <= 2) return "";

    const usableItems = items.slice(2).filter(item => item.image);
    const displayItems = usableItems.slice(0, 3);
    const remaining = usableItems.length - displayItems.length;

    let html = "";

    displayItems.forEach(item => {
      if (item.image) {
        html += `
          <img 
            class="promo-item-img" 
            src="${item.image}" 
            alt="" 
            loading="lazy"
          >
        `;
      }
    });

    if (remaining > 0) {
      html += `<span class="promo-more-count">+${remaining}</span>`;
    }
    return html;
  }

  /* =========================
     PROMO SECTION MARKUP
  ========================= */
  function promoSection() {
    return `
      <div class="promo-section">
        <div class="promo-item">
          <div class="promo-item-img-group"></div>
          <div class="promo-item-content">Get 3 months free</div>
        </div>

        <div id="no-eu-roaming" class="promo-item">
          <img class="promo-item-img"
            src="https://www.tescomobile.com/media/attribute/swatch/swatch_thumb/110x90/r/o/roaming_icon.png"
            alt="" loading="lazy">
          <div class="promo-item-content">No EU roaming</div>
        </div>

        <div id="frozen-prices" class="promo-item">
          <img class="promo-item-img"
            src="https://www.tescomobile.com/media/attribute/swatch/swatch_thumb/110x90/c/c/ccp-logo_3.png"
            alt="" loading="lazy">
          <div class="promo-item-content">Frozen Prices</div>
        </div>
      </div>
    `;
  }

  /* =========================
     UPDATE IMAGE GROUP
  ========================= */
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
      </svg>
      `;

    const ACCORDION_ICON_EXPANDED = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="1" y="1" width="22" height="22" rx="11" fill="white"/>
          <rect x="1" y="1" width="22" height="22" rx="11" stroke="#00539F" stroke-width="2"/>
          <path d="M18.3026 14.6047L12.0003 8.06909L5.69238 14.6044L6.77166 15.6462L11.9998 10.2295L17.2228 15.6459L18.3026 14.6047Z" fill="#00539F"/>
        </svg>
      `;

    const accordions = document.querySelectorAll('.custom-sidebar-accordion');
    if (!accordions.length) return;

    // ✅ Open first accordion by default
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

        // ✅ Close all
        accordions.forEach(acc => {
          acc.classList.remove('_open');
          acc.querySelector('.cust-sidebar-accordion-content').style.maxHeight = null;
          acc.querySelector('.custom-sidebar-accordion-icon').innerHTML =
            ACCORDION_ICON_COLLAPSED;
        });

        // ✅ Open clicked
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

    state.accrodionState.forEach((item, index) => {
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
      </div>
    `;
    });

    return html;
  }


  function sidebarTemplate(state) {
    return `
    <aside
      id="promo-custom-sidebar"
      class="modal-slide spotify cart-slider show-close _inner-scroll"
      tabindex="0"
      aria-describedby="modal-content-66"
      role="dialog"
      data-role="modal"
      data-type="slide"
    >
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

    <div class="promo-sidebar-backdrop" data-promo-backdrop style="display:none"></div>
  `;
  }



  function openSidebar() {
    const sidebar = document.getElementById("promo-custom-sidebar");
    const backdrop = document.querySelector("[data-promo-backdrop]");
    const modalWrapper = document.querySelector(".modals-wrapper");
    const html = `<div class="modals-overlay" style="z-index: 901;"></div>`;

    if (!sidebar || !backdrop || !modalWrapper) return;

    // Insert overlay if not already present
    if (!document.querySelector(".modals-overlay")) {
      modalWrapper.insertAdjacentHTML("beforebegin", html);
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

    // Remove the overlay element if it exists
    const overlay = document.querySelector(".modals-overlay");
    if (overlay) {
      overlay.remove();
    }

    document.body.classList.remove("_has-modal");
    sidebar.classList.remove("_show");
  }

  document.addEventListener("click", (e) => {
    if (e.target.matches(".modals-overlay")) {
      closeSidebar();
    }
  });




  /* =========================
     MAIN
  ========================= */
  function mainJs() {
    const globalState = createState();

    /* Insert promo section FIRST */
    const target = document.querySelector(SELECTORS.promoTargetSection);
    if (!target || document.querySelector(".promo-section")) return;

    if (!document.getElementById("promo-custom-sidebar")) {
      document.body.insertAdjacentHTML("beforeend", sidebarTemplate(globalState));
    }


    target.insertAdjacentHTML("afterend", promoSection());

    createObserver(SELECTORS.promoImageGroup, (imgGroup) => {
      if (imgGroup.dataset.sidebarBound) return;
      imgGroup.dataset.sidebarBound = "1";

      imgGroup.addEventListener("click", () => {
        openSidebar();
      });
    });

    initAccordion();


    /* Observe promo items AFTER section exists */
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


    /* =========================
       CLICK HANDLERS
    ========================= */
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
        e.target.closest(".action-close") ||
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
     START
  ========================= */
  waitForBody(mainJs);
})();
