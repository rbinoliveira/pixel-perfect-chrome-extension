# Task ID: 4

**Title:** Implement CSS Property Extractor

**Status:** done

**Dependencies:** 2 ✓

**Priority:** high

**Description:** Create the core CSS extraction logic that retrieves computed styles from DOM elements and structures them according to the defined TypeScript interfaces

**Details:**

1. Create content/extractor.ts:
```typescript
import { CSSProperties, Typography, Spacing, Dimensions, Borders, Layout, InspectedElement } from '../shared/types';
import { parseUnit, generateUniqueId } from '../shared/utils';

export class CSSExtractor {
  extractProperties(element: HTMLElement): CSSProperties {
    const computed = window.getComputedStyle(element);
    
    return {
      typography: this.extractTypography(computed),
      spacing: this.extractSpacing(computed),
      dimensions: this.extractDimensions(element, computed),
      borders: this.extractBorders(computed),
      layout: this.extractLayout(computed)
    };
  }
  
  private extractTypography(computed: CSSStyleDeclaration): Typography {
    const fontSize = parseUnit(computed.fontSize);
    const lineHeight = parseUnit(computed.lineHeight);
    
    return {
      fontFamily: computed.fontFamily,
      fontSize,
      fontWeight: computed.fontWeight,
      lineHeight,
      color: this.rgbToHex(computed.color),
      letterSpacing: computed.letterSpacing !== 'normal' ? computed.letterSpacing : undefined,
      textTransform: computed.textTransform !== 'none' ? computed.textTransform : undefined
    };
  }
  
  private extractSpacing(computed: CSSStyleDeclaration): Spacing {
    return {
      padding: {
        top: computed.paddingTop,
        right: computed.paddingRight,
        bottom: computed.paddingBottom,
        left: computed.paddingLeft
      },
      margin: {
        top: computed.marginTop,
        right: computed.marginRight,
        bottom: computed.marginBottom,
        left: computed.marginLeft
      },
      gap: computed.gap !== 'normal' ? computed.gap : undefined
    };
  }
  
  private extractDimensions(element: HTMLElement, computed: CSSStyleDeclaration): Dimensions {
    const rect = element.getBoundingClientRect();
    
    return {
      width: {
        value: parseFloat(computed.width),
        unit: parseUnit(computed.width).unit,
        computed: rect.width
      },
      height: {
        value: parseFloat(computed.height),
        unit: parseUnit(computed.height).unit,
        computed: rect.height
      },
      minWidth: computed.minWidth !== 'none' ? computed.minWidth : undefined,
      maxWidth: computed.maxWidth !== 'none' ? computed.maxWidth : undefined,
      minHeight: computed.minHeight !== 'none' ? computed.minHeight : undefined,
      maxHeight: computed.maxHeight !== 'none' ? computed.maxHeight : undefined
    };
  }
  
  private extractBorders(computed: CSSStyleDeclaration): Borders {
    return {
      borderRadius: {
        topLeft: computed.borderTopLeftRadius,
        topRight: computed.borderTopRightRadius,
        bottomRight: computed.borderBottomRightRadius,
        bottomLeft: computed.borderBottomLeftRadius
      },
      border: {
        width: computed.borderWidth,
        style: computed.borderStyle,
        color: this.rgbToHex(computed.borderColor)
      }
    };
  }
  
  private extractLayout(computed: CSSStyleDeclaration): Layout {
    const layout: Layout = {
      display: computed.display,
      position: computed.position
    };
    
    if (computed.display === 'flex' || computed.display === 'inline-flex') {
      layout.flexDirection = computed.flexDirection;
      layout.justifyContent = computed.justifyContent;
      layout.alignItems = computed.alignItems;
    }
    
    return layout;
  }
  
  private rgbToHex(rgb: string): string {
    const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (!match) return rgb;
    
    const hex = (x: string) => ("0" + parseInt(x).toString(16)).slice(-2);
    return "#" + hex(match[1]) + hex(match[2]) + hex(match[3]);
  }
  
  createInspectedElement(element: HTMLElement): InspectedElement {
    const rect = element.getBoundingClientRect();
    
    return {
      id: generateUniqueId(),
      timestamp: Date.now(),
      selector: this.generateSelector(element),
      tagName: element.tagName.toLowerCase(),
      className: element.className,
      properties: this.extractProperties(element),
      position: {
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY,
        width: rect.width,
        height: rect.height
      }
    };
  }
  
  private generateSelector(element: HTMLElement): string {
    if (element.id) return `#${element.id}`;
    if (element.className) {
      const classes = element.className.split(' ').filter(c => c).join('.');
      return `${element.tagName.toLowerCase()}.${classes}`;
    }
    return element.tagName.toLowerCase();
  }
}
```
2. Implement parseUnit() in shared/utils.ts:
```typescript
export function parseUnit(value: string): { value: number; unit: string } {
  const match = value.match(/^([\d.]+)([a-z%]*)$/);
  if (!match) return { value: 0, unit: '' };
  return {
    value: parseFloat(match[1]),
    unit: match[2] || 'px'
  };
}
```

**Test Strategy:**

1. Unit test extractProperties() with mock DOM elements
2. Test each extraction method (typography, spacing, dimensions, borders, layout) independently
3. Verify rgbToHex() converts colors correctly
4. Test with elements having various CSS properties (flex, grid, positioned elements)
5. Verify computed values match actual rendered values
6. Test edge cases: elements with no styles, inline styles, inherited styles
7. Performance test: extraction should complete in < 50ms
