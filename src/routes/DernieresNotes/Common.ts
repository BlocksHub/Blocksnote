import { AccessDeniedError } from "@/structures/errors/AccessDeniedError";
import { Request } from "@/structures/network/Request";
import { GradeParser } from "@/structures/parsing/GradeParser";
import { Parser } from "@/structures/parsing/Parser";
import type { User } from "@/structures/users/User";
import type { GradeValue } from "@/types/grades";
import type { Period } from "@/types/instance";
import type { CommonDernieresNotesReponses, PronoteNote } from "@/types/responses/grades";
import { TabsType } from "@/types/user";
import { Subject } from "./Subject";

export class Grades {
  private _subjects?: Subject[];

  constructor(
    private raw: CommonDernieresNotesReponses
  ) {}

  public static async load(
    user: User,
    period?: Period
  ): Promise<Grades> {
    const tab = user.user.tab(TabsType.GRADES)
    if (!tab) throw new AccessDeniedError();
    const periodId: string = period?.id ?? tab.defaultPeriod;
    const request = new Request()
      .setPronotePayload(user.session, "DernieresNotes", { ...Parser.encodeKind("Periode", 2, periodId)}, { onglet: TabsType.GRADES });
    const response = await user.session.manager.enqueueRequest<CommonDernieresNotesReponses>(request);

    return new this(response.data);
  }

  private get scale(): number {
    return this.raw.baremeMoyGenerale ?? this.raw.baremeMoyGeneraleParDefaut;
  }

  public get average(): GradeValue | undefined {
    if (!this.raw.moyGenerale) return undefined;
    return GradeParser.parse(this.raw.moyGenerale, this.scale);
  }

  public get classAverage(): GradeValue | undefined {
    if (!this.raw.moyGeneraleClasse) return undefined;
    return GradeParser.parse(this.raw.moyGeneraleClasse, this.scale);
  }

  public get withGradeDetails(): boolean { return this.raw.avecDetailDevoir }

  public get withSubjectDetails(): boolean { return this.raw.avecDetailService }

  public get subjects(): Subject[] {
    if (this._subjects) return this._subjects;

    const gradesBySubject = new Map<string, PronoteNote[]>();
    for (const grade of this.raw.listeDevoirs) {
      const list = gradesBySubject.get(grade.service.id) ?? [];
      list.push(grade);
      gradesBySubject.set(grade.service.id, list);
    }

    this._subjects = this.raw.listeServices.map(
      (s) => new Subject(s, gradesBySubject.get(s.id) ?? [])
    );

    return this._subjects;
  }
}
