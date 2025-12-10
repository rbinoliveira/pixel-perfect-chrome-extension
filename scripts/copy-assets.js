const fs = require('fs');
const path = require('path');

console.log('📋 Copiando assets para dist/...');

// Criar diretórios necessários
const dirs = ['dist/icons', 'dist/content', 'dist/background', 'dist/popup', 'dist/panel'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Copiar manifest
if (fs.existsSync('public/manifest.json')) {
  fs.copyFileSync('public/manifest.json', 'dist/manifest.json');
  console.log('✅ manifest.json copiado');
} else {
  console.error('❌ public/manifest.json não encontrado');
}

// Copiar ícones
if (fs.existsSync('public/icons')) {
  const icons = fs.readdirSync('public/icons');
  icons.forEach(icon => {
    const src = path.join('public/icons', icon);
    const dest = path.join('dist/icons', icon);
    fs.copyFileSync(src, dest);
  });
  console.log(`✅ ${icons.length} ícone(s) copiado(s)`);
} else {
  console.warn('⚠️  Pasta public/icons não encontrada (criando placeholders)');
  // Criar placeholders vazios
  ['icon16.png', 'icon48.png', 'icon128.png'].forEach(icon => {
    fs.writeFileSync(path.join('dist/icons', icon), '');
  });
}

// Copiar CSS
if (fs.existsSync('src/content/overlay.css')) {
  fs.copyFileSync('src/content/overlay.css', 'dist/content/overlay.css');
  console.log('✅ overlay.css copiado');
}

// Copiar popup CSS
if (fs.existsSync('public/popup.css')) {
  fs.copyFileSync('public/popup.css', 'dist/popup.css');
  console.log('✅ popup.css copiado');
}

// Copiar popup HTML
if (fs.existsSync('public/popup.html')) {
  fs.copyFileSync('public/popup.html', 'dist/popup.html');
  console.log('✅ popup.html copiado');
}

// Copiar popup JS
if (fs.existsSync('public/popup.js')) {
  fs.copyFileSync('public/popup.js', 'dist/popup.js');
  console.log('✅ popup.js copiado');
}

// Copiar panel CSS
if (fs.existsSync('src/panel/panel.css')) {
  fs.copyFileSync('src/panel/panel.css', 'dist/panel/panel.css');
  console.log('✅ panel.css copiado');
}

// Remover export {} do service worker (Chrome não suporta módulos ES6 em service workers)
const serviceWorkerPath = 'dist/background/service-worker.js';
if (fs.existsSync(serviceWorkerPath)) {
  let content = fs.readFileSync(serviceWorkerPath, 'utf8');
  // Remove export {} no final do arquivo
  content = content.replace(/\n\s*export\s*\{\s*\};?\s*$/, '');
  fs.writeFileSync(serviceWorkerPath, content, 'utf8');
  console.log('✅ service-worker.js: export {} removido');
}

// Verificar arquivos compilados (extractor.js e overlay.js estão bundlados dentro de inspector.js)
const requiredFiles = [
  'dist/background/service-worker.js',
  'dist/content/inspector.js'
];

let allPresent = true;
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} existe`);
  } else {
    console.error(`❌ ${file} NÃO encontrado`);
    allPresent = false;
  }
});

if (allPresent) {
  console.log('\n✅ Build completo!');
  console.log('📝 Próximos passos:');
  console.log('1. Abra Chrome e vá para chrome://extensions/');
  console.log('2. Ative o "Modo do desenvolvedor"');
  console.log('3. Clique em "Carregar sem compactação"');
  console.log('4. Selecione a pasta dist/ deste projeto');
} else {
  console.error('\n❌ Build incompleto! Execute "npx tsc" primeiro.');
  process.exit(1);
}
