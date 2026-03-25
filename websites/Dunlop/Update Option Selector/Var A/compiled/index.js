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

  function poll(t, i, o = false, e = 10000, a = 25) {
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
    );

    console.log(isStockTabEnable, "isStockTabEnable");
  }

  waitForElem("body", mainJs);
})();
