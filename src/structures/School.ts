import { searchSchoolsWithGeo } from "../routes/geolocation";

export class School {
  constructor(
    public readonly url: string,
    public readonly name: string,
    public readonly lat: number,
    public readonly lon: number,
    public readonly postalCode: string
  ){}

  public static async locate(lat: number, lon: number, limit?: number): Promise<School[]> {
    return await searchSchoolsWithGeo(lat, lon, limit)
  }
}