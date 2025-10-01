import {
  ElementPosition,
  CSSProperties,
  ComponentInfo,
  RawPointedDOMElement,
  TargetedElement,
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
  cssProperties?: CSSProperties;
  cssComputed?: Record<string, string>; // Full computed styles
  componentInfo?: ComponentInfo;

  // Text content (full, including hidden nodes)
  textContent?: string;

  // Processing metadata
  warnings?: string[];
}

// Version-specific data types
export interface StateDataV1 {
  rawPointedDOMElement: TargetedElement;
  processedPointedDOMElement: ProcessedPointedDOMElement;
  metadata: {
    receivedAt: string;
    messageType: string;
  };
}

export interface StateDataV2 {
  rawPointedDOMElement: RawPointedDOMElement;
  processedPointedDOMElement: ProcessedPointedDOMElement;
  metadata: {
    receivedAt: string;
    messageType: string;
  };
}

// Storage format with versioned data
export interface SharedState {
  stateVersion: number;
  data: StateDataV1 | StateDataV2;
}

// Legacy format alias
export type LegacySharedState = TargetedElement;
