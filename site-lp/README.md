# 🚀 Evolux Catálogo — Sistema de Catálogo Digital & Delivery Multi-Tenant

Sistema completo de **Catálogo Digital de Alta Conversão**, projetado como solução White-Label para **Alimentação/Delivery, Serviços, Varejo e Hospedagem**.

---

## 📌 Visão Geral do Arquitetura

O **Evolux Catálogo** é construído com arquitetura **Multi-Tenant Nativa** integrada ao **Supabase (PostgreSQL)** com fallback defensivo para o `localStorage` do navegador. Cada lojista possui isolamento total de seus dados (`store_id`), garantindo privacidade e controle independente.

### 🌟 Principais Recursos:
- **Catálogo Digital e Loja Pública (`index.html`):**
  - Layout Ultra-Moderno com suporte a temas dinâmicos (Pre-Hydration sem FOUC).
  - Suporte a **Múltiplas Categorias** por produto (um prato pode estar em *Almoço*, *Promoções*, etc.).
  - Vitrine de demonstração estilo **Nuvemshop/Shopify** para contas novas zeradas.
  - Checkout fluido com captura de **Nome do Cliente**, **WhatsApp**, **Observações do Pedido** e **Consulta de CEP via ViaCEP**.
  - **Envio Automático para WhatsApp** + **Sincronização com o Kanban de Pedidos do Evolux Core (CRM)**.

- **Painel de Gestão Admin (`admin.html`):**
  - Autenticação e proteção de rotas via Supabase Auth (`auth.js`).
  - **Identidade Visual & Banners:** Customização de cores primárias, logo e banners promocionais.
  - **Gerenciador de Produtos:** Suporte a upload de fotos Base64/URL, adicionais com preços, ordenação e botão **Duplicar Produto** em 1-clique.
  - **Gerenciador de Categorias:** Checklist multi-seleção de categorias com vinculação dinâmica de produtos.
  - **Gestão de Frete e Cupons:** Tabela de taxas de entrega regional e cupons de desconto fixo/porcentagem.
  - **Botão Dinâmico "Visualizar Cardápio":** Redireciona diretamente para o link da loja do usuário autenticado.

---

## 📁 Estrutura de Arquivos

```text
evolux-catalogo/
├── app/                                 # 🛒 APLICAÇÃO DO CATÁLOGO & ADMIN
│   ├── index.html                       # Interface pública da loja/catálogo
│   ├── style.css                        # Sistema de design (Tokens, Glassmorphism e Responsividade)
│   ├── loja.js                          # Engine da loja pública, carrinho, CEP e checkout WhatsApp/CRM
│   ├── admin.html                       # Painel de Controle Admin
│   ├── admin-login.html                 # Tela de autenticação dos lojistas (Design System Evolux360)
│   ├── admin.css                        # Estilos do Painel Admin (Dark Mode & Cards)
│   ├── admin.js                         # Regras de negócio do Admin, CRUD de produtos e categorias
│   ├── db-service.js                    # Camada de abstração de dados (Supabase Multi-Tenant por store_id)
│   ├── auth.js                          # Controle de sessão, login/logout e guarda de rotas
│   ├── defaults.js                      # Configurações padrão e componentes globais
│   └── dynamic-components.js            # Componentes reutilizáveis (Drawer, Header e Float Wpp)
│
├── landing/                             # 🚀 LANDING PAGE DE VENDAS (Reservado)
│
├── DOCUMENTACAO-FEATURES-FUTURAS.md     # Roadmap de produtos e feedbacks dos testadores
└── README.md                            # Documentação técnica do repositório
```

---

## 🔒 Multi-Tenancy & Segurança

Cada requisição ao banco de dados no `db-service.js` valida o `store_id` (ID da conta autenticada no Supabase).
- As chaves do `localStorage` são isoladas no formato `ptd_store_products_${store_id}`.
- O salvamento de dados utiliza requisições defensivas limpas, evitando falhas de schema ou estouro de cota do navegador.

---

## 🌿 Branch Principal para Testes & Produção

- **`marmitas`**: Branch oficial de produção e testes de clientes ao vivo (Deploy automático no Cloudflare Pages).
