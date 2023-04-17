<script lang="ts">
	import { fullTournamentTitle } from '$lib/results/helpers';
	import { getInterpreter } from '$lib/results/interpreter';
	import { getCompleteResult } from '$lib/results/async';
	import type { Interpreter } from 'sciolyff/dist/src/interpreter/types';
	import type { Result } from '@prisma/client';
	export let data: Result;
	// let resultPromise = getCompleteResult(data.duosmiumId);
	let interpreter: Interpreter | null = null;
	function setInterpreter(data: {}): Interpreter {
		if (interpreter === null) {
			interpreter = getInterpreter(data);
		}
		if (interpreter === null) {
			// just to appease type checking
			return getInterpreter('');
		} else {
			return interpreter;
		}
	}
</script>

<!-- TODO: why is this never getting out of the await section? -->
{#await getCompleteResult(data.duosmiumId)}
	<p>{data.duosmiumId}</p>
{:then result}
	<div class="mdc-card">
		<div class="mdc-card__primary-action">
			<h2 class="card-title">
				{fullTournamentTitle(setInterpreter(result).tournament)}
			</h2>
			<div class="mdc-card__media mdc-card__media--square">
				<div class="mdc-card__media-content" style="background-image: url('{data.logo}');">
					{fullTournamentTitle(setInterpreter(result).tournament)}
				</div>
			</div>
			<div class="mdc-card__ripple" />
		</div>
		<div class="mdc-card__actions">
			<div class="mdc-card__action-buttons">
				<button class="mdc-button mdc-card__action mdc-card__action--button">
					<div class="mdc-button__ripple" />
					<span class="mdc-button__label">Summary</span>
				</button>
				<button class="mdc-button mdc-card__action mdc-card__action--button">
					<div class="mdc-button__ripple" />
					<span class="mdc-button__label">Full Results</span>
				</button>
				<button class="mdc-button mdc-button--unelevated">
					<div class="mdc-button__ripple" />
					<span class="mdc-button__label"
						>{setInterpreter(result).tournament.nonExhibitionTeamsCount} Teams</span
					>
				</button>
			</div>
		</div>
	</div>
{:catch}
	<p>halp</p>
{/await}
