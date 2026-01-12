import type { AdministrateurParametresUtilisateurResponse, ProfesseurAutorisations } from "../../types/responses/user";
import type { AdministrativePermissions, AdministratorPermissions, CommonPermissions } from "../../types/user";
import type { Session } from "../Session";
import type { Settings } from "../Settings";
import { Response } from "../network/Response";
import { CommonUserSettings } from "./Common";

export class AdministratorUserSettings extends CommonUserSettings<AdministrateurParametresUtilisateurResponse> {
  constructor(
    session: Session,
    raw: Response<AdministrateurParametresUtilisateurResponse>,
    ressource: AdministrateurParametresUtilisateurResponse["ressource"],
    settings: Settings
  ) {
    super(session, raw, ressource, settings)
  }

  public static toPermissions(
    common: CommonPermissions,
    authorizations: ProfesseurAutorisations
  ): AdministrativePermissions {
    return {
      ...common,
      canCommunicateWithAllClasses:          authorizations.AutoriserCommunicationsToutesClasses,
      canUseAdvancedDiscussion:              authorizations.AvecDiscussionAvancee,
      canRecordNews:                         authorizations.AvecSaisieActualite,
      canRecordAgenda:                       authorizations.AvecSaisieAgenda,
      canRecordParentObservations:           authorizations.AvecSaisieObservationsParents,
      canViewGuardianFiles:                  authorizations.ConsulterFichesResponsables,
      canViewStudentIdentity:                authorizations.ConsulterIdentiteEleve,
      canViewStudentPhotos:                  authorizations.ConsulterPhotosEleves,
      canCreateForumTopics:                  authorizations.avecCreationSujetForum,
      canDisconnectMessaging:                authorizations.avecDroitDeconnexionMessagerie,
      canUseInstantMessaging:                authorizations.avecMessageInstantane,
      canModifyForumAfterPosting:            authorizations.avecModificationForumAPosteriori,
      canPublishToMailingList:               authorizations.avecPublicationListeDiffusion,
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
        canRequestITTasks:         authorizations.intendance.avecDemandeTachesInformatique,
        canRequestIntendanceTasks: authorizations.intendance.avecDemandeTravauxIntendance,
        canExecuteITTasks:         authorizations.intendance.avecExecutionTachesInformatique,
        canExecuteIntendanceTasks: authorizations.intendance.avecExecutionTravauxIntendance
      }
    }
  }

  public override get permissions(): AdministratorPermissions {
    const common = super.permissions
    const authorizations = this.raw.data.autorisations
    const schoolLifePermissions = AdministratorUserSettings.toPermissions(common, authorizations)
    return {
      ...schoolLifePermissions,
      canViewAllStudents: authorizations.VoirTousLesEleves
    }
  }
}