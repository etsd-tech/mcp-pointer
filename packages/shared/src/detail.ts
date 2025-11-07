import { CSSDetailLevel, TextDetailLevel } from './types';

function getEnumNumberValues<T extends Record<string, string | number>>(enumObj: T): number[] {
  return Object.values(enumObj).filter((value): value is number => typeof value === 'number');
}

export const TEXT_DETAIL_OPTIONS: readonly TextDetailLevel[] = Object.freeze(
  getEnumNumberValues(TextDetailLevel) as TextDetailLevel[],
);

export const CSS_DETAIL_OPTIONS: readonly CSSDetailLevel[] = Object.freeze(
  getEnumNumberValues(CSSDetailLevel) as CSSDetailLevel[],
);

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
Exclude<CSSDetailLevel, CSSDetailLevel.NONE>,
readonly string[]
> = Object.freeze({
  [CSSDetailLevel.BASIC]: CSS_LEVEL_1_FIELDS,
  [CSSDetailLevel.BOX_MODEL]: CSS_LEVEL_2_FIELDS,
  [CSSDetailLevel.FULL]: [],
});

export function isValidTextDetail(detail: unknown): detail is TextDetailLevel {
  return typeof detail === 'number' && (TEXT_DETAIL_OPTIONS as readonly number[]).includes(detail);
}

export function isValidCSSLevel(level: unknown): level is CSSDetailLevel {
  return typeof level === 'number' && (CSS_DETAIL_OPTIONS as readonly number[]).includes(level);
}
