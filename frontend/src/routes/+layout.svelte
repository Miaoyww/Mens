<script lang="ts">
  import "../app.css";
  import RightSidebar from "$lib/components/sidebar/right-sidebar.svelte";
  import SettingsDialog from "$lib/components/dialog/settings-dialog.svelte";

  let { children } = $props();
</script>

<RightSidebar />
<SettingsDialog />

<div class="flex h-dvh flex-col overflow-hidden">
	<div class="h-16 shrink-0"></div>
	<div class="min-h-0 flex-1">
		<main class="relative h-full">
			{@render children?.()}
		</main>
	</div>
</div>
