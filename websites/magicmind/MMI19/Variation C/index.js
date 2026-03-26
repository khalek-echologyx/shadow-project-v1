(function () {
  const TEST_ID = "MMI19";
  const VARIANT_ID = "V3"; /* V1, V2, V3 */
  function logInfo(message) {
    console.log(
      `%cAcadia%c${TEST_ID}-${VARIANT_ID}`,
      "color: white; background: rgb(0, 0, 57); font-weight: 700; padding: 2px 4px; border-radius: 2px;",
      "margin-left: 8px; color: white; background: rgb(0, 57, 57); font-weight: 700; padding: 2px 4px; border-radius: 2px;",
      message,
    );
  }
  logInfo("fired");

  const globalVariables = {
    pageInitials: "ab-mmi19",
    testVariation: 3,
  };

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

  const getExtantionText = (text) => {
    return text.includes("sleep") ? "Sleep" : text.includes("original") ? "Original" : text.includes("maxx") ? "MAXX" : "FREE";
  }

  const pageInitials = globalVariables.pageInitials;

  const mainJS = () => {
    if (document.querySelector("body").classList.contains(pageInitials)) return;
    poll(
      () => document.querySelector("main-product-v2 .main-product-v2__title"),
      () => {
        const productTitle = document.querySelector(
          "main-product-v2 .main-product-v2__title",
        );
        const productTitleExtentionText = getExtantionText(productTitle.textContent?.toLowerCase());
        //desktop inject
        const selectorElDesktop = document.querySelector(".main-product-v2__gallery");
        selectorElDesktop.insertAdjacentHTML("afterbegin", `<h1 class="main-product-v2__title new-title-mmi19">${productTitleExtentionText}</h1>`);

        //mobile inject
        const selectorElMobile = document.querySelector(".main-product-v2__container");
        selectorElMobile.insertAdjacentHTML("afterbegin", `<h1 class="main-product-v2__title new-title-mmi19-mobile">${productTitleExtentionText}</h1>`);
        document.querySelector("body").classList.add(pageInitials);
      }
    )

  };

  waitForElem("body", mainJS);
})();
