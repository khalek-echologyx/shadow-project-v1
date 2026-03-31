(() => {
  const TEST_ID = "POC";
  const VARIATION = "VAR_A";

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
    let res = await fetch(`https://www.avis.com/content/admin/location.json/avis/en_us/${dataKey}/${pickupLocation}.json`);
    let data = await res.json();
    return data.data || {};
  }
  //getSession data
  function getSessionData() {
    const sessionData = sessionStorage.getItem("reservation.store");
    return sessionData ? JSON.parse(sessionData).state : {};
  }
  //get corelational identifier
  function getCorelationalIdentifier() {
    const corelationalIdentifier = sessionStorage.getItem("correlationIdentifier");
    return corelationalIdentifier;
  }
  //get extras api data
  async function getExtrasData(payload, corelationalIdentifier) {
    try {
      let res = await fetch(`https://www.avis.com/web/reservation/extras?context.locale=en-US&context.domainCountry=US&context.correlationIdentifier=${corelationalIdentifier}&device=WEB`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error(`Extras API failed with status ${res.status}`);
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
    let res = await fetch(`https://www.avis.com/web/reservation/price/calculate?context.locale=en-US&context.domainCountry=US&context.correlationIdentifier=${corelationalIdentifier}&device=WEB`, {
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
    let res = await fetch(`https://www.avis.com/en/.config.json`);
    let data = await res.json();
    return data || {};
  }

  let globalObserver = null;
  let isInjectionInProgress = false;

  async function runReviewAndBook() {
    const SELECTORS = {
      target: '[data-testid="rc-title"]'
    };
    //Get pickup location
    const pickupLocation = getParams("pickup_location_code").toLowerCase() || "";

    //Get protection data 
    let rowProtectionData = await getProtectionAndAddOnsData("protections", pickupLocation);
    console.log(rowProtectionData, "rowProtectionData");
    const protectionItems = rowProtectionData?.protectionReferencesList?.items[0]?.protectionList || [];
    console.log(protectionItems, "protectionItems");
    const protectionBundleList = rowProtectionData?.protectionBundleList?.items || [];
    console.log(protectionBundleList, "protectionBundleList");
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

    console.log(sanitizedProtectionBundleList, "sanitizedProtectionBundleList");

    //Get add-ons data
    let rowAddOnsData = await getProtectionAndAddOnsData("add-ons", pickupLocation);
    let concattedAddOnsList = [];
    rowAddOnsData?.addOnCategoryList?.items?.forEach(item => {
      concattedAddOnsList.push(...item?.addOnList)
    });
    const addOnsBundleList = rowAddOnsData?.addOnBundleList?.items || [];
    console.log(addOnsBundleList, "addOnsBundleList");
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
    const extrasAPIPayload = {
      pickupLocation: sessionData.pickupLocationCode,
      dropoffLocation: sessionData.returnLocationCode,
      pickupDate: sessionData.pickupDatetime.split("T")[0],
      pickupTime: `${sessionData.pickupHour}:00`,
      dropoffDate: sessionData.returnDatetime.split("T")[0],
      dropoffTime: `${sessionData.returnHour}:00`,
      age: Number(sessionData.age),
      discountCodes: sessionData.discountCodes || [],
      priceView: sessionData.priceView,
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
    const corelationalIdentifier = getCorelationalIdentifier();
    // ====================== GET EXTRAS DATA
    const extrasData = await getExtrasData(extrasAPIPayload, corelationalIdentifier);
    console.log(extrasData, "extrasData");

    if (!extrasData) {
      console.warn("Extras API failed. Aborting VWA test script for this session to prevent broken UI.");
      return;
    }

    //Get avis config data
    const avisConfigData = await getAvisConfigData();
    console.log(avisConfigData, "avisConfigData");

    // PROTECTION SANITIZATION
    const extrasProtectionItemList = extrasData?.protectionItems || [];
    const extrasProtectionBundleList = extrasData && extrasData?.protectionBundles || [];
    console.log(extrasProtectionBundleList, "extrasProtectionBundleList");
    const filteredProtectionItemList = protectionItems.filter((item) => {
      return extrasProtectionItemList.some((protection) => protection.code === item.code);
    });
    //final protection item list
    const finalProtectionItemList = filteredProtectionItemList.filter(item => item.enabled === true)
    console.log(finalProtectionItemList, "finalProtectionItemList");
    // final protection bundle list
    const finalProtectionBundleList = protectionBundleList.map(item => {
      const exProtBundle = extrasProtectionBundleList.find(ex => ex.code === item.bundleName)
      return {
        ...item,
        grossSubtotal: exProtBundle?.grossSubtotal || 0,
        grossTotal: exProtBundle?.grossTotal || 0,
        netSubtotal: exProtBundle?.netSubtotal || 0,
        netTotal: exProtBundle?.netTotal || 0,
      }
    })
    console.log(finalProtectionBundleList, "finalProtectionBundleList");
    // ADD-ONS SANITIZATION
    const extrasAddOnsItemList = extrasData?.addOnItems || [];
    console.log(concattedAddOnsList, "concattedAddOnsList");
    const filteredAddOnsItemList = concattedAddOnsList.map((item) => {
      const matchedExtra = extrasAddOnsItemList.find(
        (extra) => extra.code === item.code
      );
      if (!matchedExtra) return null;
      return {
        ...item,
        grossSubtotal: matchedExtra?.grossSubtotal || 0
      };
    }).filter(Boolean);
    // final add-ons list
    const finalAddOnItemList = filteredAddOnsItemList.filter(item => item.enabled === true)
    console.log(finalAddOnItemList, "finalAddOnItemList");
    // Add-ons bundle list
    const extrasAddonBundleList = extrasData?.addOnBundles || [];
    console.log(extrasAddonBundleList, "extrasAddonBundleList");
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
    console.log(finalAddOnBundleList, "finalAddOnBundleList");

    //New section
    const protSection = `
      <div class="new-prot-bundle" id="${TEST_ID}">
      <h2 class="prot-title">WHICH PROTECTION DO YOU NEED?</h2>
      <div class="prot-cards">
        ${finalProtectionBundleList?.map(prot => {
          return `
          <div class="prot-card selected" data-code="${prot.bundleName || ""}">
          <div class="card-body">
            <div class="card-info">
              <h3 class="card-title">${prot.bundleName || ""}</h3>
              <p class="card-subtitle text-red">
                Deductible: up to full vehicle value
              </p>
            </div>
            <div class="card-radio">
              <div class="radio-outer">
                <div class="radio-inner"></div>
              </div>
            </div>
          </div>
          <div class="card-actions">
            <div class="view-coverage">
              View coverage <span class="chevron"></span>
            </div>
            <div class="price-info">$${prot.grossSubtotal}/day</div>
          </div>
        </div>
          `;
        }).join("")}
      </div>
      <div class="prot-all-packages">
        <button class="btn-all-packages">View all protection packages</button>
      </div>
      <div class="protection-items-section">
        ${finalProtectionItemList.map((item) => {
      return `
              <div class="protection-item">
                <div class="protection-item-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l9 6.5-3.5 10.5h-11L3 8.5 12 2z"></path></svg>
                </div>
                <div class="protection-item-info">
                  <h4 class="protection-item-title">${item.name}</h4>
                  <p class="protection-item-price">$00</p>
                </div>
                <div class="add-on-actions">
                  <a href="#" class="add-on-details" data-code="${item.code}">Details</a>
                  <label class="protection-item-toggle">
                    <input type="checkbox" data-code="${item.code}">
                    <span class="slider"></span>
                  </label>
                </div>
              </div>
            `;
    }).join("")}
      </div>
      <!-- Add-ons section -->
      <div class="add-ons-section">
        <div class="add-on-bundles-section">
          <h3 class="add-ons-title">Select add-ons Bundles</h3>
          <div class="add-on-bundles-content">
            ${finalAddOnBundleList.map(item=>{
              return `
                  <div class="add-on-bundle-card" data-add-on-bundle-code="${item.bundleName}">
                    <div>${item.bundleName}</div>
                    <div class="add-on-bundle-select-btn">$${item.grossSubtotal}/day</div>
                  </div>
              `;
            }).join("")}
            
          </div>
        </div>
        <h3 class="add-ons-title">Select add-ons</h3>
        <div class="add-ons-content">
          ${finalAddOnItemList.map((item) => {
      return `
              <div class="add-on-card">
                <div class="add-on-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l9 6.5-3.5 10.5h-11L3 8.5 12 2z"></path></svg>
                </div>
                <div class="add-on-info">
                  <h4 class="add-on-title">${item.name}</h4>
                  <p class="add-on-price">$${item.grossSubtotal}</p>
                </div>
                <div class="add-on-actions">
                  <a href="#" class="add-on-details" data-code="${item.code}">Details</a>
                  <label class="add-on-toggle">
                    <input type="checkbox" data-code="${item.code}">
                    <span class="slider"></span>
                  </label>
                </div>
              </div>
            `;
    }).join("")}
        </div>
        <div class="add-ons-footer">
           <button class="btn-all-packages">View all add-ons options</button>
        </div>
      </div>
    </div>`;


    /* ---------------- main injection ---------------- */

    function inject() {
      const rawTarget = document.querySelector(SELECTORS.target);
      const target = rawTarget.parentElement;
      if (!target) return;
      if (document.getElementById(TEST_ID)) return;
      target.insertAdjacentHTML("afterend", protSection);
      document.body.classList.add(`${TEST_ID}-${VARIATION}`);

      // Protection Bundle Selection
      const protectionBundleCards = document.querySelectorAll(`#${TEST_ID} .prot-card`);
      protectionBundleCards.forEach(card => {
        card.addEventListener("click", async() => {
          const bundleCode = card.getAttribute("data-code");
          console.log(bundleCode, "bundleCode");
          const jsonBundle = finalProtectionBundleList.find(item => item.bundleName === bundleCode);
          console.log(jsonBundle, "jsonBundle");
          const jsonBundleItems = [...jsonBundle.includedProtections, ...jsonBundle.excludedProtections];
          console.log(jsonBundleItems, "jsonBundleItems");
          const extrasBundle = extrasProtectionBundleList.find(item => item.code === bundleCode);
          console.log(extrasBundle, "extrasBundle");
          const rawStore = sessionStorage.getItem("reservation.store");
          if (!rawStore) return;
          const store = JSON.parse(rawStore) || {};
          store.state.protectionBundleCode = bundleCode;
          console.log(store, "store");
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
          console.log(selectedBundlePayload, "selectedBundlePayload");
          store.state.protectionBundleSelected = selectedBundlePayload;
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
            reservationId: extrasAPIPayload.reservationId,
            priceView: extrasAPIPayload.priceView,
            isAvisFirst: extrasAPIPayload.isAvisFirst,
            vehicleCode: extrasAPIPayload.vehicleCode,
            vehicleId: extrasAPIPayload.vehicleId,
            protectionItems: [],
            protectionBundle: {
              code: bundleCode,
              items: jsonBundle.includedProtections.map(item => {
                return {
                  code: item.code,
                  policy: item.policy === "required" ? "MANDATORY" : "OPTIONAL",
                }
              })
            }
          };
          console.log(calculatePayload, "calculatePayload");
          const calculateData = await calculatePrice(calculatePayload, corelationalIdentifier);
          console.log(calculateData, "calculateData");
          const calculateProtectionItems = calculateData.protectionItems || [];
          const calculateAddonItems = calculateData.addOnItems || [];
          let sessionProtectionItems = store.state.pricesProtectionItems || [];
          let sessionAddonItems = store.state.pricesAddonItems || [];
          console.log(calculateProtectionItems, "calculateProtectionItems");

          calculateProtectionItems.forEach(item => {
            const formatteddItem = {
            amount: extrasBundle?.netTotal,
            chargeType: extrasBundle.chargeType,
            code: item.code,
            description: jsonBundleItems.find(i => i.code === item.code).name || "",
            netSubtotal: item.netSubtotal,
            netSubtotalPerUnit: item.netSubtotalPerUnit,
            rentalItemUnits: item.rentalItemUnits,
          }
            const sessionItem = sessionProtectionItems.find(i => i.code === item.code);
            if (!sessionItem) {
              sessionProtectionItems.push(formatteddItem);
            } 
          })
          calculateAddonItems.forEach(item => {
            const formatteddItem = {
            amount: extrasBundle?.netTotal,
            chargeType: extrasBundle.chargeType,
            code: item.code,
            description: jsonBundleItems.find(i => i.code === item.code).name || "",
            netSubtotal: item.netSubtotal,
            netSubtotalPerUnit: item.netSubtotalPerUnit,
            rentalItemUnits: item.rentalItemUnits,
          }
            const sessionItem = sessionAddonItems.find(i => i.code === item.code);
            if (!sessionItem) {
              sessionAddonItems.push(formatteddItem);
            } 
          })
          console.log(sessionProtectionItems, "sessionProtectionItems");
          console.log(sessionAddonItems, "sessionAddonItems");
          store.state.pricesProtectionItems = sessionProtectionItems;
          store.state.pricesAddonItems = sessionAddonItems;
          sessionStorage.setItem("reservation.store", JSON.stringify(store));
        });
      });

      // Protection items toggle listener
      const protectionToggles = document.querySelectorAll(`#${TEST_ID} .protection-item-toggle input`);
      protectionToggles.forEach(toggle => {
        toggle.addEventListener("change", async (e) => {
          const code = e.target.getAttribute("data-code");
          const protectionItemPrice = extrasProtectionItemList.find(item => item.code === code)
          console.log(protectionItemPrice, "protectionItemPrice");
          const jsonProtectionItem = protectionItems?.find(item => item.code === code)
          console.log(jsonProtectionItem, "jsonProtectionItem");

          const rawStore = sessionStorage.getItem("reservation.store");
          console.log(rawStore, "rawStore");
          if (!rawStore) return;

          const store = JSON.parse(rawStore);
          const currentCodes = store.state.protectionItems;
          console.log(currentCodes, "currentCodes");
          const codesArray = currentCodes ? currentCodes.split(",").map(c => c.trim()).filter(Boolean) : [];
          const index = codesArray.indexOf(code);
          if (index > -1) {
            codesArray.splice(index, 1);
          } else {
            codesArray.push(code);
          }
          store.state.protectionItems = codesArray.join(",");
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
            reservationId: extrasAPIPayload.reservationId,
            priceView: extrasAPIPayload.priceView,
            isAvisFirst: extrasAPIPayload.isAvisFirst,
            vehicleCode: extrasAPIPayload.vehicleCode,
            vehicleId: extrasAPIPayload.vehicleId,
            protectionItems: codesArray.map(c => ({ code: c })),
          };

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
          console.log(pricePayloadProtectionItem, "pricePayloadProtectionItem");
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
            console.log("pricesProtectionItems updated:", pricesProtectionItems);
          }
        });
      });

      // Add-ons bungle selection
      const uiAddOnsBundleList = document.querySelectorAll(".add-on-bundle-card");
      uiAddOnsBundleList.forEach(addOnBundle => {
        addOnBundle.addEventListener("click", async (e) => {
          const bundleCode = addOnBundle.getAttribute("data-add-on-bundle-code");
          const extrasBundle = extrasAddonBundleList.find(item => item.code === bundleCode)
          console.log(extrasBundle, "extrasBundle");
          const jsonBundle = addOnsBundleList.find(item => item.bundleName === bundleCode)
          console.log(jsonBundle, "jsonBundle");
          
        });
      });

      // Add-ons toggle listener
      const addOnToggles = document.querySelectorAll(`#${TEST_ID} .add-on-toggle input`);
      addOnToggles.forEach(toggle => {
        toggle.addEventListener("change", async (e) => {
          const code = e.target.getAttribute("data-code");
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

          store.state.addOnItems = codesArray.join(",");
          store.state.addOnItemsQuantity = quantityArray.join(",");
          sessionStorage.setItem("reservation.store", JSON.stringify(store));

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
            reservationId: extrasAPIPayload.reservationId,
            priceView: extrasAPIPayload.priceView,
            isAvisFirst: extrasAPIPayload.isAvisFirst,
            vehicleCode: extrasAPIPayload.vehicleCode,
            vehicleId: extrasAPIPayload.vehicleId,
            addOnItems: codesArray.map(c => ({ code: c }))
          };
          // //Call calculatePrice API
          const calculateData = await calculatePrice(calculatePayload, corelationalIdentifier);
          const calculateAddonItem = calculateData?.addOnItems?.find(item => item.code === code);

          const pricePayloadAddonItem = {
            amount: calculateAddonItem.grossSubtotal,
            chargeType: addOnItemPrice.chargeType,
            code: addOnItemPrice.code,
            description: jsonAddonItem.name,
            discount: addOnItemPrice.discount,
            displayElement: calculateAddonItem.displayElement,
            grossSubtotal: addOnItemPrice.grossSubtotal,
            netSubtotal: calculateAddonItem.netSubtotal,
            netSubtotalPerUnit: calculateAddonItem.netSubtotalPerUnit,
            rentalItemUnits: calculateAddonItem.rentalItemUnits,
          }

          // Update pricesAddOnItems in sessionStorage
          const latestRawStore = sessionStorage.getItem("reservation.store");
          if (latestRawStore) {
            const latestStore = JSON.parse(latestRawStore);
            if (!latestStore.state) latestStore.state = {};

            let pricesAddOnItems = latestStore.state.pricesAddOnItems || [];

            const existingIndex = pricesAddOnItems.findIndex(item => item.code === code);
            if (existingIndex > -1) {
              // Item already exists — remove it (deselected)
              pricesAddOnItems.splice(existingIndex, 1);
            } else {
              // Item not found — add it (selected)
              pricesAddOnItems.push(pricePayloadAddonItem);
            }

            latestStore.state.pricesAddOnItems = pricesAddOnItems;
            sessionStorage.setItem("reservation.store", JSON.stringify(latestStore));
            console.log("pricesAddOnItems updated:", pricesAddOnItems);
          }
        });
      });

      // dynamically hide all cards beyond the first 2
      const allCards = document.querySelectorAll(`#${TEST_ID} .prot-card`);
      allCards.forEach((card, i) => {
        if (i >= 2) {
          card.classList.add("prot-card--extra")
        };
      });

      // accordion toggle
      const btn = document.querySelector(`#${TEST_ID} .btn-all-packages`);
      const container = document.getElementById(TEST_ID);
      if (btn && container) {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          const isExpanded = container.classList.toggle("show-all");
          btn.textContent = isExpanded ? "View less" : "View all protection packages";
        });
      }

      console.log(`${TEST_ID} injected`);
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
          console.log(`${TEST_ID} removed from DOM, re-initializing...`);
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