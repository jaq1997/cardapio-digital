const SUPABASE_URL      = 'https://qvwtviyqouzprltchtlr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2d3R2aXlxb3V6cHJsdGNodGxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzNDkxODMsImV4cCI6MjEwMDkyNTE4M30.6CEOMM88zC0JcuecOdytbbzJMM-OD0y79j9GK7pWBeM'; 

// Detecta o ID da loja via parâmetro de URL (?loja=minhaloja) ou usa 'default'
const urlParams = new URLSearchParams(window.location.search);
const CURRENT_STORE_ID = urlParams.get('loja') || localStorage.getItem('active_store_id') || 'default'; 