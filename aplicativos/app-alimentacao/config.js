const SUPABASE_URL      = 'https://qvwtviyqouzprltchtlr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2d3R2aXlxb3V6cHJsdGNodGxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzNDkxODMsImV4cCI6MjEwMDkyNTE4M30.6CEOMM88zC0JcuecOdytbbzJMM-OD0y79j9GK7pWBeM'; 

// Mapeamento de subdomínios personalizados para os IDs das lojas no Supabase (UUID)
const MAPA_SUBDOMINIOS = {
  'testeodenbreitburger': '1e08fb6e-a4d4-412f-a668-a875bf267c0e',
};

const urlParams = new URLSearchParams(window.location.search);
const hostParts = window.location.hostname.split('.');
const subdomainAtual = hostParts.length > 2 ? hostParts[0] : null;

// Detecta o ID da loja via parâmetro ?loja=, pelo subdomínio ou via localStorage / default
const CURRENT_STORE_ID = urlParams.get('loja') 
  || (subdomainAtual && MAPA_SUBDOMINIOS[subdomainAtual]) 
  || localStorage.getItem('active_store_id') 
  || 'default';
 