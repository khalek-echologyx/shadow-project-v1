(() => {
  const TEST_ID = "ab-test-14";
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

  function mainJs([body]) {
    if (body.classList.contains(TEST_ID)) return;
    body.classList.add(TEST_ID);

    poll(
      () => document.querySelector(".header-buttons.buttons-mobile"),
      () => {
        const navBarStickyEl = document.querySelector(".header-buttons.buttons-mobile");
        const wrapperDivOneHtml = `<div class="wrap-div-1"></div>`;
        const wrapperDivTwoHtml = `<div class="wrap-div-2"></div>`;
        // target old element
        const stickyNavBtn = navBarStickyEl.querySelector("button");
        const stickyNavLink = navBarStickyEl.querySelector("a");
        stickyNavLink.classList.add("ab-test-14-link");
        // injection wrapper divs
        navBarStickyEl.insertAdjacentHTML("afterbegin", wrapperDivOneHtml);
        const wrapperDivOneEl = document.querySelector(".wrap-div-1");
        wrapperDivOneEl.insertAdjacentElement("afterbegin", stickyNavBtn);
        wrapperDivOneEl.insertAdjacentHTML("afterend", wrapperDivTwoHtml);
        const wrapperDivTwoEl = document.querySelector(".wrap-div-2");
        wrapperDivTwoEl.insertAdjacentElement("afterbegin", stickyNavLink);
        // replace text
        stickyNavBtn.textContent = "Infopaket bestellen";
        stickyNavLink.textContent = "Kursplatz sichern";
        //inject new helper elements
        const wrapOneHelper = `<p class="wrap-helper-text">Kostenlos. Alles Wissenswerte.</p>`;
        const wrapTwoHelper = `<p class="wrap-helper-text">4 Wochen unverbindlich testen.</p>`;
        wrapperDivOneEl.insertAdjacentHTML("beforeend", wrapOneHelper);
        wrapperDivTwoEl.insertAdjacentHTML("beforeend", wrapTwoHelper);
      }
    );
  }

  waitForElem("body", mainJs);
})();
