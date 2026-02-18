import testInfo from "./info.json" assert { type: "json" };

(() => {
  //--- CONFIGURATION VARIABLES ---
  var mvtID = 'MVT-308';
  

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

   function checkIsAvisFirst() {
    var sessionState = sessionStorage.getItem("reservation.store");
    var reservationStore = JSON.parse(sessionState);
    return reservationStore.state.isAvisFirst;
  }

  function mainJs() {
    console.log(mvtID)
    if (!document.body.classList.contains(mvtID)) {
      document.body.classList.add(mvtID);
    }
    if (checkIsAvisFirst()) {
      console.log("==========Avis First");
    } else {
      console.log("==========Not Avis First");
    }
  }

  waitForElem('[data-testid="avis-first-long-logo"]', mainJs);
})();
