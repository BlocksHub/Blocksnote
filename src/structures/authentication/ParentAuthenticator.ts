import { NOTSpace } from "../../types/authentication";
import type { Instance } from "../Instance";
import { Parent } from "../users/Parent";
import { Authenticator } from "./Authenticator";

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