import type { PageServerLoad } from './$types';
import { getCompleteResult, getResult, resultExists } from "$lib/results/async";
import { error } from "@sveltejs/kit";
import type Interpreter from "sciolyff/interpreter";
import { getInterpreter } from "$lib/results/interpreter";
import {
  bidsSupTagNote,
  formatSchool,
  placingNotes, supTag,
  teamAttended,
  teamLocation
} from "$lib/results/helpers";
import { Placing, Team } from "sciolyff/interpreter";
import { ordinalize } from "$lib/global/helpers";

function className(orig: string) {
  return orig.toLowerCase().replaceAll(/\s+/g, '_').replaceAll(/\W/g, '');
}

function penaltyPoints(team: Team): number {
  let total = 0;
  team.penalties?.forEach((x) => (total += x.points));
  return total;
}

function processEventData(interpreter: Interpreter) {
  const output = [];
  for (const evt of interpreter.events) {
    if (evt.trial) {
      continue;
    }
    const data = {
      id: className(evt.name),
      name: evt.name,
      trial: evt.trial,
      trialed: evt.trialed,
      medals: evt.medals ?? interpreter.tournament.medals
    };
    output.push(data);
  }
  for (const evt of interpreter.events) {
    if (!evt.trial) {
      continue;
    }
    const data = {
      id: className(evt.name),
      name: evt.name,
      trial: evt.trial,
      trialed: evt.trialed,
      medals: evt.medals ?? interpreter.tournament.medals
    };
    output.push(data);
  }
  return output;
}

function processTeamData(interpreter: Interpreter) {
  const output = [];
  for (const tm of interpreter.teams) {
    const data = {
      number: tm.number,
      team: `${formatSchool(tm)}${tm.suffix ? ' ' + tm.suffix : ''}`,
      school: tm.school,
      suffix: tm.suffix,
      location: teamLocation(tm),
      disqualified: tm.disqualified,
      exhibition: tm.exhibition,
      attended: teamAttended(tm),
      earnedBid: tm.earnedBid,
      rank: tm.rank,
      points: tm.points,
      penalties: penaltyPoints(tm)
    };
    for (const evt of interpreter.events) {
      const pl = evt.placingFor(tm);
      // @ts-ignore
      data[className(evt.name)] = pl.isolatedPoints;
      // @ts-ignore
      data[`${className(evt.name)}-suptag`] = supTag(pl);
    }
    output.push(data);
  }
  return output;
}

function processPlacingData(interpreter: Interpreter, teamObj: Team) {
  const placingMap: Map<string, Map<string, string>> = new Map();
  for (const evt of interpreter.events) {
    const evtMap: Map<string, string> = new Map();
    const placing: Placing = evt.placingFor(teamObj);
    evtMap.set('points', placing.isolatedPoints.toString());
    evtMap.set('place', ordinalize(placing.place));
    evtMap.set('notes', placingNotes(placing));
    placingMap.set(evt.name, evtMap);
  }
  return placingMap;
}

function createTableData(placingData: Map<string, Map<string, string>>, eventData: object[]) {
  const tableData: {
    name: string;
    points: string;
    place: string;
    notes: string;
    medals: number;
  }[] = [];
  for (const evt of eventData) {
    // @ts-ignore
    const res: Map<string, string> = placingData.get(evt.name);
    const dataPoint: {
      name: string;
      points: string;
      place: string;
      notes: string;
      medals: number;
    } = {
      // @ts-ignore
      name: evt.name,
      // @ts-ignore
      points: res.get('points'),
      // @ts-ignore
      place: res.get('place'),
      // @ts-ignore
      notes: res.get('notes'),
      // @ts-ignore
      medals: evt.medals
    };
    tableData.push(dataPoint);
  }
  return tableData;
}

export const load: PageServerLoad = async ({params}) => {
  const duosmiumID = params.id;
  if (!(await resultExists(duosmiumID))) {
    throw error(404);
  }
  const rep = await getCompleteResult(duosmiumID);
  const res = await getResult(duosmiumID);
  const interpreter: Interpreter = getInterpreter(rep);
  const footnotes = {
    bids: false,
    bidsMessage: "",
    placings: false,
    placingsMessage: "",
    ties: false,
    tiesMessage: ""
  };
  if (interpreter.tournament.bids > 0) {
    footnotes.bids = true;
    footnotes.bidsMessage = bidsSupTagNote(interpreter.tournament);
  }
  if (interpreter.tournament.exemptPlacings || interpreter.tournament.worstPlacingsDropped) {
    footnotes.placings = true;
    footnotes.placingsMessage = "Result was not counted as part of total score";
  }
  if (interpreter.tournament.hasTiesOutsideOfMaximumPlaces) {
    footnotes.ties = true;
    footnotes.tiesMessage = "Tied with another team";
  }
  const eventData = processEventData(interpreter);
  const teamData = processTeamData(interpreter);
  const eventsByName = {};
  for (const e of interpreter.events) {
    // @ts-ignore
    eventsByName[e.name] = e;
  }
  const tableData: Map<
    number,
    { name: string; points: string; place: string; notes: string; medals: number }[]
  > = new Map();
  for (const tm of interpreter.teams) {
    const placingData = processPlacingData(interpreter, tm);
    tableData.set(tm.number, createTableData(placingData, eventData));
  }
  const placingsByTeam = {};
  for (const t of interpreter.teams) {
    const placings: number[] = [];
    for (const e of eventData) {
      // @ts-ignore
      placings.push(t.placingFor(eventsByName[e.name])?.isolatedPoints);
    }
    // @ts-ignore
    placingsByTeam[t.number] = placings;
  }
  return {
    rep: rep,
    res: res,
    footnotes: footnotes,
    teamData: teamData,
    eventData: eventData,
    trophies: interpreter.tournament.trophies,
    tableData: tableData
  }
}