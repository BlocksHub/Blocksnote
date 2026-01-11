import { utf8ToBytes } from "@noble/hashes/utils.js";
import { type LoginState, type Workspace } from "../../types/authentication";
import { type AuthentificationResponse } from "../../types/responses/authentication";
import { Request } from "../network/Request";
import { Session } from "../Session";
import { AuthenticationError } from "../errors/AuthenticationError";
import { Challenge } from "../Challenge";
import { AccountSecurity } from "./AccountSecurity";
import { DoubleAuthModes } from "../../utils/constants";
import type { Instance } from "../Instance";
import { Settings } from "../Settings";
import { User } from "../users/User";

export class Authenticator {
  public state: LoginState = { type: "WORKSPACE_SELECTION", available: [] };

  protected workspace?: Workspace;

  protected settings?: Settings;

  private challenge?: Challenge;

  constructor(
    public instance: Instance
  ) {
    this.workspace = instance.workspaces[0]
  }

  public async finalize(): Promise<User> {
    if (this.state.type !== "LOGGED_IN" || !this.settings) throw new AuthenticationError("This session is not ready yet.");
    return await User.load(this.state.session, this.settings, this.instance);
  }

  public setWorkspace(workspace: Workspace): this {
    this.workspace = workspace;
    return this;
  }

  public async initializeLoginWithCredentials(
    username: string,
    password: string
  ): Promise<Session> {
    if (!this.workspace) {
      throw new AuthenticationError("The selected workspace is not available for this instance.");
    }

    const session = await Session.createSession(this.instance.source.toString(), this.workspace);

    this.settings = await Settings.load(session);
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
      espace:    session.workspace.type
    });

    const response = (await session.manager.enqueueRequest<AuthentificationResponse>(request)).data;
    if (!response.cle) throw new AuthenticationError("Bad Credentials");

    session.aes.updateKey(utf8ToBytes(tempKey));
    const decrypted = session.aes.decrypt(response.cle)
    const key = new Uint8Array(decrypted.split(",").map(Number));
    session.aes.updateKey(key);

    const actions = response.actionsDoubleAuth ?? [];
    const security = new AccountSecurity(
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
      this.state = { type: "CREDENTIALS_CHANGE", security: security }
    } else if (actions.some((a) => [1, 3, 5].includes(a))) {
      this.state = { type: "DOUBLE_AUTH", security: security }
    }

    return session;
  }
}
