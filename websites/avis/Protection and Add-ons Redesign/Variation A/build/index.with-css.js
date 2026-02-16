(function () {
  var interval = setInterval(function () {
    if (document.head) {
      // Check if <head> exists
      clearInterval(interval); // Stop checking once found
      var style = document.createElement("style");
      style.innerHTML = `[data-testid="stepper-container"] {
  border-bottom: none !important;
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
  /* Reduced by approx 20% from 592px */
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
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 0.3px !important;
  margin: 0 !important;
  padding-top: 25px;
  padding-bottom: 50px;
}

.protection-cards {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.protection-card {
  width: 100%;
  color: #fff;
  border-radius: 8px;
  border: 1px solid #d4d4d4;
  letter-spacing: 0.3px !important;
  flex: 1;
}

.protection-card.highlight {
  margin-top: -36px;
}

.protection-card.highlight .recomended {
  background-color: #660014;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  line-height: 100%;
  letter-spacing: 0.84px;
  text-align: center;
  padding: 12px 0;
  border-radius: 8px 8px 0 0;
}

.protection-card.highlight .card-content-header {
  background: #88001b;
  border-radius: 0;
  min-height: 160px;
}

.card-content-header {
  padding: 16px 24px;
  background-color: #151d28;
  border-radius: 8px 8px 0 0;
  min-height: 140px;
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

.ancillary-bundle-rating {
  margin: 0;
  margin-bottom: 6px;
}

.ancillary-bundle-rating span {
  width: 16px;
  height: 9px;
  background-color: rgba(225, 225, 225, 0.3019607843);
  display: inline-block;
  border-radius: 2px;
}

.ancillary-bundle-rating span.active {
  background-color: #e86400;
}

.card-desc {
  font-size: 14px;
  line-height: 20px;
  margin: 0;
}

.protection-card .features {
  background-color: #fff;
  margin-bottom: 0;
  padding: 16px 12px;
}

.protection-card .features > div > div:last-child > svg {
  width: 24px;
  height: 24px;
  cursor: pointer;
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

.price {
  background-color: #fff;
  text-align: center;
  padding: 16px 0;
}

.old-price {
  text-decoration: line-through;
  font-size: 14px;
  color: rgba(31, 29, 29, 0.4);
  line-height: 18px;
  letter-spacing: 0.3px !important;
  vertical-align: middle;
}

.new-price {
  font-size: 30px;
  font-weight: 500;
  color: #000;
  line-height: 28px;
}

.per-day {
  font-size: 16px;
  color: #000;
  line-height: 20px;
  vertical-align: text-bottom;
  font-weight: 500;
}

.btn-container {
  padding: 16px 24px;
  background-color: #fff;
  border-radius: 0 0 8px 8px;
}

.btn {
  border: none;
  padding: 16px 0;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  width: 100%;
  font-weight: 500;
}

.btn.selected {
  position: relative;
}

.btn.selected::after {
  content: "Selected";
  position: absolute;
  top: 0;
  left: 0;
  background: #e8e6e6;
  color: #979696;
  width: 100%;
  height: 100%;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn.primary {
  background: #d4002a;
  color: #fff;
}

.btn.secondary {
  background: #000;
  color: #fff;
}

.protection-container-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  max-width: 1440px;
  margin: 0 auto;
}

.protection-cards-column {
  grid-column: span 5;
}

.car-summary-column {
  grid-column: span 2;
}

.car-summary-column {
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.01);
  background-color: #fff;
  border-radius: 8px;
  padding: 24px 0;
  width: calc(100% - 57px);
  position: sticky;
  top: 66px;
  align-self: start;
  height: fit-content;
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
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}
.car-summary-section .vehicle-info .vehicle-name {
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.3px !important;
  color: #000;
}
.car-summary-section .location-info {
  margin-top: 12px;
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
  font-weight: 700;
  font-size: 14px;
  color: #000;
  margin-bottom: 4px;
  line-height: 1.2;
}
.car-summary-section .location-info .loc-name,
.car-summary-section .location-info .loc-time {
  font-size: 14px;
  color: #524d4d;
  line-height: 1.4;
}
.car-summary-section .total-vehicle-rate {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 16px;
  padding: 0 24px;
}
.car-summary-section .total-vehicle-rate-content .total-vehicle-rate-title {
  font-size: 14px;
  line-height: 20px;
  color: #000;
  font-weight: 500;
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
  font-weight: 600;
  color: #333;
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
}
.car-summary-section .accordion-header:hover {
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
  font-weight: 600;
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
  line-height: 20px;
  color: #000;
  font-weight: 500;
}
.car-summary-section .price-info .total-price {
  font-weight: 700;
  font-size: 18px;
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

@media (max-width: 768px) {
  .protection-container-grid {
    grid-template-columns: 1fr;
    padding: 0;
  }
  .protection-cards-column,
  .car-summary-column {
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
}
@media (max-width: 1024px) {
  .car-summary-column {
    display: none;
  }
  .protection-cards-column {
    grid-column: span 7;
  }
}
@media (min-width: 1025px) {
  [data-testid="action-footer-total-amount"] {
    cursor: default !important;
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

  function applyCode() {
    if (window.__MVT_307_A__) return;
    window.__MVT_307_A__ = true;
    var EXP_ID = "avis-protection-variation-a";
    var EXP_ID_2 = "avis-addOns-variation-A";
    var TARGET_SELECTOR = '[data-testid="Protections-container"] > div > svg';
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

    function getProtectionData(dataCode) {
      var selector =
        '[data-testid="ancillaries-bundle"][data-code="' + dataCode + '"]';
      var bundle = document.querySelector(selector);

      if (!bundle) return null;

      // Feature list (UL > LI)
      var body = bundle.querySelector(
        '[data-testid="ancillaries-bundle-body"]',
      );
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

      return {
        features: features,
        oldPrice: oldPrice,
        newPrice: newPrice,
        element: bundle,
      };
    }

    function bindCustomSelectButton() {
      var customBtns = document.querySelectorAll(
        "#" + EXP_ID + " .custom-select-btn",
      );

      for (var i = 0; i < customBtns.length; i++) {
        (function (customBtn) {
          customBtn.addEventListener("click", function () {
            var targetCode = customBtn.getAttribute("data-target-code");
            var data = getProtectionData(targetCode);
            if (!data || !data.element) {
              return console.warn("body element not found");
            }
            data.element.dispatchEvent(
              new MouseEvent("click", {
                bubbles: true,
                cancelable: true,
                view: window,
              }),
            );

            // Toggle selected class on the clicked button
            if (customBtn.classList.contains("selected")) {
              customBtn.classList.remove("selected");
            } else {
              for (var j = 0; j < customBtns.length; j++) {
                customBtns[j].classList.remove("selected");
              }
              customBtn.classList.add("selected");
            }
          });
        })(customBtns[i]);
      }
    }

    // --- Shared Car Summary Logic ---
    var vehicleData = { name: "", image: "" };
    var locationData = {
      pickup: { name: "", date: "", time: "" },
      dropoff: { name: "", date: "", time: "" },
    };

    function getSessionData() {
      try {
        var reservationStoreRaw = sessionStorage.getItem("reservation.store");
        if (reservationStoreRaw) {
          var store = JSON.parse(reservationStoreRaw);
          if (store) {
            var state = store.state || store;
            vehicleData.name = state.vehicleModelDescription || "";
            vehicleData.image = state.vehicleImage || "";

            locationData.pickup.name =
              state.pickupAddressLine1 + ", " + state.pickupCityName || "";
            locationData.dropoff.name =
              state.returnAddressLine1 + ", " + state.returnCityName || "";

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

            var dropoffDT = formatISO(
              state.returnDatetime || state.dropOffDate,
            );
            locationData.dropoff.date =
              dropoffDT.date || state.dropOffDate || "";
            locationData.dropoff.time =
              dropoffDT.time || state.dropOffTime || "";
          }
        }
      } catch (e) {
        console.error("Error parsing reservation store:", e);
      }
    }

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

    window.updateAvisCarSummary = function () {
      var section = document.querySelector(
        ".new-protection-section .car-summary-section",
      );
      if (!section) return;

      getSessionData();

      var totals = window.__AVIS_PRICE_CALC__
        ? window.__AVIS_PRICE_CALC__.totals
        : {};
      var priceCalc = window.__AVIS_PRICE_CALC__
        ? window.__AVIS_PRICE_CALC__
        : {};
      var price = totals.total || "0.00";
      var vehicleRate = totals.grossSubtotal || "0.00";
      var vehicleRateDiscount = totals.netSubtotal || "0.00";
      var rentalDays = priceCalc.rentalDays || "0";
      var unlimitedFreeMiles = priceCalc.rateTerms
        ? priceCalc.rateTerms.unlimitedMilage
        : false;
      var protectionBundle = priceCalc.protectionBundle;
      var protectionBundleName = protectionBundle ? protectionBundle.code : "";
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
        ? Number(priceCalc.savings.discountCodeSavings)
        : "0.00";
      var payNowSaving = priceCalc.savings
        ? Number(priceCalc.savings.payNowSavings)
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

      var combinedProtectionAddOns = protectionList.concat(addOnList);

      var buildList = function (items) {
        if (!items || !items.length)
          return '<div class="empty-list">None</div>';
        return items
          .map(function (i) {
            return (
              '<div class="summary-item"><span>' +
              (i.description || i.name) +
              "</span><span>$" +
              (i.amountString || i.amount || 0) +
              "</span></div>"
            );
          })
          .join("");
      };

      var imageHtml = vehicleData.image
        ? '<div class="vehicle-image-container"><img src="https://www.avis.com' +
          vehicleData.image +
          '" data-testid="rental-summary-image" alt="vehicle image" class="car-image" loading="lazy" width="113" height="48" decoding="async" data-nimg="1"></div>'
        : "";

      section.innerHTML =
        '<p class="car-summary-title">Car Summary</p>' +
        '<div class="summary-content">' +
        '   <div class="vehicle-info">' +
        '     <p class="vehicle-name">' +
        vehicleData.name +
        "</p>" +
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
        '   <div class="divider"></div>' +
        '   <div class="total-vehicle-rate">' +
        '     <div class="total-vehicle-rate-content">' +
        '      <div class="total-vehicle-rate-title">Vehicle total rate (' +
        rentalDays +
        " days)</div>" +
        '      <div class="total-vehicle-rate-subtitle">' +
        (unlimitedFreeMiles ? "Unlimited free miles" : "") +
        "</div>" +
        "     </div>" +
        '     <div class="total-vehicle-rate-price">' +
        '      <span class="total-vehicle-rate-price-amount">$' +
        vehicleRate +
        "</span> " +
        '      <span class="total-vehicle-rate-price-save">$' +
        vehicleRateDiscount +
        "</span>" +
        "     </div>" +
        "   </div>" +
        '  <div class="accordion-item protection-accordion"> ' +
        '    <div class="accordion-header" data-has-items="' +
        (combinedProtectionAddOns.length > 0) +
        '">' +
        '     <div class="accordion-header-title protection-add-ons">Protections & Add-ons</div>' +
        '     <div class="accordion-header-icon">' +
        '      <div class="accordion-header-icon-price">$' +
        protectionAndAddOnsTotal.toFixed(2) +
        "</div>" +
        '      <div class="accordion-header-icon-arrow" style="display: ' +
        (combinedProtectionAddOns.length > 0 ? "block" : "none") +
        ';">' +
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
        '   <div class="divider"></div>' +
        '  <div class="accordion-item savings-discount">' +
        '    <div class="accordion-header" data-has-items="' +
        (totalSavings > 0) +
        '">' +
        '     <div class="accordion-header-title">Savings and Discount</div>' +
        '     <div class="accordion-header-icon">' +
        '      <div class="accordion-header-icon-price">$' +
        (totalSavings || "0.00") +
        "</div>" +
        '      <div class="accordion-header-icon-arrow" style="display: ' +
        (totalSavings > 0 ? "block" : "none") +
        ';">' +
        arrowDown +
        "</div>" +
        "     </div>" +
        "    </div>" +
        '    <div class="accordion-content">' +
        '      <div class="summary-item"><span>Discount Code Savings</span><span>$' +
        (discountCodeSavings || "0.00") +
        "</span></div>" +
        '      <div class="summary-item"><span>Pay Now Savings</span><span>$' +
        (payNowSaving || "0.00") +
        "</span></div>" +
        '      <div class="summary-item"><span>Protection and Add-ons Savings</span><span>$' +
        (Number(protectionAndAddOnSavings).toFixed(2) || "0.00") +
        "</span></div>" +
        "    </div>" +
        "  </div>" +
        '  <div class="accordion-item text-and-fees-accordion">' +
        '    <div class="accordion-header" data-has-items="' +
        (taxAndFees.length > 0) +
        '">' +
        '     <div class="accordion-header-title">Tax and Fees</div>' +
        '     <div class="accordion-header-icon">' +
        '      <div class="accordion-header-icon-price">$' +
        (taxAndFees.length > 0
          ? taxAndFees
              .reduce(function (acc, item) {
                return acc + (item.amount || 0);
              }, 0)
              .toFixed(2)
          : "0.00") +
        "</div>" +
        '      <div class="accordion-header-icon-arrow" style="display: ' +
        (taxAndFees.length > 0 ? "block" : "none") +
        ';">' +
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
              "</a><span>$" +
              (item.amount || 0).toFixed(2) +
              "</span></div>"
            );
          })
          .join("") +
        "    </div>" +
        "  </div>" +
        '   <div class="divider"></div>' +
        '  <div class="price-info">' +
        '     <span class="total-label">Total</span>' +
        '     <span class="total-price">$' +
        (Number(price).toFixed(2) || "0.00") +
        "</span>" +
        "  </div>" +
        '  <div class="accordion-item rate-terms-accordion">' +
        '    <div class="accordion-header">' +
        '     <div class="accordion-header-title rate-terms">See rate terms</div>' +
        "    </div>" +
        '    <div class="accordion-content">' +
        '      <div class="MuiBox-root mui-0"><div class="MuiTypography-root MuiTypography-body1 mui-16hh9w9" data-testid="rate-terms-container"><div class="MuiTypography-root MuiTypography-body1 mui-new8e0" data-testid="rate-terms-title">Rate terms</div><div class="MuiTypography-root MuiTypography-body1 mui-new8e0" data-testid="rate-terms-info-label">These rate terms apply for this specific rental.</div><div class="MuiTypography-root MuiTypography-body1 mui-new8e0" data-testid="rate-terms-description">If for any reason you change your rental parameters (pick up dates, times, etc.), those changes must follow these terms or your rate will also change.</div></div><ul class="MuiBox-root mui-1vnz3zg" data-testid="rate-terms-notes-ul"><li class="MuiBox-root mui-0"><span class="MuiTypography-root MuiTypography-bodySmallRegular mui-fp7ibt">Your rate was calculated based on the information provided. Some modifications may change this rate.</span></li><li class="MuiBox-root mui-0"><span class="MuiTypography-root MuiTypography-bodySmallRegular mui-fp7ibt">Unlimited free miles</span></li><li class="MuiBox-root mui-0"><span class="MuiTypography-root MuiTypography-bodySmallRegular mui-fp7ibt">If you need to cancel 24 hours prior to the scheduled pick-up time, we will refund the full prepaid amount less a ' +
        (rateTerms.cancelFeeBefore24h || "$0") +
        ' processing fee.</span></li><li class="MuiBox-root mui-0"><span class="MuiTypography-root MuiTypography-bodySmallRegular mui-fp7ibt">If you need to cancel during the 24 hour period prior to the scheduled pick-up time, we will refund the full prepaid amount less a ' +
        (rateTerms.cancelFeeWithin24h || "$0") +
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
    };

    if (!window.avisInterceptorSetup) {
      window.avisInterceptorSetup = true;
      var originalFetch = window.fetch;
      window.fetch = function () {
        var args = arguments;
        var self = this;
        return originalFetch.apply(self, args).then(function (response) {
          try {
            var url = args[0];
            if (
              typeof url === "string" &&
              url.indexOf("/web/reservation/price/calculate") !== -1
            ) {
              response
                .clone()
                .json()
                .then(function (data) {
                  window.__AVIS_PRICE_CALC__ = data;
                  if (window.updateAvisCarSummary) {
                    setTimeout(function () {
                      window.updateAvisCarSummary();
                    }, 100);
                  }
                });
            }
          } catch (e) {
            console.error("Interceptor error:", e);
          }
          return response;
        });
      };
    }

    function injectProtectionLayout() {
      if (document.getElementById(EXP_ID)) return;

      var insertionPoint = document.querySelector(TARGET_SELECTOR);
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
        "                2.5 Million + customers purchased our popular protection in 2025!" +
        "                </h2>" +
        "    " +
        '              <div class="protection-cards">' +
        '                <div class="protection-card">' +
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
        '                    <button class="btn secondary custom-select-btn" data-target-code="Ultimate Protection">Select</button>' +
        "                  </div>" +
        "                </div>" +
        " " +
        "                <!-- Standard Protection Highlight -->" +
        '                <div class="protection-card highlight">' +
        '                  <div class="recomended">RECOMMENDED</div>' +
        '                  <div class="card-content-header">' +
        '                    <p class="card-title">Enhanced Protection</p>' +
        '                    <p class="ancillary-bundle-rating"><span class="active"></span> <span class="active"></span> <span></span> </p>' +
        '                    <p class="card-desc">' +
        "                      For your rental vehicle + liability coverage, to help avoid costly" +
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
        '                    <button class="btn primary custom-select-btn" data-target-code="Enhanced Protection">Add Protection</button>' +
        "                  </div>" +
        "                </div>" +
        " " +
        '                <div class="protection-card">' +
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
        "              </div>" +
        "              </div>" +
        "            </div>" +
        "          </div>" +
        "          <!-- Car Summary Column -->" +
        '          <div class="car-summary-column">' +
        '            <div class="car-summary-section">' +
        '               <p class="car-summary-title">Car Summary</p>' +
        "               <!-- Placeholder for car summary -->" +
        "            </div>" +
        "          </div>" +
        "        </div>" +
        "      </section>";

      insertionPoint.insertAdjacentHTML("beforebegin", html);
      insertionPoint.style.display = "none";
      var targetContainer = document.querySelector(
        '[data-testid="Protections-container"] > div > div',
      );
      targetContainer.style.display = "none";
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
        }

        var oldPriceEl = card.querySelector(".old-price");
        if (oldPriceEl && data.oldPrice) {
          oldPriceEl.textContent = data.oldPrice;
          oldPriceEl.style.display = "inline";
        }

        var newPriceEl = card.querySelector(".new-price");
        if (newPriceEl && data.newPrice) {
          newPriceEl.textContent =
            data.newPrice.indexOf("$") === 0
              ? data.newPrice
              : "$" + data.newPrice;
        }
      }

      bindCustomSelectButton();
      window.updateAvisCarSummary();
      disableOriginalFooterAccordion();

      // Add opt out section
      var optOutSectin =
        '<div class="opt-out-section">' +
        "    <h4>Continue without protection</h4>" +
        "    <span>This rental may not be fully covered by your insurance or credit card. Without protection, you remain responsible for any rental vehicle damage, theft, or loss, and third-party claims. </span>" +
        '    <div class="decline-option">' +
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
            document.querySelector(
              '[data-testid="single-protections-list-section-container"]',
            ) && !document.querySelector(".opt-out-section")
          );
        },
        function () {
          var targetSection = document.querySelector(
            '[data-testid="single-protections-list-section-container"]',
          );
          targetSection.insertAdjacentHTML("afterend", optOutSectin);
          var noProtectionEl = document.querySelector(
            '[data-testid="ancillaries-bundle"][data-code="No Protection"]',
          );
          var declineProtectionLabel = document.getElementById(
            "decline-protection-label",
          );
          declineProtectionLabel.addEventListener("click", function () {
            noProtectionEl.click();
          });
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
        '          <div class="car-summary-column">' +
        '            <div class="car-summary-section">' +
        '               <p class="car-summary-title">Car Summary</p>' +
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
      if (addOnsPackages) addOnsPackages.style.zIndex = "1";
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

      window.updateAvisCarSummary();
      disableOriginalFooterAccordion();
    }

    function isProtectionPage() {
      return (
        location.pathname.indexOf("/reservation/protectioncoverage") !== -1
      );
    }

    function isAddOnsPage() {
      return location.pathname.indexOf("/reservation/addons") !== -1;
    }

    function handlePageChange() {
      if (isProtectionPage()) runProtection();
      if (isAddOnsPage()) runAddOns();
    }

    function runProtection() {
      poll(
        function () {
          return document.querySelector(TARGET_SELECTOR);
        },
        function () {
          injectProtectionLayout();
        },
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
      var observer = new MutationObserver(function () {
        handlePageChange();
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }

    window.addEventListener("locationchange", handlePageChange);

    poll(
      function () {
        return document.body;
      },
      function () {
        handlePageChange();
        observeDOM();
      },
    );
  }

  poll(
    function () {
      return document.querySelector('[data-testid="Protections-container"]');
    },
    function () {
      applyCode();
    },
  );
})();
