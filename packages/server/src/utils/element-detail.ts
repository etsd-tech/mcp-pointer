import {
  CSSDetailLevel,
  CSSProperties,
  DEFAULT_CSS_LEVEL,
  DEFAULT_TEXT_DETAIL,
  TextDetailLevel,
} from '@mcp-pointer/shared/types';
import {
  CSS_LEVEL_FIELD_MAP,
  isValidCSSLevel,
  isValidTextDetail,
} from '@mcp-pointer/shared/detail';
import { ProcessedPointedDOMElement, SerializedDOMElement } from '../types';

export interface DetailParameters {
  textDetail?: unknown;
  cssLevel?: unknown;
}

export interface NormalizedDetailParameters {
  textDetail: TextDetailLevel;
  cssLevel: CSSDetailLevel;
}

function toNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  return null;
}

const TEXT_DETAIL_ALIAS_MAP: Record<string, TextDetailLevel> = {
  full: TextDetailLevel.FULL,
  visible: TextDetailLevel.VISIBLE,
  none: TextDetailLevel.NONE,
};

function fromTextDetailAlias(value: string): TextDetailLevel | null {
  const normalized = value.trim().toLowerCase();
  return TEXT_DETAIL_ALIAS_MAP[normalized] ?? null;
}

export function normalizeTextDetail(
  detail: unknown,
  fallback: TextDetailLevel = DEFAULT_TEXT_DETAIL,
): TextDetailLevel {
  if (isValidTextDetail(detail)) {
    return detail;
  }

  if (typeof detail === 'string') {
    const alias = fromTextDetailAlias(detail);
    if (alias !== null) {
      return alias;
    }

    const parsed = toNumber(detail);
    if (parsed !== null && isValidTextDetail(parsed)) {
      return parsed;
    }
  }

  return fallback;
}

export function normalizeCssLevel(
  level: unknown,
  fallback: CSSDetailLevel = DEFAULT_CSS_LEVEL,
): CSSDetailLevel {
  if (isValidCSSLevel(level)) {
    return level;
  }

  const parsed = toNumber(level);
  if (parsed !== null && isValidCSSLevel(parsed)) {
    return parsed;
  }

  return fallback;
}

export function normalizeDetailParameters(
  params: DetailParameters | undefined,
  defaults?: Partial<NormalizedDetailParameters>,
): NormalizedDetailParameters {
  return {
    textDetail: normalizeTextDetail(
      params?.textDetail,
      defaults?.textDetail ?? DEFAULT_TEXT_DETAIL,
    ),
    cssLevel: normalizeCssLevel(
      params?.cssLevel,
      defaults?.cssLevel ?? DEFAULT_CSS_LEVEL,
    ),
  };
}

function resolveTextContent(
  element: ProcessedPointedDOMElement,
  detail: TextDetailLevel,
): string | undefined {
  if (detail === TextDetailLevel.NONE) {
    return undefined;
  }

  if (detail === TextDetailLevel.VISIBLE) {
    return element.innerText;
  }

  // Full detail returns textContent if available, otherwise falls back to innerText
  return element.textContent ?? element.innerText;
}

function buildCssProperties(
  element: ProcessedPointedDOMElement,
  cssLevel: CSSDetailLevel,
): CSSProperties | undefined {
  if (cssLevel === CSSDetailLevel.NONE) {
    return undefined;
  }

  if (cssLevel === CSSDetailLevel.FULL) {
    if (element.cssComputed) {
      return { ...element.cssComputed };
    }

    return undefined;
  }

  const fields = CSS_LEVEL_FIELD_MAP[cssLevel];
  const cssProperties: CSSProperties = {};
  const source = element.cssComputed ?? {};

  fields.forEach((property) => {
    const value = source[property];
    if (value !== undefined) {
      cssProperties[property] = value;
    }
  });

  if (Object.keys(cssProperties).length > 0) {
    return cssProperties;
  }

  if (element.cssComputed) {
    return { ...element.cssComputed };
  }

  return undefined;
}

export function serializeElement(
  element: ProcessedPointedDOMElement,
  detail: TextDetailLevel,
  cssLevel: CSSDetailLevel,
): SerializedDOMElement {
  const resolvedText = resolveTextContent(element, detail);
  const textContent = detail === TextDetailLevel.FULL ? element.textContent : undefined;
  const cssProperties = buildCssProperties(element, cssLevel);

  const shaped: SerializedDOMElement = {
    selector: element.selector,
    tagName: element.tagName,
    id: element.id,
    classes: [...element.classes],
    attributes: { ...element.attributes },
    position: { ...element.position },
    componentInfo: element.componentInfo ? { ...element.componentInfo } : undefined,
    timestamp: element.timestamp,
    url: element.url,
    innerText: resolvedText ?? '',
    warnings: element.warnings,
  };

  if (textContent !== undefined) {
    shaped.textContent = textContent;
  }

  if (cssProperties) {
    shaped.cssProperties = cssProperties;
  }

  return shaped;
}
