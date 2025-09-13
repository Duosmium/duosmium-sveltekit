<script lang="ts">
	import { ordinalize } from '$lib/helpers/misc';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	import { Heading, A, Secondary } from 'flowbite-svelte';
</script>

<Heading tag="h1" class="text-center">Schools</Heading>
<div class="mx-auto mt-4 text-center">
	{#each data.letters as letter (letter)}
		<A href={`/results/schools/${letter.toLowerCase()}`} class="px-2 text-lg font-semibold"
			>{letter.toUpperCase()}</A
		>
		<!-- {#if letter !== data.letters[data.letters.length - 1]}
            •
        {/if} -->
	{/each}
</div>
{#await data.schools}
	<Secondary>Loading...</Secondary>
{:then schools}
	{#each Object.entries(schools) as [school, schoolData] (school)}
		<div class="mt-4">
			<Heading tag="h3" id={school}>{school}</Heading>
			<ul>
				{#each Object.keys(schoolData.rankings) as result (result)}
					<li>
						<A href={`/results/${result}`}
							>{schoolData.rankings[result].title} (Div. {result.at(-1)?.toUpperCase()})</A
						> — {schoolData.rankings[result].ranks
							.map((rank: number) => ordinalize(rank))
							.join(', ')}
					</li>
				{/each}
			</ul>
		</div>
	{/each}
{/await}

<!-- <div class="mt-4">
		<Heading tag="h3" id={school}>{school}</Heading>
		{#await data.schools[school]}
			<P>Loading...</P>
		{:then schoolData}
			<ul>
				{#each Object.keys(schoolData.rankings) as result}
					<li>
						<A href={`/results/${result}`}
							>{schoolData.rankings[result].title} (Div. {result.at(-1)?.toUpperCase()})</A
						> — {schoolData.rankings[result].ranks
							.map((rank: number) => ordinalize(rank))
							.join(', ')}
					</li>
				{/each}
			</ul>
		{/await}
	</div> -->
