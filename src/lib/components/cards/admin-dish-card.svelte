<script lang="ts">
	import { Pencil, Trash2 } from '@lucide/svelte';
	import type { Dish } from '$lib/stores/dish-store';
	import { categoryStyle, effectivePrice, discountDisplay } from '$lib/stores/admin-store';

	let {
		dish,
		onedit,
		ondelete
	}: {
		dish: Dish;
		onedit: (dish: Dish) => void;
		ondelete: (dish: Dish) => void;
	} = $props();
</script>

<tr class="hover:bg-blue-50/30 transition-colors group">
	<!-- 菜品名 + 缩略图 -->
	<td class="px-6 py-3.5">
		<div class="flex items-center gap-3">
			{#if dish.image}
				<img
					src={dish.image}
					alt={dish.name}
					class="w-11 h-11 rounded-xl object-cover bg-slate-100 shadow-sm ring-1 ring-slate-200"
				/>
			{:else}
				<div
					class="w-11 h-11 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-300 text-xl select-none"
				>
					🍽
				</div>
			{/if}
			<span class="font-semibold text-slate-800 text-[13px] leading-snug">{dish.name}</span>
		</div>
	</td>

	<!-- 分类标签 -->
	<td class="px-4 py-3.5">
		<span
			class="text-[11px] font-semibold px-2.5 py-1 rounded-full {categoryStyle[dish.category]
				?.classes ?? ''}"
		>
			{categoryStyle[dish.category]?.text ?? dish.category}
		</span>
	</td>

	<!-- 原价 -->
	<td class="px-4 py-3.5 text-sm text-slate-500">¥{dish.price}</td>

	<!-- 折扣 -->
	<td class="px-4 py-3.5">
		{#if dish.discount >= 1}
			<span class="text-slate-300 text-xs">—</span>
		{:else}
			<span
				class="text-[11px] font-bold bg-red-50 text-red-500 border border-red-100 px-2.5 py-0.5 rounded-full"
			>
				{discountDisplay(dish.discount)}
			</span>
		{/if}
	</td>

	<!-- 实售价 -->
	<td class="px-4 py-3.5">
		<span class="text-sm font-black text-blue-600">¥{effectivePrice(dish.price, dish.discount)}</span>
	</td>

	<!-- 操作按钮（hover 显示） -->
	<td class="px-6 py-3.5">
		<div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
			<button
				onclick={() => onedit(dish)}
				class="flex items-center gap-1 text-[12px] text-slate-600 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 border border-transparent hover:border-blue-200 px-3 py-1.5 rounded-lg transition-all"
			>
				<Pencil size={11} />编辑
			</button>
			<button
				onclick={() => ondelete(dish)}
				class="flex items-center gap-1 text-[12px] text-slate-600 hover:text-red-600 bg-slate-100 hover:bg-red-50 border border-transparent hover:border-red-200 px-3 py-1.5 rounded-lg transition-all"
			>
				<Trash2 size={11} />删除
			</button>
		</div>
	</td>
</tr>