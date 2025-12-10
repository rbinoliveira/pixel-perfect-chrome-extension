# Changelog

All notable changes to the Pixel Perfect Inspector extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-12-10

### Added
- Initial release of Pixel Perfect Inspector
- Element inspection with hover highlighting and visual overlay
- Comprehensive CSS property extraction organized by category:
  - Typography (font family, size, weight, line height, color, letter spacing, text transform)
  - Dimensions (width, height, min/max values with computed pixels)
  - Spacing (padding, margin with shorthand formatting, gap)
  - Borders (border radius, border width/style/color)
  - Layout (display, position, flexbox properties)
- Side panel UI with polished, modern design
- Property display with emoji icons and organized sections
- Individual property copy buttons with visual feedback
- "Copy All Properties" button to copy complete CSS block
- Export functionality for JSON format (complete element data)
- Export functionality for CSS format (ready-to-use stylesheets)
- Inspection history feature (stores last 10 inspected elements)
- Extension popup with inspection mode toggle
- History list in popup with clickable items to reload inspections
- Timestamp formatting (just now, Xm ago, Xh ago, date)
- Keyboard shortcut: Ctrl+Shift+I (Cmd+Shift+I on Mac) to toggle inspection
- Keyboard shortcut: Esc to exit inspection mode
- Clear history button in popup
- Color preview squares for color properties
- Computed pixel values shown alongside percentage/relative units
- Automatic CSS injection for panel styles
- Clipboard fallback for browsers without Clipboard API
- Chrome Extension Manifest V3 implementation
- Service worker for background tasks
- TypeScript implementation with full type safety
- Optimized build process with asset copying

### Technical Details
- Built with TypeScript 5+
- Chrome Extension Manifest V3
- Vite build tooling
- Minimal permissions (activeTab, storage, scripting)
- No external dependencies in runtime
- Local-only operation (no data sent to servers)
- Memory efficient implementation
- Fast CSS extraction (<50ms for most elements)

### Browser Support
- Chrome 100+
- Edge 100+
- Any Chromium-based browser with Manifest V3 support

---

## Future Plans

### [1.1.0] - Planned
- CSS Grid property extraction
- Shadow DOM support
- Pseudo-element inspection (::before, ::after)
- Custom color format options (hex, rgb, hsl)
- Export to Figma/Sketch formats
- Batch export for multiple elements
- Settings page with preferences
- Dark mode theme
- Additional keyboard shortcuts
- Export to CSS variables format
- Comparison mode (compare two elements)

### [1.2.0] - Planned
- Animation/transition property extraction
- Responsive design testing tools
- Element screenshot capture
- Style guide generation
- Integration with design tools APIs
- Custom property sets (save favorite properties)
- Cloud sync for history (optional)
- Team collaboration features

---

## Version History

| Version | Release Date | Description |
|---------|-------------|-------------|
| 1.0.0   | 2025-12-10  | Initial release |

---

**Note:** Dates use the format YYYY-MM-DD (ISO 8601)
