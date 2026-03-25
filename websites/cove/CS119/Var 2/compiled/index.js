(() => {
  const TEST_ID = "CS119";
  const VARIANT_ID = "V1";

  function logInfo(message) {
    console.log(
      `%cAcadia%c${TEST_ID}-${VARIANT_ID}`,
      "color: white; background: rgb(0, 0, 57); font-weight: 700; padding: 2px 4px; border-radius: 2px;",
      "margin-left: 8px; color: white; background: rgb(0, 57, 57); font-weight: 700; padding: 2px 4px; border-radius: 2px;",
      message
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

  function poll(t, i, o = false, e = 10000, a = 25) {
    e < 0 ||
      (t()
        ? i()
        : setTimeout(() => {
          poll(t, i, o, o ? e : e - a, a);
        }, a));
  }

  function mainJs() {
    if (document.body.classList.contains(TEST_ID)) return;
    document.body.classList.add(TEST_ID);
    poll(
      () => document.querySelectorAll("h2").length > 0,
      () => {
        const observer = new MutationObserver(() => {
          const targetH2Elements = document.querySelectorAll("h2");
          // order change targeted sections
          targetH2Elements.forEach(el => {
            if (el.textContent.trim() === "It's an easy decision.") {
              const targetParentEl = el.parentElement;
              const selectorEl = [...document.querySelectorAll("h2")].find(item => item.textContent.trim() === "Our Products").parentElement;
              const secureEl = [...document.querySelectorAll("h2")].find(item => item.textContent.trim() === "Secure your home in 3 simple steps.").parentElement.parentElement;
              if (selectorEl && selectorEl.nextElementSibling !== targetParentEl) {
                selectorEl.insertAdjacentElement("afterend", targetParentEl);
                targetParentEl.insertAdjacentElement("afterend", secureEl);
              }
            } else if (el.textContent === "Smarter cameras. Smarter protection.") {
              const smartCamSection = el.parentElement;
              const asSeenOnEl = [...document.querySelectorAll("section")].find(el => el.outerText === "As Seen On");
              if (smartCamSection && smartCamSection.nextElementSibling !== asSeenOnEl) {
                smartCamSection.insertAdjacentElement("afterend", asSeenOnEl);
              }
            }
          });
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true,
        });
      },
      false, 30000
    );


  }

  waitForElem("body", mainJs);
})();
