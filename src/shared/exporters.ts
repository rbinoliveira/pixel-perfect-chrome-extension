import { InspectedElement, CSSProperties } from './types';

export class DataExporter {
  static toJSON(element: InspectedElement): string {
    return JSON.stringify(element, null, 2);
  }

  static toCSS(element: InspectedElement): string {
    const { properties } = element;
    const lines: string[] = [];

    lines.push(`${element.selector} {`);

    // Typography
    const t = properties.typography;
    lines.push(`  font-family: ${t.fontFamily};`);
    lines.push(`  font-size: ${t.fontSize.value}${t.fontSize.unit};`);
    lines.push(`  font-weight: ${t.fontWeight};`);
    lines.push(`  line-height: ${t.lineHeight.value}${t.lineHeight.unit};`);
    lines.push(`  color: ${t.color};`);
    if (t.letterSpacing) lines.push(`  letter-spacing: ${t.letterSpacing};`);
    if (t.textTransform) lines.push(`  text-transform: ${t.textTransform};`);

    // Dimensions
    const d = properties.dimensions;
    lines.push(`  width: ${d.width.value}${d.width.unit};`);
    lines.push(`  height: ${d.height.value}${d.height.unit};`);
    if (d.minWidth) lines.push(`  min-width: ${d.minWidth};`);
    if (d.maxWidth) lines.push(`  max-width: ${d.maxWidth};`);

    // Spacing
    const s = properties.spacing;
    const padding = this.formatSpacingForCSS('padding', s.padding);
    const margin = this.formatSpacingForCSS('margin', s.margin);
    lines.push(`  ${padding}`);
    lines.push(`  ${margin}`);
    if (s.gap) lines.push(`  gap: ${s.gap};`);

    // Borders
    const b = properties.borders;
    if (this.isUniformBorderRadius(b.borderRadius)) {
      lines.push(`  border-radius: ${b.borderRadius.topLeft};`);
    } else {
      lines.push(
        `  border-radius: ${b.borderRadius.topLeft} ${b.borderRadius.topRight} ${b.borderRadius.bottomRight} ${b.borderRadius.bottomLeft};`
      );
    }
    lines.push(`  border: ${b.border.width} ${b.border.style} ${b.border.color};`);

    // Layout
    if (properties.layout) {
      const l = properties.layout;
      lines.push(`  display: ${l.display};`);
      lines.push(`  position: ${l.position};`);
      if (l.flexDirection) lines.push(`  flex-direction: ${l.flexDirection};`);
      if (l.justifyContent) lines.push(`  justify-content: ${l.justifyContent};`);
      if (l.alignItems) lines.push(`  align-items: ${l.alignItems};`);
    }

    lines.push('}');
    return lines.join('\n');
  }

  private static formatSpacingForCSS(property: string, spacing: any): string {
    const { top, right, bottom, left } = spacing;

    if (top === right && right === bottom && bottom === left) {
      return `${property}: ${top};`;
    }

    if (top === bottom && left === right) {
      return `${property}: ${top} ${right};`;
    }

    return `${property}: ${top} ${right} ${bottom} ${left};`;
  }

  private static isUniformBorderRadius(radius: any): boolean {
    const { topLeft, topRight, bottomRight, bottomLeft } = radius;
    return (
      topLeft === topRight &&
      topRight === bottomRight &&
      bottomRight === bottomLeft
    );
  }

  static downloadFile(content: string, filename: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
