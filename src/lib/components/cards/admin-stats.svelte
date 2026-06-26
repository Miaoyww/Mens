<script lang="ts">
  import { dishes } from "$lib/stores/dish-store";
  import * as Card from "$lib/components/ui/card/index.js";

  let stats = $derived({
    total: $dishes.length,
    hot: $dishes.filter((d) => d.category === "hot").length,
    cold: $dishes.filter((d) => d.category === "cold").length,
    soup: $dishes.filter((d) => d.category === "soup").length,
    discounted: $dishes.filter((d) => d.discount < 1).length,
  });
</script>

<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
  <Card.Root size="sm">
    <Card.Header class="pb-2">
      <Card.Description>全部</Card.Description>
      <Card.Title class="text-2xl font-bold tabular-nums">{stats.total}</Card.Title>
    </Card.Header>
    <Card.Content class="text-xs text-muted-foreground">道菜品</Card.Content>
  </Card.Root>

  <Card.Root size="sm">
    <Card.Header class="pb-2">
      <Card.Description>热菜</Card.Description>
      <Card.Title class="text-2xl font-bold tabular-nums">{stats.hot}</Card.Title>
    </Card.Header>
    <Card.Content class="text-xs text-muted-foreground">道</Card.Content>
  </Card.Root>

  <Card.Root size="sm">
    <Card.Header class="pb-2">
      <Card.Description>冷菜</Card.Description>
      <Card.Title class="text-2xl font-bold tabular-nums">{stats.cold}</Card.Title>
    </Card.Header>
    <Card.Content class="text-xs text-muted-foreground">道</Card.Content>
  </Card.Root>

  <Card.Root size="sm">
    <Card.Header class="pb-2">
      <Card.Description>汤</Card.Description>
      <Card.Title class="text-2xl font-bold tabular-nums">{stats.soup}</Card.Title>
    </Card.Header>
    <Card.Content class="text-xs text-muted-foreground">道</Card.Content>
  </Card.Root>

  <Card.Root size="sm">
    <Card.Header class="pb-2">
      <Card.Description>折扣中</Card.Description>
      <Card.Title class="text-2xl font-bold tabular-nums">{stats.discounted}</Card.Title>
    </Card.Header>
    <Card.Content class="text-xs text-muted-foreground">道</Card.Content>
  </Card.Root>
</div>
