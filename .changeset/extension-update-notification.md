---
"@mcp-pointer/chrome-extension": patch
---

Add extension update notification system

When the Chrome extension is updated, users now automatically see a notification page guiding them to reconfigure their MCP server for auto-updates. The notification opens at https://mcp-pointer.etsd.tech/update-notice.html and provides step-by-step instructions for enabling automatic updates with their AI tool.

- Added onInstalled listener to detect extension updates
- Added tabs permission for opening external notification page
- Set up GitHub Pages infrastructure for update notifications