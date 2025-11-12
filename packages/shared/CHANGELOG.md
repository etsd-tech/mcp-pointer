# @mcp-pointer/shared

## 0.6.0

### Minor Changes

- ca7a516: **Architecture Cleanup & Improvements**

  - **Server**: Store full CSS properties in `cssProperties` instead of filtering to 5 properties
  - **Server**: Remove LEGACY_ELEMENT_SELECTED support - only DOM_ELEMENT_POINTED is now supported
  - **Server**: Delete unused files (`mcp-handler.ts`, `websocket-server.ts`)
  - **Server**: Simplify types - remove StateDataV1 and LegacySharedState
  - **Server**: Dynamic CSS filtering now happens on-the-fly during MCP tool calls based on cssLevel parameter

  This enables full CSS details to be accessible without re-pointing to elements, with filtering applied server-side based on tool parameters.

## 0.4.0

### Minor Changes

- d91e764: Refactor SharedStateService with dual format support and add comprehensive tests

  - Added dual format support for legacy and new raw DOM data
  - Created ElementProcessor service for server-side DOM processing
  - Added comprehensive test suite with factory pattern
  - Added DOM_ELEMENT_POINTED message type support
  - Maintains full backward compatibility

  Server ready for browser extension updates.

- Added dynamic context control (text detail & css levels)

## 0.3.1

### Patch Changes

- 201b4e7: Add automated release workflow with changesets

  - Implement GitHub Actions workflow for automated versioning and publishing
  - Add changeset configuration for monorepo version management
  - Update documentation with changeset workflow instructions
  - Remove manual publish workflow in favor of automated approach

## 0.3.0

### Patch Changes

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
