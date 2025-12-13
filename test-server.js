const { createServer } = require('http');
const { readFileSync, existsSync } = require('fs');
const { join, extname } = require('path');
const { exec } = require('child_process');

const PORT = 3000;
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
};

const server = createServer((req, res) => {
  let filePath = join(__dirname, req.url === '/' ? '/test/index.html' : req.url);

  // Security: prevent directory traversal
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  if (!existsSync(filePath)) {
    res.writeHead(404);
    res.end('Not Found');
    return;
  }

  try {
    const content = readFileSync(filePath);
    const ext = extname(filePath);
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  } catch (error) {
    res.writeHead(500);
    res.end('Internal Server Error');
  }
});

server.listen(PORT, () => {
  console.log(`\n✅ Servidor de teste rodando em: http://localhost:${PORT}/test/index.html\n`);
  console.log('📝 Carregue a extensão no Chrome e teste os elementos!\n');

  // Try to open browser (works on macOS and Linux)
  const platform = process.platform;
  if (platform === 'darwin') {
    exec(`open http://localhost:${PORT}/test/index.html`);
  } else if (platform === 'linux') {
    exec(`xdg-open http://localhost:${PORT}/test/index.html`);
  } else if (platform === 'win32') {
    exec(`start http://localhost:${PORT}/test/index.html`);
  }
});
