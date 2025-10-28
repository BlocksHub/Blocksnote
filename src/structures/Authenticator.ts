import { bytesToHex, utf8ToBytes } from "@noble/hashes/utils.js";
import { NOTSpace, type CAS, type Workspace } from "../types/authflow";
import type { AuthentificationResponse, IdentificationResponse, InfoMobileResponse } from "../types/responses/authflow";
import { Request } from "./network/Request";
import { Session } from "./Session";
import { sha256 } from "@noble/hashes/sha2.js";
import { AuthenticationError } from "./errors/AuthenticationError";

export class Authenticator {
  private seed?: string;
  private username?: string;
  private password?: string;
  private challenge?: string;

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
    await this._requestChallenge(session, username);

    return await this._authenticate(session, password);
  }

  private async _authenticate(session: Session, password: string): Promise<Session> {
    this.password = password;

    const challenge = this._solveChallenge(session);

    const request = new Request().setPronotePayload(session, "Authentification", {
      challenge,
      connexion: 0,
      espace: session.workspace.type,
    });

    const response = await session.manager.enqueueRequest<AuthentificationResponse>(request);
    
    if (!response.data.cle) throw new AuthenticationError("Bad Credentials")
    session.aes.updateKey(utf8ToBytes(response.data.cle))

    return session
  }

  private _solveChallenge(session: Session): string {
    if (!this.challenge) {
      throw new AuthenticationError("Unable to solve challenge: no challenge was retrieved.");
    }

    const tempKey = this._generateTempKey();
    session.aes.updateKey(utf8ToBytes(tempKey));

    const decrypted = session.aes.decrypt(this.challenge);
    const decoded = decrypted.split("")
      .filter((_, i) => i % 2 === 0)
      .join("");
    const encrypted = session.aes.encrypt(decoded);
  
    session.aes.resetKey();
    return encrypted;
  }

  private async _requestChallenge(session: Session, username: string) {
    const request = new Request().setPronotePayload(session, "Identification", {
      demandeConnexionAppliMobile: false,
      demandeConnexionAppliMobileJeton: false,
      demandeConnexionAuto: false,
      enConnexionAppliMobile: false,
      enConnexionAuto: false,
      genreConnexion: 0,
      genreEspace: session.workspace.type,
      identifiant: username,
      informationsAppareil: null,
      loginTokenSAV: "",
      pourENT: false,
      uuidAppliMobile: "",
    });

    const response = await session.manager.enqueueRequest<IdentificationResponse>(request);

    this.username = username;
    this.challenge = response.data.challenge;
    this.seed = response.data.alea;
  }

  private _generateTempKey(): string {
    if (!this.password) {
      throw new AuthenticationError("Password is required to generate a temporary key.");
    }

    const hash = sha256
      .create()
      .update(utf8ToBytes(this.seed ?? ""))
      .update(utf8ToBytes(this.password.trim()))
      .digest();

    return `${this.username}${bytesToHex(hash).toUpperCase()}`;
  }

  public static async createFromURL(source: string | URL) {
    const flow = new Authenticator(source)

    const { data } = await new Request()
      .setEndpoint(`${flow.source}InfoMobileApp.json?id=0D264427-EEFC-4810-A9E9-346942A862A4`)
      .send<InfoMobileResponse>();
    
    flow.availableWorkspaces = data.espaces.map((raw) => ({
      delegated: raw.avecDelegation ?? false,
      url: raw.URL,
      name: raw.nom,
      type: raw.genreEspace as NOTSpace,
    })).filter(workspace => workspace.type !== undefined);

    flow.version = data.version
    if (data.CAS.actif) {
      flow.cas = {
        url: data.CAS.casURL,
        token: data.CAS.jetonCAS
      }
    }

    flow.currentWorkspace = flow.availableWorkspaces[0]

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
