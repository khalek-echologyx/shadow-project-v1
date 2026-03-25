(function () {
  var interval = setInterval(function () {
    if (document.head) {
      // Check if <head> exists
      clearInterval(interval); // Stop checking once found
      var style = document.createElement("style");
      style.innerHTML = `[data-testid="stepper-container"] {
  border-bottom: none !important;
}

[data-testid="ancillaries-bundle-body"] {
  overflow: visible !important;
}

@keyframes avis-mui-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes avis-mui-dash {
  0% {
    stroke-dasharray: 1px, 200px;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 100px, 200px;
    stroke-dashoffset: -15px;
  }
  100% {
    stroke-dasharray: 100px, 200px;
    stroke-dashoffset: -125px;
  }
}
.avis-car-summary-spinner-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  border-radius: 8px;
}
.avis-car-summary-spinner-overlay .MuiCircularProgress-root {
  animation: avis-mui-spin 1.4s linear infinite;
  color: #d4002a;
}
.avis-car-summary-spinner-overlay .MuiCircularProgress-svg {
  display: block;
}
.avis-car-summary-spinner-overlay .MuiCircularProgress-circle {
  stroke: currentColor;
  stroke-dasharray: 80px, 200px;
  stroke-dashoffset: 0;
  animation: avis-mui-dash 1.4s ease-in-out infinite;
}

.new-protection-section {
  display: block;
}

.protection-cards-section {
  width: 100%;
  position: relative;
}

.protection-bg {
  width: 100%;
  height: 474px;
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
}

.protection-cards-section-content {
  position: relative;
  z-index: 1;
  width: calc(100% - 112px);
  margin: 0 auto;
}

.protection-title {
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 0.3px !important;
  margin: 0 !important;
  padding-top: 21px;
  padding-bottom: 44px;
  line-height: 28px;
  text-align: center;
}

.protection-cards {
  display: flex;
  gap: 8px;
  align-items: center;
}

.cro-001-grid {
  display: flex !important;
}
.cro-001-grid [data-testid="ancillaries-bundle"] {
  width: 100%;
}

.protection-card {
  position: relative;
  width: 100%;
  color: #fff;
  border-radius: 8px;
  border: 1px solid #d4d4d4;
  letter-spacing: 0.3px !important;
  flex: 1;
  cursor: pointer;
  box-sizing: border-box;
  transition: all 0.3s ease-in-out;
}

.protection-card:hover {
  border: 1px solid #000;
}

.protection-card.highlight {
  border: 2px solid #000 !important;
  border-radius: 8px;
  z-index: 2;
}

.ultimate-card {
  border: 1px solid rgb(167, 167, 167);
  border-bottom: 1px solid rgb(199, 199, 199);
}

.recomended {
  position: absolute;
  top: -11px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 4px;
  background-color: #42000d;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  line-height: 100%;
  letter-spacing: 0.84px;
  text-align: center;
  padding: 1.5px 8px;
  border-radius: 4px;
}

.recomended svg {
  fill: #62b41f;
  height: 19px;
  width: 19px;
}

.recomended svg path {
  stroke: #62b41f;
  stroke-width: 1.5px;
}

.ultimate-card .card-content-header {
  background: #91001d;
}

.card-content-header {
  padding: 16px 24px;
  background-color: #2e0009;
  border-radius: 7px 7px 0 0;
  min-height: 184px;
}

body.bundle-active .card-content-header {
  background-color: #000;
}

body.bundle-active .ultimate-card .card-content-header {
  background: #7c1620;
}

body.bundle-active .recomended {
  background-color: #000;
}

.highlight .card-content-header {
  min-height: 196px;
  border-radius: 4px 4px 0 0;
}

.card-title {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  line-height: 28px;
  letter-spacing: 0.3px !important;
  margin: 0;
  margin-bottom: 6px;
}

.highlight .card-title {
  font-size: 24px;
  line-height: 31px;
}

.rating-mvt-307 {
  margin: 0;
  margin-bottom: 6px;
  gap: 2px;
}

.highlight .rating-mvt-307 {
  gap: 2.2px;
}

.rating-mvt-307 div {
  background-color: rgba(225, 225, 225, 0.3019607843);
  margin: 0;
}

.rating-mvt-307 div.active {
  background-color: #e86400;
}

.protection-card.highlight .card-content-header .rating-mvt-307 div {
  width: 17px;
  height: 7px;
}

.card-desc {
  font-size: 14px;
  line-height: 20px;
  margin: 0;
}

.highlight .card-desc {
  font-size: 15.43px;
  line-height: 22px;
}

.protection-card .features {
  background-color: #fff;
  margin-bottom: 0;
  padding: 16px 12px;
}

.protection-card.highlight .features {
  min-height: 215px;
}

.features [data-testid="ancillaries-bundle-item-excluded"] span {
  color: rgb(167, 167, 167) !important;
  text-decoration: none;
}

.features [data-testid="ancillaries-bundle-item-excluded"] p {
  color: rgb(167, 167, 167) !important;
  text-decoration: none;
}

.features [data-testid="ancillaries-bundle-item-included"] svg {
  fill: #bdbdbd;
}

.features
  [data-testid="ancillaries-bundle-item-excluded"]
  div:first-child
  svg
  path {
  stroke: #a3a3a3 !important;
}

.protection-card .features > div > div:last-child > svg {
  width: 24px;
  height: 24px;
  cursor: pointer;
  fill: #bdbdbd;
}

.feature-list {
  list-style: none;
  padding: 16px 12px;
  background-color: #fff;
  margin: 0;
}

.feature-list li {
  font-size: 14px;
  color: #000;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.feature-list li p {
  display: flex;
  align-items: center;
  gap: 8px;
  /* Gap between icon and text */
  margin: 0;
}

.feature-list li p span:first-child {
  margin-bottom: -5px;
}

.highlight .features p {
  font-size: 15.43px;
}

.price {
  background-color: #fff;
  text-align: center;
  padding: 0 12px;
  min-height: 57px;
}

.old-price {
  text-decoration: line-through;
  font-size: 14px;
  color: rgba(31, 29, 29, 0.4);
  line-height: 18px;
  letter-spacing: 0.3px !important;
  vertical-align: middle;
  margin-right: 4px;
}

.new-price {
  font-size: 28px;
  font-weight: 500;
  color: #000;
  line-height: 28px;
}

.highlight .new-price {
  font-size: 30px;
}

.per-day {
  font-size: 16px;
  color: #000;
  line-height: 22.05px;
  vertical-align: text-bottom;
  font-weight: 500;
}

.highlight .per-day {
  font-size: 17.64px;
}

.btn-container {
  padding: 16px 24px;
  background-color: #fff;
  border-radius: 0 0 8px 8px;
  padding-top: 0;
}

.btn {
  border: none;
  padding: 16px 0;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  width: 100%;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn.selected {
  position: relative;
}

.btn.selected::after {
  content: none;
}

.btn.primary {
  background: #d4002a;
  color: #fff;
  font-weight: 500;
  font-size: 15.43px;
  font-family: "AvisSans";
  letter-spacing: 0.3px !important;
}

.btn.secondary {
  background: #000;
  color: #fff;
  font-weight: 500;
  font-size: 14px;
  font-family: "AvisSans";
  letter-spacing: 0.3px;
}

.protection-container-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  max-width: 1440px;
  margin: 0 auto;
}

.protection-cards-column {
  grid-column: span 8;
}

.car-summary-column-wrapper {
  grid-column: span 4;
  background-color: #fff;
  padding-left: 20px;
}

.car-summary-column {
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.08);
  background-color: #fff;
  border-radius: 8px;
  padding: 24px 0;
  width: calc(100% - 58px);
  position: sticky;
  top: 96px;
  align-self: start;
  height: fit-content;
  margin-top: 20px;
  margin-bottom: 20px;
}

.car-summary-section .car-summary-title {
  font-size: 24px;
  font-weight: 700;
  line-height: 28px;
  letter-spacing: 0.3px !important;
  margin: 0;
  margin-bottom: 24px;
  padding: 0 24px;
}

.car-summary-section .divider {
  height: 1px;
  background-color: #eaeaea;
  margin: 0 24px;
}
.car-summary-section .vehicle-image-container {
  text-align: center;
}
.car-summary-section .vehicle-image-container img.car-image {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
}
.car-summary-section .vehicle-info {
  display: flex;
  align-items: start;
  justify-content: space-between;
  padding: 0 24px;
}
.car-summary-section .vehicle-info .vehicle-name-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.car-summary-section .vehicle-info .vehicle-name {
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.3px !important;
  color: #000;
  margin: 0;
  padding-bottom: 4px;
}
.car-summary-section .vehicle-info .vehicle-similar {
  margin: 0;
  color: #808080;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.3px !important;
}
.car-summary-section .location-info {
  margin-top: 6px;
  margin-bottom: 16px;
  padding: 0 24px;
}
.car-summary-section .location-info .location-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}
.car-summary-section .location-info .location-row:last-child {
  margin-bottom: 0;
}
.car-summary-section .location-info .loc-details {
  text-align: left;
  flex: 1;
  padding-right: 8px;
}
.car-summary-section .location-info .loc-datetime {
  text-align: right;
  flex-shrink: 0;
}
.car-summary-section .location-info .loc-label,
.car-summary-section .location-info .loc-date {
  font-weight: 500;
  font-size: 14px;
  color: #000;
  margin-bottom: 4px;
  line-height: 20px;
  letter-spacing: 0.3px !important;
}
.car-summary-section .location-info .loc-name,
.car-summary-section .location-info .loc-time {
  font-size: 14px;
  color: #524d4d;
  line-height: 20px;
  letter-spacing: 0.3px !important;
}
.car-summary-section .amazon-gift-card-alert {
  background-color: rgb(244, 244, 244);
  border-radius: 4px;
  border: 1px solid rgba(115, 109, 109, 0.3);
  box-shadow: none !important;
  padding: 16px 24px;
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}
.car-summary-section .amazon-gift-card-alert .amazon-gift-card-title {
  font-size: 16px;
  line-height: 24px;
  font-weight: 700;
}
.car-summary-section .amazon-gift-card-alert .amazon-gift-card-disclaimer {
  margin: 0px;
  font-family: AvisSans, "AvisSans Fallback", sans-serif;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.003em;
  color: rgb(0, 0, 0);
}
.car-summary-section .total-vehicle-rate {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding: 0 24px;
}
.car-summary-section .total-vehicle-rate-content .total-vehicle-rate-title {
  font-size: 14px;
  line-height: 20px;
  color: #000;
  font-weight: 500;
}
.car-summary-section
  .total-vehicle-rate-content
  .total-vehicle-rate-title
  .rental-days {
  font-weight: 400;
}
.car-summary-section .total-vehicle-rate-content .total-vehicle-rate-subtitle {
  font-size: 14px;
  line-height: 20px;
  color: #524d4d;
}
.car-summary-section .total-vehicle-rate-price {
  display: flex;
  align-items: center;
  gap: 4px;
}
.car-summary-section
  .total-vehicle-rate-price
  .total-vehicle-rate-price-amount {
  text-decoration: line-through;
  font-size: 14px;
  line-height: 20px;
  color: rgba(31, 29, 29, 0.4);
}
.car-summary-section .total-vehicle-rate-price .total-vehicle-rate-price-save {
  font-size: 14px;
  line-height: 20px;
  color: #000;
  font-weight: 500;
}
.car-summary-section .protection-accordion {
  padding-bottom: 12px;
}
.car-summary-section .savings-discount {
  padding-top: 12px;
}
.car-summary-section .text-and-fees-accordion {
  padding-bottom: 12px;
}
.car-summary-section .accordion-item .accordion-footer {
  padding: 0 24px;
}
.car-summary-section .accordion-item.rate-terms-accordion .accordion-header {
  margin-top: 0;
}
.car-summary-section .accordion-item .accordion-footer .pr-added-footer span {
  color: #1ea238;
  font-weight: 500;
}
.car-summary-section .terms-content {
  color: rgb(0, 0, 0) !important;
}
.car-summary-section .protection-not-added {
  color: #e90c38;
}
.car-summary-section .accordion-header {
  width: 100%;
  padding: 4px 24px;
  background: none;
  text-align: left;
  font-size: 14px;
  font-weight: 500;
  color: #000;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0;
}
.car-summary-section .accordion-header .icon {
  font-size: 18px;
  font-weight: normal;
  line-height: 1;
}
.car-summary-section .protection-accordion .accordion-header {
  margin-top: 12px;
}
.car-summary-section .accordion-header-title.rate-terms {
  font-size: 12px;
  color: #736d6d;
  font-weight: 400;
  text-decoration: underline;
  letter-spacing: 0.3px;
  line-height: 12px;
}
.car-summary-section .accordion-header:hover,
.car-summary-section .accordion-header.active {
  background: rgb(244, 243, 242);
}
.car-summary-section .accordion-header-title {
  font-size: 14px;
  line-height: 20px;
  color: #000;
  font-weight: 400;
}
.car-summary-section .accordion-header-title.protection-add-ons {
  font-weight: 500;
}
.car-summary-section .accordion-header-icon {
  display: flex;
  align-items: center;
  gap: 8px;
}
.car-summary-section .accordion-header-icon-price {
  font-size: 14px;
  line-height: 20px;
  color: #000;
  font-weight: 400;
}
.car-summary-section .protection-add-ons-price {
  font-weight: 500;
}
.car-summary-section .accordion-header-icon-price.savings-price {
  color: #388a13;
}
.car-summary-section .accordion-header-icon-arrow {
  font-size: 18px;
  font-weight: normal;
  line-height: 1;
  margin-top: -9px;
  transition: transform 0.3s ease;
}
.car-summary-section .accordion-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
  padding: 0 24px;
  font-size: 14px;
  color: rgb(82, 77, 77);
}
.car-summary-section .accordion-content .summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}
.car-summary-section .accordion-content .summary-item .tax-fee-link {
  font-size: 14px !important;
  color: rgb(82, 77, 77);
  text-decoration: underline;
}
.car-summary-section .accordion-content .summary-item:first-child {
  margin-top: 8px;
}
.car-summary-section .accordion-content .summary-item:last-child {
  margin-bottom: 12px;
}
.car-summary-section .accordion-content .empty-list {
  padding: 8px 4px 12px;
  font-style: italic;
  color: #999;
}
.car-summary-section .accordion-content p.terms-text {
  margin: 0;
  padding: 8px 4px 12px;
  line-height: 1.4;
}
.car-summary-section .price-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding: 0 24px;
}
.car-summary-section .price-info .total-label {
  font-size: 16px;
  line-height: 24px;
  color: #000;
  font-weight: 500;
  letter-spacing: 0.3px !important;
}
.car-summary-section .price-info .total-price {
  font-size: 16px;
  line-height: 24px;
  color: #000;
  font-weight: 500;
  letter-spacing: 0.3px !important;
}

.accordion-footer {
  font-size: 14px;
}

#avis-addOns-variation-A .protection-cards-column {
  position: relative;
}

[data-testid="ancillaries-bundle"][data-code="No Protection"] {
  display: none !important;
}

.opt-out-section {
  border-top: 1px solid rgba(0, 0, 0, 0.12);
  margin: 0 56px;
  padding: 56px 0;
}

.opt-out-section h4 {
  font-family: AvisHeadline, "AvisHeadline Fallback", sans-serif;
  font-size: 36px;
  line-height: 36px;
  margin: 0 0 8px 0;
  text-align: center;
  text-transform: uppercase;
}

.opt-out-section span {
  color: rgb(82, 77, 77);
  display: block;
  margin: 0 auto 40px auto;
  max-width: 700px;
  text-align: center;
  text-wrap: balance;
}

.decline-option {
  display: flex;
  justify-content: center;
}

.decline-option label {
  background: #fff;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  gap: 16px;
  outline: #91001d solid 2px;
  padding: 24px;
}

.decline-option label input {
  opacity: 0;
  position: absolute;
  width: 0;
  height: 0;
}

.decline-option label span.checkbox {
  align-items: center;
  background: #fff;
  border: 1px solid #000;
  display: inline-flex;
  justify-content: center;
  min-width: 24px;
  width: 24px;
  height: 24px;
  margin: 0;
}

.decline-option label span svg {
  width: 16px;
  height: 16px;
}

.decline-option label:has(input:checked) .checkbox {
  background: #000;
}

.decline-option label:has(input:checked) .checkbox path {
  stroke: #fff;
}

/* hide protections modal */
body.hide-prot-modal {
  overflow: visible !important;
}

body.hide-prot-modal
  > [role="presentation"]:has([aria-labelledby^="ldw-modal-title"]) {
  display: none;
}

@media (max-width: 768px) {
  .protection-container-grid {
    grid-template-columns: 1fr;
    padding: 0;
  }
  .protection-cards-column,
  .car-summary-column-wrapper {
    grid-column: span 1;
  }
  .protection-cards-section-content {
    width: calc(100% - 32px);
  }
  .protection-cards {
    flex-direction: column;
  }
  .protection-card.highlight {
    margin-top: 0;
  }
  .opt-out-section {
    margin: 0 16px;
  }
  .protection-card.selected:not(.ultimate-card) {
    transform: none;
  }
}
@media (max-width: 1024px) {
  .car-summary-column-wrapper {
    display: none;
  }
  .protection-cards-column {
    grid-column: span 12;
  }
}
@media (min-width: 1025px) {
  [data-testid="action-footer-total-amount"] {
    cursor: default !important;
  }
}
@media (max-width: 1359px) {
  .card-content-header,
  .protection-card.highlight .card-content-header {
    min-height: 252px;
  }
}
@media (max-width: 768px) {
  .cro-001-grid {
    flex-direction: column;
    gap: 10px;
  }
  .cro-001-grid [data-testid="ancillaries-bundle"] {
    width: 100%;
  }
  .card-content-header,
  .protection-card.highlight .card-content-header {
    min-height: fit-content;
  }
}
@media (min-width: 1025px) and (max-width: 1250px) {
  .btn.primary {
    flex-direction: column;
  }
}
@media (min-width: 1024px) {
  [data-testid="ancillaries-action-footer"] {
    margin-top: 0 !important;
    position: static !important;
  }
  [data-testid="ancillaries-action-footer"]::before,
  [data-testid="ancillaries-action-footer"]::after {
    display: none !important;
  }
}
@media (max-width: 461px) {
  #abg-adobe-target-main-content-block {
    margin-top: 33px;
  }
}
`;
      document.head.appendChild(style);
      setTimeout(() => {
        clearInterval(interval); // Clear the interval after 5 seconds
      }, 5000);
    }
  }, 100); // Check every 100ms for <head>
})();
(function () {
  (function (history) {
    var pushState = history.pushState;
    history.pushState = function () {
      pushState.apply(history, arguments);
      window.dispatchEvent(new Event("locationchange"));
    };

    var replaceState = history.replaceState;
    history.replaceState = function () {
      replaceState.apply(history, arguments);
      window.dispatchEvent(new Event("locationchange"));
    };

    window.addEventListener("popstate", function () {
      window.dispatchEvent(new Event("locationchange"));
    });
  })(window.history);

  function poll(t, i, o, e, a) {
    if (o === void 0) {
      o = false;
    }
    if (e === void 0) {
      e = 10000;
    }
    if (a === void 0) {
      a = 25;
    }
    if (e < 0) return;
    if (t()) return i();
    setTimeout(function () {
      poll(t, i, o, o ? e : e - a, a);
    }, a);
  }
  var mvtID = "MVT-307";
  var EXP_ID = "avis-protection-variation-a";
  var EXP_ID_2 = "avis-addOns-variation-A";

  var getSymbol = function (code) {
    if (!code) return "$";
    return (0)
      .toLocaleString("en", {
        style: "currency",
        currency: code,
      })
      .replace(/[\d\s.,]/g, "");
  };
  // If the symbol contains letters (e.g. BDT, USD) add a space before the amount.
  // Symbol signs (e.g. $, €, £) are kept tight against the number.
  var formatPrice = function (symbol, amount) {
    return /[a-zA-Z]/.test(symbol) ? symbol + " " + amount : symbol + amount;
  };
  var TARGET_SELECTOR_DEFAULT =
    '[data-testid="Protections-container"] > div > svg';
  var TARGET_SELECTOR_AVIS_FIRST =
    '[data-testid="Protections-container"] div img';

  function getTargetSelector() {
    try {
      var raw = sessionStorage.getItem("reservation.store");
      if (raw) {
        var store = JSON.parse(raw);
        var state = store && (store.state || store);
        if (state && state.isAvisFirst === true) {
          return TARGET_SELECTOR_AVIS_FIRST;
        }
      }
    } catch (e) {
      /* ignore */
    }
    return TARGET_SELECTOR_DEFAULT;
  }
  var ADD_ON_PAGE = '[data-testid="AddOns-container"] > div';
  var TARGET_INDIVIDUAL_PROTECTION_SECTION =
    '[data-testid="single-protections-list-section-container"]';
  var svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M19.8118 6.19684C20.0528 6.42427 20.0638 6.80401 19.8364 7.04501L9.96479 17.5055C9.72819 17.7562 9.32948 17.7564 9.09257 17.506L4.16415 12.2966C3.93641 12.0559 3.94694 11.6761 4.18766 11.4484C4.42837 11.2207 4.80812 11.2312 5.03586 11.4719L9.52788 16.22L18.9636 6.2214C19.1911 5.9804 19.5708 5.9694 19.8118 6.19684Z" fill="#4DC664" stroke="#8ACE97" stroke-linecap="round"/></svg>';
  var infoSvg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="24"     height="24" viewBox="0 0 24 24" fill="none">' +
    '    <path d="M4.00049 12.0001C4.00278 9.87918 4.84632 7.84576 6.34604 6.34604C7.84576 4.84632 9.87918 4.00278 12.0001 4.00049C14.121 4.00296 16.1543 4.84656 17.654 6.34624C19.1536 7.84592 19.9972 9.87923 19.9997 12.0001C19.9971 14.1209 19.1534 16.1541 17.6538 17.6538C16.1541 19.1534 14.1209 19.9971 12.0001 19.9997C9.87918 19.9974 7.84576 19.1539 6.34604 17.6542C4.84632 16.1544 4.00278 14.121 4.00049 12.0001ZM4.94177 12.0001C4.94388 13.8714 5.68822 15.6655 7.01145 16.9888C8.33469 18.312 10.1288 19.0563 12.0001 19.0584C13.8713 19.0561 15.6652 18.3117 16.9883 16.9885C18.3114 15.6653 19.0556 13.8713 19.0577 12.0001C19.0556 10.1289 18.3114 8.33491 16.9883 7.0117C15.6652 5.68848 13.8713 4.94406 12.0001 4.94177C10.1288 4.94388 8.33469 5.68822 7.01145 7.01145C5.68822 8.33469 4.94388 10.1288 4.94177 12.0001ZM11.5288 15.3866V10.4875C11.5286 10.3633 11.5776 10.2441 11.665 10.1559C11.7525 10.0677 11.8712 10.0178 11.9954 10.0169C12.1203 10.0169 12.2401 10.0664 12.3285 10.1547C12.4168 10.2429 12.4666 10.3626 12.4668 10.4875V15.3866C12.4666 15.5115 12.4168 15.6312 12.3285 15.7194C12.2401 15.8077 12.1203 15.8573 11.9954 15.8573C11.8711 15.8564 11.7522 15.8063 11.6648 15.7179C11.5773 15.6296 11.5285 15.5102 11.5288 15.3859V15.3866ZM11.2935 8.36429C11.2944 8.27252 11.3135 8.18182 11.3495 8.09742C11.3856 8.01301 11.4379 7.93656 11.5035 7.87241C11.5692 7.80826 11.6468 7.75768 11.732 7.72357C11.8173 7.68947 11.9083 7.67251 12.0001 7.67365C12.0918 7.67259 12.1827 7.68959 12.2678 7.7237C12.3529 7.7578 12.4305 7.80834 12.496 7.87241C12.5616 7.93648 12.6138 8.01281 12.6499 8.09709C12.6859 8.18137 12.705 8.27194 12.7061 8.3636C12.705 8.45526 12.6859 8.54582 12.6499 8.63011C12.6138 8.71439 12.5616 8.79076 12.496 8.85483C12.4305 8.9189 12.3529 8.9694 12.2678 9.0035C12.1827 9.0376 12.0918 9.05465 12.0001 9.05359C11.9084 9.05482 11.8173 9.03794 11.7321 9.00391C11.6469 8.96988 11.5692 8.91933 11.5036 8.85523C11.4379 7.79114 11.3856 8.71472 11.3495 8.63035C11.3135 8.54598 11.2944 8.45534 11.2935 8.3636V8.36429Z" fill="#BDBDBD"/>' +
    "  </svg>";
  var crossSvg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">' +
    '        <path d="M7.00022 17L17 7.00006M16.9998 16.9999L7 7" stroke="#A3A3A3" stroke-width="1.5"/>' +
    "        </svg>";
  var arrowDown =
    '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="7" viewBox="0 0 13 7" fill="none">' +
    '                       <mask id="path-1-inside-1_512_5469" fill="white">' +
    '                       <path d="M6.40918 6.74563C6.31024 6.7456 6.21566 6.70604 6.14551 6.63626L0.10645 0.636257C0.0378715 0.565764 -0.000509358 0.47142 5.1061e-06 0.373073C0.000519571 0.274726 0.0395792 0.180638 0.108892 0.110866C0.178204 0.0410944 0.272269 0.00118986 0.370611 2.62624e-05C0.468952 -0.00113734 0.563827 0.0364063 0.634771 0.104518L6.40772 5.84231L12.105 0.106472C12.1755 0.0378926 12.2698 -0.000488202 12.3682 2.62624e-05C12.4665 0.000540727 12.5611 0.0400886 12.6309 0.109401C12.7006 0.178714 12.7401 0.272291 12.7412 0.370632C12.7424 0.468973 12.7048 0.563848 12.6367 0.634792L6.67579 6.63479C6.60578 6.70534 6.51101 6.74558 6.41163 6.74612L6.40918 6.74563Z"/>' +
    "                       </mask>" +
    '                       <path d="M6.40918 6.74563C6.31024 6.7456 6.21566 6.70604 6.14551 6.63626L0.10645 0.636257C0.0378715 0.565764 -0.000509358 0.47142 5.1061e-06 0.373073C0.000519571 0.274726 0.0395792 0.180638 0.108892 0.110866C0.178204 0.0410944 0.272269 0.00118986 0.370611 2.62624e-05C0.468952 -0.00113734 0.563827 0.0364063 0.634771 0.104518L6.40772 5.84231L12.105 0.106472C12.1755 0.0378926 12.2698 -0.000488202 12.3682 2.62624e-05C12.4665 0.000540727 12.5611 0.0400886 12.6309 0.109401C12.7006 0.178714 12.7401 0.272291 12.7412 0.370632C12.7424 0.468973 12.7048 0.563848 12.6367 0.634792L6.67579 6.63479C6.60578 6.70534 6.51101 6.74558 6.41163 6.74612L6.40918 6.74563Z" fill="black"/>' +
    "                   </svg>";
  var checkIcon =
    '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="10" viewBox="0 0 14 10" fill="none">' +
    '<path d="M13.2604 0.59375L4.55208 9.30208L0.59375 5.34375" stroke="#1EA238" stroke-width="1.1875" stroke-linecap="round" stroke-linejoin="round"/>' +
    "</svg>";
  var whiteCheckSvg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="14" viewBox="0 0 18 14" fill="none">' +
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M16.8118 1.16363C17.0528 1.39107 17.0638 1.7708 16.8364 2.0118L6.96479 12.4723C6.72819 12.723 6.32948 12.7232 6.09257 12.4728L1.16415 7.2634C0.936413 7.02269 0.946938 6.64293 1.18766 6.4152C1.42837 6.18747 1.80812 6.19799 2.03586 6.43871L6.52788 11.1868L15.9636 1.1882C16.1911 0.947198 16.5708 0.9362 16.8118 1.16363Z" fill="white" stroke="white" stroke-width="2" stroke-linecap="round"/>' +
    "</svg>";
  var recommendCheckSvg =
    '<svg focusable="false" aria-hidden="true" viewBox="0 0 11 9"><path d="M1 4L4 7L10 1" stroke-linecap="round" fill="none"></path></svg>';

  function getProtectionData(dataCode) {
    var selector =
      '[data-testid="ancillaries-bundle"][data-code="' + dataCode + '"]';
    var bundle = document.querySelector(selector);

    if (!bundle) return null;

    //Rating
    var rating = bundle.querySelector(
      '[data-testid="ancillaries-bundle-rating"]',
    );

    // Feature list (UL > LI)
    var body = bundle.querySelector('[data-testid="ancillaries-bundle-body"]');
    var features = body ? body.firstElementChild : null;

    // Old / cut price
    var oldPriceEl = bundle.querySelector(
      '[data-testid="ancillaries-bundle-strikethrough-price"]',
    );
    var oldPrice = oldPriceEl ? oldPriceEl.textContent.trim() : null;

    // Current price (prefer data-price)
    var newPriceEl = bundle.querySelector(
      '[data-testid="ancillaries-bundle-price"]',
    );
    var newPrice =
      bundle.getAttribute("data-price") ||
      (newPriceEl ? newPriceEl.textContent.trim() : null);

    // Description
    var descEl = bundle.querySelector(
      '[data-testid="ancillaries-bundle-description"]',
    );
    var description = null;
    if (descEl) {
      var descP = descEl.querySelector("p");
      if (descP) {
        var descSpan = descP.querySelector("span");
        description = {
          pText: descP.innerText || descP.textContent || "",
          spanText: descSpan
            ? descSpan.innerText || descSpan.textContent || ""
            : "",
        };
      }
    }

    return {
      features: features,
      oldPrice: oldPrice,
      newPrice: newPrice,
      element: bundle,
      rating: rating,
      description: description,
    };
  }

  function bindCustomSelectButton() {
    var cards = document.querySelectorAll("#" + EXP_ID + " .protection-card");

    for (var i = 0; i < cards.length; i++) {
      (function (card) {
        card.addEventListener("click", function (e) {
          var btn = card.querySelector(".custom-select-btn");
          var isAlreadySelected = btn.classList.contains("selected");
          var targetCode = btn.getAttribute("data-target-code");
          var data = getProtectionData(targetCode);

          if (!data || !data.element) {
            return console.warn("body element not found");
          }

          // Handle selection and deselection
          if (isAlreadySelected) {
            // Deselect: click "No Protection" to clear the plan via the API
            var noProtEl = document.querySelector(
              '[data-testid="ancillaries-bundle"][data-code="No Protection"]',
            );
            if (noProtEl) {
              noProtEl.dispatchEvent(
                new MouseEvent("click", {
                  bubbles: true,
                  cancelable: true,
                  view: window,
                }),
              );
            }
          } else {
            // Select logic
            data.element.dispatchEvent(
              new MouseEvent("click", {
                bubbles: true,
                cancelable: true,
                view: window,
              }),
            );
          }

          if (window.checkAvisState) window.checkAvisState();
        });
      })(cards[i]);
    }
  }

  // --- Shared Car Summary Logic ---
  var vehicleData = { name: "", image: "", showSimilar: false };
  var locationData = {
    pickup: { name: "", date: "", time: "" },
    dropoff: { name: "", date: "", time: "" },
  };
  var hasProtectionBundles = true;
  var hasAddOns = true;
  var pickupUSA = true;
  var residNotUSA = false;
  var countryValue = "";
  var residClean = "";

  function getSessionData() {
    try {
      var reservationStoreRaw = sessionStorage.getItem("reservation.store");
      if (reservationStoreRaw) {
        var store = JSON.parse(reservationStoreRaw);
        if (store) {
          var state = store.state || store;
          var protectionBundles =
            (state.protectionsData &&
              state.protectionsData.protectionBundles) ||
            [];
          var addOns =
            (state.addOnsData && state.addOnsData.addOnBundles) || [];
          var requiredBundles = [
            "Ultimate Protection",
            "Enhanced Protection",
            "Essential Protection",
          ];
          var bundleCodes = protectionBundles.map(function (b) {
            return b.code;
          });
          var hasAllRequired = requiredBundles.every(function (code) {
            return bundleCodes.indexOf(code) !== -1;
          });
          hasProtectionBundles = protectionBundles.length > 1 && hasAllRequired;
          hasAddOns = addOns.length > 0;
          var rawName = state.vehicleModelDescription || "";
          var isMysteryCar =
            rawName === "Mystery Car May Be Gas, Hybrid, or EV or Similar";

          //get pickup country value
          countryValue = state.pickupCountryCode || "";
          pickupUSA = countryValue === "US";

          // get residency value
          residValue = state.residencyValue || "";

          if (rawName.indexOf("or Similar") !== -1) {
            vehicleData.name = rawName.replace("or Similar", "").trim();
            vehicleData.showSimilar = true;
          } else {
            vehicleData.name = rawName;
            vehicleData.showSimilar = false;
          }
          vehicleData.image = isMysteryCar
            ? "https://www.avis.com/_next/static/media/car-not-available.05cc2caa.png"
            : "https://www.avis.com" + state.vehicleImage;

          locationData.pickup.name =
            state.pickupAddressLine1 +
              ", " +
              state.pickupCityName +
              ", " +
              state.pickupStateCode || "";
          locationData.dropoff.name =
            state.returnAddressLine1 +
              ", " +
              state.returnCityName +
              ", " +
              state.returnStateCode || "";

          var formatISO = function (isoStr) {
            if (!isoStr) return { date: "", time: "" };
            try {
              var date = new Date(isoStr);
              return {
                date: date.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }),
                time: date.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                }),
              };
            } catch (e) {
              return { date: "", time: "" };
            }
          };

          var pickupDT = formatISO(state.pickupDatetime || state.pickUpDate);
          locationData.pickup.date = pickupDT.date || state.pickUpDate || "";
          locationData.pickup.time = pickupDT.time || state.pickUpTime || "";

          var dropoffDT = formatISO(state.returnDatetime || state.dropOffDate);
          locationData.dropoff.date = dropoffDT.date || state.dropOffDate || "";
          locationData.dropoff.time = dropoffDT.time || state.dropOffTime || "";
        }
      }
    } catch (e) {
      console.error("Error parsing reservation store:", e);
    }
  }
  //Disable original Footer price click
  function disableOriginalFooterAccordion() {
    poll(
      function () {
        return document.querySelector(
          '[data-testid="action-footer-total-amount"]',
        );
      },
      function () {
        if (window.innerWidth <= 1024) return;
        var accordionElemet = document.querySelector(
          '[data-testid="action-footer-total-amount"]',
        );
        var accordionTargetParentEl = accordionElemet.parentElement;
        var btn = accordionTargetParentEl.querySelector("button");
        if (btn) btn.style.display = "none";
        accordionTargetParentEl.addEventListener("click", function (e) {
          e.stopPropagation();
        });
      },
    );
  }

  function injectSpinnerStyles() {
    if (document.getElementById("avis-car-summary-spinner-styles")) return;
    var style = document.createElement("style");
    style.id = "avis-car-summary-spinner-styles";
    style.textContent = [
      "@keyframes avis-mui-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }",
      "@keyframes avis-mui-dash {",
      "  0%   { stroke-dasharray: 1px, 200px; stroke-dashoffset: 0; }",
      "  50%  { stroke-dasharray: 100px, 200px; stroke-dashoffset: -15px; }",
      "  100% { stroke-dasharray: 100px, 200px; stroke-dashoffset: -125px; }",
      "}",
      ".avis-car-summary-spinner-overlay {",
      "  position: absolute; inset: 0;",
      "  background: rgba(255,255,255,0.78);",
      "  display: flex; align-items: center; justify-content: center;",
      "  z-index: 100; border-radius: 8px;",
      "}",
      ".avis-car-summary-spinner-overlay .MuiCircularProgress-root {",
      "  animation: avis-mui-spin 1.4s linear infinite;",
      "  color: #D4002A;",
      "}",
      ".avis-car-summary-spinner-overlay .MuiCircularProgress-svg { display: block; }",
      ".avis-car-summary-spinner-overlay .MuiCircularProgress-circle {",
      "  stroke: currentColor;",
      "  stroke-dasharray: 80px, 200px; stroke-dashoffset: 0;",
      "  animation: avis-mui-dash 1.4s ease-in-out infinite;",
      "}",
    ].join("\n");
    document.head.appendChild(style);
  }

  function showCarSummarySpinner() {
    injectSpinnerStyles();
    var sections = document.querySelectorAll(
      ".new-protection-section .car-summary-section",
    );
    for (var s = 0; s < sections.length; s++) {
      var section = sections[s];
      if (section.querySelector(".avis-car-summary-spinner-overlay")) continue;
      var overlay = document.createElement("div");
      overlay.className = "avis-car-summary-spinner-overlay";
      overlay.innerHTML =
        '<span class="MuiCircularProgress-root MuiCircularProgress-indeterminate MuiCircularProgress-colorPrimary mui-qqtl3b" role="progressbar" style="width: 40px; height: 40px;">' +
        '<svg class="MuiCircularProgress-svg mui-4ejps8" viewBox="22 22 44 44">' +
        '<circle class="MuiCircularProgress-circle MuiCircularProgress-circleIndeterminate mui-13odlrs" cx="44" cy="44" r="20.2" fill="none" stroke-width="3.6"></circle>' +
        "</svg></span>";
      section.style.position = "relative";
      section.appendChild(overlay);
    }
  }

  function hideCarSummarySpinner() {
    var overlays = document.querySelectorAll(
      ".avis-car-summary-spinner-overlay",
    );
    for (var o = 0; o < overlays.length; o++) {
      overlays[o].parentNode.removeChild(overlays[o]);
    }
  }

  window.updateAvisCarSummary = function () {
    var section = document.querySelector(
      ".new-protection-section .car-summary-section",
    );
    if (!section) return;

    getSessionData();

    var protectionCards = document.querySelector(".protection-cards");
    var protectionBg = document.querySelector(".protection-bg");
    var protectionCardsColumn = document.querySelector(
      ".protection-cards-column",
    );
    var optOutSection = document.querySelector(".opt-out-section");
    var isAddOnsPage = !!document.querySelector(
      '[data-testid="AddOns-container"]',
    );

    //hide element list
    var sectionTitle = document.querySelector(".protection-title");
    var singleProtContainer = document.querySelector(
      '[data-testid="single-protections-list-section-container"]',
    );

    if (protectionCards) {
      protectionCards.style.display = hasProtectionBundles ? "flex" : "none";
    }
    if (protectionBg) {
      protectionBg.style.zIndex = hasProtectionBundles ? "0" : "-1";
    }
    if (protectionCardsColumn) {
      protectionCardsColumn.style.marginBottom =
        isAddOnsPage && !hasAddOns
          ? "50px"
          : hasProtectionBundles
            ? "0px"
            : "56px";
    }
    if (optOutSection) {
      optOutSection.style.marginTop = hasProtectionBundles ? "0px" : "50px";
    }

    // if pickup is US but residency is not US
    if (pickupUSA && residNotUSA) {
      if (protectionCards) {
        protectionCards.style.display = "none";
        protectionBg.style.zIndex = "-1";
        sectionTitle.style.marginBottom = 0;
        singleProtContainer.style.paddingTop = 0;
      }
      // hide bundles and headings
      var hideElems = $(
        '[data-testid="ancillaries-bundles-container"], [data-testid="single-protections-list-heading"], [data-testid="single-protections-list-subheading"], [data-testid="single-protections-list-section-container"] > div > hr',
      );
      hideElems.hide();

      // hide selected products
      var hideItems = ["ALI", "LDW"];
      $('[data-testid="single-protections-item-name"]')
        .filter(function () {
          // check if product code exists in array
          var text = $(this).text();
          return hideItems.some((code) => text.includes(code));
        })
        .closest('[data-testid="single-protections-item-card-container"]')
        .parent()
        .hide();
    }

    // NOTE: hide-prot-modal is now applied immediately in handlePageChange
    // and is no longer dependent on this function completing successfully.

    // When our custom plans are hidden, show the original Avis bundles in our section
    var originalBundlesContainer = document.querySelector(
      '[data-testid="ancillaries-bundles-container"]',
    );
    if (!hasProtectionBundles && originalBundlesContainer) {
      var sectionContent = document.querySelector(
        ".protection-cards-section-content",
      );
      // Only move it once — check if it's already inside our section
      if (
        sectionContent &&
        !sectionContent.contains(originalBundlesContainer)
      ) {
        originalBundlesContainer.style.removeProperty("display");
        sectionContent.appendChild(originalBundlesContainer);
      }
      originalBundlesContainer.classList.add("cro-001-grid");
    } else if (hasProtectionBundles && originalBundlesContainer) {
      // If our plans are showing, keep the original container hidden
      // But only on the Protection page — on the Add-ons page, leave it visible

      if (!isAddOnsPage) {
        originalBundlesContainer.style.display = "none";
      }
    }

    var totals = window.__AVIS_PRICE_CALC__
      ? window.__AVIS_PRICE_CALC__.totals
      : {};
    var priceCalc = window.__AVIS_PRICE_CALC__
      ? window.__AVIS_PRICE_CALC__
      : {};
    var currencySymbol = getSymbol(priceCalc.currencyCode);
    var amazonGiftCardAmount = priceCalc.amazonCashBack
      ? priceCalc.amazonCashBack.toFixed(2)
      : "0.00";
    var price = totals.total || "0.00";
    var vehicleRate = totals.grossSubtotal || "0.00";
    var vehicleRateDiscount = totals.netSubtotal || "0.00";
    var rentalDays = priceCalc.rentalDays || "0";
    var unlimitedFreeMiles = priceCalc.rateTerms
      ? priceCalc.rateTerms.unlimitedMilage
      : false;
    var protectionBundle = priceCalc.protectionBundle;
    var protectionBundleName = protectionBundle
      ? protectionBundle.code === "No Protection"
        ? ""
        : protectionBundle.code
      : "";
    var protectionAndAddOnsTotal =
      (totals.addOnTotal || 0) + (totals.protectionTotal || 0);

    var protectionList = [];
    var addOnList = [];
    var protectionAndAddOnSavings = 0;

    var totalSavingsData = priceCalc.savings
      ? priceCalc.savings.totalSavings
      : "0.00";
    var totalSavings = Number(totalSavingsData).toFixed(2);
    var discountCodeSavings = priceCalc.savings
      ? Number(priceCalc.savings.discountCodeSavings).toFixed(2)
      : "0.00";
    var payNowSaving = priceCalc.savings
      ? Number(priceCalc.savings.payNowSavings).toFixed(2)
      : "0.00";

    var taxAndFees = priceCalc.taxAndFeeItems || [];
    var rateTerms = priceCalc.rateTerms || {};

    try {
      var reservationStoreRaw = sessionStorage.getItem("reservation.store");
      if (reservationStoreRaw) {
        var store = JSON.parse(reservationStoreRaw);
        if (store && store.state) {
          protectionList = store.state.pricesProtectionItems || [];
          addOnList = store.state.pricesAddOnItems || [];
          protectionAndAddOnSavings = store.state.extrasSavings || 0;
        }
      }
    } catch (e) {
      console.error(
        "Error reading protection/addon data from sessionStorage:",
        e,
      );
    }
    //combine protection and add-ons
    var combinedProtectionAddOns = protectionList.concat(addOnList);

    var buildList = function (items) {
      if (!items || !items.length) return '<div class="empty-list">None</div>';
      return items
        .map(function (i) {
          var itemAmount =
            i.code === "GSO" && (i.amount === 0 || i.amount === "0")
              ? "Market Price"
              : formatPrice(
                  currencySymbol,
                  i.amountString || i.amount.toFixed(2) || 0,
                );
          var description = i.description || "";
          if (i.code === "GSO") {
            var gsoAmount = Number(i.netSubtotalPerUnit || 0).toFixed(2);
            var gsoSuffix = i.chargeType === "PER_GALLON" ? "/gal" : "";
            description +=
              '<span style="display: block; font-size: 12px;">Est. ' +
              (priceCalc.currencyCode || "USD") +
              " " +
              gsoAmount +
              gsoSuffix +
              "</span>";
          }
          var itemStyle =
            i.code === "GSO" ? ' style="align-items: center;"' : "";
          return (
            '<div class="summary-item"' +
            itemStyle +
            "><span>" +
            description +
            "</span><span>" +
            itemAmount +
            "</span></div>"
          );
        })
        .join("");
    };

    var imageHtml = vehicleData.image
      ? '<div class="vehicle-image-container"><img src="' +
        vehicleData.image +
        '" data-testid="rental-summary-image" alt="vehicle image" class="car-image" loading="lazy" width="113" height="48" decoding="async" data-nimg="1"></div>'
      : "";

    var amazonHtml = "";
    if (amazonGiftCardAmount !== "0.00" && amazonGiftCardAmount !== 0) {
      amazonHtml =
        "   <!-- amazon gift card alert -->" +
        '   <div class="amazon-gift-card-alert" role="alert" style="--Paper-shadow: none">' +
        '     <div class="amazon-logo-container">' +
        '       <img alt="amazon-logo" loading="lazy" width="50" height="32" decoding="async" data-nimg="1" srcset="https://www.avis.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Famazon-logo.b7f2a5f7.png&amp;w=64&amp;q=75 1x, https://www.avis.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Famazon-logo.b7f2a5f7.png&amp;w=128&amp;q=75 2x" src="https://www.avis.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Famazon-logo.b7f2a5f7.png&amp;w=128&amp;q=75" style="color: transparent; width: auto; height: 32px">' +
        "     </div>" +
        '     <div class="amazon-gift-card-content">' +
        '       <div class="amazon-gift-card-info">' +
        '         <div class="amazon-gift-card-title">' +
        '           <span class="amazon-reward-text">You will receive ' +
        formatPrice(currencySymbol, amazonGiftCardAmount) +
        "  on an Amazon.com Gift Card upon completing your rental!</span>" +
        "         </div>" +
        '         <div class="amazon-gift-card-disclaimer">' +
        '           <span class="amazon-legal-text">*Restrictions apply, see Amazon.com/gc-legal</span>' +
        "         </div>" +
        "       </div>" +
        "     </div>" +
        "   </div>";
    }

    section.innerHTML =
      '<p class="car-summary-title">Car Summary</p>' +
      '<div class="summary-content">' +
      '   <div class="vehicle-info">' +
      '     <div class="vehicle-name-container">' +
      '<p class="vehicle-name">' +
      vehicleData.name +
      "</p>" +
      (vehicleData.showSimilar
        ? '<p class="vehicle-similar"> or similar</p>'
        : "") +
      "</div>" +
      "     " +
      imageHtml +
      "   </div>" +
      '   <div class="location-info">' +
      '     <div class="location-row pickup" style="padding-top:16px; border-top: 1px solid #EAEAEA">' +
      '       <div class="loc-details">' +
      '           <div class="loc-label">Pick Up</div>' +
      '           <div class="loc-name">' +
      locationData.pickup.name +
      "</div>" +
      "       </div>" +
      '       <div class="loc-datetime">' +
      '           <div class="loc-date">' +
      locationData.pickup.date +
      "</div>" +
      '           <div class="loc-time">' +
      locationData.pickup.time +
      "</div>" +
      "       </div>" +
      "     </div>" +
      '     <div class="location-row dropoff">' +
      '       <div class="loc-details">' +
      '           <div class="loc-label">Drop Off</div>' +
      '           <div class="loc-name">' +
      locationData.dropoff.name +
      "</div>" +
      "       </div>" +
      '       <div class="loc-datetime">' +
      '           <div class="loc-date">' +
      locationData.dropoff.date +
      "</div>" +
      '           <div class="loc-time">' +
      locationData.dropoff.time +
      "</div>" +
      "       </div>" +
      "     </div>" +
      "   </div>" +
      '   <div class="total-vehicle-rate">' +
      '     <div class="total-vehicle-rate-content">' +
      '      <div class="total-vehicle-rate-title">Vehicle total rate <span class="rental-days">(' +
      rentalDays +
      " days)</span></div>" +
      '      <div class="total-vehicle-rate-subtitle">' +
      (unlimitedFreeMiles ? "Unlimited free miles included" : "") +
      "</div>" +
      "     </div>" +
      '     <div class="total-vehicle-rate-price">' +
      '      <span class="total-vehicle-rate-price-amount">' +
      formatPrice(currencySymbol, vehicleRate) +
      "</span> " +
      '      <span class="total-vehicle-rate-price-save">' +
      formatPrice(currencySymbol, vehicleRateDiscount) +
      "</span>" +
      "     </div>" +
      "   </div>" +
      '  <div class="accordion-item protection-accordion"> ' +
      '    <div class="accordion-header" data-has-items="' +
      (combinedProtectionAddOns.length > 0) +
      '">' +
      '     <div class="accordion-header-title protection-add-ons">Protections & Add-ons</div>' +
      '     <div class="accordion-header-icon">' +
      '      <div class="accordion-header-icon-price protection-add-ons-price">' +
      formatPrice(currencySymbol, protectionAndAddOnsTotal.toFixed(2)) +
      "</div>" +
      '      <div class="accordion-header-icon-arrow" style="display: ' +
      (combinedProtectionAddOns.length > 0 ? "block" : "none") +
      '; transform: rotate(0deg); margin-top: -9px;">' +
      arrowDown +
      "</div>" +
      "     </div>" +
      "    </div>" +
      '    <div class="accordion-content">' +
      buildList(combinedProtectionAddOns) +
      "</div>" +
      '    <div class="accordion-footer">' +
      (combinedProtectionAddOns.length > 0 && !protectionBundleName
        ? ""
        : combinedProtectionAddOns.length > 0 && protectionBundleName
          ? '<div class="pr-added-footer">' +
            checkIcon +
            " <span>" +
            protectionBundleName +
            " added</span></div>"
          : '<div class="protection-not-added">x Protection not added</div>') +
      "    </div>" +
      "  </div>" +
      amazonHtml +
      '   <div class="divider"></div>' +
      '  <div class="accordion-item savings-discount">' +
      '    <div class="accordion-header" data-has-items="' +
      (totalSavings > 0) +
      '">' +
      '     <div class="accordion-header-title">Savings & discounts</div>' +
      '     <div class="accordion-header-icon">' +
      '      <div class="accordion-header-icon-price savings-price">' +
      (totalSavings > 0 ? "-" : "") +
      formatPrice(currencySymbol, totalSavings || "0.00") +
      "</div>" +
      '      <div class="accordion-header-icon-arrow" style="display: ' +
      (totalSavings > 0 ? "block" : "none") +
      ';">' +
      arrowDown +
      "</div>" +
      "     </div>" +
      "    </div>" +
      '    <div class="accordion-content">' +
      '      <div class="summary-item"><span>Discount Code Savings</span><span>' +
      formatPrice(currencySymbol, discountCodeSavings || "0.00") +
      "</span></div>" +
      '      <div class="summary-item"><span>Pay Now Savings</span><span>' +
      formatPrice(currencySymbol, payNowSaving || "0.00") +
      "</span></div>" +
      '      <div class="summary-item"><span>Protection & Add-ons Savings</span><span>' +
      formatPrice(
        currencySymbol,
        Number(protectionAndAddOnSavings).toFixed(2) || "0.00",
      ) +
      "</span></div>" +
      "    </div>" +
      "  </div>" +
      '  <div class="accordion-item text-and-fees-accordion">' +
      '    <div class="accordion-header" data-has-items="' +
      (taxAndFees.length > 0) +
      '">' +
      '     <div class="accordion-header-title">Taxes & Fees</div>' +
      '     <div class="accordion-header-icon">' +
      '      <div class="accordion-header-icon-price">' +
      formatPrice(
        currencySymbol,
        taxAndFees.length > 0
          ? taxAndFees
              .reduce(function (acc, item) {
                return acc + (item.amount || 0);
              }, 0)
              .toFixed(2)
          : "0.00",
      ) +
      "</div>" +
      '      <div class="accordion-header-icon-arrow" style="display: ' +
      (taxAndFees.length > 0 ? "block" : "none") +
      '; transform: rotate(0deg); margin-top: -9px;">' +
      arrowDown +
      "</div>" +
      "     </div>" +
      "    </div>" +
      '    <div class="accordion-content">' +
      taxAndFees
        .map(function (item) {
          return (
            '<div class="summary-item"><a target="_blank" class="tax-fee-link" href="https://www.avis.com/en/customer-service/faqs/usa/fees-taxes#' +
            item.code +
            '">' +
            item.description +
            "</a><span>" +
            formatPrice(currencySymbol, (item.amount || 0).toFixed(2)) +
            "</span></div>"
          );
        })
        .join("") +
      "    </div>" +
      "  </div>" +
      '   <div class="divider"></div>' +
      '  <div class="price-info">' +
      '     <span class="total-label">Total</span>' +
      '     <span class="total-price">' +
      formatPrice(currencySymbol, Number(price).toFixed(2) || "0.00") +
      "</span>" +
      "  </div>" +
      '  <div class="accordion-item rate-terms-accordion">' +
      '    <div class="accordion-header">' +
      '     <div class="accordion-header-title rate-terms">See rate terms</div>' +
      "    </div>" +
      '    <div class="accordion-content terms-content">' +
      '      <div class="MuiBox-root mui-0"><div class="MuiTypography-root MuiTypography-body1 mui-16hh9w9" data-testid="rate-terms-container"><div class="MuiTypography-root MuiTypography-body1 mui-new8e0" data-testid="rate-terms-title">Rate terms</div><div class="MuiTypography-root MuiTypography-body1 mui-new8e0" data-testid="rate-terms-info-label">These rate terms apply for this specific rental.</div><div class="MuiTypography-root MuiTypography-body1 mui-new8e0" data-testid="rate-terms-description">If for any reason you change your rental parameters (pick up dates, times, etc.), those changes must follow these terms or your rate will also change.</div></div><ul class="MuiBox-root mui-1vnz3zg" data-testid="rate-terms-notes-ul"><li class="MuiBox-root mui-0"><span class="MuiTypography-root MuiTypography-bodySmallRegular mui-fp7ibt">Your rate was calculated based on the information provided. Some modifications may change this rate.</span></li><li class="MuiBox-root mui-0"><span class="MuiTypography-root MuiTypography-bodySmallRegular mui-fp7ibt">Unlimited free miles</span></li><li class="MuiBox-root mui-0"><span class="MuiTypography-root MuiTypography-bodySmallRegular mui-fp7ibt">If you need to cancel 24 hours prior to the scheduled pick-up time, we will refund the full prepaid amount less a ' +
      (rateTerms.cancelFeeBefore24h || currencySymbol + "0") +
      ' processing fee.</span></li><li class="MuiBox-root mui-0"><span class="MuiTypography-root MuiTypography-bodySmallRegular mui-fp7ibt">If you need to cancel during the 24 hour period prior to the scheduled pick-up time, we will refund the full prepaid amount less a ' +
      (rateTerms.cancelFeeWithin24h || currencySymbol + "0") +
      " processing fee.</span></li></ul></div>" +
      "    </div>" +
      "  </div>" +
      "</div>";

    var accordionHeaders = section.querySelectorAll(".accordion-header");
    for (var k = 0; k < accordionHeaders.length; k++) {
      (function (btn) {
        btn.addEventListener("click", function () {
          var hasItems = btn.getAttribute("data-has-items");
          if (hasItems === "false") return;

          btn.classList.toggle("active");
          var content = btn.nextElementSibling;
          var icon = btn.querySelector(".icon");
          var arrow = btn.querySelector(".accordion-header-icon-arrow");

          if (btn.classList.contains("active")) {
            content.style.maxHeight = content.scrollHeight + "px";
            if (icon) icon.textContent = "-";
            if (arrow) {
              arrow.style.transform = "rotate(180deg)";
              arrow.style.marginTop = "1px";
            }
          } else {
            content.style.maxHeight = null;
            if (icon) icon.textContent = "+";
            if (arrow) {
              arrow.style.transform = "rotate(0deg)";
              arrow.style.marginTop = "-9px";
            }
          }
        });
      })(accordionHeaders[k]);
    }

    // Update protection card prices with the current currency symbol on every price recalc
    var expSection = document.getElementById(EXP_ID);
    if (expSection) {
      var protectionCardEls = expSection.querySelectorAll(".protection-card");
      for (var pi = 0; pi < protectionCardEls.length; pi++) {
        var pCard = protectionCardEls[pi];
        var pCode = pCard.getAttribute("data-target-code");
        var pData = getProtectionData(pCode);
        if (!pData) continue;

        var pOldPriceEl = pCard.querySelector(".old-price");
        if (pOldPriceEl) {
          if (pData.oldPrice) {
            var rawOld = pData.oldPrice.replace(/^[^\d.]+/, "");
            pOldPriceEl.textContent = formatPrice(currencySymbol, rawOld);
            pOldPriceEl.style.display = "";
          } else {
            pOldPriceEl.style.display = "none";
          }
        }

        var pNewPriceEl = pCard.querySelector(".new-price");
        if (pNewPriceEl && pData.newPrice) {
          var rawNew = pData.newPrice.replace(/^[^\d.]+/, "");
          var formattedNew = parseFloat(rawNew).toFixed(2);
          pNewPriceEl.textContent = formatPrice(currencySymbol, formattedNew);
        }
      }
    }
  };

  if (!window.avisInterceptorSetup) {
    window.avisInterceptorSetup = true;
    var originalFetch = window.fetch;
    window.fetch = function () {
      var args = arguments;
      var self = this;
      var url = args[0];
      var isPriceCalc =
        typeof url === "string" &&
        url.indexOf("/web/reservation/price/calculate") !== -1;

      if (isPriceCalc) {
        showCarSummarySpinner();
      }

      return originalFetch
        .apply(self, args)
        .then(function (response) {
          try {
            if (isPriceCalc) {
              response
                .clone()
                .json()
                .then(function (data) {
                  window.__AVIS_PRICE_CALC__ = data;
                  if (window.updateAvisCarSummary) {
                    setTimeout(function () {
                      window.updateAvisCarSummary();
                      hideCarSummarySpinner();
                    }, 100);
                  }
                })
                .catch(function () {
                  hideCarSummarySpinner();
                });
            }
          } catch (e) {
            console.error("Interceptor error:", e);
            hideCarSummarySpinner();
          }
          return response;
        })
        .catch(function (err) {
          if (isPriceCalc) hideCarSummarySpinner();
          throw err;
        });
    };
  }

  function injectProtectionLayout() {
    if (document.getElementById(EXP_ID)) return;

    var selector = getTargetSelector();
    var isAvisFirst = selector === TARGET_SELECTOR_AVIS_FIRST;
    var insertionPoint = document.querySelector(selector);
    if (!insertionPoint) return;

    var html =
      '<section class="new-protection-section" id="' +
      EXP_ID +
      '">' +
      '        <div class="protection-container-grid">' +
      '          <div class="protection-cards-column">' +
      '            <div class="protection-cards-section">' +
      '              <svg class="protection-bg" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 979 424" fill="none">' +
      '                <path d="M5.83529e-05 0H979L979 350.639C979 350.639 679.144 424 487.982 424C296.82 424 0 350.639 0 350.639L5.83529e-05 0Z" fill="#EAEAEA"/>' +
      "              </svg>" +
      '              <div class="protection-cards-section-content">' +
      '                <h2 class="protection-title">' +
      "                Protection Packages Built for Peace of Mind" +
      "                </h2>" +
      "    " +
      '              <div class="protection-cards">' +
      "                <!-- Ultimate Protection Highlight -->" +
      '                <div class="protection-card highlight ultimate-card" data-target-code="Ultimate Protection">' +
      '                  <div class="recomended"> ' +
      recommendCheckSvg +
      " <span>RECOMMENDED</span> </div>" +
      '                  <div class="card-content-header">' +
      '                    <p class="card-title">Ultimate Protection</p>' +
      '                    <p class="ancillary-bundle-rating"><span class="active"></span> <span class="active"></span> <span class="active"></span> </p> ' +
      '                    <p class="card-desc">' +
      "                      Includes full protection if your rental vehicle is damaged or stolen." +
      "                    </p>" +
      "                  </div>" +
      '                  <ul class="feature-list">' +
      '                    <li class="active"><p><span class="active">' +
      svg +
      "</span> <span>Cover The Car (LDW)</span></p> <span>" +
      infoSvg +
      "</span></li>" +
      '                    <li class="active"><p><span class="active">' +
      svg +
      "</span> <span>Cover My Liability (ALI)</span></p> <span>" +
      infoSvg +
      "</span></li>" +
      '                    <li class="active"><p><span class="active">' +
      svg +
      "</span> <span>Cover Myself (PAI)</span></p> <span>" +
      infoSvg +
      "</span></li>" +
      '                    <li class="active"><p><span class="active">' +
      svg +
      "</span> <span>Cover My Belongings (PEP)</span></p> <span>" +
      infoSvg +
      "</span></li>" +
      "                  </ul>" +
      '                  <div class="price">' +
      '                    <span class="old-price">$62.00/day</span>' +
      '                    <span class="new-price">$56</span>' +
      '                    <span class="per-day">/day</span>' +
      "                  </div>" +
      '                  <div class="btn-container">' +
      '                    <button class="btn primary custom-select-btn" data-target-code="Ultimate Protection">Select</button>' +
      "                  </div>" +
      "                </div>" +
      " " +
      "                <!-- Enhance Protection -->" +
      '                <div class="protection-card" data-target-code="Enhanced Protection">' +
      '                  <div class="card-content-header">' +
      '                    <p class="card-title">Enhanced Protection</p>' +
      '                    <p class="ancillary-bundle-rating"><span class="active"></span> <span class="active"></span> <span></span> </p>' +
      '                    <p class="card-desc">' +
      "                      For your rental vehicle +liability coverage, to help avoid costly" +
      "                      claims from third party injuries or property damage." +
      "                    </p>" +
      "                  </div>" +
      '                  <ul class="feature-list">' +
      '                    <li class="active"><p><span class="active">' +
      svg +
      "</span> <span>Cover The Car (LDW)</span></p> <span>" +
      infoSvg +
      "</span></li>" +
      '                    <li class="active"><p><span class="active">' +
      svg +
      "</span> <span>Cover My Liability (ALI)</span></p> <span>" +
      infoSvg +
      "</span></li>" +
      '                    <li class="active"><p><span class="active">' +
      svg +
      "</span> <span>Cover Myself (PAI)</span></p> <span>" +
      infoSvg +
      "</span></li>" +
      '                    <li class="inactive"><p><span class="inactive">' +
      crossSvg +
      "</span> <span>Cover My Belongings (PEP)</span></p> <span>" +
      infoSvg +
      "</span></li>" +
      "                  </ul>" +
      '                  <div class="price">' +
      '                    <span class="old-price">$62.00/day</span>' +
      '                    <span class="new-price">$45</span>' +
      '                    <span class="per-day">/day</span>' +
      "                  </div>" +
      '                  <div class="btn-container">' +
      '                    <button class="btn secondary custom-select-btn" data-target-code="Enhanced Protection">Select</button>' +
      "                  </div>" +
      "                </div>" +
      " " +
      "                <!-- Essential Protection -->" +
      '                <div class="protection-card" data-target-code="Essential Protection">' +
      '                  <div class="card-content-header">' +
      '                    <p class="card-title">Essential Protection</p>' +
      '                    <p class="ancillary-bundle-rating"><span class="active"></span> <span></span> <span></span> </p>' +
      '                    <p class="card-desc">' +
      "                      For your rental vehicle, yourself, and your belongings." +
      "                    </p>" +
      "                  </div>" +
      '                  <ul class="feature-list">' +
      '                    <li class="active"><p><span class="active">' +
      svg +
      "</span> <span>Cover The Car (LDW)</span></p> <span>" +
      infoSvg +
      "</span></li>" +
      '                    <li class="inactive"><p><span class="inactive">' +
      crossSvg +
      "</span> <span>Cover My Liability (ALI)</span></p> <span>" +
      infoSvg +
      "</span></li>" +
      '                    <li class="inactive"><p><span class="inactive">' +
      crossSvg +
      "</span> <span>Cover Myself (PAI)</span></p> <span>" +
      infoSvg +
      "</span></li>" +
      '                    <li class="inactive"><p><span class="inactive">' +
      crossSvg +
      "</span> <span>Cover My Belongings (PEP)</span></p> <span>" +
      infoSvg +
      "</span></li>" +
      "                  </ul>" +
      '                  <div class="price">' +
      '                    <span class="old-price">$62.00/day</span>' +
      '                    <span class="new-price">$32</span>' +
      '                    <span class="per-day">/day</span>' +
      "                  </div>" +
      '                  <div class="btn-container">' +
      '                    <button class="btn secondary custom-select-btn" data-target-code="Essential Protection">Select</button>' +
      "                  </div>" +
      "                </div>" +
      "               </div>" +
      "              </div>" +
      "            </div>" +
      "          </div>" +
      "          <!-- Car Summary Column -->" +
      '          <div class="car-summary-column-wrapper">' +
      '            <div class="car-summary-column">' +
      '              <div class="car-summary-section">' +
      '                <p class="car-summary-title">Car Summary</p>' +
      "                <!-- Placeholder for car summary -->" +
      "              </div>" +
      "            </div>" +
      "          </div>" +
      "        </div>" +
      "      </section>";

    insertionPoint.insertAdjacentHTML("beforebegin", html);
    if (isAvisFirst) {
      insertionPoint.style.setProperty("display", "none", "important");
      var AVIS_FIRST_HIDE_SELECTOR =
        '[data-testid="Protections-container"] > div:nth-child(2) > div:nth-child(2)';
      poll(
        function () {
          return document.querySelector(AVIS_FIRST_HIDE_SELECTOR);
        },
        function () {
          var el = document.querySelector(AVIS_FIRST_HIDE_SELECTOR);
          el.style.setProperty("display", "none", "important");
        },
        false,
        5000,
      );
    } else {
      insertionPoint.style.setProperty("display", "none", "important");
      var targetContainer = document.querySelector(
        '[data-testid="Protections-container"] > div > div',
      );
      if (targetContainer)
        targetContainer.style.setProperty("display", "none", "important");
    }
    var targetIndividualProtectionSection = document.querySelector(
      TARGET_INDIVIDUAL_PROTECTION_SECTION,
    );

    poll(
      function () {
        return document.querySelector(".protection-cards-section");
      },
      function () {
        var protectionCardSection = document.querySelector(
          ".protection-cards-section",
        );
        protectionCardSection.insertAdjacentElement(
          "afterend",
          targetIndividualProtectionSection,
        );
      },
    );

    var protectionItems = [
      {
        code: "Ultimate Protection",
        cardTitle: "Ultimate Protection",
      },
      {
        code: "Enhanced Protection",
        cardTitle: "Enhanced Protection",
      },
      {
        code: "Essential Protection",
        cardTitle: "Essential Protection",
      },
    ];

    for (var i = 0; i < protectionItems.length; i++) {
      var prot = protectionItems[i];
      var data = getProtectionData(prot.code);
      if (!data) continue;

      var allCards = document.querySelectorAll(
        "#" + EXP_ID + " .protection-card",
      );
      var card = null;
      for (var j = 0; j < allCards.length; j++) {
        var titleEl = allCards[j].querySelector(".card-title");
        if (titleEl && titleEl.textContent.trim() === prot.cardTitle) {
          card = allCards[j];
          break;
        }
      }

      if (!card) continue;

      var ul = card.querySelector("ul");
      if (ul && data.features) {
        data.features.classList.add("features");
        ul.parentNode.replaceChild(data.features, ul);
        data.features.addEventListener("click", function (e) {
          e.stopPropagation();
          // Walk up the DOM to find the owning card at click-time (avoids stale closure)
          var ownerCard = e.currentTarget.closest(".protection-card");
          if (!ownerCard) return;
          var btn = ownerCard.querySelector(".custom-select-btn");
          if (!btn) return;
          var isAlreadySelected = btn.classList.contains("selected");
          var targetCode = btn.getAttribute("data-target-code");
          var bundleData = getProtectionData(targetCode);
          if (!bundleData || !bundleData.element) return;
          if (isAlreadySelected) {
            var noProtEl = document.querySelector(
              '[data-testid="ancillaries-bundle"][data-code="No Protection"]',
            );
            if (noProtEl) {
              noProtEl.dispatchEvent(
                new MouseEvent("click", {
                  bubbles: true,
                  cancelable: true,
                  view: window,
                }),
              );
            }
          } else {
            bundleData.element.dispatchEvent(
              new MouseEvent("click", {
                bubbles: true,
                cancelable: true,
                view: window,
              }),
            );
          }
          if (window.checkAvisState) {
            setTimeout(function () {
              window.checkAvisState();
            }, 100);
          }
        });
      }

      // Description replace
      var cardDescEl = card.querySelector(".card-desc");
      if (cardDescEl && data.description) {
        var descText =
          prot.code === "Ultimate Protection"
            ? data.description.spanText
            : data.description.pText;
        if (descText) {
          cardDescEl.textContent = descText;
        }
      }

      //Rating replace
      var ratingEl = card.querySelector(".ancillary-bundle-rating");
      if (ratingEl && data.rating) {
        var ratingDivs = data.rating.querySelectorAll("div");
        for (var d = 0; d < ratingDivs.length; d++) {
          ratingDivs[d].classList.remove("active");
          if (prot.code === "Ultimate Protection") {
            ratingDivs[d].classList.add("active");
          } else if (prot.code === "Enhanced Protection" && d < 2) {
            ratingDivs[d].classList.add("active");
          } else if (prot.code === "Essential Protection" && d < 1) {
            ratingDivs[d].classList.add("active");
          }
        }
        data.rating.classList.add("rating-mvt-307");
        ratingEl.parentNode.replaceChild(data.rating, ratingEl);
      }

      var oldPriceEl = card.querySelector(".old-price");
      if (oldPriceEl && data.oldPrice) {
        oldPriceEl.textContent = data.oldPrice;
        oldPriceEl.style.display = "inline";
      }

      var newPriceEl = card.querySelector(".new-price");
      if (newPriceEl && data.newPrice) {
        var symbol = getSymbol(
          window.__AVIS_PRICE_CALC__
            ? window.__AVIS_PRICE_CALC__.currencyCode
            : "",
        );
        console.log(symbol, "779");
        var rawPrice = data.newPrice;
        if (rawPrice.indexOf("$") === 0) {
          rawPrice = rawPrice.slice(1);
        } else if (symbol && rawPrice.indexOf(symbol) === 0) {
          rawPrice = rawPrice.slice(symbol.length);
        }
        var formattedPrice = parseFloat(rawPrice).toFixed(2);
        newPriceEl.textContent = symbol + formattedPrice;
      }
    }

    bindCustomSelectButton();
    window.updateAvisCarSummary();
    disableOriginalFooterAccordion();

    // Add opt out section
    var optOutSectin =
      '<div class="opt-out-section" id="avis-opt-out-container">' +
      "    <h4>Continue without protection</h4>" +
      "    <span>This rental may not be fully covered by your insurance or credit card. Without protection, you remain responsible for any rental vehicle damage, theft, or loss, and third-party claims. </span>" +
      '    <div class="decline-option" id="avis-opt-out-option-a">' +
      '      <label id="decline-protection-label">' +
      '        <input type="checkbox" name="decline-protection">' +
      '        <span class="checkbox">' +
      '          <svg focusable="false" aria-hidden="true" viewBox="0 0 11 9">' +
      '            <path d="M1 4L4 7L10 1" stroke-linecap="round" fill="none"></path>' +
      "          </svg>" +
      "        </span>" +
      "        I accept responsibility for damage to and loss/theft of the vehicle and third-party claims." +
      "      </label>" +
      "    </div>" +
      "  </div>";

    poll(
      function () {
        return (
          document.querySelector(".protection-container-grid") &&
          !document.querySelector(".opt-out-section")
        );
      },
      function () {
        var targetSection = document.querySelector(
          ".protection-container-grid",
        );
        targetSection.insertAdjacentHTML("afterend", optOutSectin);

        var noProtectionEl = document.querySelector(
          '[data-testid="ancillaries-bundle"][data-code="No Protection"]',
        );
        var declineProtectionLabel = document.getElementById(
          "decline-protection-label",
        );

        declineProtectionLabel.addEventListener("click", function () {
          if (noProtectionEl) noProtectionEl.click();
          setTimeout(checkState, 100);
        });
      },
    );

    // identify continue cta
    var contCta = $('button[data-testid="action-footer-cta-button"]');

    function checkState() {
      // check for active bundle (paid, not "No Protection")
      var activeBundleEl = $(".ancillaries-bundle--selected").not(
        '[data-code="No Protection"]',
      );
      var activeBundle = activeBundleEl.length > 0;
      var selectedPlanCode = activeBundle
        ? activeBundleEl.attr("data-code")
        : null;

      // Update custom cards highlighting
      var customCards = document.querySelectorAll(
        "#" + EXP_ID + " .protection-card",
      );
      for (var c = 0; c < customCards.length; c++) {
        var card = customCards[c];
        var cardBtn = card.querySelector(".custom-select-btn");
        var cardCode = cardBtn.getAttribute("data-target-code");

        var originalText = "Select";

        if (selectedPlanCode === cardCode) {
          card.classList.add("highlight");
          card.classList.add("selected");
          cardBtn.classList.add("selected");
          cardBtn.innerHTML = whiteCheckSvg + " Protection Added";
          cardBtn.classList.remove("secondary");
          cardBtn.classList.add("primary");
        } else if (
          selectedPlanCode === null &&
          cardCode === "Ultimate Protection"
        ) {
          card.classList.add("highlight");
          card.classList.remove("selected");
          cardBtn.classList.remove("selected");
          cardBtn.innerHTML = originalText;
          cardBtn.classList.add("primary");
          cardBtn.classList.remove("secondary");
        } else {
          card.classList.remove("highlight");
          card.classList.remove("selected");
          cardBtn.classList.remove("selected");
          cardBtn.innerHTML = originalText;
          cardBtn.classList.remove("primary");
          cardBtn.classList.add("secondary");
        }
      }

      // check for active individual items
      var activeItems =
        $(
          'div[data-testid="single-protections-item-add-to-trip-btn"] input:checked',
        ).length > 0;

      // check for included items
      var includedItems =
        $(
          'span[data-testid="single-protections-item-included-in-bundle"]',
        ).filter(function () {
          return $(this).text() === "Included";
        }).length > 0;

      // check if decline checkbox is checked
      var declineChecked = $(
        '#avis-opt-out-option-a input[type="checkbox"]',
      ).is(":checked");

      // enable CTA if any selection made
      var shouldEnable =
        activeBundle ||
        activeItems ||
        includedItems ||
        declineChecked ||
        !hasProtectionBundles ||
        residNotUSA;
      // hide opt-out section if a paid protection is active
      var shouldHide =
        activeBundle ||
        activeItems ||
        includedItems ||
        !hasProtectionBundles ||
        residNotUSA;

      var isDisabled = contCta.is(":disabled");

      if (shouldEnable && isDisabled) {
        contCta.removeAttr("disabled");
      } else if (!shouldEnable && !isDisabled) {
        contCta.attr("disabled", "");
      }

      if (shouldHide) {
        $("#avis-opt-out-container").slideUp();
        $('#avis-opt-out-option-a input[type="checkbox"]').prop(
          "checked",
          false,
        );
      } else {
        $("#avis-opt-out-container").slideDown();
      }

      if (activeBundle) {
        $("body").addClass("bundle-active");
      } else {
        $("body").removeClass("bundle-active");
      }
    }
    window.checkAvisState = checkState;

    // run on load
    setTimeout(checkState, 500);

    // watch CTA button attribute changes
    if (contCta.length > 0) {
      var ctaObserver = new MutationObserver(function () {
        checkState();
      });
      ctaObserver.observe(contCta[0], {
        attributes: true,
        childList: false,
        subtree: false,
      });
    }

    // re-run checkState on any relevant interaction
    $(document).on(
      "click",
      '[data-testid="ancillaries-bundle"], [data-testid="single-protections-item-add-to-trip-btn"], #avis-opt-out-option-a',
      function () {
        setTimeout(checkState, 200);
      },
    );
  }

  function injectCarSummaryOnly() {
    if (document.getElementById(EXP_ID_2)) return;

    var insertionPoint = document.querySelector(ADD_ON_PAGE);
    if (!insertionPoint) return;

    var html =
      '<section class="new-protection-section" id="' +
      EXP_ID_2 +
      '">' +
      '        <div class="protection-container-grid">' +
      '          <div class="protection-cards-column"></div>' +
      "          <!-- Car Summary Column -->" +
      '          <div class="car-summary-column-wrapper">' +
      '            <div class="car-summary-column">' +
      '              <div class="car-summary-section">' +
      '                <p class="car-summary-title">Car Summary</p>' +
      "                <!-- Placeholder for car summary -->" +
      "              </div>" +
      "            </div>" +
      "          </div>" +
      "        </div>" +
      "      </section>";

    insertionPoint.insertAdjacentHTML("beforebegin", html);

    var addonSection = document.getElementById(EXP_ID_2);
    addonSection.style.backgroundColor = "rgb(244, 244, 244)";
    var cardsColumn = addonSection.querySelector(".protection-cards-column");

    // Look for original elements that need to be moved into the new grid
    var selectSvg = insertionPoint.querySelector(":scope > svg");
    if (selectSvg) selectSvg.style.zIndex = "0";
    var selectTravelPck = insertionPoint.querySelector(
      ":scope > div:not(#" + EXP_ID_2 + "):not(#" + EXP_ID + ")",
    );
    if (selectTravelPck) {
      selectTravelPck.style.paddingTop = "35px";
      var TravelPackHeader = selectTravelPck.querySelector("div");
      if (TravelPackHeader) TravelPackHeader.style.zIndex = "1";
    }
    var addOnsPackages = document.querySelector(
      '[data-testid="ancillaries-bundles-container"]',
    );
    if (addOnsPackages) {
      addOnsPackages.style.zIndex = "1";
      addOnsPackages.style.display = "block !important";
    }
    var selectAddOnsList = document.querySelector(
      '[data-testid="single-addons-list-section-container"]',
    );
    var targetParentEl = document.querySelectorAll(
      '[data-testid="single-addons-category-section-container"]',
    );
    var singleAddOnsCategoryHeader = document.querySelectorAll(
      '[data-testid="single-addons-category-name"]',
    );

    for (var i = 0; i < singleAddOnsCategoryHeader.length; i++) {
      var header = singleAddOnsCategoryHeader[i];
      header.style.marginBottom = "20px";
      if (targetParentEl[i]) {
        targetParentEl[i].parentElement.insertAdjacentElement(
          "afterbegin",
          header,
        );
      }
    }

    if (cardsColumn) {
      if (selectSvg) cardsColumn.appendChild(selectSvg);
      if (selectTravelPck) cardsColumn.appendChild(selectTravelPck);
      if (selectAddOnsList) cardsColumn.appendChild(selectAddOnsList);
    }

    if (selectAddOnsList) {
      selectAddOnsList.style.paddingTop = "65px";
      if (window.innerWidth <= 1024) {
        selectAddOnsList.style.paddingTop = "0px";
        selectAddOnsList.style.position = "relative";
      }
    }

    // For Avis First: place the avis-first logo grandparent as the 2nd child of cardsColumn
    if (getTargetSelector() === TARGET_SELECTOR_AVIS_FIRST) {
      poll(
        function () {
          return document.querySelector('[data-testid="avis-first-long-logo"]');
        },
        function () {
          var logoEl = document.querySelector(
            '[data-testid="avis-first-long-logo"]',
          );
          var avisFirstBlock = logoEl.parentElement.parentElement;
          if (cardsColumn && avisFirstBlock) {
            // Insert as the second child (after whatever is first)
            var secondChild = cardsColumn.children[1] || null;
            cardsColumn.insertBefore(avisFirstBlock, secondChild);
          }
        },
        false,
        5000,
      );
    }

    window.updateAvisCarSummary();
    disableOriginalFooterAccordion();
  }

  function isProtectionPage() {
    return location.pathname.indexOf("/reservation/protectioncoverage") !== -1;
  }

  function isAddOnsPage() {
    return location.pathname.indexOf("/reservation/addons") !== -1;
  }

  function handlePageChange() {
    if (isProtectionPage()) {
      $("body").addClass("hide-prot-modal");
      if (document.getElementById(EXP_ID)) return;
      runProtection();
    }
    if (isAddOnsPage()) {
      if (document.getElementById(EXP_ID_2)) return;
      runAddOns();
    }
  }

  function runProtection() {
    //wait for body
    poll(
      function () {
        return document.querySelector("body");
      },
      function () {
        const params = new URLSearchParams(window.location.search);
        const residencyValue = params.get("residency_value") || "";
        residClean = residencyValue.trim().toUpperCase();
        residNotUSA = residClean !== "US" && residClean !== "";
      },
    );
    // First wait for sessionStorage to be populated by the app (SPA navigation
    // writes reservation.store asynchronously after the URL changes).
    poll(
      function () {
        try {
          return !!sessionStorage.getItem("reservation.store");
        } catch (e) {
          return false;
        }
      },
      function () {
        var selector = getTargetSelector();
        poll(
          function () {
            return document.querySelector(selector);
          },
          function () {
            injectProtectionLayout();
          },
        );
      },
      false,
      10000,
    );
  }

  function runAddOns() {
    poll(
      function () {
        return document.querySelector(ADD_ON_PAGE);
      },
      function () {
        injectCarSummaryOnly();
      },
    );
  }

  function observeDOM() {
    var debounceTimer = null;
    var observer = new MutationObserver(function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function () {
        handlePageChange();
      }, 50);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  window.addEventListener("locationchange", handlePageChange);

  // Run immediately for hard-reload case, then observe for SPA navigations.
  console.log(mvtID);
  handlePageChange();
  observeDOM();
})();
