

const SHARED_COMPONENTS = {
    nav: `
        <nav class="ph-main-nav">
            <button class="mobile-hamburger-btn" onclick="toggleMobileDrawer(true)" aria-label="Abrir Menu">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
            </button>

            <a href="index.html" class="ph-brand-logo" id="headerBrandLogo">
                <div class="ph-logo-badge">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 2L2 7l10 15 10-15-10-5z"></path>
                        <path d="M12 22V12"></path>
                    </svg>
                </div>
                <div class="ph-logo-text-wrap">
                    <div class="ph-logo-text" id="headerLogoText">MINHA <span>LOJA</span></div>
                    <div class="ph-logo-sub" id="headerLogoSub">CARDÁPIO DIGITAL</div>
                </div>
            </a>

            <div class="ph-search-wrap">
                <svg class="ph-search-icon-svg" width="16" height="16" viewBox="0 0 24 24">
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
                <input type="text" class="ph-search-input" id="globalSearchInput" placeholder="Buscar no cardápio..." oninput="handleSearch(this.value)">
            </div>
            
            <div class="ph-nav-right">
                <button class="ph-cart-btn" onclick="openCartModal()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    <span class="cart-btn-txt">CARRINHO</span>
                    <span class="ph-cart-badge" id="cartCountBadge">0</span>
                </button>
            </div>
        </nav>

        <!-- CATEGORIAS DINÂMICAS DO CARDÁPIO -->
        <div class="ph-categories-section">
            <div class="ph-categories-wrapper">
                <div class="ph-categories-inner" id="categoriesTabContainer">
                    <button class="ph-cat-pill active" data-cat="todos" onclick="filterCategory('todos', this)">TODOS OS PRODUTOS</button>
                    <button class="ph-cat-pill" data-cat="destaques" onclick="filterCategory('destaques', this)">DESTAQUES</button>
                    <button class="ph-cat-pill" data-cat="pratos" onclick="filterCategory('pratos', this)">PRATOS</button>
                    <button class="ph-cat-pill" data-cat="bebidas" onclick="filterCategory('bebidas', this)">BEBIDAS</button>
                </div>
            </div>
        </div>
    `,
    drawer: `
        <div class="mobile-drawer-overlay" id="drawerOverlay" onclick="toggleMobileDrawer(false)"></div>
        <div class="mobile-drawer-card" id="drawerCard">
            <div class="drawer-header">
                <div class="drawer-title" id="drawerStoreTitle">PIZZA TODO DIA</div>
                <button class="drawer-close-btn" onclick="toggleMobileDrawer(false)">✕</button>
            </div>
            
            <div style="margin-bottom: 14px;">
                <input type="text" class="ph-search-input" style="width: 100%;" placeholder="Buscar no cardápio..." oninput="handleSearch(this.value)">
            </div>

            <div class="drawer-cat-list" id="drawerCategoryListContainer">
                <div style="font-size: 0.7rem; font-weight: 900; color: #888; margin-bottom: 4px; text-transform: uppercase;">CARDÁPIO PRINCIPAL</div>
                <button class="drawer-cat-item active" onclick="selectDrawerCategory('todos')">TODOS OS PRODUTOS</button>
                <button class="drawer-cat-item" onclick="selectDrawerCategory('combos')">PROMOS DO DIA</button>
                <button class="drawer-cat-item" onclick="selectDrawerCategory('pizzas-salgadas')">PIZZAS SALGADAS</button>
                <button class="drawer-cat-item" onclick="selectDrawerCategory('pizzas-doces')">PIZZAS DOCES</button>
                <button class="drawer-cat-item" onclick="selectDrawerCategory('bebidas')">BEBIDAS</button>
            </div>
        </div>
    `,
    wppFloat: `
        <a href="https://wa.me/5531992082542" target="_blank" class="ph-wpp-float" id="floatWppBtn" aria-label="Fazer pedido no WhatsApp">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.764.459 3.485 1.332 5.001l-1.415 5.166 5.289-1.385c1.464.798 3.116 1.218 4.783 1.219h.004c5.505 0 9.988-4.478 9.989-9.984 0-2.667-1.038-5.174-2.926-7.062a9.923 9.923 0 0 0-7.066-2.939zm5.952 14.502c-.251.706-1.458 1.348-2.022 1.433-.518.078-1.196.111-3.447-.818-2.879-1.189-4.735-4.116-4.879-4.307-.143-.191-1.168-1.554-1.168-2.964 0-1.41.741-2.104 1.004-2.387.263-.283.573-.354.765-.354.192 0 .383.003.548.01.175.008.411-.067.643.489.239.574.814 1.986.886 2.13.072.144.119.311.024.499-.096.188-.144.306-.287.474-.143.167-.301.373-.43.501-.143.143-.293.299-.126.586.167.287.74 1.22 1.587 1.975 1.09.972 2.008 1.274 2.295 1.417.287.143.454.119.622-.072.167-.191.718-.838.91-1.125.191-.287.383-.239.646-.143.263.096 1.674.79 1.961.933.287.143.479.215.55.335.072.12.072.694-.179 1.401z"/>
            </svg>
        </a>
    `,
    mobileBar: `
        <div class="mobile-sticky-bar">
            <button class="ph-btn-red-lg" style="width: 100%; font-size: 0.9rem;" onclick="openCartModal()">
                <span>VER CARRINHO</span>
            </button>
        </div>
    `,
    footer: `
        <footer class="ph-footer">
            <div class="ph-footer-inner">
                <div class="ph-footer-col">
                    <div style="font-family: var(--font-display); font-weight: 900; font-size: 1.2rem; margin-bottom: 6px; font-style: italic;" id="footerStoreTitle"></div>
                    <p style="font-size: 0.82rem; color: #888888; margin-bottom: 10px;" id="footerStoreSub"></p>
                    <div class="footer-info-item" id="footerAddressBox" style="display: none; align-items: center; gap: 8px; font-size: 0.82rem; color: #CCCCCC; margin-top: 6px;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                        <span id="footerAddressText"></span>
                    </div>
                    <div class="footer-info-item" id="footerHoursBox" style="display: none; align-items: center; gap: 8px; font-size: 0.82rem; color: #CCCCCC; margin-top: 4px;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        <span id="footerHoursText"></span>
                    </div>
                </div>
                <div class="ph-footer-col" style="text-align: right;">
                    <div style="font-size: 0.78rem; color: #666666;">&copy; 2026 Todos os direitos reservados.</div>
                    <div style="font-size: 0.78rem; color: #888; margin-top: 4px;">Criado e Desenvolvido por <a href="https://evolux360.com.br" target="_blank" rel="noopener" style="color: #aaa; text-decoration: underline;">Evolux360</a></div>
                </div>
            </div>
        </footer>
    `
};

function toggleMobileDrawer(open) {
    const overlay = document.getElementById('drawerOverlay');
    const card = document.getElementById('drawerCard');
    if (open) {
        overlay.classList.add('active');
        card.classList.add('active');
    } else {
        overlay.classList.remove('active');
        card.classList.remove('active');
    }
}

function selectDrawerCategory(catName) {
    filterCategory(catName, null);
    toggleMobileDrawer(false);
}

function applyBrandingToUI() {
    const savedBranding = localStorage.getItem('ptd_store_branding');
    if (!savedBranding) return;

    try {
        const cfg = JSON.parse(savedBranding);

        if (cfg.primaryColor) {
            document.documentElement.style.setProperty('--ph-red', cfg.primaryColor);
        }
        if (cfg.darkColor) {
            document.documentElement.style.setProperty('--ph-red-dark', cfg.darkColor);
        }

        if (cfg.storeName) {
            const name = cfg.storeName.trim();
            const textEl = document.getElementById('headerLogoText');
            if (textEl) {
                const words = name.split(' ');
                if (words.length > 1) {
                    textEl.innerHTML = `${words[0]} <span>${words.slice(1).join(' ')}</span>`;
                } else {
                    textEl.innerText = name;
                }
            }
            const drawerTitle = document.getElementById('drawerStoreTitle');
            if (drawerTitle) drawerTitle.innerText = name.toUpperCase();

            const footerTitle = document.getElementById('footerStoreTitle');
            if (footerTitle) footerTitle.innerText = name.toUpperCase();
        }

        if (cfg.storeSub) {
            const subEl = document.getElementById('headerLogoSub');
            if (subEl) subEl.innerText = cfg.storeSub.toUpperCase();
            const footerSub = document.getElementById('footerStoreSub');
            if (footerSub) footerSub.innerText = cfg.storeSub;
        }

        if (cfg.storeAddress) {
            const addrEl = document.getElementById('footerAddressText');
            if (addrEl) addrEl.innerText = cfg.storeAddress;
        }

        if (cfg.storeHours) {
            const hoursEl = document.getElementById('footerHoursText');
            if (hoursEl) hoursEl.innerText = cfg.storeHours;
        }

        // SE SUBIU LOGO EM IMAGEM (.PNG / .JPG), SUBSTITUI PELO LOGO DA IMAGEM E ATUALIZA FAVICON DA ABA
        if (cfg.logoUrl) {
            const brandLogoAnchor = document.getElementById('headerBrandLogo');
            if (brandLogoAnchor) {
                brandLogoAnchor.innerHTML = `<img src="${cfg.logoUrl}" style="max-height: 44px; border-radius: 4px; object-fit: contain;" alt="${cfg.storeName || 'Logo'}">`;
            }
            const favicon = document.getElementById('pageFavicon');
            if (favicon) favicon.href = cfg.logoUrl;
        }

        if (cfg.wppNumber) {
            const wppFloat = document.getElementById('floatWppBtn');
            if (wppFloat) {
                const textMsg = encodeURIComponent("Olá! Quero fazer meu pedido pelo WhatsApp.");
                wppFloat.href = `https://wa.me/${cfg.wppNumber}?text=${textMsg}`;
            }
        }
    } catch(e) {}
}

function renderDynamicCategoriesInHeader() {
    const savedCategories = localStorage.getItem('ptd_store_categories');
    const navContainer = document.getElementById('categoriesTabContainer');
    const drawerContainer = document.getElementById('drawerCategoryListContainer');

    let cats = [];
    if (savedCategories) {
        try {
            cats = JSON.parse(savedCategories);
        } catch(e) {}
    }

    if (cats && cats.length > 0) {
        if (navContainer) {
            let html = '';
            cats.forEach((c, idx) => {
                const activeClass = idx === 0 ? 'active' : '';
                html += `<button class="ph-cat-pill ${activeClass}" data-cat="${c.id}" onclick="filterCategory('${c.id}', this)">${c.name.toUpperCase()}</button>`;
            });
            navContainer.innerHTML = html;
        }

        if (drawerContainer) {
            let dHtml = `<div style="font-size: 0.7rem; font-weight: 900; color: #888; margin-bottom: 4px; text-transform: uppercase;">CARDÁPIO PRINCIPAL</div>`;
            dHtml += `<button class="drawer-cat-item active" onclick="selectDrawerCategory('todos')">TODOS OS PRODUTOS</button>`;
            cats.forEach(c => {
                dHtml += `<button class="drawer-cat-item" onclick="selectDrawerCategory('${c.id}')">${c.name.toUpperCase()}</button>`;
            });
            drawerContainer.innerHTML = dHtml;
        }
    } else {
        if (navContainer) {
            navContainer.innerHTML = '';
        }
        if (drawerContainer) {
            drawerContainer.innerHTML = `<div style="font-size: 0.7rem; font-weight: 900; color: #888; margin-bottom: 4px; text-transform: uppercase;">CARDÁPIO PRINCIPAL</div><button class="drawer-cat-item active" onclick="selectDrawerCategory('todos')">TODOS OS PRODUTOS</button>`;
        }
    }
}

function initSharedComponents() {
    const body = document.body;
    
    const headerWrap = document.createElement('header');
    headerWrap.className = 'ph-header';
    headerWrap.innerHTML = SHARED_COMPONENTS.nav;
    body.insertBefore(headerWrap, body.firstChild);

    const drawerWrap = document.createElement('div');
    drawerWrap.innerHTML = SHARED_COMPONENTS.drawer;
    body.appendChild(drawerWrap);

    const wppDiv = document.createElement('div');
    wppDiv.innerHTML = SHARED_COMPONENTS.wppFloat;
    body.appendChild(wppDiv.firstElementChild);

    const mobileSticky = document.createElement('div');
    mobileSticky.innerHTML = SHARED_COMPONENTS.mobileBar;
    body.appendChild(mobileSticky.firstElementChild);

    const footerDiv = document.createElement('div');
    footerDiv.innerHTML = SHARED_COMPONENTS.footer;
    body.appendChild(footerDiv.firstElementChild);

    renderDynamicCategoriesInHeader();
    applyBrandingToUI();
}

document.addEventListener('DOMContentLoaded', initSharedComponents);