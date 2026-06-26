<script lang="ts">
  import AppSidebar from "$lib/components/sidebar/app-sidebar.svelte";
  import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
  import { Separator } from "$lib/components/ui/separator/index.js";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import { sidebarOpen } from "$lib/stores/global-ui-store";

  let { children } = $props();
</script>

<Sidebar.Provider bind:open={$sidebarOpen}>
  <AppSidebar />
  <Sidebar.Inset>
    <!-- Main -->
    <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
      {@render children?.()}
    </div>
  </Sidebar.Inset>
</Sidebar.Provider>
