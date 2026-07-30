
/* Constantes de Storage e URLs fornecidas por defaults.js */

let WPP_NUMERO = '5551989912555';

// Delivery zones default moved to `defaults.js`

let catalogData = [];
let deliveryZones = defaultDeliveryZones;
let cart = [];
let activeCategory = 'todos';
let currentSearchQuery = '';

let selectedSize = 'grande';
let flavorMode = 'single';
let currentSelectedProduct = null;
let currentDeliveryFee = 5.00;
let currentSelectedZoneName = "Entrega em Domicílio";

// Default products moved to `defaults.js` (alias `defaultCatalogData`)

async function initLojaEngine() {
  await applyDynamicBranding();
  await loadCatalogData();
  await loadDeliveryZonesData();
  renderCatalog();
  await loadAndRenderDrawerCategories();
  populateFlavorRadioLists();
}

async function loadAndRenderDrawerCategories() {
  const container = document.getElementById('drawerCategoriesList');
  if (!container) return;

  let categories = [];

  if (window.DbService) {
    try {
      const remote = await DbService.getCategories();
      if (remote && remote.length > 0) categories = remote;
    } catch(e) {}
  }

  if (categories.length === 0) {
    const saved = localStorage.getItem(STORAGE_KEY_CATEGORIES);
    if (saved) {
      try { categories = JSON.parse(saved); } catch(e) {}
    }
  }

  if (categories.length === 0 && typeof defaultCategories !== 'undefined') {
    categories = defaultCategories;
  }

  let html = `<button class="drawer-cat-item ${activeCategory === 'todos' ? 'active' : ''}" onclick="selectDrawerCategory('todos')" style="width: 100%; text-align: left; padding: 10px 14px; background: transparent; border: none; font-weight: 600; font-size: 0.88rem; color: #0F172A; cursor: pointer; border-radius: 6px;">TODOS OS PRODUTOS</button>`;

  categories.forEach(cat => {
    const isAct = (activeCategory === cat.name || activeCategory === cat.id);
    html += `
      <button class="drawer-cat-item ${isAct ? 'active' : ''}" onclick="selectDrawerCategory('${cat.name}')" style="width: 100%; text-align: left; padding: 10px 14px; background: transparent; border: none; font-weight: 600; font-size: 0.88rem; color: #0F172A; cursor: pointer; border-radius: 6px;">
        ${cat.name.toUpperCase()}
      </button>
    `;
  });

  container.innerHTML = html;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLojaEngine);
} else {
  initLojaEngine();
}

async function applyDynamicBranding() {
  let cfg = null;

  // 1. Tenta Supabase primeiro
  if (window.DbService) {
    try {
      cfg = await DbService.getBranding();
    } catch(e) {
      console.warn('[Branding] Erro ao ler do Supabase:', e);
    }
  }

  // 2. Fallback: localStorage
  if (!cfg) {
    const saved = localStorage.getItem(STORAGE_KEY_BRANDING);
    if (saved) {
      try { cfg = JSON.parse(saved); } catch(e) {}
    }
  }

  // 3. Fallback final: defaults neutros
  if (!cfg) cfg = defaultBranding;

  try {

    if (cfg.wppNumber) {
      WPP_NUMERO = cfg.wppNumber;
    } else {
      WPP_NUMERO = '';
    }

    const floatBtn = document.getElementById('wppFloatBtn') || document.querySelector('.ph-wpp-float');
    if (floatBtn) {
      if (!WPP_NUMERO || WPP_NUMERO.trim() === '') {
        floatBtn.style.display = 'none';
      } else {
        floatBtn.style.display = 'flex';
      }
    }
    if (cfg.frete) currentDeliveryFee = parseFloat(cfg.frete);

    if (cfg.primaryColor && cfg.primaryColor !== '#18181B') {
      document.documentElement.style.setProperty('--ph-red', cfg.primaryColor);
    }
    if (cfg.btnTextColor) {
      document.documentElement.style.setProperty('--ph-btn-text', cfg.btnTextColor);
    }
    if (cfg.accentColor) {
      document.documentElement.style.setProperty('--ph-accent', cfg.accentColor);
    }
    if (cfg.badgeBgColor) {
      document.documentElement.style.setProperty('--ph-badge-bg', cfg.badgeBgColor);
    }

    if (cfg.storeName) {
      const logoText = document.querySelector('.ph-logo-text');
      if (logoText) logoText.innerHTML = `${cfg.storeName}`;
      const footerStoreName = document.getElementById('footerStoreName');
      if (footerStoreName) footerStoreName.innerText = cfg.storeName;
    }
    if (cfg.storeSub) {
      const logoSub = document.querySelector('.ph-logo-sub');
      if (logoSub) logoSub.innerText = cfg.storeSub;
    }
    if (cfg.storeAddress) {
      const footerAddr = document.getElementById('footerStoreAddress');
      if (footerAddr) footerAddr.innerText = cfg.storeAddress;
    }
    if (cfg.storeHours) {
      const footerHours = document.getElementById('footerStoreHours');
      if (footerHours) footerHours.innerText = cfg.storeHours;
    }
    if (cfg.wppNumber) {
      const footerWpp = document.getElementById('footerStorePhone');
      if (footerWpp) footerWpp.innerText = cfg.wppNumber;
    }

    if (cfg.logoUrl) {
      const logoBadge = document.querySelector('.ph-logo-badge');
      if (logoBadge) logoBadge.innerHTML = `<img src="${cfg.logoUrl}" style="width:100%; height:100%; object-fit:contain; border-radius: 50%;">`;
    }

    const heroCard = document.querySelector('.ph-hero-card');
    if (heroCard) {
      const bannerUrl = (window.innerWidth <= 768 && cfg.bannerMobUrl) ? cfg.bannerMobUrl : (cfg.bannerDeskUrl || cfg.bannerMobUrl);
      if (bannerUrl) {
        heroCard.style.backgroundImage = `url('${bannerUrl}')`;
        heroCard.style.backgroundSize = 'cover';
        heroCard.style.backgroundPosition = 'center';
        heroCard.classList.add('has-custom-banner');
        heroCard.style.cursor = 'pointer';
        heroCard.onclick = () => handleBannerClick();
        heroCard.innerHTML = '';
      } else {
        heroCard.style.backgroundImage = 'none';
        heroCard.style.backgroundColor = 'transparent';
        heroCard.classList.remove('has-custom-banner');
        heroCard.onclick = null;
        heroCard.innerHTML = `
          <div style="width: 100%; min-height: 280px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 40px 20px; border: 1px dashed #E0E0E6; border-radius: 12px; background: #F8F8FA; box-shadow: inset 0 0 20px rgba(0,0,0,0.01);">
            <div style="width: 64px; height: 64px; border-radius: 12px; background: #EFEFEF; display: flex; align-items: center; justify-content: center; margin-bottom: 12px;">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#A0A0AB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>
            <div style="font-family: var(--font-display); font-weight: 700; font-size: 1.05rem; color: #3F3F46; margin-bottom: 4px;">Banner Principal da Loja</div>
            <div style="font-size: 0.82rem; color: #71717A; max-width: 440px; line-height: 1.4;">
              Envie as imagens de destaque para o seu cardápio através da aba <strong>"Identidade, Banners & WhatsApp"</strong> no Painel Admin.
            </div>
          </div>
        `;
      }
    }

    if (cfg.coverageCities) {
      const cities = cfg.coverageCities.split(',');
      if (cities[0]) {
        const c1 = document.getElementById('covCity1');
        if (c1) c1.innerText = cities[0].trim().toUpperCase();
      }
      if (cities[1]) {
        const c2 = document.getElementById('covCity2');
        if (c2) c2.innerText = cities[1].trim().toUpperCase();
      }
    }
  } catch (e) {
    console.error('Erro ao carregar branding:', e);
  }
}

async function loadCatalogData() {
  if (window.DbService) {
    try {
      const products = await DbService.getProducts();
      if (products && products.length > 0) {
        catalogData = products.map(p => ({
          id: p.id,
          nome: p.nome || 'Produto',
          categoria: p.categoria || 'outros',
          descricao: p.descricao || '',
          preco: p.preco || p.preco_grande || 0,
          preco_broto:   p.preco_broto   || 0,
          preco_media:   p.preco_media   || 0,
          preco_grande:  p.preco_grande  || p.preco || 0,
          preco_gigante: p.preco_gigante || 0,
          badge:   p.badge   || '',
          img_url: p.img_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
          ingredientes: p.descricao || '',
          adicionais: p.adicionais || []
        }));
        return;
      }
    } catch(e) {
      console.warn('[Loja] Erro ao carregar produtos do Supabase:', e);
    }
  }
  // Fallback: localStorage ou defaultProducts
  const savedProducts = localStorage.getItem(STORAGE_KEY_PRODUCTS);
  if (savedProducts) {
    try {
      const parsed = JSON.parse(savedProducts);
      if (parsed && Array.isArray(parsed) && parsed.length > 0) {
        catalogData = parsed.map(p => ({
          id: p.id,
          nome: p.nome || 'Produto',
          categoria: p.categoria || 'outros',
          descricao: p.descricao || '',
          preco: p.preco || p.preco_grande || 0,
          preco_broto:   p.preco_broto   || 0,
          preco_media:   p.preco_media   || 0,
          preco_grande:  p.preco_grande  || p.preco || 0,
          preco_gigante: p.preco_gigante || 0,
          badge:   p.badge   || '',
          img_url: p.img_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
          ingredientes: p.descricao || '',
          adicionais: p.adicionais || []
        }));
        return;
      }
    } catch(e) { console.warn('Erro ao ler produtos do localStorage:', e); }
  }
  catalogData = (typeof defaultProducts !== 'undefined' && Array.isArray(defaultProducts)) ? defaultProducts : [];
}

async function loadDeliveryZonesData() {
  if (window.DbService) {
    try {
      const zones = await DbService.getDeliveryZones();
      if (zones && zones.length > 0) { deliveryZones = zones; return; }
    } catch(e) {}
  }
  const savedZones = localStorage.getItem(STORAGE_KEY_DELIVERY_ZONES);
  if (savedZones) {
    try {
      const parsed = JSON.parse(savedZones);
      if (parsed.length > 0) deliveryZones = parsed;
    } catch(e) {}
  }
}

function scrollToCatalogSection() {
  const sec = document.getElementById('catalogSection');
  if (sec) sec.scrollIntoView({ behavior: 'smooth' });
}

function renderCatalog() {
  const container = document.getElementById('productGridContainer');
  const countEl = document.getElementById('itemCountDisplay');
  if (!container) return;

  let filtered = catalogData;

  if (activeCategory !== 'todos') {
    filtered = filtered.filter(p => {
      if (!p.categoria) return false;
      const catVal = String(p.categoria).toLowerCase().trim();
      const targetVal = String(activeCategory).toLowerCase().trim();
      return catVal === targetVal;
    });
  }

  if (currentSearchQuery) {
    const q = currentSearchQuery.toLowerCase();
    filtered = filtered.filter(p =>
      p.nome.toLowerCase().includes(q) ||
      (p.categoria && p.categoria.toLowerCase().includes(q))
    );
  }

  const countDisplay = document.getElementById('itemCountDisplay');
  if (countDisplay) {
    countDisplay.innerText = `${filtered.length} produto(s) encontrado(s)`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; margin: 20px 0;">
        <h3 style="font-size: 1.1rem; font-weight: 700; color: #0F172A; margin-bottom: 6px;">Nenhum produto nesta categoria</h3>
        <p style="font-size: 0.85rem; color: #64748B;">Cadastre produtos no painel admin ou selecione "Todos os Produtos".</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(product => {
    const priceDisplay = (product.preco_grande || product.preco_broto || product.preco_media || 0).toFixed(2).replace('.', ',');

    return `
      <div class="ph-card" onclick="openPizzaCustomizerModal('${product.id}')">
        <div class="ph-card-img-wrap">
          ${product.badge ? `<div class="ph-card-badge">${product.badge}</div>` : ''}
          <img src="${product.img_url}" alt="${product.nome}" loading="lazy">
        </div>
        <div class="ph-card-body">
          <h3 class="ph-card-title">${product.nome}</h3>
          <p class="ph-card-desc">${product.descricao || product.ingredientes || 'Delicioso item preparado na hora com ingredientes selecionados.'}</p>
          <div class="ph-card-footer">
            <div class="ph-price-wrap">
              <span class="ph-price-from">A partir de</span>
              <span class="ph-price-val">R$ ${priceDisplay}</span>
            </div>
            <button class="ph-btn-add" onclick="event.stopPropagation(); openPizzaCustomizerModal('${product.id}')">
              <span>ADICIONAR</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function filterCategory(catId, btnElement) {
  activeCategory = catId;
  document.querySelectorAll('.ph-cat-pill').forEach(btn => btn.classList.remove('active'));

  if (btnElement) {
    btnElement.classList.add('active');
  } else {
    const target = document.querySelector(`.ph-cat-pill[data-cat="${catId}"]`);
    if (target) target.classList.add('active');
  }

  const catTitleSpan = document.getElementById('catalogCategoryName');
  if (catTitleSpan) {
    if (catId === 'todos') {
      catTitleSpan.innerText = 'TODOS OS PRODUTOS';
    } else {
      const savedCats = localStorage.getItem(STORAGE_KEY_CATEGORIES);
      let catName = catId.toUpperCase();
      if (savedCats) {
        try {
          const parsed = JSON.parse(savedCats);
          const found = parsed.find(c => c.id === catId);
          if (found) catName = found.name.toUpperCase();
        } catch(e) {}
      }
      catTitleSpan.innerText = catName;
    }
  }

  renderCatalog();
}

function handleSearch(query) {
  currentSearchQuery = query;
  renderCatalog();
}

function populateFlavorRadioLists() {
  const container1 = document.getElementById('flavorRadioList1');
  const container2 = document.getElementById('flavorRadioList2');
  if (!container1) return;

  const flavors = catalogData.filter(p => p.categoria === 'pizzas-salgadas' || p.categoria === 'pizzas-doces' || p.categoria.includes('pizza'));

  if (flavors.length === 0) {
    container1.innerHTML = `<div style="font-size: 0.8rem; color: #888;">Nenhum outro sabor cadastrado.</div>`;
    if (container2) container2.innerHTML = `<div style="font-size: 0.8rem; color: #888;">Nenhum outro sabor cadastrado.</div>`;
    return;
  }

  const html1 = flavors.map((p, idx) => `
    <label class="flavor-radio-card">
      <input type="radio" name="flavorRadio1" value="${p.id}" ${idx === 0 ? 'checked' : ''} onchange="recalculateModalTotal()" style="accent-color: var(--ph-red);">
      <img src="${p.img_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=100&q=80'}" class="flavor-thumb" alt="${p.nome}">
      <div class="flavor-info">
        <div class="flavor-name">${p.nome}</div>
        <div class="flavor-desc">${p.descricao || p.ingredientes || ''}</div>
      </div>
    </label>
  `).join('');

  const html2 = flavors.map((p, idx) => `
    <label class="flavor-radio-card">
      <input type="radio" name="flavorRadio2" value="${p.id}" ${idx === 1 ? 'checked' : (idx === 0 ? 'checked' : '')} onchange="recalculateModalTotal()" style="accent-color: var(--ph-red);">
      <img src="${p.img_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=100&q=80'}" class="flavor-thumb" alt="${p.nome}">
      <div class="flavor-info">
        <div class="flavor-name">${p.nome}</div>
        <div class="flavor-desc">${p.descricao || p.ingredientes || ''}</div>
      </div>
    </label>
  `).join('');

  container1.innerHTML = html1;
  if (container2) container2.innerHTML = html2;
}

let modalQty = 1;

function openPizzaCustomizerModal(productId) {
  const product = catalogData.find(p => String(p.id) === String(productId));
  if (!product) return;

  currentSelectedProduct = product;
  modalQty = 1;

  const titleEl = document.getElementById('modalPizzaTitle');
  if (titleEl) titleEl.innerText = product.nome;

  const descEl = document.getElementById('modalPizzaDesc');
  if (descEl) descEl.innerText = product.descricao || product.ingredientes || '';

  const imgEl = document.getElementById('modalHeroBg');
  if (imgEl) imgEl.src = product.img_url;

  const obsInput = document.getElementById('modalObsInput');
  if (obsInput) obsInput.value = '';

  const qtyEl = document.getElementById('modalQtyDisplay');
  if (qtyEl) qtyEl.innerText = '1';

  const adicContainer = document.getElementById('modalAdicionaisContainer');
  const adicList = document.getElementById('modalAdicionaisList');
  if (adicContainer && adicList) {
    let adicionaisList = product.adicionais || [];
    if (typeof adicionaisList === 'string') {
      try { adicionaisList = JSON.parse(adicionaisList); } catch(e) { adicionaisList = []; }
    }

    if (Array.isArray(adicionaisList) && adicionaisList.length > 0) {
      adicContainer.style.display = 'block';
      adicList.innerHTML = adicionaisList.map((item, idx) => `
        <label style="display: flex; justify-content: space-between; align-items: center; cursor: pointer; font-size: 0.84rem; padding: 6px 0; border-bottom: 1px solid #F1F5F9;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <input type="checkbox" class="modal-adic-checkbox" value="${item.nome}" data-price="${item.preco}" onchange="recalculateModalTotal()" style="accent-color: #6344F5; width: 16px; height: 16px;">
            <span style="font-weight: 500; color: #0F172A;">${item.nome}</span>
          </div>
          <span style="font-weight: 700; color: #6344F5;">+ R$ ${(parseFloat(item.preco)||0).toFixed(2).replace('.', ',')}</span>
        </label>
      `).join('');
    } else {
      adicContainer.style.display = 'none';
      adicList.innerHTML = '';
    }
  }

  recalculateModalTotal();

  const modal = document.getElementById('pizzaModal');
  if (modal) {
    modal.style.display = 'flex';
    modal.classList.add('active');
  }
}

function changeModalQty(delta) {
  modalQty = Math.max(1, modalQty + delta);
  const qtyEl = document.getElementById('modalQtyDisplay');
  if (qtyEl) qtyEl.innerText = modalQty;
  recalculateModalTotal();
}

function recalculateModalTotal() {
  if (!currentSelectedProduct) return;
  const p1 = parseFloat(currentSelectedProduct.preco);
  const p2 = parseFloat(currentSelectedProduct.preco_grande);
  const basePrice = (!isNaN(p1) && p1 > 0) ? p1 : ((!isNaN(p2) && p2 > 0) ? p2 : 0);
  
  let adicTotal = 0;
  document.querySelectorAll('.modal-adic-checkbox:checked').forEach(cb => {
    adicTotal += parseFloat(cb.dataset.price) || 0;
  });

  const unitTotal = basePrice + adicTotal;
  const grandTotal = unitTotal * modalQty;

  const displayEl = document.getElementById('modalDynamicTotalPrice');
  if (displayEl) displayEl.innerText = `R$ ${grandTotal.toFixed(2).replace('.', ',')}`;
}

function addModalProductToCart() {
  if (!currentSelectedProduct) return;
  const p1 = parseFloat(currentSelectedProduct.preco);
  const p2 = parseFloat(currentSelectedProduct.preco_grande);
  const basePrice = (!isNaN(p1) && p1 > 0) ? p1 : ((!isNaN(p2) && p2 > 0) ? p2 : 0);
  const obs = document.getElementById('modalObsInput') ? document.getElementById('modalObsInput').value.trim() : '';

  const selectedAdicionais = [];
  let adicTotal = 0;
  document.querySelectorAll('.modal-adic-checkbox:checked').forEach(cb => {
    const p = parseFloat(cb.dataset.price) || 0;
    adicTotal += p;
    selectedAdicionais.push(`${cb.value} (+R$ ${p.toFixed(2).replace('.', ',')})`);
  });

  const finalUnitPrice = basePrice + adicTotal;

  let fullObs = obs;
  if (selectedAdicionais.length > 0) {
    const adicStr = 'Adicionais: ' + selectedAdicionais.join(', ');
    fullObs = fullObs ? `${fullObs} | ${adicStr}` : adicStr;
  }

  const cartItem = {
    cartId: 'item-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
    id: currentSelectedProduct.id,
    title: currentSelectedProduct.nome,
    price: finalUnitPrice,
    qty: modalQty,
    details: fullObs,
    img_url: currentSelectedProduct.img_url
  };

  cart.push(cartItem);
  closePizzaModal();
  updateCartBadge();
  if (typeof showToast === 'function') showToast(`"${currentSelectedProduct.nome}" adicionado ao carrinho!`, 'success');
  openCartModal();
}

function closePizzaModal() {
  const modal = document.getElementById('pizzaModal') || document.getElementById('pizzaCustomizerModal');
  if (modal) modal.classList.remove('active');
}

function closePizzaCustomizerModal() {
  closePizzaModal();
  currentSelectedProduct = null;
}

function selectPizzaSize(sizeName, btn) {
  selectedSize = sizeName;
  document.querySelectorAll('.size-option-card').forEach(b => b.classList.remove('selected'));
  if (btn) btn.classList.add('selected');
  const radio = btn ? btn.querySelector('input[type="radio"]') : null;
  if (radio) radio.checked = true;
  recalculateModalTotal();
}

function selectFlavorMode(mode) {
  setFlavorMode(mode);
}

function setFlavorMode(mode) {
  flavorMode = mode;
  const btn1 = document.getElementById('btnSingleFlavor') || document.getElementById('btnFlavor1');
  const btn2 = document.getElementById('btnHalfFlavor') || document.getElementById('btnFlavor2');
  const wrapper2 = document.getElementById('containerFlavor2');

  if (mode === 'single') {
    if (btn1) btn1.classList.add('active');
    if (btn2) btn2.classList.remove('active');
    if (wrapper2) wrapper2.style.display = 'none';
  } else {
    if (btn1) btn1.classList.remove('active');
    if (btn2) btn2.classList.add('active');
    if (wrapper2) wrapper2.style.display = 'block';
  }

  recalculateModalTotal();
}

function recalculateModalTotal() {
  if (!currentSelectedProduct) return;

  let basePrice = currentSelectedProduct.preco_grande || currentSelectedProduct.preco || 0;

  if (selectedSize === 'broto' && currentSelectedProduct.preco_broto) {
    basePrice = currentSelectedProduct.preco_broto;
  } else if (selectedSize === 'media' && currentSelectedProduct.preco_media) {
    basePrice = currentSelectedProduct.preco_media;
  } else if (selectedSize === 'gigante' && currentSelectedProduct.preco_gigante) {
    basePrice = currentSelectedProduct.preco_gigante;
  }

  if (flavorMode === 'half') {
    const s2Radio = document.querySelector('input[name="flavorRadio2"]:checked');
    const s2Id = s2Radio ? s2Radio.value : null;
    const p2 = catalogData.find(p => String(p.id) === String(s2Id));
    if (p2) {
      let p2Price = p2.preco_grande || p2.preco || 0;
      if (selectedSize === 'broto' && p2.preco_broto) p2Price = p2.preco_broto;
      if (selectedSize === 'media' && p2.preco_media) p2Price = p2.preco_media;
      if (selectedSize === 'gigante' && p2.preco_gigante) p2Price = p2.preco_gigante;

      basePrice = Math.max(basePrice, p2Price);
    }
  }

  const selectedBordaRadio = document.querySelector('input[name="bordaRadio"]:checked');
  const bordaPrice = selectedBordaRadio ? (parseFloat(selectedBordaRadio.dataset.price) || 0) : 0;

  const selectedExtraRadio = document.querySelector('input[name="extraRadio"]:checked');
  const extraPrice = selectedExtraRadio ? (parseFloat(selectedExtraRadio.dataset.price) || 0) : 0;

  const grandTotal = basePrice + bordaPrice + extraPrice;

  const totalEl = document.getElementById('modalCalculatedTotal');
  if (totalEl) totalEl.innerText = `R$ ${grandTotal.toFixed(2).replace('.', ',')}`;
}

function addCustomPizzaToCart() {
  if (!currentSelectedProduct) return;

  let title = currentSelectedProduct.nome;
  let detailsArr = [];

  if (flavorMode === 'half') {
    const s2Radio = document.querySelector('input[name="flavorRadio2"]:checked');
    const s2Id = s2Radio ? s2Radio.value : null;
    const p2 = catalogData.find(p => String(p.id) === String(s2Id));
    if (p2) {
      title = `Meio ${currentSelectedProduct.nome} + Meio ${p2.nome}`;
    }
  }

  detailsArr.push(`Tamanho: ${selectedSize.toUpperCase()}`);

  const selectedBordaRadio = document.querySelector('input[name="bordaRadio"]:checked');
  if (selectedBordaRadio && selectedBordaRadio.value !== 'sem') {
    const cardTitle = selectedBordaRadio.closest('.flavor-radio-card')?.querySelector('.flavor-radio-title')?.innerText || 'Borda Recheada';
    detailsArr.push(`Borda: ${cardTitle}`);
  }

  const selectedExtraRadio = document.querySelector('input[name="extraRadio"]:checked');
  if (selectedExtraRadio && selectedExtraRadio.value !== 'nenhum') {
    const extraTitle = selectedExtraRadio.closest('.flavor-radio-card')?.querySelector('.flavor-radio-title')?.innerText || 'Adicional Extra';
    detailsArr.push(`Extra: ${extraTitle}`);
  }

  const obs = document.getElementById('modalObs')?.value.trim();
  if (obs) detailsArr.push(`Obs: ${obs}`);

  const calculatedStr = document.getElementById('modalCalculatedTotal')?.innerText || '0';
  const finalPrice = parseFloat(calculatedStr.replace('R$', '').replace('.', '').replace(',', '.').trim()) || 0;

  const cartItem = {
    id: currentSelectedProduct.id + '-' + Date.now(),
    title: title,
    price: finalPrice,
    qty: 1,
    details: detailsArr.join(' | ')
  };

  cart.push(cartItem);
  updateCartBadge();
  closePizzaCustomizerModal();
  showToast(`"${title}" adicionado ao seu pedido!`, 'info');
}

function updateCartBadge() {
  const totalQty = cart.reduce((sum, item) => sum + (parseInt(item.qty) || 1), 0);
  const badge = document.getElementById('cartCountBadge');
  if (badge) badge.innerText = totalQty;
}

function openCartModal() {
  try {
    renderCartItems();
    recalculateCartTotal();
  } catch(e) {
    console.error('Erro ao preparar carrinho:', e);
  }
  const modal = document.getElementById('cartModal');
  if (modal) {
    modal.style.display = 'flex';
    modal.classList.add('active');
  }
}

function closeCartModal() {
  const modal = document.getElementById('cartModal');
  if (modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
  }
}

function renderCartItems() {
  const container = document.getElementById('cartItemsContainer');
  if (!container) return;

  if (!cart || cart.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 30px; color: #888;">
        Seu carrinho está vazio. Escolha um item no cardápio!
      </div>
    `;
    return;
  }

  container.innerHTML = cart.map((item, index) => {
    const itemTitle = item.title || item.nome || 'Produto';
    const itemPrice = parseFloat(item.price || item.preco || 0);
    const itemQty = parseInt(item.qty || item.quantidade || 1);
    const itemDetails = item.details || item.obs || '';
    const totalItemPrice = (itemPrice * itemQty).toFixed(2).replace('.', ',');

    return `
      <div style="background: #FAFAFC; padding: 12px; border-radius: 8px; margin-bottom: 10px; border: 1px solid #E2E8F0;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <strong style="font-size: 0.92rem; color: #0F172A;">${itemTitle}</strong>
            <div style="font-size: 0.76rem; color: #64748B; margin-top: 2px;">${itemDetails}</div>
          </div>
          <button onclick="removeCartItem(${index})" style="background: none; border: none; color: #EF4444; font-weight: 900; cursor: pointer;">✕</button>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
          <div style="display: flex; align-items: center; gap: 8px; background: #FFF; padding: 2px 8px; border-radius: 6px; border: 1px solid #E2E8F0;">
            <button onclick="updateItemQty(${index}, -1)" style="border: none; background: none; font-weight: 900; cursor: pointer; color: #0F172A;">-</button>
            <span style="font-weight: 800; font-size: 0.85rem; color: #0F172A;">${itemQty}</span>
            <button onclick="updateItemQty(${index}, 1)" style="border: none; background: none; font-weight: 900; cursor: pointer; color: #0F172A;">+</button>
          </div>
          <strong style="color: #0F172A; font-size: 0.95rem;">R$ ${totalItemPrice}</strong>
        </div>
      </div>
    `;
  }).join('');
}

function updateItemQty(index, delta) {
  if (!cart[index]) return;
  cart[index].qty += delta;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  updateCartBadge();
  renderCartItems();
  recalculateCartTotal();
}

function removeCartItem(index) {
  cart.splice(index, 1);
  updateCartBadge();
  renderCartItems();
  recalculateCartTotal();
}

let currentAppliedCoupon = null;

function aplicarCupomDesconto() {
  const input = document.getElementById('inputCouponCode');
  const feedback = document.getElementById('couponFeedbackBox');
  if (!input || !feedback) return;

  const code = input.value.trim().toUpperCase();
  if (!code) {
    feedback.style.display = 'block';
    feedback.style.color = '#D32F2F';
    feedback.innerText = 'Digite um código de cupom.';
    return;
  }

  const savedCoupons = localStorage.getItem(STORAGE_KEY_COUPONS);
  let coupons = [
    { id: 'c-1', code: 'PRIMEIRACOMPRA', type: 'percent', value: 10 },
    { id: 'c-2', code: 'FRETEGRATIS', type: 'fixed', value: 5.00 }
  ];

  if (savedCoupons) {
    try {
      const parsed = JSON.parse(savedCoupons);
      if (parsed.length > 0) coupons = parsed;
    } catch(e) {}
  }

  const found = coupons.find(c => c.code.toUpperCase() === code);
  if (!found) {
    feedback.style.display = 'block';
    feedback.style.color = '#D32F2F';
    feedback.innerText = `Cupom "${code}" inválido ou expirado.`;
    currentAppliedCoupon = null;
    recalculateCartTotal();
    return;
  }

  currentAppliedCoupon = found;
  feedback.style.display = 'block';
  feedback.style.color = '#2E7D32';
  const descTxt = found.type === 'percent' ? `${found.value}% de desconto` : `R$ ${found.value.toFixed(2).replace('.', ',')} de desconto`;
  feedback.innerText = `Cupom "${found.code}" aplicado com sucesso! (${descTxt})`;
  recalculateCartTotal();
}

function recalculateCartTotal() {
  const subtotal = cart.reduce((sum, item) => {
    const p = parseFloat(item.price || item.preco || 0);
    const q = parseInt(item.qty || item.quantidade || 1);
    return sum + (p * q);
  }, 0);
  let discount = 0;

  if (currentAppliedCoupon) {
    if (currentAppliedCoupon.type === 'percent') {
      discount = subtotal * (currentAppliedCoupon.value / 100);
    } else {
      discount = currentAppliedCoupon.value;
    }
  }

  const deliveryTypeRadio = document.querySelector('input[name="deliveryType"]:checked');
  const isBalcao = deliveryTypeRadio ? (deliveryTypeRadio.value === 'balcao') : false;

  if (isBalcao) {
    currentDeliveryFee = 0.00;
  }

  const total = Math.max(0, subtotal + currentDeliveryFee - discount);

  const subEl = document.getElementById('txtSubtotalFrete');
  const totEl = document.getElementById('txtTotalCartFinal');
  const btnFinalizar = document.getElementById('btnFinalizarPedidoCart') || document.querySelector('.checkout-submit-btn');

  let freteTxt = isBalcao ? 'Retirada no Balcão (Grátis)' : `Frete: R$ ${currentDeliveryFee.toFixed(2).replace('.', ',')}`;
  let detailsText = `Subtotal: R$ ${subtotal.toFixed(2).replace('.', ',')} | ${freteTxt}`;
  
  if (discount > 0 && currentAppliedCoupon) {
    detailsText += ` | Cupom (${currentAppliedCoupon.code}): -R$ ${discount.toFixed(2).replace('.', ',')}`;
  }

  if (subEl) subEl.innerText = detailsText;
  if (totEl) totEl.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;

  if (btnFinalizar) {
    if (cart.length === 0) {
      btnFinalizar.disabled = true;
      btnFinalizar.style.opacity = '0.5';
      btnFinalizar.style.cursor = 'not-allowed';
    } else {
      btnFinalizar.disabled = false;
      btnFinalizar.style.opacity = '1';
      btnFinalizar.style.cursor = 'pointer';
    }
  }
}

function toggleDeliveryTypeUI(type) {
  const addressBox = document.getElementById('deliveryAddressBox');
  if (type === 'balcao') {
    currentDeliveryFee = 0.00;
    if (addressBox) addressBox.style.display = 'none';
  } else {
    currentDeliveryFee = 5.00;
    if (addressBox) addressBox.style.display = 'block';
  }
  recalculateCartTotal();
}

function toggleSemNumero(chk) {
  const numInput = document.getElementById('inputNumero');
  if (!numInput) return;
  if (chk.checked) {
    numInput.value = 'S/N';
    numInput.disabled = true;
  } else {
    numInput.value = '';
    numInput.disabled = false;
  }
}

function buscarCepViaAPI() {
  const cepInput = document.getElementById('inputCep').value.replace(/\D/g, '');
  if (cepInput.length !== 8) {
    showToast('Por favor, informe um CEP válido com 8 dígitos.', 'error');
    return;
  }

  fetch(`https://viacep.com.br/ws/${cepInput}/json/`)
    .then(res => res.json())
    .then(data => {
      if (data.erro) {
        showToast('CEP não encontrado. Digite o endereço manualmente.', 'error');
        return;
      }
      const box = document.getElementById('addressResultBox');
      document.getElementById('txtRuaBairro').innerText = `${data.logradouro}, ${data.bairro} - ${data.localidade}/${data.uf}`;
      box.style.display = 'block';

      // BUSCA AUTOMÁTICA DA TAXA DE ENTREGA DA REGIÃO/BAIRRO
      const userBairro = (data.bairro || '').toLowerCase().trim();
      const savedDelivery = localStorage.getItem('ptd_store_delivery_zones');
      let zones = deliveryZones;
      if (savedDelivery) {
        try {
          const parsed = JSON.parse(savedDelivery);
          if (parsed.length > 0) zones = parsed;
        } catch(e) {}
      }

      const matchedZone = zones.find(z => z.name.toLowerCase().includes(userBairro) || userBairro.includes(z.name.toLowerCase()));

      if (matchedZone) {
        currentDeliveryFee = matchedZone.price;
        currentSelectedZoneName = matchedZone.name;
      } else if (zones.length > 0) {
        currentDeliveryFee = zones[0].price;
        currentSelectedZoneName = zones[0].name;
      } else {
        currentDeliveryFee = 5.00;
        currentSelectedZoneName = 'Taxa Padrão';
      }

      document.getElementById('txtFreteVal').innerText = `Taxa de Entrega (${currentSelectedZoneName}): R$ ${currentDeliveryFee.toFixed(2).replace('.', ',')}`;
      recalculateCartTotal();
    })
    .catch(() => {
      showToast('Erro ao consultar o CEP. Verifique sua conexão.', 'error');
    });
}

function switchCheckoutTab(tabName) {
  document.querySelectorAll('.mp-tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('contentCheckoutPix').style.display = 'none';
  document.getElementById('contentCheckoutCard').style.display = 'none';
  document.getElementById('contentCheckoutWpp').style.display = 'none';

  if (tabName === 'pix') {
    document.getElementById('tabMpPix').classList.add('active');
    document.getElementById('contentCheckoutPix').style.display = 'block';
  } else if (tabName === 'card') {
    document.getElementById('tabMpCard').classList.add('active');
    document.getElementById('contentCheckoutCard').style.display = 'block';
  } else if (tabName === 'wpp') {
    document.getElementById('tabWpp').classList.add('active');
    document.getElementById('contentCheckoutWpp').style.display = 'block';
  }
}

function copiarPixChave() {
  const code = document.getElementById('pixCodeText').innerText;
  navigator.clipboard.writeText(code).then(() => {
    showToast('Chave PIX copiada para a área de transferência!', 'success');
  });
}

function simularPagamentoMercadoPagoCard() {
  if (cart.length === 0) {
    showToast('Seu carrinho está vazio!', 'error');
    return;
  }
  showOrderConfirmationOnScreen('Pagamento com Cartão de Crédito');
}

function showOrderConfirmationOnScreen(paymentMethodLabel) {
  const orderNum = '#PED-' + Math.floor(1000 + Math.random() * 9000);
  document.getElementById('confirmedOrderNum').innerText = orderNum;

  const isSemNumero = document.getElementById('chkSemNumero')?.checked;
  const numStr = isSemNumero ? 'S/N' : (document.getElementById('inputNumero')?.value.trim() || 'S/N');
  const compStr = document.getElementById('inputComplemento')?.value.trim() || '';
  const enderecoInfo = document.getElementById('txtRuaBairro')?.innerText || 'Retirada no Balcão';

  let html = `<div style="margin-bottom: 8px;"><strong>Forma de Pagamento:</strong> ${paymentMethodLabel}</div>`;
  html += `<div style="margin-bottom: 8px;"><strong>Forma de Entrega:</strong> ${currentSelectedZoneName} (R$ ${currentDeliveryFee.toFixed(2).replace('.', ',')})</div>`;
  html += `<div style="margin-bottom: 8px;"><strong>Endereço:</strong> ${enderecoInfo}, Nº ${numStr}${compStr ? ' (' + compStr + ')' : ''}</div>`;
  html += `<div style="margin-bottom: 8px; border-top: 1px solid #DDD; padding-top: 6px;"><strong>Itens:</strong></div>`;

  cart.forEach(item => {
    html += `<div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
      <span>${item.qty}x ${item.title}</span>
      <span>R$ ${(item.price * item.qty).toFixed(2).replace('.', ',')}</span>
    </div>`;
  });

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const total = subtotal + currentDeliveryFee;

  html += `<div style="border-top: 1px solid #DDD; margin-top: 8px; padding-top: 6px; display: flex; justify-content: space-between; font-weight: 800;">
    <span>Total Pago:</span>
    <span style="color: var(--ph-red);">R$ ${total.toFixed(2).replace('.', ',')}</span>
  </div>`;

  document.getElementById('confirmedReceiptBody').innerHTML = html;

  cart = [];
  updateCartBadge();
  closeCartModal();

  document.getElementById('orderConfirmedModal').classList.add('active');
}

function closeOrderConfirmedModal() {
  document.getElementById('orderConfirmedModal').classList.remove('active');
}

function enviarPedidoWhatsAppFinal() {
  if (cart.length === 0) {
    showToast('Seu carrinho está vazio!', 'error');
    return;
  }

  const savedBranding = localStorage.getItem(STORAGE_KEY_BRANDING);
  let storeName = "CARDÁPIO DIGITAL";
  let targetWpp = WPP_NUMERO;

  if (savedBranding) {
    try {
      const cfg = JSON.parse(savedBranding);
      if (cfg.storeName) storeName = cfg.storeName.toUpperCase();
      if (cfg.wppNumber) targetWpp = cfg.wppNumber;
    } catch(e) {}
  }

  if (!targetWpp || targetWpp === 'Não cadastrado' || targetWpp.trim() === '') {
    showToast('O WhatsApp do estabelecimento não está configurado. Configure no painel admin para receber pedidos.', 'error');
    return;
  }

  const isSemNumero = document.getElementById('chkSemNumero')?.checked;
  const numStr = isSemNumero ? 'S/N' : (document.getElementById('inputNumero')?.value.trim() || 'S/N');
  const compStr = document.getElementById('inputComplemento')?.value.trim() || '';
  const enderecoInfo = document.getElementById('txtRuaBairro')?.innerText || 'Retirada no Balcão';
  const enderecoCompleto = `${enderecoInfo}, Nº ${numStr}${compStr ? ' (' + compStr + ')' : ''}`;

  const orderNum = Math.floor(1000 + Math.random() * 9000);
  const now = new Date();
  const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  let discount = 0;
  if (currentAppliedCoupon) {
    if (currentAppliedCoupon.type === 'percent') {
      discount = subtotal * (currentAppliedCoupon.value / 100);
    } else {
      discount = currentAppliedCoupon.value;
    }
  }

  const total = Math.max(0, subtotal + currentDeliveryFee - discount);
  const freteStr = currentDeliveryFee > 0 ? `R$ ${currentDeliveryFee.toFixed(2).replace('.', ',')}` : 'Grátis / Retirada no Balcão';

  let msg = `⭐ NOVO PEDIDO ⭐\n`;
  msg += `Olá! Quero finalizar meu pedido.\n`;
  msg += `---------------------------------------\n`;
  msg += `Confira o pedido abaixo:\n`;
  msg += `Pedido #${orderNum} - ${storeName}\n`;
  msg += `---------------------------------------\n\n`;

  cart.forEach(item => {
    msg += `${item.qty}x ${item.title}\n`;
    if (item.details) msg += `   Obs: ${item.details}\n`;
    msg += `\n`;
  });

  msg += `Subtotal: R$ ${subtotal.toFixed(2).replace('.', ',')}\n`;
  if (currentAppliedCoupon && discount > 0) {
    msg += `Cupom (${currentAppliedCoupon.code}): -R$ ${discount.toFixed(2).replace('.', ',')}\n`;
  }
  msg += `Taxa de entrega: ${freteStr}\n`;
  msg += `Total: R$ ${total.toFixed(2).replace('.', ',')}\n\n`;
  msg += `---------------------------------------\n\n`;
  msg += `Forma de Entrega: ${currentSelectedZoneName}\n`;
  msg += `Endereço: ${enderecoCompleto}\n\n`;
  msg += `Pagamento: WhatsApp / A Combinar\n\n`;
  msg += `Pedido gerado via Cardápio Digital às ${timeStr}`;

  const encodedMsg = encodeURIComponent(msg);
  window.open(`https://wa.me/${targetWpp}?text=${encodedMsg}`, '_blank');

  showOrderConfirmationOnScreen('Enviado via WhatsApp');
}

// Bind de funções globais para os botões do HTML
window.openCartModal = openCartModal;
window.closeCartModal = closeCartModal;
window.openPizzaCustomizerModal = openPizzaCustomizerModal;

document.addEventListener('click', (e) => {
  const btn = e.target.closest('.ph-cart-btn, .ph-cart-btn *, [data-action="cart"]');
  if (btn) {
    if (typeof openCartModal === 'function') {
      openCartModal();
    }
  }
});
window.closePizzaModal = closePizzaModal;
window.changeModalQty = changeModalQty;
window.addModalProductToCart = addModalProductToCart;