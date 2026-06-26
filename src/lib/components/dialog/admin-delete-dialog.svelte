<script lang="ts">
  import { Trash2, Loader2 } from "@lucide/svelte";
  import type { Dish } from "$lib/stores/dish-store";
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";

  let {
    open = $bindable(false),
    dish,
    onconfirm,
    onclose,
  }: {
    open: boolean;
    dish: Dish | null;
    onconfirm: () => Promise<void>;
    onclose: () => void;
  } = $props();

  let loading = $state(false);

  async function confirm() {
    loading = true;
    try {
      await onconfirm();
    } finally {
      loading = false;
    }
  }
</script>

<AlertDialog.Root bind:open>
  <AlertDialog.Content on:close={onclose}>
    <AlertDialog.Header>
      <div class="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-2">
        <Trash2 size={20} class="text-destructive" />
      </div>
      <AlertDialog.Title>确认删除</AlertDialog.Title>
      <AlertDialog.Description>
        确定要删除菜品 <span class="font-semibold text-foreground">「{dish?.name}」</span>？此操作无法撤销。
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel onclick={onclose}>取消</AlertDialog.Cancel>
      <AlertDialog.Action variant="destructive" onclick={confirm} disabled={loading}>
        {#if loading}
          <Loader2 size={14} class="animate-spin" />
          删除中…
        {:else}
          <Trash2 size={14} />
          确认删除
        {/if}
      </AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
