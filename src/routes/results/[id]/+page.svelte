<!--suppress CheckEmptyScriptTag -->
<script lang="ts">
	import type { PageServerData } from './$types';
	import Interpreter from 'sciolyff/interpreter';
	import {
		dateString,
		formatSchool,
		fullTournamentTitle,
		teamLocation
	} from '$lib/results/helpers';

	export let data: PageServerData;
	export let interpreter: Interpreter = new Interpreter(data['result']);

	export function penaltyPoints(team): number {
		let total = 0;
		team.penalties?.forEach((x) => (total += x.points));
		return total;
	}
</script>

<link rel="stylesheet" href="/css/results-view.css" />
<div class="results-wrapper">
	<div class="results-header-container" style="background-color: {data['color']};">
		<div class="results-header">
			<div class="info">
				<h1>{fullTournamentTitle(interpreter.tournament)}</h1>
				<p class="date">{dateString(interpreter)}</p>
				<p class="location">@ {interpreter.tournament.location}</p>
			</div>
			<div class="actions">
				<a href="/results" class="back-button">
					<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="48"
						><path
							d="M480 898.63 157.37 576 480 253.37l47.978 47.739-240.586 240.826H802.63v68.13H287.392l240.586 240.587L480 898.63Z"
						/></svg
					>
				</a>
				<button type="button" class="tune-button">
					<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="48"
						><path
							d="M425.565 941.5V711h65.5v83h353v65.5h-353v82h-65.5Zm-309.63-82V794h252.5v65.5h-252.5Zm187-168.87v-82h-187v-65.26h187v-84h65.5v231.26h-65.5Zm122.63-82v-65.26h418.5v65.26h-418.5Zm166-167.63V210.5h65.5v82h187V358h-187v83h-65.5Zm-475.63-83v-65.5h418.5V358h-418.5Z"
						/></svg
					>
				</button>
				<button type="button" class="print-button">
					<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="48"
						><path
							d="M724.218 371.782H236.022v-162h488.196v162Zm10.836 198.87q13.316 0 23.033-9.672 9.717-9.673 9.717-22.958 0-13.196-9.672-23.033-9.673-9.837-23.078-9.837-13.315 0-23.032 9.837-9.718 9.837-9.718 23.033 0 13.196 9.718 22.913 9.717 9.717 23.032 9.717Zm-79.206 307.5v-178.13H304.152v178.13h351.696Zm68.37 66.935H236.022V765.022h-162V514q0-47.346 32.104-79.782t79.396-32.436h588.956q47.489 0 79.615 32.436 32.125 32.436 32.125 79.782v251.022h-162v180.065Z"
						/></svg
					>
				</button>
				<button type="button" class="share-button">
					<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="48"
						><path
							d="M726.986 981.5q-49.638 0-84.562-35.03-34.924-35.031-34.924-84.708 0-6.751 1.5-16.639 1.5-9.887 4.5-18.08L319.348 656.065q-15.718 17.718-38.518 28.576-22.8 10.859-46.723 10.859-49.836 0-84.722-34.938-34.885-34.938-34.885-84.576 0-49.638 34.885-84.562 34.886-34.924 84.722-34.924 23.923 0 45.723 9.359 21.8 9.358 39.518 27.076L613.5 323.957q-3-7.311-4.5-16.514-1.5-9.204-1.5-17.535 0-49.54 34.938-84.474 34.938-34.934 84.576-34.934 49.638 0 84.562 34.938t34.924 84.576q0 49.638-34.885 84.562-34.886 34.924-84.722 34.924-24.277 0-46.419-7.612-22.141-7.612-37.583-25.344L348.5 539.043q2.239 8.24 3.62 19.104 1.38 10.864 1.38 18.094 0 7.231-1.38 15.234-1.381 8.003-3.62 16.482l294.391 166.499q15.442-14.732 36.26-23.344 20.819-8.612 47.742-8.612 49.836 0 84.722 34.938 34.885 34.938 34.885 84.576 0 49.638-34.938 84.562T726.986 981.5Z"
						/></svg
					>
				</button>
			</div>
		</div>
	</div>
	<table class="results-table">
		<colgroup class="team-info">
			<col />
			<col />
			<col />
			<col />
			<col />
		</colgroup>
		<colgroup class="event-info">
			{#each interpreter.events as event}
				<col />
			{/each}
		</colgroup>
		<thead class="result-table-header">
			<tr>
				<th class="number-header">#</th>
				<th class="team-header">Team</th>
				<th class="event-points-header" />
				<th class="rank-header">
					<div>Overall</div>
				</th>
				<th class="team-points-header">Total</th>
				{#each interpreter.events as event}
					<th class="event-header">
						<span class="updated-event-dot" style="display: none;">
							•{' '}
						</span>
						{event.name}
						{#if event.trial}
							<span class="badge badge-trial">
								<small>T</small>
							</span>
						{:else if event.trialed}
							<span class="badge badge-trialed">
								<small>Td</small>
							</span>
						{/if}
					</th>
				{/each}
				<th class="event-header">Team Penalties</th>
			</tr>
		</thead>
		<tbody class="result-table-body">
			{#each interpreter.teams as value}
				<tr class="team">
					<td class="team-number">{value.number}</td>
					<td class="team-name">
						{formatSchool(value)}{value.suffix ? ' ' + value.suffix : ''}<small
							class="team-location">{teamLocation(value)}</small
						>
					</td>
					<td class="event-points" />
					<td class="team-rank">{value.rank}</td>
					<td class="team-points">{value.points}</td>
					{#each value.placings as placing}
						<td class="team-placing">
							<div>{placing.isolatedPoints}</div>
						</td>
					{/each}
					<td class="team-penalty">
						{penaltyPoints(value).toString().padStart(2, '0')}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
