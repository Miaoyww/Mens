<script lang="ts">
  import AppSidebar from "$lib/components/sidebar/app-sidebar.svelte";
  import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
  import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte";
  import { Separator } from "$lib/components/ui/separator/index.js";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import { sidebarOpen } from "$lib/stores/global-ui-store";

  let { children } = $props();
</script>

<Sidebar.Provider bind:open={$sidebarOpen} class="h-full">
  <AppSidebar />
  <Sidebar.Inset>
    <!-- Main -->
    <div class="flex flex-1 flex-col p-5 overflow-hidden min-h-0">
      <ScrollArea class="h-full w-full">
        <div>
          {@render children?.()}
          <div class="h-30"></div>
        </div>
      </ScrollArea>
    </div>
  </Sidebar.Inset>
</Sidebar.Provider>
