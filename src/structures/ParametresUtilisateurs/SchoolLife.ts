import { CommonUserSettings } from "./Common";
import { Response } from "../network/Response";
import type { Session } from "../Session";
import type { Settings } from "../Settings";
import type { ProfesseurAutorisations, VieScolaireParametresUtilisateurResponse } from "../../types/responses/user";
import type { CommonPermissions, SchoolLifeClass, SchoolLifePermissions } from "../../types/user";

export class SchoolLifeUserSettings extends CommonUserSettings<VieScolaireParametresUtilisateurResponse> {
  constructor(
    session: Session,
    raw: Response<VieScolaireParametresUtilisateurResponse>,
    ressource: VieScolaireParametresUtilisateurResponse["ressource"],
    settings: Settings
  ){
    super(session, raw, ressource, settings)
  }

  public static toPermissions(common: CommonPermissions, authorizations: ProfesseurAutorisations) {
    return {
      ...common,
      sizes: {
        ...common.sizes,
        studentHomeworkMaxSize: 0
      },
      canEditPersonalInfoAuthorizations:     authorizations.compte.avecSaisieInfosPersoAutorisations,
      canEditPersonalInfoCoordinates:        authorizations.compte.avecSaisieInfosPersoCoordonnees,
      canChatWithParents:                    authorizations.AvecDiscussionParents,
      canCommunicateWithAllClasses:          authorizations.AutoriserCommunicationsToutesClasses,
      canViewDefaultNotebook:                authorizations.AvecConsultationDefautCarnet,
      canContactSchoolLife:                  authorizations.AvecContactVS,
      canUseAdvancedDiscussion:              authorizations.AvecDiscussionAvancee,
      canRecordAbsence:                      authorizations.AvecSaisieAbsence,
      canRecordNews:                         authorizations.AvecSaisieActualite,
      canRecordAgenda:                       authorizations.AvecSaisieAgenda,
      canRecordAttendanceAndSchoolLife:      authorizations.AvecSaisieAppelEtVS,
      canRecordLessons:                      authorizations.AvecSaisieCours,
      canRecordDefaultNotebook:              authorizations.AvecSaisieDefautCarnet,
      canRecordExclusion:                    authorizations.AvecSaisieExclusion,
      canRecordLatenessReason:               authorizations.AvecSaisieMotifRetard,
      canRecordObservation:                  authorizations.AvecSaisieObservation,
      canRecordParentObservations:           authorizations.AvecSaisieObservationsParents,
      canRecordNurseVisit:                   authorizations.AvecSaisiePassageInfirmerie,
      canRecordPunishment:                   authorizations.AvecSaisiePunition,
      canRecordLateness:                     authorizations.AvecSaisieRetard,
      canRecordOnGrid:                       authorizations.AvecSaisieSurGrille,
      canViewGuardianFiles:                  authorizations.ConsulterFichesResponsables,
      canViewStudentIdentity:                authorizations.ConsulterIdentiteEleve,
      canViewStudentMemos:                   authorizations.ConsulterMemosEleve,
      canViewStudentPhotos:                  authorizations.ConsulterPhotosEleves,
      canRecordMemos:                        authorizations.SaisirMemos,
      canCreateForumTopics:                  authorizations.avecCreationSujetForum,
      canDisconnectMessaging:                authorizations.avecDroitDeconnexionMessagerie,
      canUseInstantMessaging:                authorizations.avecMessageInstantane,
      canModifyForumAfterPosting:            authorizations.avecModificationForumAPosteriori,
      canPublishToMailingList:               authorizations.avecPublicationListeDiffusion,
      canRecordExemption:                    authorizations.avecSaisieDispense,
      canRecordStaffCaseDocuments:           authorizations.avecSaisieDocumentsCasiersIntervenant,
      canCollectDocsFromStudents:            authorizations.collecterDocsAupresDesEleves,
      isChatRecipient:                       authorizations.estDestinataireChat,
      canManageDocumentCollection:           authorizations.gererLaCollecteDeDocuments,
      canLaunchPPMSAlerts:                   authorizations.lancerAlertesPPMS,
      canViewTeacherAbsencesAndReplacements: authorizations.voirAbsencesEtRemplacementsProfs,
      course:                                {
        canDisplayDetachedStudentsInCourse:     authorizations.cours.afficherElevesDetachesDansCours,
        canModifyDetachedStudentsOnMovedCourse: authorizations.cours.modifierElevesDetachesSurCoursDeplaceCreneauLibre,
        scheduleViewDomains:                    authorizations.cours.domaineConsultationEDT
      },
      bursar: {
        canRequestITTasks: authorizations.intendance.avecDemandeTachesInformatique,
        canExecuteITTasks: authorizations.intendance.avecExecutionTachesInformatique
      }
    }
  }

  public override get permissions(): SchoolLifePermissions {
    const common = super.permissions
    const authorizations = this.raw.data.autorisations
    const permissions = SchoolLifeUserSettings.toPermissions(common, authorizations)
    return {
      ...permissions,
      canRecordMealAbsence:                  authorizations.AvecSaisieAbsenceRepas,
      canRecordBoardingSchoolAbsencesOnGrid: authorizations.AvecSaisieAbsencesGrilleAbsencesInternat,
      canRecordAbsencesForAllStudyHalls:     authorizations.AvecSaisieAbsencesToutesPermanences,
      canRecordOnTeacherCallGrid:            authorizations.AvecSaisieSurGrilleAppelProf,
      absenceRecordingDates:                 authorizations.DateSaisieAbsence,
      canRecordStaffCaseDocuments:           authorizations.avecSaisieDocumentsCasiersIntervenant,
      isChatDisabledBySchedule:              authorizations.discussionDesactiveeSelonHoraire,
      chatDisabledByScheduleMessage:         authorizations.messageDiscussionDesactiveeSelonHoraire
    }
  }

  public get classes(): SchoolLifeClass[] {
    return this.raw.data.listeClasses.map((i) => ({
      label:         i.label,
      level:         i.niveau?.label,
      isResponsible: i.estResponsable ?? false
    }))
  }
}
