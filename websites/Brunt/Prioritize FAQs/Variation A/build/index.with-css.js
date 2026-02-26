(function () {
  var interval = setInterval(function () {
    if (document.head) {
      // Check if <head> exists
      clearInterval(interval); // Stop checking once found
      var style = document.createElement("style");
      style.innerHTML = `html {
  position: relative;
}
html::before {
  content: "AB test pilot CSS";
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99999999999;
  background: #ff0000;
  color: #ffffff;
  padding: 10px;
  border: 7px solid #269b11;
}
`;
      document.head.appendChild(style);
      setTimeout(() => {
        clearInterval(interval); // Clear the interval after 5 seconds
      }, 5000);
    }
  }, 100); // Check every 100ms for <head>
})();
(() => {
  const TEST_ID = "BW119";
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
    frequency = 25,
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
              timer - frequency,
            ),
          frequency,
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
    if (body.classList.contains(TEST_ID)) {
      return;
    } else {
      body.classList.add(TEST_ID);
    }

    poll(
      () => document.querySelector(".accordion").closest(".shopify-section"),
      () => {
        const faqSection = document
          .querySelector(".accordion")
          .closest(".shopify-section");
        const faqTargetSection = Array.from(
          document.querySelectorAll(".shopify-section"),
        ).find(
          (section) =>
            section.querySelector("h3")?.textContent.trim() ===
            "Why I Started BRUNT",
        );
        if (faqSection && faqTargetSection) {
          faqTargetSection.insertAdjacentElement("beforebegin", faqSection);
        }
      },
    );

    poll(
      () =>
        document
          .querySelector(".social-reels-carousel-wrapper")
          .closest(".shopify-section") &&
        document
          .querySelector(".reviews-carousel-wrapper")
          .closest(".shopify-section"),
      () => {
        const reviewsSection = document
          .querySelector(".reviews-carousel-wrapper")
          .closest(".shopify-section");
        const reviewsTargetSection = document
          .querySelector(".social-reels-carousel-wrapper")
          .closest(".shopify-section");
        if (reviewsSection && reviewsTargetSection) {
          reviewsTargetSection.insertAdjacentElement(
            "afterend",
            reviewsSection,
          );
        }
      },
    );
  }

  waitForElem("body", mainJs);
})();
