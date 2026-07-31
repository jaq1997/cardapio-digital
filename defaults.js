/* Defaults centralizados para admin.js e loja.js */

/* URLs e chaves compartilhadas com a planilha remota */
const DEFAULT_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzB3UaSFxQeE9Wxj6BPuzC00T0k30eiq3EoZfTZgtwXqOCTL9IAuL9YMAytZX3ZyTACzw/exec';
const DEFAULT_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTnWp67Ggx_hVGo4gLXJZtGJZa9ZrmO91sLF3cmzPqLOpgRhY-VdkWk3UyX5-eILluZJNxRIL4RdcRk/pub?output=csv';
const BASE_URL_FOTOS = 'https://pub-67111bf9eee943e3aeaf4b493b4dd034.r2.dev/';

const STORAGE_KEY_BRANDING       = 'ptd_store_branding';
const STORAGE_KEY_PRODUCTS       = 'ptd_store_products';
const STORAGE_KEY_CATEGORIES     = 'ptd_store_categories';
const STORAGE_KEY_DELIVERY_ZONES = 'ptd_delivery_zones';
const STORAGE_KEY_SHEETS_CONFIG  = 'ptd_sheets_config';
const STORAGE_KEY_COUPONS        = 'ptd_store_coupons';

const defaultBranding = {
  storeName: "Minha Loja",
  storeSub: "",
  wppNumber: "5551989912555",
  frete: 5.00,
  primaryColor: "#18181B",
  darkColor: "#09090B",
  logoUrl: "",
  bannerDeskUrl: "",
  bannerMobUrl: "",
  coverageCities: "",
  storeAddress: "",
  storeHours: ""
};

const defaultDeliveryZones = [
  { id: "z-balcao", name: "Retirada no Balcão (Grátis)", price: 0.00 },
  { id: "z-bairro", name: "Bairros Próximos", price: 5.00 },
  { id: "z-distante", name: "Bairros Mais Distantes", price: 10.00 }
];

const defaultCategories = [
  { id: "destaques", name: "Destaques" },
  { id: "pratos", name: "Pratos" },
  { id: "bebidas", name: "Bebidas" }
];

const PLACEHOLDER_PRODUCT_IMG = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 24 24' fill='%23F4F4F6' stroke='%23CCCCCC' stroke-width='1.2' stroke-linecap='round' stroke-linejoin='round'><rect x='3' y='3' width='18' height='18' rx='3' ry='3'/><circle cx='8.5' cy='8.5' r='1.5'/><polyline points='21 15 16 10 5 21'/></svg>";

const defaultProducts = [
  {
    id: "demo-produto-1",
    nome: "Produto de exemplo",
    categoria: "destaques",
    descricao: "Este é um produto de demonstração. Acesse o painel admin para editar ou cadastrar seus próprios produtos.",
    preco: 96.00,
    preco_grande: 96.00,
    preco_media: 0,
    preco_broto: 0,
    badge: "-20% OFF",
    img_url: PLACEHOLDER_PRODUCT_IMG
  },
  {
    id: "demo-produto-2",
    nome: "Produto de exemplo",
    categoria: "destaques",
    descricao: "Este é um produto de demonstração. Acesse o painel admin para editar ou cadastrar seus próprios produtos.",
    preco: 122.00,
    preco_grande: 122.00,
    preco_media: 0,
    preco_broto: 0,
    badge: "",
    img_url: PLACEHOLDER_PRODUCT_IMG
  },
  {
    id: "demo-produto-3",
    nome: "Produto de exemplo",
    categoria: "pratos",
    descricao: "Este é um produto de demonstração. Acesse o painel admin para editar ou cadastrar seus próprios produtos.",
    preco: 320.00,
    preco_grande: 320.00,
    preco_media: 0,
    preco_broto: 0,
    badge: "",
    img_url: PLACEHOLDER_PRODUCT_IMG
  },
  {
    id: "demo-produto-4",
    nome: "Produto de exemplo",
    categoria: "bebidas",
    descricao: "Este é um produto de demonstração. Acesse o painel admin para editar ou cadastrar seus próprios produtos.",
    preco: 420.00,
    preco_grande: 420.00,
    preco_media: 0,
    preco_broto: 0,
    badge: "",
    img_url: PLACEHOLDER_PRODUCT_IMG
  }
];

// Alias usado pelo `loja.js` original
const defaultCatalogData = defaultProducts;

/* Simple Toast + Confirm utilities (available globally)
   showToast(message, type='info', duration=3000)
   showConfirm(message) -> Promise<boolean>
*/
/* Toast + Confirm de Produção (100% fluídos sem bloqueadores nativos de sistema) */
(function(){
  function ensureToastStyle() {
    if (document.getElementById('ptd-toast-styles')) return;
    const style = document.createElement('style');
    style.id = 'ptd-toast-styles';
    style.textContent = `
      .ptd-toast-container {
        position: fixed;
        top: 24px;
        right: 24px;
        z-index: 999999;
        display: flex;
        flex-direction: column;
        gap: 10px;
        pointer-events: none;
      }
      .ptd-toast {
        pointer-events: auto;
        background: #18181B;
        color: #FFFFFF;
        padding: 12px 20px;
        border-radius: 50px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.22);
        font-weight: 600;
        font-size: 0.88rem;
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 260px;
        max-width: 420px;
        transform: translateY(-20px);
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        border: 1px solid rgba(255,255,255,0.1);
      }
      .ptd-toast.show {
        transform: translateY(0);
        opacity: 1;
      }
      .ptd-toast.success {
        background: #10B981;
        color: #FFFFFF;
      }
      .ptd-toast.error {
        background: #EF4444;
        color: #FFFFFF;
      }
      .ptd-toast.info {
        background: #6344F5;
        color: #FFFFFF;
      }
    `;
    document.head.appendChild(style);
  }

  function getToastContainer(){
    let c = document.querySelector('.ptd-toast-container');
    if (!c) {
      c = document.createElement('div');
      c.className = 'ptd-toast-container';
      document.body.appendChild(c);
    }
    return c;
  }

  function showToast(message, type='info', duration=3200){
    ensureToastStyle();
    const c = getToastContainer();
    const t = document.createElement('div');
    t.className = `ptd-toast ${type}`;
    
    let icon = 'ℹ️';
    if (type === 'success') icon = '✓';
    if (type === 'error') icon = '✕';

    t.innerHTML = `<span style="font-weight:800; font-size:1rem;">${icon}</span> <span>${message}</span>`;
    c.appendChild(t);

    requestAnimationFrame(() => {
      t.classList.add('show');
    });

    setTimeout(() => {
      t.classList.remove('show');
      setTimeout(() => t.remove(), 300);
    }, duration);
    return t;
  }

  function showConfirm(message){
    ensureToastStyle();
    return new Promise(resolve => {
      const backdrop = document.createElement('div'); backdrop.className = 'ptd-confirm-backdrop';
      const card = document.createElement('div'); card.className = 'ptd-confirm-card';
      const text = document.createElement('div'); text.innerText = message;
      const actions = document.createElement('div'); actions.className = 'ptd-confirm-actions';
      const btnCancel = document.createElement('button'); btnCancel.className = 'ptd-confirm-btn ghost'; btnCancel.innerText = 'Cancelar';
      const btnOk = document.createElement('button'); btnOk.className = 'ptd-confirm-btn primary'; btnOk.innerText = 'Confirmar';
      actions.appendChild(btnCancel); actions.appendChild(btnOk);
      card.appendChild(text); card.appendChild(actions); backdrop.appendChild(card); document.body.appendChild(backdrop);

      btnCancel.onclick = () => { backdrop.remove(); resolve(false); };
      btnOk.onclick = () => { backdrop.remove(); resolve(true); };
    });
  }

  window.showToast = showToast;
  window.showConfirm = showConfirm;

  function compressImageFile(file, maxWidth = 800, quality = 0.8) {
    return new Promise((resolve) => {
      if (!file || !file.type.startsWith('image/')) {
        resolve(null);
        return;
      }
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
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function cleanupBase64Storage() {
    try {
      const savedProds = localStorage.getItem('ptd_store_products');
      if (savedProds) {
        let prods = JSON.parse(savedProds);
        let modified = false;
        prods = prods.map(p => {
          if (p.img_url && p.img_url.length > 5000 && p.img_url.startsWith('data:image/')) {
            modified = true;
            return { ...p, img_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80' };
          }
          return p;
        });
        if (modified) {
          localStorage.setItem('ptd_store_products', JSON.stringify(prods));
        }
      }
    } catch(e) {}
  }

  window.compressImageFile = compressImageFile;
  window.cleanupBase64Storage = cleanupBase64Storage;

  try { cleanupBase64Storage(); } catch(e) {}
})();
