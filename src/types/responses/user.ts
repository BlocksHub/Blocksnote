export type CommunParametresUtilisateurResponse = {
  ressource: CommunParametresUtilisateurRessource,
  listeInformationsEtablissements?: InformationsEtablissement[],
  listeOnglets: PronoteOnglet[],
  autorisations: CommunAutorisations,
}

export type CommunCompteAutorisation = {
  avecInformationsPersonnelles: boolean
}

export type ParentCompteAutorisation = CommunCompteAutorisation & {
  avecSaisieInfosPersoAutorisations: boolean,
  avecSaisieInfosPersoCoordonnees: boolean
}

export type CompteAutorisation= CommunCompteAutorisation | ParentCompteAutorisation

export type CommunAutorisations = {
  AvecDiscussion: boolean,
  AvecDiscussionPersonnels: boolean,
  AvecDiscussionProfesseurs: boolean,
  autoriserImpressionBulletinReleveBrevet: boolean,
  compte: CommunCompteAutorisation,
  consulterDonneesAdministrativesAutresEleves: boolean,
  tailleCirconstance: number,
  tailleCommentaire: number,
  tailleMaxDocJointEtablissement: number,
  tailleTravailAFaire: number
}

export type ParentAutorisations = CommunAutorisations & {
  AvecDeclarerDispenseLongue: boolean,
  AvecDeclarerDispensePonctuelle: boolean,
  AvecDeclarerUneAbsence: boolean,
  AvecDiscussionParents: boolean,
  accesDecrochage: boolean,
  autoriserImpressionBulletinReleveBrevet: boolean,
  compte: ParentCompteAutorisation
}

export type EleveAutorisations = CommunAutorisations & {
  tailleMaxRenduTafEleve: number,
}

export type EleveParametresUtilisateurResponse = CommunParametresUtilisateurResponse & {
  ressource: EleveParametresUtilisateurRessource,
  autorisations: EleveAutorisations,
}

export type ParentParametresUtilisateurResponse = CommunParametresUtilisateurResponse & {
  ressource: ParentParametresUtilisateurRessource,
  autorisations: ParentAutorisations,
}

export type ParametresUtilisateurResponse = CommunParametresUtilisateurResponse | EleveParametresUtilisateurResponse | ParentParametresUtilisateurResponse

export type CommunParametresUtilisateurRessource = PronoteLabel & {
  Etablissement: PronoteLabel
  listeNumerosUtiles: (PronoteLabel & NumeroUtile)[]
  avecPhoto: boolean
  photoBase64?: number,
  listeOngletsPourPeriodes?: PeriodeOnglet[]
  listeOngletsPourPiliers?: PilierOnglet[]
}

export type EleveParametresUtilisateurRessource = CommunParametresUtilisateurRessource & {
  classeDEleve: PronoteLabel
  listeClassesHistoriques: PronoteClasse[]
  listeGroupes: PronoteLabel[]
}

export type ParentParametresUtilisateurRessource = CommunParametresUtilisateurRessource & {
  listeClassesDelegue: PronoteLabel[],
  listeRessources: EleveParametresUtilisateurRessource[]
}

export type PronoteOnglet = PronoteType & {
  Onglet?: PronoteType[]
}

export type PronoteType = {
  G: number
}

export type PilierOnglet =  PronoteType & {
  listePaliers: PronotePalier[]
}

export type PronotePalier = PronoteLabel & {
  listePiliers: PronotePilier[]
}

export type PronotePilier = PronoteLabel & PronoteType & {
  estPilierLVE: boolean,
  estSocleCommun: boolean
}

export type PeriodeOnglet = PronoteType & {
  listePeriodes: PronotePeriode[],
  periodeParDefaut: PronoteLabel
}

export type PronotePeriode = PronoteLabel & {
  A: boolean,
  GenreNotation: number
}

export type PronoteClasse = PronoteLabel & {
  AvecFiliere: boolean,
  AvecNote: boolean,
  courant: boolean
}

export type ParametresUtilisateurRessource = CommunParametresUtilisateurRessource | EleveParametresUtilisateurRessource

export type NumeroUtile = {
  commentaire: string,
  estNrHarcelement: boolean,
  numeroTelBrut: string,
  numeroTelFormate: string,
  url: string
}

export type PronoteLabel = {
  label: string,
  id: string
}

export type InformationsEtablissement = PronoteLabel & {
  Coordonnees?: Coordonnees
  LibelleFichierCU?: string,
  LibelleFichierRI?: string,
  avecFichierCU?: boolean,
  avecFichierRI?: boolean,
  avecInformations?: boolean,
  avecReferentsHarcelementPublie?: boolean,
  listeReferentsHarcelement: ReferentHarcelement[]
}

export type Coordonnees = {
  Adresse1: string,
  Adresse2: string,
  Adresse3: string,
  Adresse4: string,
  CodePostal: string,
  EMailPersonnalise1?: MailEtablissement,
  EMailPersonnalise2?: MailEtablissement,
  LibellePostal: string,
  LibelleVille: string,
  NumPersonnalise1?: NumeroEtablissement,
  NumPersonnalise2?: NumeroEtablissement,
  NumPersonnalise3?: NumeroEtablissement,
  Pays: string,
  Province: string,
  SiteInternet: string
}

export type NumeroEtablissement = {
  NomPersonnalise: string,
  Numero: string
}

export type MailEtablissement = {
  Mail: string,
  NomPersonnalise: string
}

export type ReferentHarcelement = PronoteLabel & {
  avecDiscussion: boolean
}