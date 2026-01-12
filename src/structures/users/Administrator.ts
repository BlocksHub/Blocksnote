import type { Instance } from "../Instance";
import { AdministratorUserSettings } from "../ParametresUtilisateurs/Administrator";
import type { Session } from "../Session";
import type { Settings } from "../Settings";
import { User } from "./User";

export class Administrator extends User {
  declare public user: AdministratorUserSettings;

  constructor(
    session: Session,
    user: AdministratorUserSettings,
    instance: Instance,
    settings: Settings
  ) {
    super(session, user, instance, settings);
  }

  public static override async load(
    session: Session,
    settings: Settings,
    instance: Instance
  ): Promise<Administrator> {
    const user = await AdministratorUserSettings.load<AdministratorUserSettings>(session, settings)
    return new this(session, user, instance, settings);
  }
}