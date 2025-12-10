# Task ID: 7

**Title:** Build Side Panel UI with Property Display

**Status:** done

**Dependencies:** 6 ✓

**Priority:** medium

**Description:** Create a polished side panel interface that displays extracted CSS properties organized by category with proper formatting and styling

**Details:**

1. Create panel/panel.html (standalone version for testing):
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="panel.css">
</head>
<body>
  <div id="panel-root"></div>
  <script src="panel.js"></script>
</body>
</html>
```
2. Create panel/panel.ts with rendering logic:
```typescript
import { InspectedElement, CSSProperties } from '../shared/types';

export class PanelRenderer {
  render(element: InspectedElement): string {
    return `
      <div class="panel-container">
        <div class="panel-header">
          <div class="element-info">
            <h2>Element: &lt;${element.tagName}&gt;</h2>
            ${element.className ? `<p class="class-name">.${element.className}</p>` : ''}
          </div>
          <button id="close-panel" class="close-btn" aria-label="Close">&times;</button>
        </div>
        
        <div class="panel-content">
          ${this.renderTypography(element.properties.typography)}
          ${this.renderDimensions(element.properties.dimensions)}
          ${this.renderSpacing(element.properties.spacing)}
          ${this.renderBorders(element.properties.borders)}
          ${element.properties.layout ? this.renderLayout(element.properties.layout) : ''}
        </div>
        
        <div class="panel-footer">
          <button id="copy-all" class="btn btn-primary">Copy All Properties</button>
          <button id="export-json" class="btn btn-secondary">Export JSON</button>
          <button id="export-css" class="btn btn-secondary">Export CSS</button>
        </div>
      </div>
    `;
  }
  
  private renderTypography(typography: any): string {
    return `
      <section class="property-section">
        <h3>📝 Typography</h3>
        <div class="property-list">
          ${this.renderProperty('Font Family', typography.fontFamily, 'fontFamily')}
          ${this.renderProperty('Font Size', `${typography.fontSize.value}${typography.fontSize.unit}`, 'fontSize')}
          ${this.renderProperty('Font Weight', typography.fontWeight, 'fontWeight')}
          ${this.renderProperty('Line Height', `${typography.lineHeight.value}${typography.lineHeight.unit}`, 'lineHeight')}
          ${this.renderProperty('Color', typography.color, 'color', typography.color)}
          ${typography.letterSpacing ? this.renderProperty('Letter Spacing', typography.letterSpacing, 'letterSpacing') : ''}
          ${typography.textTransform ? this.renderProperty('Text Transform', typography.textTransform, 'textTransform') : ''}
        </div>
      </section>
    `;
  }
  
  private renderDimensions(dimensions: any): string {
    return `
      <section class="property-section">
        <h3>📏 Dimensions</h3>
        <div class="property-list">
          ${this.renderProperty('Width', `${dimensions.width.value}${dimensions.width.unit} (${Math.round(dimensions.width.computed)}px)`, 'width')}
          ${this.renderProperty('Height', `${dimensions.height.value}${dimensions.height.unit} (${Math.round(dimensions.height.computed)}px)`, 'height')}
          ${dimensions.minWidth ? this.renderProperty('Min Width', dimensions.minWidth, 'minWidth') : ''}
          ${dimensions.maxWidth ? this.renderProperty('Max Width', dimensions.maxWidth, 'maxWidth') : ''}
        </div>
      </section>
    `;
  }
  
  private renderSpacing(spacing: any): string {
    const paddingShorthand = this.formatSpacing(spacing.padding);
    const marginShorthand = this.formatSpacing(spacing.margin);
    
    return `
      <section class="property-section">
        <h3>📦 Spacing</h3>
        <div class="property-list">
          ${this.renderProperty('Padding', paddingShorthand, 'padding')}
          ${this.renderProperty('Margin', marginShorthand, 'margin')}
          ${spacing.gap ? this.renderProperty('Gap', spacing.gap, 'gap') : ''}
        </div>
      </section>
    `;
  }
  
  private renderBorders(borders: any): string {
    return `
      <section class="property-section">
        <h3>🔲 Borders</h3>
        <div class="property-list">
          ${this.renderProperty('Border Radius', borders.borderRadius.topLeft, 'borderRadius')}
          ${this.renderProperty('Border', `${borders.border.width} ${borders.border.style} ${borders.border.color}`, 'border')}
        </div>
      </section>
    `;
  }
  
  private renderLayout(layout: any): string {
    return `
      <section class="property-section">
        <h3>📐 Layout</h3>
        <div class="property-list">
          ${this.renderProperty('Display', layout.display, 'display')}
          ${this.renderProperty('Position', layout.position, 'position')}
          ${layout.flexDirection ? this.renderProperty('Flex Direction', layout.flexDirection, 'flexDirection') : ''}
          ${layout.justifyContent ? this.renderProperty('Justify Content', layout.justifyContent, 'justifyContent') : ''}
          ${layout.alignItems ? this.renderProperty('Align Items', layout.alignItems, 'alignItems') : ''}
        </div>
      </section>
    `;
  }
  
  private renderProperty(label: string, value: string, propName: string, colorPreview?: string): string {
    return `
      <div class="property-row">
        <span class="property-label">${label}:</span>
        <span class="property-value">
          ${colorPreview ? `<span class="color-preview" style="background: ${colorPreview};"></span>` : ''}
          ${value}
        </span>
        <button class="copy-btn" data-property="${propName}" data-value="${value}" title="Copy">📋</button>
      </div>
    `;
  }
  
  private formatSpacing(spacing: any): string {
    const { top, right, bottom, left } = spacing;
    if (top === right && right === bottom && bottom === left) {
      return top;
    }
    if (top === bottom && left === right) {
      return `${top} ${right}`;
    }
    return `${top} ${right} ${bottom} ${left}`;
  }
}
```
3. Create panel/panel.css with modern styling:
```css
.panel-container {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #ffffff;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.panel-header {
  padding: 20px;
  border-bottom: 1px solid #e5e5e5;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.element-info h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
}

.class-name {
  margin: 4px 0 0 0;
  font-size: 14px;
  color: #666;
  font-family: 'Monaco', 'Courier New', monospace;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #666;
  line-height: 1;
  padding: 0;
  width: 32px;
  height: 32px;
}

.close-btn:hover {
  color: #000;
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.property-section {
  margin-bottom: 24px;
}

.property-section h3 {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 12px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.property-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.property-row {
  display: flex;
  align-items: center;
  padding: 8px;
  background: #f9f9f9;
  border-radius: 6px;
  font-size: 13px;
}

.property-label {
  font-weight: 500;
  color: #666;
  min-width: 120px;
}

.property-value {
  flex: 1;
  font-family: 'Monaco', 'Courier New', monospace;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-preview {
  width: 16px;
  height: 16px;
  border-radius: 3px;
  border: 1px solid #ddd;
  display: inline-block;
}

.copy-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  opacity: 0.5;
  padding: 4px;
}

.copy-btn:hover {
  opacity: 1;
}

.panel-footer {
  padding: 20px;
  border-top: 1px solid #e5e5e5;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.btn {
  padding: 10px 16px;
  border-radius: 6px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #007AFF;
  color: white;
}

.btn-primary:hover {
  background: #0051D5;
}

.btn-secondary {
  background: #f0f0f0;
  color: #1a1a1a;
}

.btn-secondary:hover {
  background: #e0e0e0;
}
```
4. Update inspector.ts to use PanelRenderer

**Test Strategy:**

1. Test panel renders all property categories correctly
2. Verify formatting of spacing shorthand (padding/margin)
3. Test color preview squares display correctly
4. Verify responsive layout at different viewport heights
5. Test scrolling works when content exceeds viewport
6. Verify all buttons are clickable and styled correctly
7. Test with elements having minimal CSS vs complex CSS
8. Verify typography, dimensions, spacing, borders, and layout sections all render
9. Test close button functionality
10. Visual QA: ensure design matches PRD mockup
