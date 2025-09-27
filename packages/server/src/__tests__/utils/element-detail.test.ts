import {
  normalizeDetailParameters,
  normalizeCssLevel,
  normalizeTextDetail,
  shapeElementForDetail,
} from '../../utils/element-detail';
import { createMockElement } from '../test-helpers';

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
      const element = createMockElement();
      const shaped = shapeElementForDetail(element, 'none', 0);

      expect(shaped.innerText).toBeUndefined();
      expect(shaped.textContent).toBeUndefined();
      expect(shaped.cssProperties).toBeUndefined();
      expect(shaped.cssLevel).toBe(0);
    });

    it('returns visible text and level 1 css subset', () => {
      const element = createMockElement();
      element.textVariants!.visible = 'Visible text only';
      element.textVariants!.full = 'Visible text only with hidden';
      const shaped = shapeElementForDetail(element, 'visible', 1);

      expect(shaped.innerText).toBe('Visible text only');
      expect(shaped.textContent).toBeUndefined();
      expect(shaped.cssProperties).toBeDefined();
      expect(Object.keys(shaped.cssProperties!)).toContain('display');
      expect(Object.keys(shaped.cssProperties!)).not.toContain('marginTop');
    });

    it('returns full css when level 3 requested', () => {
      const element = createMockElement();
      element.cssComputed = {
        ...element.cssProperties!,
        marginTop: '5px',
      };

      const shaped = shapeElementForDetail(element, 'full', 3);
      expect(shaped.cssProperties).toEqual({
        ...element.cssComputed,
      });
      expect(shaped.textContent).toBe(element.textVariants!.full);
    });
  });
});
