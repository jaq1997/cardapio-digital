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

document.addEventListener('DOMContentLoaded', async () => {
  await loadAdminSettings();
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
  if (elPrimColor) elPrimColor.value = currentBranding.primaryColor || '#E91C24';

  const elPrimPicker = document.getElementById('cfgPrimaryColorPicker');
  if (elPrimPicker) elPrimPicker.value = currentBranding.primaryColor || '#E91C24';

  const elDarkColor = document.getElementById('cfgDarkColor');
  if (elDarkColor) elDarkColor.value = currentBranding.darkColor || '#C50303';

  const elDarkPicker = document.getElementById('cfgDarkColorPicker');
  if (elDarkPicker) elDarkPicker.value = currentBranding.darkColor || '#C50303';

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
  if (!prod.categoria || String(prod.categoria).trim().length === 0) errors.push('Categoria é obrigatória');
  if (isNaN(parseFloat(prod.preco)) || parseFloat(prod.preco) < 0) errors.push('Preço inválido');
  if (!prod.img_url || String(prod.img_url).trim().length === 0) errors.push('Imagem é obrigatória (URL ou upload)');
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
  const targetUrl = sheetsConfig.appsScriptUrl || DEFAULT_APPS_SCRIPT_URL;
  const storeSlug = currentBranding.storeName ? currentBranding.storeName.toLowerCase().replace(/[^a-z0-9]/g, '') : 'pizzariatododia';

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onerror = () => reject(new Error('Erro ao ler o arquivo de imagem.'));
    
    reader.onload = async () => {
      const base64 = reader.result.split(',')[1];
      if (!targetUrl) {
        resolve(reader.result);
        return;
      }

      try {
        const json = await apiRequest(targetUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json;charset=utf-8' },
          body: JSON.stringify({ action: 'uploadR2', folder: storeSlug, fileName: file.name, mimeType: file.type || 'image/png', base64: base64 })
        }, 20000);

        if (json && json.ok && json.url) {
          resolve(json.url);
        } else {
          resolve(reader.result);
        }
      } catch (err) {
        console.error('Erro no upload Cloudflare R2 Proxy:', err);
        resolve(reader.result);
      }
    };
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

function addNewDeliveryZone(event) {
  event.preventDefault();
  const nameInput = document.getElementById('newZoneNameInput');
  const priceInput = document.getElementById('newZonePriceInput');

  const name = nameInput.value.trim();
  const price = parseFloat(priceInput.value) || 0;

  if (!name) return;

  const newZoneId = 'z-' + Date.now();
  const newZone = { id: newZoneId, name: name, price: price };
  currentDeliveryZones.push(newZone);
  await DbService.upsertDeliveryZone(newZone);

  nameInput.value = '';
  priceInput.value = '';
  renderDeliveryZonesUI();
  showToast(`Região "${name}" (R$ ${price.toFixed(2)}) cadastrada com sucesso!`, 'success');
}

async function deleteDeliveryZone(zoneId) {
  const ok = await showConfirm('Deseja excluir esta taxa de entrega?');
  if (!ok) return;
  currentDeliveryZones = currentDeliveryZones.filter(z => z.id !== zoneId);
  await DbService.deleteDeliveryZone(zoneId);
  renderDeliveryZonesUI();
  showToast('Região excluída com sucesso!', 'success');
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

async function addNewCategory(event) {
  event.preventDefault();
  const input = document.getElementById('newCategoryInput');
  const catName = input.value.trim();
  if (!catName) return;

  const exists = currentCategories.some(c => c.name.toLowerCase() === catName.toLowerCase());
  if (exists) {
    const confirmCreate = await showConfirm(`Já existe uma categoria cadastrada com o nome "${catName}". Deseja criar outra categoria com este mesmo nome assim mesmo?`);
    if (!confirmCreate) return;
  }

  const catId = 'cat-' + Date.now();
  const newCat = { id: catId, name: catName, position: currentCategories.length };
  currentCategories.push(newCat);
  await DbService.upsertCategory(newCat);

  input.value = '';
  renderCategoriesUI();
  showToast(`Categoria "${catName}" adicionada com sucesso!`, 'success');
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
      if (preview) {
        preview.src = url;
        preview.style.display = 'block';
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
  currentBranding.primaryColor = document.getElementById('cfgPrimaryColor').value.trim();
  currentBranding.darkColor = document.getElementById('cfgDarkColor').value.trim();
  currentBranding.coverageCities = document.getElementById('cfgCoverageCities').value.trim();

  if (pendingLogoBase64) currentBranding.logoUrl = pendingLogoBase64;
  if (pendingBannerDeskBase64) currentBranding.bannerDeskUrl = pendingBannerDeskBase64;
  if (pendingBannerMobBase64) currentBranding.bannerMobUrl = pendingBannerMobBase64;

  applyUnifiedBrandingVariables(currentBranding.primaryColor, currentBranding.darkColor);
  await DbService.saveBranding(currentBranding);

  document.getElementById('adminStoreTitleDisplay').innerText = currentBranding.storeName;
  document.getElementById('currentWppDisplay').innerText = currentBranding.wppNumber;
  showToast('Configurações salvas com sucesso! A identidade visual, endereço, horários, banners e WhatsApp foram atualizados.', 'success');
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
      <tr onclick="editProductItem('${item.id}')" style="cursor: pointer;">
        <td class="td-id">#${item.id}</td>
        <td><img src="${item.img_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=150&q=80'}" class="thumb-img" alt="${item.nome}"></td>
        <td><strong>${item.nome}</strong></td>
        <td><span style="background: #E5E5E5; color: var(--ph-black); padding: 3px 8px; border-radius: 2px; font-weight: 800; font-size: 0.72rem; text-transform: uppercase;">${catNameDisplay}</span></td>
        <td>${item.badge ? `<span style="background: #FFF3E0; color: #E65100; padding: 3px 8px; border-radius: 2px; font-weight: 800; font-size: 0.72rem;">${item.badge}</span>` : '<span style="color:#BBB;">-</span>'}</td>
        <td class="td-price" style="font-weight: 900; font-size: 1.05rem; color: var(--ph-red);">R$ ${(item.preco_grande || item.preco || 0).toFixed(2).replace('.', ',')}</td>
        <td onclick="event.stopPropagation()">
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

const STORAGE_KEY_COUPONS = 'ptd_store_coupons';

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

function addNewCoupon(event) {
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

function switchAdminTab(tabName) {
  document.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active'));
  const tabs = ['items', 'categories', 'delivery', 'coupons', 'branding', 'sheets'];
  tabs.forEach(t => {
    const el = document.getElementById('tabContent' + t.charAt(0).toUpperCase() + t.slice(1));
    if (el) el.style.display = 'none';
  });

  const idx = tabs.indexOf(tabName);
  if (idx !== -1) {
    const btn = document.querySelectorAll('.nav-tab')[idx];
    if (btn) btn.classList.add('active');
    const content = document.getElementById('tabContent' + tabName.charAt(0).toUpperCase() + tabName.slice(1));
    if (content) content.style.display = 'block';
  }

  if (tabName === 'coupons') renderCouponsUI();
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

  const candidate = {
    id: editId || ('prod-' + Date.now()),
    nome: name,
    categoria: category,
    preco: price,
    preco_grande: price,
    descricao: desc,
    img_url: imgUrl,
    badge: badge
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
  // Sync local array
  if (editId) {
    const idx2 = currentProducts.findIndex(p => p.id === candidate.id);
    if (idx2 !== -1) currentProducts[idx2] = { ...currentProducts[idx2], ...candidate };
  } else {
    currentProducts.push({ ...candidate });
  }

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