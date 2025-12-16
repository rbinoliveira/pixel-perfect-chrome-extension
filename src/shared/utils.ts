// ============================================================
// ID GENERATION
// ============================================================

export function generateUniqueId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `${timestamp}-${random}`;
}

// ============================================================
// CSS UTILITIES
// ============================================================

export function parseUnit(value: string): { value: number; unit: string } {
  const withUnit = value.match(/^([\d.]+)([a-z%]*)$/);
  if (withUnit) {
    return {
      value: parseFloat(withUnit[1]),
      unit: withUnit[2] || 'px',
    };
  }

  const numberOnly = value.match(/^([\d.]+)$/);
  if (numberOnly) {
    return {
      value: parseFloat(numberOnly[1]),
      unit: 'px',
    };
  }

  return { value: 0, unit: '' };
}
