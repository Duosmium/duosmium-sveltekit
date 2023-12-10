<script lang="ts">
	import Hero from '$lib/components/results/hero.svelte';
	import ResultCardGrid from '$lib/components/results/result-card-grid.svelte';
	import ResultCard from '$lib/components/results/result-card.svelte';
	import type { Result } from '@prisma/client';
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	let countsByLevel: object = data.countsByLevel;
	let recents: Result[] = data.recents;
	let allResults: Result[] = data.allResults;
</script>

<div class="container relative">
	<Hero {countsByLevel} recentResults={recents} />
	<h2 class="pb-4 text-3xl font-bold tracking-tight transition-colors text-center">
		Recent Tournaments
	</h2>
	<ResultCardGrid>
		{#each allResults as r}
			<ResultCard meta={r} />
		{/each}
	</ResultCardGrid>
	<h2 class="py-4 text-3xl font-bold tracking-tight transition-colors text-center">
		Past Tournaments
	</h2>
	<p class="text-center">
		Searching for something that&apos;s not listed here? Check out our{' '}
		<a href="/results/all" class="text-sky-700 dark:text-sky-500 hover:underline"> full list</a>!
	</p>
</div>
