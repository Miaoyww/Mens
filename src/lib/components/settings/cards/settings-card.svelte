<script lang="ts">
	import { Label } from "$lib/components/ui/label";
	import { cn } from "$lib/utils";
	import type { Snippet } from "svelte";

	let {
		title = "",
		description = "",
		class: className = "",
		children,
	}: {
		title?: string;
		description?: string;
		class?: string;
		children?: Snippet<[string]>;
	} = $props();

	const id = Math.trunc(Math.random() * Number.MAX_SAFE_INTEGER).toString();
</script>

<div
	class={cn(
		"blur-setting-card flex flex-col justify-between gap-3 rounded-lg border border-border/70 bg-background/80 px-6 py-4 shadow-sm md:flex-row md:items-center",
		className
	)}
>
	<Label for={id} class="space-1 block grow leading-[unset]">
		<div class="font-bold">{title}</div>
		<div class="block whitespace-pre-wrap text-xs text-muted-foreground">{description}</div>
	</Label>
	{@render children?.(id)}
</div>
