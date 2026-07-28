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

const defaultCatalogData = [
  {
    id: "combo-familia",
    nome: "Combo Família Todo Dia",
    categoria: "combos",
    descricao: "2 Pizzas Grandes (até 4 sabores) + 1 Borda Recheada à escolha + 1 Guaraná Antarctica 2 Litros trincando de gelado.",
    preco_broto: 0,
    preco_media: 89.90,
    preco_grande: 109.90,
    preco_gigante: 0,
    badge: "Combo Destaque",
    img_url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
    ingredientes: "2 Pizzas Grandes + Borda Recheada + Guaraná 2L"
  },
  {
    id: "combo-individual",
    nome: "Combo Individual",
    categoria: "combos",
    descricao: "1 Pizza Broto (4 fatias) + 1 Porção de Pão de Alho (4un) + 1 Refrigerante Lata 350ml.",
    preco_broto: 34.90,
    preco_media: 0,
    preco_grande: 0,
    preco_gigante: 0,
    badge: "Promoção",
    img_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
    ingredientes: "1 Pizza Broto + 1 Pão de Alho + 1 Refri"
  },
  {
    id: "pizza-pepperoni",
    nome: "Pepperoni Especial",
    categoria: "pizzas-salgadas",
    descricao: "Molho de tomate artesanal da casa, generosa camada de mussarela derretida e fatias crocantes de pepperoni.",
    preco_broto: 36.90,
    preco_media: 49.90,
    preco_grande: 64.90,
    preco_gigante: 79.90,
    badge: "Mais Pedida",
    img_url: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80",
    ingredientes: "Pepperoni; Mussarela Especial; Molho Artesanal"
  },
  {
    id: "pizza-pepperoni-requeijao",
    nome: "Pepperoni com Requeijão Cremoso",
    categoria: "pizzas-salgadas",
    descricao: "Fatias crocantes de pepperoni combinadas com fios generosos de requeijão cremoso e mussarela derretida.",
    preco_broto: 39.90,
    preco_media: 53.90,
    preco_grande: 68.90,
    preco_gigante: 84.90,
    badge: "",
    img_url: "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=800&q=80",
    ingredientes: "Pepperoni; Requeijão Cremoso; Mussarela"
  },
  {
    id: "pizza-calabresa",
    nome: "Calabresa com Cebola Roxa",
    categoria: "pizzas-salgadas",
    descricao: "Calabresa defumada selecionada fatiada fininha, cebola roxa fresca, azeitonas pretas e orégano sobre mussarela derretida.",
    preco_broto: 34.90,
    preco_media: 46.90,
    preco_grande: 59.90,
    preco_gigante: 74.90,
    badge: "",
    img_url: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80",
    ingredientes: "Calabresa Defumada; Cebola Roxa; Azeitonas"
  },
  {
    id: "pizza-supreme",
    nome: "Pizza Suprema Todo Dia",
    categoria: "pizzas-salgadas",
    descricao: "A receita da casa! Pepperoni, carne moída temperada, pimentão verde crocante, cebola fresca e cogumelos champignon.",
    preco_broto: 42.90,
    preco_media: 56.90,
    preco_grande: 72.90,
    preco_gigante: 89.90,
    badge: "Especialidade",
    img_url: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=800&q=80",
    ingredientes: "Pepperoni; Carne Temperada; Champignon; Pimentão"
  },
  {
    id: "pizza-frango-requeijao",
    nome: "Frango com Catupiry Original",
    categoria: "pizzas-salgadas",
    descricao: "Peito de frango desfiaudinho bem temperado, milho verde e camada generosa do autêntico Catupiry cremoso.",
    preco_broto: 37.90,
    preco_media: 49.90,
    preco_grande: 64.90,
    preco_gigante: 79.90,
    badge: "",
    img_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
    ingredientes: "Frango Desfiado; Catupiry Original; Milho"
  },
  {
    id: "pizza-4queijos",
    nome: "Quatro Queijos Premium",
    categoria: "pizzas-salgadas",
    descricao: "Harmonia perfeita de Mussarela, Provolone defumado, Gorgonzola aveludado e Requeijão cremoso.",
    preco_broto: 38.90,
    preco_media: 51.90,
    preco_grande: 66.90,
    preco_gigante: 82.90,
    badge: "",
    img_url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
    ingredientes: "Mussarela; Provolone; Gorgonzola; Requeijão"
  },
  {
    id: "pizza-doce-nutella",
    nome: "Nutella com Morango",
    categoria: "pizzas-doces",
    descricao: "Massa crocante assada no forno coberta com uma generosa camada de Nutella® cremosa e morangos frescos fatiados.",
    preco_broto: 36.90,
    preco_media: 46.90,
    preco_grande: 58.90,
    preco_gigante: 0,
    badge: "Doce Mais Pedida",
    img_url: "https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?auto=format&fit=crop&w=800&q=80",
    ingredientes: "Nutella® Original; Morango Fresco"
  },
  {
    id: "bebida-coca-2l",
    nome: "Coca-Cola Garrafa 2L",
    categoria: "bebidas",
    descricao: "Garrafa 2 Litros trincando de gelada.",
    preco_broto: 14.90,
    preco_media: 0,
    preco_grande: 0,
    preco_gigante: 0,
    badge: "",
    img_url: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80",
    ingredientes: "Garrafa 2 Litros"
  },
  {
    id: "bebida-guarana-2l",
    nome: "Guaraná Antarctica Garrafa 2L",
    categoria: "bebidas",
    descricao: "Garrafa 2 Litros super gelada.",
    preco_broto: 12.90,
    preco_media: 0,
    preco_grande: 0,
    preco_gigante: 0,
    badge: "",
    img_url: "https://images.unsplash.com/photo-1581006852262-e4307cf6283a?auto=format&fit=crop&w=800&q=80",
    ingredientes: "Garrafa 2 Litros"
  }
];

let catalogData = defaultCatalogData;
let deliveryZones = defaultDeliveryZones;
let cart = [];
let activeCategory = 'todos';
let currentSearchQuery = '';

let selectedSize = 'grande';
let flavorMode = 'single';
let currentSelectedProduct = null;
let currentDeliveryFee = 5.00;
let currentSelectedZoneName = "Padrão";

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
        heroCard.style.backgroundSize = 'cover';
        heroCard.style.backgroundPosition = 'center';
      } else if (cfg.bannerDeskUrl) {
        heroCard.style.backgroundImage = `url('${cfg.bannerDeskUrl}')`;
        heroCard.style.backgroundSize = 'cover';
        heroCard.style.backgroundPosition = 'center';
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
      if (parsed.length > 0) {
        catalogData = parsed.map(item => ({
          ...item,
          preco_grande: item.preco_grande || item.preco || 0,
          preco_media: item.preco_media || item.preco || 0,
          preco_broto: item.preco_broto || item.preco || 0
        }));
        return;
      }
    } catch (e) {}
  }
  catalogData = defaultCatalogData;
}

function loadDeliveryZonesData() {
  const savedZones = localStorage.getItem(STORAGE_KEY_DELIVERY_ZONES);
  if (savedZones) {
    try {
      const parsed = JSON.parse(savedZones);
      if (parsed.length > 0) {
        deliveryZones = parsed;
        return;
      }
    } catch(e) {}
  }
  deliveryZones = defaultDeliveryZones;
}

function populateDeliveryZonesSelect() {
  const select = document.getElementById('selectBairroFrete');
  if (!select) return;

  if (deliveryZones.length === 0) {
    select.innerHTML = `<option value="default" data-price="${currentDeliveryFee}">Taxa Padrão - R$ ${currentDeliveryFee.toFixed(2).replace('.', ',')}</option>`;
    return;
  }

  select.innerHTML = deliveryZones.map(z => {
    const priceTxt = z.price === 0 ? 'Grátis (R$ 0,00)' : `R$ ${z.price.toFixed(2).replace('.', ',')}`;
    return `<option value="${z.id}" data-price="${z.price}" data-name="${z.name}">${z.name} (${priceTxt})</option>`;
  }).join('');

  recalculateDeliveryZoneFee();
}

function recalculateDeliveryZoneFee() {
  const select = document.getElementById('selectBairroFrete');
  if (!select) return;

  const opt = select.options[select.selectedIndex];
  if (opt) {
    currentDeliveryFee = parseFloat(opt.dataset.price) || 0;
    currentSelectedZoneName = opt.dataset.name || opt.text;
  }
  updateCartTotals();
}

function renderCatalog() {
  const container = document.getElementById('productGridContainer');
  if (!container) return;

  let filtered = catalogData;

  if (activeCategory !== 'todos') {
    filtered = filtered.filter(item => item.categoria === activeCategory);
  }

  if (currentSearchQuery.trim() !== '') {
    const q = currentSearchQuery.toLowerCase();
    filtered = filtered.filter(item =>
      item.nome.toLowerCase().includes(q) ||
      (item.descricao && item.descricao.toLowerCase().includes(q)) ||
      (item.ingredientes && item.ingredientes.toLowerCase().includes(q))
    );
  }

  const countDisplay = document.getElementById('itemCountDisplay');
  if (countDisplay) countDisplay.innerText = `${filtered.length} opções`;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px; color: #777777;">
        <h3 style="font-weight: 800; font-size: 1.1rem;">NENHUM ITEM ENCONTRADO</h3>
        <p style="font-size: 0.84rem; margin-top: 6px;">Selecione outra categoria no menu acima ou cadastre pratos no Painel Admin.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(item => {
    const isPizza = item.categoria.includes('pizzas');
    const priceDisplay = isPizza ? item.preco_grande : (item.preco_grande || item.preco || item.preco_media || item.preco_broto);

    return `
      <div class="ph-card">
        <div class="ph-card-img-wrap">
          ${item.badge ? `<div class="ph-card-tag">${item.badge}</div>` : ''}
          <img src="${item.img_url}" alt="${item.nome}" loading="lazy">
        </div>
        <div class="ph-card-body">
          <div>
            <h3 class="ph-card-name">${item.nome}</h3>
            <p class="ph-card-desc">${item.descricao || ''}</p>
          </div>
          <div class="ph-card-footer">
            <div>
              <div class="ph-card-price-label">${isPizza ? 'Grande' : 'Preço'}</div>
              <div class="ph-card-price-val">R$ ${(priceDisplay || 0).toFixed(2).replace('.', ',')}</div>
            </div>
            ${isPizza ? `
              <button class="ph-btn-add" onclick="openPizzaCustomizerModal('${item.id}')">
                <span>ADICIONAR</span>
              </button>
            ` : `
              <button class="ph-btn-add" onclick="addDirectToCart('${item.id}')">
                <span>ADICIONAR</span>
              </button>
            `}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function filterCategory(catName, btnElement) {
  activeCategory = catName;

  const hero = document.querySelector('.ph-hero-section');
  if (hero) {
    if (catName === 'combos' || catName === 'todos') {
      hero.style.display = 'block';
    } else {
      hero.style.display = 'none';
    }
  }

  const titleHeading = document.querySelector('.ph-section-heading');
  if (titleHeading) {
    const catLabels = {
      'todos': 'TODOS OS <span>PRODUTOS</span>',
      'combos': 'PROMOS <span>DO DIA</span>',
      'pizzas-salgadas': 'PIZZAS <span>SALGADAS</span>',
      'pizzas-doces': 'PIZZAS <span>DOCES</span>',
      'bebidas': 'BEBIDAS <span>GELADAS</span>'
    };
    titleHeading.innerHTML = catLabels[catName] || `CARDÁPIO <span>${catName.replace('-', ' ').toUpperCase()}</span>`;
  }

  document.querySelectorAll('.ph-cat-pill').forEach(b => b.classList.remove('active'));
  
  if (btnElement) {
    btnElement.classList.add('active');
  } else {
    const pill = document.querySelector(`.ph-cat-pill[data-cat="${catName}"]`);
    if (pill) pill.classList.add('active');
  }

  renderCatalog();

  if (catName !== 'todos') {
    const catalogSection = document.getElementById('catalogSection');
    if (catalogSection) {
      catalogSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

function handleSearch(query) {
  currentSearchQuery = query;
  renderCatalog();
}

function openPizzaCustomizerModal(productId) {
  const product = productId ? catalogData.find(p => p.id === productId) : catalogData.find(p => p.categoria.includes('pizzas'));
  if (!product) return;

  currentSelectedProduct = product;
  selectedSize = 'grande';
  flavorMode = 'single';

  document.getElementById('modalPizzaTitle').innerText = product.nome;
  document.getElementById('modalPizzaDesc').innerText = product.descricao || '';
  const imgBg = document.getElementById('modalHeroBg');
  if (imgBg) imgBg.src = product.img_url;

  const pBroto = product.preco_broto || product.preco || 0;
  const pMedia = product.preco_media || product.preco || 0;
  const pGrande = product.preco_grande || product.preco || 0;
  const pGigante = product.preco_gigante || product.preco || 0;

  document.getElementById('priceBrotoVal').innerText = `R$ ${pBroto.toFixed(2).replace('.', ',')}`;
  document.getElementById('priceMediaVal').innerText = `R$ ${pMedia.toFixed(2).replace('.', ',')}`;
  document.getElementById('priceGrandeVal').innerText = `R$ ${pGrande.toFixed(2).replace('.', ',')}`;
  document.getElementById('priceGiganteVal').innerText = `R$ ${pGigante.toFixed(2).replace('.', ',')}`;

  document.querySelectorAll('.size-option-card').forEach(c => c.classList.remove('selected'));
  const defaultSizeCard = document.querySelector('.size-option-card[data-size="grande"]');
  if (defaultSizeCard) defaultSizeCard.classList.add('selected');

  setFlavorMode('single');

  const select1 = document.getElementById('selectFlavor1');
  if (select1) select1.value = product.id;

  recalculateModalTotal();
  document.getElementById('pizzaModal').classList.add('active');
}

function closePizzaModal() {
  document.getElementById('pizzaModal').classList.remove('active');
}

function selectPizzaSize(sizeName, element) {
  selectedSize = sizeName;
  document.querySelectorAll('.size-option-card').forEach(c => c.classList.remove('selected'));
  if (element) element.classList.add('selected');
  recalculateModalTotal();
}

function setFlavorMode(mode) {
  flavorMode = mode;
  const btnSingle = document.getElementById('btnSingleFlavor');
  const btnHalf = document.getElementById('btnHalfFlavor');
  const containerFlavor2 = document.getElementById('containerFlavor2');

  if (mode === 'single') {
    btnSingle.classList.add('active');
    btnHalf.classList.remove('active');
    containerFlavor2.style.display = 'none';
  } else {
    btnHalf.classList.add('active');
    btnSingle.classList.remove('active');
    containerFlavor2.style.display = 'block';
  }
  recalculateModalTotal();
}

function populateFlavorDropdowns() {
  const pizzas = catalogData.filter(p => p.categoria.includes('pizzas'));
  const optionsHtml = pizzas.map(p => `<option value="${p.id}">${p.nome}</option>`).join('');

  const s1 = document.getElementById('selectFlavor1');
  const s2 = document.getElementById('selectFlavor2');
  if (s1) s1.innerHTML = optionsHtml;
  if (s2) s2.innerHTML = optionsHtml;
}

function recalculateModalTotal() {
  const s1Id = document.getElementById('selectFlavor1').value;
  const s2Id = document.getElementById('selectFlavor2').value;
  const p1 = catalogData.find(p => p.id === s1Id) || currentSelectedProduct;
  const p2 = (flavorMode === 'half' && s2Id) ? catalogData.find(p => p.id === s2Id) : p1;

  let keyPrice = 'preco_grande';
  if (selectedSize === 'broto') keyPrice = 'preco_broto';
  if (selectedSize === 'media') keyPrice = 'preco_media';
  if (selectedSize === 'gigante') keyPrice = 'preco_gigante';

  const price1 = p1 ? (p1[keyPrice] || p1.preco || 0) : 64.90;
  const price2 = p2 ? (p2[keyPrice] || p2.preco || 0) : 64.90;
  const basePizzaPrice = Math.max(price1, price2);

  const selectBorda = document.getElementById('selectBorda');
  const bordaPrice = selectBorda ? (parseFloat(selectBorda.options[selectBorda.selectedIndex].dataset.price) || 0) : 0;

  const selectAdicional = document.getElementById('selectAdicionaisExtra');
  const adicionalPrice = selectAdicional ? (parseFloat(selectAdicional.options[selectAdicional.selectedIndex].dataset.price) || 0) : 0;

  const total = basePizzaPrice + bordaPrice + adicionalPrice;
  document.getElementById('modalCalculatedTotal').innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

function addCustomPizzaToCart() {
  const s1Id = document.getElementById('selectFlavor1').value;
  const s2Id = document.getElementById('selectFlavor2').value;
  const p1 = catalogData.find(p => p.id === s1Id);
  const p2 = (flavorMode === 'half' && s2Id) ? catalogData.find(p => p.id === s2Id) : p1;

  const selectBorda = document.getElementById('selectBorda');
  const bordaText = selectBorda ? selectBorda.options[selectBorda.selectedIndex].text : '';
  const bordaPrice = selectBorda ? (parseFloat(selectBorda.options[selectBorda.selectedIndex].dataset.price) || 0) : 0;

  const selectAdicional = document.getElementById('selectAdicionaisExtra');
  const adicionalText = selectAdicional ? selectAdicional.options[selectAdicional.selectedIndex].text : '';
  const adicionalPrice = selectAdicional ? (parseFloat(selectAdicional.options[selectAdicional.selectedIndex].dataset.price) || 0) : 0;

  const obs = document.getElementById('modalObs').value.trim();

  let keyPrice = 'preco_grande';
  let sizeLabel = 'Grande';
  if (selectedSize === 'broto') { keyPrice = 'preco_broto'; sizeLabel = 'Broto'; }
  if (selectedSize === 'media') { keyPrice = 'preco_media'; sizeLabel = 'Média'; }
  if (selectedSize === 'gigante') { keyPrice = 'preco_gigante'; sizeLabel = 'Gigante'; }

  const basePrice = Math.max((p1[keyPrice] || p1.preco || 0), (p2[keyPrice] || p2.preco || 0));
  const itemPrice = basePrice + bordaPrice + adicionalPrice;

  let title = `Pizza ${sizeLabel}`;
  let details = flavorMode === 'half' ? `Meio: ${p1.nome} / Meio: ${p2.nome}` : `Sabor: ${p1.nome}`;
  if (bordaPrice > 0) details += ` | Borda: ${bordaText.split('(+')[0].trim()}`;
  if (adicionalPrice > 0) details += ` | Extra: ${adicionalText.split('(+')[0].trim()}`;
  if (obs) details += ` | Obs: ${obs}`;

  cart.push({
    cartId: Date.now() + Math.random(),
    title: title,
    details: details,
    price: itemPrice,
    qty: 1
  });

  updateCartBadge();
  closePizzaModal();
  openCartModal();
}

function addDirectToCart(productId) {
  const product = catalogData.find(p => p.id === productId);
  if (!product) return;

  const itemPrice = product.preco || product.preco_grande || product.preco_media || product.preco_broto;

  cart.push({
    cartId: Date.now() + Math.random(),
    title: product.nome,
    details: product.descricao || '',
    price: itemPrice,
    qty: 1
  });

  updateCartBadge();
  openCartModal();
}

function openCartModal() {
  renderCartItems();
  populateDeliveryZonesSelect();
  document.getElementById('cartModal').classList.add('active');
}

function closeCartModal() {
  document.getElementById('cartModal').classList.remove('active');
}

function updateCartBadge() {
  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const badge = document.getElementById('cartCountBadge');
  const mobileBadge = document.getElementById('mobileStickyCartBadge');
  if (badge) badge.innerText = totalCount;
  if (mobileBadge) mobileBadge.innerText = totalCount;
}

function renderCartItems() {
  const container = document.getElementById('cartItemsContainer');
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 24px; color: #777777;">
        <p style="font-weight: 700;">Seu carrinho está vazio.</p>
      </div>
    `;
    updateCartTotals();
    return;
  }

  container.innerHTML = cart.map((item, index) => `
    <div class="cart-item-row">
      <div class="cart-item-info">
        <div class="cart-item-title">${item.title}</div>
        <div class="cart-item-sub">${item.details}</div>
        <div class="cart-item-price">R$ ${(item.price * item.qty).toFixed(2).replace('.', ',')}</div>
      </div>
      <div class="qty-control-box">
        <button class="qty-btn" onclick="changeQty(${index}, -1)">-</button>
        <span class="qty-val">${item.qty}</span>
        <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
      </div>
    </div>
  `).join('');

  updateCartTotals();
}

function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  updateCartBadge();
  renderCartItems();
}

function updateCartTotals() {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const total = subtotal + (cart.length > 0 ? currentDeliveryFee : 0);

  const subEl = document.getElementById('txtSubtotalFrete');
  const totEl = document.getElementById('txtTotalCartFinal');
  if (subEl) subEl.innerText = `Subtotal: R$ ${subtotal.toFixed(2).replace('.', ',')} | Frete (${currentSelectedZoneName}): R$ ${currentDeliveryFee.toFixed(2).replace('.', ',')}`;
  if (totEl) totEl.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
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
  showOrderConfirmationOnScreen('Pagamento Online (Mercado Pago / PIX)');
}

function showOrderConfirmationOnScreen(paymentMethodLabel) {
  const orderNum = '#PED-' + Math.floor(1000 + Math.random() * 9000);
  document.getElementById('confirmedOrderNum').innerText = orderNum;

  const numComp = document.getElementById('inputNumeroComp').value.trim() || 'Não informado';
  const enderecoInfo = document.getElementById('txtRuaBairro').innerText || 'Retirada no Balcão';

  let html = `<div style="margin-bottom: 8px;"><strong>Forma de Pagamento:</strong> ${paymentMethodLabel}</div>`;
  html += `<div style="margin-bottom: 8px;"><strong>Região/Taxa de Entrega:</strong> ${currentSelectedZoneName} (R$ ${currentDeliveryFee.toFixed(2).replace('.', ',')})</div>`;
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

  const numComp = document.getElementById('inputNumeroComp').value.trim() || 'Não informado';
  const enderecoInfo = document.getElementById('txtRuaBairro').innerText || 'Retirada no Balcão';

  let msg = `*NOVO PEDIDO - ${storeName}*\n`;
  msg += `-------------------------------------------\n`;
  msg += `*ITENS DO PEDIDO:*\n`;

  cart.forEach(item => {
    msg += `• *${item.qty}x ${item.title}*\n`;
    if (item.details) msg += `   _${item.details}_\n`;
    msg += `   Subtotal: R$ ${(item.price * item.qty).toFixed(2).replace('.', ',')}\n\n`;
  });

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const total = subtotal + currentDeliveryFee;

  msg += `-------------------------------------------\n`;
  msg += `*ENDEREÇO:* ${enderecoInfo}\n`;
  msg += `*NÚMERO/COMPL:* ${numComp}\n`;
  msg += `*REGIÃO/FRETE:* ${currentSelectedZoneName} (R$ ${currentDeliveryFee.toFixed(2).replace('.', ',')})\n`;
  msg += `*TOTAL FINAL:* R$ ${total.toFixed(2).replace('.', ',')}\n`;
  msg += `-------------------------------------------\n`;
  msg += `*Aguardando confirmação!*`;

  const encodedMsg = encodeURIComponent(msg);
  window.open(`https://wa.me/${targetWpp}?text=${encodedMsg}`, '_blank');

  showOrderConfirmationOnScreen('Enviado via WhatsApp');
}