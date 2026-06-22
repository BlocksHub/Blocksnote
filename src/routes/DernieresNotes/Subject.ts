import { GradeParser } from "@/structures/parsing/GradeParser";
import type { GradeValue } from "@/types/grades";
import type { PronoteService, PronoteNote } from "@/types/responses/grades";
import { Grade } from "./Grade";

export class Subject {
  private _grades?: Grade[];

  constructor(
    private raw: PronoteService,
    private rawGrades: PronoteNote[]
  ) {}

  private get scale(): number {
    return this.raw.baremeMoyEleve ?? this.raw.baremeMoyEleveParDefaut
  }

  public get grades(): Grade[] {
    return (this._grades ??= this.rawGrades.map((g) => new Grade(g)));
  }

  public get isGroup(): boolean { return this.raw.estServiceEnGroupe }

  public get label(): string { return this.raw.label }

  public get average(): GradeValue {
    return GradeParser.parse(this.raw.moyEleve, this.scale)
  }

  public get classAverage(): GradeValue {
    return GradeParser.parse(this.raw.moyClasse, this.scale)
  }

  public get minimum(): GradeValue {
    return GradeParser.parse(this.raw.moyMin, this.scale)
  }

  public get maximum(): GradeValue {
    return GradeParser.parse(this.raw.moyMax, this.scale)
  }

  public get color(): string { return this.raw.couleur }
}