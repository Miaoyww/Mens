<script lang="ts">
  import { onMount } from "svelte";
  import { dishes, fetchDishes, type DishCategory } from "$lib/stores/dish-store";
  import { categoryStyle } from "$lib/stores/dish-store";
  import { globalSettings } from "$lib/stores/global-store";
  import { Wifi, QrCode } from "@lucide/svelte";
  import DishCard from "$lib/components/display/cards/dish-card.svelte";
  import * as Separator from "$lib/components/ui/separator/index.js";

  // ── Categorize dishes ──────────────────────────────────────
  const categoryOrder: DishCategory[] = ["hot", "cold", "soup"];
  const categoryLabel: Record<DishCategory, string> = {
    hot: "热菜",
    cold: "冷菜",
    soup: "汤",
  };

  const grouped = $derived(
    categoryOrder
      .map((cat) => ({
        key: cat,
        label: categoryLabel[cat],
        style: categoryStyle[cat],
        items: $dishes.filter((d) => d.category === cat),
      }))
      .filter((g) => g.items.length > 0),
  );

  // ── Auto-scroll ───────────────────────────────────────────
  let scrollContainer = $state<HTMLDivElement>();
  let animationId: number;

  function startScroll() {
    if (!scrollContainer) return;
    let lastTime = 0;
    let accumulated = 0;
    const speed = 20;

    function step(timestamp: number) {
      if (lastTime && scrollContainer) {
        const delta = (timestamp - lastTime) / 1000;
        accumulated += speed * delta;
        if (accumulated >= 1) {
          const px = Math.floor(accumulated);
          accumulated -= px;
          scrollContainer.scrollTop += px;
          if (
            scrollContainer.scrollTop + scrollContainer.clientHeight >=
            scrollContainer.scrollHeight - 4
          ) {
            scrollContainer.scrollTop = 0;
          }
        }
      }
      lastTime = timestamp;
      animationId = requestAnimationFrame(step);
    }
    animationId = requestAnimationFrame(step);
  }

  onMount(() => {
    fetchDishes().then(() => startScroll());
    return () => cancelAnimationFrame(animationId);
  });

  // ── Bottom bar data ───────────────────────────────────────
  const wifiName = $derived($globalSettings.wifi.name);
  const wifiPassword = $derived($globalSettings.wifi.password);
  const qrCodeUrl = $derived($globalSettings.qrCodeUrl);
  const qrCodeEnabled = $derived($globalSettings.qrCodeEnabled);
  const showBottomBar = $derived(
    (wifiName || wifiPassword) || (qrCodeEnabled && qrCodeUrl),
  );
</script>

<div class="flex h-full flex-col bg-gradient-to-b from-background via-background to-muted/20">
  <!-- ── Header ──────────────────────────────────────────── -->
  <header class="shrink-0 border-b border-border/40 bg-background/75 backdrop-blur-xl">
    <div class="flex items-center justify-between px-8 py-4">
      <div class="flex items-center gap-3">
        <div>
          <h1 class="text-lg font-bold tracking-tight">今日菜单</h1>
          <p class="text-xs text-muted-foreground">欢迎点餐</p>
        </div>
      </div>
    </div>
  </header>

  <!-- ── Scroll area ────────────────────────────────────── -->
  <div
    bind:this={scrollContainer}
    class="flex-1 overflow-y-auto"
    style="scrollbar-width:none;-ms-overflow-style:none;"
  >
    <div class="px-6 py-8">
      {#each grouped as group}
        <section class="mb-12">
          <div class="mb-6 flex items-center gap-4">
            <Separator.Root class="flex-1" />
            <span class="rounded-full px-4 py-1 text-xs font-semibold shadow-sm {group.style.classes}">
              {group.label}
            </span>
            <Separator.Root class="flex-1" />
          </div>

          <div class="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {#each group.items as dish (dish.id)}
              <DishCard {dish} />
            {/each}
          </div>
        </section>
      {/each}

      {#if grouped.length === 0}
        <div class="flex flex-col items-center justify-center py-32 text-muted-foreground">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" class="mb-4 opacity-40">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <p class="text-lg font-medium">暂无菜品</p>
          <p class="text-sm opacity-60">请在管理后台添加菜品</p>
        </div>
      {/if}
    </div>
  </div>

  <!-- ── Bottom bar ──────────────────────────────────────── -->
  {#if showBottomBar}
    <footer class="shrink-0 border-t border-border/40 bg-background/75 backdrop-blur-xl">
      <div class="flex items-center justify-between px-8 py-3">
        <div class="flex items-center gap-3">
          {#if wifiName || wifiPassword}
            <div class="flex items-center gap-2 text-sm">
              <Wifi size={14} class="text-blue-500" />
              {#if wifiName}
                <span class="font-medium text-foreground">{wifiName}</span>
              {/if}
              {#if wifiPassword}
                <span class="text-muted-foreground">·</span>
                <span class="text-muted-foreground">{wifiPassword}</span>
              {/if}
            </div>
          {/if}
        </div>
        
        <div class="flex items-center gap-3">
          {#if qrCodeEnabled && qrCodeUrl}
            <div class="flex items-center gap-2">
              <div class="flex flex-col items-end">
                <span class="text-xs font-medium text-foreground">扫码点餐</span>
              </div>
              <img src={qrCodeUrl} alt="QR" class="h-10 w-10 rounded-lg border border-border/50 bg-white p-0.5" />
              <QrCode size={14} class="text-muted-foreground" />
            </div>
          {/if}
        </div>
      </div>
    </footer>
  {/if}
</div>

<style>
  div[style*="scrollbar-width:none"]::-webkit-scrollbar {
    display: none;
  }
</style>
