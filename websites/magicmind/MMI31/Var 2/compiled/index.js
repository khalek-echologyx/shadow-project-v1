(() => {
  const TEST_ID = "MMI31";
  const VARIANT_ID = "V1";

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

  const replaceImg = `https://cdn.shopify.com/s/files/1/0612/5086/3345/files/mmi31-lifestyle-image-v2.png?v=1773655928`;

  function mainJs() {
    poll(
      () => document.querySelector('[data-swiper-slide-index="0"] img'),
      () => {
        const selectorImgTag = document.querySelector('[data-swiper-slide-index="0"] img');
        selectorImgTag.src = replaceImg;
        selectorImgTag.srcset = replaceImg;
        const selectorSourceTag = document.querySelector('[data-swiper-slide-index="0"] source');
        selectorSourceTag.srcset = replaceImg;
        //thumbnail image
        const thumbnailImage = document.querySelector('.main-product-v2__thumbnails-wrapper [data-swiper-slide-index="0"] img');
        thumbnailImage.src = replaceImg;
      }
    );

  }

  waitForElem("body", mainJs);
})();
