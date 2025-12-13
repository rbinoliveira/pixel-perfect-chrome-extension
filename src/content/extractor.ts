import {
  CSSProperties,
  Typography,
  Spacing,
  Dimensions,
  Borders,
  Layout,
  InspectedElement,
} from '../shared/types';
import { parseUnit, generateUniqueId } from '../shared/utils';

// ============================================================
// CSS EXTRACTOR
// ============================================================

export class CSSExtractor {
  extractProperties(element: HTMLElement): CSSProperties {
    const computed = window.getComputedStyle(element);

    return {
      typography: this.extractTypography(computed),
      spacing: this.extractSpacing(computed),
      dimensions: this.extractDimensions(element, computed),
      borders: this.extractBorders(computed),
      layout: this.extractLayout(computed),
    };
  }

  createInspectedElement(element: HTMLElement): InspectedElement {
    const rect = element.getBoundingClientRect();

    return {
      id: generateUniqueId(),
      timestamp: Date.now(),
      selector: this.generateSelector(element),
      tagName: element.tagName.toLowerCase(),
      className: element.className || '',
      properties: this.extractProperties(element),
      position: {
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY,
        width: rect.width,
        height: rect.height,
      },
    };
  }

  // ============================================================
  // PROPERTY EXTRACTORS
  // ============================================================

  private extractTypography(computed: CSSStyleDeclaration): Typography {
    return {
      fontFamily: computed.fontFamily,
      fontSize: parseUnit(computed.fontSize),
      fontWeight: computed.fontWeight,
      lineHeight: parseUnit(computed.lineHeight),
      color: this.rgbToHex(computed.color),
      letterSpacing: computed.letterSpacing !== 'normal' ? computed.letterSpacing : undefined,
      textTransform: computed.textTransform !== 'none' ? computed.textTransform : undefined,
    };
  }

  private extractSpacing(computed: CSSStyleDeclaration): Spacing {
    return {
      padding: {
        top: computed.paddingTop,
        right: computed.paddingRight,
        bottom: computed.paddingBottom,
        left: computed.paddingLeft,
      },
      margin: {
        top: computed.marginTop,
        right: computed.marginRight,
        bottom: computed.marginBottom,
        left: computed.marginLeft,
      },
      gap: computed.gap !== 'normal' ? computed.gap : undefined,
    };
  }

  private extractDimensions(element: HTMLElement, computed: CSSStyleDeclaration): Dimensions {
    const rect = element.getBoundingClientRect();
    const width = parseUnit(computed.width);
    const height = parseUnit(computed.height);

    return {
      width: {
        value: width.value,
        unit: width.unit,
        computed: rect.width,
      },
      height: {
        value: height.value,
        unit: height.unit,
        computed: rect.height,
      },
      minWidth: computed.minWidth !== 'none' ? computed.minWidth : undefined,
      maxWidth: computed.maxWidth !== 'none' ? computed.maxWidth : undefined,
      minHeight: computed.minHeight !== 'none' ? computed.minHeight : undefined,
      maxHeight: computed.maxHeight !== 'none' ? computed.maxHeight : undefined,
    };
  }

  private extractBorders(computed: CSSStyleDeclaration): Borders {
    return {
      borderRadius: {
        topLeft: computed.borderTopLeftRadius,
        topRight: computed.borderTopRightRadius,
        bottomRight: computed.borderBottomRightRadius,
        bottomLeft: computed.borderBottomLeftRadius,
      },
      border: {
        width: computed.borderWidth,
        style: computed.borderStyle,
        color: this.rgbToHex(computed.borderColor),
      },
    };
  }

  private extractLayout(computed: CSSStyleDeclaration): Layout {
    const layout: Layout = {
      display: computed.display,
      position: computed.position,
    };

    const isFlex = computed.display === 'flex' || computed.display === 'inline-flex';
    if (isFlex) {
      layout.flexDirection = computed.flexDirection;
      layout.justifyContent = computed.justifyContent;
      layout.alignItems = computed.alignItems;
    }

    return layout;
  }

  // ============================================================
  // HELPERS
  // ============================================================

  private rgbToHex(rgb: string): string {
    const rgbMatch = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (rgbMatch) {
      return this.convertToHex(rgbMatch[1], rgbMatch[2], rgbMatch[3]);
    }

    const rgbaMatch = rgb.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)$/);
    if (rgbaMatch) {
      return this.convertToHex(rgbaMatch[1], rgbaMatch[2], rgbaMatch[3]);
    }

    return rgb;
  }

  private convertToHex(r: string, g: string, b: string): string {
    const toHex = (x: string) => ('0' + parseInt(x).toString(16)).slice(-2);
    return '#' + toHex(r) + toHex(g) + toHex(b);
  }

  private generateSelector(element: HTMLElement): string {
    if (element.id) {
      return `#${element.id}`;
    }

    if (element.className) {
      const classes = element.className.split(' ').filter(c => c).join('.');
      return `${element.tagName.toLowerCase()}.${classes}`;
    }

    return element.tagName.toLowerCase();
  }
}
