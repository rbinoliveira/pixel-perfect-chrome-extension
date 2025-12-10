// Color palette: Purple (primary), Pink (secondary), Green (tertiary)
export const OVERLAY_COLOR = '#8B5CF6'; // Purple - primary color
export const SECONDARY_COLOR = '#EC4899'; // Pink - secondary color
export const TERTIARY_COLOR = '#10B981'; // Green - tertiary color
export const OVERLAY_WIDTH = 2;
export const OVERLAY_Z_INDEX = 2147483647;

export const CSS_PROPERTIES_TO_EXTRACT = [
  // Typography
  'font-family',
  'font-size',
  'font-weight',
  'line-height',
  'letter-spacing',
  'text-transform',
  'color',
  // Spacing
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
  // Dimensions
  'width',
  'height',
  'min-width',
  'max-width',
  'min-height',
  'max-height',
  // Borders
  'border-radius',
  'border',
  'border-width',
  'border-style',
  'border-color',
  // Layout
  'display',
  'position',
  'flex-direction',
  'justify-content',
  'align-items',
] as const;

export const STORAGE_KEYS = {
  HISTORY: 'history',
  SETTINGS: 'settings',
} as const;

export const KEYBOARD_SHORTCUTS = {
  TOGGLE_INSPECTION: 'Ctrl+Shift+I',
  TOGGLE_INSPECTION_MAC: 'Command+Shift+I',
  EXIT_INSPECTION: 'Escape',
} as const;
