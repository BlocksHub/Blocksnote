import type { Instance } from "../Instance";
import { Session } from "../Session";
import type { Settings } from "../Settings";
import { UserSettings } from "../UserSettings";

export class User {
  constructor(
    public session: Session,
    public user: UserSettings,
    public instance: Instance,
    public settings: Settings
  ) {}

  public static async load(session: Session, settings: Settings, instance: Instance): Promise<User> {
    const user = await UserSettings.load(session, settings);
    return new User(session, user, instance, settings);
  }
}
