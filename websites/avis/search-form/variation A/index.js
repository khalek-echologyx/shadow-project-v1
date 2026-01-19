import testInfo from "./info.json" assert { type: "json" };

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

  function mainJs() {
    console.log("name: v-01");
    const targetSearchForm = document.querySelector(".MuiBox-root > button");
    console.log(targetSearchForm, "=============== 35");
  }


  waitForElem("body", mainJs);
})();
