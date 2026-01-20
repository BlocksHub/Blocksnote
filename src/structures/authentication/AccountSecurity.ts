import type { AuthentificationResponse } from "../../types/responses/authentication";
import { AuthenticationError } from "../errors/AuthenticationError";
import { Request } from "../network/Request";
import type { Session } from "../Session";

export class AccountSecurity {
  private _password?: string;

  private _pin?: string;

  private _device?: string;

  private _mode?: number;

  constructor(
    public readonly session: Session,
    private readonly raw: AuthentificationResponse
  ){}

  private get modes(): number[] {
    return this.raw.modesPossibles ?? [];
  }

  private payload(action: number) {
    const payload: Record<string, unknown> = {
      action
    }

    if (this._mode !== undefined) payload.mode = this._mode;
    if (this._pin !== undefined) payload.codePin = this._pin;
    if (this._password) payload.nouveauMDP = this._password;
    if (this._device !== undefined) {
      payload.avecIdentification = true;
      payload.strIdentification = this._device;
    }

    return payload
  }

  protected useMode(mode: number): this {
    this._mode = mode;
    return this;
  }

  /** @internal */
  public async execute(): Promise<this> {
    if (!this._device && !this._pin && !this._mode && this._password) return this;

    const _request = new Request()
      .setPronotePayload(
        this.session,
        "SecurisationCompteDoubleAuth",
        this.payload(3)
      )

    const _response = await this.session.manager.enqueueRequest(_request);
    if ((_response.signature as { Erreur?: unknown })?.Erreur) {
      throw new AuthenticationError("Unable to execute security actions")
    }

    return this;
  }

  public get mustChangePassword(): boolean {
    return this.raw?.actionsDoubleAuth?.includes(0) ?? false;
  }

  public get mustEnterPIN(): boolean {
    return this.raw?.actionsDoubleAuth?.includes(3) ?? false;
  }

  public get mustUpdatePIN(): boolean {
    return this.mustEnterPIN ? false : this.modes.includes(3);
  }

  public password(input: string): this {
    this._password = this.session.aes.encrypt(input);
    return this;
  }

  public pin(input: string): this {
    this._pin = this.session.aes.encrypt(input);

    if (this.mustUpdatePIN) {
      this.useMode(3);
    }

    return this;
  }

  public register(device: string): this {
    this._device = device;
    return this;
  }

  public validatePassword(input: string): boolean {
    const rules = this.rules;
    const length = input.length;

    if (length < rules.minimumLength || length > rules.maximumLength) {
      return false;
    }

    if (rules.atLeastOneLetter && !/[a-z]/i.test(input)) {
      return false;
    }
    if (rules.atLeastOneNumber && !/\d/.test(input)) {
      return false;
    }
    if (rules.atLeastOneSpecialCharacter && !/[^a-z0-9]/i.test(input)) {
      return false;
    }
    if (rules.mustMixUpperAndLowerCase && (!/[a-z]/.test(input) || !/[A-Z]/.test(input))) {
      return false;
    }

    return true;
  }

  public get rules(): PasswordRules {
    const rawRules = this.raw?.reglesSaisieMDP?.regles
    return {
      atLeastOneLetter:              rawRules?.includes(0) ?? false,
      atLeastOneNumber:              rawRules?.includes(1) ?? false,
      atLeastOneSpecialCharacter:    rawRules?.includes(2) ?? false,
      mustMixUpperAndLowerCase:      rawRules?.includes(3) ?? false,
      minimumLength:                 this.raw?.reglesSaisieMDP?.min ?? 0,
      maximumLength:                 this.raw?.reglesSaisieMDP?.max ?? 32
    }
  }
}

export type PasswordRules = {
  atLeastOneLetter:           boolean;
  atLeastOneNumber:           boolean;
  atLeastOneSpecialCharacter: boolean;
  mustMixUpperAndLowerCase:   boolean;
  minimumLength:              number;
  maximumLength:              number;
}