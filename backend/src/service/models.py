from typing import Annotated

from beanie import PydanticObjectId
from pydantic import BaseModel, Field


class UserPublic(BaseModel):
    """公开用户信息"""
    id: PydanticObjectId
    username: Annotated[str, Field(title="用户名")]
