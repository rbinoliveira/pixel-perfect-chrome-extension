# 🎨 Pixel Perfect Inspector

<div align="center">

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

**Inspect and extract CSS properties from DOM elements with pixel-perfect precision**

[🇺🇸 English](#-english) • [🇧🇷 Português](#-português)

</div>

---

## 🇺🇸 English

> A Chrome extension for inspecting and extracting CSS properties from DOM elements with pixel-perfect precision. Perfect for developers ensuring accurate design implementations, designers checking spacing and typography, and anyone learning CSS.

### ✨ Features

- 🎯 **Hover Highlighting** - Visual overlay shows element boundaries and dimensions
- 📝 **Smart Tooltips** - Context-aware tooltips show typography for text, layout for containers, and detailed info for images/SVGs
- 📏 **Distance Measurement** - Measure distance between any two elements (border-to-border)
- 🎨 **Customizable Themes** - Choose from 5 color themes (Purple-Pink, Blue, Green, Orange, Red)
- 📏 **Adjustable Font Size** - Tooltip font size from 8px to 20px
- 🔒 **Privacy First** - Works entirely locally, no data collection

### 🚀 Quick Start

#### Installation

1. **Build the extension:**
   ```bash
   npm install
   npm run build
   ```

2. **Load in Chrome:**
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist/` folder

#### Usage

1. **Activate Inspection Mode**
   - Click the extension icon, OR
   - Press `Ctrl+Shift+P` (Mac: `Cmd+Shift+P`)

2. **Inspect Elements**
   - **Hover** over elements to see properties in tooltip
   - **Click** to measure distance between two elements
   - Active indicator appears in top-right corner (screens > 360px)

3. **Customize**
   - Open popup to change color theme
   - Adjust tooltip font size (8-20px)
   - Preferences saved automatically

### ⌨️ Keyboard Shortcuts

- `Ctrl+Shift+P` (Mac: `Cmd+Shift+P`) - Toggle inspection mode
- `Esc` - Exit inspection mode

### 📋 Extracted Properties

**Typography:** Font Family, Size, Weight, Line Height, Color, Letter Spacing, Text Transform

**Dimensions:** Width, Height, Min/Max Width, Min/Max Height

**Spacing:** Padding, Margin, Gap

**Borders:** Border Radius, Border (Width + Style + Color)

**Layout:** Display, Position, Flex Direction, Justify Content, Align Items

### 🎯 Tooltip Content

**Text Elements** (with direct text content):
- font-size, font-family, color, line-height, font-weight

**Container Elements** (without direct text):
- padding, gap, border-radius, border, box-shadow

**Images:**
- Rendered size, natural size, file type, object-fit, src (truncated), alt

**SVGs:**
- Rendered size, viewBox, fill, stroke, preserveAspectRatio

### 🔧 Development

```bash
# Install dependencies
npm install

# Build extension
npm run build

# Build step by step
npm run build:bundle  # Bundle TypeScript
npm run build:copy    # Copy assets
```

### 📁 Project Structure

```
pixel-perfect-chrome-extension/
├── src/
│   ├── background/     # Service worker
│   ├── content/        # Content scripts (inspector, extractor, overlay)
│   ├── popup/         # Extension popup
│   └── shared/        # Shared utilities (types, constants, utils)
├── public/            # Static assets (manifest, popup, icons)
├── scripts/           # Build scripts
└── dist/              # Built extension (generated)
```

### 🧪 Testing

**Quick Test (5 minutes):**
1. Load extension in Chrome
2. Activate inspection mode
3. Hover over an element (verify overlay appears)
4. Click to measure distance
5. Check preferences in popup

**Comprehensive Test:**
- Test on 3+ different websites
- Test with various element types (text, images, SVGs, containers)
- Verify all property extractions
- Test preferences persistence
- Test distance measurement accuracy

### 🔒 Privacy & Permissions

**Permissions:**
- `activeTab` - Access current tab (only when activated)
- `storage` - Save preferences locally
- `scripting` - Inject content scripts

**Privacy:**
- ✅ No data sent to external servers
- ✅ No analytics or tracking
- ✅ Preferences stored only in your browser
- ✅ Works completely offline

### 🐛 Troubleshooting

**Extension doesn't load:**
- Check `manifest.json` for errors
- Ensure all files exist in `dist/`

**Inspection mode doesn't work:**
- Refresh the page after installing
- Check service worker console (`chrome://extensions/` → Details → Service worker)

**Preferences don't save:**
- Check browser console for errors
- Verify localStorage is accessible

### 📝 License

MIT License - see [LICENSE](LICENSE) file for details

---

## 🇧🇷 Português

> Extensão do Chrome para inspecionar e extrair propriedades CSS de elementos DOM com precisão pixel-perfect. Perfeito para desenvolvedores verificando implementações de design, designers checando espaçamento e tipografia, e qualquer pessoa aprendendo CSS.

### ✨ Funcionalidades

- 🎯 **Destaque ao Passar o Mouse** - Overlay visual mostra limites e dimensões dos elementos
- 📝 **Tooltips Inteligentes** - Tooltips contextuais mostram tipografia para texto, layout para containers, e informações detalhadas para imagens/SVGs
- 📏 **Medição de Distância** - Meça a distância entre quaisquer dois elementos (borda a borda)
- 🎨 **Temas Personalizáveis** - Escolha entre 5 temas de cores (Roxo-Rosa, Azul, Verde, Laranja, Vermelho)
- 📏 **Tamanho de Fonte Ajustável** - Tamanho da fonte do tooltip de 8px a 20px
- 🔒 **Privacidade em Primeiro Lugar** - Funciona totalmente localmente, sem coleta de dados

### 🚀 Início Rápido

#### Instalação

1. **Compilar a extensão:**
   ```bash
   npm install
   npm run build
   ```

2. **Carregar no Chrome:**
   - Abra `chrome://extensions/`
   - Ative o "Modo do desenvolvedor"
   - Clique em "Carregar sem compactação"
   - Selecione a pasta `dist/`

#### Como Usar

1. **Ativar Modo de Inspeção**
   - Clique no ícone da extensão, OU
   - Pressione `Ctrl+Shift+P` (Mac: `Cmd+Shift+P`)

2. **Inspecionar Elementos**
   - **Passe o mouse** sobre elementos para ver propriedades no tooltip
   - **Clique** para medir distância entre dois elementos
   - Indicador ativo aparece no canto superior direito (telas > 360px)

3. **Personalizar**
   - Abra o popup para mudar o tema de cores
   - Ajuste o tamanho da fonte do tooltip (8-20px)
   - Preferências salvas automaticamente

### ⌨️ Atalhos de Teclado

- `Ctrl+Shift+P` (Mac: `Cmd+Shift+P`) - Ativar/desativar modo de inspeção
- `Esc` - Sair do modo de inspeção

### 📋 Propriedades Extraídas

**Tipografia:** Família da Fonte, Tamanho, Peso, Altura da Linha, Cor, Espaçamento entre Letras, Transformação de Texto

**Dimensões:** Largura, Altura, Largura/Altura Mín/Máx

**Espaçamento:** Padding, Margin, Gap

**Bordas:** Border Radius, Borda (Largura + Estilo + Cor)

**Layout:** Display, Position, Flex Direction, Justify Content, Align Items

### 🎯 Conteúdo do Tooltip

**Elementos de Texto** (com conteúdo de texto direto):
- font-size, font-family, color, line-height, font-weight

**Elementos Container** (sem texto direto):
- padding, gap, border-radius, border, box-shadow

**Imagens:**
- Tamanho renderizado, tamanho natural, tipo de arquivo, object-fit, src (truncado), alt

**SVGs:**
- Tamanho renderizado, viewBox, fill, stroke, preserveAspectRatio

### 🔧 Desenvolvimento

```bash
# Instalar dependências
npm install

# Compilar extensão
npm run build

# Compilar passo a passo
npm run build:bundle  # Fazer bundle do TypeScript
npm run build:copy    # Copiar assets
```

### 📁 Estrutura do Projeto

```
pixel-perfect-chrome-extension/
├── src/
│   ├── background/     # Service worker
│   ├── content/       # Content scripts (inspector, extractor, overlay)
│   ├── popup/         # Popup da extensão
│   └── shared/        # Utilitários compartilhados (types, constants, utils)
├── public/            # Assets estáticos (manifest, popup, icons)
├── scripts/           # Scripts de build
└── dist/              # Extensão compilada (gerado)
```

### 🧪 Testes

**Teste Rápido (5 minutos):**
1. Carregar extensão no Chrome
2. Ativar modo de inspeção
3. Passar mouse sobre um elemento (verificar overlay)
4. Clicar para medir distância
5. Verificar preferências no popup

**Teste Completo:**
- Testar em 3+ sites diferentes
- Testar com vários tipos de elementos (texto, imagens, SVGs, containers)
- Verificar todas as extrações de propriedades
- Testar persistência de preferências
- Testar precisão da medição de distância

### 🔒 Privacidade e Permissões

**Permissões:**
- `activeTab` - Acessar aba atual (apenas quando ativado)
- `storage` - Salvar preferências localmente
- `scripting` - Injetar content scripts

**Privacidade:**
- ✅ Nenhum dado enviado para servidores externos
- ✅ Sem analytics ou rastreamento
- ✅ Preferências armazenadas apenas no seu navegador
- ✅ Funciona completamente offline

### 🐛 Solução de Problemas

**Extensão não carrega:**
- Verificar `manifest.json` para erros
- Garantir que todos os arquivos existem em `dist/`

**Modo de inspeção não funciona:**
- Recarregar a página após instalar
- Verificar console do service worker (`chrome://extensions/` → Detalhes → Service worker)

**Preferências não salvam:**
- Verificar console do navegador para erros
- Verificar se localStorage está acessível

### 📝 Licença

Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes

---

<div align="center">

Made with ❤️ for the web development community

[🐛 Report Bug](https://github.com/yourusername/pixel-perfect-chrome-extension/issues) • [💡 Request Feature](https://github.com/yourusername/pixel-perfect-chrome-extension/issues) • [📊 Changelog](CHANGELOG.md)

</div>
