# CSS Scratchpad

> A delightful Chrome extension for developers to test and live-edit CSS on any webpage without touching source code.

**Note:** CSS Scratchpad is publicly visible for transparency, but it is not open source. Reuse of the code, branding, design, or assets is not permitted without written permission.

[![Chrome Web Store](https://img.shields.io/badge/available%20on-Chrome%20Web%20Store-brightgreen)](https://chromewebstore.google.com/detail/jdnkfapcdcobhmbhhinhdlhfdgpoodgl?utm_source=item-share-cb)

## Features

- **⚡ Floating Scratchpad Panel** - Opens a draggable panel directly on any webpage with just one click
- **🎯 Element Picker** - Select any page element and auto-load its styles into the scratchpad
- **✍️ Live Edit Mode** - Edit CSS and see changes instantly without manually adding `!important`
- **🛡️ Shadow DOM Protection** - The panel UI is isolated, so your test CSS won't break the tool itself
- **💾 Local Storage** - Your CSS is saved locally in the browser for reuse
- **🔒 Privacy First** - No tracking, analytics, servers, or personal data collection

## Getting Started

Visit the [CSS Scratchpad website](https://wardtwits.github.io/css-scratchpad) or the [Chrome Web Store](https://chromewebstore.google.com/detail/jdnkfapcdcobhmbhhinhdlhfdgpoodgl?utm_source=item-share-cb) to get started.

## Usage

### Basic Workflow

```
1. Click the extension icon → Floating panel appears
2. Write CSS in the scratchpad (selector + declarations)
3. Click "Apply" → Styles are injected as inline styles
4. Click "Unapply" → Changes are reverted
```

### Pick Element to Edit

- Click the **"Pick Element to Edit"** button
- Hover over any page element (a red border shows it's selected)
- Click the element to load its styles into the scratchpad
- Styles are loaded in **Live Edit Mode** for immediate testing

### Live Edit Mode

In **Live Edit Mode**, when you click **Apply**:
- CSS is written directly as inline styles on the selected element
- Common edits work without requiring `!important`
- Perfect for testing changes before committing to code

### Managing Changes

- **Apply** - Write edited styles as inline styles to the selected element
- **Unapply** - Restore the element's original inline styles and remove injected CSS
- **Clear** - Clear the scratchpad panel
- **Collapse** - Collapse the panel to just the title bar to keep it out of the way

## How It Works

CSS Scratchpad uses Chrome's content script and Shadow DOM APIs to:
- Inject a floating UI panel into any webpage
- Safely isolate the panel from page CSS
- Apply CSS changes directly to the DOM
- Preserve changes only for your current session

All CSS is stored locally in your browser—nothing is sent to servers or external services.

## Why Use CSS Scratchpad?

Perfect for:
- **Quick Visual Testing** - Test CSS changes instantly without editing source files
- **Design Debugging** - Find layout issues or spacing problems faster
- **Style Extraction** - Pull useful styles from existing page elements
- **Component Testing** - Live-edit a single component while the rest of the page stays unchanged
- **Learning** - Experiment with CSS in real-time on live websites

## Project Structure

```
├── manifest.json        # Chrome extension configuration
├── index.html          # Landing page
├── privacy-policy.html # Privacy policy
├── css/
│   └── main.css        # Main stylesheet
├── icons/              # Extension icons
└── images/             # Images for landing page
```

## Privacy

CSS Scratchpad respects your privacy:
- ✅ No user tracking
- ✅ No analytics
- ✅ No remote servers
- ✅ No personal data collection
- ✅ CSS is stored locally in your browser only
- ✅ All changes are session-only (cleared when you close the page)

See [Privacy Policy](./privacy-policy.html) for details.

## Video Demo

Check out a full demonstration: [CSS Scratchpad on YouTube](https://www.youtube.com/watch?v=yzAQKqkq5pc)

## Permissions

CSS Scratchpad requests minimal permissions:
- `activeTab` - To access the currently active tab
- `scripting` - To inject CSS and scripts
- `storage` - To save your scratchpad CSS locally

## About

CSS Scratchpad was created by [Chris Ward](https://github.com/wardtwits) as a practical tool for developers and designers who want a faster way to test page styling.

### Other Projects

- [Viisi](https://viisi.app/) - A satisfying puzzle game
- [CastLink](https://castlink.app/) - Movie and TV show connections

## Support

Have questions or feedback? Reach out at **chris@viisi.app**

## License

This repository is publicly visible for transparency and distribution of the CSS Scratchpad Chrome extension.

CSS Scratchpad is **not an open-source project**.

All source code, branding, design, copy, and assets are copyright © Chris Ward. All rights reserved.

You may view the source code for personal reference, but you may not copy, redistribute, publish, sell, rebrand, package, or use this project or its assets to create a competing or derivative browser extension without written permission.

---

Made with ❤️ for developers and designers.
