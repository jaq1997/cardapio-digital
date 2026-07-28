let adminData = [];

document.addEventListener('DOMContentLoaded', () => {
  fetch('data.csv')
    .then(res => res.text())
    .then(text => {
      adminData = parseCSVAdmin(text);
      updateDashboardStats();
      renderAdminTable();
    });
});

function parseCSVAdmin(text) {
  const lines = text.trim().split('\n');
  const items = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const row = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
    if (row.length >= 10) {
      items.push({
        id: row[0],
        nome: row[1],
        categoria: row[2],
        descricao: row[3],
        preco_broto: parseFloat(row[4]) || 0,
        preco_media: parseFloat(row[5]) || 0,
        preco_grande: parseFloat(row[6]) || 0,
        preco_gigante: parseFloat(row[7]) || 0,
        badge: row[8],
        img_url: row[9]
      });
    }
  }
  return items;
}

function updateDashboardStats() {
  const pizzas = adminData.filter(i => i.categoria.includes('pizzas'));
  const combos = adminData.filter(i => i.categoria === 'combos');
  const outras = adminData.filter(i => i.categoria === 'bebidas' || i.categoria === 'entradas');

  document.getElementById('totalPizzasCount').innerText = pizzas.length;
  document.getElementById('totalCombosCount').innerText = combos.length;
  document.getElementById('totalBebidasCount').innerText = outras.length;
}

function renderAdminTable(dataToRender = adminData) {
  const tbody = document.getElementById('adminTableBody');
  if (!tbody) return;

  tbody.innerHTML = dataToRender.map(item => `
    <tr>
      <td>#${item.id}</td>
      <td><img src="${item.img_url}" class="thumb-img" alt="${item.nome}"></td>
      <td><strong>${item.nome}</strong></td>
      <td><span style="background: var(--surface-1); padding: 4px 8px; border-radius: 4px; font-size: 0.76rem;">${item.categoria}</span></td>
      <td>R$ ${item.preco_broto.toFixed(2)}</td>
      <td>R$ ${item.preco_media.toFixed(2)}</td>
      <td>R$ ${item.preco_grande.toFixed(2)}</td>
      <td>R$ ${item.preco_gigante.toFixed(2)}</td>
      <td>
        <button class="btn-primary" style="padding: 4px 10px; font-size: 0.78rem;" onclick="editAdminItem('${item.id}')">Editar</button>
      </td>
    </tr>
  `).join('');
}

function filterAdminTable(query) {
  const q = query.toLowerCase();
  const filtered = adminData.filter(item => item.nome.toLowerCase().includes(q) || item.categoria.toLowerCase().includes(q));
  renderAdminTable(filtered);
}

function switchAdminTab(tabName) {
  document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tabContentItems').style.display = 'none';
  document.getElementById('tabContentConfig').style.display = 'none';

  if (tabName === 'items') {
    document.querySelectorAll('.admin-tab-btn')[0].classList.add('active');
    document.getElementById('tabContentItems').style.display = 'block';
  } else {
    document.querySelectorAll('.admin-tab-btn')[1].classList.add('active');
    document.getElementById('tabContentConfig').style.display = 'block';
  }
}

function savePizzeriaConfig() {
  const wpp = document.getElementById('cfgWppNumber').value;
  const frete = document.getElementById('cfgFrete').value;
  alert(`✅ Configurações da Pizzaria salvas com sucesso!\n\nWhatsApp: ${wpp}\nTaxa Frete: R$ ${frete}`);
}

function openAddProductModal() {
  alert('Formulário de cadastro de novos sabores aberto! (Na versão integrada com banco de dados ele salva instantaneamente no CSV/Sheets).');
}

function editAdminItem(id) {
  const item = adminData.find(i => i.id === id);
  if (item) {
    alert(`Editar sabor: ${item.nome}\nPreço Grande Atual: R$ ${item.preco_grande.toFixed(2)}`);
  }
}