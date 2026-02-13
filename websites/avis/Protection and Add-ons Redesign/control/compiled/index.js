(() => {
  function poll(t, i, o = false, e = 10000, a = 25) {
    if (e < 0) return;
    if (t()) return i();
    setTimeout(() => {
      poll(t, i, o, o ? e : e - a, a);
    }, a);
  }

  var optOutSectin = `<div class="opt-out-section">
    <h4>Continue without protection</h4>
    <span>This rental may not be fully covered by your insurance or credit card. Without protection, you remain responsible for any rental vehicle damage, theft, or loss, and third-party claims. </span>
    <div class="decline-option">
      <label id="decline-protection-label">
        <input type="checkbox" name="decline-protection">
        <span class="checkbox">
          <svg focusable="false" aria-hidden="true" viewBox="0 0 11 9">
            <path d="M1 4L4 7L10 1" stroke-linecap="round" fill="none"></path>
          </svg>
        </span>
        I accept responsibility for damage to and loss/theft of the vehicle and third-party claims.
      </label>
    </div>
  </div>`;

  function mainJs() {
    poll(
      () =>
        document.querySelector('[data-testid="single-protections-list-section-container"]') &&
        !document.querySelector('.opt-out-section'),
      () => {
        var targetSection = document.querySelector('[data-testid="single-protections-list-section-container"]');
        targetSection.insertAdjacentHTML("afterend", optOutSectin);
        var noProtectionEl = document.querySelector('[data-testid="ancillaries-bundle"][data-code="No Protection"]');
        var declineProtectionLabel = document.getElementById("decline-protection-label");
        declineProtectionLabel.addEventListener("click", () => {
          noProtectionEl.click();
        });
      }
    );
  }

  function observerReact() {
    var observer = new MutationObserver(() => {
      if (!document.querySelector('.opt-out-section')) {
        mainJs();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  function init() {
    mainJs();
    observerReact();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
