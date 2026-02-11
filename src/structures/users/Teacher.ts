import type { TimetableOptions } from "../../types/timetable";
import type { Instance } from "../Instance";
import { Timetable } from "../PageEmploiDuTemps/Common";
import { TeacherUserSettings } from "../ParametresUtilisateurs/Teacher";
import type { Session } from "../Session";
import type { Settings } from "../Settings";
import { User } from "./User";

export class Teacher extends User {
  declare public user: TeacherUserSettings;

  public static override async load(
    session: Session,
    settings: Settings,
    instance: Instance
  ): Promise<Teacher> {
    const user = await TeacherUserSettings.load<TeacherUserSettings>(session, settings);
    return new this(session, user, instance, settings);
  }

  public timetable(options?: TimetableOptions): Promise<Timetable> {
    return super._timetable(this.user, options);
  }
}
