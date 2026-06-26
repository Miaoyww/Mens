<script lang="ts">
  import type { Dish } from "$lib/stores/dish-store";
  import { categoryStyle, effectivePrice, discountDisplay } from "$lib/stores/dish-store";
  import { globalSettings } from "$lib/stores/global-store";
  import * as Card from "$lib/components/ui/card/index.js";

  let { dish } = $props<{ dish: Dish }>();

  const cat = $derived(categoryStyle[dish.category] ?? { text: dish.category, classes: "" });
  const themeColor = $derived($globalSettings.themeColor ?? "#2563EB");
  const hasDiscount = $derived(dish.discount < 1);
</script>

<Card.Root class="group relative overflow-hidden border-border/60 bg-card shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
  <div class="aspect-[4/3] overflow-hidden bg-muted">
    {#if dish.image}
      <img src={dish.image} alt={dish.name} class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
    {:else}
      <div class="flex h-full w-full items-center justify-center text-muted-foreground/30">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></svg>
      </div>
    {/if}
    {#if hasDiscount}
      <div class="absolute left-3 top-3 rounded-full bg-destructive px-2.5 py-0.5 text-[11px] font-bold text-destructive-foreground shadow">
        {discountDisplay(dish.discount)}
      </div>
    {/if}
    <div class="absolute right-3 top-3 rounded-full px-2 py-0.5 text-[10px] font-semibold shadow {cat.classes}">{cat.text}</div>
  </div>
  <Card.Content class="space-y-2 p-4">
    <Card.Title class="text-base leading-tight">{dish.name}</Card.Title>
    <div class="flex items-baseline gap-2">
      {#if hasDiscount}
        <span class="text-xl font-extrabold tracking-tight" style="color: {themeColor}">&yen;{effectivePrice(dish.price, dish.discount)}</span>
        <span class="text-sm text-muted-foreground line-through">&yen;{dish.price}</span>
      {:else}
        <span class="text-xl font-extrabold tracking-tight" style="color: {themeColor}">&yen;{dish.price}</span>
      {/if}
    </div>
  </Card.Content>
</Card.Root>
