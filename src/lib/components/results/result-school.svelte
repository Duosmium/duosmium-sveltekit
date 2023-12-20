<script lang="ts">
	export let name: string;
	export let ranks: Map<string, string[]>;
	export let tournamentNames: Map<string, string>;
</script>

<div class="py-2">
	<h2 class="font-bold text-2xl tracking-tight text-left pb-1" id={name}>
		{name}
	</h2>
	<hr />
	<ul class="list-disc pt-1">
		{#each ranks as value}
			<li class="list-inside">
				<a href={`/results/${value[0]}`} class="text-sky-700 dark:text-sky-500 hover:underline">
					{tournamentNames.get(value[0])}
				</a>{' '}
				— {value[1].join(', ')}
			</li>
		{/each}
	</ul>
</div>
