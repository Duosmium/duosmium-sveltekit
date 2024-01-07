<script lang="ts">
	import { ordinalize } from '$lib/global/helpers';

	export let name: string;
	export let ranks: object;
	export let tournamentNames: object;
</script>

<div class="py-2">
	<h2 class="font-bold text-2xl tracking-tight text-left pb-1" id={name}>
		{name}
	</h2>
	<hr />
	<ul class="list-disc pt-1">
		{#each Object.keys(ranks) as value}
			<li class="list-inside">
				<a href={`/results/${value}`} class="text-sky-700 dark:text-sky-500 hover:underline">
					{tournamentNames[value]}
				</a>{' '}
				— {ranks[value].map((n) => ordinalize(n)).join(', ')}
			</li>
		{/each}
	</ul>
</div>
