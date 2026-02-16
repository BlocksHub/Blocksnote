import type { TimetableOptions } from "../../types/timetable";
import type { Class } from "../../types/user";
import type { Instance } from "../Instance";
import { Timetable } from "../../routes/PageEmploiDuTemps/Common";
import { AdministratorUserSettings } from "@/routes/ParametresUtilisateurs/Administrator";
import type { StudentUserSettings } from "@/routes/ParametresUtilisateurs/Student";
import type { TeacherUserSettings } from "@/routes/ParametresUtilisateurs/Teacher";
import type { Session } from "@/structures/Session";
import type { Settings } from "@/structures/Settings";
import { User } from "@/structures/users/User";

export class Administrator extends User {
  declare public user: AdministratorUserSettings;

  public static override async load(
    session: Session,
    settings: Settings,
    instance: Instance
  ): Promise<Administrator> {
    const user = await AdministratorUserSettings.load<AdministratorUserSettings>(session, settings)
    return new this(session, user, instance, settings);
  }

  public timetable(
    ressource: Class | StudentUserSettings | TeacherUserSettings,
    options?: TimetableOptions
  ): Promise<Timetable> {
    return super._timetable(ressource, options);
  }
}