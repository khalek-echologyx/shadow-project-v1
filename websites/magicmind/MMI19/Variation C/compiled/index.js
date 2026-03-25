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
    pageInitials: "ab-mmi19"};

  function waitForElem(predicate, callback, timer = 15000, frequency = 100) {
    if (timer <= 0) return;
    if (typeof predicate === "function" && predicate()) {
      callback();
    } else {
      setTimeout(
        () => waitForElem(predicate, callback, timer - frequency),
        frequency,
      );
    }
  }

  const getExtantionText = (text) => {
    return text.includes("sleep") ? "Sleep" : text.includes("original") ? "Original" : text.includes("maxx") ? "MAXX" : "FREE";
  };

  const init = () => {
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


  };

  const hasAllElements = () => {
    const productTitleText = document.querySelector(
      "main-product-v2 .main-product-v2__title",
    )?.textContent;
    if (productTitleText) {
      return true;
    } else {
      return false;
    }
  };

  const pageInitials = globalVariables.pageInitials;

  waitForElem(
    () =>
      document.querySelector(`body:not(.${pageInitials})`) && hasAllElements(),
    () => {
      document.querySelector("body").classList.add(pageInitials);
      init();
    },
  );
})();
