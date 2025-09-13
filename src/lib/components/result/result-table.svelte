<script lang="ts">
	import { formatSchool, fullTeamName } from '$lib/helpers/schools';
	import {
		Accordion,
		AccordionItem,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Modal,
		P,
		Heading,
		Badge,
		Tooltip,
		Secondary
	} from 'flowbite-svelte';
	import type Interpreter from 'sciolyff/interpreter';
	import { ordinalize } from '$lib/helpers/misc';
	import { bidsSupTag, bidsSupTagNote, placingNotes, supTag } from '$lib/helpers/tournaments';
	import TrialBadge from './trial-badge.svelte';
	import TrialedBadge from './trialed-badge.svelte';

	const { interpreter } = $props<{ interpreter: Interpreter }>();

	const tournament = interpreter.tournament;
	const events = tournament.events;
	const teams = tournament.teams;
	// const tracks = tournament.tracks;
	// const placings = tournament.placings;
	// const penalties = interpreter.penalties;

	let modalOpen = $state(false);
	let modalTeam = $state(teams[0]);

	function openModal(team) {
		modalOpen = true;
		modalTeam = team;
	}
</script>

<Table>
	<TableHead class="bg-background dark:bg-background-dark align-bottom">
		<TableHeadCell class="p-2 text-right">#</TableHeadCell>
		<TableHeadCell class="p-2">Team</TableHeadCell>
		<TableHeadCell class="p-2 text-center">Overall</TableHeadCell>
		<TableHeadCell class="p-2 text-center">Total</TableHeadCell>
		{#if events}
			{#each events as event (event.name)}
				<!-- TODO: fix text positioning... -->
				<TableHeadCell
					class="p-2 text-left align-bottom text-nowrap"
					style="writing-mode: sideways-lr;"
					>{event.name}{#if event.trial}
						<Badge class="mb-2 align-middle" color="blue">T</Badge>
						<Tooltip class="font-medium normal-case" style="writing-mode: horizontal-tb;"
							>Trial Event</Tooltip
						>
					{:else if event.trialed}
						<Badge class="mb-2 align-middle" color="red">Td</Badge>
						<Tooltip class="font-medium normal-case" style="writing-mode: horizontal-tb;"
							>Trialed Event</Tooltip
						>
					{/if}</TableHeadCell
				>
			{/each}
		{/if}
		<TableHeadCell
			class="p-2 text-left align-bottom text-nowrap"
			style="writing-mode: sideways-lr; vertical-align: bottom;">Team Penalties</TableHeadCell
		>
	</TableHead>
	<TableBody>
		{#if teams}
			{#each teams as team (team.number)}
				<TableBodyRow class="border-b-0">
					<TableBodyCell class="clickable p-2 text-right" onclick={() => openModal(team)}
						>{team.number}</TableBodyCell
					>
					<TableBodyCell class="clickable p-2" onclick={() => openModal(team)}
						>{formatSchool(team)}{#if team.suffix}{` ${team.suffix}`}{/if}
						<small>({team.city ? team.city + ', ' + team.state : team.state})</small></TableBodyCell
					>
					<TableBodyCell
						class="p-2 text-center{interpreter.tournament.trophies !== undefined &&
						team.rank !== undefined &&
						team.rank <= interpreter.tournament.trophies
							? ` place-${team.rank}`
							: // eslint-disable-next-line svelte/no-at-html-tags
								''}">{team.rank}{@html bidsSupTag(team)}</TableBodyCell
					>
					<TableBodyCell class="p-2 text-center">{team.points}</TableBodyCell>
					{#if events}
						{#each events as event (event.name)}
							<TableBodyCell
								class="p-2 text-center{interpreter.tournament.medals !== undefined &&
								team.placingFor(event)?.isolatedPoints !== undefined &&
								team.placingFor(event)?.isolatedPoints <= interpreter.tournament.medals
									? ` place-${team.placingFor(event)?.isolatedPoints}`
									: ''}"
							>
								<!-- eslint-disable-next-line svelte/no-at-html-tags -->
								{team.placingFor(event)?.isolatedPoints}{@html supTag(
									team.placingFor(event)
								)}</TableBodyCell
							>
						{/each}
					{/if}
					{@const teamPenalties =
						team.penalties === undefined
							? 0
							: team.penalties.map((penalty) => penalty.points).reduce((a, b) => a + b, 0)}
					<TableBodyCell class="p-2 text-center">{teamPenalties}</TableBodyCell>
				</TableBodyRow>
			{/each}
		{/if}
	</TableBody>
</Table>

<Modal title={`Details for Team ${modalTeam.number}`} form bind:open={modalOpen}>
	<div>
		<Heading tag="h4" class="mb-4">Summary</Heading>
		<P
			>{fullTeamName(modalTeam)} placed {ordinalize(modalTeam.rank)} overall with a score of {modalTeam.points}
			points.</P
		>
	</div>
	<Accordion flush>
		<AccordionItem>
			{#snippet header()}Team Graphs{/snippet}
			<p class="mb-2 text-gray-500 dark:text-gray-400">
				Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illo ab necessitatibus sint
				explicabo ...
			</p>
			<p class="text-gray-500 dark:text-gray-400">
				Check out this guide to learn how to <a
					href="/"
					target="_blank"
					rel="noreferrer"
					class="text-blue-600 hover:underline dark:text-blue-500">get started</a
				>
				and start developing websites even faster with components on top of Tailwind CSS.
			</p>
		</AccordionItem>
		<AccordionItem open>
			{#snippet header()}Event Details{/snippet}
			<Table>
				<TableHead class="bg-background dark:bg-background-dark align-bottom">
					<TableHeadCell class="p-2">Event</TableHeadCell>
					<TableHeadCell class="p-2 text-center">Points</TableHeadCell>
					<TableHeadCell class="p-2 text-center">Place</TableHeadCell>
					<TableHeadCell class="p-2">Notes</TableHeadCell>
				</TableHead>
				<TableBody>
					{#each events as event (event.name)}
						{@const suffix =
							interpreter.tournament.medals !== undefined &&
							modalTeam.placingFor(event)?.isolatedPoints !== undefined &&
							modalTeam.placingFor(event)?.isolatedPoints <= interpreter.tournament.medals
								? ` place-${modalTeam.placingFor(event)?.isolatedPoints}`
								: ''}
						<TableBodyRow class="border-b-0">
							<TableBodyCell class={`p-2${suffix}`}
								>{event.name}{#if event.trial}
									<TrialBadge />
								{:else if event.trialed}
									<TrialedBadge />
								{/if}</TableBodyCell
							>
							<TableBodyCell class={`p-2 text-center${suffix}`}
								>{modalTeam.placingFor(event)?.isolatedPoints ?? 'N/A'}</TableBodyCell
							>
							<TableBodyCell class={`p-2 text-center${suffix}`}
								>{modalTeam.placingFor(event)?.place ?? 'N/A'}</TableBodyCell
							>
							<TableBodyCell class={`p-2${suffix}`}>
								{#if modalTeam.placingFor(event)}
									{placingNotes(modalTeam.placingFor(event))}
								{/if}
							</TableBodyCell>
						</TableBodyRow>
					{/each}
				</TableBody>
			</Table>
		</AccordionItem>
	</Accordion>
	<div>
		<Heading tag="h4" class="mb-4">Other Results</Heading>
		<a
			href={`/results/schools/${fullTeamName(modalTeam).at(0)?.toLowerCase()}#${fullTeamName(modalTeam)}`}
		>
			View results for {fullTeamName(modalTeam)} in other tournaments
		</a>
	</div>
</Modal>
<footer>
	{#if tournament.ties || tournament.exemptPlacings || tournament.worstPlacingsDropped || tournament.bids !== 0}
		{#if tournament.bids !== 0}
			<Secondary>
				<sup>✧</sup>{bidsSupTagNote(tournament)}
			</Secondary>
		{/if}
		{#if tournament.exemptPlacings || tournament.worstPlacingsDropped}
			<Secondary>
				<sup>◊</sup>Result was not counted as part of total score
			</Secondary>
		{/if}
		{#if tournament.tiesOutsideOfMaximumPlaces}
			<Secondary>
				<sup>*</sup>Tied with another team
			</Secondary>
		{/if}
	{/if}
</footer>
