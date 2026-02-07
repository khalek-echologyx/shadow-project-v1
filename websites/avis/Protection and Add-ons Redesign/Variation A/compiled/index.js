(() => {
  const EXP_ID = "avis-protection-variation-a";
  const TARGET_SELECTOR = '[data-testid="Protections-container"] > div > svg';
  var svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M19.8118 6.19684C20.0528 6.42427 20.0638 6.80401 19.8364 7.04501L9.96479 17.5055C9.72819 17.7562 9.32948 17.7564 9.09257 17.506L4.16415 12.2966C3.93641 12.0559 3.94694 11.6761 4.18766 11.4484C4.42837 11.2207 4.80812 11.2312 5.03586 11.4719L9.52788 16.22L18.9636 6.2214C19.1911 5.9804 19.5708 5.9694 19.8118 6.19684Z" fill="#4DC664" stroke="#8ACE97" stroke-linecap="round"/></svg>`;
  var infoSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24"     height="24" viewBox="0 0 24 24" fill="none">
    <path d="M4.00049 12.0001C4.00278 9.87918 4.84632 7.84576 6.34604 6.34604C7.84576 4.84632 9.87918 4.00278 12.0001 4.00049C14.121 4.00296 16.1543 4.84656 17.654 6.34624C19.1536 7.84592 19.9972 9.87923 19.9997 12.0001C19.9971 14.1209 19.1534 16.1541 17.6538 17.6538C16.1541 19.1534 14.1209 19.9971 12.0001 19.9997C9.87918 19.9974 7.84576 19.1539 6.34604 17.6542C4.84632 16.1544 4.00278 14.121 4.00049 12.0001ZM4.94177 12.0001C4.94388 13.8714 5.68822 15.6655 7.01145 16.9888C8.33469 18.312 10.1288 19.0563 12.0001 19.0584C13.8713 19.0561 15.6652 18.3117 16.9883 16.9885C18.3114 15.6653 19.0556 13.8713 19.0577 12.0001C19.0556 10.1289 18.3114 8.33491 16.9883 7.0117C15.6652 5.68848 13.8713 4.94406 12.0001 4.94177C10.1288 4.94388 8.33469 5.68822 7.01145 7.01145C5.68822 8.33469 4.94388 10.1288 4.94177 12.0001ZM11.5288 15.3866V10.4875C11.5286 10.3633 11.5776 10.2441 11.665 10.1559C11.7525 10.0677 11.8712 10.0178 11.9954 10.0169C12.1203 10.0169 12.2401 10.0664 12.3285 10.1547C12.4168 10.2429 12.4666 10.3626 12.4668 10.4875V15.3866C12.4666 15.5115 12.4168 15.6312 12.3285 15.7194C12.2401 15.8077 12.1203 15.8573 11.9954 15.8573C11.8711 15.8564 11.7522 15.8063 11.6648 15.7179C11.5773 15.6296 11.5285 15.5102 11.5288 15.3859V15.3866ZM11.2935 8.36429C11.2944 8.27252 11.3135 8.18182 11.3495 8.09742C11.3856 8.01301 11.4379 7.93656 11.5035 7.87241C11.5692 7.80826 11.6468 7.75768 11.732 7.72357C11.8173 7.68947 11.9083 7.67251 12.0001 7.67365C12.0918 7.67259 12.1827 7.68959 12.2678 7.7237C12.3529 7.7578 12.4305 7.80834 12.496 7.87241C12.5616 7.93648 12.6138 8.01281 12.6499 8.09709C12.6859 8.18137 12.705 8.27194 12.7061 8.3636C12.705 8.45526 12.6859 8.54582 12.6499 8.63011C12.6138 8.71439 12.5616 8.79076 12.496 8.85483C12.4305 8.9189 12.3529 8.9694 12.2678 9.0035C12.1827 9.0376 12.0918 9.05465 12.0001 9.05359C11.9084 9.05482 11.8173 9.03794 11.7321 9.00391C11.6469 8.96988 11.5692 8.91933 11.5036 8.85523C11.4379 8.79114 11.3856 8.71472 11.3495 8.63035C11.3135 8.54598 11.2944 8.45534 11.2935 8.3636V8.36429Z" fill="#BDBDBD"/>
  </svg>`;
  var crossSvg = `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M7.00022 17L17 7.00006M16.9998 16.9999L7 7" stroke="#A3A3A3" stroke-width="1.5"/>
        </svg>
         `;

  function getCompleteProtectionData() {
    const bundle = document.querySelector(
      '[data-testid="ancillaries-bundle"][data-code="Ultimate Protection"],' +
      '[data-testid="ancillaries-bundle"][data-code="Complete Protection"]'
    );

    if (!bundle) return null;

    // Feature list (UL > LI)
    const body = bundle.querySelector('[data-testid="ancillaries-bundle-body"]');
    const features = body.firstElementChild;
    var addCta = null;
    if (body) {
      addCta = body.querySelector(".add-cta");
      console.log(addCta, "addCta"); 
    }

    // Old / cut price
    const oldPriceEl = bundle.querySelector(
      '[data-testid="ancillaries-bundle-strikethrough-price"]'
    );
    const oldPrice = oldPriceEl ? oldPriceEl.textContent.trim() : null;

    // Current price (prefer data-price)
    const newPrice =
      bundle.getAttribute("data-price") ||
      bundle.querySelector('[data-testid="ancillaries-bundle-price"]')?.textContent?.trim();

    return {
      features,
      oldPrice,
      newPrice,
      addCta,
    };
  }

  function bindCustomSelectButton() {
    const customBtn = document.querySelector(
      `#${EXP_ID} .custom-select-btn`
    );

    if (!customBtn) return;

    customBtn.addEventListener("click", () => {
      const nativeBtn = getNativeCompleteProtectionCTA();

      if (!nativeBtn) {
        console.warn("Native CTA not found");
        return;
      }

      nativeBtn.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
        })
      );
    });
  }


  function injectSection() {
    if (document.getElementById(EXP_ID)) return;

    const insertionPoint = document.querySelector(TARGET_SELECTOR);
    if (!insertionPoint) return;

    const html = `
      <section class="new-protection-section" id="${EXP_ID}">
        <div class="protection-cards-section">
          <svg class="protection-bg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 979 424" fill="none">
            <path d="M5.83529e-05 0H979L979 350.639C979 350.639 679.144 424 487.982 424C296.82 424 0 350.639 0 350.639L5.83529e-05 0Z" fill="#EAEAEA"/>
          </svg>
          <div class="protection-cards-section-content">
            <h2 class="protection-title">
            2.5 Million + customers purchased our popular protection in 2025!
            </h2>

          <div class="protection-cards">
            <div class="protection-card">
              <div class="card-content-header">
                <p class="card-title">Basic Protection</p>
                <p class="ancillary-bundle-rating"><span class="active"></span> <span></span> <span></span> </p>
                <p class="card-desc">
                  For your rental vehicle, yourself, and your belongings.
                </p>
              </div>
              <ul class="feature-list">
                <li class="active"><p><span class="active">${svg}</span> <span>Cover The Car (LDW)</span></p> <span>${infoSvg}</span></li>
                <li class="inactive"><p><span class="inactive">${crossSvg}</span> <span>Cover My Liability (ALI)</span></p> <span>${infoSvg}</span></li>
                <li class="inactive"><p><span class="inactive">${crossSvg}</span> <span>Cover Myself (PAI)</span></p> <span>${infoSvg}</span></li>
                <li class="inactive"><p><span class="inactive">${crossSvg}</span> <span>Cover My Belongings (PEP)</span></p> <span>${infoSvg}</span></li>
              </ul>
              <div class="price">
                <span class="old-price">$62.00/day</span>
                <span class="new-price">$32</span>
                <span class="per-day">/day</span>
              </div>
              <div class="btn-container">
                <button class="btn secondary">Select</button>
              </div>
            </div>
            <!-- Standard Protection Highlight -->
            <div class="protection-card highlight">
              <div class="recomended">RECOMMENDED</div>
              <div class="card-content-header">
                <p class="card-title">Standard Protection</p>
                <p class="ancillary-bundle-rating"><span class="active"></span> <span class="active"></span> <span></span> </p>
                <p class="card-desc">
                  For your rental vehicle + liability coverage, to help avoid costly
                  claims from third party injuries or property damage.
                </p>
              </div>
              <ul class="feature-list">
                <li class="active"><p><span class="active">${svg}</span> <span>Cover The Car (LDW)</span></p> <span>${infoSvg}</span></li>
                <li class="active"><p><span class="active">${svg}</span> <span>Cover My Liability (ALI)</span></p> <span>${infoSvg}</span></li>
                <li class="active"><p><span class="active">${svg}</span> <span>Cover Myself (PAI)</span></p> <span>${infoSvg}</span></li>
                <li class="inactive"><p><span class="inactive">${crossSvg}</span> <span>Cover My Belongings (PEP)</span></p> <span>${infoSvg}</span></li>
              </ul>
              <div class="price">
                <span class="old-price">$62.00/day</span>
                <span class="new-price">$45</span>
                <span class="per-day">/day</span>
              </div>
              <div class="btn-container">
                <button class="btn primary">Add Protection</button>
              </div>
            </div>

            <div class="protection-card">
              <div class="card-content-header">
                <p class="card-title">Complete Protection</p>
                <p class="ancillary-bundle-rating"><span class="active"></span> <span class="active"></span> <span class="active"></span> </p> 
                <p class="card-desc">
                  Includes full protection if your rental vehicle is damaged or stolen.
                </p>
              </div>
              <ul class="feature-list">
                <li class="active"><p><span class="active">${svg}</span> <span>Cover The Car (LDW)</span></p> <span>${infoSvg}</span></li>
                <li class="active"><p><span class="active">${svg}</span> <span>Cover My Liability (ALI)</span></p> <span>${infoSvg}</span></li>
                <li class="active"><p><span class="active">${svg}</span> <span>Cover Myself (PAI)</span></p> <span>${infoSvg}</span></li>
                <li class="active"><p><span class="active">${svg}</span> <span>Cover My Belongings (PEP)</span></p> <span>${infoSvg}</span></li>
              </ul>
              <div class="price">
                <span class="old-price">$62.00/day</span>
                <span class="new-price">$56</span>
                <span class="per-day">/day</span>
              </div>
              <div class="btn-container">
                <button class="btn secondary custom-select-btn">Select</button>
              </div>
            </div>
          </div>
          </div>
        </div>

      </section>
    `;

    insertionPoint.insertAdjacentHTML("beforebegin", html);
    const data = getCompleteProtectionData();
    if (!data) return;

    // Find Complete Protection card
    const completeCard = [...document.querySelectorAll(
      `#${EXP_ID} .protection-card`
    )].find(card =>
      card.querySelector(".card-title")?.textContent.trim() === "Complete Protection"
    );

    if (!completeCard) return;

    const ul = completeCard.querySelector("ul");
    if (ul && data.features) {
      data.features.classList.add("features");
      ul.replaceWith(data.features);
    }

    const oldPriceEl = completeCard.querySelector(".old-price");
    if (oldPriceEl && data.oldPrice) {
      oldPriceEl.textContent = data.oldPrice;
      oldPriceEl.style.display = "inline";
    }

    const newPriceEl = completeCard.querySelector(".new-price");
    if (newPriceEl && data.newPrice) {
      newPriceEl.textContent = data.newPrice.startsWith("$")
        ? data.newPrice
        : `$${data.newPrice}`;
    }

    bindCustomSelectButton();

  }

  function observeReact() {
    const observer = new MutationObserver(() => {
      injectSection();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  function init() {
    injectSection();
    observeReact();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
