(function () {
  var interval = setInterval(function () {
    if (document.head) {
      // Check if <head> exists
      clearInterval(interval); // Stop checking once found
      var style = document.createElement("style");
      style.innerHTML = `html {
  position: relative;
}
html::before {
  content: "AB test pilot CSS";
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99999999999;
  background: #ff0000;
  color: #ffffff;
  padding: 10px;
  border: 7px solid #269b11;
}

.promo-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  background: #fff;
  margin: 16px -12px;
  padding: 20px;
}

.promo-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.promo-item-content {
  color: #00539f;
  font-size: 14px;
}

.promo-item-img {
  height: 28px;
  width: 28px;
}

.promo-img-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.promo-group-img {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.promo-more-count {
  font-size: 12px;
  font-weight: 500;
  color: #333;
  margin-top: 5px;
}

.promo-item-img-group {
  display: flex;
  gap: 8px;
}

.custom-sidebar-content {
  margin-top: 20px;
}

.custom-sidebar-accordion {
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  background: #fff;
  padding: 10px;
}

.custom-sidebar-accordion-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.custom-sidebar-accordion-icon {
  transition: transform 0.3s ease;
}

.custom-sidebar-accordion-title {
  font-size: 18px;
  color: #00539f;
  font-weight: 600;
}

.custom-sidebar-accordion-btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cust-sidebar-accordion-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.35s ease;
}

.custom-sidebar-accordion-content-text {
  color: #666666;
}

.custom-sidebar-accordion-content-inner {
  padding: 8px 0;
}

.payment-select-wrapper {
  width: 100%;
  margin-top: 8px;
}

.payment-select {
  width: 100%;
  max-width: 100%;
  appearance: none;
  -webkit-appearance: none;
}

.payment-select:focus {
  padding: 0px 40px 0px 10px !important;
}

.custom-color-storage-container {
  display: flex;
  gap: 16px;
  margin: 16px 0;
}

.custom-color-storage-container .custom-color {
  width: 60%;
}

.custom-color-storage-container .custom-storage {
  width: 40%;
}

.custom-color,
.custom-storage {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.custom-color-title,
.custom-storage-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.custom-color-options,
.custom-storage-options,
.custom-select-ui {
  width: 100%;
  padding: 8px 32px 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  background: #fff;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  position: relative;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23333' d='M1.41 0L6 4.58 10.59 0 12 1.41l-6 6-6-6z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 12px;
}
.custom-color-options:focus,
.custom-storage-options:focus,
.custom-select-ui:focus {
  outline: 2px solid #00539f;
  outline-offset: 2px;
}

.custom-select-ui {
  padding: 0;
  background-image: none;
  height: 38px;
}
.custom-select-ui .custom-select-selected {
  padding: 8px 32px 8px 12px;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23333' d='M1.41 0L6 4.58 10.59 0 12 1.41l-6 6-6-6z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 12px;
}
.custom-select-ui .custom-select-options {
  display: none;
  position: absolute;
  top: 100%;
  left: -1px;
  right: -1px;
  background: #fff;
  border: 1px solid #ccc;
  border-top: none;
  z-index: 100;
  max-height: 250px;
  overflow-y: auto;
  border-radius: 0 0 4px 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.custom-select-ui._open {
  border-radius: 4px 4px 0 0;
}
.custom-select-ui._open .custom-select-options {
  display: block;
}
.custom-select-ui .custom-select-option {
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background 0.2s;
}
.custom-select-ui .custom-select-option:hover {
  background: #f0f7ff;
}
.custom-select-ui .custom-select-option.selected {
  background: #e6f2ff;
  font-weight: 600;
}
.custom-select-ui .color-dot,
.custom-select-ui .selected-color-dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.color-dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.custom-grid-system {
  display: grid !important;
  grid-template-columns: repeat(2, 1fr) !important;
}

.custom-cc-savings {
  display: block !important;
  flex: 0 0 100%;
}
.custom-cc-savings .clubcard-stripe {
  display: flex;
  justify-content: flex-start;
  background-color: #fcd700;
  color: #333;
  width: 100%;
  border-radius: 12px;
  margin: 5px 0 28px;
}
.custom-cc-savings .clubcard-stripe .clubcard-stripe__logo {
  padding: 0;
  display: flex;
  width: 56px;
  min-height: 56px;
  background-color: #00539f;
  border-radius: 12px 0 0 12px;
  flex: 0 0 56px;
  border-right: 4px solid #fff;
}
.custom-cc-savings .clubcard-stripe .clubcard-stripe__logo span {
  display: flex;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  text-align: center;
  align-items: center;
  font-size: 10px;
  line-height: 1;
  font-weight: 400;
  font-family: "TESCOModern-Bold", Tahoma, sans-serif;
  background-color: #00539f;
  color: #fff;
}
.custom-cc-savings .clubcard-stripe .clubcard-stripe__info {
  font-size: 16px;
  font-weight: 400;
  font-family: "TESCOModern-Bold", Tahoma, sans-serif;
  display: flex;
  padding: 0 10px;
  line-height: 1.25;
  align-content: center;
  flex-wrap: wrap;
}

.custom-cc-wrapper {
  display: grid !important;
  grid-template-columns: repeat(2, 1fr) !important;
}
.custom-cc-wrapper .field {
  height: 96px !important;
}
.custom-cc-wrapper .field .label {
  flex-direction: column !important;
  align-items: start !important;
}
.custom-cc-wrapper .field .label .allowance {
  flex-direction: row !important;
  align-items: flex-start !important;
  position: static !important;
}
.custom-cc-wrapper .field .label .allowance span {
  margin-top: -2px !important;
  margin-left: 4px !important;
}
.custom-cc-wrapper
  .field
  .label
  .price
  .clubcard-price-wrapper
  .clubcard-price-label {
  display: none;
}

.new-grid-section {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}
.new-grid-section .field {
  height: 96px !important;
}
.new-grid-section .field .label {
  flex-direction: column !important;
  align-items: start !important;
  padding: 12px 12px !important;
}
.new-grid-section .field .label .allowance {
  flex-direction: row !important;
  align-items: flex-start !important;
  position: static !important;
}
.new-grid-section .field .label .allowance span {
  margin-top: -2px !important;
  margin-left: 4px !important;
}
.new-grid-section .field .label .price {
  bottom: 12px !important;
}
.new-grid-section .field .label .price .regular-price-wrapper span {
  visibility: hidden;
  position: relative;
  padding: 0 !important;
}
.new-grid-section .field .label .price .regular-price-wrapper span::after {
  content: "/month";
  visibility: visible;
  position: absolute;
  left: 0;
}
.new-grid-section
  .field
  .label
  .price
  .clubcard-price-wrapper
  .clubcard-price-label {
  display: none;
}

.clubcard-price-wrapper {
  background-color: #fcd700;
  padding: 0 5px;
}

.clubcard-price-value {
  visibility: hidden;
  padding: 0 !important;
}

.clubcard-price-value span {
  position: relative;
  visibility: visible;
}

.clubcard-price-value span::after {
  content: "/month";
  position: absolute;
  left: 113%;
  font-size: 14px;
  font-family: "TESCOModern-Regular", Tahoma, sans-serif;
}

._has-modal .modal-slide {
  max-width: 320px;
}

.data-cal-section {
  margin-top: 20px;
}

.custom-data-calculator {
  padding-bottom: 10px;
}
.custom-data-calculator .custom-data-calculator__header-container h1 {
  color: #00539f;
  font-size: 24px;
  line-height: normal;
  margin: 0 0 8px;
  font-weight: bold;
}
.custom-data-calculator .custom-data-calculator__header-container .subtitle {
  font-size: 18px;
}
.custom-data-calculator .custom-data-calculator__header-container .description {
  font-size: 13px;
}
.custom-data-calculator
  .custom-data-calculator__content
  .data-calculator__context {
  flex-basis: 100%;
  margin: 0px !important;
}
.custom-data-calculator
  .custom-data-calculator__content
  .data-calculator__context
  input {
  display: none;
}
.custom-data-calculator
  .custom-data-calculator__content
  .data-calculator__context
  input.calc__input {
  border-color: #00539f;
  margin-top: 10px;
  margin-bottom: 18px;
  padding: 3px;
  width: 170px;
}
.custom-data-calculator
  .custom-data-calculator__content
  .data-calculator__context__row {
  display: flex;
  margin: 12px 0;
  gap: 20px;
}
.custom-data-calculator
  .custom-data-calculator__content
  .data-calculator__context__row
  .data-calculator__context__label {
  display: block;
  width: 40%;
}
.custom-data-calculator
  .custom-data-calculator__content
  .data-calculator__context__row
  .data-calculator__context__values {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}
.custom-data-calculator
  .custom-data-calculator__content
  .data-calculator__context__row
  .data-calculator__context__values
  label {
  display: block;
  width: 50%;
}
.custom-data-calculator
  .custom-data-calculator__content
  .data-calculator__context__row
  .data-calculator__context__values
  label
  .button {
  text-align: center;
  width: 100%;
  color: #f7f5f5;
  text-decoration: none;
  border: 1px solid transparent;
  background-color: #00539f;
  padding: 10px 0;
  height: auto;
  display: inline-block !important;
  align-self: flex-start;
  cursor: pointer;
  transition: background-color 0.25s;
}
.custom-data-calculator
  .custom-data-calculator__content
  .data-calculator__context__row
  .data-calculator__context__values
  label
  .button--alpha {
  border: 1px solid #d9e5eb;
  background: #ffffff;
  color: #00539f;
  font-weight: bold;
}

.custom-data-calculator__content .data-calculator__context__label--layout {
  display: flex;
  align-items: center;
  gap: 5px;
}

.custom-data-calculator__content
  .data-calculator__context__values
  label:first-child
  .button {
  border-radius: 5px 0 0 0;
  border-bottom: none;
}

.custom-data-calculator__content
  .data-calculator__context__values
  label:nth-child(2)
  .button {
  border-bottom: none;
  border-radius: 0 5px 0 0;
}

.custom-data-calculator__content
  .data-calculator__context__values
  label:nth-child(4)
  .button {
  border-radius: 0 0 5px 0;
}

.custom-data-calculator__content
  .data-calculator__context__values
  label:last-child
  .button {
  border-top: none;
  border-radius: 0 0 5px 5px;
}

.estimation-section {
  padding: 16px;
  background-color: #fff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  margin-top: 30px;
  margin-bottom: 20px;
}

.estimation-section .text-part {
  width: 100%;
}

.estimation-section .content-part {
  width: 100%;
}

.estimation-section .content-part p {
  color: #00539f;
  text-align: center;
  width: 100%;
  margin-bottom: 0px;
  font-size: 24px;
}

.tariff-section {
  margin-top: 30px;
}

.tariff-section .tariff-cta-btn {
  width: 100%;
  display: flex;
  justify-content: end;
}

.tariff-section .tariff-cta-btn .tariff-btn {
  border-radius: 20px;
  padding: 10px 20px;
  background-color: #00539f;
  color: #fff;
}

.tariff-section p {
  margin: 20px 0;
}

.recommended-tariff-section {
  display: none;
}
.recommended-tariff-section .text-part p {
  font-size: 16px;
  font-weight: bold;
}
.recommended-tariff-section .field.choice input[type="radio"] {
  border: 0;
  clip: rect(0, 0, 0, 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
}
.recommended-tariff-section .field {
  height: 96px !important;
}
.recommended-tariff-section .field .label {
  color: #575252;
  font-family: "TESCOModern-Regular", Tahoma, sans-serif;
  font-size: 16px;
  letter-spacing: 0;
  line-height: 24px;
  text-align: center;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  padding: 12px 14px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 10px;
  box-sizing: border-box;
  position: relative;
}
.recommended-tariff-section .field .label .allowance {
  text-align: left;
  display: flex;
  gap: 4px;
  font-size: 20px;
  line-height: 16px;
  font-weight: bold;
}
.recommended-tariff-section .field .label .allowance span {
  font-size: 12px;
  font-weight: normal !important;
  margin-top: -2px;
}
.recommended-tariff-section .field .label .price {
  font-size: 16px;
  line-height: 22px;
  right: 10px;
  bottom: 8px;
  position: absolute;
}
.recommended-tariff-section .field .label .price .regular-price-wrapper {
  font-family: "TESCOModern-Bold", Tahoma, sans-serif;
}
.recommended-tariff-section .field .label .price .regular-price-wrapper span {
  font-size: 14px;
  font-family: "TESCOModern-Regular", Tahoma, sans-serif;
  visibility: hidden;
  position: relative;
}
.recommended-tariff-section
  .field
  .label
  .price
  .regular-price-wrapper
  span::after {
  content: "/month";
  visibility: visible;
  position: absolute;
  right: 0;
}
.recommended-tariff-section
  .field
  .label
  .price
  .clubcard-price-wrapper
  .clubcard-price-label {
  display: none;
}
.recommended-tariff-section
  .field
  .label
  .price
  .clubcard-price-wrapper
  .clubcard-price-value {
  background-color: #fcd700;
  padding: 0 5px;
  color: #333;
  font-size: 14px;
}
.recommended-tariff-section
  .field
  .label
  .price
  .clubcard-price-wrapper
  .clubcard-price-value
  span {
  font-family: "TESCOModern-Bold", Tahoma, sans-serif;
  font-size: 16px;
}
`;
      document.head.appendChild(style);
      setTimeout(() => {
        clearInterval(interval); // Clear the interval after 5 seconds
      }, 5000);
    }
  }, 100); // Check every 100ms for <head>
})();
(() => {
  /* =========================
     SHARED UTILITIES
  ========================= */
  function waitForBody(callback) {
    if (document.body) {
      callback();
      return;
    }
    const observer = new MutationObserver(() => {
      if (document.body) {
        observer.disconnect();
        callback();
      }
    });
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }

  function poll(t, i, o = false, e = 10000, a = 25) {
    e < 0 ||
      (t()
        ? i()
        : setTimeout(() => {
            poll(t, i, o, o ? e : e - a, a);
          }, a));
  }

  function createObserver(selector, onFound, options = {}) {
    const { root = document.documentElement, timeout = 10000 } = options;
    const el = document.querySelector(selector);
    if (el) {
      onFound(el);
      return;
    }
    const observer = new MutationObserver(() => {
      const found = document.querySelector(selector);
      if (found) {
        observer.disconnect();
        onFound(found);
      }
    });
    observer.observe(root, { childList: true, subtree: true });
    if (timeout) {
      setTimeout(() => observer.disconnect(), timeout);
    }
  }

  /* =========================
     TASK 1: APPLE PROMO SIDEBAR
  ========================= */
  function initApplePromo() {
    /* --- SELECTORS --- */
    const SELECTORS = {
      promoItems: ".promo-items",
      promoTargetSection: ".view-phone-details",
      promoImageGroup: ".promo-item-img-group",
    };

    /* --- STATE --- */
    function createState() {
      return {
        promoState: [],
        accrodionState: [
          {
            title: "Apple TV+",
            content: `Eligible Handsets:\niPhone 17\niPhone 17 Pro\niPhone 17 Pro Max\niPhone Air\niPhone 16 with Apple iPad A16\niPhone 16e\niPhone 16 Pro Max\niPhone 16 Pro Max with Apple Watch Series 10\niPhone 16 Pro\niPhone 16 Plus\niPhone 16\niPhone 15 Pro Max\niPhone 15\niPhone 14\niPhone 13\n\nHow to claim 3 months of Apple TV+\n\nTurn on your new iPhone and sign in with your Apple ID.\nOpen the Apple TV app. Make sure your eligible device is running the latest version of iOS, iPad OS, tvOS, or macOS.\nThe offer should appear immediately after you launch the Apple TV app. If not, scroll down in Watch Now until the offer appears.\nTap Enjoy 3 months Free. You might be asked to enter your Apple ID password, confirm your billing information, or add a valid payment method.\nNew subscribers get three months of Apple News+ free when you buy a new iPhone, subject to the terms and conditions.\n\nClick Here for Full Terms & Conditions.\n\n£9.99/month after free trial. One subscription per Family Sharing group. Offer good for 3 months after eligible device activation. Plan automatically renews until cancelled. Restrictions and other terms apply. See apple.com/uk/promo for more information.`,
          },
          {
            title: "Apple Music",
            content: `Eligible Handsets:\niPhone 17\niPhone 17 Pro\niPhone 17 Pro Max\niPhone Air\niPhone 16 with Apple iPad A16\niPhone 16e\niPhone 16 Pro Max\niPhone 16 Pro Max with Apple Watch Series 10\niPhone 16 Pro\niPhone 16 Plus\niPhone 16\niPhone 15 Pro Max\niPhone 15\niPhone 14\niPhone 13\n\nHow to claim 3 months of Apple TV+\n\nTurn on your new iPhone and sign in with your Apple ID.\nOpen the Apple TV app. Make sure your eligible device is running the latest version of iOS, iPad OS, tvOS, or macOS.\nThe offer should appear immediately after you launch the Apple TV app. If not, scroll down in Watch Now until the offer appears.\nTap Enjoy 3 months Free. You might be asked to enter your Apple ID password, confirm your billing information, or add a valid payment method.\nNew subscribers get three months of Apple News+ free when you buy a new iPhone, subject to the terms and conditions.\n\nClick Here for Full Terms & Conditions.\n\n£9.99/month after free trial. One subscription per Family Sharing group. Offer good for 3 months after eligible device activation. Plan automatically renews until cancelled. Restrictions and other terms apply. See apple.com/uk/promo for more information.`,
          },
          {
            title: "Apple Fintess +",
            content: `Claim 3 months of Apple Fitness+ free
                    Get 3 months of Apple Fitness+ free, when you purchase any iPhone. Claim your 3 months free Apple Fitness+ subscription in the Apple Fitness+ app on your iPhone within 3 months after first activating your Eligible Device.
                    Eligible Handsets:
                    iPhone 17
                    iPhone 17 Pro
                    iPhone 17 Pro Max
                    iPhone Air
                    iPhone 16 with Apple iPad A16
                    iPhone 16eiPhone 16 Pro MaxiPhone 16 Pro Max with Apple Watch Series 10iPhone 16 ProiPhone 16 PlusiPhone 16iPhone 15 Pro MaxiPhone 15iPhone 14iPhone 13
                    How to claim 3 months of Apple Fitness+ free
                    Open the Apple Fitness+ app. Tap Enjoy 3 months Free. You might be asked to enter your Apple ID password, confirm your billing information, or add a valid payment method.
                    Subscribing to Apple Fitness+ requires an iPhone 8 or later, or Apple Watch Series 3 or later paired with an iPhone 6s or later. Apple Fitness+ is only available in select regions.
                    New subscribers get three months of Apple Fitness+ free when you buy a new eligible Apple iPhone, subject to the terms and conditions.
                  Click Here for Full Terms & Conditions.`,
          },
          {
            title: "Apple Arcade",
            content: `'Enjoy unlimited access to over 200 incredibly fun games, including Arcade Originals, App Store Greats, and Timeless Classics, with no ads and no in-app purchases. Up to six people can play across their Apple devices.¹ Try it free on the App Store.²\nEligible Handsets:\niPhone 17iPhone 17 ProiPhone 17 Pro MaxiPhone AiriPhone 16 with Apple iPad A16\niPhone 16eiPhone 16 Pro MaxiPhone 16 Pro Max with Apple Watch Series 10iPhone 16 ProiPhone 16 PlusiPhone 16iPhone 15 Pro MaxiPhone 15iPhone 14iPhone 13\nOffer ends 90 days after your device activation\n*£6.99/month after free trial. Only one offer per Apple ID and only one offer per family if you’re part of a Family Sharing group, regardless of the number of devices you or your family purchase. Offer good for 3 months after eligible device activation. Plan automatically renews until cancelled. Restrictions and other terms apply.¹Requires iCloud Family Sharing. See apple.com/family-sharing for more information.²New subscribers only. £6.99/month after trial. The plan automatically renews after the trial until cancelled. Terms apply.'`,
          },
          {
            title: "Apple News +",
            content:
              "Get 3 months of AppleNews+ when you purchase any Apple device. Claim your 3 months free Apple News+ subscription in the Apple News app.\nEligible Handsets:\niPhone 17\niPhone 17 Pro\niPhone 17 Pro Max\niPhone Air\niPhone 16 with Apple iPad A16\niPhone 16eiPhone 16 Pro MaxiPhone 16 Pro Max with Apple Watch Series 10iPhone 16 ProiPhone 16 PlusiPhone 16iPhone 15 Pro MaxiPhone 15iPhone 14iPhone 13Offer must be claimed in the Apple News app within 3 months after first activating your Eligible Device. To see the offer appear, you will need to sign in with your Apple ID on your Eligible Device.Click Here for Full Terms & Conditions.How to claim 3 months of Apple News+:\n\nOpen the News app.\nTouch, tap News+ at the bottom of the screen.\nTap or click the trial subscription offer. One trial per Apple ID.\nIf asked, sign in with the Apple ID that you use for App Store and iTunes Store purchases. If you don't have an Apple ID, follow the prompts to create one. Find out what to do if you've forgotten your Apple ID or you're not sure whether you have one.\nIf asked, confirm your billing information. You may need to add a valid payment method.\nIf asked, agree to the terms and conditions.\n",
          },
        ],
        roaming: `<div data-content-type="text" data-appearance="default" data-element="main"><p>Join Tesco Mobile and take your UK data, minutes and texts with you to 48 destinations across the EU and beyond – at no extra cost – with Home From Home. Whether you’re sharing pics in Paris or using maps in Madrid, you’ll stay connected. No setup, no stress, no scary bills – just roam like you’re at home.&nbsp;</p>
<p>To check how much it costs to use your phone in a specific destination, including our rest of the world destinations, you can use our <a tabindex="0" href="https://www.tescomobile.com/roaming" target="_blank" rel="noopener">helpful checker</a>. You can also see how much it costs to call or text another country from the UK.</p>
<p>What destinations are included in Home From Home?</p>
<ul>
<li>Austria</li>
<li>Azores</li>
<li>Belgium</li>
<li>Bulgaria</li>
<li>Canary Islands</li>
<li>Croatia</li>
<li>Republic of Cyprus</li>
<li>Czech Republic</li>
<li>Denmark</li>
<li>Estonia</li>
<li>Finland</li>
<li>France</li>
<li>French Guiana</li>
<li>Germany</li>
<li>Gibraltar</li>
<li>Greece</li>
<li>Guadeloupe</li>
<li>Guernsey</li>
<li>Hungary</li>
<li>Iceland</li>
<li>Ireland (Republic of)</li>
<li>Isle of Man</li>
<li>Jersey</li>
<li>Italy</li>
<li>Latvia</li>
<li>Liechtenstein</li>
<li>Lithuania</li>
<li>Luxembourg</li>
<li>Madeira</li>
<li>Malta</li>
<li>Martinique</li>
<li>Mayotte</li>
<li>Monaco</li>
<li>Netherlands</li>
<li>Norway</li>
<li>Poland</li>
<li>Portugal</li>
<li>Reunion</li>
<li>Romania</li>
<li>San Marino</li>
<li>Slovakia</li>
<li>Slovenia</li>
<li>Spain</li>
<li>St. Martin</li>
<li>St. Barts</li>
<li>Sweden</li>
<li>Switzerland</li>
<li>Vatican City</li>
</ul>
<p><a tabindex="0" href="https://www.tescomobile.com/why-tesco-mobile/award-winning-network/home-from-home">Find out more here</a></p></div>`,
        frozenPrice: `<div data-enable-parallax="0" data-parallax-speed="0.5" data-background-images="{}" data-background-type="image" data-video-loop="true" data-video-play-only-visible="true" data-video-lazy-load="true" data-video-fallback-src="" data-element="inner" data-pb-style="A88VESI"><h2 data-content-type="heading" data-appearance="default" data-element="main">With Clubcard Prices, you’ll get fixed prices – so no mid-contract price increase&nbsp;</h2><div data-content-type="text" data-appearance="default" data-element="main"><p>Take out one of our exclusive Clubcard Price deals on a pay monthly phone or SIM, and we promise to freeze your basic monthly usage price for the length of your contract.</p>
<p><span style="font-size: 14px;">A Clubcard number is required to get Clubcard Prices.&nbsp;<br></span></p>
<p><a tabindex="0" href="https://www.tescomobile.com/shop/clubcard-prices"><span style="font-size: 14px;">View our full range of phones on Clubcard prices</span></a></p>
<p><span style="font-size: 14px;">Learn more about <a tabindex="0" href="https://www.tescomobile.com/why-tesco-mobile/supermarket-value/clubcard-prices">Clubcard Prices&nbsp;</a></span></p>
<p><span style="font-size: 14px;">Don’t have a Clubcard yet? It’s free, quick and easy to sign up. <a tabindex="0" href="https://www.tesco.com/account/register/en-GB?sc_cmp=ref*tm*stc*tm_clubcard_stamp_22_09_2022*tm_clubcard_register_page&amp;utm_source=tesco_mobile&amp;utm_medium=tm_clubcard_stamp_22_09_2022&amp;utm_campaign=tm_clubcard_register_page">Join Clubcard</a> to start saving now.<br><br></span></p>
<p><span style="font-size: 16px;"><strong>How can I get Clubcard Prices?</strong></span></p>
<p><span style="font-size: 14px;">To get Clubcard Prices on selected pay monthly deals, simply provide your Clubcard number when you’re checking out.<br><br></span><span style="font-size: 14px;">Current Clubcard Price deals available between 29th December 2025 and 1st February 2026.</span></p>
<p>&nbsp;</p>
<p><span style="font-size: 16px;"><strong>Where can I find my Clubcard number?</strong></span></p>
<p><span style="font-size: 14px;"><span style="text-decoration: underline;">On your Clubcard</span>: It’s the long number on the front, below your name.</span></p>
<p><span style="font-size: 14px;"><span style="text-decoration: underline;">On your key fob</span>: it’s on the back, near the QR code.</span></p>
<p><span style="font-size: 14px;"><span style="text-decoration: underline;">In your Tesco app</span>: Select the Clubcard icon, and then ‘Tap to scan’ and your number will be displayed.</span></p>
<p><span style="font-size: 14px;"><span style="text-decoration: underline;">On your Tesco Bank credit card</span>: It’s on the back, on the bottom left.</span></p></div></div>`,
      };
    }

    /* --- HELPERS --- */
    function renderPromoImages(items) {
      if (!Array.isArray(items) || items.length <= 2) return "";
      const usableItems = items.slice(2).filter((item) => item.image);
      const displayItems = usableItems.slice(0, 3);
      const remaining = usableItems.length - displayItems.length;
      let html = "";
      displayItems.forEach((item) => {
        if (item.image) {
          html += `<img class="promo-item-img" src="${item.image}" alt="" loading="lazy">`;
        }
      });
      if (remaining > 0) {
        html += `<span class="promo-more-count">+${remaining}</span>`;
      }
      return html;
    }

    function promoSection() {
      return `
        <div class="promo-section">
          <div class="promo-item">
            <div class="promo-item-img-group"></div>
            <div class="promo-item-content">Get 3 months free</div>
          </div>
          <div id="no-eu-roaming" class="promo-item">
            <img class="promo-item-img" src="https://www.tescomobile.com/media/attribute/swatch/swatch_thumb/110x90/r/o/roaming_icon.png" alt="" loading="lazy">
            <div class="promo-item-content">No EU roaming</div>
          </div>
          <div id="frozen-prices" class="promo-item">
            <img class="promo-item-img" src="https://www.tescomobile.com/media/attribute/swatch/swatch_thumb/110x90/c/c/ccp-logo_3.png" alt="" loading="lazy">
            <div class="promo-item-content">Frozen Prices</div>
          </div>
        </div>
      `;
    }

    function updatePromoImages(state) {
      const group = document.querySelector(SELECTORS.promoImageGroup);
      if (!group || !state.promoState.length) return;
      group.innerHTML = renderPromoImages(state.promoState);
    }

    function initAccordion() {
      const ACCORDION_ICON_COLLAPSED = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="1" y="1" width="22" height="22" rx="11" fill="white"/>
          <rect x="1" y="1" width="22" height="22" rx="11" stroke="#00539F" stroke-width="2"/>
          <path d="M17.2287 8.35382L12.0005 13.7705L6.77751 8.35407L5.69775 9.39528L12.0001 15.9309L18.3079 9.39553L17.2287 8.35382Z" fill="#00539F"/>
        </svg>`;
      const ACCORDION_ICON_EXPANDED = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="1" y="1" width="22" height="22" rx="11" fill="white"/>
          <rect x="1" y="1" width="22" height="22" rx="11" stroke="#00539F" stroke-width="2"/>
          <path d="M18.3026 14.6047L12.0003 8.06909L5.69238 14.6044L6.77166 15.6462L11.9998 10.2295L17.2228 15.6459L18.3026 14.6047Z" fill="#00539F"/>
        </svg>`;

      const accordions = document.querySelectorAll(".custom-sidebar-accordion");
      if (!accordions.length) return;

      accordions.forEach((acc) => {
        const icon = acc.querySelector(".custom-sidebar-accordion-icon");
        icon.innerHTML = ACCORDION_ICON_COLLAPSED;
      });

      accordions.forEach((accordion) => {
        const header = accordion.querySelector(
          ".custom-sidebar-accordion-header",
        );
        const content = accordion.querySelector(
          ".cust-sidebar-accordion-content",
        );
        const icon = accordion.querySelector(".custom-sidebar-accordion-icon");

        header.addEventListener("click", () => {
          const isOpen = accordion.classList.contains("_open");
          accordions.forEach((acc) => {
            acc.classList.remove("_open");
            acc.querySelector(
              ".cust-sidebar-accordion-content",
            ).style.maxHeight = null;
            acc.querySelector(".custom-sidebar-accordion-icon").innerHTML =
              ACCORDION_ICON_COLLAPSED;
          });
          if (!isOpen) {
            accordion.classList.add("_open");
            content.style.maxHeight = content.scrollHeight + "px";
            icon.innerHTML = ACCORDION_ICON_EXPANDED;
          }
        });
      });
    }

    function renderAccrodion(state) {
      if (!state.accrodionState) return "";
      let html = "";
      state.accrodionState.forEach((item) => {
        html += `
        <div class="custom-sidebar-accordion">
          <div class="custom-sidebar-accordion-header" data-accordion-header>
            <span class="custom-sidebar-accordion-title">${item.title}</span>
            <span class="custom-sidebar-accordion-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="1" y="1" width="22" height="22" rx="11" fill="white"/>
                <rect x="1" y="1" width="22" height="22" rx="11" stroke="#00539F" stroke-width="2"/>
                <path d="M17.2287 8.35382L12.0005 13.7705L6.77751 8.35407L5.69775 9.39528L12.0001 15.9309L18.3079 9.39553L17.2287 8.35382Z" fill="#00539F"/>
              </svg>
            </span>
          </div>
          <div class="cust-sidebar-accordion-content">
            <div class="custom-sidebar-accordion-content-inner">
              <p class="custom-sidebar-accordion-content-text">${item.content}</p>
            </div>
          </div>
        </div>`;
      });
      return html;
    }

    function sidebarTemplate(state) {
      return `
      <aside id="promo-custom-sidebar" class="modal-slide spotify cart-slider show-close _inner-scroll" tabindex="0" role="dialog" data-role="modal" data-type="slide">
        <div class="modal-inner-wrap">
          <header class="modal-header">
            <button class="action-close" data-role="closeBtn" type="button"><span>Close</span></button>
          </header>
          <div id="modal-content-66" class="modal-content" data-role="content">
            <div class="custom-sidebar-content">
              <h2>Get 3 months free when you buy any iPhone.</h2>
              <div class="custom-sidebar-accordion-section">
                ${renderAccrodion(state)}
              </div>
            </div>
          </div>
        </div>
      </aside>
      <div class="promo-sidebar-backdrop" data-promo-backdrop style="display:none"></div>`;
    }

    function openSidebar(contentKey = "apple") {
      const sidebar = document.getElementById("promo-custom-sidebar");
      const backdrop = document.querySelector("[data-promo-backdrop]");
      const modalWrapper = document.querySelector(".modals-wrapper");
      const contentContainer = document.querySelector(
        ".custom-sidebar-content",
      );

      if (!sidebar || !backdrop || !modalWrapper || !contentContainer) return;

      if (contentKey === "apple") {
        contentContainer.innerHTML = `
            <h2>Get 3 months free when you buy any iPhone.</h2>
            <div class="custom-sidebar-accordion-section">
              ${renderAccrodion(globalState)}
            </div>
            `;
        initAccordion();
      } else if (contentKey === "roaming") {
        contentContainer.innerHTML = globalState.roaming;
      } else if (contentKey === "frozenPrice") {
        contentContainer.innerHTML = globalState.frozenPrice;
      }

      if (!document.querySelector(".modals-overlay")) {
        modalWrapper.insertAdjacentHTML(
          "beforebegin",
          `<div class="modals-overlay" style="z-index: 901;"></div>`,
        );
      }
      document.body.classList.add("_has-modal");
      sidebar.classList.add("_show");
      sidebar.style.zIndex = "902";
    }

    function closeSidebar() {
      const sidebar = document.getElementById("promo-custom-sidebar");
      if (!sidebar || !sidebar.classList.contains("_show")) return;

      const backdrop = document.querySelector("[data-promo-backdrop]");
      const modalWrapper = document.querySelector(".modals-wrapper");
      if (!sidebar || !backdrop || !modalWrapper) return;
      const overlay = document.querySelector(".modals-overlay");
      if (overlay) overlay.remove();
      document.body.classList.remove("_has-modal");
      sidebar.classList.remove("_show");
    }

    document.body.addEventListener("click", (e) => {
      if (e.target.closest(".modals-overlay")) {
        closeSidebar();
      }
    });

    /* --- LOGIC --- */
    const globalState = createState();

    const target = document.querySelector(SELECTORS.promoTargetSection);
    if (!target || document.querySelector(".promo-section")) return;

    if (!document.getElementById("promo-custom-sidebar")) {
      document.body.insertAdjacentHTML(
        "beforeend",
        sidebarTemplate(globalState),
      );
    }
    target.insertAdjacentHTML("afterend", promoSection());

    createObserver(SELECTORS.promoImageGroup, (imgGroup) => {
      if (imgGroup.dataset.sidebarBound) return;
      imgGroup.dataset.sidebarBound = "1";
      imgGroup.addEventListener("click", () => openSidebar("apple"));
    });

    initAccordion();

    createObserver(SELECTORS.promoItems, (promoItems) => {
      const formatted = [...promoItems.querySelectorAll(".sale-type")]
        .filter((item) => item.offsetParent !== null)
        .map((item) => {
          const img = item.querySelector("img");
          const text = item.querySelector(".promo-content");
          return {
            image: img?.src || null,
            text: text?.textContent.trim() || "",
          };
        });
      globalState.promoState = formatted;
      updatePromoImages(globalState);
    });

    const promoItemsSection = document.querySelector(SELECTORS.promoItems);
    console.log(promoItemsSection, "promoItemsSection");
    if (promoItemsSection) promoItemsSection.style.display = "none";

    // Click Handlers
    function attachSidebarTrigger(id, contentKey) {
      const el = document.getElementById(id);
      if (!el || el.dataset.sidebarBound) return;
      el.dataset.sidebarBound = "1";
      el.style.cursor = "pointer";
      el.addEventListener("click", () => openSidebar(contentKey));
    }

    attachSidebarTrigger("frozen-prices", "frozenPrice");
    attachSidebarTrigger("no-eu-roaming", "roaming");

    document.body.addEventListener("click", (e) => {
      if (
        e.target.closest("#promo-custom-sidebar .action-close") ||
        e.target.hasAttribute("data-promo-backdrop")
      ) {
        closeSidebar();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeSidebar();
    });
  }

  /* =========================
     TASK 2: NEW TASK
  ========================= */
  function taskTwo() {
    const labelSpan = document.querySelector(
      ".product-type-switcher .swatch-attribute > .swatch-attribute-label",
    );
    const paymentOptionsWrapper = document.querySelector(
      ".swatch-attribute-options",
    );

    if (!labelSpan || !paymentOptionsWrapper) return;
    if (document.querySelector(".payment-select-wrapper")) return;

    const paymentOptions = [
      ...paymentOptionsWrapper.querySelectorAll(".swatch-option-item"),
    ].map((item) => ({
      label: item.querySelector("span")?.textContent.trim(),
      value: item.dataset.name,
      el: item,
    }));

    const selectedText = paymentOptionsWrapper
      .querySelector(".swatch-option-item.selected span")
      ?.textContent.trim();

    const paymentSelect = `
    <div class="payment-select-wrapper">
      <select name="payment-select" class="payment-select">
        ${paymentOptions
          .map(
            (option) => `
          <option 
            value="${option.value}" 
            ${option.label === selectedText ? "selected" : ""}
          >
            ${option.label}
          </option>
        `,
          )
          .join("")}
      </select>
    </div>
  `;

    labelSpan.insertAdjacentHTML("afterend", paymentSelect);

    const selectEl = document.querySelector(".payment-select");

    selectEl.addEventListener("change", (e) => {
      const selectedValue = e.target.value;

      const targetSwatch = paymentOptions.find(
        (opt) => opt.value === selectedValue,
      )?.el;

      if (targetSwatch) {
        targetSwatch.click();
      }
    });

    paymentOptionsWrapper.style.display = "none";

    // COLOR AND STORAGE SELECT FUNCTIONALITY
    function waitForFirstElement(parent, cb) {
      const el = parent.firstElementChild;
      if (el) {
        cb(el);
        return;
      }

      const observer = new MutationObserver(() => {
        const child = parent.firstElementChild;
        if (child) {
          observer.disconnect();
          cb(child);
        }
      });

      observer.observe(parent, { childList: true });
    }

    const colorAndStorageSelect = document.getElementById(
      "tm-deal-device-wrapper",
    );
    if (!colorAndStorageSelect) return;

    waitForFirstElement(colorAndStorageSelect, (firstChild) => {
      const swatchAttributes = firstChild.querySelectorAll(".swatch-attribute");

      let colorSwatchAttribute = null;
      let storageSwatchAttribute = null;

      swatchAttributes.forEach((attr) => {
        const label = attr
          .querySelector(".swatch-attribute-label")
          ?.textContent.trim();
        if (label === "Colour" || label === "Color") {
          colorSwatchAttribute = attr;
        } else if (label === "Storage") {
          storageSwatchAttribute = attr;
        }
      });

      // Extract swatch options from color attribute
      const colorSwatchOptions = colorSwatchAttribute
        ? [...colorSwatchAttribute.querySelectorAll(".swatch-option")]
        : [];

      // Extract swatch options from storage attribute
      const storageSwatchOptions = storageSwatchAttribute
        ? [...storageSwatchAttribute.querySelectorAll(".swatch-option")]
        : [];

      // Filter out disabled options and keep track of original indices, colors, and labels
      const enabledColorOptions = colorSwatchOptions
        .map((option, originalIndex) => {
          const colorSpan = option.querySelector(".swatch-color");
          const bgColor = colorSpan
            ? colorSpan.style.backgroundColor ||
              getComputedStyle(colorSpan).backgroundColor
            : "";
          const label =
            option
              .querySelector("span:not(.swatch-color)")
              ?.textContent.trim() || option.textContent.trim();
          return { element: option, originalIndex, bgColor, label };
        })
        .filter(({ element }) => !element.classList.contains("disabled"));

      const enabledStorageOptions = storageSwatchOptions
        .map((option, originalIndex) => ({
          element: option,
          originalIndex,
          label: option.textContent.trim(),
        }))
        .filter(({ element }) => !element.classList.contains("disabled"));

      // Create custom color and storage select dropdowns
      const customColorStorageContainer = `
        <div class="custom-color-storage-container">
          <div class="custom-color">
            <div class="custom-color-title">Colour(${enabledColorOptions.length || 0})</div>
            <div class="custom-select-ui" id="custom-color-select">
              <div class="custom-select-selected" style="height: auto;">
                ${enabledColorOptions
                  .filter(({ element }) =>
                    element.classList.contains("selected"),
                  )
                  .map(
                    (opt) => `
                  <span class="selected-color-dot" style="background: ${opt.bgColor}"></span>
                  <span class="selected-label">${opt.label}</span>
                `,
                  )
                  .join("")}
              </div>
              <div class="custom-select-options">
                ${enabledColorOptions
                  .map(
                    (opt) => `
                  <div class="custom-select-option ${opt.element.classList.contains("selected") ? "selected" : ""}" data-value="${opt.originalIndex}">
                    <span class="color-dot" style="background: ${opt.bgColor}"></span>
                    <span class="option-label">${opt.label}</span>
                  </div>
                `,
                  )
                  .join("")}
              </div>
            </div>
          </div>
          <div class="custom-storage">
            <div class="custom-storage-title">Storage(${enabledStorageOptions.length || 0})</div>
            <select name="storage-select" class="custom-storage-options">
              ${enabledStorageOptions
                .map(
                  ({ element, originalIndex }) => `
                <option value="${originalIndex}" ${element.classList.contains("selected") ? "selected" : ""}>
                  ${element.textContent.trim()}
                </option>
              `,
                )
                .join("")}
            </select>
          </div>
        </div>
      `;

      // Inject custom container before firstChild
      firstChild.insertAdjacentHTML("beforebegin", customColorStorageContainer);

      // Get references to the custom select elements
      const colorSelectUI = document.getElementById("custom-color-select");
      const storageSelectEl = document.querySelector(".custom-storage-options");

      // Function to update select options based on current enabled/disabled state
      function updateSelectOptions() {
        // Re-check current state of color swatches
        const currentColorOptions = colorSwatchOptions
          .map((option, originalIndex) => {
            const colorSpan = option.querySelector(".swatch-color");
            const bgColor = colorSpan
              ? colorSpan.style.backgroundColor ||
                getComputedStyle(colorSpan).backgroundColor
              : "";
            const label =
              option
                .querySelector("span:not(.swatch-color)")
                ?.textContent.trim() || option.textContent.trim();
            return { element: option, originalIndex, bgColor, label };
          })
          .filter(({ element }) => !element.classList.contains("disabled"));

        // Update Color UI Options
        const optionsContainer = colorSelectUI.querySelector(
          ".custom-select-options",
        );

        // Update Color Title with new count
        const colorTitle = document.querySelector(".custom-color-title");
        if (colorTitle) {
          colorTitle.textContent = `Colour(${currentColorOptions.length})`;
        }
        optionsContainer.innerHTML = currentColorOptions
          .map(
            (opt) => `
          <div class="custom-select-option ${opt.element.classList.contains("selected") ? "selected" : ""}" data-value="${opt.originalIndex}">
            <span class="color-dot" style="background: ${opt.bgColor}"></span>
            <span class="option-label">${opt.label}</span>
          </div>
        `,
          )
          .join("");

        // Update Color UI Selected State
        const selectedDisplay = colorSelectUI.querySelector(
          ".custom-select-selected",
        );
        const activeOpt = currentColorOptions.find(({ element }) =>
          element.classList.contains("selected"),
        );
        if (activeOpt) {
          selectedDisplay.innerHTML = `
            <span class="selected-color-dot" style="background: ${activeOpt.bgColor}"></span>
            <span class="selected-label">${activeOpt.label}</span>
          `;
        }

        // Re-check storage swatches
        const currentStorageOptions = storageSwatchOptions
          .map((option, originalIndex) => ({ element: option, originalIndex }))
          .filter(({ element }) => !element.classList.contains("disabled"));

        // Update Storage Title with new count
        const storageTitle = document.querySelector(".custom-storage-title");
        if (storageTitle) {
          storageTitle.textContent = `Storage(${currentStorageOptions.length})`;
        }

        // Rebuild storage options
        storageSelectEl.innerHTML = currentStorageOptions
          .map(
            ({ element, originalIndex }) => `
          <option value="${originalIndex}" ${element.classList.contains("selected") ? "selected" : ""}>
            ${element.textContent.trim()}
          </option>
        `,
          )
          .join("");
      }

      // Color select UI click handlers
      if (colorSelectUI) {
        const selectedDisplay = colorSelectUI.querySelector(
          ".custom-select-selected",
        );
        selectedDisplay.addEventListener("click", () => {
          colorSelectUI.classList.toggle("_open");
        });

        colorSelectUI.addEventListener("click", (e) => {
          const optionEl = e.target.closest(".custom-select-option");
          if (optionEl) {
            const selectedIndex = parseInt(optionEl.dataset.value, 10);
            const targetSwatch = colorSwatchOptions[selectedIndex];
            if (targetSwatch) {
              targetSwatch.click();
              colorSelectUI.classList.remove("_open");
              // Update options after a short delay to allow DOM to update
              setTimeout(() => updateSelectOptions(), 150);
            }
          }
        });

        // Close when clicking outside
        document.addEventListener("click", (e) => {
          if (!colorSelectUI.contains(e.target)) {
            colorSelectUI.classList.remove("_open");
          }
        });
      }

      // Storage select change handler
      if (storageSelectEl) {
        storageSelectEl.addEventListener("change", (e) => {
          const selectedIndex = parseInt(e.target.value, 10);
          const targetSwatch = storageSwatchOptions[selectedIndex];
          if (targetSwatch) {
            targetSwatch.click();
            // IMPORTANT: When storage changes, available colors often change.
            // We wait for the DOM to update then refresh the color dropdown.
            setTimeout(() => updateSelectOptions(), 200);
          }
        });
      }

      // Hide the original firstChild
      firstChild.style.display = "none";
    });
  }

  /* =========================
     TASK 3: NEW TASK
  ========================= */
  function taskThree() {
    // CUSTOM CC WRAPPER SECTIONS
    poll(
      () =>
        document.querySelector(".custom-cc-wrapper") &&
        document.querySelector(".cc-savings") &&
        document.querySelector(".tm-option-wrapper.option-type-tariff"),
      () => {
        const customCCWrapper = document.querySelector(".custom-cc-wrapper");
        if (customCCWrapper) {
          const ccSaving = customCCWrapper.querySelector(".cc-savings");
          if (!document.querySelector(".custom-cc-savings")) {
            ccSaving.classList.add("custom-cc-savings");
            document
              .querySelector(".tm-option-wrapper.option-type-tariff")
              .insertAdjacentElement("beforebegin", ccSaving);
          }
          if (!customCCWrapper.classList.contains("new-cc-wrapper")) {
            customCCWrapper.classList.add("new-cc-wrapper");
            const regularPriceWrapper = customCCWrapper.querySelectorAll(
              ".field .label .price .regular-price-wrapper > span",
            );
            regularPriceWrapper.forEach((price) => {
              price.innerText = "/month";
            });
            const clubPriceWrapper = customCCWrapper.querySelectorAll(
              ".field .label .price .clubcard-price-wrapper .clubcard-price-value",
            );
            clubPriceWrapper.forEach((span) => {
              span.innerHTML = span.innerHTML.replace(" a month", "/month");
            });
          }
        }
      },
    );

    // REGULAR SECTION
    poll(
      () =>
        document.querySelector(".nested.options-list") &&
        document.querySelector(".custom-cc-wrapper"),
      () => {
        const optionsList = document.querySelector(".nested.options-list");
        const targetccWraper = optionsList.querySelector(".custom-cc-wrapper");
        const filteredDataChoices =
          optionsList.querySelectorAll(".field.choice");

        // 1️⃣ insert template string
        targetccWraper.insertAdjacentHTML(
          "afterend",
          `<div class="new-grid-section"></div>`,
        );

        // 2️⃣ get the newly inserted element
        const newGridSection = optionsList.querySelector(".new-grid-section");

        // 3️⃣ move each choice into the new grid section
        filteredDataChoices.forEach((choice) => {
          newGridSection.appendChild(choice);
        });

        const regularPriceWrapper = newGridSection.querySelectorAll(
          ".field .label .price .regular-price-wrapper > span",
        );
        regularPriceWrapper.forEach((price) => {
          price.innerText = "/month";
        });
        const clubPriceWrapper = newGridSection.querySelectorAll(
          ".field .label .price .clubcard-price-wrapper .clubcard-price-value",
        );
        clubPriceWrapper.forEach((span) => {
          span.innerHTML = span.innerHTML.replace(" a month", "/month");
        });
      },
    );

    poll(
      () => document.querySelector(".control .nested.options-list"),
      () => {
        const optionsList = document.querySelector(
          ".control .nested.options-list",
        );
        const filteredDataChoices =
          optionsList.querySelectorAll(".field.choice");

        // 1️⃣ insert template string
        optionsList.insertAdjacentHTML(
          "afterend",
          `<div class="new-grid-section"></div>`,
        );

        // 2️⃣ get the newly inserted element
        const newGridSection = optionsList.nextElementSibling;

        // 3️⃣ move each choice into the new grid section
        filteredDataChoices.forEach((choice) => {
          newGridSection.appendChild(choice);
        });
      },
    );
  }

  // DATA CALCULATOR
  function taskFour() {
    const DATA_CALCULATOR_ITEMS = [
      {
        key: "browsing",
        name: "Browsing",
        icon: "click.png",
        rate: 0.015,
        unit: "hours",
        options: [
          { label: "Never", value: 0 },
          { label: "30 mins", value: 30 },
          { label: "1 hour", value: 60 },
          { label: "2 hours", value: 120 },
          { label: "4 hours", value: 240 },
        ],
      },
      {
        key: "social",
        name: "Social",
        icon: "facebook.png",
        rate: 0.018,
        options: [
          { label: "Never", value: 0 },
          { label: "30 mins", value: 30 },
          { label: "1 hour", value: 60 },
          { label: "2 hours", value: 120 },
          { label: "4 hours", value: 240 },
        ],
      },
      {
        key: "music",
        name: "Music",
        icon: "headphone.png",
        rate: 0.16,
        options: [
          { label: "Never", value: 0 },
          { label: "30 mins", value: 30 },
          { label: "1 hour", value: 60 },
          { label: "2 hours", value: 120 },
          { label: "4 hours", value: 240 },
        ],
      },
      {
        key: "emails",
        name: "Emails",
        icon: "email.png",
        rate: 0.003,
        options: [
          { label: "0", value: 0 },
          { label: "20", value: 20 },
          { label: "100", value: 100 },
          { label: "200", value: 200 },
          { label: "300", value: 300 },
        ],
      },
      {
        key: "apps",
        name: "Apps",
        icon: "apps.png",
        rate: 0.098,
        options: [
          { label: "0", value: 0 },
          { label: "5", value: 5 },
          { label: "10", value: 10 },
          { label: "20", value: 20 },
          { label: "30", value: 30 },
        ],
      },
    ];

    const selectedValues = {
      browsing: 0,
      social: 0,
      music: 0,
      emails: 0,
      apps: 0,
    };

    const iconBasePath =
      "/etc.clientlibs/tescomobile/clientlibs/clientlib-site/resources/images";

    function renderOptions({ key, options, unit }) {
      return options
        .map(
          ({ label, value }) => `
        <label>
          <input type="radio"
                 class="calc__input"
                 name="${key}"
                 value="${value}"
                 ${unit ? `data-unit="${unit}"` : ""}>
          <span class="button button--alpha">${label}</span>
        </label>
      `,
        )
        .join("");
    }

    function renderRow(item) {
      return `
        <div class="data-calculator__context__row">
          <div class="data-calculator__context__label">
            <div class="data-calculator__context__label--layout">
              <img class="data-calculator__context__icon"
                  src="${iconBasePath}/${item.icon}"
                  alt="${item.name}">
              <strong class="data-calculator__context__name">${item.name}</strong>
            </div>
          </div>

          <div class="data-calculator__context__values button-group"
              data-group="${item.key}"
              data-value="${item.rate}">
            ${renderOptions(item)}
          </div>
        </div>
      `;
    }
    function dataCalculatorSidebarTemplate() {
      return `
        <aside id="data-cal-sidebar"
              class="modal-slide spotify cart-slider show-close _inner-scroll"
              tabindex="0"
              role="dialog"
              data-role="modal"
              data-type="slide">

          <div class="modal-inner-wrap">
            <header class="modal-header">
              <button class="action-close" data-role="closeBtn" type="button">
                <span>Close</span>
              </button>
            </header>

            <div class="modal-content" data-role="content">
              <div class="custom-data-calculator">
                <section class="custom-data-calculator__header-container">
                  <div>
                    <h1>How much data do I need?</h1>
                    <p class="subtitle">Select your typical <strong>daily internet usage</strong> from the options
                      below</p>
                    <p class="description">We’ll then estimate your monthly mobile data usage to help find the
                      right tariff for you</p>
                  </div>
                </section>
                <section class="custom-data-calculator__content">
                  <div class="data-calculator__context">
                    ${DATA_CALCULATOR_ITEMS.map(renderRow).join("")}
                  </div>
              </div>
            </div>
          </div>
        </aside>

        <div class="promo-sidebar-backdrop" data-promo-backdrop style="display:none"></div>
      `;
    }

    document.body.insertAdjacentHTML(
      "beforeend",
      dataCalculatorSidebarTemplate(),
    );

    function openDataCalculatorSidebar() {
      const sidebar = document.getElementById("data-cal-sidebar");
      const backdrop = document.querySelector("[data-promo-backdrop]");
      const modalWrapper = document.querySelector(".modals-wrapper");
      if (!sidebar || !backdrop || !modalWrapper) return;
      if (!document.querySelector(".modals-overlay")) {
        modalWrapper.insertAdjacentHTML(
          "beforebegin",
          `<div class="modals-overlay" style="z-index: 901;"></div>`,
        );
      }
      document.body.classList.add("_has-modal");
      sidebar.classList.add("_show");
      sidebar.style.zIndex = "902";
    }

    function closeDataCalculatorSidebar() {
      const sidebar = document.getElementById("data-cal-sidebar");
      if (!sidebar || !sidebar.classList.contains("_show")) return;

      const backdrop = document.querySelector("[data-promo-backdrop]");
      const modalWrapper = document.querySelector(".modals-wrapper");
      if (!sidebar || !backdrop || !modalWrapper) return;
      const overlay = document.querySelector(".modals-overlay");
      if (overlay) overlay.remove();
      document.body.classList.remove("_has-modal");
      sidebar.classList.remove("_show");
    }

    document.body.addEventListener("click", (e) => {
      if (
        e.target.closest(".modals-overlay") ||
        e.target.closest("#data-cal-sidebar .action-close")
      ) {
        closeDataCalculatorSidebar();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeDataCalculatorSidebar();
    });

    const targetDataCalculator = document.getElementById("tariff-hint");
    targetDataCalculator.addEventListener("click", (e) => {
      e.preventDefault();
      openDataCalculatorSidebar();
    });

    const dataContext = document.querySelector(".data-calculator__context");

    dataContext.addEventListener("click", (e) => {
      const label = e.target.closest("label");
      if (!label) return;
      const group = e.target.closest(".data-calculator__context__values");
      if (!group) return;
      const input = label.querySelector("input");
      const groupKey = group.dataset.group;
      const groupDataValue = Number(group.dataset.value);
      const calcSelectedValue = groupDataValue * Number(input.value);

      selectedValues[groupKey] = calcSelectedValue.toFixed(2);

      group.querySelectorAll("span.button").forEach((span) => {
        span.classList.add("button--alpha");
      });

      const clickedSpan = label.querySelector("span.button");
      if (clickedSpan) {
        clickedSpan.classList.remove("button--alpha");
      }

      const total = Object.values(selectedValues).reduce(
        (sum, v) => sum + Number(v || 0),
        0,
      );
      const totalFixed = Math.ceil(total);

      let estimationEl = document.getElementById("data-estimation-value");

      // If element doesn't exist, try to find or create it
      if (!estimationEl) {
        const estSection = document.querySelector(".estimation-section");
        if (estSection) {
          estimationEl = estSection.querySelector("p");
          if (!estimationEl) {
            // Create it if missing
            const contentPart = estSection.querySelector(".content-part");
            if (contentPart) {
              estimationEl = document.createElement("p");
              estimationEl.id = "data-estimation-value";
              contentPart.appendChild(estimationEl);
            }
          }
        }
      }

      if (estimationEl) {
        estimationEl.textContent =
          (total > 0.5 ? totalFixed : total > 0 ? 500 : 0) +
          (total > 0.5 ? "GB" : "MB");
        estimationEl.style.fontWeight = total > 0.5 ? "bold" : "normal";
      }
      const targetTariffSection = document.querySelector(
        ".recommended-tariff-section",
      );

      if (total > 0 && targetTariffSection) {
        // Select the nearest match tariff
        const tariffInputs = document.querySelectorAll(
          '.option-type-tariff .field.choice input[type="radio"]',
        );
        const targetUsage = total < 0.5 ? 0.5 : totalFixed;
        let closestInput = null;
        let minDiff = Infinity;

        tariffInputs.forEach((input) => {
          // Find the label text. Typically follows the input.
          const label = input.nextElementSibling;
          const text = label ? label.textContent.trim().toLowerCase() : "";

          let itemValue = 0;

          // Parse value from text
          if (text.includes("unlimited")) {
            itemValue = 10000; // Large number for unlimited
          } else {
            const match = text.match(/(\d+(\.\d+)?)\s*(gb|mb)/i);
            if (match) {
              const val = parseFloat(match[1]);
              const unit = match[3].toLowerCase();
              itemValue = unit === "gb" ? val : val / 1000;
            }
          }

          if (itemValue > 0) {
            const diff = Math.abs(itemValue - targetUsage);
            if (diff < minDiff) {
              minDiff = diff;
              closestInput = input;
            }
          }
        });
        targetTariffSection.style.display = "block";
        if (closestInput) {
          const sourceLabel = closestInput.nextElementSibling;
          if (sourceLabel) {
            const sourceAllowance = sourceLabel.querySelector(".allowance");
            const sourcePrice = sourceLabel.querySelector(".price");
            const targetAllowance =
              targetTariffSection.querySelector(".allowance");
            const targetPrice = targetTariffSection.querySelector(".price");

            if (sourceAllowance && targetAllowance) {
              targetAllowance.innerHTML = sourceAllowance.innerHTML;
            }
            if (sourcePrice && targetPrice) {
              targetPrice.innerHTML = sourcePrice.innerHTML;
            }
          }
        }
      } else {
        targetTariffSection.style.display = "none";
      }
    });

    // Estimation section
    const estimationSectionTarget = document.querySelector(
      ".custom-data-calculator__content",
    );
    if (!estimationSectionTarget) {
      console.warn("Estimation target not found");
      return;
    }
    const estimationSection = `
    <div class="estimation-section-wrapper">
      <div class="estimation-section">
        <div class="text-part">
          Estimated usage
        </div>
        <div class="content-part">
          <p id="data-estimation-value">0MB</>
        </div>
      </div>
      <p>
        This is a rough guide, based on average data uses, and all amounts are rounded up. Your actual data usage may be higher. According to Ofcom, customers tend to increase their data usage each year. Think about future-proofing your data allowance so you don’t run out of data later down the line.
      </p>
    </div>
    `;
    estimationSectionTarget.insertAdjacentHTML("afterend", estimationSection);

    // Verify element was created
    setTimeout(() => {
      document.getElementById("data-estimation-value");
    }, 100);

    //RECOMMENDED TARIFF SECTION
    const targetForRecommendedTariff = document.querySelector(
      ".estimation-section-wrapper",
    );
    const recommendedTariffSection = `
    <div class="recommended-tariff-section">
      <div class="text-part">
        <p>Recommended tariff</p>
      </div>
      <div class="field choice visible"><input type="radio" class="radio product bundle option change-container-classname" data-validate="{'validate-one-required-by-name':true}" name="bundle_option[301035]" data-selector="bundle_option[301035]" value="347667" checked="checked" aria-required="true"><label class="label" for="bundle-option-00000"><div class="allowance">50GB<span>data </span></div><div class="price"><div class="regular-price-wrapper">£40.49 <span>/month</span></div>
        <span class="clubcard-price-wrapper">
            <span class="clubcard-price-label">Clubcard Price</span>
            <span class="clubcard-price-value"><span>£54.99</span>/month</span>
      </span></div></label></div>
      </div>
    `;
    targetForRecommendedTariff.insertAdjacentHTML(
      "afterend",
      recommendedTariffSection,
    );

    // Verify element was created
    setTimeout(() => {
      document.getElementById("recommended-tariff-value");
    }, 100);

    // TARIFF CTA BUTTON SECTION
    const targetForTariffButton = document.querySelector(
      ".recommended-tariff-section",
    );
    const tariffSection = `
      <div class="tariff-section">
        <div class="tariff-cta-btn">
          <button class="button tariff-btn">
            Select Tariff
        </button>
        </div>
      </div>
    `;
    targetForTariffButton.insertAdjacentHTML("afterend", tariffSection);

    const tariffBtn = document.querySelector(".tariff-btn");
    if (tariffBtn) {
      tariffBtn.addEventListener("click", (e) => {
        e.preventDefault();

        // Recalculate total to be safe, though selectedValues is up to date
        const total = Object.values(selectedValues).reduce(
          (sum, v) => sum + Number(v || 0),
          0,
        );
        const totalFixed = Math.ceil(total);

        // Select the nearest match tariff
        const tariffInputs = document.querySelectorAll(
          '.option-type-tariff .field.choice input[type="radio"]',
        );
        const targetUsage = total < 0.5 ? 0.5 : totalFixed; // Target in GB

        let closestInput = null;
        let minDiff = Infinity;

        tariffInputs.forEach((input) => {
          // Find the label text. Typically follows the input.
          const label = input.nextElementSibling;
          const text = label ? label.textContent.trim().toLowerCase() : "";

          let itemValue = 0;

          // Parse value from text
          if (text.includes("unlimited")) {
            itemValue = 10000; // Large number for unlimited
          } else {
            const match = text.match(/(\d+(\.\d+)?)\s*(gb|mb)/i);
            if (match) {
              const val = parseFloat(match[1]);
              const unit = match[3].toLowerCase();
              itemValue = unit === "gb" ? val : val / 1000;
            }
          }

          if (itemValue > 0) {
            const diff = Math.abs(itemValue - targetUsage);
            if (diff < minDiff) {
              minDiff = diff;
              closestInput = input;
            }
          }
        });

        if (closestInput) {
          closestInput.click();
          closestInput.scrollIntoView({ behavior: "smooth", block: "center" });

          // Close the sidebar to show the user the selected tariff
          closeDataCalculatorSidebar();
        }
      });
    }
  }

  /* =========================
     MAIN EXECUTION
  ========================= */
  waitForBody(() => {
    try {
      initApplePromo();
    } catch (e) {
      console.error("Error in Apple Promo Init:", e);
    }

    try {
      taskTwo();
    } catch (e) {
      console.error("Error in New Task Init:", e);
    }

    try {
      taskThree();
    } catch (e) {
      console.error("Error in New Task Init:", e);
    }

    try {
      taskFour();
    } catch (e) {
      console.error("Error in New Task Init:", e);
    }
  });
})();
