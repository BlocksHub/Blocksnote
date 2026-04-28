import { Request } from "@/structures/network/Request";
import { Parser } from "@/structures/parsing/Parser";
import type { ListeQuestionsQCMResponse, PronoteQuestion } from "@/types/responses/mcq";
import type { MCQ } from "./Common";
import type { Session } from "@/structures/Session";
import { QuestionType, type AudioFile, type QuestionTypeValue } from "@/types/mcq";
import type { Base64 } from "@/types/user";
import { Answer } from "./Answer";
import { Association } from "./Association";

export class Question {
  constructor(
    private raw: PronoteQuestion,
    private session: Session,
    public mcq: MCQ,
    public files: string[]
  ){}

  public static async load(session: Session, index: number, mcq: MCQ): Promise<Question> {
    const request = new Request()
      .setPronotePayload(session, "ListeQCMQuestions", {
        action:             "get",
        ...Parser.encodeKind("element", 56, mcq.id),
        indiceQuestion:     index,
        numeroExecution:    mcq.id,
        pourInitialisation: mcq.isStarted
      }, { onglet: 7 })
    const response = await session.manager.enqueueRequest<ListeQuestionsQCMResponse>(request);

    if (!response.data.QCM.listeQuestions[0]) throw new Error("Unable to retrieve this question from MCQ " + mcq.id);
    return new Question(
      response.data.QCM.listeQuestions.find((q) => q.P === index)!,
      session,
      mcq,
      response.ressources?.fichiers ?? []
    );
  }

  public async answer(
    item: string | number | Answer | Association | (string | number | Answer | Association)[]
  ) {
    const items = [item].flat();
    const formattedAnswers: (string | number)[] = items.map((val) => {
      if (val instanceof Answer) return val.index;
      if (val instanceof Association) return val.hash;
      return val as (string | number);
    });

    const request = new Request()
      .setPronotePayload(this.session, "SaisieQCMReponses", {
        ...Parser.encodeKind("executionQCM", 56, this.mcq.id),
        indiceQuestion: this.raw.P,
        reponse:        formattedAnswers
      }, {
        onglet: 7
      });

    return await this.session.manager.enqueueRequest(request);
  }

  public get id(): string { return this.raw.id }

  public get type(): QuestionTypeValue { return this.raw.G }

  public get isCaseSensitive(): boolean { return this.raw.casesensitive }

  public get isRequired(): boolean { return this.raw.estObligatoire }

  public get instruction(): string { return this.raw.enonce }

  public get title(): string { return this.raw.label ?? undefined }

  public get image(): Base64<"image/png"> | undefined {
    return this.raw.image ? this.files[this.raw.image]! as Base64<"image/png"> : undefined
  }

  public get mp3(): AudioFile | undefined {
    return this.raw.mp3
      ? { label: this.raw.mp3name!, base64: this.files[this.raw.mp3]! as Base64<"audio/mpeg">}
      : undefined
  }

  public get url(): URL | undefined {
    return this.raw.url
      ? new URL(this.raw.url)
      : undefined
  }

  public get answers(): Answer[] {
    if (this.type === QuestionType.MATCHING) return [];
    return (this.raw.listeReponses ?? []).map((a) => new Answer(a, this));
  }

  public get matchingItems(): Association[] {
    if (this.type !== QuestionType.MATCHING) return [];
    return (this.raw.listeReponses ?? []).map((a) => new Association(a, this, a.associationA));
  }

  public get matchingChoices(): Association[] {
    if (this.type !== QuestionType.MATCHING) return [];
    return (this.raw.listeReponses ?? []).map((a) => new Association(a, this, a.associationB));
  }
}