export enum TextDetailLevel {
  NONE = 0,
  VISIBLE = 1,
  FULL = 2,
}

export enum CSSDetailLevel {
  NONE = 0,
  BASIC = 1,
  BOX_MODEL = 2,
  FULL = 3,
}

export const DEFAULT_TEXT_DETAIL: TextDetailLevel = TextDetailLevel.FULL;

export const DEFAULT_CSS_LEVEL: CSSDetailLevel = CSSDetailLevel.BASIC;

export interface TextSnapshots {
  visible: string;
  full: string;
}

export interface ElementPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type CSSProperties = Record<string, string>;

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
  innerText?: string;
  textContent?: string;
  textDetail?: TextDetailLevel;
  textVariants?: TextSnapshots;
  attributes: Record<string, string>;
  position: ElementPosition;
  cssLevel?: CSSDetailLevel;
  cssProperties?: CSSProperties;
  cssComputed?: Record<string, string>;
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
