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
