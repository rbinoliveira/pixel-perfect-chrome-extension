# Testing Guide - Pixel Perfect Inspector

## Prerequisites
- Chrome or Edge (version 100+)
- Node.js and npm installed
- Project built successfully

## Building the Project

```bash
# Install dependencies
npm install

# Build the extension (compiles TypeScript + copies assets)
npm run build:test

# Or build step by step:
npx tsc                    # Compile TypeScript
npm run build:copy         # Copy assets to dist/
```

**Output:** The `dist/` folder will contain the production-ready extension

## Quick Test Options

### Option 1: Basic Functionality Test (5 minutes)
Quick smoke test to verify core features work:
1. Load extension in Chrome
2. Activate inspection mode
3. Hover over an element (verify overlay appears)
4. Click an element (verify panel opens)
5. Close panel

### Option 2: Comprehensive Test (30 minutes)
Full test suite covering all features:
- Follow the complete checklist below
- Test on 3+ different websites
- Test with various element types
- Verify all property extractions

### Option 3: Automated Test Script (Future)
```bash
# When automated tests are implemented:
npm test              # Run unit tests
npm run test:e2e      # Run end-to-end tests
npm run test:perf     # Run performance tests
```

### Option 4: Focused Feature Testing
Test specific features in isolation:
- **Overlay Testing:** Focus only on hover and visual feedback
- **Extraction Testing:** Focus on CSS property accuracy
- **UI Testing:** Focus on panel, popup, and interactions
- **Performance Testing:** Focus on speed and memory usage

## Loading the Extension

1. Open Chrome/Edge
2. Navigate to `chrome://extensions/`
3. Enable **"Developer mode"** (toggle in top-right corner)
4. Click **"Load unpacked"**
5. Select the `dist/` folder from the project

## Manual Test Checklist

### ✅ Installation & Setup

- [ ] Extension loads without errors
- [ ] Extension icon appears in toolbar
- [ ] No console errors in `chrome://extensions/`
- [ ] Manifest V3 is properly configured
- [ ] All permissions are granted

### ✅ Inspection Mode Activation

- [ ] Click extension icon activates inspection mode
- [ ] Keyboard shortcut `Ctrl+Shift+I` (Mac: `Cmd+Shift+I`) toggles inspection
- [ ] Icon changes to indicate active state (if applicable)
- [ ] Cursor changes to crosshair
- [ ] Mode can be toggled on and off

### ✅ Visual Overlay

- [ ] Hover over elements shows blue border
- [ ] Tooltip displays element tag (e.g., `<div>`)
- [ ] Tooltip displays dimensions (e.g., `320×240px`)
- [ ] Overlay follows mouse smoothly
- [ ] Overlay doesn't interfere with page interaction
- [ ] Overlay ignores its own elements (no recursive highlighting)
- [ ] Works with nested elements
- [ ] Works with positioned elements (absolute, fixed, sticky)
- [ ] Works with transformed elements
- [ ] Works with elements at different z-index levels

### ✅ Element Inspection

- [ ] Click on element opens side panel
- [ ] Panel appears from the right side
- [ ] Panel has proper width (400px)
- [ ] Panel scrolls when content exceeds viewport
- [ ] Panel shows element tag name
- [ ] Panel shows element class name (if present)
- [ ] Close button (×) works and removes panel
- [ ] Inspection mode disables after element click
- [ ] Multiple inspections work sequentially

### ✅ CSS Property Extraction - Typography

- [ ] Font Family is extracted correctly
- [ ] Font Size shows value and unit
- [ ] Font Weight displays (numeric or keyword)
- [ ] Line Height shows value and unit
- [ ] Color displays with preview square
- [ ] Letter Spacing shows (if present)
- [ ] Text Transform shows (if present)
- [ ] All values match browser DevTools

### ✅ CSS Property Extraction - Dimensions

- [ ] Width shows value, unit, and computed pixels
- [ ] Height shows value, unit, and computed pixels
- [ ] Computed values are accurate
- [ ] Min/Max Width display (if set)
- [ ] Min/Max Height display (if set)
- [ ] Percentage values computed correctly
- [ ] Auto values handled properly

### ✅ CSS Property Extraction - Spacing

- [ ] Padding displays all sides
- [ ] Padding shorthand formatted correctly (uniform: "10px", two values: "10px 20px", etc.)
- [ ] Margin displays all sides
- [ ] Margin shorthand formatted correctly
- [ ] Gap displays (for flex/grid containers)
- [ ] Auto margins displayed correctly
- [ ] Zero values displayed

### ✅ CSS Property Extraction - Borders

- [ ] Border radius displays all corners
- [ ] Uniform border radius shows single value
- [ ] Non-uniform border radius shows all values
- [ ] Border width extracted
- [ ] Border style extracted (solid, dashed, etc.)
- [ ] Border color extracted
- [ ] Zero borders handled correctly

### ✅ CSS Property Extraction - Layout

- [ ] Display property extracted (block, flex, grid, etc.)
- [ ] Position extracted (static, relative, absolute, fixed, sticky)
- [ ] Flex Direction shows (for flex containers)
- [ ] Justify Content shows (for flex containers)
- [ ] Align Items shows (for flex containers)
- [ ] Layout section hidden for non-flex elements

### ✅ Copy Individual Properties

- [ ] Click copy button (📋) copies property value
- [ ] Visual feedback shows (checkmark appears)
- [ ] Feedback disappears after 1 second
- [ ] Copied text is in clipboard
- [ ] Clipboard API works
- [ ] Fallback works in older browsers
- [ ] Copy works for all property types

### ✅ Copy All Properties

- [ ] "Copy All Properties" button exists
- [ ] Button copies complete CSS block
- [ ] CSS format is valid and properly formatted
- [ ] All properties included in output
- [ ] Selector included in CSS output
- [ ] Multi-line formatting correct
- [ ] Shorthand properties used where appropriate

### ✅ Export JSON

- [ ] "Export JSON" button exists
- [ ] Click triggers file download
- [ ] JSON file has proper filename (includes selector and timestamp)
- [ ] JSON is valid and properly formatted
- [ ] All element data included (properties, position, metadata)
- [ ] File can be parsed by JSON.parse()
- [ ] Download doesn't block UI

### ✅ Export CSS

- [ ] "Export CSS" button exists
- [ ] Click triggers file download
- [ ] CSS file has proper filename (includes selector and timestamp)
- [ ] CSS is valid and can be used in stylesheets
- [ ] All properties properly formatted
- [ ] Semicolons and braces correct
- [ ] Indentation consistent

### ✅ Popup UI

- [ ] Popup opens when clicking extension icon
- [ ] Popup has proper dimensions (320px width)
- [ ] Header displays "Pixel Perfect Inspector"
- [ ] Toggle switch present for inspection mode
- [ ] Toggle reflects current inspection state
- [ ] Toggle changes inspection mode when clicked
- [ ] Status text updates based on mode
- [ ] Status text color changes (green when active, gray when inactive)

### ✅ Inspection History

- [ ] History section displays in popup
- [ ] "No inspections yet" shows when history is empty
- [ ] History items appear after inspecting elements
- [ ] Shows last 10 inspections only
- [ ] Each item shows element tag
- [ ] Each item shows class name (if present)
- [ ] Each item shows timestamp (formatted)
- [ ] Each item shows dimensions
- [ ] Timestamp formats correctly:
  - [ ] "Just now" (< 1 minute)
  - [ ] "Xm ago" (< 60 minutes)
  - [ ] "Xh ago" (< 24 hours)
  - [ ] Date string (older than 24 hours)
- [ ] Click history item re-opens that element's panel
- [ ] History persists across popup opens/closes
- [ ] History survives browser restart

### ✅ Clear History

- [ ] "Clear History" button exists
- [ ] Click shows confirmation dialog
- [ ] Confirming clears all history
- [ ] History list shows empty state after clearing
- [ ] Canceling keeps history intact

### ✅ Keyboard Shortcuts

- [ ] Shortcuts section displays in popup
- [ ] Lists Ctrl+Shift+I shortcut
- [ ] Lists Esc shortcut
- [ ] Keyboard tags styled properly
- [ ] Shortcuts actually work

### ✅ Cross-Browser Testing

- [ ] Works on Chrome 100+
- [ ] Works on Edge 100+
- [ ] Works on other Chromium browsers

### ✅ Cross-Website Testing

- [ ] Works on localhost (`http://localhost:*`)
- [ ] Works on HTTPS sites
- [ ] Works on HTTP sites (if allowed)
- [ ] Works on simple HTML pages
- [ ] Works on complex React/Vue/Angular apps
- [ ] Works on e-commerce sites
- [ ] Works on news sites
- [ ] Works on documentation sites

### ✅ Element Type Testing

Test with various element types:
- [ ] Text elements (`<p>`, `<span>`, `<h1>`)
- [ ] Block elements (`<div>`, `<section>`, `<article>`)
- [ ] Images (`<img>`)
- [ ] Links (`<a>`)
- [ ] Buttons (`<button>`)
- [ ] Form elements (`<input>`, `<textarea>`)
- [ ] Lists (`<ul>`, `<ol>`, `<li>`)
- [ ] Tables (`<table>`, `<tr>`, `<td>`)
- [ ] Flex containers
- [ ] Grid containers
- [ ] Absolutely positioned elements
- [ ] Fixed positioned elements
- [ ] Sticky positioned elements
- [ ] Elements with transforms
- [ ] Elements with transparency
- [ ] Hidden elements (display: none) - should not be inspectable

### ✅ Performance Testing

- [ ] Extension loads in < 500ms
- [ ] Overlay appears instantly on hover
- [ ] Property extraction completes in < 50ms
- [ ] Panel renders in < 100ms
- [ ] No memory leaks after 50+ inspections
- [ ] Memory usage < 50MB
- [ ] No lag when hovering rapidly
- [ ] No performance impact on page when inactive

### ✅ Edge Cases

- [ ] Elements with no classes
- [ ] Elements with multiple classes
- [ ] Elements with inline styles
- [ ] Elements with !important rules
- [ ] Elements with inherited properties
- [ ] Very small elements (< 10px)
- [ ] Very large elements (> 5000px)
- [ ] Elements with overflow: hidden
- [ ] Elements with border-box vs content-box
- [ ] Elements with viewport units (vw, vh)
- [ ] Elements with calc() values
- [ ] Elements with CSS custom properties (variables)

### ✅ Error Handling

- [ ] No crashes with invalid elements
- [ ] Graceful degradation with missing properties
- [ ] Error messages are user-friendly
- [ ] Console errors are descriptive
- [ ] Failed clipboard access doesn't break UI
- [ ] Failed downloads show feedback

### ✅ Accessibility

- [ ] Keyboard navigation works in popup
- [ ] Focus indicators visible
- [ ] Buttons have appropriate labels
- [ ] Color contrast meets WCAG standards

### ✅ Security & Privacy

- [ ] No data sent to external servers
- [ ] No tracking or analytics
- [ ] Minimal permissions requested
- [ ] Only activates on user action
- [ ] No sensitive data logged
- [ ] Safe to use on any website

### ✅ UI/UX Polish

- [ ] Panel design matches specifications
- [ ] Colors and spacing consistent
- [ ] Typography clear and readable
- [ ] Icons display correctly
- [ ] Hover states work on buttons
- [ ] Transitions smooth
- [ ] No visual glitches
- [ ] Responsive to different viewport heights

## Automated Testing (Future)

Future versions should include:
- Unit tests for utility functions
- Integration tests for core workflows
- E2E tests with Playwright/Puppeteer
- Performance benchmarks
- Accessibility audits

## Debugging

### Service Worker Logs
1. Go to `chrome://extensions/`
2. Click "Details" on the extension
3. Click "Service worker" (or "Inspect views: service worker")
4. DevTools opens for the service worker

### Content Script Logs
1. Open the test page
2. Press `F12` to open DevTools
3. Go to "Console" tab
4. Content script logs appear here

### Common Issues

**Extension doesn't load:**
- Check `manifest.json` for errors
- Ensure all referenced files exist
- Verify permissions

**Inspection mode doesn't activate:**
- Check service worker console for errors
- Ensure content script injection works
- Refresh the page

**Overlay doesn't appear:**
- Check page console (F12)
- Ensure `overlay.css` loaded
- Check for CSS conflicts

**Properties incorrect:**
- Compare with browser DevTools
- Check if element has custom styles
- Verify computed style access

**Copy/Export doesn't work:**
- Check clipboard permissions
- Look for console errors
- Test in incognito mode

## Test Report Template

```markdown
## Test Report - [Date]

**Tester:** [Name]
**Browser:** Chrome/Edge [Version]
**OS:** Windows/Mac/Linux [Version]

### Summary
- Total Tests: X
- Passed: X
- Failed: X
- Skipped: X

### Failed Tests
1. [Test Name]
   - Expected: [...]
   - Actual: [...]
   - Steps to Reproduce: [...]

### Notes
[Any additional observations]
```

## Pre-Release Checklist

Before submitting to Chrome Web Store:
- [ ] All critical tests pass
- [ ] No console errors
- [ ] Performance meets requirements
- [ ] Documentation complete
- [ ] Icons optimized
- [ ] Version number updated
- [ ] Changelog updated
- [ ] README accurate
- [ ] Screenshots prepared
- [ ] Privacy policy reviewed
- [ ] License file present

---

**Note:** This is a living document. Update as new features are added or issues discovered.
