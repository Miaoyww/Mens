"""
向 dish_menu 数据库批量插入随机菜品数据。
用法：python seed.py [--count 30] [--drop]
  --count  插入数量，默认 30
  --drop   插入前清空 dish 集合
"""
import asyncio
import argparse
import random
from decimal import Decimal

from pymongo import AsyncMongoClient

MONGO_URL = "mongodb://127.0.0.1:27017"
DB_NAME = "dish_menu"

CATEGORIES = ["cold", "hot", "soup"]

COLD_DISHES = ["凉拌黄瓜", "皮蛋豆腐", "夫妻肺片", "卤水拼盘", "凉拌木耳", "蒜泥白肉", "凉拌海蜇", "红油耳片"]
HOT_DISHES = ["宫保鸡丁", "鱼香肉丝", "红烧肉", "麻婆豆腐", "清炒时蔬", "干锅花菜", "水煮肉片", "糖醋排骨",
              "回锅肉", "辣子鸡", "葱爆牛肉", "蚝油生菜", "番茄炒蛋", "黄焖鸡", "剁椒鱼头"]
SOUP_DISHES = ["番茄蛋花汤", "酸辣汤", "紫菜虾皮汤", "萝卜排骨汤", "冬瓜薏米汤", "玉米排骨汤", "莲藕猪骨汤"]

DISH_NAMES = {
    "cold": COLD_DISHES,
    "hot": HOT_DISHES,
    "soup": SOUP_DISHES,
}

# Unsplash 随机食物图片（稳定可用）
IMAGE_URLS = [
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80",
    "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&q=80",
    "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&q=80",
    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80",
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&q=80",
    "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&q=80",
    "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&q=80",
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80",
    "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&q=80",
    "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&q=80",
]

DISCOUNT_OPTIONS = [1.0, 1.0, 1.0, 0.9, 0.85, 0.8, 0.75, 0.7]  # 多数无折扣


def random_price() -> str:
    """生成 8.00 ~ 128.00 之间、以 .0 或 .5 结尾的价格字符串"""
    base = random.randint(16, 256) * Decimal("0.5")
    return str(base)


def make_dish(used_names: set[str]) -> dict:
    category = random.choice(CATEGORIES)
    pool = DISH_NAMES[category]
    available = [n for n in pool if n not in used_names]
    if not available:
        # 同类已全部用完，加序号区分
        name = random.choice(pool) + str(random.randint(2, 9))
    else:
        name = random.choice(available)
    used_names.add(name)

    return {
        "name": name,
        "price": random_price(),
        "image": random.choice(IMAGE_URLS),
        "discount": random.choice(DISCOUNT_OPTIONS),
        "category": category,
    }


async def seed(count: int, drop: bool) -> None:
    client = AsyncMongoClient(MONGO_URL)
    db = client[DB_NAME]
    collection = db["dish"]

    if drop:
        await collection.drop()
        print("已清空 dish 集合")

    used_names: set[str] = set()
    docs = [make_dish(used_names) for _ in range(count)]
    result = await collection.insert_many(docs)
    print(f"成功插入 {len(result.inserted_ids)} 条菜品数据")
    await client.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="批量插入随机菜品数据")
    parser.add_argument("--count", type=int, default=30, help="插入数量（默认 30）")
    parser.add_argument("--drop", action="store_true", help="插入前清空 dish 集合")
    args = parser.parse_args()

    asyncio.run(seed(args.count, args.drop))
