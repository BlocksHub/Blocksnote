import { fetchInstanceInformations } from "../routes/instance";
import { type Workspace } from "../types/authflow";
import { BYPASS_ID } from "../utils/constants";
import { AES } from "./crypto/AES";
import { AuthenticationError } from "./errors/AuthenticationError";
import type { Instance } from "./Instance";
import { Request } from "./network/Request";
import { RequestManager } from "./network/RequestManager";

export class Session {
  public manager = new RequestManager();
  public aes = new AES();

  public instance?: Instance;
  public useHttps: boolean = false;

  constructor(
    public id: string,
    public source: string,
    public workspace: Workspace
  ){
    if (this.source.startsWith("https")) {
      this.useHttps = true;
    }
  }

  public static async createSession(source: string, workspace: Workspace) {
    const endpoint = `${source}${workspace.url}?fd=1&bydlg=${BYPASS_ID}`;
    const response = await new Request().setEndpoint(endpoint).send();

    if (typeof response.data !== "string") {
      throw new AuthenticationError("Unexpected response type from Pronote");
    }

    const sessionId = response.data.match(/h:([^,)}]+)/)?.[1];
    if (!sessionId) {
      throw new AuthenticationError("Unable to create a session for this instance");
    }

    const session = new Session(sessionId, source, workspace);
    const instance = await fetchInstanceInformations(session)
    session.instance = instance
    return  session
  }
}
