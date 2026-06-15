(() => {
  // --- CONFIGURATION ---
  const CONFIG = {
    targetElement: '[data-testid="rc-title"]',
    targetPathname: '/en/reservation/review-and-book',
    injectedClass: 'MVT-123-Var_D',
    testId: 'MVT-123',
    variationId: 'Var_D',
  };

  // poll function
  function poll(t, i, o = false, e = 10000, a = 25) {
    e < 0 ||
      (t()
        ? i()
        : setTimeout(() => {
          poll(t, i, o, o ? e : e - a, a);
        }, a));
  }
  // extract price
  function extractPrice(text) {
    return parseFloat(
      text.replace(/[^0-9.,]/g, '').replace(/,/g, '')
    );
  }

  // 1. Pathname Validator
  function isTargetPage() {
    const currentPath = window.location.pathname;
    return currentPath.includes(CONFIG.targetPathname);
  }

  // add class and attribute
  function addClassAndAttribute() {
    const mainControl = document.querySelector('[data-mvt-injected="true"]');
    // heading title
    const mainHeadingEl = mainControl.querySelectorAll('h6');
    mainHeadingEl.forEach((el, idx) => {
      if (idx === 0) {
        el.setAttribute('data-mvt-testid', 'protection-title-heading');
        const protectionBundleSectin = el.nextElementSibling;
        if (protectionBundleSectin) protectionBundleSectin.setAttribute('data-mvt-testid', 'protection-bundle-section-container');
      } else if (idx === 1) {
        el.setAttribute('data-mvt-testid', 'add-on-title-heading');
        const addOnSection = el.nextElementSibling;
        if (addOnSection) addOnSection.setAttribute('data-mvt-testid', 'add-on-section-container');
      }
    });
    // expand and collapse buttons
    const expendButtons = document.querySelectorAll('[data-mvt-injected="true"] > button');
    expendButtons.forEach((btn, idx) => {
      if (idx === 0) {
        btn.setAttribute('data-mvt-testid', 'protection-expand-button');
        btn.click();
      } else if (idx === 1) {
        btn.setAttribute('data-mvt-testid', 'add-on-expand-button');
      }
    });
    //protection bundles
    const protectionBundles = mainControl.querySelectorAll('[data-mvt-testid="protection-bundle-section-container"] > div');
    if (protectionBundles.length > 0) {
      protectionBundles.forEach((bundle, idx) => {
        bundle.setAttribute('data-mvt-testid', 'protection-bundle');
        const bundleName = bundle.querySelector('div > div > div > div > div > p');
        if (bundleName) bundle.setAttribute('data-mvt-bundleName', bundleName.textContent.trim());
      });
    }

    //hide add-on bundle
    const addOnBundles = mainControl.querySelectorAll('[data-mvt-testid="add-on-section-container"] input[type="radio"]');
    if (addOnBundles.length > 0) {
      const addOnBundleSection = mainControl.querySelector('[data-mvt-testid="add-on-section-container"]');
      addOnBundleSection.style.display = "none";
    }
  }

  // inject design and test id 
  function injectDesign() {
    const mainControl = document.querySelector('[data-mvt-injected="true"]');
    console.log('===> index.js:63 ~ injectDesign ~ mainControl', mainControl);
    const protectionBundle = mainControl.querySelector('[data-mvt-bundlename="Basic Cover"]') || mainControl.querySelector('[data-mvt-bundlename="Essential Protection"]');
    if (protectionBundle) {
      const priceEl = protectionBundle.querySelector('[data-testid="checkout-ancillaries-bundle-price"]');
      const priceParentEl = priceEl.closest('.MuiBox-root');
      console.log('===> index.js:80 ~ priceParentEl', priceParentEl);

      // inject checkbox
      const checkboxEl = document.createElement('input');
      checkboxEl.classList.add('mvt-bundle-checkbox');
      checkboxEl.type = 'checkbox';
      priceParentEl.prepend(checkboxEl);

      // event lister to checkbox
      checkboxEl.addEventListener('change', (e) => {
        const isChecked = e.target.checked;
        console.log('===> index.js:91 ~ isChecked', isChecked);
        const radioInput = protectionBundle.querySelector('input[type="radio"]');
        const inputSpan = radioInput.closest('span');

        if (isChecked) {
          inputSpan.click();
        } else {
          const allProtBundles = mainControl.querySelectorAll('[data-mvt-testid="protection-bundle"]');
          console.log('===> index.js:105 ~ allProtBundles', allProtBundles);
          const bundleToClick = [...allProtBundles].find((bundle) => {
            const priceText = bundle.querySelector(
              '[data-testid="checkout-ancillaries-bundle-price"] p'
            );

            console.log('===> index.js:111 ~ ', extractPrice(priceText.textContent.trim()));

            return priceText && extractPrice(priceText.textContent.trim()) < 1;
          });
          console.log('===> index.js:113 ~ bundleToClick', bundleToClick);

          if (bundleToClick) {
            console.log('===> index.js:118 ~ ',);
            const radioInput = bundleToClick.querySelector('input[type="radio"]');
            if (radioInput) {
              const inputSpan = radioInput.closest('span');

              // Click the span if it exists, otherwise click the input itself as a fallback
              if (inputSpan) {
                inputSpan.click();
              } else {
                radioInput.click();
              }
            }
          }
        }
      });



    }
  }


  // 2. Main Injection Logic
  function inject() {
    // Step A: Check if we are on the target route
    if (!isTargetPage()) return;

    // Step B: Check if our code is already injected (prevent duplicate injections)
    if (document.querySelector('.' + CONFIG.injectedClass)) {
      return;
    }

    poll(
      () => document.querySelector(CONFIG.targetElement),
      () => {
        try {
          const targetElement = document.querySelector(CONFIG.targetElement);
          if (targetElement) {
            const protectionHeading = [...document.querySelectorAll('h6')].find(el => el.textContent === 'Choose your protection');
            if (!protectionHeading) throw new Error("protectionHeading not found")
            const mainContainer = protectionHeading.closest('div');
            if (!mainContainer) throw new Error("mainContainer not found")
            mainContainer.setAttribute('data-mvt-injected', 'true');
            //inject classes and data attribute into the dom
            addClassAndAttribute();
            injectDesign();
            document.body.classList.add(CONFIG.injectedClass);
          } else throw err
        } catch (error) {
          console.error(error, "MVT-123 :: Error occaring during test");
        }
      }
    );
  }

  // 3. SPA DOM Observer
  function initSPAObserver() {
    inject();

    const observer = new MutationObserver(() => {
      inject();
    });

    // Observe document body for deep changes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  // Utility to wait for the initial body tag or basic elements before setting up the observer
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

  // Initialize
  waitForElem("body", initSPAObserver);
})();
