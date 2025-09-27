import type { ComponentInfo, ElementPosition, CSSProperties } from './element';

export interface TargetedElement {
  selector: string;
  tagName: string;
  id?: string;
  classes: string[];
  innerText?: string;
  textContent?: string;
  textDetail?: 'full' | 'visible' | 'none';
  attributes: Record<string, string>;
  position: ElementPosition;
  cssLevel?: 0 | 1 | 2 | 3;
  cssProperties?: CSSProperties;
  cssComputed?: Record<string, string>;
  componentInfo?: ComponentInfo;
  timestamp: number;
  url: string;
}
