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

  function poll(t, i, o = false, e = 1e4, a = 25) { e < 0 || (t() ? i() : setTimeout(() => { poll(t, i, o, o ? e : e - a, a); }, a)); }

  function mainJs() {
    poll(
      () => document.querySelector(".search-result-content.search-result-items"),
      () => {
        const grid = document.querySelector(".search-result-content.search-result-items");
        const parentMain = document.getElementById("main");
        if (!grid) return;


        const bannerImage =
          "https://www.rimowa.com/on/demandware.static/-/Sites-rimowa-storefront-final/default/dwbebe41fe/images/category_hero_desktop_3x1/PLP_H1_DESKTOP_CLASSICPLP_08012026.jpg";
        const bannerAlt = "Collection de valises Classic";

        let observer = null;

        function injectBanner() {
          setTimeout(() => {
            const newGrid = document.querySelector(".search-result-content.search-result-items");
            const allTiles = Array.from(newGrid.querySelectorAll(".grid-tile"));
            const tiles = allTiles.filter((t) =>
              !t.classList.contains("banner-section")
            );
            const existingBanner = newGrid.querySelector(".banner-section");
            if (observer) observer.disconnect();
            // Inject after 4th tile
            if (tiles.length >= 4) {
              if (existingBanner) existingBanner.remove();

              const banner = `
              <div class="grid-tile banner-section">
                <img class="banner-image" src="${bannerImage}" alt="${bannerAlt}" />
              </div>
            `;
              tiles[3].insertAdjacentHTML("afterend", banner);
            } else {

              if (existingBanner) existingBanner.remove();
              const banner = `
              <div class="grid-tile banner-section">
                <img class="banner-image" src="${bannerImage}" alt="${bannerAlt}" />
              </div>
            `;
              tiles[tiles.length - 1].insertAdjacentHTML("afterend", banner);
            }
            observer.observe(parentMain, {
              childList: true,
            });
          }, 1000);
        }

        // Initial run
        injectBanner();

        // Observe tile changes
        observer = new MutationObserver(() => {
          injectBanner();
        });

        observer.observe(parentMain, {
          childList: true,
        });
      }
    );
  }



  waitForElem("body", mainJs);
})();
