<script lang="ts">
	import type { PageServerData } from './$types';
	import ResultSeason from '$lib/components/results/result-season.svelte';

	export let data: PageServerData;

	let seasons: number[] = data.seasons;
	let resultsBySeason: object = data.resultsBySeason;
</script>

<div class="container">
	<h1 class="text-center tracking-tight font-bold text-4xl pb-2 pt-12">All Results by Season</h1>
	<div>
		{#each seasons as s}
			<ResultSeason season={s} results={resultsBySeason[s]} />
		{/each}
	</div>
</div>
