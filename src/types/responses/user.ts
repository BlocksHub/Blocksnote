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

export type VieScolaireAutorisations = ProfesseurAutorisations & {
  AvecSaisieAbsenceRepas: boolean,
  AvecSaisieAbsencesGrilleAbsencesInternat: boolean,
  AvecSaisieAbsencesToutesPermanences: boolean,
  AvecSaisieSurGrilleAppelProf: boolean,
  DateSaisieAbsence: Date[],
  avecSaisieDocumentsCasiersIntervenant: boolean,
  discussionDesactiveeSelonHoraire: boolean,
  messageDiscussionDesactiveeSelonHoraire: string,
  intendance: VieScolaireIntendanceAutorisation,
}

export type ProfesseurAutorisations = EleveAutorisations & {
  AvecDiscussionParents: boolean,
  AutoriserCommunicationsToutesClasses: boolean,
  AvecConsultationDefautCarnet: boolean,
  AvecContactVS: boolean,
  AvecDiscussionAvancee: boolean,
  AvecDiscussionEleves: boolean,
  AvecPublicationPunitions: boolean,
  AvecSaisieAbsence: boolean,
  AvecSaisieActualite: boolean,
  AvecSaisieAgenda: boolean,
  AvecSaisieAppelEtVS: boolean,
  AvecSaisieAttestations: boolean,
  AvecSaisieCours: boolean,
  AvecSaisieDefautCarnet: boolean,
  AvecSaisieDevoirs: boolean,
  AvecSaisieEncouragements: boolean,
  AvecSaisieEvaluations: boolean,
  AvecSaisieExclusion: boolean,
  AvecSaisieHorsCours: boolean,
  AvecSaisieMotifRetard: boolean,
  AvecSaisieObservation: boolean,
  AvecSaisieObservationsParents: boolean,
  AvecSaisiePassageInfirmerie: boolean,
  AvecSaisieProjetIndividuel: boolean,
  AvecSaisiePunition: boolean,
  AvecSaisieRetard: boolean,
  AvecSaisieSurGrille: boolean,
  ConsulterFichesResponsables: boolean,
  ConsulterIdentiteEleve: boolean,
  ConsulterMemosEleve: boolean,
  ConsulterPhotosEleves: boolean,
  SaisirMemos: boolean,
  autoriserImpressionBulletinReleveBrevet: boolean,
  avecAccesALaListeDesDocumentEleve: boolean,
  avecAccesRemplacementsProfs: boolean,
  avecAnciennesFeuilleDAppel: boolean,
  avecCreationSujetForum: boolean,
  avecDroitDeconnexionMessagerie: boolean,
  avecMessageInstantane: boolean,
  avecModificationForumAPosteriori: boolean,
  avecPublicationListeDiffusion: boolean,
  avecPublicationPageEtablissement: boolean,
  avecSaisieCahierDeTexte: boolean,
  avecSaisieDispense: boolean,
  avecSaisieDocumentsCasiersIntervenant: boolean,
  avecSaisieDocumentsCasiersResponsable: boolean,
  avecSaisiePieceJointeCahierDeTexte: boolean,
  collecterDocsAupresDesEleves: boolean,
  collecterDocsAupresDesResponsables: boolean
  compte: ParentCompteAutorisation,
  cours: ProfesseurCoursAutorisations,
  estDestinataireChat: boolean,
  gererLaCollecteDeDocuments: boolean,
  intendance: ProfesseurIntendanceAutorisation,
  lancerAlertesPPMS: boolean,
  sePorterVolontaireRemplacement: boolean,
  voirAbsencesEtRemplacementsProfs: boolean
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

export type CommunCoursAutorisations = {
  domaineConsultationEDT: number[]
}

export type VieScolaireCoursAutorisations = CommunCoursAutorisations & {
  domaineModificationCours: number[],
  modifierElevesDetachesSurCoursDeplaceCreneauLibre: boolean,
}

export type ProfesseurCoursAutorisations = CommunCoursAutorisations & {
  afficherElevesDetachesDansCours: boolean,
  avecMateriel: boolean,
  modifierElevesDetachesSurCoursDeplaceCreneauLibre: boolean,
}

export type VieScolaireIntendanceAutorisation = {
  avecDemandeTachesInformatique: boolean,
  avecDemandeTravauxIntendance: boolean,
  avecExecutionTachesInformatique: boolean,
  avecExecutionTravauxIntendance: boolean
}

export type ProfesseurIntendanceAutorisation = VieScolaireIntendanceAutorisation & {
  avecDemandeTachesSecretariat: boolean,
  avecExecutionTachesSecretariat: boolean,
  avecGestionTachesInformatique: boolean,
  uniquementMesTachesSecretariat: boolean
}

export type EleveParametresUtilisateurResponse = CommunParametresUtilisateurResponse & {
  ressource: EleveParametresUtilisateurRessource,
  autorisations: EleveAutorisations,
}

export type ParentParametresUtilisateurResponse = CommunParametresUtilisateurResponse & {
  ressource: ParentParametresUtilisateurRessource,
  autorisations: ParentAutorisations,
}

export type ProfesseurParametresUtilisateurResponse = CommunParametresUtilisateurResponse & {
  listeClasses: ProfesseurPronoteClasse[]
  listeMatieres: PronoteMatiere[],
  listeNiveaux: PronoteLevel[],
  autorisations: ProfesseurAutorisations,
}

export type VieScolaireParametresUtilisateurResponse = CommunParametresUtilisateurResponse & {
  listeClasses: VieScolairePronoteClasse[]
  autorisations: VieScolaireAutorisations,
}

export type ParametresUtilisateurResponse = CommunParametresUtilisateurResponse | EleveParametresUtilisateurResponse | ParentParametresUtilisateurResponse | ProfesseurParametresUtilisateurResponse

export type CommunParametresUtilisateurRessource = PronoteLabel & {
  Etablissement: PronoteLabel
  listeNumerosUtiles?: (PronoteLabel & NumeroUtile)[]
  avecPhoto: boolean
  photoBase64?: number,
  listeOngletsPourPeriodes?: PeriodeOnglet[]
  listeOngletsPourPiliers?: PilierOnglet[]
}

export type EleveParametresUtilisateurRessource = CommunParametresUtilisateurRessource & {
  classeDEleve: PronoteLabel
  listeClassesHistoriques: ElevePronoteClasse[]
  listeGroupes: PronoteLabel[]
}

export type ParentParametresUtilisateurRessource = CommunParametresUtilisateurRessource & {
  listeClassesDelegue: PronoteLabel[],
  listeRessources: EleveParametresUtilisateurRessource[]
}

export type PronoteLevel = PronoteLabel & {
  estEnseignee: boolean
}

export type PronoteMatiere = PronoteLabel & {
  code: string,
  couleur: string,
  estEnseignee: boolean,
  estUtilise?: boolean
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

export type ElevePronoteClasse = PronoteLabel & {
  AvecFiliere: boolean,
  AvecNote: boolean,
  courant: boolean
}

export type ProfesseurPronoteClasse = PronoteLabel & {
  enseigne?: boolean,
  estFinDeCycle?: boolean,
  niveau?: PronoteLabel,
  estPrincipal?: boolean
}

export type VieScolairePronoteClasse = PronoteLabel & {
  estResponsable?: boolean,
  niveau?: PronoteLabel
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