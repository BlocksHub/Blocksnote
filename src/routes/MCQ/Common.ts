import type { Session } from "@/structures/Session";
import type { ClosureStateValue, DistributionModeValue } from "@/types/mcq";
import type { CommunExecutionQCMResponse, CommunValidationQCMResponse } from "@/types/responses/mcq";
import { Question } from "./Question";
import { Request } from "@/structures/network/Request";
import { Parser } from "@/structures/parsing/Parser";

export class MCQ {
  constructor(
    private raw: CommunExecutionQCMResponse,
    private session: Session
  ) {}

  public async questions(index: number): Promise<Question> {
    return Question.load(this.session, index, this);
  }

  public async finalize(): Promise<ClosureStateValue> {
    const request = new Request()
      .setPronotePayload(this.session, "SaisieQCMReponses", {
        ...Parser.encodeKind("executionQCM", 56, this.raw.id),
        pourCloture: 1
      }, { onglet: 7 })
    const response = await this.session.manager.enqueueRequest<CommunValidationQCMResponse>(request)
    return response.data.etatCloture;
  }

  public get title(): string { return this.raw.QCM.label; }

  public get id(): string { return this.raw.id; }

  public get totalQuestions(): number { return this.raw.QCM.nbQuestionsTotal; }

  public get totalSkills(): number { return this.raw.QCM.nbCompetencesTotal; }

  public get totalRequiredQuestions(): number { return this.raw.QCM.nombreQuestObligatoires; }

  public get maxScore(): number { return this.raw.QCM.nombreDePointsTotal; }

  public get themes(): string[] { return this.raw.ListeThemes.map((t) => t.label); }

  public get isFileAvailable(): boolean { return this.raw.fichierDispo; }

  public get isPublished(): boolean { return this.raw.estEnPublication; }

  public get startAt(): Date { return this.raw.dateDebutPublication; }

  public get endAt(): Date { return this.raw.dateFinPublication; }

  public get instructions(): string { return this.raw.consigne; }

  public get isAssignedHomework(): boolean { return this.raw.estLieADevoir; }

  public get isAssignedEvaluation(): boolean { return this.raw.estLieAEvaluation; }

  public get isHomework(): boolean { return this.raw.estUnTAF; }

  public get isActivity(): boolean { return this.raw.estUneActivite; }

  public get isDeletable(): boolean { return this.raw.estSupprimable; }

  public get isStarted(): boolean { return this.raw.estDemarre ?? false; }

  public get isFinished(): boolean { return this.raw.estFini ?? false; }

  public get totalQuestionAnswered(): number { return this.raw.nbQuestRepondues ?? 0; }

  public get totalCorrectQuestion(): number { return this.raw.nbQuestBonnes ?? 0; }

  public get canNavigate(): boolean { return this.raw.autoriserLaNavigation; }

  public get state(): ClosureStateValue | undefined { return this.raw.etatCloture; }

  public get shuffleGlobal(): boolean { return this.raw.melangerLesQuestionsGlobalement; }

  public get shuffleByLevel(): boolean { return this.raw.melangerLesQuestionsParNiveau; }

  public get shuffleAnswers(): boolean { return this.raw.melangerLesReponses; }

  public get isFixedQuestionSet(): boolean { return this.raw.jeuQuestionFixe; }

  public get homogenizeByLevel(): boolean { return this.raw.homogeneiserNbQuestParNiveau; }

  public get durationLimit(): number { return this.raw.dureeMaxQCM; }

  public get maxAttempts(): number { return this.raw.nbMaxTentative; }

  public get submittedQuestionsCount(): number { return this.raw.nombreQuestionsSoumises; }

  public get showScore(): boolean { return this.raw.afficherResultatNote; }

  public get showMasteryLevel(): boolean { return this.raw.afficherResultatNiveauMaitrise; }

  public get showCorrection(): boolean { return this.raw.publierCorrige; }

  public get correctionMode(): DistributionModeValue { return this.raw.modeDiffusionCorrige; }

  public get correctionDate(): Date { return this.raw.dateCorrige; }

  public get allowIncomplete(): boolean { return this.raw.acceptIncomplet; }

  public get tolerateWrongAnswers(): boolean { return this.raw.tolererFausses; }

  public get scoreBasedOnPercentage(): boolean { return this.raw.pointsSelonPourcentage; }

  public get studentScore(): number { return this.raw.nombreDePoints; }

  public get feedbackEnabled(): boolean { return this.raw.ressentiRepondant; }

  public get subject(): string { return this.raw.matiere.label; }

  public get teachers(): string[] { return this.raw.listeProfesseurs.map((p) => p.label); }

  public get publicName(): string { return this.raw.nomPublic; }

  public get hasExistingSubmission(): boolean { return this.raw.existeExecutionEleve ?? false; }
}