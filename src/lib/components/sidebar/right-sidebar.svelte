<script lang="ts">
	import RightSidebarMenubutton from '$lib/components/buttons/right-sidebar-menubutton.svelte';
	import { Button } from '$lib/components/ui/button';
	import {  Ruler, Airplay,Blocks } from '@lucide/svelte';
	import SettingsButton from '$lib/components/buttons/right-bar/settings-button.svelte';
	import ResetButton from '$lib/components/buttons/right-bar/reset-button.svelte';
	import { rightBarPinned } from '$lib/stores/sidebar-store';
	import PinButton from '../buttons/right-bar/pin-button.svelte';

	// 是否鼠标悬停
	let hover = $state(false);

	// 计算最终展开状态
	let expanded = $derived($rightBarPinned || hover);

	function togglePin() {
		rightBarPinned.update((prev) => !prev);
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore event_directive_deprecated -->
<div
	class="sidebar blur-backdrop absolute top-30 bottom-30 z-1000 flex w-15 flex-1 flex-col justify-between overflow-hidden rounded-lg"
	style:right={$rightBarPinned ? '20px' : hover ? '0px' : '-50px'}
	on:mouseenter={() => (hover = true)}
	on:mouseleave={() => (hover = false)}
>
	<div class="toggle-btn">
		<PinButton />
	</div>

	<div class="panel-section">
		<div class="controls">
			<RightSidebarMenubutton content="显示菜单">
				<Button variant="ghost" size="icon" href="/">
					<Airplay />
				</Button>
			</RightSidebarMenubutton>
			<RightSidebarMenubutton content="菜单设置">
				<Button variant="ghost" size="icon" href="/admin">
					<Blocks />
				</Button>
			</RightSidebarMenubutton>
		</div>
	</div>

	<div class="panel-section">
		<div class="controls">
			<RightSidebarMenubutton content="设置">
				<SettingsButton />
			</RightSidebarMenubutton>
		</div>
	</div>
</div>

<style>
	.sidebar {
		transition: right 0.3s;
	}

	.toggle-btn {
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		height: 50px;
	}

	.panel-section {
		padding: 10px;
	}

	.controls {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
</style>
