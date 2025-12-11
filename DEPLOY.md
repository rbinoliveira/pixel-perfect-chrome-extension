# Deploy Guide - Chrome Web Store Submission

Este guia explica como preparar e submeter a extensão Pixel Perfect Inspector para a Chrome Web Store.

## 📋 Pré-requisitos

1. **Conta Google Developer**
   - Acesse: https://chrome.google.com/webstore/devconsole
   - Crie uma conta (taxa única de $5 USD)
   - Complete o registro de desenvolvedor

2. **Extensão Testada e Funcional**
   - Todos os testes passando (ver `TESTING.md`)
   - Sem erros no console
   - Performance adequada

3. **Assets Preparados**
   - Ícones (16x16, 48x48, 128x128)
   - Screenshots (1280x800 ou 640x400)
   - Imagens promocionais (opcional)

## 🏗️ Preparação do Build

### 1. Atualizar Versão

```bash
# Atualizar version no manifest.json
# Exemplo: "version": "1.0.0" → "1.0.1"
```

Edite `public/manifest.json`:
```json
{
  "version": "1.0.0",
  ...
}
```

### 2. Build de Produção

```bash
# Limpar build anterior
rm -rf dist/

# Build completo
npm run build:test

# Verificar que tudo está correto
ls -la dist/
```

### 3. Criar ZIP para Submissão

```bash
# Criar arquivo ZIP da pasta dist/
cd dist
zip -r ../pixel-perfect-inspector-v1.0.0.zip .
cd ..

# Ou usar o script:
npm run build:zip  # (se implementado)
```

**Importante:** O ZIP deve conter apenas o conteúdo de `dist/`, não a pasta `dist/` em si.

## 🎨 Preparar Assets

### Ícones (Obrigatório)

Você precisa de ícones em 3 tamanhos:
- **16x16px** - Toolbar
- **48x48px** - Extensions page
- **128x128px** - Chrome Web Store

**Localização:** `dist/icons/icon16.png`, `icon48.png`, `icon128.png`

**Requisitos:**
- Formato PNG
- Fundo transparente (recomendado)
- Design claro e reconhecível
- Não usar imagens protegidas por copyright

### Screenshots (Obrigatório)

Pelo menos 1 screenshot, máximo 5:
- **Tamanho:** 1280x800 ou 640x400
- **Formato:** PNG ou JPEG
- **Conteúdo:** Mostrar a extensão em uso

**Sugestões de Screenshots:**
1. Overlay destacando elemento
2. Painel lateral com propriedades CSS
3. Popup da extensão
4. Comparação antes/depois
5. Diferentes tipos de elementos inspecionados

**Localização sugerida:** `assets/screenshots/`

### Imagens Promocionais (Opcional mas Recomendado)

- **Small Tile:** 440x280px
- **Large Tile:** 920x680px
- **Marquee:** 1400x560px

## 📝 Preparar Informações da Loja

### Título
```
Pixel Perfect Inspector - CSS Property Extractor
```
(Máximo 45 caracteres)

### Descrição Curta
```
Inspect and extract CSS properties from any element. Perfect for developers ensuring pixel-perfect implementations.
```
(Máximo 132 caracteres)

### Descrição Completa

```markdown
Pixel Perfect Inspector helps developers and designers quickly inspect and extract CSS properties from DOM elements.

✨ KEY FEATURES:
• Hover Highlighting - Visual overlay shows element boundaries
• Comprehensive Property Extraction - Typography, spacing, dimensions, borders, and layout
• One-Click Copying - Copy individual properties or entire CSS blocks
• Export Options - Download as JSON or CSS files
• Inspection History - Quick access to recently inspected elements
• Keyboard Shortcuts - Efficient workflow with hotkeys
• Clean Interface - Non-intrusive side panel design

🎯 PERFECT FOR:
• Frontend developers verifying design implementations
• UI/UX designers checking spacing and typography
• QA engineers validating pixel-perfect accuracy
• Anyone learning CSS and web development

🚀 HOW TO USE:
1. Click the extension icon to activate inspection mode
2. Hover over any element to see its dimensions
3. Click to open the detailed property panel
4. Copy properties or export for documentation

🔒 PRIVACY:
• No data collection or tracking
• Works entirely locally in your browser
• Only activates when you explicitly enable it
• Minimal permissions (activeTab, storage)

⌨️ KEYBOARD SHORTCUTS:
• Ctrl+Shift+I (Cmd+Shift+I on Mac) - Toggle inspection mode
• Esc - Exit inspection mode

📚 Support & Documentation:
[GitHub Repository URL]
[Documentation URL]
```

### Categoria
- **Primary:** Developer Tools
- **Secondary:** Productivity

### Idioma
- Inglês (en)
- (Adicione outros idiomas se disponível)

## 🔒 Política de Privacidade

### Criar Política de Privacidade

Crie um arquivo `PRIVACY_POLICY.md` ou página web:

```markdown
# Privacy Policy for Pixel Perfect Inspector

**Last Updated:** [Date]

## Data Collection
Pixel Perfect Inspector does not collect, store, or transmit any user data.

## Local Storage
The extension uses Chrome's local storage API to:
- Store inspection history (last 10 elements)
- Store user preferences

All data remains on your device and is never sent to external servers.

## Permissions
- **activeTab:** Required to inject content scripts into active tabs
- **storage:** Required to save inspection history locally
- **scripting:** Required to inject inspection scripts

## Third-Party Services
This extension does not use any third-party services, analytics, or tracking.

## Contact
For privacy concerns, contact: [Your Email]
```

**Hospede em:**
- GitHub Pages
- Seu próprio site
- Serviço de hospedagem estática

## 📤 Processo de Submissão

### 1. Acessar Chrome Web Store Developer Dashboard

1. Vá para: https://chrome.google.com/webstore/devconsole
2. Faça login com sua conta Google Developer
3. Clique em **"New Item"**

### 2. Upload do ZIP

1. Clique em **"Upload"**
2. Selecione o arquivo ZIP criado (`pixel-perfect-inspector-v1.0.0.zip`)
3. Aguarde o upload e validação

### 3. Preencher Informações da Loja

**Store Listing Tab:**
- **Name:** Pixel Perfect Inspector
- **Summary:** Descrição curta (132 chars)
- **Description:** Descrição completa
- **Category:** Developer Tools
- **Language:** English
- **Screenshots:** Upload suas screenshots
- **Promotional Images:** (Opcional)
- **Small Promotional Tile:** 440x280
- **Large Promotional Tile:** 920x680
- **Marquee:** 1400x560

**Privacy Tab:**
- **Single Purpose:** Yes
- **Permission Justification:**
  ```
  activeTab: Required to inject inspection scripts into the active tab.
  storage: Required to save inspection history locally on the user's device.
  scripting: Required to programmatically inject content scripts.
  ```
- **Privacy Policy URL:** [URL da sua política de privacidade]

**Distribution Tab:**
- **Visibility:** Public (ou Unlisted para teste)
- **Regions:** All regions (ou selecione específicas)
- **Pricing:** Free

### 4. Revisar e Publicar

1. Revise todas as informações
2. Verifique que o ZIP está correto
3. Clique em **"Submit for Review"**

## ⏱️ Processo de Revisão

### Timeline
- **Primeira submissão:** 1-3 dias úteis
- **Atualizações:** 1-2 dias úteis
- **Re-submissões após rejeição:** 1-3 dias úteis

### O que a Google Verifica

1. **Funcionalidade**
   - Extensão funciona como descrito
   - Sem erros críticos
   - Performance adequada

2. **Políticas**
   - Permissões justificadas
   - Política de privacidade presente
   - Não viola termos de serviço

3. **Qualidade**
   - UI/UX adequada
   - Descrição precisa
   - Screenshots representativos

### Possíveis Motivos de Rejeição

- Permissões excessivas sem justificativa
- Política de privacidade ausente ou inadequada
- Descrição enganosa
- Funcionalidade não funciona
- Violação de direitos autorais
- Conteúdo inadequado

## 🔄 Atualizações Futuras

### Processo de Atualização

1. **Atualizar versão no manifest.json**
   ```json
   {
     "version": "1.0.1",  // Incrementar
     ...
   }
   ```

2. **Atualizar CHANGELOG.md**
   ```markdown
   ## [1.0.1] - 2025-01-XX
   ### Fixed
   - Bug fix description
   ### Added
   - New feature description
   ```

3. **Build e ZIP**
   ```bash
   npm run build:test
   cd dist && zip -r ../pixel-perfect-inspector-v1.0.1.zip .
   ```

4. **Upload no Developer Dashboard**
   - Vá para seu item na loja
   - Clique em "Package"
   - Faça upload do novo ZIP
   - Adicione notas de versão
   - Submeta para revisão

## 📊 Após Publicação

### Monitoramento

1. **Analytics da Chrome Web Store**
   - Acesse o Developer Dashboard
   - Veja estatísticas de instalações
   - Monitore avaliações e reviews

2. **Feedback dos Usuários**
   - Responda reviews
   - Monitore issues no GitHub
   - Colete feedback para melhorias

### Marketing

1. **Anúncio de Lançamento**
   - Product Hunt
   - Reddit (r/webdev, r/chrome_extensions)
   - Twitter/X
   - LinkedIn
   - Comunidades de desenvolvedores

2. **Documentação**
   - Mantenha README atualizado
   - Crie tutoriais/vídeos
   - Documente casos de uso

## ✅ Checklist Final Antes de Submeter

### Build
- [ ] Versão atualizada no manifest.json
- [ ] Build completo sem erros
- [ ] ZIP criado corretamente
- [ ] ZIP testado (extrair e verificar)

### Assets
- [ ] Ícones em 3 tamanhos (16, 48, 128)
- [ ] Pelo menos 1 screenshot
- [ ] Imagens promocionais (opcional)
- [ ] Todos os assets otimizados

### Informações
- [ ] Título preenchido
- [ ] Descrição curta (132 chars)
- [ ] Descrição completa
- [ ] Categoria selecionada
- [ ] Idioma configurado

### Legal
- [ ] Política de privacidade criada e hospedada
- [ ] URL da política adicionada
- [ ] Permissões justificadas
- [ ] Termos de serviço (se necessário)

### Testes
- [ ] Extensão testada completamente
- [ ] Sem erros no console
- [ ] Performance adequada
- [ ] Funciona em diferentes sites

### Documentação
- [ ] README.md atualizado
- [ ] CHANGELOG.md criado
- [ ] Licença presente
- [ ] Contribuindo.md (se open source)

## 🆘 Troubleshooting

### Erro: "Invalid ZIP file"
- Verifique que o ZIP contém apenas o conteúdo de `dist/`
- Não inclua a pasta `dist/` no ZIP
- Use `cd dist && zip -r ../extension.zip .`

### Erro: "Manifest file is missing or unreadable"
- Verifique que `manifest.json` está na raiz do ZIP
- Verifique sintaxe JSON válida
- Use um validador JSON

### Erro: "Icons are missing"
- Verifique que todos os ícones estão em `icons/`
- Verifique nomes dos arquivos (case-sensitive)
- Verifique que são arquivos PNG válidos

### Rejeição: "Permissions not justified"
- Adicione justificativa detalhada para cada permissão
- Explique o uso específico de cada permissão
- Considere remover permissões desnecessárias

## 📚 Recursos Adicionais

- [Chrome Web Store Developer Documentation](https://developer.chrome.com/docs/webstore/)
- [Chrome Extension Best Practices](https://developer.chrome.com/docs/extensions/mv3/devguide/)
- [Manifest V3 Migration Guide](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Chrome Web Store Policies](https://developer.chrome.com/docs/webstore/program-policies/)

## 🎉 Próximos Passos Após Publicação

1. **Monitorar métricas** - Instalações, avaliações, feedback
2. **Responder reviews** - Engajar com usuários
3. **Coletar feedback** - Identificar melhorias
4. **Planejar atualizações** - Roadmap de features
5. **Marketing contínuo** - Manter visibilidade

---

**Última atualização:** 2025-12-10
