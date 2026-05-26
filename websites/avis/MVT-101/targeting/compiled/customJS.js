//either return true or call active function with true parameter to make the test active.
//By default  this function will wait for the return value or the callback for 1 Hour. So, depending on your tool support please manually call the a callback function with a false value using setTimeout function.
function activator(active) {
  // document.body.addEventListener('click', (e) => {
  //   active(true);
  // });
  return true;
}

export { activator as default };
