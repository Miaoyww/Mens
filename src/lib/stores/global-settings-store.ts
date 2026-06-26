import { writable } from 'svelte/store';

export interface GlobalSettings {

	/** 是否已完成/跳过欢迎向导 */
	welcomeCompleted: boolean;
	/** 主题偏好 */
	theme: 'light' | 'dark' | 'system';
	/** 全局字体（CSS font-family 字符串，"default" 表示使用默认字体） */
	fontFamily: string;
}

const STORAGE_KEY = 'mens_settings';

const DEFAULTS: GlobalSettings = {
	welcomeCompleted: false,
	theme: 'system',
	fontFamily: 'default',
};

function loadSettings(): GlobalSettings {
	if (typeof localStorage === 'undefined') return { ...DEFAULTS };
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : { ...DEFAULTS };
	} catch {
		return { ...DEFAULTS };
	}
}

function createGlobalSettings() {
	const { subscribe, set, update } = writable<GlobalSettings>(loadSettings());

	function persist(value: GlobalSettings) {
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
		}
	}

	return {
		subscribe,
		patch(partial: Partial<GlobalSettings>) {
			update((s) => {
				const next = { ...s, ...partial };
				persist(next);
				return next;
			});
		},
		/** 标记欢迎向导已完成 */
		completeWelcome() {
			update((s) => {
				const next = { ...s, welcomeCompleted: true };
				persist(next);
				return next;
			});
		},
		reset() {
			set({ ...DEFAULTS });
			if (typeof localStorage !== 'undefined') {
				localStorage.removeItem(STORAGE_KEY);
			}
		}
	};
}

export const globalSettings = createGlobalSettings();
