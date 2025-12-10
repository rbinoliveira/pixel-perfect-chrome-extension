export function generateUniqueId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function formatCSSValue(value: string): string {
  return value.trim();
}

export function parseUnit(value: string): { value: number; unit: string } {
  const match = value.match(/^([\d.]+)([a-z%]*)$/);
  if (!match) {
    // Try to parse as number only
    const numMatch = value.match(/^([\d.]+)$/);
    if (numMatch) {
      return {
        value: parseFloat(numMatch[1]),
        unit: 'px',
      };
    }
    return { value: 0, unit: '' };
  }
  return {
    value: parseFloat(match[1]),
    unit: match[2] || 'px',
  };
}
