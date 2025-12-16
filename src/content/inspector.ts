import { CSSExtractor } from './extractor';
import { OverlayManager } from './overlay';
import { getCurrentTheme, getOverlayColor, SECONDARY_COLOR, TERTIARY_COLOR } from '../shared/constants';

// ============================================================
// PIXEL PERFECT INSPECTOR
// ============================================================

class PixelPerfectInspector {
  private extractor: CSSExtractor;
  private overlay: OverlayManager;
  private isEnabled = false;
  private currentElement: HTMLElement | null = null;
  private measurementMode = false;
  private firstElement: HTMLElement | null = null;
  private secondElement: HTMLElement | null = null;
  private measurementLine: HTMLDivElement | null = null;
  private preferences: { overlayColor: string; tooltipFontSize: number } = {
    overlayColor: 'purple',
    tooltipFontSize: 12
  };

  constructor() {
    this.extractor = new CSSExtractor();
    this.overlay = new OverlayManager();
    this.setupMessageListener();
    this.loadPreferences();
  }

  // ============================================================
  // MESSAGE HANDLING
  // ============================================================

  private setupMessageListener() {
    try {
      chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        try {
          if (message.action === 'toggleInspection') {
            this.toggle(message.enabled);
            sendResponse({ success: true });
          } else if (message.action === 'getInspectionState') {
            sendResponse({ enabled: this.isEnabled });
          } else if (message.action === 'updatePreferences') {
            this.preferences = message.preferences;
            this.applyPreferences();
            sendResponse({ success: true });
          }
          return true;
        } catch (error) {
          console.error('[Content Script] Error handling message:', error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          sendResponse({ success: false, error: errorMessage });
          return true;
        }
      });
    } catch (error) {
      console.error('[Content Script] Failed to setup message listener:', error);
    }
  }

  // ============================================================
  // INSPECTION MODE CONTROL
  // ============================================================

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
    this.showActiveIndicator();
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('click', this.handleClick, true);
    document.addEventListener('keydown', this.handleKeyDown, true);
    document.body.style.cursor = 'crosshair';
  }

  private disable() {
    this.overlay.deactivate();
    this.hideActiveIndicator();
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('click', this.handleClick, true);
    document.removeEventListener('keydown', this.handleKeyDown, true);
    document.body.style.cursor = '';
    this.resetMeasurement();
  }

  // ============================================================
  // EVENT HANDLERS
  // ============================================================

  private handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && this.isEnabled) {
      event.preventDefault();
      event.stopPropagation();
      this.toggle(false);
      this.showExitFeedback();
    }
  };

  private handleMouseMove = (event: MouseEvent) => {
    if (!this.isEnabled) return;

    const target = event.target as HTMLElement;

    if (target.id?.startsWith('pixel-perfect-')) return;

    this.currentElement = target;
    this.overlay.showOnElement(target);
  };

  private handleClick = (event: MouseEvent) => {
    if (!this.isEnabled || !this.currentElement) return;

    event.preventDefault();
    event.stopPropagation();

    this.handleMeasurementClick(this.currentElement);
  };

  // ============================================================
  // VISUAL FEEDBACK
  // ============================================================

  private showExitFeedback() {
    const feedback = document.createElement('div');
    feedback.textContent = 'Inspection mode deactivated (ESC)';
    feedback.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(16, 185, 129, 0.95);
      color: white;
      padding: 12px 24px;
      border-radius: 6px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      font-weight: 500;
      z-index: 2147483647;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      animation: pixelPerfectFadeOut 2s forwards;
    `;

    // Add keyframe animation
    if (!document.getElementById('pixel-perfect-animations')) {
      const style = document.createElement('style');
      style.id = 'pixel-perfect-animations';
      style.textContent = `
        @keyframes pixelPerfectFadeOut {
          0% { opacity: 1; }
          70% { opacity: 1; }
          100% { opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(feedback);

    setTimeout(() => {
      feedback.remove();
    }, 2000);
  }

  private showActiveIndicator() {
    // Remove existing indicator if any
    this.hideActiveIndicator();

    // Create indicator with logo in top-right corner
    const indicator = document.createElement('div');
    indicator.id = 'pixel-perfect-active-indicator';

    // Get icon URL from extension
    const iconUrl = chrome.runtime.getURL('icons/icon48.png');

    indicator.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      width: 50px;
      height: 50px;
      background-image: url(${iconUrl});
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      background-color: rgba(255, 255, 255, 0.95);
      border-radius: 8px;
      z-index: 2147483647;
      pointer-events: none;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      display: none;
    `;

    // Only show on screens wider than 360px
    const mediaQuery = window.matchMedia('(min-width: 361px)');
    const updateVisibility = () => {
      indicator.style.display = mediaQuery.matches ? 'block' : 'none';
    };
    updateVisibility();
    mediaQuery.addEventListener('change', updateVisibility);

    document.body.appendChild(indicator);
  }

  private hideActiveIndicator() {
    const indicator = document.getElementById('pixel-perfect-active-indicator');
    if (indicator) {
      indicator.remove();
    }
  }

  // ============================================================
  // MEASUREMENT MODE
  // ============================================================

  private handleMeasurementClick(element: HTMLElement) {
    if (!this.firstElement) {
      this.firstElement = element;
      this.measurementMode = true;
      this.highlightElementForMeasurement(element, true);
      this.showMeasurementHint('First element selected. Click on second element to measure');
    } else if (this.firstElement !== element) {
      this.secondElement = element;
      this.highlightElementForMeasurement(element, true);
      this.calculateAndShowDistance(this.firstElement, this.secondElement);

      setTimeout(() => {
        this.resetMeasurement();
      }, 3000);
    } else {
      this.resetMeasurement();
    }
  }

  private highlightElementForMeasurement(element: HTMLElement, isSelected: boolean) {
    const rect = element.getBoundingClientRect();
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    // Get current theme colors
    const theme = getCurrentTheme();
    const greenColor = getOverlayColor('green', theme);
    const pinkColor = getOverlayColor('pink', theme);

    // Create or update highlight
    let highlight = document.getElementById('pixel-perfect-measure-highlight');
    if (!highlight) {
      highlight = document.createElement('div');
      highlight.id = 'pixel-perfect-measure-highlight';
      highlight.style.cssText = `
        position: absolute;
        pointer-events: none;
        border: 2px solid ${isSelected ? greenColor.value : pinkColor.value};
        z-index: 2147483646;
        box-sizing: border-box;
      `;
      document.body.appendChild(highlight);
    }

    highlight.style.display = 'block';
    highlight.style.left = `${rect.left + scrollX}px`;
    highlight.style.top = `${rect.top + scrollY}px`;
    highlight.style.width = `${rect.width}px`;
    highlight.style.height = `${rect.height}px`;
    highlight.style.borderColor = isSelected ? greenColor.value : pinkColor.value;
  }

  private calculateAndShowDistance(element1: HTMLElement, element2: HTMLElement) {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    // Calculate the closest edge-to-edge distance
    // Find the closest points between the two rectangles

    // Horizontal distance: closest horizontal edges
    let horizontal = 0;
    let horizontalStart: { x: number; y: number } | null = null;
    let horizontalEnd: { x: number; y: number } | null = null;

    if (rect2.left >= rect1.right) {
      // element2 is completely to the right of element1
      horizontal = rect2.left - rect1.right;
      // Find the closest vertical point between the two elements
      const overlapTop = Math.max(rect1.top, rect2.top);
      const overlapBottom = Math.min(rect1.bottom, rect2.bottom);
      const midY = overlapTop < overlapBottom
        ? (overlapTop + overlapBottom) / 2
        : (rect1.top + rect1.bottom) / 2;
      horizontalStart = { x: rect1.right + scrollX, y: midY + scrollY };
      horizontalEnd = { x: rect2.left + scrollX, y: midY + scrollY };
    } else if (rect1.left >= rect2.right) {
      // element1 is completely to the right of element2
      horizontal = rect1.left - rect2.right;
      const overlapTop = Math.max(rect1.top, rect2.top);
      const overlapBottom = Math.min(rect1.bottom, rect2.bottom);
      const midY = overlapTop < overlapBottom
        ? (overlapTop + overlapBottom) / 2
        : (rect1.top + rect1.bottom) / 2;
      horizontalStart = { x: rect2.right + scrollX, y: midY + scrollY };
      horizontalEnd = { x: rect1.left + scrollX, y: midY + scrollY };
    } else {
      // Elements overlap horizontally - horizontal distance is 0
      horizontal = 0;
      const overlapLeft = Math.max(rect1.left, rect2.left);
      const overlapRight = Math.min(rect1.right, rect2.right);
      const midX = (overlapLeft + overlapRight) / 2 + scrollX;
      const midY = (rect1.top + rect1.bottom) / 2 + scrollY;
      horizontalStart = { x: midX, y: midY };
      horizontalEnd = { x: midX, y: midY };
    }

    // Vertical distance: closest vertical edges
    let vertical = 0;
    let verticalStart: { x: number; y: number } | null = null;
    let verticalEnd: { x: number; y: number } | null = null;

    if (rect2.top >= rect1.bottom) {
      // element2 is completely below element1
      vertical = rect2.top - rect1.bottom;
      // Find the closest horizontal point between the two elements
      const overlapLeft = Math.max(rect1.left, rect2.left);
      const overlapRight = Math.min(rect1.right, rect2.right);
      const midX = overlapLeft < overlapRight
        ? (overlapLeft + overlapRight) / 2
        : (rect1.left + rect1.right) / 2;
      verticalStart = { x: midX + scrollX, y: rect1.bottom + scrollY };
      verticalEnd = { x: midX + scrollX, y: rect2.top + scrollY };
    } else if (rect1.top >= rect2.bottom) {
      // element1 is completely below element2
      vertical = rect1.top - rect2.bottom;
      const overlapLeft = Math.max(rect1.left, rect2.left);
      const overlapRight = Math.min(rect1.right, rect2.right);
      const midX = overlapLeft < overlapRight
        ? (overlapLeft + overlapRight) / 2
        : (rect1.left + rect1.right) / 2;
      verticalStart = { x: midX + scrollX, y: rect2.bottom + scrollY };
      verticalEnd = { x: midX + scrollX, y: rect1.top + scrollY };
    } else {
      // Elements overlap vertically - vertical distance is 0
      vertical = 0;
      const overlapTop = Math.max(rect1.top, rect2.top);
      const overlapBottom = Math.min(rect1.bottom, rect2.bottom);
      const midY = (overlapTop + overlapBottom) / 2 + scrollY;
      const midX = (rect1.left + rect1.right) / 2 + scrollX;
      verticalStart = { x: midX, y: midY };
      verticalEnd = { x: midX, y: midY };
    }

    // Calculate the actual shortest distance between the closest edges
    // This is the real gap/margin between elements
    let diagonal = 0;
    let diagonalStart: { x: number; y: number } | null = null;
    let diagonalEnd: { x: number; y: number } | null = null;

    if (horizontal > 0 && vertical > 0) {
      // Elements are separated both horizontally and vertically
      // The shortest distance is the diagonal between the closest corners
      diagonal = Math.sqrt(horizontal ** 2 + vertical ** 2);

      // Find the closest corner points
      if (rect2.left >= rect1.right && rect2.top >= rect1.bottom) {
        // element2 is to the right and below element1
        diagonalStart = { x: rect1.right + scrollX, y: rect1.bottom + scrollY };
        diagonalEnd = { x: rect2.left + scrollX, y: rect2.top + scrollY };
      } else if (rect2.left >= rect1.right && rect1.top >= rect2.bottom) {
        // element2 is to the right and above element1
        diagonalStart = { x: rect1.right + scrollX, y: rect1.top + scrollY };
        diagonalEnd = { x: rect2.left + scrollX, y: rect2.bottom + scrollY };
      } else if (rect1.left >= rect2.right && rect2.top >= rect1.bottom) {
        // element2 is to the left and below element1
        diagonalStart = { x: rect1.left + scrollX, y: rect1.bottom + scrollY };
        diagonalEnd = { x: rect2.right + scrollX, y: rect2.top + scrollY };
      } else if (rect1.left >= rect2.right && rect1.top >= rect2.bottom) {
        // element2 is to the left and above element1
        diagonalStart = { x: rect1.left + scrollX, y: rect1.top + scrollY };
        diagonalEnd = { x: rect2.right + scrollX, y: rect2.bottom + scrollY };
      }
    } else if (horizontal > 0) {
      // Only horizontal separation
      diagonal = horizontal;
      diagonalStart = horizontalStart;
      diagonalEnd = horizontalEnd;
    } else if (vertical > 0) {
      // Only vertical separation
      diagonal = vertical;
      diagonalStart = verticalStart;
      diagonalEnd = verticalEnd;
    } else {
      // Elements overlap - distance is 0
      diagonal = 0;
      const midX = (rect1.left + rect1.right + rect2.left + rect2.right) / 4 + scrollX;
      const midY = (rect1.top + rect1.bottom + rect2.top + rect2.bottom) / 4 + scrollY;
      diagonalStart = { x: midX, y: midY };
      diagonalEnd = { x: midX, y: midY };
    }

    // Draw the measurement line showing the shortest distance
    if (diagonalStart && diagonalEnd) {
      this.drawMeasurementLine(diagonalStart, diagonalEnd, horizontal, vertical, diagonal);
    }
  }

  private drawMeasurementLine(
    point1: { x: number; y: number },
    point2: { x: number; y: number },
    horizontal: number,
    vertical: number,
    diagonal: number
  ) {
    // Remove existing elements
    this.clearMeasurementVisuals();

    if (point1.x === point2.x && point1.y === point2.y) {
      // Elements overlap - just show label
      const label = document.createElement('div');
      label.id = 'pixel-perfect-measure-label';
      label.style.cssText = `
        position: absolute;
        left: ${point1.x}px;
        top: ${point1.y - 50}px;
        transform: translateX(-50%);
        background: ${TERTIARY_COLOR};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 32px;
        font-weight: 700;
        z-index: 2147483647;
        pointer-events: none;
        white-space: nowrap;
        box-shadow: 0 4px 16px rgba(0,0,0,0.3);
        letter-spacing: -0.5px;
      `;
      label.textContent = `${Math.round(diagonal)}px`;
      document.body.appendChild(label);
      return;
    }

    // Calculate line properties
    const angle = Math.atan2(point2.y - point1.y, point2.x - point1.x) * (180 / Math.PI);
    const length = Math.sqrt(
      (point2.x - point1.x) ** 2 + (point2.y - point1.y) ** 2
    );
    const centerX = (point1.x + point2.x) / 2;
    const centerY = (point1.y + point2.y) / 2;

    // Create line element
    const line = document.createElement('div');
    line.className = 'pixel-perfect-measure-line';
    line.style.cssText = `
      position: absolute;
      left: ${point1.x}px;
      top: ${point1.y}px;
      width: ${length}px;
      height: 2px;
      background: ${TERTIARY_COLOR};
      transform-origin: 0 50%;
      transform: rotate(${angle}deg);
      z-index: 2147483645;
      pointer-events: none;
    `;
    document.body.appendChild(line);

    // Create label - show only the distance value, larger and cleaner
    const label = document.createElement('div');
    label.id = 'pixel-perfect-measure-label';
    label.style.cssText = `
      position: absolute;
      left: ${centerX}px;
      top: ${centerY - 50}px;
      transform: translateX(-50%);
      background: ${TERTIARY_COLOR};
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 32px;
      font-weight: 700;
      z-index: 2147483647;
      pointer-events: none;
      white-space: nowrap;
      box-shadow: 0 4px 16px rgba(0,0,0,0.3);
      letter-spacing: -0.5px;
    `;
    label.textContent = `${Math.round(diagonal)}px`;
    document.body.appendChild(label);
  }

  private drawMeasurementLines(
    hStart: { x: number; y: number },
    hEnd: { x: number; y: number },
    vStart: { x: number; y: number },
    vEnd: { x: number; y: number },
    horizontal: number,
    vertical: number,
    diagonal: number
  ) {
    // Remove existing elements
    this.clearMeasurementVisuals();

    // Draw horizontal line
    const hLine = document.createElement('div');
    hLine.className = 'pixel-perfect-measure-line';
    const hLength = Math.sqrt((hEnd.x - hStart.x) ** 2 + (hEnd.y - hStart.y) ** 2);
    const hAngle = Math.atan2(hEnd.y - hStart.y, hEnd.x - hStart.x) * (180 / Math.PI);
    hLine.style.cssText = `
      position: absolute;
      left: ${hStart.x}px;
      top: ${hStart.y}px;
      width: ${hLength}px;
      height: 2px;
      background: ${TERTIARY_COLOR};
      transform-origin: 0 50%;
      transform: rotate(${hAngle}deg);
      z-index: 2147483645;
      pointer-events: none;
    `;
    document.body.appendChild(hLine);

    // Draw vertical line
    const vLine = document.createElement('div');
    vLine.className = 'pixel-perfect-measure-line';
    const vLength = Math.sqrt((vEnd.x - vStart.x) ** 2 + (vEnd.y - vStart.y) ** 2);
    const vAngle = Math.atan2(vEnd.y - vStart.y, vEnd.x - vStart.x) * (180 / Math.PI);
    vLine.style.cssText = `
      position: absolute;
      left: ${vStart.x}px;
      top: ${vStart.y}px;
      width: ${vLength}px;
      height: 2px;
      background: ${TERTIARY_COLOR};
      transform-origin: 0 50%;
      transform: rotate(${vAngle}deg);
      z-index: 2147483645;
      pointer-events: none;
    `;
    document.body.appendChild(vLine);

    // Create label at intersection or center - show only the distance value
    const labelX = (hStart.x + hEnd.x + vStart.x + vEnd.x) / 4;
    const labelY = (hStart.y + hEnd.y + vStart.y + vEnd.y) / 4;
    const label = document.createElement('div');
    label.id = 'pixel-perfect-measure-label';
    label.style.cssText = `
      position: absolute;
      left: ${labelX}px;
      top: ${labelY - 50}px;
      transform: translateX(-50%);
      background: ${TERTIARY_COLOR};
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 32px;
      font-weight: 700;
      z-index: 2147483647;
      pointer-events: none;
      white-space: nowrap;
      box-shadow: 0 4px 16px rgba(0,0,0,0.3);
      letter-spacing: -0.5px;
    `;
    label.textContent = `${Math.round(diagonal)}px`;
    document.body.appendChild(label);
  }

  private clearMeasurementVisuals() {
    // Remove all measurement lines
    document.querySelectorAll('.pixel-perfect-measure-line').forEach(el => el.remove());
    const label = document.getElementById('pixel-perfect-measure-label');
    if (label) label.remove();
  }

  private showMeasurementHint(message: string) {
    // Remove existing hint
    const existingHint = document.getElementById('pixel-perfect-measure-hint');
    if (existingHint) {
      existingHint.remove();
    }

    const hint = document.createElement('div');
    hint.id = 'pixel-perfect-measure-hint';
    hint.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: ${SECONDARY_COLOR};
      color: white;
      padding: 12px 24px;
      border-radius: 6px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      z-index: 2147483647;
      pointer-events: none;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    hint.textContent = message;
    document.body.appendChild(hint);

    setTimeout(() => {
      hint.remove();
    }, 3000);
  }

  private resetMeasurement() {
    this.firstElement = null;
    this.secondElement = null;
    this.measurementMode = false;

    const highlight = document.getElementById('pixel-perfect-measure-highlight');
    if (highlight) highlight.remove();

    this.clearMeasurementVisuals();

    const hint = document.getElementById('pixel-perfect-measure-hint');
    if (hint) hint.remove();
  }

  // ============================================================
  // PREFERENCES
  // ============================================================

  private loadPreferences() {
    chrome.storage.local.get(['preferences'], (result) => {
      if (result.preferences && typeof result.preferences === 'object') {
        const prefs = result.preferences as { overlayColor?: string; tooltipFontSize?: number };
        this.preferences = {
          overlayColor: prefs.overlayColor || 'purple',
          tooltipFontSize: prefs.tooltipFontSize || 12
        };
        this.applyPreferences();
      }
    });
  }

  private applyPreferences() {
    this.overlay.updateColorSelection(this.preferences.overlayColor);
    this.overlay.updateFontSize(this.preferences.tooltipFontSize);
  }


  private showContextInvalidatedMessage() {
    const existing = document.getElementById('pixel-perfect-context-error');
    if (existing) existing.remove();

    const message = document.createElement('div');
    message.id = 'pixel-perfect-context-error';
    message.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: ${SECONDARY_COLOR};
      color: white;
      padding: 12px 24px;
      border-radius: 6px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      z-index: 2147483647;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      max-width: 400px;
      text-align: center;
    `;
    message.innerHTML = `
      <strong>Extension Reloaded</strong><br>
      Please refresh this page to continue using the inspector.
    `;
    document.body.appendChild(message);

    setTimeout(() => {
      message.remove();
    }, 5000);
  }
}

// ============================================================
// INIT
// ============================================================

const inspector = new PixelPerfectInspector();
