import { NOTSpace } from "../../types/authentication";
import { AuthenticationError } from "../errors/AuthenticationError";
import type { Instance } from "../Instance";
import { Administrator } from "../users/Administrator";
import { Authenticator } from "./Authenticator";

export class AdministratorAuthenticator extends Authenticator {
  constructor(instance: Instance) {
    super(instance);
    this.workspace = instance.workspaces.find(
      (workspace) => workspace.type === NOTSpace.ADMINISTRATOR
    );
  }

  public override async finalize(): Promise<Administrator> {
    if (this.state.type !== "LOGGED_IN" || !this.settings) throw new AuthenticationError("This session is not ready yet.");
    return await Administrator.load(this.state.session, this.settings, this.instance);
  }
}