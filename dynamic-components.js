/**
 * PIZZA TODO DIA — COMPONENTES DE ATENDIMENTO & DYNAMIC SHARED UI (INSTADELIVERY CLEAN)
 */

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

            <a href="index.html" class="ph-brand-logo">
                <div class="ph-logo-badge">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 2L2 7l10 15 10-15-10-5z"></path>
                        <path d="M12 22V12"></path>
                    </svg>
                </div>
                <div class="ph-logo-text-wrap">
                    <div class="ph-logo-text">PIZZA <span>TODO DIA</span></div>
                    <div class="ph-logo-sub">ANTIGA TRI PIZZAS</div>
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
                    <button class="ph-cat-pill" data-cat="combos" onclick="filterCategory('combos', this)">PROMOS DO DIA</button>
                    <button class="ph-cat-pill" data-cat="pizzas-salgadas" onclick="filterCategory('pizzas-salgadas', this)">PIZZAS SALGADAS</button>
                    <button class="ph-cat-pill" data-cat="pizzas-doces" onclick="filterCategory('pizzas-doces', this)">PIZZAS DOCES</button>
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
        <a href="https://wa.me/5531992082542?text=Olá!%20Vim%20pelo%20site%20da%20Pizza%20Todo%20Dia%20e%20gostaria%20de%20fazer%20um%20pedido!" target="_blank" class="wpp-float-btn" id="wppFloatBtn" aria-label="Atendimento via WhatsApp">
            <svg class="wpp-icon-svg" width="30" height="30" viewBox="0 0 24 24">
                <path d="M12.031 0c-6.627 0-12 5.373-12 12 0 2.159.57 4.26 1.654 6.105l-1.685 6.155 6.302-1.653c1.782.971 3.799 1.493 5.729 1.493 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12zm.009 22c-1.808 0-3.578-.484-5.128-1.402l-.367-.22-3.81 1 .997-3.712-.24-.383c-1.026-1.636-1.57-3.538-1.57-5.483 0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10zm5.498-7.443c-.301-.151-1.782-.879-2.058-.979-.275-.101-.476-.151-.677.151-.201.301-.778.979-.954 1.18-.176.201-.351.226-.652.075-1.758-.881-2.91-1.573-4.062-3.551-.308-.528.308-.49.881-1.637.101-.201.05-.377-.025-.528-.075-.151-.677-1.632-.929-2.235-.245-.587-.495-.508-.677-.517-.176-.008-.377-.008-.578-.008s-.528.075-.804.377c-.276.301-1.055 1.03-1.055 2.513s1.08 2.914 1.231 3.115c.151.201 2.125 3.245 5.15 4.552.719.31 1.281.496 1.719.635.724.23 1.382.197 1.902.12.579-.086 1.782-.728 2.033-1.431.251-.703.251-1.306.176-1.431-.075-.126-.276-.226-.577-.377z"/>
            </svg>
        </a>
    `,
    mobileBar: `
        <div class="mobile-sticky-bar" id="mobileStickyFooter">
            <button class="mobile-sticky-btn" onclick="openCartModal()">
                <span>VER MEU PEDIDO</span>
                <span style="background:#FFC72C; color:#000; padding:2px 8px; border-radius:50px; font-weight:900;" id="mobileStickyCartBadge">0</span>
            </button>
        </div>
    `,
    footer: `
        <footer>
            <div class="footer-inner">
                <div class="footer-info-col">
                    <h4 style="font-size: 1.4rem; font-weight: 900; font-style: italic; text-transform: uppercase;" id="footerStoreTitle">PIZZA <span style="color: var(--ph-red);">TODO DIA</span></h4>
                    <p style="font-size: 0.9rem; color: #CCC;" id="footerStoreSub">Antiga Tri Pizzas • Tradição e Sabor no Seu Bairro</p>
                    <div class="footer-info-item">
                        <svg class="lucide-icon-svg" viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                        <span id="footerCoverageTxt">Porto Alegre e Viamão (Atendimento Delivery)</span>
                    </div>
                    <div class="footer-info-item">
                        <svg class="lucide-icon-svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        <span>Terça a Domingo: 18h às 23h30</span>
                    </div>
                </div>
                <div style="font-size: 0.8rem; color: #AAA; text-align: right;">
                    <p>© 2026 Cardápio Digital — Todos os direitos reservados.</p>
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

function renderDynamicCategoriesInHeader() {
    const savedCategories = localStorage.getItem('ptd_store_categories');
    if (!savedCategories) return;

    try {
        const cats = JSON.parse(savedCategories);
        if (!cats || cats.length === 0) return;

        const navContainer = document.getElementById('categoriesTabContainer');
        if (navContainer) {
            let html = `<button class="ph-cat-pill active" data-cat="todos" onclick="filterCategory('todos', this)">TODOS OS PRODUTOS</button>`;
            cats.forEach(c => {
                html += `<button class="ph-cat-pill" data-cat="${c.id}" onclick="filterCategory('${c.id}', this)">${c.name.toUpperCase()}</button>`;
            });
            navContainer.innerHTML = html;
        }

        const drawerContainer = document.getElementById('drawerCategoryListContainer');
        if (drawerContainer) {
            let dHtml = `<div style="font-size: 0.7rem; font-weight: 900; color: #888; margin-bottom: 4px; text-transform: uppercase;">CARDÁPIO PRINCIPAL</div>`;
            dHtml += `<button class="drawer-cat-item active" onclick="selectDrawerCategory('todos')">TODOS OS PRODUTOS</button>`;
            cats.forEach(c => {
                dHtml += `<button class="drawer-cat-item" onclick="selectDrawerCategory('${c.id}')">${c.name.toUpperCase()}</button>`;
            });
            drawerContainer.innerHTML = dHtml;
        }
    } catch(e) {}
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
}

document.addEventListener('DOMContentLoaded', initSharedComponents);