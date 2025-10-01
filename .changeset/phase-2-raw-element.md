---
'@mcp-pointer/chrome-extension': patch
---

Send raw DOM element data for server-side processing

- Add extractRawPointedDOMElement() to collect minimal raw DOM data
- Send outerHTML, boundingClientRect, url, timestamp, computedStyles
- Include React Fiber when present on element
- Use DOM_ELEMENT_POINTED message type
- Move data processing responsibility to server
