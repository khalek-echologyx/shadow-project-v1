
(function () {
  function waitForElem(
    waitFor,
    callback,
    minElements,
    isVariable,
    timer,
    frequency
  ) {
    minElements = minElements || 1;
    isVariable = isVariable || false;
    timer = timer || 10000;
    frequency = frequency || 25;

    var elements = isVariable ?
      window[waitFor] :
      document.querySelectorAll(waitFor);
    if (timer <= 0) return;
    (!isVariable && elements.length >= minElements) ||
      (isVariable && typeof window[waitFor] !== "undefined") ?
      callback(elements) :
      setTimeout(
        function () {
          waitForElem(
            waitFor,
            callback,
            minElements,
            isVariable,
            timer - frequency,
            frequency
          );
        },
        frequency
      );
  }

  function poll(t, i, o, e, a) {
    o = o || false;
    e = e || 10000;
    a = a || 25;
    e < 0 ||
      (t() ?
        i() :
        setTimeout(function () {
          poll(t, i, o, o ? e : e - a, a);
        }, a));
  }
  

  function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  function deleteCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }

  function showRedirectOverlay() {
  if (document.getElementById("upgrade-redirect-overlay")) return;

  document.documentElement.style.overflow = "hidden";
  document.body.style.overflow = "hidden";

  var overlay =
    '<div id="upgrade-redirect-overlay" class="loading-mask" data-role="loader">' +
      '<div class="loader">' +
        '<img alt="Loading..." src="https://www.tescomobile.com/static/version1768458070/frontend/TescoMobile/default/en_GB/images/loader-2.gif">' +
        '<p>Redirecting to upgrade page...</p>' +
      '</div>' +
    '</div>';

  document.body.insertAdjacentHTML("beforeend", overlay);
}


  function removeRedirectOverlay() {
    var overlay = document.getElementById("upgrade-redirect-overlay");
    if (overlay) overlay.remove();
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
  }

  function mainJs() {
    poll(
      function () {
        return document.body;
      },
      function () {
        var currentPath = window.location.pathname;
        var upgradeClicked = getCookie("upgradeClicked") === "true";

        if (currentPath === "/customer/account/upgrades" || currentPath === "/customer/account/upgrades/") {
          deleteCookie("upgradeClicked");
          removeRedirectOverlay();
          return;
        }

        if (upgradeClicked && (currentPath === "/customer/account/index/" || currentPath === "/customer/account/index" || currentPath === "/customer/account/" || currentPath === "/customer/account")) {
          showRedirectOverlay();
          window.location.assign("/customer/account/upgrades");
        }
      }
    );
  }

  waitForElem("body", mainJs);
})();