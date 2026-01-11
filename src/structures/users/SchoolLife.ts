import type { Instance } from "../Instance";
import { SchoolLifeUserSettings } from "../ParametresUtilisateurs/SchoolLife";
import type { Session } from "../Session";
import type { Settings } from "../Settings";
import { User } from "./User";

export class SchoolLife extends User {
  declare public user: SchoolLifeUserSettings;

  constructor(
    session: Session,
    user: SchoolLifeUserSettings,
    instance: Instance,
    settings: Settings
  ) {
    super(session, user, instance, settings);
  }

  public static override async load(session: Session, settings: Settings, instance: Instance): Promise<SchoolLife> {
    const user = await SchoolLifeUserSettings.load<SchoolLifeUserSettings>(session, settings);
    return new this(session, user, instance, settings);
  }
}
