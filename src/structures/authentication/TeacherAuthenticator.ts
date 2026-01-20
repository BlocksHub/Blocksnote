import { NOTSpace } from "../../types/authentication";
import type { Instance } from "../Instance";
import { Teacher } from "../users/Teacher";
import { Authenticator } from "./Authenticator";

export class TeacherAuthenticator extends Authenticator {
  constructor(instance: Instance) {
    super(instance);
    this.workspace = instance.workspaces.find((workspace) => workspace.type === NOTSpace.TEACHER);
  }

  public override async finalize(): Promise<Teacher> {
    const { session, settings } = await super.validate()
    return await Teacher.load(session, settings, this.instance)
  }
}