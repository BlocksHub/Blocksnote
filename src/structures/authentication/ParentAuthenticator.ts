import { NOTSpace } from "../../types/authentication";
import { AuthenticationError } from "../errors/AuthenticationError";
import type { Instance } from "../Instance";
import { Parent } from "../users/Parent";
import { Authenticator } from "./Authenticator";

export class ParentAuthenticator extends Authenticator {
  constructor(instance: Instance) {
    super(instance);
    this.workspace = instance.workspaces.find((workspace) => workspace.type === NOTSpace.PARENT);
  }

  public override async finalize(): Promise<Parent> {
    if (this.state.type !== "LOGGED_IN" || !this.settings) throw new AuthenticationError("This session is not ready yet.");
    return await Parent.load(this.state.session, this.settings, this.instance);
  }
}