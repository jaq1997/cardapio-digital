/* ==========================================================================
   PIZZA TODO DIA (ANTIGA TRI PIZZAS) — ENGINE DE VENDAS FRANQUIA (LOJA.JS)
   ========================================================================== */

const STORAGE_KEY_BRANDING = 'ptd_store_branding';
const STORAGE_KEY_PRODUCTS = 'ptd_store_products';
const STORAGE_KEY_CATEGORIES = 'ptd_store_categories';
const STORAGE_KEY_DELIVERY_ZONES = 'ptd_delivery_zones';

let WPP_NUMERO = '5531992082542';

const defaultDeliveryZones = [
  { id: "z-balcao", name: "Retirada no Balcão (Grátis)", price: 0.00 },
  { id: "z-centro", name: "Centro / Bairros Próximos", price: 5.00 },
  { id: "z-zonasul", name: "Zona Sul / Bairros Médios", price: 8.00 },
  { id: "z-zonanorte", name: "Zona Norte / Bairros Distantes", price: 12.00 }
];

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

document.addEventListener('DOMContentLoaded', () => {
  applyDynamicBranding();
  loadCatalogData();
  loadDeliveryZonesData();
  renderCatalog();
  populateFlavorDropdowns();
  populateDeliveryZonesSelect();
});

function applyDynamicBranding() {
  const savedBranding = localStorage.getItem(STORAGE_KEY_BRANDING);
  if (!savedBranding) return;

  try {
    const cfg = JSON.parse(savedBranding);

    if (cfg.wppNumber) WPP_NUMERO = cfg.wppNumber;
    if (cfg.frete) currentDeliveryFee = parseFloat(cfg.frete);

    if (cfg.primaryColor) {
      document.documentElement.style.setProperty('--ph-red', cfg.primaryColor);
    }
    if (cfg.darkColor) {
      document.documentElement.style.setProperty('--ph-red-dark', cfg.darkColor);
    }

    if (cfg.storeName) {
      const logoText = document.querySelector('.ph-logo-text');
      if (logoText) logoText.innerHTML = `${cfg.storeName.toUpperCase()}`;
    }
    if (cfg.storeSub) {
      const logoSub = document.querySelector('.ph-logo-sub');
      if (logoSub) logoSub.innerText = cfg.storeSub.toUpperCase();
    }
    if (cfg.logoUrl) {
      const logoBadge = document.querySelector('.ph-logo-badge');
      if (logoBadge) logoBadge.innerHTML = `<img src="${cfg.logoUrl}" style="width:100%; height:100%; object-fit:cover;">`;
    }

    const heroCard = document.querySelector('.ph-hero-card');
    if (heroCard) {
      if (window.innerWidth <= 768 && cfg.bannerMobUrl) {
        heroCard.style.backgroundImage = `url('${cfg.bannerMobUrl}')`;
        heroCard.classList.add('has-custom-banner');
      } else if (cfg.bannerDeskUrl) {
        heroCard.style.backgroundImage = `url('${cfg.bannerDeskUrl}')`;
        heroCard.classList.add('has-custom-banner');
      } else {
        heroCard.classList.remove('has-custom-banner');
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
    console.error('Erro ao carregar branding customizado:', e);
  }
}

function loadCatalogData() {
  const savedProducts = localStorage.getItem(STORAGE_KEY_PRODUCTS);
  if (savedProducts) {
    try {
      const parsed = JSON.parse(savedProducts);
      catalogData = parsed.map(p => ({
        id: p.id,
        nome: p.nome,
        categoria: p.categoria || 'pizzas-salgadas',
        descricao: p.descricao || '',
        preco_broto: p.preco_broto || 0,
        preco_media: p.preco_media || 0,
        preco_grande: p.preco_grande || p.preco || 0,
        preco_gigante: p.preco_gigante || 0,
        badge: p.badge || '',
        img_url: p.img_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
        ingredientes: p.descricao || ''
      }));
      return;
    } catch(e) {}
  }
  catalogData = [];
}

function loadDeliveryZonesData() {
  const savedZones = localStorage.getItem(STORAGE_KEY_DELIVERY_ZONES);
  if (savedZones) {
    try {
      const parsed = JSON.parse(savedZones);
      if (parsed.length > 0) deliveryZones = parsed;
    } catch(e) {}
  }
}

function renderCatalog() {
  const container = document.getElementById('productGridContainer');
  if (!container) return;

  let filtered = catalogData;

  if (activeCategory !== 'todos') {
    filtered = filtered.filter(p => p.categoria === activeCategory);
  }

  if (currentSearchQuery.trim() !== '') {
    const q = currentSearchQuery.toLowerCase().trim();
    filtered = filtered.filter(p =>
      p.nome.toLowerCase().includes(q) ||
      (p.descricao && p.descricao.toLowerCase().includes(q)) ||
      (p.categoria && p.categoria.toLowerCase().includes(q))
    );
  }

  const countDisplay = document.getElementById('itemCountDisplay');
  if (countDisplay) {
    countDisplay.innerText = `${filtered.length} produto(s) encontrado(s)`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: #FFFFFF; border: 2px dashed #DDD; border-radius: 8px; margin: 20px 0;">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--ph-red)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 12px;">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
        <h3 style="font-size: 1.2rem; font-weight: 900; color: #333; margin-bottom: 6px; font-family: var(--font-display);">CARDÁPIO EM ATUALIZAÇÃO</h3>
        <p style="font-size: 0.88rem; color: #777;">Este estabelecimento está cadastrando seus produtos. Volte em instantes!</p>
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
              <span>MONTAR</span>
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

  renderCatalog();
}

function handleSearch(query) {
  currentSearchQuery = query;
  renderCatalog();
}

function populateFlavorDropdowns() {
  const flavor1Select = document.getElementById('selectSabor1');
  const flavor2Select = document.getElementById('selectSabor2');
  if (!flavor1Select || !flavor2Select) return;

  const pizzasSalgadas = catalogData.filter(p => p.categoria === 'pizzas-salgadas' || p.categoria === 'pizzas-doces');

  if (pizzasSalgadas.length === 0) {
    flavor1Select.innerHTML = `<option value="">Nenhum sabor cadastrado</option>`;
    flavor2Select.innerHTML = `<option value="">Nenhum sabor cadastrado</option>`;
    return;
  }

  const optionsHtml = pizzasSalgadas.map(p => `<option value="${p.id}">${p.nome}</option>`).join('');

  flavor1Select.innerHTML = optionsHtml;
  flavor2Select.innerHTML = optionsHtml;
}

function populateDeliveryZonesSelect() {
  const select = document.getElementById('selectDeliveryZoneCheckout');
  if (!select) return;

  select.innerHTML = deliveryZones.map(z => `
    <option value="${z.id}" data-price="${z.price}">${z.name} (R$ ${z.price.toFixed(2).replace('.', ',')})</option>
  `).join('');
}

function openPizzaCustomizerModal(productId) {
  const product = catalogData.find(p => p.id === productId);
  if (!product) return;

  currentSelectedProduct = product;

  document.getElementById('modalPizzaTitle').innerText = product.nome.toUpperCase();
  document.getElementById('modalPizzaDesc').innerText = product.descricao || product.ingredientes || '';
  document.getElementById('modalPizzaImg').src = product.img_url;

  flavorMode = 'single';
  selectedSize = 'grande';
  document.getElementById('btnFlavor1').classList.add('active');
  document.getElementById('btnFlavor2').classList.remove('active');
  document.getElementById('secondFlavorWrapper').style.display = 'none';

  recalculateModalTotal();

  document.getElementById('pizzaCustomizerModal').classList.add('active');
}

function closePizzaCustomizerModal() {
  document.getElementById('pizzaCustomizerModal').classList.remove('active');
  currentSelectedProduct = null;
}

function selectPizzaSize(sizeName, btn) {
  selectedSize = sizeName;
  document.querySelectorAll('.ph-size-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  recalculateModalTotal();
}

function selectFlavorMode(mode) {
  flavorMode = mode;
  const btn1 = document.getElementById('btnFlavor1');
  const btn2 = document.getElementById('btnFlavor2');
  const wrapper2 = document.getElementById('secondFlavorWrapper');

  if (mode === 'single') {
    btn1.classList.add('active');
    btn2.classList.remove('active');
    if (wrapper2) wrapper2.style.display = 'none';
  } else {
    btn1.classList.remove('active');
    btn2.classList.add('active');
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
    const s2Id = document.getElementById('selectSabor2')?.value;
    const p2 = catalogData.find(p => p.id === s2Id);
    if (p2) {
      let p2Price = p2.preco_grande || p2.preco || 0;
      if (selectedSize === 'broto' && p2.preco_broto) p2Price = p2.preco_broto;
      if (selectedSize === 'media' && p2.preco_media) p2Price = p2.preco_media;
      if (selectedSize === 'gigante' && p2.preco_gigante) p2Price = p2.preco_gigante;

      basePrice = Math.max(basePrice, p2Price);
    }
  }

  const selectBorda = document.getElementById('selectBorda');
  const bordaPrice = selectBorda ? (parseFloat(selectBorda.options[selectBorda.selectedIndex]?.dataset.price) || 0) : 0;

  const selectExtra = document.getElementById('selectAdicionaisExtra');
  const extraPrice = selectExtra ? (parseFloat(selectExtra.options[selectExtra.selectedIndex]?.dataset.price) || 0) : 0;

  const grandTotal = basePrice + bordaPrice + extraPrice;

  const displayEl = document.getElementById('modalCalculatedTotal');
  if (displayEl) {
    displayEl.innerText = `R$ ${grandTotal.toFixed(2).replace('.', ',')}`;
  }
}

function addCustomPizzaToCart() {
  if (!currentSelectedProduct) return;

  let title = currentSelectedProduct.nome;
  let detailsArr = [];

  if (flavorMode === 'half') {
    const s2Id = document.getElementById('selectSabor2')?.value;
    const p2 = catalogData.find(p => p.id === s2Id);
    if (p2) {
      title = `Meio ${currentSelectedProduct.nome} + Meio ${p2.nome}`;
    }
  }

  detailsArr.push(`Tamanho: ${selectedSize.toUpperCase()}`);

  const selectBorda = document.getElementById('selectBorda');
  if (selectBorda && selectBorda.value !== 'nenhuma') {
    detailsArr.push(`Borda: ${selectBorda.options[selectBorda.selectedIndex].text}`);
  }

  const selectExtra = document.getElementById('selectAdicionaisExtra');
  if (selectExtra && selectExtra.value !== 'nenhum') {
    detailsArr.push(`Extra: ${selectExtra.options[selectExtra.selectedIndex].text}`);
  }

  const obs = document.getElementById('modalObs')?.value.trim();
  if (obs) detailsArr.push(`Obs: ${obs}`);

  const calculatedStr = document.getElementById('modalCalculatedTotal')?.innerText || '0';
  const finalPrice = parseFloat(calculatedStr.replace('R$', '').replace('.', '').replace(',', '.')) || 0;

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
  alert(`"${title}" adicionado ao seu pedido!`);
}

function updateCartBadge() {
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const badge = document.getElementById('cartCountBadge');
  if (badge) badge.innerText = totalQty;
}

function openCartModal() {
  renderCartItems();
  recalculateCartTotal();
  document.getElementById('cartModal').classList.add('active');
}

function closeCartModal() {
  document.getElementById('cartModal').classList.remove('active');
}

function renderCartItems() {
  const container = document.getElementById('cartItemsContainer');
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 30px; color: #888;">
        Seu carrinho está vazio. Escolha um item no cardápio!
      </div>
    `;
    return;
  }

  container.innerHTML = cart.map((item, index) => `
    <div style="background: var(--ph-gray-light); padding: 12px; border-radius: var(--radius-md); margin-bottom: 10px; border: 1px solid var(--ph-border);">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <strong style="font-size: 0.92rem; color: var(--ph-black);">${item.title}</strong>
          <div style="font-size: 0.76rem; color: #666; margin-top: 2px;">${item.details || ''}</div>
        </div>
        <button onclick="removeCartItem(${index})" style="background: none; border: none; color: var(--ph-red); font-weight: 900; cursor: pointer;">✕</button>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
        <div style="display: flex; align-items: center; gap: 8px; background: #FFF; padding: 2px 8px; border-radius: 4px; border: 1px solid #DDD;">
          <button onclick="updateItemQty(${index}, -1)" style="border: none; background: none; font-weight: 900; cursor: pointer;">-</button>
          <span style="font-weight: 800; font-size: 0.85rem;">${item.qty}</span>
          <button onclick="updateItemQty(${index}, 1)" style="border: none; background: none; font-weight: 900; cursor: pointer;">+</button>
        </div>
        <strong style="color: var(--ph-red); font-size: 0.95rem;">R$ ${(item.price * item.qty).toFixed(2).replace('.', ',')}</strong>
      </div>
    </div>
  `).join('');
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

function recalculateCartTotal() {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const total = subtotal + currentDeliveryFee;

  const subEl = document.getElementById('txtSubtotalFrete');
  const totEl = document.getElementById('txtTotalCartFinal');

  if (subEl) subEl.innerText = `Subtotal: R$ ${subtotal.toFixed(2).replace('.', ',')} | Frete (${currentSelectedZoneName}): R$ ${currentDeliveryFee.toFixed(2).replace('.', ',')}`;
  if (totEl) totEl.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

function toggleDeliveryTypeUI(type) {
  const addressBox = document.getElementById('deliveryAddressBox');
  if (type === 'balcao') {
    currentDeliveryFee = 0.00;
    currentSelectedZoneName = 'Retirada no Balcão';
    if (addressBox) addressBox.style.display = 'none';
  } else {
    currentDeliveryFee = 5.00;
    currentSelectedZoneName = 'Entrega em Domicílio';
    if (addressBox) addressBox.style.display = 'block';
  }
  recalculateCartTotal();
}

function buscarCepViaAPI() {
  const cepInput = document.getElementById('inputCep').value.replace(/\D/g, '');
  if (cepInput.length !== 8) {
    alert('Por favor, informe um CEP válido com 8 dígitos.');
    return;
  }

  fetch(`https://viacep.com.br/ws/${cepInput}/json/`)
    .then(res => res.json())
    .then(data => {
      if (data.erro) {
        alert('CEP não encontrado. Digite o endereço manualmente.');
        return;
      }
      const box = document.getElementById('addressResultBox');
      document.getElementById('txtRuaBairro').innerText = `${data.logradouro}, ${data.bairro} - ${data.localidade}/${data.uf}`;
      box.style.display = 'block';
    })
    .catch(() => {
      alert('Erro ao consultar o CEP. Verifique sua conexão.');
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
    alert('Chave PIX copiada para a área de transferência!');
  });
}

function simularPagamentoMercadoPagoCard() {
  if (cart.length === 0) {
    alert('Seu carrinho está vazio!');
    return;
  }
  showOrderConfirmationOnScreen('Pagamento com Cartão de Crédito');
}

function showOrderConfirmationOnScreen(paymentMethodLabel) {
  const orderNum = '#PED-' + Math.floor(1000 + Math.random() * 9000);
  document.getElementById('confirmedOrderNum').innerText = orderNum;

  const numComp = document.getElementById('inputNumeroComp')?.value.trim() || 'Não informado';
  const enderecoInfo = document.getElementById('txtRuaBairro')?.innerText || 'Retirada no Balcão';

  let html = `<div style="margin-bottom: 8px;"><strong>Forma de Pagamento:</strong> ${paymentMethodLabel}</div>`;
  html += `<div style="margin-bottom: 8px;"><strong>Forma de Envio:</strong> ${currentSelectedZoneName} (R$ ${currentDeliveryFee.toFixed(2).replace('.', ',')})</div>`;
  html += `<div style="margin-bottom: 8px;"><strong>Endereço:</strong> ${enderecoInfo} (${numComp})</div>`;
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
    alert('Seu carrinho está vazio!');
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
    showOrderConfirmationOnScreen('Pedido no Balcão / Sem WhatsApp');
    return;
  }

  const numComp = document.getElementById('inputNumeroComp')?.value.trim() || '';
  const enderecoInfo = document.getElementById('txtRuaBairro')?.innerText || 'Retirada no Balcão';
  const orderNum = Math.floor(1000 + Math.random() * 9000);
  const now = new Date();
  const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const currentUrl = window.location.href.split('?')[0];

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const total = subtotal + currentDeliveryFee;
  const freteStr = currentDeliveryFee > 0 ? `R$ ${currentDeliveryFee.toFixed(2).replace('.', ',')}` : 'Grátis / Retirada no Balcão';

  let msg = `⭐ GOSTOU DE PEDIR NO NOSSO APP? ⭐\n`;
  msg += `Não precisa baixar nada, adicione o nosso restaurante na tela inicial do seu celular e peça com mais agilidade na próxima vez através do link abaixo:\n`;
  msg += `${currentUrl}\n`;
  msg += `---------------------------------------\n`;
  msg += `Confira o pedido abaixo:\n`;
  msg += `Pedido #${orderNum} - ${storeName}\n`;
  msg += `---------------------------------------\n\n`;

  cart.forEach(item => {
    msg += `${item.qty}x ${item.title}\n`;
    if (item.details) msg += `   Obs: ${item.details}\n`;
    msg += `\n`;
  });

  msg += `Taxa de entrega: ${freteStr}\n`;
  msg += `Total: R$ ${total.toFixed(2).replace('.', ',')}\n\n`;
  msg += `---------------------------------------\n\n`;
  msg += `Forma de Envio: ${currentSelectedZoneName}\n`;
  msg += `Endereço: ${enderecoInfo}${numComp ? ' - ' + numComp : ''}\n\n`;
  msg += `Pagamento: WhatsApp / A Combinar\n\n`;
  msg += `Pedido gerado via Cardápio Digital às ${timeStr}`;

  const encodedMsg = encodeURIComponent(msg);
  window.open(`https://wa.me/${targetWpp}?text=${encodedMsg}`, '_blank');

  showOrderConfirmationOnScreen('Enviado via WhatsApp');
}