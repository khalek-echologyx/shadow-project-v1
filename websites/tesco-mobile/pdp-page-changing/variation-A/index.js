(() => {
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

  //ALL SELECTORS HERE
  const SELECTORS = {
    promoItems: ".promo-items",
    promoTargetSection: ".view-phone-details",
  };

  function createState() {
    return {
      promoState: [],
    };
  }

  //REUSABLE OBSERVER FOR DYNAMIC ELEMENTS
  function createObserver(selector, onFound, options = {}) {
    const { root = document.documentElement, timeout = 10000 } = options;
    const element = document.querySelector(selector);
    if (element) {
      onFound(element);
      return;
    }

    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (el) {
        observer.disconnect();
        onFound(el);
      }
    });

    observer.observe(root, {
      childList: true,
      subtree: true,
    });

    if (timeout) {
      setTimeout(() => {
        observer.disconnect();
      }, timeout);
    }
  }

  //PROMO SECTION
  function promoSection() {
    return `
          <div class="promo-section">
            <div class="promo-item">
              <div class="promo-item-img-group">
                <img class="promo-item-img" src="https://www.tescomobile.com/media/attribute/swatch/swatch_thumb/110x90/a/p/apple_music.png" alt="" loading="lazy">
                
                <img class="promo-item-img" src="https://www.tescomobile.com/media/attribute/swatch/swatch_thumb/110x90/a/p/apple_fitness.png" alt="" loading="lazy">
                
                <img class="promo-item-img" src="https://www.tescomobile.com/media/attribute/swatch/swatch_thumb/110x90/a/p/apple_tv.png" alt="" loading="lazy">

                <span class="promo-more-count">+2</span>
              </div>
              <div class="promo-item-content">Get 3 months free</div>
            </div>
            <div id="no-eu-roaming" class="promo-item">
              <img class="promo-item-img" src="https://www.tescomobile.com/media/attribute/swatch/swatch_thumb/110x90/r/o/roaming_icon.png" alt="" loading="lazy">
              <div class="promo-item-content">No EU roaming</div>
            </div>
            <div id="frozen-prices" class="promo-item">
              <img class="promo-item-img" src="https://www.tescomobile.com/media/attribute/swatch/swatch_thumb/110x90/c/c/ccp-logo_3.png" alt="" loading="lazy">
              <div class="promo-item-content">Frozen Prices</div>
            </div>
          </div>
    `;
  }

  function mainJs() {
    const globalState = createState();
    createObserver(SELECTORS.promoItems, (promoItems) => {
      const formattedPromoItems = [...promoItems.querySelectorAll(".sale-type")]
        .filter((item) => item.offsetParent !== null)
        .map((item) => {
          const img = item.querySelector("img");
          const textEl = item.querySelector(".promo-content");

          return {
            image: img?.src || null,
            text: textEl?.textContent.trim() || "",
          };
        });
      globalState.promoState = formattedPromoItems;
    });
    console.log(globalState.promoState.slice(3, 6), "Line 101");
    const promoTargetSection = document.querySelector(
      SELECTORS.promoTargetSection
    );
    if (promoTargetSection) {
      promoTargetSection.insertAdjacentHTML("afterend", promoSection());
      // attach click handler to frozen-prices to trigger the promotion trigger click
      (function attachFrozenHandler() {
        const frozen = document.getElementById('frozen-prices');
        if (!frozen) return;
        if (frozen.dataset.frozenListener === '1') return;
        frozen.dataset.frozenListener = '1';
        frozen.addEventListener('click', (e) => {
          const promoTriggerId = 'promotion-trigger-49632199458';
          const trigger = document.getElementById(promoTriggerId);
          const clickIt = (el) => {
            try {
              el.click();
            } catch (err) {
              el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
            }
          };

          if (trigger) {
            clickIt(trigger);
            return;
          }

          // If the trigger isn't present yet, wait for it and then click
          createObserver('#' + promoTriggerId, (el) => {
            clickIt(el);
          }, { timeout: 5000 });
        });
      })();

      // attach click handler to no-eu-roaming to trigger the roaming promotion click
      (function attachRoamingHandler() {
        const roaming = document.getElementById('no-eu-roaming');
        if (!roaming) return;
        if (roaming.dataset.roamingListener === '1') return;
        roaming.dataset.roamingListener = '1';
        roaming.addEventListener('click', (e) => {
          const promoTriggerId = 'promotion-trigger-49845199458';
          const trigger = document.getElementById(promoTriggerId);
          const clickIt = (el) => {
            try {
              el.click();
            } catch (err) {
              el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
            }
          };

          if (trigger) {
            clickIt(trigger);
            return;
          }

          createObserver('#' + promoTriggerId, (el) => {
            clickIt(el);
          }, { timeout: 5000 });
        });
      })();
    }
  }

  //STARTER HERE
  waitForBody(mainJs);
})();
