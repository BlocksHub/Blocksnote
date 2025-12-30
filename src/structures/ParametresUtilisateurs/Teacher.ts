import { CommonUserSettings } from "./Common";
import { Response } from "../network/Response";
import type { Session } from "../Session";
import type { Settings } from "../Settings";
import type { Base64, Level, Subject, TeacherClass, TeacherPermissions } from "../../types/user";
import type { ProfesseurParametresUtilisateurResponse } from "../../types/responses/user";

export class TeacherUserSettings extends CommonUserSettings<ProfesseurParametresUtilisateurResponse> {
  constructor(
    session: Session,
    raw: Response<ProfesseurParametresUtilisateurResponse>,
    ressource: ProfesseurParametresUtilisateurResponse['ressource'],
    settings: Settings
  ){
    super(session, raw, ressource, settings)
  }

public override get permissions(): TeacherPermissions {
  const common = super.permissions
  const authorizations = this.raw.data.autorisations

  return {
    ...common,
    size: {
      ...common.sizes,
      studentHomeworkMaxSize: authorizations.tailleMaxRenduTafEleve
    },
    canEditPersonalInfoAuthorizations: authorizations.compte.avecSaisieInfosPersoAutorisations,
    canEditPersonalInfoCoordinates: authorizations.compte.avecSaisieInfosPersoCoordonnees,
    canChatWithParents: authorizations.AvecDiscussionParents,
    canCommunicateWithAllClasses: authorizations.AutoriserCommunicationsToutesClasses,
    canViewDefaultNotebook: authorizations.AvecConsultationDefautCarnet,
    canContactSchoolLife: authorizations.AvecContactVS,
    canUseAdvancedDiscussion: authorizations.AvecDiscussionAvancee,
    canDiscussWithStudents: authorizations.AvecDiscussionEleves,
    canPublishPunishments: authorizations.AvecPublicationPunitions,
    canRecordAbsence: authorizations.AvecSaisieAbsence,
    canRecordNews: authorizations.AvecSaisieActualite,
    canRecordAgenda: authorizations.AvecSaisieAgenda,
    canRecordAttendanceAndSchoolLife: authorizations.AvecSaisieAppelEtVS,
    canRecordCertificates: authorizations.AvecSaisieAttestations,
    canRecordLessons: authorizations.AvecSaisieCours,
    canRecordDefaultNotebook: authorizations.AvecSaisieDefautCarnet,
    canRecordHomework: authorizations.AvecSaisieDevoirs,
    canRecordEncouragements: authorizations.AvecSaisieEncouragements,
    canRecordExclusion: authorizations.AvecSaisieExclusion,
    canRecordOutOfClass: authorizations.AvecSaisieHorsCours,
    canRecordLatenessReason: authorizations.AvecSaisieMotifRetard,
    canRecordObservation: authorizations.AvecSaisieObservation,
    canRecordParentObservations: authorizations.AvecSaisieObservationsParents,
    canRecordNurseVisit: authorizations.AvecSaisiePassageInfirmerie,
    canRecordIndividualProject: authorizations.AvecSaisieProjetIndividuel,
    canRecordPunishment: authorizations.AvecSaisiePunition,
    canRecordLateness: authorizations.AvecSaisieRetard,
    canRecordOnGrid: authorizations.AvecSaisieSurGrille,
    canViewGuardianFiles: authorizations.ConsulterFichesResponsables,
    canViewStudentIdentity: authorizations.ConsulterIdentiteEleve,
    canViewStudentMemos: authorizations.ConsulterMemosEleve,
    canViewStudentPhotos: authorizations.ConsulterPhotosEleves,
    canRecordMemos: authorizations.SaisirMemos,
    canPrintReportCardAndCertificate: authorizations.autoriserImpressionBulletinReleveBrevet,
    canAccessStudentDocumentList: authorizations.avecAccesALaListeDesDocumentEleve,
    canAccessTeacherReplacements: authorizations.avecAccesRemplacementsProfs,
    canAccessOldAttendanceSheets: authorizations.avecAnciennesFeuilleDAppel,
    canCreateForumTopics: authorizations.avecCreationSujetForum,
    canDisconnectMessaging: authorizations.avecDroitDeconnexionMessagerie,
    canUseInstantMessaging: authorizations.avecMessageInstantane,
    canModifyForumAfterPosting: authorizations.avecModificationForumAPosteriori,
    canPublishToMailingList: authorizations.avecPublicationListeDiffusion,
    canPublishToSchoolPage: authorizations.avecPublicationPageEtablissement,
    canRecordClassNotebook: authorizations.avecSaisieCahierDeTexte,
    canRecordExemption: authorizations.avecSaisieDispense,
    canRecordStaffCaseDocuments: authorizations.avecSaisieDocumentsCasiersIntervenant,
    canRecordGuardianCaseDocuments: authorizations.avecSaisieDocumentsCasiersResponsable,
    canRecordClassNotebookAttachments: authorizations.avecSaisiePieceJointeCahierDeTexte,
    canCollectDocsFromStudents: authorizations.collecterDocsAupresDesEleves,
    canCollectDocsFromGuardians: authorizations.collecterDocsAupresDesResponsables,
    isChatRecipient: authorizations.estDestinataireChat,
    canManageDocumentCollection: authorizations.gererLaCollecteDeDocuments,
    canLaunchPPMSAlerts: authorizations.lancerAlertesPPMS,
    canVolunteerForReplacement: authorizations.sePorterVolontaireRemplacement,
    canViewTeacherAbsencesAndReplacements: authorizations.voirAbsencesEtRemplacementsProfs,
    course: {
      canDisplayDetachedStudentsInCourse: authorizations.cours.afficherElevesDetachesDansCours,
      canAccessMaterials: authorizations.cours.avecMateriel,
      canModifyDetachedStudentsOnMovedCourse: authorizations.cours.modifierElevesDetachesSurCoursDeplaceCreneauLibre,
      scheduleViewDomains: authorizations.cours.domaineConsultationEDT
    },
    bursar: {
      canRequestITTasks: authorizations.intendance.avecDemandeTachesInformatique,
      canRequestSecretariatTasks: authorizations.intendance.avecDemandeTachesSecretariat,
      canExecuteITTasks: authorizations.intendance.avecExecutionTachesInformatique,
      canExecuteSecretariatTasks: authorizations.intendance.avecExecutionTachesSecretariat,
      canManageITTasks: authorizations.intendance.avecGestionTachesInformatique,
      onlyMySecretariatTasks: authorizations.intendance.uniquementMesTachesSecretariat
    }
  }
}

  public get levels(): Level[] {
    return this.raw.data.listeNiveaux?.map(l => ({
      label: l.label,
      isTaught: l.estEnseignee ?? false
    }))
  } 

  public get subjects(): Subject[] {
    return this.raw.data.listeMatieres
      .map(s => ({
        label: s.label,
        shortLabel: s.code,
        isTaught: s.estEnseignee,
        isUsed: s.estUtilise ?? false,
        color: s.couleur
      }))
  }

  public get classes(): TeacherClass[] {
    return this.raw.data.listeClasses.map(i => ({
      label: i.label,
      isTaught: i.enseigne ?? false,
      isEndOfCycle: i.estFinDeCycle ?? false,
      isHeadTeacher: i.estPrincipal ?? false,
      level: i.niveau?.label
    }))
  }

  public get profilePicture(): Base64<'png'> | undefined {
    const key = this.ressource.photoBase64;
    const file = key !== undefined ? this.raw.ressources?.fichiers?.[key] : undefined;

    return ["data:image/png;base64", file].join(",") as Base64<'png'>
  }
}
