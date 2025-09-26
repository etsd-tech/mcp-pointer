export interface ElementPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CSSProperties {
  display: string;
  position: string;
  fontSize: string;
  color: string;
  backgroundColor: string;
}

export interface ComponentInfo {
  name?: string;
  sourceFile?: string;
  framework?: 'react' | 'vue' | 'angular' | 'svelte';
}

export interface TargetedElement {
  selector: string;
  tagName: string;
  id?: string;
  classes: string[];
  innerText: string;
  attributes: Record<string, string>;
  position: ElementPosition;
  cssProperties: CSSProperties;
  componentInfo?: ComponentInfo;
  timestamp: number;
  url: string;
  tabId?: number;
}

// Raw data from browser (minimal, fail-safe)
export interface RawPointedDOMElement {
  // Core data (mandatory)
  outerHTML: string; // Element's HTML serialization
  url: string; // Page URL
  timestamp: number; // Unix timestamp

  // Position data (optional but highly recommended)
  boundingClientRect?: DOMRect; // Position/size

  // Optional enhanced data
  computedStyles?: Record<string, string>; // Full CSS if configured
  reactFiber?: any; // React internals if available
}

// Pointer message types between extension and MCP server
export enum PointerMessageType {
  LEGACY_ELEMENT_SELECTED = 'element-selected',
  DOM_ELEMENT_POINTED = 'dom-element-pointed',
}

export interface PointerMessage {
  type: PointerMessageType;
  data?: any;
  timestamp: number;
}

// Connection status for ElementSenderService
export enum ConnectionStatus {
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  SENDING = 'sending',
  SENT = 'sent',
  ERROR = 'error',
}
