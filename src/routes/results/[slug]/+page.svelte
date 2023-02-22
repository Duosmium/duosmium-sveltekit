<script lang="ts">
	import type { PageServerData } from './$types';
	import { getInterpreter } from '$lib/interpreter';

	export let data: PageServerData;
	export const interpreter = getInterpreter(data.yaml)
</script>

<h1>{interpreter.tournament.year} {data.title} {"(Div. " + interpreter.tournament.division + ")"}</h1>

<table>
	<tr>
		<th>Number</th>
		<th>Team</th>
		<th>Rank</th>
		<th>Score</th>
		{#each interpreter.events as event}
			<th>{event.name}
				{#if event.trial}
					<span style='font-size: 0.75rem'>Trial</span>
				{/if}
				{#if event.trialed}
					<span style='font-size: 0.75rem'>Trial</span>
				{/if}
			</th>
		{/each}
	</tr>
	{#each interpreter.teams as team}
		<tr>
			<td>{team.number}</td>
			<td>{team.school}{team.suffix ? " " + team.suffix : ""}
			<span style='font-size: 0.75rem'>{team.city ? team.city + ", ": ""}{team.state}</span></td>
			<td>{team.rank}</td>
			<td>{team.points}</td>
			{#each team.placings as placing}
				<td>{(placing.unknown && !placing.pointsLimitedByMaximumPlace) ? '??' : placing.isolatedPoints}</td>
			{/each}
		</tr>
	{/each}
</table>


