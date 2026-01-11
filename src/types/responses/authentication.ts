export interface InfoMobileResponse {
  modeModif: true;
  version:   number[];
  date:      Date;
  espaces:   InfoMobileSpace[];
  CAS:       rawCAS;
}

export interface rawCAS {
  actif:    boolean;
  casURL:   string;
  jetonCAS: string;
}

export interface InfoMobileSpace {
  nom:            string;
  URL:            string;
  genreEspace:    number;
  avecDelegation: boolean;
  protocole:      string;
}

export interface IdentificationResponse {
  alea?:       string;
  modeCompMdp: number;
  modeCompLog: number;
  challenge:   string;
}

export interface AuthentificationResponse {
  Acces?:                     number;
  actionsDoubleAuth?:         number[];
  modesPossibles?:            number[];
  libelleUtil?:               string;
  modeSecurisationParDefaut?: number;
  cle?:                       string;
  derniereConnexion?:         Date;
  reglesSaisieMDP?: {
    min:    number;
    max:    number;
    regles: number[];
  };
  codePINFixe?: boolean;
}
