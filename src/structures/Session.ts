import { type Workspace } from "../types/authentication";
import { BYPASS_ID } from "../utils/constants";
import { AES } from "./crypto/AES";
import { AuthenticationError } from "./errors/AuthenticationError";
import { Instance } from "./Instance";
import { Request } from "./network/Request";
import { RequestManager } from "./network/RequestManager";

export class Session {
  public manager = new RequestManager();
  public aes = new AES();

  public instance?: Instance;
  

  constructor(
    public id: string,
    public source: string,
    public workspace: Workspace,
    public useCompression: boolean = false,
    public useEncryption: boolean = false,
    public useHttps: boolean = false
  ){}

  public static async createSession(source: string, workspace: Workspace) {
    const endpoint = `${source}${workspace.url}?fd=1&bydlg=${BYPASS_ID}`;
    const response = await new Request().setEndpoint(endpoint).send();

    if (typeof response.data !== "string") {
      throw new AuthenticationError("Unexpected response type from Pronote");
    }

    const sessionId = response.data.match(/h:([^,)}]+)/)?.[1];
    const hasCrA: boolean = response.data.match(/CrA/gm) ? true : false;
    const hasCoA: boolean = response.data.match(/CoA/gm) ? true : false;
    const useHttps: boolean = !(/http\s*:\s*true/.test(response.data));

    if (!sessionId) {
      throw new AuthenticationError("Unable to create a session for this instance");
    }

    const session = new Session(sessionId, source, workspace, hasCoA, hasCrA, useHttps);
    const instance = await Instance.load(session)
    session.instance = instance
    return  session
  }
}
