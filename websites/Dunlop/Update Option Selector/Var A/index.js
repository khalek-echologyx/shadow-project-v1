(() => {
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

  function poll(t, i, o = !1, e = 10000, a = 25) {
    e < 0 ||
      (t()
        ? i()
        : setTimeout(() => {
          poll(t, i, o, o ? e : e - a, a);
        }, a));
  }

  function mainJs() {
    // stock tab identify
    let isStockTabEnable = false;
    poll(
      () => document.querySelector(
        '.nav-tabs .nav-link'
      )?.textContent.trim().toLowerCase().includes('stock'),
      () => {
        isStockTabEnable = true;
      }
    )
    if (isStockTabEnable) {
      poll(
        () => document.querySelector(
          '.js-stock-visible[aria-labelledby*="stock-tab"]'
        ),
        () => {
          const stockEl = document.querySelector(
            '.js-stock-visible[aria-labelledby*="stock-tab"]'
          );

          const injectClasses = () => {
            const tabContent = stockEl.querySelector('.tab-content')
            if (!tabContent) return;
            const headItems = tabContent.querySelectorAll(".attribute");

            headItems.forEach(item => {
              const optionList = item.querySelector(".select .select-wrapper");
              const checkboxList = item.querySelector(".select-list");
              if (optionList && !optionList.classList.contains("ab-option-wrapper")) {
                optionList.classList.add("ab-option-wrapper");
                const selectOptions = optionList.querySelectorAll(".select-option");
                selectOptions.forEach(option => {
                  if (option.classList.contains("disabled")) {
                    option.classList.add("ab-option-disabled");
                    const span = option.querySelector("span")
                    if (span) span.style.display = "none";
                  }
                })
              }
              if (checkboxList && !checkboxList.classList.contains("ab-checkbox-wrapper")) {
                checkboxList.classList.add("ab-checkbox-wrapper");
              }
            })
          }

          // Run once on load
          injectClasses();

          // Re-run whenever the site rebuilds the DOM inside stockEl
          const stockObserver = new MutationObserver(() => {
            injectClasses();
          });

          stockObserver.observe(stockEl, {
            childList: true,
            subtree: true,
          });
        }
      )
    }
  }

  waitForElem("body", mainJs);
})();
