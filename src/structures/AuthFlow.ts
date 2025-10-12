import { NOTSpace, type CAS, type InfoMobileResponse, type Workspace } from "../types/authflow";
import { Request } from "./network/Request";

export class AuthFlow {
  public availableWorkspaces : Workspace[] = [];
  public version: number[] = [];
  public cas?: CAS;

  constructor(
    public source: string | URL,
  ){
    this.source = AuthFlow.cleanUrl(source)
  }

  public static async createFromURL(source: string | URL) {
    const flow = new AuthFlow(source)

    const { data } = await new Request()
      .setEndpoint(`${flow.source}InfoMobileApp.json?id=0D264427-EEFC-4810-A9E9-346942A862A4`)
      .send<InfoMobileResponse>();
    
    flow.availableWorkspaces = data.espaces.map((raw) => ({
      delegated: raw.avecDelegation ?? false,
      name: raw.nom,
      type: NOTSpace[raw.genreEspace as unknown as keyof typeof NOTSpace],
    })).filter(workspace => workspace.type !== undefined);

    flow.version = data.version
    if (data.CAS.actif) {
      flow.cas = {
        url: data.CAS.casURL,
        token: data.CAS.jetonCAS
      }
    }

    return flow;
  }

  public static cleanUrl(source: string | URL): string {
    source = source instanceof URL ? source : source.trim()
    source = source instanceof URL ? source : new URL(source.startsWith("http") ? source : "https://" + source);

    const splittedPathname = source.pathname.split("/").filter(segment => segment.trim() !== "")
    while (splittedPathname.length && splittedPathname[splittedPathname.length -1]?.toLowerCase().endsWith(".html")) {
      splittedPathname.pop()
    }
    
    return (source.protocol + "//" + source.host + "/" + splittedPathname.join("/") + (splittedPathname.length === 0 ? "" : "/")).toLowerCase();
  }
}
