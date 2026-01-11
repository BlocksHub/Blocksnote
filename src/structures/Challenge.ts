import type { Session } from "./Session";
import { Request } from "./network/Request";
import type { IdentificationResponse } from "../types/responses/authentication";
import { bytesToHex, utf8ToBytes } from "@noble/hashes/utils.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { AuthenticationError } from "./errors/AuthenticationError";

export class Challenge {
  constructor(
    public username: string,
    private challenge: string,
    private seed: string
  ){}

  static async request(session: Session, username: string) {
    const request = new Request().setPronotePayload(session, "Identification", {
      demandeConnexionAppliMobile:      false,
      demandeConnexionAppliMobileJeton: false,
      demandeConnexionAuto:             false,
      enConnexionAppliMobile:           false,
      enConnexionAuto:                  false,
      genreConnexion:                   0,
      genreEspace:                      session.workspace.type,
      identifiant:                      username,
      informationsAppareil:             null,
      loginTokenSAV:                    "",
      pourENT:                          false,
      uuidAppliMobile:                  ""
    });

    const response = (await session.manager.enqueueRequest<IdentificationResponse>(request)).data;
    return new Challenge(username, response.challenge, response.alea ?? "")
  }

  public solveChallenge(session: Session, password: string): string {
    try {
      const tempKey = this.generateTempKey(password);
      session.aes.updateKey(utf8ToBytes(tempKey));

      const decrypted = session.aes.decrypt(this.challenge);
      const decoded = this.decodeChallenge(decrypted);
      const encrypted = session.aes.encrypt(decoded);

      session.aes.resetKey();
      return encrypted;
    } catch {
      throw new AuthenticationError("Unable to solve the challenge, please ensure that you provided the correct credentials.")
    }
  }

  private decodeChallenge(challenge: string): string {
    return challenge
      .split("")
      .filter((_, i) => i % 2 === 0)
      .join("");
  }

  public generateTempKey(password: string): string {
    const hash = sha256
      .create()
      .update(utf8ToBytes(this.seed ?? ""))
      .update(utf8ToBytes(password.trim()))
      .digest();

    return `${this.username}${bytesToHex(hash).toUpperCase()}`;
  }
}