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

const removeLimitation = async () => {
  const mainHost = await waitForElement(document, ".cib-serp-main");
  const mainRoot = mainHost.shadowRoot;
  const actionHost = await waitForElement(mainRoot, "#cib-action-bar-main");
  const actionRoot = actionHost.shadowRoot;
  const inputHost = await waitForElement(actionRoot, "cib-text-input");
  const inputRoot = inputHost.shadowRoot;
  const searchInput = await waitForElement(inputRoot, "#searchbox");
  searchInput.removeAttribute("maxlength");
  const letterCounter = await waitForElement(actionRoot, ".letter-counter");
  letterCounter.innerHTML = "Unlimited characters by riad-azz";
  console.log("Character limit was removed.");

  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (!searchInput.isConnected) {
        removeLimitation();
        observer.disconnect();
      }
    }
  });

  observer.observe(actionRoot, { childList: true });
};

removeLimitation();
