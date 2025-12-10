# Task ID: 8

**Title:** Implement Copy and Export Functionality

**Status:** done

**Dependencies:** 7 ✓

**Priority:** medium

**Description:** Add functionality to copy individual properties, copy all properties, and export data in JSON and CSS formats

**Details:**

1. Create shared/clipboard.ts:
```typescript
export class ClipboardManager {
  static async copyToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      return success;
    }
  }
  
  static showCopyFeedback(button: HTMLElement) {
    const originalText = button.textContent;
    button.textContent = '✓';
    button.style.color = '#00C853';
    setTimeout(() => {
      button.textContent = originalText;
      button.style.color = '';
    }, 1000);
  }
}
```
2. Create shared/exporters.ts:
```typescript
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
      lines.push(`  border-radius: ${b.borderRadius.topLeft} ${b.borderRadius.topRight} ${b.borderRadius.bottomRight} ${b.borderRadius.bottomLeft};`);
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
    return topLeft === topRight && topRight === bottomRight && bottomRight === bottomLeft;
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
```
3. Update inspector.ts setupCopyButtons method:
```typescript
private setupCopyButtons(panel: HTMLElement, element: InspectedElement) {
  // Individual property copy buttons
  panel.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const target = e.target as HTMLElement;
      const value = target.getAttribute('data-value');
      if (value) {
        await ClipboardManager.copyToClipboard(value);
        ClipboardManager.showCopyFeedback(target);
      }
    });
  });
  
  // Copy all button
  const copyAllBtn = panel.querySelector('#copy-all');
  copyAllBtn?.addEventListener('click', async () => {
    const cssText = DataExporter.toCSS(element);
    await ClipboardManager.copyToClipboard(cssText);
    ClipboardManager.showCopyFeedback(copyAllBtn as HTMLElement);
  });
  
  // Export JSON button
  const exportJsonBtn = panel.querySelector('#export-json');
  exportJsonBtn?.addEventListener('click', () => {
    const json = DataExporter.toJSON(element);
    const filename = `${element.selector.replace(/[^a-z0-9]/gi, '-')}-${Date.now()}.json`;
    DataExporter.downloadFile(json, filename, 'application/json');
  });
  
  // Export CSS button
  const exportCssBtn = panel.querySelector('#export-css');
  exportCssBtn?.addEventListener('click', () => {
    const css = DataExporter.toCSS(element);
    const filename = `${element.selector.replace(/[^a-z0-9]/gi, '-')}-${Date.now()}.css`;
    DataExporter.downloadFile(css, filename, 'text/css');
  });
}
```

**Test Strategy:**

1. Test copying individual properties shows feedback and copies to clipboard
2. Test 'Copy All' button generates valid CSS and copies to clipboard
3. Test JSON export downloads valid JSON file
4. Test CSS export downloads valid CSS file
5. Verify exported CSS is properly formatted and usable
6. Test clipboard fallback for browsers without Clipboard API
7. Verify copy feedback animation works (checkmark appears for 1 second)
8. Test with various element types and property combinations
9. Verify exported filenames are valid and include timestamp
10. Test that exported CSS can be pasted into a stylesheet and works correctly
