import type { TimetableOptions } from "../../types/timetable";
import type { Instance } from "../Instance";
import { Timetable } from "../PageEmploiDuTemps/Common";
import { StudentUserSettings } from "../ParametresUtilisateurs/Student";
import type { Session } from "../Session";
import type { Settings } from "../Settings";
import { User } from "./User";

export class Student extends User {
  declare public user: StudentUserSettings;

  public static override async load(
    session: Session,
    settings: Settings,
    instance: Instance
  ): Promise<Student> {
    const user = await StudentUserSettings.load<StudentUserSettings>(session, settings);
    return new this(session, user, instance, settings);
  }

  public timetable(options?: TimetableOptions): Promise<Timetable> {
    return super._timetable(this.user, options);
  }
}
