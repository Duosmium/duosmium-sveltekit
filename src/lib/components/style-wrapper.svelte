<script lang="ts">
	import { config } from '$lib/stores';
	import type { Style } from '$lib/styles';

	export let styleName: Style['name'];
</script>

{#if !styleName || $config.style === styleName}
	<slot />
{/if}
