import type { LoginState } from "../types/authentication";
import { DoubleAuthModes, type DoubleAuthMode, PasswordRules } from "../utils/constants";
import type { Authenticator } from "./Authenticator";
import { AuthenticationError } from "./errors/AuthenticationError";
import { DoubleAuthError } from "./errors/DoubleAuthError";
import { Request } from "./network/Request";
import { Session } from "./Session";

export class AccountSecurity {
  constructor(
    public authenticator: Authenticator,
    public session: Session,
    public minPasswordLength = 0,
    public maxPasswordLength = 0,
    public rules: PasswordRules[] = [],
    public availableModes: DoubleAuthMode[] = [],
    public currentMode: number,
    public requirePin: boolean,
    public canUpdatePin: boolean = !this.requirePin,
    public remainingRetry: number = 3,
  ) {
    this.canUpdatePin = this.availableModes.includes(DoubleAuthModes.PIN);
  }

  public setAuthMode(mode: DoubleAuthMode): AccountSecurity {
    this.currentMode = mode;
    return this;
  }

  public async updatePassword(password: string, options?: { deviceName: string, pin: string }): Promise<LoginState> {
    this.validatePassword(password)

    const encrypted = this.session.aes.encrypt(password)
    if (this.requirePin) {
      if (!options?.pin) throw new DoubleAuthError("A PIN is required to update password in this mode.", this);
      await this._validePin(options.pin);
    }

    if (options) await this._registerDevice(options.deviceName);

    await this.session.manager.enqueueRequest<{ result: boolean }>(new Request()
      .setPronotePayload(this.session, "SecurisationCompteDoubleAuth", this._buildPayloadAuth({
        action: 3,
        password: encrypted,
        pin: options?.pin ? this.session.aes.encrypt(options?.pin) : undefined,
        deviceName: options?.deviceName
      }))
    )

    this.authenticator.state = { type: "LOGGED_IN", session: this.session };
    return this.authenticator.state;
  }

  public async submitPin(pin: string, deviceName: string): Promise<LoginState> {
    if (pin.length < 4) throw new DoubleAuthError("You PIN must be at least 4 characters", this, { pin });
    if (this.remainingRetry <= 0) throw new AuthenticationError("This session is no longer active");

    const encrypted = this.session.aes.encrypt(pin);
    await this._validePin(pin);

    await this._registerDevice(deviceName);

    await this.session.manager.enqueueRequest<{ result: boolean }>(new Request()
      .setPronotePayload(this.session, "SecurisationCompteDoubleAuth", this._buildPayloadAuth({ action: 3, mode: DoubleAuthModes.PIN, pin: encrypted, deviceName }))
    )

    this.authenticator.state = { type: "LOGGED_IN", session: this.session };
    return this.authenticator.state;
  }

  public validatePassword(password: string): boolean {
    const failedRules: PasswordRules[] = []
    const validators: Record<PasswordRules, { test: () => boolean; message: string }> = {
      [PasswordRules.LETTER]: {
        test: () => /[a-z]/i.test(password),
        message: "Password must contain at least one letter"
      },
      [PasswordRules.NUMBER]: {
        test: () => /\d/.test(password),
        message: "Password must contain at least one number"
      },
      [PasswordRules.UPPER_AND_LOWER_CASE]: {
        test: () => /[a-z]/.test(password) && /[A-Z]/.test(password),
        message: "Password must contain both uppercase and lowercase letters"
      },
      [PasswordRules.SPECIAL_CHARACTER]: {
        test: () => /[^a-z0-9]/i.test(password),
        message: "Password must contain at least one special character"
      },
      [PasswordRules.MINIMUM_CHARACTERS]: {
        test: () => password.length >= this.minPasswordLength,
        message: `Password must be at least ${this.minPasswordLength} characters long`
      },
      [PasswordRules.MAXIMUM_CHARACTERS]: {
        test: () => password.length <= this.minPasswordLength,
        message: `Password must not exceed ${this.maxPasswordLength} characters`
      }
    };

    for (const rule of this.rules) {
      const validator = validators[rule];
      if (validator && !validator.test()) {
        failedRules.push(rule);
      }
    }

    if (failedRules.length > 0) {
      throw new DoubleAuthError(`The password does not meet the establishment's rules.`, this, { failedRules });
    }

    return true;
  }

  private _buildPayloadAuth(options: { action: number, mode?: number, password?: string, pin?: string, deviceName?: string }) {
    const payload: {
      action: number,
      mode?: number,
      nouveauMDP?: string,
      codePin?: string,
      avecIdentification?: boolean,
      strIdentification?: string,
      libelle?: string
    } = { action: options.action };
    if (this.availableModes.length > 1 || options.mode || this.currentMode !== DoubleAuthModes.DISABLED) payload.mode = options.mode ?? this.currentMode;
    if (options.password) payload.nouveauMDP = options.password;
    if (options.pin) payload.codePin = options.pin;
    if (options.deviceName && options.pin) {
      payload.avecIdentification = true;
      payload.strIdentification = options.deviceName;
    } else if (options.deviceName && !options.pin) {
      payload.libelle = options.deviceName;
    }

    return payload;
  }

  private async _validePin(pin: string) {
    const verification = (await this.session.manager.enqueueRequest<{ result: boolean }>(new Request()
      .setPronotePayload(this.session, "SecurisationCompteDoubleAuth", this._buildPayloadAuth({ action: 0, mode: this.currentMode, pin: this.session.aes.encrypt(pin) }))
    )).data

    if (!verification.result) {
      this.remainingRetry--
      throw new DoubleAuthError("The PIN you entered is invalid.", this, { pin })
    }
  }

  private async _registerDevice(name: string) {
    if (!this.availableModes.includes(DoubleAuthModes.PIN)) throw new Error("You doesn't have the rights to register a new device.")

    const deviceName = name.slice(0, 30)
    await this.session.manager.enqueueRequest(new Request()
      .setPronotePayload(this.session, "SecurisationCompteDoubleAuth", this._buildPayloadAuth({ action: 2, deviceName }))
      .setPronotePayload(this.session, "SecurisationCompteDoubleAuth", {
        action: 2,
        libelle: deviceName
      })
    )
  }
}
