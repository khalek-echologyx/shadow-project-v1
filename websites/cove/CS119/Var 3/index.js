(() => {
  const TEST_ID = "CS119";
  const VARIANT_ID = "V3";

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

  function poll(t, i, o = !1, e = 10000, a = 25) {
    e < 0 ||
      (t()
        ? i()
        : setTimeout(() => {
          poll(t, i, o, o ? e : e - a, a);
        }, a));
  }

  function mainJs() {
    if (document.body.classList.contains(TEST_ID)) return;
    document.body.classList.add(TEST_ID)
    poll(
      () => document.querySelectorAll("h2").length > 0,
      () => {
        let disconnectTimer = null;

        const scheduleDisconnect = () => {
          clearTimeout(disconnectTimer);
          disconnectTimer = setTimeout(() => {
            observer.disconnect();
            logInfo("observer disconnected after DOM settled");
          }, 10000);
        };

        const observer = new MutationObserver(() => {
          const targetH2Elements = document.querySelectorAll("h2")
          // order change targeted sections
          targetH2Elements.forEach(el => {
            if (el.textContent.trim() === "The #1 customer-rated home security system.*") {
              const targetParentEl = el.parentElement;
              const selectorEl = [...document.querySelectorAll("h2")].find(item => item.textContent.trim() === "Our Products").parentElement;
              const easyDisSection = [...document.querySelectorAll("h2")].find(item => item.textContent.trim() === "It's an easy decision.").parentElement.parentElement;
              if (selectorEl && selectorEl.nextElementSibling !== targetParentEl) {
                selectorEl.insertAdjacentElement("afterend", targetParentEl);
                targetParentEl.insertAdjacentElement("afterend", easyDisSection)
              }
            } else if (el.textContent === "Home security that’s both effective and affordable.") {
              const homeSecureEl = el.parentElement.parentElement;
              const elezabethEl = [...document.querySelectorAll("h2")].find(item => item.textContent.trim() === "Proud partner of the Elizabeth Smart Foundation").parentElement.parentElement.parentElement;
              if (homeSecureEl && elezabethEl && homeSecureEl.nextElementSibling !== elezabethEl) {
                elezabethEl.style.marginTop = "50px"
                homeSecureEl.insertAdjacentElement("afterend", elezabethEl)
                scheduleDisconnect();
              }
            } else if (el.textContent === "Monitoring you can rely on.") {
              const monitoringSection = el.parentElement.parentElement;
              monitoringSection.style.marginBottom = "75px"
            }
          })
        })

        observer.observe(document.body, {
          childList: true,
          subtree: true,
        })
      },
    )

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
                fireGA4Event("CS119_ViewBTF");
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
