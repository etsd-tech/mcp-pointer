// Simple safe getter function (replaces lodash.get)
import {
  RawPointedDOMElement, ElementPosition, ComponentInfo,
} from '@mcp-pointer/shared/types';
import { ProcessedPointedDOMElement } from '../types';
import { extractFromHTML, generateSelector } from '../utils/dom-extractor';
import logger from '../logger';

function safeGet<T>(obj: any, path: string, defaultValue: T): T {
  const keys = path.split('.');
  return keys.reduce((result, key) => {
    if (result === undefined) return defaultValue;
    return result?.[key];
  }, obj) ?? defaultValue;
}

export default class ElementProcessor {
  processFromRaw(raw: RawPointedDOMElement): ProcessedPointedDOMElement {
    const { element, warnings } = extractFromHTML(raw.outerHTML);
    const allWarnings: string[] = [...warnings];

    // Build processed data with fallbacks
    const processed: ProcessedPointedDOMElement = {
      tagName: element?.tagName || 'UNKNOWN',
      id: element?.id || undefined,
      classes: element ? Array.from(element.classList) : [],
      attributes: element ? this.getAttributes(element) : {},
      innerText: element?.textContent || '',
      textContent: element?.textContent || undefined,
      selector: element ? generateSelector(element) : 'unknown',

      position: this.getPosition(raw.boundingClientRect),
      url: raw.url,
      timestamp: new Date(raw.timestamp).toISOString(),

      cssComputed: raw.computedStyles ? { ...raw.computedStyles } : undefined,
      componentInfo: this.getComponentInfo(raw.reactFiber),

      warnings: allWarnings.length > 0 ? allWarnings : undefined,
    };

    if (processed.warnings) {
      logger.warn('Element processing warnings:', processed.warnings);
    }

    return processed;
  }

  private getAttributes(element: Element): Record<string, string> {
    const attrs: Record<string, string> = {};
    Array.from(element.attributes).forEach((attr) => {
      attrs[attr.name] = attr.value;
    });
    return attrs;
  }

  private getPosition(rect?: DOMRect): ElementPosition {
    return {
      x: safeGet(rect, 'x', 0),
      y: safeGet(rect, 'y', 0),
      width: safeGet(rect, 'width', 0),
      height: safeGet(rect, 'height', 0),
    };
  }

  private getComponentInfo(reactFiber?: any): ComponentInfo | undefined {
    if (!reactFiber) return undefined;

    const componentName = safeGet(reactFiber, 'type.displayName', '')
                         || safeGet(reactFiber, 'type.name', '');

    if (!componentName) return undefined;

    const result: ComponentInfo = {
      name: componentName,
      framework: 'react' as const,
    };

    const sourceFile = safeGet<string>(reactFiber, '_debugSource.fileName', '');
    if (sourceFile && typeof sourceFile === 'string') {
      const fileName = sourceFile.split('/').pop() || sourceFile;
      const lineNumber = safeGet(reactFiber, '_debugSource.lineNumber', 0);
      result.sourceFile = lineNumber ? `${fileName}:${lineNumber}` : fileName;
    }

    return result;
  }
}
