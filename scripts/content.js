const DEBUG = false;

async function waitForElement(parent, selector) {
  return new Promise((resolve, reject) => {
    const interval = setInterval(function () {
      const element = parent.querySelector(selector);

      if (element) {
        if (DEBUG) {
          console.log(element);
        }
        clearInterval(interval);
        resolve(element);
      }
    }, 500);
  });
}

const resetInputMaxLength = async () => {
  const mainHost = await waitForElement(document, ".cib-serp-main");
  const mainRoot = mainHost.shadowRoot;
  const actionHost = await waitForElement(mainRoot, "#cib-action-bar-main");
  const actionRoot = actionHost.shadowRoot;
  const inputHost = await waitForElement(actionRoot, "cib-text-input");
  const inputRoot = inputHost.shadowRoot;
  const searchInput = await waitForElement(inputRoot, "#searchbox");

  searchInput.removeAttribute("maxlength");

  const letterCounter = await waitForElement(actionRoot, ".letter-counter");
  letterCounter.innerHTML = "Character limit removed by riad-azz";

  return searchInput;
};




const removeLimitation = async () => {
  const searchInput = await resetInputMaxLength();
  console.log("Character limit was removed.");


  const config = { attributes: true, childList: false, subtree: false };

  const callback = function (mutationsList, observer) {
    for (const mutation of mutationsList) {
      if (mutation.type === 'attributes') {
        searchInput.removeAttribute("maxlength");
        console.log('Attribute ' + mutation.attributeName + ' changed to: ' + searchInput.getAttribute(mutation.attributeName));
      }
    }

  };

  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(searchInput, config);

  function watchElementRemoved() {

    const interval = setInterval(function () {
      if (!searchInput.isConnected) {
        removeLimitation();
        observer.disconnect();
        clearInterval(interval);
        resolve(true);
      }
    }, 3000);
  }

  watchElementRemoved();
};

removeLimitation();