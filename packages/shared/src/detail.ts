import { CSSDetailLevel, TextDetailLevel } from './types';

export const TEXT_DETAIL_OPTIONS: readonly TextDetailLevel[] = ['full', 'visible', 'none'];

export const CSS_DETAIL_OPTIONS: readonly CSSDetailLevel[] = [0, 1, 2, 3];

export const CSS_LEVEL_1_FIELDS: readonly string[] = [
  'display',
  'position',
  'fontSize',
  'color',
  'backgroundColor',
];

const CSS_LEVEL_2_EXTRA_FIELDS = [
  'margin',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'padding',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'lineHeight',
  'textAlign',
  'fontWeight',
  'fontFamily',
  'width',
  'height',
  'minWidth',
  'maxWidth',
  'minHeight',
  'maxHeight',
  'border',
  'borderTop',
  'borderRight',
  'borderBottom',
  'borderLeft',
  'borderRadius',
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderBottomRightRadius',
  'borderBottomLeftRadius',
  'boxSizing',
  'flexDirection',
  'justifyContent',
  'alignItems',
  'gap',
  'overflow',
  'overflowX',
  'overflowY',
] as const;

export const CSS_LEVEL_2_FIELDS: readonly string[] = Object.freeze([
  ...CSS_LEVEL_1_FIELDS,
  ...CSS_LEVEL_2_EXTRA_FIELDS,
]);

export const CSS_LEVEL_FIELD_MAP: Record<
Exclude<CSSDetailLevel, 0>,
readonly string[]
> = Object.freeze({
  1: CSS_LEVEL_1_FIELDS,
  2: CSS_LEVEL_2_FIELDS,
  3: [],
});

export function isValidTextDetail(detail: unknown): detail is TextDetailLevel {
  return typeof detail === 'string' && (TEXT_DETAIL_OPTIONS as readonly string[]).includes(detail);
}

export function isValidCSSLevel(level: unknown): level is CSSDetailLevel {
  return typeof level === 'number' && (CSS_DETAIL_OPTIONS as readonly number[]).includes(level);
}
