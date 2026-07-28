/* ==========================================================================
   PIZZA TODO DIA — ADMIN COMMAND CENTER ENGINE (PREMIUM PDV STYLE)
   ========================================================================== */

const STORAGE_KEY_BRANDING = 'ptd_store_branding';
const STORAGE_KEY_PRODUCTS = 'ptd_store_products';
const STORAGE_KEY_CATEGORIES = 'ptd_store_categories';
const STORAGE_KEY_DELIVERY_ZONES = 'ptd_delivery_zones';

const defaultBranding = {
  storeName: "Pizza Todo Dia",
  storeSub: "Antiga Tri Pizzas • Tradição e Sabor no Seu Bairro",
  wppNumber: "5531992082542",
  frete: 5.00,
  primaryColor: "#E91C24",
  darkColor: "#C50303",
  logoUrl: "",
  bannerDeskUrl: "",
  bannerMobUrl: "",
  coverageCities: "Porto Alegre, Viamão"
};

const defaultDeliveryZones = [
  { id: "z-balcao", name: "Retirada no Balcão (Grátis)", price: 0.00 },
  { id: "z-centro", name: "Centro / Bairros Próximos", price: 5.00 },
  { id: "z-zonasul", name: "Zona Sul / Bairros Médios", price: 8.00 },
  { id: "z-zonanorte", name: "Zona Norte / Bairros Distantes", price: 12.00 }
];

const defaultCategories = [
  { id: "combos", name: "Promos do Dia" },
  { id: "pizzas-salgadas", name: "Pizzas Salgadas" },
  { id: "pizzas-doces", name: "Pizzas Doces" },
  { id: "bebidas", name: "Bebidas" }
];

const defaultProducts = [
  {
    id: "combo-familia",
    nome: "Combo Família Todo Dia",
    categoria: "combos",
    descricao: "2 Pizzas Grandes (até 4 sabores) + 1 Borda Recheada à escolha + 1 Guaraná Antarctica 2 Litros trincando de gelado.",
    preco: 109.90,
    preco_grande: 109.90,
    preco_media: 89.90,
    preco_broto: 0,
    badge: "Combo Destaque",
    img_url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "combo-individual",
    nome: "Combo Individual",
    categoria: "combos",
    descricao: "1 Pizza Broto (4 fatias) + 1 Porção de Pão de Alho (4un) + 1 Refrigerante Lata 350ml.",
    preco: 34.90,
    preco_grande: 0,
    preco_media: 0,
    preco_broto: 34.90,
    badge: "Promoção",
    img_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "pizza-pepperoni",
    nome: "Pepperoni Especial",
    categoria: "pizzas-salgadas",
    descricao: "Molho de tomate artesanal da casa, generosa camada de mussarela derretida e fatias crocantes de pepperoni.",
    preco: 64.90,
    preco_grande: 64.90,
    preco_media: 49.90,
    preco_broto: 36.90,
    badge: "Mais Pedida",
    img_url: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "pizza-pepperoni-requeijao",
    nome: "Pepperoni com Requeijão Cremoso",
    categoria: "pizzas-salgadas",
    descricao: "Fatias crocantes de pepperoni combinadas com fios generosos de requeijão cremoso e mussarela derretida.",
    preco: 68.90,
    preco_grande: 68.90,
    preco_media: 53.90,
    preco_broto: 39.90,
    badge: "",
    img_url: "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "pizza-calabresa",
    nome: "Calabresa com Cebola Roxa",
    categoria: "pizzas-salgadas",
    descricao: "Calabresa defumada selecionada fatiada fininha, cebola roxa fresca, azeitonas pretas e orégano sobre mussarela.",
    preco: 59.90,
    preco_grande: 59.90,
    preco_media: 46.90,
    preco_broto: 34.90,
    badge: "",
    img_url: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "pizza-supreme",
    nome: "Pizza Suprema Todo Dia",
    categoria: "pizzas-salgadas",
    descricao: "A receita da casa! Pepperoni, carne moída temperada, pimentão verde crocante, cebola fresca e cogumelos.",
    preco: 72.90,
    preco_grande: 72.90,
    preco_media: 56.90,
    preco_broto: 42.90,
    badge: "Especialidade",
    img_url: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "pizza-frango-requeijao",
    nome: "Frango com Catupiry Original",
    categoria: "pizzas-salgadas",
    descricao: "Peito de frango desfiaudinho bem temperado, milho verde e camada generosa do autêntico Catupiry cremoso.",
    preco: 64.90,
    preco_grande: 64.90,
    preco_media: 49.90,
    preco_broto: 37.90,
    badge: "",
    img_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "pizza-4queijos",
    nome: "Quatro Queijos Premium",
    categoria: "pizzas-salgadas",
    descricao: "Harmonia perfeita de Mussarela, Provolone defumado, Gorgonzola aveludado e Requeijão cremoso.",
    preco: 66.90,
    preco_grande: 66.90,
    preco_media: 51.90,
    preco_broto: 38.90,
    badge: "",
    img_url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "pizza-doce-nutella",
    nome: "Nutella com Morango",
    categoria: "pizzas-doces",
    descricao: "Massa crocante assada no forno coberta com uma generosa camada de Nutella® cremosa e morangos frescos fatiados.",
    preco: 58.90,
    preco_grande: 58.90,
    preco_media: 46.90,
    preco_broto: 36.90,
    badge: "Doce Mais Pedida",
    img_url: "https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "bebida-coca-2l",
    nome: "Coca-Cola Garrafa 2L",
    categoria: "bebidas",
    descricao: "Garrafa 2 Litros trincando de gelada.",
    preco: 14.90,
    preco_grande: 14.90,
    preco_media: 0,
    preco_broto: 0,
    badge: "",
    img_url: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "bebida-guarana-2l",
    nome: "Guaraná Antarctica Garrafa 2L",
    categoria: "bebidas",
    descricao: "Garrafa 2 Litros super gelada.",
    preco: 12.90,
    preco_grande: 12.90,
    preco_media: 0,
    preco_broto: 0,
    badge: "",
    img_url: "https://images.unsplash.com/photo-1581006852262-e4307cf6283a?auto=format&fit=crop&w=800&q=80"
  }
];

let currentBranding = {};
let currentCategories = [];
let currentProducts = [];
let currentDeliveryZones = [];
let pendingLogoBase64 = '';
let pendingBannerDeskBase64 = '';
let pendingBannerMobBase64 = '';
let pendingProductImgBase64 = '';

document.addEventListener('DOMContentLoaded', () => {
  loadAdminSettings();
  renderAdminTable();
  renderCategoriesUI();
  renderDeliveryZonesUI();
  updateStats();
  initDragAndDropHandlers();
});

function applyUnifiedBrandingVariables(primaryColor, darkColor) {
  if (primaryColor) {
    document.documentElement.style.setProperty('--ph-red', primaryColor);
  }
  if (darkColor) {
    document.documentElement.style.setProperty('--ph-red-dark', darkColor);
  }
}

function loadAdminSettings() {
  const savedBranding = localStorage.getItem(STORAGE_KEY_BRANDING);
  currentBranding = savedBranding ? JSON.parse(savedBranding) : { ...defaultBranding };

  const savedCategories = localStorage.getItem(STORAGE_KEY_CATEGORIES);
  currentCategories = savedCategories ? JSON.parse(savedCategories) : [ ...defaultCategories ];

  const savedProducts = localStorage.getItem(STORAGE_KEY_PRODUCTS);
  currentProducts = savedProducts ? JSON.parse(savedProducts) : [ ...defaultProducts ];

  const savedZones = localStorage.getItem(STORAGE_KEY_DELIVERY_ZONES);
  currentDeliveryZones = savedZones ? JSON.parse(savedZones) : [ ...defaultDeliveryZones ];

  document.getElementById('cfgStoreName').value = currentBranding.storeName || '';
  document.getElementById('cfgStoreSub').value = currentBranding.storeSub || '';
  document.getElementById('cfgWppNumber').value = currentBranding.wppNumber || '';
  document.getElementById('cfgFrete').value = currentBranding.frete || 5.00;
  document.getElementById('cfgPrimaryColor').value = currentBranding.primaryColor || '#E91C24';
  document.getElementById('cfgPrimaryColorPicker').value = currentBranding.primaryColor || '#E91C24';
  document.getElementById('cfgDarkColor').value = currentBranding.darkColor || '#C50303';
  document.getElementById('cfgDarkColorPicker').value = currentBranding.darkColor || '#C50303';
  document.getElementById('cfgCoverageCities').value = currentBranding.coverageCities || 'Porto Alegre, Viamão';

  applyUnifiedBrandingVariables(currentBranding.primaryColor, currentBranding.darkColor);

  if (currentBranding.logoUrl) {
    pendingLogoBase64 = currentBranding.logoUrl;
    const preview = document.getElementById('logoFilePreview');
    if (preview) {
      preview.src = currentBranding.logoUrl;
      preview.style.display = 'block';
    }
  }

  if (currentBranding.bannerDeskUrl) {
    pendingBannerDeskBase64 = currentBranding.bannerDeskUrl;
    const preview = document.getElementById('bannerDeskPreview');
    if (preview) {
      preview.src = currentBranding.bannerDeskUrl;
      preview.style.display = 'block';
    }
  }

  if (currentBranding.bannerMobUrl) {
    pendingBannerMobBase64 = currentBranding.bannerMobUrl;
    const preview = document.getElementById('bannerMobPreview');
    if (preview) {
      preview.src = currentBranding.bannerMobUrl;
      preview.style.display = 'block';
    }
  }

  document.getElementById('adminStoreTitleDisplay').innerText = currentBranding.storeName || 'Sua Loja';
  document.getElementById('currentWppDisplay').innerText = currentBranding.wppNumber || 'Não cadastrado';
}

function resetBrandingToDefault() {
  if (confirm('Deseja restaurar as configurações originais da marca Pizza Todo Dia?')) {
    localStorage.removeItem(STORAGE_KEY_BRANDING);
    localStorage.removeItem(STORAGE_KEY_CATEGORIES);
    localStorage.removeItem(STORAGE_KEY_PRODUCTS);
    localStorage.removeItem(STORAGE_KEY_DELIVERY_ZONES);
    loadAdminSettings();
    renderAdminTable();
    renderCategoriesUI();
    renderDeliveryZonesUI();
    alert('Configurações da Pizza Todo Dia restauradas com sucesso!');
  }
}

function renderDeliveryZonesUI() {
  const tbody = document.getElementById('deliveryZonesTableBody');
  if (!tbody) return;

  if (currentDeliveryZones.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="3" style="text-align: center; color: #888; padding: 14px;">
          Nenhum bairro/região cadastrado ainda. Use o formulário acima para adicionar.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = currentDeliveryZones.map(zone => `
    <tr>
      <td><strong>${zone.name}</strong></td>
      <td class="td-price">R$ ${zone.price.toFixed(2).replace('.', ',')}</td>
      <td>
        <button class="btn-admin btn-admin-danger" onclick="deleteDeliveryZone('${zone.id}')">Excluir</button>
      </td>
    </tr>
  `).join('');

  updateStats();
}

function addNewDeliveryZone(event) {
  event.preventDefault();
  const nameInput = document.getElementById('newZoneNameInput');
  const priceInput = document.getElementById('newZonePriceInput');

  const name = nameInput.value.trim();
  const price = parseFloat(priceInput.value) || 0;

  if (!name) return;

  const newZoneId = 'z-' + Date.now();
  currentDeliveryZones.push({ id: newZoneId, name: name, price: price });

  localStorage.setItem(STORAGE_KEY_DELIVERY_ZONES, JSON.stringify(currentDeliveryZones));

  nameInput.value = '';
  priceInput.value = '';
  renderDeliveryZonesUI();
  alert(`Região "${name}" (R$ ${price.toFixed(2)}) cadastrada com sucesso!`);
}

function deleteDeliveryZone(zoneId) {
  if (confirm('Deseja excluir esta taxa de entrega?')) {
    currentDeliveryZones = currentDeliveryZones.filter(z => z.id !== zoneId);
    localStorage.setItem(STORAGE_KEY_DELIVERY_ZONES, JSON.stringify(currentDeliveryZones));
    renderDeliveryZonesUI();
  }
}

function renderCategoriesUI() {
  const container = document.getElementById('categoriesListContainer');
  if (container) {
    container.innerHTML = currentCategories.map(cat => `
      <div style="background: var(--ph-gray-bg); padding: 8px 14px; border-radius: 4px; display: flex; align-items: center; gap: 10px; border: 2px solid var(--ph-black);">
        <span style="font-weight: 800; font-size: 0.82rem; text-transform: uppercase;">${cat.name}</span>
        <button onclick="deleteCategory('${cat.id}')" style="background: none; border: none; color: #E53935; font-weight: 900; cursor: pointer; padding: 2px 4px;">✕</button>
      </div>
    `).join('');
  }

  const select = document.getElementById('prodCategory');
  if (select) {
    select.innerHTML = currentCategories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
  }

  updateStats();
}

function addNewCategory(event) {
  event.preventDefault();
  const input = document.getElementById('newCategoryInput');
  const catName = input.value.trim();
  if (!catName) return;

  const catId = 'cat-' + catName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  
  if (currentCategories.some(c => c.id === catId || c.name.toLowerCase() === catName.toLowerCase())) {
    alert('Esta categoria já existe!');
    return;
  }

  currentCategories.push({ id: catId, name: catName });
  localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(currentCategories));

  input.value = '';
  renderCategoriesUI();
  alert(`Categoria "${catName}" adicionada com sucesso!`);
}

function deleteCategory(catId) {
  if (confirm('Deseja excluir esta categoria? Os produtos vinculados a ela permanecerão salvos.')) {
    currentCategories = currentCategories.filter(c => c.id !== catId);
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(currentCategories));
    renderCategoriesUI();
  }
}

function initDragAndDropHandlers() {
  setupDropZone('logoDropZone', (file) => {
    processFileToBase64(file, (base64) => {
      pendingLogoBase64 = base64;
      const preview = document.getElementById('logoFilePreview');
      if (preview) {
        preview.src = base64;
        preview.style.display = 'block';
      }
    });
  });

  setupDropZone('bannerDeskDropZone', (file) => {
    processFileToBase64(file, (base64) => {
      pendingBannerDeskBase64 = base64;
      const preview = document.getElementById('bannerDeskPreview');
      if (preview) {
        preview.src = base64;
        preview.style.display = 'block';
      }
    });
  });

  setupDropZone('bannerMobDropZone', (file) => {
    processFileToBase64(file, (base64) => {
      pendingBannerMobBase64 = base64;
      const preview = document.getElementById('bannerMobPreview');
      if (preview) {
        preview.src = base64;
        preview.style.display = 'block';
      }
    });
  });

  setupDropZone('productDropZone', (file) => {
    processFileToBase64(file, (base64) => {
      pendingProductImgBase64 = base64;
      const preview = document.getElementById('prodFilePreview');
      if (preview) {
        preview.src = base64;
        preview.style.display = 'block';
      }
    });
  });
}

function setupDropZone(zoneId, callback) {
  const zone = document.getElementById(zoneId);
  if (!zone) return;

  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    zone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
    }, false);
  });

  ['dragenter', 'dragover'].forEach(eventName => {
    zone.addEventListener(eventName, () => zone.classList.add('dragover'), false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    zone.addEventListener(eventName, () => zone.classList.remove('dragover'), false);
  });

  zone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files && files[0]) {
      callback(files[0]);
    }
  }, false);
}

function processFileToBase64(file, callback) {
  if (!file.type.startsWith('image/')) {
    alert('Por favor, selecione apenas arquivos de imagem (.png, .jpg, .jpeg, .webp).');
    return;
  }
  const reader = new FileReader();
  reader.onload = function(e) {
    callback(e.target.result);
  };
  reader.readAsDataURL(file);
}

function previewLogoFileUpload(input) {
  if (input.files && input.files[0]) {
    processFileToBase64(input.files[0], (base64) => {
      pendingLogoBase64 = base64;
      const preview = document.getElementById('logoFilePreview');
      if (preview) {
        preview.src = base64;
        preview.style.display = 'block';
      }
    });
  }
}

function previewBannerDeskUpload(input) {
  if (input.files && input.files[0]) {
    processFileToBase64(input.files[0], (base64) => {
      pendingBannerDeskBase64 = base64;
      const preview = document.getElementById('bannerDeskPreview');
      if (preview) {
        preview.src = base64;
        preview.style.display = 'block';
      }
    });
  }
}

function previewBannerMobUpload(input) {
  if (input.files && input.files[0]) {
    processFileToBase64(input.files[0], (base64) => {
      pendingBannerMobBase64 = base64;
      const preview = document.getElementById('bannerMobPreview');
      if (preview) {
        preview.src = base64;
        preview.style.display = 'block';
      }
    });
  }
}

function previewProductFileUpload(input) {
  if (input.files && input.files[0]) {
    processFileToBase64(input.files[0], (base64) => {
      pendingProductImgBase64 = base64;
      const preview = document.getElementById('prodFilePreview');
      if (preview) {
        preview.src = base64;
        preview.style.display = 'block';
      }
    });
  }
}

function saveBrandingConfig(event) {
  event.preventDefault();

  currentBranding.storeName = document.getElementById('cfgStoreName').value.trim();
  currentBranding.storeSub = document.getElementById('cfgStoreSub').value.trim();
  currentBranding.wppNumber = document.getElementById('cfgWppNumber').value.trim().replace(/\D/g, '');
  currentBranding.frete = parseFloat(document.getElementById('cfgFrete').value) || 5.00;
  currentBranding.primaryColor = document.getElementById('cfgPrimaryColor').value.trim();
  currentBranding.darkColor = document.getElementById('cfgDarkColor').value.trim();
  currentBranding.coverageCities = document.getElementById('cfgCoverageCities').value.trim();

  if (pendingLogoBase64) {
    currentBranding.logoUrl = pendingLogoBase64;
  }

  if (pendingBannerDeskBase64) {
    currentBranding.bannerDeskUrl = pendingBannerDeskBase64;
  }

  if (pendingBannerMobBase64) {
    currentBranding.bannerMobUrl = pendingBannerMobBase64;
  }

  applyUnifiedBrandingVariables(currentBranding.primaryColor, currentBranding.darkColor);

  localStorage.setItem(STORAGE_KEY_BRANDING, JSON.stringify(currentBranding));

  document.getElementById('adminStoreTitleDisplay').innerText = currentBranding.storeName;
  document.getElementById('currentWppDisplay').innerText = currentBranding.wppNumber;

  alert('Configurações salvas com sucesso! A identidade visual, banners e WhatsApp foram atualizados.');
}

function updateStats() {
  document.getElementById('totalProductsCount').innerText = currentProducts.length;
  document.getElementById('totalCatCount').innerText = currentCategories.length;
  const deliveryCountDisplay = document.getElementById('totalDeliveryZonesCount');
  if (deliveryCountDisplay) deliveryCountDisplay.innerText = currentDeliveryZones.length;
}

function renderAdminTable(dataToRender = currentProducts) {
  const tbody = document.getElementById('adminTableBody');
  if (!tbody) return;

  if (dataToRender.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 20px; color: #888;">
          Nenhum produto cadastrado ainda. Clique em "+ Cadastrar Novo Produto" para adicionar.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = dataToRender.map((item) => {
    const catObj = currentCategories.find(c => c.id === item.categoria);
    const catNameDisplay = catObj ? catObj.name : item.categoria;

    return `
      <tr>
        <td class="td-id">#${item.id}</td>
        <td><img src="${item.img_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=150&q=80'}" class="thumb-img" alt="${item.nome}"></td>
        <td><strong>${item.nome}</strong></td>
        <td><span style="background: #E5E5E5; color: var(--ph-black); padding: 3px 8px; border-radius: 2px; font-weight: 800; font-size: 0.72rem; text-transform: uppercase;">${catNameDisplay}</span></td>
        <td style="max-width: 260px; font-size: 0.8rem; color: #666;">${item.descricao || '-'}</td>
        <td class="td-price">R$ ${(item.preco_grande || item.preco || 0).toFixed(2).replace('.', ',')}</td>
        <td>
          <div style="display: flex; gap: 6px;">
            <button class="btn-admin" onclick="editProductItem('${item.id}')">Editar</button>
            <button class="btn-admin btn-admin-danger" onclick="deleteProductItem('${item.id}')">Excluir</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  updateStats();
}

function filterAdminTable(query) {
  const q = query.toLowerCase();
  const filtered = currentProducts.filter(item =>
    item.nome.toLowerCase().includes(q) ||
    item.categoria.toLowerCase().includes(q) ||
    (item.descricao && item.descricao.toLowerCase().includes(q))
  );
  renderAdminTable(filtered);
}

function switchAdminTab(tabName) {
  document.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active'));
  document.getElementById('tabContentBranding').style.display = 'none';
  document.getElementById('tabContentDelivery').style.display = 'none';
  document.getElementById('tabContentCategories').style.display = 'none';
  document.getElementById('tabContentItems').style.display = 'none';

  if (tabName === 'branding') {
    document.querySelectorAll('.nav-tab')[0].classList.add('active');
    document.getElementById('tabContentBranding').style.display = 'block';
  } else if (tabName === 'delivery') {
    document.querySelectorAll('.nav-tab')[1].classList.add('active');
    document.getElementById('tabContentDelivery').style.display = 'block';
  } else if (tabName === 'categories') {
    document.querySelectorAll('.nav-tab')[2].classList.add('active');
    document.getElementById('tabContentCategories').style.display = 'block';
  } else {
    document.querySelectorAll('.nav-tab')[3].classList.add('active');
    document.getElementById('tabContentItems').style.display = 'block';
  }
}

function openAddProductModal() {
  document.getElementById('productModalTitle').innerText = 'NOVO PRODUTO';
  document.getElementById('prodEditId').value = '';
  document.getElementById('productForm').reset();
  pendingProductImgBase64 = '';
  const preview = document.getElementById('prodFilePreview');
  if (preview) preview.style.display = 'none';
  renderCategoriesUI();
  document.getElementById('productFormModal').classList.add('active');
}

function closeProductFormModal() {
  document.getElementById('productFormModal').classList.remove('active');
}

function editProductItem(id) {
  const item = currentProducts.find(p => p.id === id);
  if (!item) return;

  renderCategoriesUI();

  document.getElementById('productModalTitle').innerText = 'EDITAR PRODUTO';
  document.getElementById('prodEditId').value = item.id;
  document.getElementById('prodName').value = item.nome;
  document.getElementById('prodCategory').value = item.categoria;
  document.getElementById('prodPrice').value = item.preco_grande || item.preco || 0;
  document.getElementById('prodDesc').value = item.descricao || '';
  document.getElementById('prodBadge').value = item.badge || '';

  pendingProductImgBase64 = item.img_url || '';
  const preview = document.getElementById('prodFilePreview');
  if (preview && item.img_url) {
    preview.src = item.img_url;
    preview.style.display = 'block';
  }

  document.getElementById('productFormModal').classList.add('active');
}

function saveProductItem(event) {
  event.preventDefault();

  const editId = document.getElementById('prodEditId').value;
  const name = document.getElementById('prodName').value.trim();
  const category = document.getElementById('prodCategory').value;
  const price = parseFloat(document.getElementById('prodPrice').value) || 0;
  const desc = document.getElementById('prodDesc').value.trim();
  const badge = document.getElementById('prodBadge').value.trim();
  const imgUrl = pendingProductImgBase64 || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';

  if (editId) {
    const idx = currentProducts.findIndex(p => p.id === editId);
    if (idx !== -1) {
      currentProducts[idx] = {
        ...currentProducts[idx],
        nome: name,
        categoria: category,
        preco: price,
        preco_grande: price,
        descricao: desc,
        img_url: imgUrl,
        badge: badge
      };
    }
  } else {
    const newId = 'prod-' + Date.now();
    currentProducts.push({
      id: newId,
      nome: name,
      categoria: category,
      preco: price,
      preco_grande: price,
      preco_media: price,
      preco_broto: price,
      descricao: desc,
      img_url: imgUrl,
      badge: badge
    });
  }

  localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(currentProducts));

  closeProductFormModal();
  renderAdminTable();
  alert('Produto salvo com sucesso no cardápio!');
}

function deleteProductItem(id) {
  if (confirm('Tem certeza que deseja excluir este produto do cardápio?')) {
    currentProducts = currentProducts.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(currentProducts));
    renderAdminTable();
  }
}