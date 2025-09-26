import { TargetedElement, RawPointedDOMElement, PointerMessageType } from '@mcp-pointer/shared/types';
import {
  SharedState, StateDataV1, StateDataV2, ProcessedPointedDOMElement,
} from '../../types';

export const createProcessedElement = (
  overrides: Partial<ProcessedPointedDOMElement> = {},
): ProcessedPointedDOMElement => ({
  tagName: 'div',
  classes: [],
  attributes: {},
  innerText: 'test content',
  selector: 'div',
  position: {
    x: 10, y: 20, width: 100, height: 50,
  },
  url: 'https://example.com',
  timestamp: '2023-01-01T00:00:00.000Z',
  ...overrides,
});

export const createRawElement = (
  overrides: Partial<RawPointedDOMElement> = {},
): RawPointedDOMElement => ({
  outerHTML: '<div>test content</div>',
  url: 'https://example.com',
  timestamp: 1672531200000,
  boundingClientRect: {
    x: 10,
    y: 20,
    width: 100,
    height: 50,
    top: 20,
    right: 110,
    bottom: 70,
    left: 10,
    toJSON() { return this; },
  },
  ...overrides,
});

export const createLegacyElement = (
  overrides: Partial<TargetedElement> = {},
): TargetedElement => ({
  selector: 'div',
  tagName: 'div',
  classes: [],
  innerText: 'test content',
  attributes: {},
  position: {
    x: 10, y: 20, width: 100, height: 50,
  },
  cssProperties: {
    display: 'block',
    position: 'relative',
    fontSize: '16px',
    color: '#000000',
    backgroundColor: '#ffffff',
  },
  timestamp: 1672531200000,
  url: 'https://example.com',
  ...overrides,
});

export const createStateV2 = (
  rawOverrides: Partial<RawPointedDOMElement> = {},
  processedOverrides: Partial<ProcessedPointedDOMElement> = {},
): SharedState => ({
  stateVersion: 2,
  data: {
    rawPointedDOMElement: createRawElement(rawOverrides),
    processedPointedDOMElement: createProcessedElement(processedOverrides),
    metadata: {
      receivedAt: '2023-01-01T00:00:00.000Z',
      messageType: PointerMessageType.DOM_ELEMENT_POINTED,
    },
  } as StateDataV2,
});

export const createStateV1 = (
  legacyOverrides: Partial<TargetedElement> = {},
  processedOverrides: Partial<ProcessedPointedDOMElement> = {},
): SharedState => ({
  stateVersion: 1,
  data: {
    rawPointedDOMElement: createLegacyElement(legacyOverrides),
    processedPointedDOMElement: createProcessedElement(processedOverrides),
    metadata: {
      receivedAt: '2023-01-01T00:00:00.000Z',
      messageType: PointerMessageType.LEGACY_ELEMENT_SELECTED,
    },
  } as StateDataV1,
});
