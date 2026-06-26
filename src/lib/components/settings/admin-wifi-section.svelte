<script lang="ts">
	import { Wifi, Save } from '@lucide/svelte';
	import { wifi } from '$lib/stores/store';

	let wifiName = $state($wifi.name);
	let wifiPassword = $state($wifi.password);

	let saved = $state(false);

	function save() {
		wifi.set({ name: wifiName.trim(), password: wifiPassword.trim() });
		saved = true;
		setTimeout(() => (saved = false), 2500);
	}
</script>

<section class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
	<!-- Section Header -->
	<div class="px-6 py-4 border-b border-slate-100 flex items-center gap-2.5">
		<div class="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
			<Wifi size={15} class="text-blue-600" />
		</div>
		<div>
			<h2 class="text-base font-bold text-slate-800 leading-tight">WiFi 设置</h2>
			<p class="text-[11px] text-slate-400">修改展示页面底部显示的 WiFi 信息</p>
		</div>
	</div>

	<div class="px-6 py-6">
		<div class="max-w-sm space-y-4">
			<!-- 网络名称 -->
			<div class="space-y-1.5">
				<label for="wifi-name" class="text-sm font-semibold text-slate-700">
					网络名称 <span class="text-slate-400 font-normal">(SSID)</span>
				</label>
				<input
					id="wifi-name"
					bind:value={wifiName}
					placeholder="例：Restaurant_Guest"
					class="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 transition-all"
				/>
			</div>

			<!-- 密码 -->
			<div class="space-y-1.5">
				<label for="wifi-password" class="text-sm font-semibold text-slate-700">密码</label>
				<input
					id="wifi-password"
					bind:value={wifiPassword}
					placeholder="输入 WiFi 密码"
					class="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 transition-all"
				/>
			</div>

			<!-- 预览 -->
			<div class="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm">
				<span class="text-[11px] font-bold uppercase tracking-widest text-slate-400">预览</span>
				<p class="mt-1 font-medium text-slate-700">📶 {wifiName || '—'}</p>
				<p class="text-slate-500">密码：{wifiPassword || '—'}</p>
			</div>

			<!-- 保存按钮 -->
			<button
				onclick={save}
				class="flex items-center gap-2 {saved
					? 'bg-emerald-500 hover:bg-emerald-600'
					: 'bg-blue-600 hover:bg-blue-700'} active:scale-95 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md"
			>
				{#if saved}
					<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20,6 9,17 4,12"/></svg>
					已保存
				{:else}
					<Save size={14} />
					保存 WiFi 设置
				{/if}
			</button>
		</div>
	</div>
</section>
