import type { CommunPageEmploiDuTempsResponse, PronoteCourse } from "../../types/responses/timetable";
import { type Ressource, type TimetableDay, type TimetableOptions } from "../../types/timetable";
import { Request } from "../network/Request";
import { Response } from "../network/Response";
import type { Session } from "../Session";
import type { Settings } from "../Settings";
import { NOTSpace } from "../../types/authentication";
import { TimeSlot } from "./TimeSlot";
import type { User } from "../users/User";
import { Detention } from "./Detention";
import { Lesson } from "./Lesson";
import { Parser } from "../parsing/Parser";
import { DateParser } from "../parsing/DateParser";

export class Timetable {
  private _days?: TimetableDay[]

  private _lessons?: TimeSlot[]

  constructor(
    protected readonly settings: Settings,
    protected readonly raw: Response<CommunPageEmploiDuTempsResponse>,
    protected readonly options: TimetableOptions
  ){}

  private static buildPayload(
    ressource: Ressource[] | Ressource,
    options: TimetableOptions
  ): Record<string, unknown> {
    let payload: Record<string, unknown> = {
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

    if (options.weekNumber && (!options.from && !options.to)) {
      payload = {
        ...payload,
        ...Parser.encodeValue("numeroSemaine", options.weekNumber)
      }
    }

    if (options.from && options.to) {
      payload = {
        ...payload,
        ...Parser.encodeType("dateDebut", 7, DateParser.encode(options.from)),
        ...Parser.encodeType("dateFin", 7, DateParser.encode(options.to))
      }
    }

    if (ressource instanceof Array) {
      payload.listeRessources = ressource
    } else {
      payload = {
        ...payload,
        ...Parser.encodeKind("ressource", ressource.G, ressource.N)
      }
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

  private static addTimeSlot(course: PronoteCourse, settings: Settings): TimeSlot {
    if (course.estRetenue) return new Detention(course, settings);
    return new Lesson(course, settings);
  }

  public static async load(
    user: User,
    ressource: Ressource[] | Ressource,
    options: TimetableOptions
  ): Promise<Timetable> {
    const request = new Request().setPronotePayload(
      user.session,
      "PageEmploiDuTemps",
      this.buildPayload(ressource, options),
      this.buildSignature(user.session, ressource)
    );
    const response = await user.session.manager.enqueueRequest<CommunPageEmploiDuTempsResponse>(request);

    return new this(user.settings, response, options);
  }

  public get lessons(): readonly TimeSlot[] {
    if (!this._lessons) {
      this._lessons = this.raw.data.ListeCours
        .map((c) => Timetable.addTimeSlot(c, this.settings))
        .sort((a, b) => a.from.getTime() - b.from.getTime());
    }
    return this._lessons;
  }

  public get days(): readonly TimetableDay[] {
    if (!this._days) {
      const lessonsMap = new Map<number, TimeSlot[]>();
      for (const lesson of this.lessons) {
        const date = lesson.from;
        const key = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
        (lessonsMap.get(key) ?? lessonsMap.set(key, []).get(key)!).push(lesson);
      }

      this._days = Array.from(lessonsMap.entries())
        .sort(([a], [b]) => a - b)
        .map(([t, lessons]) => ({ date: new Date(t), lessons: lessons as (Lesson[] | Detention[]) }));
    }
    return this._days;
  }
}