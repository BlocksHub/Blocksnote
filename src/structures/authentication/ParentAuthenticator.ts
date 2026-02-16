import { NOTSpace } from "@/types/authentication";
import type { Instance } from "@/structures/Instance";
import { Parent } from "@/structures/users/Parent";
import { Authenticator } from "@/structures/authentication/Authenticator";

export class ParentAuthenticator extends Authenticator {
  constructor(instance: Instance) {
    super(instance);
    this.workspace = instance.workspaces.find((workspace) => workspace.type === NOTSpace.PARENT);
  }

  public override async finalize(): Promise<Parent> {
    const { session, settings } = await super.validate()
    return await Parent.load(session, settings, this.instance)
  }
}