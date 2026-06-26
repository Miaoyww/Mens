<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
</script>

<div class="space-y-3">
  <h2 class="text-sm font-semibold text-muted-foreground">订单统计</h2>
  <div class="grid grid-cols-3 gap-4">
    <Card.Root size="sm">
      <Card.Header class="pb-2">
        <Card.Description>新订单</Card.Description>
        <Card.Title class="text-2xl font-bold tabular-nums">0</Card.Title>
      </Card.Header>
      <Card.Content class="text-xs text-muted-foreground">待处理</Card.Content>
    </Card.Root>

    <Card.Root size="sm">
      <Card.Header class="pb-2">
        <Card.Description>正出餐</Card.Description>
        <Card.Title class="text-2xl font-bold tabular-nums">0</Card.Title>
      </Card.Header>
      <Card.Content class="text-xs text-muted-foreground">进行中</Card.Content>
    </Card.Root>

    <Card.Root size="sm">
      <Card.Header class="pb-2">
        <Card.Description>已完成</Card.Description>
        <Card.Title class="text-2xl font-bold tabular-nums">0</Card.Title>
      </Card.Header>
      <Card.Content class="text-xs text-muted-foreground">今日</Card.Content>
    </Card.Root>
  </div>
</div>
