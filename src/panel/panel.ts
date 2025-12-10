import { InspectedElement, CSSProperties } from '../shared/types';

export class PanelRenderer {
  render(element: InspectedElement): string {
    return `
      <div class="panel-header">
        <div class="element-info">
          <h2>Element: &lt;${element.tagName}&gt;</h2>
          ${element.className ? `<p class="class-name">.${element.className}</p>` : ''}
        </div>
        <button class="close-btn" id="close-panel">&times;</button>
      </div>

      <div class="panel-content">
        ${this.renderTypography(element.properties.typography)}
        ${this.renderDimensions(element.properties.dimensions)}
        ${this.renderSpacing(element.properties.spacing)}
        ${this.renderBorders(element.properties.borders)}
        ${element.properties.layout ? this.renderLayout(element.properties.layout) : ''}
      </div>

      <div class="panel-footer">
        <button class="btn btn-primary" id="copy-all">Copy All Properties</button>
        <button class="btn btn-secondary" id="export-json">Export JSON</button>
        <button class="btn btn-secondary" id="export-css">Export CSS</button>
      </div>
    `;
  }

  private renderTypography(typography: any): string {
    return `
      <div class="property-section">
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
      </div>
    `;
  }

  private renderDimensions(dimensions: any): string {
    return `
      <div class="property-section">
        <h3>📏 Dimensions</h3>
        <div class="property-list">
          ${this.renderProperty('Width', `${dimensions.width.value}${dimensions.width.unit} (${Math.round(dimensions.width.computed)}px)`, 'width')}
          ${this.renderProperty('Height', `${dimensions.height.value}${dimensions.height.unit} (${Math.round(dimensions.height.computed)}px)`, 'height')}
          ${dimensions.minWidth ? this.renderProperty('Min Width', dimensions.minWidth, 'minWidth') : ''}
          ${dimensions.maxWidth ? this.renderProperty('Max Width', dimensions.maxWidth, 'maxWidth') : ''}
        </div>
      </div>
    `;
  }

  private renderSpacing(spacing: any): string {
    const paddingShorthand = this.formatSpacing(spacing.padding);
    const marginShorthand = this.formatSpacing(spacing.margin);

    return `
      <div class="property-section">
        <h3>📦 Spacing</h3>
        <div class="property-list">
          ${this.renderProperty('Padding', paddingShorthand, 'padding')}
          ${this.renderProperty('Margin', marginShorthand, 'margin')}
          ${spacing.gap ? this.renderProperty('Gap', spacing.gap, 'gap') : ''}
        </div>
      </div>
    `;
  }

  private renderBorders(borders: any): string {
    return `
      <div class="property-section">
        <h3>🔲 Borders</h3>
        <div class="property-list">
          ${this.renderProperty('Border Radius', borders.borderRadius.topLeft, 'borderRadius')}
          ${this.renderProperty('Border', `${borders.border.width} ${borders.border.style} ${borders.border.color}`, 'border')}
        </div>
      </div>
    `;
  }

  private renderLayout(layout: any): string {
    return `
      <div class="property-section">
        <h3>📐 Layout</h3>
        <div class="property-list">
          ${this.renderProperty('Display', layout.display, 'display')}
          ${this.renderProperty('Position', layout.position, 'position')}
          ${layout.flexDirection ? this.renderProperty('Flex Direction', layout.flexDirection, 'flexDirection') : ''}
          ${layout.justifyContent ? this.renderProperty('Justify Content', layout.justifyContent, 'justifyContent') : ''}
          ${layout.alignItems ? this.renderProperty('Align Items', layout.alignItems, 'alignItems') : ''}
        </div>
      </div>
    `;
  }

  private renderProperty(label: string, value: string, propName: string, colorPreview?: string): string {
    return `
      <div class="property-row">
        <span class="property-label">${label}:</span>
        <span class="property-value">
          ${colorPreview ? `<span class="color-preview" style="background-color: ${colorPreview};"></span>` : ''}
          ${value}
        </span>
        <button class="copy-btn" data-property="${propName}" data-value="${value}" title="Copy property">📋</button>
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
