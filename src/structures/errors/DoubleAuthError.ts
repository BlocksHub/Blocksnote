import type { PasswordRules } from "../../utils/constants";
import type { AccountSecurity } from "../AccountSecurity";

export class DoubleAuthError extends Error {
    public readonly context;
    public readonly options?;

    constructor(message: string, context: AccountSecurity, options?: { pin?: string, failedRules?: PasswordRules[] }) {
        super(message);
        this.name = "DoubleAuthError";
        this.context = context;
        this.options = options;
    }
}