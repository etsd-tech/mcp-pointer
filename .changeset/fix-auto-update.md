---
"@mcp-pointer/server": patch
---

Fix auto-update configuration to always use latest version

Users were stuck on the first installed version because npx cached the initial version. Updated all MCP server configurations to use `@mcp-pointer/server@latest` ensuring users always get the newest version when their AI tool starts the server.

- Updated Claude Code, Cursor, and Windsurf configurations
- Added instructions for existing users to reconfigure
- Updated documentation and troubleshooting sections