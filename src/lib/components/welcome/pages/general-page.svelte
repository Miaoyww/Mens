<script lang="ts">
	import SettingsCard from "$lib/components/settings/cards/settings-card.svelte";
	import { globalSettings } from "$lib/stores/global-settings-store";
	import { Sun, Moon, Monitor } from "@lucide/svelte";

	type ThemeMode = "light" | "dark" | "system";

	const themeOptions: {
		value: ThemeMode;
		label: string;
		description: string;
		icon: typeof Sun;
	}[] = [
		{
			value: "light",
			label: "浅色模式",
			description: "始终使用浅色主题",
			icon: Sun,
		},
		{
			value: "dark",
			label: "深色模式",
			description: "始终使用深色主题",
			icon: Moon,
		},
		{
			value: "system",
			label: "跟随系统",
			description: "根据系统设置自动切换",
			icon: Monitor,
		},
	];

	/** 应用主题到 <html> 元素 */
	function applyTheme(theme: ThemeMode) {
		const root = document.documentElement;
		if (theme === "dark") {
			root.classList.add("dark");
		} else if (theme === "light") {
			root.classList.remove("dark");
		} else {
			const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
			root.classList.toggle("dark", prefersDark);
		}
	}

	function setThemeMode(theme: ThemeMode) {
		globalSettings.patch({ theme });
		applyTheme(theme);
	}
</script>

<section class="flex flex-col gap-6">
	<div class="flex flex-col gap-2">
		<p class="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
			基础设置
		</p>
		<h2 class="text-2xl font-semibold tracking-tight">个性化你的体验</h2>
		<p class="max-w-2xl text-sm text-muted-foreground">
			你可以随时在设置中修改这些选项。
		</p>
	</div>

	<div class="flex flex-col gap-3">
		<SettingsCard
			title="界面主题"
			description="选择浅色、深色或跟随系统自动切换。"
		>
			{#snippet children()}
				<div class="grid grid-cols-1 gap-2 sm:grid-cols-3">
					{#each themeOptions as option}
						<button
							type="button"
							onclick={() => setThemeMode(option.value)}
							class="flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all
								{$globalSettings.theme === option.value
									? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500/20 dark:border-blue-400 dark:bg-blue-950'
									: 'border-border bg-background hover:border-blue-300 hover:bg-muted/50'}"
						>
							<option.icon
								size={20}
								class={$globalSettings.theme === option.value
									? 'text-blue-600 dark:text-blue-400'
									: 'text-muted-foreground'}
							/>
							<div>
								<div class="text-sm font-medium">{option.label}</div>
								<div class="text-xs text-muted-foreground">
									{option.description}
								</div>
							</div>
						</button>
					{/each}
				</div>
			{/snippet}
		</SettingsCard>
	</div>
</section>
