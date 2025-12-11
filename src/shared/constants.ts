// ============================================================
// TYPES
// ============================================================

export interface ColorOption {
  name: string;
  value: string;
  contrast: string;
}

// ============================================================
// COLOR PALETTE
// ============================================================

export const OVERLAY_COLORS = {
  light: [
    { name: 'purple', value: '#7C3AED', contrast: '#FFFFFF' },
    { name: 'blue', value: '#2563EB', contrast: '#FFFFFF' },
    { name: 'cyan', value: '#0891B2', contrast: '#FFFFFF' },
    { name: 'teal', value: '#0D9488', contrast: '#FFFFFF' },
    { name: 'green', value: '#16A34A', contrast: '#FFFFFF' },
    { name: 'orange', value: '#EA580C', contrast: '#FFFFFF' },
    { name: 'red', value: '#DC2626', contrast: '#FFFFFF' },
    { name: 'pink', value: '#DB2777', contrast: '#FFFFFF' },
    { name: 'indigo', value: '#4F46E5', contrast: '#FFFFFF' },
    { name: 'amber', value: '#D97706', contrast: '#FFFFFF' }
  ] as ColorOption[],
  dark: [
    { name: 'purple', value: '#A78BFA', contrast: '#1F2937' },
    { name: 'blue', value: '#60A5FA', contrast: '#1F2937' },
    { name: 'cyan', value: '#22D3EE', contrast: '#1F2937' },
    { name: 'teal', value: '#2DD4BF', contrast: '#1F2937' },
    { name: 'green', value: '#4ADE80', contrast: '#1F2937' },
    { name: 'orange', value: '#FB923C', contrast: '#1F2937' },
    { name: 'red', value: '#F87171', contrast: '#1F2937' },
    { name: 'pink', value: '#F472B6', contrast: '#1F2937' },
    { name: 'indigo', value: '#818CF8', contrast: '#1F2937' },
    { name: 'amber', value: '#FCD34D', contrast: '#1F2937' }
  ] as ColorOption[]
};

// ============================================================
// THEME HELPERS
// ============================================================

export function getCurrentTheme(): 'light' | 'dark' {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

export function getOverlayColor(colorName: string, theme?: 'light' | 'dark'): ColorOption {
  const currentTheme = theme || getCurrentTheme();
  const colors = OVERLAY_COLORS[currentTheme];
  const color = colors.find(c => c.name === colorName);
  return color || colors[0];
}

export function getOverlayColorByIndex(index: number, theme?: 'light' | 'dark'): ColorOption {
  const currentTheme = theme || getCurrentTheme();
  const colors = OVERLAY_COLORS[currentTheme];
  return colors[index % colors.length];
}

// ============================================================
// LAYOUT CONSTANTS
// ============================================================

export const OVERLAY_WIDTH = 2;
export const OVERLAY_Z_INDEX = 2147483647;

export const SECONDARY_COLOR = '#EC4899';
export const TERTIARY_COLOR = '#10B981';

// ============================================================
// CSS EXTRACTION
// ============================================================

export const CSS_PROPERTIES_TO_EXTRACT = [
  'font-family',
  'font-size',
  'font-weight',
  'line-height',
  'letter-spacing',
  'text-transform',
  'color',
  'padding',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'margin',
  'margin-top',
  'margin-right',
  'margin-bottom',
  'margin-left',
  'gap',
  'width',
  'height',
  'min-width',
  'max-width',
  'min-height',
  'max-height',
  'border-radius',
  'border',
  'border-width',
  'border-style',
  'border-color',
  'display',
  'position',
  'flex-direction',
  'justify-content',
  'align-items',
] as const;

// ============================================================
// STORAGE & SHORTCUTS
// ============================================================

export const STORAGE_KEYS = {
  HISTORY: 'history',
  SETTINGS: 'settings',
} as const;

export const KEYBOARD_SHORTCUTS = {
  TOGGLE_INSPECTION: 'Ctrl+Shift+I',
  TOGGLE_INSPECTION_MAC: 'Command+Shift+I',
  EXIT_INSPECTION: 'Escape',
} as const;
