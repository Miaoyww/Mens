<script lang="ts">
  import { ChevronLeft } from "@lucide/svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { fly } from "svelte/transition";
  import { Button } from "$lib/components/ui/button";

  let { children } = $props();

  interface RouteMeta {
    back: string;
    title: string;
    subtitle: string;
  }

  const routeMap: Record<string, RouteMeta> = {
    "/dashboard/settings": {
      back: "/dashboard",
      title: "设置",
      subtitle: "个性化与全局设置",
    },
    "/dashboard/settings/general": {
      back: "/dashboard/settings",
      title: "常规设置",
      subtitle: "外观主题、WiFi 配置、界面行为与数据管理",
    },
    "/dashboard/settings/display": {
      back: "/dashboard/settings",
      title: "显示设置",
      subtitle: "界面布局、字体大小与视觉效果",
    },
    "/dashboard/settings/about": {
      back: "/dashboard/settings",
      title: "关于",
      subtitle: "版本信息、开源许可与更新检查",
    },
  };

  const current = $derived(
    routeMap[page.url.pathname] ?? {
      back: "/dashboard",
      title: "设置",
      subtitle: "",
    }
  );
</script>

<main class="flex flex-col gap-6" in:fly={{ y: 12, duration: 220, opacity: 0 }}>
  <!-- PAGE HEADER -->
  <div class="flex items-center gap-3">
    <Button
      variant="ghost"
      size="icon-xs"
      onclick={() => goto(current.back)}
    >
      <ChevronLeft size={16} />
    </Button>
    <div class="space-y-0.5">
      <h1 class="text-xl font-semibold tracking-tight">{current.title}</h1>
      <p class="text-sm text-muted-foreground">{current.subtitle}</p>
    </div>
  </div>

  {@render children?.()}
</main>
