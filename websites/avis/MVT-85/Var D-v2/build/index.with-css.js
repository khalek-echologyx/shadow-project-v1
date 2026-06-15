(function () {
  var interval = setInterval(function () {
    if (document.head) {
      // Check if <head> exists
      clearInterval(interval); // Stop checking once found
      var style = document.createElement("style");
      style.innerHTML = `.MVT-85-Var_C
  #booking-widget
  #booking-widget-desktop-form
  > div:nth-child(2)
  > div
  > div:nth-child(2) {
  align-items: start;
}
.MVT-85-Var_C
  #booking-widget
  #booking-widget-desktop-form
  > div:nth-child(2)
  > div
  > div:nth-child(1) {
  align-items: start;
}
.MVT-85-Var_C
  #booking-widget
  #booking-widget-desktop-form
  [data-testid="drivers-age-dropdown"]
  #mui-component-select-ageSelect {
  font-weight: 500;
  color: #000;
  font-size: 14px !important;
  padding-right: 4px !important;
}
.MVT-85-Var_C .mvt-85-age-wrapper,
.MVT-85-Var_C .mvt-85-wizard-wrapper,
.MVT-85-Var_C .mvt-85-discount-wrapper {
  margin-bottom: 0 !important;
}
.MVT-85-Var_C .mvt-85-age-wrapper .mvt-85-top-row,
.MVT-85-Var_C .mvt-85-wizard-wrapper .mvt-85-top-row,
.MVT-85-Var_C .mvt-85-discount-wrapper .mvt-85-top-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
@media (max-width: 1250px) {
  .MVT-85-Var_C .mvt-85-age-wrapper .mvt-85-top-row,
  .MVT-85-Var_C .mvt-85-wizard-wrapper .mvt-85-top-row,
  .MVT-85-Var_C .mvt-85-discount-wrapper .mvt-85-top-row {
    align-items: start;
  }
  .MVT-85-Var_C .mvt-85-age-wrapper .mvt-85-top-row #ageCheckbox,
  .MVT-85-Var_C .mvt-85-wizard-wrapper .mvt-85-top-row #ageCheckbox,
  .MVT-85-Var_C .mvt-85-discount-wrapper .mvt-85-top-row #ageCheckbox {
    margin-top: 2px !important;
  }
}
.MVT-85-Var_C .mvt-85-age-wrapper input.mvt-85-checkbox,
.MVT-85-Var_C .mvt-85-wizard-wrapper input.mvt-85-checkbox,
.MVT-85-Var_C .mvt-85-discount-wrapper input.mvt-85-checkbox {
  margin: 0 !important;
  cursor: pointer;
  flex-shrink: 0;
  appearance: none;
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border: 1px solid #000;
  border-radius: 2px;
  background-color: #fff;
  position: relative;
}
.MVT-85-Var_C .mvt-85-age-wrapper input.mvt-85-checkbox:checked,
.MVT-85-Var_C .mvt-85-wizard-wrapper input.mvt-85-checkbox:checked,
.MVT-85-Var_C .mvt-85-discount-wrapper input.mvt-85-checkbox:checked {
  background-color: #000;
  padding: 4px;
}
.MVT-85-Var_C .mvt-85-age-wrapper input.mvt-85-checkbox:checked::after,
.MVT-85-Var_C .mvt-85-wizard-wrapper input.mvt-85-checkbox:checked::after,
.MVT-85-Var_C .mvt-85-discount-wrapper input.mvt-85-checkbox:checked::after {
  content: "";
  position: absolute;
  left: 6px;
  top: 2px;
  width: 4px;
  height: 8px;
  border: solid #fff;
  border-width: 0 1.5px 1.5px 0;
  transform: rotate(45deg);
}
.MVT-85-Var_C .mvt-85-age-wrapper svg.MuiSvgIcon-root,
.MVT-85-Var_C .mvt-85-wizard-wrapper svg.MuiSvgIcon-root,
.MVT-85-Var_C .mvt-85-discount-wrapper svg.MuiSvgIcon-root {
  display: none;
}
.MVT-85-Var_C .mvt-85-age-wrapper .mvt-85-tooltip {
  position: relative;
  display: inline-flex;
}
.MVT-85-Var_C .mvt-85-age-wrapper .mvt-85-tooltip:hover .mvt-85-tooltip-text {
  visibility: visible;
  opacity: 1;
}
.MVT-85-Var_C .mvt-85-age-wrapper .mvt-85-tooltip .mvt-85-info-icon {
  cursor: pointer;
}
.MVT-85-Var_C .mvt-85-age-wrapper .mvt-85-tooltip .mvt-85-info-icon:hover path {
  fill: #000;
}
.MVT-85-Var_C .mvt-85-age-wrapper .mvt-85-tooltip-text {
  position: absolute;
  top: 22px;
  left: 6.5px;
  transform: translateX(-50%);
  width: 275px;
  max-width: 300px;
  background-color: rgba(57, 54, 54, 0.92);
  color: rgb(255, 255, 255);
  font-size: 0.6875rem;
  font-weight: 500;
  line-height: 16px;
  padding: 4px 8px;
  border-radius: 4px;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease;
  z-index: 9999;
  pointer-events: none;
  box-sizing: border-box;
  overflow-wrap: break-word;
  text-wrap: auto;
}
.MVT-85-Var_C .mvt-85-age-wrapper .mvt-85-tooltip-text::before {
  content: "";
  position: absolute;
  top: -5px;
  left: 50%;
  transform: translateX(-50%);
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 6px solid #4b4545;
}
@media (max-width: 1250px) {
  .MVT-85-Var_C
    #booking-widget
    #booking-widget-desktop-form
    .mvt-85-residency-wrapper
    .mvt-85-top-row
    #residencyCheckbox {
    margin-top: 2px !important;
  }
}
.MVT-85-Var_C
  #booking-widget
  #booking-widget-desktop-form
  .mvt-85-residency-wrapper
  [data-testid="residency-dropdown-button"]
  span {
  color: #000;
  font-weight: 500;
}
.MVT-85-Var_C
  #booking-widget
  #booking-widget-desktop-form
  .mvt-85-residency-wrapper
  .mvt-85-tooltip {
  position: relative;
  display: inline-flex;
  margin-left: 5px;
  pointer-events: auto;
}
.MVT-85-Var_C
  #booking-widget
  #booking-widget-desktop-form
  .mvt-85-residency-wrapper
  .mvt-85-tooltip:hover
  .mvt-85-tooltip-text {
  visibility: visible;
  opacity: 1;
}
.MVT-85-Var_C
  #booking-widget
  #booking-widget-desktop-form
  .mvt-85-residency-wrapper
  .mvt-85-tooltip
  .mvt-85-info-icon {
  cursor: pointer;
}
.MVT-85-Var_C
  #booking-widget
  #booking-widget-desktop-form
  .mvt-85-residency-wrapper
  .mvt-85-tooltip
  .mvt-85-info-icon:hover
  path {
  fill: #000;
}
.MVT-85-Var_C
  #booking-widget
  #booking-widget-desktop-form
  .mvt-85-residency-wrapper
  .mvt-85-tooltip-text {
  position: absolute;
  top: 22px;
  left: 6.5px;
  transform: translateX(-50%);
  width: 275px;
  max-width: 300px;
  background-color: rgba(57, 54, 54, 0.92);
  color: rgb(255, 255, 255) !important;
  font-size: 0.6875rem !important;
  font-weight: 500;
  line-height: 16px;
  padding: 4px 8px;
  border-radius: 4px;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease;
  z-index: 9999;
  pointer-events: none;
  box-sizing: border-box;
  overflow-wrap: break-word;
  text-wrap: auto;
  text-align: left !important;
}
.MVT-85-Var_C
  #booking-widget
  #booking-widget-desktop-form
  .mvt-85-residency-wrapper
  .mvt-85-tooltip-text::before {
  content: "";
  position: absolute;
  top: -5px;
  left: 50%;
  transform: translateX(-50%);
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 6px solid #4b4545;
}
.MVT-85-Var_C
  #booking-widget
  #booking-widget-desktop-form
  [data-testid="residency-dropdown-button"]
  span:not(.mvt-85-tooltip-text) {
  font-size: 14px !important;
}
.MVT-85-Var_C .mvt-85-extra-labels-container {
  display: flex;
  gap: 48px;
}
.MVT-85-Var_C .mvt-85-extra-labels-container .mvt-85-age-label {
  margin-bottom: 0 !important;
  font-size: 12px;
  pointer-events: none;
  user-select: none;
  letter-spacing: 0.036px;
  margin-left: 25px;
  min-width: 80px;
}
.MVT-85-Var_C .mvt-85-extra-labels-container .mvt-85-residency-label {
  margin-left: 27px;
}
.MVT-85-Var_C
  #booking-widget
  #booking-widget-desktop-form
  [data-testid="wizard-number-popup-trigger-button"]
  p {
  color: #000;
  font-weight: 500;
}
.MVT-85-Var_C
  #booking-widget
  #booking-widget-desktop-form
  [data-testid="discount-coupon-popup-trigger-button"]
  p:not(.mui-1i5m7g4) {
  font-size: 14px !important;
  font-weight: 500;
  color: #000;
}
.MVT-85-Var_C
  #booking-widget
  #booking-widget-desktop-form
  [data-testid="residency-dropdown-menu-container"]:last-child
  > div {
  background-color: #fff !important;
  border-radius: 0 0 4px 4px !important;
}
.MVT-85-Var_C
  #booking-widget
  #booking-widget-desktop-form
  .mvt-85-wizard-wrapper {
  margin-left: auto;
}
.MVT-85-Var_C
  #booking-widget
  #booking-widget-desktop-form
  .mvt-85-wizard-wrapper
  .mvt-85-top-row {
  align-items: start !important;
}
.MVT-85-Var_C
  #booking-widget
  #booking-widget-desktop-form
  .mvt-85-wizard-wrapper
  .mvt-85-top-row
  #wizardCheckbox {
  margin-top: 2px !important;
}
.MVT-85-Var_C
  #booking-widget
  #booking-widget-desktop-form
  .mvt-85-wizard-wrapper
  .wizard-applied-label {
  cursor: pointer;
}
.MVT-85-Var_C
  #booking-widget
  #booking-widget-desktop-form
  .mvt-85-wizard-wrapper
  .mvt-85-wizard-applied-text {
  display: flex;
  align-items: center;
  gap: 4px;
}
.MVT-85-Var_C
  #booking-widget
  #booking-widget-desktop-form
  .mvt-85-wizard-wrapper
  .mvt-85-wizard-applied-text
  p {
  margin: 0;
  font-size: 13px;
  font-weight: 500;
  color: #46791d;
  letter-spacing: 0.036px;
  line-height: 28px;
  text-decoration: underline;
}
.MVT-85-Var_C
  #booking-widget
  #booking-widget-desktop-form
  .mvt-85-wizard-wrapper
  .mvt-85-tooltip {
  position: relative;
  display: inline-flex;
  margin-left: 5px;
}
.MVT-85-Var_C
  #booking-widget
  #booking-widget-desktop-form
  .mvt-85-wizard-wrapper
  .mvt-85-tooltip:hover
  .mvt-85-tooltip-text {
  visibility: visible;
  opacity: 1;
}
.MVT-85-Var_C
  #booking-widget
  #booking-widget-desktop-form
  .mvt-85-wizard-wrapper
  .mvt-85-tooltip
  .mvt-85-info-icon {
  cursor: pointer;
}
.MVT-85-Var_C
  #booking-widget
  #booking-widget-desktop-form
  .mvt-85-wizard-wrapper
  .mvt-85-tooltip
  .mvt-85-info-icon:hover
  path {
  fill: #000;
}
.MVT-85-Var_C
  #booking-widget
  #booking-widget-desktop-form
  .mvt-85-wizard-wrapper
  .mvt-85-tooltip-text {
  position: absolute;
  top: 26px;
  left: 6.5px;
  transform: translateX(-50%);
  width: 275px;
  max-width: 300px;
  background-color: rgba(57, 54, 54, 0.92);
  color: rgb(255, 255, 255) !important;
  font-size: 0.6875rem !important;
  font-weight: 500;
  line-height: 16px;
  padding: 4px 8px;
  border-radius: 4px;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease;
  z-index: 9999;
  pointer-events: none;
  box-sizing: border-box;
  overflow-wrap: break-word;
  text-wrap: auto;
  text-align: left !important;
}
.MVT-85-Var_C
  #booking-widget
  #booking-widget-desktop-form
  .mvt-85-wizard-wrapper
  .mvt-85-tooltip-text::before {
  content: "";
  position: absolute;
  top: -5px;
  left: 50%;
  transform: translateX(-50%);
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 6px solid #4b4545;
}
.MVT-85-Var_C
  #booking-widget
  #booking-widget-desktop-form
  [data-testid="discount-coupon-popup-trigger-button"]
  svg:not(.mvt-85-info-icon) {
  display: none;
}
.MVT-85-Var_C
  #booking-widget
  #booking-widget-desktop-form
  .mvt-85-discount-wrapper
  .mvt-85-top-row
  #discountCheckbox {
  margin-top: 2px !important;
}
.MVT-85-Var_C
  #booking-widget
  #booking-widget-desktop-form
  .mvt-85-discount-wrapper
  .mvt-85-add-discount-text {
  margin: 0;
  margin-top: 2px;
}
.MVT-85-Var_C
  #booking-widget
  #booking-widget-desktop-form
  .mvt-85-discount-wrapper
  .mvt-85-discount-applied-text {
  display: flex;
  align-items: center;
  gap: 4px;
}
.MVT-85-Var_C
  #booking-widget
  #booking-widget-desktop-form
  .mvt-85-discount-wrapper
  .mvt-85-discount-applied-text
  p {
  margin: 0;
  font-size: 13px;
  font-weight: 500;
  color: #46791d;
  letter-spacing: 0.036px;
  line-height: 28px;
  text-decoration: underline;
}
.MVT-85-Var_C
  #booking-widget
  #booking-widget-desktop-form
  .mvt-85-discount-wrapper
  .mvt-85-tooltip {
  position: relative;
  display: inline-flex;
  margin-left: 5px;
}
.MVT-85-Var_C
  #booking-widget
  #booking-widget-desktop-form
  .mvt-85-discount-wrapper
  .mvt-85-tooltip:hover
  .mvt-85-tooltip-text {
  visibility: visible;
  opacity: 1;
}
.MVT-85-Var_C
  #booking-widget
  #booking-widget-desktop-form
  .mvt-85-discount-wrapper
  .mvt-85-tooltip
  .mvt-85-info-icon {
  cursor: pointer;
}
.MVT-85-Var_C
  #booking-widget
  #booking-widget-desktop-form
  .mvt-85-discount-wrapper
  .mvt-85-tooltip
  .mvt-85-info-icon:hover
  path {
  fill: #000;
}
.MVT-85-Var_C
  #booking-widget
  #booking-widget-desktop-form
  .mvt-85-discount-wrapper
  .mvt-85-tooltip-text {
  position: absolute;
  top: 26px;
  left: 6.5px;
  transform: translateX(-50%);
  width: 275px;
  max-width: 300px;
  background-color: rgba(57, 54, 54, 0.92);
  color: rgb(255, 255, 255) !important;
  font-size: 0.6875rem !important;
  font-weight: 500;
  line-height: 16px;
  padding: 4px 8px;
  border-radius: 4px;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease;
  z-index: 9999;
  pointer-events: none;
  box-sizing: border-box;
  overflow-wrap: break-word;
  text-wrap: auto;
  text-align: left !important;
}
.MVT-85-Var_C
  #booking-widget
  #booking-widget-desktop-form
  .mvt-85-discount-wrapper
  .mvt-85-tooltip-text::before {
  content: "";
  position: absolute;
  top: -5px;
  left: 50%;
  transform: translateX(-50%);
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 6px solid #4b4545;
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
  var TEST_ID = "MVT-85";
  const VAR_ID = "Var_C";

  const TARGET_PATHS = [
    "/en/home",
    "/en/reservation/make-reservation",
    "/en/reservation/vehicle-availability",
    "/en/reservation/protectioncoverage",
    "/en/reservation/addons",
  ];

  if (!window._mvt85Patched) {
    window._mvt85Patched = true;

    const originalInsertBefore = Node.prototype.insertBefore;
    Node.prototype.insertBefore = function (newNode, referenceNode) {
      if (referenceNode && referenceNode.parentNode !== this) {
        let ancestor = referenceNode;
        while (ancestor && ancestor.parentNode !== this) {
          ancestor = ancestor.parentNode;
          if (ancestor === document.body || !ancestor) break;
        }
        if (ancestor && ancestor.parentNode === this) {
          return originalInsertBefore.call(this, newNode, ancestor);
        }
        return this.appendChild(newNode);
      }
      return originalInsertBefore.call(this, newNode, referenceNode);
    };

    const originalRemoveChild = Node.prototype.removeChild;
    Node.prototype.removeChild = function (child) {
      if (child && child.parentNode !== this) {
        if (child.parentNode) child.parentNode.removeChild(child);
        return child;
      }
      return originalRemoveChild.call(this, child);
    };

    const originalReplaceChild = Node.prototype.replaceChild;
    Node.prototype.replaceChild = function (newChild, oldChild) {
      if (oldChild && oldChild.parentNode !== this) {
        if (oldChild.parentNode)
          oldChild.parentNode.replaceChild(newChild, oldChild);
        return oldChild;
      }
      return originalReplaceChild.call(this, newChild, oldChild);
    };
  }

  const greenCheckSvg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="none">\
  <path fill-rule="evenodd" clip-rule="evenodd" d="M12.4446 1.34824C11.129 0.469192 9.58225 0 8 0C5.87827 0 3.84344 0.842855 2.34315 2.34315C0.842855 3.84344 0 5.87827 0 8C0 9.58225 0.469192 11.129 1.34824 12.4446C2.22729 13.7602 3.47672 14.7855 4.93853 15.391C6.40034 15.9965 8.00887 16.155 9.56072 15.8463C11.1126 15.5376 12.538 14.7757 13.6569 13.6569C14.7757 12.538 15.5376 11.1126 15.8463 9.56072C16.155 8.00887 15.9965 6.40034 15.391 4.93853C14.7855 3.47672 13.7602 2.22729 12.4446 1.34824ZM3.8934 8.40548L6.40007 11.0676C6.4445 11.1148 6.49826 11.152 6.55795 11.1773C6.61763 11.2025 6.68191 11.2154 6.74671 11.2144C6.86649 11.2146 6.9818 11.1686 7.06873 11.0861C7.08905 11.0672 7.10758 11.0466 7.12407 11.0243L9.5634 8.43511C9.57794 8.42306 9.59171 8.41007 9.6047 8.39637L12.1114 5.73426C12.154 5.68928 12.1873 5.63623 12.2094 5.57834C12.2315 5.52044 12.242 5.45896 12.2402 5.39702C12.2384 5.33508 12.2244 5.27417 12.1989 5.21766C12.1735 5.16115 12.1372 5.11003 12.092 5.06759C12.047 5.02502 11.994 4.99166 11.9361 4.96961C11.8782 4.94757 11.8165 4.93715 11.7546 4.93901C11.6926 4.94087 11.6316 4.9552 11.5752 4.98068C11.5187 5.00616 11.4678 5.04258 11.4254 5.08778L8.94739 7.71896C8.9343 7.73004 8.92182 7.74198 8.91004 7.75444L6.74272 10.0555L4.58004 7.759C4.53794 7.71332 4.48715 7.67639 4.43063 7.6506C4.37411 7.62482 4.31303 7.6108 4.25094 7.60893C4.18885 7.60707 4.12698 7.61751 4.06902 7.63986C4.01105 7.66221 3.95814 7.69575 3.91338 7.73882C3.8677 7.78092 3.83088 7.83171 3.8051 7.88823C3.77932 7.94475 3.76509 8.00583 3.76323 8.06792C3.76137 8.13001 3.77193 8.19192 3.79428 8.24988C3.81663 8.30785 3.85033 8.36072 3.8934 8.40548Z" fill="#46791D"/>\
  </svg>';
  const infoSvg =
    '<svg class="mvt-85-info-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">\
    <path d="M0 6C0.00172054 4.40923 0.634401 2.88409 1.75925 1.75925C2.88409 0.634401 4.40923 0.00172054 6 0C7.59073 0.00185261 9.11578 0.634583 10.2406 1.7594C11.3654 2.88422 11.9981 4.40927 12 6C11.998 7.59069 11.3652 9.11566 10.2404 10.2404C9.11566 11.3652 7.59069 11.998 6 12C4.40923 11.9983 2.88409 11.3656 1.75925 10.2408C0.634401 9.11591 0.00172054 7.59077 0 6ZM0.705994 6C0.707582 7.40357 1.26586 8.7492 2.25833 9.74167C3.2508 10.7341 4.59643 11.2924 6 11.294C7.40348 11.2923 8.74897 10.7339 9.74133 9.74149C10.7337 8.74903 11.2919 7.40348 11.2935 6C11.2919 4.59652 10.7337 3.25097 9.74133 2.25851C8.74897 1.26606 7.40348 0.707714 6 0.705994C4.59643 0.707582 3.2508 1.26586 2.25833 2.25833C1.26586 3.2508 0.707582 4.59643 0.705994 6ZM5.64651 8.54001V4.86551C5.64638 4.77237 5.68311 4.68293 5.74869 4.61679C5.81427 4.55065 5.90335 4.51317 5.99649 4.51251C6.09016 4.51251 6.18 4.54969 6.24628 4.61588C6.31256 4.68206 6.34987 4.77184 6.35001 4.86551V8.54001C6.34987 8.63368 6.31256 8.72346 6.24628 8.78964C6.18 8.85583 6.09016 8.89301 5.99649 8.89301C5.90326 8.89234 5.8141 8.85476 5.7485 8.78851C5.68291 8.72226 5.64625 8.63272 5.64651 8.53949V8.54001ZM5.47 3.27301C5.47072 3.20418 5.48502 3.13615 5.51205 3.07285C5.53909 3.00954 5.57833 2.9522 5.62756 2.90408C5.67679 2.85597 5.73504 2.81803 5.79895 2.79245C5.86286 2.76687 5.93117 2.75415 6 2.755C6.06875 2.75421 6.13699 2.76696 6.20081 2.79254C6.26462 2.81812 6.32278 2.85603 6.37195 2.90408C6.42112 2.95214 6.46033 3.00939 6.48737 3.0726C6.5144 3.13582 6.52873 3.20374 6.52951 3.27249C6.52873 3.34124 6.5144 3.40917 6.48737 3.47238C6.46033 3.5356 6.42112 3.59288 6.37195 3.64093C6.32278 3.68899 6.26462 3.72686 6.20081 3.75244C6.13699 3.77802 6.06875 3.7908 6 3.79001C5.93119 3.79093 5.86289 3.77827 5.79898 3.75275C5.73508 3.72722 5.67683 3.68931 5.62759 3.64124C5.57836 3.59316 5.5391 3.53584 5.51205 3.47256C5.48501 3.40929 5.47072 3.3413 5.47 3.27249V3.27301Z" fill="#736D6D"/>\
  </svg>';

  // Module-level refs so ageOptionsFn can access them
  var _ageDropdownEl = null;
  var _ageCheckboxEl = null;

  // -----------------------------
  // Helpers
  // -----------------------------

  function isTargetPage() {
    var path = window.location.pathname;

    for (var i = 0; i < TARGET_PATHS.length; i++) {
      if (path.indexOf(TARGET_PATHS[i]) !== -1) {
        return true;
      }
    }

    return false;
  }

  function waitForStableElement(selector, callback) {
    let lastEl = null;
    let stableCount = 0;

    const interval = setInterval(() => {
      try {
        const el = document.querySelector(selector);

        if (!el) {
          stableCount = 0;
          lastEl = null;
          return;
        }

        if (el === lastEl) {
          stableCount++;
        } else {
          stableCount = 0;
          lastEl = el;
        }

        // element stable for 5 checks
        if (stableCount >= 5) {
          clearInterval(interval);
          callback(el);
        }
      } catch (err) {
        console.error("[MVT-85] stable check error:", err);
      }
    }, 200);
  }

  function updateAgeUI(targetElement, checkboxEl, selectedAge) {
    if (checkboxEl) checkboxEl.checked = true;

    const selectEl = targetElement.querySelector(
      "#mui-component-select-ageSelect",
    );
    if (selectEl) {
      if (selectedAge === "25+") {
        if (selectEl.textContent !== "I am 25 or older") {
          selectEl.textContent = "I am 25 or older";
        }
      } else {
        const newText = "Driver's Age: " + selectedAge;
        if (selectEl.textContent !== newText) {
          selectEl.textContent = newText;
        }
      }
    }
  }

  function updateResidencyUI(targetElement, checkboxEl) {
    setTimeout(function () {
      const spans = targetElement.querySelectorAll("span");
      const selectedResidency =
        spans.length >= 3 ? spans[2].textContent.trim() : "US";
      const isUS =
        selectedResidency === "US" ||
        selectedResidency === "USA" ||
        selectedResidency === "I am a US resident";

      if (isUS && spans.length >= 3) {
        if (spans[2].textContent !== "I am a US resident") {
          spans[2].textContent = "I am a US resident";
        }
        if (spans[0]) spans[0].style.display = "none";
        if (spans[1]) spans[1].style.display = "none";
      } else if (spans.length >= 3) {
        if (spans[0]) spans[0].style.display = "";
        if (spans[1]) spans[1].style.display = "";
      }

      if (checkboxEl) {
        checkboxEl.checked = true;
      }
    }, 100);
  }

  function updateWizardUI(targetElement, checkboxEl, wrapperEl, topRowEl) {
    const isTargetAvailabel = document.querySelector(
      '[data-testid="wizard-number-popup-trigger-button"]',
    );
    if (!isTargetAvailabel) {
      wrapperEl.remove();
      return;
    }
    const pTag = targetElement.querySelector("p");
    if (!pTag) return;
    const text = pTag.textContent;
    if (text.includes("*")) {
      checkboxEl.checked = true;

      if (!pTag.hasAttribute("data-wizard-click-listener")) {
        pTag.addEventListener("click", function () {
          const removeWizardEl = document.querySelector(
            '[data-testid="recognized-state-logout"]',
          );
          if (removeWizardEl) {
            removeWizardEl.click();
          }
        });
        pTag.setAttribute("data-wizard-click-listener", "");
      }

      if (!wrapperEl.querySelector(".mvt-85-wizard-applied-text")) {
        wrapperEl.style.marginTop = "2px";
        pTag.classList.add("wizard-applied-label");
        var wizardAppliedText =
          '<div class="mvt-85-wizard-applied-text">' +
          "<p>Wizard Number Applied</p>" +
          greenCheckSvg +
          "</div>";
        topRowEl.insertAdjacentHTML("afterend", wizardAppliedText);
      }
    } else {
      checkboxEl.checked = false;
      const wizardAppliedText = wrapperEl.querySelector(
        ".mvt-85-wizard-applied-text",
      );
      if (wizardAppliedText) {
        wizardAppliedText.remove();
        wrapperEl.style.marginTop = "";
      }
    }
  }

  function updateDiscountUI(targetElement, checkboxEl, wrapperEl, topRowEl) {
    try {
      const ptag = targetElement.querySelector("p");
      if (!ptag) return;

      const currentText = ptag.textContent;

      if (currentText === "Discount Applied") {
        checkboxEl.checked = true;
      } else if (currentText === "Add Discount") {
        checkboxEl.checked = false;
      }

      ptag.style.display = "none";
      if (!targetElement.querySelector(".mvt-85-add-discount-text")) {
        ptag.insertAdjacentHTML(
          "afterend",
          '<p class="mvt-85-add-discount-text">Add Discount</p>',
        );
      }

      if (checkboxEl.checked) {
        if (!wrapperEl.querySelector(".mvt-85-discount-applied-text")) {
          wrapperEl.style.marginTop = "2px";
          var discountAppliedText =
            '<div class="mvt-85-discount-applied-text">' +
            "<p>Discount Applied</p>" +
            greenCheckSvg +
            "</div>";
          topRowEl.insertAdjacentHTML("afterend", discountAppliedText);
        }
      } else {
        const discountAppliedText = wrapperEl.querySelector(
          ".mvt-85-discount-applied-text",
        );
        if (discountAppliedText) {
          discountAppliedText.remove();
        }
      }
    } catch (err) {
      console.error("[MVT-85] updateDiscountUI error:", err);
    }
  }

  function applyCode() {
    try {
      // Wait for Age Dropdown
      waitForStableElement(
        '[data-testid="drivers-age-dropdown"]',
        function (targetElement) {
          try {
            // Re-check after the stable wait — another call may have injected already
            if (document.querySelector("#ageCheckbox")) return;
            if (!targetElement || !targetElement.parentNode) return;

            const selectEl = targetElement.querySelector(
              "#mui-component-select-ageSelect",
            );

            if (!selectEl) {
              return;
            }
            const ageWrapperEl = document.createElement("div");
            ageWrapperEl.className = "mvt-85-age-wrapper";

            // Top row: checkbox (left) + dropdown (right) side by side
            const topRowEl = document.createElement("div");
            topRowEl.className = "mvt-85-top-row";
            ageWrapperEl.appendChild(topRowEl);

            // Bare checkbox — no label text, no interaction on the text
            topRowEl.insertAdjacentHTML(
              "beforeend",
              `<input type="checkbox" id="ageCheckbox" class="mvt-85-checkbox" />`,
            );

            // Move dropdown into the top row (right of checkbox)
            targetElement.parentNode.insertBefore(ageWrapperEl, targetElement);
            topRowEl.appendChild(targetElement);

            const checkboxEl = topRowEl.querySelector(".mvt-85-checkbox");
            _ageDropdownEl = targetElement;
            _ageCheckboxEl = checkboxEl;

            // Set initial state based on React's rendered text
            const currentText = selectEl.textContent.trim();
            let initialSelectedAge = "25+";
            if (
              currentText !== "I am 25 or older" &&
              !currentText.includes("25+")
            ) {
              initialSelectedAge = currentText
                .replace("Driver's Age:", "")
                .trim();
            }
            updateAgeUI(targetElement, checkboxEl, initialSelectedAge);

            // Checkbox opens the MUI dropdown (using click + preventDefault to stop native toggle)
            checkboxEl.addEventListener("click", function (e) {
              e.preventDefault();
              selectEl.dispatchEvent(
                new MouseEvent("mousedown", {
                  bubbles: true,
                  cancelable: true,
                  view: window,
                }),
              );
              selectEl.dispatchEvent(
                new MouseEvent("click", {
                  bubbles: true,
                  cancelable: true,
                  view: window,
                }),
              );
            });

            // Observe age changes so the checkbox updates if React natively changes the text
            const ageTextObserver = new MutationObserver(function () {
              const newText = selectEl.textContent.trim();
              if (newText === "I am 25 or older") return;

              let newSelectedAge = "25+";
              if (!newText.includes("25+")) {
                newSelectedAge = newText.replace("Driver's Age:", "").trim();
              }
              updateAgeUI(targetElement, checkboxEl, newSelectedAge);
            });
            ageTextObserver.observe(selectEl, {
              childList: true,
              subtree: true,
              characterData: true,
            });

            //add tooltip
            const toolTipUI =
              "<div class='mvt-85-tooltip'>" +
              infoSvg +
              "<span class='mvt-85-tooltip-text'>Drivers aged 21–24 must be declared, a surcharge may apply.</span>" +
              "</div>";
            selectEl.insertAdjacentHTML("afterend", toolTipUI);

            document.body.classList.add(TEST_ID + "-" + VAR_ID);
          } catch (err) {
            console.error("[MVT-85] injection error:", err);
          }
        },
      );

      // Wait for Residency Dropdown
      waitForStableElement(
        '[data-testid="residency-dropdown-button"]',
        function (targetElement) {
          try {
            if (document.querySelector("#residencyCheckbox")) return;
            if (!targetElement || !targetElement.parentNode) return;

            const wrapperEl = document.createElement("div");
            // Reuse age-wrapper styles, plus add a unique class
            wrapperEl.className = "mvt-85-age-wrapper mvt-85-residency-wrapper";

            const topRowEl = document.createElement("div");
            topRowEl.className = "mvt-85-top-row";
            wrapperEl.appendChild(topRowEl);

            // Checked conditionally based on 3rd span text
            const spans = targetElement.querySelectorAll("span");
            const isUS =
              spans.length >= 3 &&
              (spans[2].textContent.trim() === "US" ||
                spans[2].textContent.trim() === "USA" ||
                spans[2].textContent.trim() === "I am a US resident");

            if (isUS) {
              if (
                spans.length >= 3 &&
                spans[2].textContent !== "I am a US resident"
              ) {
                spans[2].textContent = "I am a US resident";
              }
              if (spans[0]) spans[0].style.display = "none";
              if (spans[1]) spans[1].style.display = "none";
            } else {
              if (spans[0]) spans[0].style.display = "";
              if (spans[1]) spans[1].style.display = "";
            }

            const checkedAttr = "checked";

            topRowEl.insertAdjacentHTML(
              "beforeend",
              '<input type="checkbox" id="residencyCheckbox" class="mvt-85-checkbox" ' +
                checkedAttr +
                " />",
            );

            // Wrap it
            targetElement.parentNode.insertBefore(wrapperEl, targetElement);
            topRowEl.appendChild(targetElement);

            const checkboxEl = topRowEl.querySelector(".mvt-85-checkbox");

            // Open dropdown when clicking checkbox (using click + preventDefault to stop native toggle)
            checkboxEl.addEventListener("click", function (e) {
              e.preventDefault();
              targetElement.dispatchEvent(
                new MouseEvent("mousedown", {
                  bubbles: true,
                  cancelable: true,
                  view: window,
                }),
              );
              targetElement.dispatchEvent(
                new MouseEvent("click", {
                  bubbles: true,
                  cancelable: true,
                  view: window,
                }),
              );
            });

            //add tooltip
            const toolTipUI =
              "<div class='mvt-85-tooltip'>" +
              infoSvg +
              "<span class='mvt-85-tooltip-text'>Affects pricing and rental terms in some regions.</span>" +
              "</div>";
            spans[2].insertAdjacentHTML("afterend", toolTipUI);

            const toolTipEl = document.querySelector(
              '[data-testid="residency-dropdown-button"] .mvt-85-tooltip',
            );
            if (toolTipEl) {
              toolTipEl.addEventListener("click", (e) => {
                e.stopPropagation();
              });
            }

            // Initial UI update and setup observer to watch for React text changes
            updateResidencyUI(targetElement, checkboxEl);
            const residencyTextObserver = new MutationObserver(function () {
              updateResidencyUI(targetElement, checkboxEl);
            });
            residencyTextObserver.observe(targetElement, {
              childList: true,
              subtree: true,
              characterData: true,
            });
          } catch (err) {
            console.error("[MVT-85] residency injection error:", err);
          }
        },
      );

      // wait for wizard number section
      waitForStableElement(
        '[data-testid="wizard-number-popup-trigger-button"]',
        function (targetElement) {
          try {
            if (!targetElement || !targetElement.parentNode) return;
            if (document.querySelector("#wizardCheckbox")) return;

            const wrapperEl = document.createElement("div");
            wrapperEl.className = "mvt-85-wizard-wrapper";

            const topRowEl = document.createElement("div");
            topRowEl.className = "mvt-85-top-row";
            wrapperEl.appendChild(topRowEl);

            //add checkbox
            const checkedAttr = "checked";
            topRowEl.insertAdjacentHTML(
              "beforeend",
              '<input type="checkbox" id="wizardCheckbox" class="mvt-85-checkbox" ' +
                checkedAttr +
                "/>",
            );

            // Wrap it
            targetElement.parentNode.insertBefore(wrapperEl, targetElement);
            topRowEl.appendChild(targetElement);

            const checkboxEl = topRowEl.querySelector(".mvt-85-checkbox");
            // Open dropdown when clicking checkbox (using click + preventDefault to stop native toggle)
            checkboxEl.addEventListener("click", function (e) {
              e.preventDefault();
              if (checkboxEl.hasAttribute("checked")) {
                const removeWizardEl = document.querySelector(
                  '[data-testid="recognized-state-logout"]',
                );
                if (removeWizardEl) {
                  removeWizardEl.click();
                }
              }
              targetElement.dispatchEvent(
                new MouseEvent("mousedown", {
                  bubbles: true,
                  cancelable: true,
                  view: window,
                }),
              );
              targetElement.dispatchEvent(
                new MouseEvent("click", {
                  bubbles: true,
                  cancelable: true,
                  view: window,
                }),
              );
            });

            const spans = targetElement.querySelectorAll("span");
            if (spans) {
              //add tooltip
              const toolTipUI =
                "<div class='mvt-85-tooltip'>" +
                infoSvg +
                "<span class='mvt-85-tooltip-text'>Your Avis Preferred member ID or corporate account number. Skip if you're not enrolled.</span>" +
                "</div>";
              spans[0].insertAdjacentHTML("afterend", toolTipUI);
            }
            const toolTipEl = document.querySelector(
              '[data-testid="wizard-number-popup-trigger-button"] .mvt-85-tooltip',
            );
            if (toolTipEl) {
              toolTipEl.addEventListener("click", (e) => {
                e.stopPropagation();
              });
            }

            updateWizardUI(targetElement, checkboxEl, wrapperEl, topRowEl);

            const wizardObserver = new MutationObserver(function () {
              updateWizardUI(targetElement, checkboxEl, wrapperEl, topRowEl);
            });
            wizardObserver.observe(targetElement.closest(".MuiBox-root"), {
              childList: true,
              subtree: true,
              characterData: true,
            });
          } catch (err) {
            console.error(
              "[MVT-85] wizard number section injection error:",
              err,
            );
          }
        },
      );

      // wait for discount section
      waitForStableElement(
        '[data-testid="discount-coupon-popup-trigger-button"]',
        function (targetElement) {
          try {
            if (!targetElement || !targetElement.parentNode) return;
            if (document.querySelector("#discountCheckbox")) return;

            const wrapperEl = document.createElement("div");
            wrapperEl.className = "mvt-85-discount-wrapper";

            const topRowEl = document.createElement("div");
            topRowEl.className = "mvt-85-top-row";
            wrapperEl.appendChild(topRowEl);

            topRowEl.insertAdjacentHTML(
              "beforeend",
              `<input type="checkbox" id="discountCheckbox" class="mvt-85-checkbox"/>`,
            );

            // Wrap it
            targetElement.parentNode.insertBefore(wrapperEl, targetElement);
            topRowEl.appendChild(targetElement);

            const checkboxEl = topRowEl.querySelector(".mvt-85-checkbox");
            // Open dropdown when clicking checkbox (using click + preventDefault to stop native toggle)
            checkboxEl.addEventListener("click", function (e) {
              e.preventDefault();
              targetElement.dispatchEvent(
                new MouseEvent("mousedown", {
                  bubbles: true,
                  cancelable: true,
                  view: window,
                }),
              );
              targetElement.dispatchEvent(
                new MouseEvent("click", {
                  bubbles: true,
                  cancelable: true,
                  view: window,
                }),
              );
            });

            const spans = targetElement.querySelectorAll("span");
            if (spans) {
              //add tooltip
              const toolTipUI =
                "<div class='mvt-85-tooltip'>" +
                infoSvg +
                "<span class='mvt-85-tooltip-text'>Have an AWD code, coupon, or corporate rate code? Add it here.</span>" +
                "</div>";
              spans[0].insertAdjacentHTML("afterend", toolTipUI);
            }

            const toolTipEl = document.querySelector(
              '[data-testid="discount-coupon-popup-trigger-button"] .mvt-85-tooltip',
            );
            if (toolTipEl) {
              toolTipEl.addEventListener("click", (e) => {
                e.stopPropagation();
              });
            }

            updateDiscountUI(targetElement, checkboxEl, wrapperEl, topRowEl);

            const discountObserver = new MutationObserver(function () {
              updateDiscountUI(targetElement, checkboxEl, wrapperEl, topRowEl);
            });
            discountObserver.observe(targetElement, {
              childList: true,
              subtree: true,
              characterData: true,
            });
          } catch (err) {
            console.error("[MVT-85] discount section injection error:", err);
          }
        },
      );
    } catch (err) {
      console.error("[MVT-85] applyCode error:", err);
    }
  }

  // -----------------------------
  // Route Change
  // -----------------------------

  function onRouteChange() {
    if (!isTargetPage()) return;
    setTimeout(() => {
      applyCode();
    }, 800);
  }

  // -----------------------------
  // History Patch
  // -----------------------------

  function patchHistoryMethod(method) {
    var original = history[method];
    history[method] = function () {
      var result = original.apply(this, arguments);
      window.dispatchEvent(new Event("avis:routechange"));
      return result;
    };
  }

  patchHistoryMethod("pushState");
  patchHistoryMethod("replaceState");

  // -----------------------------
  // Event Listeners
  // -----------------------------

  window.addEventListener("avis:routechange", onRouteChange);

  window.addEventListener("popstate", onRouteChange);

  // -----------------------------
  // Age Options Menu
  // -----------------------------

  function ageOptionsFn() {
    const ageMenuEl = document.querySelector(
      '[data-testid="drivers-age-menu"]',
    );
    if (!ageMenuEl) return;

    if (!ageMenuEl.querySelector(".mvt-85-menu-title")) {
      ageMenuEl.insertAdjacentHTML(
        "afterbegin",
        `<p class="mvt-85-menu-title" style="font-weight: 700; color: #000; font-size: 12px; margin: 8px 16px 4px 16px; margin: 0px; margin-bottom: 8px;">Driver's Age</p>`,
      );
    }

    const options = ageMenuEl.querySelectorAll("li");
    options.forEach((option) => {
      // Use mousedown — MUI closes & removes the menu before 'click' fires
      option.addEventListener("mousedown", () => {
        const optionValue = option.getAttribute("data-value");
        if (_ageDropdownEl && _ageCheckboxEl) {
          updateAgeUI(_ageDropdownEl, _ageCheckboxEl, optionValue);
        }
      });
    });
  }

  // -----------------------------
  // Residency Options Menu
  // -----------------------------

  function residencyOptionsFn() {
    const residencyMenuEl = document.querySelector(
      '[data-testid="residency-dropdown-menu-container"]',
    );
    if (!residencyMenuEl) return;

    if (!residencyMenuEl.querySelector(".mvt-85-menu-title")) {
      residencyMenuEl.insertAdjacentHTML(
        "afterbegin",
        `<p class="mvt-85-menu-title" style="font-weight: 700; color: #000; font-size: 12px; margin: 8px 16px 4px 9px;">Residency:</p>`,
      );
    }
  }

  // -----------------------------
  // Mutation Observer
  // -----------------------------

  function startObserver() {
    var _ageMenuHandled = false;
    var _residencyMenuHandled = false;

    const observer = new MutationObserver(function () {
      if (!isTargetPage()) return;

      const wrapperExists = document.querySelector("#ageCheckbox");
      const targetExists = document.querySelector(
        '[data-testid="drivers-age-dropdown"]',
      );
      const residencyWrapperExists =
        document.querySelector("#residencyCheckbox");
      const residencyTargetExists = document.querySelector(
        '[data-testid="residency-dropdown-button"]',
      );
      const wizardWrapperExists = document.querySelector("#wizardCheckbox");
      const wizardTargetExists = document.querySelector(
        '[data-testid="wizard-number-popup-trigger-button"]',
      );
      const discountWrapperExists = document.querySelector("#discountCheckbox");
      const discountTargetExists = document.querySelector(
        '[data-testid="discount-coupon-popup-trigger-button"]',
      );

      // React rerender removed experiment
      if (
        (targetExists && !wrapperExists) ||
        (residencyTargetExists && !residencyWrapperExists) ||
        (wizardTargetExists && !wizardWrapperExists) ||
        (discountTargetExists && !discountWrapperExists)
      ) {
        console.log("[MVT-85] wrapper removed by rerender, reinjecting");
        applyCode();
      }

      // Age options menu observer
      const ageMenuExists = document.querySelector(
        '[data-testid="drivers-age-menu"]',
      );
      if (ageMenuExists && !_ageMenuHandled) {
        _ageMenuHandled = true;
        ageOptionsFn();
      } else if (!ageMenuExists) {
        _ageMenuHandled = false;
      }

      // Residency options menu observer
      const residencyMenuExists = document.querySelector(
        '[data-testid="residency-dropdown-menu-container"]',
      );
      if (residencyMenuExists && !_residencyMenuHandled) {
        _residencyMenuHandled = true;
        residencyOptionsFn();
      } else if (!residencyMenuExists) {
        _residencyMenuHandled = false;
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  // -----------------------------
  // Init
  // -----------------------------

  function init() {
    if (!document.body) {
      setTimeout(init, 100);
      return;
    }
    startObserver();
    onRouteChange();
  }
  init();
})();
