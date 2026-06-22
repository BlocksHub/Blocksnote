import { GradeParser } from "@/structures/parsing/GradeParser";
import type { GradeValue } from "@/types/grades";
import type { PronoteNote } from "@/types/responses/grades";

export class Grade {
  constructor(
    public raw: PronoteNote
  ) {}

  private get scale(): number {
    return this.raw.bareme ?? this.raw.baremeParDefaut;
  }

  public get value(): GradeValue { return GradeParser.parse(this.raw.note, this.scale) }

  public get isGroup(): boolean { return this.raw.estEnGroupe }

  public get createdAt(): Date { return this.raw.date }

  public get themes(): string[] { return this.raw.ListeThemes }

  public get average(): GradeValue { return GradeParser.parse(this.raw.moyenne, this.scale) }

  public get maximum(): GradeValue { return GradeParser.parse(this.raw.noteMax, this.scale) }

  public get minimum(): GradeValue { return GradeParser.parse(this.raw.noteMin, this.scale) }

  public get comment(): string | undefined {
    if (this.raw.commentaire?.trim() === "") return undefined
    return this.raw.commentaire
  }

  public get coefficient(): number { return this.raw.coefficient }

  public get isOptional(): boolean { return this.raw.estFacultatif }

  public get isBonus(): boolean { return this.raw.estBonus }

  public get isConvertedTo20(): boolean { return this.raw.estRamenerSur20 }
}