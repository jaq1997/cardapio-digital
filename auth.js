/* ==========================================================================
   AUTH — Autenticação Supabase para o painel admin
   Inclua este arquivo no <head> do admin.html APÓS supabase-client.js
   ========================================================================== */

const AUTH = {

  /* Verifica sessão ativa. Se não tiver, redireciona para o login. */
  async guardAdmin() {
    if (!window.SUPABASE_READY) {
      // Supabase não configurado — acesso liberado em modo dev/local
      console.warn('[Auth] Supabase não configurado. Admin liberado sem autenticação.');
      AUTH._showAdminContent();
      return;
    }

    const { data: { session } } = await window.db.auth.getSession();

    if (!session) {
      window.location.replace('admin-login.html');
      return;
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
    return { data, error };
  },

  /* Realiza logout */
  async logout() {
    if (!window.SUPABASE_READY) return;
    await window.db.auth.signOut();
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
