import { Request } from "@/structures/network/Request";
import type { User } from "@/structures/users/User";
import type { DifficultyLevel, SubmissionType } from "@/types/homework";
import type { CommunDevoirResponse, Devoir } from "@/types/responses/notebook";

export class Homework {
  constructor(
    private raw: Devoir
  ) {}

  public static async load(
    user: User,
    from: Date = new Date(),
    to: Date = new Date()
  ) {
    const domains: string = `[${user.weeknumber(from)}..${user.weeknumber(to)}]`;
    const request = new Request().setPronotePayload(
      user.session,
      "PageCahierDeTexte",
      { domaine: { _T: 8, V: domains } },
      { onglet: 88 }
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