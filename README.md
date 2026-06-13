# CSS Scratchpad

> A delightful Chrome extension for developers to test and live-edit CSS on any webpage without touching source code.

[![Chrome Web Store](https://img.shields.io/badge/available%20on-Chrome%20Web%20Store-brightgreen)](https://chromewebstore.google.com/detail/jdnkfapcdcobhmbhhinhdlhfdgpoodgl?utm_source=item-share-cb)

## Features

- **⚡ Floating Scratchpad Panel** - Opens a draggable panel directly on any webpage with just one click
- **🎯 Element Picker** - Select any page element and auto-load its styles into the scratchpad
- **✍️ Live Edit Mode** - Edit CSS and see changes instantly without manually adding `!important`
- **🛡️ Shadow DOM Protection** - The panel UI is isolated, so your test CSS won't break the tool itself
- **💾 Local Storage** - Your CSS is saved locally in the browser for reuse
- **🔒 Privacy First** - No tracking, analytics, servers, or personal data collection

## Getting Started

### Installation

1. Visit the [Chrome Web Store](https://chromewebstore.google.com/detail/jdnkfapcdcobhmbhhinhdlhfdgpoodgl?utm_source=item-share-cb)
2. Click **Add to Chrome**
3. The extension icon will appear in your toolbar

### Quick Start

1. Click the CSS Scratchpad icon in your Chrome toolbar
2. A floating panel opens on the current page
3. Write CSS rules or use **Pick Element to Edit** to select an element

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

## Development

### Project Structure

```
├── manifest.json        # Chrome extension configuration
├── index.html          # Landing page
├── privacy-policy.html # Privacy policy
├── css/
│   └── main.css        # Main stylesheet
├── icons/              # Extension icons
└── images/             # Images for landing page
```

### Build & Installation (Local)

For development:
1. Clone this repository
2. Go to `chrome://extensions`
3. Enable **Developer mode**
4. Click **Load unpacked** and select this folder

### Manifest Version

Uses **Manifest V3** for Chrome extension compatibility.

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

MIT License - See LICENSE file for details

---

Made with ❤️ for developers and designers.
