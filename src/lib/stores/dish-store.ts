import { writable } from 'svelte/store';
import { fetchDishes as apiFetchDishes, createDish as apiCreateDish, updateDish as apiUpdateDish, deleteDish as apiDeleteDish } from '$lib/api';
import type { Dish, DishCreate, DishUpdate, DishCategory } from '$lib/types';

export type { Dish, DishCreate, DishUpdate, DishCategory };

export const dishes = writable<Dish[]>([]);
export const loading = writable(false);
export const error = writable<string | null>(null);

export async function fetchDishes(category?: DishCategory): Promise<void> {
    loading.set(true);
    error.set(null);
    try {
        const data = await apiFetchDishes(category);
        dishes.set(data);
        console.log('dishes', data);
    } catch (e) {
        error.set(e instanceof Error ? e.message : String(e));
    } finally {
        loading.set(false);
    }
}

export async function createDish(params: DishCreate): Promise<Dish> {
    const dish = await apiCreateDish(params);
    dishes.update((list) => [...list, dish]);
    return dish;
}

export async function updateDish(id: string, params: DishUpdate): Promise<Dish> {
    const updated = await apiUpdateDish(id, params);
    dishes.update((list) => list.map((d) => (d.id === id ? updated : d)));
    return updated;
}

export async function deleteDish(id: string): Promise<void> {
    await apiDeleteDish(id);
    dishes.update((list) => list.filter((d) => d.id !== id));
}
