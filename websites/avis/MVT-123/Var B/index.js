import { bundleCarSvg, chevronSvg, declineProWarningSvg, declinetProtSvg, greenCheck, mostPopularSvg, thankSvg, whicheCheckSvg } from "./allSvg";
import poll from "./poll";

(() => {
  // --- CONFIGURATION ---
  const CONFIG = {
    targetElement: '[data-testid="rc-title"]',
    targetPathname: '/en/reservation/review-and-book',
    injectedClass: 'MVT-123-Var_B',
    testId: 'MVT-123',
    variationId: 'Var_B',
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
              const included = item.querySelector('.MuiChip-outlined.MuiChip-sizeSmall.MuiChip-colorSuccess')
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

    //no protection 
    poll(
      () => document.querySelector('.mvt-decline-protection-card'),
      () => {
        const sessionData = getSessionData();
        const selectedBundle = sessionData && sessionData.protectionBundleCode || "";
        const isNoProt = selectedBundle && selectedBundle.includes("No");
        const protBundle = document.querySelector('[data-mvt-bundlename="Essential Protection"]') || document.querySelector('[data-mvt-bundlename="Basic Cover"]');
        const declinetProtSection = document.querySelector('.mvt-decline-protection-card')
        const mvtDeclineProtectionWarning = document.querySelector('.mvt-decline-protection-warning');
        const declincePriceEl = document.querySelector('.mvt-decline-price');
        if (declinetProtSection) {
          const declinetProtCheckbox = declinetProtSection.querySelector('.mvt-decline-protection-checkbox')
          if (declinetProtCheckbox) {
            if (isNoProt) {
              declinetProtCheckbox.checked = true;
              protBundle.querySelector('input[type="radio"]').checked = false;
              protBundle.querySelector('input[type="checkbox"]').checked = false;
            } else {
              declinetProtCheckbox.checked = false;
            }
          }
          if (isNoProt && mvtDeclineProtectionWarning) {
            mvtDeclineProtectionWarning.classList.add('show-warning')
            declincePriceEl.classList.add('show-price')
          } else {
            mvtDeclineProtectionWarning.classList.remove('show-warning')
            declincePriceEl.classList.remove('show-price')
          }
        }
      }
    )

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

  const protectionBundleDesign = (mainControl) => {
    const protBundleEl = mainControl.querySelector('[data-mvt-testid="protection-bundle-section-container"]');
    const protectionBundle = mainControl.querySelector('[data-mvt-bundlename="Basic Cover"]') || mainControl.querySelector('[data-mvt-bundlename="Essential Protection"]')
    if (protectionBundle) {
      //bundle top heading
      if (!mainControl.querySelector('[data-mvt-testid="protection-bundle-title"]')) {
        const bundleTitle = document.createElement('p');
        bundleTitle.setAttribute('data-mvt-testid', 'protection-bundle-title');
        bundleTitle.textContent = 'Select a protection option or no protection to continue.';
        protBundleEl.insertAdjacentElement('afterbegin', bundleTitle);
      }
      // bundle price 
      const priceEl = protectionBundle.querySelector('[data-testid="checkout-ancillaries-bundle-price"]');
      const priceParentEl = priceEl.closest('.MuiBox-root');
      console.log('===> index.js:80 ~ priceParentEl', priceParentEl);

      // inject checkbox
      if (!mainControl.querySelector('.mvt-bundle-checkbox')) {
        const checkboxEl = document.createElement('input');
        checkboxEl.classList.add('mvt-bundle-checkbox');
        checkboxEl.type = 'checkbox';
        priceParentEl.prepend(checkboxEl)
      }

      //is control radio checked or not
      const controlRadioChecked = protectionBundle.querySelector('input[type="radio"]').checked;
      console.log('===> index.js:88 ~ controlRadioChecked', controlRadioChecked);
      const checkboxElFromDom = mainControl.querySelector('.mvt-bundle-checkbox');
      if (controlRadioChecked) {
        checkboxElFromDom.checked = true;
      }
      const protectionBundleSection = mainControl.querySelector('[data-mvt-testid="protection-bundle-section-container"]')
      console.log('===> index.js:229 ~ protectionBundleSection', protectionBundleSection);
      if (!mainControl.querySelector('[data-mvt-testid="protection-thanks-message"]')) {
        var thankMsgHtml = '<div data-mvt-testid="protection-thanks-message">'
          + '<p class="check-icon">' + thankSvg + '</p> '
          + '<p class="bold-text">Your protection is selected.</p> '
          + '<p class="light-text">Thank you for protecting your trip.</p>'
          + '</div>';
        protectionBundleSection.insertAdjacentHTML('afterend', thankMsgHtml);
      }

      const thankMsg = mainControl.querySelector('[data-mvt-testid="protection-thanks-message"]')
      if (controlRadioChecked) {
        thankMsg.classList.remove('hide-thanks-msg');
        thankMsg.classList.add('show-thanks-msg');
      } else {
        thankMsg.classList.remove('show-thanks-msg');
        thankMsg.classList.add('hide-thanks-msg');
      }

      const allProtBundles = mainControl.querySelectorAll('[data-mvt-testid="protection-bundle"]');
      console.log('===> index.js:105 ~ allProtBundles', allProtBundles);
      const bundleToClick = [...allProtBundles].find((bundle) => {
        const priceText = bundle.querySelector(
          '[data-testid="checkout-ancillaries-bundle-price"] p'
        );

        console.log('===> index.js:111 ~ ', extractPrice(priceText.textContent.trim()));

        return priceText && extractPrice(priceText.textContent.trim()) < 1;
      });
      console.log('===> index.js:113 ~ bundleToClick', bundleToClick);

      // event lister to checkbox
      checkboxElFromDom.addEventListener('change', (e) => {
        const isChecked = e.target.checked;
        console.log('===> index.js:91 ~ isChecked', isChecked);
        const radioInput = protectionBundle.querySelector('input[type="radio"]');
        const inputSpan = radioInput.closest('span')
        if (isChecked) {
          inputSpan.click();
        } else {
          if (bundleToClick) {
            const radioInput = bundleToClick.querySelector('input[type="radio"]');
            if (radioInput) {
              const inputSpan = radioInput.closest('span');

              // Click the span if it exists, otherwise click the input itself as a fallback
              if (inputSpan) {
                inputSpan.click();
              } else {
                radioInput.click();
              }
            }
          }
        }
      })
      // change design of the protection bundle card
      const bundleElTopRow = protectionBundle.querySelector('[data-mvt-testid="bundle-content"] > div');
      console.log('===> index.js:175 ~ bundleElTopRow', bundleElTopRow);
      if (bundleElTopRow && !bundleElTopRow.querySelector('.mvt-bundle-icon-wrapper')) {
        var bundleIconHtml = '<div class="mvt-bundle-icon-wrapper">'
          + '<span>' + bundleCarSvg + '</span>'
          + '</div>';
        bundleElTopRow.insertAdjacentHTML('afterbegin', bundleIconHtml)
      }
      const bundleNameWrapper = bundleElTopRow ? bundleElTopRow.querySelector('div:not(.mvt-bundle-icon-wrapper)') : null;
      if (bundleNameWrapper && !bundleNameWrapper.querySelector('.mvt-bundle-name-wrapper')) {
        bundleNameWrapper.classList.add('mvt-bundle-name-wrapper')
        if (!bundleNameWrapper.querySelector('.mvt-most-popular-bundle')) {
          var popularBundleHtml = '<p class="mvt-most-popular-bundle">'
            + '<span class="svg-span">' + mostPopularSvg + '</span>'
            + '<span>Most Popular Bundle</span>'
            + '</p>';
          bundleNameWrapper.insertAdjacentHTML('afterbegin', popularBundleHtml);
        }
      }

      const bundleSecondRaw = protectionBundle.querySelector('[data-mvt-testid="bundle-content"] > div:nth-child(2)')
      console.log('===> index.js:214 ~ bundleSecondRaw', bundleSecondRaw);
      if (bundleSecondRaw) {
        const featuresTextEl = bundleSecondRaw.querySelectorAll('[data-testid="CheckIcon"]');
        console.log('===> index.js:201 ~ featuresText', featuresTextEl);
        let featuresText = "";
        if (featuresTextEl.length) {
          featuresTextEl.forEach((el, idx) => {
            if (idx === 0) {
              featuresText = featuresText + el.nextElementSibling.textContent;
            } else {
              featuresText = featuresText + ' and ' + el.nextElementSibling.textContent;
            }
          })
        }
        if (featuresText) {
          featuresText = featuresText.replace(/\s*\([^)]*\)/g, '');
        }
        console.log('===> index.js:215 ~ featuresText', featuresText);
        bundleElTopRow.insertAdjacentHTML('afterend', '<p class="features-text">' + featuresText + '</p>')

        // body third row
        const bundleThirdRow = protectionBundle.querySelector('[data-mvt-testid="bundle-content"] > div:nth-child(4)')
        console.log('===> index.js:220 ~ bundleThirdRow', bundleThirdRow);
        var checkedItem1 = '<p><span class="icon-span">' + greenCheck + '</span><span>Coverage for vehicle damage and theft\u200b</span></p>';
        var checkedItem2 = '<p><span class="icon-span">' + greenCheck + '</span><span>No deductible, no out of pocket costs, no insurance claims for vehicle damage\u200b</span></p>';
        var checkedItem3 = '<p><span class="icon-span">' + greenCheck + '</span><span>24/7 towing, fuel and lockout support\u200b</span></p>';
        var checkedItemWrapper = '<div class="checked-item-wrapper">'
          + checkedItem1 + checkedItem2 + checkedItem3
          + '</div>';
        if (bundleThirdRow) {
          bundleThirdRow.insertAdjacentHTML('afterbegin', checkedItemWrapper);
          const priceSection = bundleThirdRow.querySelector('[data-testid="checkout-ancillaries-bundle-price"]');
          console.log('===> index.js:228 ~ priceSection', priceSection);
          if (priceSection) {
            const controlNewPrice = priceSection.querySelector('.MuiTypography-root.MuiTypography-body1');
            const contorlOldPrice = priceSection.querySelector('.MuiTypography-root.MuiTypography-bodySmallRegular');
            console.log('===> index.js:272 ~ controlOldPrice', contorlOldPrice);

            if (!priceSection.querySelector(".new-price-wrapper")) {
              var newPriceVal = controlNewPrice ? extractPrice(controlNewPrice.textContent.trim()) : NaN;
              var oldPriceVal = contorlOldPrice ? extractPrice(contorlOldPrice.textContent.trim()) : NaN;
              var discountTag = '';
              if (!isNaN(newPriceVal) && !isNaN(oldPriceVal) && oldPriceVal > 0) {
                var discountPct = Math.round((oldPriceVal - newPriceVal) / oldPriceVal * 100);
                console.log("discounct price ", discountPct)
                if (discountPct > 0) {
                  discountTag = '<span class="discount-tag">' + discountPct + '% Off</span>';
                }
              }
              console.log("discuontTagPrice", discountTag)
              var newPriceWrapHtml = '<div class="new-price-wrapper">'
                + '</div>'
                + '<div class="old-price-wrapper">'
                + '<p class="old-price-text"> ' + discountTag + '</p>'
                + '</div>';
              priceSection.insertAdjacentHTML('afterbegin', newPriceWrapHtml);
              const bundleCheckbox = priceSection.querySelector('input[type="checkbox"]');
              const priceWrap = priceSection.querySelector('.new-price-wrapper');
              if (priceWrap) {
                priceWrap.insertAdjacentElement('afterbegin', bundleCheckbox);
                if (controlNewPrice) {
                  const text = controlNewPrice.textContent.trim();
                  const match = text.match(/^(.*?)\s*\/\s*(.*?)$/);
                  if (match) {
                    const [, price, period] = match;
                    controlNewPrice.innerHTML = '<span class="mvt-price">' + price + '/</span>'
                      + '<span class="mvt-period">' + period + '</span>';
                  }
                  priceWrap.insertAdjacentElement('afterbegin', controlNewPrice)
                }
              }
              if (contorlOldPrice) {
                const oldPriceBase = priceSection.querySelector('.old-price-text');
                console.log('===> index.js:301 ~ oldPriceBase', oldPriceBase);
                oldPriceBase.insertAdjacentElement('afterbegin', contorlOldPrice);
              }
            }
          }
        }
      }

    }
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
        if(!document.querySelector('.mvt-prot-item-section-wrapper')){
          var protItemHeaderHtml =
            '<div class="mvt-prot-item-section-wrapper">' +
              '<div class="mvt-prot-item-header">' +
                '<div class="mvt-prot-item-header-left">' +
                  '<p class="mvt-prot-item-header-title">Customize Your Protection</p>' +
                  '<p class="mvt-prot-item-header-subtitle">Select coverage that is right for you.</p>' +
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
  function noProtectionDesign() {
    poll(
      () => document.querySelector('[data-mvt-testid="protection-item-section"]'),
      () => {
        const mainControl = document.querySelector('[data-mvt-injected="true"]');
        console.log('===> index.js:397 ~ mainControl', mainControl);
        const allProtBundles = mainControl.querySelectorAll('[data-mvt-testid="protection-bundle"]');
        console.log('===> index.js:105 ~ allProtBundles', allProtBundles);
        const bundleToClick = [...allProtBundles].find((bundle) => {
          const priceText = bundle.querySelector(
            '[data-testid="checkout-ancillaries-bundle-price"] p'
          );

          console.log('===> index.js:111 ~ ', extractPrice(priceText.textContent.trim()));

          return priceText && extractPrice(priceText.textContent.trim()) < 1;
        });
        console.log('===> index.js:113 ~ bundleToClick', bundleToClick);
        if (mainControl && bundleToClick && !mainControl.querySelector('.mvt-decline-protection-card')) {
          var declineProtectionCardHtml =
            '<div class="mvt-decline-protection-card">' +
            '<div class="mvt-decline-protection-icon">' +
            '<span>' + declinetProtSvg + '</span>' +
            '<span class="decline-prot-text">Decline Protection</span>' +
            '</div>' +
            '<div class="mvt-decline-protection-text">' +
            '<p>You won’t have any coverage for damage, theft, liability or personal belongings. ​</p>' +
            '</div>' +
            '<div class="mvt-decline-protection-link">' +
            '<div>' +
            '<div class="mvt-no-add-cost-wrapper">' +
            '<p class="mvt-decline-price"><span class="price-amount">$0.00 /</span><span class="per-day">day</span></p>' +
            '<p class="no-additional-cost-text">No Additional Cost</p>' +
            '</div>' +
            '<span><input class="mvt-decline-protection-checkbox" type="checkbox"></span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="mvt-decline-protection-warning">' +
            '<p>' + declineProWarningSvg + '</p>' +
            '<p>Without protection you will be responsible for damage, theft, liability, medical expenses, or loss - up to the full value of the vehicle.</p>' +
            '</div>';
          const protItemSectionEl = document.querySelector('.mvt-prot-item-section-wrapper');
          console.log('===> index.js:434 ~ protItemSectionEl', protItemSectionEl);
          if (protItemSectionEl) {
            protItemSectionEl.insertAdjacentHTML('afterend', declineProtectionCardHtml)
          }
        }

        const declinetProtCheckbox = document.querySelector('.mvt-decline-protection-checkbox');
        const mvtDeclineProtectionWarning = document.querySelector('.mvt-decline-protection-warning');
        const declincePriceEl = document.querySelector('.mvt-decline-price');
        if (declinetProtCheckbox) {
          declinetProtCheckbox.addEventListener('change', () => {
            console.log('===> index.js:458 ~ declinetProtCheckbox.checked', declinetProtCheckbox.checked);
            if (declinetProtCheckbox.checked) {
              console.log('===> index.js:495 ~ bundleClick', bundleToClick);
              const radioInput = bundleToClick.querySelector('input[type="radio"]');
              if (radioInput) {
                console.log('===> index.js:497 ~ ',);
                const inputSpan = radioInput.closest('span');

                // Click the span if it exists, otherwise click the input itself as a fallback
                if (inputSpan) {
                  console.log('===> index.js:502 ~ checkClick 1',);
                  inputSpan.click();
                } else {
                  console.log('===> index.js:505 ~ checkClick 2',);
                  radioInput.click();
                }
              }
              if (mvtDeclineProtectionWarning) {
                mvtDeclineProtectionWarning.classList.add('show-warning')
                declincePriceEl.classList.add('show-price')
              }
            } else {
              if (mvtDeclineProtectionWarning) {
                mvtDeclineProtectionWarning.classList.remove('show-warning')
                declincePriceEl.classList.remove('show-price')
              }
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
            + '<p class="mvt-add-on-section-header-title">Make Travel Easier</p>'
            + '<p class="mvt-add-on-section-header-subtitle">Save time on the road with convenient rental extras.</p>'
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
              if (cardDesc) {
                if (detailsBtn.nextElementSibling.tagName === 'P') {
                  cardDesc.classList.add('add-on-desc')
                  if (detailsBtn) {
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

              if (allCards.length > 3) {
                if (!mainControl.querySelector('.mvt-view-all-btn')) {
                  var viewAllBtnHtml = '<div class="mvt-view-all-btn hide">View all add-on items</div>';
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
          protItemSectionParent.style.display = 'none'
          protItemSectionParent.querySelector('.MuiGrid2-root').setAttribute('data-mvt-testid', 'protection-item-section');
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
      protSectionTitle.textContent = 'Travel with Confidence'
      if (!mainControl.querySelector('[data-mvt-testid="protection-sub-heading"]')) {
        const protSubHeading = document.createElement('p');
        protSubHeading.setAttribute('data-mvt-testid', 'protection-sub-heading')
        protSubHeading.textContent = 'Select the coverage that best fits your travel plans';
        protSectionTitle.insertAdjacentElement('afterend', protSubHeading)
      }
    }

    protectionBundleDesign(mainControl)
    //protection item design
    protectionItemDesign()
    // no protection design
    noProtectionDesign()
    // Add-on items design
    addOnItemsDesign()
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

  // Initialize
  waitForElem("body", initSPAObserver);
})();
