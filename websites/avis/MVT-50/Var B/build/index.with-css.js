(function () {
  var interval = setInterval(function () {
    if (document.head) {
      // Check if <head> exists
      clearInterval(interval); // Stop checking once found
      var style = document.createElement("style");
      style.innerHTML = ``;
      document.head.appendChild(style);
      setTimeout(() => {
        clearInterval(interval); // Clear the interval after 5 seconds
      }, 5000);
    }
  }, 100); // Check every 100ms for <head>
})();
(() => {
  const TEST_ID = "MVT-50";
  const VAR_ID = "Var B";
  const TARGET_PATH = "/reservation/review-and-book";

  // ── UTILITIES (do not edit) ──────────────────────────────────────────────────
  function waitForElem(selector, callback, opts) {
    opts = opts || {};
    var timeout = typeof opts.timeout === "number" ? opts.timeout : 10000;
    var minElements =
      typeof opts.minElements === "number" ? opts.minElements : 1;
    var all = opts.all === true;

    function getMatch() {
      var els = document.querySelectorAll(selector);
      return els.length >= minElements ? els : null;
    }

    function resolve(els) {
      callback(all ? els : els[0]);
    }

    var initial = getMatch();
    if (initial) {
      resolve(initial);
      return;
    }

    var done = false;
    var observer = new MutationObserver(function () {
      if (done) return;
      var found = getMatch();
      if (found) {
        done = true;
        observer.disconnect();
        clearTimeout(timer);
        resolve(found);
      }
    });
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });

    var timer = setTimeout(function () {
      if (!done) {
        done = true;
        observer.disconnect();
        // Timed out — element never appeared.
      }
    }, timeout);
  }

  // ── TEST LOGIC (edit per variation) ─────────────────────────────────────
  function runTest() {
    if (document.body.getAttribute("data-" + TEST_ID) === VAR_ID) return;
    document.body.setAttribute("data-" + TEST_ID, VAR_ID);

    // -- test code here --
    waitForElem('[data-testid="rc-timer-label"]', () => {
      const timerText = document.querySelector(
        '[data-testid="rc-timer-label"]',
      );
      timerText.innerText = "Your car will be released if time runs out.";
    });
  }

  function onRouteChange() {
    var path = window.location.pathname;
    if (path.indexOf(TARGET_PATH) === -1) {
      if (document.body) {
        document.body.removeAttribute("data-" + TEST_ID);
      }
      return;
    }

    runTest();
  }

  // Patch pushState / replaceState so SPA navigations fire our handler.
  (function patchHistory() {
    ["pushState", "replaceState"].forEach(function (method) {
      var original = history[method];
      history[method] = function () {
        var result = original.apply(this, arguments);
        window.dispatchEvent(new Event("spa:routechange"));
        return result;
      };
    });
  })();

  window.addEventListener("popstate", function () {
    window.dispatchEvent(new Event("spa:routechange"));
  });
  window.addEventListener("spa:routechange", onRouteChange);
  onRouteChange();
})();
