# Pixel Perfect Inspector

<div align="center">

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

**Inspect and extract CSS properties from DOM elements with pixel-perfect precision**

</div>

A Chrome extension for inspecting and extracting CSS properties from DOM elements with pixel-perfect precision. Perfect for developers ensuring accurate design implementations, designers checking spacing and typography, and anyone learning CSS.

## 📸 Screenshots

### Extension Popup
![Extension Popup](screenshots/1.png)
*The extension popup showing inspection mode toggle, color theme preferences (Purple→Pink), font size controls (12px), and quick guide on example.com.*

### Tooltip in Action
![Tooltip Example](screenshots/2.png)
*Smart tooltip showing typography properties (font-size: 16px, font-family: Inter, color: white, line-height: 28px, font-weight: 400) for a paragraph element on MDN Web Docs. The popup shows inspection mode active with Green theme selected.*

## ✨ Features

- 🎯 **Hover Highlighting** - Visual overlay shows element boundaries and dimensions
- 📝 **Smart Tooltips** - Context-aware tooltips show typography for text, layout for containers, and detailed info for images/SVGs
- 📏 **Distance Measurement** - Measure distance between any two elements (horizontal, vertical, diagonal)
- 📋 **One-Click Property Copying** - Copy individual CSS properties instantly
- 📤 **Export Options** - Download complete CSS or JSON data
- 📊 **Inspection History** - Quick access to last 10 inspected elements
- ⌨️ **Keyboard Shortcuts** - Efficient workflow with hotkeys
- 🎨 **Comprehensive Property Extraction** - Typography, spacing, dimensions, borders, and layout
- 🎨 **Customizable Themes** - Choose from 5 color themes (Purple-Pink, Blue, Green, Orange, Red)
- 📏 **Adjustable Font Size** - Tooltip font size from 10-20px
- 🔒 **Privacy First** - Works entirely locally, no data collection

## 🚀 Installation

### From Chrome Web Store (Recommended)
1. Visit the [Chrome Web Store listing](#) (coming soon)
2. Click "Add to Chrome"
3. Confirm installation

### From Source (Development)
```bash
# Clone the repository
git clone https://github.com/yourusername/pixel-perfect-chrome-extension.git
cd pixel-perfect-chrome-extension

# Install dependencies
npm install

# Build the extension
npm run build

# Load in Chrome
1. Open Chrome and go to chrome://extensions/
2. Enable "Developer mode" (top-right toggle)
3. Click "Load unpacked"
4. Select the `dist` folder from the project
```

## 📖 Usage

### Quick Start
1. **Activate Inspection Mode**
   - Click the extension icon in the toolbar, OR
   - Use keyboard shortcut: `Ctrl+Shift+P` (Mac: `Cmd+Shift+P`)

2. **Inspect Elements**
   - **Hover** over any element to see its dimensions and properties in a tooltip
   - **Click** to measure distance between two elements (H/V/Diagonal)
   - **Alt+Click** (Option+Click on Mac) to open the detailed property panel

3. **Copy & Export**
   - Click the 📋 icon next to any property to copy it
   - Use "Copy All Properties" to copy entire CSS block
   - Export as JSON or CSS file for documentation

4. **Customize**
   - Open the extension popup to change color themes
   - Adjust tooltip font size (10-20px)
   - Preferences are saved automatically

5. **Access History**
   - Click the extension icon to view recent inspections
   - Click any history item to re-open that element's panel

### Keyboard Shortcuts
- `Ctrl+Shift+P` (Mac: `Cmd+Shift+P`) - Toggle inspection mode
- `Esc` - Exit inspection mode
- ⚠️ **Note:** `Cmd+Shift+I` on Mac opens Chrome DevTools, so we use `Cmd+Shift+P` instead

## 🎯 Use Cases

### For Developers
- Verify design implementations match specifications
- Extract exact spacing, typography, and layout values
- Debug layout issues by inspecting computed properties
- Document component styles for style guides

### For Designers
- Check if developers implemented designs accurately
- Extract CSS values from existing websites for inspiration
- Verify responsive design breakpoints
- Analyze competitor website styles

### For Learners
- Understand how CSS properties work together
- Learn from well-designed websites
- Experiment with different property combinations
- Study real-world CSS implementations

## 🔧 Development

### Project Structure
```
pixel-perfect-chrome-extension/
├── src/
│   ├── background/          # Service worker
│   ├── content/            # Content scripts
│   │   ├── inspector.ts    # Main inspector logic
│   │   ├── extractor.ts    # CSS property extraction
│   │   └── overlay.ts      # Visual overlay
│   ├── panel/              # Side panel UI
│   ├── popup/              # Extension popup
│   └── shared/             # Shared utilities
│       ├── types.ts        # TypeScript types
│       ├── clipboard.ts    # Clipboard management
│       └── exporters.ts    # Export functionality
├── public/                 # Static assets
└── dist/                   # Built extension (generated)
```

### Available Scripts
```bash
npm install        # Install dependencies
npm run build      # Production build
npm run dev        # Development mode (future: with hot reload)
```

### Tech Stack
- **TypeScript 5+** - Type-safe development
- **Chrome Extension Manifest V3** - Latest extension platform
- **Vite** - Fast build tool
- **Vanilla JS** - No framework dependencies for minimal bundle size

### Building for Production
```bash
# Build optimized version
npm run build

# The dist/ folder contains the production-ready extension
# Test it by loading in Chrome before publishing
```

## 📋 Extracted Properties

The extension extracts the following CSS properties:

### Typography
- Font Family
- Font Size
- Font Weight
- Line Height
- Color
- Letter Spacing
- Text Transform

### Dimensions
- Width (with computed value)
- Height (with computed value)
- Min/Max Width
- Min/Max Height

### Spacing
- Padding (all sides, with shorthand)
- Margin (all sides, with shorthand)
- Gap (for flexbox/grid)

### Borders
- Border Radius (all corners)
- Border Width, Style, Color

### Layout
- Display
- Position
- Flex Direction
- Justify Content
- Align Items

## 🔒 Privacy & Permissions

### Permissions Used
- `activeTab` - Access current tab to inject inspector (only when activated)
- `storage` - Save inspection history locally

### Privacy Guarantee
- ✅ No data is sent to external servers
- ✅ No analytics or tracking
- ✅ History stored only in your browser
- ✅ Works completely offline
- ✅ Only activates when you explicitly enable it

## 🐛 Troubleshooting

### Extension Icon Not Appearing
- Ensure the extension is enabled in `chrome://extensions/`
- Pin the extension to the toolbar via the extensions menu

### Inspection Mode Not Working
- Refresh the page after installing/updating the extension
- Check that you've granted necessary permissions
- Try on a different website (some sites may block extensions)

### Properties Not Displaying Correctly
- Ensure elements have computed styles
- Some properties may not apply to certain elements
- Pseudo-elements are not currently supported

### Copy/Export Not Working
- Grant clipboard permissions if prompted
- Check browser console for errors
- Ensure popup blockers aren't blocking downloads

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Test thoroughly
5. Commit: `git commit -m "Add my feature"`
6. Push: `git push origin feature/my-feature`
7. Create a Pull Request

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

Built with inspiration from browser DevTools and design-to-code workflows.

## 📞 Support

- 🐛 [Report a Bug](https://github.com/yourusername/pixel-perfect-chrome-extension/issues)
- 💡 [Request a Feature](https://github.com/yourusername/pixel-perfect-chrome-extension/issues)
- 📧 Email: your-email@example.com

## 📊 Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and updates.

---

<div align="center">

Made with ❤️ for the web development community

[🐛 Report Bug](https://github.com/yourusername/pixel-perfect-chrome-extension/issues) • [💡 Request Feature](https://github.com/yourusername/pixel-perfect-chrome-extension/issues) • [📊 Changelog](CHANGELOG.md)

</div>
