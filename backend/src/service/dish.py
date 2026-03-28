from typing import Annotated

from beanie import PydanticObjectId
from fastapi import HTTPException, APIRouter
from pydantic import BaseModel, Field

from src.db import Dish
from src.db.models import DishCategory
from src.types import PydanticDecimal128
from .user import UserSessionParsed

router = APIRouter(prefix="/dish", tags=["dish"])


class DishCreate(BaseModel):
    name: Annotated[str, Field(title="菜品名称", min_length=1, max_length=128)]
    price: Annotated[PydanticDecimal128, Field(title="价格")]
    image: Annotated[str, Field(title="图片（URL 或 Base64）")]
    discount: Annotated[float, Field(title="折扣（1.0=无折扣，0.8=八折）", ge=0.0, le=1.0)] = 1.0
    category: Annotated[DishCategory, Field(title="类别")]


class DishUpdate(BaseModel):
    name: Annotated[str | None, Field(title="菜品名称", min_length=1, max_length=128)] = None
    price: Annotated[PydanticDecimal128 | None, Field(title="价格")] = None
    image: Annotated[str | None, Field(title="图片（URL 或 Base64）")] = None
    discount: Annotated[float | None, Field(title="折扣（1.0=无折扣，0.8=八折）", ge=0.0, le=1.0)] = None
    category: Annotated[DishCategory | None, Field(title="类别")] = None


@router.get("/list")
async def list_dishes(category: DishCategory | None = None) -> list[Dish]:
    """获取菜品列表，可通过 category 参数按类别筛选"""
    if category is not None:
        return await Dish.find(Dish.category == category).to_list()
    return await Dish.find_all().to_list()


@router.post("/create")
async def create_dish(params: DishCreate, user: UserSessionParsed) -> Dish:
    """创建菜品（需要 admin 权限）"""
    if user is None or user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin permission required.")
    dish = Dish(**params.model_dump())
    await dish.insert()
    return dish


@router.patch("/{dish_id}/update")
async def update_dish(dish_id: PydanticObjectId, params: DishUpdate, user: UserSessionParsed) -> Dish:
    """更新菜品（需要 admin 权限）"""
    if user is None or user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin permission required.")
    dish = await Dish.get(dish_id)
    if dish is None:
        raise HTTPException(status_code=404, detail="Dish not found.")
    update_data = params.model_dump(exclude_none=True)
    if update_data:
        await dish.set(update_data)
    return dish


@router.delete("/{dish_id}/delete")
async def delete_dish(dish_id: PydanticObjectId, user: UserSessionParsed) -> dict:
    """删除菜品（需要 admin 权限）"""
    if user is None or user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin permission required.")
    dish = await Dish.get(dish_id)
    if dish is None:
        raise HTTPException(status_code=404, detail="Dish not found.")
    await dish.delete()
    return {"message": "Dish deleted."}
