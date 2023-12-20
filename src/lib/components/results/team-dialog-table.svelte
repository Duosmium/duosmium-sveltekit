<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	export let tableData: {
		name: string;
		points: string;
		place: string;
		notes: string;
		medals: number;
	}[];
</script>

<Table.Root>
	<Table.Header>
		<Table.RowWithoutHover>
			<Table.Head class="h-8 py-2">Event</Table.Head>
			<Table.Head class="h-8 py-2 text-center">Points</Table.Head>
			<Table.Head class="h-8 py-2 text-center">Place</Table.Head>
			<Table.Head class="h-8 py-2">Notes</Table.Head>
		</Table.RowWithoutHover>
	</Table.Header>
	<Table.Body>
		{#each tableData as t}
			<Table.RowWithoutHover
				class={Number(t.place.replace(/st|nd|rd|th/, '')) <= t.medals
					? `place-${Number(t.place.replace(/st|nd|rd|th/, ''))}`
					: ''}
			>
				<Table.Cell class="font-medium px-4 py-2">{t.name}</Table.Cell>
				<Table.Cell class="px-4 py-2 text-center">{t.points}</Table.Cell>
				<Table.Cell class="px-4 py-2 text-center"
					>{t.place.replace('undefinedth', 'n/a')}</Table.Cell
				>
				<Table.Cell class="px-4 py-2">{t.notes}</Table.Cell>
			</Table.RowWithoutHover>
		{/each}
	</Table.Body>
</Table.Root>
