CSS Scratchpad Live Edit Update

Files included:
- manifest.json
- background.js

Install/update:
1. Replace your existing manifest.json with this manifest.json.
2. Replace your existing background.js with this background.js.
3. Keep your existing icons/ folder.
4. Reload the unpacked extension at chrome://extensions.

Behavior:
- Click the extension icon to open/close the floating scratchpad panel.
- The panel is Shadow DOM protected so page CSS should not restyle it.
- Pick Element to Edit shows a red hover border and loads selected element styles.
- Styles loaded from Pick Element to Edit use Live Edit Mode.
- In Live Edit Mode, Apply writes the edited declarations directly as inline styles on the selected element, so edits work without manually adding !important.
- Unapply restores the selected element's original inline style for this panel session and removes normal injected scratchpad CSS.
