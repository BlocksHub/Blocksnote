import { utf8ToBytes } from "@noble/hashes/utils.js";
import type { Workspace } from "../../types/authentication";
import type { AuthentificationResponse } from "../../types/responses/authentication";
import { Challenge } from "../Challenge";
import { AuthenticationError } from "../errors/AuthenticationError";
import type { Instance } from "../Instance";
import { Request } from "../network/Request";
import { Session } from "../Session";
import { Settings } from "../Settings";
import { AccountSecurity } from "./AccountSecurity";
import { User } from "../users/User";

export class Authenticator {
  public workspace?: Workspace;

  protected session?: Session;

  private raw?: AuthentificationResponse;

  protected settings?: Settings;

  private _security?: AccountSecurity;

  constructor(
    public readonly instance: Instance
  ){}

  protected async validate() {
    if (!this.settings || !this.session) {
      throw new AuthenticationError("Unable to finalize the authentication.")
    }
    await this.security.execute()
    return { session: this.session, settings: this.settings }
  }

  public useWorkspace(workspace: Workspace) {
    this.workspace = workspace;
  }

  public async credentials(
    username: string,
    password: string
  ) {
    if (!this.workspace) throw new AuthenticationError("You need to select a Workspace to continue");

    this.session = await Session.create(this.instance.source, this.workspace);
    this.settings = await Settings.load(this.session);
    const challenge = await Challenge.request(this.session, username);

    await this.authenticate(this.session, challenge, password);
  }

  private async authenticate(session: Session, challenge: Challenge, password: string) {
    const tempKey = challenge.generateTempKey(password);
    const solution = challenge.solve(session, password);

    const _request = new Request()
      .setPronotePayload(
        session,
        "Authentification",
        {
          challenge: solution,
          connexion: 0,
          espace:    session.workspace.type
        }
      )
    const _response = (await session.manager.enqueueRequest<AuthentificationResponse>(_request)).data;
    if (!_response.cle) throw new AuthenticationError("Unable to find the AES Key, please ensure that you provided the correct credentials.")

    session.aes.updateKey(utf8ToBytes(tempKey));
    const _decryptedKey = session.aes.decrypt(_response.cle);
    const finalKey = new Uint8Array(_decryptedKey.split(",").map(Number));
    session.aes.updateKey(finalKey);

    this.raw = _response;
  }

  public get security(): AccountSecurity {
    if (!this.session || !this.raw) throw new AuthenticationError("Unable to initiate security options yet.");
    return (this._security ??= new AccountSecurity(this.session, this.raw));
  }

  public async finalize(): Promise<User> {
    const { session, settings } = await this.validate()
    return User.load(session, settings, this.instance)
  }
}
