# 🚀 Documentação de Features Futuras & Roadmap — Catálogo Digital & Delivery

Este documento mapeia os feedbacks reais de testadores, melhorias avançadas e novas funcionalidades planejadas para as próximas versões do produto **Evolux360 / Catálogo Digital White-Label**.

---

## 📌 Feedbacks de Testadores & Melhorias de UX (Mapeamento Recente)

### 1. 💰 Gestão de Preços Personalizados e Variantes (Estilo Goomer)
- **Feedback da Lojista**: "Criar produtos duplicados para porções diferentes (ex: Individual vs. Casal) deixa a tela cheia de produtos parecidos e confunde o cliente final."
- **Solução Proposta**:
  - **Preço Personalizado / Dropdown**: No cadastro do produto, permitir um switch para "Desabilitar preço principal" e definir preço como *"A partir de R$ XX"* ou *"Personalizado"*.
  - **Opcionais/Porções como Variantes**: O cliente escolhe a porção/tamanho direto nos opcionais sem precisar ver múltiplos produtos no cardápio.
- **Cadastro de Cliente Recorrente (Roadmap)**: Permitir que o cliente final insira seu e-mail/WhatsApp na loja para puxar automaticamente seu histórico de pedidos e endereço cadastrado.

### 2. ✏️ Ajuste no Botão de Atalho da Sidebar do Admin
- **Feedback**: Substituir a nomenclatura atual *"Ver Cardápio Ao Vivo"* por **"Visualizar Cardápio"** ou **"Ver Loja"**.
- **Objetivo**: Tornar o botão mais direto e profissional no dia a dia da operação.

### 3. 📊 Limpeza da Visão Geral (Dashboard) & Central de Pedidos
- **Feedback**: "Tirar avisos técnicos de Supabase/Banco de dados da visão geral do painel, pois o lojista não precisa ver detalhes técnicos."
- **Melhoria**:
  - Exibir métricas limpas no painel Admin (Ex: Total de Pedidos do Dia, Valor Total Transacionado no WhatsApp).
  - Integrar com o painel do **Evolux Core (CRM)** para exibir o Kanban dos últimos pedidos finalizados.

### 4. 🎨 Ajustes de Layout na Identidade Visual & Horários de Funcionamento
- **Placeholders de Demonstração**:
  - Na aba *"Identidade Visual & Banners"*, incluir imagens de placeholder SVG (com guias de tamanho ideal) para indicar onde a logo e os banners desktop/mobile ficarão exibidos na loja.
- **Horários de Funcionamento (Estilo Google Meu Negócio)**:
  - Definir o estado padrão como **"Sempre Aberto"**.
  - Adicionar o botão/chave **"Definir Horário de Funcionamento"** onde o lojista abre os seletores de horário por dia da semana caso queira fechar a loja automaticamente fora do expediente.

---

## 🛣️ Roadmap Técnico de Longo Prazo

### 5. 🚚 Cálculo Dinâmico de Frete por Faixa de CEP / Bairros
- **Objetivo**: Permitir que o lojista cadastre regras granulares de entrega vinculadas a faixas de CEPs ou bairros específicos, calculando a taxa exata automaticamente quando o cliente digita o CEP no checkout.

### 6. 👁️ Trava Automática de Horários na Loja
- **Objetivo**: Permitir definir horários de abertura e fechamento por dia da semana no Admin. Se a loja estiver fechada no momento da visita do cliente, exibir o selo **"LOJA FECHADA — ABERTA PARA AGENDAMENTO"** no header.

### 7. 💳 Gateway de Pagamento Integrado (Pix Automático e Cartão)
- **Objetivo**: Oferecer suporte opcional a checkout com Mercado Pago / Asaas para geração automática de QR Code Pix e cópia-e-cola com confirmação em tempo real por Webhook antes de enviar o pedido ao WhatsApp.

### 8. 📊 Dashboard Analytics Avançado (Painel Admin)
- **Objetivo**: Exibir relatórios visuais com gráficos de produtos mais vendidos, faturamento diário/mensal e horários de pico de pedidos.

---
*Documentação gerada para acompanhamento e versionamento no repositório GitHub.*
