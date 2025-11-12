import { CSSDetailLevel, TextDetailLevel } from '@mcp-pointer/shared/types';
import {
  normalizeDetailParameters,
  normalizeCssLevel,
  normalizeTextDetail,
  serializeElement,
} from '../../utils/element-detail';
import { ProcessedPointedDOMElement } from '../../types';

function createMockProcessedElement(): ProcessedPointedDOMElement {
  return {
    selector: 'div.test-element',
    tagName: 'DIV',
    id: 'test-id',
    classes: ['test-class'],
    innerText: 'Visible text',
    textContent: 'Visible text with hidden content',
    attributes: { 'data-test': 'true' },
    position: {
      x: 100, y: 200, width: 300, height: 50,
    },
    cssComputed: {
      display: 'block',
      position: 'relative',
      fontSize: '16px',
      color: 'rgb(0, 0, 0)',
      backgroundColor: 'rgb(255, 255, 255)',
      marginTop: '10px',
      paddingLeft: '5px',
    },
    timestamp: new Date().toISOString(),
    url: 'https://example.com',
  };
}

describe('element-detail utilities', () => {
  describe('normalizeTextDetail', () => {
    it('returns defaults for invalid values', () => {
      expect(normalizeTextDetail(undefined)).toBe(TextDetailLevel.FULL);
      expect(normalizeTextDetail('VISIBLE')).toBe(TextDetailLevel.VISIBLE);
      expect(normalizeTextDetail('invalid', TextDetailLevel.VISIBLE)).toBe(TextDetailLevel.VISIBLE);
    });
  });

  describe('normalizeCssLevel', () => {
    it('coerces numeric strings and falls back to default', () => {
      expect(normalizeCssLevel('2')).toBe(CSSDetailLevel.BOX_MODEL);
      expect(normalizeCssLevel('not-a-number', CSSDetailLevel.FULL)).toBe(CSSDetailLevel.FULL);
      expect(normalizeCssLevel(undefined)).toBe(CSSDetailLevel.BASIC);
    });
  });

  describe('normalizeDetailParameters', () => {
    it('applies defaults when params are missing', () => {
      expect(normalizeDetailParameters(undefined)).toEqual({
        textDetail: TextDetailLevel.FULL,
        cssLevel: CSSDetailLevel.BASIC,
      });
    });

    it('normalizes provided params', () => {
      expect(normalizeDetailParameters({ textDetail: 'visible', cssLevel: '0' })).toEqual({
        textDetail: TextDetailLevel.VISIBLE,
        cssLevel: CSSDetailLevel.NONE,
      });
    });
  });

  describe('serializeElement', () => {
    it('omits text and css when levels request none', () => {
      const element = createMockProcessedElement();
      const shaped = serializeElement(
        element,
        TextDetailLevel.NONE,
        CSSDetailLevel.NONE,
      );

      expect(shaped.innerText).toBe('');
      expect(shaped.textContent).toBeUndefined();
      expect(shaped.cssProperties).toBeUndefined();
    });

    it('returns visible text and level 1 css subset', () => {
      const element = createMockProcessedElement();
      element.innerText = 'Visible text only';
      element.textContent = 'Visible text only with hidden';
      const shaped = serializeElement(
        element,
        TextDetailLevel.VISIBLE,
        CSSDetailLevel.BASIC,
      );

      expect(shaped.innerText).toBe('Visible text only');
      expect(shaped.textContent).toBeUndefined();
      expect(shaped.cssProperties).toBeDefined();
      expect(Object.keys(shaped.cssProperties!)).toContain('display');
      expect(Object.keys(shaped.cssProperties!)).not.toContain('marginTop');
    });

    it('returns full css when level 3 requested', () => {
      const element = createMockProcessedElement();
      const shaped = serializeElement(
        element,
        TextDetailLevel.FULL,
        CSSDetailLevel.FULL,
      );

      expect(shaped.cssProperties).toEqual(element.cssComputed);
      expect(shaped.textContent).toBe(element.textContent);
    });
  });
});
