import type { TimetableOptions } from "@/types/timetable";
import type { Instance } from "@/structures/Instance";
import { Timetable } from "@/routes/PageEmploiDuTemps/Common";
import { StudentUserSettings } from "@/routes/ParametresUtilisateurs/Student";
import type { Session } from "@/structures/Session";
import type { Settings } from "@/structures/Settings";
import { User } from "@/structures/users/User";
import { Homework } from "@/routes/PageCahierDeTexte/Common";

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

  public homeworks(from?: Date, to?: Date): Promise<Array<Homework>> {
    return Homework.load(this, from, to);
  }
}
