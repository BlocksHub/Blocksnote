import type { TimetableOptions } from "../../types/timetable";
import type { Class } from "../../types/user";
import type { Instance } from "../Instance";
import { Timetable } from "../PageEmploiDuTemps/Common";
import { CommonUserSettings } from "../ParametresUtilisateurs/Common";
import type { StudentUserSettings } from "../ParametresUtilisateurs/Student";
import type { TeacherUserSettings } from "../ParametresUtilisateurs/Teacher";
import type { Ressource } from "../../types/timetable";
import { Session } from "../Session";
import type { Settings } from "../Settings";

export class User {
  constructor(
    public session: Session,
    public user: CommonUserSettings,
    public instance: Instance,
    public settings: Settings
  ) { }

  public static async load(
    session: Session,
    settings: Settings,
    instance: Instance
  ): Promise<User> {
    const user = await CommonUserSettings.load(session, settings);
    return new this(session, user, instance, settings);
  }

  protected _timetable(
    target: Class | StudentUserSettings | TeacherUserSettings | Class[],
    options: TimetableOptions
  ): Promise<Timetable> {
    const res: Ressource | Ressource[] = Array.isArray(target)
      ? target.map((t) => ({ G: t.kind, N: t.id}))
      : { G: target.kind, N: target.id};

    return Timetable.load(this.session, res, this.settings, options);
  }
}
