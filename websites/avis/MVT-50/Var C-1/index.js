(() => {
  var TEST_ID = "MVT-50";
  var TARGET_PATH = "/reservation/review-and-book";

  function poll(condition, callback, timeout, interval) {
    timeout = timeout || 10000;
    interval = interval || 50;
    var start = Date.now();
    function check() {
      if (condition()) {
        callback();
      } else if (Date.now() - start < timeout) {
        setTimeout(check, interval);
      }
    }
    check();
  }

  function applyCode() {
    if (document.body.classList.contains(TEST_ID)) return;

    poll(
      function () {
        return !!document.querySelector('[data-testid="rc-timer-label"]');
      },
      function () {
        const timerText = document.querySelector('[data-testid="rc-timer-label"]');
        timerText.innerText = "to lock in your discount — prices may change if your session expires.";
        // new text span
        const newTextSpan = '<span class="new-text">Complete within</span>';
        const wrapperEl = timerText.parentElement;
        const svgEl = wrapperEl.querySelector('svg');
        if(svgEl && !wrapperEl.querySelector(".new-text")){
          svgEl.insertAdjacentHTML('afterend', newTextSpan);
        }
        
        document.body.classList.add(TEST_ID);
      }
    );
  }


  function isTargetPage() {
    return window.location.pathname.indexOf(TARGET_PATH) !== -1;
  }

  function onRouteChange() {
    if (isTargetPage()) {
      document.body.classList.remove(TEST_ID);
      applyCode();
    }
  }

  function patchHistoryMethod(method) {
    var original = history[method];
    history[method] = function () {
      var result = original.apply(this, arguments);
      window.dispatchEvent(new Event("avis:routechange"));
      return result;
    };
  }
  patchHistoryMethod("pushState");
  patchHistoryMethod("replaceState");

  // Listen to back/forward navigation
  window.addEventListener("popstate", onRouteChange);

  // Listen to our custom route change event
  window.addEventListener("avis:routechange", onRouteChange);

  var lastPath = window.location.pathname;
  var pathObserver = new MutationObserver(function () {
    var currentPath = window.location.pathname;
    if (currentPath !== lastPath) {
      lastPath = currentPath;
      if (isTargetPage()) {
        pathObserver.disconnect();
        onRouteChange();
      }
    }
  });
  pathObserver.observe(document.body, { childList: true, subtree: false });
  onRouteChange();
})();
