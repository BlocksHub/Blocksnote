import type { Instance } from "../Instance";
import { CommonUserSettings } from "../ParametresUtilisateurs/Common";
import { Session } from "../Session";
import type { Settings } from "../Settings";

export class User {
  constructor(
    public session: Session,
    public user: CommonUserSettings,
    public instance: Instance,
    public settings: Settings
  ) { }

  public static async load(session: Session, settings: Settings, instance: Instance): Promise<User> {
    const user = await CommonUserSettings.load(session, settings);
    return new this(session, user, instance, settings);
  }
}
