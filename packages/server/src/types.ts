import {
  ElementPosition,
  CSSProperties,
  ComponentInfo,
  RawPointedDOMElement,
} from '@mcp-pointer/shared/types';

// Server-processed data (extracted & enhanced)
export interface ProcessedPointedDOMElement {
  // Extracted from HTML
  tagName: string;
  id?: string;
  classes: string[];
  attributes: Record<string, string>;
  innerText: string;
  selector: string;

  // Context data
  position: ElementPosition;
  url: string;
  timestamp: string; // ISO format

  // Full CSS data for shaping
  cssComputed?: Record<string, string>; // Full computed styles
  componentInfo?: ComponentInfo;

  // Text content (full, including hidden nodes)
  textContent?: string;

  // Processing metadata
  warnings?: string[];
}

export interface SerializedDOMElement {
  selector: string;
  tagName: string;
  id?: string;
  classes: string[];
  attributes: Record<string, string>;
  position: ElementPosition;
  url: string;
  timestamp: string;
  innerText: string;
  textContent?: string;
  cssProperties?: CSSProperties;
  componentInfo?: ComponentInfo;
  warnings?: string[];
}

// State data structure
export interface SharedStateData {
  rawPointedDOMElement: RawPointedDOMElement;
  processedPointedDOMElement: ProcessedPointedDOMElement;
  metadata: {
    receivedAt: string;
    messageType: string;
  };
}

// Storage format
export interface SharedState {
  data: SharedStateData;
}
