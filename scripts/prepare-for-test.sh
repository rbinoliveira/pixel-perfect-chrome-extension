#!/bin/bash

# Script para preparar a extensão para teste no Chrome

echo "🔨 Preparando extensão para teste..."

# Compilar TypeScript
echo "📦 Compilando TypeScript..."
npx tsc

# Criar estrutura de diretórios
mkdir -p dist/icons
mkdir -p dist/content
mkdir -p dist/background

# Copiar manifest e assets
echo "📋 Copiando manifest e assets..."
cp public/manifest.json dist/manifest.json
cp -r public/icons/* dist/icons/ 2>/dev/null || echo "⚠️  Ícones não encontrados (usando placeholders)"

# Copiar CSS
cp src/content/overlay.css dist/content/overlay.css 2>/dev/null || echo "⚠️  overlay.css não encontrado"

# Verificar se os arquivos JS foram compilados
if [ ! -f "dist/background/service-worker.js" ]; then
    echo "❌ Erro: service-worker.js não foi compilado"
    exit 1
fi

if [ ! -f "dist/content/inspector.js" ]; then
    echo "❌ Erro: inspector.js não foi compilado"
    exit 1
fi

echo "✅ Extensão preparada em dist/"
echo ""
echo "📝 Próximos passos:"
echo "1. Abra Chrome e vá para chrome://extensions/"
echo "2. Ative o 'Modo do desenvolvedor'"
echo "3. Clique em 'Carregar sem compactação'"
echo "4. Selecione a pasta 'dist' deste projeto"
echo ""
echo "🎯 Para testar:"
echo "- Clique no ícone da extensão para ativar modo de inspeção"
echo "- Passe o mouse sobre elementos para ver o overlay"
echo "- Clique em um elemento para ver as propriedades CSS"
