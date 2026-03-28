from datetime import datetime
from enum import Enum
from typing import Annotated

from beanie import Document, Indexed, Link
from pydantic import Field

from src.types import PydanticDecimal128


class User(Document):
    """用户"""
    username: Annotated[str, Field(title="用户名"), Indexed(unique=True)]
    password_sha256: Annotated[str, Field(title="密码")]
    role: Annotated[str, Field(title="角色")] = "user"

    class Settings:
        name = "user"


class UserSession(Document):
    """用户会话"""
    value: Annotated[str, Indexed(unique=True)]
    expires_at: datetime
    user: Link[User]

    class Settings:
        name = "user_session"


class DishCategory(str, Enum):
    COLD = "cold"   # 冷菜
    HOT = "hot"     # 热菜
    SOUP = "soup"   # 汤


class Dish(Document):
    """菜品"""
    name: Annotated[str, Field(title="菜品名称", max_length=128), Indexed()]
    price: Annotated[PydanticDecimal128, Field(title="价格")]
    image: Annotated[str, Field(title="图片（URL 或 Base64）")]
    discount: Annotated[float, Field(title="折扣（1.0=无折扣，0.8=八折）", ge=0.0, le=1.0)] = 1.0
    category: Annotated[DishCategory, Field(title="类别"), Indexed()]

    class Settings:
        name = "dish"