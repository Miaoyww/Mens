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

  // ── Auto-update check (startup) ──────────────────────────────
  onMount(async () => {
    // Don't check for updates in the display window
    if (page.url.pathname === "/display") return;

    try {
      const { check } = await import("@tauri-apps/plugin-updater");
      const update = await check();
      if (update?.available) {
        console.log(`[Updater] New version available: ${update.version}`);
        // Store update info for the about page to pick up
        (window as any).__pendingUpdate = update;
      }
    } catch {
      // Silently ignore — update check failures shouldn't block the app
    }
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
