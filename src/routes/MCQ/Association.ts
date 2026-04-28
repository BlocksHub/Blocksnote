import type { PronoteAssociation, PronoteReponse } from "@/types/responses/mcq";
import type { Base64 } from "@/types/user";
import type { AudioFile } from "@/types/mcq";
import type { Question } from "./Question";

export class Association {
  constructor(
    private raw: PronoteReponse,
    private question: Question,
    private association?: PronoteAssociation
  ) {}

  public get label(): string {
    return this.association?.strTexte
      ?? this.association?.strLibelleSon
      ?? this.association?.strLibelleImage
      ?? ""
  }

  public get hash(): string | number {
    return this.association?.hashContenu
      ?? this.raw.P
  }

  public get image(): Base64<"image/png"> | undefined {
    return this.association?.strImage ? this.question.files[this.association.strImage]! as Base64<"image/png"> : undefined
  }

  public get mp3(): AudioFile | undefined {
    return this.association?.strSon
      ? { label: this.association.strLibelleSon!, base64: this.question.files[this.association.strSon]! as Base64<"audio/mpeg">}
      : undefined
  }
}