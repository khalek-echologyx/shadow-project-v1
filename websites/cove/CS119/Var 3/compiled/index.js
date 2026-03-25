(() => {
  const TEST_ID = "CS119";
  const VARIANT_ID = "V1";

  function logInfo(message) {
    console.log(
      `%cAcadia%c${TEST_ID}-${VARIANT_ID}`,
      "color: white; background: rgb(0, 0, 57); font-weight: 700; padding: 2px 4px; border-radius: 2px;",
      "margin-left: 8px; color: white; background: rgb(0, 57, 57); font-weight: 700; padding: 2px 4px; border-radius: 2px;",
      message
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

  function poll(t, i, o = false, e = 10000, a = 25) {
    e < 0 ||
      (t()
        ? i()
        : setTimeout(() => {
          poll(t, i, o, o ? e : e - a, a);
        }, a));
  }

  function mainJs() {
    if (document.body.classList.contains(TEST_ID)) return;
    document.body.classList.add(TEST_ID);
    poll(
      () => document.querySelectorAll("h2").length > 0,
      () => {
        const observer = new MutationObserver(() => {
          const targetH2Elements = document.querySelectorAll("h2");
          // order change targeted sections
          targetH2Elements.forEach(el => {
            if (el.textContent.trim() === "The #1 customer-rated home security system.*") {
              const targetParentEl = el.parentElement;
              const selectorEl = [...document.querySelectorAll("h2")].find(item => item.textContent.trim() === "Our Products").parentElement;
              const easyDisSection = [...document.querySelectorAll("h2")].find(item => item.textContent.trim() === "It's an easy decision.").parentElement.parentElement;
              if (selectorEl && selectorEl.nextElementSibling !== targetParentEl) {
                selectorEl.insertAdjacentElement("afterend", targetParentEl);
                targetParentEl.insertAdjacentElement("afterend", easyDisSection);
              }
            } else if (el.textContent === "Home security that’s both effective and affordable.") {
              const homeSecureEl = el.parentElement.parentElement;
              const elezabethEl = [...document.querySelectorAll("h2")].find(item => item.textContent.trim() === "Proud partner of the Elizabeth Smart Foundation").parentElement.parentElement.parentElement;
              if (homeSecureEl && elezabethEl && homeSecureEl.nextElementSibling !== elezabethEl) {
                elezabethEl.style.marginTop = "50px";
                homeSecureEl.insertAdjacentElement("afterend", elezabethEl);
              }
            }
          });
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true,
        });
      },
    );


  }

  waitForElem("body", mainJs);
})();
