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

  <!-- WiFi -->
  <div>
    <div class="mb-1 text-xl font-bold text-stone-800 dark:text-stone-100">
      WiFi
    </div>
    <div class="space-y-3">
      <SettingCard
        title="网络名称 (SSID)"
        description="顾客在展示页面底部看到的 WiFi 名称。"
      >
        <Input
          class="w-48"
          bind:value={wifiName}
          placeholder="例：Restaurant_Guest"
        />
      </SettingCard>

      <SettingCard
        title="WiFi 密码"
        description="WiFi 连接密码，留空表示开放网络。"
      >
        <div class="flex items-center gap-2">
          <Input
            class="w-48"
            bind:value={wifiPassword}
            placeholder="输入 WiFi 密码"
          />
          <Button variant="outline" class="w-16" onclick={saveWifi}>保存</Button
          >
        </div>
      </SettingCard>

      <SettingCard
        title="二维码 URL"
        description="展示页面右下角显示的二维码图片地址。"
      >
        <div class="flex items-center gap-2">
          <Input
            class="w-64"
            bind:value={qrCodeUrl}
            placeholder="https://..."
          />
          <Button variant="outline" class="w-16" onclick={saveQrCode}
            >保存</Button
          >
        </div>
      </SettingCard>
    </div>
  </div>

  <!-- 界面 -->
  <div>
    <div class="mb-1 text-xl font-bold text-stone-800 dark:text-stone-100">
      界面
    </div>
    <div class="space-y-3">
      <SettingCard
        title="过渡动画"
        description="开启后界面切换时显示淡入淡出等过渡效果。"
      >
        <Switch bind:checked={enableAnimation} />
      </SettingCard>

      <SettingCard
        title="紧凑模式"
        description="减少内边距与间距，适合小屏幕或高密度内容场景。"
      >
        <Switch bind:checked={compactMode} />
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
