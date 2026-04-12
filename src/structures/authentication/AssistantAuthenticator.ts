import { NOTSpace } from "@/types/authentication";
import type { Instance } from "@/structures/Instance";
import { Authenticator } from "@/structures/authentication/Authenticator";
import { Assistant } from "@/structures/users/Assistant";

export class AssistantAuthenticator extends Authenticator {
  constructor(instance: Instance) {
    super(instance);
    this.workspace = instance.workspaces.find((workspace) => workspace.type === NOTSpace.ACCOMPANYING);
  }

  public override async finalize(): Promise<Assistant> {
    const { session, settings } = await super.validate()
    return await Assistant.load(session, settings, this.instance)
  }
}