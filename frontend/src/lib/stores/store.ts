import { writable } from "svelte/store";

function persistedWritable<T>(key: string, defaultValue: T) {
    let initial = defaultValue;
    if (typeof localStorage !== 'undefined') {
        try {
            const raw = localStorage.getItem(key);
            if (raw !== null) initial = JSON.parse(raw) as T;
        } catch {}
    }
    const store = writable<T>(initial);
    if (typeof localStorage !== 'undefined') {
        store.subscribe((value) => {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch {}
        });
    }
    return store;
}

export interface WifiInfo {
    name: string;
    password: string;
}

export const wifi = persistedWritable<WifiInfo>('menu_wifi', {
    name: 'Restaurant_Guest',
    password: 'welcome888',
});

export const settings = persistedWritable('menu_settings', {
    themeColor: '#2563EB',
    backgroundImage: '',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=还没完成',
});