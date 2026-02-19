(function () {
  var interval = setInterval(function () {
    if (document.head) {
      // Check if <head> exists
      clearInterval(interval); // Stop checking once found
      var style = document.createElement("style");
      style.innerHTML = `[data-testid="ancillaries-bundle"][data-code="No Protection"] {
  display: none !important;
}

[data-testid="ancillaries-bundles-container"] {
  grid-template-columns: repeat(3, 1fr) !important;
}

.opt-out-section {
  border-top: 1px solid rgba(0, 0, 0, 0.12);
  margin: 0 56px;
  padding: 56px 0;
}

.opt-out-section h4 {
  font-family: AvisHeadline, "AvisHeadline Fallback", sans-serif;
  font-size: 36px;
  line-height: 36px;
  margin: 0 0 8px 0;
  text-align: center;
  text-transform: uppercase;
}

.opt-out-section span {
  color: rgb(82, 77, 77);
  display: block;
  margin: 0 auto 40px auto;
  max-width: 700px;
  text-align: center;
  text-wrap: balance;
}

.decline-option {
  display: flex;
  justify-content: center;
}

.decline-option label {
  background: #fff;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  gap: 16px;
  outline: #91001d solid 2px;
  padding: 24px;
}

.decline-option label input {
  opacity: 0;
  position: absolute;
  width: 0;
  height: 0;
}

.decline-option label span.checkbox {
  align-items: center;
  background: #fff;
  border: 1px solid #000;
  display: inline-flex;
  justify-content: center;
  min-width: 24px;
  width: 24px;
  height: 24px;
  margin: 0;
}

.decline-option label span svg {
  width: 16px;
  height: 16px;
}

.decline-option label:has(input:checked) .checkbox {
  background: #000;
}

.decline-option label:has(input:checked) .checkbox path {
  stroke: #fff;
}

@media (max-width: 768px) {
  .opt-out-section {
    margin: 0 16px;
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
(function () {
  (function (history) {
    var pushState = history.pushState;
    history.pushState = function () {
      pushState.apply(history, arguments);
      window.dispatchEvent(new Event("locationchange"));
    };

    var replaceState = history.replaceState;
    history.replaceState = function () {
      replaceState.apply(history, arguments);
      window.dispatchEvent(new Event("locationchange"));
    };

    window.addEventListener("popstate", function () {
      window.dispatchEvent(new Event("locationchange"));
    });
  })(window.history);

  function poll(t, i, o, e, a) {
    if (o === void 0) {
      o = false;
    }
    if (e === void 0) {
      e = 10000;
    }
    if (a === void 0) {
      a = 25;
    }
    if (e < 0) return;
    if (t()) return i();
    setTimeout(function () {
      poll(t, i, o, o ? e : e - a, a);
    }, a);
  }

  var mvtID = "MVT-307";

  var optOutSection =
    '<div class="opt-out-section" id="avis-opt-out-container-control">' +
    "    <h4>Continue without protection</h4>" +
    "    <span>This rental may not be fully covered by your insurance or credit card. Without protection, you remain responsible for any rental vehicle damage, theft, or loss, and third-party claims. </span>" +
    '    <div class="decline-option" id="avis-opt-out-option-control">' +
    '      <label id="decline-protection-label-control">' +
    '        <input type="checkbox" name="decline-protection">' +
    '        <span class="checkbox">' +
    '          <svg focusable="false" aria-hidden="true" viewBox="0 0 11 9">' +
    '            <path d="M1 4L4 7L10 1" stroke-linecap="round" fill="none"></path>' +
    "          </svg>" +
    "        </span>" +
    "        I accept responsibility for damage to and loss/theft of the vehicle and third-party claims." +
    "      </label>" +
    "    </div>" +
    "  </div>";

  function isProtectionPage() {
    return location.pathname.indexOf("/reservation/protectioncoverage") !== -1;
  }

  function injectOptOut() {
    poll(
      function () {
        return (
          document.querySelector(
            '[data-testid="single-protections-list-section-container"]',
          ) && !document.querySelector("#avis-opt-out-container-control")
        );
      },
      function () {
        var targetSection = document.querySelector(
          '[data-testid="single-protections-list-section-container"]',
        );
        targetSection.insertAdjacentHTML("afterend", optOutSection);

        var noProtectionEl = document.querySelector(
          '[data-testid="ancillaries-bundle"][data-code="No Protection"]',
        );
        var declineProtectionLabel = document.getElementById(
          "decline-protection-label-control",
        );

        declineProtectionLabel.addEventListener("click", function () {
          if (noProtectionEl) noProtectionEl.click();
          setTimeout(checkState, 100);
        });

        // identify continue CTA and set up observers after injection
        var contCta = $('button[data-testid="action-footer-cta-button"]');

        // run on load
        setTimeout(checkState, 500);

        // watch CTA button attribute changes
        if (contCta.length > 0) {
          var ctaObserver = new MutationObserver(function () {
            checkState();
          });
          ctaObserver.observe(contCta[0], {
            attributes: true,
            childList: false,
            subtree: false,
          });
        }

        // re-run checkState on any relevant interaction
        $(document).on(
          "click",
          '[data-testid="ancillaries-bundle"], [data-testid="single-protections-item-add-to-trip-btn"], #avis-opt-out-option-control',
          function () {
            setTimeout(checkState, 200);
          },
        );
      },
    );
  }

  function checkState() {
    // check for active bundle (paid, not "No Protection")
    var activeBundle =
      $(".ancillaries-bundle--selected").not('[data-code="No Protection"]')
        .length > 0;

    // check for active individual items
    var activeItems =
      $(
        'div[data-testid="single-protections-item-add-to-trip-btn"] input:checked',
      ).length > 0;

    // check for included items
    var includedItems =
      $(
        'span[data-testid="single-protections-item-included-in-bundle"]',
      ).filter(function () {
        return $(this).text() === "Included";
      }).length > 0;

    // check if decline checkbox is checked
    var declineChecked = $(
      '#avis-opt-out-option-control input[type="checkbox"]',
    ).is(":checked");

    // enable CTA if any selection made
    var shouldEnable =
      activeBundle || activeItems || includedItems || declineChecked;
    // hide opt-out section if a paid protection or individual item is active
    var shouldHide = activeBundle || activeItems || includedItems;

    var contCta = $('button[data-testid="action-footer-cta-button"]');
    var isDisabled = contCta.is(":disabled");

    if (shouldEnable && isDisabled) {
      contCta.removeAttr("disabled");
    } else if (!shouldEnable && !isDisabled) {
      contCta.attr("disabled", "");
    }

    if (shouldHide) {
      $("#avis-opt-out-container-control").slideUp();
      $('#avis-opt-out-option-control input[type="checkbox"]').prop(
        "checked",
        false,
      );
    } else {
      $("#avis-opt-out-container-control").slideDown();
    }

    if (activeBundle) {
      $("body").addClass("bundle-active");
    } else {
      $("body").removeClass("bundle-active");
    }
  }

  function handlePageChange() {
    if (isProtectionPage()) {
      injectOptOut();
    }
  }

  function observeDOM() {
    var debounceTimer = null;
    var observer = new MutationObserver(function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function () {
        handlePageChange();
      }, 50);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  window.addEventListener("locationchange", handlePageChange);

  console.log(mvtID);
  handlePageChange();
  observeDOM();
})();
