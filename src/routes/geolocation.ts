import { Request } from "../structures/network/Request";
import { School } from "../structures/School";
import type { RawPronoteGeolocation } from "../types/geolocation";
import { GEOLOCATION_SEARCH_SCHOOLS } from "./endpoints";

export async function searchSchoolsWithGeo(
  lat: number,
  lon: number,
  limit = 20
): Promise<School[]> {
  if (lat === undefined || lon === undefined || isNaN(lat) || isNaN(lon)) {
    throw new Error("You must specify a valid latitude and longitude to fetch nearby schools.");
  }

  const request = new Request()
    .setHeaders({
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    })
    .setMethod("POST")
    .setBody("data=" + encodeURIComponent(JSON.stringify({
      nomFonction: "geoLoc",
      lat,
      long:        lon
    })))
    .setEndpoint(GEOLOCATION_SEARCH_SCHOOLS());

  const response = await request.send<RawPronoteGeolocation[]>();
  return response.data.slice(0, limit).map((item) => new School(
    item.url, item.nomEtab, Number(item.lat), Number(item.long), item.cp
  ));
}
