from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field

# ----- ADICIONAL SCHEMA -----
class AdicionalSchema(BaseModel):
    nome: str
    preco: float = 0.0

# ----- PRODUTO SCHEMAS -----
class ProductCreate(BaseModel):
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
    adicionais: Optional[List[AdicionalSchema]] = []
    status: Optional[str] = "ativo"

class ProductResponse(ProductCreate):
    id: str

    class Config:
        from_attributes = True

# ----- CATEGORIA SCHEMAS -----
class CategoryCreate(BaseModel):
    id: Optional[str] = None
    name: str
    position: Optional[int] = 0

class CategoryResponse(CategoryCreate):
    id: str

    class Config:
        from_attributes = True

# ----- ENTREGA SCHEMAS -----
class DeliveryZoneCreate(BaseModel):
    id: Optional[str] = None
    name: str
    price: float = 0.0
    display_price: Optional[str] = None

class DeliveryZoneResponse(DeliveryZoneCreate):
    id: str

    class Config:
        from_attributes = True

# ----- CUPOM SCHEMAS -----
class CouponCreate(BaseModel):
    id: Optional[str] = None
    code: str
    type: Optional[str] = "percent"  # 'percent' ou 'fixed'
    value: float = 0.0

class CouponResponse(CouponCreate):
    id: str

    class Config:
        from_attributes = True

# ----- BRANDING SCHEMAS -----
class BrandingUpdate(BaseModel):
    store_name: Optional[str] = "Minha Loja"
    store_sub: Optional[str] = ""
    store_address: Optional[str] = ""
    store_hours: Optional[str] = ""
    wpp_number: Optional[str] = ""
    frete: Optional[float] = 5.00
    primary_color: Optional[str] = "#18181B"
    btn_text_color: Optional[str] = "#FFFFFF"
    accent_color: Optional[str] = "#6344F5"
    badge_bg_color: Optional[str] = "#F1EEFE"
    logo_url: Optional[str] = ""
    banner_desk_url: Optional[str] = ""
    banner_mob_url: Optional[str] = ""

class BrandingResponse(BrandingUpdate):
    id: int = 1

    class Config:
        from_attributes = True

# ----- PEDIDO SCHEMAS -----
class OrderCreate(BaseModel):
    id: Optional[str] = None
    customer_name: Optional[str] = ""
    customer_phone: Optional[str] = ""
    delivery_type: Optional[str] = "entrega"
    address: Optional[str] = ""
    payment_method: Optional[str] = "dinheiro"
    items_json: List[Dict[str, Any]] = []
    subtotal: float = 0.0
    frete: float = 0.0
    discount: float = 0.0
    total: float = 0.0
    status: Optional[str] = "pendente"

class OrderResponse(OrderCreate):
    id: str

    class Config:
        from_attributes = True
