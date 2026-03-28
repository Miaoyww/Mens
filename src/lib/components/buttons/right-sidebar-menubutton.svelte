<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';

    let { children } = $props<{ content: string }>();
	
</script>

{@render children?.()}