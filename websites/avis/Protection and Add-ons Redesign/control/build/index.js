(function () {
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

  var optOutSectin =
    '<div class="opt-out-section" id="opt-out-section">' +
    "    <h4>Continue without protection</h4>" +
    "    <span>This rental may not be fully covered by your insurance or credit card. Without protection, you remain responsible for any rental vehicle damage, theft, or loss, and third-party claims. </span>" +
    '    <div class="decline-option">' +
    '      <label id="decline-protection-label">' +
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

  function mainJs() {
    poll(
      function () {
        return (
          document.querySelector(
            '[data-testid="single-protections-list-section-container"]',
          ) && !document.querySelector(".opt-out-section")
        );
      },
      function () {
        var targetSection = document.querySelector(
          '[data-testid="single-protections-list-section-container"]',
        );
        targetSection.insertAdjacentHTML("afterend", optOutSectin);
        var noProtectionEl = document.querySelector(
          '[data-testid="ancillaries-bundle"][data-code="No Protection"]',
        );
        var declineProtectionLabel = document.getElementById(
          "decline-protection-label",
        );
        declineProtectionLabel.addEventListener("click", function (e) {
          if (e.target.tagName !== "INPUT") {
            e.preventDefault();
          }
          if (noProtectionEl) {
            var isSelected = noProtectionEl.classList.contains(
              "ancillaries-bundle--selected",
            );

            // Toggle logic: Click to select/deselect
            var event = new MouseEvent("click", {
              view: window,
              bubbles: true,
              cancelable: true,
            });
            noProtectionEl.dispatchEvent(event);

            // Force update if deselect failed (Radio behavior fallback)
            if (isSelected) {
              setTimeout(function () {
                // If still selected, assume radio behavior and force deselect logic for UI sync
                if (
                  noProtectionEl.classList.contains(
                    "ancillaries-bundle--selected",
                  )
                ) {
                  noProtectionEl.classList.remove(
                    "ancillaries-bundle--selected",
                  );
                  // Trigger update
                  checkState();
                }
              }, 50);
            }
          }
        });
      },
    );
  }

  function observerReact() {
    var observer = new MutationObserver(function () {
      if (
        document.querySelector(
          '[data-testid="single-protections-list-section-container"]',
        ) &&
        !document.querySelector(".opt-out-section")
      ) {
        mainJs();
      }
      checkState();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  function checkState() {
    if (window.jQuery) {
      // Logic for Visibility (excludes 'No Protection')
      var paidBundle =
        $(".ancillaries-bundle--selected").not('[data-code="No Protection"]')
          .length > 0;

      // Sync Opt-Out Checkbox with No Protection Selection State
      var isNoProtectionSelected =
        $('.ancillaries-bundle--selected[data-code="No Protection"]').length >
        0;
      $("#decline-protection-label input").prop(
        "checked",
        isNoProtectionSelected,
      );

      // Use Checkbox State for Button Logic (User Request)
      var declineChecked = $(
        '#decline-protection-label input[type="checkbox"]',
      ).is(":checked");
      $(".ancillaries-bundle--selected").length > 0; // Keeping for fallback/completeness
      var activeItems =
        $(
          'div[data-testid="single-protections-item-add-to-trip-btn"] input:checked',
        ).length > 0;

      var contCta = $('button[data-testid="action-footer-cta-button"]');
      var isDisabled = contCta.is(":disabled");

      // Enable button if Paid Bundle OR Active Items OR User Opted Out (Checkbox Checked)
      // Note: 'anyBundle' logic is effectively (paidBundle || isNoProtectionSelected), but relying on 'declineChecked' handles the UI intent directly.
      var shouldEnable = paidBundle || activeItems || declineChecked;

      if (shouldEnable && isDisabled) {
        contCta.removeAttr("disabled");
      } else if (!shouldEnable && !isDisabled) {
        contCta.attr("disabled", "");
      }

      if (paidBundle || activeItems) {
        $("#opt-out-section").hide();
      } else {
        $("#opt-out-section").show();
      }
    }
  }

  function init() {
    mainJs();
    observerReact();
    poll(
      function () {
        return window.jQuery;
      },
      function () {
        checkState();
      },
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
