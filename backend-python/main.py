import time
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from database import supabase

app = FastAPI(
    title="Pizzaria & Delivery API - Python + Supabase",
    description="API REST em Python conectada diretamente ao projeto Supabase",
    version="2.0.0"
)

# Habilita CORS completo
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------------------------------------------------------
# SCHEMAS PYDANTIC
# ----------------------------------------------------------------------------
class ProductModel(BaseModel):
    id: Optional[str] = None
    nome: str
    categoria: Optional[str] = ""
    descricao: Optional[str] = ""
    preco: float = 0.0
    preco_grande: Optional[float] = 0.0
    preco_media: Optional[float] = 0.0
    preco_broto: Optional[float] = 0.0
    badge: Optional[str] = ""
    img_url: Optional[str] = ""
    adicionais: Optional[List[Any]] = []
    status: Optional[str] = "ativo"

class CategoryModel(BaseModel):
    id: Optional[str] = None
    name: str
    position: Optional[int] = 0

class DeliveryZoneModel(BaseModel):
    id: Optional[str] = None
    name: str
    price: float = 0.0
    display_price: Optional[str] = None

class CouponModel(BaseModel):
    id: Optional[str] = None
    code: str
    type: Optional[str] = "percent"
    value: float = 0.0

class BrandingModel(BaseModel):
    storeName: Optional[str] = "Minha Loja"
    storeSub: Optional[str] = ""
    storeAddress: Optional[str] = ""
    storeHours: Optional[str] = ""
    wppNumber: Optional[str] = ""
    frete: Optional[float] = 5.00
    primaryColor: Optional[str] = "#18181B"
    btnTextColor: Optional[str] = "#FFFFFF"
    accentColor: Optional[str] = "#6344F5"
    badgeBgColor: Optional[str] = "#F1EEFE"
    logoUrl: Optional[str] = ""
    bannerDeskUrl: Optional[str] = ""
    bannerMobUrl: Optional[str] = ""

# ----------------------------------------------------------------------------
# ROTAS / ENDPOINTS CONECTADOS AO SUPABASE
# ----------------------------------------------------------------------------

@app.get("/")
def root():
    return {
        "status": "online",
        "backend": "Python FastAPI",
        "database": "Supabase PostgreSQL (qvwtviyqouzprltchtlr)",
        "docs": "/docs"
    }

# ----- 1. PRODUTOS -----
@app.get("/api/products")
def get_products():
    res = supabase.table("store_products").select("*").execute()
    return res.data or []

@app.post("/api/products", status_code=status.HTTP_201_CREATED)
def upsert_product(prod: ProductModel):
    prod_id = prod.id or f"prod-{int(time.time() * 1000)}"
    data = {
        "id": prod_id,
        "nome": prod.nome,
        "categoria": prod.categoria or "",
        "descricao": prod.descricao or "",
        "preco": prod.preco,
        "preco_grande": prod.preco_grande or prod.preco,
        "preco_media": prod.preco_media or prod.preco,
        "preco_broto": prod.preco_broto or prod.preco,
        "badge": prod.badge or "",
        "img_url": prod.img_url or "",
        "adicionais": prod.adicionais or [],
        "status": prod.status or "ativo"
    }
    res = supabase.table("store_products").upsert(data).execute()
    return res.data[0] if res.data else data

@app.delete("/api/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: str):
    supabase.table("store_products").delete().eq("id", product_id).execute()
    return None

# ----- 2. CATEGORIAS -----
@app.get("/api/categories")
def get_categories():
    res = supabase.table("store_categories").select("*").order("position").execute()
    return res.data or []

@app.post("/api/categories", status_code=status.HTTP_201_CREATED)
def upsert_category(cat: CategoryModel):
    cat_id = cat.id or f"cat-{int(time.time() * 1000)}"
    data = {"id": cat_id, "name": cat.name, "position": cat.position or 0}
    res = supabase.table("store_categories").upsert(data).execute()
    return res.data[0] if res.data else data

@app.delete("/api/categories/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(category_id: str):
    supabase.table("store_categories").delete().eq("id", category_id).execute()
    return None

# ----- 3. FORMAS DE ENTREGA -----
@app.get("/api/delivery-zones")
def get_delivery_zones():
    res = supabase.table("store_delivery_zones").select("*").execute()
    return res.data or []

@app.post("/api/delivery-zones", status_code=status.HTTP_201_CREATED)
def upsert_delivery_zone(zone: DeliveryZoneModel):
    zone_id = zone.id or f"z-{int(time.time() * 1000)}"
    data = {"id": zone_id, "name": zone.name, "price": zone.price, "display_price": zone.display_price or ""}
    res = supabase.table("store_delivery_zones").upsert(data).execute()
    return res.data[0] if res.data else data

@app.delete("/api/delivery-zones/{zone_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_delivery_zone(zone_id: str):
    supabase.table("store_delivery_zones").delete().eq("id", zone_id).execute()
    return None

# ----- 4. CUPONS -----
@app.get("/api/coupons")
def get_coupons():
    res = supabase.table("store_coupons").select("*").execute()
    return res.data or []

@app.post("/api/coupons", status_code=status.HTTP_201_CREATED)
def upsert_coupon(coupon: CouponModel):
    coupon_id = coupon.id or f"c-{int(time.time() * 1000)}"
    data = {"id": coupon_id, "code": coupon.code.upper(), "type": coupon.type or "percent", "value": coupon.value}
    res = supabase.table("store_coupons").upsert(data).execute()
    return res.data[0] if res.data else data

@app.delete("/api/coupons/{coupon_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_coupon(coupon_id: str):
    supabase.table("store_coupons").delete().eq("id", coupon_id).execute()
    return None

# ----- 5. BRANDING / IDENTIDADE -----
@app.get("/api/branding")
def get_branding():
    res = supabase.table("store_branding").select("*").eq("id", 1).execute()
    if res.data and len(res.data) > 0:
        return res.data[0]
    return {}

@app.post("/api/branding")
def save_branding(b: BrandingModel):
    data = {
        "id": 1,
        "store_name": b.storeName or "Minha Loja",
        "store_sub": b.storeSub or "",
        "store_address": b.storeAddress or "",
        "store_hours": b.storeHours or "",
        "wpp_number": b.wppNumber or "",
        "frete": b.frete or 5.00,
        "primary_color": b.primaryColor or "#18181B",
        "dark_color": b.accentColor or "#6344F5",
        "logo_url": b.logoUrl or "",
        "banner_desk_url": b.bannerDeskUrl or "",
        "banner_mob_url": b.bannerMobUrl or ""
    }
    res = supabase.table("store_branding").upsert(data).execute()
    return res.data[0] if res.data else data
