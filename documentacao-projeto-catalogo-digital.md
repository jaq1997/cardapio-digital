# Documentação Técnica — Catálogo Digital / Delivery

> Handoff de projeto. Documento compilado a partir de análise de código-fonte real (não é spec teórica — cada bug listado foi confirmado lendo os arquivos, com localização exata).

---

## 1. Visão geral

Sistema de catálogo digital + painel administrativo para negócios de delivery (pizzaria, hamburgueria, sushi, marmitaria — o produto é **white-label**, cada cliente configura sua própria identidade visual, produtos, categorias, cupons e formas de entrega).

- **Frontend da loja** (`loja.js` + `index.html`): interface pública, onde o cliente final navega o cardápio e monta o pedido.
- **Painel admin** (`admin.js` + `admin.html`): onde o **dono do negócio** cadastra produtos, categorias, cupons, formas de entrega e configura a identidade visual da própria loja.
- **Backend atual**: Supabase (PostgreSQL gerenciado), acessado **diretamente do navegador** via `supabase-js`, tanto pela loja quanto pelo admin.
- **Backend em migração**: existe uma tentativa paralela em Python (FastAPI), ainda **não conectada ao frontend**.
- Hospedagem: Cloudflare (Pages para o front, atualmente).
- Distribuição do pedido final: link para WhatsApp com o pedido montado em texto (não há checkout de pagamento online).

Prazo de negócio relatado: **3 vendas previstas para a semana seguinte** à data desta documentação, para diferentes tipos de estabelecimento — ou seja, o produto precisa estar **genérico/neutro** o suficiente pra qualquer segmento de comida, não só pizzaria.

---

## 2. Stack tecnológico

### 2.1 Frontend (produção atual)
- HTML + CSS + JavaScript puro (sem framework, sem bundler).
- Cliente Supabase via SDK oficial (`@supabase/supabase-js@2`, carregado via CDN jsdelivr).
- `localStorage` como cache/fallback quando o Supabase não está disponível.

### 2.2 Backend em produção (real, hoje)
- **Supabase** (PostgreSQL + API REST automática + Auth, embora Auth ainda não esteja plenamente integrado — ver seção 7.9).
- Anon key exposta no frontend (`config.js`) — modelo padrão do Supabase, mas **depende de Row Level Security (RLS)** bem configurado nas tabelas para ser seguro (ver seção 8, segurança).

### 2.3 Backend em migração (branch Python, incompleto)
- **FastAPI** (`main.py`) — expõe endpoints REST (`/api/products`, `/api/categories`, `/api/delivery-zones`, `/api/coupons`, `/api/branding`).
- **`supabase-py`** (`database.py`) — biblioteca oficial Python do Supabase, comunicação via REST/HTTPS (não usa conexão TCP direta a Postgres). Importante porque isso facilita hospedagem em ambientes restritos (ex: Cloudflare Python Workers, que hoje suportam `fastapi` mas não bibliotecas que dependem de driver nativo de banco como `psycopg2`).
- **`models.py` + `schemas.py`** — implementados com SQLAlchemy ORM, **mas não são usados por `main.py`** (código morto/órfão de uma tentativa anterior; `main.py` define seus próprios modelos Pydantic inline e fala com Supabase via `supabase-py`, ignorando SQLAlchemy completamente).
- **Status: desconectado do frontend.** Nenhum arquivo JS do frontend chama esses endpoints — o admin e a loja continuam falando direto com o Supabase.

### 2.4 Dependências Python declaradas (`requirements.txt`)
```
fastapi>=0.100.0
uvicorn>=0.20.0
pydantic>=2.0.0
sqlalchemy>=2.0.0
psycopg2-binary>=2.9.0
python-dotenv>=1.0.0
```
> Nota: `sqlalchemy` e `psycopg2-binary` estão listados mas não são efetivamente usados pelo caminho real de dados (`main.py` usa `supabase-py`, que não está no `requirements.txt` — precisa ser adicionado se o Python for pra frente).

---

## 3. Inventário de arquivos e responsabilidades

| Arquivo | Camada | Responsabilidade |
|---|---|---|
| `index.html` | Loja | Estrutura HTML da vitrine pública (grid de produtos, modais de produto/carrinho/checkout) |
| `admin.html` | Admin | Estrutura HTML do painel (abas: produtos, categorias, entregas, cupons, identidade visual) |
| `config.js` | Ambos | Constantes `SUPABASE_URL` e `SUPABASE_ANON_KEY` |
| `supabase-client.js` | Ambos | Cria o cliente Supabase singleton, expõe como `window.db` + `window.SUPABASE_READY` |
| `db-service.js` | Ambos | Camada de abstração de dados (`window.DbService`) — tenta Supabase, cai pra `localStorage` |
| `defaults.js` | Ambos | Dados/config padrão (branding neutro, produtos demo, zonas de entrega demo), utilitários de toast/confirm/compressão de imagem |
| `dynamic-components.js` | Ambos | Injeta componentes compartilhados (nav, drawer mobile, footer, botão flutuante do WhatsApp) e aplica branding salvo em `localStorage` na UI |
| `loja.js` | Loja | Toda a lógica da vitrine: renderizar produtos, abrir modal de produto, carrinho, checkout, cálculo de frete, montagem da mensagem do WhatsApp |
| `admin.js` | Admin | Toda a lógica do painel: CRUD de produtos/categorias/cupons/entregas, upload de imagem, salvar identidade visual |
| `database.py` | Backend Python | Inicializa cliente `supabase-py` |
| `main.py` | Backend Python | Endpoints FastAPI (CRUD REST sobre as mesmas tabelas do Supabase) |
| `models.py` / `schemas.py` | Backend Python | **Código órfão** — SQLAlchemy ORM não utilizado pelo `main.py` |

**Arquivos mencionados mas não entregues/analisados ainda:**
- `auth.js` — referenciado em `admin.html` (`AUTH.guardAdmin()`, `AUTH.logout()`), controla autenticação de acesso ao painel. **Não foi lido nesta análise.**
- `style.css` — CSS da loja pública. Não foi lido; suspeita levantada (não confirmada) de que define a cor vermelha padrão do template original.
- Restante de `loja.js` além do que já foi revisado, e HTML completo de páginas auxiliares, se existirem.

---

## 4. Modelo de dados (tabelas Supabase identificadas)

Todas prefixadas com `store_`, indicando que é um projeto multi-tenant single-store (uma instância Supabase por loja, aparentemente) ou preparado para isso:

| Tabela | Campos principais | Observação |
|---|---|---|
| `store_products` | `id, nome, categoria, descricao, preco, preco_grande, preco_media, preco_broto, preco_gigante, badge, img_url, adicionais (jsonb), status, position` | Campo `adicionais` existe no schema mas **não está sendo persistido pelo admin atual** (bug — ver 7.1) |
| `store_categories` | `id, name, position` | |
| `store_delivery_zones` | `id, name, price, position, display_price` | |
| `store_coupons` | `id, code, type (percent/fixed), value, min_order, active, expires_at` | |
| `store_branding` | `id (sempre 1), store_name, store_sub, store_address, store_hours, wpp_number, frete, primary_color, dark_color/accent_color, badge_bg_color, btn_text_color, logo_url, banner_desk_url, banner_mob_url, coverage_cities` | Registro único (linha fixa `id=1`) |

> **Atenção para quem for mexer**: há inconsistência de nomenclatura entre o que o Python (`main.py`/`schemas.py`) espera e o que o JS (`db-service.js`) grava — por exemplo, o JS grava `dark_color`, o Python grava/lê `accent_color` mapeado pra coluna `dark_color`. Isso precisa ser unificado antes de qualquer migração real (ver seção 9).

---

## 5. Regras de negócio

1. **Catálogo**: produtos pertencem a uma categoria; categorias têm posição de exibição; produtos têm status (`ativo`/inativo, controla se aparece na loja).
2. **Preços variáveis**: um produto pode ter até 4 variações de preço (`broto/média/grande/gigante`) — herança do modelo original de pizzaria. Para outros segmentos, provavelmente só `preco`/`preco_grande` são usados e os demais ficam zerados.
3. **Adicionais**: cada produto pode ter uma lista de itens opcionais com nome e preço adicional, selecionáveis pelo cliente no modal de customização.
4. **Carrinho**: monta-se client-side (array em memória), sem persistência em banco até o pedido ser finalizado.
5. **Checkout**: cliente escolhe entre entrega em domicílio (com busca de CEP e cálculo de frete por zona) ou retirada no balcão (frete grátis); pode aplicar cupom de desconto.
6. **Finalização de pedido**: gera uma mensagem de texto formatada e abre `https://wa.me/{numero}?text=...` — não existe backend de pedidos recebendo isso automaticamente (o modelo `OrderModel`/`OrderCreate` existe no Python, mas não há endpoint funcional de criação de pedido nem chamada do frontend pra ele).
7. **Identidade visual — regra de negócio confirmada nesta sessão**:
   - O **painel admin** deve manter a identidade visual roxa da Evolux360 (estilo "Nuvemshop") — **não deve ser alterado**.
   - A **vitrine do cliente final** (loja) deve nascer com identidade **neutra** por padrão (cores, nome, logo genéricos), pois cada cliente (pizzaria, hamburgueria, sushi, marmitaria etc.) vai configurar a própria marca através do admin.
8. **Cupons**: tipo percentual ou valor fixo, com valor mínimo de pedido e data de expiração opcional.

---

## 6. Fluxo de dados (arquitetura atual)

```
Admin (admin.js) ─┐
                   ├──► db-service.js ──► window.db (Supabase JS SDK) ──► Supabase (Postgres)
Loja (loja.js)  ───┘                              │
                                                   └── fallback: localStorage (por navegador, não sincroniza entre dispositivos)
```

**Backend Python (main.py) — desconectado, não é chamado pelo fluxo acima.**

---

## 7. Bugs confirmados (causa raiz identificada em código, com localização)

### 7.1 Adicionais não aparecem na loja
- **Causa**: `db-service.js`, função `upsertProduct()` — o payload enviado ao Supabase **não inclui o campo `adicionais`**. É salvo só em memória local, nunca persiste no banco.
- **Fix**: incluir `adicionais: product.adicionais || []` no objeto enviado em `upsertProduct`.

### 7.2 Categoria exibida como ID cru (ex: `CAT-1785442046040`) em vez do nome
- **Causa dupla**:
  1. Em `loja.js`, a função `filterCategory()` tenta resolver o nome via uma variável global `categories`, que **nunca é declarada/populada** em nenhum lugar do arquivo — está sempre `undefined`, então cai no fallback que imprime o ID cru.
  2. Existem **dois códigos diferentes renderizando a lista de categorias do menu/drawer** ao mesmo tempo: `dynamic-components.js` (usa `c.id` no `onclick`) e `loja.js` (usa `cat.name` no `onclick`). Como ambos escrevem no mesmo elemento (`#drawerCategoriesList` / seu container pai), quem "vence" depende da ordem de carregamento assíncrono — não é determinístico.
- **Fix**: escolher **um único responsável** pela renderização das categorias (recomendado: manter em `loja.js`, remover a chamada equivalente em `dynamic-components.js`), e criar/popular uma variável `categories` compartilhada usada tanto pela renderização quanto pelo `filterCategory()`.

### 7.3 Total do pedido aparece zerado no modal do produto
- **Causa**: existem **duas funções `recalculateModalTotal()` declaradas em `loja.js`** (uma por volta da linha ~544, outra ~640). Em JavaScript, a segunda sobrescreve a primeira silenciosamente. A segunda versão escreve o valor num elemento `#modalCalculatedTotal`, que **não existe** no `index.html` atual (lá o campo se chama `#modalDynamicTotalPrice`). Resultado: o total nunca atualiza.
- **Causa raiz mais profunda**: essa segunda função faz parte de um **bloco inteiro de customização de pizza órfão** (`selectPizzaSize`, `setFlavorMode`, `addCustomPizzaToCart`, seleção de borda/tamanho) que não tem nenhum elemento correspondente no `index.html` atual — é código morto de uma versão anterior do produto (época pizzaria).
- **Fix**: remover o bloco órfão inteiro (não é código em uso; nenhum HTML atual referencia essas funções). Isso resolve o bug e já é parte da limpeza de "resquício de pizzaria" desejada.

### 7.4 Modal de checkout abre sozinho ao clicar "Adicionar" (deveria abrir só ao clicar "Meu Pedido")
- **Causa**: em `loja.js`, a função `addModalProductToCart()` chama `openCartModal()` explicitamente logo após adicionar o item ao carrinho.
- **Fix**: remover essa chamada da função.

### 7.5 Seletor de cor "Accent" do admin sempre mostra roxo, mesmo após salvar outra cor
- **Causa**: em `admin.js`, a função `loadAdminSettings()` procura por elementos com id `cfgDarkColor`/`cfgDarkColorPicker`. No `admin.html` atual, esses campos foram renomeados para `cfgAccentColor`, `cfgBtnTextColor` e `cfgBadgeBgColor` (provavelmente numa reforma visual anterior que atualizou o HTML mas não o JS). Como a busca falha, o campo nunca recarrega o valor real salvo no banco — sempre mostra o valor padrão hardcoded no HTML (`value="#6344F5"`).
- **Risco associado**: se o operador salvar qualquer outra alteração no formulário sem perceber, esse roxo "fantasma" é gravado por cima da cor real no banco.
- **Fix**: corrigir os ids buscados em `loadAdminSettings()` para bater com os do `admin.html` atual (`cfgAccentColor`, `cfgBtnTextColor`, `cfgBadgeBgColor`).

### 7.6 Cor vermelha aparece como principal na loja mesmo com branding "neutro" salvo
- **Causa**: em `loja.js`, a aplicação de branding tem a condição `if (cfg.primaryColor && cfg.primaryColor !== '#18181B') { ...aplica a cor... }`. Ou seja: se a cor salva for **exatamente** o padrão neutro (`#18181B`), o código propositalmente **não aplica nada**, deixando valer o que estiver hardcoded no `style.css` (não confirmado, mas há fortes indícios de que seja um vermelho de template — ex. o favicon do admin usa `#E91C24`, e existe uma função de "restaurar configurações da marca Pizza Todo Dia").
- **Fix**: remover a condição `!== '#18181B'` — aplicar a cor salva sempre que existir, independente do valor.

### 7.7 Cores padrão do formulário de identidade visual (client-facing) usam tons roxos do template
- **Contexto de negócio**: confirmado que o **admin em si deve permanecer roxo** (identidade da Evolux360, estilo painel Nuvemshop) — isso **não deve mudar**.
- **O que precisa mudar**: os valores **padrão/seed** dos campos de cor que o cliente final (dono da pizzaria/hamburgueria/etc.) vai editar para a própria marca — hoje vêm hardcoded como roxo (`value="#6344F5"`, `value="#F1EEFE"`) no `admin.html`, herdados do template. Devem nascer neutros (ex: tons de cinza/preto), para não empurrar identidade visual de terceiro pra loja do cliente.

### 7.8 Botão "Novo Cupom" — investigação parcial, não fechada
- Testado: `openAddCouponModal()` funciona perfeitamente quando chamado manualmente pelo console.
- Testado: um listener de diagnóstico confirmou que o clique **chega** no botão real.
- **Conclusão até o momento**: a função e o clique funcionam isoladamente; o comportamento "quase nunca funciona" sugere um problema de **timing de carregamento de script** (o clique acontece antes de tudo estar pronto) ou alguma interferência ainda não identificada (candidato a investigar: `auth.js`, que não foi lido nesta análise, e que roda um `AUTH.guardAdmin()` no carregamento da página — pode haver conflito de timing com a inicialização do restante do admin).
- **Próximo passo recomendado**: obter e ler `auth.js`; adicionar um log temporário dentro de `openAddCouponModal()` para capturar em que ponto exatamente a execução falha durante um clique real (não via console).

### 7.9 Cupons nunca são carregados do banco no admin
- **Causa**: `loadAdminSettings()` (chamada no carregamento do admin) carrega produtos, categorias e zonas de entrega do Supabase, mas **não carrega cupons** (`currentCoupons` fica só com dois valores demo hardcoded até a aba de cupons ser aberta manualmente).
- **Fix**: adicionar `currentCoupons = await DbService.getCoupons();` em `loadAdminSettings()`.

---

## 8. Segurança — pendência importante, não específica de nenhum bug acima

O admin grava/exclui dados diretamente no Supabase usando a **anon key**, exposta no `config.js` do lado do cliente, **sem nenhuma camada de autorização visível no fluxo de dados** (existe um `auth.js`/`AUTH.guardAdmin()` controlando acesso à *página*, mas isso não foi confirmado como suficiente para proteger as *tabelas* em si).

- Isso só é seguro se **Row Level Security (RLS)** estiver corretamente configurado nas tabelas `store_*` no painel do Supabase, restringindo `INSERT`/`UPDATE`/`DELETE` a usuários autenticados/autorizados.
- Se RLS não estiver ativo (ou estiver mal configurado), qualquer pessoa que abrir o console do navegador na loja pública (não só no admin) pode ler `window.db` e escrever/apagar dados diretamente, mesmo sem passar pelo login do admin.
- **Recomendação**: antes de considerar o produto "pronto para vender", confirmar as políticas de RLS no painel do Supabase para cada tabela `store_*`.

---

## 9. Plano de migração para Python (para depois da entrega imediata)

Decisão tomada durante a análise: **não migrar agora** — os bugs listados na seção 7 são de lógica de frontend/mapeamento de dados, independentes da linguagem do backend. Migrar antes de corrigi-los apenas replicaria os mesmos problemas no novo backend.

Ordem recomendada, quando for retomado:
1. Aplicar todos os fixes da seção 7 na versão JS atual (a que está em produção).
2. Descartar `models.py`/`schemas.py` (SQLAlchemy, não usados) ou decidir formalmente adotá-los — hoje é código morto que confunde.
3. Unificar nomenclatura de campos entre o que `main.py` espera/retorna e o que o frontend usa (ex: `dark_color` vs `accent_color`, presença/ausência de `position`, `coverage_cities` etc.) — definir esse schema **antes** de escrever qualquer endpoint novo.
4. Adicionar `supabase-py` ao `requirements.txt` (é a dependência real usada por `main.py`; hoje falta lá).
5. Reescrever `db-service.js` para chamar os endpoints do FastAPI (`fetch`) em vez de `window.db` diretamente — como essa é a única camada que fala com o backend, `admin.js` e `loja.js` não precisam mudar quase nada.
6. Decidir hospedagem da API Python: como ela usa `supabase-py` (comunicação via REST/HTTPS, sem driver nativo de banco), há chance real de funcionar em Cloudflare Python Workers; alternativa mais segura/testada é hospedar a API separadamente (Render, Railway, Fly.io) e manter só o front no Cloudflare Pages, com CORS liberado (já configurado em `main.py`).
7. Mover a `service_role key` do Supabase para o servidor Python apenas (nunca no navegador), e implementar autenticação real nas rotas de escrita (`POST`/`DELETE`) da API — isso resolve de vez a pendência de segurança da seção 8.

---

## 10. Pendências / o que a próxima pessoa precisa para fechar 100% do diagnóstico

- [ ] Ler `auth.js` (não analisado) — provável relação com o bug do botão de cupom (seção 7.8).
- [ ] Ler `style.css` completo — confirmar a origem exata da cor vermelha padrão (seção 7.6, hipótese forte mas não 100% confirmada).
- [ ] Revisar o restante de `loja.js` além do que já foi lido (o arquivo é grande; a leitura desta análise cobriu as áreas relevantes aos bugs relatados, mas não necessariamente 100% do arquivo).
- [ ] Confirmar políticas de RLS no Supabase (seção 8) antes do lançamento comercial.
- [ ] Confirmar se existem outras páginas HTML além de `index.html`/`admin.html` (ex: login do admin, se separado).

---

*Documento gerado a partir de uma sessão de debugging orientada a evidência: cada bug listado foi localizado e confirmado lendo o código-fonte real, não é suposição.*
