<script lang="ts">
  import { globalSettings } from "$lib/stores/global-store";
  import { cn } from "$lib/utils.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Wifi } from "@lucide/svelte";

  let wifiName = $derived($globalSettings.wifi.name);
  let wifiPassword = $derived($globalSettings.wifi.password);
</script>

<Card.Root
  size="sm"
  class={cn(
    "fixed bottom-8 left-8 z-20",
    "bg-background/90 backdrop-blur",
    "shadow-2xl border-blue-50",
  )}
>
  <Card.Header>
    <Card.Title class="flex items-center gap-2 text-blue-400 uppercase tracking-widest text-sm">
      <Wifi size={16} />
      WiFi
    </Card.Title>
    <Card.Description class="sr-only">当前 WiFi 连接信息</Card.Description>
  </Card.Header>
  <Card.Content class="space-y-1.5">
    <p class="text-sm text-foreground">
      <span class="text-muted-foreground">名称：</span>{wifiName}
    </p>
    <p class="text-sm text-foreground">
      <span class="text-muted-foreground">密码：</span>{wifiPassword}
    </p>
  </Card.Content>
</Card.Root>