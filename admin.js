/* ==========================================================================
   CARDÁPIO DIGITAL & PDV — ENGINE DE GESTÃO (BANCO DE DADOS REMOTO & FALLBACK)
   Constantes de URL, Storage e Defaults fornecidas por defaults.js
   ========================================================================== */

// Defaults moved to `defaults.js` (loaded before this script)

let currentBranding = {};
let currentCategories = [];
let currentProducts = [];
let currentDeliveryZones = [];
let sheetsConfig = { appsScriptUrl: DEFAULT_APPS_SCRIPT_URL, sheetCsvUrl: DEFAULT_CSV_URL };

let pendingLogoBase64 = '';
let pendingBannerDeskBase64 = '';
let pendingBannerMobBase64 = '';
let pendingProductImgBase64 = '';

window.switchAdminTab = function(tabName) {
  const tabsMap = {
    'dashboard': 'tabContentDashboard',
    'items': 'tabContentItems',
    'categories': 'tabContentCategories',
    'delivery': 'tabContentDelivery',
    'coupons': 'tabContentCoupons',
    'branding': 'tabContentBranding'
  };

  // 1. Oculta todos os containers de abas
  Object.values(tabsMap).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });

  // 2. Remove a classe active de todos os botões do menu lateral
  document.querySelectorAll('.admin-sidebar .nav-tab').forEach(b => b.classList.remove('active'));

  // 3. Exibe o container da aba selecionada
  const targetId = tabsMap[tabName] || 'tabContentDashboard';
  const targetEl = document.getElementById(targetId);
  if (targetEl) targetEl.style.display = 'block';

  // 4. Marca o botão correspondente como ativo
  const activeBtn = document.querySelector(`.admin-sidebar .nav-tab[onclick*="${tabName}"]`);
  if (activeBtn) activeBtn.classList.add('active');

  // 5. Atualiza dados e UIs das abas se necessário
  if (tabName === 'coupons' && typeof renderCouponsUI === 'function') renderCouponsUI();
  if (tabName === 'categories' && typeof renderCategoriesUI === 'function') renderCategoriesUI();
  if (tabName === 'delivery' && typeof renderDeliveryZonesUI === 'function') renderDeliveryZonesUI();
  if (tabName === 'items' && typeof renderAdminCards === 'function') renderAdminCards();
};

window.openAddProductModal = function() {
  const titleEl = document.getElementById('productModalTitle');
  if (titleEl) titleEl.innerText = 'Novo produto';
  const editIdEl = document.getElementById('prodEditId');
  if (editIdEl) editIdEl.value = '';
  const formEl = document.getElementById('productForm');
  if (formEl) formEl.reset();
  pendingProductImgBase64 = '';
  const preview = document.getElementById('prodFilePreview');
  if (preview) preview.style.display = 'none';
  const adicContainer = document.getElementById('adicionaisContainer');
  if (adicContainer) adicContainer.innerHTML = '';
  if (typeof renderCategoriesUI === 'function') renderCategoriesUI();
  const modal = document.getElementById('productFormModal');
  if (modal) modal.classList.add('active');
};

window.closeProductFormModal = function() {
  const modal = document.getElementById('productFormModal');
  if (modal) modal.classList.remove('active');
};

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await loadAdminSettings();
  } catch (e) {
    console.error('[Admin] Erro ao carregar configurações:', e);
  }
  renderAdminTable();
  renderCategoriesUI();
  renderDeliveryZonesUI();
  updateStats();
  initDragAndDropHandlers();
});

// apiRequest helper e fornecido centralidamente pelo defaults.js

function applyUnifiedBrandingVariables(primaryColor, darkColor) {
  if (primaryColor) {
    document.documentElement.style.setProperty('--ph-red', primaryColor);
  }
  if (darkColor) {
    document.documentElement.style.setProperty('--ph-red-dark', darkColor);
  }
}

async function loadAdminSettings() {
  currentBranding    = await DbService.getBranding();
  currentCategories  = await DbService.getCategories();
  currentProducts    = await DbService.getProducts();
  currentDeliveryZones = await DbService.getDeliveryZones();

  const savedSheetsCfg = localStorage.getItem(STORAGE_KEY_SHEETS_CONFIG);
  sheetsConfig = savedSheetsCfg ? JSON.parse(savedSheetsCfg) : { appsScriptUrl: DEFAULT_APPS_SCRIPT_URL, sheetCsvUrl: DEFAULT_CSV_URL };

  const elName = document.getElementById('cfgStoreName');
  if (elName) elName.value = currentBranding.storeName || '';

  const elSub = document.getElementById('cfgStoreSub');
  if (elSub) elSub.value = currentBranding.storeSub || '';

  const elAddr = document.getElementById('cfgStoreAddress');
  if (elAddr) elAddr.value = currentBranding.storeAddress || '';

  const elHours = document.getElementById('cfgStoreHours');
  if (elHours) elHours.value = currentBranding.storeHours || '';

  const elWpp = document.getElementById('cfgWppNumber');
  if (elWpp) elWpp.value = currentBranding.wppNumber || '';

  const elFrete = document.getElementById('cfgFrete');
  if (elFrete) elFrete.value = currentBranding.frete || 5.00;

  const elPrimColor = document.getElementById('cfgPrimaryColor');
  if (elPrimColor) elPrimColor.value = currentBranding.primaryColor || '#18181B';

  const elPrimPicker = document.getElementById('cfgPrimaryColorPicker');
  if (elPrimPicker) elPrimPicker.value = currentBranding.primaryColor || '#18181B';

  const elDarkColor = document.getElementById('cfgDarkColor');
  if (elDarkColor) elDarkColor.value = currentBranding.darkColor || '#09090B';

  const elDarkPicker = document.getElementById('cfgDarkColorPicker');
  if (elDarkPicker) elDarkPicker.value = currentBranding.darkColor || '#09090B';

  const elCities = document.getElementById('cfgCoverageCities');
  if (elCities) elCities.value = currentBranding.coverageCities || 'Porto Alegre, Viamão';

  const scriptInput = document.getElementById('cfgAppsScriptUrl');
  const csvInput = document.getElementById('cfgSheetCsvUrl');
  if (scriptInput) scriptInput.value = sheetsConfig.appsScriptUrl || DEFAULT_APPS_SCRIPT_URL;
  if (csvInput) csvInput.value = sheetsConfig.sheetCsvUrl || DEFAULT_CSV_URL;

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

  const titleDisp = document.getElementById('adminStoreTitleDisplay');
  if (titleDisp) titleDisp.innerText = currentBranding.storeName || 'Sua Loja';

  const wppDisp = document.getElementById('currentWppDisplay');
  if (wppDisp) wppDisp.innerText = currentBranding.wppNumber || 'Não cadastrado';
}

function saveSheetsConfig(event) {
  if (event) event.preventDefault();
  sheetsConfig.appsScriptUrl = document.getElementById('cfgAppsScriptUrl').value.trim() || DEFAULT_APPS_SCRIPT_URL;
  sheetsConfig.sheetCsvUrl = document.getElementById('cfgSheetCsvUrl').value.trim() || DEFAULT_CSV_URL;

  localStorage.setItem(STORAGE_KEY_SHEETS_CONFIG, JSON.stringify(sheetsConfig));
  showToast('Configurações salvas com sucesso!', 'success');
  fetchFromSheets();
}

/**
 * BUSCA DE DADOS NO GOOGLE SHEETS / APPS SCRIPT
 */
async function fetchFromSheets() {
  const statusDisplay = document.getElementById('sheetsStatusDisplay');
  const targetUrl = sheetsConfig.appsScriptUrl || DEFAULT_APPS_SCRIPT_URL;

  if (targetUrl) {
    if (statusDisplay) {
      statusDisplay.innerText = "Conectando ao Servidor...";
      statusDisplay.style.color = "#FFA000";
    }
    try {
        const json = await apiRequest(targetUrl, { method: 'GET' }, 8000);
        if (json && json.ok && Array.isArray(json.data)) {
          if (json.data.length > 0) {
            currentProducts = json.data.map((p, i) => ({
            id: p.id || String(i + 1),
            nome: p.nome || '',
            categoria: p.categoria || 'pizzas-salgadas',
            descricao: p.descricao || '',
            preco: parseFloat(p.preco || p.preco_brl) || 0,
            preco_grande: parseFloat(p.preco || p.preco_brl) || 0,
            badge: p.badge || '',
            img_url: formatFotoUrl(p.img_url || p.img_1),
            status: p.status || 'ativo'
          }));

          localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(currentProducts));
          renderAdminTable();
          if (statusDisplay) {
            statusDisplay.innerText = `Conectado (${currentProducts.length} itens)`;
            statusDisplay.style.color = "#2E7D32";
          }
          return;
        } else {
          // SE A PLANILHA REMOTA ESTIVER VAZIA
          if (currentProducts.length === 0) {
            currentProducts = [ ...defaultProducts ];
          }
          renderAdminTable();
          if (statusDisplay) {
            statusDisplay.innerText = "Conectado (Planilha Vazia)";
            statusDisplay.style.color = "#FFA000";
          }
          return;
        }
      }
    } catch (err) {
      console.warn('Servidor proxy não respondeu. Tentando CSV...', err);
    }
  }

  fetchFromCsvFallback();
}

function fetchFromCsvFallback() {
  const statusDisplay = document.getElementById('sheetsStatusDisplay');
  const csvUrl = sheetsConfig.sheetCsvUrl || DEFAULT_CSV_URL;
  if (!csvUrl || typeof Papa === 'undefined') {
    if (statusDisplay) {
      statusDisplay.innerText = "Modo Local Storage";
      statusDisplay.style.color = "#E65100";
    }
    return;
  }

  Papa.parse(csvUrl, {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
      if (results.data && results.data.length > 0) {
        const validRows = results.data.filter(p => p.nome || p.id);
        if (validRows.length > 0) {
          currentProducts = validRows.map((p, i) => ({
            id: p.id || String(i + 1),
            nome: p.nome || 'Sem Nome',
            categoria: p.categoria || 'pizzas-salgadas',
            descricao: p.descricao || '',
            preco: parseFloat(p.preco || p.preco_brl) || 0,
            preco_grande: parseFloat(p.preco || p.preco_brl) || 0,
            badge: p.badge || '',
            img_url: formatFotoUrl(p.img_url || p.img_1),
            status: p.status || 'ativo'
          }));

          localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(currentProducts));
          renderAdminTable();
          if (statusDisplay) {
            statusDisplay.innerText = "Conectado (CSV)";
            statusDisplay.style.color = "#1565C0";
          }
          return;
        }
      }

      // Se a planilha CSV estiver vazia
      if (currentProducts.length === 0) {
        currentProducts = [ ...defaultProducts ];
      }
      renderAdminTable();
      if (statusDisplay) {
        statusDisplay.innerText = "Conectado (Aguardando Dados)";
        statusDisplay.style.color = "#FFA000";
      }
    }
  });
}

/**
 * Validação leve de produto antes de salvar
 * Retorna { valid: boolean, errors: string[] }
 */
function validateProduct(prod) {
  // Use Ajv when available (loaded via CDN in admin.html)
  const productSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      nome: { type: 'string', minLength: 2 },
      categoria: { type: 'string', minLength: 1 },
      descricao: { type: 'string' },
      preco: { type: 'number', minimum: 0 },
      preco_grande: { type: 'number', minimum: 0 },
      preco_media: { type: 'number', minimum: 0 },
      preco_broto: { type: 'number', minimum: 0 },
      badge: { type: 'string' },
      img_url: { type: 'string' }
    },
    required: ['id', 'nome', 'categoria', 'preco', 'img_url'],
    additionalProperties: true
  };

  try {
    if (window.Ajv) {
      const ajv = new window.Ajv();
      const validate = ajv.compile(productSchema);
      const valid = validate(prod);
      if (valid) return { valid: true, errors: [] };
      const errors = (validate.errors || []).map(e => `${e.instancePath.replace(/^\//, '') || e.params.missingProperty || 'campo'} ${e.message}`);
      return { valid: false, errors };
    }
  } catch (e) {
    console.warn('Ajv validation failed, falling back to lightweight checks', e);
  }

  // Fallback leve caso Ajv não esteja presente
  const errors = [];
  if (!prod) {
    errors.push('Produto vazio');
    return { valid: false, errors };
  }
  if (!prod.nome || String(prod.nome).trim().length < 2) errors.push('Nome inválido (mínimo 2 caracteres)');
  // categoria é opcional: produto pode ficar sem categoria
  if (isNaN(parseFloat(prod.preco)) || parseFloat(prod.preco) < 0) errors.push('Preço inválido');
  // imagem: aceita placeholder, não bloqueia sem upload
  return { valid: errors.length === 0, errors };
}

function formatFotoUrl(val) {
  if (!val) return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
  const trimmed = val.trim();
  if (trimmed.startsWith('http')) return trimmed;
  return BASE_URL_FOTOS + encodeURI(trimmed);
}

/**
 * SALVAMENTO REMOTO NO GOOGLE SHEETS VIA POST
 */
async function saveToSheets(productsToSave = currentProducts) {
  const targetUrl = sheetsConfig.appsScriptUrl || DEFAULT_APPS_SCRIPT_URL;
  if (!targetUrl) return;

  try {
    const json = await apiRequest(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify({ action: 'save', data: productsToSave })
    }, 12000);

    if (json && json.ok) {
      console.log('✓ Sincronizado com a Planilha Remota!');
      return json;
    } else {
      throw new Error('Resposta inesperada do servidor');
    }
  } catch (err) {
    console.error('Erro ao salvar na Planilha Remota:', err);
    throw err;
  }
}

/**
 * UPLOAD DE IMAGEM PARA O BUCKET CARDÁPIO-DIGITAL NO CLOUDFLARE R2
 */
async function uploadToCloudflareR2(file) {
  return new Promise((resolve) => {
    if (typeof compressImageFile === 'function') {
      compressImageFile(file, 800, 0.85).then(compressed => {
        resolve(compressed || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80');
      });
    } else {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => resolve('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80');
      reader.readAsDataURL(file);
    }
  });
}

function syncWithSheetsNow() {
  fetchFromSheets();
  showToast('Sincronização iniciada!', 'info');
}

function pushCurrentToSheetsNow() {
  saveToSheets(currentProducts).then(() => {
    showToast('Produtos e categorias enviados para a planilha remota com sucesso!', 'success');
  });
}
async function resetBrandingToDefault() {
  const ok = await showConfirm('Deseja restaurar as configurações originais da marca Pizza Todo Dia?');
  if (!ok) return;
  // Limpa localStorage
  localStorage.removeItem(STORAGE_KEY_BRANDING);
  localStorage.removeItem(STORAGE_KEY_CATEGORIES);
  localStorage.removeItem(STORAGE_KEY_PRODUCTS);
  localStorage.removeItem(STORAGE_KEY_DELIVERY_ZONES);
  localStorage.removeItem(STORAGE_KEY_SHEETS_CONFIG);
  await loadAdminSettings();
  renderAdminTable();
  renderCategoriesUI();
  renderDeliveryZonesUI();
  showToast('Configurações da Pizza Todo Dia restauradas com sucesso!', 'success');
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

function openAddDeliveryZoneModal() {
  const modal = document.getElementById('deliveryZoneModalForm');
  if (modal) modal.classList.add('active');
}

function closeDeliveryZoneModal() {
  const modal = document.getElementById('deliveryZoneModalForm');
  if (modal) modal.classList.remove('active');
}

let _deliverySaving = false;
async function addNewDeliveryZone(event) {
  event.preventDefault();
  if (_deliverySaving) return;
  _deliverySaving = true;

  const submitBtn = event.target.querySelector('[type=submit]');
  if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Salvando...'; }

  const nameInput = document.getElementById('newZoneNameInput');
  const priceInput = document.getElementById('newZonePriceInput');
  const freeCbx = document.getElementById('newZoneFreeCheck');

  const name = nameInput.value.trim();
  const isFree = freeCbx && freeCbx.checked;
  const price = isFree ? 0 : (parseFloat(priceInput.value) || 0);
  const displayPrice = isFree ? 'A combinar / Grátis' : null;

  if (!name) {
    _deliverySaving = false;
    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Salvar forma de entrega'; }
    return;
  }

  const newZoneId = 'z-' + Date.now();
  const newZone = { id: newZoneId, name: name, price: price, displayPrice: displayPrice };
  currentDeliveryZones.push(newZone);
  await DbService.upsertDeliveryZone(newZone);

  nameInput.value = '';
  if (priceInput) priceInput.value = '';
  if (freeCbx) freeCbx.checked = false;
  closeDeliveryZoneModal();
  renderDeliveryZonesUI();
  showToast(`Forma de entrega "${name}" salva com sucesso!`, 'success');

  _deliverySaving = false;
  if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Salvar forma de entrega'; }
}

async function deleteDeliveryZone(zoneId) {
  const ok = await showConfirm('Deseja excluir esta forma de entrega?');
  if (!ok) return;
  currentDeliveryZones = currentDeliveryZones.filter(z => String(z.id) !== String(zoneId));
  await DbService.deleteDeliveryZone(zoneId);
  renderDeliveryZonesUI();
  showToast('Forma de entrega excluída com sucesso!', 'success');
}

function renderCategoriesUI() {
  const container = document.getElementById('categoriesListContainer');
  if (container) {
    if (!currentCategories || currentCategories.length === 0) {
      container.innerHTML = `
        <div style="width: 100%; text-align: center; padding: 32px; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; color: #64748B;">
          Nenhuma categoria cadastrada. Clique em "+ Nova Categoria" para criar a primeira!
        </div>
      `;
    } else {
      container.innerHTML = currentCategories.map(cat => {
        const prodsInCategory = currentProducts.filter(p => p.categoria === cat.name || p.categoria === cat.id);
        const prodChipsHtml = prodsInCategory.length > 0
          ? prodsInCategory.map(p => `
              <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 6px 12px; display: inline-flex; align-items: center; gap: 8px; font-size: 0.82rem;">
                <img src="${p.img_url || PLACEHOLDER_PRODUCT_IMG}" style="width: 24px; height: 24px; border-radius: 4px; object-fit: cover;" alt="${p.nome}">
                <span style="font-weight: 600; color: #0F172A;">${p.nome}</span>
                <span style="color: #64748B; font-weight: 700;">(R$ ${(parseFloat(p.preco || p.preco_grande) || 0).toFixed(2).replace('.', ',')})</span>
                <button onclick="removeProductFromCategory('${p.id}')" title="Remover da categoria" style="background: none; border: none; color: #EF4444; font-weight: bold; cursor: pointer; padding: 0 2px;">✕</button>
              </div>
            `).join('')
          : `<span style="font-size: 0.8rem; color: #94A3B8; font-style: italic;">Nenhum produto nesta categoria ainda.</span>`;

        return `
          <div style="width: 100%; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.02); margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; border-bottom: 1px solid #F1F5F9; padding-bottom: 12px;">
              <div>
                <h4 style="font-size: 1.05rem; font-weight: 800; color: #0F172A; margin: 0;">${cat.name}</h4>
                <span style="font-size: 0.78rem; color: #64748B;">${prodsInCategory.length} produto(s) vinculado(s)</span>
              </div>
              <div style="display: flex; gap: 8px;">
                <button onclick="openAddCategoryModal('${cat.name}')" class="btn-admin" style="padding: 6px 12px; font-size: 0.8rem; background: #F1EEFE; color: #6344F5; border-color: #DDD6FE;">
                  + Vincular Produtos
                </button>
                <button onclick="deleteCategory('${cat.id}')" class="btn-admin" style="padding: 6px 12px; font-size: 0.8rem; background: #FEE2E2; color: #DC2626; border-color: #FCA5A5;">
                  Excluir Categoria
                </button>
              </div>
            </div>

            <div>
              <div style="font-size: 0.76rem; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 8px;">Produtos no Cardápio:</div>
              <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                ${prodChipsHtml}
              </div>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  const select = document.getElementById('prodCategory');
  if (select) {
    select.innerHTML = `<option value="">Sem Categoria (Cardápio Geral)</option>` + currentCategories.map(cat => `<option value="${cat.name}">${cat.name}</option>`).join('');
  }

  updateStats();
}

async function removeProductFromCategory(productId) {
  const item = currentProducts.find(p => String(p.id) === String(productId));
  if (!item) return;
  item.categoria = 'Sem Categoria';
  await DbService.upsertProduct(item);
  renderCategoriesUI();
  renderAdminTable();
  showToast(`Produto "${item.nome}" desvinculado da categoria.`, 'info');
}

function openAddCategoryModal(catName = '') {
  const titleEl = document.getElementById('catModalTitle');
  if (titleEl) titleEl.innerText = catName ? 'Editar categoria' : 'Nova categoria';
  document.getElementById('catModalEditName').value = catName;
  document.getElementById('catModalNameInput').value = catName;

  const checklist = document.getElementById('catModalProductsChecklist');
  if (checklist) {
    if (!currentProducts || currentProducts.length === 0) {
      checklist.innerHTML = `<div style="font-size: 0.82rem; color: #71717A; text-align: center; padding: 12px;">Nenhum produto cadastrado ainda.</div>`;
    } else {
      const searchId = 'catProdSearch_' + Date.now();
      checklist.innerHTML = `
        <input type="text" id="${searchId}" placeholder="Buscar produto..." class="admin-input" style="margin-bottom: 8px; width: 100%;" oninput="filterCatProdChecklist(this, '${searchId}')">
        <div id="catProdChecklistItems">
          ${currentProducts.map(p => {
            const isChecked = catName && (p.categoria === catName);
            return `
              <label class="cat-prod-label" data-name="${p.nome.toLowerCase()}" style="display: flex; align-items: center; gap: 10px; font-size: 0.86rem; cursor: pointer; padding: 8px; border-radius: 6px; border: 1px solid #E4E4E7; margin-bottom: 4px; background: #FFFFFF;">
                <input type="checkbox" class="cat-prod-checkbox" value="${p.id}" ${isChecked ? 'checked' : ''} style="accent-color: #6344F5; width: 16px; height: 16px;">
                <img src="${p.img_url || PLACEHOLDER_PRODUCT_IMG}" style="width: 28px; height: 28px; border-radius: 4px; object-fit: cover;">
                <span style="font-weight: 600; color: #18181B; flex: 1;">${p.nome}</span>
                <span style="font-size: 0.76rem; color: #64748B;">R$ ${(parseFloat(p.preco || p.preco_grande) || 0).toFixed(2).replace('.', ',')}</span>
              </label>
            `;
          }).join('')}
        </div>
      `;
    }
  }

  const modal = document.getElementById('categoryFormModal');
  if (modal) modal.classList.add('active');
}

function closeCategoryModal() {
  const modal = document.getElementById('categoryFormModal');
  if (modal) modal.classList.remove('active');
}

async function saveCategoryWithProducts(event) {
  event.preventDefault();
  const oldName = document.getElementById('catModalEditName').value.trim();
  const newName = document.getElementById('catModalNameInput').value.trim();

  if (!newName) return;

  const catId = oldName ? (currentCategories.find(c => c.name === oldName)?.id || ('cat-' + Date.now())) : ('cat-' + Date.now());
  const newCatObj = { id: catId, name: newName, position: currentCategories.length };

  const existingIdx = currentCategories.findIndex(c => c.id === catId || c.name === oldName);
  if (existingIdx !== -1) {
    currentCategories[existingIdx] = newCatObj;
  } else {
    currentCategories.push(newCatObj);
  }

  const selectedProdIds = Array.from(document.querySelectorAll('.cat-prod-checkbox:checked')).map(cb => String(cb.value));
  for (let p of currentProducts) {
    if (selectedProdIds.includes(String(p.id))) {
      p.categoria = newName;
      await DbService.upsertProduct(p);
    } else if (p.categoria === oldName || p.categoria === newName) {
      p.categoria = '';
      await DbService.upsertProduct(p);
    }
  }

  await DbService.upsertCategory(newCatObj);
  closeCategoryModal();
  renderCategoriesUI();
  renderAdminTable();
  showToast(`Categoria "${newName}" salva com sucesso!`, 'success');
}

async function deleteCategory(catId) {
  const ok = await showConfirm('Deseja excluir esta categoria? Os produtos vinculados a ela permanecerão salvos.');
  if (!ok) return;
  currentCategories = currentCategories.filter(c => c.id !== catId);
  await DbService.deleteCategory(catId);
  renderCategoriesUI();
  showToast('Categoria excluída com sucesso!', 'success');
}

function initDragAndDropHandlers() {
  setupDropZone('logoDropZone', (file) => {
    uploadToCloudflareR2(file).then(url => {
      pendingLogoBase64 = url;
      const preview = document.getElementById('logoFilePreview');
      if (preview) {
        preview.src = url;
        preview.style.display = 'block';
      }
    });
  });

  setupDropZone('bannerDeskDropZone', (file) => {
    uploadToCloudflareR2(file).then(url => {
      pendingBannerDeskBase64 = url;
      const preview = document.getElementById('bannerDeskPreview');
      if (preview) {
        preview.src = url;
        preview.style.display = 'block';
      }
    });
  });

  setupDropZone('bannerMobDropZone', (file) => {
    uploadToCloudflareR2(file).then(url => {
      pendingBannerMobBase64 = url;
      const preview = document.getElementById('bannerMobPreview');
      if (preview) {
        preview.src = url;
        preview.style.display = 'block';
      }
    });
  });

  setupDropZone('productDropZone', (file) => {
    uploadToCloudflareR2(file).then(url => {
      pendingProductImgBase64 = url;
      const preview = document.getElementById('prodFilePreview');
      if (preview) {
        preview.src = url;
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
    showToast('Por favor, selecione apenas arquivos de imagem (.png, .jpg, .jpeg, .webp).', 'error');
    return;
  }
  uploadToCloudflareR2(file).then(url => callback(url));
}

function previewLogoFileUpload(input) {
  if (input.files && input.files[0]) {
    uploadToCloudflareR2(input.files[0]).then(url => {
      pendingLogoBase64 = url;
      const preview = document.getElementById('logoFilePreview');
      const btn = document.getElementById('btnRemoveLogo');
      if (preview) { preview.src = url; preview.style.display = 'block'; }
      if (btn) btn.style.display = 'inline-block';
    });
  }
}

async function removeLogo() {
  currentBranding.logoUrl = '';
  pendingLogoBase64 = '';
  await DbService.saveBranding(currentBranding);
  const preview = document.getElementById('logoFilePreview');
  const btn = document.getElementById('btnRemoveLogo');
  if (preview) preview.style.display = 'none';
  if (btn) btn.style.display = 'none';
  showToast('Logo removida com sucesso! O cardápio voltará a exibir a logo estilizada em texto.', 'success');
}

function previewBannerDeskUpload(input) {
  if (input.files && input.files[0]) {
    uploadToCloudflareR2(input.files[0]).then(url => {
      pendingBannerDeskBase64 = url;
      const preview = document.getElementById('bannerDeskPreview');
      const btn = document.getElementById('btnRemoveBannerDesk');
      if (preview) { preview.src = url; preview.style.display = 'block'; }
      if (btn) btn.style.display = 'inline-block';
    });
  }
}

async function removeBannerDesk() {
  currentBranding.bannerDeskUrl = '';
  pendingBannerDeskBase64 = '';
  await DbService.saveBranding(currentBranding);
  const preview = document.getElementById('bannerDeskPreview');
  const btn = document.getElementById('btnRemoveBannerDesk');
  if (preview) preview.style.display = 'none';
  if (btn) btn.style.display = 'none';
  showToast('Banner Desktop removido com sucesso!', 'success');
}

function previewBannerMobUpload(input) {
  if (input.files && input.files[0]) {
    uploadToCloudflareR2(input.files[0]).then(url => {
      pendingBannerMobBase64 = url;
      const preview = document.getElementById('bannerMobPreview');
      const btn = document.getElementById('btnRemoveBannerMob');
      if (preview) { preview.src = url; preview.style.display = 'block'; }
      if (btn) btn.style.display = 'inline-block';
    });
  }
}

async function removeBannerMob() {
  currentBranding.bannerMobUrl = '';
  pendingBannerMobBase64 = '';
  await DbService.saveBranding(currentBranding);
  const preview = document.getElementById('bannerMobPreview');
  const btn = document.getElementById('btnRemoveBannerMob');
  if (preview) preview.style.display = 'none';
  if (btn) btn.style.display = 'none';
  showToast('Banner Mobile removido com sucesso!', 'success');
}

function previewProductFileUpload(input) {
  if (input.files && input.files[0]) {
    uploadToCloudflareR2(input.files[0]).then(url => {
      pendingProductImgBase64 = url;
      const preview = document.getElementById('prodFilePreview');
      const btnRemove = document.getElementById('btnRemoveProdImg');
      if (preview) {
        preview.src = url;
        preview.style.display = 'block';
      }
      if (btnRemove) {
        btnRemove.style.display = 'flex';
      }
    });
  }
}

async function saveBrandingConfig(event) {
  event.preventDefault();

  currentBranding.storeName = document.getElementById('cfgStoreName').value.trim();
  currentBranding.storeSub = document.getElementById('cfgStoreSub').value.trim();
  currentBranding.storeAddress = document.getElementById('cfgStoreAddress')?.value.trim() || '';
  currentBranding.storeHours = document.getElementById('cfgStoreHours')?.value.trim() || '';
  currentBranding.wppNumber = document.getElementById('cfgWppNumber').value.trim().replace(/\D/g, '');
  currentBranding.frete = parseFloat(document.getElementById('cfgFrete').value) || 5.00;
  currentBranding.primaryColor = document.getElementById('cfgPrimaryColor')?.value.trim() || '#18181B';
  currentBranding.btnTextColor = document.getElementById('cfgBtnTextColor')?.value.trim() || '#FFFFFF';
  currentBranding.accentColor  = document.getElementById('cfgAccentColor')?.value.trim() || '#6344F5';
  currentBranding.badgeBgColor = document.getElementById('cfgBadgeBgColor')?.value.trim() || '#F1EEFE';

  if (pendingLogoBase64) currentBranding.logoUrl = pendingLogoBase64;
  if (pendingBannerDeskBase64) currentBranding.bannerDeskUrl = pendingBannerDeskBase64;
  if (pendingBannerMobBase64) currentBranding.bannerMobUrl = pendingBannerMobBase64;

  await DbService.saveBranding(currentBranding);

  const titleDisp = document.getElementById('adminStoreTitleDisplay');
  if (titleDisp) titleDisp.innerText = currentBranding.storeName;
  showToast('Configurações salvas com sucesso! As cores da marca, informações e mídias foram atualizadas.', 'success');
}

function updateStats() {
  document.getElementById('totalProductsCount').innerText = currentProducts.length;
  document.getElementById('totalCatCount').innerText = currentCategories.length;
  const deliveryCountDisplay = document.getElementById('totalDeliveryZonesCount');
  if (deliveryCountDisplay) deliveryCountDisplay.innerText = currentDeliveryZones.length;
}

function renderAdminCards(dataToRender = currentProducts) {
  const container = document.getElementById('adminProductGridContainer');
  if (!container) return;

  if (!dataToRender || dataToRender.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; color: #64748B;">
        Nenhum produto cadastrado ainda. Clique em "+ Cadastrar Novo Produto" para adicionar um item ao seu cardápio!
      </div>
    `;
    return;
  }

  container.innerHTML = dataToRender.map(item => {
    const price = parseFloat(item.preco || item.preco_grande || 0);
    const catObj = currentCategories.find(c => c.id === item.categoria || c.name === item.categoria);
    const catNameDisplay = catObj ? catObj.name : (item.categoria ? item.categoria : 'Sem Categoria');
    const adicCount = (item.adicionais && Array.isArray(item.adicionais)) ? item.adicionais.length : 0;

    return `
      <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 1px 3px rgba(0,0,0,0.02); transition: transform 0.2s ease;">
        <div style="height: 140px; background: #F8FAFC; border-bottom: 1px solid #F1F5F9; display: flex; align-items: center; justify-content: center; position: relative;">
          <img src="${item.img_url || PLACEHOLDER_PRODUCT_IMG}" style="width: 100%; height: 100%; object-fit: cover;" alt="${item.nome}">
          ${item.badge ? `<span style="position: absolute; top: 10px; right: 10px; background: #6344F5; color: #FFF; font-size: 0.72rem; font-weight: 700; padding: 4px 8px; border-radius: 6px;">${item.badge}</span>` : ''}
        </div>

        <div style="padding: 16px; display: flex; flex-direction: column; flex: 1;">
          <div style="font-size: 0.76rem; font-weight: 700; color: #6344F5; text-transform: uppercase; margin-bottom: 4px;">${catNameDisplay}</div>
          <h4 style="font-size: 0.98rem; font-weight: 700; color: #0F172A; margin: 0 0 6px 0; cursor: pointer;" onclick="editProductItem('${item.id}')">${item.nome}</h4>
          <p style="font-size: 0.8rem; color: #64748B; margin: 0 0 12px 0; line-clamp: 2; -webkit-line-clamp: 2; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; height: 2.4em;">${item.descricao || 'Sem descrição.'}</p>
          
          ${adicCount > 0 ? `<div style="font-size: 0.74rem; color: #10B981; font-weight: 600; margin-bottom: 8px;">+ ${adicCount} adicional(is) cadastrado(s)</div>` : ''}

          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 12px; border-top: 1px solid #F1F5F9; gap: 8px; flex-wrap: wrap;">
            <div style="font-size: 1.1rem; font-weight: 800; color: #0F172A;">R$ ${price.toFixed(2).replace('.', ',')}</div>
            <div style="display: flex; gap: 6px;">
              <button onclick="editProductItem('${item.id}')" class="btn-admin" style="padding: 6px 14px; font-size: 0.8rem; background: #F1F5F9; color: #0F172A; border: 1px solid #CBD5E1; font-weight: 600; border-radius: 6px;">Editar</button>
              <button onclick="deleteProductItem('${item.id}')" class="btn-admin" style="padding: 6px 10px; font-size: 0.78rem; background: #FEE2E2; color: #DC2626; border: 1px solid #FCA5A5; font-weight: 600; border-radius: 6px;">Excluir</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  updateStats();
}

function renderAdminTable(dataToRender) {
  renderAdminCards(dataToRender);
}

function filterAdminCards(query) {
  const q = query.toLowerCase();
  const filtered = currentProducts.filter(item =>
    item.nome.toLowerCase().includes(q) ||
    (item.categoria && item.categoria.toLowerCase().includes(q)) ||
    (item.descricao && item.descricao.toLowerCase().includes(q))
  );
  renderAdminCards(filtered);
}

let currentCoupons = [
  { id: 'c-1', code: 'PRIMEIRACOMPRA', type: 'percent', value: 10 },
  { id: 'c-2', code: 'FRETEGRATIS', type: 'fixed', value: 5.00 }
];

function loadCouponsData() {
  const saved = localStorage.getItem(STORAGE_KEY_COUPONS);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed.length >= 0) currentCoupons = parsed;
    } catch(e) {}
  }
}

function renderCouponsUI() {
  const tbody = document.getElementById('couponsTableBody');
  if (!tbody) return;

  const totalCountEl = document.getElementById('totalCouponsCount');
  if (totalCountEl) totalCountEl.innerText = currentCoupons.length;

  if (currentCoupons.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align: center; padding: 20px; color: #888;">
          Nenhum cupom cadastrado. Crie um cupom acima para oferecer descontos aos clientes!
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = currentCoupons.map(c => `
    <tr>
      <td><strong>${c.code.toUpperCase()}</strong></td>
      <td>${c.type === 'percent' ? 'Porcentagem (%)' : 'Valor Fixo (R$)'}</td>
      <td style="font-weight: 800; color: #2E7D32;">${c.type === 'percent' ? c.value + '%' : 'R$ ' + c.value.toFixed(2).replace('.', ',')}</td>
      <td>
        <button class="btn-admin btn-admin-danger" onclick="deleteCoupon('${c.id}')">Excluir</button>
      </td>
    </tr>
  `).join('');
}

function openAddCouponModal() {
  const modal = document.getElementById('couponModalForm');
  if (modal) modal.classList.add('active');
}

function closeCouponModal() {
  const modal = document.getElementById('couponModalForm');
  if (modal) modal.classList.remove('active');
}

async function addNewCoupon(event) {
  event.preventDefault();
  const codeInput = document.getElementById('newCouponCodeInput');
  const typeInput = document.getElementById('newCouponTypeInput');
  const valueInput = document.getElementById('newCouponValueInput');

  const code = codeInput.value.trim().toUpperCase();
  const type = typeInput.value;
  const val = parseFloat(valueInput.value) || 0;

  if (!code || val <= 0) {
    showToast('Por favor, preencha um código válido e um valor de desconto maior que zero.', 'error');
    return;
  }

  if (currentCoupons.some(c => c.code === code)) {
    showToast(`O cupom "${code}" já está cadastrado!`, 'error');
    return;
  }

  const newCoupon = {
    id: 'c-' + Date.now(),
    code: code,
    type: type,
    value: val
  };

  currentCoupons.push(newCoupon);
  await DbService.upsertCoupon(newCoupon);

  codeInput.value = '';
  valueInput.value = '';
  closeCouponModal();
  renderCouponsUI();
  showToast(`Cupom "${code}" criado com sucesso!`, 'success');
}
async function deleteCoupon(id) {
  const ok = await showConfirm('Tem certeza que deseja excluir este cupom de desconto?');
  if (!ok) return;
  currentCoupons = currentCoupons.filter(c => c.id !== id);
  await DbService.deleteCoupon(id);
  renderCouponsUI();
  showToast('Cupom excluído com sucesso!', 'success');
}

/* switchAdminTab unico e centralizado no topo do arquivo */

function openAddProductModal() {
  document.getElementById('productModalTitle').innerText = 'NOVO PRODUTO';
  document.getElementById('prodEditId').value = '';
  document.getElementById('productForm').reset();
  pendingProductImgBase64 = '';
  const preview = document.getElementById('prodFilePreview');
  const btnRemove = document.getElementById('btnRemoveProdImg');
  if (preview) { preview.src = ''; preview.style.display = 'none'; }
  if (btnRemove) btnRemove.style.display = 'none';
  const adicContainer = document.getElementById('adicionaisContainer');
  if (adicContainer) adicContainer.innerHTML = '';
  if (typeof renderCategoriesUI === 'function') renderCategoriesUI();
  const modal = document.getElementById('productFormModal');
  if (modal) modal.classList.add('active');
}

function closeProductFormModal() {
  document.getElementById('productFormModal').classList.remove('active');
}

function editProductItem(id) {
  const item = currentProducts.find(p => p.id === id);
  if (!item) return;

  renderCategoriesUI();

  const titleEl = document.getElementById('productModalTitle');
  if (titleEl) titleEl.innerText = 'Editar produto';
  document.getElementById('prodEditId').value = item.id;
  document.getElementById('prodName').value = item.nome;
  document.getElementById('prodCategory').value = item.categoria || '';
  document.getElementById('prodPrice').value = parseFloat(item.preco_grande || item.preco || 0) || '';
  document.getElementById('prodDesc').value = item.descricao || '';
  document.getElementById('prodBadge').value = item.badge || '';

  pendingProductImgBase64 = item.img_url || '';
  const preview = document.getElementById('prodFilePreview');
  const btnRemove = document.getElementById('btnRemoveProdImg');
  if (preview && item.img_url && item.img_url !== PLACEHOLDER_PRODUCT_IMG) {
    preview.src = item.img_url;
    preview.style.display = 'block';
    if (btnRemove) btnRemove.style.display = 'flex';
  } else {
    if (preview) preview.style.display = 'none';
    if (btnRemove) btnRemove.style.display = 'none';
  }

  const adicContainer = document.getElementById('adicionaisContainer');
  if (adicContainer) {
    adicContainer.innerHTML = '';
    let adics = item.adicionais || [];
    if (typeof adics === 'string') { try { adics = JSON.parse(adics); } catch(e) { adics = []; } }
    if (Array.isArray(adics)) adics.forEach(a => addAdicionalInputRow(a.nome, a.preco));
  }

  document.getElementById('productFormModal').classList.add('active');
}

async function saveProductItem(event) {
  event.preventDefault();

  const editId = document.getElementById('prodEditId').value;
  const name = document.getElementById('prodName').value.trim();
  const category = document.getElementById('prodCategory').value;
  const price = parseFloat(document.getElementById('prodPrice').value) || 0;
  const desc = document.getElementById('prodDesc').value.trim();
  const badge = document.getElementById('prodBadge').value.trim();
  let finalImg = pendingProductImgBase64;
  if (!finalImg || finalImg === 'REMOVED') {
    finalImg = PLACEHOLDER_PRODUCT_IMG;
  }

  const adicionaisList = collectAdicionaisFromModal();

  const candidate = {
    id: editId || ('prod-' + Date.now()),
    nome: name,
    categoria: category,
    preco: price,
    preco_grande: price,
    descricao: desc,
    img_url: finalImg,
    badge: badge,
    adicionais: adicionaisList
  };

  const validation = validateProduct(candidate);
  if (!validation.valid) {
    showToast('Não foi possível salvar o produto:\n- ' + validation.errors.join('\n- '), 'error');
    return;
  }
  if (editId) {
    const idx = currentProducts.findIndex(p => p.id === editId);
    if (idx !== -1) currentProducts[idx] = { ...currentProducts[idx], ...candidate };
  } else {
    currentProducts.push({ ...candidate, preco_media: price, preco_broto: price });
  }

  await DbService.upsertProduct(candidate);

  closeProductFormModal();
  renderAdminTable();
  showToast('Produto salvo com sucesso no cardápio!', 'success');
}
async function deleteProductItem(id) {
  const ok = await showConfirm('Tem certeza que deseja excluir este produto do cardápio?');
  if (!ok) return;
  currentProducts = currentProducts.filter(p => p.id !== id);
  await DbService.deleteProduct(id);
  renderAdminTable();
  showToast('Produto excluído do cardápio.', 'success');
}

function removeProductPhoto() {
  pendingProductImgBase64 = 'REMOVED';
  const preview = document.getElementById('prodFilePreview');
  const btnRemove = document.getElementById('btnRemoveProdImg');
  const fileInput = document.getElementById('prodFile');
  if (preview) { preview.src = ''; preview.style.display = 'none'; }
  if (btnRemove) btnRemove.style.display = 'none';
  if (fileInput) fileInput.value = '';
  showToast('Foto removida do produto.', 'info');
}

function addAdicionalInputRow(nome = '', preco = '') {
  const container = document.getElementById('adicionaisContainer');
  if (!container) return;

  const rowId = 'adic-row-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
  const row = document.createElement('div');
  row.id = rowId;
  row.style.cssText = 'display: flex; gap: 8px; align-items: center;';
  row.innerHTML = `
    <input type="text" class="admin-input adic-nome" placeholder="Nome do Opcional (Ex: Queijo Extra, Bacon...)" value="${nome}" style="flex: 2; padding: 8px 12px; font-size: 0.84rem;">
    <input type="number" step="0.50" class="admin-input adic-preco" placeholder="R$ (Ex: 4.00)" value="${preco}" style="flex: 1; padding: 8px 12px; font-size: 0.84rem;">
    <button type="button" onclick="document.getElementById('${rowId}').remove()" style="background: #FEE2E2; color: #DC2626; border: 1px solid #FCA5A5; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-weight: bold;">✕</button>
  `;
  container.appendChild(row);
}

function collectAdicionaisFromModal() {
  const container = document.getElementById('adicionaisContainer');
  if (!container) return [];
  const rows = container.querySelectorAll('div[id^="adic-row-"]');
  const items = [];
  rows.forEach(r => {
    const nomeEl = r.querySelector('.adic-nome');
    const precoEl = r.querySelector('.adic-preco');
    const nome = nomeEl ? nomeEl.value.trim() : '';
    const preco = precoEl ? (parseFloat(precoEl.value) || 0) : 0;
    if (nome) items.push({ nome, preco });
  });
  return items;
}

// Bind explicit para uso nos botões HTML (onclick)
window.switchAdminTab = switchAdminTab;
window.openAddProductModal = openAddProductModal;
window.closeProductFormModal = closeProductFormModal;
window.deleteProductItem = deleteProductItem;
window.editProductItem = editProductItem;
window.removeProductPhoto = removeProductPhoto;
window.addAdicionalInputRow = addAdicionalInputRow;
async function testSupabasePing() {
  if (window.DbService) {
    try {
      await DbService.getBranding();
      showToast('Conexão com o Supabase testada com sucesso! Conectado e operante.', 'success');
    } catch(e) {
      showToast('Erro ao testar conexão Supabase: ' + e.message, 'error');
    }
  } else {
    showToast('DbService indisponível no navegador.', 'error');
  }
}

window.switchAdminTab = switchAdminTab;
window.openAddProductModal = openAddProductModal;
window.closeProductFormModal = closeProductFormModal;
window.deleteProductItem = deleteProductItem;
window.editProductItem = editProductItem;
window.removeProductPhoto = removeProductPhoto;
window.addAdicionalInputRow = addAdicionalInputRow;
window.openAddCategoryModal = openAddCategoryModal;
window.closeCategoryModal = closeCategoryModal;
window.saveCategoryWithProducts = saveCategoryWithProducts;
window.deleteCategory = deleteCategory;
window.removeProductFromCategory = removeProductFromCategory;
window.openAddDeliveryZoneModal = openAddDeliveryZoneModal;
window.closeDeliveryZoneModal = closeDeliveryZoneModal;
window.addNewDeliveryZone = addNewDeliveryZone;
window.deleteDeliveryZone = deleteDeliveryZone;
window.openAddCouponModal = openAddCouponModal;
window.closeCouponModal = closeCouponModal;
window.addNewCoupon = addNewCoupon;
window.deleteCoupon = deleteCoupon;
window.renderAdminCards = renderAdminCards;
window.filterAdminCards = filterAdminCards;