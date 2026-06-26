<script lang="ts">
  import { ExternalLink, FileText, RefreshCw, Download, CheckCircle2 } from "@lucide/svelte";
  import SettingCard from "$lib/components/settings/cards/settings-card.svelte";
  import { Button } from "$lib/components/ui/button";
  import { Label } from "$lib/components/ui/label";
  import { fly } from "svelte/transition";
  import favicon from "$lib/assets/favicon.png";
  import { check } from "@tauri-apps/plugin-updater";

  let version = $state("0.1.0");
  import("@tauri-apps/api/app")
    .then((m) => m.getVersion())
    .then((v) => (version = v))
    .catch(() => {});

  let checking = $state(false);
  let updateAvailable = $state(false);
  let updateVersion = $state("");
  let updateNotes = $state("");
  let installing = $state(false);
  let statusMsg = $state("");

  function openUrl(url: string) {
    window.open(url, "_blank");
  }

  let toastTimeout: ReturnType<typeof setTimeout>;

  function showToast(msg: string) {
    statusMsg = msg;
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => (statusMsg = ""), 4000);
  }

  async function checkForUpdates() {
    if (checking) return;
    checking = true;
    updateAvailable = false;

    try {
      const update = await check();
      if (update?.available) {
        updateAvailable = true;
        updateVersion = update.version;
        updateNotes = update.body || "";
      } else {
        showToast("已是最新版本 ✓");
      }
    } catch (e) {
      console.error("检查更新失败:", e);
      showToast("检查更新失败，请检查网络连接");
    } finally {
      checking = false;
    }
  }

  async function doUpdate() {
    if (installing) return;
    installing = true;

    try {
      const update = await check();
      if (!update?.available) {
        showToast("未检测到可用更新");
        return;
      }

      // Progress tracking via the update object
      let downloaded = 0;
      let total = 0;

      await update.download((event) => {
        if (event.event === "Started") {
          total = event.data.contentLength ?? 0;
        } else if (event.event === "Progress") {
          downloaded += event.data.chunkLength;
        }
      });

      await update.install();
      showToast("更新已安装，即将重启...");

      // Relaunch after install
      const { relaunch } = await import("@tauri-apps/plugin-process");
      await relaunch();
    } catch (e) {
      console.error("安装更新失败:", e);
      const msg = e instanceof Error ? e.message : "安装更新失败";
      showToast(msg);
    } finally {
      installing = false;
    }
  }
</script>

<div class="space-y-6" in:fly={{ y: 16, duration: 300, opacity: 0 }}>
  <!-- App 信息头部 -->
  <div class="mb-6 flex flex-col items-center gap-2 text-center">
    <div class="mb-1 flex justify-center">
      <img src={favicon} alt="App Logo" class="h-64 w-64 rounded-md" />
    </div>
    <h2 class="text-3xl font-extrabold tracking-wide text-stone-800 dark:text-stone-100">
      Mens
    </h2>
    <p class="text-sm text-muted-foreground">餐厅数字菜单展示与管理系统</p>
  </div>

  <div class="space-y-3">
    <SettingCard title="版本号" description="当前应用版本。">
      <Label>v{version}</Label>
    </SettingCard>

    <SettingCard title="开源许可" description="本项目基于 MIT 协议开源。">
      <Button
        variant="outline"
        size="sm"
        onclick={() => openUrl("https://github.com/Miaoyww/Mens/blob/main/LICENSE")}
      >
        <FileText size={13} class="mr-1.5" />
        MIT
      </Button>
    </SettingCard>

    <SettingCard title="GitHub 仓库" description="查看源代码或提交 Issue。">
      <Button
        variant="outline"
        size="sm"
        onclick={() => openUrl("https://github.com/Miaoyww/Mens")}
      >
        <ExternalLink size={13} class="mr-1.5" />
        Miaoyww/Mens
      </Button>
    </SettingCard>

    <SettingCard
      title="检查更新"
      description={updateAvailable
        ? `发现新版本 v${updateVersion}`
        : checking
          ? "正在检查是否有新版本..."
          : "检测是否有新版本可用。"}
    >
      {#if !updateAvailable}
        <Button
          variant="outline"
          size="sm"
          disabled={checking}
          onclick={checkForUpdates}
        >
          <RefreshCw size={13} class={`mr-1.5 ${checking ? "animate-spin" : ""}`} />
          {checking ? "检查中..." : "检查更新"}
        </Button>
      {:else}
        <div class="flex flex-col gap-2">
          {#if updateNotes}
            <p class="text-xs text-muted-foreground max-w-xs whitespace-pre-wrap">
              {updateNotes}
            </p>
          {/if}
          <Button
            variant="default"
            size="sm"
            disabled={installing}
            onclick={doUpdate}
          >
            <Download size={13} class={`mr-1.5 ${installing ? "animate-bounce" : ""}`} />
            {installing ? "下载中..." : "立即更新"}
          </Button>
        </div>
      {/if}
    </SettingCard>

    <SettingCard
      title="重置所有设置"
      description="将全部设置恢复为出厂默认值，此操作不可撤销。"
    >
      <Button class="w-24" variant="destructive" size="sm">立即重置</Button>
    </SettingCard>
  </div>
</div>

<!-- Status toast -->
{#if statusMsg}
  <div
    transition:fly={{ y: -16, duration: 250 }}
    class="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 flex items-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background shadow-lg"
  >
    <CheckCircle2 size={14} />
    {statusMsg}
  </div>
{/if}
