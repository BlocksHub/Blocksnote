import type { Instance } from "../Instance";
import { TeacherUserSettings } from "../ParametresUtilisateurs/Teacher";
import type { Session } from "../Session";
import type { Settings } from "../Settings";
import { User } from "./User";

export class Teacher extends User {
  declare public user: TeacherUserSettings;

  constructor(
    session: Session,
    user: TeacherUserSettings,
    instance: Instance,
    settings: Settings
  ) {
    super(session, user, instance, settings);
  }

  public static override async load(session: Session, settings: Settings, instance: Instance): Promise<Teacher> {
    const user = await TeacherUserSettings.load<TeacherUserSettings>(session, settings);
    return new this(session, user, instance, settings);
  }
}
