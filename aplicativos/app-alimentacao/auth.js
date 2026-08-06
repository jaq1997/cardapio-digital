/* ==========================================================================
   AUTH — Autenticação Supabase para o painel admin
   Inclua este arquivo no <head> do admin.html APÓS supabase-client.js
   ========================================================================== */

const AUTH = {

  /* Verifica sessão ativa. Se não tiver, redireciona para o login. */
  async guardAdmin() {
    if (!window.SUPABASE_READY) {
      console.warn('[Auth] Supabase não configurado. Admin liberado sem autenticação.');
      AUTH._showAdminContent();
      return;
    }

    const { data: { session } } = await window.db.auth.getSession();

    if (!session) {
      window.location.replace('admin-login.html');
      return;
    }

    if (session.user) {
      const newStoreId = session.user.id;
      localStorage.setItem('active_store_id', newStoreId);

      // Compara o CURRENT_STORE_ID que foi setado no page load (config.js) com o
      // UUID real da sessão. Se for diferente (ex: primeiro login onde era 'default',
      // ou troca de conta), recarrega para recalcular CURRENT_STORE_ID corretamente.
      const currentConstStoreId = (typeof CURRENT_STORE_ID !== 'undefined') ? CURRENT_STORE_ID : null;
      if (currentConstStoreId !== newStoreId) {
        window.location.reload();
        return;
      }
    }

    AUTH._showAdminContent();
  },

  /* Realiza login com email e senha */
  async login(email, password) {
    if (!window.SUPABASE_READY) {
      console.warn('[Auth] Supabase não configurado.');
      return { error: { message: 'Supabase não configurado.' } };
    }

    const { data, error } = await window.db.auth.signInWithPassword({ email, password });
    if (!error && data && data.user) {
      // Associa o store_id ao ID do usuário autenticado no Supabase
      localStorage.setItem('active_store_id', data.user.id);
    }
    return { data, error };
  },

  /* Realiza logout */
  async logout() {
    if (window.SUPABASE_READY) {
      await window.db.auth.signOut();
    }
    localStorage.removeItem('active_store_id');
    window.location.replace('admin-login.html');
  },

  /* Retorna o usuário logado ou null */
  async getUser() {
    if (!window.SUPABASE_READY) return null;
    const { data: { user } } = await window.db.auth.getUser();
    return user;
  },

  /* Exibe o conteúdo do admin (remove o loader de autenticação) */
  _showAdminContent() {
    const loader = document.getElementById('authLoader');
    const content = document.getElementById('adminContent');
    if (loader) loader.style.display = 'none';
    if (content) content.style.display = 'block';
  }
};

/* Listener para mudanças de sessão (ex: token expirado) */
if (window.SUPABASE_READY && window.db) {
  window.db.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_OUT') {
      const isAdminPage = window.location.pathname.includes('admin.html');
      if (isAdminPage) window.location.replace('admin-login.html');
    }
  });
}
