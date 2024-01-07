<script lang="ts">
	import OfficialBadge from './official-badge.svelte';
	import PreliminaryBadge from './preliminary-badge.svelte';

	export let season: number;
	export let results: object;
</script>

<div class="py-2">
	<h2 class="font-bold text-2xl tracking-tight text-left pb-1" id={season}>{season}</h2>
	<hr />
	<ul class="list-disc pt-1">
		{#each Object.values(results) as r}
			<li class="list-inside">
				<a href="/results/{r.duosmium_id}" class="text-sky-700 dark:text-sky-500 hover:underline"
					>{r.title}</a
				>{' '}
				— {r.date} @ {r.location}
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
