# @mcp-pointer/server

## 0.4.4

### Patch Changes

- b245b98: Sync server version with chrome extension to maintain version alignment. Both packages are now linked and will be versioned together.

## 0.4.3

### Patch Changes

- eb70122: Fix auto-update configuration to always use latest version

  Users were stuck on the first installed version because npx cached the initial version. Updated all MCP server configurations to use `@mcp-pointer/server@latest` ensuring users always get the newest version when their AI tool starts the server.

  - Updated Claude Code, Cursor, and Windsurf configurations
  - Added instructions for existing users to reconfigure
  - Updated documentation and troubleshooting sections

## 0.4.2

### Patch Changes

- fa28a6b: Improve README badges and release workflow

  - Add version and license badges to README
  - Emphasize Option+Click usage throughout documentation
  - Fix release workflow to prevent README commits
  - Add automatic manifest version bumping
  - Remove redundant config check in extension

## 0.4.1

### Patch Changes

- e232269: Fix config override and improve UI

  - Fix MCP server configuration to override existing configurations by removing before adding
  - Add comprehensive tests for config override scenarios
  - Update border color to use CSS custom property for better theming
  - Fix GitHub Actions badge URLs in README
  - Add README copying to npm package in release workflow

## 0.4.0

### Minor Changes

- ffcbf38: Major restructure and configuration improvements

  - **README restructure**: Complete rewrite with cleaner organization (Example section, Getting Started, How it Works, etc.)
  - **New automatic config command**: Replace `configure` and `show-config` with unified `config` command that automatically configures AI tools
  - **Rename "other" to "manual"**: Clearer naming for manual configuration option suitable for other MCP-compatible tools
  - **SupportedTool enum**: Convert tool names to enum for better type safety
  - **Jest configuration**: Auto-detect tsconfig instead of manual TypeScript settings
  - **Test improvements**: Full test coverage for config command with enum usage
  - **Chrome extension**: Add icon and improve build process for assets

## 0.3.3

### Patch Changes

- cbc8cb2: Fix npm publish by moving shared package to devDependencies

  - Move @mcp-pointer/shared from dependencies to devDependencies
  - Resolves "workspace:\*" protocol issue when publishing to npm
  - Shared code is bundled by esbuild so not needed at runtime

## 0.3.2

### Patch Changes

- 936240a: Fix release workflow by making shared package private

  - Make @mcp-pointer/shared private to prevent npm publishing attempts
  - Update changeset configuration to remove package linking
  - Only @mcp-pointer/server will be published to npm going forward

## 0.3.1

### Patch Changes

- 201b4e7: Add automated release workflow with changesets

  - Implement GitHub Actions workflow for automated versioning and publishing
  - Add changeset configuration for monorepo version management
  - Update documentation with changeset workflow instructions
  - Remove manual publish workflow in favor of automated approach

- Updated dependencies [201b4e7]
  - @mcp-pointer/shared@0.3.1

## 0.3.0

### Minor Changes

- feat(server): Add multi-instance support with port-based leader election

  - Implement port-based leader election for WebSocket server management
  - Add shared state persistence to filesystem (/tmp/mcp-pointer-shared-state.json)
  - Support multiple MCP server instances without port conflicts
  - Add automatic failover when leader instance crashes (~5 second recovery)
  - Refactor services into dedicated service layer (WebSocketService, MCPService, SharedStateService)
  - Add comprehensive test suite using Node.js built-in test runner
  - Add architecture documentation with Mermaid diagram to CONTRIBUTING.md
  - Rename WebSocketMessageType to PointerMessageType for better domain clarity
  - Add proper process cleanup handling on Ctrl+C and other signals
  - MCP service now runs independently on all instances (leader and followers)

  Breaking changes: None - fully backwards compatible with single instance deployments

### Patch Changes

- Updated dependencies
  - @mcp-pointer/shared@0.3.0

## 0.2.0

### Minor Changes

- Major overlay system architecture and performance improvements

  - Complete redesign of overlay calculation, tracking, and rendering system
  - Significantly optimize overlay performance and responsiveness
  - Move to service-based architecture with dedicated services directory
  - Add new overlay-service with improved positioning algorithms
  - Add style-service with optimized CSS injection and management
  - Extract element-pointer logic into dedicated service
  - Remove legacy overlay-manager and styles implementation

### Patch Changes

- Updated dependencies
  - @mcp-pointer/shared@0.2.0
