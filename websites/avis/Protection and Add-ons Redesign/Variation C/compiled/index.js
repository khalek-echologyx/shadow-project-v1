var id = "1770390114398_3115_Variation_C";
var name = "Variation C";
var testInfo = {
	id: id,
	name: name};

(() => {
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

  (function () {
    const originalFetch = window.fetch;

    window.fetch = async function (...args) {
      const response = await originalFetch.apply(this, args);

      try {
        const url = args[0];

        if (
          typeof url === "string" &&
          url.includes("/web/reservation/price/calculate")
        ) {
          response
            .clone()
            .json()
            .then((data) => {
              console.log("Price calculate API response:", data);
            });
        }
      } catch (e) {
        console.error("Interceptor error:", e);
      }

      return response;
    };
  })();

  function mainJs([body]) {
    console.table({ ID: testInfo.id, Variation: testInfo.name });

    console.log(
      "%cname: v-01",
      "background: black;border: 2px solid green;color: white;display: block;text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3);text-align: center;font-weight: bold;padding : 10px;margin : 10px"
    );
    console.log("name: v-01");
  }

  waitForElem("body", mainJs);
})();
