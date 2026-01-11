import { CommonUserSettings } from "./Common";
import { Response } from "../network/Response";
import type { Session } from "../Session";
import type { Settings } from "../Settings";
import type { Base64, Level, Subject, TeacherClass, TeacherPermissions } from "../../types/user";
import type { ProfesseurParametresUtilisateurResponse } from "../../types/responses/user";
import { SchoolLifeUserSettings } from "./SchoolLife";

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
    const permissions = SchoolLifeUserSettings.toPermissions(common, authorizations)
    return {
      ...permissions,
      canDiscussWithStudents: authorizations.AvecDiscussionEleves,
      canPublishPunishments: authorizations.AvecPublicationPunitions,
      canRecordCertificates: authorizations.avecSaisieDispense,
      canRecordHomework: authorizations.AvecSaisieDevoirs,
      canRecordEncouragements: authorizations.AvecSaisieEncouragements,
      canRecordOutOfClass: authorizations.AvecSaisieHorsCours,
      canRecordIndividualProject: authorizations.AvecSaisieProjetIndividuel,
      canPrintReportCardAndCertificate: authorizations.autoriserImpressionBulletinReleveBrevet,
      canAccessStudentDocumentList: authorizations.avecAccesALaListeDesDocumentEleve,
      canAccessTeacherReplacements: authorizations.avecAccesRemplacementsProfs,
      canAccessOldAttendanceSheets: authorizations.avecAnciennesFeuilleDAppel,
      canPublishToSchoolPage: authorizations.avecPublicationPageEtablissement,
      canRecordClassNotebook: authorizations.avecSaisieCahierDeTexte,
      canRecordGuardianCaseDocuments: authorizations.avecSaisieDocumentsCasiersResponsable,
      canRecordClassNotebookAttachments: authorizations.avecSaisiePieceJointeCahierDeTexte,
      canCollectDocsFromGuardians: authorizations.collecterDocsAupresDesResponsables,
      canVolunteerForReplacement: authorizations.sePorterVolontaireRemplacement,
      course: {
        ...permissions.course,
        canAccessMaterials: authorizations.cours.avecMateriel
      },
      bursar: {
        ...permissions.bursar,
        canRequestSecretariatTasks: authorizations.intendance.avecDemandeTachesSecretariat,
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
