// ============================================================
// POPUP CONTROLLER
// ============================================================

class PopupController {
  private inspectionToggle: HTMLInputElement;
  private statusText: HTMLElement;
  private colorOptions: NodeListOf<Element>;
  private fontSizeValue: HTMLElement;
  private fontSizeDecrease: HTMLButtonElement;
  private fontSizeIncrease: HTMLButtonElement;
  private currentFontSize: number = 12;
  private currentTheme: 'light' | 'dark' = 'light';
  private currentColor: string = 'purple';
  private darkModeMediaQuery: MediaQueryList | null = null;

  constructor() {
    this.inspectionToggle = document.getElementById('inspection-toggle') as HTMLInputElement;
    this.statusText = document.getElementById('status-text') as HTMLElement;
    this.colorOptions = document.querySelectorAll('.color-option');
    this.fontSizeValue = document.getElementById('font-size-value') as HTMLElement;
    this.fontSizeDecrease = document.getElementById('font-size-decrease') as HTMLButtonElement;
    this.fontSizeIncrease = document.getElementById('font-size-increase') as HTMLButtonElement;

    if (!this.inspectionToggle || !this.statusText || !this.colorOptions.length) {
      console.error('Required elements not found in popup HTML');
      return;
    }

    this.init();
  }

  // ============================================================
  // INITIALIZATION
  // ============================================================

  async init() {
    this.setupThemeDetection();
    await this.syncInspectionState();
    this.setupEventListeners();
    await this.loadPreferences();
  }

  private async syncInspectionState() {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs[0]?.id) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: 'getInspectionState' },
        (response) => {
          if (chrome.runtime.lastError) {
            return;
          }
          if (response?.enabled) {
            this.inspectionToggle.checked = true;
            this.updateStatus(true);
          }
        }
      );
    }
  }

  private setupEventListeners() {
    this.inspectionToggle.addEventListener('change', () => this.handleToggle());

    this.colorOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.handleColorChange(option);
      });
    });

    this.fontSizeDecrease.addEventListener('click', () => this.handleFontSizeChange(-1));
    this.fontSizeIncrease.addEventListener('click', () => this.handleFontSizeChange(1));
  }

  // ============================================================
  // THEME MANAGEMENT
  // ============================================================

  setupThemeDetection() {
    this.currentTheme = this.detectSystemTheme();
    this.applyTheme(this.currentTheme);

    if (window.matchMedia) {
      this.darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.darkModeMediaQuery.addEventListener('change', (e) => {
        this.currentTheme = e.matches ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
      });
    }
  }

  detectSystemTheme(): 'light' | 'dark' {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  applyTheme(theme: 'light' | 'dark') {
    document.documentElement.setAttribute('data-theme', theme);
  }

  // ============================================================
  // INSPECTION CONTROLS
  // ============================================================

  async handleToggle() {
    const enabled = this.inspectionToggle.checked;
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });

    if (tabs[0]?.id) {
      try {
        // Try to send message first (script might already be injected)
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: 'toggleInspection', enabled },
          async (response) => {
            if (chrome.runtime.lastError) {
              // Script not injected yet, inject it via service worker
              await chrome.runtime.sendMessage({
                action: 'toggleInspectionFromPopup',
                enabled,
                tabId: tabs[0].id
              });
            }
            this.updateStatus(enabled);
          }
        );
      } catch (error) {
        // Fallback: inject via service worker
        await chrome.runtime.sendMessage({
          action: 'toggleInspectionFromPopup',
          enabled,
          tabId: tabs[0]?.id
        });
        this.updateStatus(enabled);
      }
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

  // ============================================================
  // PREFERENCES
  // ============================================================

  async loadPreferences() {
    const result = await chrome.storage.local.get(['preferences']);
    const preferences = (result.preferences as { overlayColor?: string; tooltipFontSize?: number }) || {
      overlayColor: 'purple',
      tooltipFontSize: 12
    };

    this.currentColor = preferences.overlayColor || 'purple';
    this.currentFontSize = preferences.tooltipFontSize || 12;
    this.fontSizeValue.textContent = `${this.currentFontSize}px`;

    this.colorOptions.forEach(option => {
      const colorName = option.getAttribute('data-color');
      if (colorName === this.currentColor) {
        option.classList.add('selected');
      }
    });
  }

  handleColorChange(selectedOption: Element) {
    const colorName = selectedOption.getAttribute('data-color');
    if (!colorName) return;

    // Remove selected class from all options
    this.colorOptions.forEach(option => {
      option.classList.remove('selected');
    });

    // Add selected class to the clicked option
    selectedOption.classList.add('selected');

    this.currentColor = colorName;

    // Save preferences and update immediately
    this.savePreferences({
      overlayColor: colorName,
      tooltipFontSize: this.currentFontSize
    });
  }

  handleFontSizeChange(delta: number) {
    this.currentFontSize = Math.max(10, Math.min(20, this.currentFontSize + delta));
    this.fontSizeValue.textContent = `${this.currentFontSize}px`;
    this.savePreferences({
      overlayColor: this.currentColor,
      tooltipFontSize: this.currentFontSize
    });
  }

  async savePreferences(preferences: { overlayColor: string; tooltipFontSize: number }) {
    await chrome.storage.local.set({ preferences });
    console.log('Preferences saved:', preferences);

    // Send message to all tabs to update preferences
    try {
      const tabs = await chrome.tabs.query({});
      const promises = tabs.map(tab => {
        if (tab.id) {
          return chrome.tabs.sendMessage(
            tab.id,
            { action: 'updatePreferences', preferences }
          ).catch(() => {
            // Ignore errors for tabs without content script
            return null;
          });
        }
        return Promise.resolve(null);
      });
      await Promise.allSettled(promises);
    } catch (error) {
      console.log('Error sending preferences to tabs:', error);
    }
  }

}

// ============================================================
// INIT
// ============================================================

new PopupController();
