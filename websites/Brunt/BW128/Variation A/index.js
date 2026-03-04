(() => {
  const TEST_ID = "BW128";
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

  function poll(t, i, o = !1, e = 10000, a = 25) {
    e < 0 ||
      (t()
        ? i()
        : setTimeout(() => {
          poll(t, i, o, o ? e : e - a, a);
        }, a));
  }

  function mainJs([body]) {
    if (body.classList.contains(TEST_ID)) {
      return;
    } else {
      body.classList.add(TEST_ID)
    }

    function applyLimitedEditionStyle() {
      const limitedEditionProducts = [...document.querySelectorAll('.media__badge-text')]
        .filter(el => el.innerText === "LIMITED EDITION");
      
      const limitedEditionProductLinkList = limitedEditionProducts.map(product => product.closest(".productCard__link"))

      limitedEditionProductLinkList.forEach(link => {
        const cardContent = link.children[1];
        cardContent.classList.add("limited-edition")
      })
    }
    poll(
      () => [...document.querySelectorAll('.media__badge-text')]
        .filter(el => el.innerText === "LIMITED EDITION").length > 0,
      () => {
        applyLimitedEditionStyle()
      }
    )
    const productGridSection = document.querySelector(".product-list-grid");
    const productGridObserver = new MutationObserver((mutations) => {
      applyLimitedEditionStyle()
    })
    productGridObserver.observe(productGridSection, {
      childList: true,
      subtree: true,
    })
  }

  waitForElem("body", mainJs);
})();
