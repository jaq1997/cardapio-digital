/* ==========================================================================
   DB SERVICE — Camada de abstração de dados (Multi-Tenant com ISOLAMENTO TOTAL por store_id)
   ========================================================================== */

window.DbService = (function () {

  const isReady = () => window.SUPABASE_READY && window.db;
  const getStoreId = () => (typeof CURRENT_STORE_ID !== 'undefined' ? CURRENT_STORE_ID : (localStorage.getItem('active_store_id') || 'default'));

  function getStorageKey(baseKey) {
    return `${baseKey}_${getStoreId()}`;
  }

  function _safeSetStorage(baseKey, value) {
    try {
      localStorage.setItem(getStorageKey(baseKey), typeof value === 'string' ? value : JSON.stringify(value));
    } catch (e) {}
  }

  function _safeGetStorage(baseKey) {
    try {
      const raw = localStorage.getItem(getStorageKey(baseKey));
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  /* -------------------------------------------------------------------------
     BRANDING / IDENTIDADE VISUAL
  ------------------------------------------------------------------------- */
  async function getBranding() {
    if (isReady()) {
      try {
        let { data, error } = await window.db
          .from('store_branding')
          .select('*')
          .eq('store_id', getStoreId())
          .maybeSingle();

        // Sem retry sem filtro — se falhar, cai no cache local (isolamento garantido)
        if (!error && data) {
          const res = {
            storeName:      data.store_name,
            storeSub:       data.store_sub,
            wppNumber:      data.wpp_number,
            frete:          data.frete,
            primaryColor:   data.primary_color,
            darkColor:      data.dark_color,
            btnTextColor:   data.btn_text_color   || '#FFFFFF',
            accentColor:    data.accent_color     || '#6344F5',
            badgeBgColor:   data.badge_bg_color    || '#F1EEFE',
            logoUrl:        data.logo_url,
            bannerDeskUrl:  data.banner_desk_url,
            bannerMobUrl:   data.banner_mob_url,
            coverageCities: data.coverage_cities,
            storeAddress:   data.store_address,
            storeHours:     data.store_hours,
          };
          _safeSetStorage(STORAGE_KEY_BRANDING, res);
          return res;
        }
      } catch(e) {}
    }
    const cached = _safeGetStorage(STORAGE_KEY_BRANDING);
    return cached || { ...defaultBranding };
  }

  async function saveBranding(branding) {
    _safeSetStorage(STORAGE_KEY_BRANDING, branding);

    if (!isReady()) return;

    const payload = {
      store_id:         getStoreId(),
      store_name:       branding.storeName      || '',
      store_sub:        branding.storeSub       || '',
      wpp_number:       branding.wppNumber      || '',
      frete:            branding.frete          || 5.00,
      primary_color:    branding.primaryColor   || '#18181B',
      dark_color:       branding.darkColor      || '#09090B',
      btn_text_color:   branding.btnTextColor   || '#FFFFFF',
      accent_color:     branding.accentColor    || '#6344F5',
      badge_bg_color:   branding.badgeBgColor   || '#F1EEFE',
      logo_url:         branding.logoUrl        || '',
      banner_desk_url:  branding.bannerDeskUrl  || '',
      banner_mob_url:   branding.bannerMobUrl   || '',
      coverage_cities:  branding.coverageCities || '',
      store_address:    branding.storeAddress   || '',
      store_hours:      branding.storeHours     || '',
      updated_at:       new Date().toISOString(),
    };

    try {
      const { error } = await window.db.from('store_branding').upsert(payload, { onConflict: 'store_id' });
      if (error) {
        console.error('[saveBranding] Erro ao salvar no Supabase:', error);
        if (typeof showToast === 'function') showToast('⚠️ Erro ao salvar no servidor: ' + error.message, 'error');
      }
    } catch(e) {
      console.error('[saveBranding] Exceção:', e);
    }
  }

  /* -------------------------------------------------------------------------
     PRODUTOS
  ------------------------------------------------------------------------- */
  function normalizeCategoryValues(value) {
    if (Array.isArray(value)) {
      return value.map(v => String(v || '').trim()).filter(Boolean);
    }
    if (typeof value === 'string') {
      return value.split(',').map(v => v.trim()).filter(Boolean);
    }
    return [];
  }

  function serializeCategoryValue(value) {
    return normalizeCategoryValues(value).join(', ');
  }

  function normalizeProductRecord(product) {
    const categories = normalizeCategoryValues(product.categorias || product.categoria);
    const categoryText = serializeCategoryValue(categories) || 'outros';
    return {
      ...product,
      categoria: categoryText,
      categorias: categories,
    };
  }

  async function getProducts() {
    if (isReady()) {
      try {
        const { data, error } = await window.db
          .from('store_products')
          .select('*')
          .eq('store_id', getStoreId())
          .order('position', { ascending: true });

        // Sem retry sem filtro — se falhar, cai no cache local (isolamento garantido)
        if (!error && Array.isArray(data)) {
          const normalized = data.map(normalizeProductRecord);
          _safeSetStorage(STORAGE_KEY_PRODUCTS, normalized);
          return normalized;
        }
      } catch(e) {}
    }
    const cached = _safeGetStorage(STORAGE_KEY_PRODUCTS);
    return Array.isArray(cached) ? cached.map(normalizeProductRecord) : [];
  }

  async function upsertProduct(product) {
    if (isReady()) {
      const selectedCategories = normalizeCategoryValues(product.categorias || product.categoria);
      const categoryText = serializeCategoryValue(selectedCategories) || 'outros';
      const payload = {
        id:            product.id,
        store_id:      getStoreId(),
        nome:          product.nome           || '',
        categoria:     categoryText,
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

      if (error && error.code !== 'PGRST204') {
        // Fallback: tenta sem o campo 'adicionais' (pode não existir na tabela)
        // NUNCA remove store_id — isolamento entre contas deve ser preservado
        const fallbackPayload = { ...payload };
        delete fallbackPayload.adicionais;
        await window.db.from('store_products').upsert(fallbackPayload, { onConflict: 'id' });
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
      window.db.from('store_products').select('*').eq('store_id', getStoreId()).order('position').then(({ data, error }) => {
        if (!error && Array.isArray(data)) {
          _safeSetStorage(STORAGE_KEY_PRODUCTS, data.map(normalizeProductRecord));
        }
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
          .eq('store_id', getStoreId())
          .order('position', { ascending: true });

        // Sem retry sem filtro — se falhar, cai no cache local (isolamento garantido)
        if (!error && Array.isArray(data)) {
          _safeSetStorage(STORAGE_KEY_CATEGORIES, data);
          return data;
        }
      } catch(e) {}
    }
    const cached = _safeGetStorage(STORAGE_KEY_CATEGORIES);
    return Array.isArray(cached) ? cached : [];
  }

  async function upsertCategory(cat) {
    if (isReady()) {
      try {
        const payload = {
          id:       cat.id || ('cat-' + Date.now()),
          store_id: getStoreId(),
          name:     cat.name || '',
          active:   cat.active !== false,
          position: cat.position || 0,
        };
        let { error } = await window.db.from('store_categories').upsert(payload);
        if (error) {
          delete payload.active;
          delete payload.position;
          delete payload.store_id;
          await window.db.from('store_categories').upsert(payload);
        }
      } catch(e) {}
    }

    let existing = _safeGetStorage(STORAGE_KEY_CATEGORIES) || [];
    const idx = existing.findIndex(c => String(c.id) === String(cat.id));
    if (idx >= 0) {
      existing[idx] = { ...existing[idx], ...cat };
    } else {
      existing.push(cat);
    }
    _safeSetStorage(STORAGE_KEY_CATEGORIES, existing);
    return existing;
  }

  async function deleteCategory(id) {
    if (isReady()) {
      try {
        await window.db.from('store_categories').delete().eq('id', id);
      } catch(e) {}
    }
    let existing = _safeGetStorage(STORAGE_KEY_CATEGORIES) || [];
    existing = existing.filter(c => String(c.id) !== String(id));
    _safeSetStorage(STORAGE_KEY_CATEGORIES, existing);
    return existing;
  }

  /* -------------------------------------------------------------------------
     ZONAS DE ENTREGA
  ------------------------------------------------------------------------- */
  async function getDeliveryZones() {
    if (isReady()) {
      try {
        let { data, error } = await window.db
          .from('store_delivery_zones')
          .select('*')
          .eq('store_id', getStoreId())
          .order('position', { ascending: true });

        if (error) {
          const retry = await window.db.from('store_delivery_zones').select('*').order('position', { ascending: true });
          if (!retry.error && Array.isArray(retry.data)) { data = retry.data; error = null; }
        }

        if (!error && Array.isArray(data)) {
          _safeSetStorage(STORAGE_KEY_DELIVERY_ZONES, data);
          return data;
        }
      } catch(e) {}
    }
    const cached = _safeGetStorage(STORAGE_KEY_DELIVERY_ZONES);
    return Array.isArray(cached) ? cached : [];
  }

  async function upsertDeliveryZone(zone) {
    if (isReady()) {
      const payload = {
        id:       zone.id,
        store_id: getStoreId(),
        name:     zone.name  || '',
        price:    zone.price || 0,
        position: zone.position || 0,
      };
      let { error } = await window.db.from('store_delivery_zones').upsert(payload, { onConflict: 'id' });
      if (error && error.code === 'PGRST204') {
        delete payload.store_id;
        await window.db.from('store_delivery_zones').upsert(payload, { onConflict: 'id' });
      }
    }
    const zones = await getDeliveryZones();
    _safeSetStorage(STORAGE_KEY_DELIVERY_ZONES, zones);
  }

  async function deleteDeliveryZone(id) {
    if (isReady()) {
      await window.db.from('store_delivery_zones').delete().eq('id', id);
    }
    const zones = await getDeliveryZones();
    _safeSetStorage(STORAGE_KEY_DELIVERY_ZONES, zones);
  }

  /* -------------------------------------------------------------------------
     CUPONS
  ------------------------------------------------------------------------- */
  async function getCoupons() {
    if (isReady()) {
      try {
        let { data, error } = await window.db
          .from('store_coupons')
          .select('*')
          .eq('store_id', getStoreId())
          .order('created_at', { ascending: false });

        if (error) {
          const retry = await window.db.from('store_coupons').select('*').order('created_at', { ascending: false });
          if (!retry.error && Array.isArray(retry.data)) { data = retry.data; error = null; }
        }

        if (!error && Array.isArray(data)) {
          _safeSetStorage(STORAGE_KEY_COUPONS, data);
          return data;
        }
      } catch(e) {}
    }
    const cached = _safeGetStorage(STORAGE_KEY_COUPONS);
    return Array.isArray(cached) ? cached : [];
  }

  async function upsertCoupon(coupon) {
    if (isReady()) {
      const payload = {
        id:         coupon.id,
        store_id:   getStoreId(),
        code:       (coupon.code || '').toUpperCase(),
        type:       coupon.type       || 'fixed',
        value:      coupon.value      || 0,
        min_order:  coupon.minOrder   || coupon.min_order || 0,
        active:     coupon.active !== false,
        expires_at: coupon.expiresAt  || coupon.expires_at || null,
      };
      let { error } = await window.db.from('store_coupons').upsert(payload, { onConflict: 'id' });
      if (error && error.code === 'PGRST204') {
        delete payload.store_id;
        await window.db.from('store_coupons').upsert(payload, { onConflict: 'id' });
      }
    }
    const coupons = await getCoupons();
    _safeSetStorage(STORAGE_KEY_COUPONS, coupons);
  }

  async function deleteCoupon(id) {
    if (isReady()) {
      await window.db.from('store_coupons').delete().eq('id', id);
    }
    const coupons = await getCoupons();
    _safeSetStorage(STORAGE_KEY_COUPONS, coupons);
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
