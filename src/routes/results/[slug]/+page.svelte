<script lang="ts">
	import type { PageServerData } from './$types';
	import { getInterpreter } from '$lib/interpreter';

	export let data: PageServerData;
	export const interpreter = getInterpreter(data.yaml)
</script>

<!DOCTYPE html>
<html lang='en'>
<head>
	<meta charset="utf-8">
	<meta http-equiv="x-ua-compatible" content="ie=edge">
	<meta name="viewport"
				content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<title>{interpreter.tournament.year} {data.shortTitle} {"(Div. " + interpreter.tournament.division + ")"}</title>
	<meta property="og:title" content="Duosmium"/>
	<meta name="twitter:title" content="Duosmium"/>
	<meta name="robots" content="index, follow"/>
	<meta name="googlebot" content="index, follow"/>
	<meta property="og:locale" content="en_US"/>
	<meta property="og:type" content="website"/>
	<meta name="twitter:dnt" content="on"/>
	<meta name="pinterest" content="nopin"/>
	<meta name="format-detection" content="telephone=no"/>
	<meta name="skype_toolbar" content="skype_toolbar_parser_compatible"/>
	<link href="/images/favicon.png" rel="icon" type="image/png"/>
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Roboto+Mono&family=Roboto+Slab&family=Roboto:ital,wght@0,300;0,400;0,500;0,700;1,400&display=swap" rel="stylesheet">
</head>
<body>
<h1>{interpreter.tournament.year} {data.title} {"(Div. " + interpreter.tournament.division + ")"}</h1>
<p>{data.dateString} @ {interpreter.tournament.location}</p>
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
</body>
</html>


