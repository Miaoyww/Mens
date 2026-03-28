<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { Trash2, RefreshCw } from '@lucide/svelte';
	import type { Dish } from '$lib/stores/dish-store';

	let {
		open,
		dish,
		onconfirm,
		onclose
	}: {
		open: boolean;
		dish: Dish | null;
		onconfirm: () => Promise<void>;
		onclose: () => void;
	} = $props();

	let loading = $state(false);

	async function confirm() {
		loading = true;
		try {
			await onconfirm();
		} finally {
			loading = false;
		}
	}
</script>

{#if open}
	<div
		class="fixed inset-0 z-10001 flex items-center justify-center p-4"
		transition:fade={{ duration: 150 }}
	>
		<div class="absolute inset-0 bg-black/50 backdrop-blur-sm" onclick={onclose}></div>
		<div
			class="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
			transition:scale={{ duration: 200, start: 0.95 }}
		>
			<div class="px-6 pt-8 pb-6 text-center">
				<div
					class="w-16 h-16 bg-red-100 border-4 border-red-50 rounded-full flex items-center justify-center mx-auto mb-4"
				>
					<Trash2 size={24} class="text-red-500" />
				</div>
				<h3 class="text-lg font-bold text-slate-800 mb-2">确认删除</h3>
				<p class="text-slate-500 text-sm leading-relaxed">
					确定要删除菜品
					<span class="font-bold text-slate-800">「{dish?.name}」</span>？<br />此操作无法撤销。
				</p>
			</div>
			<div
				class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3"
			>
				<button
					onclick={onclose}
					class="text-sm text-slate-500 hover:text-slate-800 px-4 py-2 rounded-xl hover:bg-slate-200 transition-all font-medium"
				>取消</button>
				<button
					onclick={confirm}
					disabled={loading}
					class="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all"
				>
					{#if loading}
						<RefreshCw size={13} class="animate-spin" />
						删除中…
					{:else}
						<Trash2 size={13} />
						确认删除
					{/if}
				</button>
			</div>
		</div>
	</div>
{/if}
