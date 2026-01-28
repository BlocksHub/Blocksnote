import type { TimetableOptions } from "../../types/timetable";
import type { Class } from "../../types/user";
import type { Instance } from "../Instance";
import { Timetable } from "../PageEmploiDuTemps/Common";
import { SchoolLifeUserSettings } from "../ParametresUtilisateurs/SchoolLife";
import type { StudentUserSettings } from "../ParametresUtilisateurs/Student";
import type { TeacherUserSettings } from "../ParametresUtilisateurs/Teacher";
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

  public static override async load(
    session: Session,
    settings: Settings,
    instance: Instance
  ): Promise<SchoolLife> {
    const user = await SchoolLifeUserSettings.load<SchoolLifeUserSettings>(session, settings);
    return new this(session, user, instance, settings);
  }

  public timetable(
    ressource: Class[] | StudentUserSettings | TeacherUserSettings,
    options?: TimetableOptions
  ): Promise<Timetable> {
    return super._timetable(ressource, options);
  }
}
