<script lang="ts">
  import SettingCard from "$lib/components/settings/cards/settings-card.svelte";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Switch } from "$lib/components/ui/switch";
  import { globalSettings } from "$lib/stores/global-store";
  import { fly } from "svelte/transition";

  let themeColor = $state($globalSettings.themeColor ?? "#2563EB");
  let backgroundUrl = $state($globalSettings.backgroundImage ?? "");
  let wifiName = $state($globalSettings.wifi.name);
  let wifiPassword = $state($globalSettings.wifi.password);
  let qrCodeUrl = $state($globalSettings.qrCodeUrl);
  let enableAnimation = $state(true);
  let compactMode = $state(false);
  let autoSave = $state(true);

  function applyThemeColor() {
    globalSettings.patch({ themeColor });
  }

  function applyBackground() {
    globalSettings.patch({ backgroundImage: backgroundUrl });
  }

  function saveWifi() {
    globalSettings.patch({
      wifi: { name: wifiName.trim(), password: wifiPassword.trim() },
    });
  }

  function saveQrCode() {
    globalSettings.patch({ qrCodeUrl });
  }

  function resetAll() {
    globalSettings.reset();
    themeColor = $globalSettings.themeColor;
    backgroundUrl = $globalSettings.backgroundImage;
    wifiName = $globalSettings.wifi.name;
    wifiPassword = $globalSettings.wifi.password;
    qrCodeUrl = $globalSettings.qrCodeUrl;
    enableAnimation = true;
    compactMode = false;
    autoSave = true;
  }
</script>

<div class="space-y-8" in:fly={{ y: 16, duration: 300, opacity: 0 }}>
  <!-- 外观 -->
  <div>
    <div class="mb-1 text-xl font-bold text-stone-800 dark:text-stone-100">
      外观
    </div>
    <div class="space-y-3">
      <SettingCard
        title="主题颜色"
        description="用于高亮按钮、链接等交互元素的主色调。"
      >
        <div class="flex items-center gap-2">
          <input
            type="color"
            bind:value={themeColor}
            class="h-9 w-9 cursor-pointer rounded-md border border-border bg-transparent p-0.5"
          />
          <Input
            class="w-28 font-mono uppercase"
            bind:value={themeColor}
            maxlength={7}
            placeholder="#2563EB"
          />
          <Button variant="outline" class="w-16" onclick={applyThemeColor}
            >应用</Button
          >
        </div>
      </SettingCard>

      <SettingCard
        title="背景图片"
        description="输入图片 URL 作为主界面背景，留空则使用纯色背景。"
      >
          <div class="flex items-center gap-2">
            <Input
              class="w-56"
              bind:value={backgroundUrl}
              placeholder="https://example.com/bg.jpg"
            />
            <Button variant="outline" class="w-16" onclick={applyBackground}
              >应用</Button
            >
          </div>
      </SettingCard>
    </div>
  </div>

  <!-- 数据 -->
  <div>
    <div class="mb-1 text-xl font-bold text-stone-800 dark:text-stone-100">
      数据
    </div>
    <div class="space-y-3">
      <SettingCard
        title="自动保存"
        description="每次修改后自动将数据持久化至本地存储。"
      >
        <Switch bind:checked={autoSave} />
      </SettingCard>

      <SettingCard
        title="导入 / 导出"
        description="将当前所有设置导出为 JSON 文件，或从文件中导入。"
      >
        <div class="flex gap-2">
          <Button variant="outline" class="w-20">导入</Button>
          <Button variant="outline" class="w-20">导出</Button>
        </div>
      </SettingCard>
    </div>
  </div>

  <!-- 危险操作 -->
  <div>
    <div class="mb-1 text-xl font-bold text-destructive">危险操作</div>
    <div class="space-y-3">
      <SettingCard
        title="重置所有设置"
        description="将全部设置恢复为出厂默认值，此操作不可撤销。"
      >
        <Button class="w-24" variant="destructive" onclick={resetAll}
          >立即重置</Button
        >
      </SettingCard>
    </div>
  </div>
</div>
