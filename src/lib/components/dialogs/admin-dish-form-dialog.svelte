<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { Save, X, RefreshCw, AlertTriangle } from '@lucide/svelte';
	import type { Dish, DishCategory } from '$lib/stores/dish-store';
	import { categoryOptions, effectivePrice, discountDisplay } from '$lib/stores/admin-store';

	let {
		open,
		mode,
		dish = null,
		onsubmit,
		onclose
	}: {
		open: boolean;
		mode: 'add' | 'edit';
		dish?: Dish | null;
		onsubmit: (data: {
			id: string;
			name: string;
			price: string;
			image: string;
			discount: number;
			category: DishCategory;
		}) => Promise<void>;
		onclose: () => void;
	} = $props();

	// 内部表单状态，每次 open 或 dish 变化时同步
	let name = $state('');
	let price = $state('');
	let image = $state('');
	let discount = $state(1.0);
	let category = $state<DishCategory>('hot');
	let formError = $state('');
	let submitting = $state(false);

	$effect(() => {
		if (open) {
			name = dish?.name ?? '';
			price = dish?.price ?? '';
			image = dish?.image ?? '';
			discount = dish?.discount ?? 1.0;
			category = dish?.category ?? 'hot';
			formError = '';
			submitting = false;
		}
	});

	async function submit() {
		formError = '';
		if (!name.trim()) {
			formError = '请输入菜品名称';
			return;
		}
		const priceNum = parseFloat(price);
		if (isNaN(priceNum) || priceNum <= 0) {
			formError = '请输入有效的正数价格';
			return;
		}
		submitting = true;
		try {
            console.log({dish});
			await onsubmit({
				id: dish?.id ?? '',
				name: name.trim(),
				price,
				image: image.trim(),
				discount,
				category
			});
		} catch (e) {
			formError = e instanceof Error ? e.message : '操作失败，请重试';
		} finally {
			submitting = false;
		}
	}
	function hideImageOnError(e: Event) {
		(e.target as HTMLImageElement).style.display = 'none';
	}
</script>

{#if open}
	<div
		class="fixed inset-0 z-10001 flex items-center justify-center p-4"
		transition:fade={{ duration: 150 }}
	>
		<!-- Backdrop -->
		<div class="absolute inset-0 bg-black/50 backdrop-blur-sm" onclick={onclose}></div>

		<!-- Panel -->
		<div
			class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
			transition:scale={{ duration: 200, start: 0.95 }}
		>
			<!-- Header -->
			<div class="bg-linear-to-r from-blue-700 to-blue-600 px-6 py-4 flex items-center justify-between">
				<h3 class="text-white font-bold text-base">
					{mode === 'add' ? '添加菜品' : '编辑菜品'}
				</h3>
				<button
					onclick={onclose}
					class="text-blue-200 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
				>
					<X size={18} />
				</button>
			</div>

			<!-- Body -->
			<div class="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
				<!-- 名称 -->
				<div class="space-y-1.5">
					<label class="text-sm font-semibold text-slate-700">
						菜品名称 <span class="text-red-500">*</span>
					</label>
					<input
						bind:value={name}
						placeholder="例：清炒时蔬"
						class="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 transition-all"
					/>
				</div>

				<!-- 价格 + 分类 -->
				<div class="grid grid-cols-2 gap-3">
					<div class="space-y-1.5">
						<label class="text-sm font-semibold text-slate-700">
							价格 (元) <span class="text-red-500">*</span>
						</label>
						<input
							type="number"
							bind:value={price}
							placeholder="0.00"
							min="0"
							step="0.5"
							class="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 transition-all"
						/>
					</div>
					<div class="space-y-1.5">
						<label class="text-sm font-semibold text-slate-700">分类</label>
						<select
							bind:value={category}
							class="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 transition-all"
						>
							{#each categoryOptions as opt}
								<option value={opt.value}>{opt.emoji} {opt.label}</option>
							{/each}
						</select>
					</div>
				</div>

				<!-- 折扣滑块 -->
				<div class="space-y-2">
					<div class="flex items-center justify-between">
						<label class="text-sm font-semibold text-slate-700">折扣</label>
						<span class="text-sm font-bold text-blue-600">
							{#if discount >= 1}
								原价
							{:else}
								{discountDisplay(discount)}
								{#if price}
									<span class="text-slate-400 font-normal text-xs ml-1">
										→ ¥{effectivePrice(price, discount)}
									</span>
								{/if}
							{/if}
						</span>
					</div>
					<input
						type="range"
						bind:value={discount}
						min="0.1"
						max="1"
						step="0.05"
						class="w-full h-1.5 rounded-full accent-blue-600 cursor-pointer"
					/>
					<div class="flex justify-between text-[11px] text-slate-400 select-none">
						<span>1折</span>
						<span>5折</span>
						<span>原价</span>
					</div>
				</div>

				<!-- 图片 URL -->
				<div class="space-y-1.5">
					<label class="text-sm font-semibold text-slate-700">
						图片 URL
						<span class="text-slate-400 font-normal text-xs">（可选）</span>
					</label>
					<input
						bind:value={image}
						placeholder="https://..."
						class="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 transition-all"
					/>
					{#if image}
						<div class="mt-1.5 overflow-hidden rounded-xl bg-slate-100 h-28">
							<img
								src={image}
								alt="预览"
								class="w-full h-full object-cover"
							onerror={hideImageOnError}
							/>
						</div>
					{/if}
				</div>

				<!-- 错误提示 -->
				{#if formError}
					<div
						class="flex items-center gap-2 text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 text-sm"
					>
						<AlertTriangle size={13} />
						{formError}
					</div>
				{/if}
			</div>

			<!-- Footer -->
			<div
				class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3"
			>
				<button
					onclick={onclose}
					class="text-sm text-slate-500 hover:text-slate-800 px-4 py-2 rounded-xl hover:bg-slate-200 transition-all font-medium"
				>取消</button>
				<button
					onclick={submit}
					disabled={submitting}
					class="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm"
				>
					{#if submitting}
						<RefreshCw size={13} class="animate-spin" />
						处理中…
					{:else}
						<Save size={13} />
						{mode === 'add' ? '确认添加' : '保存更改'}
					{/if}
				</button>
			</div>
		</div>
	</div>
{/if}
