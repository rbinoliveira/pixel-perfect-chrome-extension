const esbuild = require('esbuild');
const path = require('path');

async function build() {
  console.log('📦 Fazendo bundling dos scripts...');

  // Build service worker
  await esbuild.build({
    entryPoints: ['src/background/service-worker.ts'],
    bundle: true,
    outfile: 'dist/background/service-worker.js',
    format: 'iife',
    platform: 'browser',
    target: 'es2020',
    minify: false,
    sourcemap: false,
  });
  console.log('✅ service-worker.js bundlado');

  // Build content script
  await esbuild.build({
    entryPoints: ['src/content/inspector.ts'],
    bundle: true,
    outfile: 'dist/content/inspector.js',
    format: 'iife',
    platform: 'browser',
    target: 'es2020',
    minify: false,
    sourcemap: false,
  });
  console.log('✅ inspector.js bundlado');
}

build().catch(err => {
  console.error('❌ Erro no bundling:', err);
  process.exit(1);
});
