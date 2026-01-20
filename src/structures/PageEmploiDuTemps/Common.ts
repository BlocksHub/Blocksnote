import type { CommunPageEmploiDuTempsResponse, PronoteCourse } from "../../types/responses/timetable";
import type { Lesson, Ressource, TimetableDay, TimetableOptions } from "../../types/timetable";
import { Request } from "../network/Request";
import { Response } from "../network/Response";
import type { Session } from "../Session";
import type { Settings } from "../Settings";
import { NOTSpace } from "../../types/authentication";

export class Timetable {
  private _days?: TimetableDay[]

  private _lessons?: Lesson[]

  constructor(
    protected readonly settings: Settings,
    protected readonly raw: Response<CommunPageEmploiDuTempsResponse>
  ){}

  protected static buildPayload(
    ressource: Ressource[] | Ressource,
    options: TimetableOptions
  ): Record<string, unknown> {
    const payload: Record<string, unknown> = {
      NumeroSemaine:                  options.weekNumber,
      numeroSemaine:                  options.weekNumber,
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

  protected static buildSignature(
    session: Session,
    ressource: Ressource[] | Ressource
  ) {
    const payload: Record<string, unknown> = {
      onglet: this.tab(session.workspace.type)
    }

    if (ressource && session.workspace.type === NOTSpace.PARENT) {
      payload.membre = ressource
    }

    return payload
  }

  protected static tab(space: NOTSpace): number {
    switch (space) {
      case NOTSpace.ADMINISTRATOR:
        return 60
      case NOTSpace.SCHOOL_LIFE:
        return 171
      default:
        return 16
    }
  }

  public static async load(
    session: Session,
    ressource: Ressource[] | Ressource,
    settings: Settings,
    options: TimetableOptions
  ): Promise<Timetable> {
    const request =  new Request()
      .setPronotePayload(
        session,
        "PageEmploiDuTemps",
        this.buildPayload(ressource, options),
        this.buildSignature(session, ressource)
      )
    const response = await session.manager.enqueueRequest<CommunPageEmploiDuTempsResponse>(request);
    return new this(settings, response);
  }

  protected static toLesson(course: PronoteCourse, settings: Settings): Lesson {
    const contents = new Map(course.ListeContenus?.map((item) => [item.G, item.label]));
    const durationMs = (course.duree / settings.schedule.seatsPerHour) * 3_600_000;

    return {
      withPublishedHomework: course.AvecTafPublie,
      backgroundColor:       course.CouleurFond,
      startDate:             course.DateDuCours,
      endDate:               new Date(course.DateDuCours.getTime() + durationMs),
      room:                  contents.get(17),
      subject:               contents.get(16),
      teacher:               contents.get(3)
    };
  }

  public get lessons(): readonly Lesson[] {
    if (!this._lessons) {
      this._lessons = this.raw.data.ListeCours.map((c) => Timetable.toLesson(c, this.settings));
    }
    return this._lessons;
  }

  public get days(): readonly TimetableDay[] {
    if (!this._days) {
      const lessonsMap = new Map<number, Lesson[]>();
      for (const lesson of this.lessons) {
        const date = lesson.startDate;
        const key = new Date(date.setHours(0, 0)).getTime();
        const arr = lessonsMap.get(key) ?? [];

        arr.push(lesson);
        lessonsMap.set(key, arr);
      }
      this._days = Array.from(lessonsMap.entries()).map(([t, lessons]) => ({
        date: new Date(t),
        lessons
      }));
    }
    return this._days;
  }
}