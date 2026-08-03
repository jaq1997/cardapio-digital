-- ==========================================================================
-- SUPABASE — Script de criação das tabelas do Cardápio Digital
-- Execute no SQL Editor do Supabase (painel → SQL Editor → New Query)
-- ==========================================================================

-- 1. BRANDING (configurações visuais da loja) — sempre 1 linha
CREATE TABLE IF NOT EXISTS store_branding (
  id               SERIAL PRIMARY KEY,
  store_name       TEXT DEFAULT 'Minha Loja',
  store_sub        TEXT DEFAULT '',
  wpp_number       TEXT DEFAULT '',
  frete            NUMERIC DEFAULT 5.00,
  primary_color    TEXT DEFAULT '#E91C24',
  dark_color       TEXT DEFAULT '#C50303',
  logo_url         TEXT DEFAULT '',
  banner_desk_url  TEXT DEFAULT '',
  banner_mob_url   TEXT DEFAULT '',
  coverage_cities  TEXT DEFAULT '',
  store_address    TEXT DEFAULT '',
  store_hours      TEXT DEFAULT '',
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Garante que só existe 1 linha de branding
INSERT INTO store_branding (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- 2. CATEGORIAS
CREATE TABLE IF NOT EXISTS store_categories (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  position   INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PRODUTOS
CREATE TABLE IF NOT EXISTS store_products (
  id             TEXT PRIMARY KEY,
  nome           TEXT NOT NULL,
  categoria      TEXT DEFAULT 'outros',
  descricao      TEXT DEFAULT '',
  preco_broto    NUMERIC DEFAULT 0,
  preco_media    NUMERIC DEFAULT 0,
  preco_grande   NUMERIC DEFAULT 0,
  preco_gigante  NUMERIC DEFAULT 0,
  badge          TEXT DEFAULT '',
  img_url        TEXT DEFAULT '',
  status         TEXT DEFAULT 'ativo',
  position       INT DEFAULT 0,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ZONAS DE ENTREGA
CREATE TABLE IF NOT EXISTS store_delivery_zones (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  price      NUMERIC DEFAULT 0,
  position   INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CUPONS DE DESCONTO
CREATE TABLE IF NOT EXISTS store_coupons (
  id         TEXT PRIMARY KEY,
  code       TEXT UNIQUE NOT NULL,
  type       TEXT DEFAULT 'fixed',   -- 'fixed' ou 'percent'
  value      NUMERIC DEFAULT 0,
  min_order  NUMERIC DEFAULT 0,
  active     BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================================================
-- ROW LEVEL SECURITY (RLS)
-- Leitura pública (loja) | Escrita somente para usuário autenticado (admin)
-- ==========================================================================

ALTER TABLE store_branding       ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_categories     ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_products       ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_delivery_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_coupons        ENABLE ROW LEVEL SECURITY;

-- Políticas de LEITURA pública
CREATE POLICY "Leitura publica - branding"       ON store_branding       FOR SELECT USING (true);
CREATE POLICY "Leitura publica - categorias"     ON store_categories     FOR SELECT USING (true);
CREATE POLICY "Leitura publica - produtos"       ON store_products       FOR SELECT USING (true);
CREATE POLICY "Leitura publica - zonas"          ON store_delivery_zones FOR SELECT USING (true);
CREATE POLICY "Leitura publica - cupons"         ON store_coupons        FOR SELECT USING (true);

-- Políticas de ESCRITA para usuários autenticados
CREATE POLICY "Admin - branding"       ON store_branding       FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin - categorias"     ON store_categories     FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin - produtos"       ON store_products       FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin - zonas"          ON store_delivery_zones FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin - cupons"         ON store_coupons        FOR ALL USING (auth.role() = 'authenticated');

-- ==========================================================================
-- ÍNDICES para performance
-- ==========================================================================
CREATE INDEX IF NOT EXISTS idx_products_categoria ON store_products (categoria);
CREATE INDEX IF NOT EXISTS idx_products_status    ON store_products (status);
CREATE INDEX IF NOT EXISTS idx_coupons_code       ON store_coupons (code);
