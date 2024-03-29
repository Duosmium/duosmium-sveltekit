<script lang="ts">
	import { createTable, Render, Subscribe } from 'svelte-headless-table';
	import { addSortBy } from 'svelte-headless-table/plugins';
	import { readable } from 'svelte/store';
	import * as Table from '$lib/components/ui/table';
	import TrialBadge from '$lib/components/results/trial-badge.svelte';
	import TrialedBadge from '$lib/components/results/trialed-badge.svelte';
	import TeamDialog from '$lib/components/results/team-dialog.svelte';
	export let teamData;
	export let eventData;
	export let trophies;
	export let tableData;

	const table = createTable(readable(teamData), {
		sort: addSortBy()
	});
	const colList = [
		table.column({
			accessor: 'number',
			header: '#'
		}),
		table.column({
			accessor: 'team',
			header: 'Team'
		}),
		table.column({
			accessor: 'rank',
			header: 'Rank'
		}),
		table.column({
			accessor: 'points',
			header: 'Points'
		})
	];
	for (const evt of eventData) {
		colList.push(
			table.column({
				accessor: evt.id,
				header: evt.name
			})
		);
	}
	colList.push(
		table.column({
			accessor: 'penalties',
			header: 'Penalties',
			cell: ({ value }) => {
				return value.toString().padStart(2, '0');
			}
		})
	);
	const columns = table.createColumns(colList);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs } = table.createViewModel(columns);

	const eventMap = new Map();
	for (const evt of eventData) {
		eventMap.set(evt.id, evt);
	}
	const teamMap = new Map();
	for (const tm of teamData) {
		teamMap.set(tm.number, tm);
	}
</script>

<div>
	<Table.Root {...$tableAttrs} class="text-center">
		<Table.Header>
			{#each $headerRows as headerRow}
				<Subscribe rowAttrs={headerRow.attrs()}>
					<Table.Row>
						{#each headerRow.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
								<Table.Head {...attrs} class="align-bottom hover:cursor-pointer px-0 py-0">
									<!--        TODO: A11y          -->
									{#if cell.id === 'number'}
										<div on:click={props.sort.toggle} class="text-right px-2">
											<Render of={cell.render()} />
										</div>
									{:else if cell.id === 'team'}
										<div on:click={props.sort.toggle} class="text-left px-2">
											<Render of={cell.render()} />
										</div>
									{:else if cell.id === 'rank'}
										<div on:click={props.sort.toggle} class="text-center px-2">
											<Render of={cell.render()} />
										</div>
									{:else if cell.id === 'points'}
										<div on:click={props.sort.toggle} class="text-center px-2">
											<Render of={cell.render()} />
										</div>
									{:else if cell.id === 'penalties'}
										<div on:click={props.sort.toggle} class="flex justify-center px-2">
											<div class="text-left whitespace-nowrap sideways py-1">
												<Render of={cell.render()} />
											</div>
										</div>
									{:else}
										<div on:click={props.sort.toggle} class="flex justify-center px-2">
											<div class="text-left whitespace-nowrap sideways py-1">
												<Render of={cell.render()} />
												{#if eventMap.get(cell.id).trial}
													<TrialBadge class="mt-1 py-2.5 px-0.5" />
												{/if}
												{#if eventMap.get(cell.id).trialed}
													<TrialedBadge class="mt-1 py-2.5 px-0.5" />
												{/if}
											</div>
										</div>
									{/if}
								</Table.Head>
							</Subscribe>
						{/each}
					</Table.Row>
				</Subscribe>
			{/each}
		</Table.Header>
		<Table.Body {...$tableBodyAttrs}>
			{#each $pageRows as row (row.id)}
				<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
					<Table.Row {...rowAttrs}>
						{#each row.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs>
								{#if cell.id === 'number'}
									<Table.Cell
										{...attrs}
										class="py-0 text-right text-muted-foreground px-2 h-8 leading-8 w-0"
									>
										<Render of={cell.render()} />
									</Table.Cell>
								{:else if cell.id === 'team'}
									<Table.Cell
										{...attrs}
										class="py-0 whitespace-nowrap hover:cursor-pointer hover:underline px-2 h-8 leading-8 w-0"
									>
										<TeamDialog
											teamNumber={row.cells[0].value}
											teamData={teamMap.get(row.cells[0].value)}
											tableData={tableData.get(row.cells[0].value)}
										>
											<div class="text-left">
												<Render of={cell.render()} />
												<span class="text-xs text-muted-foreground"
													>({teamMap.get(row.cells[0].value).location})</span
												>
											</div>
										</TeamDialog>
									</Table.Cell>
								{:else if cell.id === 'rank'}
									{#if cell.value <= trophies}
										<Table.Cell {...attrs} class="px-0 py-0 h-8 leading-8 w-0 place-{cell.value}"
											><Render of={cell.render()} /></Table.Cell
										>
									{:else}
										<Table.Cell {...attrs} class="px-0 py-0 h-8 leading-8 w-0"
											><Render of={cell.render()} /></Table.Cell
										>
									{/if}
								{:else if cell.id === 'points'}
									<Table.Cell {...attrs} class="px-0 py-0 h-8 leading-8 w-0"
										><Render of={cell.render()} /></Table.Cell
									>
								{:else if cell.id === 'penalties'}
									<Table.Cell
										{...attrs}
										class="px-0 py-0 text-center text-muted-foreground h-8 leading-8 w-8"
										><Render of={cell.render()} /></Table.Cell
									>
								{:else if cell.value <= eventMap.get(cell.id).medals}
									<Table.Cell
										{...attrs}
										class="px-0 py-0 text-center place-{cell.value} h-8 leading-8 w-8"
										><Render of={cell.render()} /></Table.Cell
									>
								{:else}
									<Table.Cell {...attrs} class="px-0 py-0 text-center h-8 leading-8 w-8"
										><Render of={cell.render()} /></Table.Cell
									>
								{/if}
							</Subscribe>
						{/each}
					</Table.Row>
				</Subscribe>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
