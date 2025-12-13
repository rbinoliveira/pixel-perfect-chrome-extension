import { InspectedElement } from '../shared/types';

// ============================================================
// STATE
// ============================================================

let inspectionMode = false;
let activeTabId: number | null = null;

// ============================================================
// HELPERS
// ============================================================

const ICON_PATHS = {
  active: {
    16: 'icons/icon-active16.png',
    48: 'icons/icon-active48.png',
    128: 'icons/icon-active128.png',
  },
  inactive: {
    16: 'icons/icon16.png',
    48: 'icons/icon48.png',
    128: 'icons/icon128.png',
  },
};

async function updateIcon(tabId: number, isActive: boolean) {
  try {
    await chrome.action.setIcon({
      path: isActive ? ICON_PATHS.active : ICON_PATHS.inactive,
      tabId,
    });
  } catch (error) {
    console.warn('[Service Worker] Failed to update icon (non-critical):', error);
  }
}

async function sendToggleMessage(tabId: number, enabled: boolean) {
  try {
    const response = await chrome.tabs.sendMessage(tabId, {
      action: 'toggleInspection',
      enabled,
    });
    return { success: true, response };
  } catch (error) {
    return await injectAndRetry(tabId, enabled);
  }
}

async function injectAndRetry(tabId: number, enabled: boolean) {
  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['content/inspector.js'],
    });
    await new Promise(resolve => setTimeout(resolve, 200));
    const response = await chrome.tabs.sendMessage(tabId, {
      action: 'toggleInspection',
      enabled,
    });
    return { success: true, response };
  } catch (error) {
    console.error('[Service Worker] Failed to inject content script:', error);
    return { success: false, error };
  }
}

async function toggleInspection(tabId: number) {
  inspectionMode = !inspectionMode;
  activeTabId = tabId;

  await sendToggleMessage(tabId, inspectionMode);
  await updateIcon(tabId, inspectionMode);
}

// ============================================================
// EXTENSION ICON CLICK
// ============================================================

chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return;
  await toggleInspection(tab.id);
});

// ============================================================
// MESSAGE HANDLERS
// ============================================================

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  switch (message.action) {
    case 'getInspectionState':
      sendResponse({ enabled: inspectionMode });
      break;

    case 'toggleInspectionFromPopup':
      const tabId = message.tabId || (await chrome.tabs.query({ active: true, currentWindow: true }))[0]?.id;
      if (!tabId) {
        sendResponse({ success: false, error: 'No active tab' });
        return true;
      }

      inspectionMode = message.enabled;
      activeTabId = tabId;

      await sendToggleMessage(tabId, inspectionMode);
      await updateIcon(tabId, inspectionMode);

      sendResponse({ success: true });
      break;

    case 'saveInspectedElement':
      chrome.storage.local.get(['history'], (result) => {
        const history = (result.history as InspectedElement[]) || [];
        history.unshift(message.element as InspectedElement);
        const trimmed = history.slice(0, 10);
        chrome.storage.local.set({ history: trimmed });
      });
      sendResponse({ success: true });
      break;

    case 'disableInspection':
      inspectionMode = false;
      if (sender.tab?.id) {
        await updateIcon(sender.tab.id, false);
      }
      sendResponse({ success: true });
      break;
  }
  return true;
});

// ============================================================
// KEYBOARD SHORTCUTS
// ============================================================

chrome.commands.onCommand.addListener(async (command) => {
  if (command !== 'toggle-inspection') return;

  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const tab = tabs[0];

  if (!tab?.id) return;

  await toggleInspection(tab.id);
});
