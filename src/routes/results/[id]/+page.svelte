<script lang="ts">
  import type { PageServerData } from './$types';
  import Interpreter from "sciolyff/interpreter";
  import { dateString, formatSchool, fullTournamentTitle, teamLocation } from "$lib/results/helpers";

  export let data: PageServerData;
  export let result = data["result"];
  export let interpreter: Interpreter = new Interpreter(result);


  export function penaltyPoints(team): number {
    let total = 0;
    team.penalties?.forEach((x) => (total += x.points));
    return total;
  }
</script>
<link rel="stylesheet" href="/css/results-view.css" />
<div class="results-wrapper">
  <div class="results-header-container">
    <div class="results-header">
      <div class="info">
        <h1>{fullTournamentTitle(interpreter.tournament)}</h1>
        <p class="date">{dateString(interpreter)}</p>
        <p class="location">@ {interpreter.tournament.location}</p>
      </div>
      <div class="actions">
        <a href="/results" class="back-button">
          <svg viewBox="0 0 24 24">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path>
          </svg>
        </a>
        <button type="button" class="save-button">
          <svg viewBox="0 0 24 24">
            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"></path>
          </svg>
        </button>
        <button type="button" class="print-button">
          <svg viewBox="0 0 24 24">
            <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"></path>
          </svg>
        </button>
        <button type="button" class="share-button">
          <svg viewBox="0 0 24 24">
            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"></path>
          </svg>
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
      <th class="event-points-header"></th>
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
          {formatSchool(value)}
          {value.suffix ? ' ' + value.suffix : ''}
          <small class="team-location">{teamLocation(value)}</small>
        </td>
        <td class="event-points"></td>
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
