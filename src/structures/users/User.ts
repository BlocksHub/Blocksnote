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
    options?: TimetableOptions
  ): Promise<Timetable> {
    const res: Ressource | Ressource[] = Array.isArray(target)
      ? target.map((t) => ({ G: t.kind, N: t.id}))
      : { G: target.kind, N: target.id};

    if (!options?.from || !options?.to) {
      const d = new Date();
      const day = d.getDay();
      const diff = (day === 0 ? -6 : 1) - day;

      const from = new Date(d);
      from.setDate(d.getDate() + diff);

      const to = new Date(from);
      to.setDate(from.getDate() + 6);

      options = { ...options, from, to } as TimetableOptions;
    }

    return Timetable.load(this, res, options);
  }

  public weeknumber(date = new Date()): number {
    const firstMonday = this.settings.schedule.firstMonday;
    const days = Math.floor((date.getTime() - firstMonday.getTime()) / 86_400_000);
    return Math.ceil((days + firstMonday.getDay() + 1) / 7);
  }
}
