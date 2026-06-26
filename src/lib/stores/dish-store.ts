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

// ── Category options & styles ────────────────────────────────────────────────

export const categoryOptions: { value: DishCategory; label: string }[] = [
    { value: 'hot', label: '热菜' },
    { value: 'cold', label: '冷菜' },
    { value: 'soup', label: '汤' }
];

export const categoryStyle: Record<string, { text: string; classes: string }> = {
    hot: { text: '热菜', classes: 'bg-orange-100 text-orange-700 border border-orange-200' },
    cold: { text: '冷菜', classes: 'bg-sky-100 text-sky-700 border border-sky-200' },
    soup: { text: '汤', classes: 'bg-amber-100 text-amber-700 border border-amber-200' }
};

// ── Price helpers ────────────────────────────────────────────────────────────

export function effectivePrice(price: number | string, discount: number): string {
    const result = (typeof price === 'string' ? parseFloat(price) : price) * discount;
    return result % 1 === 0 ? result.toFixed(0) : result.toFixed(1);
}

export function discountDisplay(d: number): string {
    if (d >= 1) return '原价';
    const val = d * 10;
    return `${val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)}折`;
}
