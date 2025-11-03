import { utf8ToBytes } from "@noble/hashes/utils.js";
import { LoginState, NOTSpace, type CAS, type Workspace } from "../types/authflow";
import type { AuthentificationResponse, InfoMobileResponse } from "../types/responses/authflow";
import { Request } from "./network/Request";
import { Session } from "./Session";
import { AuthenticationError } from "./errors/AuthenticationError";
import { Challenge } from "./Challenge";

export class Authenticator {
  public state: LoginState = LoginState.NOT_LOGGED_IN;
  private challenge?: Challenge;

  public currentWorkspace?: Workspace;
  public availableWorkspaces: Workspace[] = [];
  public version: number[] = [];
  public session?: Session;
  public cas?: CAS;

  constructor(public source: string | URL) {
    this.source = Authenticator.cleanUrl(source);
  }

  public setWorkspace(space: Workspace): this {
    this.currentWorkspace = space;
    return this;
  }

  public async initializeLoginWithCredentials(username: string, password: string): Promise<Session> {
    if (!this.currentWorkspace) {
      throw new AuthenticationError("You need to select a workspace before logging in.");
    }

    const session = await Session.createSession(this.source.toString(), this.currentWorkspace);
    this.challenge = await Challenge.request(session, username);

    return this.authenticate(session, password);
  }

  private async authenticate(session: Session, password: string): Promise<Session> {
    if (!this.challenge) {
      throw new AuthenticationError("Unable to solve challenge: no challenge was retrieved.");
    }
    const challenge = this.challenge.solveChallenge(session, password);
    const request = new Request().setPronotePayload(session, "Authentification", {
      challenge,
      connexion: 0,
      espace: session.workspace.type,
    });

    const response = (await session.manager.enqueueRequest<AuthentificationResponse>(request)).data;
    if (!response.cle) throw new AuthenticationError("Bad Credentials");
    session.aes.updateKey(utf8ToBytes(response.cle));

    const actions = response.actionsDoubleAuth ?? [];
    if (actions.length === 0) {
      this.state = LoginState.LOGGED_IN
    } else if (actions.includes(0)) {
      this.state = LoginState.SHOULD_CUSTOM_PASSWORD
    } else if (actions.some(a => [1, 3, 5].includes(a))) {
      this.state = LoginState.DOUBLE_AUTH_REQUIRED
    }

    return session;
  }

  public static async createFromURL(source: string | URL): Promise<Authenticator> {
    const flow = new Authenticator(source);
    const { data } = await new Request()
      .setEndpoint(`${flow.source}InfoMobileApp.json?id=0D264427-EEFC-4810-A9E9-346942A862A4`)
      .send<InfoMobileResponse>();

    flow.availableWorkspaces = data.espaces
      .filter(raw => raw.genreEspace !== undefined)
      .map(raw => ({
        delegated: raw.avecDelegation ?? false,
        url: raw.URL,
        name: raw.nom,
        type: raw.genreEspace as NOTSpace,
      }));

    flow.version = data.version;

    if (data.CAS.actif) {
      flow.cas = { url: data.CAS.casURL, token: data.CAS.jetonCAS };
    }

    flow.currentWorkspace = flow.availableWorkspaces[0];
    return flow;
  }

  public static cleanUrl(source: string | URL): string {
    const url = source instanceof URL ? source : new URL(source.startsWith("http") ? source : "https://" + source);
    const pathSegments = url.pathname.split("/").filter(Boolean);

    while (pathSegments.at(-1)?.toLowerCase().endsWith(".html")) {
      pathSegments.pop();
    }

    const basePath = pathSegments.join("/");
    return `${url.protocol}//${url.host}/${basePath ? basePath + "/" : ""}`.toLowerCase();
  }
}
