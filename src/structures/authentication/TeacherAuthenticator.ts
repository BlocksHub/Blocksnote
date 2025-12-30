import { NOTSpace } from "../../types/authentication";
import { AuthenticationError } from "../errors/AuthenticationError";
import type { Instance } from "../Instance";
import { Teacher } from "../users/Teacher";
import { Authenticator } from "./Authenticator";

export class TeacherAuthenticator extends Authenticator {
  constructor(instance: Instance) {
    super(instance);
    this.workspace = instance.workspaces.find(workspace => workspace.type === NOTSpace.TEACHER);
  }

  public override async finalize(): Promise<Teacher> {
    if (this.state.type !== "LOGGED_IN" || !this.settings) throw new AuthenticationError("This session is not ready yet.");
    return await Teacher.load(this.state.session, this.settings, this.instance);
  }
}