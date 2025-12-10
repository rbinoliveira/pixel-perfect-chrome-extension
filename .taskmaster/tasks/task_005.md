# Task ID: 5

**Title:** Implement Visual Overlay and Hover Highlighting

**Status:** done

**Dependencies:** 2 ✓

**Priority:** high

**Description:** Create the visual overlay system that highlights elements on hover with colored borders and tooltips showing basic element information

**Details:**

1. Create content/overlay.ts:
```typescript
import { OVERLAY_COLOR, OVERLAY_WIDTH } from '../shared/constants';

export class OverlayManager {
  private overlayElement: HTMLDivElement | null = null;
  private tooltipElement: HTMLDivElement | null = null;
  private isActive = false;
  
  constructor() {
    this.createOverlayElements();
  }
  
  private createOverlayElements() {
    // Create overlay border
    this.overlayElement = document.createElement('div');
    this.overlayElement.id = 'pixel-perfect-overlay';
    this.overlayElement.style.cssText = `
      position: absolute;
      pointer-events: none;
      border: 2px solid #007AFF;
      z-index: 2147483647;
      display: none;
      box-sizing: border-box;
    `;
    
    // Create tooltip
    this.tooltipElement = document.createElement('div');
    this.tooltipElement.id = 'pixel-perfect-tooltip';
    this.tooltipElement.style.cssText = `
      position: absolute;
      pointer-events: none;
      background: #007AFF;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 12px;
      z-index: 2147483647;
      display: none;
      white-space: nowrap;
    `;
    
    document.body.appendChild(this.overlayElement);
    document.body.appendChild(this.tooltipElement);
  }
  
  activate() {
    this.isActive = true;
  }
  
  deactivate() {
    this.isActive = false;
    this.hide();
  }
  
  showOnElement(element: HTMLElement) {
    if (!this.isActive || !this.overlayElement || !this.tooltipElement) return;
    
    const rect = element.getBoundingClientRect();
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    
    // Position overlay
    this.overlayElement.style.display = 'block';
    this.overlayElement.style.left = `${rect.left + scrollX}px`;
    this.overlayElement.style.top = `${rect.top + scrollY}px`;
    this.overlayElement.style.width = `${rect.width}px`;
    this.overlayElement.style.height = `${rect.height}px`;
    
    // Position tooltip
    const tooltipText = `<${element.tagName.toLowerCase()}> ${Math.round(rect.width)}×${Math.round(rect.height)}px`;
    this.tooltipElement.textContent = tooltipText;
    this.tooltipElement.style.display = 'block';
    
    // Position tooltip above element, or below if not enough space
    const tooltipTop = rect.top + scrollY - 30;
    if (tooltipTop < scrollY) {
      this.tooltipElement.style.top = `${rect.bottom + scrollY + 5}px`;
    } else {
      this.tooltipElement.style.top = `${tooltipTop}px`;
    }
    this.tooltipElement.style.left = `${rect.left + scrollX}px`;
  }
  
  hide() {
    if (this.overlayElement) this.overlayElement.style.display = 'none';
    if (this.tooltipElement) this.tooltipElement.style.display = 'none';
  }
  
  destroy() {
    this.overlayElement?.remove();
    this.tooltipElement?.remove();
  }
}
```
2. Add constants to shared/constants.ts:
```typescript
export const OVERLAY_COLOR = '#007AFF';
export const OVERLAY_WIDTH = 2;
export const OVERLAY_Z_INDEX = 2147483647;
```
3. Create content/overlay.css for additional styling if needed

**Test Strategy:**

1. Test overlay appears on hover with correct positioning
2. Verify overlay follows element dimensions accurately
3. Test tooltip displays correct tag name and dimensions
4. Test tooltip positioning (above/below element based on space)
5. Verify overlay doesn't interfere with page interactions (pointer-events: none)
6. Test with scrolled pages (overlay should account for scroll position)
7. Test with fixed/absolute positioned elements
8. Verify high z-index ensures overlay is always visible
9. Test performance: hover should feel instant (< 16ms response time)
