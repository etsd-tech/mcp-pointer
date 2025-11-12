// Disable ESLint rule for underscore dangle usage in this file (React internals)
/* eslint-disable no-underscore-dangle */

import { RawPointedDOMElement } from '@mcp-pointer/shared/types';
import logger from './logger';

/**
 * Extract raw React Fiber from an element (if present)
 */
export function getRawReactFiber(element: HTMLElement): any | undefined {
  try {
    const fiberKey = Object.keys(element).find((key) => key.startsWith('__reactFiber$')
      || key.startsWith('__reactInternalInstance$'));

    if (fiberKey) {
      return (element as any)[fiberKey];
    }

    return undefined;
  } catch (error) {
    logger.error('🚨 Error extracting raw Fiber:', error);
    return undefined;
  }
}

/**
 * Get all computed styles as a plain object (Record)
 * CSSStyleDeclaration doesn't serialize properly with JSON.stringify,
 * so we convert it to a plain object
 */
export function getAllComputedStyles(element: HTMLElement): Record<string, string> {
  const computedStyle = window.getComputedStyle(element);
  const styles: Record<string, string> = {};

  // Convert CSSStyleDeclaration to plain object
  for (let i = 0; i < computedStyle.length; i += 1) {
    const property = computedStyle[i];
    styles[property] = computedStyle.getPropertyValue(property);
  }

  return styles;
}

/**
 * Extract minimal raw DOM element data for server-side processing
 */
export function extractRawPointedDOMElement(element: HTMLElement): RawPointedDOMElement {
  const raw: RawPointedDOMElement = {
    outerHTML: element.outerHTML,
    url: window.location.href,
    timestamp: Date.now(),
    boundingClientRect: element.getBoundingClientRect(),
    computedStyles: getAllComputedStyles(element),
  };

  // Add React Fiber if present
  const reactFiber = getRawReactFiber(element);
  if (reactFiber) {
    raw.reactFiber = reactFiber;
  }

  return raw;
}
