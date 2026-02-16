import { TimeSlot } from "@/routes/PageEmploiDuTemps/TimeSlot";

export class Detention extends TimeSlot {
  public get state(): string {
    return this._raw.hintRealise!;
  }
}