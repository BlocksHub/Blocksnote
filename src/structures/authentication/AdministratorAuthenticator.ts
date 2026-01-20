import { NOTSpace } from "../../types/authentication";
import type { Instance } from "../Instance";
import { Administrator } from "../users/Administrator";
import { Authenticator } from "./Authenticator";

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