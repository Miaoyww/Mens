<script lang="ts">
  import NavMain from "./nav-main.svelte";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import type { ComponentProps } from "svelte";
  const version = __APP_VERSION__;

  // Icons
  import favicon from "$lib/assets/favicon.png";
  import {
    ChartLine,
    Gauge,
    ReceiptText,
    Settings2,
    UtensilsCrossed,
  } from "@lucide/svelte";

  // ─── Navigation data ──────────────────────────────────────────
  const navMain = [
    {
      title: "仪表盘",
      url: "/dashboard",
      icon: Gauge,
      isActive: true,
    },
    {
      title: "菜品管理",
      url: "/dashboard/dishes",
      icon: UtensilsCrossed,
      isActive: true,
    },
    {
      title: "订单",
      url: "/dashboard/orders",
      icon: ReceiptText,
      isActive: true,
    },
    {
      title: "统计",
      url: "/dashboard/stats",
      icon: ChartLine,
      isActive: true,
    },
  ];

  let {
    ref = $bindable(null),
    collapsible = "icon",
    ...restProps
  }: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root bind:ref {collapsible} {...restProps}>
  <Sidebar.Header>
    <div class="flex gap-2 px-2 py-1">
      <div class="flex aspect-square size-8 justify-center rounded-lg">
        <img src={favicon} alt="Logo" class="size-6" />
      </div>
      <div class="grid flex-1 text-start text-sm leading-tight">
        <span class="truncate font-semibold">Mens</span>
        <span class="truncate text-xs text-sidebar-foreground/60"
          >餐饮管理系统</span
        >
      </div>
    </div>
  </Sidebar.Header>
  <Sidebar.Content>
    <NavMain items={navMain} />
  </Sidebar.Content>
  <Sidebar.Footer>
    <Sidebar.Menu>
      <Sidebar.MenuItem>
        <Sidebar.MenuButton tooltipContent="系统设置">
          {#snippet child({ props })}
            <a href="/dashboard/settings" {...props}>
              <Settings2 />
              <span>设置</span>
            </a>
          {/snippet}
        </Sidebar.MenuButton>
      </Sidebar.MenuItem>
    </Sidebar.Menu>
    <Sidebar.Separator />
    <div class="flex flex-col gap-1 p-2">
      <div class="flex items-center gap-2">
        <span class="text-sm font-semibold">Mens</span>
      </div>
      <span class="text-xs text-muted-foreground">Version {version}</span>
    </div>
  </Sidebar.Footer>
  <Sidebar.Rail />
</Sidebar.Root>
