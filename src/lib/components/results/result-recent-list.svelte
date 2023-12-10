<script lang="ts">
	import type { Result } from '@prisma/client';
	import ResultRecent from './result-recent.svelte';

	export let results: Result[];
</script>

<div class="text-center">
	<h3 class="font-bold text-2xl tracking-tight py-2">Recently Added</h3>
	<ul class="list-disc">
		{#each results as i}
			<ResultRecent result={i} />
		{/each}
	</ul>
</div>
