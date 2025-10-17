export interface InfoMobileResponse {
  modeModif: true,
  version: number[],
  date: Date,
  espaces: InfoMobileSpace[],
  CAS: rawCAS
}

export interface rawCAS {
  actif: boolean,
  casURL: string,
  jetonCAS: string
}

export interface InfoMobileSpace {
  nom: string,
  url: string,
  genreEspace: number,
  avecDelegation: boolean,
  protocole: string
}

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
  type: NOTSpace
}

export interface CAS {
  url: string,
  token: string
}