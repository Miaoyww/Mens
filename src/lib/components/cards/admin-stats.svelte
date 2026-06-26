<script lang="ts">
	import { dishes } from '$lib/stores/dish-store';

	let stats = $derived({
		total: $dishes.length,
		hot: $dishes.filter((d) => d.category === 'hot').length,
		cold: $dishes.filter((d) => d.category === 'cold').length,
		soup: $dishes.filter((d) => d.category === 'soup').length,
		discounted: $dishes.filter((d) => d.discount < 1).length
	});
</script>

<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
	<div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
		<p class="text-[11px] text-slate-400 uppercase font-bold tracking-widest mb-2">全部</p>
		<p class="text-4xl font-black text-slate-800">{stats.total}</p>
		<p class="text-xs text-slate-400 mt-1">道菜品</p>
	</div>
	<div class="bg-white rounded-2xl p-5 shadow-sm border border-orange-100/60">
		<p class="text-[11px] text-orange-400 uppercase font-bold tracking-widest mb-2">热菜</p>
		<p class="text-4xl font-black text-orange-500">{stats.hot}</p>
		<p class="text-xs text-orange-300 mt-1">道</p>
	</div>
	<div class="bg-white rounded-2xl p-5 shadow-sm border border-sky-100/60">
		<p class="text-[11px] text-sky-400 uppercase font-bold tracking-widest mb-2">冷菜</p>
		<p class="text-4xl font-black text-sky-500">{stats.cold}</p>
		<p class="text-xs text-sky-300 mt-1">道</p>
	</div>
	<div class="bg-white rounded-2xl p-5 shadow-sm border border-amber-100/60">
		<p class="text-[11px] text-amber-400 uppercase font-bold tracking-widest mb-2">汤</p>
		<p class="text-4xl font-black text-amber-500">{stats.soup}</p>
		<p class="text-xs text-amber-300 mt-1">道</p>
	</div>
	<div class="bg-white rounded-2xl p-5 shadow-sm border border-red-100/60 col-span-2 sm:col-span-1">
		<p class="text-[11px] text-red-400 uppercase font-bold tracking-widest mb-2">折扣中</p>
		<p class="text-4xl font-black text-red-500">{stats.discounted}</p>
		<p class="text-xs text-red-300 mt-1">道</p>
	</div>
</div>
