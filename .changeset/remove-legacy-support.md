---
"@mcp-pointer/server": minor
"@mcp-pointer/shared": minor
---

**Architecture Cleanup & Improvements**

- **Server**: Store full CSS properties in `cssProperties` instead of filtering to 5 properties
- **Server**: Remove LEGACY_ELEMENT_SELECTED support - only DOM_ELEMENT_POINTED is now supported
- **Server**: Delete unused files (`mcp-handler.ts`, `websocket-server.ts`)
- **Server**: Simplify types - remove StateDataV1 and LegacySharedState
- **Server**: Dynamic CSS filtering now happens on-the-fly during MCP tool calls based on cssLevel parameter

This enables full CSS details to be accessible without re-pointing to elements, with filtering applied server-side based on tool parameters.
