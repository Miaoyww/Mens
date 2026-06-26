<script lang="ts">
  import { goto } from "$app/navigation";
  import { Minus, X, Settings, Square, SquaresUnite, PanelLeft, Expand, Shrink } from "@lucide/svelte";
  import { MENS_NAME } from "$lib/const";
  import { Button } from "$lib/components/ui/button";
  import { isTauri } from "@tauri-apps/api/core";
  import { sidebarOpen } from "$lib/stores/global-ui-store";
  import favicon from "$lib/assets/favicon.png";
  import { onMount } from "svelte";
  import { page } from "$app/state";
  import NavigationButton from "./buttons/navigation-button.svelte";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let appWindow = $state<any>(null);
  let isMaximized = $state(false);
  let isFullscreen = $state(false);
  let titlebarVisible = $state(true);
  let windowLabel = $state<string | null>(null);

  let isDashboardRoute = $derived(page.url.pathname.startsWith("/dashboard"));
  let isDisplayWindow = $derived(windowLabel === "display");
  let hideTitlebar = $derived(isDisplayWindow && (isMaximized || isFullscreen));

  function toggleSidebar() {
    sidebarOpen.update((v) => !v);
  }

  $effect(() => {
    if (!isTauri()) return;
    import("@tauri-apps/api/window").then(({ getCurrentWindow }) => {
      const win = getCurrentWindow();
      appWindow = win;
      windowLabel = win.label;
      win.isMaximized().then((v: boolean) => (isMaximized = v));
      win.isFullscreen().then((v: boolean) => (isFullscreen = v));
      win.onResized(async () => {
        isMaximized = await win.isMaximized();
        isFullscreen = await win.isFullscreen();
      });
    });
  });

  function onDragMouseDown(e: MouseEvent) {
    if (e.target !== e.currentTarget) return;
    if (e.buttons === 1 && appWindow) {
      appWindow.startDragging();
    }
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key !== "Escape" || !isDisplayWindow || !appWindow) return;
    if (isFullscreen) {
      appWindow.setFullscreen(false);
    } else if (isMaximized) {
      appWindow.unmaximize();
    } else {
      appWindow.minimize();
    }
  }
</script>

<svelte:window onkeydown={onKeyDown} />

{#if !hideTitlebar}
  <div
    class="fixed top-0 right-0 flex h-10 items-stretch border-b border-border/30 bg-background select-none transition-[left] duration-200 ease-linear"
    style="left: {isDashboardRoute ? ($sidebarOpen ? '16rem' : '3rem') : '0'}"
  >
  {#if isDashboardRoute}
    <Button
      class="flex items-center justify-center px-3 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      variant="ghost"
      onclick={toggleSidebar}
      title="切换侧边栏"
    >
      <PanelLeft size={14} />
    </Button>
  {/if}

  <!-- 拖拽区域：占据所有剩余空间 -->
  <div class="flex-1" onmousedown={onDragMouseDown} role="none"></div>

  <!-- 功能区 -->
  <div class="flex shrink-0 items-stretch">
    {#if titlebarVisible}
      <Button
        class="flex items-center justify-center px-3 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        variant="ghost"
        onclick={() => goto("/dashboard/settings")}
        title="设置"
      >
        <Settings size={14} />
      </Button>

      <div class="mx-0.5 my-2 w-px bg-border/40"></div>
    {/if}
    <Button
      class="flex w-11 items-center justify-center text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      onclick={() => appWindow?.minimize()}
      variant="ghost"
      title="最小化"
    >
      <Minus size={14} />
    </Button>

    {#if isDisplayWindow}
      <!-- Display window: fullscreen (covers taskbar) -->
      <Button
        class="flex w-11 items-center justify-center text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        onclick={() => appWindow?.setFullscreen(!isFullscreen)}
        variant="ghost"
        title={isFullscreen ? "退出全屏" : "全屏"}
      >
        {#if isFullscreen}
          <Shrink size={13} />
        {:else}
          <Expand size={13} />
        {/if}
      </Button>
    {:else}
      <!-- Main window: normal maximize -->
      <Button
        class="flex w-11 items-center justify-center text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        onclick={() => appWindow?.toggleMaximize()}
        variant="ghost"
        title={isMaximized ? "向下还原" : "最大化"}
      >
        {#if isMaximized}
          <SquaresUnite size={11} />
        {:else}
          <Square size={11} />
        {/if}
      </Button>
    {/if}

    <Button
      class="close-btn flex w-11 items-center justify-center text-muted-foreground transition-colors"
      onclick={() => appWindow?.close()}
      variant="ghost"
      title="关闭"
    >
      <X size={14} />
    </Button>
  </div>
</div>
{/if}
