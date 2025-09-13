<script lang="ts">
	import type { PageProps } from './$types';
	import { Heading, P, A } from 'flowbite-svelte';

	let { data }: PageProps = $props();
</script>

<Heading tag="h1" class="text-center">All Results by Season</Heading>
{#await data.seasons}
	<P>Loading...</P>
{:then seasons}
	{#each Object.keys(seasons).reverse() as season (season)}
		{#if seasons[Number(season)].length > 0}
			<div class="mt-8">
				<Heading tag="h2" class="mb-4 w-full">{season}</Heading>
				<ul class="mx-auto w-full">
					{#each seasons[Number(season)] as result (result.duosmium_id)}
						<li>
							<A href={`/results/${result.duosmium_id}`}
								>{result.title} (Div. {result.duosmium_id.at(-1).toUpperCase()})</A
							> — {result.date_string} @ {result.location}
						</li>
					{/each}
				</ul>
			</div>
		{/if}
	{/each}
{/await}
