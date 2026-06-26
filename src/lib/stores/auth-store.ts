import { writable } from 'svelte/store';
import { checkAuth as apiCheckAuth, login as apiLogin, logout as apiLogout, setupAdmin as apiSetupAdmin } from '$lib/api';
import type { AuthUser, AuthState } from '$lib/stores/types';

export type { AuthUser, AuthState };

export const auth = writable<AuthState>({ status: 'loading' });

/** 从 Tauri 后端获取当前登录用户，更新 auth store */
export async function checkAuth(): Promise<AuthUser | null> {
    auth.set({ status: 'loading' });
    try {
        const user = await apiCheckAuth();
        if (user) {
            auth.set({ status: 'authenticated', user });
            return user;
        } else {
            auth.set({ status: 'unauthenticated' });
            return null;
        }
    } catch {
        auth.set({ status: 'unauthenticated' });
        return null;
    }
}

/** 登录 */
export async function login(username: string, password: string): Promise<void> {
    await apiLogin(username, password);
    await checkAuth();
}

/** 退出登录 */
export async function logout(): Promise<void> {
    await apiLogout();
    auth.set({ status: 'unauthenticated' });
}

/** 初始化第一个 admin（仅系统中无用户时可用）*/
export async function setupAdmin(username: string, password: string): Promise<void> {
    await apiSetupAdmin(username, password);
    await checkAuth();
}
