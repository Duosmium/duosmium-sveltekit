<script lang="ts">
	import type { PageServerData } from './$types';
	import ResultDataTable from '$lib/components/results/result-data-table.svelte';

	export let data: PageServerData;
	$: res = data.res;
	$: footnotes = data.footnotes;
</script>

<div class="container mx-auto overflow-scroll">
	<h1 class="text-3xl tracking-tight font-bold text-center pb-4 pt-12">
		{res.title}
	</h1>
	<p class="text-lg tracking-tight text-muted-foreground text-center">
		{res.date}
	</p>
	<p class="text-lg tracking-tight text-muted-foreground text-center pb-4">
		@ {res.tournament.location}
	</p>
	<ResultDataTable
		teamData={data.teamData}
		eventData={data.eventData}
		trophies={data.trophies}
		tableData={data.tableData}
	/>
	<div class="pt-2">
		{#if footnotes.bids}
			<p class="text-sm text-muted-foreground">
				<sup>✧</sup>
				{footnotes.bidsMessage}
			</p>
		{/if}
		{#if footnotes.placings}
			<p class="text-sm text-muted-foreground">
				<sup>✧</sup>
				{footnotes.placingsMessage}
			</p>
		{/if}
		{#if footnotes.ties}
			<p class="text-sm text-muted-foreground">
				<sup>✧</sup>
				{footnotes.tiesMessage}
			</p>
		{/if}
	</div>
</div>
