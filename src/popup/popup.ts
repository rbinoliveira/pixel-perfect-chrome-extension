// ============================================================
// POPUP CONTROLLER
// ============================================================

class PopupController {
  private inspectionToggle: HTMLInputElement;
  private statusText: HTMLElement;
  private historyList: HTMLElement;
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
    this.historyList = document.getElementById('history-list') as HTMLElement;
    this.colorOptions = document.querySelectorAll('.color-option');
    this.fontSizeValue = document.getElementById('font-size-value') as HTMLElement;
    this.fontSizeDecrease = document.getElementById('font-size-decrease') as HTMLButtonElement;
    this.fontSizeIncrease = document.getElementById('font-size-increase') as HTMLButtonElement;
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
    this.loadHistory();
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
    document.getElementById('clear-history')?.addEventListener('click', () => this.clearHistory());

    this.colorOptions.forEach(option => {
      option.addEventListener('click', () => this.handleColorChange(option));
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
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: 'toggleInspection', enabled },
        (response) => {
          if (chrome.runtime.lastError) {
            console.log('Content script not available');
          }
        }
      );
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

  // ============================================================
  // PREFERENCES
  // ============================================================

  async loadPreferences() {
    const result = await chrome.storage.local.get(['preferences']);
    const preferences = result.preferences || {
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

    this.colorOptions.forEach(option => option.classList.remove('selected'));
    selectedOption.classList.add('selected');

    this.currentColor = colorName;

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

    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs[0]?.id) {
      try {
        await chrome.tabs.sendMessage(
          tabs[0].id,
          { action: 'updatePreferences', preferences }
        );
      } catch (error) {
        console.log('Content script not available, preferences will apply on next activation');
      }
    }
  }

  // ============================================================
  // HISTORY
  // ============================================================

  async loadHistory() {
    chrome.storage.local.get(['history'], (result) => {
      const history = (result.history as any[]) || [];

      if (history.length === 0) {
        this.historyList.innerHTML = '<div class="empty-state">No inspections yet</div>';
        return;
      }

      this.historyList.innerHTML = history
        .slice(0, 10)
        .map((item: any) => `
          <div class="history-item" data-id="${item.id}">
            <div class="history-item-header">
              <span class="element-tag">&lt;${item.tagName}&gt;</span>
              ${item.className ? `<span class="element-class">.${item.className.split(' ')[0]}</span>` : ''}
            </div>
            <div class="history-item-meta">
              <span>${this.formatTimestamp(item.timestamp)}</span>
              <span>${Math.round(item.position.width)}×${Math.round(item.position.height)}px</span>
            </div>
          </div>
        `).join('');

      this.historyList.querySelectorAll('.history-item').forEach((item) => {
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
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs[0]?.id && id) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'loadHistoryItem', id });
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

// ============================================================
// INIT
// ============================================================

new PopupController();
