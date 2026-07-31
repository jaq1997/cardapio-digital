/* ==========================================================================
   LOJA ENGINE — VERSÃO OTIMIZADA E COMPLETA (WHITE-LABEL NEUTRO)
   ========================================================================== */

let WPP_NUMERO = '';
let catalogData = [];
let categories = [];
let deliveryZones = defaultDeliveryZones;
let cart = [];
let activeCategory = 'todos';
let currentSearchQuery = '';
let modalQty = 1;
let currentSelectedProduct = null;
let currentDeliveryFee = 5.00;
let currentSelectedZoneName = "Entrega em Domicílio";

async function initLojaEngine() {
  await applyDynamicBranding();
  await loadCatalogData();
  await loadDeliveryZonesData();
  await loadAndRenderDrawerCategories();
  renderCatalog();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLojaEngine);
} else {
  initLojaEngine();
}

/* -------------------------------------------------------------------------
   1. BRANDING DINÂMICO
------------------------------------------------------------------------- */
async function applyDynamicBranding() {
  try {
    let cfg = null;
    if (window.DbService) {
      cfg = await DbService.getBranding();
    }
    if (!cfg) {
      const saved = localStorage.getItem(STORAGE_KEY_BRANDING);
      if (saved) { try { cfg = JSON.parse(saved); } catch(e) {} }
    }
    if (!cfg && typeof defaultBranding !== 'undefined') {
      cfg = defaultBranding;
    }

    if (cfg) {
      if (cfg.wppNumber) {
        WPP_NUMERO = String(cfg.wppNumber).replace(/\D/g, '');
      }
      if (cfg.primaryColor) {
        document.documentElement.style.setProperty('--ph-red', cfg.primaryColor);
      }

      // Renderização do Banner Principal (Hero Card)
      const heroCard = document.querySelector('.ph-hero-card');
      if (heroCard) {
        const isMobile = window.innerWidth <= 768;
        const bannerUrl = isMobile ? (cfg.bannerMobUrl || cfg.bannerDeskUrl) : (cfg.bannerDeskUrl || cfg.bannerMobUrl);

        if (bannerUrl) {
          heroCard.classList.add('has-custom-banner');
          heroCard.style.backgroundImage = `url('${bannerUrl}')`;
          heroCard.style.backgroundSize = 'cover';
          heroCard.style.backgroundPosition = 'center';
          heroCard.style.minHeight = '220px';
          heroCard.innerHTML = '';
        } else {
          heroCard.classList.remove('has-custom-banner');
          heroCard.style.backgroundImage = 'none';
          heroCard.style.backgroundColor = 'transparent';
          heroCard.innerHTML = `
            <div style="width: 100%; min-height: 220px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 32px 20px; border: 1px dashed #CBD5E1; border-radius: 16px; background: #F8FAFC;">
              <div style="width: 52px; height: 52px; border-radius: 12px; background: #F1F5F9; display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
              <div style="font-family: var(--font-display); font-weight: 700; font-size: 1rem; color: #0F172A; margin-bottom: 4px;">Banner Principal da Loja</div>
              <div style="font-size: 0.82rem; color: #64748B; max-width: 440px; line-height: 1.4;">
                Envie as imagens promocionais da sua loja através da aba <strong>"Identidade Visual & Banners"</strong> no Painel Admin.
              </div>
            </div>
          `;
        }
      }
    }
  } catch (e) {
    console.warn('[Loja] Erro ao carregar branding:', e);
  }
}

/* -------------------------------------------------------------------------
   2. CARREGAMENTO DO CARDÁPIO E CATEGORIAS
------------------------------------------------------------------------- */
async function loadCatalogData() {
  if (window.DbService) {
    try {
      const products = await DbService.getProducts();
      if (products && products.length > 0) {
        catalogData = products.map(p => ({
          ...p,
          preco: parseFloat(p.preco || p.preco_grande || 0) || 0,
          adicionais: Array.isArray(p.adicionais) ? p.adicionais : []
        }));
        return;
      }
    } catch(e) { console.warn('[Loja] Erro ao carregar produtos do Supabase:', e); }
  }

  const savedProducts = localStorage.getItem(STORAGE_KEY_PRODUCTS);
  if (savedProducts) {
    try {
      const parsed = JSON.parse(savedProducts);
      if (parsed && Array.isArray(parsed) && parsed.length > 0) {
        catalogData = parsed.map(p => ({
          ...p,
          preco: parseFloat(p.preco || p.preco_grande || 0) || 0,
          adicionais: Array.isArray(p.adicionais) ? p.adicionais : []
        }));
        return;
      }
    } catch(e) {}
  }

  catalogData = typeof defaultProducts !== 'undefined' ? defaultProducts : [];
}

async function loadAndRenderDrawerCategories() {
  const container = document.getElementById('drawerCategoryListContainer') || document.getElementById('drawerCategoriesList');
  if (!container) return;

  categories = [];
  if (window.DbService) {
    try {
      const remote = await DbService.getCategories();
      if (remote) categories = remote;
    } catch(e) {}
  }

  if (categories.length === 0) {
    const saved = localStorage.getItem(STORAGE_KEY_CATEGORIES);
    if (saved) { try { categories = JSON.parse(saved); } catch(e) {} }
  }

  let html = `<div style="font-size: 0.75rem; font-weight: 700; color: #64748B; margin-bottom: 8px; text-transform: uppercase;">CARDÁPIO PRINCIPAL</div>`;
  html += `<button class="drawer-cat-item ${activeCategory === 'todos' ? 'active' : ''}" onclick="selectDrawerCategory('todos')" style="width: 100%; text-align: left; padding: 12px 16px; background: transparent; border: none; font-weight: 600; font-size: 0.9rem; color: #0F172A; cursor: pointer; border-radius: 8px;">TODOS OS PRODUTOS</button>`;

  if (categories && categories.length > 0) {
    const activeCats = categories.filter(c => c.active !== false);
    activeCats.forEach(cat => {
      const isAct = (activeCategory === cat.name || activeCategory === cat.id);
      html += `
        <button class="drawer-cat-item ${isAct ? 'active' : ''}" onclick="selectDrawerCategory('${cat.name}')" style="width: 100%; text-align: left; padding: 12px 16px; background: transparent; border: none; font-weight: 600; font-size: 0.9rem; color: #0F172A; cursor: pointer; border-radius: 8px;">
          ${cat.name.toUpperCase()}
        </button>
      `;
    });
  }

  container.innerHTML = html;
}

function selectDrawerCategory(catId) {
  activeCategory = catId;
  const catTitleSpan = document.getElementById('catalogCategoryName');
  if (catTitleSpan) {
    catTitleSpan.innerText = (catId === 'todos') ? 'TODOS OS PRODUTOS' : catId.toUpperCase();
  }
  renderCatalog();
  loadAndRenderDrawerCategories();
  toggleMobileDrawer(false);
}

function toggleMobileDrawer(open) {
  const overlay = document.getElementById('drawerOverlay');
  const card = document.getElementById('drawerCard');
  const legacyDrawer = document.getElementById('mobileDrawer');

  if (open === undefined) {
    if (overlay) open = !overlay.classList.contains('active');
  }

  if (overlay) {
    if (open) overlay.classList.add('active');
    else overlay.classList.remove('active');
  }
  if (card) {
    if (open) card.classList.add('active');
    else card.classList.remove('active');
  }
  if (legacyDrawer) {
    if (open) legacyDrawer.classList.add('active');
    else legacyDrawer.classList.remove('active');
  }
}

/* -------------------------------------------------------------------------
   3. RENDERIZAÇÃO DO CATALOGO (VITRINE)
------------------------------------------------------------------------- */
function renderCatalog() {
  const container = document.getElementById('productGridContainer');
  if (!container) return;

  // Oculta produtos de categorias marcadas como inativas no Admin
  const inactiveCatNames = (categories || [])
    .filter(c => c.active === false)
    .map(c => String(c.name).toLowerCase().trim());

  let filtered = catalogData.filter(p => {
    if (p.categoria) {
      const prodCatName = String(p.categoria).toLowerCase().trim();
      if (inactiveCatNames.includes(prodCatName)) return false;
    }
    return true;
  });

  if (activeCategory !== 'todos') {
    const target = String(activeCategory).toLowerCase().trim();
    filtered = filtered.filter(p => {
      if (!p.categoria) return false;
      const catVal = String(p.categoria).toLowerCase().trim();
      return catVal === target;
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
        <h3 style="font-size: 1.1rem; font-weight: 700; color: #0F172A; margin-bottom: 6px;">Nenhum produto encontrado</h3>
        <p style="font-size: 0.85rem; color: #64748B;">Selecione outra categoria no menu ou cadastre produtos no painel admin.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(product => {
    const val = parseFloat(product.preco) || 0;
    return `
      <div class="ph-card" onclick="openProductModal('${product.id}')">
        <div class="ph-card-img-wrap">
          ${product.badge ? `<div class="ph-card-badge">${product.badge}</div>` : ''}
          <img src="${product.img_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'}" alt="${product.nome}" loading="lazy">
        </div>
        <div class="ph-card-body">
          <h3 class="ph-card-title">${product.nome}</h3>
          <p class="ph-card-desc">${product.descricao || ''}</p>
          <div class="ph-card-footer">
            <div class="ph-price-wrap">
              <span class="ph-price-val">R$ ${val.toFixed(2).replace('.', ',')}</span>
            </div>
            <button class="ph-btn-add" onclick="event.stopPropagation(); openProductModal('${product.id}')">
              <span>ADICIONAR</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/* -------------------------------------------------------------------------
   4. MODAL CUSTOMIZADOR DE PRODUTO
------------------------------------------------------------------------- */
function openProductModal(productId) {
  const product = catalogData.find(p => String(p.id) === String(productId));
  if (!product) return;
  currentSelectedProduct = product;
  modalQty = 1;

  const titleEl = document.getElementById('modalProductTitle') || document.getElementById('modalPizzaTitle');
  if (titleEl) titleEl.innerText = product.nome;

  const descEl = document.getElementById('modalProductDesc') || document.getElementById('modalPizzaDesc');
  if (descEl) descEl.innerText = product.descricao || '';

  const imgEl = document.getElementById('modalHeroBg');
  if (imgEl) imgEl.src = product.img_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';

  const qtyEl = document.getElementById('modalQtyDisplay');
  if (qtyEl) qtyEl.innerText = '1';

  const obsInput = document.getElementById('modalObsInput');
  if (obsInput) obsInput.value = '';

  const adicList = document.getElementById('modalAdicionaisList');
  const adicContainer = document.getElementById('modalAdicionaisContainer');
  
  let adicionaisList = product.adicionais || product.opcionais || [];
  if (typeof adicionaisList === 'string') {
    try { adicionaisList = JSON.parse(adicionaisList); } catch(e) { adicionaisList = []; }
  }

  if (Array.isArray(adicionaisList) && adicionaisList.length > 0) {
    if (adicContainer) adicContainer.style.display = 'block';
    if (adicList) {
      adicList.innerHTML = adicionaisList.map(item => `
        <label style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid #F1F5F9; font-size:0.86rem; cursor:pointer;">
          <div style="display:flex; align-items:center; gap:8px;">
            <input type="checkbox" class="modal-adic-checkbox" data-price="${item.preco || 0}" value="${item.nome}" onchange="recalculateModalTotal()" style="width:16px; height:16px; accent-color:#18181B;">
            <span style="font-weight:500; color:#0F172A;">${item.nome}</span>
          </div>
          <span style="font-weight:700; color:#18181B;">+ R$ ${parseFloat(item.preco || 0).toFixed(2).replace('.', ',')}</span>
        </label>
      `).join('');
    }
  } else {
    if (adicContainer) adicContainer.style.display = 'none';
  }

  recalculateModalTotal();

  const modal = document.getElementById('productModal') || document.getElementById('pizzaModal');
  if (modal) modal.classList.add('active');
}

function recalculateModalTotal() {
  if (!currentSelectedProduct) return;
  const basePrice = parseFloat(currentSelectedProduct.preco) || 0;
  
  let adicTotal = 0;
  document.querySelectorAll('.modal-adic-checkbox:checked').forEach(cb => {
    adicTotal += parseFloat(cb.dataset.price) || 0;
  });

  const unitTotal = basePrice + adicTotal;
  const grandTotal = unitTotal * modalQty;

  const displayEl = document.getElementById('modalDynamicTotalPrice');
  if (displayEl) displayEl.innerText = `R$ ${grandTotal.toFixed(2).replace('.', ',')}`;
}

function changeModalQty(delta) {
  modalQty = Math.max(1, modalQty + delta);
  const qtyEl = document.getElementById('modalQtyDisplay');
  if (qtyEl) qtyEl.innerText = modalQty;
  recalculateModalTotal();
}

function addModalProductToCart() {
  if (!currentSelectedProduct) return;

  const selectedAdicionais = Array.from(document.querySelectorAll('.modal-adic-checkbox:checked')).map(c => ({
    nome: c.value,
    preco: parseFloat(c.dataset.price) || 0
  }));

  const obs = (document.getElementById('modalObsInput').value || '').trim();
  const basePrice = parseFloat(currentSelectedProduct.preco) || 0;

  cart.push({
    cartId: 'item-' + Date.now(),
    id: currentSelectedProduct.id,
    title: currentSelectedProduct.nome,
    price: basePrice,
    qty: modalQty,
    adicionais: selectedAdicionais,
    obs: obs
  });

  updateCartBadge();
  closeProductModal();
  showToast('Item adicionado ao seu pedido!', 'success');
  openCartModal();
}

function closeProductModal() {
  const modal = document.getElementById('productModal') || document.getElementById('pizzaModal');
  if (modal) modal.classList.remove('active');
}

/* -------------------------------------------------------------------------
   5. GESTÃO DO CARRINHO (SEU PEDIDO) E CHECKOUT
------------------------------------------------------------------------- */
function updateCartBadge() {
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);

  const b1 = document.getElementById('cartCountBadge');
  if (b1) b1.innerText = totalQty;

  const b2 = document.getElementById('cartBadgeCount');
  if (b2) b2.innerText = totalQty;

  document.querySelectorAll('.ph-cart-badge, .cart-badge-count').forEach(el => {
    el.innerText = totalQty;
  });
}

function openCartModal() {
  renderCartItems();
  renderDeliveryOptionsInCart();
  const modal = document.getElementById('cartModal');
  if (modal) modal.classList.add('active');
}

function renderDeliveryOptionsInCart() {
  const container = document.getElementById('deliveryOptionsContainer');
  if (!container) return;

  const zonesToRender = (deliveryZones && deliveryZones.length > 0) ? deliveryZones : [
    { id: 'def-1', name: 'Entrega em Domicílio', price: 5.00 },
    { id: 'def-2', name: 'Retirada no Balcão (Grátis)', price: 0.00 }
  ];

  container.innerHTML = zonesToRender.map((zone, idx) => {
    const isChecked = (idx === 0);
    const priceVal = parseFloat(zone.price || 0);
    const priceTxt = (priceVal === 0) ? 'Grátis' : `R$ ${priceVal.toFixed(2).replace('.', ',')}`;

    return `
      <label style="background: #FFF; border: 2px solid #E2E8F0; padding: 10px 14px; border-radius: 8px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; font-size: 0.85rem; font-weight: 700;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <input type="radio" name="deliveryZoneRadio" value="${zone.id}" ${isChecked ? 'checked' : ''} onchange="selectDeliveryZone('${zone.id}')" style="accent-color: #18181B; width: 16px; height: 16px;">
          <span style="color: #0F172A;">${zone.name}</span>
        </div>
        <span style="color: #18181B; font-weight: 800;">${priceTxt}</span>
      </label>
    `;
  }).join('');

  if (zonesToRender.length > 0) {
    selectDeliveryZone(zonesToRender[0].id);
  }
}

function selectDeliveryZone(zoneId) {
  const zone = (deliveryZones || []).find(z => String(z.id) === String(zoneId));
  const addressBox = document.getElementById('deliveryAddressBox');

  if (zone) {
    currentSelectedZoneName = zone.name;
    currentDeliveryFee = parseFloat(zone.price || 0);
    
    const isBalcao = zone.name.toLowerCase().includes('retirada') || zone.name.toLowerCase().includes('balcão');
    if (addressBox) {
      addressBox.style.display = isBalcao ? 'none' : 'block';
    }
  }
  updateCartTotals();
}

function closeCartModal() {
  const modal = document.getElementById('cartModal');
  if (modal) modal.classList.remove('active');
}

function renderCartItems() {
  const container = document.getElementById('cartItemsContainer');
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; color: #64748B;">
        <p style="font-weight: 600; font-size: 1rem;">Seu pedido está vazio</p>
        <p style="font-size: 0.85rem; margin-top: 4px;">Adicione delícias do cardápio para continuar!</p>
      </div>
    `;
    updateCartTotals();
    return;
  }

  container.innerHTML = cart.map(item => {
    const adicTotal = (item.adicionais || []).reduce((s, a) => s + (a.preco || 0), 0);
    const itemUnit = item.price + adicTotal;
    const itemTotal = itemUnit * item.qty;
    const adicText = (item.adicionais && item.adicionais.length > 0)
      ? item.adicionais.map(a => a.nome).join(', ')
      : '';

    return `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; padding: 12px 0; border-bottom: 1px solid #E2E8F0;">
        <div style="flex: 1;">
          <h4 style="font-size: 0.95rem; font-weight: 700; color: #0F172A; margin: 0;">${item.title}</h4>
          ${adicText ? `<div style="font-size: 0.78rem; color: #6344F5; margin-top: 2px;">+ ${adicText}</div>` : ''}
          ${item.obs ? `<div style="font-size: 0.78rem; color: #64748B; font-style: italic; margin-top: 2px;">Obs: "${item.obs}"</div>` : ''}
          <div style="font-size: 0.85rem; font-weight: 700; color: #0F172A; margin-top: 4px;">R$ ${itemTotal.toFixed(2).replace('.', ',')}</div>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; margin-left: 12px;">
          <button onclick="changeCartItemQty('${item.cartId}', -1)" style="width: 28px; height: 28px; border: 1px solid #CBD5E1; border-radius: 4px; background: #F8FAFC; font-weight: bold; cursor: pointer;">-</button>
          <span style="font-weight: 700; font-size: 0.9rem;">${item.qty}</span>
          <button onclick="changeCartItemQty('${item.cartId}', 1)" style="width: 28px; height: 28px; border: 1px solid #CBD5E1; border-radius: 4px; background: #F8FAFC; font-weight: bold; cursor: pointer;">+</button>
        </div>
      </div>
    `;
  }).join('');

  updateCartTotals();
}

function changeCartItemQty(cartId, delta) {
  const item = cart.find(i => i.cartId === cartId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.cartId !== cartId);
  }
  updateCartBadge();
  renderCartItems();
}

function updateCartTotals() {
  const subtotal = cart.reduce((sum, item) => {
    const adicTotal = (item.adicionais || []).reduce((s, a) => s + (a.preco || 0), 0);
    return sum + ((item.price + adicTotal) * item.qty);
  }, 0);

  const fee = (currentSelectedZoneName === "Retirada no Balcão") ? 0 : currentDeliveryFee;
  const total = subtotal + fee;

  const txtSubFee = document.getElementById('txtSubtotalFrete');
  if (txtSubFee) {
    txtSubFee.innerText = `Subtotal: R$ ${subtotal.toFixed(2).replace('.', ',')} | Frete: R$ ${fee.toFixed(2).replace('.', ',')}`;
  }

  const txtTotFinal = document.getElementById('txtTotalCartFinal');
  if (txtTotFinal) {
    txtTotFinal.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
  }

  const subEl = document.getElementById('cartSubtotalDisplay');
  if (subEl) subEl.innerText = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;

  const feeEl = document.getElementById('cartDeliveryFeeDisplay');
  if (feeEl) feeEl.innerText = `R$ ${fee.toFixed(2).replace('.', ',')}`;

  const totEl = document.getElementById('cartTotalDisplay');
  if (totEl) totEl.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

function toggleDeliveryTypeUI(type) {
  const addressBox = document.getElementById('deliveryAddressBox');
  if (type === 'balcao') {
    currentSelectedZoneName = "Retirada no Balcão";
    currentDeliveryFee = 0;
    if (addressBox) addressBox.style.display = 'none';
  } else {
    // Busca a zona de entrega cadastrada no admin
    if (deliveryZones && deliveryZones.length > 0) {
      const activeZone = deliveryZones.find(z => z.name !== "Retirada no Balcão") || deliveryZones[0];
      currentSelectedZoneName = activeZone.name;
      currentDeliveryFee = parseFloat(activeZone.price) || 0;
    } else {
      currentSelectedZoneName = "Entrega em Domicílio";
      currentDeliveryFee = 5.00;
    }
    if (addressBox) addressBox.style.display = 'block';
  }
  updateCartTotals();
}

function toggleSemNumero(chk) {
  const numInput = document.getElementById('inputNumero');
  if (numInput) {
    if (chk.checked) {
      numInput.value = 'S/N';
      numInput.disabled = true;
    } else {
      numInput.value = '';
      numInput.disabled = false;
    }
  }
}

async function buscarCepViaAPI() {
  const cepInput = document.getElementById('inputCep');
  if (!cepInput) return;
  const cep = cepInput.value.replace(/\D/g, '');
  if (cep.length !== 8) {
    showToast('Digite um CEP válido com 8 dígitos.', 'error');
    return;
  }

  try {
    const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await res.json();
    if (data.erro) {
      showToast('CEP não encontrado.', 'error');
      return;
    }

    const box = document.getElementById('addressResultBox');
    const txtRua = document.getElementById('txtRuaBairro');
    const txtFrete = document.getElementById('txtFreteVal');

    if (box) box.style.display = 'block';
    if (txtRua) txtRua.innerText = `${data.logradouro}, ${data.bairro} - ${data.localidade}/${data.uf}`;
    
    const feeTxt = (currentDeliveryFee === 0) ? 'Grátis' : `R$ ${currentDeliveryFee.toFixed(2).replace('.', ',')}`;
    if (txtFrete) txtFrete.innerText = `Taxa de Entrega (${currentSelectedZoneName}): ${feeTxt}`;

    showToast('Endereço localizado!', 'success');
  } catch(e) {
    showToast('Erro ao buscar CEP.', 'error');
  }
}

async function loadDeliveryZonesData() {
  if (window.DbService) {
    try {
      const zones = await DbService.getDeliveryZones();
      if (zones && zones.length > 0) deliveryZones = zones;
    } catch(e) {}
  }
}

/* -------------------------------------------------------------------------
   6. FINALIZAÇÃO E ENVIO DO PEDIDO PARA O WHATSAPP
------------------------------------------------------------------------- */
function enviarPedidoWhatsAppFinal() {
  sendCartToWhatsApp();
}

function sendCartToWhatsApp() {
  if (cart.length === 0) {
    showToast('Seu pedido está vazio.', 'error');
    return;
  }

  if (!WPP_NUMERO) {
    showToast('O número de WhatsApp da loja não foi configurado no painel Admin.', 'error');
    return;
  }

  const numInput = document.getElementById('inputNumero');
  const compInput = document.getElementById('inputComplemento');
  const txtRua = document.getElementById('txtRuaBairro');

  let enderecoTxt = currentSelectedZoneName;
  if (currentSelectedZoneName !== "Retirada no Balcão") {
    const ruaBairro = txtRua ? txtRua.innerText : '';
    const num = numInput ? numInput.value.trim() : '';
    const comp = compInput ? compInput.value.trim() : '';
    enderecoTxt = `${ruaBairro} nº ${num || 'S/N'} ${comp ? '(' + comp + ')' : ''}`;
  }

  let msg = `*NOVO PEDIDO DE COMPRA*\n`;
  msg += `*Tipo:* ${currentSelectedZoneName}\n`;
  if (currentSelectedZoneName !== "Retirada no Balcão") {
    msg += `*Endereço:* ${enderecoTxt}\n`;
  }
  msg += `------------------------------\n`;
  msg += `*ITENS DO PEDIDO:*\n\n`;

  let subtotal = 0;
  cart.forEach(item => {
    const adicTotal = (item.adicionais || []).reduce((s, a) => s + (a.preco || 0), 0);
    const itemUnit = item.price + adicTotal;
    const itemTotal = itemUnit * item.qty;
    subtotal += itemTotal;

    msg += `${item.qty}x *${item.title}* — R$ ${itemTotal.toFixed(2).replace('.', ',')}\n`;
    if (item.adicionais && item.adicionais.length > 0) {
      msg += `   └ Adicionais: ${item.adicionais.map(a => a.nome).join(', ')}\n`;
    }
    if (item.obs) {
      msg += `   └ Obs: "${item.obs}"\n`;
    }
    msg += `\n`;
  });

  const fee = (currentSelectedZoneName === "Retirada no Balcão") ? 0 : currentDeliveryFee;
  const total = subtotal + fee;

  msg += `------------------------------\n`;
  msg += `*Subtotal:* R$ ${subtotal.toFixed(2).replace('.', ',')}\n`;
  msg += `*Taxa de Entrega:* R$ ${fee.toFixed(2).replace('.', ',')}\n`;
  msg += `*TOTAL:* R$ ${total.toFixed(2).replace('.', ',')}\n`;

  const url = `https://wa.me/${WPP_NUMERO}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

function showToast(msg, type = 'info') {
  if (typeof window.showToast === 'function') {
    window.showToast(msg, type);
  } else {
    console.log(`[Toast ${type}] ${msg}`);
  }
}

// Binds Globais no Objeto Window
window.selectDrawerCategory = selectDrawerCategory;
window.toggleMobileDrawer = toggleMobileDrawer;
window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;
window.openPizzaCustomizerModal = openProductModal;
window.closePizzaModal = closeProductModal;
window.recalculateModalTotal = recalculateModalTotal;
window.changeModalQty = changeModalQty;
window.addModalProductToCart = addModalProductToCart;
window.openCartModal = openCartModal;
window.closeCartModal = closeCartModal;
window.changeCartItemQty = changeCartItemQty;
window.toggleDeliveryTypeUI = toggleDeliveryTypeUI;
window.selectDeliveryZone = selectDeliveryZone;
window.toggleSemNumero = toggleSemNumero;
window.buscarCepViaAPI = buscarCepViaAPI;
window.enviarPedidoWhatsAppFinal = enviarPedidoWhatsAppFinal;
window.sendCartToWhatsApp = sendCartToWhatsApp;