<script lang="ts">
	import type { PageProps } from './$types';
	import Interpreter from 'sciolyff/interpreter';
	import ResultTable from '$lib/components/result/result-table.svelte';

	let { data }: PageProps = $props();
	import { Heading, Secondary } from 'flowbite-svelte';
	import OfficialBadge from '$lib/components/common/official-badge.svelte';
	import PreliminaryBadge from '$lib/components/common/preliminary-badge.svelte';

	const result = data.resultData.data;
	const interpreter = new Interpreter(result);
</script>

<svelte:head>
	<title>{data.resultData.title} (Div. {interpreter.tournament.division}) - Duosmium Results</title>
</svelte:head>

<Heading tag="h1" class="mb-2 text-center"
	>{data.resultData.title} (Div. {interpreter.tournament.division})</Heading
>
<Heading tag="h2" class="mb-4 text-center"
	><Secondary>{data.resultData.dateString} @ {data.resultData.location}</Secondary></Heading
>
<div class="flex flex-row justify-center space-x-1">
	{#if data.resultData.official}
		<OfficialBadge />
	{/if}
	{#if data.resultData.preliminary}
		<PreliminaryBadge />
	{/if}
</div>
<ResultTable {interpreter} />
