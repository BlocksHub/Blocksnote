import { NOTSpace } from "@/types/authentication";
import type { Instance } from "@/structures/Instance";
import { SchoolLife } from "@/structures/users/SchoolLife";
import { Authenticator } from "@/structures/authentication/Authenticator";

export class SchoolLifeAuthenticator extends Authenticator {
  constructor(instance: Instance) {
    super(instance);
    this.workspace = instance.workspaces.find(
      (workspace) => workspace.type === NOTSpace.SCHOOL_LIFE
    );
  }

  public override async finalize(): Promise<SchoolLife> {
    const { session, settings } = await super.validate()
    return await SchoolLife.load(session, settings, this.instance)
  }
}