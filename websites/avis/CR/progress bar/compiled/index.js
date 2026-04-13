(function() {
  function applyStepperChanges() {
    console.log('applyStepperChanges');
    const stepper = document.querySelector('.MuiStepper-root.MuiStepper-horizontal');
    if (!stepper) return false;

    const children = Array.from(stepper.children);
    if (children.length < 9) return false;

    // Hide connector + "Add protections" + connector + "Select add-ons"
    [3, 4, 5, 6].forEach(function(i) {
      children[i].style.display = 'none';
    });

    // Update "Review & Checkout" circle number from 5 to 3
    const reviewStep = document.querySelector('[data-testid="stepper-step-4"]');
    const circleText = reviewStep ? reviewStep.querySelector('.MuiStepIcon-text') : null;
    const activeCircle = document.querySelector('[data-testid="stepper-step-label-4"] .Mui-active div');
    if (activeCircle) {
      activeCircle.textContent = '3';
    }
    if (circleText) {
      circleText.textContent = '3';
    }

    return true;
  }

  // Poll until the stepper renders
  var interval = setInterval(function() {
    if (applyStepperChanges()) {
      clearInterval(interval);
    }
  }, 100);

  // Stop polling after 5 seconds to avoid running indefinitely
  setTimeout(function() { clearInterval(interval); }, 5000);
})();
