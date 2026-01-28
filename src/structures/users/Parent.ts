import type { TimetableOptions } from "../../types/timetable";
import type { Instance } from "../Instance";
import { Timetable } from "../PageEmploiDuTemps/Common";
import { ParentUserSettings } from "../ParametresUtilisateurs/Parent";
import type { StudentUserSettings } from "../ParametresUtilisateurs/Student";
import type { Session } from "../Session";
import type { Settings } from "../Settings";
import { User } from "./User";

export class Parent extends User {
  declare public user: ParentUserSettings;

  constructor(
    session: Session,
    user: ParentUserSettings,
    instance: Instance,
    settings: Settings
  ) {
    super(session, user, instance, settings);
  }

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
}
