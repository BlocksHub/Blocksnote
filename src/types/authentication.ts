export enum NOTSpace {
  ADMINISTRATOR = 17,
  SCHOOL_LIFE = 14,
  ACCOMPANYING = 26,
  ENTERPRISE = 39,
  STUDENT = 6,
  PARENT = 7,
  TEACHER = 8
}

export interface Workspace {
  delegated: boolean;
  url:       string;
  name:      string;
  type:      NOTSpace;
}

export interface CAS {
  url:   string;
  token: string;
}
