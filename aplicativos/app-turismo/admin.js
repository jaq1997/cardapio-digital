/* ==========================================================================
   ADMIN ENGINE — PAINEL ADMINISTRATIVO (EVOLUX360 / WHITE-LABEL)
   ========================================================================== */

let currentBranding = {};
let currentCategories = [];
let currentProducts = [];
let currentDeliveryZones = [];
let currentCoupons = [];
let tempProductImgBase64 = '';
let tempLogoBase64 = '';
let tempBannerDeskBase64 = '';
let tempBannerMobBase64 = '';

function normalizeCategoryNames(value) {
  if (Array.isArray(value)) {
    return value.map(v => String(v || '').trim()).filter(Boolean);
  }
  if (typeof value === 'string') {
    return value.split(',').map(v => v.trim()).filter(Boolean);
  }
  return [];
}

function getProductCategoryNames(product) {
  return normalizeCategoryNames(product?.categorias || product?.categoria);
}

function productMatchesCategory(product, targetName) {
  const names = getProductCategoryNames(product).map(name => String(name).toLowerCase().trim());
  const target = String(targetName || '').toLowerCase().trim();
  return names.includes(target);
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadAdminSettings();
  renderAdminTable();
  renderCategoriesUI();
  renderDeliveryZonesUI();
  renderCouponsUI();
});

async function loadAdminSettings() {
  try {
    currentBranding      = (await DbService.getBranding()) || {};
    currentCategories    = (await DbService.getCategories()) || [];
    currentProducts      = (await DbService.getProducts()) || [];
    currentDeliveryZones = (await DbService.getDeliveryZones()) || [];
    currentCoupons       = (await DbService.getCoupons()) || [];

    // Preenche campos de identidade
    const getEl = id => document.getElementById(id);
    if (getEl('cfgStoreName')) getEl('cfgStoreName').value = currentBranding.storeName || '';
    if (getEl('cfgStoreSub')) getEl('cfgStoreSub').value = currentBranding.storeSub || '';
    if (getEl('cfgStoreAddress')) getEl('cfgStoreAddress').value = currentBranding.storeAddress || '';
    if (getEl('cfgStoreHours')) getEl('cfgStoreHours').value = currentBranding.storeHours || '';
    if (getEl('cfgWppNumber')) getEl('cfgWppNumber').value = currentBranding.wppNumber || '';

    // Preenche cores da loja
    if (getEl('cfgPrimaryColor')) getEl('cfgPrimaryColor').value = currentBranding.primaryColor || '#18181B';
    if (getEl('cfgBtnTextColor')) getEl('cfgBtnTextColor').value = currentBranding.btnTextColor || '#FFFFFF';
    if (getEl('cfgAccentColor')) getEl('cfgAccentColor').value = currentBranding.accentColor || '#6344F5';
    if (getEl('cfgBadgeBgColor')) getEl('cfgBadgeBgColor').value = currentBranding.badgeBgColor || '#F1EEFE';

    // Exibe o e-mail do usuário logado na sidebar e atualiza o link do cardápio com o ID do usuário
    if (window.db && window.db.auth) {
      window.db.auth.getSession().then(({ data }) => {
        if (data && data.session && data.session.user) {
          const userStoreId = data.session.user.id;
          localStorage.setItem('active_store_id', userStoreId);
          const btnView = getEl('btnViewLiveStore');
          if (btnView) btnView.href = `index.html?loja=${userStoreId}`;
          if (getEl('adminUserEmailDisplay')) {
            getEl('adminUserEmailDisplay').innerText = data.session.user.email || 'Administrador';
          }
        } else {
          if (getEl('adminUserEmailDisplay')) getEl('adminUserEmailDisplay').innerText = 'Administrador';
        }
      }).catch(() => {
        if (getEl('adminUserEmailDisplay')) getEl('adminUserEmailDisplay').innerText = 'Administrador';
      });
    } else {
      if (getEl('adminUserEmailDisplay')) getEl('adminUserEmailDisplay').innerText = 'Administrador';
    }

    // Carrega pré-visualização da Logo existente
    if (currentBranding.logoUrl) {
      tempLogoBase64 = currentBranding.logoUrl;
      const imgL = getEl('logoFilePreview');
      const btnL = getEl('btnRemoveLogo');
      if (imgL) { imgL.src = tempLogoBase64; imgL.style.display = 'block'; }
      if (btnL) btnL.style.display = 'inline-flex';
    }

    // Carrega pré-visualizações de banners existentes
    if (currentBranding.bannerDeskUrl) {
      tempBannerDeskBase64 = currentBranding.bannerDeskUrl;
      const imgD = getEl('bannerDeskPreview');
      const btnD = getEl('btnRemoveBannerDesk');
      if (imgD) { imgD.src = tempBannerDeskBase64; imgD.style.display = 'block'; }
      if (btnD) btnD.style.display = 'inline-flex';
    }

    if (currentBranding.bannerMobUrl) {
      tempBannerMobBase64 = currentBranding.bannerMobUrl;
      const imgM = getEl('bannerMobPreview');
      const btnM = getEl('btnRemoveBannerMob');
      if (imgM) { imgM.src = tempBannerMobBase64; imgM.style.display = 'block'; }
      if (btnM) btnM.style.display = 'inline-flex';
    }

    // Preenche contadores na dashboard
    if (getEl('totalProductsCount')) getEl('totalProductsCount').innerText = currentProducts.length;
    if (getEl('totalCatCount')) getEl('totalCatCount').innerText = currentCategories.length;
    if (getEl('totalDeliveryZonesCount')) getEl('totalDeliveryZonesCount').innerText = currentDeliveryZones.length;

    populateCategorySelect();
  } catch (e) {
    console.error('[Admin] Erro ao carregar configurações:', e);
  }
}

/* -------------------------------------------------------------------------
   NAVEGAÇÃO POR ABAS DO ADMIN
------------------------------------------------------------------------- */
function switchAdminTab(tabName, clickedBtn) {
  const formattedName = tabName.charAt(0).toUpperCase() + tabName.slice(1);
  const targetId = 'tabContent' + formattedName;

  const tabIds = [
    'tabContentDashboard',
    'tabContentItems',
    'tabContentCategories',
    'tabContentDelivery',
    'tabContentCoupons',
    'tabContentBranding'
  ];

  tabIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });

  const targetEl = document.getElementById(targetId);
  if (targetEl) targetEl.style.display = 'block';

  document.querySelectorAll('.nav-tab').forEach(btn => btn.classList.remove('active'));
  if (clickedBtn) {
    clickedBtn.classList.add('active');
  } else {
    const navBtn = document.querySelector(`.nav-tab[onclick*="${tabName}"]`);
    if (navBtn) navBtn.classList.add('active');
  }
}

/* -------------------------------------------------------------------------
   1. PRODUTOS (GRID CLEAN DE CARDS NO ADMIN)
------------------------------------------------------------------------- */
function renderAdminTable(productsToRender) {
  const container = document.getElementById('adminProductGridContainer');
  if (!container) return;

  const list = productsToRender || currentProducts;

  if (!list || list.length === 0) {
    container.innerHTML = '<div style="grid-column: 1/-1; padding: 40px; text-align: center; color: #71717A; background: #FFF; border: 1px solid #E4E4E7; border-radius: 12px;">Nenhum produto cadastrado no cardápio.</div>';
    return;
  }

  container.innerHTML = list.map(p => {
    const priceVal = parseFloat(p.preco || p.preco_grande || 0);
    const categoryNames = getProductCategoryNames(p);
    const categoryBadges = categoryNames.length
      ? categoryNames.map(cat => `<span style="display: inline-flex; align-items: center; background: #F4F4F7; color: #18181B; border: 1px solid #E4E4E7; padding: 2px 8px; border-radius: 999px; font-size: 0.68rem; font-weight: 700; text-transform: uppercase;">${cat}</span>`).join('')
      : '<span style="display: inline-flex; align-items: center; background: #F4F4F7; color: #71717A; border: 1px solid #E4E4E7; padding: 2px 8px; border-radius: 999px; font-size: 0.68rem; font-weight: 700;">Sem categoria</span>';
    const imgUrl = p.img_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';

    return `
      <div class="admin-prod-card" style="background: #FFFFFF; border: 1px solid #E4E4E7; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; justify-space-between;">
        <div style="height: 140px; overflow: hidden; background: #FAFAFC; position: relative;">
          <img src="${imgUrl}" alt="${p.nome}" style="width: 100%; height: 100%; object-fit: cover;">
          ${p.badge ? `<span style="position: absolute; top: 8px; left: 8px; background: #6344F5; color: #FFF; font-size: 0.7rem; font-weight: 700; padding: 2px 8px; border-radius: 4px;">${p.badge}</span>` : ''}
        </div>
        <div style="padding: 16px; flex: 1; display: flex; flex-direction: column; justify-space-between;">
          <div>
            <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px;">${categoryBadges}</div>
            <h4 style="font-size: 1rem; font-weight: 800; color: #18181B; margin: 4px 0 6px;">${p.nome}</h4>
            <p style="font-size: 0.82rem; color: #71717A; line-height: 1.3; margin: 0 0 12px;">${p.descricao || ''}</p>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #F4F4F7; padding-top: 12px; margin-top: 8px;">
            <span style="font-weight: 800; font-size: 1.1rem; color: #18181B;">R$ ${priceVal.toFixed(2).replace('.', ',')}</span>
            <div style="display: flex; gap: 4px; flex-wrap: wrap;">
              <button class="btn-admin btn-admin-secondary" onclick="editProductItem('${p.id}')" style="padding: 5px 9px; font-size: 0.75rem;">Editar</button>
              <button class="btn-admin btn-admin-secondary" onclick="duplicateProductItem('${p.id}')" style="padding: 5px 9px; font-size: 0.75rem; background: #F1EEFE; color: #6344F5; border: 1px solid #DDD6FE;" title="Duplicar produto para criar tamanhos/porções diferentes">Duplicar</button>
              <button class="btn-admin btn-admin-danger" onclick="deleteProductItem('${p.id}')" style="padding: 5px 9px; font-size: 0.75rem;">Excluir</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function filterAdminCards(query) {
  if (!query) {
    renderAdminTable(currentProducts);
    return;
  }
  const q = query.toLowerCase();
  const filtered = currentProducts.filter(p => {
    const categoryText = getProductCategoryNames(p).join(' ');
    return p.nome.toLowerCase().includes(q) || categoryText.toLowerCase().includes(q);
  });
  renderAdminTable(filtered);
}

function populateCategorySelect(selectedCatNames = []) {
  const container = document.getElementById('prodCategoriesChecklist');
  if (!container) return;

  if (!currentCategories || currentCategories.length === 0) {
    container.innerHTML = '<div style="font-size: 0.78rem; color: #71717A;">Nenhuma categoria cadastrada.</div>';
    return;
  }

  container.innerHTML = currentCategories.map(c => {
    let isChecked = false;
    if (Array.isArray(selectedCatNames)) {
      isChecked = selectedCatNames.some(name => String(name).toLowerCase() === String(c.name).toLowerCase());
    } else if (typeof selectedCatNames === 'string' && selectedCatNames) {
      isChecked = selectedCatNames.toLowerCase().includes(c.name.toLowerCase());
    }

    return `
      <label style="display: flex; align-items: center; gap: 8px; font-size: 0.82rem; color: #18181B; cursor: pointer; font-weight: 500;">
        <input type="checkbox" class="prod-cat-check" value="${c.name}" ${isChecked ? 'checked' : ''} style="accent-color: #6344F5;">
        <span>${c.name}</span>
      </label>
    `;
  }).join('');
}

function toggleCustomPriceFields(show) {
  const box = document.getElementById('customPriceBoxContainer');
  if (box) box.style.display = show ? 'block' : 'none';
}

function openAddProductModal() {
  tempProductImgBase64 = '';
  document.getElementById('productModalTitle').innerText = 'CADASTRAR PRODUTO';
  document.getElementById('prodEditId').value = '';
  document.getElementById('prodName').value = '';
  document.getElementById('prodPrice').value = '';
  document.getElementById('prodDesc').value = '';
  document.getElementById('prodBadge').value = '';
  
  const chkCustom = document.getElementById('prodIsCustom');
  if (chkCustom) chkCustom.checked = false;
  toggleCustomPriceFields(false);
  if (document.getElementById('prodCustomLabel')) document.getElementById('prodCustomLabel').value = '';
  if (document.getElementById('prodCustomValue')) document.getElementById('prodCustomValue').value = '';

  if (document.getElementById('prodImageUrlInput')) document.getElementById('prodImageUrlInput').value = '';
  document.getElementById('adicionaisContainer').innerHTML = '';
  
  populateCategorySelect([]);
  removeProductPhoto();
  document.getElementById('productFormModal').classList.add('active');
}

function closeProductFormModal() {
  document.getElementById('productFormModal').classList.remove('active');
}

function previewProductFileUpload(input) {
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      tempProductImgBase64 = e.target.result;
      const img = document.getElementById('prodFilePreview');
      const btnRem = document.getElementById('btnRemoveProdImg');
      if (img) {
        img.src = tempProductImgBase64;
        img.style.display = 'block';
      }
      if (btnRem) btnRem.style.display = 'flex';
    };
    reader.readAsDataURL(file);
  }
}

function removeProductPhoto() {
  tempProductImgBase64 = '';
  const fileInput = document.getElementById('prodFile');
  const urlInput = document.getElementById('prodImageUrlInput');
  const img = document.getElementById('prodFilePreview');
  const btnRem = document.getElementById('btnRemoveProdImg');
  if (fileInput) fileInput.value = '';
  if (urlInput) urlInput.value = '';
  if (img) {
    img.src = '';
    img.style.display = 'none';
  }
  if (btnRem) btnRem.style.display = 'none';
}

function compressImageFile(file, maxWidth = 1200, maxHeight = 800, quality = 0.82) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        resolve(canvas.toDataURL(mime, quality));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

let isLogoExplicitlyRemoved = false;
let isBannerDeskExplicitlyRemoved = false;
let isBannerMobExplicitlyRemoved = false;

/* UPLOAD E REMOÇÃO DE LOGO */
async function previewLogoFileUpload(input) {
  if (input.files && input.files[0]) {
    isLogoExplicitlyRemoved = false;
    tempLogoBase64 = await compressImageFile(input.files[0], 500, 500, 0.9);
    const img = document.getElementById('logoFilePreview');
    const btnRem = document.getElementById('btnRemoveLogo');
    if (img) { img.src = tempLogoBase64; img.style.display = 'block'; }
    if (btnRem) btnRem.style.display = 'inline-flex';
  }
}

function removeLogo() {
  tempLogoBase64 = '';
  isLogoExplicitlyRemoved = true;
  if (currentBranding) currentBranding.logoUrl = '';
  const fileInput = document.getElementById('cfgLogoFile');
  const img = document.getElementById('logoFilePreview');
  const btnRem = document.getElementById('btnRemoveLogo');
  if (fileInput) fileInput.value = '';
  if (img) { img.src = ''; img.style.display = 'none'; }
  if (btnRem) btnRem.style.display = 'none';
}

/* UPLOAD E REMOÇÃO DE BANNERS */
async function previewBannerDeskUpload(input) {
  if (input.files && input.files[0]) {
    isBannerDeskExplicitlyRemoved = false;
    tempBannerDeskBase64 = await compressImageFile(input.files[0], 1200, 600, 0.82);
    const img = document.getElementById('bannerDeskPreview');
    const btnRem = document.getElementById('btnRemoveBannerDesk');
    if (img) { img.src = tempBannerDeskBase64; img.style.display = 'block'; }
    if (btnRem) btnRem.style.display = 'inline-flex';
  }
}

function removeBannerDesk() {
  tempBannerDeskBase64 = '';
  isBannerDeskExplicitlyRemoved = true;
  if (currentBranding) currentBranding.bannerDeskUrl = '';
  const fileInput = document.getElementById('cfgBannerDeskFile');
  const img = document.getElementById('bannerDeskPreview');
  const btnRem = document.getElementById('btnRemoveBannerDesk');
  if (fileInput) fileInput.value = '';
  if (img) { img.src = ''; img.style.display = 'none'; }
  if (btnRem) btnRem.style.display = 'none';
}

async function previewBannerMobUpload(input) {
  if (input.files && input.files[0]) {
    isBannerMobExplicitlyRemoved = false;
    tempBannerMobBase64 = await compressImageFile(input.files[0], 800, 800, 0.82);
    const img = document.getElementById('bannerMobPreview');
    const btnRem = document.getElementById('btnRemoveBannerMob');
    if (img) { img.src = tempBannerMobBase64; img.style.display = 'block'; }
    if (btnRem) btnRem.style.display = 'inline-flex';
  }
}

function removeBannerMob() {
  tempBannerMobBase64 = '';
  isBannerMobExplicitlyRemoved = true;
  if (currentBranding) currentBranding.bannerMobUrl = '';
  const fileInput = document.getElementById('cfgBannerMobFile');
  const img = document.getElementById('bannerMobPreview');
  const btnRem = document.getElementById('btnRemoveBannerMob');
  if (fileInput) fileInput.value = '';
  if (img) { img.src = ''; img.style.display = 'none'; }
  if (btnRem) btnRem.style.display = 'none';
}

function removeBannerMob() {
  tempBannerMobBase64 = '';
  const fileInput = document.getElementById('cfgBannerMobFile');
  const img = document.getElementById('bannerMobPreview');
  const btnRem = document.getElementById('btnRemoveBannerMob');
  if (fileInput) fileInput.value = '';
  if (img) { img.src = ''; img.style.display = 'none'; }
  if (btnRem) btnRem.style.display = 'none';
}

function addAdicionalInputRow(nome = '', preco = '') {
  const container = document.getElementById('adicionaisContainer');
  if (!container) return;

  const div = document.createElement('div');
  div.className = 'adicional-row';
  div.style.cssText = 'display: flex; gap: 8px; margin-bottom: 8px; align-items: center;';
  div.innerHTML = `
    <input type="text" class="admin-input adic-nome" placeholder="Nome do opcional (ex: Queijo Extra)" value="${nome}" style="flex: 2;">
    <input type="number" step="0.50" class="admin-input adic-preco" placeholder="Preço R$" value="${preco}" style="flex: 1;">
    <button type="button" class="btn-admin btn-admin-danger" onclick="this.parentElement.remove()" style="padding: 6px 10px;">✕</button>
  `;
  container.appendChild(div);
}

function editProductItem(id) {
  const item = currentProducts.find(p => String(p.id) === String(id));
  if (!item) return;

  document.getElementById('productModalTitle').innerText = 'EDITAR PRODUTO';
  document.getElementById('prodEditId').value = item.id;
  document.getElementById('prodName').value = item.nome || '';
  document.getElementById('prodPrice').value = parseFloat(item.preco || item.preco_grande || 0) || 0;
  document.getElementById('prodDesc').value = item.descricao || '';
  document.getElementById('prodBadge').value = item.badge || '';

  const isCustom = !!item.is_custom;
  const chkCustom = document.getElementById('prodIsCustom');
  if (chkCustom) {
    chkCustom.checked = isCustom;
    toggleCustomPriceFields(isCustom);
  }
  if (document.getElementById('prodCustomLabel')) document.getElementById('prodCustomLabel').value = item.custom_label || '';
  if (document.getElementById('prodCustomValue')) document.getElementById('prodCustomValue').value = item.custom_value || '';

  const catVal = getProductCategoryNames(item);
  populateCategorySelect(catVal);

  tempProductImgBase64 = item.img_url || '';
  if (document.getElementById('prodImageUrlInput')) {
    document.getElementById('prodImageUrlInput').value = (tempProductImgBase64.startsWith('http') ? tempProductImgBase64 : '');
  }
  const img = document.getElementById('prodFilePreview');
  const btnRem = document.getElementById('btnRemoveProdImg');
  if (tempProductImgBase64 && img) {
    img.src = tempProductImgBase64;
    img.style.display = 'block';
    if (btnRem) btnRem.style.display = 'flex';
  } else {
    removeProductPhoto();
  }

  const adicContainer = document.getElementById('adicionaisContainer');
  adicContainer.innerHTML = '';
  let adics = item.adicionais;
  if (typeof adics === 'string') { try { adics = JSON.parse(adics); } catch(e) { adics = []; } }
  if (Array.isArray(adics)) adics.forEach(a => addAdicionalInputRow(a.nome, a.preco));

  document.getElementById('productFormModal').classList.add('active');
}

function duplicateProductItem(id) {
  const item = currentProducts.find(p => String(p.id) === String(id));
  if (!item) return;

  document.getElementById('productModalTitle').innerText = 'DUPLICAR PRODUTO';
  document.getElementById('prodEditId').value = '';
  document.getElementById('prodName').value = (item.nome || '') + ' (Cópia)';
  document.getElementById('prodPrice').value = parseFloat(item.preco || item.preco_grande || 0) || 0;
  document.getElementById('prodDesc').value = item.descricao || '';
  document.getElementById('prodBadge').value = item.badge || '';

  const catVal = item.categorias || item.categoria || [];
  populateCategorySelect(catVal);

  tempProductImgBase64 = item.img_url || '';
  if (document.getElementById('prodImageUrlInput')) {
    document.getElementById('prodImageUrlInput').value = (tempProductImgBase64.startsWith('http') ? tempProductImgBase64 : '');
  }
  const img = document.getElementById('prodFilePreview');
  const btnRem = document.getElementById('btnRemoveProdImg');
  if (tempProductImgBase64 && img) {
    img.src = tempProductImgBase64;
    img.style.display = 'block';
    if (btnRem) btnRem.style.display = 'flex';
  } else {
    removeProductPhoto();
  }

  const adicContainer = document.getElementById('adicionaisContainer');
  adicContainer.innerHTML = '';
  let adics = item.adicionais;
  if (typeof adics === 'string') { try { adics = JSON.parse(adics); } catch(e) { adics = []; } }
  if (Array.isArray(adics)) adics.forEach(a => addAdicionalInputRow(a.nome, a.preco));

  document.getElementById('productFormModal').classList.add('active');
  showToast('Produto duplicado no modal! Ajuste os dados e clique em Salvar.', 'info');
}

async function saveProductItem(event) {
  if (event) event.preventDefault();

  const editId = document.getElementById('prodEditId').value;
  const name = document.getElementById('prodName').value.trim();
  const price = parseFloat(document.getElementById('prodPrice').value) || 0;
  const desc = document.getElementById('prodDesc').value.trim();
  const badge = document.getElementById('prodBadge').value.trim();

  if (!name) {
    showToast('Informe o nome do produto.', 'error');
    return;
  }

  // Coleta Categorias Selecionadas (Multi-seleção)
  const selectedCats = Array.from(document.querySelectorAll('.prod-cat-check:checked')).map(cb => cb.value);
  const categoryStr = selectedCats.join(', ');

  // Coleta Adicionais
  const adicionaisList = [];
  document.querySelectorAll('#adicionaisContainer .adicional-row').forEach(row => {
    const n = row.querySelector('.adic-nome').value.trim();
    const p = parseFloat(row.querySelector('.adic-preco').value) || 0;
    if (n) adicionaisList.push({ nome: n, preco: p });
  });

  // Captura direta da imagem (Upload, URL ou Preview)
  let imgFinal = '';
  const previewImg = document.getElementById('prodFilePreview');
  const urlInput = document.getElementById('prodImageUrlInput');

  if (tempProductImgBase64) {
    imgFinal = tempProductImgBase64;
  } else if (urlInput && urlInput.value.trim()) {
    imgFinal = urlInput.value.trim();
  } else if (previewImg && previewImg.src && previewImg.style.display !== 'none' && !previewImg.src.endsWith('#')) {
    imgFinal = previewImg.src;
  }

  // Coleta Preço Personalizado
  const isCustom = document.getElementById('prodIsCustom') ? document.getElementById('prodIsCustom').checked : false;
  const customLabel = document.getElementById('prodCustomLabel') ? document.getElementById('prodCustomLabel').value.trim() : '';
  const customValue = document.getElementById('prodCustomValue') ? document.getElementById('prodCustomValue').value.trim() : '';

  const candidate = {
    id: editId || ('prod-' + Date.now()),
    nome: name,
    categoria: categoryStr,
    categorias: selectedCats,
    preco: price,
    preco_grande: price,
    descricao: desc,
    badge: badge,
    is_custom: isCustom,
    custom_label: customLabel,
    custom_value: customValue,
    img_url: imgFinal,
    adicionais: adicionaisList,
    status: 'ativo'
  };

  await DbService.upsertProduct(candidate);
  showToast('Produto salvo com sucesso!', 'success');
  closeProductFormModal();

  currentProducts = (await DbService.getProducts()) || [];
  renderAdminTable();
  if (document.getElementById('totalProductsCount')) {
    document.getElementById('totalProductsCount').innerText = currentProducts.length;
  }
}

async function deleteProductItem(id) {
  if (!confirm('Deseja realmente excluir este produto?')) return;

  await DbService.deleteProduct(id);
  showToast('Produto excluído!', 'success');

  currentProducts = (await DbService.getProducts()) || [];
  renderAdminTable();
  if (document.getElementById('totalProductsCount')) {
    document.getElementById('totalProductsCount').innerText = currentProducts.length;
  }
}

/* -------------------------------------------------------------------------
   2. CATEGORIAS (EDITAR, EXCLUIR COM ÍCONE "✕" E VINCULO DE PRODUTOS)
------------------------------------------------------------------------- */
function renderCategoriesUI() {
  const container = document.getElementById('categoriesListContainer');
  if (!container) return;

  if (!currentCategories || currentCategories.length === 0) {
    container.innerHTML = '<div style="padding: 14px; text-align: center; color: #777;">Nenhuma categoria cadastrada.</div>';
    return;
  }

  container.innerHTML = currentCategories.map(c => {
    const countProds = currentProducts.filter(p => productMatchesCategory(p, c.name)).length;
    const isInactive = (c.active === false);

    return `
      <div class="cat-pill-tag" data-id="${c.id}" style="display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px; background: ${isInactive ? '#FEF2F2' : '#F4F4F7'}; border: 1px solid ${isInactive ? '#FCA5A5' : '#E4E4E7'}; border-radius: 8px; font-weight: 600; font-size: 0.88rem; color: #18181B;">
        <span onclick="editCategory('${c.id}')" style="cursor: pointer; ${isInactive ? 'text-decoration: line-through; color: #991B1B;' : ''}" title="Clique para editar (${countProds} produtos vinculados)">
          ${c.name} <small style="color: #6344F5; font-size: 0.75rem;">(${countProds})</small>
          ${isInactive ? '<small style="color:#EF4444; font-size:0.7rem; font-weight:700; margin-left:4px;">[Oculta]</small>' : ''}
        </span>
        <button onclick="editCategory('${c.id}')" title="Editar Categoria" style="background: none; border: none; font-size: 0.8rem; cursor: pointer; color: #6344F5; font-weight: bold; margin-left: 4px;">✎</button>
        <button onclick="deleteCategory('${c.id}')" title="Excluir Categoria" style="background: none; border: none; font-size: 0.95rem; font-weight: bold; cursor: pointer; color: #A1A1AA; display: flex; align-items: center; justify-content: center; padding: 2px; border-radius: 4px; transition: all 0.2s;" onmouseover="this.style.color='#EF4444'" onmouseout="this.style.color='#A1A1AA'">✕</button>
      </div>
    `;
  }).join('');
}

function openAddCategoryModal() {
  const titleEl = document.getElementById('catModalTitle');
  if (titleEl) titleEl.innerText = 'Nova categoria';
  
  document.getElementById('catModalNameInput').value = '';
  document.getElementById('catModalEditName').value = '';
  const statusChk = document.getElementById('catModalStatusInput');
  if (statusChk) statusChk.checked = true;

  populateCatProductsChecklist();
  const modal = document.getElementById('categoryFormModal');
  if (modal) modal.classList.add('active');
}

function editCategory(id) {
  const cat = currentCategories.find(c => String(c.id) === String(id));
  if (!cat) return;

  const titleEl = document.getElementById('catModalTitle');
  if (titleEl) titleEl.innerText = 'Editar categoria';

  document.getElementById('catModalNameInput').value = cat.name;
  document.getElementById('catModalEditName').value = cat.id;

  const statusChk = document.getElementById('catModalStatusInput');
  if (statusChk) statusChk.checked = (cat.active !== false);

  populateCatProductsChecklist(cat.name);
  const modal = document.getElementById('categoryFormModal');
  if (modal) modal.classList.add('active');
}

function populateCatProductsChecklist(currentCatName = '') {
  const checklist = document.getElementById('catModalProductsChecklist');
  if (!checklist) return;

  if (!currentProducts || currentProducts.length === 0) {
    checklist.innerHTML = '<div style="font-size:0.8rem; color:#777;">Nenhum produto cadastrado ainda.</div>';
    return;
  }

  checklist.innerHTML = currentProducts.map(p => {
    const isChecked = (currentCatName && p.categoria === currentCatName);
    return `
      <label style="display:flex; align-items:center; gap:8px; font-size:0.85rem; color:#18181B; cursor:pointer;">
        <input type="checkbox" class="cat-prod-check" value="${p.id}" ${isChecked ? 'checked' : ''} style="accent-color:#6344F5;">
        <span>${p.nome} <small style="color: #71717A;">(${p.categoria || 'Sem categoria'})</small></span>
      </label>
    `;
  }).join('');
}

function closeCategoryModal() {
  const modal = document.getElementById('categoryFormModal');
  if (modal) modal.classList.remove('active');
}

async function saveCategoryWithProducts(event) {
  if (event) event.preventDefault();

  const editId = document.getElementById('catModalEditName').value;
  const name = (document.getElementById('catModalNameInput').value || '').trim();
  const statusChk = document.getElementById('catModalStatusInput');
  const isActive = statusChk ? statusChk.checked : true;

  if (!name) {
    showToast('Digite o nome da categoria.', 'error');
    return;
  }

  const catObj = {
    id: editId || ('cat-' + Date.now()),
    name: name,
    active: isActive,
    position: currentCategories.length + 1
  };

  await DbService.upsertCategory(catObj);

  // Desvincula e vincula produtos selecionados
  const selectedProdIds = Array.from(document.querySelectorAll('.cat-prod-check:checked')).map(cb => cb.value);
  for (let p of currentProducts) {
    let cats = Array.isArray(p.categorias) ? [...p.categorias] : (p.categoria ? p.categoria.split(',').map(s => s.trim()).filter(Boolean) : []);
    if (selectedProdIds.includes(p.id)) {
      if (!cats.includes(name)) {
        cats.push(name);
        p.categoria = cats.join(', ');
        p.categorias = cats;
        await DbService.upsertProduct(p);
      }
    } else if (cats.includes(name) && editId) {
      cats = cats.filter(c => c !== name);
      p.categoria = cats.join(', ');
      p.categorias = cats;
      await DbService.upsertProduct(p);
    }
  }

  showToast('Categoria salva com sucesso!', 'success');
  closeCategoryModal();

  currentCategories = (await DbService.getCategories()) || [];
  currentProducts = (await DbService.getProducts()) || [];
  renderCategoriesUI();
  renderAdminTable();
  populateCategorySelect();
  if (document.getElementById('totalCatCount')) {
    document.getElementById('totalCatCount').innerText = currentCategories.length;
  }
}

async function deleteCategory(id) {
  if (!confirm('Deseja realmente excluir esta categoria?')) return;

  await DbService.deleteCategory(id);
  showToast('Categoria excluída com sucesso!', 'success');

  currentCategories = (await DbService.getCategories()) || [];
  renderCategoriesUI();
  populateCategorySelect();
  if (document.getElementById('totalCatCount')) {
    document.getElementById('totalCatCount').innerText = currentCategories.length;
  }
}

/* -------------------------------------------------------------------------
   3. FORMAS DE ENTREGA (EDITAR, EXCLUIR E CRIAR)
------------------------------------------------------------------------- */
function renderDeliveryZonesUI() {
  const tbody = document.getElementById('deliveryZonesTableBody');
  if (!tbody) return;

  if (!currentDeliveryZones || currentDeliveryZones.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; padding: 20px;">Nenhuma forma de entrega cadastrada.</td></tr>';
    return;
  }

  tbody.innerHTML = currentDeliveryZones.map(z => `
    <tr>
      <td><strong>${z.name}</strong></td>
      <td class="td-price">R$ ${parseFloat(z.price || 0).toFixed(2).replace('.', ',')}</td>
      <td>
        <button class="btn-admin btn-admin-secondary" onclick="editDeliveryZone('${z.id}')" style="padding: 4px 10px; font-size: 0.8rem; margin-right: 6px;">Editar</button>
        <button class="btn-admin btn-admin-danger" onclick="deleteDeliveryZone('${z.id}')" style="padding: 4px 10px; font-size: 0.8rem;">Excluir</button>
      </td>
    </tr>
  `).join('');
}

let editingZoneId = '';

function openAddDeliveryZoneModal() {
  editingZoneId = '';
  document.getElementById('newZoneNameInput').value = '';
  document.getElementById('newZonePriceInput').value = '';
  const modal = document.getElementById('deliveryZoneModalForm');
  if (modal) modal.classList.add('active');
}

function editDeliveryZone(id) {
  const zone = currentDeliveryZones.find(z => String(z.id) === String(id));
  if (!zone) return;

  editingZoneId = zone.id;
  document.getElementById('newZoneNameInput').value = zone.name;
  document.getElementById('newZonePriceInput').value = parseFloat(zone.price || 0);

  const modal = document.getElementById('deliveryZoneModalForm');
  if (modal) modal.classList.add('active');
}

function closeDeliveryZoneModal() {
  editingZoneId = '';
  const modal = document.getElementById('deliveryZoneModalForm');
  if (modal) modal.classList.remove('active');
}

async function addNewDeliveryZone(event) {
  if (event) event.preventDefault();

  const name = (document.getElementById('newZoneNameInput').value || '').trim();
  const price = parseFloat(document.getElementById('newZonePriceInput').value) || 0;

  if (!name) {
    showToast('Informe o nome da forma de entrega ou região.', 'error');
    return;
  }

  const zoneObj = {
    id: editingZoneId || ('z-' + Date.now()),
    name: name,
    price: price,
    position: currentDeliveryZones.length + 1
  };

  await DbService.upsertDeliveryZone(zoneObj);
  showToast('Forma de entrega salva com sucesso!', 'success');
  closeDeliveryZoneModal();

  currentDeliveryZones = (await DbService.getDeliveryZones()) || [];
  renderDeliveryZonesUI();
  if (document.getElementById('totalDeliveryZonesCount')) {
    document.getElementById('totalDeliveryZonesCount').innerText = currentDeliveryZones.length;
  }
}

async function deleteDeliveryZone(id) {
  if (!confirm('Excluir esta forma de entrega?')) return;
  await DbService.deleteDeliveryZone(id);
  showToast('Entrega removida com sucesso!', 'success');

  currentDeliveryZones = (await DbService.getDeliveryZones()) || [];
  renderDeliveryZonesUI();
  if (document.getElementById('totalDeliveryZonesCount')) {
    document.getElementById('totalDeliveryZonesCount').innerText = currentDeliveryZones.length;
  }
}

/* -------------------------------------------------------------------------
   4. CUPONS DE DESCONTO (EDITAR, EXCLUIR E CRIAR)
------------------------------------------------------------------------- */
function renderCouponsUI() {
  const tbody = document.getElementById('couponsTableBody');
  if (!tbody) return;

  if (!currentCoupons || currentCoupons.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 20px;">Nenhum cupom cadastrado.</td></tr>';
    return;
  }

  tbody.innerHTML = currentCoupons.map(c => {
    let typeTxt = 'Valor Fixo (R$)';
    let valTxt = 'R$ ' + parseFloat(c.value || 0).toFixed(2).replace('.', ',');
    if (c.type === 'percent') {
      typeTxt = 'Porcentagem (%)';
      valTxt = c.value + '% OFF';
    } else if (c.type === 'frete_gratis') {
      typeTxt = 'Frete Grátis';
      valTxt = '100% OFF no Frete';
    }

    return `
      <tr>
        <td><strong>${(c.code || '').toUpperCase()}</strong></td>
        <td><span class="badge-cat" style="background: #F1EEFE; color: #6344F5;">${typeTxt}</span></td>
        <td class="td-price">${valTxt}</td>
        <td>
          <button class="btn-admin btn-admin-secondary" onclick="editCoupon('${c.id}')" style="padding: 4px 10px; font-size: 0.8rem; margin-right: 6px;">Editar</button>
          <button class="btn-admin btn-admin-danger" onclick="deleteCoupon('${c.id}')" style="padding: 4px 10px; font-size: 0.8rem;">Excluir</button>
        </td>
      </tr>
    `;
  }).join('');
}

let editingCouponId = '';

function openAddCouponModal() {
  editingCouponId = '';
  const modal = document.getElementById('couponModalForm');
  if (modal) {
    document.getElementById('newCouponCodeInput').value = '';
    document.getElementById('newCouponValueInput').value = '';
    document.getElementById('newCouponTypeInput').value = 'percent';
    modal.classList.add('active');
  }
}

function editCoupon(id) {
  const c = currentCoupons.find(coupon => String(coupon.id) === String(id));
  if (!c) return;

  editingCouponId = c.id;
  document.getElementById('newCouponCodeInput').value = c.code || '';
  document.getElementById('newCouponTypeInput').value = c.type || 'percent';
  document.getElementById('newCouponValueInput').value = parseFloat(c.value || 0);

  const modal = document.getElementById('couponModalForm');
  if (modal) modal.classList.add('active');
}

function closeCouponModal() {
  editingCouponId = '';
  const modal = document.getElementById('couponModalForm');
  if (modal) modal.classList.remove('active');
}

async function addNewCoupon(event) {
  if (event) event.preventDefault();

  const code = (document.getElementById('newCouponCodeInput').value || '').trim().toUpperCase();
  const type = document.getElementById('newCouponTypeInput').value || 'percent';
  const val = parseFloat(document.getElementById('newCouponValueInput').value) || 0;

  if (!code) {
    showToast('Digite o código do cupom.', 'error');
    return;
  }
  if (type !== 'frete_gratis' && val <= 0) {
    showToast('Informe um valor válido para o cupom.', 'error');
    return;
  }

  const couponObj = {
    id: editingCouponId || ('c-' + Date.now()),
    code: code,
    type: type,
    value: val,
    active: true
  };

  await DbService.upsertCoupon(couponObj);
  showToast('Cupom salvo com sucesso!', 'success');
  closeCouponModal();

  currentCoupons = (await DbService.getCoupons()) || [];
  renderCouponsUI();
}

async function deleteCoupon(id) {
  if (!confirm('Deseja realmente excluir este cupom?')) return;
  await DbService.deleteCoupon(id);
  showToast('Cupom excluído com sucesso!', 'success');

  currentCoupons = (await DbService.getCoupons()) || [];
  renderCouponsUI();
}

/* -------------------------------------------------------------------------
   5. BRANDING / IDENTIDADE VISUAL
------------------------------------------------------------------------- */
async function saveBrandingConfig(event) {
  if (event) event.preventDefault();

  currentBranding = {
    ...currentBranding,
    storeName: document.getElementById('cfgStoreName').value.trim(),
    storeSub: document.getElementById('cfgStoreSub').value.trim(),
    storeAddress: document.getElementById('cfgStoreAddress').value.trim(),
    storeHours: document.getElementById('cfgStoreHours').value.trim(),
    wppNumber: document.getElementById('cfgWppNumber').value.trim(),
    primaryColor: document.getElementById('cfgPrimaryColor').value,
    btnTextColor: document.getElementById('cfgBtnTextColor').value,
    accentColor: document.getElementById('cfgAccentColor').value,
    badgeBgColor: document.getElementById('cfgBadgeBgColor').value,
    logoUrl: isLogoExplicitlyRemoved ? '' : (tempLogoBase64 || currentBranding.logoUrl || ''),
    bannerDeskUrl: isBannerDeskExplicitlyRemoved ? '' : (tempBannerDeskBase64 || currentBranding.bannerDeskUrl || ''),
    bannerMobUrl: isBannerMobExplicitlyRemoved ? '' : (tempBannerMobBase64 || currentBranding.bannerMobUrl || '')
  };

  await DbService.saveBranding(currentBranding);
  showToast('Configurações de marca salvas com sucesso!', 'success');
  
  if (document.getElementById('adminStoreTitleDisplay')) {
    document.getElementById('adminStoreTitleDisplay').innerText = currentBranding.storeName || 'Minha Loja';
  }
}

function showToast(msg, type = 'info') {
  if (typeof window.displaySystemToast === 'function') {
    window.displaySystemToast(msg, type);
  } else {
    console.log(`[Toast ${type}] ${msg}`);
  }
}

// Binds Globais no Objeto Window
window.switchAdminTab = switchAdminTab;
window.filterAdminCards = filterAdminCards;
window.openAddProductModal = openAddProductModal;
window.closeProductFormModal = closeProductFormModal;
window.previewProductFileUpload = previewProductFileUpload;
window.removeProductPhoto = removeProductPhoto;
window.previewLogoFileUpload = previewLogoFileUpload;
window.removeLogo = removeLogo;
window.previewBannerDeskUpload = previewBannerDeskUpload;
window.removeBannerDesk = removeBannerDesk;
window.previewBannerMobUpload = previewBannerMobUpload;
window.removeBannerMob = removeBannerMob;
window.toggleCustomPriceFields = toggleCustomPriceFields;
window.saveProductItem = saveProductItem;
window.deleteProductItem = deleteProductItem;
window.editProductItem = editProductItem;
window.duplicateProductItem = duplicateProductItem;
window.addAdicionalInputRow = addAdicionalInputRow;
window.openAddCategoryModal = openAddCategoryModal;
window.editCategory = editCategory;
window.closeCategoryModal = closeCategoryModal;
window.saveCategoryWithProducts = saveCategoryWithProducts;
window.deleteCategory = deleteCategory;
window.openAddDeliveryZoneModal = openAddDeliveryZoneModal;
window.editDeliveryZone = editDeliveryZone;
window.closeDeliveryZoneModal = closeDeliveryZoneModal;
window.addNewDeliveryZone = addNewDeliveryZone;
window.deleteDeliveryZone = deleteDeliveryZone;
window.openAddCouponModal = openAddCouponModal;
window.editCoupon = editCoupon;
window.closeCouponModal = closeCouponModal;
window.addNewCoupon = addNewCoupon;
window.deleteCoupon = deleteCoupon;
window.saveBrandingConfig = saveBrandingConfig;