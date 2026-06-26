<script lang="ts">
	import { onMount } from 'svelte';
	import { dishes, fetchDishes, createDish, updateDish, deleteDish, type Dish, type DishCategory } from '$lib/stores/dish-store';
	import { auth, checkAuth, login, logout, setupAdmin } from '$lib/stores/auth-store';
	import { fly, fade } from 'svelte/transition';
	import { Plus, Search, ChevronLeft, RefreshCw, UtensilsCrossed, AlertTriangle, X, ChefHat, LogOut, Lock, KeyRound } from '@lucide/svelte';

	import AdminDishCard from '$lib/components/cards/admin-dish-card.svelte';
	import AdminStats from '$lib/components/cards/admin-stats.svelte';
	import AdminDishFormDialog from '$lib/components/dialog/admin-dish-form-dialog.svelte';
	import AdminDeleteDialog from '$lib/components/dialog/admin-delete-dialog.svelte';
	import AdminWifiSection from '$lib/components/settings/admin-wifi-section.svelte';
	import { categoryOptions } from '$lib/stores/admin-store';


	// ─── Auth ─────────────────────────────────────────────────
	let loginUsername = $state('');
	let loginPassword = $state('');
	let loginError = $state('');
	let loginLoading = $state(false);

	let setupUsername = $state('');
	let setupPassword = $state('');
	let setupError = $state('');
	let setupLoading = $state(false);
	// 是否显示 setup 表单（admin 不存在时后端会返回特定错误）
	let needsSetup = $state(false);

	async function handleLogin() {
		loginError = '';
		loginLoading = true;
		try {
			await login(loginUsername, loginPassword);
			await fetchDishes();
		} catch (e) {
			loginError = e instanceof Error ? e.message : '登录失败';
		} finally {
			loginLoading = false;
		}
	}

	async function handleSetup() {
		if (!setupUsername.trim() || !setupPassword.trim()) {
			setupError = '请填写用户名和密码';
			return;
		}
		setupLoading = true;
		setupError = '';
		try {
			await setupAdmin(setupUsername, setupPassword);
			await fetchDishes();
		} catch (e) {
			setupError = e instanceof Error ? e.message : '初始化失败';
		} finally {
			setupLoading = false;
		}
	}

	async function handleLogout() {
		await logout();
	}

	// ─── Filter / Search ──────────────────────────────────────
	let searchQuery = $state('');
	let filterCategory = $state<'all' | DishCategory>('all');

	let filteredDishes = $derived(
		$dishes.filter((d) => {
			const matchCat = filterCategory === 'all' || d.category === filterCategory;
			const matchSearch = !searchQuery || d.name.toLowerCase().includes(searchQuery.toLowerCase());
			return matchCat && matchSearch;
		})
	);

	// ─── Toast ────────────────────────────────────────────────
	let successMsg = $state('');
	let globalError = $state('');

	function showToast(msg: string) {
		successMsg = msg;
		setTimeout(() => (successMsg = ''), 3000);
	}

	// ─── Add / Edit dialog ────────────────────────────────────
	let showFormDialog = $state(false);
	let dialogMode = $state<'add' | 'edit'>('add');
	let editingDish = $state<Dish | null>(null);

	function openAdd() {
		editingDish = null;
		dialogMode = 'add';
		showFormDialog = true;
	}

	function openEdit(dish: Dish) {
		editingDish = dish;
		dialogMode = 'edit';
		showFormDialog = true;
	}

	async function handleFormSubmit(data: {
		id: string; name: string; price: string; image: string; discount: number; category: DishCategory;
	}) {
		if (dialogMode === 'add') {
			await createDish({ name: data.name, price: data.price, image: data.image, discount: data.discount, category: data.category });
			showToast('菜品添加成功');
		} else {
			await updateDish(data.id, { name: data.name, price: data.price, image: data.image, discount: data.discount, category: data.category });
			showToast('菜品更新成功');
		}
		showFormDialog = false;
	}

	// ─── Delete dialog ────────────────────────────────────────
	let showDeleteDialog = $state(false);
	let deletingDish = $state<Dish | null>(null);

	function openDelete(dish: Dish) {
		deletingDish = dish;
		showDeleteDialog = true;
	}

	async function handleDelete() {
		if (!deletingDish) return;
		try {
			await deleteDish(deletingDish.id);
			showToast('菜品已删除');
			showDeleteDialog = false;
			deletingDish = null;
		} catch (e) {
			globalError = e instanceof Error ? e.message : '删除失败';
		}
	}

	// ─── Lifecycle ────────────────────────────────────────────
	onMount(async () => {
		const user = await checkAuth();
		if (user?.role === 'admin') await fetchDishes();
	});
</script>

<!-- ===== AUTH GATE ===== -->
{#if $auth.status === 'loading'}
	<div class="fixed inset-0 z-[9999] bg-slate-50 flex items-center justify-center">
		<div class="text-center space-y-4">
			<div class="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
			<p class="text-slate-500 text-sm">正在验证身份…</p>
		</div>
	</div>

{:else if $auth.status === 'unauthenticated'}
	<!-- 登录 / 初始化界面 -->
	<div class="fixed inset-0 z-[9999] bg-linear-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
		<div class="w-full max-w-sm" transition:fade={{ duration: 200 }}>
			<!-- Logo -->
			<div class="text-center mb-8">
				<div class="w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
					<ChefHat size={32} class="text-white" />
				</div>
				<h1 class="text-2xl font-bold text-white tracking-wide">菜单管理后台</h1>
				<p class="text-blue-300 text-sm mt-1">Menu Administration</p>
			</div>

			{#if needsSetup}
				<!-- 初始化管理员表单 -->
				<div class="bg-white/10 backdrop-blur-xl rounded-2xl p-6 space-y-4 border border-white/20 shadow-2xl">
					<div class="flex items-center gap-2 mb-2">
						<KeyRound size={16} class="text-amber-300" />
						<p class="text-amber-200 text-sm font-medium">首次使用，请创建管理员账号</p>
					</div>
					{#if setupError}
						<p class="text-red-300 text-sm bg-red-500/20 rounded-lg px-3 py-2">{setupError}</p>
					{/if}
					<div class="space-y-3">
						<input
							bind:value={setupUsername}
							placeholder="管理员用户名"
							class="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400/60 text-sm"
						/>
						<input
							bind:value={setupPassword}
							type="password"
							placeholder="管理员密码"
							class="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400/60 text-sm"
						/>
					</div>
					<button
						onclick={handleSetup}
						disabled={setupLoading}
						class="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
					>
						{#if setupLoading}
							<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
						{/if}
						初始化管理员
					</button>
					<button
						onclick={() => (needsSetup = false)}
						class="w-full text-blue-300 hover:text-white text-sm py-1 transition-colors"
					>已有账号？去登录</button>
				</div>
			{:else}
				<!-- 登录表单 -->
				<div class="bg-white/10 backdrop-blur-xl rounded-2xl p-6 space-y-4 border border-white/20 shadow-2xl">
					<div class="flex items-center gap-2 mb-2">
						<Lock size={16} class="text-blue-300" />
						<p class="text-blue-200 text-sm font-medium">请使用管理员账号登录</p>
					</div>
					{#if loginError}
						<p class="text-red-300 text-sm bg-red-500/20 rounded-lg px-3 py-2">{loginError}</p>
					{/if}
					<div class="space-y-3">
						<input
							bind:value={loginUsername}
							placeholder="用户名"
							class="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400/60 text-sm"
						/>
						<input
							bind:value={loginPassword}
							type="password"
							placeholder="密码"
							onkeydown={(e) => e.key === 'Enter' && handleLogin()}
							class="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400/60 text-sm"
						/>
					</div>
					<button
						onclick={handleLogin}
						disabled={loginLoading}
						class="w-full bg-blue-500 hover:bg-blue-400 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
					>
						{#if loginLoading}
							<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
						{/if}
						登录
					</button>
					<button
						onclick={() => (needsSetup = true)}
						class="w-full text-blue-300 hover:text-white text-sm py-1 transition-colors"
					>首次使用？创建管理员账号</button>
				</div>
			{/if}
		</div>
	</div>

{:else if $auth.status === 'authenticated' && $auth.user.role !== 'admin'}
	<!-- 无权限 -->
	<div class="fixed inset-0 z-[9999] bg-slate-50 flex items-center justify-center p-4">
		<div class="text-center space-y-4">
			<div class="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto">
				<Lock size={28} class="text-red-400" />
			</div>
			<h2 class="text-xl font-bold text-slate-800">无访问权限</h2>
			<p class="text-slate-500 text-sm">当前账号 <strong>{$auth.user.username}</strong> 不具备管理员权限</p>
			<button onclick={handleLogout} class="text-sm text-blue-600 hover:text-blue-800 font-medium">
				退出登录
			</button>
		</div>
	</div>

{:else}
<!-- ===== FULL SCREEN ADMIN ===== -->
<div class="fixed inset-0 z-[9999] bg-slate-50 overflow-y-auto">

	<!-- HEADER -->
	<header class="sticky top-0 z-10 bg-linear-to-r from-blue-800 via-blue-700 to-indigo-700 shadow-xl">
		<div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
			<div class="flex items-center gap-4">
				<a
					href="/"
					class="flex items-center gap-1.5 text-blue-200 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-lg transition-all text-sm font-medium"
				>
					<ChevronLeft size={15} />返回展示
				</a>
				<div class="w-px h-5 bg-blue-500 opacity-60"></div>
				<div class="flex items-center gap-2.5">
					<div class="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center">
						<ChefHat size={16} class="text-white" />
					</div>
					<div>
						<h1 class="text-white font-bold text-base leading-tight tracking-wide">菜单管理后台</h1>
						<p class="text-blue-300 text-[11px] leading-tight">Menu Administration</p>
					</div>
				</div>
			</div>
			<div class="flex items-center gap-3">
				<button
					onclick={() => fetchDishes()}
					class="flex items-center gap-1.5 text-sm text-blue-200 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all"
				>
					<RefreshCw size={13} />刷新数据
				</button>
				<span class="text-blue-300 text-sm hidden sm:block">
					{new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
				</span>
				<button
					onclick={handleLogout}
					class="flex items-center gap-1.5 text-sm text-blue-200 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all"
				>
					<LogOut size={13} />退出
				</button>
			</div>
		</div>
	</header>

	<!-- TOASTS -->
	{#if successMsg}
		<div
			transition:fly={{ y: -16, duration: 250 }}
			class="fixed top-20 left-1/2 -translate-x-1/2 z-10000 flex items-center gap-2 bg-emerald-500 text-white px-5 py-2.5 rounded-xl shadow-2xl text-sm font-medium pointer-events-none"
		>
			<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20,6 9,17 4,12"/></svg>
			{successMsg}
		</div>
	{/if}
	{#if globalError}
		<div
			transition:fly={{ y: -16, duration: 250 }}
			class="fixed top-20 left-1/2 -translate-x-1/2 z-10000 flex items-center gap-2 bg-red-500 text-white px-5 py-2.5 rounded-xl shadow-2xl text-sm font-medium"
		>
			<AlertTriangle size={14} />
			{globalError}
			<button onclick={() => (globalError = '')} class="ml-2 opacity-70 hover:opacity-100"><X size={13} /></button>
		</div>
	{/if}

	<!-- MAIN -->
	<main class="max-w-7xl mx-auto px-6 py-8 space-y-7 pb-16">

		<!-- 统计卡片 -->
		<AdminStats />

		<!-- 菜品管理表格 -->
		<section class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
			<!-- Toolbar -->
			<div class="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center gap-3">
				<div class="flex items-center gap-2 shrink-0">
					<UtensilsCrossed size={17} class="text-blue-600" />
					<h2 class="text-base font-bold text-slate-800">菜品管理</h2>
					<span class="ml-0.5 bg-slate-100 text-slate-500 text-[11px] font-semibold px-2 py-0.5 rounded-full">
						{filteredDishes.length} 道
					</span>
				</div>
				<div class="flex flex-wrap items-center gap-2 sm:ml-auto w-full sm:w-auto">
					<!-- 搜索菜品 -->
					<div class="relative w-full sm:w-52">
						<Search size={13} class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
						<input
							bind:value={searchQuery}
							placeholder="搜索菜品..."
							class="w-full pl-8 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 transition-all"
						/>
					</div>
					<!-- 分类筛选 -->
					<div class="flex bg-slate-100 rounded-xl p-0.5 text-[12px] shrink-0">
						<button
							onclick={() => (filterCategory = 'all')}
							class="{filterCategory === 'all' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'} px-3 py-1.5 rounded-[10px] transition-all font-medium"
						>全部</button>
						{#each categoryOptions as opt}
							<button
								onclick={() => (filterCategory = opt.value)}
								class="{filterCategory === opt.value ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'} px-3 py-1.5 rounded-[10px] transition-all font-medium"
							>{opt.emoji} {opt.label}</button>
						{/each}
					</div>
					<!-- 添加按钮 -->
					<button
						onclick={openAdd}
						class="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-sm hover:shadow-md"
					>
						<Plus size={14} />添加菜品
					</button>
				</div>
			</div>

			<!-- Table / Empty state -->
			{#if filteredDishes.length === 0}
				<div class="py-24 text-center">
					<div class="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
						<UtensilsCrossed size={28} class="text-slate-300" />
					</div>
					<p class="text-slate-400 text-sm">暂无菜品数据</p>
					<button onclick={openAdd} class="mt-4 text-sm text-blue-500 hover:text-blue-700 font-medium">
						+ 添加第一道菜?
					</button>
				</div>
			{:else}
				<div class="overflow-x-auto">
					<table class="w-full">
						<thead>
							<tr class="bg-slate-50/70 border-b border-slate-100">
								{#each ['菜品', '分类', '原价', '折扣', '实售价'] as col}
									<th class="text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider px-{col === '菜品' ? '6' : '4'} py-3">{col}</th>
								{/each}
								<th class="text-right text-[11px] font-bold text-slate-400 uppercase tracking-wider px-6 py-3">操作</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-slate-50">
							{#each filteredDishes as dish (dish.id)}
								<AdminDishCard {dish} onedit={openEdit} ondelete={openDelete} />
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</section>

		<!-- WiFi 设置 -->
		<AdminWifiSection />

	</main>
</div>
{/if}

<!-- 添加/编辑弹窗 -->
<AdminDishFormDialog
	open={showFormDialog}
	mode={dialogMode}
	dish={editingDish}
	onsubmit={handleFormSubmit}
	onclose={() => (showFormDialog = false)}
/>

<!-- 删除确认弹窗 -->
<AdminDeleteDialog
	open={showDeleteDialog}
	dish={deletingDish}
	onconfirm={handleDelete}
	onclose={() => (showDeleteDialog = false)}
/>

