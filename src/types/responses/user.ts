export interface ParametresUtilisateurResponse {
  ressource: ParametresUtilisateurRessource,
  listeInformationsEtablissements: InformationsEtablissements[],
  autorisations: ListeAutorisation,
  listeOnglets: ListeOngletItem[],
  listeClasses: ListeClasse[]
}

export interface ListeClasse extends Label {
  estResponsable?: boolean;
  enseigne?: boolean;
  niveau?: Label;
}

export interface ListeAutorisation {
    AvecDiscussion:                              boolean;
    discussionDesactiveeSelonHoraire:            boolean;
    messageDiscussionDesactiveeSelonHoraire:     boolean;
    AvecDiscussionPersonnels:                    boolean;
    AvecDiscussionProfesseurs:                   boolean;
    AvecSaisieObservationsParents:               boolean;
    tailleMaxDocJointEtablissement:              number;
    tailleMaxRenduTafEleve:                      number;
    tailleTravailAFaire:                         number;
    tailleCirconstance:                          number;
    tailleCommentaire:                           number;
    consulterDonneesAdministrativesAutresEleves: boolean;
    compte:                                      Compte;
    autoriserImpressionBulletinReleveBrevet:     boolean;
    
    AutoriserCommunicationsToutesClasses?: boolean;
    AvecDiscussionAvancee?: boolean;
    AvecDiscussionParents?: boolean;
    AvecSaisieActualite?: boolean;
    AvecSaisieAgenda?: boolean;
    ConsulterFichesResponsables?: boolean;
    ConsulterIdentiteEleve?: boolean;
    ConsulterPhotosEleves?: boolean;
    VoirTousLesEleves?: boolean;
    avecDroitDeconnexionMessagerie?: boolean;
    avecMessageInstantane?: boolean;
    avecPublicationPageEtablissement?: boolean;
    avecSaisieDocumentsCasiersIntervenant?: boolean;
    avecSaisieDocumentsCasiersResponsable?: boolean;
    intendance: IntendanceAutorisation;
    lancerAlertesPPMS?: boolean;
    voirAbsencesEtRemplacementsProfs?: boolean;
}

export interface IntendanceAutorisation {
  avecDemandeCommandes?: boolean;
  avecDemandeTachesInformatique?: boolean;
  avecDemandeTachesSecretariat?: boolean;
  avecDemandeTravauxIntendance?: boolean;
  avecExecutionCommandes?: boolean;
  avecExecutionTachesInformatique?: boolean;
  avecExecutionTachesSecretariat?: boolean;
  avecExecutionTravauxIntendance?: boolean;
  avecGestionCommandes?: boolean;
  avecGestionTachesInformatique?: boolean;
  avecGestionTravauxIntendance?: boolean;
}

export interface Compte {
    avecSaisieMotDePasse:         boolean;
    avecInformationsPersonnelles: boolean;
    avecSaisieInfosPersoAutorisations?: boolean;
    avecSaisieInfosPersoCoordonnees: boolean;
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
