[![MseeP.ai Security Assessment Badge](https://mseep.net/pr/etsd-tech-mcp-pointer-badge.png)](https://mseep.ai/app/etsd-tech-mcp-pointer)

<img width="1440" height="480" alt="MCP Pointer banner" src="https://github.com/user-attachments/assets/a36d2666-e848-4a80-97b3-466897b244f7" />

[![CI](https://github.com/etsd-tech/mcp-pointer/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/etsd-tech/mcp-pointer/actions/workflows/ci.yml)
[![Release](https://github.com/etsd-tech/mcp-pointer/actions/workflows/release.yml/badge.svg?branch=main)](https://github.com/etsd-tech/mcp-pointer/actions/workflows/release.yml)
[![npm version](https://img.shields.io/npm/v/@mcp-pointer/server?label=Server)](https://www.npmjs.com/package/@mcp-pointer/server)
[![Chrome Extension](https://img.shields.io/github/package-json/v/etsd-tech/mcp-pointer?filename=packages%2Fchrome-extension%2Fpackage.json&label=Chrome-Extension)](https://github.com/etsd-tech/mcp-pointer/releases)
[![License: MIT](https://img.shields.io/github/license/etsd-tech/mcp-pointer?label=License)](https://github.com/etsd-tech/mcp-pointer/blob/main/LICENSE)

# 👆 MCP Pointer

**Point to browser DOM elements for agentic coding tools via MCP!**

MCP Pointer is a *local* tool combining an MCP Server with a Chrome Extension:

1. **🖥️ MCP Server** (Node.js package) - Bridges between the browser and AI tools via the Model Context Protocol
2. **🌐 Chrome Extension** - Captures DOM element selections in the browser using `Option+Click`

The extension lets you visually select DOM elements in the browser, and the MCP server makes this **textual context** available to agentic coding tools like Claude Code, Cursor, and Windsurf through standardized MCP tools.

## ✨ Features

- 🎯 **`Option+Click` Selection** - Simply hold `Option` (Alt on Windows) and click any element
- 📋 **Complete Element Data** - Text content, CSS classes, HTML attributes, positioning, and styling
- ⚛️ **React Component Detection** - Component names and source files via Fiber (experimental)
- 🔗 **WebSocket Connection** - Real-time communication between browser and AI tools
- 🤖 **MCP Compatible** - Works with Claude Code and other MCP-enabled AI tools

## 🎬 Usage example (video)

https://github.com/user-attachments/assets/98c4adf6-1f05-4c9b-be41-0416ab784e2c

See MCP Pointer in action: `Option+Click` any element in your browser, then ask your agentic coding tool about it (in this example, Claude Code). The AI gets complete textual context about the selected DOM element including CSS properties, url, selector, and more.

## 🚀 Getting Started

### 1. Install Chrome Extension

**🎉 Now available on Chrome Web Store!**

[![Install from Chrome Web Store](https://img.shields.io/badge/Chrome_Web_Store-Install-blue?style=for-the-badge&logo=google-chrome)](https://chromewebstore.google.com/detail/mcp-pointer/jfhgaembhafbffidedhpkmnaajdfeiok)

Simply click the link above to install from the Chrome Web Store.

<details>
<summary>Alternative: Manual Installation</summary>

**Option A: Download from Releases**

1. Go to [GitHub Releases](https://github.com/etsd-tech/mcp-pointer/releases)
2. Download `mcp-pointer-chrome-extension.zip` from the latest release
3. Extract the zip file to a folder on your computer
4. Open Chrome → Settings → Extensions → Developer mode (toggle ON)
5. Click "Load unpacked" and select the extracted folder
6. The MCP Pointer extension should appear in your extensions list
7. **Reload web pages** to activate the extension

**Option B: Build from Source**

1. Clone this repository
2. Follow the build instructions in [CONTRIBUTING.md](./CONTRIBUTING.md)
3. Open Chrome → Settings → Extensions → Developer mode (toggle ON)
4. Click "Load unpacked" and select the `packages/chrome-extension/dist/` folder
5. **Reload web pages** to activate the extension

</details>

### 2. Configure MCP Server

One command setup for your AI tool:

```bash
npx -y @mcp-pointer/server config claude  # or cursor, windsurf, and others - see below
```

<details>
<summary>Other AI Tools & Options</summary>

```bash
# For other AI tools
npx -y @mcp-pointer/server config cursor     # Opens Cursor deeplink for automatic installation
npx -y @mcp-pointer/server config windsurf   # Automatically updates Windsurf config file
npx -y @mcp-pointer/server config manual     # Shows manual configuration for other tools
```

> **Optional:** You can install globally with `npm install -g @mcp-pointer/server` to use `mcp-pointer` instead of `npx -y @mcp-pointer/server`

</details>

After configuration, **restart your coding tool** to load the MCP connection.

### 3. Start Using

1. **Navigate to any webpage** 
2. **`Option+Click`** any element to select it
3. **Ask your AI** to analyze the targeted element!

Your AI tool will automatically start the MCP server when needed using the `npx -y @mcp-pointer/server start` command.

**Available AI Tools:**
- `getTargetedElement` - Get comprehensive info about the selected element
- `clearTargetedElement` - Clear the current selection
- `getPointerStatus` - Check system status and statistics

## 🎯 How It Works

1. **Element Selection**: Content script captures `Option+Click` events
2. **Data Extraction**: Analyzes element structure, CSS, and framework info
3. **WebSocket Transport**: Sends data to MCP server on port 7007
4. **MCP Protocol**: Makes data available to AI tools via MCP tools
5. **AI Analysis**: Your assistant can now see and analyze the element!

## 🎨 Element Data Extracted

- **Basic Info**: Tag name, ID, classes, text content
- **CSS Properties**: Display, position, colors, dimensions
- **Component Info**: React component names and source files (experimental)  
- **Attributes**: All HTML attributes
- **Position**: Exact coordinates and dimensions
- **Source Hints**: File paths and component origins

## 🔍 Framework Support

- ⚛️ **React** - Component names and source files via Fiber (experimental)
- 📦 **Generic HTML/CSS/JS** - Full support for any web content
- 🔮 **Planned** - Vue component detection (PRs appreciated)

## 🌐 Browser Support

- ✅ **Chrome** - Full support (tested)
- 🟡 **Chromium-based browsers** - Should work (Edge, Brave, Arc - load built extension manually)

## 🐛 Troubleshooting

### Extension Not Connecting

1. Make sure MCP server is running: `npx -y @mcp-pointer/server start`
2. Check browser console for WebSocket errors
3. Verify port 7007 is not blocked by firewall

### MCP Tools Not Available

1. Restart your AI assistant after installing
2. Check MCP configuration: `mcp-pointer config <your-tool>`  
3. Verify server is running: `npx -y @mcp-pointer/server start`

### Elements Not Highlighting

1. Some pages block content scripts (chrome://, etc.)
2. Try refreshing the page
3. Check if targeting is enabled (click extension icon)

## 🚀 Roadmap

### 1. **Dynamic Context Control**
   - LLM-configurable detail levels (visible text only, all text, CSS levels)
   - Progressive refinement options
   - Token-conscious data fetching

### 2. **Enhanced Framework Support**
   - Vue.js component detection
   - Better React support (React 19 removed `_debugSource`, affecting source mapping in dev builds)

### 3. **Visual Content Support** (for multimodal LLMs)
   - Base64 encoding for images (img tags)
   - Screenshot capture of selected elements
   - Separate MCP tool for direct visual content retrieval

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](./CONTRIBUTING.md) guide for development setup and guidelines.

---

*Inspired by tools like [Click-to-Component](https://github.com/ericclemmons/click-to-component) for component development workflows.*

---

**Made with ❤️ for AI-powered web development**

*Now your AI can analyze any element you point at with `Option+Click`! 👆*
