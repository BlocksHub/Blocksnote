import type { Videoconference } from "../../types/timetable";
import { TimeSlot } from "./TimeSlot";

export class Lesson extends TimeSlot {
  public get videoconference(): Videoconference[] {
    return this._raw.listeVisios?.map((i) => ({
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