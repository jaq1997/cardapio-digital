/* ==========================================================================
   CLIENTE SUPABASE — SINGLETON
   Disponível globalmente como `window.db`
   Requer: config.js carregado antes deste arquivo
   ========================================================================== */

(function () {
  if (typeof SUPABASE_URL === 'undefined' || SUPABASE_URL.includes('COLE_AQUI')) {
    console.warn('[Supabase] config.js não configurado. Usando modo localStorage.');
    window.db = null;
    window.SUPABASE_READY = false;
    return;
  }

  try {
    const { createClient } = supabase;
    window.db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    window.SUPABASE_READY = true;
    console.info('[Supabase] Cliente inicializado com sucesso.');
  } catch (e) {
    console.error('[Supabase] Erro ao inicializar cliente:', e);
    window.db = null;
    window.SUPABASE_READY = false;
  }
})();
