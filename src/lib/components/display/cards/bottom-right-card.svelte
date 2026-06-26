<script lang="ts">
  import { globalSettings } from "$lib/stores/global-store";
  import { QrCode } from "@lucide/svelte";
  import { cn } from "$lib/utils.js";
  import * as Card from "$lib/components/ui/card/index.js";
</script>

{#if $globalSettings.qrCodeEnabled}
  <Card.Root
    size="sm"
    class={cn(
      "fixed bottom-8 right-8 z-20",
      "bg-background/90 backdrop-blur",
      "shadow-2xl text-center",
    )}
  >
    <Card.Header>
      <Card.Title class="flex items-center justify-center gap-2 text-sm uppercase tracking-widest">
        <QrCode size={16} />
        扫码点餐
      </Card.Title>
    </Card.Header>
    <Card.Content>
      <img
        src={$globalSettings.qrCodeUrl}
        alt="QR Code"
        class="w-28 h-28 rounded-lg mx-auto"
      />
    </Card.Content>
  </Card.Root>
{/if}
