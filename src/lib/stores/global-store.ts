import { writable } from 'svelte/store';

// ── Types ──────────────────────────────────────────────────────────────────

export interface WifiInfo {
    name: string;
    password: string;
}

export interface GlobalSettings {
    /** Theme color (hex, e.g. '#2563EB') */
    themeColor: string;
    /** Background image URL (empty = solid color) */
    backgroundImage: string;
    /** QR code image URL */
    qrCodeUrl: string;
    /** WiFi info shown on public display */
    wifi: WifiInfo;
}

// ── Defaults ───────────────────────────────────────────────────────────────

const DEFAULTS: GlobalSettings = {
    themeColor: '#2563EB',
    backgroundImage: '',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=还没完成',
    wifi: {
        name: 'Restaurant_Guest',
        password: 'welcome888',
    },
};

const STORAGE_KEY = 'mens_global_settings';

// ── Persistence ────────────────────────────────────────────────────────────

function load(): GlobalSettings {
    if (typeof localStorage === 'undefined') return { ...DEFAULTS };
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const stored = JSON.parse(raw) as Partial<GlobalSettings>;
            return {
                ...DEFAULTS,
                ...stored,
                wifi: { ...DEFAULTS.wifi, ...(stored.wifi ?? {}) },
            };
        }
    } catch { /* corrupted data, fall through to defaults */ }
    return { ...DEFAULTS };
}

function persist(value: GlobalSettings) {
    if (typeof localStorage !== 'undefined') {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
        } catch { /* quota exceeded or similar */ }
    }
}

// ── Store ──────────────────────────────────────────────────────────────────

function createGlobalSettingsStore() {
    const { subscribe, set, update } = writable<GlobalSettings>(load());

    return {
        subscribe,
        set(value: GlobalSettings) {
            set(value);
            persist(value);
        },
        update(fn: (s: GlobalSettings) => GlobalSettings) {
            update((s) => {
                const next = fn(s);
                persist(next);
                return next;
            });
        },
        /** Partial update — merges into existing settings. */
        patch(partial: Partial<GlobalSettings>) {
            update((s) => {
                const next = { ...s, ...partial };
                persist(next);
                return next;
            });
        },
        /** Reset to factory defaults. */
        reset() {
            const defaults = { ...DEFAULTS };
            set(defaults);
            persist(defaults);
        },
    };
}

export const globalSettings = createGlobalSettingsStore();
