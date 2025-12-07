import { utf8ToBytes } from "@noble/hashes/utils.js";
import { type LoginState, NOTSpace, type CAS, type Workspace } from "../types/authentication";
import { type AuthentificationResponse, type InfoMobileResponse } from "../types/responses/authentication";
import { Request } from "./network/Request";
import { Session } from "./Session";
import { AuthenticationError } from "./errors/AuthenticationError";
import { Challenge } from "./Challenge";
import { AccountSecurity } from "./AccountSecurity";
import { DoubleAuthModes } from "../utils/constants";
import { User } from "./users/User";

export class Authenticator {
  public state: LoginState = { type: "WORKSPACE_SELECTION", available: [] };
  private security?: AccountSecurity;
  private challenge?: Challenge;

  constructor(
    public source: string,
    public availableWorkspaces: Workspace[] = [],
    public currentWorkspace: Workspace | undefined = availableWorkspaces[0],
    public version: number[] = [],
    public cas?: CAS
  ) { }

  public setWorkspace(space: Workspace): this {
    this.currentWorkspace = space;
    return this;
  }

  public async finalize(): Promise<User> {
    if (this.state.type !== "LOGGED_IN") throw new AuthenticationError("This session is not ready yet.");
    return await User.load(this.state.session);
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

    const tempKey = this.challenge.generateTempKey(password);
    const challenge = this.challenge.solveChallenge(session, password);
    const request = new Request().setPronotePayload(session, "Authentification", {
      challenge,
      connexion: 0,
      espace: session.workspace.type,
    });

    const response = (await session.manager.enqueueRequest<AuthentificationResponse>(request)).data;
    if (!response.cle) throw new AuthenticationError("Bad Credentials");

    session.aes.updateKey(utf8ToBytes(tempKey));
    const decrypted = session.aes.decrypt(response.cle)
    const key = new Uint8Array(decrypted.split(',').map(Number));
    session.aes.updateKey(key);

    const actions = response.actionsDoubleAuth ?? [];
    this.security = new AccountSecurity(
      this,
      session,
      response.reglesSaisieMDP?.min,
      response.reglesSaisieMDP?.max,
      response.reglesSaisieMDP?.regles,
      response.modesPossibles,
      response.modeSecurisationParDefaut ?? 0,
      response.actionsDoubleAuth?.includes(DoubleAuthModes.PIN) ?? false
    )
    if (actions.length === 0) {
      this.state = { type: "LOGGED_IN", session }
    } else if (actions.includes(0)) {
      this.state = { type: "PASSWORD_CHANGE", security: this.security }
    } else if (actions.some(a => [1, 3, 5].includes(a))) {
      this.state = { type: "DOUBLE_AUTH", security: this.security }
    }

    return session;
  }

  public static async createFromURL(source: string | URL): Promise<Authenticator> {
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

    return new Authenticator(source, availableWorkspaces, undefined, version, cas);
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
