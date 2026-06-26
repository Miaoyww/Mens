import { writable } from 'svelte/store';

// ── Settings dialog ────────────────────────────────────────────────────────

export const settingsDialogOpen = writable(false);

// ── Sidebar ────────────────────────────────────────────────────────────────

export const sidebarOpen = writable(true);
export const rightBarPinned = writable(false);

// ── Alert dialog ───────────────────────────────────────────────────────────

export const alertDialogStore = writable({
    open: false,
    title: '',
    description: '',
});

export function showAlert(title: string, description: string) {
    alertDialogStore.set({ open: true, title, description });
}

export function hideAlert() {
    alertDialogStore.update((state) => ({ ...state, open: false }));
}
