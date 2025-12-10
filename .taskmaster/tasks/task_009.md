# Task ID: 9

**Title:** Implement Popup UI and History Feature

**Status:** done

**Dependencies:** 3 ✓, 8 ✓

**Priority:** medium

**Description:** Create the extension popup interface with inspection mode toggle, settings, and history of inspected elements

**Details:**

1. Create popup/popup.html:
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="popup.css">
  <title>Pixel Perfect Inspector</title>
</head>
<body>
  <div class="popup-container">
    <header class="popup-header">
      <h1>Pixel Perfect Inspector</h1>
    </header>
    
    <section class="inspection-control">
      <div class="toggle-container">
        <label class="toggle-label">
          <span>Inspection Mode</span>
          <div class="toggle-switch">
            <input type="checkbox" id="inspection-toggle">
            <span class="slider"></span>
          </div>
        </label>
      </div>
      <p class="status-text" id="status-text">Click to activate inspection mode</p>
    </section>
    
    <section class="history-section">
      <h2>Recent Inspections</h2>
      <div id="history-list" class="history-list">
        <!-- History items will be inserted here -->
      </div>
    </section>
    
    <section class="shortcuts-section">
      <h2>Keyboard Shortcuts</h2>
      <ul class="shortcuts-list">
        <li><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>I</kbd> - Toggle Inspection</li>
        <li><kbd>Esc</kbd> - Exit Inspection Mode</li>
      </ul>
    </section>
    
    <footer class="popup-footer">
      <button id="clear-history" class="btn-link">Clear History</button>
      <a href="#" id="settings-link" class="btn-link">Settings</a>
    </footer>
  </div>
  <script src="popup.js"></script>
</body>
</html>
```
2. Create popup/popup.ts:
```typescript
class PopupController {
  private inspectionToggle: HTMLInputElement;
  private statusText: HTMLElement;
  private historyList: HTMLElement;
  
  constructor() {
    this.inspectionToggle = document.getElementById('inspection-toggle') as HTMLInputElement;
    this.statusText = document.getElementById('status-text') as HTMLElement;
    this.historyList = document.getElementById('history-list') as HTMLElement;
    
    this.init();
  }
  
  async init() {
    // Get current inspection state
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs[0]?.id) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'getInspectionState' }, (response) => {
        if (response?.enabled) {
          this.inspectionToggle.checked = true;
          this.updateStatus(true);
        }
      });
    }
    
    // Setup event listeners
    this.inspectionToggle.addEventListener('change', () => this.handleToggle());
    document.getElementById('clear-history')?.addEventListener('click', () => this.clearHistory());
    
    // Load history
    this.loadHistory();
  }
  
  async handleToggle() {
    const enabled = this.inspectionToggle.checked;
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (tabs[0]?.id) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'toggleInspection',
        enabled
      });
      this.updateStatus(enabled);
    }
  }
  
  updateStatus(enabled: boolean) {
    if (enabled) {
      this.statusText.textContent = '✓ Inspection mode active - hover over elements';
      this.statusText.style.color = '#00C853';
    } else {
      this.statusText.textContent = 'Click to activate inspection mode';
      this.statusText.style.color = '#666';
    }
  }
  
  async loadHistory() {
    chrome.storage.local.get(['history'], (result) => {
      const history = result.history || [];
      
      if (history.length === 0) {
        this.historyList.innerHTML = '<p class="empty-state">No inspections yet</p>';
        return;
      }
      
      this.historyList.innerHTML = history.map((item: any) => `
        <div class="history-item" data-id="${item.id}">
          <div class="history-item-header">
            <span class="element-tag">&lt;${item.tagName}&gt;</span>
            ${item.className ? `<span class="element-class">.${item.className.split(' ')[0]}</span>` : ''}
          </div>
          <div class="history-item-meta">
            <span class="timestamp">${this.formatTimestamp(item.timestamp)}</span>
            <span class="dimensions">${Math.round(item.position.width)}×${Math.round(item.position.height)}px</span>
          </div>
        </div>
      `).join('');
      
      // Add click handlers to history items
      this.historyList.querySelectorAll('.history-item').forEach(item => {
        item.addEventListener('click', () => {
          const id = item.getAttribute('data-id');
          this.loadHistoryItem(id);
        });
      });
    });
  }
  
  formatTimestamp(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return new Date(timestamp).toLocaleDateString();
  }
  
  async loadHistoryItem(id: string | null) {
    // Send message to content script to re-open panel with this element
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs[0]?.id && id) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'loadHistoryItem',
        id
      });
      window.close();
    }
  }
  
  clearHistory() {
    if (confirm('Clear all inspection history?')) {
      chrome.storage.local.set({ history: [] }, () => {
        this.loadHistory();
      });
    }
  }
}

// Initialize popup
new PopupController();
```
3. Create popup/popup.css:
```css
body {
  width: 320px;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #ffffff;
}

.popup-container {
  padding: 16px;
}

.popup-header h1 {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
}

.inspection-control {
  padding: 16px;
  background: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 16px;
}

.toggle-container {
  margin-bottom: 8px;
}

.toggle-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  font-weight: 500;
}

.toggle-switch {
  position: relative;
  width: 48px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  border-radius: 24px;
  transition: 0.3s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  border-radius: 50%;
  transition: 0.3s;
}

input:checked + .slider {
  background-color: #007AFF;
}

input:checked + .slider:before {
  transform: translateX(24px);
}

.status-text {
  margin: 0;
  font-size: 13px;
  color: #666;
}

.history-section,
.shortcuts-section {
  margin-bottom: 16px;
}

.history-section h2,
.shortcuts-section h2 {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #1a1a1a;
}

.history-list {
  max-height: 200px;
  overflow-y: auto;
}

.history-item {
  padding: 10px;
  background: #f9f9f9;
  border-radius: 6px;
  margin-bottom: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.history-item:hover {
  background: #f0f0f0;
}

.history-item-header {
  display: flex;
  gap: 8px;
  margin-bottom: 4px;
}

.element-tag {
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 12px;
  color: #007AFF;
  font-weight: 600;
}

.element-class {
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 12px;
  color: #666;
}

.history-item-meta {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #999;
}

.empty-state {
  text-align: center;
  color: #999;
  font-size: 13px;
  padding: 20px;
}

.shortcuts-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.shortcuts-list li {
  padding: 6px 0;
  font-size: 13px;
  color: #666;
}

kbd {
  background: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 3px;
  padding: 2px 6px;
  font-size: 11px;
  font-family: monospace;
}

.popup-footer {
  display: flex;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid #e5e5e5;
}

.btn-link {
  background: none;
  border: none;
  color: #007AFF;
  font-size: 13px;
  cursor: pointer;
  text-decoration: none;
}

.btn-link:hover {
  text-decoration: underline;
}
```

**Test Strategy:**

1. Test popup opens when clicking extension icon
2. Verify toggle switch reflects current inspection state
3. Test toggling inspection mode from popup
4. Verify history loads and displays recent inspections
5. Test clicking history item re-opens that element's panel
6. Test 'Clear History' button clears all history
7. Verify timestamp formatting (just now, Xm ago, Xh ago)
8. Test popup with empty history shows empty state
9. Verify keyboard shortcuts are displayed correctly
10. Test popup UI is responsive and fits within 320px width
11. Verify status text updates when inspection mode changes
