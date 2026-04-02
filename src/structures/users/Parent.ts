import type { TimetableOptions } from "@/types/timetable";
import type { Instance } from "@/structures/Instance";
import { Timetable } from "@/routes/PageEmploiDuTemps/Common";
import { ParentUserSettings } from "@/routes/ParametresUtilisateurs/Parent";
import type { StudentUserSettings } from "@/routes/ParametresUtilisateurs/Student";
import type { Session } from "@/structures/Session";
import type { Settings } from "@/structures/Settings";
import { User } from "@/structures/users/User";
import { Homework } from "@/routes/PageCahierDeTexte/Common";
import { Parser } from "../parsing/Parser";

export class Parent extends User {
  declare public user: ParentUserSettings;

  public static override async load(
    session: Session,
    settings: Settings,
    instance: Instance
  ): Promise<Parent> {
    const user = await ParentUserSettings.load<ParentUserSettings>(session, settings);
    return new this(session, user, instance, settings);
  }

  public timetable(children: StudentUserSettings, options?: TimetableOptions): Promise<Timetable> {
    return super._timetable(children, options);
  }

  public homeworks(children: StudentUserSettings, from?: Date, to?: Date): Promise<Array<Homework>> {
    return Homework.load(this, from, to, Parser.toRessource(children));
  }
}
