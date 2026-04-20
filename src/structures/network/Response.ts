import { Parser } from "../../structures/parsing/Parser";
import { AccessDeniedError } from "../errors/AccessDeniedError";
import { RateLimitError } from "../errors/RateLimitError";
import { SessionExpiredError } from "../errors/SessionExpired";
import { SuspendedError } from "../errors/SuspendedError";
import { UnavailableError } from "../errors/UnavailableError";

export class Response<T> {
  constructor(
    public raw: unknown,
    public headers: Record<string, string>,
    public status: number,
    public data: T,
    public signature?: unknown,
    public ressources?: Ressources
  ) {
    if (typeof raw === "object" && raw !== null && "Erreur" in raw) {
      const erreur = raw.Erreur as Record<string, unknown>;

      if (typeof erreur === "object" && erreur !== null && "Titre" in erreur && typeof erreur.Titre === "string") {
        if (erreur.Titre.includes("La page a expir")) {
          throw new SessionExpiredError();
        } else if (erreur.Titre.includes("Votre adresse IP")) {
          throw new SuspendedError();
        } else if (erreur.Titre.includes("Vous avez d")) {
          throw new RateLimitError();
        } else if (erreur.Titre.includes("refus")) {
          throw new AccessDeniedError();
        } else if (erreur.Titre.includes("La page dem") || erreur.Titre.includes("Impossible d'a")) {
          throw new UnavailableError();
        }

        throw new Error(erreur.Titre)
      }
    }
    if (typeof data === "object") {
      this.data = Parser.parse(data);
    }
  }

  public header(key: string): string | undefined {
    return this.headers[key.toLowerCase()];
  }
}

export interface Ressources {
  fichiers?: string[];
}
