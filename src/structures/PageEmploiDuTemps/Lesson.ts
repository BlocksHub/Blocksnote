import type { PronoteCourse } from "../../types/responses/timetable";
import type { Settings } from "../Settings";

export class Lesson {
  constructor(
    private readonly _raw: PronoteCourse,
    private readonly settings: Settings
  ){}

  private content(type: number): string[] | undefined {
    const filtered = this._raw.ListeContenus.filter((content) => content.G === type);
    return filtered.length > 0 ? filtered.map((content) => content.label) : undefined;
  }

  public get teachers(): string[] | undefined {
    return this.content(3);
  }

  public get room(): string | string[] | undefined {
    return this.content(17)?.[0];
  }

  public get subject(): string | string[] | undefined {
    return this.content(16)?.[0];
  }

  public get from(): Date {
    return this._raw.DateDuCours;
  }

  public get to(): Date {
    return new Date(this._raw.DateDuCours.getTime() + this.duration);
  }

  public get duration(): number {
    return (this._raw.duree / this.settings.schedule.seatsPerHour) * 3_600_000;
  }

  public get backgroundColor(): string {
    return this._raw.CouleurFond;
  }

  public get canceled(): boolean {
    return this._raw.estAnnule ?? false;
  }

  public get evaluation(): boolean {
    return this._raw.cahierDeTextes?.estEval ?? false;
  }

  public get status(): string | undefined {
    return this._raw.Statut;
  }
}