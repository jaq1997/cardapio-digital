# 🍕 Cardápio Digital & Central de Gestão PDV

Sistema completo de **Cardápio Digital de Alta Conversão** e **Painel de Gestão Operacional (PDV)**, projetado para delivery de **Pizzarias, Marmitarias, Hamburguerias e Restaurantes**.

---

## 📌 Visão Geral do Projeto

O sistema opera sem necessidade de instalação complexa de banco de dados para testes locais, utilizando a API nativa do `localStorage` para sincronização em tempo real entre o **Painel Admin** e o **Cardápio ao Vivo**.

### 🌟 Principais Recursos:
- **Cardápio ao Vivo (`index.html`):** 
  - Layout limpo em estilo Franquia de Delivery.
  - Personalização de tamanhos de pizza (Broto, Média, Grande, Gigante).
  - Divisão de 2 sabores (meio a meio), bordas recheadas e adicionais extras.
  - Gaveta de carrinho de compras com consulta de CEP via API ViaCEP.
  - **Tabela de Frete Dinâmica por Bairro / Região** ou Retirada no Balcão.
  - **Checkout Triplo:** PIX Mercado Pago (instantâneo), Cartão Online e WhatsApp Direct.
  - **Comprovante Digital em Tela (`#orderConfirmedModal`):** Permite finalizar pedidos com 0 dependência do WhatsApp.

- **Painel de Gestão PDV (`admin.html`):**
  - Design Center "Franquia Style" com tipografia de alta precisão em **JetBrains Mono** para preços e IDs.
  - **Customização da Marca:** Upload direto de arquivos `.png` / `.jpg` para a Logo, cores da marca e número do WhatsApp.
  - **Gerenciador de Categorias:** Criação e exclusão dinâmica de abas do cardápio.
  - **Gerenciador de Produtos:** Edição de preços, descrições, tags de destaque e upload direto de fotos por *drag-and-drop*.
  - **Tabela de Taxas de Entrega por Bairro:** Definição de frete regional customizado.
  - **Botão de Restauração 1-Clique:** Restaura os padrões de demonstração da *Pizza Todo Dia* instantaneamente.

---

## 📁 Estrutura de Arquivos

```text
c:\Users\User\Desktop\pizzaria\
├── index.html            # Interface pública do Cardápio ao Vivo
├── style.css             # Estilos CSS da Loja (Design System da Franquia)
├── loja.js               # Lógica do catálogo, carrinho, CEP e checkout
├── admin.html            # Painel de Gestão Operacional e PDV
├── admin.css             # Estilos CSS do Admin (PDV Command Center)
├── admin.js              # Engine de gerenciamento, uploads Base64 e CRUD
├── dynamic-components.js # Navegação por abas e menu gaveta responsivo
└── README.md             # Documentação do projeto
```

---

## 🗝️ Chaves de Armazenamento Local (`localStorage`)

Os dados configurados no Admin são armazenados sob as seguintes chaves:
- `ptd_store_branding`: Configurações de nome, slogan, WhatsApp, cores e logo Base64.
- `ptd_store_categories`: Lista de categorias ativas no cardápio.
- `ptd_store_products`: Catálogo de produtos cadastrados.
- `ptd_delivery_zones`: Tabela de bairros/regiões e valores de entrega.

---

## ⚡ Como Rodar no Computador

Não requer dependências nem `npm install` para a versão Vanilla JS:
1. Abra o arquivo `index.html` em qualquer navegador para ver o cardápio público.
2. Abra o arquivo `admin.html` para gerenciar a loja.

---

## 🌿 Branches do Git

- **`main`**: Versão Vanilla JS 100% estável, ultra-rápida e pronta para demonstrações em tempo real com clientes.
- **`feature/react-app`**: Branch dedicada para futura migração/expansão da arquitetura para React + Vite.
