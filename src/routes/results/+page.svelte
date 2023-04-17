<script lang="ts">
	import type { PageServerData } from './$types';
	import Card from './Card.svelte';
	export let data: PageServerData;
</script>

<div class="results-index">
	{#each data.allResults as result}
		{#if result.duosmiumId == '2019-06-01_nationals_c'}
			<Card data={result} />
		{/if}
	{/each}
</div>
