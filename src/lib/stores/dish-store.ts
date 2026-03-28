import { writable } from 'svelte/store';

const API_BASE = '/api/dish';

export type DishCategory = 'cold' | 'hot' | 'soup';

export interface Dish {
	id: string;
	name: string;
	price: string;
	image: string;
	discount: number;
	category: DishCategory;
}



export interface DishCreate {
	name: string;
	price: string;
	image: string;
	discount?: number;
	category: DishCategory;
}

export interface DishUpdate {
	name?: string;
	price?: string;
	image?: string;
	discount?: number;
	category?: DishCategory;
}

export const dishes = writable<Dish[]>([]);
export const loading = writable(false);
export const error = writable<string | null>(null);

export async function fetchDishes(category?: DishCategory): Promise<void> {
	loading.set(true);
	error.set(null);
	try {
		const url = new URL(API_BASE + '/list', window.location.origin);
		if (category) url.searchParams.set('category', category);
		const res = await fetch(url.toString());
		if (!res.ok) throw new Error(`获取菜品失败：${res.status}`);
		const data: Dish[] = await res.json();
		dishes.set(data);
        console.log("dishes", data);

	} catch (e) {
		error.set(e instanceof Error ? e.message : String(e));
	} finally {
		loading.set(false);
	}
}

export async function createDish(params: DishCreate): Promise<Dish> {
	const res = await fetch(`${API_BASE}/create`, {
		method: 'POST',
		credentials: 'include',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(params)
	});
	if (!res.ok) {
		const detail = await res.json().catch(() => ({}));
		throw new Error(detail?.detail ?? `创建菜品失败：${res.status}`);
	}
	const dish: Dish = await res.json();
	dishes.update((list) => [...list, dish]);
	return dish;
}

export async function updateDish(id: string, params: DishUpdate): Promise<Dish> {
	const res = await fetch(`${API_BASE}/${id}/update`, {
		method: 'PATCH',
		credentials: 'include',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(params)
	});
	if (!res.ok) {
		const detail = await res.json().catch(() => ({}));
		throw new Error(detail?.detail ?? `更新菜品失败：${res.status}`);
	}
	const updated: Dish = await res.json();
	dishes.update((list) => list.map((d) => (d.id === id ? updated : d)));
	return updated;
}

export async function deleteDish(id: string): Promise<void> {
	const res = await fetch(`${API_BASE}/${id}/delete`, { method: 'DELETE', credentials: 'include' });
	if (!res.ok) {
		const detail = await res.json().catch(() => ({}));
		throw new Error(detail?.detail ?? `删除菜品失败：${res.status}`);
	}
	dishes.update((list) => list.filter((d) => d.id !== id));
}
