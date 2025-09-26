import { JSDOM } from 'jsdom';

export function extractFromHTML(html: string) {
  const warnings: string[] = [];

  try {
    const fragment = JSDOM.fragment(html);
    const element = fragment.firstChild as Element;

    if (!element) {
      warnings.push('No element found in HTML');
      return { element: null, warnings };
    }

    return { element, warnings };
  } catch (error) {
    warnings.push(`HTML parsing failed: ${(error as Error).message}`);
    return { element: null, warnings };
  }
}

export function generateSelector(element: Element): string {
  let selector = element.tagName.toLowerCase();

  if (element.id) {
    selector += `#${element.id}`;
  }

  if (element.classList.length > 0) {
    selector += `.${Array.from(element.classList).join('.')}`;
  }

  return selector;
}
