import type { AdministrateurParametresUtilisateurResponse, ProfesseurAutorisations } from "@/types/responses/user";
import type { AdministrativePermissions, AdministratorPermissions, CommonPermissions, SchoolLifeClass } from "@/types/user";
import { CommonUserSettings } from "@/routes/ParametresUtilisateurs/Common";
import { AssistantUserSettings } from "./Assistant";

export class AdministratorUserSettings extends CommonUserSettings<AdministrateurParametresUtilisateurResponse> {
  public static toPermissions(
    common: CommonPermissions,
    authorizations: ProfesseurAutorisations
  ): AdministrativePermissions {
    return {
      ...common,
      ...AssistantUserSettings.toPermissions(common, authorizations),
      canCommunicateWithAllClasses:          authorizations.AutoriserCommunicationsToutesClasses,
      canUseAdvancedDiscussion:              authorizations.AvecDiscussionAvancee,
      canRecordNews:                         authorizations.AvecSaisieActualite,
      canRecordAgenda:                       authorizations.AvecSaisieAgenda,
      canRecordParentObservations:           authorizations.AvecSaisieObservationsParents,
      canCreateForumTopics:                  authorizations.avecCreationSujetForum,
      canModifyForumAfterPosting:            authorizations.avecModificationForumAPosteriori,
      canPublishToMailingList:               authorizations.avecPublicationListeDiffusion,
      canRecordStaffCaseDocuments:           authorizations.avecSaisieDocumentsCasiersIntervenant,
      canCollectDocsFromStudents:            authorizations.collecterDocsAupresDesEleves,
      canManageDocumentCollection:           authorizations.gererLaCollecteDeDocuments,
      canLaunchPPMSAlerts:                   authorizations.lancerAlertesPPMS,
      canViewTeacherAbsencesAndReplacements: authorizations.voirAbsencesEtRemplacementsProfs,
      bursar:                                {
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

  public get classes(): SchoolLifeClass[] {
    return this.raw.data.listeClasses.map((i) => ({
      kind:          i.G,
      id:            i.id,
      label:         i.label,
      level:         i.niveau?.label,
      isResponsible: i.estResponsable ?? false
    }))
  }
}