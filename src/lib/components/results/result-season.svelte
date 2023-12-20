<script lang="ts">
	import type { Result } from '@prisma/client';
	import OfficialBadge from './official-badge.svelte';
	import PreliminaryBadge from './preliminary-badge.svelte';

	export let season: number;
	export let results: Result[];
</script>

<div class="py-2">
	<h2 class="font-bold text-2xl tracking-tight text-left pb-1">{season}</h2>
	<hr />
	<ul class="list-disc pt-1">
		{#each results as r}
			<li class="list-inside">
				<a href="/results/{r.duosmium_id}" class="text-sky-700 dark:text-sky-500 hover:underline"
					>{r.full_title}</a
				>{' '}
				— {r.date} @ {r.location_name}
				{#if r.official}
					<OfficialBadge class="ml-1" />
				{/if}
				{#if r.preliminary}
					<PreliminaryBadge class="ml-1" />
				{/if}
			</li>
		{/each}
	</ul>
</div>
