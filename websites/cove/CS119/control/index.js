(() => {
  const TEST_ID = "CS119";
  const VARIANT_ID = "control";

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

  function poll(t, i, o = !1, e = 10000, a = 25) {
    e < 0 ||
      (t()
        ? i()
        : setTimeout(() => {
          poll(t, i, o, o ? e : e - a, a);
        }, a));
  }

  function fireGA4Event(eventName, eventLabel = '') {

    window.dataLayer = window.dataLayer || [];

    window.dataLayer.push({

      event: 'GA4event',

      'ga4-event-name': 'cro_event',

      'ga4-event-p1-name': 'event_category',

      'ga4-event-p1-value': eventName,

      'ga4-event-p2-name': 'event_label',

      'ga4-event-p2-value': eventLabel

    });

  }

  function mainJs([body]) {
    let hasFired = false;
    let io = null;

    poll(
      () => document.querySelectorAll("section").length > 0,
      () => {
        const attachObserver = () => {
          if (hasFired) return;

          const sections = [...document.querySelectorAll("section")];

          const targetSection = sections.find(section =>
            section.textContent.includes("Try Risk-Free")
          );

          if (!targetSection) return;

          // Disconnect old observer if exists
          if (io) io.disconnect();

          io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
                fireGA4Event("CS119_ViewBTF",);
                hasFired = true;
                io.disconnect();
              }
            });
          });

          io.observe(targetSection);
        };

        // Run initially
        attachObserver();

        // 🔥 Re-run when DOM changes (CRITICAL FIX)
        const mo = new MutationObserver(() => {
          if (!hasFired) attachObserver();
        });

        mo.observe(document.body, {
          childList: true,
          subtree: true,
        });
      }
    );
  }

  waitForElem("body", mainJs);
})();
