export function identifyModal(getSessionData, updateCarSummaryAndFooterPrice, fmtTime, calculatePrice, corelationalIdentifier, extrasAddOnsItemList, extrasProtectionItemList) {
    const TARGET_SELECTOR = '[data-testid="expanded-vehicle-card-car-wrapper"]';
    const INJECT_CLASS = 'mvt-36-modal';

    function applyClass() {
        const target = document.querySelector(TARGET_SELECTOR);
        if (target && target.parentElement && !target.parentElement.classList.contains(INJECT_CLASS)) {
            console.log("applyClass");
            target.parentElement.classList.add(INJECT_CLASS);
            window.__mvtRateSelectModalOpen = true;
            const modalCloseBtn = document.querySelector('[data-testid="expanded-card-close-button"]')
            // if (modalCloseBtn) {
            //     modalCloseBtn.addEventListener('click', () => {
            //         window.__mvtRateSelectModalOpen = false;
            //     })
            // }
            // const modalOuter = modalCloseBtn.closest('.MuiDialog-container')
            // if(modalOuter){
            //     modalOuter.addEventListener('click', () => {
            //         window.__mvtRateSelectModalOpen = false;
            //     })
            // }   
            // get session data
            const sessionData = getSessionData();
            console.log("sessionData", sessionData)
            const priceType = sessionData.priceType;
            const memberPayNowBtn = document.querySelector('#memberRate-content [data-testid="payNow-button"]')
            const memberPayLater = document.querySelector('#memberRate-content [data-testid="payLater-button"]')
            const vehiclePayNow = document.querySelector('#standardRate-content [data-testid="payNow-button"]')
            // const buttonList = [memberPayNowBtn, memberPayLater]
            // console.log("buttonList", buttonList)
            // const prevDisabledBtn = buttonList.find(btn => btn.hasAttribute("disabled"))
            // console.log("prevDisabledBtn", prevDisabledBtn)
            // if (prevDisabledBtn) {
            //     prevDisabledBtn.textContent = 'Select Rate'
            //     prevDisabledBtn.removeAttribute("disabled")
            //     prevDisabledBtn.classList.remove("mvt-36-disabled")
            //     prevDisabledBtn.classList.remove("Mui-disabled")
            //     prevDisabledBtn.classList.remove("tertiary")
            //     prevDisabledBtn.classList.add("primary")
            // }
            // if (priceType === "MEMBER_PAY_NOW") {
            //     memberPayNowBtn.textContent = 'Current Rate'
            //     memberPayNowBtn.setAttribute("disabled", "")
            //     memberPayNowBtn.classList.add("mvt-36-disabled")
            // } else if (priceType === "MEMBER_PAY_LATER") {
            //     memberPayLater.textContent = 'Current Rate'
            //     memberPayLater.setAttribute("disabled", "")
            //     memberPayLater.classList.add("mvt-36-disabled")
            // } else if (priceType === "VEHICLE_LEISURE_PAY_NOW") {
            //     vehiclePayNow.textContent = 'Current Rate'
            //     vehiclePayNow.setAttribute("disabled", "")
            //     vehiclePayNow.classList.add("mvt-36-disabled")
            // }
            // console.log("priceType", priceType)
            // console.log('memberPayNowBtn', memberPayNowBtn)
            if (memberPayNowBtn) {
                memberPayNowBtn.addEventListener('click', () => {
                    if (window.__avisReservationState) {
                        window.__avisReservationState.priceType = "MEMBER_PAY_NOW";
                    }
                })
            }
            if (memberPayLater) {
                memberPayLater.addEventListener('click', () => {
                    if (window.__avisReservationState) {
                        window.__avisReservationState.priceType = "MEMBER_PAY_LATER";
                    }
                })
            }
            if (vehiclePayNow) {
                vehiclePayNow.addEventListener('click', () => {
                    if (window.__avisReservationState) {
                        window.__avisReservationState.priceType = "VEHICLE_LEISURE_PAY_NOW";
                    }
                })
            }
        }
    }

    // Run once immediately in case element is already in the DOM
    applyClass();

    // Observe any future DOM mutations
    const observer = new MutationObserver(() => {
        applyClass();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
}