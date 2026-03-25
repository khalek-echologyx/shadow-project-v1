(function pollForHansenPage() {
    if (
      document.querySelectorAll("#ViewBtn.small-button").length > 0 &&
      window.jQuery !== undefined
    ) {
      try {
        function waitForElem(
          waitFor,
          callback,
          minElements = 1,
          isVariable = false,
          timer = 10000,
          frequency = 25,
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
                    timer - frequency,
                  ),
                frequency,
              );
        }
        if (!document.querySelector("body").classList.contains("EAOA-2676")) {
          document
            .querySelector("body")
            .insertAdjacentHTML(
              "afterbegin",
              `<div class="loading-mask" data-role="loader" style=""><div class="loader"><img alt="Loading..." src="https://www.tescomobile.com/static/version1773296291/frontend/TescoMobile/default/en_GB/images/loader-2.gif"><p>Please wait...</p></div></div>`,
            );

          const $ = window.jQuery;

          $("#myBillsAndPaymentsTable").on(
            "click",
            ".downldCallDataBtn",
            function (event) {
              event.preventDefault();
              event.stopImmediatePropagation(); // stop original site handler

              var parent = $(this).closest("tr");

              var invoiceID = parent.find(".invoiceIDHiddenField").val();
              var selectedBillType = parent.find(".billFormatDropDown").val();
              var selfCareShowInvoiceForm = parent.find(
                "#selfCareShowInvoiceFormId",
              );

              // populate hidden fields
              selfCareShowInvoiceForm
                .find("#selectedBillType")
                .val(selectedBillType);
              selfCareShowInvoiceForm.find("#invoiceType").val("billed");
              selfCareShowInvoiceForm.find("#selectedInvoiceId").val(invoiceID);
              selfCareShowInvoiceForm.find("#selectedBillFormat").val("CSV");

              // build download URL
              var params = selfCareShowInvoiceForm
                .find("input:not([name$='TOKEN'])")
                .serialize();

              var url = selfCareShowInvoiceForm.prop("action") + "?" + params;

              // create hidden iframe if not exists
              var iframe = document.getElementById("hiddenDownloadFrame");

              if (!iframe) {
                iframe = document.createElement("iframe");
                iframe.style.display = "none";
                iframe.id = "hiddenDownloadFrame";
                document.body.appendChild(iframe);
              }

              // trigger download
              iframe.src = url;

              // go back after download starts
              setTimeout(function () {
                window.history.back();
              }, 2000);
            },
          );

          function deleteBtnFlagCookie() {
            document.cookie =
              "btnFlag=;expires=Thu, 01 Jan 1970 00:00:00 GMT;domain=.tescomobile.com;path=/";
          }

          function getCookie(name) {
            var value = "; " + document.cookie;
            var parts = value.split("; " + name + "=");
            if (parts.length === 2) return parts.pop().split(";").shift();
            return null;
          }

          // Usage example:
          var btnFlag = getCookie("btnFlag");
          if (btnFlag === "download") {
            document.querySelectorAll(".downldCallDataBtn")[0].click();
            deleteBtnFlagCookie();
          } else if (btnFlag === "itemised") {
            const dropdown = document.querySelector(".billFormatDropDown");
            if (dropdown) {
              dropdown.value = "Itemised";
              dropdown.dispatchEvent(new Event("change", { bubbles: true }));
            }
            deleteBtnFlagCookie();
            document.querySelectorAll("#ViewBtn.small-button")[0].click();
            window.history.back();
          }
        }
      } catch (error) {
        console.log("Initialization error:", error);
      }
    } else {
      setTimeout(pollForHansenPage, 25);
    }
  })();