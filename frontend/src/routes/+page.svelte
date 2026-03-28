<script lang="ts">
  import { onMount } from "svelte";
  import { dishes, fetchDishes } from "$lib/stores/dish-store";
  import DishCard from "$lib/components/DishCard.svelte";
  import BottomRightCard from "$lib/components/sidebar/bottom-right-card.svelte";
  import BottomLeftCard from "$lib/components/sidebar/bottom-left-card.svelte";
  import Header from "$lib/components/sidebar/header.svelte";

  let scrollContainer: HTMLDivElement;
  let animationId: number;

  function startScroll() {
    let lastTime = 0;
    let accumulated = 0;
    const speed = 10; // px/s，可自由调整

    function step(timestamp: number) {
      if (lastTime) {
        const delta = (timestamp - lastTime) / 1000;
        accumulated += speed * delta;
        if (accumulated >= 1) {
          const px = Math.floor(accumulated);
          accumulated -= px;
          scrollContainer.scrollTop += px;
          if (
            scrollContainer.scrollTop + scrollContainer.clientHeight >=
            scrollContainer.scrollHeight - 2
          ) {
            scrollContainer.scrollTop = 0;
          }
        }
      }
      lastTime = timestamp;
      animationId = requestAnimationFrame(step);
    }
    animationId = requestAnimationFrame(step);
  }

  onMount(() => {
    fetchDishes().then(() => startScroll());
    return () => cancelAnimationFrame(animationId);
  });

  function effectivePrice(price: string, discount: number): string {
    const result = parseFloat(price) * discount;
    return result % 1 === 0 ? result.toFixed(0) : result.toFixed(1);
  }
</script>

<Header />
<BottomRightCard />
<BottomLeftCard />

<div class="flex h-full w-full overflow-hidden">
  <!-- 左侧：纯文字价目表 -->
  <div
    class="w-150 shrink-0 flex flex-col bg-white/95 border-r border-blue-100 shadow-lg"
  >
    <h2
      class="text-xl font-bold text-blue-600 px-5 py-4 border-b border-blue-100 tracking-wide shrink-0"
    >
      今日菜单
    </h2>
    <div
      class="overflow-y-scroll no-scrollbar px-4 py-3"
      style="flex:1 1 0; min-height:0"
    >
      <div class="grid grid-cols-2 gap-x-4 gap-y-0">
        {#each $dishes as dish}
          <div
            class="flex items-center justify-between py-2.5 border-b border-gray-100"
          >
            <span class="text-base text-gray-800 truncate mr-2"
              >{dish.name}</span
            >
            <span class="text-base font-semibold text-blue-600 shrink-0"
              >¥{effectivePrice(dish.price, dish.discount)}</span
            >
          </div>
        {/each}
      </div>
    </div>
  </div>

  <!-- 右侧：自动滚动卡片菜单 -->
  <div
    bind:this={scrollContainer}
    class="flex-1 overflow-y-scroll no-scrollbar px-4 py-4 pointer-events-none"
  >
    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 justify-items-center"
    >
      {#each $dishes as dish}
        <DishCard {dish} />
      {/each}
    </div>
  </div>
</div>

<style>
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style>
