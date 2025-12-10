// Pixel Perfect Inspector Popup Script
console.log('[Popup] Pixel Perfect Inspector popup loaded');

let inspectionMode = false;

// Default preferences
const DEFAULT_PREFS = {
  colorTheme: 'purple-pink',
  tooltipFontSize: 12
};

// Color themes
const COLOR_THEMES = {
  'purple-pink': { primary: '#8B5CF6', secondary: '#EC4899', tertiary: '#10B981' },
  'blue': { primary: '#3B82F6', secondary: '#60A5FA', tertiary: '#10B981' },
  'green': { primary: '#10B981', secondary: '#34D399', tertiary: '#10B981' },
  'orange': { primary: '#F59E0B', secondary: '#FBBF24', tertiary: '#10B981' },
  'red': { primary: '#EF4444', secondary: '#F87171', tertiary: '#10B981' }
};

// Load preferences from storage
async function loadPreferences() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['preferences'], (result) => {
      const prefs = result.preferences || DEFAULT_PREFS;
      resolve(prefs);
    });
  });
}

// Save preferences to storage
async function savePreferences(prefs) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ preferences: prefs }, () => {
      resolve();
    });
  });
}

// Apply preferences to content script
async function applyPreferences(prefs) {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) {
      chrome.tabs.sendMessage(tab.id, {
        action: 'updatePreferences',
        preferences: prefs
      });
    }
  } catch (error) {
    console.log('[Popup] Could not apply preferences:', error);
  }
}

// Check current inspection state
async function checkInspectionState() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return;

    const response = await chrome.tabs.sendMessage(tab.id, {
      action: 'getInspectionState',
    });

    if (response?.enabled !== undefined) {
      inspectionMode = response.enabled;
      updateUI();
    }
  } catch (error) {
    console.log('[Popup] Could not get inspection state:', error);
    inspectionMode = false;
    updateUI();
  }
}

// Toggle inspection mode
async function toggleInspection(enabled) {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      console.error('[Popup] No active tab');
      return;
    }

    const response = await chrome.runtime.sendMessage({
      action: 'toggleInspectionFromPopup',
      enabled: enabled,
      tabId: tab.id,
    });

    if (response?.success) {
      inspectionMode = enabled;
      updateUI();
    }
  } catch (error) {
    console.error('[Popup] Failed to toggle inspection:', error);
  }
}

// Update UI based on current state
function updateUI() {
  const toggle = document.getElementById('inspection-toggle');
  const statusText = document.getElementById('status-text');

  if (toggle) {
    toggle.checked = inspectionMode;
  }

  if (statusText) {
    if (inspectionMode) {
      statusText.textContent = '✅ Active';
      statusText.style.color = '#8B5CF6';
    } else {
      statusText.textContent = 'Click to activate';
      statusText.style.color = '#6b7280';
    }
  }
}

// Initialize preferences UI
async function initPreferences() {
  const prefs = await loadPreferences();

  // Set color theme
  const colorThemeSelect = document.getElementById('color-theme');
  if (colorThemeSelect) {
    colorThemeSelect.value = prefs.colorTheme || DEFAULT_PREFS.colorTheme;
    colorThemeSelect.addEventListener('change', async (e) => {
      const newPrefs = { ...prefs, colorTheme: e.target.value };
      await savePreferences(newPrefs);
      await applyPreferences(newPrefs);
    });
  }

  // Set font size
  const fontSizeValue = document.getElementById('font-size-value');
  const fontSizeDecrease = document.getElementById('font-size-decrease');
  const fontSizeIncrease = document.getElementById('font-size-increase');

  let currentFontSize = prefs.tooltipFontSize || DEFAULT_PREFS.tooltipFontSize;

  if (fontSizeValue) {
    fontSizeValue.textContent = `${currentFontSize}px`;
  }

  if (fontSizeDecrease) {
    fontSizeDecrease.addEventListener('click', async () => {
      if (currentFontSize > 8) {
        currentFontSize -= 1;
        fontSizeValue.textContent = `${currentFontSize}px`;
        const newPrefs = { ...prefs, tooltipFontSize: currentFontSize };
        await savePreferences(newPrefs);
        await applyPreferences(newPrefs);
      }
    });
  }

  if (fontSizeIncrease) {
    fontSizeIncrease.addEventListener('click', async () => {
      if (currentFontSize < 20) {
        currentFontSize += 1;
        fontSizeValue.textContent = `${currentFontSize}px`;
        const newPrefs = { ...prefs, tooltipFontSize: currentFontSize };
        await savePreferences(newPrefs);
        await applyPreferences(newPrefs);
      }
    });
  }

  // Apply initial preferences
  await applyPreferences(prefs);
}

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
  console.log('[Popup] DOM loaded');

  // Check inspection state
  await checkInspectionState();

  // Setup toggle
  const toggle = document.getElementById('inspection-toggle');
  if (toggle) {
    toggle.addEventListener('change', (e) => {
      toggleInspection(e.target.checked);
    });
  }

  // Initialize preferences
  await initPreferences();

  // Detect Mac for showing Mac-specific shortcuts
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  if (isMac) {
    document.querySelectorAll('.mac-only').forEach(el => {
      el.style.display = 'inline';
    });
  }
});
