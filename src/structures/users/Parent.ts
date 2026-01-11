import type { Instance } from "../Instance";
import { ParentUserSettings } from "../ParametresUtilisateurs/Parent";
import type { Session } from "../Session";
import type { Settings } from "../Settings";
import { User } from "./User";

export class Parent extends User {
  declare public user: ParentUserSettings;

  constructor(
    session: Session,
    user: ParentUserSettings,
    instance: Instance,
    settings: Settings
  ) {
    super(session, user, instance, settings);
  }

  public static override async load(
    session: Session,
    settings: Settings,
    instance: Instance
  ): Promise<Parent> {
    const user = await ParentUserSettings.load<ParentUserSettings>(session, settings);
    return new this(session, user, instance, settings);
  }
}
