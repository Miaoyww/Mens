<script lang="ts">
  import type { Dish } from '$lib/stores/dish-store';
    import { settings } from '$lib/stores/store';
    let themeColor = $state($settings.themeColor ?? '#2563EB');
  
    function effectivePrice(price: string, discount: number): string {
      const result = parseFloat(price) * discount;
      return result % 1 === 0 ? result.toFixed(0) : result.toFixed(1);
    }
  let { dish } = $props<{ dish: Dish }>();
</script>

<div class="w-70 h-80 shrink-0 bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col border border-gray-100 transition-all hover:shadow-2xl hover:-translate-y-1">
  
  <div class="w-full h-2/3 shrink-0 overflow-hidden bg-gray-50 flex items-center justify-center">
    {#if dish.image}
      <img src={dish.image} alt={dish.name} class="w-full h-full object-cover" />
    {:else}
      <div class="text-gray-300">暂无图片</div>
    {/if}
  </div>

  <div class="flex-1 p-5 flex flex-col justify-between items-center text-center">
    <h3 class="text-xl font-bold text-gray-800 line-clamp-1">{dish.name}</h3>
    
    <div class="flex flex-col items-center gap-1">
      {#if dish.discount}
        <div class="flex items-center gap-2">
          <span class="text-2xl font-black" style="color: {themeColor};">¥{effectivePrice(dish.price, dish.discount)}</span>
          <span class="text-sm text-gray-400 line-through">¥{dish.price}</span>
        </div>
        <span class="text-[10px] px-2 py-0.5 rounded-full text-white bg-red-400">限时优惠</span>
      {:else}
        <span class="text-2xl font-black" style="color: {themeColor};">¥{dish.price}</span>
      {/if}
    </div>
  </div>
</div>