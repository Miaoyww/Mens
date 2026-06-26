<script lang="ts">
  import "../app.css";
  import SettingsDialog from "$lib/components/settings/settings-dialog.svelte";
  import TitleBar from "$lib/components/titlebar.svelte";
  import { isTauri } from "@tauri-apps/api/core";
  import { globalSettings } from "$lib/stores/global-settings-store";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";

  let { children } = $props();

  onMount(() => {
    if (!$globalSettings.welcomeCompleted) {
      goto("/welcome");
      return;
    }
  });

</script>

<TitleBar />
<SettingsDialog />

<div class={isTauri() ? "pt-9" : ""}>
  <main class="h-[calc(100vh-2.5rem)] overflow-hidden">
    {@render children?.()}
  </main>
</div>

<style>
  * {
    margin: 0;
  }
</style>
