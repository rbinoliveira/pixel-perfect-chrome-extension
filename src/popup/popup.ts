class PopupController {
  private inspectionToggle: HTMLInputElement;
  private statusText: HTMLElement;
  private historyList: HTMLElement;
  private colorThemeSelect: HTMLSelectElement;
  private fontSizeValue: HTMLElement;
  private fontSizeDecrease: HTMLButtonElement;
  private fontSizeIncrease: HTMLButtonElement;
  private currentFontSize: number = 12;

  constructor() {
    this.inspectionToggle = document.getElementById(
      'inspection-toggle'
    ) as HTMLInputElement;
    this.statusText = document.getElementById('status-text') as HTMLElement;
    this.historyList = document.getElementById('history-list') as HTMLElement;
    this.colorThemeSelect = document.getElementById('color-theme') as HTMLSelectElement;
    this.fontSizeValue = document.getElementById('font-size-value') as HTMLElement;
    this.fontSizeDecrease = document.getElementById('font-size-decrease') as HTMLButtonElement;
    this.fontSizeIncrease = document.getElementById('font-size-increase') as HTMLButtonElement;
    this.init();
  }

  async init() {
    // Get current inspection state
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs[0]?.id) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: 'getInspectionState' },
        (response) => {
          if (chrome.runtime.lastError) {
            // Content script not loaded yet, that's okay
            return;
          }
          if (response?.enabled) {
            this.inspectionToggle.checked = true;
            this.updateStatus(true);
          }
        }
      );
    }

    // Setup event listeners
    this.inspectionToggle.addEventListener('change', () =>
      this.handleToggle()
    );
    document
      .getElementById('clear-history')
      ?.addEventListener('click', () => this.clearHistory());

    // Setup preferences event listeners
    this.colorThemeSelect.addEventListener('change', () => this.handleColorThemeChange());
    this.fontSizeDecrease.addEventListener('click', () => this.handleFontSizeChange(-1));
    this.fontSizeIncrease.addEventListener('click', () => this.handleFontSizeChange(1));

    // Load preferences and history
    this.loadPreferences();
    this.loadHistory();
  }

  async handleToggle() {
    const enabled = this.inspectionToggle.checked;
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });

    if (tabs[0]?.id) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: 'toggleInspection', enabled },
        (response) => {
          if (chrome.runtime.lastError) {
            // Content script not loaded, need to inject it
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

  async loadHistory() {
    chrome.storage.local.get(['history'], (result) => {
      const history = (result.history as any[]) || [];

      if (history.length === 0) {
        this.historyList.innerHTML = `
          <div class="empty-state">
            No inspections yet
          </div>
        `;
        return;
      }

      this.historyList.innerHTML = history
        .slice(0, 10) // Show only last 10 items
        .map(
          (item: any) => `
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
      `
        )
        .join('');

      // Add click handlers to history items
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
    // Send message to content script to re-open panel with this element
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

  loadPreferences() {
    chrome.storage.local.get(['preferences'], (result) => {
      const preferences = result.preferences || {
        colorTheme: 'purple-pink',
        tooltipFontSize: 12
      };

      this.colorThemeSelect.value = preferences.colorTheme;
      this.currentFontSize = preferences.tooltipFontSize;
      this.fontSizeValue.textContent = `${this.currentFontSize}px`;
    });
  }

  handleColorThemeChange() {
    const colorTheme = this.colorThemeSelect.value;
    this.savePreferences({ colorTheme, tooltipFontSize: this.currentFontSize });
  }

  handleFontSizeChange(delta: number) {
    this.currentFontSize = Math.max(10, Math.min(20, this.currentFontSize + delta));
    this.fontSizeValue.textContent = `${this.currentFontSize}px`;
    this.savePreferences({
      colorTheme: this.colorThemeSelect.value,
      tooltipFontSize: this.currentFontSize
    });
  }

  async savePreferences(preferences: { colorTheme: string; tooltipFontSize: number }) {
    // Save to storage
    chrome.storage.local.set({ preferences }, () => {
      console.log('Preferences saved:', preferences);
    });

    // Send to content script
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs[0]?.id) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: 'updatePreferences', preferences },
        (response) => {
          if (chrome.runtime.lastError) {
            // Content script not loaded yet, that's okay - will load on next activation
            console.log('Content script not available, preferences will apply on next activation');
          }
        }
      );
    }
  }
}

// Initialize popup
new PopupController();
