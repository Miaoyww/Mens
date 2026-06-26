<script lang="ts">
  import { Pencil, Trash2 } from "@lucide/svelte";
  import type { Dish } from "$lib/stores/dish-store";
  import { categoryStyle, effectivePrice, discountDisplay } from "$lib/stores/dish-store";
  import * as Button from "$lib/components/ui/button/index.js";

  let {
    dish,
    onedit,
    ondelete,
  }: {
    dish: Dish;
    onedit: (dish: Dish) => void;
    ondelete: (dish: Dish) => void;
  } = $props();
</script>

<tr class="border-b transition-colors hover:bg-muted/50 group">
  <!-- 菜品名 + 缩略图 -->
  <td class="px-4 py-3">
    <div class="flex items-center gap-3">
      {#if dish.image}
        <img
          src={dish.image}
          alt={dish.name}
          class="w-10 h-10 rounded-lg object-cover bg-muted ring-1 ring-border"
        />
      {:else}
        <div class="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground text-lg select-none">
          🍽
        </div>
      {/if}
      <span class="font-medium text-sm">{dish.name}</span>
    </div>
  </td>

  <!-- 分类标签 -->
  <td class="px-4 py-3">
    <span class="text-xs font-medium px-2 py-0.5 rounded-md border {categoryStyle[dish.category]?.classes ?? ''}">
      {categoryStyle[dish.category]?.text ?? dish.category}
    </span>
  </td>

  <!-- 原价 -->
  <td class="px-4 py-3 text-sm text-muted-foreground">¥{dish.price}</td>

  <!-- 折扣 -->
  <td class="px-4 py-3">
    {#if dish.discount >= 1}
      <span class="text-muted-foreground/50 text-xs">—</span>
    {:else}
      <span class="text-xs font-medium bg-destructive/10 text-destructive border border-destructive/20 px-2 py-0.5 rounded-md">
        {discountDisplay(dish.discount)}
      </span>
    {/if}
  </td>

  <!-- 实售价 -->
  <td class="px-4 py-3">
    <span class="text-sm font-semibold">¥{effectivePrice(dish.price, dish.discount)}</span>
  </td>

  <!-- 操作按钮 -->
  <td class="px-4 py-3">
    <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <Button.Root variant="ghost" size="xs" onclick={() => onedit(dish)}>
        <Pencil size={12} />编辑
      </Button.Root>
      <Button.Root variant="ghost" size="xs" onclick={() => ondelete(dish)}>
        <Trash2 size={12} />删除
      </Button.Root>
    </div>
  </td>
</tr>
