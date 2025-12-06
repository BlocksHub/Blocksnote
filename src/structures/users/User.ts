import { Session } from "../Session";
import { UserSettings } from "../UserSettings";

export class User extends UserSettings {
  constructor(settings: UserSettings) {
    super(
      settings.establishment,
      settings.groups,
      settings.classes,
      settings.profilePicture,
      settings.hasBrevetExam
    );
  }

  public static override async load(session: Session): Promise<User> {
    const settings = await UserSettings.load(session);
    console.log(settings);
    return new User(settings);
  }
}
