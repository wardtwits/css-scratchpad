const STYLE_ID = 'team-css-injector-style';

const cssInput = document.getElementById('cssInput');
const applyBtn = document.getElementById('applyBtn');
const removeBtn = document.getElementById('removeBtn');
const statusEl = document.getElementById('status');
const clearBtn = document.getElementById('clearBtn');

function setStatus(message) {
  statusEl.textContent = message;
}

async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  if (!tab?.id) {
    throw new Error('No active tab found.');
  }

  return tab;
}

async function injectCss(cssText) {
  const tab = await getCurrentTab();

  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    args: [STYLE_ID, cssText],
    func: (styleId, css) => {
      document.getElementById(styleId)?.remove();

      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = css;

      document.head.appendChild(style);
    }
  });
}


async function removeCss() {
  const tab = await getCurrentTab();

  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    args: [STYLE_ID],
    func: (styleId) => {
      document.getElementById(styleId)?.remove();
    }
  });
}

async function loadSavedCss() {
  const result = await chrome.storage.local.get(['savedCss']);

  cssInput.value =
    result.savedCss ||
    `/* Example:
body {
  outline: 4px solid red !important;
}
*/`;
}

clearBtn.addEventListener('click', async () => {
  try {
    cssInput.value = '';

    await chrome.storage.local.remove(['savedCss']);

    await removeCss();

    setStatus('CSS cleared and removed from current page.');
  } catch (error) {
    console.error(error);
    setStatus(`Error: ${error.message}`);
  }
});

applyBtn.addEventListener('click', async () => {
  try {
    const cssText = cssInput.value;

    await chrome.storage.local.set({
      savedCss: cssText
    });

    await injectCss(cssText);

    setStatus('CSS applied.');
  } catch (error) {
    console.error(error);
    setStatus(`Error: ${error.message}`);
  }
});

removeBtn.addEventListener('click', async () => {
  try {
    await removeCss();
    setStatus('CSS removed from current page.');
  } catch (error) {
    console.error(error);
    setStatus(`Error: ${error.message}`);
  }
});

loadSavedCss();