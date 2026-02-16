import type { Videoconference } from "@/types/timetable";
import { TimeSlot } from "@/routes/PageEmploiDuTemps/TimeSlot";

export class Lesson extends TimeSlot {
  public get videoconference(): Videoconference[] {
    return this.raw.listeVisios?.map((i) => ({
      comment: i.commentaire,
      label:   i.libelleLien,
      url:     new URL(i.url)
    })) ?? [];
  }

  public get groups(): string[] {
    return this.content(2);
  }

  public get teachers(): string[] {
    return this.content(3);
  }

  public get subject(): string | string[] | undefined {
    return this.content(16)?.[0];
  }

  public get backgroundColor(): string {
    return this.raw.CouleurFond;
  }

  public get canceled(): boolean {
    return Boolean(this.raw.estAnnule);
  }

  public get evaluation(): boolean {
    return Boolean(this.raw.cahierDeTextes?.estEval);
  }

  public get status(): string | undefined {
    return this.raw.Statut;
  }
}