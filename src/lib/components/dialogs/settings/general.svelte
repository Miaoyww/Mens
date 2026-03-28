<script lang="ts">
	import SettingCard from '$lib/components/settings/settings-card.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Switch } from '$lib/components/ui/switch';
	import { settings } from '$lib/stores/store';

	let themeColor = $state($settings.themeColor ?? '#2563EB');
	let backgroundUrl = $state($settings.backgroundImage ?? '');
	let enableAnimation = $state(true);
	let compactMode = $state(false);
	let autoSave = $state(true);

	function applyThemeColor() {
		settings.update((s) => ({ ...s, themeColor }));
	}

	function applyBackground() {
		settings.update((s) => ({ ...s, backgroundImage: backgroundUrl }));
	}

	function resetAll() {
		settings.set({
			themeColor: '#2563EB',
			backgroundImage: '',
			qrCodeUrl: ''
		});
		themeColor = '#2563EB';
		backgroundUrl = '';
		enableAnimation = true;
		compactMode = false;
		autoSave = true;
	}
</script>

<div class="space-y-6 pb-10 lg:max-w-4xl">
	<!-- 外观 -->
	<div>
		<div class="mb-3 text-xl font-bold">外观</div>
		<div class="space-y-2">
			<SettingCard
				let:id
				title="主题颜色"
				description="用于高亮按钮、链接等交互元素的主色调。"
			>
				<div class="flex items-center gap-2">
					<input
						type="color"
						bind:value={themeColor}
						class="h-9 w-9 cursor-pointer rounded-md border border-border bg-transparent p-0.5"
					/>
					<Input
						{id}
						class="w-28 font-mono uppercase"
						bind:value={themeColor}
						maxlength={7}
						placeholder="#2563EB"
					/>
					<Button variant="outline" class="w-16" onclick={applyThemeColor}>应用</Button>
				</div>
			</SettingCard>

			<SettingCard
				let:id
				title="背景图片"
				description="输入图片 URL 作为主界面背景，留空则使用纯色背景。"
			>
				<div class="flex items-center gap-2">
					<Input
						{id}
						class="w-56"
						bind:value={backgroundUrl}
						placeholder="https://example.com/bg.jpg"
					/>
					<Button variant="outline" class="w-16" onclick={applyBackground}>应用</Button>
				</div>
			</SettingCard>
		</div>
	</div>

	<!-- 界面 -->
	<div>
		<div class="mb-3 text-xl font-bold">界面</div>
		<div class="space-y-2">
			<SettingCard
				let:id
				title="过渡动画"
				description="开启后界面切换时显示淡入淡出等过渡效果。"
			>
				<Switch {id} bind:checked={enableAnimation} />
			</SettingCard>

			<SettingCard
				let:id
				title="紧凑模式"
				description="减少内边距与间距，适合小屏幕或高密度内容场景。"
			>
				<Switch {id} bind:checked={compactMode} />
			</SettingCard>
		</div>
	</div>

	<!-- 数据 -->
	<div>
		<div class="mb-3 text-xl font-bold">数据</div>
		<div class="space-y-2">
			<SettingCard
				let:id
				title="自动保存"
				description="每次修改后自动将数据持久化至本地存储。"
			>
				<Switch {id} bind:checked={autoSave} />
			</SettingCard>

			<SettingCard
				let:id
				title="导入 / 导出"
				description="将当前所有设置导出为 JSON 文件，或从文件中导入。"
			>
				<div class="flex gap-2">
					<Button variant="outline" class="w-20">导入</Button>
					<Button variant="outline" class="w-20">导出</Button>
				</div>
			</SettingCard>
		</div>
	</div>

	<!-- 危险操作 -->
	<div>
		<div class="mb-3 text-xl font-bold text-destructive">危险操作</div>
		<div class="space-y-2">
			<SettingCard
				let:id
				title="重置所有设置"
				description="将全部设置恢复为出厂默认值，此操作不可撤销。"
			>
				<Button {id} class="w-24" variant="destructive" onclick={resetAll}>立即重置</Button>
			</SettingCard>
		</div>
	</div>
</div>
