import type { PronoteCourse } from "../../types/responses/timetable";
import type { Settings } from "../Settings";

export class TimeSlot {
  constructor(
    protected readonly _raw: PronoteCourse,
    protected readonly settings: Settings
  ){}

  protected content(type: number): string[] {
    const filtered = this._raw.ListeContenus.filter((content) => content.G === type);
    return filtered.length > 0 ? filtered.map((content) => content.label) : [];
  }

  public get staffs(): string[] {
    return this.content(34);
  }

  public get rooms(): string[] {
    return this.content(17);
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
}