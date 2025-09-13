<script lang="ts">
	import { Card, Button } from 'flowbite-svelte';
	import { ArrowRightOutline } from 'flowbite-svelte-icons';
	import OfficialBadge from '../common/official-badge.svelte';
	import PreliminaryBadge from '../common/preliminary-badge.svelte';
	import DivisionABadge from '../common/division-a-badge.svelte';
	import DivisionBBadge from '../common/division-b-badge.svelte';
	import DivisionCBadge from '../common/division-c-badge.svelte';

	export let result;
</script>

<Card class="basis-sm">
	<div class="m-6 flex grow flex-col">
		<div class="grow">
			<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
				{result.title}
				<div class="space-x-1">
					{#if result.duosmium_id.at(-1) === 'a'}
						<DivisionABadge />
					{:else if result.duosmium_id.at(-1) === 'b'}
						<DivisionBBadge />
					{:else if result.duosmium_id.at(-1) === 'c'}
						<DivisionCBadge />
					{/if}
					{#if result.official}
						<OfficialBadge />
					{:else if result.preliminary}
						<PreliminaryBadge />
					{/if}
				</div>
			</h5>
			<p class="mb-3 leading-tight font-normal text-gray-700 dark:text-gray-400">
				{result.date_string} @ {result.location}
			</p>
		</div>
		<Button href={`/results/${result.duosmium_id}`} class="w-40">
			Full Results <ArrowRightOutline class="ms-2 h-6 w-6 text-white" />
		</Button>
	</div>
</Card>
