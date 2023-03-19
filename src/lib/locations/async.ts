import { supabase } from "$lib/global/supabase";

const table = "Location";

export async function addLocation(locationData: object) {
  const { data } = await supabase.from(table).upsert(locationData);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return data["id"];
}