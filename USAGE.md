# 📖 Guia de Uso - Pixel Perfect Inspector

## 🚀 Instalação Rápida

### 1. Carregar a Extensão no Chrome

1. **Abra o Chrome** e digite na barra de endereços:
   ```
   chrome://extensions/
   ```

2. **Ative o Modo do Desenvolvedor**
   - No canto superior direito, ative o toggle "Modo do desenvolvedor"

3. **Carregue a Extensão**
   - Clique no botão **"Carregar sem compactação"** (ou "Load unpacked")
   - Navegue até a pasta `dist/` do projeto:
     ```
     ~/dev/github/pixel-perfect-chrome-extension/dist
     ```
   - Selecione a pasta e clique em "Selecionar"

4. **Verifique a Instalação**
   - Você deve ver a extensão "Pixel Perfect Inspector" na lista
   - O ícone deve aparecer na barra de ferramentas do Chrome (se não aparecer, clique no ícone de quebra-cabeça e fixe a extensão)

---

## 🎯 Como Usar

### Passo 1: Ativar o Modo de Inspeção

**Opção A: Pelo Ícone**
- Clique no ícone da extensão na barra de ferramentas do Chrome
- O ícone ficará azul (ativo) quando o modo de inspeção estiver ligado

**Opção B: Atalho de Teclado**
- Pressione `Ctrl+Shift+P` (Windows/Linux) ou `Cmd+Shift+P` (Mac)
- Pressione novamente para desativar
- ⚠️ **Nota:** `Cmd+Shift+I` no Mac abre o DevTools do Chrome, por isso usamos `Cmd+Shift+P`

### Passo 2: Inspecionar Elementos

1. **Hover (Passar o Mouse)**
   - Com o modo de inspeção ativo, passe o mouse sobre qualquer elemento da página
   - Você verá:
     - ✨ Um **overlay azul** destacando o elemento
     - 📏 Um **tooltip** mostrando:
       - Dimensões do elemento (ex: "300x200px")
       - **font-size**: Tamanho da fonte
       - **font-family**: Família da fonte
       - **color**: Cor do texto
       - **line-height**: Altura da linha
       - **font-weight**: Peso da fonte

2. **Clicar para Inspecionar**
   - Clique em qualquer elemento para abrir o painel de propriedades
   - O painel aparecerá na lateral da página mostrando:
     - 📋 Todas as propriedades CSS do elemento
     - 🎨 Tipografia (fonte, tamanho, cor, etc.)
     - 📐 Dimensões (largura, altura, etc.)
     - 📏 Espaçamento (padding, margin, gap)
     - 🔲 Bordas (border-radius, border)
     - 📦 Layout (display, position, flex, etc.)

### Passo 3: Medir Distância Entre Elementos

**Como medir distância:**
1. Com o modo de inspeção ativo, **segure Shift** e clique no primeiro elemento
2. Você verá um destaque laranja no elemento selecionado
3. **Segure Shift** e clique no segundo elemento
4. Você verá:
   - ✨ Uma **linha verde** conectando os dois elementos
   - 📊 Um **label** mostrando:
     - **H**: Distância horizontal (em pixels)
     - **V**: Distância vertical (em pixels)
     - **D**: Distância diagonal (em pixels)

**Dica:** A medição desaparece automaticamente após 3 segundos. Para medir novamente, repita o processo.

### Passo 4: Copiar Propriedades

**Copiar uma Propriedade Individual:**
- No painel, ao lado de cada propriedade há um ícone 📋
- Clique no ícone para copiar aquele valor específico
- Exemplo: clique em 📋 ao lado de `font-size: 16px` para copiar `16px`

**Copiar Todas as Propriedades:**
- No topo do painel, clique no botão **"Copy All Properties"**
- Isso copia todas as propriedades como um bloco CSS completo

**Exportar como Arquivo:**
- Clique em **"Export as JSON"** para baixar os dados como JSON
- Clique em **"Export as CSS"** para baixar como arquivo CSS

### Passo 5: Ver Histórico

- Clique no ícone da extensão para abrir o popup
- Você verá os últimos 10 elementos inspecionados
- Clique em qualquer item do histórico para reabrir o painel daquele elemento

### Passo 6: Desativar o Modo de Inspeção

- Clique novamente no ícone da extensão, OU
- Pressione `Esc` quando o painel estiver aberto, OU
- Use o atalho `Ctrl+Shift+P` / `Cmd+Shift+P` novamente

---

## 💡 Exemplos Práticos

### Exemplo 1: Verificar Tipografia de um Título

1. Ative o modo de inspeção
2. Passe o mouse sobre um título (h1, h2, etc.)
3. Clique no título
4. No painel, veja a seção **"Typography"**:
   - `font-family`: Qual fonte está sendo usada
   - `font-size`: Tamanho exato
   - `font-weight`: Peso da fonte (bold, normal, etc.)
   - `line-height`: Altura da linha
   - `color`: Cor exata em hex
5. Clique em 📋 ao lado de qualquer propriedade para copiar

### Exemplo 2: Extrair Espaçamento de um Botão

1. Ative o modo de inspeção
2. Clique em um botão
3. Veja a seção **"Spacing"**:
   - `padding`: Espaçamento interno (ex: "12px 24px")
   - `margin`: Espaçamento externo
4. Copie o valor ou exporte tudo como CSS

### Exemplo 3: Verificar Layout Flexbox

1. Ative o modo de inspeção
2. Clique em um container com `display: flex`
3. Veja a seção **"Layout"**:
   - `display`: "flex"
   - `flex-direction`: "row" ou "column"
   - `justify-content`: "center", "space-between", etc.
   - `align-items`: "center", "flex-start", etc.
   - `gap`: Espaçamento entre itens

### Exemplo 4: Documentar um Componente Completo

1. Inspecione o elemento principal
2. Clique em **"Export as CSS"**
3. Salve o arquivo CSS
4. Use esse CSS como referência para documentação ou implementação

---

## ⌨️ Atalhos de Teclado

| Atalho | Ação |
|--------|------|
| `Ctrl+Shift+P` (Win/Linux)<br>`Cmd+Shift+P` (Mac) | Ativar/Desativar modo de inspeção |
| `Shift + Clique` | Medir distância entre elementos (clique no primeiro, depois no segundo) |
| `Esc` | Fechar painel de propriedades |

---

## 🎨 O que Você Vê no Painel

### Seção: Typography (Tipografia)
- `font-family`: Família da fonte
- `font-size`: Tamanho da fonte
- `font-weight`: Peso (normal, bold, 400, 700, etc.)
- `line-height`: Altura da linha
- `letter-spacing`: Espaçamento entre letras
- `text-transform`: Transformação (uppercase, lowercase, etc.)
- `color`: Cor do texto (em hex)

### Seção: Dimensions (Dimensões)
- `width`: Largura (com valor computado)
- `height`: Altura (com valor computado)
- `min-width` / `max-width`: Largura mínima/máxima
- `min-height` / `max-height`: Altura mínima/máxima

### Seção: Spacing (Espaçamento)
- `padding`: Espaçamento interno (top, right, bottom, left)
- `margin`: Espaçamento externo (top, right, bottom, left)
- `gap`: Espaçamento em flexbox/grid

### Seção: Borders (Bordas)
- `border-radius`: Raio das bordas (todos os cantos)
- `border`: Largura, estilo e cor da borda

### Seção: Layout (Layout)
- `display`: Tipo de display (block, flex, grid, etc.)
- `position`: Posicionamento (static, relative, absolute, etc.)
- `flex-direction`: Direção do flex (row, column)
- `justify-content`: Alinhamento horizontal (flexbox)
- `align-items`: Alinhamento vertical (flexbox)

### Seção: Position (Posição)
- Coordenadas X e Y do elemento na página
- Dimensões do viewport

---

## 🔍 Dicas e Truques

### Dica 1: Inspecione Elementos Aninhados
- Elementos dentro de outros elementos podem ser inspecionados separadamente
- Passe o mouse sobre o elemento filho para ver suas propriedades específicas

### Dica 2: Use o Histórico para Comparar
- Inspecione vários elementos
- Use o histórico no popup para comparar propriedades entre elementos

### Dica 3: Exporte para Documentação
- Use "Export as CSS" para criar documentação de componentes
- Use "Export as JSON" para análise programática

### Dica 4: Trabalhe com Designers
- Compartilhe os valores extraídos com designers
- Verifique se a implementação corresponde ao design

### Dica 5: Aprenda CSS
- Use a extensão para estudar como sites bem projetados usam CSS
- Veja valores reais de propriedades em ação

---

## ❓ Problemas Comuns

### O ícone não aparece na barra de ferramentas
- Vá em `chrome://extensions/`
- Clique no ícone de quebra-cabeça na barra de ferramentas
- Procure "Pixel Perfect Inspector" e clique no alfinete 📌 para fixar

### O modo de inspeção não funciona
- Recarregue a página (F5)
- Verifique se o modo de inspeção está ativo (ícone azul)
- Tente em outra página (alguns sites podem bloquear extensões)

### O painel não abre ao clicar
- Abra o Console do Desenvolvedor (F12) e verifique erros
- Recarregue a extensão em `chrome://extensions/`

### As propriedades não aparecem corretamente
- Alguns elementos podem não ter todas as propriedades aplicadas
- Pseudo-elementos (::before, ::after) não são suportados ainda

### Não consigo copiar propriedades
- Verifique se o navegador permitiu acesso à área de transferência
- Tente copiar manualmente selecionando o texto

---

## 🎓 Casos de Uso

### Para Desenvolvedores
- ✅ Verificar se a implementação corresponde ao design
- ✅ Extrair valores exatos de espaçamento e tipografia
- ✅ Debuggar problemas de layout
- ✅ Documentar estilos de componentes

### Para Designers
- ✅ Verificar se desenvolvedores implementaram corretamente
- ✅ Extrair CSS de sites para inspiração
- ✅ Verificar breakpoints responsivos
- ✅ Analisar estilos de sites concorrentes

### Para Estudantes
- ✅ Entender como propriedades CSS funcionam juntas
- ✅ Aprender com sites bem projetados
- ✅ Experimentar com diferentes combinações
- ✅ Estudar implementações CSS do mundo real

---

## 📞 Precisa de Ajuda?

- 🐛 **Encontrou um bug?** Abra uma issue no GitHub
- 💡 **Tem uma sugestão?** Compartilhe sua ideia
- 📖 **Mais documentação?** Veja o [README.md](README.md) e [TESTING.md](TESTING.md)

---

**Divirta-se inspecionando! 🎨✨**
