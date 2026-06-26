<script lang="ts">
  import AppSidebar from "$lib/components/sidebar/app-sidebar.svelte";
  import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
  import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte";
  import { Separator } from "$lib/components/ui/separator/index.js";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import { sidebarOpen } from "$lib/stores/global-ui-store";

  let { children } = $props();
</script>

<Sidebar.Provider bind:open={$sidebarOpen}>
  <AppSidebar />
  <Sidebar.Inset>
    <!-- Main -->
    <div class="flex p-5 pt-5 overflow-hidden">
      <ScrollArea class="flex-1">
        {@render children?.()}
      </ScrollArea>
    </div>
  </Sidebar.Inset>
</Sidebar.Provider>

