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
    }, 10);
  });
}

const runApp = async () => {
  const mainHost = await waitForElement(document, ".cib-serp-main");
  const mainRoot = mainHost.shadowRoot;
  const secondHost = await waitForElement(mainRoot, "#cib-action-bar-main");
  const secondRoot = secondHost.shadowRoot;
  const searchInput = await waitForElement(secondRoot, "#searchbox");
  searchInput.removeAttribute("maxlength");
  const letterCounter = await waitForElement(secondRoot, ".letter-counter");
  letterCounter.innerHTML = "Unlimited characters by riad-azz";
  console.log("Character limit was removed.");
};

runApp();
