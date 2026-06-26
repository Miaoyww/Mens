import { invoke } from '@tauri-apps/api/core';
import type { Dish, DishCreate, DishUpdate, DishCategory, AuthUser } from '$lib/stores/types';

// ── Auth ────────────────────────────────────────────────────────────────────

export async function checkAuth(): Promise<AuthUser | null> {
    return invoke<AuthUser | null>('check_auth');
}

export async function login(username: string, password: string): Promise<AuthUser> {
    return invoke<AuthUser>('login', { username, password });
}

export async function logout(): Promise<void> {
    return invoke<void>('logout');
}

export async function setupAdmin(username: string, password: string): Promise<AuthUser> {
    return invoke<AuthUser>('setup_admin', { username, password });
}

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
