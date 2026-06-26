<script lang="ts">
	import CheckIcon from "@lucide/svelte/icons/check";
	import CircleAlertIcon from "@lucide/svelte/icons/circle-alert";
	import { Button } from "$lib/components/ui/button";

	let {
		label,
		description,
		active = false,
		missing = false,
		complete = false,
		onclick,
	}: {
		label: string;
		description: string;
		active?: boolean;
		missing?: boolean;
		complete?: boolean;
		onclick?: (event: MouseEvent) => void;
	} = $props();

	const status = $derived(missing ? "missing" : complete ? "complete" : "default");
</script>

<div class="welcome-section-nav-item">
	<Button
		type="button"
		variant="outline"
		class="welcome-section-nav-button"
		data-active={active}
		aria-current={active ? "step" : undefined}
		{onclick}
	>
		<span class="min-w-0">
			<span class="block font-semibold">{label}</span>
			<span class="block truncate text-xs font-normal opacity-70">{description}</span>
		</span>
	</Button>

	<span class="welcome-section-nav-status" data-status={status} data-active={active}>
		{#if missing}
			<CircleAlertIcon class="size-3.5" />
		{:else}
			<CheckIcon class="size-3.5" />
		{/if}
	</span>
</div>
