(() => {
  
  function mainJs() {
    var targetBtns = document.querySelectorAll('[data-testid="single-protections-item-add-to-trip-btn"]');
    targetBtns.forEach(btn => {
      btn.classList.add('custom-btn-style'); 
      var isChecked = btn.querySelector("span:last-child div");
      if (isChecked && isChecked.querySelector('svg')) {
        isChecked.classList.add('checked');
      } else {
        isChecked.classList.add('checkField')
      }
    })
  }

  function observReact() {
    var observer = new MutationObserver(() => {
      mainJs();
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
  }

  function init() {
    mainJs();
    observReact();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
