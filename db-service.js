/* ==========================================================================
   DB SERVICE — Camada de abstração de dados
   Tenta Supabase primeiro; cai no localStorage como fallback.
   Disponível globalmente como `window.DbService`
   ========================================================================== */

window.DbService = (function () {

  const isReady = () => window.SUPABASE_READY && window.db;

  /* -------------------------------------------------------------------------
     BRANDING
  ------------------------------------------------------------------------- */
  async function getBranding() {
    if (isReady()) {
      const { data, error } = await window.db
        .from('store_branding')
        .select('*')
        .eq('id', 1)
        .single();
      if (!error && data) {
        // Normaliza chaves snake_case → camelCase
        return {
          storeName:      data.store_name,
          storeSub:       data.store_sub,
          wppNumber:      data.wpp_number,
          frete:          data.frete,
          primaryColor:   data.primary_color,
          darkColor:      data.dark_color,
          logoUrl:        data.logo_url,
          bannerDeskUrl:  data.banner_desk_url,
          bannerMobUrl:   data.banner_mob_url,
          coverageCities: data.coverage_cities,
          storeAddress:   data.store_address,
          storeHours:     data.store_hours,
        };
      }
    }
    // Fallback localStorage
    try {
      const raw = localStorage.getItem(STORAGE_KEY_BRANDING);
      return raw ? JSON.parse(raw) : { ...defaultBranding };
    } catch { return { ...defaultBranding }; }
  }

  async function saveBranding(branding) {
    // Sempre persiste no localStorage como cache
    localStorage.setItem(STORAGE_KEY_BRANDING, JSON.stringify(branding));

    if (!isReady()) return;
    await window.db.from('store_branding').upsert({
      id:               1,
      store_name:       branding.storeName      || '',
      store_sub:        branding.storeSub       || '',
      wpp_number:       branding.wppNumber      || '',
      frete:            branding.frete          || 5.00,
      primary_color:    branding.primaryColor   || '#E91C24',
      dark_color:       branding.darkColor      || '#C50303',
      logo_url:         branding.logoUrl        || '',
      banner_desk_url:  branding.bannerDeskUrl  || '',
      banner_mob_url:   branding.bannerMobUrl   || '',
      coverage_cities:  branding.coverageCities || '',
      store_address:    branding.storeAddress   || '',
      store_hours:      branding.storeHours     || '',
      updated_at:       new Date().toISOString(),
    }, { onConflict: 'id' });
  }

  /* -------------------------------------------------------------------------
     PRODUTOS
  ------------------------------------------------------------------------- */
  async function getProducts() {
    if (isReady()) {
      const { data, error } = await window.db
        .from('store_products')
        .select('*')
        .order('position', { ascending: true });
      if (!error && data && data.length > 0) {
        localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(data));
        return data;
      }
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PRODUCTS);
      return raw ? JSON.parse(raw) : [...defaultProducts];
    } catch { return [...defaultProducts]; }
  }

  async function upsertProduct(product) {
    if (isReady()) {
      const { error } = await window.db.from('store_products').upsert({
        id:            product.id,
        nome:          product.nome           || '',
        categoria:     product.categoria      || 'outros',
        descricao:     product.descricao      || '',
        preco_broto:   product.preco_broto    || 0,
        preco_media:   product.preco_media    || 0,
        preco_grande:  product.preco_grande   || product.preco || 0,
        preco_gigante: product.preco_gigante  || 0,
        badge:         product.badge          || '',
        img_url:       product.img_url        || '',
        status:        product.status         || 'ativo',
        updated_at:    new Date().toISOString(),
      }, { onConflict: 'id' });
      if (error) console.error('[DbService] upsertProduct:', error);
    }
    // Atualiza localStorage como cache
    _syncProductsToLocalStorage();
  }

  async function deleteProduct(id) {
    if (isReady()) {
      const { error } = await window.db
        .from('store_products')
        .delete()
        .eq('id', id);
      if (error) console.error('[DbService] deleteProduct:', error);
    }
    _syncProductsToLocalStorage();
  }

  function _syncProductsToLocalStorage() {
    // Após qualquer mudança, re-lê do Supabase e atualiza o cache
    if (isReady()) {
      window.db.from('store_products').select('*').order('position').then(({ data }) => {
        if (data) localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(data));
      });
    }
  }

  /* -------------------------------------------------------------------------
     CATEGORIAS
  ------------------------------------------------------------------------- */
  async function getCategories() {
    if (isReady()) {
      const { data, error } = await window.db
        .from('store_categories')
        .select('*')
        .order('position', { ascending: true });
      if (!error && data && data.length > 0) {
        localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(data));
        return data;
      }
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY_CATEGORIES);
      return raw ? JSON.parse(raw) : [...defaultCategories];
    } catch { return [...defaultCategories]; }
  }

  async function upsertCategory(cat) {
    if (isReady()) {
      await window.db.from('store_categories').upsert({
        id:       cat.id,
        name:     cat.name || '',
        position: cat.position || 0,
      }, { onConflict: 'id' });
    }
    const cats = await getCategories();
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(cats));
  }

  async function deleteCategory(id) {
    if (isReady()) {
      await window.db.from('store_categories').delete().eq('id', id);
    }
    const cats = await getCategories();
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(cats));
  }

  /* -------------------------------------------------------------------------
     ZONAS DE ENTREGA
  ------------------------------------------------------------------------- */
  async function getDeliveryZones() {
    if (isReady()) {
      const { data, error } = await window.db
        .from('store_delivery_zones')
        .select('*')
        .order('position', { ascending: true });
      if (!error && data && data.length > 0) {
        localStorage.setItem(STORAGE_KEY_DELIVERY_ZONES, JSON.stringify(data));
        return data;
      }
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY_DELIVERY_ZONES);
      return raw ? JSON.parse(raw) : [...defaultDeliveryZones];
    } catch { return [...defaultDeliveryZones]; }
  }

  async function upsertDeliveryZone(zone) {
    if (isReady()) {
      await window.db.from('store_delivery_zones').upsert({
        id:       zone.id,
        name:     zone.name  || '',
        price:    zone.price || 0,
        position: zone.position || 0,
      }, { onConflict: 'id' });
    }
    const zones = await getDeliveryZones();
    localStorage.setItem(STORAGE_KEY_DELIVERY_ZONES, JSON.stringify(zones));
  }

  async function deleteDeliveryZone(id) {
    if (isReady()) {
      await window.db.from('store_delivery_zones').delete().eq('id', id);
    }
    const zones = await getDeliveryZones();
    localStorage.setItem(STORAGE_KEY_DELIVERY_ZONES, JSON.stringify(zones));
  }

  /* -------------------------------------------------------------------------
     CUPONS
  ------------------------------------------------------------------------- */
  async function getCoupons() {
    if (isReady()) {
      const { data, error } = await window.db
        .from('store_coupons')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        localStorage.setItem(STORAGE_KEY_COUPONS, JSON.stringify(data));
        return data;
      }
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY_COUPONS);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }

  async function upsertCoupon(coupon) {
    if (isReady()) {
      await window.db.from('store_coupons').upsert({
        id:         coupon.id,
        code:       (coupon.code || '').toUpperCase(),
        type:       coupon.type       || 'fixed',
        value:      coupon.value      || 0,
        min_order:  coupon.minOrder   || coupon.min_order || 0,
        active:     coupon.active !== false,
        expires_at: coupon.expiresAt  || coupon.expires_at || null,
      }, { onConflict: 'id' });
    }
    const coupons = await getCoupons();
    localStorage.setItem(STORAGE_KEY_COUPONS, JSON.stringify(coupons));
  }

  async function deleteCoupon(id) {
    if (isReady()) {
      await window.db.from('store_coupons').delete().eq('id', id);
    }
    const coupons = await getCoupons();
    localStorage.setItem(STORAGE_KEY_COUPONS, JSON.stringify(coupons));
  }

  /* -------------------------------------------------------------------------
     API PÚBLICA
  ------------------------------------------------------------------------- */
  return {
    getBranding,    saveBranding,
    getProducts,    upsertProduct,  deleteProduct,
    getCategories,  upsertCategory, deleteCategory,
    getDeliveryZones, upsertDeliveryZone, deleteDeliveryZone,
    getCoupons,     upsertCoupon,   deleteCoupon,
  };

})();
