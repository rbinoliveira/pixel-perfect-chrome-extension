# Task ID: 1

**Title:** Project Setup and Build Configuration

**Status:** done

**Dependencies:** None

**Priority:** high

**Description:** Initialize the Chrome extension project with TypeScript, Vite build system, and folder structure according to the architecture specification

**Details:**

1. Initialize npm project with `npm init`
2. Install dependencies:
   - TypeScript 5+: `npm install -D typescript @types/chrome`
   - Vite: `npm install -D vite vite-plugin-web-extension`
   - CSS tooling: `npm install -D tailwindcss postcss autoprefixer` (or CSS Modules setup)
3. Create tsconfig.json with strict mode:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "types": ["chrome"]
  }
}
```
4. Create folder structure:
   - background/
   - content/ (inspector.ts, overlay.ts, extractor.ts)
   - popup/ (popup.html, popup.ts, popup.css)
   - panel/ (panel.html, panel.ts, panel.css)
   - shared/ (types.ts, utils.ts, constants.ts)
5. Configure Vite build (vite.config.ts) to bundle extension with proper entry points
6. Add build scripts to package.json: `build`, `dev`, `watch`
7. Create .gitignore (node_modules, dist, .env)
8. Initialize README.md with project overview

**Test Strategy:**

1. Run `npm run build` and verify dist/ folder is created
2. Check that all TypeScript files compile without errors
3. Verify folder structure matches specification
4. Ensure build output includes all necessary files for Chrome extension
5. Test hot reload in dev mode with `npm run dev`
