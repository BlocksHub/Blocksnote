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
  URL: string,
  genreEspace: number,
  avecDelegation: boolean,
  protocole: string
}