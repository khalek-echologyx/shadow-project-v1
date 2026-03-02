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

  function fireGA4Event(eventName, eventLabel = "") {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "GA4event",
      "ga4-event-name": "cro_event",
      "ga4-event-p1-name": "event_category",
      "ga4-event-p1-value": eventName,
      "ga4-event-p2-name": "event_label",
      "ga4-event-p2-value": eventLabel,
    });
  }

  function getGeoEvent() {
    return window.dataLayer?.find(d => d.event === "ketchGeoip")
  }

  function waitForGeo(callback, timeout = 3000) {
    const start = Date.now();

    (function check() {
      const geo = getGeoEvent();
      if (geo) {
        callback(geo);
        return;
      }

      if (Date.now() - start > timeout) {
        console.warn(TEST_ID + ": Geo not found, running normally");
        callback(null);
        return;
      }
      setTimeout(check, 50)
    })();
  }

  function mainJs() {
    //Tracker
    document.addEventListener("click", (e) => {
      const el = e.target;
      if (el.closest(".affirm-modal-trigger")) {
        fireGA4Event("PCR38_AffirmClick", "affirm")
      }
    })
  }

  waitForGeo(function (geo) {
    if (
      geo &&
      geo.countryCode === "US" &&
      geo.regionCode === "NJ"
    ) {
      console.log(TEST_ID + ": Excluded (New Jersey)");
      return; // STOP CAMPAIGN
    }

    waitForElem("body", mainJs);
  })
})();
