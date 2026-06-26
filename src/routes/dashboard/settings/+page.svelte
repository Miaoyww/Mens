<script lang="ts">
  import { Settings, Info, Monitor } from "@lucide/svelte";
  import { goto } from "$app/navigation";
  import { fly } from "svelte/transition";
  import * as Card from "$lib/components/ui/card/index.js";

  interface RouteCard {
    title: string;
    description: string;
    icon: typeof Settings;
    href: string;
  }

  const cards: RouteCard[] = [
    {
      title: "常规设置",
      description: "外观主题、WiFi 配置、界面行为与数据管理",
      icon: Settings,
      href: "/dashboard/settings/general",
    },
    {
      title: "显示设置",
      description: "管理菜单展示窗口的外观和行为",
      icon: Monitor,
      href: "/dashboard/settings/display",
    },
    {
      title: "关于",
      description: "版本信息、开源许可与更新检查",
      icon: Info,
      href: "/dashboard/settings/about",
    },
  ];
</script>

<div class="grid grid-cols-1 gap-4 sm:grid-cols-2" in:fly={{ y: 16, duration: 300, opacity: 0 }}>
  {#each cards as card}
    <Card.Root
      class="group cursor-pointer border-border/70 bg-background/80 shadow-sm transition-all hover:border-primary/40 hover:bg-muted/50 hover:shadow-md"
      role="button"
      tabindex={0}
      onclick={() => goto(card.href)}
      onkeydown={(e) => e.key === "Enter" && goto(card.href)}
    >
      <Card.Header>
        <div class="flex size-10 items-center justify-center rounded-lg bg-muted transition-colors group-hover:bg-primary/10">
          <card.icon size={20} class="text-muted-foreground transition-colors group-hover:text-primary" />
        </div>
      </Card.Header>
      <Card.Content>
        <Card.Title class="text-base">{card.title}</Card.Title>
        <Card.Description class="mt-1">{card.description}</Card.Description>
      </Card.Content>
    </Card.Root>
  {/each}
</div>
