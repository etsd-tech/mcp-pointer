import {
  normalizeDetailParameters,
  normalizeCssLevel,
  normalizeTextDetail,
  shapeElementForDetail,
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
    cssProperties: {
      display: 'block',
      position: 'relative',
      fontSize: '16px',
      color: 'rgb(0, 0, 0)',
      backgroundColor: 'rgb(255, 255, 255)',
      marginTop: '10px',
      paddingLeft: '5px',
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
      expect(normalizeTextDetail(undefined)).toBe('full');
      expect(normalizeTextDetail('VISIBLE')).toBe('visible');
      expect(normalizeTextDetail('invalid', 'visible')).toBe('visible');
    });
  });

  describe('normalizeCssLevel', () => {
    it('coerces numeric strings and falls back to default', () => {
      expect(normalizeCssLevel('2')).toBe(2);
      expect(normalizeCssLevel('not-a-number', 3)).toBe(3);
      expect(normalizeCssLevel(undefined)).toBe(1);
    });
  });

  describe('normalizeDetailParameters', () => {
    it('applies defaults when params are missing', () => {
      expect(normalizeDetailParameters(undefined)).toEqual({
        textDetail: 'full',
        cssLevel: 1,
      });
    });

    it('normalizes provided params', () => {
      expect(normalizeDetailParameters({ textDetail: 'visible', cssLevel: '0' })).toEqual({
        textDetail: 'visible',
        cssLevel: 0,
      });
    });
  });

  describe('shapeElementForDetail', () => {
    it('omits text and css when levels request none', () => {
      const element = createMockProcessedElement();
      const shaped = shapeElementForDetail(element, 'none', 0);

      expect(shaped.innerText).toBe('');
      expect(shaped.textContent).toBeUndefined();
      expect(shaped.cssProperties).toBeUndefined();
    });

    it('returns visible text and level 1 css subset', () => {
      const element = createMockProcessedElement();
      element.innerText = 'Visible text only';
      element.textContent = 'Visible text only with hidden';
      const shaped = shapeElementForDetail(element, 'visible', 1);

      expect(shaped.innerText).toBe('Visible text only');
      expect(shaped.textContent).toBeUndefined();
      expect(shaped.cssProperties).toBeDefined();
      expect(Object.keys(shaped.cssProperties!)).toContain('display');
      expect(Object.keys(shaped.cssProperties!)).not.toContain('marginTop');
    });

    it('returns full css when level 3 requested', () => {
      const element = createMockProcessedElement();
      const shaped = shapeElementForDetail(element, 'full', 3);

      expect(shaped.cssProperties).toEqual(element.cssComputed);
      expect(shaped.textContent).toBe(element.textContent);
    });
  });
});
