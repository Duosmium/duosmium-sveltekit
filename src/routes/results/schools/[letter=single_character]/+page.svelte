<script lang="ts">
	import type { PageServerData } from './$types';
	import ResultSchool from '$lib/components/results/result-school.svelte';
	import AllSchoolLetters from '$lib/components/results/all-school-letters.svelte';
	export let data: PageServerData;
	$: allData = data.allData;
	$: tournamentNames = data.tournamentNames;
	$: letters = data.letters;
</script>

<div class="container">
	<h1 class="text-center tracking-tight font-bold text-4xl pb-2 pt-12">All Results by School</h1>
	<AllSchoolLetters {letters} />
	<div>
		{#each allData.entries() as s}
			<ResultSchool name={s[0]} ranks={s[1]} {tournamentNames} />
		{/each}
	</div>
</div>
