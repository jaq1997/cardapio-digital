# 🚀 Documentação de Features Futuras & Roadmap — Catálogo Digital & Delivery

Este documento mapeia as melhorias avançadas e novas funcionalidades planejadas para as próximas versões do produto **Evolux360 / Catálogo Digital White-Label**.

---

## 1. 🚚 Cálculo Dinâmico de Frete por Faixa de CEP / Bairros

### **Objetivo**:
Permitir que o lojista cadastre regras granulares de entrega vinculadas a faixas de CEPs ou bairros específicos, calculando a taxa exata automaticamente quando o cliente digita o CEP no checkout.

### **Especificação Técnica**:
1. **Nova Tabela / Schema no Supabase**: `store_shipping_rules`
   - `id`: UUID / Primary Key
   - `bairro_nome`: VARCHAR / Nome da região ou bairro
   - `cep_inicio`: VARCHAR(9) (ex: `90000-000`)
   - `cep_fim`: VARCHAR(9) (ex: `90090-999`)
   - `taxa_entrega`: NUMERIC(10,2) (ex: `7.50`)
   - `tempo_estimado`: VARCHAR (ex: `30 - 45 min`)
   - `ativo`: BOOLEAN DEFAULT true

2. **Interface Admin (Aba Formas de Entrega)**:
   - Adicionar sub-aba **"Tabela de Frete por CEP / Bairros"**.
   - Formulário de cadastro de Bairro, Faixa Inicial/Final de CEP e Valor da Taxa.
   - Lista visual de bairros atendidos com opção de edição e exclusão.

3. **Integração na Loja**:
   - Ao digitar o CEP no modal de pedido (`buscarCepViaAPI()`), o sistema busca o endereço na API ViaCEP.
   - O sistema consulta o CEP retornado contra a tabela `store_shipping_rules`.
   - Se o CEP estiver dentro de uma faixa cadastrada, o frete daquela região é aplicado automaticamente no total do pedido.

---

## 2. 👁️ Gestão Avançada de Horários de Funcionamento (Trava Automática da Loja)

### **Objetivo**:
Permitir definir horários de abertura e fechamento por dia da semana no Admin. Se a loja estiver fechada no momento da visita do cliente, exibir o selo **"LOJA FECHADA — ABERTA PARA AGENDAMENTO"** no header.

---

## 3. 💳 Gateway de Pagamento Integrado (Pix Automático e Cartão)

### **Objetivo**:
Oferecer suporte opcional a checkout com Mercado Pago / Asaas para geração automática de QR Code Pix e cópia-e-cola com confirmação em tempo real por Webhook antes de enviar o pedido ao WhatsApp.

---

## 4. 📊 Dashboard Analytics Avançado (Painel Admin)

### **Objetivo**:
Exibir relatórios visuais com gráficos de produtos mais vendidos, faturamento diário/mensal e horários de pico de pedidos.

---
*Documentação gerada para acompanhamento e versionamento no repositório GitHub.*
