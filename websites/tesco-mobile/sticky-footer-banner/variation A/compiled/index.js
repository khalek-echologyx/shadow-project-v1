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

  function setCookie(name, value, days) {
    var expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + value + ";expires=" + expires.toUTCString() + ";path=/";
  }
  function deleteCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }

  function stickyFooterBanner() {
    return (
      '<div class="sticky-footer-banner">' +
      '<div class="sticky-footer-banner__content">' +
      '<h4 class="sticky-footer-banner__content__text">' +
      '<p class="title">Have an account?</p>' +
      '<a href="/customer/account/login">Log in</a>' +
      '<p class="subtitle">to upgrade or add a new contract.</p>' +
      '</h4>' +
      '<div>' +
      '<div class="sticky-footer-banner__content__close">' +
      '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">' +
      '<path d="M14 15.0607L7.53033 8.59099L1.06066 15.0607L0 14L6.46967 7.53033L0 1.06066L1.06066 0L7.53033 6.46967L14 0L15.0607 1.06066L8.59099 7.53033L15.0607 14L14 15.0607Z" fill="#00539F"/>' +
      '</svg>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</div>'
    );
  }

  function mainJs(args) {
    var body = args[0];
    body.insertAdjacentHTML("beforeend", stickyFooterBanner());

    poll(function () {
      return document.querySelector(".sticky-footer-banner__content__close");
    }, function () {
      var closeBtn = document.querySelector(".sticky-footer-banner__content__close > svg");
      var stickyFooterBannerElem = document.querySelector(".sticky-footer-banner");
      closeBtn.addEventListener("click", function () {
        stickyFooterBannerElem.style.display = "none";
      });
    });

    poll(function () {
      return document.querySelector(".sticky-footer-banner__content__text a");
    }, function () {
      var loginLink = document.querySelector(".sticky-footer-banner__content__text a");
      loginLink.addEventListener("click", function () {
        setCookie("upgradeClicked", "true", 1);
        utag.link({ event_name: "target_track-e182-2606_banNonAuthLogin" });
      });
    });

    // Helper to replace Array.find
    function findInNodeList(selector, predicate) {
      var elements = document.querySelectorAll(selector);
      for (var i = 0; i < elements.length; i++) {
        if (predicate(elements[i])) {
          return elements[i];
        }
      }
      return null;
    }

    poll(
      function () {
        return findInNodeList(".link-body a", function (link) {
          return (link.textContent || link.innerText).trim() === "Upgrades";
        });
      },
      function () {
        var upgradesLink = findInNodeList(".link-body a", function (link) {
          return (link.textContent || link.innerText).trim() === "Upgrades";
        });

        if (!upgradesLink) return;

        // Prevent duplicate listener
        if (upgradesLink.getAttribute("data-upgrade-click-bound")) return;
        upgradesLink.setAttribute("data-upgrade-click-bound", "true");

        upgradesLink.addEventListener("click", function () {
          setCookie("upgradeClicked", "true", 1);
          utag.link({ event_name: "target_track-e182-2606_footerLogin" });
        });
      }
    );

    // My Account Quick Link
    poll(
      () => document.querySelector(".cmp-tilelink__list li:nth-child(5) > a").innerText === "My Account",
      () => {
        var myAccountLink = document.querySelector(".cmp-tilelink__list li:nth-child(5) > a");
        myAccountLink.addEventListener("click", function () {
          utag.link({
            event_name: "target_track-e182-2606_qlLogin",
          });
          deleteCookie("upgradeClicked");
        });
      }
    );

    // Help section 'My Account' 
  poll(
    () => document.querySelectorAll(".cmp-tilelink__list")[1].querySelector(".cmp-tilelink__list li:nth-child(1) > a").innerText,
    () => {
      var myAccountLink = document.querySelectorAll(".cmp-tilelink__list")[1].querySelector(".cmp-tilelink__list li:nth-child(1) > a");
      myAccountLink.addEventListener("click", function () {
        utag.link({
          event_name: "target_track-e182-2606_helpLogin",
        });
      });
    }
  ); 

    // Upgrade Quick Link
    function isUpgradeQuickLink(el) {
      var item = el.closest(".cmp-tilelink__item");
      if (item && item.querySelector(".icon-upgrade")) {
        return item;
      }
      return false;
    }

    poll(
      function () {
        return document.body;
      },
      function () {
        if (document.body.getAttribute("data-upgrade-delegation-bound")) return;
        document.body.setAttribute("data-upgrade-delegation-bound", "true");

        // ---------- HELPERS ----------
        function safeClosest(target, selector) {
          return target && target.closest ? target.closest(selector) : null;
        }

        function hasText(el, text) {
          return el && el.innerText === text;
        }

        // ---------- EVENT ----------
        document.body.addEventListener(
          "click",
          function (e) {
            var target = e.target;

            // NAVBAR LOGIN TEXT
            var navbarLogin = safeClosest(
              target,
              ".header.links .authorization-link a"
            );

            // NAVBAR MY ACCOUNT ICON
            var navbarAccountIcon = safeClosest(
              target,
              ".header.links > li:first-child > a"
            );

            // QUICK LINKS
            var quickLinkUpgrade = isUpgradeQuickLink(target);

            // SIDEBAR LOGIN BUTTON
            var sidebarLoginBtn = safeClosest(target, ".action.login");

            // MOBILE NAVBAR MY ACCOUNT ICON
            var mobileNavbarAccountIcon = safeClosest(target, ".my-account");

            // MEGA MENU → UPGRADE OPTIONS
            var megaMenuEl = safeClosest(
              target,
              ".main-menu-custom__inner-list .main-menu-custom__inner-item > a"
            );
            var megaMenuUpgradeOpt = hasText(megaMenuEl, "Upgrade Options");

            // ---------- LOGIC ----------
            if (
              navbarLogin ||
              navbarAccountIcon ||
              mobileNavbarAccountIcon ||
              sidebarLoginBtn
            ) {
              utag.link({
                event_name: "target_track-e182-2606_headerLogin",
              });
              deleteCookie("upgradeClicked");
              return;
            }

            if (quickLinkUpgrade) {
              setCookie("upgradeClicked", "true", 1);
              utag.link({
                event_name: "target_track-e182-2606_qlUpgradeLogin",
              });
              return;
            }

            if (megaMenuUpgradeOpt) {
              utag.link({
                event_name: "target_track-e182-2606_menuLogin",
              });
              setCookie("upgradeClicked", "true", 1);
            }
          },
          true
        );
      }
    );

  }

  waitForElem("body", mainJs);
})();
