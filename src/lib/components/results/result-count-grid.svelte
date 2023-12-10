<script lang="ts">
	import ResultCount from './result-count.svelte';
	export let countsByLevel: object;
</script>

<div>
	<h3 class="font-bold text-2xl tracking-tight text-center py-2">Archive Totals</h3>
	<dl class="grid grid-cols-2 gap-x-4">
		{#each Object.entries(countsByLevel) as [level, num]}
			<ResultCount {num} {level} />
		{/each}
	</dl>
</div>
