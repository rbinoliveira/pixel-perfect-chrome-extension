import { OVERLAY_WIDTH, OVERLAY_Z_INDEX, getCurrentTheme, getOverlayColor, ColorOption } from '../shared/constants';

// ============================================================
// OVERLAY MANAGER
// ============================================================

export class OverlayManager {
  private overlayElement: HTMLDivElement | null = null;
  private paddingElement: HTMLDivElement | null = null;
  private tooltipElement: HTMLDivElement | null = null;
  private isActive = false;
  private selectedColorName: string = 'purple';
  private currentColor: ColorOption;
  private fontSize: number = 12;
  private isDarkMode: boolean = false;
  private darkModeMediaQuery: MediaQueryList | null = null;

  constructor() {
    this.detectDarkMode();
    this.currentColor = getOverlayColor(this.selectedColorName, this.isDarkMode ? 'dark' : 'light');
    this.createOverlayElements();
    this.setupDarkModeListener();
  }

  // ============================================================
  // THEME DETECTION
  // ============================================================

  private detectDarkMode() {
    this.isDarkMode = getCurrentTheme() === 'dark';
  }

  private setupDarkModeListener() {
    if (window.matchMedia) {
      this.darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.darkModeMediaQuery.addEventListener('change', (e) => {
        this.isDarkMode = e.matches;
        this.updateColorTheme();
      });
    }
  }

  // ============================================================
  // COLOR & FONT CONFIGURATION
  // ============================================================

  updateColorSelection(colorName: string) {
    this.selectedColorName = colorName;
    this.updateColorTheme();
  }

  private updateColorTheme() {
    const theme = this.isDarkMode ? 'dark' : 'light';
    this.currentColor = getOverlayColor(this.selectedColorName, theme);
    this.updateOverlayStyles();
  }

  private getTextColor(): string {
    return this.isDarkMode ? '#f5f5f5' : '#1e1b2e';
  }

  private updateTooltipTheme() {
    if (!this.tooltipElement) return;

    if (this.isDarkMode) {
      // Dark mode: dark background, light text
      this.tooltipElement.style.background = 'rgba(30, 27, 46, 0.98)';
      this.tooltipElement.style.color = '#f5f5f5';
    } else {
      // Light mode: light background, dark text
      this.tooltipElement.style.background = 'rgba(255, 255, 255, 0.98)';
      this.tooltipElement.style.color = '#1e1b2e';
    }

    // Update shadow color based on current color
    const rgb = this.hexToRgb(this.currentColor.value);
    if (rgb) {
      this.tooltipElement.style.boxShadow = this.isDarkMode
        ? `0 4px 12px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`
        : `0 4px 12px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`;
    }
  }

  updateFontSize(size: number) {
    this.fontSize = size;
    if (this.tooltipElement) {
      this.tooltipElement.style.fontSize = `${size}px`;
      // Update padding and border-radius proportionally
      const scale = size / 12; // 12px is the base size
      this.tooltipElement.style.padding = `${Math.round(8 * scale)}px ${Math.round(12 * scale)}px`;
      this.tooltipElement.style.borderRadius = `${Math.round(6 * scale)}px`;
      this.tooltipElement.style.borderWidth = `${Math.round(2 * scale)}px`;
    }
  }

  private updateOverlayStyles() {
    if (this.overlayElement) {
      this.overlayElement.style.borderColor = this.currentColor.value;
    }
    if (this.tooltipElement) {
      this.tooltipElement.style.borderColor = this.currentColor.value;
      // Update theme-aware colors
      this.updateTooltipTheme();
    }
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  private createOverlayElements() {
    // Create overlay border
    this.overlayElement = document.createElement('div');
    this.overlayElement.id = 'pixel-perfect-overlay';
    this.overlayElement.style.cssText = `
      position: absolute;
      pointer-events: none;
      border: ${OVERLAY_WIDTH}px solid ${this.currentColor.value};
      z-index: ${OVERLAY_Z_INDEX};
      display: none;
      box-sizing: border-box;
    `;

    // Create padding indicator (inner overlay) - using green (tertiary color)
    this.paddingElement = document.createElement('div');
    this.paddingElement.id = 'pixel-perfect-padding';
    this.paddingElement.style.cssText = `
      position: absolute;
      pointer-events: none;
      background: rgba(16, 185, 129, 0.25);
      border: 1px dashed rgba(16, 185, 129, 0.7);
      z-index: ${OVERLAY_Z_INDEX - 1};
      display: none;
      box-sizing: border-box;
    `;

    // Create tooltip with theme-aware colors
    this.tooltipElement = document.createElement('div');
    this.tooltipElement.id = 'pixel-perfect-tooltip';

    // Set base styles
    this.tooltipElement.style.cssText = `
      position: absolute;
      pointer-events: none;
      padding: 8px 12px;
      border-radius: 6px;
      border: 2px solid ${this.currentColor.value};
      font-family: monospace;
      font-size: ${this.fontSize}px;
      z-index: ${OVERLAY_Z_INDEX};
      display: none;
      white-space: nowrap;
    `;

    // Apply theme-aware colors
    const rgb = this.hexToRgb(this.currentColor.value);
    if (this.isDarkMode) {
      this.tooltipElement.style.background = 'rgba(30, 27, 46, 0.98)';
      this.tooltipElement.style.color = '#f5f5f5';
      this.tooltipElement.style.boxShadow = rgb ? `0 4px 12px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)` : '0 4px 12px rgba(0, 0, 0, 0.5)';
    } else {
      this.tooltipElement.style.background = 'rgba(255, 255, 255, 0.98)';
      this.tooltipElement.style.color = '#1e1b2e';
      this.tooltipElement.style.boxShadow = rgb ? `0 4px 12px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)` : '0 4px 12px rgba(0, 0, 0, 0.3)';
    }

    document.body.appendChild(this.overlayElement);
    document.body.appendChild(this.paddingElement);
    document.body.appendChild(this.tooltipElement);
  }

  activate() {
    this.isActive = true;
  }

  deactivate() {
    this.isActive = false;
    this.hide();
  }

  // ============================================================
  // ELEMENT ANALYSIS
  // ============================================================

  private hasDirectTextContent(element: HTMLElement): boolean {
    for (let i = 0; i < element.childNodes.length; i++) {
      const node = element.childNodes[i];

      if (node.nodeType === 3) {
        const text = (node.textContent || '').trim();
        if (text.length > 0) {
          return true;
        }
      }
    }

    return false;
  }

  private formatPadding(computed: CSSStyleDeclaration): string {
    const { paddingTop: top, paddingRight: right, paddingBottom: bottom, paddingLeft: left } = computed;

    if (top === right && right === bottom && bottom === left) {
      return top;
    }
    if (top === bottom && left === right) {
      return `${top} ${right}`;
    }
    return `${top} ${right} ${bottom} ${left}`;
  }

  private formatBorder(computed: CSSStyleDeclaration): string {
    const width = computed.borderWidth;
    const style = computed.borderStyle;
    const color = this.rgbToHex(computed.borderColor);

    if (width === '0px' || style === 'none') {
      return 'none';
    }

    return `${width} ${style} ${color}`;
  }

  private getFileTypeFromSrc(src: string): string {
    const match = src.match(/\.([a-z0-9]+)(?:\?|$)/i);
    if (match) {
      const ext = match[1].toUpperCase();
      const typeMap: { [key: string]: string } = {
        'JPG': 'JPEG',
        'JPEG': 'JPEG',
        'SVG': 'SVG',
        'WEBP': 'WEBP',
        'PNG': 'PNG',
        'GIF': 'GIF',
        'AVIF': 'AVIF',
      };
      return typeMap[ext] || ext;
    }
    return 'N/A';
  }

  private rgbToHex(rgb: string): string {
    const rgbMatch = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (rgbMatch) {
      const hex = (x: string) => ('0' + parseInt(x).toString(16)).slice(-2);
      return '#' + hex(rgbMatch[1]) + hex(rgbMatch[2]) + hex(rgbMatch[3]);
    }

    const rgbaMatch = rgb.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)$/);
    if (rgbaMatch) {
      const hex = (x: string) => ('0' + parseInt(x).toString(16)).slice(-2);
      return '#' + hex(rgbaMatch[1]) + hex(rgbaMatch[2]) + hex(rgbaMatch[3]);
    }

    return rgb;
  }

  // ============================================================
  // OVERLAY RENDERING
  // ============================================================

  showOnElement(element: HTMLElement) {
    if (!this.isActive || !this.overlayElement || !this.tooltipElement) return;

    const rect = element.getBoundingClientRect();
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const computed = window.getComputedStyle(element);

    // Check if element is an image or SVG
    const isImage = element.tagName.toLowerCase() === 'img';
    const isSVG = element.tagName.toLowerCase() === 'svg';

    // Check if element has direct text content
    const hasText = !isImage && !isSVG && this.hasDirectTextContent(element);

    // Get border-radius and padding
    const borderRadius = computed.borderRadius;
    const paddingTop = parseFloat(computed.paddingTop) || 0;
    const paddingRight = parseFloat(computed.paddingRight) || 0;
    const paddingBottom = parseFloat(computed.paddingBottom) || 0;
    const paddingLeft = parseFloat(computed.paddingLeft) || 0;
    const hasPadding = paddingTop > 0 || paddingRight > 0 || paddingBottom > 0 || paddingLeft > 0;
    const hasBorderRadius = borderRadius && borderRadius !== '0px' && borderRadius !== 'none';

    // Position overlay with border-radius if present
    this.overlayElement.style.display = 'block';
    this.overlayElement.style.left = `${rect.left + scrollX}px`;
    this.overlayElement.style.top = `${rect.top + scrollY}px`;
    this.overlayElement.style.width = `${rect.width}px`;
    this.overlayElement.style.height = `${rect.height}px`;
    this.overlayElement.style.borderRadius = hasBorderRadius ? borderRadius : '0';

    // Show padding indicator if padding exists
    if (hasPadding && this.paddingElement) {
      this.paddingElement.style.display = 'block';
      this.paddingElement.style.left = `${rect.left + scrollX + paddingLeft}px`;
      this.paddingElement.style.top = `${rect.top + scrollY + paddingTop}px`;
      this.paddingElement.style.width = `${rect.width - paddingLeft - paddingRight}px`;
      this.paddingElement.style.height = `${rect.height - paddingTop - paddingBottom}px`;

      // Apply border-radius to padding indicator if element has it
      if (hasBorderRadius) {
        // Calculate inner border-radius (subtract padding from border-radius)
        const innerBorderRadius = this.calculateInnerBorderRadius(
          borderRadius,
          paddingTop,
          paddingRight,
          paddingBottom,
          paddingLeft
        );
        this.paddingElement.style.borderRadius = innerBorderRadius;
      } else {
        this.paddingElement.style.borderRadius = '0';
      }
    } else if (this.paddingElement) {
      this.paddingElement.style.display = 'none';
    }

    // Create tooltip - show different info based on element type
    // Calculate scaled values based on fontSize
    const scale = this.fontSize / 12; // 12px is the base size
    const headerFontSize = Math.round((this.fontSize + 1) * 10) / 10; // Header slightly larger
    const detailFontSize = Math.round((this.fontSize - 1) * 10) / 10; // Details slightly smaller
    const marginBottom = Math.round(6 * scale);
    const smallMarginBottom = Math.round(3 * scale);

    let tooltipHTML = `
      <div style="line-height: 1.4;">
        <div style="font-weight: 600; margin-bottom: ${marginBottom}px; color: ${this.currentColor.value}; font-size: ${headerFontSize}px;">
          &lt;${element.tagName.toLowerCase()}&gt; ${Math.round(rect.width)}×${Math.round(rect.height)}px
        </div>
    `;

    if (isImage) {
      // For images, show detailed info
      const imgElement = element as HTMLImageElement;
      const src = imgElement.src || imgElement.getAttribute('src') || 'N/A';
      const alt = imgElement.alt || imgElement.getAttribute('alt') || 'N/A';

      // Get natural size
      const naturalWidth = imgElement.naturalWidth || 0;
      const naturalHeight = imgElement.naturalHeight || 0;
      const naturalSize = naturalWidth > 0 && naturalHeight > 0
        ? `${naturalWidth}×${naturalHeight}px`
        : 'N/A';

      // Get object-fit
      const objectFit = computed.objectFit || 'fill';

      // Get file type from src
      const fileType = src !== 'N/A' ? this.getFileTypeFromSrc(src) : 'N/A';

      // Truncate src for display
      const displaySrc = src.length > 40 ? src.substring(0, 37) + '...' : src;

      tooltipHTML += `
        <div style="font-size: ${detailFontSize}px; line-height: 1.5; color: ${this.getTextColor()};">
          <div style="word-break: break-word; overflow-wrap: break-word; margin-bottom: ${smallMarginBottom}px;">
            natural: <strong style="color: ${this.currentColor.value};">${naturalSize}</strong>
          </div>
          <div style="word-break: break-word; overflow-wrap: break-word; margin-bottom: ${smallMarginBottom}px;">
            type: <strong style="color: ${this.currentColor.value};">${fileType}</strong>
          </div>
          <div style="word-break: break-word; overflow-wrap: break-word; margin-bottom: ${smallMarginBottom}px;">
            object-fit: <strong style="color: ${this.currentColor.value};">${objectFit}</strong>
          </div>
          <div style="word-break: break-all; overflow-wrap: break-word; margin-bottom: ${smallMarginBottom}px;">
            src: <strong style="word-break: break-all; overflow-wrap: break-word; color: ${this.currentColor.value};">${displaySrc}</strong>
          </div>
          ${alt !== 'N/A' ? `<div style="word-break: break-word; overflow-wrap: break-word;">alt: <strong style="color: ${this.currentColor.value};">${alt}</strong></div>` : ''}
        </div>
      `;
    } else if (isSVG) {
      // For SVG, show detailed info
      const svgElement = element as SVGSVGElement;

      // Get viewBox
      let viewBox = 'N/A';
      if (svgElement.viewBox?.baseVal) {
        const vb = svgElement.viewBox.baseVal;
        viewBox = `${vb.x} ${vb.y} ${vb.width} ${vb.height}`;
      } else {
        const viewBoxAttr = svgElement.getAttribute('viewBox');
        if (viewBoxAttr) {
          viewBox = viewBoxAttr;
        }
      }

      // Get fill
      const fill = computed.fill || 'none';
      const fillColor = fill === 'currentColor'
        ? `currentColor (${computed.color})`
        : fill;

      // Get stroke
      const stroke = computed.stroke || 'none';
      const strokeWidth = computed.strokeWidth || '0';
      const strokeInfo = stroke !== 'none' && stroke !== 'transparent'
        ? `${stroke} / ${strokeWidth}`
        : 'none';

      // Get preserveAspectRatio
      const preserveAspectRatio = svgElement.getAttribute('preserveAspectRatio') || 'xMidYMid meet';
      const aspectRatio = preserveAspectRatio.includes('meet')
        ? 'meet (proporcional)'
        : preserveAspectRatio.includes('slice')
        ? 'slice (cortado)'
        : preserveAspectRatio.includes('none')
        ? 'none (esticado)'
        : preserveAspectRatio;

      tooltipHTML += `
        <div style="font-size: ${detailFontSize}px; line-height: 1.5; color: ${this.getTextColor()};">
          <div style="word-break: break-word; overflow-wrap: break-word; margin-bottom: ${smallMarginBottom}px;">
            viewBox: <strong style="color: ${this.currentColor.value};">${viewBox}</strong>
          </div>
          <div style="word-break: break-word; overflow-wrap: break-word; margin-bottom: ${smallMarginBottom}px;">
            fill: <strong style="color: ${this.currentColor.value};">${fillColor}</strong>
          </div>
          <div style="word-break: break-word; overflow-wrap: break-word; margin-bottom: ${smallMarginBottom}px;">
            stroke: <strong style="color: ${this.currentColor.value};">${strokeInfo}</strong>
          </div>
          <div style="word-break: break-word; overflow-wrap: break-word;">
            aspect-ratio: <strong style="color: ${this.currentColor.value};">${aspectRatio}</strong>
          </div>
        </div>
      `;
    } else if (hasText) {
      // Extract typography info for tooltip
      const fontSize = computed.fontSize;
      const fontFamily = computed.fontFamily.split(',')[0].replace(/['"]/g, ''); // Get first font, remove quotes
      const color = computed.color;
      const lineHeight = computed.lineHeight;
      const fontWeight = computed.fontWeight;

      tooltipHTML += `
        <div style="font-size: ${detailFontSize}px; line-height: 1.5; color: ${this.getTextColor()};">
          <div style="margin-bottom: ${smallMarginBottom}px;">font-size: <strong style="color: ${this.currentColor.value};">${fontSize}</strong></div>
          <div style="margin-bottom: ${smallMarginBottom}px;">font-family: <strong style="color: ${this.currentColor.value};">${fontFamily}</strong></div>
          <div style="margin-bottom: ${smallMarginBottom}px;">color: <strong style="color: ${this.currentColor.value};">${color}</strong></div>
          <div style="margin-bottom: ${smallMarginBottom}px;">line-height: <strong style="color: ${this.currentColor.value};">${lineHeight}</strong></div>
          <div>font-weight: <strong style="color: ${this.currentColor.value};">${fontWeight}</strong></div>
        </div>
      `;
    } else {
      // Show layout properties for elements without direct text
      // Order: padding, gap, border-radius, border (unified), box-shadow
      const padding = this.formatPadding(computed);
      const gap = computed.gap !== 'normal' && computed.gap !== '0px' ? computed.gap : null;
      const borderRadius = computed.borderRadius;
      const border = this.formatBorder(computed);
      const boxShadow = computed.boxShadow !== 'none' ? computed.boxShadow : null;

      tooltipHTML += `
        <div style="font-size: ${detailFontSize}px; line-height: 1.5; color: ${this.getTextColor()};">
          <div style="margin-bottom: ${smallMarginBottom}px;">padding: <strong style="color: ${this.currentColor.value};">${padding}</strong></div>
          ${gap ? `<div style="margin-bottom: ${smallMarginBottom}px;">gap: <strong style="color: ${this.currentColor.value};">${gap}</strong></div>` : ''}
          <div style="margin-bottom: ${smallMarginBottom}px;">border-radius: <strong style="color: ${this.currentColor.value};">${borderRadius}</strong></div>
          <div style="margin-bottom: ${smallMarginBottom}px;">border: <strong style="color: ${this.currentColor.value};">${border}</strong></div>
          ${boxShadow ? `<div>box-shadow: <strong style="color: ${this.currentColor.value};">${boxShadow}</strong></div>` : ''}
        </div>
      `;
    }

    tooltipHTML += `</div>`;

    this.tooltipElement.innerHTML = tooltipHTML;
    this.tooltipElement.style.display = 'block';
    this.tooltipElement.style.whiteSpace = 'normal';
    this.tooltipElement.style.maxWidth = `${Math.round(300 * scale)}px`;
    this.tooltipElement.style.wordWrap = 'break-word';
    this.tooltipElement.style.overflowWrap = 'break-word';

    // Position tooltip above element, or below if not enough space
    const tooltipHeight = this.tooltipElement.offsetHeight || (isImage ? 140 : isSVG ? 130 : hasText ? 120 : 100);
    const tooltipSpacing = Math.round(10 * scale);
    const tooltipTop = rect.top + scrollY - tooltipHeight - tooltipSpacing;
    if (tooltipTop < scrollY) {
      this.tooltipElement.style.top = `${rect.bottom + scrollY + Math.round(5 * scale)}px`;
    } else {
      this.tooltipElement.style.top = `${tooltipTop}px`;
    }
    this.tooltipElement.style.left = `${rect.left + scrollX}px`;
  }

  private calculateInnerBorderRadius(
    borderRadius: string,
    paddingTop: number,
    paddingRight: number,
    paddingBottom: number,
    paddingLeft: number
  ): string {
    const values = borderRadius.split(/\s+/).map(v => parseFloat(v) || 0);

    if (values.length === 1) {
      const radius = Math.max(0, values[0] - Math.max(paddingTop, paddingRight, paddingBottom, paddingLeft));
      return `${radius}px`;
    } else if (values.length === 2) {
      const radius1 = Math.max(0, values[0] - Math.max(paddingTop, paddingLeft));
      const radius2 = Math.max(0, values[1] - Math.max(paddingTop, paddingRight));
      return `${radius1}px ${radius2}px`;
    } else if (values.length === 4) {
      const topLeft = Math.max(0, values[0] - Math.max(paddingTop, paddingLeft));
      const topRight = Math.max(0, values[1] - Math.max(paddingTop, paddingRight));
      const bottomRight = Math.max(0, values[2] - Math.max(paddingBottom, paddingRight));
      const bottomLeft = Math.max(0, values[3] - Math.max(paddingBottom, paddingLeft));
      return `${topLeft}px ${topRight}px ${bottomRight}px ${bottomLeft}px`;
    }

    return borderRadius;
  }

  // ============================================================
  // PUBLIC CONTROLS
  // ============================================================

  hide() {
    if (this.overlayElement) this.overlayElement.style.display = 'none';
    if (this.paddingElement) this.paddingElement.style.display = 'none';
    if (this.tooltipElement) this.tooltipElement.style.display = 'none';
  }

  destroy() {
    if (this.darkModeMediaQuery) {
      this.darkModeMediaQuery.removeEventListener('change', this.updateTooltipTheme);
    }

    this.overlayElement?.remove();
    this.paddingElement?.remove();
    this.tooltipElement?.remove();
  }
}
