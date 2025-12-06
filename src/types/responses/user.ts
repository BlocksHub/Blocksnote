export interface ParametresUtilisateurResponse {
  ressource: ParametresUtilisateurRessource,
  listeInformationsEtablissements: InformationsEtablissements[],
  listeOnglets: ListeOngletItem[]
}

export interface ListeOngletItem {
  G: number,
  Onglet?: ListeOngletItem[]
}

export interface InformationsEtablissements extends Label {
  urlLogo: string,
  avecInformations: boolean,
  avecFichierCU: boolean,
  avecFichierRI: boolean,
  LibelleFichierCU: string,
  LibelleFichierRI: string,
  Coordonnees: CoordonneesEtablissement,
  listeReferentsHarcelement: EtablissementReferentHarcelement[]
}

interface EtablissementReferentHarcelement {
  avecDiscussion: boolean,
  label: string,
  id: string
}

export interface CoordonneesEtablissement {
  Adresse1: string,
  Adresse2: string,
  Adresse3: string,
  Adresse4: string,
  CodePostal: string,
  LibellePostal: string,
  LibelleVille: string,
  Pays: string,
  Province: string,
  SiteInternet: string,
  EMailPersonnalise1?: MailCoordonnees,
  EMailPersonnalise2?: MailCoordonnees,
  NumPersonnalise1?: NumeroCoordonnees,
  NumPersonnalise2?: NumeroCoordonnees,
  NumPersonnalise3?: NumeroCoordonnees
}

export interface MailCoordonnees {
  NomPersonnalise: string,
  Mail: string
}

interface NumeroCoordonnees {
  estNrHarcelement: unknown
  NomPersonnalise: string,
  Numero: string,
}

export interface NumeroUtile {
  numeroTelBrut: string,
  numeroTelFormate: string,
  estNrHarcelement: boolean,
  url: string,
  label: string
}

export interface ClasseHistorique extends Label {
  courant: boolean,
  AvecNote: boolean,
  AvecFiliere: boolean,
}

export interface ParametresUtilisateurRessource {
  Etablissement: Label,
  avecPhoto?: boolean,
  photoBase64: number,
  listeGroupes?: Label[],
  listeClassesHistoriques?: ClasseHistorique[],
  listeNumerosUtiles?: Array<NumeroUtile>,
  listeOngletsPourPeriodes?: ListePeriode[]
  passeLeBrevet: boolean
}

export interface ListePeriode {
  G: number
  listePeriodes: Array<{
    G: number;
    A: boolean;
    GenreNotation: number;
    label: string;
    id: string;
  }>
}

export interface Label {
  label: string,
  id: string,
}
