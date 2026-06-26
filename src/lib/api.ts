import { invoke } from '@tauri-apps/api/core';
import type { Dish, DishCreate, DishUpdate, DishCategory } from '$lib/types';

// ── Dishes ──────────────────────────────────────────────────────────────────

export async function fetchDishes(category?: DishCategory): Promise<Dish[]> {
    return invoke<Dish[]>('get_dishes', { category: category ?? null });
}

export async function createDish(input: DishCreate): Promise<Dish> {
    return invoke<Dish>('create_dish', { input });
}

export async function updateDish(id: string, input: DishUpdate): Promise<Dish> {
    return invoke<Dish>('update_dish', { id, input });
}

export async function deleteDish(id: string): Promise<void> {
    return invoke<void>('delete_dish', { id });
}
