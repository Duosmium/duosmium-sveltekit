<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	import { Heading, A, Secondary } from 'flowbite-svelte';
	import { TOURNAMENT_LEVELS } from '$lib/helpers/misc';
	import Card from '$lib/components/home/card.svelte';
	import PreliminaryBadge from '$lib/components/common/preliminary-badge.svelte';
	import OfficialBadge from '$lib/components/common/official-badge.svelte';
</script>

<svelte:head>
	<title>Duosmium Results</title>
</svelte:head>

<Heading tag="h1" class="text-center">Duosmium Results</Heading>
<div class="mt-8 flex flex-row gap-8">
	<div class="w-full">
		<Heading tag="h2" class="mb-4 w-full text-center">Recently Added</Heading>
		<ul class="mx-auto w-full text-center">
			{#each data.latestResultsData as result (result.duosmium_id)}
				<li class="space-x-2">
					<A href={`/results/${result.duosmium_id}`}
						>{result.short_title} (Div. {result.duosmium_id.at(-1).toUpperCase()})</A
					>
					{#if result.official}
						<OfficialBadge />
					{/if}
					{#if result.preliminary}
						<PreliminaryBadge />
					{/if}
				</li>
			{/each}
		</ul>
	</div>
	<div class="w-full">
		<Heading tag="h2" class="mb-4 w-full text-center">Archive Totals</Heading>
		<ul class="mx-auto w-full text-center">
			{#each Object.keys(TOURNAMENT_LEVELS) as level (level)}
				<li>
					<Heading tag="h3"
						><Secondary
							>{data.levelsData[level]}
							{TOURNAMENT_LEVELS[level as keyof typeof TOURNAMENT_LEVELS]}{data.levelsData[
								level
							] === 1
								? ''
								: 's'}
						</Secondary>
					</Heading>
				</li>
			{/each}
			<li>
				<Heading tag="h3"
					><Secondary
						>{data.levelsData.total}
						Total
					</Secondary>
				</Heading>
			</li>
		</ul>
	</div>
</div>
<Heading tag="h2" class="mt-8 text-center">Recent Results</Heading>
<div class="mt-8 flex flex-wrap justify-center gap-8">
	{#each data.recentResultsData as result (result.duosmium_id)}
		<Card {result} />
	{/each}
</div>
