/* Defaults centralizados para admin.js e loja.js */

/* URLs e chaves compartilhadas com a planilha remota */
const DEFAULT_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzB3UaSFxQeE9Wxj6BPuzC00T0k30eiq3EoZfTZgtwXqOCTL9IAuL9YMAytZX3ZyTACzw/exec';
const DEFAULT_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTnWp67Ggx_hVGo4gLXJZtGJZa9ZrmO91sLF3cmzPqLOpgRhY-VdkWk3UyX5-eILluZJNxRIL4RdcRk/pub?output=csv';
const BASE_URL_FOTOS = 'https://pub-67111bf9eee943e3aeaf4b493b4dd034.r2.dev/';

const STORAGE_KEY_BRANDING    = 'ptd_store_branding';
const STORAGE_KEY_PRODUCTS    = 'ptd_store_products';
const STORAGE_KEY_CATEGORIES  = 'ptd_store_categories';
const STORAGE_KEY_DELIVERY_ZONES = 'ptd_delivery_zones';
const STORAGE_KEY_SHEETS_CONFIG  = 'ptd_sheets_config';

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

// Alias usado pelo `loja.js` original
const defaultCatalogData = defaultProducts;

/* Simple Toast + Confirm utilities (available globally)
   showToast(message, type='info', duration=3000)
   showConfirm(message) -> Promise<boolean>
*/
(function(){
  function ensureToastStyle() {
    if (document.getElementById('ptd-toast-styles')) return;
    const style = document.createElement('style');
    style.id = 'ptd-toast-styles';
    style.textContent = `
      .ptd-toast-container{position:fixed;top:18px;right:18px;z-index:99999;display:flex;flex-direction:column;gap:8px}
      .ptd-toast{background:#333;color:#fff;padding:10px 14px;border-radius:6px;box-shadow:0 6px 18px rgba(0,0,0,0.12);font-weight:600;min-width:220px}
      .ptd-toast.success{background:#2E7D32}
      .ptd-toast.error{background:#C62828}
      .ptd-confirm-backdrop{position:fixed;inset:0;background:rgba(0,0,0,0.45);display:flex;align-items:center;justify-content:center;z-index:100000}
      .ptd-confirm-card{background:#fff;color:#222;padding:20px;border-radius:8px;max-width:420px;box-shadow:0 8px 30px rgba(0,0,0,0.2)}
      .ptd-confirm-actions{display:flex;gap:8px;justify-content:flex-end;margin-top:12px}
      .ptd-confirm-btn{padding:8px 12px;border-radius:6px;border:none;cursor:pointer}
      .ptd-confirm-btn.primary{background:#E91C24;color:#fff}
      .ptd-confirm-btn.ghost{background:#f3f3f3}
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

  function showToast(message, type='info', duration=3000){
    ensureToastStyle();
    const c = getToastContainer();
    const t = document.createElement('div');
    t.className = `ptd-toast ${type==='success'?'success':type==='error'?'error':''}`;
    t.innerText = message;
    c.appendChild(t);
    setTimeout(()=>{ t.style.opacity = '0'; t.addEventListener('transitionend', ()=> t.remove()); }, duration);
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
