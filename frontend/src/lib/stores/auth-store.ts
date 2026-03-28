import { writable } from 'svelte/store';

const API = '/api/user';

export interface AuthUser {
	username: string;
	role: string;
}

export type AuthState =
	| { status: 'loading' }
	| { status: 'unauthenticated' }
	| { status: 'authenticated'; user: AuthUser };

export const auth = writable<AuthState>({ status: 'loading' });

/** 从后端获取当前登录用户，更新 auth store */
export async function checkAuth(): Promise<AuthUser | null> {
	auth.set({ status: 'loading' });
	try {
		const res = await fetch(`${API}/self/get`, {
			method: 'POST',
			credentials: 'include'
		});
		if (!res.ok) {
			auth.set({ status: 'unauthenticated' });
			return null;
		}
		const user: AuthUser = await res.json();
		auth.set({ status: 'authenticated', user });
		return user;
	} catch {
		auth.set({ status: 'unauthenticated' });
		return null;
	}
}

/** 登录 */
export async function login(username: string, password: string): Promise<void> {
	const res = await fetch(`${API}/login`, {
		method: 'POST',
		credentials: 'include',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ username, password })
	});
	if (!res.ok) {
		const data = await res.json().catch(() => ({}));
		throw new Error(data?.detail ?? '登录失败');
	}
	await checkAuth();
}

/** 退出登录 */
export async function logout(): Promise<void> {
	await fetch(`${API}/logout`, { method: 'POST', credentials: 'include' });
	auth.set({ status: 'unauthenticated' });
}

/** 初始化第一个 admin（仅系统中无 admin 时可用）*/
export async function setupAdmin(username: string, password: string): Promise<void> {
	const res = await fetch(`${API}/setup`, {
		method: 'POST',
		credentials: 'include',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ username, password })
	});
	if (!res.ok) {
		const data = await res.json().catch(() => ({}));
		throw new Error(data?.detail ?? '初始化失败');
	}
	await checkAuth();
}
