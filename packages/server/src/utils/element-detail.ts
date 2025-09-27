import {
  CSSDetailLevel,
  CSSProperties,
  DEFAULT_CSS_LEVEL,
  DEFAULT_TEXT_DETAIL,
  TargetedElement,
  TextDetailLevel,
  TextSnapshots,
} from '@mcp-pointer/shared/types';
import {
  CSS_LEVEL_FIELD_MAP,
  isValidCSSLevel,
  isValidTextDetail,
} from '@mcp-pointer/shared/detail';

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

export function normalizeTextDetail(
  detail: unknown,
  fallback: TextDetailLevel = DEFAULT_TEXT_DETAIL,
): TextDetailLevel {
  if (isValidTextDetail(detail)) {
    return detail;
  }

  if (typeof detail === 'string') {
    const lowered = detail.toLowerCase();
    if (isValidTextDetail(lowered)) {
      return lowered as TextDetailLevel;
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

function resolveTextVariants(element: TargetedElement): TextSnapshots {
  const visible = element.textVariants?.visible ?? element.innerText ?? '';
  const full = element.textVariants?.full ?? element.textContent ?? visible;

  return {
    visible,
    full,
  };
}

function resolveTextContent(
  variants: TextSnapshots,
  detail: TextDetailLevel,
): string | undefined {
  if (detail === 'none') {
    return undefined;
  }

  if (detail === 'visible') {
    return variants.visible;
  }

  return variants.full || variants.visible;
}

function buildCssProperties(
  element: TargetedElement,
  cssLevel: CSSDetailLevel,
): CSSProperties | undefined {
  if (cssLevel === 0) {
    return undefined;
  }

  if (cssLevel === 3) {
    if (element.cssComputed) {
      return { ...element.cssComputed };
    }

    if (element.cssProperties) {
      return { ...element.cssProperties };
    }

    return undefined;
  }

  const fields = CSS_LEVEL_FIELD_MAP[cssLevel];
  const cssProperties: CSSProperties = {};
  const source = element.cssComputed ?? element.cssProperties ?? {};

  fields.forEach((property) => {
    const value = source[property];
    if (value !== undefined) {
      cssProperties[property] = value;
    }
  });

  if (Object.keys(cssProperties).length > 0) {
    return cssProperties;
  }

  if (element.cssProperties) {
    return { ...element.cssProperties };
  }

  return undefined;
}

export function shapeElementForDetail(
  element: TargetedElement,
  detail: TextDetailLevel,
  cssLevel: CSSDetailLevel,
): TargetedElement {
  const variants = resolveTextVariants(element);
  const resolvedText = resolveTextContent(variants, detail);
  const textContent = detail === 'full' ? variants.full : undefined;
  const cssProperties = buildCssProperties(element, cssLevel);

  const shaped: TargetedElement = {
    selector: element.selector,
    tagName: element.tagName,
    id: element.id,
    classes: [...element.classes],
    attributes: { ...element.attributes },
    position: { ...element.position },
    cssLevel,
    componentInfo: element.componentInfo ? { ...element.componentInfo } : undefined,
    timestamp: element.timestamp,
    url: element.url,
    tabId: element.tabId,
    textDetail: detail,
  };

  if (resolvedText !== undefined) {
    shaped.innerText = resolvedText;
  }

  if (textContent !== undefined) {
    shaped.textContent = textContent;
  }

  if (cssProperties) {
    shaped.cssProperties = cssProperties;
  }

  return shaped;
}
