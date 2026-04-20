import { NOTSpace } from "@/types/authentication";
import type { Instance } from "@/structures/Instance";
import { Authenticator } from "@/structures/authentication/Authenticator";
import { Company } from "../users/Company";

export class CompanyAuthenticator extends Authenticator {
  constructor(instance: Instance) {
    super(instance);
    this.workspace = instance.workspaces.find((workspace) => workspace.type === NOTSpace.ENTERPRISE);
  }

  public override async finalize(): Promise<Company> {
    const { session, settings } = await super.validate()
    return await Company.load(session, settings, this.instance)
  }
}