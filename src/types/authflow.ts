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

export enum LoginState {
  NOT_LOGGED_IN,
  SHOULD_CUSTOM_PASSWORD,
  DOUBLE_AUTH_REQUIRED,
  LOGGED_IN
}
