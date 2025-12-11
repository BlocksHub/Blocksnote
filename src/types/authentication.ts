import type { AccountSecurity } from "../structures/authentication/AccountSecurity"
import type { Session } from "../structures/Session"

export enum NOTSpace {
  DIRECTION = 17,
  SCHOOL_LIFE = 14,
  ACCOMPANYING = 26,
  ENTERPRISE = 39,
  STUDENT = 6,
  PARENT = 7,
  TEACHER = 8
}

export interface Workspace {
  delegated: boolean,
  name: string,
  url: string,
  type: NOTSpace
}

export interface CAS {
  url: string,
  token: string
}

export type LoginState =
  | { type: "WORKSPACE_SELECTION", available: Workspace[] }
  | { type: "WAITING_CREDENTIALS" }
  | { type: "DOUBLE_AUTH", security: AccountSecurity }
  | { type: "CREDENTIALS_CHANGE", security: AccountSecurity }
  | { type: "LOGGED_IN", session: Session }