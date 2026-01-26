(function () {
  var interval = setInterval(function () {
    if (document.head) {
      // Check if <head> exists
      clearInterval(interval); // Stop checking once found
      var style = document.createElement("style");
      style.innerHTML = `[itemprop="offers"] > .esbb-shipping-payment-area-below-wishlist {
  display: none;
}

.BBX-218 [itemprop="offers"] > .product-detail-form-container {
  margin-bottom: 20px !important;
}
.BBX-218 [itemprop="offers"] > .esbb-pp-pay-later-hint {
  border-bottom: 1px solid #f5f5f4;
  padding-bottom: 12px;
  margin-top: 0px !important;
  color: #000;
  gap: 12px !important;
  align-items: center;
  font-size: 14px;
}
.BBX-218 [itemprop="offers"] > .esbb-pp-pay-later-hint > img {
  width: 54px !important;
  height: 14px !important;
}
.BBX-218 [itemprop="offers"] > .esbb-pp-pay-later-hint > span {
  font-size: 14px !important;
  font-weight: 400;
  left: 0 !important;
  top: 0 !important;
}
.BBX-218 [itemprop="offers"] > .esbb-swallow-hint {
  justify-content: start !important;
  gap: 26px !important;
  margin: 0 !important;
  padding-top: 12px !important;
  font-size: 14px;
}
.BBX-218 [itemprop="offers"] > .esbb-swallow-hint > span {
  font-size: 14px !important;
  font-weight: 400;
}
.BBX-218 [itemprop="offers"] > .esbb-swallow-hint > img {
  width: 40px !important;
  height: 40px !important;
}
.BBX-218 [itemprop="offers"] > .BBX-14__esbb-product-specs-variant {
  border-bottom: 0 !important;
  order: 4 !important;
}
@media screen and (max-width: 1024px) {
  .BBX-218 [itemprop="offers"] > .esbb-pp-pay-later-hint {
    padding-bottom: 10px;
  }
  .BBX-218 [itemprop="offers"] > .esbb-pp-pay-later-hint > img {
    width: 35px !important;
    height: 9px !important;
  }
  .BBX-218
    [itemprop="offers"]
    > .esbb-pp-pay-later-hint
    > span.esbb-pp-pay-later-hint-text {
    font-size: 14px !important;
    left: 0 !important;
    top: 0 !important;
  }
  .BBX-218 [itemprop="offers"] > .esbb-swallow-hint {
    gap: 19px !important;
    padding-top: 10px !important;
  }
  .BBX-218 [itemprop="offers"] > .esbb-swallow-hint > span {
    font-size: 14px !important;
  }
  .BBX-218 [itemprop="offers"] > .esbb-swallow-hint > img {
    width: 28px !important;
    height: 28px !important;
  }
  .BBX-218 [itemprop="offers"] > .BBX-14__esbb-product-specs-variant {
    margin-top: 8px !important;
  }
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
  function mainJs([body]) {
    body.classList.add("BBX-218");
  }

  waitForElem("body", mainJs);
})();
