# Plano de Implementação — Sessão 2026-07-30 (Noite)

## Contexto

Cardápio digital multi-tenant (Evolux360). Arquivos principais:
`style.css`, `admin.css`, `admin.html`, `admin.js`, `loja.js`, `defaults.js`, `dynamic-components.js`.

---

## Itens a Implementar

### 🎨 A — Paleta Carbon Black (style.css + admin.css)

Substituir todas as variáveis CSS de cor por:
```
--cb-50:  #f1f1f3
--cb-100: #e4e4e7
--cb-200: #c9c9cf
--cb-300: #aeaeb7
--cb-400: #93939f
--cb-500: #787887
--cb-600: #60606c
--cb-700: #484851
--cb-800: #303036
--cb-900: #18181b
--cb-950: #111113
```

Uso sugerido:
- Fundo da loja: `--cb-950`
- Cards de produto: `--cb-900`
- Textos principais: `--cb-50` (loja dark)
- Bordas: `--cb-800`
- Admin: fundo branco `#FFFFFF`, textos `--cb-900`, bordas `--cb-100`

---

### 🛒 B — Modal de Carrinho (loja.js + index.html)

- [x] O modal JÁ abre (confirmado pela usuária)
- [ ] Remover a mensagem que persiste quando carrinho está vazio
- [ ] Desativar botão "Finalizar pedido" quando carrinho vazio (já solicitado antes, verificar se implementado)

---

### 💵 C — Preço R$0,00 no Modal do Produto (loja.js)

O bug: `currentSelectedProduct.preco` vem como string do Supabase/localStorage e não é parsificado.

Corrigir `recalculateModalTotal` e `addModalProductToCart`:
```js
const basePrice = parseFloat(currentSelectedProduct.preco || currentSelectedProduct.preco_grande || 0) || 0;
```

E verificar o mapeamento em `loadCatalogData`: o campo `preco` deve ser mapeado explicitamente:
```js
preco: parseFloat(p.preco || p.preco_grande || 0) || 0,
preco_grande: parseFloat(p.preco_grande || p.preco || 0) || 0,
```

E verificar os adicionais: `adicionais` deve ser lido diretamente do objeto do produto sem renomear para `ingredientes`.

---

### 🔤 D — Botões em Maiúsculas no Admin (admin.css + admin.js)

Remover `text-transform: uppercase` do `.btn-admin` e `.btn-admin-primary` no `admin.css`.
Verificar se `admin.js` gera botões com texto em CAPS e corrigir.

---

### 📂 E — Categoria Obrigatória / Produto sem Categoria (admin.js)

Remover a validação que bloqueia salvamento sem categoria.
No `admin.js`, na função `saveProduct()` ou similar, remover:
```js
if (!categoria) { errors.push('Categoria é obrigatória.'); }
```

---

### 🃏 F — Layout do Card de Produto no Admin (admin.js)

"a partir de R$... e o botão tão quase se sobrepondo" — corrigir o CSS dos cards para o botão Editar/Excluir cair para a linha de baixo quando o texto fica longo:
```css
flex-wrap: wrap;
```
no container de preço + ações.

---

### 📋 G — Adicionais não aparecem no Modal da Loja (loja.js)

Verificar o mapeamento de `adicionais` em `loadCatalogData`. O campo salvo no Supabase é `adicionais` (JSON array). No mapeamento atual:
```js
ingredientes: p.descricao || ''  // ERRADO — perdemos os adicionais
```
Deve ser:
```js
adicionais: p.adicionais || [],
```

---

### 🏷️ H — Botão "Nova Categoria" Não Abre Nada (admin.js)

Verificar se `openAddCategoryModal()` está definida e exposta na window.
Verificar se o modal `#categoryFormModal` existe no DOM.

---

### 🔗 I — Modal de Vincular Produtos à Categoria (admin.js + admin.html)

"Se eu tiver 50 itens?" — substituir o checklist infinito por um **campo de busca com chips selecionáveis** dentro do modal de categoria.
"O X de fechar não funciona" — verificar se o botão `onclick="closeCategoryModal()"` está corretamente vinculado.

---

### 🗑️ J — Excluir Categoria Não Funciona (admin.js)

Verificar a função `deleteCategory()` — verificar se está exposta na window e se recebe o ID correto.

---

### 🚚 K — Taxa de Entrega pode ser "A Combinar" (admin.js + admin.html)

No modal de nova forma de entrega, adicionar checkbox "Taxa a combinar / gratuita" que deixa o campo de valor opcional ou exibe "A combinar".

---

### 🔁 L — Clique Múltiplo Salva Duplicatas (admin.js)

Ao submeter formulários (entrega, categoria, produto), desativar o botão de submit durante o processamento para evitar múltiplos cliques:
```js
submitBtn.disabled = true;
submitBtn.innerText = 'Salvando...';
// ... após salvar:
submitBtn.disabled = false;
submitBtn.innerText = 'Salvar forma de entrega';
```

---

### 🎫 M — Botão "Novo Cupom" Não Abre Modal (admin.js)

Verificar se `openCouponModal()` está definida e exposta na window.
Verificar se o modal `#couponModalForm` existe no DOM.

---

### 🏪 N — Identidade Visual: Remover Dados Pessoais de Placeholder (admin.html)

Substituir placeholders como `"(51) 99999-9999"`, `"Rua das Flores, 123 - Bairro..."` por textos genéricos:
- `"Ex: (11) 99999-9999"`
- `"Ex: Rua Exemplo, 123 - Centro"`

---

### 🕐 O — Horário de Funcionamento (admin.html + admin.js)

Redesenhar o campo de horário de funcionamento no estilo Google:
- 7 linhas (Seg, Ter, Qua, Qui, Sex, Sáb, Dom)
- Cada linha tem: checkbox "Aberto" + campo "Abre:" + campo "Fecha:"
- Salva como JSON: `{ "seg": { "aberto": true, "abre": "11:00", "fecha": "22:00" }, ... }`

---

### 🖼️ P — Banners: Como Subir? (admin.js)

O botão de banner clicou e nada aconteceu — verificar se o input `type="file"` para banners está funcionando.
Implementar upload via:
1. Se Supabase Storage disponível: upload para bucket
2. Fallback: conversão para base64 e armazenamento no localStorage

---

### 🖼️ Q — Logotipo: Como Subir? (admin.html + admin.js)

Adicionar campo de upload de logotipo na seção Identidade Visual:
- Preview da imagem após seleção
- Mesma lógica de upload que banners

---

### 🎨 R — Cores da Marca: Seletor de Cor (admin.html + admin.js)

Adicionar dois campos `type="color"` + campo de texto hexadecimal na seção Identidade Visual:
- **Cor primária** (ex: botões, destaques): `input[type=color]`
- **Cor de acento** (ex: badges, links): `input[type=color]`
- Ao salvar, grava no config e aplica via `document.documentElement.style.setProperty('--ph-red', corPrimaria)` na loja

---

## Ordem de Execução

1. `style.css` — Paleta Carbon Black (A)
2. `admin.css` — Remove `text-transform: uppercase` nos botões (D)
3. `admin.js` — Bugs: categoria opcional (E), cards layout (F), botoes duplicados (L), abrir modais (H, M), adicionais (G), excluir categoria (J), entrega a combinar (K)
4. `admin.html` — Horário de funcionamento estilo Google (O), placeholders (N), upload de logo (Q), seletor de cores (R)
5. `loja.js` — Preço no modal (C), carrinho mensagem vazia (B), adicionais (G)

## Open Questions

> [!IMPORTANT]
> **Upload de banners e logotipo**: O Supabase Storage está configurado neste projeto? Se sim, os uploads iam direto para lá. Se não, o fallback seria base64 no localStorage (funcional mas com limite de ~2MB por imagem).

> [!IMPORTANT]
> **Cores da marca**: As cores seriam salvas no Supabase config e aplicadas dinamicamente na loja para cada cliente?
