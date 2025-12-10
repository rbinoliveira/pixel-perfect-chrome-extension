import { InspectedElement } from '../shared/types';

let inspectionMode = false;
let activeTabId: number | null = null;

// Listen for extension icon click
chrome.action.onClicked.addListener(async (tab) => {
  console.log('[Service Worker] Icon clicked, tab:', tab);
  if (!tab.id) {
    console.error('[Service Worker] No tab ID');
    return;
  }
  activeTabId = tab.id;

  // Toggle inspection mode
  inspectionMode = !inspectionMode;
  console.log('[Service Worker] Inspection mode:', inspectionMode);

  // Try to send message to content script (it should already be loaded via manifest)
  try {
    const response = await chrome.tabs.sendMessage(tab.id, {
      action: 'toggleInspection',
      enabled: inspectionMode,
    });
    console.log('[Service Worker] Message sent, response:', response);
  } catch (error) {
    console.error('[Service Worker] Failed to send message, trying to inject:', error);
    // If message fails, content script might not be loaded yet, try injecting
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content/inspector.js'],
      });
      console.log('[Service Worker] Content script injected');
      // Wait a bit for script to initialize
      await new Promise(resolve => setTimeout(resolve, 200));
      // Try sending message again
      const response = await chrome.tabs.sendMessage(tab.id, {
        action: 'toggleInspection',
        enabled: inspectionMode,
      });
      console.log('[Service Worker] Message sent after injection, response:', response);
    } catch (injectError) {
      console.error('[Service Worker] Failed to inject content script:', injectError);
      return;
    }
  }

  // Update icon to reflect state
  try {
    await chrome.action.setIcon({
      path: inspectionMode
        ? {
            16: 'icons/icon-active16.png',
            48: 'icons/icon-active48.png',
            128: 'icons/icon-active128.png',
          }
        : {
            16: 'icons/icon16.png',
            48: 'icons/icon48.png',
            128: 'icons/icon128.png',
          },
      tabId: tab.id,
    });
    console.log('[Service Worker] Icon updated');
  } catch (iconError) {
    console.warn('[Service Worker] Failed to update icon (non-critical):', iconError);
    // Continue execution even if icon update fails
  }
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  switch (message.action) {
    case 'getInspectionState':
      sendResponse({ enabled: inspectionMode });
      break;
    case 'toggleInspectionFromPopup':
      // Handle toggle from popup
      const tabId = message.tabId || (await chrome.tabs.query({ active: true, currentWindow: true }))[0]?.id;
      if (!tabId) {
        sendResponse({ success: false, error: 'No active tab' });
        return true;
      }

      inspectionMode = message.enabled;
      activeTabId = tabId;

      // Try to send message to content script
      try {
        await chrome.tabs.sendMessage(tabId, {
          action: 'toggleInspection',
          enabled: inspectionMode,
        });
        console.log('[Service Worker] Toggle from popup, mode:', inspectionMode);
      } catch (error) {
        console.error('[Service Worker] Failed to send message from popup, trying to inject:', error);
        try {
          await chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['content/inspector.js'],
          });
          await new Promise(resolve => setTimeout(resolve, 200));
          await chrome.tabs.sendMessage(tabId, {
            action: 'toggleInspection',
            enabled: inspectionMode,
          });
        } catch (injectError) {
          console.error('[Service Worker] Failed to inject from popup:', injectError);
          sendResponse({ success: false, error: injectError });
          return true;
        }
      }

      // Update icon
      try {
        await chrome.action.setIcon({
          path: inspectionMode
            ? {
                16: 'icons/icon-active16.png',
                48: 'icons/icon-active48.png',
                128: 'icons/icon-active128.png',
              }
            : {
                16: 'icons/icon16.png',
                48: 'icons/icon48.png',
                128: 'icons/icon128.png',
              },
          tabId: tabId,
        });
        console.log('[Service Worker] Icon updated from popup');
      } catch (iconError) {
        console.warn('[Service Worker] Failed to update icon from popup (non-critical):', iconError);
        // Continue execution even if icon update fails
      }

      sendResponse({ success: true });
      break;
    case 'saveInspectedElement':
      // Save to chrome.storage
      chrome.storage.local.get(['history'], (result) => {
        const history = (result.history as InspectedElement[]) || [];
        history.unshift(message.element as InspectedElement);
        // Keep only last 10
        const trimmed = history.slice(0, 10);
        chrome.storage.local.set({ history: trimmed });
      });
      sendResponse({ success: true });
      break;
    case 'disableInspection':
      inspectionMode = false;
      if (sender.tab?.id) {
        try {
          await chrome.action.setIcon({
            path: {
              16: 'icons/icon16.png',
              48: 'icons/icon48.png',
              128: 'icons/icon128.png',
            },
            tabId: sender.tab.id,
          });
        } catch (iconError) {
          console.warn('[Service Worker] Failed to update icon on disable (non-critical):', iconError);
        }
      }
      sendResponse({ success: true });
      break;
  }
  return true; // Keep channel open for async response
});

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener(async (command) => {
  console.log('[Service Worker] Command received:', command);
  if (command === 'toggle-inspection') {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];
    if (!tab?.id) {
      console.error('[Service Worker] No active tab');
      return;
    }

    // Toggle inspection mode
    inspectionMode = !inspectionMode;
    activeTabId = tab.id;
    console.log('[Service Worker] Inspection mode (keyboard):', inspectionMode);

    // Try to send message to content script (it should already be loaded via manifest)
    try {
      const response = await chrome.tabs.sendMessage(tab.id, {
        action: 'toggleInspection',
        enabled: inspectionMode,
      });
      console.log('[Service Worker] Message sent (keyboard), response:', response);
    } catch (error) {
      console.error('[Service Worker] Failed to send message (keyboard), trying to inject:', error);
      // If message fails, content script might not be loaded yet, try injecting
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content/inspector.js'],
        });
        console.log('[Service Worker] Content script injected (keyboard)');
        // Wait a bit for script to initialize
        await new Promise(resolve => setTimeout(resolve, 200));
        // Try sending message again
        const response = await chrome.tabs.sendMessage(tab.id, {
          action: 'toggleInspection',
          enabled: inspectionMode,
        });
        console.log('[Service Worker] Message sent after injection (keyboard), response:', response);
      } catch (injectError) {
        console.error('[Service Worker] Failed to inject content script (keyboard):', injectError);
        return;
      }
    }

    // Update icon to reflect state
    try {
      await chrome.action.setIcon({
        path: inspectionMode
          ? {
              16: 'icons/icon-active16.png',
              48: 'icons/icon-active48.png',
              128: 'icons/icon-active128.png',
            }
          : {
              16: 'icons/icon16.png',
              48: 'icons/icon48.png',
              128: 'icons/icon128.png',
            },
        tabId: tab.id,
      });
      console.log('[Service Worker] Icon updated (keyboard)');
    } catch (iconError) {
      console.warn('[Service Worker] Failed to update icon (keyboard) (non-critical):', iconError);
      // Continue execution even if icon update fails
    }
  }
});
