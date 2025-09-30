---
"@mcp-pointer/server": patch
---

Replace jsdom with node-html-parser for better bundling

- Reduced bundle size
- Fixes bundling issues with esbuild
- faster HTML parsing