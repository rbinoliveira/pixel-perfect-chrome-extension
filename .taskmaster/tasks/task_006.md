# Task ID: 6

**Title:** Implement Inspector Content Script with Event Handling

**Status:** done

**Dependencies:** 4 ✓, 5 ✓

**Priority:** high

**Description:** Create the main inspector content script that coordinates hover detection, click handling, and communication with the panel

**Details:**

1. Create content/inspector.ts:
```typescript
import { CSSExtractor } from './extractor';
import { OverlayManager } from './overlay';
import { InspectedElement } from '../shared/types';

class PixelPerfectInspector {
  private extractor: CSSExtractor;
  private overlay: OverlayManager;
  private isEnabled = false;
  private currentElement: HTMLElement | null = null;
  private panelOpen = false;
  
  constructor() {
    this.extractor = new CSSExtractor();
    this.overlay = new OverlayManager();
    this.setupMessageListener();
  }
  
  private setupMessageListener() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === 'toggleInspection') {
        this.toggle(message.enabled);
        sendResponse({ success: true });
      }
      return true;
    });
  }
  
  toggle(enabled: boolean) {
    this.isEnabled = enabled;
    
    if (enabled) {
      this.enable();
    } else {
      this.disable();
    }
  }
  
  private enable() {
    this.overlay.activate();
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('click', this.handleClick, true);
    document.body.style.cursor = 'crosshair';
  }
  
  private disable() {
    this.overlay.deactivate();
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('click', this.handleClick, true);
    document.body.style.cursor = '';
    this.closePanel();
  }
  
  private handleMouseMove = (event: MouseEvent) => {
    if (!this.isEnabled) return;
    
    const target = event.target as HTMLElement;
    
    // Ignore our own overlay elements
    if (target.id?.startsWith('pixel-perfect-')) return;
    
    // Ignore if panel is open and hovering over panel
    if (this.panelOpen && this.isHoveringPanel(target)) return;
    
    this.currentElement = target;
    this.overlay.showOnElement(target);
  };
  
  private handleClick = (event: MouseEvent) => {
    if (!this.isEnabled || !this.currentElement) return;
    
    // Prevent default action
    event.preventDefault();
    event.stopPropagation();
    
    // Extract properties
    const inspectedElement = this.extractor.createInspectedElement(this.currentElement);
    
    // Save to history
    chrome.runtime.sendMessage({
      action: 'saveInspectedElement',
      element: inspectedElement
    });
    
    // Open panel with data
    this.openPanel(inspectedElement);
    
    // Disable inspection mode after selection
    this.toggle(false);
    chrome.runtime.sendMessage({ action: 'disableInspection' });
  };
  
  private openPanel(element: InspectedElement) {
    // Create or update panel
    let panel = document.getElementById('pixel-perfect-panel') as HTMLDivElement;
    
    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'pixel-perfect-panel';
      panel.style.cssText = `
        position: fixed;
        top: 0;
        right: 0;
        width: 400px;
        height: 100vh;
        background: white;
        box-shadow: -2px 0 10px rgba(0,0,0,0.1);
        z-index: 2147483646;
        overflow-y: auto;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      `;
      document.body.appendChild(panel);
    }
    
    // Render panel content (will be enhanced in next task)
    panel.innerHTML = this.renderPanelContent(element);
    this.panelOpen = true;
    
    // Setup close button
    const closeBtn = panel.querySelector('#close-panel');
    closeBtn?.addEventListener('click', () => this.closePanel());
    
    // Setup copy buttons
    this.setupCopyButtons(panel, element);
  }
  
  private closePanel() {
    const panel = document.getElementById('pixel-perfect-panel');
    panel?.remove();
    this.panelOpen = false;
  }
  
  private isHoveringPanel(element: HTMLElement): boolean {
    return element.closest('#pixel-perfect-panel') !== null;
  }
  
  private renderPanelContent(element: InspectedElement): string {
    // Basic rendering - will be enhanced in panel task
    return `
      <div style="padding: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h2 style="margin: 0; font-size: 18px;">Element: &lt;${element.tagName}&gt;</h2>
          <button id="close-panel" style="cursor: pointer; border: none; background: none; font-size: 24px;">&times;</button>
        </div>
        <div id="panel-content">
          <pre>${JSON.stringify(element.properties, null, 2)}</pre>
        </div>
      </div>
    `;
  }
  
  private setupCopyButtons(panel: HTMLElement, element: InspectedElement) {
    // Will be implemented in panel task
  }
}

// Initialize inspector
const inspector = new PixelPerfectInspector();
```
2. Add debouncing to mousemove for performance if needed

**Test Strategy:**

1. Test inspection mode activates/deactivates correctly
2. Verify hover highlights elements smoothly without lag
3. Test click captures element and extracts properties
4. Verify panel opens with correct data
5. Test that clicking ignores overlay and panel elements
6. Test cursor changes to crosshair in inspection mode
7. Test event listeners are properly removed on disable
8. Test with nested elements (should highlight innermost element)
9. Verify inspection mode disables after element selection
10. Performance test: ensure no memory leaks after multiple enable/disable cycles
