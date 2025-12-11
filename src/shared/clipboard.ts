// ============================================================
// CLIPBOARD MANAGER
// ============================================================

export class ClipboardManager {
  static async copyToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      return success;
    }
  }

  static showCopyFeedback(button: HTMLElement) {
    const originalText = button.textContent;
    button.textContent = '✓';
    button.style.color = '#00C853';
    setTimeout(() => {
      button.textContent = originalText;
      button.style.color = '';
    }, 1000);
  }
}
