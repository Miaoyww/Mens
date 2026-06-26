<script lang="ts">
  import { onMount } from "svelte";
  import {
    dishes,
    fetchDishes,
    createDish,
    updateDish,
    deleteDish,
    type Dish,
    type DishCategory,
  } from "$lib/stores/dish-store";
  import { fly } from "svelte/transition";
  import {
    Plus,
    Search,
    ChevronLeft,
    RefreshCw,
    UtensilsCrossed,
    TriangleAlert,
    X,
    ChefHat,
  } from "@lucide/svelte";

  import AdminDishCard from "$lib/components/cards/admin-dish-card.svelte";
  import AdminStats from "$lib/components/cards/admin-stats.svelte";
  import AdminDishFormDialog from "$lib/components/dialog/admin-dish-form-dialog.svelte";
  import AdminDeleteDialog from "$lib/components/dialog/admin-delete-dialog.svelte";
  import AdminWifiSection from "$lib/components/settings/cards/admin-wifi-section.svelte";
  import { categoryOptions } from "$lib/stores/admin-store";
  import { openDisplayWindow } from "$lib/utils/display-window";
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Button from "$lib/components/ui/button/index.js";
  import * as Input from "$lib/components/ui/input/index.js";
  import * as Separator from "$lib/components/ui/separator/index.js";

  // ─── Filter / Search ──────────────────────────────────────
  let searchQuery = $state("");
  let filterCategory = $state<"all" | DishCategory>("all");

  let filteredDishes = $derived(
    $dishes.filter((d) => {
      const matchCat = filterCategory === "all" || d.category === filterCategory;
      const matchSearch =
        !searchQuery ||
        d.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    }),
  );

  // ─── Toast ────────────────────────────────────────────────
  let successMsg = $state("");
  let globalError = $state("");

  function showToast(msg: string) {
    successMsg = msg;
    setTimeout(() => (successMsg = ""), 3000);
  }

  // ─── Add / Edit dialog ────────────────────────────────────
  let showFormDialog = $state(false);
  let dialogMode = $state<"add" | "edit">("add");
  let editingDish = $state<Dish | null>(null);

  function openAdd() {
    editingDish = null;
    dialogMode = "add";
    showFormDialog = true;
  }

  function openEdit(dish: Dish) {
    editingDish = dish;
    dialogMode = "edit";
    showFormDialog = true;
  }

  async function handleFormSubmit(data: {
    id: string;
    name: string;
    price: string;
    image: string;
    discount: number;
    category: DishCategory;
  }) {
    if (dialogMode === "add") {
      await createDish({
        name: data.name,
        price: data.price,
        image: data.image,
        discount: data.discount,
        category: data.category,
      });
      showToast("菜品添加成功");
    } else {
      await updateDish(data.id, {
        name: data.name,
        price: data.price,
        image: data.image,
        discount: data.discount,
        category: data.category,
      });
      showToast("菜品更新成功");
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
      showToast("菜品已删除");
      showDeleteDialog = false;
      deletingDish = null;
    } catch (e) {
      globalError = e instanceof Error ? e.message : "删除失败";
    }
  }

  // ─── Lifecycle ────────────────────────────────────────────
  onMount(() => {
    fetchDishes();
  });
</script>

<!-- TOASTS -->
  {#if successMsg}
    <div
      transition:fly={{ y: -16, duration: 250 }}
      class="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium pointer-events-none"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20,6 9,17 4,12" /></svg>
      {successMsg}
    </div>
  {/if}
  {#if globalError}
    <div
      transition:fly={{ y: -16, duration: 250 }}
      class="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-destructive text-destructive-foreground px-4 py-2 rounded-lg shadow-lg text-sm font-medium"
    >
      <TriangleAlert size={14} />
      {globalError}
      <button onclick={() => (globalError = "")} class="ml-2 opacity-70 hover:opacity-100"><X size={13} /></button>
    </div>
  {/if}

  <!-- HEADER -->
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-3">
      <Button.Root variant="outline" size="sm" onclick={openDisplayWindow}>
        <ChevronLeft size={14} />返回展示
      </Button.Root>
      <Separator.Root orientation="vertical" class="h-5" />
      <div class="flex items-center gap-2">
        <ChefHat size={18} class="text-muted-foreground" />
        <div>
          <h1 class="text-base font-semibold leading-tight">菜单管理后台</h1>
          <p class="text-xs text-muted-foreground">Menu Administration</p>
        </div>
      </div>
    </div>
    <div class="flex items-center gap-2">
      <Button.Root variant="ghost" size="sm" onclick={() => fetchDishes()}>
        <RefreshCw size={13} />刷新数据
      </Button.Root>
      <span class="text-xs text-muted-foreground hidden sm:block">
        {new Date().toLocaleDateString("zh-CN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </span>
    </div>
  </div>

  <!-- 统计卡片 -->
  <AdminStats />

  <!-- 菜品管理 -->
  <Card.Root>
    <Card.Header class="pb-0">
      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div class="flex items-center gap-2 shrink-0">
          <UtensilsCrossed size={16} class="text-muted-foreground" />
          <Card.Title class="text-base">菜品管理</Card.Title>
          <span class="bg-muted text-muted-foreground text-xs font-medium px-2 py-0.5 rounded-md">
            {filteredDishes.length} 道
          </span>
        </div>
        <div class="flex flex-wrap items-center gap-2 sm:ml-auto w-full sm:w-auto">
          <!-- 搜索 -->
          <div class="relative w-full sm:w-52">
            <Search size={13} class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input.Root bind:value={searchQuery} placeholder="搜索菜品..." class="pl-8" />
          </div>
          <!-- 分类筛选 -->
          <div class="flex gap-1">
            <Button.Root
              variant={filterCategory === "all" ? "secondary" : "ghost"}
              size="xs"
              onclick={() => (filterCategory = "all")}
            >全部</Button.Root>
            {#each categoryOptions as opt}
              <Button.Root
                variant={filterCategory === opt.value ? "secondary" : "ghost"}
                size="xs"
                onclick={() => (filterCategory = opt.value)}
              >{opt.emoji} {opt.label}</Button.Root>
            {/each}
          </div>
          <Button.Root size="sm" onclick={openAdd}>
            <Plus size={14} />添加菜品
          </Button.Root>
        </div>
      </div>
    </Card.Header>
    <Card.Content class="pt-4">
      <!-- Table -->
      {#if filteredDishes.length === 0}
        <div class="py-24 text-center">
          <div class="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UtensilsCrossed size={28} class="text-muted-foreground/50" />
          </div>
          <p class="text-muted-foreground text-sm">暂无菜品数据</p>
          <Button.Root variant="link" size="sm" onclick={openAdd} class="mt-2">
            + 添加第一道菜
          </Button.Root>
        </div>
      {:else}
        <div class="overflow-x-auto -mx-6">
          <table class="w-full">
            <thead>
              <tr class="border-b">
                <th class="text-left text-xs font-medium text-muted-foreground px-4 py-2">菜品</th>
                <th class="text-left text-xs font-medium text-muted-foreground px-4 py-2">分类</th>
                <th class="text-left text-xs font-medium text-muted-foreground px-4 py-2">原价</th>
                <th class="text-left text-xs font-medium text-muted-foreground px-4 py-2">折扣</th>
                <th class="text-left text-xs font-medium text-muted-foreground px-4 py-2">实售价</th>
                <th class="text-right text-xs font-medium text-muted-foreground px-4 py-2">操作</th>
              </tr>
            </thead>
            <tbody>
              {#each filteredDishes as dish (dish.id)}
                <AdminDishCard {dish} onedit={openEdit} ondelete={openDelete} />
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </Card.Content>
  </Card.Root>

  <!-- WiFi 设置 -->
  <AdminWifiSection />

<!-- 添加/编辑弹窗 -->
<AdminDishFormDialog
  bind:open={showFormDialog}
  mode={dialogMode}
  dish={editingDish}
  onsubmit={handleFormSubmit}
  onclose={() => (showFormDialog = false)}
/>

<!-- 删除确认弹窗 -->
<AdminDeleteDialog
  bind:open={showDeleteDialog}
  dish={deletingDish}
  onconfirm={handleDelete}
  onclose={() => (showDeleteDialog = false)}
/>
