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
  function waitForElem(
    waitFor,
    callback,
    minElements = 1,
    isVariable = false,
    timer = 10000,
    frequency = 25,
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
              timer - frequency,
            ),
          frequency,
        );
  }

  function poll(t, i, o, e, a) {
    o = o || false;
    e = e || 10000;
    a = a || 25;
    e < 0 ||
      (t()
        ? i()
        : setTimeout(function () {
            poll(t, i, o, o ? e : e - a, a);
          }, a));
  }

  // My Account Quick Link
  poll(
    () =>
      document.querySelector(".cmp-tilelink__list li:nth-child(5) > a")
        .innerText === "My Account",
    () => {
      var myAccountLink = document.querySelector(
        ".cmp-tilelink__list li:nth-child(5) > a",
      );
      myAccountLink.addEventListener("click", function () {
        utag.link({
          event_name: "target_track-e182-2606_qlLogin",
        });
      });
    },
  );
  // Help section 'My Account'
  poll(
    () =>
      document
        .querySelectorAll(".cmp-tilelink__list")[1]
        .querySelector(".cmp-tilelink__list li:nth-child(1) > a").innerText,
    () => {
      var myAccountLink = document
        .querySelectorAll(".cmp-tilelink__list")[1]
        .querySelector(".cmp-tilelink__list li:nth-child(1) > a");
      myAccountLink.addEventListener("click", function () {
        utag.link({
          event_name: "target_track-e182-2606_helpLogin",
        });
      });
    },
  );

  function isUpgradeQuickLink(el) {
    var item = el.closest(".cmp-tilelink__item");
    if (item && item.querySelector(".icon-upgrade")) {
      return item;
    }
    return false;
  }

  function mainJs() {
    poll(
      function () {
        return document.body;
      },
      function () {
        if (document.body.getAttribute("data-upgrade-delegation-bound")) return;
        document.body.setAttribute("data-upgrade-delegation-bound", "true");

        // ---------- HELPERS ----------
        function hasText(el, text) {
          return el && el.innerText === text;
        }

        function safeClosest(target, selector) {
          return target && target.closest ? target.closest(selector) : null;
        }

        // ---------- EVENT DELEGATION ----------
        document.body.addEventListener(
          "click",
          function (e) {
            var target = e.target;

            // NAVBAR LOGIN TEXT
            var navbarLogin = safeClosest(
              target,
              ".header.links .authorization-link a",
            );

            // NAVBAR MY ACCOUNT ICON
            var navbarAccountIcon = safeClosest(
              target,
              ".header.links > li:first-child > a",
            );

            // QUICK LINKS
            var quickLinkUpgrade = isUpgradeQuickLink(target);

            // SIDEBAR LOGIN BUTTON
            var sidebarLoginBtn = safeClosest(target, ".action.login");

            // MOBILE NAVBAR MY ACCOUNT ICON
            var mobileNavbarAccountIcon = safeClosest(target, ".my-account");

            // FOOTER UPGRADE LINK
            var footerLink = safeClosest(
              target,
              ".link-body > ul > li:last-child a",
            );
            var footerUpgradeEl = hasText(footerLink, "Upgrades");

            // MEGA MENU → UPGRADE OPTIONS
            var megaMenuEl = safeClosest(
              target,
              ".main-menu-custom__inner-list .main-menu-custom__inner-item > a",
            );
            var megaMenuUpgradeOpt = hasText(megaMenuEl, "Upgrade Options");

            // ---------- TRACKING LOGIC ----------
            if (
              navbarLogin ||
              navbarAccountIcon ||
              mobileNavbarAccountIcon ||
              sidebarLoginBtn
            ) {
              utag.link({
                event_name: "target_track-e182-2606_headerLogin",
              });
              return;
            }

            if (quickLinkUpgrade) {
              utag.link({
                event_name: "target_track-e182-2606_qlUpgradeLogin",
              });
              return;
            }

            if (footerUpgradeEl) {
              utag.link({
                event_name: "target_track-e182-2606_footerLogin",
              });
              return;
            }

            if (megaMenuUpgradeOpt) {
              utag.link({
                event_name: "target_track-e182-2606_menuLogin",
              });
            }
          },
          true,
        );
      },
    );

    poll(
      function () {
        return document.querySelector(
          ".main-menu-custom__inner-list > li:nth-child(2) > ul > li:nth-child(3)",
        );
      },
      function () {
        var targetUpgradeItem = document.querySelector(
          ".main-menu-custom__inner-list > li:nth-child(2) > ul > li:nth-child(3) > a",
        );
        if (targetUpgradeItem.getAttribute("data-listener-attached")) return;
        targetUpgradeItem.setAttribute("data-listener-attached", "true");
        targetUpgradeItem.addEventListener("click", function () {
          utag.link({ event_name: "target_track-e182-2606_menuLogin" });
        });
      },
    );
  }

  waitForElem("body", mainJs);
})();
