import testInfo from "./info.json" assert { type: "json" };

(() => {
  function waitForElem(
    waitFor,
    callback,
    minElements = 1,
    isVariable = false,
    timer = 10000,
    frequency = 25
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
            timer - frequency
          ),
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

  function mainJs() {
    function upgradeLiTag() {
      return `
        <li class="upgrade-li-added">
          <a class="action upgrade" href="https://www.tescomobile.com/customer/account/upgrades/">Upgrade</a>
        </li>
      `
    }
    poll(
      () => {
        var targetNavSectionTrigger = document.querySelector(".main-menu-custom.navigation > ul > li:first-child > a > div")
        return targetNavSectionTrigger ? targetNavSectionTrigger.innerText.trim() === "Phones" ? true : false : false
      },
      () => {
        var targetNavSection = document.querySelector(".main-menu-custom.navigation > ul > li:first-child");
        targetNavSection.insertAdjacentHTML("beforebegin", upgradeLiTag());
        var upgradeBtn = document.querySelector(".main-menu-custom.navigation .upgrade-li-added");
        upgradeBtn.addEventListener("click", function () {
          utag.link({
            event_name: "target_track-e241-2607_upgradeCta",
          });
        });
      }
    );

    poll(
      () => document.querySelector(".account-links"),
      () => {
        const targetLoginSection = document.querySelector(".account-links");

        var loginBtn = targetLoginSection.querySelector(".action.login");
        loginBtn.addEventListener("click", function () {
          utag.link({
            event_name: "target_track-e241-2607_loginCta",
          });
        });
      }
    );

    //MEGA MENU UPGREADE OPTIONS
    poll(
      function () {
        return document.querySelector(
          '.main-menu-custom.navigation > ul > li:nth-child(2)'
        );
      },
      function () {
        var container = document.querySelector(
          '.main-menu-custom.navigation > ul > li:nth-child(2)'
        );
        var links = container.getElementsByTagName('a');

        for (var i = 0; i < links.length; i++) {
          if (links[i].textContent.trim() === 'Upgrade Options') {
            var upgradeLink = links[i];

            // change href
            upgradeLink.setAttribute('href', '/customer/account/upgrades/');

            // add click listener (only once)
            if (!upgradeLink.__clickBound) {
              upgradeLink.addEventListener('click', function () {
                utag.link({
                  event_name: "target_track-e241-2607_upgradeOpt",
                });
              });

              upgradeLink.__clickBound = true;
            }

            break;
          }
        }
      },
    );
  }

  waitForElem("body", mainJs);
})();
