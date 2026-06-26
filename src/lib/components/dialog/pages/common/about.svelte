<script lang="ts">
	import { ExternalLink, FileText, RefreshCw } from '@lucide/svelte';
	import SettingCard from '$lib/components/settings/settings-card.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { fly } from 'svelte/transition';

	let version = $state('0.1.0');
	import('@tauri-apps/api/app').then(m => m.getVersion()).then(v => version = v).catch(() => {});

	let checking = $state(false);

	function openUrl(url: string) {
		window.open(url, '_blank');
	}

	async function checkForUpdates() {
		if (checking) return;
		checking = true;
		// TODO: integrate with Tauri updater
		setTimeout(() => {
			checking = false;
		}, 2000);
	}
</script>

<div class="space-y-6" in:fly={{ y: 16, duration: 300, opacity: 0 }}>
	<!-- App 信息头部 -->
	<div class="mb-6 flex flex-col items-center gap-2 text-center">
		<div class="w-16 h-16 bg-linear-to-r from-blue-700 to-blue-600 rounded-2xl flex items-center justify-center mb-2 shadow-lg">
			<span class="text-white text-2xl font-black">M</span>
		</div>
		<h2 class="text-3xl font-extrabold tracking-wide text-stone-800 dark:text-stone-100">
			Mens
		</h2>
		<p class="text-sm text-muted-foreground">餐厅数字菜单展示与管理系统</p>
	</div>

	<div class="space-y-3">
		<SettingCard title="版本号" description="当前应用版本。">
			<Label>v{version}</Label>
		</SettingCard>

		<SettingCard title="开源许可" description="本项目基于 MIT 协议开源。">
			<Button
				variant="outline"
				size="sm"
				onclick={() => openUrl('https://github.com/Miaoyww/Mens/blob/main/LICENSE')}
			>
				<FileText size={13} class="mr-1.5" />
				MIT
			</Button>
		</SettingCard>

		<SettingCard title="GitHub 仓库" description="查看源代码或提交 Issue。">
			<Button
				variant="outline"
				size="sm"
				onclick={() => openUrl('https://github.com/Miaoyww/Mens')}
			>
				<ExternalLink size={13} class="mr-1.5" />
				Miaoyww/Mens
			</Button>
		</SettingCard>

		<SettingCard title="检查更新" description="检测是否有新版本可用。">
			<Button variant="outline" size="sm" disabled={checking} onclick={checkForUpdates}>
				<RefreshCw size={13} class={`mr-1.5 ${checking ? 'animate-spin' : ''}`} />
				{checking ? '检查中...' : '检查更新'}
			</Button>
		</SettingCard>

		<SettingCard
			title="重置所有设置"
			description="将全部设置恢复为出厂默认值，此操作不可撤销。"
		>
			<Button class="w-24" variant="destructive" size="sm">立即重置</Button>
		</SettingCard>
	</div>
</div>
