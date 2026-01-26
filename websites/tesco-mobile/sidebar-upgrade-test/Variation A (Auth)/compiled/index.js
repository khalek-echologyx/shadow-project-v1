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
    function upgreadeLinkSection() {
      return `
      <li class="upgrade-link">
        <span>You’re free to upgrade today. To upgrade or buy an additional plan.</span>
        <a href="https://www.tescomobile.com/customer/account/upgrades">Upgrade now</a>
      </li>
      `
    }
    poll(
      () => document.querySelector(".account-links .logout-section"),
      () => {
        var targetUserinSection = document.querySelector(".account-links .logout-section");
        targetUserinSection.classList.add("upgrade-link-added");
        targetUserinSection.insertAdjacentHTML("afterend", upgreadeLinkSection());
        var upgradeLink = document.querySelector(".upgrade-link a");
        upgradeLink.addEventListener("click", function () {
          utag.link({
            event_name: "target_track-e241-2607_upgradeCta",
          });
        });
      }
    );

    //MEGA MENU UPGREADE OPTIONS
    poll(
      function () {
        return document.querySelector(
          '.main-menu-custom.navigation > ul > li:first-child'
        );
      },
      function () {
        var container = document.querySelector(
          '.main-menu-custom.navigation > ul > li:first-child'
        );
        var links = container.getElementsByTagName('a');

        for (var i = 0; i < links.length; i++) {
          if (links[i].textContent.trim() === 'Upgrade Options') {
            var upgradeLink = links[i];

            // change href
            upgradeLink.setAttribute('href', '/customer/account/upgrades/');

            // add click listener (only once)
            if (!upgradeLink.__clickBound) {
              upgradeLink.addEventListener('click', function (e) {
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
