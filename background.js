chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id || !tab.url || !/^https?:\/\//i.test(tab.url)) {
    console.warn("CSS Scratchpad only works on normal http/https pages.");
    return;
  }

  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: injectCssScratchpadPanel,
    });
  } catch (error) {
    console.error("Failed to open CSS Scratchpad:", error);
  }
});

function injectCssScratchpadPanel() {
  const HOST_ID = "css-scratchpad-host";
  const APPLIED_STYLE_ID = "css-scratchpad-applied-style";
  const PICKER_OVERLAY_ID = "css-scratchpad-picker-overlay";
  const SELECTED_ATTR = "data-css-scratchpad-selected";
  const LIVE_STYLE_BACKUP_ATTR = "data-css-scratchpad-live-backup-id";


  const liveBackupId = `css-scratchpad-live-${Date.now()}`;
  const originalInlineStyles = new Map();

  const existing = document.getElementById(HOST_ID);

  if (existing) {
    existing.remove();
    document.getElementById(PICKER_OVERLAY_ID)?.remove();
    return;
  }

  const host = document.createElement("div");
  host.id = HOST_ID;
  document.documentElement.appendChild(host);

  const shadow = host.attachShadow({ mode: "open" });
  const iconUrl = chrome.runtime.getURL("icons/action48.png");

  shadow.innerHTML = `
    <style>
      :host {
        all: initial;
        position: fixed !important;
        top: 24px !important;
        right: 24px !important;
        z-index: 2147483647 !important;
        font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
      }

      *,
      *::before,
      *::after {
        box-sizing: border-box !important;
      }
      .title {
      display: flex !important;
      align-items: center !important;
      gap: 8px !important;
      font-weight: 800 !important;
      font-size: 14px !important;
      color: #ffffff !important;
    }

    .title-icon {
      width: 32px !important;
      height: 32px !important;
      display: block !important;
      flex: 0 0 auto !important;
      border-radius: 6px !important;
    }

    .live-mode-label {
      color: #19d3d3 !important;
      background: #000000 !important;
      border-radius: 999px !important;
      padding: 2px 7px !important;
      font-size: 11px !important;
      font-weight: 900 !important;
      line-height: 1.3 !important;
    }

    .panel {
      width: min(440px, calc(100vw - 32px)) !important;
      background: #050914 !important;
      color: #ffffff !important;
      border: 1px solid rgba(25, 211, 211, 0.45) !important;
      border-radius: 18px !important;
      box-shadow: 0 18px 50px rgba(139,70,255, 0.45) !important;
      overflow: hidden !important;
    }

      .panel.is-collapsed .body {
        display: none !important;
      }

      .header {
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        gap: 12px !important;
        padding: 12px 14px !important;
        background: #8b46ff !important;
        color: #ffffff !important;
        cursor: move !important;
        user-select: none !important;
      }

      .title {
        font-weight: 800 !important;
        font-size: 14px !important;
        letter-spacing: 0.01em !important;
        color: #ffffff !important;
      }

      .header-actions {
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
      }

      .expand-btn {
        display: none !important;
        align-items: center !important;
        gap: 4px !important;
        border: 0 !important;
        background: transparent !important;
        color: #ffffff !important;
        font-size: 12px !important;
        font-weight: 800 !important;
        cursor: pointer !important;
        padding: 4px 6px !important;
        font-family: inherit !important;
      }

      .panel.is-collapsed .expand-btn {
        display: inline-flex !important;
      }

      .close-btn {
        width: 26px !important;
        height: 26px !important;
        border-radius: 999px !important;
        border: 0 !important;
        display: inline-grid !important;
        place-items: center !important;
        background: #19d3d3 !important;
        color: #000000 !important;
        font-size: 18px !important;
        font-weight: 900 !important;
        line-height: 1 !important;
        cursor: pointer !important;
        //box-shadow: 0 4px 16px rgba(251, 70, 85, 0.42) !important;
        font-family: inherit !important;
      }

      .body {
        padding: 14px !important;
      }

      textarea {
        display: block !important;
        width: 100% !important;
        min-height: 260px !important;
        resize: vertical !important;
        border: 1px solid #19d3d3 !important;
        border-radius: 12px !important;
        padding: 12px !important;
        font: 12px/1.45 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace !important;
        color: #19d3d3 !important;
        background: #0a192e !important;
        outline: 1px solid #63e6e6 !important;
        box-shadow: none !important;
      }

      textarea:focus {
        border-color: #19d3d3 !important;
        //box-shadow: 0 0 0 3px rgba(251, 70, 85, 0.16) !important;
      }

      .buttons {
        display: grid !important;
        grid-template-columns: 1fr 1fr 1fr !important;
        gap: 8px !important;
        margin-top: 10px !important;
      }

      button {
        font-family: inherit !important;
      }

      .buttons button,
      .inspect-btn,
      .collapse-btn {
        border-radius: 999px !important;
        padding: 9px 10px !important;
        font-weight: 800 !important;
        font-size: 12px !important;
        cursor: pointer !important;
        line-height: 1.2 !important;
      }

      .apply-btn {
        border: 0 !important;
        background: #8b46ff !important;
        color: #ffffff !important;
      }

      .unapply-btn {
        border: 0 !important;
        background: #95e1d8 !important;
        color: #000000 !important;
      }

      .clear-btn,
      .inspect-btn {
        background: #ffffff !important;
        color: #0a192e !important;
        border: 1px solid rgba(10, 25, 46, 0.16) !important;
      }

      .inspect-btn {
        width: 100% !important;
        margin-top: 8px !important;
        background: #b678ff !important;
      }

      .collapse-btn {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 6px !important;
        margin: 12px auto 0 !important;
        background: transparent !important;
        color: #a6e3e6 !important;
        border: 0 !important;
      }

      .status {
        min-height: 18px !important;
        margin-top: 8px !important;
        font-size: 12px !important;
        font-weight: 700 !important;
        color: #a6e3e6 !important;
      }

    textarea::placeholder {
      color: rgba(25, 211, 211, 0.55) !important;
    }
        

      @media (max-width: 640px) {
        :host {
          top: 12px !important;
          right: 12px !important;
          left: 12px !important;
        }

        .panel {
          width: auto !important;
        }

        textarea {
          min-height: 220px !important;
        }
      }
    </style>

    <section class="panel">
      <div class="header">
      <div class="title">
        <img class="title-icon" src="${iconUrl}" alt="" />
        <span>CSS Scratchpad</span>
        <span class="live-mode-label" hidden>Live Edit Mode</span>
      </div>

        <div class="header-actions">
          <button class="expand-btn" type="button">Expand ˅</button>
          <button class="close-btn" type="button" aria-label="Close CSS Scratchpad">×</button>
        </div>
      </div>

      <div class="body">
        <textarea spellcheck="false" placeholder="Type CSS here..."></textarea>

        <div class="buttons">
          <button class="apply-btn" type="button">Apply</button>
          <button class="unapply-btn" type="button">Unapply</button>
          <button class="clear-btn" type="button">Clear</button>
        </div>

        <button class="inspect-btn" type="button">Pick Element to Edit</button>

        <div class="status"></div>

        <button class="collapse-btn" type="button">˄ Collapse</button>
      </div>
    </section>
  `;

  const panel = shadow.querySelector(".panel");
  const header = shadow.querySelector(".header");
  const textarea = shadow.querySelector("textarea");
  const applyBtn = shadow.querySelector(".apply-btn");
  const unapplyBtn = shadow.querySelector(".unapply-btn");
  const clearBtn = shadow.querySelector(".clear-btn");
  const inspectBtn = shadow.querySelector(".inspect-btn");
  const collapseBtn = shadow.querySelector(".collapse-btn");
  const expandBtn = shadow.querySelector(".expand-btn");
  const closeBtn = shadow.querySelector(".close-btn");
  const status = shadow.querySelector(".status");
  const liveModeLabel = shadow.querySelector(".live-mode-label");

  textarea.value = localStorage.getItem("cssScratchpadFloatingCss") || "";

  function setStatus(message) {
    status.textContent = message;

    window.clearTimeout(setStatus.timer);
    setStatus.timer = window.setTimeout(() => {
      status.textContent = "";
    }, 2200);
  }

  function applyCssAsInlineStyles(cssText) {
    const parserStyle = document.createElement("style");
    parserStyle.textContent = cssText;
    document.documentElement.appendChild(parserStyle);

    const sheet = parserStyle.sheet;

    if (!sheet) {
      parserStyle.remove();
      setStatus("Could not parse CSS.");
      return false;
    }

    try {
      for (const rule of sheet.cssRules) {
        if (!(rule instanceof CSSStyleRule)) continue;

        const selector = rule.selectorText;
        let elements = [];

        try {
          elements = [...document.querySelectorAll(selector)];
        } catch {
          continue;
        }

        elements.forEach((el) => {
          if (!(el instanceof HTMLElement)) return;
          if (host.contains(el)) return;

          if (!originalInlineStyles.has(el)) {
            originalInlineStyles.set(el, el.getAttribute("style") || "");
            el.setAttribute(LIVE_STYLE_BACKUP_ATTR, liveBackupId);
          }

          for (let i = 0; i < rule.style.length; i += 1) {
            const prop = rule.style[i];
            const value = rule.style.getPropertyValue(prop);
            const priority = rule.style.getPropertyPriority(prop);

            el.style.setProperty(prop, value, priority);
          }
        });
      }

      return true;
    } catch (error) {
      console.error("CSS Scratchpad live edit failed:", error);
      setStatus("Live edit failed. Check the CSS syntax.");
      return false;
    } finally {
      parserStyle.remove();
    }
  }

  function applyCss() {
    const css = textarea.value;
    localStorage.setItem("cssScratchpadFloatingCss", css);

    const isLiveEditCss = css.includes(SELECTED_ATTR);

    if (isLiveEditCss) {
      const applied = applyCssAsInlineStyles(css);

      if (applied) {
        setStatus("Live styles applied to selected element.");
      }

      return;
    }

    let style = document.getElementById(APPLIED_STYLE_ID);

    if (!style) {
      style = document.createElement("style");
      style.id = APPLIED_STYLE_ID;
      document.documentElement.appendChild(style);
    }

    style.textContent = css;
    setStatus("CSS applied.");
  }

  function unapplyCss() {
    document.getElementById(APPLIED_STYLE_ID)?.remove();

    originalInlineStyles.forEach((originalStyle, el) => {
      if (!document.documentElement.contains(el)) return;

      if (originalStyle) {
        el.setAttribute("style", originalStyle);
      } else {
        el.removeAttribute("style");
      }

      el.removeAttribute(LIVE_STYLE_BACKUP_ATTR);
    });

    originalInlineStyles.clear();

    setStatus("CSS unapplied.");
  }

  function clearCss() {
    textarea.value = "";
    localStorage.removeItem("cssScratchpadFloatingCss");
    unapplyCss();

    document.querySelectorAll(`[${SELECTED_ATTR}]`).forEach((el) => {
      el.removeAttribute(SELECTED_ATTR);
    });

    liveModeLabel.hidden = true;

    setStatus("Scratchpad cleared.");
  }

  function closePanel() {
    document.getElementById(PICKER_OVERLAY_ID)?.remove();
    host.remove();
  }

  function collapsePanel() {
    panel.classList.add("is-collapsed");
  }

  function expandPanel() {
    panel.classList.remove("is-collapsed");
  }

  function selectorFor(el) {
    if (!(el instanceof Element)) return "";

    const tag = el.tagName.toLowerCase();

    if (el.id) {
      return `${tag}#${CSS.escape(el.id)}`;
    }

    const classes = [...el.classList]
      .filter(Boolean)
      .slice(0, 4)
      .map((className) => `.${CSS.escape(className)}`)
      .join("");

    return `${tag}${classes}`;
  }

  function extractUsefulStyles(el) {
    const computed = window.getComputedStyle(el);

    const props = [
      "display",
      "position",
      "z-index",
      "box-sizing",
      "width",
      "height",
      "min-width",
      "min-height",
      "max-width",
      "max-height",
      "margin",
      "padding",
      "border",
      "border-radius",
      "overflow",
      "background-color",
      "color",
      "font-family",
      "font-size",
      "font-weight",
      "line-height",
      "text-align",
      "letter-spacing",
      "white-space",
      "flex",
      "flex-direction",
      "flex-wrap",
      "align-items",
      "justify-content",
      "gap",
      "grid-template-columns",
      "grid-template-rows",
      "grid-column",
      "grid-row",
      "transform",
      "opacity",
      "box-shadow",
      "transition"
    ];

    return props
      .map((prop) => {
        const value = computed.getPropertyValue(prop);
        return value ? `  ${prop}: ${value};` : "";
      })
      .filter(Boolean);
  }

function buildCssForElement(root) {
  const selectedId = `css-scratchpad-${Date.now()}`;

  document.querySelectorAll(`[${SELECTED_ATTR}]`).forEach((el) => {
    el.removeAttribute(SELECTED_ATTR);
  });

  root.setAttribute(SELECTED_ATTR, selectedId);

  const selector = `[${SELECTED_ATTR}="${selectedId}"]`;
  const lines = extractUsefulStyles(root);

  return [
    `${selector} {`,
    ...lines,
    "}"
  ].join("\n");
}

  function startInspectMode() {
    setStatus("Click an element to live-edit.");

    document.getElementById(PICKER_OVERLAY_ID)?.remove();

    const pickerOverlay = document.createElement("div");
    pickerOverlay.id = PICKER_OVERLAY_ID;
    pickerOverlay.style.cssText = `
      position: fixed !important;
      pointer-events: none !important;
      z-index: 2147483646 !important;
      border: 2px solid #fb4655 !important;
      background: rgba(251, 70, 85, 0.12) !important;
      box-shadow: 0 0 0 99999px rgba(10, 25, 46, 0.12) !important;
      border-radius: 6px !important;
      display: none !important;
    `;

    document.documentElement.appendChild(pickerOverlay);
    pickerOverlay.style.display = "block";

    function moveOverlayTo(el) {
      const rect = el.getBoundingClientRect();

      pickerOverlay.style.left = `${rect.left}px`;
      pickerOverlay.style.top = `${rect.top}px`;
      pickerOverlay.style.width = `${rect.width}px`;
      pickerOverlay.style.height = `${rect.height}px`;
    }

    function cleanup() {
      document.removeEventListener("mouseover", onMouseOver, true);
      document.removeEventListener("mousemove", onMouseMove, true);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("keydown", onKeyDown, true);
      pickerOverlay.remove();
    }

    function shouldIgnoreTarget(target) {
      return (
        !(target instanceof Element) ||
        target === pickerOverlay ||
        target.id === PICKER_OVERLAY_ID ||
        target === host ||
        host.contains(target)
      );
    }

    function updateFromEvent(event) {
      const target = event.target;

      if (shouldIgnoreTarget(target)) return;

      moveOverlayTo(target);
    }

    function onMouseOver(event) {
      updateFromEvent(event);
    }

    function onMouseMove(event) {
      updateFromEvent(event);
    }

    function onClick(event) {
      const target = event.target;

      if (shouldIgnoreTarget(target)) return;

      event.preventDefault();
      event.stopPropagation();

      cleanup();

      const css = buildCssForElement(target);

      textarea.value = css;
      localStorage.setItem("cssScratchpadFloatingCss", css);

      liveModeLabel.hidden = false;

      setStatus("Live Edit Mode: edit CSS and click Apply.");
    }

    function onKeyDown(event) {
      if (event.key === "Escape") {
        cleanup();
        setStatus("Inspect cancelled.");
      }
    }

    document.addEventListener("mouseover", onMouseOver, true);
    document.addEventListener("mousemove", onMouseMove, true);
    document.addEventListener("click", onClick, true);
    document.addEventListener("keydown", onKeyDown, true);
  }

  applyBtn.addEventListener("click", applyCss);
  unapplyBtn.addEventListener("click", unapplyCss);
  clearBtn.addEventListener("click", clearCss);
  inspectBtn.addEventListener("click", startInspectMode);
  collapseBtn.addEventListener("click", collapsePanel);
  expandBtn.addEventListener("click", expandPanel);
  closeBtn.addEventListener("click", closePanel);

  textarea.addEventListener("input", () => {
    localStorage.setItem("cssScratchpadFloatingCss", textarea.value);
  });

  let dragging = false;
  let startX = 0;
  let startY = 0;
  let startTop = 0;
  let startLeft = 0;

  header.addEventListener("pointerdown", (event) => {
    if (event.target.closest("button")) return;

    dragging = true;

    const rect = host.getBoundingClientRect();

    startX = event.clientX;
    startY = event.clientY;
    startTop = rect.top;
    startLeft = rect.left;

    host.style.left = `${startLeft}px`;
    host.style.top = `${startTop}px`;
    host.style.right = "auto";
  });

  window.addEventListener("pointermove", (event) => {
    if (!dragging) return;

    const nextLeft = startLeft + event.clientX - startX;
    const nextTop = startTop + event.clientY - startY;

    host.style.left = `${Math.max(8, nextLeft)}px`;
    host.style.top = `${Math.max(8, nextTop)}px`;
  });

  window.addEventListener("pointerup", () => {
    dragging = false;
  });
}
