import { NOTSpace } from "../../types/authentication";
import type { Instance } from "../Instance";
import { SchoolLife } from "../users/SchoolLife";
import { Authenticator } from "./Authenticator";

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