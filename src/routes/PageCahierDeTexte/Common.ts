import { Request } from "@/structures/network/Request";
import { Parser } from "@/structures/parsing/Parser";
import type { User } from "@/structures/users/User";
import type { DifficultyLevel, SubmissionType } from "@/types/homework";
import type { CommunDevoirResponse, Devoir } from "@/types/responses/notebook";
import type { Ressource } from "@/types/timetable";

export class Homework {
  constructor(
    private raw: Devoir
  ) {}

  public static async load(
    user: User,
    from: Date = new Date(),
    to?: Date,
    ressource?: Ressource
  ) {
    const domains: string = `[${user.weeknumber(from)}]`;
    const request = new Request().setPronotePayload(
      user.session,
      "PageCahierDeTexte",
      { ...Parser.encodeType("domaine", 8, domains) },
      { onglet: 88, membre: ressource }
    );
    const response = await user.session.manager.enqueueRequest<CommunDevoirResponse>(request);
    return response.data.ListeTravauxAFaire.map((h) => new this(h))
  }

  public get theme(): string {
    return this.raw.libelleCBTheme;
  }

  public get backgroundColor(): string {
    return this.raw.CouleurFond;
  }

  public get duration(): number {
    return this.raw.duree;
  }

  public get withFormatting(): boolean {
    return this.raw.avecMiseEnForme;
  }

  public get withSubmission(): boolean {
    return this.raw.avecRendu;
  }

  public get submissionType(): SubmissionType {
    return this.raw.genreRendu;
  }

  public get canSubmit(): boolean {
    return this.raw.peuRendre;
  }

  public get difficulty(): DifficultyLevel {
    return this.raw.niveauDifficulte;
  }

  public get subject(): string {
    return this.raw.Matiere.label;
  }

  public get description(): string {
    return this.raw.descriptif;
  }

  public get givenAt(): Date {
    return this.raw.DonneLe;
  }

  public get dueDate(): Date {
    return this.raw.PourLe;
  }

  public get done(): boolean {
    return this.raw.TAFFait;
  }
}