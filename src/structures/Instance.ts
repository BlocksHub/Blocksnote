import { NOTSpace, type CAS, type Workspace } from "../types/authentication";
import { type InfoMobileResponse } from "../types/responses/authentication";
import { Request } from "./network/Request";

export class Instance {
  constructor(
    public source: string,
    public workspaces: Workspace[] = [],
    public version: number[] = [],
    public cas?: CAS
  ) {}

  public static async createFromURL(source: string | URL): Promise<Instance> {
    source = this.cleanUrl(source);
    const { data } = await new Request()
      .setEndpoint(`${source}InfoMobileApp.json?id=0D264427-EEFC-4810-A9E9-346942A862A4`)
      .send<InfoMobileResponse>();

    const availableWorkspaces = data.espaces
      .filter(raw => raw.genreEspace !== undefined)
      .map(raw => ({
        delegated: raw.avecDelegation ?? false,
        url: raw.URL,
        name: raw.nom,
        type: raw.genreEspace as NOTSpace,
      }));

    const version = data.version;
    let cas: CAS | undefined;

    if (data.CAS.actif) {
      cas = { url: data.CAS.casURL, token: data.CAS.jetonCAS };
    }

    return new Instance(source, availableWorkspaces, version, cas);
  }

  public static cleanUrl(source: string | URL): string {
    const url = source instanceof URL ? source : new URL(source.trim().startsWith("http") ? source : "https://" + source);
    const pathSegments = url.pathname.split("/").filter(Boolean);

    while (pathSegments.at(-1)?.toLowerCase().endsWith(".html")) {
      pathSegments.pop();
    }

    const basePath = pathSegments.join("/");
    return `${url.protocol}//${url.host}/${basePath ? basePath + "/" : ""}`.toLowerCase();
  }
}