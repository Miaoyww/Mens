<script lang="ts">
  import "../app.css";
  import RightSidebar from "$lib/components/sidebar/right-sidebar.svelte";
  import SettingsDialog from "$lib/components/dialog/settings-dialog.svelte";
  import TitleBar from "$lib/components/titlebar.svelte";
  import { isTauri } from "@tauri-apps/api/core";

  let { children } = $props();
</script>

<TitleBar />

<RightSidebar />
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
