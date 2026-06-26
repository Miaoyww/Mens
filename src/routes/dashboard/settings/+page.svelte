<script lang="ts">
  import { Monitor, ChevronLeft } from "@lucide/svelte";
  import { goto } from "$app/navigation";
  import { fly } from "svelte/transition";
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Button from "$lib/components/ui/button/index.js";
</script>

<main in:fly={{ y: 12, duration: 220, opacity: 0 }} class="flex flex-col gap-6">
  <!-- PAGE HEADER -->
  <div class="flex items-start justify-between gap-4">
    <div class="space-y-1">
      <div class="flex items-center gap-2">
        <Button.Root variant="ghost" size="icon-xs" onclick={() => goto("/dashboard")}>
          <ChevronLeft size={16} />
        </Button.Root>
        <h1 class="text-xl font-semibold tracking-tight">显示设置</h1>
      </div>
      <p class="text-sm text-muted-foreground">管理菜单展示窗口的外观和行为</p>
    </div>
  </div>

  <Card.Root>
    <Card.Header>
      <div class="flex items-center gap-3">
        <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Monitor size={20} class="text-muted-foreground" />
        </div>
        <div>
          <Card.Title class="text-base">展示窗口</Card.Title>
          <Card.Description>配置独立菜单展示窗口的样式与内容</Card.Description>
        </div>
      </div>
    </Card.Header>
  </Card.Root>
</main>
