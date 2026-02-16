import { NOTSpace } from "@/types/authentication";
import type { Instance } from "@/structures/Instance";
import { Student } from "@/structures/users/Student";
import { Authenticator } from "@/structures/authentication/Authenticator";

export class StudentAuthenticator extends Authenticator {
  constructor(instance: Instance) {
    super(instance);
    this.workspace = instance.workspaces.find((workspace) => workspace.type === NOTSpace.STUDENT);
  }

  public override async finalize(): Promise<Student> {
    const { session, settings } = await super.validate()
    return await Student.load(session, settings, this.instance)
  }
}