import { Request } from "@/structures/network/Request";
import { Homework } from "./Common";

export class StudentHomework extends Homework {
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
}