---
"@mcp-pointer/chrome-extension": patch
---

Remove unnecessary tabs permission from Chrome extension manifest to comply with Chrome Web Store policy. The chrome.tabs.create() function works without the tabs permission.