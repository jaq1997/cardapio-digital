-- ==========================================================================
-- SCRIPT COMPLETO — NUKE + REBUILD
-- Catálogo Digital & Delivery — Multi-Tenant (Supabase)
--
-- ATENÇÃO: Este script APAGA e recria todas as tabelas do catálogo.
-- Execute no SQL Editor do Supabase (painel → SQL Editor → New Query)
-- ==========================================================================

-- ============================================================
-- PARTE 1: LIMPEZA TOTAL (DROP)
-- ============================================================
DROP TABLE IF EXISTS store_coupons        CASCADE;
DROP TABLE IF EXISTS store_delivery_zones CASCADE;
DROP TABLE IF EXISTS store_products       CASCADE;
DROP TABLE IF EXISTS store_categories     CASCADE;
DROP TABLE IF EXISTS store_branding       CASCADE;
DROP TABLE IF EXISTS orders               CASCADE;
DROP TABLE IF EXISTS profiles             CASCADE;

DROP TYPE IF EXISTS public.order_status CASCADE;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- ============================================================
-- PARTE 2: CRIAÇÃO DAS TABELAS (MULTI-TENANT)
-- store_id = UUID do usuário autenticado (auth.uid())
-- ============================================================

-- 1. BRANDING — configurações visuais da loja (1 linha por store_id)
CREATE TABLE store_branding (
  store_id         TEXT PRIMARY KEY,    -- UUID do dono da loja
  store_name       TEXT    DEFAULT 'Minha Loja',
  store_sub        TEXT    DEFAULT '',
  wpp_number       TEXT    DEFAULT '',
  frete            NUMERIC DEFAULT 5.00,
  primary_color    TEXT    DEFAULT '#18181B',
  dark_color       TEXT    DEFAULT '#09090B',
  btn_text_color   TEXT    DEFAULT '#FFFFFF',
  accent_color     TEXT    DEFAULT '#6344F5',
  badge_bg_color   TEXT    DEFAULT '#F1EEFE',
  logo_url         TEXT    DEFAULT '',
  banner_desk_url  TEXT    DEFAULT '',
  banner_mob_url   TEXT    DEFAULT '',
  coverage_cities  TEXT    DEFAULT '',
  store_address    TEXT    DEFAULT '',
  store_hours      TEXT    DEFAULT '',
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CATEGORIAS
CREATE TABLE store_categories (
  id         TEXT PRIMARY KEY,
  store_id   TEXT NOT NULL,
  name       TEXT NOT NULL,
  active     BOOLEAN DEFAULT TRUE,
  position   INT     DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PRODUTOS
CREATE TABLE store_products (
  id            TEXT PRIMARY KEY,
  store_id      TEXT NOT NULL,
  nome          TEXT NOT NULL,
  categoria     TEXT    DEFAULT 'outros',
  descricao     TEXT    DEFAULT '',
  preco_broto   NUMERIC DEFAULT 0,
  preco_media   NUMERIC DEFAULT 0,
  preco_grande  NUMERIC DEFAULT 0,
  preco_gigante NUMERIC DEFAULT 0,
  badge         TEXT    DEFAULT '',
  img_url       TEXT    DEFAULT '',
  status        TEXT    DEFAULT 'ativo',
  adicionais    JSONB   DEFAULT '[]'::jsonb,
  position      INT     DEFAULT 0,
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ZONAS DE ENTREGA
CREATE TABLE store_delivery_zones (
  id         TEXT PRIMARY KEY,
  store_id   TEXT NOT NULL,
  name       TEXT NOT NULL,
  price      NUMERIC DEFAULT 0,
  position   INT     DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CUPONS DE DESCONTO
CREATE TABLE store_coupons (
  id         TEXT PRIMARY KEY,
  store_id   TEXT NOT NULL,
  code       TEXT NOT NULL,
  type       TEXT    DEFAULT 'fixed',  -- 'fixed' ou 'percent'
  value      NUMERIC DEFAULT 0,
  min_order  NUMERIC DEFAULT 0,
  active     BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PERFIS DE USUÁRIO (para futuro CRM)
CREATE TABLE profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name  TEXT,
  avatar_url TEXT
);

-- Trigger: cria perfil automaticamente ao cadastrar novo usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id) VALUES (new.id) ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================================
-- PARTE 3: ROW LEVEL SECURITY (RLS) — MULTI-TENANT CORRETO
--
-- LEITURA:  pública — clientes veem o cardápio sem precisar de login
-- ESCRITA:  isolada — cada lojista só acessa e modifica os próprios dados
-- ============================================================

ALTER TABLE store_branding       ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_categories     ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_products       ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_delivery_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_coupons        ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles             ENABLE ROW LEVEL SECURITY;

-- BRANDING
CREATE POLICY "branding_leitura_publica" ON store_branding
  FOR SELECT USING (true);
CREATE POLICY "branding_escrita_owner" ON store_branding
  FOR ALL USING (auth.uid()::text = store_id)
  WITH CHECK (auth.uid()::text = store_id);

-- CATEGORIAS
CREATE POLICY "categorias_leitura_publica" ON store_categories
  FOR SELECT USING (true);
CREATE POLICY "categorias_escrita_owner" ON store_categories
  FOR ALL USING (auth.uid()::text = store_id)
  WITH CHECK (auth.uid()::text = store_id);

-- PRODUTOS
CREATE POLICY "produtos_leitura_publica" ON store_products
  FOR SELECT USING (true);
CREATE POLICY "produtos_escrita_owner" ON store_products
  FOR ALL USING (auth.uid()::text = store_id)
  WITH CHECK (auth.uid()::text = store_id);

-- ZONAS DE ENTREGA
CREATE POLICY "zonas_leitura_publica" ON store_delivery_zones
  FOR SELECT USING (true);
CREATE POLICY "zonas_escrita_owner" ON store_delivery_zones
  FOR ALL USING (auth.uid()::text = store_id)
  WITH CHECK (auth.uid()::text = store_id);

-- CUPONS
CREATE POLICY "cupons_leitura_publica" ON store_coupons
  FOR SELECT USING (true);
CREATE POLICY "cupons_escrita_owner" ON store_coupons
  FOR ALL USING (auth.uid()::text = store_id)
  WITH CHECK (auth.uid()::text = store_id);

-- PERFIS
CREATE POLICY "perfis_owner" ON profiles
  FOR ALL USING (auth.uid() = id);

-- ============================================================
-- PARTE 4: ÍNDICES (performance em queries multi-tenant)
-- ============================================================
CREATE INDEX idx_categories_store_id     ON store_categories     (store_id);
CREATE INDEX idx_products_store_id       ON store_products       (store_id);
CREATE INDEX idx_products_categoria      ON store_products       (categoria);
CREATE INDEX idx_products_status         ON store_products       (status);
CREATE INDEX idx_zones_store_id          ON store_delivery_zones (store_id);
CREATE INDEX idx_coupons_store_id        ON store_coupons        (store_id);
CREATE INDEX idx_coupons_code            ON store_coupons        (code);

-- Atualiza cache da API do Supabase
NOTIFY pgrst, 'reload schema';
