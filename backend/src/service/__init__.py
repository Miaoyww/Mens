from fastapi import APIRouter
from .user import router as user_router
from .dish import router as dish_router

router = APIRouter(prefix="/api")

router.include_router(user_router)
router.include_router(dish_router)
