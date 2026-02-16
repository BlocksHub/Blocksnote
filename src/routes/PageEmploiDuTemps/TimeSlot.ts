import type { CommunPageEmploiDuTempsResponse, PronoteCourse } from "@/types/responses/timetable";
import type { Settings } from "@/structures/Settings";

export class TimeSlot {
  constructor(
    protected readonly raw: PronoteCourse,
    protected readonly timetable: CommunPageEmploiDuTempsResponse,
    protected readonly settings: Settings
  ){}

  protected content(type: number): string[] {
    const filtered = this.raw.ListeContenus.filter((content) => content.G === type);
    return filtered.length > 0 ? filtered.map((content) => content.label) : [];
  }

  public get staffs(): string[] {
    return this.content(34);
  }

  public get rooms(): string[] {
    return this.content(17);
  }

  public get from(): Date {
    return this.raw.DateDuCours;
  }

  public get to(): Date {
    return new Date(this.raw.DateDuCours.getTime() + this.duration);
  }

  public get duration(): number {
    return (this.raw.duree / this.settings.schedule.seatsPerHour) * 3_600_000;
  }

  public get excluded(): boolean {
    const day = this.timetable.absences.joursCycle.find(
      (d) => d.jourCycle === this.raw.DateDuCours.getDay() - 1
    );
    return Boolean(
      day?.exclusionsEtab
      && day.exclusionsEtab.placeDebut <= this.raw.place
      && day.exclusionsEtab.placeFin >= this.raw.place + this.raw.duree
    );
  }
}