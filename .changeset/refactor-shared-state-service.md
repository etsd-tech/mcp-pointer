---
"@mcp-pointer/server": minor
"@mcp-pointer/shared": minor
---

Refactor SharedStateService with dual format support and add comprehensive tests

- Added dual format support for legacy and new raw DOM data
- Created ElementProcessor service for server-side DOM processing  
- Added comprehensive test suite with factory pattern
- Added DOM_ELEMENT_POINTED message type support
- Maintains full backward compatibility

Server ready for browser extension updates.