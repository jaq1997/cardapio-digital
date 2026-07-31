import os
from supabase import create_client, Client

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://qvwtviyqouzprltchtlr.supabase.co")
SUPABASE_ANON_KEY = os.getenv(
    "SUPABASE_ANON_KEY",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2d3R2aXlxb3V6cHJsdGNodGxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzNDkxODMsImV4cCI6MjEwMDkyNTE4M30.6CEOMM88zC0JcuecOdytbbzJMM-OD0y79j9GK7pWBeM"
)

# Inicializa o cliente oficial do Supabase em Python
supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

def get_supabase():
    return supabase
