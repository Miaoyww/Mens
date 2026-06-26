<script lang="ts">
  import { Monitor, ExternalLink, Settings } from "@lucide/svelte";
  import { goto } from "$app/navigation";
  import { openDisplayWindow } from "$lib/utils/display-window";
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Button from "$lib/components/ui/button/index.js";
</script>

<Card.Root>
  <Card.Header>
    <div class="flex items-start justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Monitor size={20} class="text-muted-foreground" />
        </div>
        <div class="space-y-1">
          <Card.Title class="text-base">菜单展示窗口</Card.Title>
          <Card.Description>管理独立的菜单展示窗口，用于投屏或外接显示器</Card.Description>
        </div>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <Button.Root variant="outline" size="sm" onclick={() => goto("/dashboard/settings")}>
          <Settings size={14} />
          显示设置
        </Button.Root>
        <Button.Root size="sm" onclick={openDisplayWindow}>
          <ExternalLink size={14} />
          打开展示窗口
        </Button.Root>
      </div>
    </div>
  </Card.Header>
</Card.Root>
