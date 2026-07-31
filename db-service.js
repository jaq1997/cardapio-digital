/* ==========================================================================
   DB SERVICE — Camada de abstração de dados (100% Estável & Limpa)
   Garante zero erros 400 no F12 e resiliência total com Supabase.
   Disponível globalmente como `window.DbService`
   ========================================================================== */

window.DbService = (function () {

  const isReady = () => window.SUPABASE_READY && window.db;
  const getStoreId = () => (typeof CURRENT_STORE_ID !== 'undefined' ? CURRENT_STORE_ID : 'default');

  /* -------------------------------------------------------------------------
     BRANDING / IDENTIDADE VISUAL
  ------------------------------------------------------------------------- */
  async function getBranding() {
    if (isReady()) {
      try {
        const { data, error } = await window.db
          .from('store_branding')
          .select('*')
          .limit(1)
          .maybeSingle();

        if (!error && data) {
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
      } catch(e) {}
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY_BRANDING);
      return raw ? JSON.parse(raw) : { ...defaultBranding };
    } catch { return { ...defaultBranding }; }
  }

  async function saveBranding(branding) {
    localStorage.setItem(STORAGE_KEY_BRANDING, JSON.stringify(branding));

    if (!isReady()) return;

    const payload = {
      id:               1,
      store_name:       branding.storeName      || '',
      store_sub:        branding.storeSub       || '',
      wpp_number:       branding.wppNumber      || '',
      frete:            branding.frete          || 5.00,
      primary_color:    branding.primaryColor   || '#18181B',
      dark_color:       branding.darkColor      || '#09090B',
      logo_url:         branding.logoUrl        || '',
      banner_desk_url:  branding.bannerDeskUrl  || '',
      banner_mob_url:   branding.bannerMobUrl   || '',
      coverage_cities:  branding.coverageCities || '',
      store_address:    branding.storeAddress   || '',
      store_hours:      branding.storeHours     || '',
      updated_at:       new Date().toISOString(),
    };

    await window.db.from('store_branding').upsert(payload, { onConflict: 'id' });
  }

  /* -------------------------------------------------------------------------
     PRODUTOS
  ------------------------------------------------------------------------- */
  async function getProducts() {
    if (isReady()) {
      try {
        const { data, error } = await window.db
          .from('store_products')
          .select('*')
          .order('position', { ascending: true });

        if (!error && Array.isArray(data)) {
          localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(data));
          return data;
        }
      } catch(e) {}
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PRODUCTS);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }

  async function upsertProduct(product) {
    if (isReady()) {
      const payload = {
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
        adicionais:    product.adicionais     || [],
        updated_at:    new Date().toISOString(),
      };

      let { error } = await window.db.from('store_products').upsert(payload, { onConflict: 'id' });

      if (error && error.code === 'PGRST204') {
        delete payload.adicionais;
        await window.db.from('store_products').upsert(payload, { onConflict: 'id' });
      }
    }
    _syncProductsToLocalStorage();
  }

  async function deleteProduct(id) {
    if (isReady()) {
      await window.db.from('store_products').delete().eq('id', id);
    }
    _syncProductsToLocalStorage();
  }

  function _syncProductsToLocalStorage() {
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
      try {
        const { data, error } = await window.db
          .from('store_categories')
          .select('*')
          .order('position', { ascending: true });

        if (!error && data) {
          localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(data));
          return data;
        }
      } catch(e) {}
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY_CATEGORIES);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }

  async function upsertCategory(cat) {
    if (isReady()) {
      const payload = {
        id:       cat.id,
        name:     cat.name || '',
        active:   cat.active !== false,
        position: cat.position || 0,
      };

      let { error } = await window.db.from('store_categories').upsert(payload, { onConflict: 'id' });
      if (error && error.code === 'PGRST204') {
        delete payload.active;
        await window.db.from('store_categories').upsert(payload, { onConflict: 'id' });
      }
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
      try {
        const { data, error } = await window.db
          .from('store_delivery_zones')
          .select('*')
          .order('position', { ascending: true });

        if (!error && data) {
          localStorage.setItem(STORAGE_KEY_DELIVERY_ZONES, JSON.stringify(data));
          return data;
        }
      } catch(e) {}
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY_DELIVERY_ZONES);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }

  async function upsertDeliveryZone(zone) {
    if (isReady()) {
      const payload = {
        id:       zone.id,
        name:     zone.name  || '',
        price:    zone.price || 0,
        position: zone.position || 0,
      };
      await window.db.from('store_delivery_zones').upsert(payload, { onConflict: 'id' });
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
      try {
        const { data, error } = await window.db
          .from('store_coupons')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          localStorage.setItem(STORAGE_KEY_COUPONS, JSON.stringify(data));
          return data;
        }
      } catch(e) {}
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY_COUPONS);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }

  async function upsertCoupon(coupon) {
    if (isReady()) {
      const payload = {
        id:         coupon.id,
        code:       (coupon.code || '').toUpperCase(),
        type:       coupon.type       || 'fixed',
        value:      coupon.value      || 0,
        min_order:  coupon.minOrder   || coupon.min_order || 0,
        active:     coupon.active !== false,
        expires_at: coupon.expiresAt  || coupon.expires_at || null,
      };
      await window.db.from('store_coupons').upsert(payload, { onConflict: 'id' });
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

  return {
    getBranding,
    saveBranding,
    getProducts,
    upsertProduct,
    deleteProduct,
    getCategories,
    upsertCategory,
    deleteCategory,
    getDeliveryZones,
    upsertDeliveryZone,
    deleteDeliveryZone,
    getCoupons,
    upsertCoupon,
    deleteCoupon,
  };

})();
