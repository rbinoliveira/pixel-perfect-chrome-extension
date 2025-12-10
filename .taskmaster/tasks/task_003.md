# Task ID: 3

**Title:** Implement Background Service Worker

**Status:** done

**Dependencies:** 2 ✓

**Priority:** high

**Description:** Create the background service worker to manage extension state, handle messages between components, and coordinate inspection mode activation

**Details:**

1. Create background/service-worker.ts:
```typescript
import { ExtensionState } from '../shared/types';

let inspectionMode = false;
let activeTabId: number | null = null;

// Listen for extension icon click
chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return;
  activeTabId = tab.id;
  
  // Toggle inspection mode
  inspectionMode = !inspectionMode;
  
  // Inject content script if not already injected
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content/inspector.js']
  });
  
  // Send message to content script
  chrome.tabs.sendMessage(tab.id, {
    action: 'toggleInspection',
    enabled: inspectionMode
  });
  
  // Update icon to reflect state
  chrome.action.setIcon({
    path: inspectionMode ? 'icons/icon-active.png' : 'icons/icon.png',
    tabId: tab.id
  });
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case 'getInspectionState':
      sendResponse({ enabled: inspectionMode });
      break;
    case 'saveInspectedElement':
      // Save to chrome.storage
      chrome.storage.local.get(['history'], (result) => {
        const history = result.history || [];
        history.unshift(message.element);
        // Keep only last 10
        const trimmed = history.slice(0, 10);
        chrome.storage.local.set({ history: trimmed });
      });
      break;
    case 'disableInspection':
      inspectionMode = false;
      if (sender.tab?.id) {
        chrome.action.setIcon({
          path: 'icons/icon.png',
          tabId: sender.tab.id
        });
      }
      break;
  }
  return true;
});

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener((command) => {
  if (command === 'toggle-inspection') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.action.onClicked.dispatch(tabs[0]);
      }
    });
  }
});
```
2. Add keyboard shortcuts to manifest.json:
```json
"commands": {
  "toggle-inspection": {
    "suggested_key": {
      "default": "Ctrl+Shift+I",
      "mac": "Command+Shift+I"
    },
    "description": "Toggle inspection mode"
  }
}
```

**Test Strategy:**

1. Load extension and verify service worker starts without errors
2. Click extension icon and check console for messages
3. Verify chrome.storage operations work correctly
4. Test message passing between service worker and content script
5. Test keyboard shortcut triggers inspection mode
6. Verify icon changes state when inspection mode toggles
