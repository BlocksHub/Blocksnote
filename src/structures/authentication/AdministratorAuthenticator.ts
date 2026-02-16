import { NOTSpace } from "@/types/authentication";
import type { Instance } from "@/structures/Instance";
import { Administrator } from "@/structures/users/Administrator";
import { Authenticator } from "@/structures/authentication/Authenticator";

export class AdministratorAuthenticator extends Authenticator {
  constructor(instance: Instance) {
    super(instance);
    this.workspace = instance.workspaces.find(
      (workspace) => workspace.type === NOTSpace.ADMINISTRATOR
    );
  }

  public override async finalize(): Promise<Administrator> {
    const { session, settings } = await super.validate()
    return await Administrator.load(session, settings, this.instance)
  }
}