<script lang="ts">
  import { QrCode, ShoppingCart } from "@lucide/svelte";
  import { globalSettings } from "$lib/stores/global-store";
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Switch from "$lib/components/ui/switch/index.js";
  import * as Separator from "$lib/components/ui/separator/index.js";

  function toggleQrCode(v: boolean) {
    globalSettings.patch({ qrCodeEnabled: v });
  }

  function toggleOrder(v: boolean) {
    globalSettings.patch({ orderEnabled: v });
  }
</script>

<Card.Root>
  <Card.Header>
    <Card.Title class="flex items-center gap-2 text-base">
      <ShoppingCart size={16} class="text-muted-foreground" />
      点餐系统
    </Card.Title>
    <Card.Description>控制展示页面的功能开关</Card.Description>
  </Card.Header>
  <Separator.Root />
  <Card.Content class="pt-6">
    <div class="space-y-5">
      <!-- 二维码展示开关 -->
      <div class="flex items-center justify-between gap-4">
        <div class="space-y-0.5">
          <div class="flex items-center gap-2">
            <QrCode size={14} class="text-muted-foreground" />
            <span class="text-sm font-medium">二维码展示</span>
          </div>
          <p class="text-xs text-muted-foreground">
            在展示页面中显示点餐二维码
          </p>
        </div>
        <Switch.Root
          disabled
          checked={$globalSettings.qrCodeEnabled}
          onCheckedChange={toggleQrCode}
        />
      </div>

      <!-- 订单系统开关 -->
      <div class="flex items-center justify-between gap-4">
        <div class="space-y-0.5">
          <div class="flex items-center gap-2">
            <ShoppingCart size={14} class="text-muted-foreground" />
            <span class="text-sm font-medium">订单系统</span>
          </div>
          <p class="text-xs text-muted-foreground">
            启用在展示页面中的在线点餐功能
          </p>
        </div>
        <Switch.Root
          disabled
          checked={$globalSettings.orderEnabled}
          onCheckedChange={toggleOrder}
        />
      </div>
    </div>
  </Card.Content>
</Card.Root>
