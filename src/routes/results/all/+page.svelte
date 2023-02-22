<script lang="ts">
	import type { PageServerData } from './$types';
	export let data: PageServerData;
</script>

<h1>All Tournaments</h1>

This page lists all tournaments on the site in reverse chronological order.

<ul>
	{#each data.names as name, i}
	<li>
		<a href='/results/{data.ids[i]}'>{name}</a>
	</li>
	{/each}
</ul>