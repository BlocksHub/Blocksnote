import type { CommunPageEmploiDuTempsResponse } from "../../types/responses/timetable";
import { type TimetableRange, type Ressource, type TimetableDay, type TimetableOptions } from "../../types/timetable";
import { Request } from "../network/Request";
import { Response } from "../network/Response";
import type { Session } from "../Session";
import type { Settings } from "../Settings";
import { NOTSpace } from "../../types/authentication";
import { Lesson } from "./Lesson";
import type { User } from "../users/User";

export class Timetable {
  private _days?: TimetableDay[]

  private _lessons?: Lesson[]

  constructor(
    protected readonly settings: Settings,
    protected readonly raw: Response<CommunPageEmploiDuTempsResponse>[],
    protected readonly options: TimetableRange
  ){}

  private static buildPayload(
    weeknumber: number,
    ressource: Ressource[] | Ressource,
    options: TimetableRange
  ): Record<string, unknown> {
    const payload: Record<string, unknown> = {
      NumeroSemaine:                  weeknumber,
      numeroSemaine:                  weeknumber,
      avecAbsencesEleve:              options.withAbsences ?? false,
      avecAbsencesRessource:          true,
      avecConseilDeClasse:            options.withClassCouncil ?? true,
      avecCoursSortiePeda:            options.withFieldTrips ?? true,
      avecDisponibilites:             options.withAvailabilities ?? true,
      avecInfosPrefsGrille:           options.withGridPreferences ?? true,
      avecRessourcesLibrePiedHoraire: options.withFreeResourcesFooter ?? false,
      avecRetenuesEleve:              options.withStudentDetentions ?? true,
      estEDTPermanence:               options.isPermanenceTimetable ?? false
    };

    if (ressource instanceof Array) {
      payload.listeRessources = ressource
    } else {
      payload.Ressource =  ressource
      payload.ressource =  ressource
    }

    return payload;
  }

  private static buildSignature(session: Session, ressource: Ressource[] | Ressource) {
    const payload: Record<string, unknown> = { onglet: this.tab(session.workspace.type) };

    if (session.workspace.type === NOTSpace.PARENT) {
      payload.membre = ressource;
    }

    return payload;
  }

  private static tab(space: NOTSpace): number {
    const tabs: Partial<Record<NOTSpace, number>> = {
      [NOTSpace.ADMINISTRATOR]: 60,
      [NOTSpace.SCHOOL_LIFE]:   171
    };

    return tabs[space] ?? 16;
  }

  private static weeks(options: TimetableRange, user: User) {
    const weeks: number[] = [];
    const d = new Date(options.from!.getTime());
    d.setDate(d.getDate() - ((d.getDay() || 7) - 1));

    while (d <= options.to!) {
      weeks.push(user.weeknumber(d));
      d.setDate(d.getDate() + 7);
    }

    return weeks;
  }

  public static async load(
    user: User,
    ressource: Ressource[] | Ressource,
    options: TimetableOptions
  ): Promise<Timetable> {
    if (!options.from || !options.to) {
      throw new Error("TimetableOptions.from and .to are required");
    }

    const normalized: TimetableRange = {
      ...options,
      from: options.from,
      to:   options.to
    };

    const responses = await Promise.all(
      Timetable.weeks(normalized, user).map((weeknumber) => {
        const request = new Request().setPronotePayload(
          user.session,
          "PageEmploiDuTemps",
          this.buildPayload(weeknumber, ressource, normalized),
          this.buildSignature(user.session, ressource)
        );
        return user.session.manager.enqueueRequest<CommunPageEmploiDuTempsResponse>(request);
      })
    );

    return new this(user.settings, responses, normalized);
  }

  public get lessons(): readonly Lesson[] {
    if (!this._lessons) {
      this._lessons = this.raw.flatMap((r) => r.data.ListeCours ?? [])
        .map((c) => new Lesson(c, this.settings))
        .sort((a, b) => a.from.getTime() - b.from.getTime())
        .filter((d) => d.from > this.options.from && d.to < this.options.to);
    }
    return this._lessons;
  }

  public get days(): readonly TimetableDay[] {
    if (!this._days) {
      const lessonsMap = new Map<number, Lesson[]>();
      for (const lesson of this.lessons) {
        const date = lesson.from;
        const key = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
        (lessonsMap.get(key) ?? lessonsMap.set(key, []).get(key)!).push(lesson);
      }

      this._days = Array.from(lessonsMap.entries())
        .sort(([a], [b]) => a - b)
        .map(([t, lessons]) => ({ date: new Date(t), lessons }));
    }
    return this._days;
  }
}