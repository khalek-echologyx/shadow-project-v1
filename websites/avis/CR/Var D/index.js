import addOnItemsSvgObj from "./addOnItemsSvgObj";
import { preferredPoint } from "./preferredPoint";

(() => {
  const TEST_ID = "MVT-36";
  /* -------------------- BOOKING API INTERCEPTOR -------------------*/
  (function () {
    var STORE_KEY = "reservation.store";
    var QUANTITY_CODES = { CSS: 1, CBS: 1, CFS: 1, CIS: 1, CSB: 1 };

    function getState() {
      try {
        var raw = window.sessionStorage.getItem(STORE_KEY);
        if (!raw) return null;
        var parsed = JSON.parse(raw);
        return (parsed && parsed.state) || null;
      } catch (e) {
        console.warn("[AvisTest] could not read store", e);
        return null;
      }
    }

    function splitCsv(s) {
      if (!s || typeof s !== "string") return [];
      return s
        .split(",")
        .map(function (v) {
          return v.trim();
        })
        .filter(Boolean);
    }

    function parseQuantity(raw, code) {
      if (raw === "false" || raw == null || raw === "") {
        return QUANTITY_CODES[code] ? 1 : null;
      }
      var n = parseInt(raw, 10);
      if (!isNaN(n)) return n;
      return QUANTITY_CODES[code] ? 1 : null;
    }

    function buildInjection() {
      var state = getState();
      if (!state) return {};
      var out = {};

      // 1. Protection bundle — only items where included === true
      var pb = state.protectionBundleSelected;
      if (pb && pb.code && pb.code !== "No Protection") {
        var includedItems = (pb.items || []).filter(function (i) {
          return i && i.included === true;
        });
        if (includedItems.length) {
          out.protectionBundle = {
            code: pb.code,
            items: includedItems.map(function (i) {
              return { code: i.code, policy: i.policy || "MANDATORY" };
            }),
          };
        }
      }

      // 2. Individual protection items
      var piCodes = splitCsv(state.protectionItems);
      if (piCodes.length) {
        out.protectionItems = piCodes.map(function (c) {
          return { code: c };
        });
      }

      // 3. Add-on items
      var aoCodes = splitCsv(state.addOnItems);
      var aoQtys = splitCsv(state.addOnItemsQuantity);
      if (aoCodes.length) {
        out.addOnItems = aoCodes.map(function (code, idx) {
          return { code: code, quantity: parseQuantity(aoQtys[idx], code) };
        });
      }

      return out;
    }

    function isBookingRequest(url) {
      try {
        return (
          new URL(url, location.origin).pathname === "/web/reservation/booking"
        );
      } catch (e) {
        return /\/web\/reservation\/booking($|\?)/.test(url);
      }
    }

    var originalFetch = window.fetch;
    window.fetch = function (input, init) {
      try {
        var url = typeof input === "string" ? input : input && input.url;
        var method = (init && init.method) || (input && input.method) || "GET";
        if (
          url &&
          isBookingRequest(url) &&
          method.toUpperCase() === "POST" &&
          init &&
          init.body
        ) {
          var payload = JSON.parse(init.body);
          var inj = buildInjection();
          if (inj.protectionBundle)
            payload.protectionBundle = inj.protectionBundle;
          if (inj.protectionItems) payload.protectionItems = inj.protectionItems;
          if (inj.addOnItems) payload.addOnItems = inj.addOnItems;
          init.body = JSON.stringify(payload);

        }
      } catch (e) {
        console.warn("[AvisTest] hook error", e);
      }
      return originalFetch.apply(this, arguments);
    };
  })();
  /* ---------------- poll utility ---------------- */
  function poll(condition, callback, timeout = 10000, interval = 50) {
    const start = Date.now();

    const check = () => {
      if (condition()) {
        callback();
      } else if (Date.now() - start < timeout) {
        setTimeout(check, interval);
      }
    };

    check();
  }
  
  const greenCheckForSum = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="10" viewBox="0 0 14 10" fill="none">'
    + '<path d="M13.2604 0.59375L4.55208 9.30208L0.59375 5.34375" stroke="#1EA238" stroke-width="1.1875" stroke-linecap="round" stroke-linejoin="round"/>'
    + '</svg>';
  const chevronForSum = '<span class="MuiAccordionSummary-expandIconWrapper mui-f8wb7g mvt-36-chevron"><svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium mui-1mvl9n0" focusable="false" aria-hidden="true" viewBox="0 0 14 12" width="14" height="12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.03858 9.37246C6.93964 9.37243 6.84505 9.33287 6.77491 9.26309L0.735845 3.26309C0.667266 3.19259 0.628885 3.09825 0.6294 2.9999C0.629914 2.90156 0.668974 2.80747 0.738286 2.7377C0.807599 2.66793 0.901664 2.62802 1.00001 2.62686C1.09835 2.62569 1.19322 2.66324 1.26417 2.73135L7.03711 8.46914L12.7344 2.7333C12.8049 2.66472 12.8992 2.62634 12.9976 2.62686C13.0959 2.62737 13.1905 2.66692 13.2603 2.73623C13.33 2.80555 13.3694 2.89912 13.3706 2.99746C13.3718 3.0958 13.3342 3.19068 13.2661 3.26162L7.30518 9.26162C7.23518 9.33217 7.1404 9.37241 7.04102 9.37295L7.03858 9.37246Z" fill="currentColor" stroke="currentColor" stroke-width="0.3"></path></svg></span>';
  //coverage rating object
  const coverageRatings = {
    none: 0,
    low: 1,
    medium: 2,
    high: 3
  }
  //redirect to review and book page
  function runProtectionCoverage() {
    const queryParams = window.location.search;
    window.location.replace("https://www.avis.com/en/reservation/review-and-book" + queryParams);

  }

  //reusable params function
  function getParams(paramKey) {
    const queryParams = window.location.search;
    const urlParams = new URLSearchParams(queryParams);
    return urlParams.get(paramKey);
  }
  //get protection & add-ons data
  async function getProtectionAndAddOnsData(dataKey, pickupLocation) {
    let res = await fetch("https://www.avis.com/content/admin/location.json/avis/en_us/" + dataKey + "/" + pickupLocation + ".json");
    let data = await res.json();
    return data.data || {};
  }
  //getSession data
  function getSessionData() {
    const sessionData = sessionStorage.getItem("reservation.store");
    return sessionData ? JSON.parse(sessionData).state : {};
  }
  //format time
  function pad2(n) { n = String(n); return n.length === 1 ? '0' + n : n; }
  function fmtTime(h, m, ampm) {
    if (h == null || m == null) return null;
    var hh = parseInt(h, 10);
    if (isNaN(hh)) return null;
    if (ampm) {
      var a = String(ampm).toUpperCase();
      if (a === 'PM' && hh !== 12) hh += 12;
      if (a === 'AM' && hh === 12) hh = 0;
    }
    return pad2(hh) + ':' + pad2(m);
  }
  //get corelational identifier
  function getCorelationalIdentifier() {
    const corelationalIdentifier = sessionStorage.getItem("correlationIdentifier");
    return corelationalIdentifier;
  }
  //get extras api data
  async function getExtrasData(payload, corelationalIdentifier) {
    try {
      let res = await fetch("https://www.avis.com/web/reservation/extras?context.locale=en-US&context.domainCountry=US&context.correlationIdentifier=" + corelationalIdentifier + "&device=WEB", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error("Extras API failed with status " + res.status);
      }
      let data = await res.json();
      return data;
    } catch (err) {
      console.error("Error fetching extras API:", err);
      return null;
    }
  }

  // calculate price api
  async function calculatePrice(payload, corelationalIdentifier) {
    let res = await fetch("https://www.avis.com/web/reservation/price/calculate?context.locale=en-US&context.domainCountry=US&context.correlationIdentifier=" + corelationalIdentifier + "&device=WEB", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    let data = await res.json();
    return data;
  }

  //get avis config data
  async function getAvisConfigData() {
    let res = await fetch("https://www.avis.com/en/.config.json");
    let data = await res.json();
    return data || {};
  }

  //get price with currenty fn
  const getPriceWithCurrenty = function (code, amount) {
    const formateAmount = Number(amount).toLocaleString("en", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    const symbol = function () {
      if (!code) return '$';
      return (0).toLocaleString("en", {
        style: "currency",
        currency: code
      }).replace(/[\d\s.,]/g, "");
    };

    return /[a-zA-Z]/.test(symbol())
      ? symbol() + ' ' + formateAmount
      : symbol() + formateAmount;
  };

  //prot and add-on item UI
  var protAndAddOnItemUIWrapper = '<div id="mvt-36-summary-prot" class="MuiAccordionDetails-root mui-u31f1m"></div>';
  var protAndAddOnItemUI = function (desc, amount, item, quantity, isAvisFirst) {
    var isGSO = item.code === "GSO";
    var gsoSpan = isGSO
      ? '<span class="est-price" style="display: block; color: rgb(82, 77, 77); font-size: 12px;">Est. USD ' + item.netSubtotalPerUnit + ' ' + (item.chargeType === "PER_GALLON" ? "/gal" : "/L") + '</span>'
      : '';
    return '<div class="MuiBox-root mui-q27lzn mvt-36-summary-prot-item">'
      + '<span class="checkout-redesign MuiTypography-root MuiTypography-bodySmallRegular mui-1xb6ox sum-prot-item-desc">'
      + greenCheckForSum + (quantity > 0 ? quantity : '') + ' ' + desc
      + gsoSpan
      + '</span>'
      + '<div class="MuiBox-root mui-u2acjg">'
      + '<span class="MuiTypography-root MuiTypography-bodySmallRegular mui-1izwyf7">' + (isGSO ? 'Market Price' : amount) + '</span>'
      + '</div>'
      + '</div>';
  };
  var savingAndDisItemUI = function (desc, amount) {
    return '<div class="mvt-36-summary-regular-item">'
      + '<span class="item-desc saving-desc">' + desc + '</span>'
      + '<div class="item-amount"><span class="">' + amount + '</span></div>'
      + '</div>';
  };

  var taxAndFeesItemUI = function (desc, amount, code, currencyCode) {
    return '<a href="https://www.avis.com/en/customer-service/faqs/usa/fees-taxes#' + code + '" target="_blank" class="mvt-36-summary-regular-item tax-and-fees-item">'
      + '<span class="item-desc">' + desc + '</span>'
      + '<div class="item-amount"><span class="">' + getPriceWithCurrenty(currencyCode, amount) + '</span></div>'
      + '</a>';
  };

  // Update protection & Add-On UI into summary
  const updateProtAndAddOnSection = (calculateData) => {
    const currencyCode = calculateData.currencyCode;
    const protTotal = getPriceWithCurrenty(currencyCode, calculateData.totals.rentalOptionsTotal.toFixed(2))
    const sessionData = getSessionData();
    const isAvisFirst = sessionData.isAvisFirst || false;
    const sessionPriceProtectionItems = sessionData.pricesProtectionItems || [];
    const sessionPriceAddOnItems = sessionData.pricesAddOnItems || [];
    const protAndAddOnsItems = [...sessionPriceProtectionItems, ...sessionPriceAddOnItems].filter(item => item.netSubtotal !== 0 || item.code === "GSO");

    //protection & add-ons header price
    const protAndAddOnsTotalHeader = document.querySelector('[data-testid="category-expand-button-protections-addons"]');
    const summaryWrapper = document.querySelector('[data-testid="rental-summary-wrapper"]')
    if (protAndAddOnsTotalHeader && protTotal && protAndAddOnsItems.length > 0) {
      if (summaryWrapper) {
        summaryWrapper.classList.add("mvt-36-summary-wrapper")
      }
    }
    if (protAndAddOnsTotalHeader) {
      const headerBtn = protAndAddOnsTotalHeader.querySelector("button");
      if (headerBtn) {
        const hasChevronIcon = headerBtn.querySelector("svg");
        if (!hasChevronIcon) {
          const buttonFirstSpan = headerBtn.querySelector("span")
          buttonFirstSpan.insertAdjacentHTML("afterend", chevronForSum);
        }
      }
    }
    const protectionAndAddOnsHeaderPrice = document.querySelector('[data-testid="rental-summary-protection-addons-recent-cost"]');
    protectionAndAddOnsHeaderPrice.textContent = protTotal || 0;
    const protAndAddOnItemListEl = document.querySelector('[aria-label="Protections & Add-ons"]');
    if (protAndAddOnItemListEl) {
      const existingEl = protAndAddOnItemListEl.querySelector(
        ':scope > .MuiAccordionDetails-root'
      );
      if (existingEl) {
        existingEl.remove();
      }
      protAndAddOnItemListEl.insertAdjacentHTML(
        "beforeend",
        protAndAddOnItemUIWrapper
      );
      const wrapper = document.querySelector('#mvt-36-summary-prot');
      protAndAddOnsItems.forEach((item) => {
        wrapper.insertAdjacentHTML(
          "beforeend",
          protAndAddOnItemUI(
            item.description,
            getPriceWithCurrenty(currencyCode, item.netSubtotal.toFixed(2)),
            item,
            item.quantity,
            isAvisFirst
          )
        );
      });
    }
  }

  //saving and discount UI logic
  const savingAndDiscountUI = (currencyCode, calculateData) => {
    // calculation
    const savingTotal = calculateData.savings.totalSavings ? Number(calculateData.savings.totalSavings) : 0;
    const savingAndDiscountTotal = getPriceWithCurrenty(currencyCode, savingTotal)
    const payNowSavings = Number(calculateData.savings.payNowSavings);
    const formatPayNowSavings = getPriceWithCurrenty(currencyCode, payNowSavings);
    const extrasSavings = Number(calculateData.savings.extrasSavings);
    const formatExtrasSavings = getPriceWithCurrenty(currencyCode, extrasSavings);
    const discountCodeSavings = Number(calculateData.savings.discountCodeSavings);
    const formatDiscountCodeSavings = getPriceWithCurrenty(currencyCode, discountCodeSavings);
    const memberCreditAmt = Number(calculateData.savings.memberCreditAmt);
    const formatMemberCreditAmt = getPriceWithCurrenty(currencyCode, memberCreditAmt);
    // header price update
    const savingAndDiscountHeader = document.querySelector('[data-testid="category-expand-button-savings-discounts"]');
    const summaryWrapper = document.querySelector('[data-testid="rental-summary-wrapper"]');
    if (savingAndDiscountHeader && summaryWrapper) {
      if (!summaryWrapper.classList.contains("mvt-36-summary-wrapper") && Number(savingTotal) > 0) {
        summaryWrapper.classList.add("mvt-36-summary-wrapper")
      }
    }
    //arrow update
    if (savingAndDiscountHeader && savingTotal > 0) {
      const headerBtn = savingAndDiscountHeader.querySelector("button");
      if (headerBtn) {
        const hasChevronIcon = headerBtn.querySelector("svg");
        if (!hasChevronIcon) {
          const buttonFirstSpan = headerBtn.querySelector("span")
          buttonFirstSpan.insertAdjacentHTML("afterend", chevronForSum);
        }
      }
    }
    const savingAndDiscountEl = document.querySelector('[data-testid="rental-summary-savings-discounts-recent-cost"]');
    if (savingAndDiscountEl) {
      savingAndDiscountEl.textContent = savingAndDiscountTotal || 0;
    }
    const savingAndDisItemContainer = document.querySelector('[aria-label="Savings & discounts"]');
    if (savingAndDisItemContainer) {
      const existingEl = savingAndDisItemContainer.querySelector(
        ':scope > .MuiAccordionDetails-root'
      );
      if (existingEl) {
        existingEl.remove();
      }
      const existingElCustom = savingAndDisItemContainer.querySelector(
        '#mvt-36-summary-saving'
      );

      if (existingElCustom) {
        existingElCustom.remove();
      }
      var savingAndDiscountUIWrapper = '<div id="mvt-36-summary-saving" class="accordion-wrapper">'
        + (payNowSavings ? savingAndDisItemUI("Pay Now Savings", formatPayNowSavings) : "")
        + (extrasSavings ? savingAndDisItemUI("Protection & Add-ons Savings", formatExtrasSavings) : "")
        + (discountCodeSavings ? savingAndDisItemUI("Discount Code Savings", formatDiscountCodeSavings) : "")
        + (memberCreditAmt ? savingAndDisItemUI("Member Credit", formatMemberCreditAmt) : "")
        + '</div>';
      savingAndDisItemContainer.insertAdjacentHTML("beforeend", savingAndDiscountUIWrapper);
    }
  }
  // tax and fees UI and logic
  const taxAndFeesUI = (currencyCode, calculateData) => {

    const taxesAndFeesTotal = getPriceWithCurrenty(currencyCode, calculateData.totals.taxAndFreeTotal);
    const taxAndFeesItems = calculateData.taxAndFeeItems || [];
    //Updte UI
    const taxAndFeesHeader = document.querySelector('[data-testid="category-expand-button-taxes-fees"]');
    const summaryWrapper = document.querySelector('[data-testid="rental-summary-wrapper"]');
    if (taxAndFeesHeader && summaryWrapper) {
      if (!summaryWrapper.classList.contains("mvt-36-summary-wrapper") && taxAndFeesItems.length > 0) {
        summaryWrapper.classList.add("mvt-36-summary-wrapper")
      }
    }
    //arrow update
    if (taxAndFeesHeader && taxAndFeesItems.length > 0) {
      const headerBtn = taxAndFeesHeader.querySelector("button");
      if (headerBtn) {
        const hasChevronIcon = headerBtn.querySelector("svg");
        if (!hasChevronIcon) {
          const buttonFirstSpan = headerBtn.querySelector("span")
          buttonFirstSpan.insertAdjacentHTML("afterend", chevronForSum);
        }
      }
    }
    const taxAndFeesHeaderPrice = document.querySelector('[data-testid="rental-summary-taxes-fees-recent-cost"]');
    if (taxAndFeesHeaderPrice) {
      taxAndFeesHeaderPrice.textContent = taxesAndFeesTotal || 0;
    }
    const taxAndFeesItemContainer = document.querySelector('[aria-label="Taxes & Fees"]');
    if (taxAndFeesItemContainer) {
      const existingEl = taxAndFeesItemContainer.querySelector(
        ':scope > .MuiAccordionDetails-root'
      );
      if (existingEl) {
        existingEl.remove();
      }
      const existingElCustom = taxAndFeesItemContainer.querySelector(
        '#mvt-36-summary-tax-and-fees'
      );
      if (existingElCustom) {
        existingElCustom.remove();
      }
      var taxAndFeesUIWrapper = '<div id="mvt-36-summary-tax-and-fees" class="accordion-wrapper">'
        + (taxAndFeesItems.length > 0 ? taxAndFeesItems.map(function (item) {
          return taxAndFeesItemUI(item.description, item.amount, item.code, currencyCode);
        }).join('') : "")
        + '</div>';
      taxAndFeesItemContainer.insertAdjacentHTML("beforeend", taxAndFeesUIWrapper);
    }

  }
  const rateTermsUI = (calculateData) => {

    const rateData = calculateData.rateTerms || {};
    const rateNoteUI = document.querySelectorAll('[data-testid="rate-terms-notes-ul"] li');
    rateNoteUI.forEach(el => {

      const text = el.querySelector('span').textContent;

      if (text.includes('Day  minimum rental required')) {
        const textEl = el.querySelector('span');
        if (textEl) {
          textEl.textContent = rateData.minRequiredDays + ' Day  minimum rental required.';
        }
      } else if (text.includes('hours maximum rental allowed')) {
        const textEl = el.querySelector('span');
        if (textEl) {
          textEl.textContent = rateData.maxAllowedDays + ' Days ' + rateData.maxAllowedHours + ' hours maximum rental allowed.';
        }
      } else if (text.includes('If you need to cancel 24 hours')) {
        const textEl = el.querySelector('span');
        if (textEl) {
          textEl.textContent = 'If you need to cancel 24 hours prior to the scheduled pick-up time, we will refund the full prepaid amount less a ' + rateData.cancelFeeBefore24h + ' processing fee.';
        }
      } else if (text.includes('If you need to cancel during the 24 hour')) {
        const textEl = el.querySelector('span');
        if (textEl) {
          textEl.textContent = 'If you need to cancel during the 24 hour period prior to the scheduled pick-up time, we will refund the full prepaid amount less a ' + rateData.cancelFeeWithin24h + ' processing fee.';
        }
      }
    })
    const selectorForUnlimiteMilage = document.querySelector('[data-testid="rate-terms-notes-ul"]');
    if (selectorForUnlimiteMilage) {
      const hasUltimateEl = selectorForUnlimiteMilage.nextElementSibling;

      const enableMilate = rateData.unlimitedMilage;
      if (enableMilate) {
        if (!hasUltimateEl.textContent.includes("Unlimited Mileage")) {
          var unlimitedMilageUI = '<p class="MuiTypography-root MuiTypography-body1 mui-1kvhqhg"><svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium mui-toqf8" focusable="false" aria-hidden="true" viewBox="0 0 11 9"><path d="M1 4L4 7L10 1" stroke-linecap="round" fill="none"></path></svg>Unlimited Mileage</p>';
          selectorForUnlimiteMilage.insertAdjacentHTML("afterend", unlimitedMilageUI);
        }
      }
    }
  }
  const footerPriceUI = (currencyCode, calculateData) => {
    const footerPriceEl = document.querySelector('[data-testid="action-footer-total-amount"]');
    if (footerPriceEl) {
      footerPriceEl.textContent = getPriceWithCurrenty(currencyCode, calculateData.totals.total.toFixed(2));
    }
  }

  const updateProtectionCards = (calculateData) => {
    const selectedBundle = calculateData.protectionBundle || {};
    const selectedBundleName = selectedBundle.code || "";

    const uiProtectionBundleCards = [...document.querySelectorAll("." + TEST_ID + " .prot-card"), document.querySelector("#" + TEST_ID + " .intial-prot-cards .static-no-prot-card")];
    const uiSelectedProtBundle = uiProtectionBundleCards.find(card => card.getAttribute("data-code") === selectedBundleName);

    if (uiSelectedProtBundle && selectedBundleName !== "") {
      uiProtectionBundleCards.forEach(card => {
        card.classList.remove("selected");
      })
      uiSelectedProtBundle.classList.add("selected");
    }
  }
  const updateAddOnsCards = (extrasAddOnsItemList) => {
    const addOnCardsCheckbox = document.querySelectorAll("#" + TEST_ID + " .add-on-toggle");
    const sessionData = getSessionData();
    const selectedProtBundle = sessionData.protectionBundleSelected || {};
    const selectedBundleItems = Object.keys(selectedProtBundle).length > 0 ? selectedProtBundle.items.filter(item => item.included) : [];

    const pricesAddOnItems = sessionData.pricesAddOnItems || [];

    const isAvistFirst = sessionData.isAvisFirst || false;

    addOnCardsCheckbox.forEach(checkbox => {
      const dataCode = checkbox.querySelector("input").getAttribute("data-code");

      const isGSO = dataCode === "GSO";
      const isIncluded = selectedBundleItems.some(item => item.code === dataCode);
      const targetAddOnCard = checkbox.closest(".add-on-card");
      if (isIncluded) {
        targetAddOnCard.classList.add("included-in-bundle")
      } else {
        targetAddOnCard.classList.remove("included-in-bundle")
      }
      const isSelected = pricesAddOnItems.some(item => item.code === dataCode);

      if (isAvistFirst && isSelected && isGSO) {
        targetAddOnCard.classList.add("included")
        targetAddOnCard.classList.remove("selected")
      } else if (isSelected) {
        targetAddOnCard.classList.add("selected")
        targetAddOnCard.classList.remove("included")
      } else {
        targetAddOnCard.classList.remove("selected")
        targetAddOnCard.classList.remove("included")
      }
      // update price
      const priceEl = targetAddOnCard ? targetAddOnCard.querySelector(".price-info") : null;
      if (!priceEl || !dataCode) return;
      const perDayEl = priceEl.querySelector(".per-day-slash");
      const currency = (sessionData && sessionData.userSelectedCurrency) ? sessionData.userSelectedCurrency : "USD";

      // helper: safely replace only the text node in priceEl =
      function updatePriceText(formattedPrice) {
        try {
          priceEl.childNodes.forEach(function (node) {
            if (node.nodeType === Node.TEXT_NODE) node.remove();
          });
          priceEl.insertBefore(document.createTextNode(formattedPrice + " "), perDayEl || null);
        } catch (e) { }
      }

      const sessionItem = (pricesAddOnItems && pricesAddOnItems.length > 0)
        ? pricesAddOnItems.find(function (item) { return item.code === dataCode; })
        : null;

      if (sessionItem) {
        var unitPrice = (sessionItem.netSubtotalPerUnit !== undefined && sessionItem.netSubtotalPerUnit !== null)
          ? sessionItem.netSubtotalPerUnit
          : (sessionItem.netSubtotal || 0);
        updatePriceText(getPriceWithCurrenty(currency, unitPrice));
      } else {
        var extrasItem = (extrasAddOnsItemList && extrasAddOnsItemList.length > 0)
          ? extrasAddOnsItemList.find(function (item) { return item.code === dataCode; })
          : null;
        var fallbackPrice = (extrasItem && extrasItem.netSubtotal != null) ? extrasItem.netSubtotal : 0;
        updatePriceText(getPriceWithCurrenty(currency, fallbackPrice));
      }
    })
  }
  const updateProtectionItemsCards = (extrasProtectionItemList) => {
    const sessionData = getSessionData();
    const pricesProtectionItems = sessionData.pricesProtectionItems || [];
    const protectionItemBackup = sessionData.protectionItemsBackup;
    const protItemsBackupArray = protectionItemBackup ? protectionItemBackup.split(",") : [];
    const selectedProtBundleItems = sessionData.protectionBundleItems || "";
    const selectedProtBundleItemsArray = selectedProtBundleItems.split(",") || [];
    const protItemsUI = [...document.querySelectorAll("#" + TEST_ID + " .protection-item")];
    protItemsUI.forEach(item => {
      const dataCode = item.getAttribute("data-code");
      const isSelected = protItemsBackupArray.includes(dataCode);
      const itemInputField = item.querySelector("input");
      if (isSelected) {
        item.classList.add("selected")
        if (itemInputField) itemInputField.checked = true;
      }
      if (selectedProtBundleItemsArray.includes(dataCode)) {
        item.classList.add("included-in-bundle")
      }
      if (!isSelected && !selectedProtBundleItemsArray.includes(dataCode)) {
        item.classList.remove("selected")
        item.classList.remove("included-in-bundle")
        if (itemInputField) itemInputField.checked = false;
      }
      //update UI price
      const priceEl = item.querySelector(".price-info");
      if (!priceEl || !dataCode) return;
      const perDayEl = priceEl.querySelector(".per-day-slash");
      const currency = (sessionData && sessionData.userSelectedCurrency) ? sessionData.userSelectedCurrency : "USD";
      function updatePriceText(formattedPrice) {
        try {
          priceEl.childNodes.forEach(function (node) {
            if (node.nodeType === Node.TEXT_NODE) node.remove();
          });
          priceEl.insertBefore(document.createTextNode(formattedPrice + " "), perDayEl || null);
        } catch (e) { }
      }
      const sessionItem = (pricesProtectionItems && pricesProtectionItems.length > 0)
        ? pricesProtectionItems.find(function (item) { return item.code === dataCode; })
        : null;
      if (sessionItem) {
        var unitPrice = (sessionItem.netSubtotalPerUnit !== undefined && sessionItem.netSubtotalPerUnit !== null)
          ? sessionItem.netSubtotalPerUnit
          : 0;
        updatePriceText(getPriceWithCurrenty(currency, unitPrice));
      } else {
        var extrasItem = (extrasProtectionItemList && extrasProtectionItemList.length > 0)
          ? extrasProtectionItemList.find(function (item) { return item.code === dataCode; })
          : null;
        var fallbackPrice = (extrasItem && extrasItem.netSubtotal != null) ? extrasItem.netSubtotal : 0;
        updatePriceText(getPriceWithCurrenty(currency, fallbackPrice));
      }
    })
    if (protItemsBackupArray.length > 0) {
      const staticNoProtCard = document.querySelector("#" + TEST_ID + " .static-no-prot-card");
      staticNoProtCard.classList.remove("selected")
    }
  }
  const updateStaticProtectionCard = () => {
    const sessionData = getSessionData();
    const selectedProtBundle = sessionData.protectionBundleSelected || {};
    const selectedProtBungleCode = selectedProtBundle.code || sessionData.protectionBundleCode || "";

    const isSelectedNoProt = selectedProtBungleCode === "No Protection";
    const protectionItemBackup = sessionData.protectionItemsBackup;
    const protItemsBackupArray = protectionItemBackup ? protectionItemBackup.split(",") : [];

    const staticNoProtCard = document.querySelector("#" + TEST_ID + " .static-no-prot-card");
    if (isSelectedNoProt && protItemsBackupArray.length === 0) {
      staticNoProtCard.classList.add("selected")
    } else {
      staticNoProtCard.classList.remove("selected")
    }
  }
  const removePwpToggle = (code) => {
    const addOnItemsWithPwpToggle = document.querySelectorAll("#" + TEST_ID + ' .pwp-addon-pts-toggle');
    addOnItemsWithPwpToggle.forEach(item => {
      const itemToggleInput = item.querySelector("input");
      if (itemToggleInput && itemToggleInput.getAttribute('data-pwp-code') === code) {
        const toggleLabelEl = itemToggleInput.parentElement;
        if (toggleLabelEl && itemToggleInput.checked) {
          toggleLabelEl.click();
        }
      }
    });
  }

  // =========== UPDATE UI: Car summary and Footer Price
  const updateCarSummaryAndFooterPrice = (calculateData, extrasAddOnsItemList, extrasProtectionItemList) => {

    const currencyCode = calculateData.currencyCode;
    // ================= PROTECTION & ADD-ONS =================
    updateProtAndAddOnSection(calculateData)
    // Summary total price update
    const totalPriceEl = document.querySelector('[data-testid="rental-summary-total-value"]');
    if (totalPriceEl) {
      totalPriceEl.textContent = getPriceWithCurrenty(currencyCode, calculateData.totals.total.toFixed(2)) || 0;
    }
    // protecton not included title logic
    const noProtOrAddOnsTitle = document.querySelector('[data-testid="category-expand-button-protections-addons"]').nextSibling;

    if (noProtOrAddOnsTitle) {
      if (noProtOrAddOnsTitle.textContent = 'You have not added any protections or add-ons') {
        noProtOrAddOnsTitle.style.display = "none";
      }
    }
    // =============== SAVING & DISCOUNT ===============
    savingAndDiscountUI(currencyCode, calculateData);
    // =============== TAXES & FEES ===============
    taxAndFeesUI(currencyCode, calculateData);
    // =============== RATE TERMS ===============
    rateTermsUI(calculateData);
    // =============== FOOTER PRICE =============
    footerPriceUI(currencyCode, calculateData)
    // =============== UPDATE PROTECTION CARDS =============
    updateProtectionCards(calculateData)
    // =============== UPDATE ADD-ONS CARDS =============
    updateAddOnsCards(extrasAddOnsItemList)
    // =============== UPDATE PROTECTION ITEMS CARDS =============
    updateProtectionItemsCards(extrasProtectionItemList)
    // =============== STATIC PROTECTION SELECTED =============
    updateStaticProtectionCard()
  }
  const getPayloadForCalculate = (sessionData) => {
    //Create calculate api payload
    const protectionItemsForCalc = sessionData.protectionItemsBackup ? sessionData.protectionItemsBackup.split(",").map(item => {
      return {
        code: item || "",
      }
    }) : [];

    const addOnItemsForCalc = sessionData.addOnItemsBackup ? sessionData.addOnItemsBackup.split(",").map((item, index) => {
      return {
        code: item || "",
        quantity: sessionData.addOnItemsQuantity.split(",")[index] === "false" ? null : Number(sessionData.addOnItemsQuantity.split(",")[index]) || "",
      }
    }) : [];
    //store Protection Bundles
    const storeProtectionBundle = sessionData.protectionBundleSelected || {};
    const hasProtectionCode = storeProtectionBundle?.code;
    //store AddOn Bundles
    const storeAddOnBundle = sessionData.addOnBundleSelected || {};
    const hasAddOnBundleCode = storeAddOnBundle?.code;
    const calculatePayload = {
      age: Number(sessionData.age) || 25,
      countryOfResidence: sessionData.residencyValue,
      currencyCode: sessionData.userSelectedCurrency,
      discountCodes: [],
      dropoffDate: sessionData.returnDatetime.split("T")[0],
      dropoffTime: fmtTime(sessionData.returnHour, sessionData.returnMinute, sessionData.returnAmPm),
      dropoffLocation: sessionData.returnLocationCode,
      pickupDate: sessionData.pickupDatetime.split("T")[0],
      pickupTime: fmtTime(sessionData.pickupHour, sessionData.pickupMinute, sessionData.pickupAmPm),
      pickupLocation: sessionData.pickupLocationCode,
      priceRateCode: sessionData.priceRateCode,
      priceType: sessionData.priceType || "",
      priceView: sessionData.priceView || "LOWEST_PRICE",
      isAvisFirst: sessionData.isAvisFirst,
      vehicleCode: sessionData.vehicleCode,
      vehicleId: sessionData.vehicleId,
      protectionItems: protectionItemsForCalc,
      addOnItems: addOnItemsForCalc,
    };
    if (sessionData.awdCode) {
      const awdCodeObj = {
        type: "PARTNER",
        value: sessionData.awdCode,
      };
      if (sessionData.awdCodeMembershipId) {
        awdCodeObj.membershipID = sessionData.awdCodeMembershipId;
      }
      calculatePayload.discountCodes.push(awdCodeObj);
    }
    if (sessionData.couponCode) {
      const couponCodeObj = {
        type: "COUPON",
        value: sessionData.couponCode
      };
      calculatePayload.discountCodes.push(couponCodeObj);
    }
    if (sessionData.rateCode) {
      const rateCodeObj = {
        type: "RATE",
        value: sessionData.rateCode
      };
      calculatePayload.discountCodes.push(rateCodeObj);
    }
    if (hasProtectionCode) {
      const items = (storeProtectionBundle.items || [])
        .filter(item => item.included)
        .map(item => ({
          code: item.code || "",
          policy: item.policy || ""
        }));

      calculatePayload.protectionBundle = {
        code: storeProtectionBundle.code,
        items
      };
    }
    if (hasAddOnBundleCode) {
      calculatePayload.addOnBundle = {
        code: storeAddOnBundle.code,
        items: storeAddOnBundle.items.map(item => ({
          code: item.code || "",
        }))
      };
    }

    return calculatePayload;
  }
  // =============== INTIAL SELECTION UI ===============
  const initalSelectUI = async (extrasProtectionItemList, extrasAddOnsItemList, protectionItems, finalAddOnItemList, finalProtectionBundleList, corelationalIdentifier) => {
    const isEmptyProtectionBundleList = finalProtectionBundleList.length === 0;
    //get calculate payload
    const sessionData = getSessionData();
    const calculatePayload = getPayloadForCalculate(sessionData);

    // //Call calculatePrice API
    const calculateData = await calculatePrice(calculatePayload, corelationalIdentifier);

    const windowPriceAddOnList = calculateData.addOnItems || [];
    const windowPriceProtectionList = calculateData.protectionItems || [];
    // =============== PROTECTION BUNDLE SELECTION ===============
    if (isEmptyProtectionBundleList) {
      const viewAllPkgBtn = document.querySelector("." + TEST_ID + " .prot-all-packages");
      viewAllPkgBtn.style.display = "none";
    }

    const selectedProtBundle = sessionData.protectionBundleSelected || {};
    const selectedProtBundleName = selectedProtBundle.code || "";
    const uiProtectionBundleCards = [...document.querySelectorAll("." + TEST_ID + " .prot-card")];
    const uiSelectedProtBundle = uiProtectionBundleCards.find(card => card.getAttribute("data-code") === selectedProtBundleName);
    if (uiSelectedProtBundle && selectedProtBundleName !== "") {
      uiProtectionBundleCards.forEach(card => {
        card.classList.remove("selected");
      })
      uiSelectedProtBundle.classList.add("selected");
    }
    // =============== PROTECTION ITEM SELECTION ===============
    // =============== ADD-ON BUNDLE SELECTION ===============
    // =============== ADD-ON ITEM SELECTION ===============

    //quantity 
    if (sessionData) {
      const newProtectionItems = windowPriceProtectionList.map(item => {
        return {
          amount: extrasProtectionItemList.find(i => i.code === item.code).netTotal,
          chargeType: item.chargeType,
          code: item.code,
          description: protectionItems.find(i => i.code === item.code).name || "",
          discount: extrasProtectionItemList.find(i => i.code === item.code).discount || 0,
          grossSubtotal: extrasProtectionItemList.find(i => i.code === item.code).grossSubtotal,
          netSubtotal: item.netSubtotal,
          netSubtotalPerUnit: item.netSubtotalPerUnit,
          rentalItemUnits: item.rentalItemUnits,
        }
      })
      const newAddOnItems = windowPriceAddOnList.map(item => {
        const isGSO = item.code === "GSO";
        const getDesc = finalAddOnItemList.find(i => i.code === item.code).name || "";

        return {
          amount: extrasAddOnsItemList.find(i => i.code === item.code).netTotal,
          chargeType: item.chargeType,
          code: item.code,
          description: isGSO ? "Hassle-free Fuel Service" : getDesc,
          discount: extrasAddOnsItemList.find(i => i.code === item.code).discount || 0,
          grossSubtotal: extrasAddOnsItemList.find(i => i.code === item.code).grossSubtotal,
          displayElement: item.displayElement,
          netSubtotal: item.netSubtotal,
          netSubtotalPerUnit: item.netSubtotalPerUnit,
          rentalItemUnits: item.rentalItemUnits,
          quantity: item.quantity || 0,
        }
      })

      sessionData.pricesAddOnItems = newAddOnItems;
      sessionData.pricesProtectionItems = newProtectionItems;
      sessionStorage.setItem("reservation.store", JSON.stringify({ state: sessionData, version: 0 }));

      const sessionPricesAddOnItems = sessionData.pricesAddOnItems || [];

      // update quantity selector
      const quantityAddOnItems = document.querySelectorAll("." + TEST_ID + " .add-on-card .quantity-selector");
      quantityAddOnItems.forEach(item => {
        item.closest(".add-on-card").classList.add("default");
        const itemCode = item.getAttribute("data-code");
        const itemMaxQuantity = Number(item.getAttribute("data-max-quantity"));

        if (sessionPricesAddOnItems.length > 0) {
          const itemData = sessionPricesAddOnItems.find(el => el.code === itemCode) || {};

          if (itemData) {
            item.querySelector(".quantity-input").value = itemData.quantity || 0;
            if (itemData.quantity > 0) {
              item.closest(".add-on-card").classList.remove("default");
            }
            if (itemData.quantity === itemMaxQuantity) {
              item.closest(".add-on-card").classList.add("ab-max-qty");
            }
          }
        }
      })
      // checkbox UI update
      const checkboxAddOnItems = document.querySelectorAll("." + TEST_ID + " .add-on-card .add-on-toggle");
      checkboxAddOnItems.forEach(item => {
        const inputEl = item.querySelector("input");
        const itemCode = inputEl.getAttribute("data-code");
        const itemData = sessionPricesAddOnItems.some(el => el.code === itemCode);

        const isGSO = itemCode === "GSO";
        const isAvistFirst = sessionData.isAvisFirst || false;
        if (isAvistFirst && itemData && isGSO) {
          inputEl.checked = true;
          item.closest(".add-on-card").classList.add("included")
        } else if (itemData) {
          inputEl.checked = true;
          item.closest(".add-on-card").classList.add("selected")
        } else {
          inputEl.checked = false;
          item.closest(".add-on-card").classList.remove("selected")
          item.closest(".add-on-card").classList.remove("included")
        }
      })
      updateProtAndAddOnSection(calculateData)
      updateAddOnsCards(extrasAddOnsItemList);
      updateProtectionItemsCards(extrasProtectionItemList);
      updateStaticProtectionCard();
    }
  }

  let globalObserver = null;
  let isInjectionInProgress = false;

  async function runReviewAndBook() {
    const SELECTORS = {
      target: '[data-testid="rc-title"]'
    };
    //Get pickup location
    const pickupLocation = getParams("pickup_location_code").toLowerCase() || "";
    // Get Residency value
    const residClean = getParams("residency_value") || "";
    const residNotUSA = residClean !== 'US' && residClean !== '';


    //Get protection data 
    let rowProtectionData = await getProtectionAndAddOnsData("protections", pickupLocation);

    const protectionItems = rowProtectionData?.protectionReferencesList?.items[0]?.protectionList || [];

    const protectionBundleList = rowProtectionData?.protectionBundleList?.items || [];

    const sanitizedProtectionBundleList = protectionBundleList.map((item) => {
      const includeItems = item?.includedProtections?.map(el => {
        return {
          code: el?.code || "",
          policy: el?.policy === "required" ? "MANDATORY" : "OPTIONAL"
        }
      })
      return {
        code: item?.bundleName || "",
        items: includeItems,
      };
    });



    //Get add-ons data
    let rowAddOnsData = await getProtectionAndAddOnsData("add-ons", pickupLocation);
    let concattedAddOnsList = [];
    rowAddOnsData?.addOnCategoryList?.items?.forEach(item => {
      concattedAddOnsList.push(...item?.addOnList)
    });

    const addOnsBundleList = rowAddOnsData?.addOnBundleList?.items || [];

    const sanitizedAddOnsBundleList = addOnsBundleList.map((item) => {
      const includeItems = item?.includedAddons?.map(el => {
        return {
          code: el?.code || "",
        }
      })
      return {
        code: item?.bundleName || "",
        items: includeItems,
      };
    });

    //Get session data
    let sessionData = getSessionData();
    const pickupUSA = sessionData.pickupCountryCode === "US";

    const extrasAPIPayload = {
      pickupLocation: sessionData.pickupLocationCode,
      dropoffLocation: sessionData.returnLocationCode,
      pickupDate: sessionData.pickupDatetime.split("T")[0],
      pickupTime: fmtTime(sessionData.pickupHour, sessionData.pickupMinute, sessionData.pickupAmPm),
      dropoffDate: sessionData.returnDatetime.split("T")[0],
      dropoffTime: fmtTime(sessionData.returnHour, sessionData.returnMinute, sessionData.returnAmPm),
      age: Number(sessionData.age) || 25,
      discountCodes: [],
      priceView: sessionData.priceView || "LOWEST_PRICE",
      countryOfResidence: sessionData.residencyValue,
      currencyCode: sessionData.userSelectedCurrency,
      vehicleCode: sessionData.vehicleCode,
      vehicleId: sessionData.vehicleId,
      priceRateCode: sessionData.priceRateCode,
      priceType: sessionData.priceType,
      protectionBundles: sanitizedProtectionBundleList.length > 0 ? sanitizedProtectionBundleList : [],
      addOnBundles: sanitizedAddOnsBundleList.length > 0 ? sanitizedAddOnsBundleList : [],
      isAvisFirst: sessionData.isAvisFirst
    }
    if (sessionData.awdCode) {
      const awdCodeObj = {
        type: "PARTNER",
        value: sessionData.awdCode,
      };
      if (sessionData.awdCodeMembershipId) {
        awdCodeObj.membershipID = sessionData.awdCodeMembershipId;
      }
      extrasAPIPayload.discountCodes.push(awdCodeObj);
    }
    if (sessionData.couponCode) {
      const couponCodeObj = {
        type: "COUPON",
        value: sessionData.couponCode
      };
      extrasAPIPayload.discountCodes.push(couponCodeObj);
    }
    if (sessionData.rateCode) {
      const rateCodeObj = {
        type: "RATE",
        value: sessionData.rateCode
      };
      extrasAPIPayload.discountCodes.push(rateCodeObj);
    }
    const corelationalIdentifier = getCorelationalIdentifier();
    // ====================== GET EXTRAS DATA

    const extrasData = await getExtrasData(extrasAPIPayload, corelationalIdentifier);


    if (!extrasData) {
      console.warn("Extras API failed. Aborting VWA test script for this session to prevent broken UI.");
      return;
    }

    //Get currency code
    const currencyCode = extrasData?.currencyCode || "USD";


    //Get avis config data
    const avisConfigData = await getAvisConfigData();


    // PROTECTION SANITIZATION
    const extrasProtectionItemList = extrasData?.protectionItems || [];
    const extrasProtectionBundleList = extrasData && extrasData?.protectionBundles || [];

    const filteredProtectionItemList = protectionItems
      .map(item => {
        const matched = extrasProtectionItemList.find(
          protection => protection.code === item.code
        );

        // if not found → skip this item
        if (!matched) return null;

        return {
          ...item,
          netSubtotal: matched.netSubtotal || 0,
          freeCDWIndicator: matched.freeCDWIndicator || false,
        };
      })
      .filter(Boolean);
    //final protection item list
    const hideItems = ['ALI', 'CDW'];
    const protectionOrderList = ["CDW", "ALI", "PAI", "PEP"]
    const finalProtectionItemList = filteredProtectionItemList.filter(item => {
      // keep only enabled items first
      if (!item.enabled) return false;

      // if not USA → remove items in hideItems
      if (pickupUSA && residNotUSA && hideItems.includes(item.code)) {
        return false;
      }

      return true;
    }).sort((a, b) => protectionOrderList.indexOf(a.code) - protectionOrderList.indexOf(b.code));

    //has free cdw
    var hasFreeCDW = finalProtectionItemList.some(function (item) {
      return item.freeCDWIndicator === true || item.netSubtotal === 0;
    });

    // final protection bundle list
    const orderList = ["No Protection", "Essential Protection", "Enhanced Protection", "Ultimate Protection"]
    const finalProtectionBundleList = protectionBundleList.filter(item => {
      return extrasProtectionBundleList.some(ex => ex.code === item.bundleName);
    }).map(item => {
      const exProtBundle = extrasProtectionBundleList.find(
        ex => ex.code === item.bundleName
      );
      return {
        ...item,
        grossSubtotal: exProtBundle?.grossSubtotal || 0,
        grossTotal: exProtBundle?.grossTotal || 0,
        netSubtotal: exProtBundle?.netSubtotal || 0,
        netTotal: exProtBundle?.netTotal || 0,
      };
    })
      .filter(item => {
        if (pickupUSA && residNotUSA) {
          return !orderList.includes(item.bundleName);
        }
        return true;
      })
      .sort((a, b) => orderList.indexOf(a.bundleName) - orderList.indexOf(b.bundleName));

    // ADD-ONS SANITIZATION
    const extrasAddOnsItemList = extrasData?.addOnItems || [];


    const filteredAddOnsItemList = concattedAddOnsList.map((item) => {
      const matchedExtra = extrasAddOnsItemList.find(
        (extra) => extra.code === item.code
      );
      if (!matchedExtra) return null;
      return {
        ...item,
        netSubtotal: matchedExtra?.netSubtotal || 0,
        freeCDWIndicator: matchedExtra.freeCDWIndicator || false,
      };
    }).filter(Boolean);
    // final add-ons item list
    const extrasMap = {};
    const addOnWithQantity = ["CBS", "CSS", "CIS", "CFS", "CSB"]
    const addOnOrderList = ["GSO", "TOL", "ADR", "RSN", "GPS", "XMR", "CSS", "CIS", "CBS", "WFI", "ADD", "TPR"]
    extrasAddOnsItemList.forEach(ex => {
      extrasMap[ex.code] = ex;
    });

    const finalAddOnItemList = filteredAddOnsItemList
      .filter(item => item.enabled === true)
      .flatMap(item => {
        const subAddOnList = item.subAddOnList || [];

        const matchedSubItems = subAddOnList
          .filter(sub => extrasMap[sub.code])
          .map(sub => ({
            ...sub,
            netSubtotal: extrasMap[sub.code].netSubtotal,
            isShowQuantityUI: addOnWithQantity.includes(sub.code),
            freeCDWIndicator: extrasMap[sub.code].freeCDWIndicator || false,
          }));

        return [
          {
            ...item,
            isShowQuantityUI: addOnWithQantity.includes(item.code)
          },
          ...matchedSubItems
        ];
      })
      .filter((item, index, arr) =>
        arr.findIndex(i => i.code === item.code) === index
      ).sort((a, b) => {
        const indexA = addOnOrderList.indexOf(a.code);
        const indexB = addOnOrderList.indexOf(b.code);

        const aInList = indexA !== -1;
        const bInList = indexB !== -1;

        // Case 1: both are in order list → sort normally.
        if (aInList && bInList) {
          return indexA - indexB;
        }

        // Case 2: only A is in list → A comes first
        if (aInList) return -1;

        // Case 3: only B is in list → B comes first
        if (bInList) return 1;

        // Case 4: neither in list → keep original order
        return 0;
      });

    // Add-ons bundle list
    const extrasAddonBundleList = extrasData?.addOnBundles || [];

    // final add-ons bundle list
    const finalAddOnBundleList = addOnsBundleList.map(item => {
      const exAddonBundle = extrasAddonBundleList.find(ex => ex.code === item.bundleName)
      return {
        ...item,
        grossSubtotal: exAddonBundle?.grossSubtotal || 0,
        grossTotal: exAddonBundle?.grossTotal || 0,
        netSubtotal: exAddonBundle?.netSubtotal || 0,
        netTotal: exAddonBundle?.netTotal || 0,
      }
    })


    //=========================New section=========================
    var greenCheckSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="12" viewBox="0 0 16 12" fill="none">'
      + '<path fill-rule="evenodd" clip-rule="evenodd" d="M15.8118 0.163632C16.0528 0.391065 16.0638 0.770805 15.8364 1.0118L5.96479 11.4723C5.72819 11.723 5.32948 11.7232 5.09257 11.4728L0.164145 6.2634C-0.0635872 6.02269 -0.0530616 5.64293 0.187655 5.4152C0.428372 5.18747 0.808125 5.19799 1.03586 5.43871L5.52788 10.1868L14.9636 0.188198C15.1911 -0.0528017 15.5708 -0.0638003 15.8118 0.163632Z" fill="#1EA238"/>'
      + '</svg>';

    var protBundleCardsHTML = (finalProtectionBundleList || []).map(function (prot) {
      var protitem = prot.includedProtections.length ? prot.includedProtections : [];
      var featureItemsHTML = protitem.length > 0 ? protitem.map(function (item) {
        return '<div class="feature-item">'
          + '<div class="feature-icon">' + greenCheckSVG + '</div>'
          + '<div class="feature-text">' + item.name + '</div>'
          + '</div>';
      }).join('') : '';
      return '<div class="prot-card" data-code="' + (prot.bundleName || '') + '">'
        + '<div class="card-body">'
        + '<div class="card-info">'
        + '<h3 class="card-title">' + (prot.bundleName || '') + '</h3>'
        + '<div class="card-radio"><div class="radio-outer"><div class="radio-inner"></div></div></div>'
        + '</div>'
        + '<div class="card-features">' + featureItemsHTML + '</div>'
        + '</div>'
        + '<div class="card-actions">'
        + '<div class="view-coverage">View coverage</div>'
        + '<div class="price-info">' + getPriceWithCurrenty(currencyCode, prot.netSubtotal) + ' <p class="per-day-slash">/<span class="per-day">day</span></p></div>'
        + '</div>'
        + '</div>';
    }).join('');

    var staticNoProtectionCard =
      '<div class="static-no-prot-card ' + (hasFreeCDW ? 'disabled' : '') + '" data-code="No Protection">'
      + '<div class="protection-item-info">'
      + '<h4 class="protection-item-title">No Extra Protection</h4>'
      + '<div class="card-radio"><div class="radio-outer"><div class="radio-inner"></div></div></div>'
      + '</div>'
      + '<div class="protection-item-actions">'
      + '<div class="price-info">' + getPriceWithCurrenty(currencyCode, 0) + ' <p class="per-day-slash">/<span class="per-day">day</span></p></div>'
      + '</div>'
      + '</div>';
    var lastItem = finalProtectionBundleList[finalProtectionBundleList.length - 1];
    var ultimateProtBundle =
      finalProtectionBundleList.find(function (b) {
        return b.bundleName === "Ultimate Protection";
      }) ||
      finalProtectionBundleList.find(function (b) {
        return b.bundleName === "Premium Cover";
      }) ||
      (lastItem && lastItem.bundleName !== "No Protection" ? lastItem : null);
    var staticUltimateProtCard = '';
    if (ultimateProtBundle) {
      var ultimateProtItems = ultimateProtBundle.includedProtections && ultimateProtBundle.includedProtections.length ? ultimateProtBundle.includedProtections : [];
      var ultimateProtFeaturesHTML = ultimateProtItems.map(function (item) {
        return '<div class="feature-item">'
          + '<div class="feature-icon">' + greenCheckSVG + '</div>'
          + '<div class="feature-text">' + item.name + '</div>'
          + '</div>';
      }).join('');
      staticUltimateProtCard =
        '<div class="prot-card" data-code="' + (ultimateProtBundle.bundleName || '') + '">'
        + '<div class="card-body">'
        + '<div class="card-info">'
        + '<h3 class="card-title">' + (ultimateProtBundle.bundleName || '') + '</h3>'
        + '<div class="card-radio"><div class="radio-outer"><div class="radio-inner"></div></div></div>'
        + '</div>'
        + '<div class="card-features">' + ultimateProtFeaturesHTML + '</div>'
        + '</div>'
        + '<div class="card-actions">'
        + '<div class="view-coverage">View coverage</div>'
        + '<div class="price-info">' + getPriceWithCurrenty(currencyCode, ultimateProtBundle.netSubtotal) + ' <p class="per-day-slash">/<span class="per-day">day</span></p></div>'
        + '</div>'
        + '</div>';
    } else {
      // Ultimate is null – pull a fallback protection item from finalProtectionItemList
      var fallbackItemIndex = finalProtectionItemList.findIndex(function (item) {
        return item.code === 'CDW';
      });
      if (fallbackItemIndex === -1) {
        fallbackItemIndex = finalProtectionItemList.length > 0 ? 0 : -1;
      }
      if (fallbackItemIndex !== -1) {
        var fallbackProtItem = finalProtectionItemList.splice(fallbackItemIndex, 1)[0];
        staticUltimateProtCard = '<div class="protection-item ' + (fallbackProtItem.freeCDWIndicator || Number(fallbackProtItem.netSubtotal) === 0 ? 'included' : '') + '" data-code="' + (fallbackProtItem.code || '') + '">'
          + '<div class="protection-item-info">'
          + '<h4 class="protection-item-title">' + fallbackProtItem.name + '</h4>'
          + '<div class="card-radio"><div class="radio-outer"><div class="radio-inner"></div></div></div>'
          + '</div>'
          + '<div class="protection-item-actions">'
          + '<div class="prot-details">Details</div>'
          + '<div class="price-info">' + getPriceWithCurrenty(currencyCode, fallbackProtItem.netSubtotal) + ' <p class="per-day-slash">/<span class="per-day">day</span></p></div>'
          + '<p class="included-text">Included</p>'
          + '</div>'
          + '<div class="prot-details-content">'
          + '<p class="prot-details-content-text">' + fallbackProtItem.description.html + '</p>'
          + '</div>'
          + '</div>';
      }
    }

    var protItemsHTML = finalProtectionItemList.map(function (item) {
      return '<div class="protection-item ' + (item.freeCDWIndicator || Number(item.netSubtotal) === 0 ? 'included' : '') + '" data-code="' + (item.code || '') + '">'
        + '<div class="protection-item-info">'
        + '<h4 class="protection-item-title">' + item.name + '</h4>'
        + '</div>'
        + '<div class="protection-item-actions">'
        + '<div class="price-info">' + getPriceWithCurrenty(currencyCode, item.netSubtotal) + ' <p class="per-day-slash">/<span class="per-day">day</span></p></div>'
        + '<div class="details-and-check">'
        + '<div class="prot-details">Details</div>'
        + '<div class="prot-checkbox-section">'
        + '<label class="prot-checkbox-label">'
        + '<input type="checkbox" data-code="' + item.code + '">'
        + '<span class="toggle-label-text">Add to Trip</span>'
        + '<span class="checkbox-mark"></span>'
        + '</label> '
        + '<div class="included-text">Included</div>'
        + '<div class="included-in-bundle-text">Included in bundle</div>'
        + '</div> '
        + '</div>'
        + '<div class="prot-details-content">'
        + '<p class="prot-details-content-text">' + item.description.html + '</p>'
        + '</div>'
        + '</div>'
        + '</div>';
    }).join('');

    var addOnBundleCardsHTML = finalAddOnBundleList.map(function (item) {
      return '<div class="add-on-bundle-card" data-add-on-bundle-code="' + item.bundleName + '">'
        + '<div>' + item.bundleName + '</div>'
        + '<div class="add-on-bundle-select-btn">' + getPriceWithCurrenty(currencyCode, item.netSubtotal) + '/day</div>'
        + '</div>';
    }).join('');

    var addOnItemCardsHTML = finalAddOnItemList.map(function (item) {
      var controlHTML = item.isShowQuantityUI
        ? '<div class="quantity-selector" data-code="' + item.code + '" data-max-quantity="' + (item.maxQuantity || 1) + '">'
        + '<button class="quantity-minus">-</button>'
        + '<input type="text" class="quantity-input" value="0" readonly>'
        + '<button class="quantity-plus">+</button>'
        + '</div>'
        : '<label class="add-on-toggle">'
        + '<input type="checkbox" data-code="' + item.code + '">'
        + '<span class="toggle-label-text">Add to Trip</span>'
        + '<span class="checkbox-mark"></span>'
        + '<p class="included-text">Included</p>'
        + '<div class="included-in-bundle-text">Included in bundle</div>'
        + '</label>';
      return '<div class="add-on-card ' + (item.freeCDWIndicator || Number(item.netSubtotal) === 0 ? 'included' : '') + '">'
        + '<div class="card-header">'
        + '<div class="add-on-icon">' + (addOnItemsSvgObj[item.code] || addOnItemsSvgObj["FLB"]) + '</div>'
        + '<div class="add-on-info"><h4 class="add-on-title">' + item.name + '</h4></div>'
        + '</div>'
        + '<div class="card-footer">'
        + '<div class="price-info">' + getPriceWithCurrenty(currencyCode, item.netSubtotal) + ' <p class="per-day-slash">/<span class="per-day">day</span></p></div>'
        + '<div class="add-on-actions">'
        + '<a href="#" class="add-on-details" data-code="' + item.code + '">Details</a>'
        + controlHTML
        + '</div>'
        + '<div class="add-on-details-content">'
        + '<p class="add-on-details-content-text">' + item.description.html + '</p>'
        + '</div>'
        + '</div>'
        + '</div>';
    }).join('');

    var protSection = '<div class="new-prot-bundle" id="' + TEST_ID + '">'
      + '<h2 class="prot-title">WHICH PROTECTION DO YOU NEED?</h2>'
      + '<div class="intial-prot-cards">' + staticNoProtectionCard + staticUltimateProtCard + '</div>'
      + '<div class="prot-cards">' + protBundleCardsHTML + '</div>'
      + '<div class="prot-all-packages">' + (finalProtectionBundleList.length > 2 ? '<button type="button" class="btn-all-packages">View all protection packages</button>' : '') + '</div>'
      + '<div class="protection-items-section">' + protItemsHTML + '</div>'
      + '<div class="protection-items-section-footer">' + (finalProtectionItemList.length > 0 ? '<button type="button" class="btn-all-packages-items">View all protection options</button>' : '') + '</div>'
      + '<!-- Add-ons section -->'
      + '<div class="add-ons-section">'
      + '<div class="add-on-bundles-section">'
      + '<h3 class="add-ons-title">Select add-ons Bundles</h3>'
      + '<div class="add-on-bundles-content">' + addOnBundleCardsHTML + '</div>'
      + '</div>'
      + '<h3 class="add-on-title">Have you selected your ADD-ONS?</h3>'
      + '<div class="add-ons-content">' + addOnItemCardsHTML + '</div>'
      + '<div class="add-ons-footer">' + (finalAddOnItemList.length > 4 ? '<button type="button" class="add-on-btn-all-packages">View all add-ons options</button>' : '') + '</div>'
      + '</div>'
      + '</div>';

    /* ---------------- main injection ---------------- */
    function inject() {
      const rawTarget = document.querySelector(SELECTORS.target);
      const target = rawTarget.parentElement;
      if (!target) return;
      if (document.getElementById(TEST_ID)) return;
      target.insertAdjacentHTML("afterend", protSection);
      document.body.classList.add(TEST_ID);

      // =================== Intial selection handle ===============
      initalSelectUI(extrasProtectionItemList, extrasAddOnsItemList, protectionItems, finalAddOnItemList, finalProtectionBundleList, corelationalIdentifier)
      preferredPoint();

      // =============================== PROTECTION BUNDLE SELECTION==============================
      const protectionBundleCards = document.querySelectorAll("." + TEST_ID + " .prot-card");
      protectionBundleCards.forEach(card => {
        card.addEventListener("click", async () => {
          const bundleCode = card.getAttribute("data-code");

          const jsonBundle = finalProtectionBundleList.find(item => item.bundleName === bundleCode);

          const jsonBundleItems = [...jsonBundle.includedProtections, ...jsonBundle.excludedProtections];

          const extrasBundle = extrasProtectionBundleList.find(item => item.code === bundleCode);

          const rawStore = sessionStorage.getItem("reservation.store");
          if (!rawStore) return;
          const store = JSON.parse(rawStore) || {};
          // trigger no protection if bundle already selected. 
          const selectedBundleName = store.state.protectionBundleCode;

          if (selectedBundleName === bundleCode) {

            const noProtBundle = document.querySelector('[data-code="No Protection"]');
            if (noProtBundle) {

              noProtBundle.click();
            }
            return;
          }
          store.state.protectionBundleCode = bundleCode;
          store.state.protectionBundleCodeBackup = bundleCode;

          const protectionBundleItems = [];
          extrasBundle.items.forEach(item => {
            protectionBundleItems.push(item.code);
          })
          store.state.protectionBundleItems = protectionBundleItems.join(",");
          const protectionBundleItemsTiers = [];
          jsonBundle.includedProtections.forEach(item => {
            protectionBundleItemsTiers.push(item.applyBundleTier === null ? "false" : "false");
          })
          store.state.protectionBundleItemsTiers = protectionBundleItemsTiers.join(",");
          const protectionBundleItemsPolicies = [];
          jsonBundle.includedProtections.forEach(item => {
            protectionBundleItemsPolicies.push(item.policy === "required" ? "MANDATORY" : "OPTIONAL");
          })
          store.state.protectionBundleItemsPolicies = protectionBundleItemsPolicies.join(",");
          const selectedBundlePayload = {
            code: extrasBundle.code || "",
            title: extrasBundle?.code || "",
            defaultBundle: jsonBundle.defaultBundle || null,
            coverageRating: coverageRatings[jsonBundle.coverageRating] || 0,
            description: jsonBundle.bundleDescription.html || "",
            items: jsonBundleItems.map(item => {
              return {
                id: item.code || "",
                code: item.code || "",
                title: item.name || "",
                description: item.description.html || "",
                included: extrasBundle.items.some(i => i.code === item.code) || false,
                currencyCode: extrasBundle.currencyCode || "",
                policy: item.policy === "required" ? "MANDATORY" : "OPTIONAL",
              }
            }),
            oldPrice: avisConfigData.pricingDisplay === "dailyRate" ? extrasBundle.grossSubtotal : extrasBundle.grossTotal,
            price: avisConfigData.pricingDisplay === "dailyRate" ? extrasBundle.netSubtotal : extrasBundle.netTotal,
            recommended: jsonBundle.recommendedBundle,
            warning: jsonBundle.alertMessageIfSelected || "",
            bookAgain: extrasBundle.bookAgain || false,
            currencyCode: extrasBundle.currencyCode || "",
          }

          store.state.protectionBundleSelected = selectedBundlePayload;
          // store Protection Item
          const storeProtItemList = store.state.protectionItems || "";
          const formateStoreProtItemList = storeProtItemList.split(",").map(item => item.trim()).filter(Boolean) || [];
          //store AddOn Bundles
          const storeAddOnBundle = store.state.addOnBundleSelected || {};
          const hasAddOnBundleCode = storeAddOnBundle?.code;
          // store Add On items
          const storeAddOnItems = store.state.addOnItems || "";
          const formateStoreAddOnItems = storeAddOnItems.split(",").map(item => item.trim()).filter(Boolean) || [];
          const storeAddOnItemsQuantity = store.state.addOnItemsQuantity || "";
          const formateStoreAddOnItemsQuantity = storeAddOnItemsQuantity.split(",").map(item => item.trim()).filter(Boolean) || [];



          sessionStorage.setItem("reservation.store", JSON.stringify(store));

          //calculate api payload
          const organizedAddOnItems = formateStoreAddOnItems.map((item, index) => {
            return {
              code: item || "",
              quantity: formateStoreAddOnItemsQuantity[index] === "false" ? null : Number(formateStoreAddOnItemsQuantity[index]) || 1,
            }
          }) || [];
          const calculatePayload = {
            age: extrasAPIPayload.age,
            countryOfResidence: extrasAPIPayload.countryOfResidence,
            currencyCode: extrasAPIPayload.currencyCode,
            discountCodes: extrasAPIPayload.discountCodes,
            dropoffDate: extrasAPIPayload.dropoffDate,
            dropoffTime: extrasAPIPayload.dropoffTime,
            dropoffLocation: extrasAPIPayload.dropoffLocation,
            pickupDate: extrasAPIPayload.pickupDate,
            pickupTime: extrasAPIPayload.pickupTime,
            pickupLocation: extrasAPIPayload.pickupLocation,
            priceRateCode: extrasAPIPayload.priceRateCode,
            priceType: extrasAPIPayload.priceType,
            priceView: extrasAPIPayload.priceView,
            isAvisFirst: extrasAPIPayload.isAvisFirst,
            vehicleCode: extrasAPIPayload.vehicleCode,
            vehicleId: extrasAPIPayload.vehicleId,
            protectionBundle: {
              code: bundleCode,
              items: jsonBundle.includedProtections.map(item => {
                return {
                  code: item.code,
                  policy: item.policy === "required" ? "MANDATORY" : "OPTIONAL",
                }
              })
            },
            protectionItems: formateStoreProtItemList.map(item => {
              return {
                code: item || "",
              }
            }) || [],
            addOnItems: organizedAddOnItems,
          };
          if (hasAddOnBundleCode) {
            calculatePayload.addOnBundle = {
              code: storeAddOnBundle.code,
              items: storeAddOnBundle.items.map(item => ({
                code: item.code || "",
              }))
            };
          }


          const calculateData = await calculatePrice(calculatePayload, corelationalIdentifier);

          const calculateProtectionItems = calculateData.protectionItems || [];

          const calculateAddonItems = calculateData.addOnItems || [];

          const latestRawStore = sessionStorage.getItem("reservation.store");
          if (latestRawStore) {
            const latestStore = JSON.parse(latestRawStore);


            const newProtectionItems = calculateProtectionItems.map(item => {
              return {
                amount: extrasProtectionItemList.find(i => i.code === item.code).netTotal,
                chargeType: item.chargeType,
                code: item.code,
                description: jsonBundleItems.find(i => i.code === item.code).name || "",
                discount: extrasProtectionItemList.find(i => i.code === item.code).discount || 0,
                grossSubtotal: extrasProtectionItemList.find(i => i.code === item.code).grossSubtotal,
                netSubtotal: item.netSubtotal,
                netSubtotalPerUnit: item.netSubtotalPerUnit,
                rentalItemUnits: item.rentalItemUnits,
              }
            })


            const newAddOnItems = calculateAddonItems.map(item => {
              const isGSO = item.code === "GSO";
              const getDesc = finalAddOnItemList.find(i => i.code === item.code).name || "";

              return {
                amount: extrasAddOnsItemList.find(i => i.code === item.code).netTotal,
                chargeType: item.chargeType,
                code: item.code,
                description: isGSO ? "Hassle-free Fuel Service" : getDesc,
                discount: extrasAddOnsItemList.find(i => i.code === item.code).discount || 0,
                grossSubtotal: extrasAddOnsItemList.find(i => i.code === item.code).grossSubtotal,
                displayElement: item.displayElement,
                netSubtotal: item.netSubtotal,
                netSubtotalPerUnit: item.netSubtotalPerUnit,
                rentalItemUnits: item.rentalItemUnits,
                quantity: item.quantity,
              }
            })

            latestStore.state.pricesProtectionItems = newProtectionItems;
            latestStore.state.pricesAddOnItems = newAddOnItems;

            sessionStorage.setItem("reservation.store", JSON.stringify(latestStore));

            //Update UI
            updateCarSummaryAndFooterPrice(calculateData, extrasAddOnsItemList, extrasProtectionItemList);
          }
        });
      });

      // Protection items toggle listener
      const protectionToggles = [...document.querySelectorAll("#" + TEST_ID + " .prot-checkbox-label input"), ...document.querySelectorAll("#" + TEST_ID + " .intial-prot-cards .protection-item")];
      protectionToggles.forEach(toggle => {
        toggle.addEventListener("click", async (e) => {
          const code = toggle.getAttribute("data-code");
          const protectionItemPrice = extrasProtectionItemList.find(item => item.code === code)

          const jsonProtectionItem = protectionItems?.find(item => item.code === code)


          const rawStore = sessionStorage.getItem("reservation.store");

          if (!rawStore) return;

          const store = JSON.parse(rawStore);
          const currentCodes = store.state.protectionItems;

          const codesArray = currentCodes ? currentCodes.split(",").map(c => c.trim()).filter(Boolean) : [];
          const index = codesArray.indexOf(code);
          if (index > -1) {
            codesArray.splice(index, 1);
          } else {
            codesArray.push(code);
          }
          //store Protection Bundles
          const storeProtectionBundle = store.state.protectionBundleSelected || {};
          const hasProtectionCode = storeProtectionBundle?.code;
          // store Add On items
          const storeAddOnItems = store.state.addOnItems || "";
          const formateStoreAddOnItems = storeAddOnItems.split(",").map(item => item.trim()).filter(Boolean) || [];
          //store AddOn Bundles
          const storeAddOnBundle = store.state.addOnBundleSelected || {};
          const hasAddOnBundleCode = storeAddOnBundle?.code;

          store.state.protectionItems = codesArray.join(",");
          store.state.protectionItemsBackup = codesArray.join(",");
          sessionStorage.setItem("reservation.store", JSON.stringify(store));
          // window.location.reload();

          //call calculate api updated protectionItems
          // Call calculatePrice with the updated addOnItems
          const calculatePayload = {
            age: extrasAPIPayload.age,
            countryOfResidence: extrasAPIPayload.countryOfResidence,
            currencyCode: extrasAPIPayload.currencyCode,
            discountCodes: extrasAPIPayload.discountCodes,
            dropoffDate: extrasAPIPayload.dropoffDate,
            dropoffTime: extrasAPIPayload.dropoffTime,
            dropoffLocation: extrasAPIPayload.dropoffLocation,
            pickupDate: extrasAPIPayload.pickupDate,
            pickupTime: extrasAPIPayload.pickupTime,
            pickupLocation: extrasAPIPayload.pickupLocation,
            priceRateCode: extrasAPIPayload.priceRateCode,
            priceType: extrasAPIPayload.priceType,
            priceView: extrasAPIPayload.priceView,
            isAvisFirst: extrasAPIPayload.isAvisFirst,
            vehicleCode: extrasAPIPayload.vehicleCode,
            vehicleId: extrasAPIPayload.vehicleId,
            protectionItems: codesArray.map(c => ({ code: c })),
            addOnItems: formateStoreAddOnItems.map(item => {
              return {
                code: item || "",
              }
            }) || [],
          };
          if (hasProtectionCode) {
            const items = (storeProtectionBundle.items || [])
              .filter(item => item.included)
              .map(item => ({
                code: item.code || "",
                policy: item.policy || ""
              }));

            calculatePayload.protectionBundle = {
              code: storeProtectionBundle.code,
              items
            };
          }
          if (hasAddOnBundleCode) {
            calculatePayload.addOnBundle = {
              code: storeAddOnBundle.code,
              items: storeAddOnBundle.items.map(item => ({
                code: item.code || "",
              }))
            };
          }

          // //Call calculatePrice API
          const calculateData = await calculatePrice(calculatePayload, corelationalIdentifier);
          const calculateProtectionItem = calculateData?.protectionItems?.find(item => item.code === code) || {};
          const pricePayloadProtectionItem = {
            amount: protectionItemPrice?.netTotal,
            chargeType: protectionItemPrice.chargeType,
            code: protectionItemPrice.code,
            description: jsonProtectionItem.name,
            netSubtotal: calculateProtectionItem.netSubtotal,
            netSubtotalPerUnit: calculateProtectionItem.netSubtotalPerUnit,
            rentalItemUnits: calculateProtectionItem.rentalItemUnits,
          }

          const latestRawStore = sessionStorage.getItem("reservation.store");
          if (latestRawStore) {
            const latestStore = JSON.parse(latestRawStore);
            if (!latestStore.state) latestStore.state = {};

            let pricesProtectionItems = latestStore.state.pricesProtectionItems || [];

            const existingIndex = pricesProtectionItems.findIndex(item => item.code === code);
            if (existingIndex > -1) {
              // Item already exists — remove it (deselected)
              pricesProtectionItems.splice(existingIndex, 1);
            } else {
              // Item not found — add it (selected)
              pricesProtectionItems.push(pricePayloadProtectionItem);
            }

            latestStore.state.pricesProtectionItems = pricesProtectionItems;
            sessionStorage.setItem("reservation.store", JSON.stringify(latestStore));

          }
          updateCarSummaryAndFooterPrice(calculateData, extrasAddOnsItemList, extrasProtectionItemList)
        });
      });

      // ===================== Add-ons bundle selection =====================
      const uiAddOnsBundleList = document.querySelectorAll(".add-on-bundle-card");
      uiAddOnsBundleList.forEach(addOnBundle => {
        addOnBundle.addEventListener("click", async (e) => {
          const bundleCode = addOnBundle.getAttribute("data-add-on-bundle-code");

          const extrasBundle = extrasAddonBundleList.find(item => item.code === bundleCode)

          const jsonBundle = addOnsBundleList.find(item => item.bundleName === bundleCode)

          const rawStore = sessionStorage.getItem("reservation.store");
          if (!rawStore) return;
          const store = JSON.parse(rawStore) || {};

          // store Add On items
          const storeAddOnItems = store.state.addOnItems || "";
          const formateStoreAddOnItems = storeAddOnItems.split(",").map(item => item.trim()).filter(Boolean) || [];
          //store Protection Bundles
          const storeProtectionBundle = store.state.protectionBundleSelected || {};
          const hasProtectionCode = storeProtectionBundle?.code;
          // store Protection Item
          const storeProtItemList = store.state.protectionItems || "";
          const formateStoreProtItemList = storeProtItemList.split(",").map(item => item.trim()).filter(Boolean) || [];
          store.state.addOnBundleCode = bundleCode;
          const addOnBundleItems = [];
          extrasBundle.items.forEach(item => {
            addOnBundleItems.push(item.code);
          })
          store.state.addOnBundleItems = addOnBundleItems.join(",");
          const imageSrc = jsonBundle.image?.source || jsonBundle.image?.path;
          const selectedAddOnBundleObj = {
            code: extrasBundle.code || "",
            title: extrasBundle.code || "",
            bookAgain: extrasBundle.bookAgain || false,
            currencyCode: extrasBundle.currencyCode || "",
            description: jsonBundle.bundleDescription.html || "",
            image: imageSrc
              ? { src: imageSrc, alt: "Bundle image" }
              : { alt: "Bundle image" },
            items: jsonBundle.includedAddons.map(item => {
              return {
                code: item.code || "",
                description: item.description.html || "",
                id: item.code || "",
                included: extrasBundle.items.some(i => i.code === item.code) || false,
                title: item.name || "",
              }
            }),
            oldPrice: avisConfigData.pricingDisplay === "dailyRate" ? extrasBundle.grossSubtotal : extrasBundle.grossTotal,
            price: avisConfigData.pricingDisplay === "dailyRate" ? extrasBundle.netSubtotal : extrasBundle.netTotal,
          }

          store.state.addOnBundleSelected = selectedAddOnBundleObj;
          sessionStorage.setItem("reservation.store", JSON.stringify(store));

          //calculate api payload
          const calculatePayload = {
            age: extrasAPIPayload.age,
            countryOfResidence: extrasAPIPayload.countryOfResidence,
            currencyCode: extrasAPIPayload.currencyCode,
            discountCodes: extrasAPIPayload.discountCodes,
            dropoffDate: extrasAPIPayload.dropoffDate,
            dropoffTime: extrasAPIPayload.dropoffTime,
            dropoffLocation: extrasAPIPayload.dropoffLocation,
            pickupDate: extrasAPIPayload.pickupDate,
            pickupTime: extrasAPIPayload.pickupTime,
            pickupLocation: extrasAPIPayload.pickupLocation,
            priceRateCode: extrasAPIPayload.priceRateCode,
            priceType: extrasAPIPayload.priceType,
            priceView: extrasAPIPayload.priceView,
            isAvisFirst: extrasAPIPayload.isAvisFirst,
            vehicleCode: extrasAPIPayload.vehicleCode,
            vehicleId: extrasAPIPayload.vehicleId,
            addOnBundle: {
              code: bundleCode || "",
              items: jsonBundle.includedAddons.map(item => {
                return {
                  code: item.code || "",
                }
              }) || [],
            },
            addOnItems: formateStoreAddOnItems.map(item => {
              return {
                code: item || "",
              }
            }) || [],
            protectionItems: formateStoreProtItemList.map(item => {
              return {
                code: item || "",
              }
            }) || [],
          };
          if (hasProtectionCode) {
            const items = (storeProtectionBundle.items || [])
              .filter(item => item.included)
              .map(item => ({
                code: item.code || "",
                policy: item.policy || ""
              }));

            calculatePayload.protectionBundle = {
              code: storeProtectionBundle.code,
              items
            };
          }

          //call calculate api
          const calculateData = await calculatePrice(calculatePayload, corelationalIdentifier);

          const calculateAddOnItems = calculateData.addOnItems || [];
          const latestRawStore = sessionStorage.getItem("reservation.store");
          if (!latestRawStore) return;
          const latestStore = JSON.parse(latestRawStore);


          const newAddOnItems = calculateAddOnItems.map(addOnItem => {
            const includedItem = jsonBundle.includedAddons?.find(
              i => i.code === addOnItem.code
            );
            const extraItem = extrasAddOnsItemList?.find(
              i => i.code === addOnItem.code
            );
            return {
              amount: extrasBundle.netTotal || 0,
              chargeType: addOnItem.chargeType || "",
              code: addOnItem.code || "",
              description: includedItem?.name || "",
              discount: extraItem?.discount || 0,
              grossSubtotal: extraItem?.grossSubtotal,
              displayElement: addOnItem.displayElement || {},
              netSubtotal: addOnItem.netSubtotal || 0,
              netSubtotalPerUnit: addOnItem.netSubtotalPerUnit || 0,
              rentalItemUnits: addOnItem.rentalItemUnits || 0,
            }
          })

          latestStore.state.pricesAddOnItems = newAddOnItems;

          sessionStorage.setItem("reservation.store", JSON.stringify(latestStore));
        });
      });

      // ================= Add-ons items toggle listener =================
      const addOnToggles = document.querySelectorAll("#" + TEST_ID + " .add-on-toggle input");
      addOnToggles.forEach(toggle => {
        toggle.addEventListener("change", async (e) => {
          const code = e.target.getAttribute("data-code");
          //remove the PwP toggle if it exists
          removePwpToggle(code);
          await new Promise(resolve => setTimeout(resolve, 1000));
          const addOnItemPrice = extrasAddOnsItemList.find(item => item.code === code)
          const jsonAddonItem = concattedAddOnsList?.find(item => item.code === code)

          const rawStore = sessionStorage.getItem("reservation.store");
          if (!rawStore) return;

          const store = JSON.parse(rawStore);

          // Ensure state exists
          if (!store.state) store.state = {};

          // Get existing codes or initialize empty array
          const currentCodes = store.state.addOnItems;
          const codesArray = currentCodes
            ? currentCodes.split(",").map(c => c.trim()).filter(Boolean)
            : [];

          // Always rebuild quantityArray to match codesArray length
          const addOnItemsQuantity = store.state.addOnItemsQuantity;
          let quantityArray = addOnItemsQuantity
            ? addOnItemsQuantity.split(",").map(c => c.trim())
            : [];

          // Ensure quantityArray is in sync with codesArray
          while (quantityArray.length < codesArray.length) {
            quantityArray.push("false");
          }
          quantityArray = quantityArray.slice(0, codesArray.length);

          const index = codesArray.indexOf(code);
          if (index > -1) {
            // Remove code and its matching "false" at the same index
            codesArray.splice(index, 1);
            quantityArray.splice(index, 1);
          } else {
            // Add code and push "false" at the same index
            codesArray.push(code);
            quantityArray.push("false");
          }

          // store Protection Item
          const storeProtItemList = store.state.protectionItems || "";
          const formateStoreProtItemList = storeProtItemList.split(",").map(item => item.trim()).filter(Boolean) || [];
          //store Protection Bundles
          const storeProtectionBundle = store.state.protectionBundleSelected || {};
          const hasProtectionCode = storeProtectionBundle?.code;
          //store AddOn Bundles
          const storeAddOnBundle = store.state.addOnBundleSelected || {};
          const hasAddOnBundleCode = storeAddOnBundle?.code;

          store.state.addOnItems = codesArray.join(",");
          store.state.addOnItemsQuantity = quantityArray.join(",");
          store.state.addOnItemsBackup = codesArray.join(",");
          store.state.addOnItemsQuantityBackup = quantityArray.join(",");
          sessionStorage.setItem("reservation.store", JSON.stringify(store));

          //organize add-on items payload
          const organizedAddOnItems = codesArray.map((c, i) => ({ code: c, quantity: quantityArray[i] === "false" ? null : Number(quantityArray[i]) }))

          // Call calculatePrice with the updated addOnItems
          const calculatePayload = {
            age: extrasAPIPayload.age,
            countryOfResidence: extrasAPIPayload.countryOfResidence,
            currencyCode: extrasAPIPayload.currencyCode,
            discountCodes: extrasAPIPayload.discountCodes,
            dropoffDate: extrasAPIPayload.dropoffDate,
            dropoffTime: extrasAPIPayload.dropoffTime,
            dropoffLocation: extrasAPIPayload.dropoffLocation,
            pickupDate: extrasAPIPayload.pickupDate,
            pickupTime: extrasAPIPayload.pickupTime,
            pickupLocation: extrasAPIPayload.pickupLocation,
            priceRateCode: extrasAPIPayload.priceRateCode,
            priceType: extrasAPIPayload.priceType,
            priceView: extrasAPIPayload.priceView,
            isAvisFirst: extrasAPIPayload.isAvisFirst,
            vehicleCode: extrasAPIPayload.vehicleCode,
            vehicleId: extrasAPIPayload.vehicleId,
            addOnItems: organizedAddOnItems,
            protectionItems: formateStoreProtItemList.map(item => {
              return {
                code: item || "",
              }
            }) || [],
          };
          if (hasProtectionCode) {
            const items = (storeProtectionBundle.items || [])
              .filter(item => item.included)
              .map(item => ({
                code: item.code || "",
                policy: item.policy || ""
              }));

            calculatePayload.protectionBundle = {
              code: storeProtectionBundle.code,
              items
            };
          }
          if (hasAddOnBundleCode) {
            calculatePayload.addOnBundle = {
              code: storeAddOnBundle.code,
              items: storeAddOnBundle.items.map(item => ({
                code: item.code || "",
              }))
            };
          }
          // //Call calculatePrice API
          const calculateData = await calculatePrice(calculatePayload, corelationalIdentifier);
          const calculateAddOnItems = calculateData.addOnItems || [];
          const calculateProtectionItems = calculateData.protectionItems || [];

          const newAddOnItems = calculateAddOnItems.map(addOnItem => {
            const extraItem = extrasAddOnsItemList?.find(
              i => i.code === addOnItem.code
            );
            const matchedItem = finalAddOnItemList.find(i => i.code === addOnItem.code)
            return {
              amount: addOnItem.amount || 0,
              chargeType: addOnItem.chargeType || "",
              code: addOnItem.code || "",
              description: matchedItem ? matchedItem.name : "",
              discount: extraItem?.discount || 0,
              grossSubtotal: extraItem?.grossSubtotal,
              displayElement: addOnItem.displayElement || {},
              netSubtotal: addOnItem.netSubtotal || 0,
              netSubtotalPerUnit: addOnItem.netSubtotalPerUnit || 0,
              rentalItemUnits: addOnItem.rentalItemUnits || 0,
              quantity: addOnItem.quantity || 0,
            }
          })

          //new protection items
          const newProtectionItems = calculateProtectionItems.map(item => {
            return {
              amount: extrasProtectionItemList.find(i => i.code === item.code).netTotal || 0,
              chargeType: item.chargeType || "",
              code: item.code || "",
              description: filteredProtectionItemList.find(i => i.code === item.code).name || "",
              discount: extrasProtectionItemList.find(i => i.code === item.code).discount || 0,
              grossSubtotal: extrasProtectionItemList.find(i => i.code === item.code).grossSubtotal || 0,
              netSubtotal: item.netSubtotal || 0,
              netSubtotalPerUnit: item.netSubtotalPerUnit || 0,
              rentalItemUnits: item.rentalItemUnits || 0,
            }
          })

          // Update pricesAddOnItems in sessionStorage
          const latestRawStore = sessionStorage.getItem("reservation.store");
          if (latestRawStore) {
            const latestStore = JSON.parse(latestRawStore);
            if (!latestStore.state) latestStore.state = {};
            latestStore.state.pricesAddOnItems = newAddOnItems;
            latestStore.state.pricesProtectionItems = newProtectionItems.length > 0 ? newProtectionItems : [];
            sessionStorage.setItem("reservation.store", JSON.stringify(latestStore));
          }
          updateCarSummaryAndFooterPrice(calculateData, extrasAddOnsItemList, extrasProtectionItemList)
        });
      });

      // ================= Add-ons quantity listener =================
      const addOnQuantity = document.querySelectorAll("#" + TEST_ID + " .quantity-selector");
      addOnQuantity.forEach(selector => {
        const code = selector.getAttribute("data-code");
        const maxQuantity = Number(selector.getAttribute("data-max-quantity"));
        let quantity = Number(selector.querySelector("input").value);

        const minusBtn = selector.querySelector(".quantity-minus");
        const plusBtn = selector.querySelector(".quantity-plus");

        minusBtn.addEventListener("click", async (e) => {
          e.preventDefault();
          if (quantity > 0) {
            quantity--;
            selector.querySelector("input").value = quantity;
          }

          const rawStore = sessionStorage.getItem("reservation.store");
          if (!rawStore) return;
          const store = JSON.parse(rawStore);
          if (!store.state) store.state = {};

          const currentCodes = store.state.addOnItems || "";
          const codesArray = currentCodes ? currentCodes.split(",").map(function (c) { return c.trim(); }).filter(Boolean) : [];
          const addOnItemsQuantity = store.state.addOnItemsQuantity || "";
          const addOnItemsQuantityArray = addOnItemsQuantity ? addOnItemsQuantity.split(",").map(function (c) { return c.trim(); }) : [];

          const currentBackupCodes = store.state.addOnItemsBackup || "";
          const backupCodesArray = currentBackupCodes ? currentBackupCodes.split(",").map(function (c) { return c.trim(); }).filter(Boolean) : [];
          const addOnItemsQuantityBackup = store.state.addOnItemsQuantityBackup || "";
          const backupQuantityArray = addOnItemsQuantityBackup ? addOnItemsQuantityBackup.split(",").map(function (c) { return c.trim(); }) : [];

          // Keep quantityArray in sync with codesArray length
          while (addOnItemsQuantityArray.length < codesArray.length) { addOnItemsQuantityArray.push("false"); }
          addOnItemsQuantityArray.splice(codesArray.length);

          // Keep backupQuantityArray in sync with backupCodesArray length
          while (backupQuantityArray.length < backupCodesArray.length) { backupQuantityArray.push("false"); }
          backupQuantityArray.splice(backupCodesArray.length);

          var codeIndex = codesArray.indexOf(code);
          var backupCodeIndex = backupCodesArray.indexOf(code);

          if (quantity === 0) {
            // Quantity is 0 — remove code and its quantity entry
            if (codeIndex > -1) {
              codesArray.splice(codeIndex, 1);
              addOnItemsQuantityArray.splice(codeIndex, 1);
            }
            if (backupCodeIndex > -1) {
              backupCodesArray.splice(backupCodeIndex, 1);
              backupQuantityArray.splice(backupCodeIndex, 1);
            }
          } else {
            if (codeIndex === -1) {
              codesArray.push(code);
              addOnItemsQuantityArray.push(String(quantity));
            } else {
              addOnItemsQuantityArray[codeIndex] = String(quantity);
            }
            if (backupCodeIndex === -1) {
              backupCodesArray.push(code);
              backupQuantityArray.push(String(quantity));
            } else {
              backupQuantityArray[backupCodeIndex] = String(quantity);
            }
          }

          store.state.addOnItems = codesArray.join(",");
          store.state.addOnItemsQuantity = addOnItemsQuantityArray.join(",");
          store.state.addOnItemsBackup = backupCodesArray.join(",");
          store.state.addOnItemsQuantityBackup = backupQuantityArray.join(",");

          // store Protection Item
          const storeProtItemList = store.state.protectionItems || "";
          const formateStoreProtItemList = storeProtItemList.split(",").map(item => item.trim()).filter(Boolean) || [];
          //store Protection Bundles
          const storeProtectionBundle = store.state.protectionBundleSelected || {};
          const hasProtectionCode = storeProtectionBundle?.code;
          //store AddOn Bundles
          const storeAddOnBundle = store.state.addOnBundleSelected || {};
          const hasAddOnBundleCode = storeAddOnBundle?.code;
          sessionStorage.setItem("reservation.store", JSON.stringify(store));

          // Call calculatePrice with the updated addOnItems
          const addOnItems = codesArray.map(c => ({ code: c, quantity: addOnItemsQuantityArray[codesArray.indexOf(c)] === "false" ? null : addOnItemsQuantityArray[codesArray.indexOf(c)] }));


          const calculatePayload = {
            age: extrasAPIPayload.age,
            countryOfResidence: extrasAPIPayload.countryOfResidence,
            currencyCode: extrasAPIPayload.currencyCode,
            discountCodes: extrasAPIPayload.discountCodes,
            dropoffDate: extrasAPIPayload.dropoffDate,
            dropoffTime: extrasAPIPayload.dropoffTime,
            dropoffLocation: extrasAPIPayload.dropoffLocation,
            pickupDate: extrasAPIPayload.pickupDate,
            pickupTime: extrasAPIPayload.pickupTime,
            pickupLocation: extrasAPIPayload.pickupLocation,
            priceRateCode: extrasAPIPayload.priceRateCode,
            priceType: extrasAPIPayload.priceType,
            priceView: extrasAPIPayload.priceView,
            isAvisFirst: extrasAPIPayload.isAvisFirst,
            vehicleCode: extrasAPIPayload.vehicleCode,
            vehicleId: extrasAPIPayload.vehicleId,
            addOnItems: addOnItems,
            protectionItems: formateStoreProtItemList.map(item => {
              return {
                code: item || "",
              }
            }) || [],
          };
          if (hasProtectionCode) {
            const items = (storeProtectionBundle.items || [])
              .filter(item => item.included)
              .map(item => ({
                code: item.code || "",
                policy: item.policy || ""
              }));

            calculatePayload.protectionBundle = {
              code: storeProtectionBundle.code,
              items
            };
          }
          if (hasAddOnBundleCode) {
            calculatePayload.addOnBundle = {
              code: storeAddOnBundle.code,
              items: storeAddOnBundle.items.map(item => ({
                code: item.code || "",
              }))
            };
          }



          // //Call calculatePrice API
          const calculateData = await calculatePrice(calculatePayload, corelationalIdentifier);

          const calculateAddOnItems = calculateData.addOnItems || [];
          const latestRawStore = sessionStorage.getItem("reservation.store");
          if (!latestRawStore) return;
          const latestStore = JSON.parse(latestRawStore);


          const newAddOnItems = calculateAddOnItems.map(addOnItem => {
            const extraItem = extrasAddOnsItemList?.find(
              i => i.code === addOnItem.code
            );
            const matchedItem = finalAddOnItemList.find(i => i.code === addOnItem.code)
            return {
              amount: addOnItem.amount || 0,
              chargeType: addOnItem.chargeType || "",
              code: addOnItem.code || "",
              description: matchedItem ? matchedItem.name : "",
              discount: extraItem?.discount || 0,
              grossSubtotal: extraItem?.grossSubtotal,
              displayElement: addOnItem.displayElement || {},
              netSubtotal: addOnItem.netSubtotal || 0,
              netSubtotalPerUnit: addOnItem.netSubtotalPerUnit || 0,
              rentalItemUnits: addOnItem.rentalItemUnits || 0,
              quantity: addOnItem.quantity || 0,
            }
          })


          latestStore.state.pricesAddOnItems = newAddOnItems;
          sessionStorage.setItem("reservation.store", JSON.stringify(latestStore));

          // disable minus button if the quantity is zero
          const plusBtn = selector.querySelector(".quantity-plus");
          plusBtn.closest('.add-on-card')?.classList.remove("ab-max-qty")
          if (quantity <= 0) {
            plusBtn.closest('.add-on-card')?.classList.add("ab-min-qty")
          }
          else {
            plusBtn.closest('.add-on-card')?.classList.remove("ab-min-qty")
          }
          updateCarSummaryAndFooterPrice(calculateData, extrasAddOnsItemList, extrasProtectionItemList)

        })

        plusBtn.addEventListener("click", async (e) => {
          e.preventDefault();
          if (quantity < maxQuantity) {
            quantity++;
            selector.querySelector("input").value = quantity;
          }


          const rawStore = sessionStorage.getItem("reservation.store");
          if (!rawStore) return;
          const store = JSON.parse(rawStore);
          if (!store.state) store.state = {};

          const currentCodes = store.state.addOnItems || "";
          const codesArray = currentCodes ? currentCodes.split(",").map(function (c) { return c.trim(); }).filter(Boolean) : [];
          const addOnItemsQuantity = store.state.addOnItemsQuantity || "";
          const addOnItemsQuantityArray = addOnItemsQuantity ? addOnItemsQuantity.split(",").map(function (c) { return c.trim(); }) : [];

          const currentBackupCodes = store.state.addOnItemsBackup || "";
          const backupCodesArray = currentBackupCodes ? currentBackupCodes.split(",").map(function (c) { return c.trim(); }).filter(Boolean) : [];
          const addOnItemsQuantityBackup = store.state.addOnItemsQuantityBackup || "";
          const backupQuantityArray = addOnItemsQuantityBackup ? addOnItemsQuantityBackup.split(",").map(function (c) { return c.trim(); }) : [];

          // Keep quantityArray in sync with codesArray length
          while (addOnItemsQuantityArray.length < codesArray.length) { addOnItemsQuantityArray.push("false"); }
          addOnItemsQuantityArray.splice(codesArray.length);

          // Keep backupQuantityArray in sync with backupCodesArray length
          while (backupQuantityArray.length < backupCodesArray.length) { backupQuantityArray.push("false"); }
          backupQuantityArray.splice(backupCodesArray.length);

          var codeIndex = codesArray.indexOf(code);
          var backupCodeIndex = backupCodesArray.indexOf(code);

          if (codeIndex === -1) {
            codesArray.push(code);
            addOnItemsQuantityArray.push(String(quantity));
          } else {
            addOnItemsQuantityArray[codeIndex] = String(quantity);
          }

          if (backupCodeIndex === -1) {
            backupCodesArray.push(code);
            backupQuantityArray.push(String(quantity));
          } else {
            backupQuantityArray[backupCodeIndex] = String(quantity);
          }

          store.state.addOnItems = codesArray.join(",");
          store.state.addOnItemsQuantity = addOnItemsQuantityArray.join(",");
          store.state.addOnItemsBackup = backupCodesArray.join(",");
          store.state.addOnItemsQuantityBackup = backupQuantityArray.join(",");

          // store Protection Item
          const storeProtItemList = store.state.protectionItems || "";
          const formateStoreProtItemList = storeProtItemList.split(",").map(item => item.trim()).filter(Boolean) || [];
          //store Protection Bundles
          const storeProtectionBundle = store.state.protectionBundleSelected || {};
          const hasProtectionCode = storeProtectionBundle?.code;
          //store AddOn Bundles
          const storeAddOnBundle = store.state.addOnBundleSelected || {};
          const hasAddOnBundleCode = storeAddOnBundle?.code;
          sessionStorage.setItem("reservation.store", JSON.stringify(store));

          // Call calculatePrice with the updated addOnItems
          const addOnItems = codesArray.map(c => ({ code: c, quantity: addOnItemsQuantityArray[codesArray.indexOf(c)] === "false" ? null : addOnItemsQuantityArray[codesArray.indexOf(c)] }));


          const calculatePayload = {
            age: extrasAPIPayload.age,
            countryOfResidence: extrasAPIPayload.countryOfResidence,
            currencyCode: extrasAPIPayload.currencyCode,
            discountCodes: extrasAPIPayload.discountCodes,
            dropoffDate: extrasAPIPayload.dropoffDate,
            dropoffTime: extrasAPIPayload.dropoffTime,
            dropoffLocation: extrasAPIPayload.dropoffLocation,
            pickupDate: extrasAPIPayload.pickupDate,
            pickupTime: extrasAPIPayload.pickupTime,
            pickupLocation: extrasAPIPayload.pickupLocation,
            priceRateCode: extrasAPIPayload.priceRateCode,
            priceType: extrasAPIPayload.priceType,
            priceView: extrasAPIPayload.priceView,
            isAvisFirst: extrasAPIPayload.isAvisFirst,
            vehicleCode: extrasAPIPayload.vehicleCode,
            vehicleId: extrasAPIPayload.vehicleId,
            addOnItems: addOnItems,
            protectionItems: formateStoreProtItemList.map(item => {
              return {
                code: item || "",
              }
            }) || [],
          };
          if (hasProtectionCode) {
            const items = (storeProtectionBundle.items || [])
              .filter(item => item.included)
              .map(item => ({
                code: item.code || "",
                policy: item.policy || ""
              }));

            calculatePayload.protectionBundle = {
              code: storeProtectionBundle.code,
              items
            };
          }
          if (hasAddOnBundleCode) {
            calculatePayload.addOnBundle = {
              code: storeAddOnBundle.code,
              items: storeAddOnBundle.items.map(item => ({
                code: item.code || "",
              }))
            };
          }
          // //Call calculatePrice API
          const calculateData = await calculatePrice(calculatePayload, corelationalIdentifier);

          const calculateAddOnItems = calculateData.addOnItems || [];
          const latestRawStore = sessionStorage.getItem("reservation.store");
          if (!latestRawStore) return;
          const latestStore = JSON.parse(latestRawStore);


          const newAddOnItems = calculateAddOnItems.map(addOnItem => {
            const extraItem = extrasAddOnsItemList?.find(
              i => i.code === addOnItem.code
            );
            const matchedItem = finalAddOnItemList.find(i => i.code === addOnItem.code)
            return {
              amount: addOnItem.amount || 0,
              chargeType: addOnItem.chargeType || "",
              code: addOnItem.code || "",
              description: matchedItem ? matchedItem.name : "",
              discount: extraItem?.discount || 0,
              grossSubtotal: extraItem?.grossSubtotal,
              displayElement: addOnItem.displayElement || {},
              netSubtotal: addOnItem.netSubtotal || 0,
              netSubtotalPerUnit: addOnItem.netSubtotalPerUnit || 0,
              rentalItemUnits: addOnItem.rentalItemUnits || 0,
              quantity: addOnItem.quantity || 0,
            }
          })

          latestStore.state.pricesAddOnItems = newAddOnItems;
          sessionStorage.setItem("reservation.store", JSON.stringify(latestStore));

          // disable the plus button if the quantity is equal to the max quantity
          const plusBtn = selector.querySelector(".quantity-plus");
          const minusBtn = selector.querySelector(".quantity-minus");

          plusBtn.closest('.add-on-card')?.classList.remove("ab-min-qty")
          if (quantity === maxQuantity) {
            plusBtn.closest('.add-on-card')?.classList.add("ab-max-qty")

          } else {
            plusBtn.closest('.add-on-card')?.classList.remove("ab-max-qty")
            plusBtn.closest('.add-on-card')?.classList.remove("default")
          }
          updateCarSummaryAndFooterPrice(calculateData, extrasAddOnsItemList, extrasProtectionItemList)
        })

      })

      // ================== STATIC NO PROT CARD HANDLER ================
      const staticNoProtCard = document.querySelector("#" + TEST_ID + " .static-no-prot-card");
      staticNoProtCard.addEventListener("click", async (e) => {
        e.preventDefault();
        const bundleCode = staticNoProtCard.getAttribute("data-code");
        const extrasBundle = extrasProtectionBundleList.find(item => item.code === bundleCode) || {};
        const jsonBundle = finalProtectionBundleList.find(item => item.bundleName === bundleCode) || {};
        const hasJsonBundle = Object.keys(jsonBundle).length > 0;
        const jsonBundleIncludeItems = hasJsonBundle ? jsonBundle.includedProtections : [];
        const jsonBundleExcludeItems = hasJsonBundle ? jsonBundle.excludedProtections : [];
        const jsonBundleItems = [...jsonBundleIncludeItems, ...jsonBundleExcludeItems];
        const sessionOne = getSessionData();
        sessionOne.protectionBundleCode = bundleCode;
        sessionOne.protectionBundleCodeBackup = bundleCode;
        sessionOne.protectionBundleItems = "";
        sessionOne.protectionBundleItemsBackup = "";
        sessionOne.protectionBundleItemsTiers = "";
        sessionOne.protectionBundleItemsPolicies = "";

        // if any selected protection bundle
        const prevSelectedProtBundle = sessionOne.protectionBundleSelected || {};
        let prevSelectedProtBundleItems = [];
        if (Object.keys(prevSelectedProtBundle).length > 0) {
          prevSelectedProtBundleItems = prevSelectedProtBundle.items.filter(item => item.included).map(item => item.code);
        }

        // get user selected add on items
        const userSelectedAddOnItems = sessionOne.addOnItems || "";
        const userSelectedAddOnItemsArr = userSelectedAddOnItems ? userSelectedAddOnItems.split(",").map(item => item.trim()).filter(Boolean) : [];

        const prevAddOnItems = sessionOne.pricesAddOnItems || [];
        let filteredPrevAddOnItems = prevAddOnItems.length > 0 ? prevAddOnItems.map(item => {
          return {
            code: item.code || "",
            quantity: item.quantity || null,
          }
        }) : [];


        //bundle select payload
        let selectedBundlePayload = {};
        if (Object.keys(extrasBundle).length > 0) {
          selectedBundlePayload = {
            code: extrasBundle.code || "",
            title: extrasBundle?.code || "",
            defaultBundle: hasJsonBundle ? jsonBundle.defaultBundle || null : null,
            coverageRating: hasJsonBundle ? coverageRatings[jsonBundle.coverageRating] || 0 : 0,
            description: hasJsonBundle ? jsonBundle.bundleDescription.html : "",
            items: jsonBundleItems.map(item => {
              return {
                id: item.code || "",
                code: item.code || "",
                title: item.name || "",
                description: item.description.html || "",
                included: extrasBundle.items.some(i => i.code === item.code) || false,
                currencyCode: extrasBundle.currencyCode || "",
                policy: item.policy === "required" ? "MANDATORY" : "OPTIONAL",
              }
            }),
            oldPrice: avisConfigData.pricingDisplay === "dailyRate" ? extrasBundle.grossSubtotal : extrasBundle.grossTotal,
            price: avisConfigData.pricingDisplay === "dailyRate" ? extrasBundle.netSubtotal : extrasBundle.netTotal,
            recommended: hasJsonBundle ? jsonBundle.recommendedBundle : false,
            warning: hasJsonBundle ? jsonBundle.alertMessageIfSelected : "",
            bookAgain: extrasBundle.bookAgain || false,
            currencyCode: extrasBundle.currencyCode || "",
          }
        }
        sessionOne.protectionBundleSelected = selectedBundlePayload;
        sessionOne.protectionItems = "";
        sessionOne.protectionItemsBackup = "";

        sessionStorage.setItem("reservation.store", JSON.stringify({ state: sessionOne, version: 0 }));
        const finalFilterPrevAddOnItems = filteredPrevAddOnItems.filter(item => {
          const isInPrevBundle = prevSelectedProtBundleItems.includes(item.code);
          const isUserSelected = userSelectedAddOnItemsArr.includes(item.code);

          // Remove ONLY if it's in prev bundle AND NOT user selected
          return !(isInPrevBundle && !isUserSelected);
        });

        const calculatePayload = {
          age: extrasAPIPayload.age || 25,
          countryOfResidence: extrasAPIPayload.countryOfResidence,
          currencyCode: extrasAPIPayload.currencyCode,
          discountCodes: extrasAPIPayload.discountCodes,
          dropoffDate: extrasAPIPayload.dropoffDate,
          dropoffTime: extrasAPIPayload.dropoffTime,
          dropoffLocation: extrasAPIPayload.dropoffLocation,
          pickupDate: extrasAPIPayload.pickupDate,
          pickupTime: extrasAPIPayload.pickupTime,
          pickupLocation: extrasAPIPayload.pickupLocation,
          priceRateCode: extrasAPIPayload.priceRateCode,
          priceType: extrasAPIPayload.priceType,
          priceView: extrasAPIPayload.priceView || "LOWEST_PRICE",
          isAvisFirst: extrasAPIPayload.isAvisFirst,
          vehicleCode: extrasAPIPayload.vehicleCode,
          vehicleId: extrasAPIPayload.vehicleId,
          protectionBundle: {
            code: bundleCode,
            items: hasJsonBundle ? jsonBundle.includedProtections.map(item => {
              return {
                code: item.code,
                policy: item.policy === "required" ? "MANDATORY" : "OPTIONAL",
              }
            }) : []
          },
          protectionItems: [],
          addOnItems: finalFilterPrevAddOnItems,
        };

        const calculateData = await calculatePrice(calculatePayload, corelationalIdentifier);

        const calculateAddOnItems = calculateData.addOnItems || [];

        const newAddOnItems = calculateAddOnItems.map(addOnItem => {
          const extraItem = extrasAddOnsItemList?.find(
            i => i.code === addOnItem.code
          );
          const matchedItem = finalAddOnItemList.find(i => i.code === addOnItem.code)
          return {
            amount: addOnItem.amount || 0,
            chargeType: addOnItem.chargeType || "",
            code: addOnItem.code || "",
            description: matchedItem ? matchedItem.name : "",
            discount: extraItem?.discount || 0,
            grossSubtotal: extraItem?.grossSubtotal,
            displayElement: addOnItem.displayElement || {},
            netSubtotal: addOnItem.netSubtotal || 0,
            netSubtotalPerUnit: addOnItem.netSubtotalPerUnit || 0,
            rentalItemUnits: addOnItem.rentalItemUnits || 0,
            quantity: addOnItem.quantity || 0,
          }
        })

        const sessionTwo = getSessionData();
        sessionTwo.pricesProtectionItems = calculateData.protectionItems;
        sessionTwo.pricesAddOnItems = newAddOnItems || [];
        sessionStorage.setItem("reservation.store", JSON.stringify({ state: sessionTwo, version: 0 }));
        //update UI
        updateCarSummaryAndFooterPrice(calculateData, extrasAddOnsItemList, extrasProtectionItemList);
      })

      // Toggle the summary protection section
      const protAndAddOnsTotalHeader = document.querySelector('[data-testid="category-expand-button-protections-addons"]');
      protAndAddOnsTotalHeader.addEventListener("click", () => {

        const chevron = protAndAddOnsTotalHeader.querySelector(".mvt-36-chevron");
        if (chevron) {
          chevron.classList.toggle("rotate-chevron")
        }
      })
      // toggle summary tax and fees
      const taxAndFeesTotalHeader = document.querySelector('[data-testid="category-expand-button-taxes-fees"]');
      taxAndFeesTotalHeader.addEventListener("click", () => {

        const chevron = taxAndFeesTotalHeader.querySelector(".mvt-36-chevron");
        if (chevron) {
          chevron.classList.toggle("rotate-chevron")
        }
      })
      //toggle summary saving and discount
      const savingAndDiscountHeader = document.querySelector('[data-testid="category-expand-button-savings-discounts"]');
      savingAndDiscountHeader.addEventListener("click", () => {

        const chevron = savingAndDiscountHeader.querySelector(".mvt-36-chevron");
        if (chevron) {
          chevron.classList.toggle("rotate-chevron")
        }
      })

      // add-on details toggle
      const addOnDetails = document.querySelectorAll("#" + TEST_ID + " .add-on-details");
      addOnDetails.forEach((detail) => {
        detail.addEventListener("click", (e) => {
          e.preventDefault();

          const addOnCard = detail.closest(".add-on-card");
          const addOnDetailsContent = addOnCard.querySelector(".add-on-details-content");
          addOnDetailsContent.classList.toggle("expend")
        })
      })

      // protection item details toggle
      const protDetailsBtn = document.querySelectorAll("#" + TEST_ID + " .prot-details");
      protDetailsBtn.forEach((detail) => {
        detail.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          const addOnCard = detail.closest(".protection-item");
          const addOnDetailsContent = addOnCard.querySelector(".prot-details-content");
          addOnDetailsContent.classList.toggle("expend")
        })
      })

      // dynamically hide all add-on cards beyond the first 4
      const allCards = document.querySelectorAll("#" + TEST_ID + " .add-ons-content .add-on-card");

      allCards.forEach((card, i) => {
        if (i >= 4) {

          card.classList.add("add-ons-extra-card")
        };
      });

      // Add-On items view all toggle 
      const addOnBtn = document.querySelector("#" + TEST_ID + " .add-on-btn-all-packages");
      const addOnItems = document.querySelectorAll("#" + TEST_ID + " .add-ons-content .add-on-card");
      if (addOnBtn) {
        addOnBtn.addEventListener("click", (e) => {
          e.preventDefault();
          addOnItems.forEach((item, i) => {
            if (i >= 4) {
              item.classList.toggle("add-ons-extra-card");
            }
          });
          addOnBtn.textContent = addOnBtn.textContent === "View all add-ons options" ? "Hide all add-ons options" : "View all add-ons options";
        });
      }
      // Protection budle toggle
      const btn = document.querySelector("#" + TEST_ID + " .btn-all-packages");
      const container = document.querySelector("#" + TEST_ID + " .prot-cards");
      if (btn && container) {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          container.classList.toggle("show-all");
          btn.textContent = container.classList.contains("show-all") ? "Hide protection package" : "View all protection packages";
        });
      }


      // Protection items toggle
      const btnItems = document.querySelector("#" + TEST_ID + " .btn-all-packages-items");
      const containerItems = document.querySelector("#" + TEST_ID + " .protection-items-section");
      if (btnItems && containerItems) {
        btnItems.addEventListener("click", (e) => {
          e.preventDefault();
          containerItems.classList.toggle("show-all");
          btnItems.textContent = containerItems.classList.contains("show-all") ? "Hide protection options" : "View all protection options";
        });
      }

      // ============ MEMBER PAY NOW SECTION =============
      const el = document.querySelector('[data-testid="rate-terms-accordion"]');
      if (el) {
        const nextEl = el.nextElementSibling;
        if (nextEl) {
          const hasSavings = nextEl?.textContent?.toLowerCase().includes("savings");
          const hasMaxDiscount = nextEl.textContent.includes("MAX DISCOUNT");
          if (hasSavings || hasMaxDiscount) {
            nextEl.style.display = "none";
          }
        }
      }

      // CHANGE THE ORDER OR PREFERRED POINT SECTION
      poll(
        () => document.querySelector('[data-testid="pay-with-points-container"]'),
        () => {
          const existingPwpCard = document.querySelector('[data-testid="pay-with-points-container"]');
          if (existingPwpCard) {
            const parentEl = existingPwpCard.parentElement;
            if (parentEl) {
              const mvtEl = document.getElementById(TEST_ID);
              if (mvtEl) {
               mvtEl.insertAdjacentElement("afterend", parentEl) 
              }
            }
          }
        }
      )

      //progress bar number change to 3
      poll(
        () => document.querySelector('[data-testid="stepper-step-label-4"] .Mui-active div'),
        () => {
          const activeCircle = document.querySelector('[data-testid="stepper-step-label-4"] .Mui-active div');
          if (activeCircle) {
            activeCircle.textContent = '3';
          }
        }
      )
    }

    /* ---------------- poll/observer manager ---------------- */
    function init() {
      if (document.getElementById(TEST_ID) || isInjectionInProgress) return;
      isInjectionInProgress = true;

      poll(
        () => document.querySelector(SELECTORS.target),
        () => {
          // Extra delay to let React's initial mount/hydration settle
          // Especially important on cold boot (refresh)
          setTimeout(() => {
            if (!document.getElementById(TEST_ID)) {
              inject();
            }
            isInjectionInProgress = false;
            observeDOM();
          }, 800);
        }
      );
    }

    function observeDOM() {
      if (globalObserver) return; // Prevent multiple observers

      globalObserver = new MutationObserver((mutations) => {
        // If our element was removed, try to re-init
        if (!document.getElementById(TEST_ID) && location.pathname.includes("/reservation/review-and-book")) {

          init();
        }
      });

      globalObserver.observe(document.body, {
        childList: true,
        subtree: true
      });
    }

    init();
  }
  // route list
  const ROUTE_HANDLERS = [
    {
      path: "/reservation/protectioncoverage",
      handler: runProtectionCoverage
    },
    {
      path: "/reservation/review-and-book",
      handler: runReviewAndBook
    }
  ];
  // route handler
  function handleRoute(path) {
    ROUTE_HANDLERS.forEach((route) => {
      if (path.includes(route.path)) {
        Promise.resolve(route.handler()).catch(err => {
          console.error("Route handler error:", err);
        });
      }
    })
  }
  // URL detector
  function onUrlChange(callback) {
    let lastPath = location.pathname;

    const check = () => {
      const currentPath = location.pathname;

      if (currentPath !== lastPath) {
        lastPath = currentPath;
        callback(currentPath);
      }
    };

    const pushState = history.pushState;
    history.pushState = function () {
      pushState.apply(this, arguments);
      check();
    };

    const replaceState = history.replaceState;
    history.replaceState = function () {
      replaceState.apply(this, arguments);
      check();
    };

    window.addEventListener("popstate", check);
  }

  // reset function
  function resetState() {
    isInjectionInProgress = false;
    const el = document.getElementById("POC");
    if (el) el.remove();
    document.body.classList.remove("POC-VAR_A");
  }

  // current route
  let CURRENT_ROUTE = "";

  // safe route hander Fn
  function safeRouteHander(path) {
    if (path === CURRENT_ROUTE) return;
    CURRENT_ROUTE = path;

    // optional: reset previous stuff
    resetState();
    handleRoute(path)
  }

  // on first load
  safeRouteHander(location.pathname);

  // SPA navigation
  onUrlChange(path => {
    safeRouteHander(path)
  })

})();