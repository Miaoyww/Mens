<script lang="ts">
  import "../app.css";
  import TitleBar from "$lib/components/titlebar.svelte";
  import { isTauri } from "@tauri-apps/api/core";
  import { globalSettings } from "$lib/stores/global-settings-store";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { onMount } from "svelte";

  let { children } = $props();

  onMount(() => {
    // Only redirect from the root path — other routes (e.g. /display
    // opened in a separate window) should load without interference.
    if (page.url.pathname !== "/") return;

    if (!$globalSettings.welcomeCompleted) {
      goto("/welcome");
      return;
    }
    goto("/dashboard");
  });
</script>

<TitleBar />

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
