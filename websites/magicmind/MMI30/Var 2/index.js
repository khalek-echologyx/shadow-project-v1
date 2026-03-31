(() => {
  const TEST_ID = "MMI30";
  const VARIANT_ID = "V2"; /* V1, V2, V3 */

  function logInfo(message) {
    console.log(
      `%cAcadia%c${TEST_ID}-${VARIANT_ID}`,
      "color: white; background: rgb(0, 0, 57); font-weight: 700; padding: 2px 4px; border-radius: 2px;",
      "margin-left: 8px; color: white; background: rgb(0, 57, 57); font-weight: 700; padding: 2px 4px; border-radius: 2px;",
      message,
    );
  }
  logInfo("fired");
  function waitForElem(
    waitFor,
    callback,
    minElements = 1,
    isVariable = false,
    timer = 10000,
    frequency = 25
  ) {
    let elements = isVariable
      ? window[waitFor]
      : document.querySelectorAll(waitFor);
    if (timer <= 0) return;
    (!isVariable && elements.length >= minElements) ||
    (isVariable && typeof window[waitFor] !== "undefined")
      ? callback(elements)
      : setTimeout(
          () =>
            waitForElem(
              waitFor,
              callback,
              minElements,
              isVariable,
              timer - frequency
            ),
          frequency
        );
  }
  function poll(t, i, o = !1, e = 1e4, a = 25) { e < 0 || (t() ? i() : setTimeout(() => { poll(t, i, o, o ? e : e - a, a) }, a)) }

  function mainJs() {
    let hasPromoBanner = false;

    const getNavbarTop = () => {
      const promoWrapper = document.querySelector(".MMI23_promo-wrapper");
      if (!promoWrapper) return "0px";
      return promoWrapper.offsetHeight + "px";
    };

    const updateNavbarStyles = () => {
      const navbar = document.querySelector("#shopify-section-new-header-v4");
      if (!navbar) return;
      
      const promoWrapper = document.querySelector(".MMI23_promo-wrapper");
      hasPromoBanner = !!promoWrapper;
      const isMobile = window.innerWidth <= 768;

      navbar.style.setProperty("top", getNavbarTop(), "important");
      
      // Handle margin-top for main element
      const main = document.querySelector("main");
      if (main) {
        let promoHeight = hasPromoBanner ? promoWrapper.offsetHeight : 0;
        let navbarHeight = navbar.offsetHeight || (isMobile ? 50 : 66);
        let totalMargin = promoHeight + navbarHeight;
        
        main.style.setProperty("margin-top", totalMargin + "px", "important");
      }
    };

    //promo banner
    poll(
      () => document.querySelector(".MMI23_promo-wrapper"),
      () => {
        const promoWrapper = document.querySelector(".MMI23_promo-wrapper");
        if (!promoWrapper) return;
        promoWrapper.classList.add("MMI30_sticky-promo");
        hasPromoBanner = true;
        updateNavbarStyles();
      }
    )
    //navbar
    poll(
      () => document.querySelector("#shopify-section-new-header-v4"),
      () => {
        const navbar = document.querySelector("#shopify-section-new-header-v4");
        if (!navbar) return;
        navbar.classList.add("MMI30_sticky-navbar");
        updateNavbarStyles();
        
        let lastWidth = window.innerWidth;
        window.addEventListener("resize", () => {
          if (window.innerWidth !== lastWidth) {
            lastWidth = window.innerWidth;
            updateNavbarStyles();
          }
        });
      }
    )
  }

  waitForElem("body", mainJs);
})();
