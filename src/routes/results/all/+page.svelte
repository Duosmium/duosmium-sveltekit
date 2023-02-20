<script lang="ts">
	import type { PageServerData } from './$types';
	export let data: PageServerData;
</script>

<h1>All Tournaments</h1>

This page lists all tournaments on the site in reverse chronological order.

<ul>
	{#each data.allResults as result}
		<li>
			<h3>{result.name}</h3>
			<p>{result.date}</p>
		</li>
	{/each}
</ul>