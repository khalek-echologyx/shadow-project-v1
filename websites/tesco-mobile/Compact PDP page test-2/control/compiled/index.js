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

  function mainJs([body]) {
    body.addEventListener("click", function (e) {
      var target = e.target;
      if (!target) return;

      // -----------------------------
      // Payment selection tracking
      // -----------------------------
      if (target.classList.contains("pay-monthly")) {
        utag.link({
          event_name: "target_track-e224-2163_paymentSelection_payMonthly",
        });
      }

      if (target.classList.contains("pay-as-you-go")) {
        utag.link({
          event_name: "target_track-e224-2163_paymentSelection_payG",
        });
      }

      if (target.classList.contains("sim-free")) {
        utag.link({
          event_name: "target_track-e224-2163_paymentSelection_SIMFREE",
        });
      }

      // -----------------------------
      // Colour / Storage swatch tracking
      // -----------------------------
      var swatchOption = target.closest(".swatch-option");

      if (swatchOption) {
        var swatchAttribute = swatchOption.closest(".swatch-attribute");
        if (!swatchAttribute) return;

        var labelEl = swatchAttribute.querySelector(".swatch-attribute-label");
        if (!labelEl) return;

        var attributeName = labelEl.textContent.trim().toLowerCase();

        var valueEl = swatchOption.querySelector("span[data-bind]");
        var selectedValue = valueEl ? valueEl.textContent.trim() : "";

        if (attributeName === "colour") {
          utag.link({
            event_name: "target_track-e224-2163_colourSelection",
            colour_selected: selectedValue
          });
        }

        if (attributeName === "storage") {
          utag.link({
            event_name: "target_track-e224-2163_storageSelection",
            storage_selected: selectedValue
          });
        }
      }

      // -----------------------------
      // Add to Tariff button tracking (NOW WORKS)
      // -----------------------------
      if (target.closest(".field.choice.visible")) {
        utag.link({
          event_name: "target_track-e224-2163_tariffSelection",
        });
      }
    });

  }

  waitForElem("body", mainJs);
})();
