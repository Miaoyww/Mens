  <script lang="ts">
  import StatsCard from "$lib/components/dashboard/stats-card.svelte";
  import OrderCard from "$lib/components/dashboard/order-card.svelte";
  import WindowCard from "$lib/components/dashboard/window-card.svelte";
  import SystemToggleCard from "$lib/components/dashboard/system-toggle-card.svelte";
  import WifiSection from "$lib/components/dashboard/wifi-card.svelte";
  import { fly } from "svelte/transition";
</script>

<main in:fly={{ y: 12, duration: 220, opacity: 0 }} class="flex flex-col gap-6">
  <!-- PAGE HEADER -->
  <div class="flex items-start justify-between gap-4">
    <div class="space-y-1">
      <h1 class="text-xl font-semibold tracking-tight">仪表盘</h1>
      <p class="text-sm text-muted-foreground">在这里纵观全局.</p>
    </div>
  </div>

  <!-- 窗口管理 -->
  <WindowCard />

  <!-- 订单卡片 -->
  <OrderCard />

  <!-- 统计卡片 -->
  <StatsCard />

  <!-- 点餐开关 + WiFi -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <WifiSection />
    <SystemToggleCard />
  </div>
</main>
