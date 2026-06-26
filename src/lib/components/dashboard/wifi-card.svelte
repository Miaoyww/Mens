<script lang="ts">
  import { Wifi, Save, Check } from "@lucide/svelte";
  import { globalSettings } from "$lib/stores/global-store";
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Input from "$lib/components/ui/input/index.js";
  import * as Label from "$lib/components/ui/label/index.js";
  import * as Button from "$lib/components/ui/button/index.js";
  import * as Separator from "$lib/components/ui/separator/index.js";

  let wifiName = $state($globalSettings.wifi.name);
  let wifiPassword = $state($globalSettings.wifi.password);
  let saved = $state(false);

  function save() {
    globalSettings.patch({ wifi: { name: wifiName.trim(), password: wifiPassword.trim() } });
    saved = true;
    setTimeout(() => (saved = false), 2500);
  }
</script>

<Card.Root>
  <Card.Header>
    <Card.Title class="flex items-center gap-2 text-base">
      <Wifi size={16} class="text-muted-foreground" />
      WiFi 设置
    </Card.Title>
    <Card.Description>修改展示页面底部显示的 WiFi 信息</Card.Description>
  </Card.Header>
  <Separator.Root />
  <Card.Content class="pt-6">
    <div class="max-w-sm space-y-4">
      <!-- 网络名称 -->
      <div class="space-y-2">
        <Label.Root for="wifi-name">网络名称 <span class="text-muted-foreground font-normal">(SSID)</span></Label.Root>
        <Input.Root id="wifi-name" bind:value={wifiName} placeholder="例：Restaurant_Guest" />
      </div>

      <!-- 密码 -->
      <div class="space-y-2">
        <Label.Root for="wifi-password">密码</Label.Root>
        <Input.Root id="wifi-password" bind:value={wifiPassword} placeholder="输入 WiFi 密码" />
      </div>

      <!-- 保存按钮 -->
      <Button.Root onclick={save} variant={saved ? "secondary" : "default"} size="sm">
        {#if saved}
          <Check size={14} />已保存
        {:else}
          <Save size={14} />保存 WiFi 设置
        {/if}
      </Button.Root>
    </div>
  </Card.Content>
</Card.Root>
