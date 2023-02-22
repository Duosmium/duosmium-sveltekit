<script lang="ts">
	import type { PageServerData } from './$types';
	import { getInterpreter } from '$lib/interpreter';
	export let data: PageServerData;
	export const interpreter = getInterpreter(data.yaml)
</script>

<table>
	<tr>
		<th>Number</th>
		<th>Team</th>
		<th>Rank</th>
		<th>Score</th>
		{#each interpreter.events as event}
			<th>{event.name}</th>
		{/each}
	</tr>
	{#each interpreter.teams as team}
		<tr>
			<td>{team.number}</td>
			<td>{team.school}{team.suffix ? " " + team.suffix : ""} from {team.city ? team.city + ", ": ""}{team.state}</td>
			<td>{team.rank}</td>
			<td>{team.points}</td>
			{#each team.placings as placing}
				<td>{(placing.unknown && !placing.pointsLimitedByMaximumPlace) ? '??' : placing.isolatedPoints}</td>
			{/each}
		</tr>
	{/each}
</table>


