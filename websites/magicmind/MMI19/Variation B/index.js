(function () {
  const TEST_ID = "MMI19";
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

  const globalVariables = {
    pageInitials: "ab-mmi19",
    testVariation: 1,
  };

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

  const init = () => {
    const productTitle = document.querySelector(
      "main-product-v2 .main-product-v2__title",
    );
    const productTitleExtentionText = productTitle.textContent
      ?.toLowerCase()
      .includes("sleep")
      ? "Performance Shot"
      : "Mental Performance Shot";
    productTitle.insertAdjacentHTML(
      "afterend",
      '<section class="product-title-wrapper"></section>',
    );
    const insertedTitleContainer = document.querySelector(
      "main-product-v2 .product-title-wrapper",
    );
    insertedTitleContainer.insertAdjacentElement("afterbegin", productTitle);
    insertedTitleContainer.insertAdjacentHTML(
      "beforeend",
      `<h1 class="product-title-extention">${productTitleExtentionText}</h1>`,
    );
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
