import { Request } from "@/structures/network/Request";
import { Homework } from "./Common";
import type { FileUploadReponse } from "@/types/responses/notebook";
import { MCQ } from "../MCQ/Common";

export class StudentHomework extends Homework {
  public async deleteAttachment(): Promise<this> {
    const request = new Request()
      .setPronotePayload(this.session, "SaisieTAFARendreEleve", {
        listeFichiers: [
          {
            E:         3,
            TAF:       { N: this.id }
          }
        ]
      }, { onglet: 7 });

    await this.session.manager.enqueueRequest(request);

    this.raw.TAFFait = false;
    return this;
  }

  public async submitAttachment(attachment: File): Promise<this> {
    const id = `selecfile_${Date.now().toString()}`;
    const uploadReq = await (new Request()).setPronoteUploadPayload(this.session, "SaisieTAFARendreEleve", attachment, id);
    const uploadRes = (await this.session.manager.enqueueRequest(uploadReq)).raw as FileUploadReponse;

    if (uploadRes.etat !== 1) throw new Error("Unkown Error during file upload");

    const request = new Request()
      .setPronotePayload(this.session, "SaisieTAFARendreEleve", {
        listeFichiers: [
          {
            E:         1,
            G:         attachment.type.includes("audio") ? 48 : 1,
            idFichier: id,
            L:         attachment.name,
            N:         -1000,
            TAF:       { N: this.id }
          }
        ]
      }, { onglet: 7 });

    await this.session.manager.enqueueRequest(request);

    this.raw.TAFFait = true;
    return this;
  }

  public async markAsDone(done: boolean = !this.done): Promise<this> {
    const request = new Request().setPronotePayload(
      this.session,
      "SaisieTAFFaitEleve",
      { listeTAF: [{ N: this.id, TAFFait: done }] },
      { onglet: 7 }
    );

    await this.session.manager.enqueueRequest(request);

    this.raw.TAFFait = done;
    return this;
  }

  public get mcq(): MCQ | undefined {
    return this.raw.executionQCM
      ? new MCQ(this.raw.executionQCM, this.session)
      : undefined;
  }
}