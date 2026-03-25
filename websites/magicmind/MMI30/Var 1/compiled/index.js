(() => {
  const TEST_ID = "MMI30";
  const VARIANT_ID = "V1"; /* V1, V2, V3 */

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

  function poll(t, i, o = false, e = 1e4, a = 25) { e < 0 || (t() ? i() : setTimeout(() => { poll(t, i, o, o ? e : e - a, a); }, a)); }

  function mainJs() {

    const getNavbarTop = () => {
      const promoEl = document.querySelector(".MMI23_promo-wrapper");
      if (!promoEl) return "0px";
      return window.innerWidth <= 768 ? "36px" : "45px";
    };

    poll(
      () => document.querySelector(".MMI23_promo-wrapper"),
      () => {
        const promoEl = document.querySelector(".MMI23_promo-wrapper");
        if (!promoEl) return;

        let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        let ticking = false;

        window.addEventListener("scroll", () => {
          if (!ticking) {
            window.requestAnimationFrame(() => {
              let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

              if (scrollTop < lastScrollTop && scrollTop > promoEl.offsetHeight) {
                // Scrolling up and scrolled past the element's height
                promoEl.classList.add("MMI30_sticky-promo");
              } else {
                // Scrolling down or at the top
                promoEl.classList.remove("MMI30_sticky-promo");
              }
              lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
              ticking = false;
            });
            ticking = true;
          }
        }, { passive: true });

        // Update navbar top if it's already found
        const navbar = document.querySelector("#shopify-section-new-header-v4");
        if (navbar) {
          navbar.style.top = getNavbarTop();
        }
      }
    );

    poll(
      () => document.querySelector("#shopify-section-new-header-v4"),
      () => {
        const navbar = document.querySelector("#shopify-section-new-header-v4");
        if (!navbar) return;

        // Initial apply
        navbar.style.top = getNavbarTop();

        let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        let ticking = false;

        window.addEventListener("scroll", () => {
          if (!ticking) {
            window.requestAnimationFrame(() => {
              let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

              if (scrollTop < lastScrollTop && scrollTop > navbar.offsetHeight) {
                navbar.classList.add("MMI30_sticky-navbar");
              } else {
                navbar.classList.remove("MMI30_sticky-navbar");
              }
              
              // Consistently apply top based on promo presence and window width
              navbar.style.top = getNavbarTop();

              lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
              ticking = false;
            });
            ticking = true;
          }
        }, { passive: true });
        
        // Also handle window resize for responsiveness
        window.addEventListener("resize", () => {
          navbar.style.top = getNavbarTop();
        });
      }
    );
  }

  waitForElem("body", mainJs);
})();
