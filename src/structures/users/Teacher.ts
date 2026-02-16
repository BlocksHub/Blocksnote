import type { TimetableOptions } from "@/types/timetable";
import type { Instance } from "@/structures/Instance";
import { Timetable } from "@/routes/PageEmploiDuTemps/Common";
import { TeacherUserSettings } from "@/routes/ParametresUtilisateurs/Teacher";
import type { Session } from "@/structures/Session";
import type { Settings } from "@/structures/Settings";
import { User } from "@/structures/users/User";

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
