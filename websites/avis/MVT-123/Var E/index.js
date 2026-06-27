import { bundleCarSvg, chevronSvg, declineProWarningSvg, declinetProtSvg, featureInfoSvg, greenCheck, mostPopularSvg, thankSvg, whicheCheckSvg } from "./allSvg";
import poll from "./poll";

(() => {
  // --- CONFIGURATION ---
  const CONFIG = {
    targetElement: '[data-testid="rc-title"]',
    targetPathname: '/en/reservation/review-and-book',
    injectedClass: 'MVT-123-Var_E',
    testId: 'MVT-123',
    variationId: 'Var_E',
  };

  //getSession data
  function getSessionData() {
    const sessionData = sessionStorage.getItem("reservation.store");
    return sessionData ? JSON.parse(sessionData).state : {};
  }

  // 0. API Interceptor for /calculate API
  if (!window.mvtFetchInterceptorSetup) {
    window.mvtFetchInterceptorSetup = true;
    const originalFetch = window.fetch;
    window.fetch = function (...args) {
      const url = typeof args[0] === 'string' ? args[0] : (args[0] && args[0].url) || '';
      const isCalculate = url.includes('/reservation/price/calculate');

      return originalFetch.apply(this, args).then(response => {
        if (isCalculate) {
          window.dispatchEvent(new CustomEvent('mvtCalculateResolved'));
        }
        return response;
      }).catch(error => {
        if (isCalculate) {
          window.dispatchEvent(new CustomEvent('mvtCalculateResolved'));
        }
        throw error;
      });
    };
  }
  //  item price design
  const itemPriceDesign = () => {
    const mainControl = document.querySelector('[data-mvt-injected="true"]');
    const protectionPriceEls = mainControl.querySelectorAll('[data-testid="checkout-ancillaries-item-price"]')
    if (protectionPriceEls.length) {
      protectionPriceEls.forEach((el, idx) => {
        const oldPrice = el.querySelector('span');
        if (oldPrice && /\d/.test(oldPrice.textContent)) {
          oldPrice.style.display = 'none';
        }
        const priceParenEl = el.closest('.MuiStack-root');
        priceParenEl.setAttribute('data-mvt-testid', 'protection-price-wrapper');
        const pTag = el.querySelector('p');
        if (pTag) {
          const text = pTag.textContent.trim();
          const match = text.match(/^(.*?)\s*\/\s*(.*?)$/);
          if (match) {
            const [, price, period] = match;
            pTag.innerHTML = '<span class="mvt-price">' + price + '/</span>'
              + '<span class="mvt-period">' + period + '</span>';
          }
        }
      })
    }
  }

  // Placeholder readDom function
  const includeItemDesign = () => {
    console.log('===> index.js:69 ~ test',);
    poll(
      () => document.querySelectorAll('[data-mvt-injected="true"] [data-testid="ancillary-item-card"]'),
      () => {
        const controlEl = document.querySelector('[data-mvt-injected="true"]');
        console.log('===> index.js:69 ~ controlEl', controlEl);
        if (controlEl) {
          const items = controlEl.querySelectorAll('[data-testid="ancillary-item-card"]');
          console.log('===> index.js:71 ~ items', items);
          if (items.length) {
            items.forEach((item, idx) => {
              console.log(item, "itemWithIndx")
              const included = item.querySelector('.MuiChip-outlined.MuiChip-sizeSmall.MuiChip-colorSuccess') || item.querySelector('[data-testid="checkout-ancillaries-item-included"]')
              console.log(included, "included")
              if (included) {
                const mainItemCard = included.closest('[data-testid="ancillary-item-card"]');
                included.classList.add('mvt-included-style')
                console.log('===> index.js:53 ~ mainItemCard', mainItemCard);
                if (mainItemCard) mainItemCard.classList.add('mvt-included-item-wrapper')
                if (!included.querySelector('.mvt-included-icon')) {
                  var whiteCheckSvg = '<span class="mvt-included-icon">' + whicheCheckSvg + '</span>';
                  included.insertAdjacentHTML('afterbegin', whiteCheckSvg)
                }
                const incudedParent = included.closest('.MuiStack-root');
                if (incudedParent) {
                  incudedParent.classList.add('mvt-included-parent')
                }
              } else {
                item.classList.remove('mvt-included-item-wrapper')
                itemPriceDesign()
              }
            })
          }
        }
      }
    )
  }

  function readDom() {
    console.log("readDom() called 1 second after /calculate API resolved");
    //thanks message showing
    poll(
      () => document.querySelector('[data-mvt-injected="true"] [data-mvt-bundlename="Essential Protection"]') || document.querySelector('[data-mvt-injected="true"] [data-mvt-bundlename="Basic Cover"]'),
      () => {
        const controlEl = document.querySelector('[data-mvt-injected="true"]');
        console.log('===> index.js:36 ~ control', controlEl);
        const protBundle = controlEl.querySelector('[data-mvt-bundlename="Essential Protection"]') || controlEl.querySelector('[data-mvt-bundlename="Basic Cover"]');
        console.log('===> index.js:37 ~ isSelectedBundle', protBundle);
        if (protBundle) {
          const controlRadioChecked = protBundle.querySelector('input[type="radio"]').checked;
          console.log('===> index.js:42 ~ controlRadioChecked', controlRadioChecked);
          const thankMsg = controlEl.querySelector('[data-mvt-testid="protection-thanks-message"]');
          if (thankMsg) {
            if (controlRadioChecked) {
              console.log('===> index.js:45 ~ thankMsg', thankMsg);
              thankMsg.classList.add('show-thanks-msg');
              thankMsg.classList.remove('hide-thanks-msg');
            } else {
              thankMsg.classList.remove('show-thanks-msg');
              thankMsg.classList.add('hide-thanks-msg');
            }
          }
        }
      }
    )
    // protection item design
    includeItemDesign()
  }

  // Global listener to debounce readDom() calls after /calculate API resolves
  let calculateTimeout = null;
  window.addEventListener('mvtCalculateResolved', () => {
    if (calculateTimeout) {
      clearTimeout(calculateTimeout);
    }
    calculateTimeout = setTimeout(() => {
      if (typeof readDom === 'function') {
        readDom();
      }
    }, 1000);
  });
  // extract price
  function extractPrice(text) {
    return parseFloat(
      text.replace(/[^0-9.,]/g, '').replace(/,/g, '')
    );
  }

  // 1. Pathname Validator
  function isTargetPage() {
    if (!CONFIG.targetPathname) return true;
    const currentPath = window.location.pathname;
    return currentPath.includes(CONFIG.targetPathname);
  }

  const protectionBundleDesign = () => {
    poll(
      () => document.querySelector('[data-mvt-testid="protection-bundle-section-container"]'),
      () => {
        //session data
        const sessionData = getSessionData();
        const storeBundles = sessionData && sessionData.protectionsConfig.data.protectionBundleList.items || [];
        console.log('===> index.js:204 ~ storeBundles', storeBundles);
        //bundles wrapper
        const bundlesWrapper = document.querySelector('[data-mvt-testid="protection-bundle-section-container"]')
        if (bundlesWrapper) {
          console.log('===> index.js:202 ~ bundlesWrapper', bundlesWrapper);
          //bundles
          const bundles = bundlesWrapper.querySelectorAll('[data-testid="ancillary-bundle-card"]');
          console.log('===> index.js:205 ~ bundles', bundles);

          let noProtBundleBtn = null;

          if (bundles.length) {
            bundles.forEach((bundle, idx) => {
              console.log('===> index.js:213 ~ bundle', bundle);
              const bundleParentDiv = bundle.closest('.MuiGrid2-root');
              const bundleOutlineDiv = bundle.querySelector('.MuiPaper-outlined');
              console.log('===> index.js:218 ~ bundleOutlineDiv', bundleOutlineDiv);
              if (bundleOutlineDiv) {
                bundleOutlineDiv.addEventListener('click', (e) => {
                  console.log('===> index.js:221 ~ ', e.target.closest('.MuiRadio-root'));
                  if (e.target.closest('.MuiRadio-root') || e.target.closest('button')) return;
                  e.preventDefault();
                  e.stopPropagation();
                })
              }
              const bundleNameEl = bundle.querySelector('[data-testid="ancillary-card-title"] p');
              console.log('===> index.js:214 ~ bundleNameEl', bundleNameEl);
              const bundleName = bundleNameEl.textContent.trim() || '';
              console.log('===> index.js:216 ~ bundleName', bundleName);
              const bundleDetails = storeBundles.find((s) => s.bundleName === bundleName);
              console.log('===> index.js:219 ~ bundleDetails', bundleDetails);
              const coverageRating = bundleDetails.coverageRating || "";
              console.log('===> index.js:220 ~ coverageRating', coverageRating);
              if (coverageRating === 'none') {
                bundleParentDiv.classList.add('hide-bundle')
              }
              bundleParentDiv.classList.add(coverageRating)
              // HEADER
              const bundleTitleWrapper = bundle.querySelector('[data-testid="ancillary-card-title"]');
              console.log('===> index.js:227 ~ bundleTitleWrapper', bundleTitleWrapper);
              if (bundleTitleWrapper) {
                bundleTitleWrapper.closest('.MuiStack-root.mui-ozm0df').classList.add('bundle-header')
                if (!bundle.querySelector('.bundle-header-content')) {
                  const bundleHeaderContentHtml = `
                  <div class="bundle-header-content">
                    <div class="bundle-coverage-rating ${coverageRating}">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <div class="bundle-desc">Lorem ipsum doller sit amit.</div>
                  </div>
                  `;
                  bundleTitleWrapper.insertAdjacentHTML('afterend', bundleHeaderContentHtml)
                }
              }

              // FEATURE ITEMS DESIGN
              const featureFirstItem = bundle.querySelector('[data-testid="bundle-included-item-0"]');
              const controlFeatureList = bundle.querySelectorAll('[data-testid*="bundle-included-item-"]');
              console.log('===> index.js:231 ~ controlFeatureList', controlFeatureList);
              console.log('===> index.js:230 ~ featureFirstItem', featureFirstItem);
              if(featureFirstItem){
                const featureListWrapper = featureFirstItem.parentElement;
                console.log('===> index.js:233 ~ featureListWrapper', featureListWrapper);
                if (featureListWrapper) {
                  featureListWrapper.classList.add('feature-list-wrapper')
                }
              }

              if(controlFeatureList.length){
                controlFeatureList.forEach((feature)=>{
                  const featureListIcon = feature.querySelector('button [data-testid="InfoOutlinedIcon"]');
                  if (!feature.querySelector('.feature_info-svg')) {
                    featureListIcon.insertAdjacentHTML('afterend', `${featureInfoSvg}`)
                  }
                })
              }

              //PRICE AND SELECT BTN
              const priceSection = bundle.querySelector('[data-testid="checkout-ancillaries-bundle-price"]');
              console.log('===> index.js:250 ~ priceSection', priceSection);
              if (priceSection) {
                //price design
                const pTag = priceSection.querySelector('p');
                console.log('===> index.js:252 ~ pTag', pTag);
                if (pTag) {
                  const text = pTag.textContent.trim();
                  const match = text.match(/^(.*?)\s*\/\s*(.*?)$/);
                  if (match) {
                    const [, price, period] = match;
                    pTag.innerHTML = '<span class="mvt-price">' + price + '/</span>'
                      + '<span class="mvt-period">' + period + '</span>';
                  }
                }

                //select btn design
                const priceSecParent = priceSection.parentElement;
                console.log('===> index.js:253 ~ priceSecParent', priceSecParent);
                if (!bundle.querySelector('.select-btn-wrapper')) {
                  const selectBtnWrapperHtml = `
                  <div class="select-btn-wrapper">
                    <div class="select-btn">Switch to this option</div>
                  </div>
                  `;
                  priceSection.insertAdjacentHTML('afterend', selectBtnWrapperHtml)

                  if (coverageRating === 'none') {
                    noProtBundleBtn = bundle.querySelector('.select-btn');
                  }

                  const bundlerHeaderEl = bundle.querySelector('.bundle-header');
                  const bundleRadioBtn = bundlerHeaderEl.querySelector('span.MuiRadio-root');
                  console.log('===> index.js:284 ~ bundleRadioBtn', bundleRadioBtn);
                  const isSelected = bundleRadioBtn.classList.contains('Mui-checked');
                  const selectBtn = bundle.querySelector('.select-btn');
                  console.log('===> index.js:261 ~ selectBtn', selectBtn);
                  if (isSelected) {
                    selectBtn.classList.add('active');
                    selectBtn.textContent = 'Selected'
                    bundleOutlineDiv.classList.add('active')
                  }

                  selectBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const allSelectBtns = document.querySelectorAll('.select-btn');
                    const allActiveBundles = document.querySelectorAll('[data-mvt-testid="protection-bundle-section-container"] [data-testid="ancillary-bundle-card"] .active');
                    console.log('===> index.js:288 ~ allActiveBundles', allActiveBundles);
                    console.log('===> index.js:263 ~ noProtBundleBtn', noProtBundleBtn);
                    const bundlerHeaderEl = bundle.querySelector('.bundle-header');
                    const bundleRadioBtn = bundlerHeaderEl.querySelector('span.MuiRadio-root');
                    console.log('===> index.js:284 ~ bundleRadioBtn', bundleRadioBtn);
                    const isSelected = bundleRadioBtn.classList.contains('Mui-checked');
                    console.log('===> index.js:285 ~ isSelected', isSelected);
                    allSelectBtns.forEach((btn) => {
                      btn.textContent = 'Switch to this option'
                      btn.classList.remove('active');
                    })
                    if (allActiveBundles) {
                      allActiveBundles.forEach((activeBundle) => {
                        activeBundle.classList.remove('active');
                      })
                    }
                    if (isSelected) {
                      noProtBundleBtn.click();
                      allSelectBtns[idx].classList.remove('active');
                      allSelectBtns[idx].textContent = 'Switch to this option'
                      bundleOutlineDiv.classList.remove('active')
                      return;
                    } else {
                      bundleRadioBtn.click();
                      allSelectBtns[idx].classList.add('active');
                      allSelectBtns[idx].textContent = 'Selected';
                      bundleOutlineDiv.classList.add('active')
                    }
                  })
                }
              }
            })
          }
        }
      }
    )
  }

  const protectionItemDesign = () => {
    const mainControl = document.querySelector('[data-mvt-injected="true"]');
    console.log('===> index.js:257 ~ mainControl', mainControl);
    poll(
      () => document.querySelector('[data-mvt-testid="protection-item-section"]'),
      () => {
        const protSubHeading = document.querySelector('[data-mvt-testid="protection-bundle-section-container"]') || document.querySelector('[data-mvt-testid="protection-sub-heading"]');
        const protItemSection = document.querySelector('[data-mvt-testid="protection-item-section"]');
        console.log('===> index.js:400 ~ protItemSection', protItemSection);
        protItemSection.setAttribute('data-mvt-testid', 'protection-item-section');
        //protection item header html
        if (!document.querySelector('.mvt-prot-item-section-wrapper')) {
          var protItemHeaderHtml =
            '<div class="mvt-prot-item-section-wrapper">' +
            '<div class="mvt-prot-item-header">' +
            '<div class="mvt-prot-item-header-left">' +
            '<p class="mvt-prot-item-header-title">More protection options</p>' +
            '<p class="mvt-prot-item-header-subtitle">Add additional coverage for extra peace of mind.</p>' +
            '</div>' +
            '<div class="mvt-prot-item-header-right">' +
            '<span>' + chevronSvg + '</span>' +
            '</div>' +
            '</div>' +
            '</div>';
          protSubHeading.insertAdjacentHTML('afterend', protItemHeaderHtml)
          // add click listener
          const mvtProtItemHeader = document.querySelector('.mvt-prot-item-header');
          mvtProtItemHeader.insertAdjacentElement("afterend", protItemSection)
          protItemSection.classList.add('show-section');
          if (mvtProtItemHeader) {
            mvtProtItemHeader.addEventListener("click", () => {
              console.log('===> index.js:482 ~ ', protItemSection);
              if (protItemSection.classList.contains("show-section")) {
                protItemSection.classList.remove("show-section");
                mvtProtItemHeader.classList.add('collapse')
              } else {
                protItemSection.classList.add("show-section");
                mvtProtItemHeader.classList.remove('collapse')
              }
            })
          }

          const itemImgElements = protItemSection.querySelectorAll('[data-testid="image-component"]');
          console.log('===> index.js:344 ~ itemImgElements', itemImgElements);
          if (itemImgElements.length) {
            itemImgElements.forEach(item => {
              const protItemHeader = item.closest('.MuiBox-root.mui-19idom');
              console.log('===> index.js:348 ~ protItemHeader', protItemHeader);
              protItemHeader.classList.add('prot-item-header')
              item.nextElementSibling.textContent = item.nextElementSibling.textContent.replace(/\s*\([^)]*\)/g, '')
              protItemHeader.nextElementSibling?.tagName === 'P' &&
                protItemHeader.nextElementSibling.setAttribute(
                  'data-mvt-testid',
                  'protection-item-description'
                );
            })
          }
        }
        includeItemDesign()
      }
    )
    // description
    poll(
      () => mainControl.querySelectorAll('[data-mvt-testid="protection-item-description"]') && mainControl.querySelectorAll('[data-mvt-testid="protection-item-description"]').length,
      () => {
        const protItemDesc = mainControl.querySelectorAll('[data-mvt-testid="protection-item-description"]')
        console.log('===> index.js:262 ~ protItemDesc', protItemDesc);
        if (protItemDesc.length) {
          var detailsBtnHtml = '<div class="details-btn">Details</div>';
          protItemDesc.forEach(el => {
            const descParentEl = el.closest('.MuiBox-root');
            console.log('===> index.js:269 ~ descParentEl', descParentEl);
            if (descParentEl && !descParentEl.querySelector('.details-btn')) {
              el.insertAdjacentHTML('beforebegin', detailsBtnHtml)
            }
          })
          // details btn click functionality
          const detailsBtn = mainControl.querySelectorAll('.details-btn');
          if (detailsBtn.length) {
            detailsBtn.forEach((el, idx) => {
              el.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                console.log('===> index.js:282 ~ ', idx);
                const singleProtItemDesc = protItemDesc[idx];
                console.log('===> index.js:325 ~ singleProtItemDesc', singleProtItemDesc);
                if (singleProtItemDesc && !singleProtItemDesc.classList.contains('show-desc')) {
                  singleProtItemDesc.classList.add('show-desc')
                  el.textContent = 'Hide Details';
                } else {
                  singleProtItemDesc.classList.remove('show-desc')
                  el.textContent = 'Details';
                }
              })
            })
          }
          // price ui adjustment
          itemPriceDesign()
        }
      }
    )
    // implement 'recommended' tag
    poll(
      () => mainControl.querySelectorAll('[data-testid="checkout-ancillaries-item-recommendation"]'),
      () => {
        const recommendedItems = mainControl.querySelectorAll('[data-testid="checkout-ancillaries-item-recommendation"]');
        console.log('===> index.js:363 ~ recommendedItems', recommendedItems);
        if (recommendedItems.length) {
          recommendedItems.forEach(item => {
            const itemParent = item.closest(".MuiStack-root");
            const itemMainCard = item.closest('[data-testid="ancillary-item-card"]')
            if (itemMainCard) {
              itemMainCard.classList.add('mvt-recommended-item-wrapper')
            }
            const cardImageSection = itemParent.querySelector('[data-testid="ancillary-card-title"]');
            cardImageSection.classList.add('mvt-recommended-tag-wrapper')
            console.log('===> index.js:368 ~ cardImageSection', cardImageSection);
            var recommendedTagHtml = '<p class="mvt-recommended-tag">'
              + '<span class="svg-span">' + mostPopularSvg + '</span>'
              + '<span>Recommended</span>'
              + '</p>';
            if (cardImageSection && !cardImageSection.querySelector('.mvt-recommended-tag')) {
              cardImageSection.insertAdjacentHTML('beforeend', recommendedTagHtml)
            }
          })
        }
      }
    )
  }

  function addOnItemsDesign() {
    poll(
      () => document.querySelector('[data-mvt-testid="add-on-item-section"]') || document.querySelector('[data-mvt-testid="add-on-item-section-wrapper"]'),
      () => {
        //INJECT NEW WRAPPER
        const addOnSectionContainer = document.querySelector('[data-mvt-testid="add-on-item-section"]') || document.querySelector('[data-mvt-testid="add-on-item-section-wrapper"] .MuiGrid2-root');
        console.log('===> index.js:411 ~ addOnSectionContainer', addOnSectionContainer);
        const mainControl = document.querySelector('[data-mvt-injected="true"]')
        const addOnSectionHeading = document.querySelector('[data-mvt-testid="add-on-title-heading"]');
        console.log('===> index.js:403 ~ addOnSectionHeading', addOnSectionHeading);
        if (addOnSectionContainer && !mainControl.querySelector('.mvt-add-on-section-header')) {
          var addOnSectionHeaderHtml = '<div class="mvt-add-on-section-wrap">'
            + '<div class="mvt-add-on-section-header">'
            + '<div class="mvt-add-on-section-header-left">'
            + '<p class="mvt-add-on-section-header-title">Enhance your trip</p>'
            + '<p class="mvt-add-on-section-header-subtitle">Customize your rental with helpful extras like fuel, tolls and additional drivers. </p>'
            + '</div>'
            + '<div class="mvt-add-on-section-header-right">'
            + '<span>' + chevronSvg + '</span>'
            + '</div>'
            + '</div>'
            + '</div>';
          addOnSectionHeading.insertAdjacentHTML('afterend', addOnSectionHeaderHtml)
          const addOnSectionHeader = mainControl.querySelector('.mvt-add-on-section-header');
          const addOnSectionWrapEl = mainControl.querySelector('.mvt-add-on-section-wrap');
          console.log('===> index.js:422 ~ addOnSectionHeader', addOnSectionHeader);
          if (addOnSectionHeader && addOnSectionContainer) {
            addOnSectionHeader.insertAdjacentElement('afterend', addOnSectionContainer)

            addOnSectionHeader.addEventListener('click', () => {
              console.log('===> index.js:423 ~ ');
              if (addOnSectionContainer.classList.contains("collapse")) {
                console.log('===> index.js:572 ~ ',);
                addOnSectionContainer.classList.remove('collapse')
                addOnSectionHeader.classList.remove('chevron-up')
                addOnSectionWrapEl.classList.remove('collapse')
              } else {
                addOnSectionContainer.classList.add('collapse')
                addOnSectionHeader.classList.add('chevron-up')
                addOnSectionWrapEl.classList.add('collapse')
              }
            })
          }
        }

        // CHANGE DESIGN
        const addOnCards = addOnSectionContainer.querySelectorAll('[data-testid="ancillary-item-card"]');
        console.log('===> index.js:432 ~ addOnCards', addOnCards);
        if (addOnCards.length) {
          addOnCards.forEach((card, idx) => {
            // HERDER DESIGN
            let cardTitle = card.querySelector('[data-testid="ancillary-card-title"] p');
            console.log('===> index.js:436 ~ cardTitle', cardTitle);
            cardTitle.textContent = cardTitle.textContent.replace(/\s*\([^)]*\)/g, '');
            // DETAILS DESIGN
            const cardHeader = card.querySelector('[data-testid="ancillary-card-title"]')
            console.log('===> index.js:439 ~ cardHeader', cardHeader);
            const cardHeaderParent = cardHeader.closest('.MuiBox-root');
            console.log('===> index.js:443 ~ cardHeaderParent', cardHeaderParent);
            var detailsBtnHtml = '<div class="details-btn">Details</div>';
            if (cardHeaderParent && !cardHeaderParent.nextElementSibling.classList.contains('details-btn')) {
              console.log('===> index.js:468 ~ test', cardHeaderParent);
              cardHeaderParent.insertAdjacentHTML('afterend', detailsBtnHtml);
              const detailsBtn = card.querySelector('.details-btn');
              console.log('===> index.js:450 ~ detailsBtn', detailsBtn);
              const cardDesc = detailsBtn.nextElementSibling;
              console.log('===> index.js:675 ~ cardDesc', cardDesc);
              if (cardDesc) {
                if (detailsBtn.nextElementSibling.tagName === 'P') {
                  cardDesc.classList.add('add-on-desc')
                  if (detailsBtn) {
                    if (cardDesc.textContent.trim() === '') {
                      detailsBtn.style.visibility = 'hidden'
                    }
                    detailsBtn.addEventListener('click', (e) => {
                      e.stopPropagation();
                      console.log('===> index.js:454 ~ detailsBtn click');
                      if (!cardDesc.classList.contains('show-desc')) {
                        cardDesc.classList.add('show-desc');
                        detailsBtn.textContent = 'Hide Details';
                      } else {
                        cardDesc.classList.remove('show-desc');
                        detailsBtn.textContent = 'Details';
                      }
                    })
                  }
                }
              }
            }
            // HIDE SEE MORE DETAILS BUTTON
            const seeMoreDetailsBtn = card.querySelector('[data-testid="checkout-ancillaries-see-more-details"]');
            if (seeMoreDetailsBtn) {
              seeMoreDetailsBtn.closest('.MuiBox-root').style.display = 'none'
            }

            const allCards = addOnSectionContainer.querySelectorAll('.MuiGrid2-root:not(.MuiGrid2-container)');
            console.log('===> index.js:478 ~ allCards', allCards);
            if (allCards.length) {
              allCards.forEach((card, idx) => {
                console.log('===> index.js:635 ~ idx', idx, card);
                if (idx > 3) {
                  card.classList.add('mvt-extra-card')
                }
              })

              if (allCards.length > 4) {
                if (!mainControl.querySelector('.mvt-view-all-btn')) {
                  var viewAllBtnHtml = '<div class="mvt-view-all-btn hide">View all add-ons</div>';
                  addOnSectionContainer.insertAdjacentHTML('afterend', viewAllBtnHtml);
                  const viewAllBtn = mainControl.querySelector('.mvt-view-all-btn');
                  console.log('===> index.js:495 ~ viewAllBtn', viewAllBtn);
                  if (viewAllBtn) {
                    const allExtraCards = mainControl.querySelectorAll('.mvt-extra-card')
                    console.log('===> index.js:497 ~ allExtraCards', allExtraCards);
                    viewAllBtn.addEventListener('click', (e) => {
                      e.stopPropagation();
                      if (viewAllBtn.classList.contains('hide')) {
                        allExtraCards.forEach((card) => {
                          card.classList.add('show-extra-card')
                        })
                        viewAllBtn.textContent = 'Hide additional add-ons';
                        viewAllBtn.classList.remove('hide')
                      } else {
                        allExtraCards.forEach((card) => {
                          card.classList.remove('show-extra-card')
                        })
                        viewAllBtn.textContent = 'View all add-on items';
                        viewAllBtn.classList.add('hide')
                      }
                    })
                  }
                }
              }
            }
          })
        }

        // Design for quantity UI item
        const itemWithQuantity = mainControl.querySelectorAll('[data-testid="checkout-ancillaries-child-seats-price"]');
        console.log('===> index.js:481 ~ itemWithQuantity', itemWithQuantity);
        if (itemWithQuantity.length) {
          itemWithQuantity.forEach(item => {
            console.log('===> index.js:747 ~ itemPrice', item);
            const oldPrice = item.querySelector('span');
            if (oldPrice) oldPrice.style.display = 'none';
            const itemParent = item.closest('.MuiPaper-root.MuiPaper-outlined');
            console.log('===> index.js:485 ~ itemParent', itemParent);
            if (itemParent) {
              const quaniitySelector = itemParent.querySelectorAll('[data-testid*="checkout-ancillaries-child-seat-"]');
              console.log('===> index.js:486 ~ quaniitySelector', quaniitySelector);
              if (quaniitySelector.length) {
                quaniitySelector.forEach((selector, idx) => {
                  console.log('===> index.js:492 ~ selector', selector);
                })
              }
            }
            const pTag = item.querySelector("p");
            console.log('===> index.js:544 ~ pTag', pTag);
            if (pTag) {
              const text = pTag.textContent.trim();
              const match = text.match(/^(.*?)\s*\/\s*(.*?)$/);
              if (match) {
                const [, price, period] = match;
                pTag.innerHTML = '<span class="mvt-price">' + price + '/</span>'
                  + '<span class="mvt-period">' + period + '</span>';
              }
            }
          })
        }
      }
    )
    itemPriceDesign()
  }

  function itemPointDesign() {
    poll(
      () => document.querySelectorAll('[data-testid*="pay-with-points-section-"]'),
      () => {
        const pointSections = document.querySelectorAll('[data-testid*="pay-with-points-section-"]');
        console.log('===> index.js:790 ~ pointSections', pointSections);
        if (pointSections.length) {
          pointSections.forEach(item => {
            const label = item.querySelector('[data-testid*="pay-with-points-points-per-day-"]');
            console.log('===> index.js:794 ~ label', label);
            if (label) {
              const text = label.textContent.trim();
              const match = text.match(/^(.*?)\s*\/\s*(.*?)$/);
              if (match) {
                const [, price, period] = match;
                label.innerHTML = '<span class="mvt-price">' + price + '/</span>'
                  + '<span class="mvt-period">' + period + '</span>';
              }
            }
          })
        }
      }
    )
  }

  // add class and attribute
  function addClassAndAttribute() {
    const mainControl = document.querySelector('[data-mvt-injected="true"]');
    // expand and collapse buttons
    const expendButtons = document.querySelectorAll('[data-mvt-injected="true"] > button');
    console.log('===> index.js:280 ~ expendButtons', expendButtons);
    expendButtons.forEach((btn, idx) => {
      if (idx === 0) {
        if (!btn.hasAttribute('data-mvt-testid')) {
          btn.click();
          btn.setAttribute('data-mvt-testid', 'protection-expand-button');
        }
      } else if (idx === 1) {
        if (!btn.hasAttribute('data-mvt-testid')) {
          btn.setAttribute('data-mvt-testid', 'add-on-expand-button');
          btn.style.display = 'none'
          btn.click()
        }
      }
    })
    // heading title
    const mainHeadingEl = mainControl.querySelectorAll('h6');
    mainHeadingEl.forEach((el) => {
      if (el.textContent === 'Choose your protection') {
        el.setAttribute('data-mvt-testid', 'protection-title-heading')
        let protectionSection = el.nextElementSibling;
        if (
          protectionSection &&
          (protectionSection.tagName === 'P' ||
            protectionSection.getAttribute('data-mvt-testid') === 'protection-sub-heading')
        ) {
          protectionSection = protectionSection.nextElementSibling;
          console.log('===> index.js:739 ~ protectionBundleSection', protectionSection);
        }
        if (protectionSection.querySelector('[data-testid="ancillary-bundle-card"]')) {
          protectionSection.setAttribute('data-mvt-testid', 'protection-bundle-section-container');
        } else if (protectionSection.querySelector('[data-testid="ancillary-item-card"]')) {
          protectionSection.setAttribute('data-mvt-testid', 'protection-item-section');
        }
      } else if (el.textContent === 'Customize with add-ons') {
        el.setAttribute('data-mvt-testid', 'add-on-title-heading')
        el.style.display = 'none';
        if (expendButtons.length > 1) {
          const addOnSection = el.nextElementSibling;
          if (addOnSection) {
            addOnSection.setAttribute('data-mvt-testid', 'add-on-bundle-section')
            addOnSection.style.display = "none";
          };
        } else {
          const addOnSection = el.nextElementSibling;
          if (addOnSection) addOnSection.setAttribute('data-mvt-testid', 'add-on-item-section');
        }

      }
    })
    //protection bundles
    const protectionBundles = mainControl.querySelectorAll('[data-mvt-testid="protection-bundle-section-container"] > div')
    if (protectionBundles.length > 0) {
      protectionBundles.forEach((bundle, idx) => {
        bundle.setAttribute('data-mvt-testid', 'protection-bundle')
        const bundleName = bundle.querySelector('div > div > div > div > div > p:not(.mvt-most-popular-bundle)');
        console.log('===> index.js:229 ~ bundleName', bundleName);
        if (bundleName) {
          bundleName.setAttribute('data-mvt-testid', 'protection-bundle-name')
          bundle.setAttribute('data-mvt-bundleName', bundleName.textContent.trim())
          const bundleContant = bundleName.closest('.MuiStack-root.mui-1k8t7d9');
          if (bundleContant) {
            bundleContant.setAttribute('data-mvt-testid', 'bundle-content')
          }
        };
      })
    }

    const protExpBtn = document.querySelector('[data-mvt-testid="protection-expand-button"]');
    const addOnExpBtn = document.querySelector('[data-mvt-testid="add-on-expand-button"]');
    console.log('===> index.js:645 ~ addOnExpBtn', addOnExpBtn);

    setTimeout(() => {
      console.log('===> index.js:315 ~ protExpBtn', protExpBtn);
      if (protExpBtn) {
        const protItemSectionParent = protExpBtn.nextElementSibling;
        console.log('===> index.js:318 ~ protItemSection', protItemSectionParent);
        if (protItemSectionParent) {
          protItemSectionParent.setAttribute('data-mvt-testid', 'prot-item-section-outer')
          if (protItemSectionParent.querySelector('.MuiGrid2-root')) {
            protItemSectionParent.querySelector('.MuiGrid2-root').setAttribute('data-mvt-testid', 'protection-item-section');
          }
        }
        // hide see more details button
        const seeMoreDetailsBtns = protItemSectionParent.querySelectorAll('[data-testid="checkout-ancillaries-see-more-details"]');
        console.log('===> index.js:354 ~ seeMoreDetailsBtns', seeMoreDetailsBtns);
        if (seeMoreDetailsBtns && seeMoreDetailsBtns.length) {
          seeMoreDetailsBtns.forEach(el => {
            console.log('===> index.js:356 ~ el', el);
            el.closest('.MuiBox-root').style.display = 'none'
          })
        }
        includeItemDesign()
      }
      if (addOnExpBtn) {
        const addOnItemSection = addOnExpBtn.nextElementSibling;
        console.log('===> index.js:722 ~ addOnItemSection', addOnItemSection);
        if (addOnItemSection) {
          addOnItemSection.setAttribute('data-mvt-testid', 'add-on-item-section-wrapper')
          addOnItemSection.querySelector('.MuiGrid2-root').setAttribute('data-mvt-testid', 'add-on-item-section');
        }
      }
    }, 1500)
  }

  // inject design and interections
  function injectDesign() {
    const mainControl = document.querySelector('[data-mvt-injected="true"]');
    console.log('===> index.js:63 ~ injectDesign ~ mainControl', mainControl);
    const protSectionTitle = mainControl.querySelector('[data-mvt-testid="protection-title-heading"]');
    console.log('===> index.js:141 ~ protSectionTitle', protSectionTitle);
    if (protSectionTitle) {
      protSectionTitle.textContent = 'Choose your protection'
      if (!mainControl.querySelector('[data-mvt-testid="protection-sub-heading"]')) {
        const protSubHeading = document.createElement('p');
        protSubHeading.setAttribute('data-mvt-testid', 'protection-sub-heading')
        protSubHeading.textContent = 'Add a protection for peace of mind on your trip.';
        protSectionTitle.insertAdjacentElement('afterend', protSubHeading)
      }
    }

    protectionBundleDesign()
    //protection item design
    protectionItemDesign()
    // no protection design
    // noProtectionDesign()
    // Add-on items design
    addOnItemsDesign()
    //item point section design
    itemPointDesign()
  }


  // 2. Main Injection Logic
  function inject() {
    // Step A: Check if we are on the target route
    if (!isTargetPage()) return;

    // Step B: Check if our code is already injected (prevent duplicate injections)
    if (document.querySelector('.' + CONFIG.injectedClass)) {
      return;
    }

    document.body.classList.add(CONFIG.injectedClass);

    poll(
      () => document.querySelector(CONFIG.targetElement) && [...document.querySelectorAll('h6')].find(el => el.textContent === 'Choose your protection' || el.textContent === 'Customize with add-ons'),
      () => {
        try {
          const targetElement = document.querySelector(CONFIG.targetElement);
          if (targetElement) {
            const protectionHeading = [...document.querySelectorAll('h6')].find(el => el.textContent === 'Choose your protection' || el.textContent === 'Customize with add-ons');
            if (!protectionHeading) throw new Error("protectionHeading not found")
            const mainContainer = protectionHeading.closest('div');
            if (!mainContainer) throw new Error("mainContainer not found")
            mainContainer.setAttribute('data-mvt-injected', 'true')
            //inject classes and data attribute into the dom
            addClassAndAttribute()
            //inject design
            injectDesign()
          } else throw err
        } catch (error) {
          console.error(error, "MVT-123 :: Error occaring during test")
        }
      }
    )
  }

  // 3. SPA DOM Observer
  function initSPAObserver() {
    inject();

    const observer = new MutationObserver(() => {
      inject();
    });

    // Observe document body for deep changes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  // Utility to wait for the initial body tag or basic elements before setting up the observer
  function waitForElem(
    waitFor,
    callback,
    minElements = 1,
    isVariable = false,
    timer = 15000,
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

  // Initialize
  waitForElem("body", initSPAObserver);
})();
