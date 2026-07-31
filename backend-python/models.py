import datetime
from sqlalchemy import Column, String, Float, Integer, Text, DateTime, JSON
from database import Base

class ProductModel(Base):
    __tablename__ = "products"

    id = Column(String, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    categoria = Column(String, default="")
    descricao = Column(Text, default="")
    preco = Column(Float, default=0.0)
    preco_grande = Column(Float, default=0.0)
    preco_media = Column(Float, default=0.0)
    preco_broto = Column(Float, default=0.0)
    badge = Column(String, default="")
    img_url = Column(Text, default="")
    adicionais = Column(JSON, default=list)  # Lista de dicts: [{"nome": "Queijo Extra", "preco": 5.0}]
    status = Column(String, default="ativo")

class CategoryModel(Base):
    __tablename__ = "categories"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
    position = Column(Integer, default=0)

class DeliveryZoneModel(Base):
    __tablename__ = "delivery_zones"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    price = Column(Float, default=0.0)
    display_price = Column(String, default="")

class CouponModel(Base):
    __tablename__ = "coupons"

    id = Column(String, primary_key=True, index=True)
    code = Column(String, nullable=False, unique=True)
    type = Column(String, default="percent")  # 'percent' ou 'fixed'
    value = Column(Float, default=0.0)

class BrandingModel(Base):
    __tablename__ = "branding"

    id = Column(Integer, primary_key=True, default=1)
    store_name = Column(String, default="Minha Loja")
    store_sub = Column(String, default="")
    store_address = Column(String, default="")
    store_hours = Column(String, default="")
    wpp_number = Column(String, default="")
    frete = Column(Float, default=5.00)
    primary_color = Column(String, default="#18181B")
    btn_text_color = Column(String, default="#FFFFFF")
    accent_color = Column(String, default="#6344F5")
    badge_bg_color = Column(String, default="#F1EEFE")
    logo_url = Column(Text, default="")
    banner_desk_url = Column(Text, default="")
    banner_mob_url = Column(Text, default="")

class OrderModel(Base):
    __tablename__ = "orders"

    id = Column(String, primary_key=True, index=True)
    customer_name = Column(String, default="")
    customer_phone = Column(String, default="")
    delivery_type = Column(String, default="entrega")
    address = Column(Text, default="")
    payment_method = Column(String, default="dinheiro")
    items_json = Column(JSON, default=list)
    subtotal = Column(Float, default=0.0)
    frete = Column(Float, default=0.0)
    discount = Column(Float, default=0.0)
    total = Column(Float, default=0.0)
    status = Column(String, default="pendente")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
