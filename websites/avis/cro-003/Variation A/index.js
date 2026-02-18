(function () {

  // --- CONFIGURATION VARIABLES ---
  var mvtID = 'MVT-308';
  var pagePaths = ['/en/reservation/protectioncoverage'];
  var waitElem = '[data-testid="ancillaries-bundle"]';
  var intervalTime = 100;
  var maxWaitTime = 10000;

  // --- SAFE PATH CHECK (SPA Friendly) ---
  function isValidPage() {
    return pagePaths.some(function (path) {
      return window.location.pathname.indexOf(path) !== -1;
    });
  }

  // --- SAFE SESSION STORAGE CHECK ---
  function checkIsAvisFirst() {
    var sessionState = sessionStorage.getItem("reservation.store");
    if (!sessionState) return false;

    try {
      var reservationStore = JSON.parse(sessionState);
      return reservationStore?.state?.isAvisFirst === true;
    } catch (e) {
      return false;
    }
  }

  // --- MAIN LOGIC ---
  function applyCode() {
    if (checkIsAvisFirst()) {
      var targetElem = document.querySelector('[data-testid="avis-first-long-logo"]').nextSibling;;
      if (targetElem) {
        targetElem.innerText = "Avoid unexpected costs with our protection packages."
      }
    } else {
      var targetElem = document.querySelector('[data-testid="Protections-container"] h4');
      if (targetElem) {
        targetElem.innerText = "Avoid unexpected costs with our protection packages."
      }
    }
  }

  // --- ELEMENT POLLING ---
  function startElementPolling() {
    var startTime = Date.now();

    var interval = setInterval(function () {

      if (Date.now() - startTime > maxWaitTime) {
        clearInterval(interval);
        return;
      }

      if (window.jQuery) {
        var $element = jQuery(waitElem);

        if ($element.length > 0) {
          clearInterval(interval);
          applyCode();
        }
      }

    }, intervalTime);
  }

  // --- ROUTE WATCHER (Fixes First Load Issue) ---
  var routeInterval = setInterval(function () {

    if (isValidPage()) {

      if (!document.body.classList.contains(mvtID)) {

        document.body.classList.add(mvtID);
        console.log("MVT-308 initialized on:", window.location.pathname);

        startElementPolling();
      }

      clearInterval(routeInterval);
    }

  }, 100);

})();
