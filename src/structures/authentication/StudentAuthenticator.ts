import { NOTSpace } from "../../types/authentication";
import { AuthenticationError } from "../errors/AuthenticationError";
import type { Instance } from "../Instance";
import { Student } from "../users/Student";
import { Authenticator } from "./Authenticator";

export class StudentAuthenticator extends Authenticator {
  constructor(instance: Instance) {
    super(instance);
    this.workspace = instance.workspaces.find((workspace) => workspace.type === NOTSpace.STUDENT);
  }

  public override async finalize(): Promise<Student> {
    if (this.state.type !== "LOGGED_IN" || !this.settings) throw new AuthenticationError("This session is not ready yet.");
    return await Student.load(this.state.session, this.settings, this.instance);
  }
}