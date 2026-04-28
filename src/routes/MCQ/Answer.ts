import type { PronoteReponse } from "@/types/responses/mcq";
import type { Question } from "./Question";

export class Answer {
  constructor(
    protected raw: PronoteReponse,
    protected question: Question
  ) {}

  public get label(): string {
    return this.raw.label!
  }

  public get index(): number {
    return this.raw.P + 1;
  }

  public get choices(): string[] {
    return this.raw.listeChoix ?? [];
  }
}