// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type Tournament from 'sciolyff/dist/src/interpreter/tournament';
import { supabase } from "$lib/global/supabase";
import { addLocation } from "$lib/locations/async";

const table = "Tournament";

export async function addTournament(tournament: Tournament, resultID: string) {
  const locationID = await addLocation({ name: tournament.location, state: tournament.state })
  const { data } = await supabase.from(table).upsert(createInputData(tournament, resultID, locationID));
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return data["id"];
}

function createInputData(tournament: Tournament, resultID: string, locationID: number) {
  return { resultId: resultID, locationId: locationID };
}