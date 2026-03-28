import type { DishCategory } from '$lib/stores/dish-store';

export const categoryOptions: { value: DishCategory; label: string; emoji: string }[] = [
	{ value: 'hot', label: '热菜', emoji: '🍳' },
	{ value: 'cold', label: '冷菜', emoji: '🥗' },
	{ value: 'soup', label: '汤', emoji: '🍲' }
];

export const categoryStyle: Record<string, { text: string; classes: string }> = {
	hot: { text: '热菜', classes: 'bg-orange-100 text-orange-700 border border-orange-200' },
	cold: { text: '冷菜', classes: 'bg-sky-100 text-sky-700 border border-sky-200' },
	soup: { text: '汤', classes: 'bg-amber-100 text-amber-700 border border-amber-200' }
};

export function effectivePrice(price: string, discount: number): string {
	const result = parseFloat(price) * discount;
	return result % 1 === 0 ? result.toFixed(0) : result.toFixed(1);
}

export function discountDisplay(d: number): string {
	if (d >= 1) return '原价';
	const val = d * 10;
	return `${val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)}折`;
}
