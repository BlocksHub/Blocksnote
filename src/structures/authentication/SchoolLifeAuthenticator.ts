import { NOTSpace } from "../../types/authentication";
import { AuthenticationError } from "../errors/AuthenticationError";
import type { Instance } from "../Instance";
import { SchoolLife } from "../users/SchoolLife";
import { Authenticator } from "./Authenticator";

export class SchoolLifeAuthenticator extends Authenticator {
  constructor(instance: Instance) {
    super(instance);
    this.workspace = instance.workspaces.find(workspace => workspace.type === NOTSpace.SCHOOL_LIFE);
  }

  public override async finalize(): Promise<SchoolLife> {
    if (this.state.type !== "LOGGED_IN" || !this.settings) throw new AuthenticationError("This session is not ready yet.");
    return await SchoolLife.load(this.state.session, this.settings, this.instance);
  }
}